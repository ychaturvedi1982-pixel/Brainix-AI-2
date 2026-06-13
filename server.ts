import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiInstance: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for sending base64 images
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Chat API route (with SSE streaming)
  app.post("/api/chat", async (req, res) => {
    let modelName = "gemini-3.5-flash";
    try {
      const { messages, model, systemInstruction, temperature, searchGrounding } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Missing or invalid 'messages' array in request body." });
        return;
      }

      modelName = model || "gemini-3.5-flash";
      const ai = getAIClient();

      // Formulate content messages for the Gemini API
      // Supported roles inside @google/genai: 'user' and 'model'
      const contents = messages.map((msg: any) => {
        const parts: any[] = [];
        
        // Add content text
        if (msg.text) {
          parts.push({ text: msg.text });
        }
        
        // Add attached/embedded image if any (multimodal)
        if (msg.image && msg.image.data && msg.image.mimeType) {
          parts.push({
            inlineData: {
              mimeType: msg.image.mimeType,
              data: msg.image.data // Assume pure base64 data (stripped of prefix)
            }
          });
        }

        return {
          role: msg.role === "assistant" ? "model" : "user",
          parts
        };
      });

      // Stream response config
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Build config object; enable Google Search grounding dynamically to conserve tight search API quota limits
      const config: any = {};
      
      const lastMessageText = messages && messages.length > 0 ? messages[messages.length - 1].text : "";
      const needsSearch = 
        !!searchGrounding ||
        String(lastMessageText).toLowerCase().match(/(weather|forecast|temperature|temp|climate|rain|wind|live|current|search|google|news|today|latest|coordinates|lucknow|delhi|mumbai|jaipur|varanasi)/gi) ||
        String(systemInstruction).toLowerCase().includes("weather") ||
        String(systemInstruction).toLowerCase().includes("search");

      if (needsSearch) {
        config.tools = [{ googleSearch: {} }];
      }
      
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      if (temperature !== undefined) {
        config.temperature = Number(temperature);
      }

      let responseStream;
      let finalConfig = { ...config };
      let finalModel = modelName;
      let attempts = 0;
      let streamSuccess = false;

      while (attempts < 4 && !streamSuccess) {
        attempts++;
        try {
          responseStream = await ai.models.generateContentStream({
            model: finalModel,
            contents,
            config: finalConfig,
          });
          streamSuccess = true;
        } catch (err: any) {
          console.warn(`[Resilience] Content stream attempt ${attempts} failed:`, err.message || err);
          
          const isQuota = String(err.message || "").toLowerCase().includes("quota") || 
                          String(err.message || "").toLowerCase().includes("limit") || 
                          String(err.message || "").toLowerCase().includes("exhausted") ||
                          err.code === 429 || err.status === 429;
          
          if (isQuota) {
            // Step 1: If we used search grounding, retry without search grounding first
            if (finalConfig.tools && finalConfig.tools.length > 0) {
              console.log("[Resilience] Quota limit reached on search grounding. Disabling search grounding and retrying in 400ms...");
              delete finalConfig.tools;
              await new Promise((resolve) => setTimeout(resolve, 400));
              continue;
            }
            
            // Step 2: If we didn't use search grounding but we're on a rate-limited model, switch to robust Gemini-3.5-Flash
            if (finalModel !== "gemini-3.5-flash" && finalModel !== "gemini-3.1-flash-lite") {
              console.log(`[Resilience] Quota limit reached on model ${finalModel}. Switching to robust gemini-3.5-flash fallback query...`);
              finalModel = "gemini-3.5-flash";
              await new Promise((resolve) => setTimeout(resolve, 600));
              continue;
            }

            // Step 3: If we are on gemini-3.5-flash, fallback to gemini-3.1-flash-lite, which has extremely relaxed rate limits
            if (finalModel === "gemini-3.5-flash") {
              console.log("[Resilience] Quota limit reached on gemini-3.5-flash. Falling back to lightweight gemini-3.1-flash-lite for instant response...");
              finalModel = "gemini-3.1-flash-lite";
              await new Promise((resolve) => setTimeout(resolve, 800));
              continue;
            }
          }
          
          // For other transient errors, or if we have general retries left, wait a little bit and retry
          if (attempts < 4) {
            console.log(`[Resilience] Attempt ${attempts} failed. Waiting 1.2s before retry...`);
            await new Promise((resolve) => setTimeout(resolve, 1200));
            continue;
          }
          
          // Re-throw if all attempts/fallbacks were exhausted
          throw err;
        }
      }

      if (responseStream) {
        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();

    } catch (err: any) {
      console.error("Gemini stream error:", err);

      let apiErrorCode = err.code || err.status || 500;
      let apiErrorMessage = err.message || "An error occurred during generation.";

      // Try to parse stringified JSON in error message (common with @google/genai ApiError)
      if (typeof apiErrorMessage === "string") {
        try {
          if (apiErrorMessage.includes('{"error"')) {
            const startIdx = apiErrorMessage.indexOf('{"error"');
            const endIdx = apiErrorMessage.lastIndexOf('}') + 1;
            const jsonSubstring = apiErrorMessage.slice(startIdx, endIdx);
            const parsedNested = JSON.parse(jsonSubstring);
            if (parsedNested.error) {
              if (parsedNested.error.message) {
                let nestedMsg = parsedNested.error.message;
                if (typeof nestedMsg === "string" && nestedMsg.includes('{"error"')) {
                  try {
                    const deeperNested = JSON.parse(nestedMsg);
                    if (deeperNested.error && deeperNested.error.message) {
                      nestedMsg = deeperNested.error.message;
                    }
                  } catch {}
                }
                apiErrorMessage = nestedMsg;
              }
              if (parsedNested.error.code) {
                apiErrorCode = parsedNested.error.code;
              }
            }
          }
        } catch (e) {
          console.error("Error decoding nested error:", e);
        }
      }

      // If headers are already sent, end with an error message in SSE format
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: apiErrorMessage, code: apiErrorCode, model: modelName })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: apiErrorMessage, code: apiErrorCode, model: modelName });
      }
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Express backend:", err);
  process.exit(1);
});
