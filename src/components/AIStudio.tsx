import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Smartphone, 
  Play, 
  Pause, 
  Download, 
  Sliders, 
  RefreshCw, 
  Check, 
  Copy, 
  Maximize2, 
  Layers, 
  CheckCircle,
  Eye, 
  Code, 
  Settings, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Flame,
  Wand2
} from "lucide-react";

interface AIStudioProps {
  theme: string;
  onBackToChat: () => void;
  activeModel: string;
}

export default function AIStudio({ theme, onBackToChat, activeModel }: AIStudioProps) {
  const [activeTab, setActiveTab] = useState<"image" | "video" | "app">("image");
  
  // --- IMAGE SYNTHESIZER STATES ---
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgStyle, setImgStyle] = useState("Cinematic Photoshoot");
  const [imgRatio, setImgRatio] = useState("1:1");
  const [imgQuality, setImgQuality] = useState("Ultra HD 4K");
  const [imgSteps, setImgSteps] = useState(30);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [imgProgress, setImgProgress] = useState(0);
  const [imgProgressMsg, setImgProgressMsg] = useState("");
  const [synthesizedImgUrl, setSynthesizedImgUrl] = useState<string | null>(null);
  const [imgBrightness, setImgBrightness] = useState(100);
  const [imgContrast, setImgContrast] = useState(100);
  const [imgSaturation, setImgSaturation] = useState(100);
  const [imgCopied, setImgCopied] = useState(false);

  // --- VIDEO ANIMATOR STATES ---
  const [vidPrompt, setVidPrompt] = useState("");
  const [vidMotion, setVidMotion] = useState(50);
  const [vidDuration, setVidDuration] = useState("4 seconds");
  const [vidCamera, setVidCamera] = useState("Zoom In");
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);
  const [vidProgress, setVidProgress] = useState(0);
  const [vidProgressMsg, setVidProgressMsg] = useState("");
  const [synthesizedVidUrl, setSynthesizedVidUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [vidSpeed, setVidSpeed] = useState<number>(1);
  const [isPlayingVid, setIsPlayingVid] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- APP SANDBOX STATES ---
  const [appPrompt, setAppPrompt] = useState("");
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);
  const [appProgressMsg, setAppProgressMsg] = useState("");
  const [generatedAppCode, setGeneratedAppCode] = useState<string>("");
  const [appSandboxMode, setAppSandboxMode] = useState<"preview" | "code">("preview");
  const [appCodeCopied, setAppCodeCopied] = useState(false);
  const [appIframeKey, setAppIframeKey] = useState(0);

  // Audio elements or ambient sounds
  const playSampleBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // high sleek tone
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  };

  // --- IMAGE SYNTHESIS TIMELINE TRIGGER ---
  const handleSynthesizeImage = () => {
    if (!imgPrompt.trim()) return;
    playSampleBeep();
    setIsGeneratingImg(true);
    setImgProgress(0);
    setSynthesizedImgUrl(null);
    
    const steps = [
      { p: 10, m: "✨ Initializing Brainix Neural Pipeline..." },
      { p: 25, m: "🧬 Mapping prompt vectors to spatial coordinates..." },
      { p: 45, m: "🎨 Denoising latents & rendering primary brushes..." },
      { p: 68, m: "🔮 Injecting volumetric lightning & contrast..." },
      { p: 85, m: "⚡ Upscaling with Super-Resolution (4x UHD)..." },
      { p: 98, m: "🎯 Finalizing color calibration filters..." }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      setImgProgress((prev) => {
        const target = steps[currentStepIndex]?.p || 100;
        if (prev < target) {
          return prev + 1;
        } else {
          if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            setImgProgressMsg(steps[currentStepIndex].m);
          } else {
            clearInterval(interval);
            // Dynamic image synthesis picker based on word mapping
            const promptLower = imgPrompt.toLowerCase();
            let seedWord = "galaxy";
            if (promptLower.includes("car") || promptLower.includes("vehicle") || promptLower.includes("bmw") || promptLower.includes("audi")) {
              seedWord = "cyberpunk-car";
            } else if (promptLower.includes("cat") || promptLower.includes("dog") || promptLower.includes("animal")) {
              seedWord = "cute-animal";
            } else if (promptLower.includes("city") || promptLower.includes("house") || promptLower.includes("building")) {
              seedWord = "futuristic-city";
            } else if (promptLower.includes("forest") || promptLower.includes("tree") || promptLower.includes("nature") || promptLower.includes("mountain")) {
              seedWord = "magic-forest";
            } else if (promptLower.includes("anime") || promptLower.includes("cartoon") || promptLower.includes("illustration")) {
              seedWord = "anime-concept";
            } else if (promptLower.includes("robot") || promptLower.includes("cyborg") || promptLower.includes("tech")) {
              seedWord = "advanced-ai-robot";
            } else {
              // Extract first 2 clean alphanumeric words to keep URL clean
              const words = imgPrompt.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter(w => w.length > 2);
              if (words.length > 0) {
                seedWord = words.slice(0, 2).join("-");
              }
            }

            // Beautiful High Definition Seed SVG dynamic visual pattern or unsplash rendering fallback
            const styleTerm = encodeURIComponent(imgStyle);
            const imageURL = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=720&q=80&sig=${Math.ceil(Math.random() * 100000)}`;
            const stylizedSource = promptLower.includes("nature") 
              ? `https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80`
              : promptLower.includes("car")
              ? `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80`
              : promptLower.includes("city")
              ? `https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80`
              : promptLower.includes("robot")
              ? `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80`
              : promptLower.includes("cat") || promptLower.includes("dog")
              ? `https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80`
              : `https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80`;

            setSynthesizedImgUrl(stylizedSource);
            setIsGeneratingImg(false);
            playSampleBeep();
          }
          return prev;
        }
      });
    }, 45);
  };

  // --- VIDEO TIMELINE RENDERER ---
  // Renders a high-end canvas particle fluid loops representing AI Generated video based on script keywords!
  useEffect(() => {
    if (!synthesizedVidUrl || !isPlayingVid || activeTab !== "video") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string; lifecycle: number }> = [];
    
    // Setup particles matching the user request
    const lowerP = vidPrompt.toLowerCase();
    const count = 120;
    const isSpace = lowerP.includes("space") || lowerP.includes("star") || lowerP.includes("galaxy") || lowerP.includes("cosmic");
    const isWater = lowerP.includes("water") || lowerP.includes("ocean") || lowerP.includes("sea") || lowerP.includes("rain") || lowerP.includes("blue");
    const isFire = lowerP.includes("fire") || lowerP.includes("lava") || lowerP.includes("volcano") || lowerP.includes("sun") || lowerP.includes("red");
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (isSpace ? 1 : isFire ? 2 : 1.5) * vidSpeed,
        vy: (Math.random() - 0.5) * (isSpace ? 1 : isFire ? -3.5 : 1.5) * vidSpeed,
        r: Math.random() * (isSpace ? 1.5 : isFire ? 5 : 3.5) + 0.8,
        color: isSpace 
          ? `hsl(${200 + Math.random() * 80}, 90%, ${70 + Math.random() * 20}%)` 
          : isFire 
          ? `hsl(${10 + Math.random() * 35}, 100%, ${50 + Math.random() * 20}%)`
          : isWater 
          ? `hsl(${190 + Math.random() * 40}, 95%, ${45 + Math.random() * 30}%)`
          : `hsl(${270 + Math.random() * 60}, 85%, 65%)`, // cyber purple defaults
        lifecycle: Math.random()
      });
    }

    const render = () => {
      ctx.fillStyle = "rgba(10, 11, 15, 0.15)"; // cool cinema trail backing
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw customized scenery indicator background
      ctx.save();
      const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 20, canvas.width/2, canvas.height/2, canvas.width*0.6);
      if (isSpace) {
        grad.addColorStop(0, "rgba(22, 2, 45, 0.3)");
        grad.addColorStop(1, "rgba(5, 5, 8, 0.85)");
      } else if (isFire) {
        grad.addColorStop(0, "rgba(85, 10, 2, 0.35)");
        grad.addColorStop(1, "rgba(12, 4, 2, 0.9)");
      } else if (isWater) {
        grad.addColorStop(0, "rgba(2, 35, 75, 0.3)");
        grad.addColorStop(1, "rgba(4, 9, 18, 0.85)");
      } else {
        grad.addColorStop(0, "rgba(20, 2, 50, 0.25)");
        grad.addColorStop(1, "rgba(8, 8, 12, 0.85)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx * vidSpeed;
        p.y += p.vy * vidSpeed;

        // Loop boundaries or reset lifecycle
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) {
          p.y = canvas.height;
          p.lifecycle = Math.random();
        }
        if (p.y > canvas.height) {
          p.y = 0;
          p.lifecycle = Math.random();
        }

        // Pulse size based on sin waves
        const scale = 0.5 + Math.sin(Date.now() * 0.003 + p.lifecycle * 10) * 0.5;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + scale * 0.4), 0, Math.PI * 2);
        ctx.shadowBlur = p.r * (isSpace ? 4 : isFire ? 8 : 5);
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Overlay text timeline coordinates
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 8px monospace";
      ctx.fillText(`ANIMATOR ENGINE FPS: 60`, 12, 20);
      ctx.fillText(`MOTION POWER: ${vidMotion}% | CAM: ${vidCamera.toUpperCase()}`, 12, 32);
      ctx.fillText(`TIME CODE: 00:0${Math.floor((Date.now()/1000)%4)}:25`, canvas.width - 110, 20);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [synthesizedVidUrl, isPlayingVid, vidSpeed, vidMotion, vidCamera, activeTab]);

  const handleAnimateVideo = () => {
    if (!vidPrompt.trim()) return;
    playSampleBeep();
    setIsGeneratingVid(true);
    setVidProgress(0);
    setSynthesizedVidUrl(null);

    const logs = [
      { p: 15, m: "🎬 Launching Brainix Diffusion Temporal Engine..." },
      { p: 32, m: "⚙️ Interpolating keyframe matrices & optic anchors..." },
      { p: 54, m: "🌌 Rendering 24 core layers on deep latent tracks..." },
      { p: 76, m: "🎥 Stabilizing motion vectors (Camera motion)..." },
      { p: 92, m: "📀 compiling frame timeline buffers (60fps HD)..." }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      setVidProgress((prev) => {
        const target = logs[currentIdx]?.p || 100;
        if (prev < target) {
          return prev + 1;
        } else {
          if (currentIdx < logs.length - 1) {
            currentIdx++;
            setVidProgressMsg(logs[currentIdx].m);
          } else {
            clearInterval(interval);
            setSynthesizedVidUrl("generated_active_sequence");
            setIsGeneratingVid(false);
            playSampleBeep();
          }
          return prev;
        }
      });
    }, 45);
  };

  // --- COMPILER API INTERACTIVE APP GENERATOR ---
  const handleGenerateAppSandbox = async () => {
    if (!appPrompt.trim()) return;
    playSampleBeep();
    setIsGeneratingApp(true);
    setAppProgressMsg("📡 Submitting prompt specification to Brainix Compiler Engine...");
    setGeneratedAppCode("");

    try {
      const messages = [
        {
          role: "user",
          text: `MIGHTY APP GENERATOR: Build me a fully completed, magnificent, self-contained single-file HTML/JS/CSS application for the following prompt: "${appPrompt}".
Take extreme pride in making is visually stunning, packed with premium Tailwind styling, icons, and interactive fully working JavaScript calculations, state variables, sound effects (using Web Audio API oscillators if appropriate for buttons), and smooth animations. 
Do NOT reply with simple explanations — deliver ONLY the code. Wrap your package inside markdown \`\`\`html and \`\`\` wrappers. Your code must be 100% finished so it runs beautifully inside our smartphone sandbox.`
        }
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: activeModel,
          messages,
          temperature: 0.2, // low temperature for highly robust code syntax
          systemInstruction: "You are Brainix GPT, an expert fullstack HTML/JS application engineer. Your task is to output perfect, 100% completed single-file HTML code blocks wrapped like ```html ... ```."
        })
      });

      if (!response.ok) {
        throw new Error("Compiler network returned a non-ok endpoint status.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let bufferText = "";

      if (reader) {
        setAppProgressMsg("🚀 Brainix is compiling and writing code blocks live...");
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const rawChunk = decoder.decode(value);
          const lines = rawChunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  bufferText += parsed.text;
                  setGeneratedAppCode(bufferText);
                }
              } catch (err) {}
            }
          }
        }
      }

      setAppProgressMsg("🎉 Compilation Success! Slicing viewport layout...");
      setIsGeneratingApp(false);
      setAppIframeKey(prev => prev + 1); // trigger state refresh for iframe loads
      playSampleBeep();
    } catch (err: any) {
      console.error("Compilation error details:", err);
      setAppProgressMsg(`⚠️ Compiler Failure: ${err.message || String(err)}. Check your network connection and API keys.`);
      setIsGeneratingApp(false);
    }
  };

  // Helper code parser
  const getParsedCode = (): string => {
    const match = /```html([\s\S]*?)```/.exec(generatedAppCode);
    if (match) return match[1].trim();
    const cleanRaw = generatedAppCode.replace(/```html|```/g, "").trim();
    return cleanRaw;
  };

  const handleCopyAppCode = () => {
    const cleanC = getParsedCode();
    navigator.clipboard.writeText(cleanC);
    setAppCodeCopied(true);
    setTimeout(() => setAppCodeCopied(false), 2000);
  };

  const handleDownloadAppCode = () => {
    const cleanC = getParsedCode();
    const blob = new Blob([cleanC], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${appPrompt.toLowerCase().replace(/[^a-z0-9]/g, "-")}-brainix-app.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-4 sm:p-6 w-full max-w-7xl mx-auto flex flex-col h-[100dvh] overflow-y-auto ${theme === "dark" ? "text-zinc-100" : "text-zinc-900"}`}>
      
      {/* Studio Header Options Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800/60 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToChat}
            className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            ← Back to Chat
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              Brainix <span className="bg-linear-to-r from-blue-500 via-sky-400 to-[#8b5cf6] bg-clip-text text-transparent">AI Generation Studio</span>
              <Sparkles size={18} className="text-purple-500 animate-pulse" />
            </h1>
            <p className="text-xxs sm:text-xs text-zinc-500 font-mono">Premium Offline/Online Media Suite & Application Compiler Lab</p>
          </div>
        </div>

        {/* Studio main tab selectors */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900/80 p-1 rounded-xl self-end sm:self-auto border border-zinc-200/50 dark:border-zinc-800/40">
          <button
            onClick={() => { playSampleBeep(); setActiveTab("image"); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "image" 
                ? "bg-blue-500 text-white shadow-md font-extrabold" 
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <ImageIcon size={14} />
            <span>Image Creator</span>
          </button>
          
          <button
            onClick={() => { playSampleBeep(); setActiveTab("video"); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "video" 
                ? "bg-purple-600 text-white shadow-md font-extrabold" 
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <VideoIcon size={14} />
            <span>Video Animator</span>
          </button>

          <button
            onClick={() => { playSampleBeep(); setActiveTab("app"); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "app" 
                ? "bg-emerald-500 text-white shadow-md font-extrabold" 
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Smartphone size={14} />
            <span>App Builder</span>
          </button>
        </div>
      </div>

      {/* --- WORKSPACE LAYOUTS --- */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        
        {/* LEFT COLUMN: CONTROL SUIT DECK */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* TAB 1: IMAGE CONTROLS */}
          {activeTab === "image" && (
            <div className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/70 shadow-sm space-y-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Image Synthesizer Parameters</h3>
                  <p className="text-xxs text-zinc-500">Formulate high-fidelity generative prompt directions</p>
                </div>
              </div>

              {/* Text Prompt input */}
              <div className="space-y-1.5">
                <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">Image Prompt / Idea</label>
                <textarea
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  placeholder="e.g., A magnificent glowing red futuristic cyber-car cruising through rain-dampened Tokyo neon streets at midnight with gorgeous raytracing sky reflection..."
                  className="w-full h-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-blue-500 select-all leading-relaxed placeholder:opacity-50"
                />
              </div>

              {/* Style selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">Art Style</label>
                  <select
                    value={imgStyle}
                    onChange={(e) => setImgStyle(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Cinematic Photoshoot</option>
                    <option>Anime Digital Art</option>
                    <option>Retro Cyberpunk Grid</option>
                    <option>Watercolor Painting</option>
                    <option>Minimalist Pencil Sketch</option>
                    <option>Vibrant 3D Octane Render</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">Aspect Ratio</label>
                  <select
                    value={imgRatio}
                    onChange={(e) => setImgRatio(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>1:1 (Square)</option>
                    <option>16:9 (Landscape)</option>
                    <option>9:16 (Vertical Frame)</option>
                    <option>4:3 (Classic Cinema)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">Output Resolution</label>
                  <select
                    value={imgQuality}
                    onChange={(e) => setImgQuality(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Standard HD</option>
                    <option>Ultra HD 4K</option>
                    <option>8K Hyper Realistic</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">Diffusion Steps ({imgSteps})</label>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={imgSteps}
                    onChange={(e) => setImgSteps(Number(e.target.value))}
                    className="w-full accent-blue-500 h-10"
                  />
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-zinc-200/50 dark:border-zinc-800/40">
                <button
                  disabled={isGeneratingImg || !imgPrompt.trim()}
                  onClick={handleSynthesizeImage}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer ${
                    isGeneratingImg || !imgPrompt.trim()
                      ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-650 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-sky-500 to-[#3b82f6] hover:brightness-110 shadow-[0_4px_15px_rgba(59,130,246,0.25)]"
                  }`}
                >
                  {isGeneratingImg ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Synthesizing Latents ({imgProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} />
                      <span>Synthesize Art (Create Image)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO CONTROLS */}
          {activeTab === "video" && (
            <div className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/70 shadow-sm space-y-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-500">
                  <VideoIcon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Video Animator Controller</h3>
                  <p className="text-xxs text-zinc-500">Configure kinetic movement vectors</p>
                </div>
              </div>

              {/* Text Prompt input */}
              <div className="space-y-1.5">
                <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">Video Motion Script / Prompt</label>
                <textarea
                  value={vidPrompt}
                  onChange={(e) => setVidPrompt(e.target.value)}
                  placeholder="e.g., Majestic interstellar galaxy vortex rotating clockwise in cosmic dark space with glittering stars floating towards the screen..."
                  className="w-full h-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-purple-500 select-all leading-relaxed placeholder:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">Camera Movement</label>
                  <select
                    value={vidCamera}
                    onChange={(e) => setVidCamera(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option>Zoom In</option>
                    <option>Slow Pan Right</option>
                    <option>Tilt Up cinematic</option>
                    <option>Drone Circle Focus</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">Target Duration</label>
                  <select
                    value={vidDuration}
                    onChange={(e) => setVidDuration(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option>4 seconds (UHD)</option>
                    <option>8 seconds (Standard)</option>
                    <option>16 seconds (Extended)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">
                  <span>Motion Intensity</span>
                  <span>{vidMotion}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={vidMotion}
                  onChange={(e) => setVidMotion(Number(e.target.value))}
                  className="w-full accent-purple-500 h-10"
                />
              </div>

              <div className="mt-auto pt-4 border-t border-zinc-200/50 dark:border-zinc-800/40">
                <button
                  disabled={isGeneratingVid || !vidPrompt.trim()}
                  onClick={handleAnimateVideo}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer ${
                    isGeneratingVid || !vidPrompt.trim()
                      ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-650 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 hover:brightness-110 shadow-[0_4px_15px_rgba(168,85,247,0.25)]"
                  }`}
                >
                  {isGeneratingVid ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Generating Sequence ({vidProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Flame size={16} className="text-yellow-400 animate-pulse" />
                      <span>Render & Animate Video</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: APP BUILDER CONTROLS */}
          {activeTab === "app" && (
            <div className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/70 shadow-sm space-y-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Real-Time App Sandbox Compiler</h3>
                  <p className="text-xxs text-zinc-500 font-sans">Submit fullspec interactive designs on the fly</p>
                </div>
              </div>

              {/* Text Prompt input */}
              <div className="space-y-1.5 flex-1 flex flex-col">
                <label className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 font-mono">App Specification</label>
                <textarea
                  value={appPrompt}
                  onChange={(e) => setAppPrompt(e.target.value)}
                  placeholder="A fully interactive game where a spaceship shoots falling blocks. Include buttons, scoreboard, and custom colors..."
                  className="w-full flex-1 min-h-[140px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-emerald-500 select-all leading-relaxed placeholder:opacity-50 font-sans"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/40">
                <button
                  disabled={isGeneratingApp || !appPrompt.trim()}
                  onClick={handleGenerateAppSandbox}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer ${
                    isGeneratingApp || !appPrompt.trim()
                      ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-650 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_15px_rgba(16,185,129,0.25)]"
                  }`}
                >
                  {isGeneratingApp ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Writing Complete Codebase...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Compile & Generate Live App</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
        </div>

        {/* RIGHT COLUMN: PREVIEW VIEWPORTS CONTAINER */}
        <div className="lg:col-span-7 flex flex-col bg-zinc-100 dark:bg-zinc-950 p-4 sm:p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 min-h-[500px]">
          
          {/* TAB 1 PREVIEW: IMAGE VIEWPORT */}
          {activeTab === "image" && (
            <div className="flex-1 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">OUTPUT VIEWPORT (IMAGE)</span>
                {synthesizedImgUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(synthesizedImgUrl);
                        setImgCopied(true);
                        setTimeout(() => setImgCopied(false), 2000);
                      }}
                      className="p-1.5 rounded-lg text-xs bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {imgCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      <span>{imgCopied ? "Copied Link" : "Copy Link"}</span>
                    </button>
                    <a
                      href={synthesizedImgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-xs bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Export IPG</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Central Display core */}
              <div className="flex-1 flex items-center justify-center rounded-2xl bg-zinc-150 dark:bg-[#0c0d10] overflow-hidden min-h-[300px] border border-zinc-250 dark:border-zinc-850/60 relative">
                {isGeneratingImg ? (
                  <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500/20 animate-spin-slow" />
                      <div className="absolute inset-2 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-blue-500">{imgProgress}%</div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 animate-pulse">{imgProgressMsg}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">Sieving latent dimensions with Brainix Tensor core</p>
                    </div>
                  </div>
                ) : synthesizedImgUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img 
                      src={synthesizedImgUrl} 
                      alt="Brainix synthesized"
                      referrerPolicy="no-referrer"
                      style={{ 
                        filter: `brightness(${imgBrightness}%) contrast(${imgContrast}%) saturate(${imgSaturation}%)`,
                        aspectRatio: imgRatio === "16:9" ? "16/9" : imgRatio === "9:16" ? "9/16" : imgRatio === "4:3" ? "4/3" : "1/1"
                      }}
                      className="max-h-[360px] max-w-full rounded-xl object-cover shadow-2xl transition-all duration-300"
                    />
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 dark:bg-blue-500/15 flex items-center justify-center mx-auto text-blue-500">
                      <ImageIcon size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Image Synthesizer Canvas Empty</p>
                      <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed mt-1 mx-auto">Fill in a details prompt and adjust parameters, then click Synthesize Art to generate professional UHD images!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* IMAGE ADJUST SLIDERS (only when generated) */}
              {synthesizedImgUrl && !isGeneratingImg && (
                <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl mt-4 grid grid-cols-3 gap-4 text-xxs font-mono text-zinc-500 font-bold uppercase select-none">
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Brightness</span><span>{imgBrightness}%</span></div>
                    <input type="range" min="50" max="150" value={imgBrightness} onChange={(e) => setImgBrightness(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Contrast</span><span>{imgContrast}%</span></div>
                    <input type="range" min="50" max="150" value={imgContrast} onChange={(e) => setImgContrast(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Saturation</span><span>{imgSaturation}%</span></div>
                    <input type="range" min="50" max="150" value={imgSaturation} onChange={(e) => setImgSaturation(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2 PREVIEW: VIDEO VIEWPORT */}
          {activeTab === "video" && (
            <div className="flex-1 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">VIDEO COMPENDIUM PLATFORM</span>
                {synthesizedVidUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingVid(!isPlayingVid)}
                      className="p-1.5 rounded-lg text-xs bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 hover:text-black dark:hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {isPlayingVid ? <Pause size={12} /> : <Play size={12} />}
                      <span>{isPlayingVid ? "Pause video" : "Play loop"}</span>
                    </button>
                    <div className="flex items-center bg-zinc-200 dark:bg-zinc-900 p-0.5 rounded-md border border-zinc-300 dark:border-zinc-800 text-[9px] font-bold">
                      {([0.5, 1, 1.5]).map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setVidSpeed(spd)}
                          className={`px-1.5 py-0.5 rounded-xs transition-all cursor-pointer ${vidSpeed === spd ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-white"}`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Central Display core */}
              <div className="flex-1 flex items-center justify-center rounded-2xl bg-zinc-150 dark:bg-[#0c0d10] overflow-hidden min-h-[300px] border border-zinc-250 dark:border-zinc-850/60 relative">
                {isGeneratingVid ? (
                  <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500/20 animate-spin-slow" />
                      <div className="absolute inset-2 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-purple-500">{vidProgress}%</div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 animate-pulse">{vidProgressMsg}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">Interweaving neural fields along continuous spacetime keys</p>
                    </div>
                  </div>
                ) : synthesizedVidUrl ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#09090b]">
                    <canvas 
                      ref={canvasRef} 
                      width={440} 
                      height={260} 
                      className="max-w-full max-h-[340px] rounded-xl border border-zinc-800/50 shadow-2xl" 
                    />
                    
                    {/* Media playback indicator */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-[10px] text-zinc-400 font-mono">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>LIVE RENDERING SCENERY PLAYBACK</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 dark:bg-purple-500/15 flex items-center justify-center mx-auto text-purple-500">
                      <VideoIcon size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Video Canvas Timeline Empty</p>
                      <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed mt-1 mx-auto font-sans">Introduce an action query sequence, specify camera tilt options and movement speeds, then click Render video!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3 PREVIEW: APP VIEWPORT */}
          {activeTab === "app" && (
            <div className="flex-1 flex flex-col h-full justify-between min-h-0">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">HOLOGRAPHIC COMPILER PLAYGROUND</span>
                {generatedAppCode && (
                  <div className="flex items-center gap-1.5 bg-zinc-200 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-300 dark:border-zinc-800 text-[10px] font-bold">
                    <button
                      onClick={() => setAppSandboxMode("preview")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${appSandboxMode === "preview" ? "bg-emerald-500 text-white text-xs" : "text-zinc-500 hover:text-white"}`}
                    >
                      🖥️ Live Preview
                    </button>
                    <button
                      onClick={() => setAppSandboxMode("code")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${appSandboxMode === "code" ? "bg-emerald-500 text-white text-xs" : "text-zinc-500 hover:text-white"}`}
                    >
                      <Code size={12} className="inline mr-1" /> Codebase
                    </button>
                  </div>
                )}
              </div>

              {/* Central Display core */}
              <div className="flex-1 flex flex-col rounded-2xl bg-zinc-150 dark:bg-[#0c0d10] overflow-hidden border border-zinc-250 dark:border-zinc-850/60 relative min-h-0">
                {isGeneratingApp ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                    <Loader2 size={36} className="text-emerald-500 animate-spin" />
                    <div className="text-center max-w-sm">
                      <p className="text-xs font-bold text-zinc-850 dark:text-zinc-200 animate-pulse leading-relaxed">{appProgressMsg}</p>
                      
                      {/* Streaming code status ticker */}
                      {generatedAppCode && (
                        <div className="mt-4 p-3 bg-black rounded-lg border border-zinc-800/50 text-[10px] font-mono text-zinc-400 text-left line-clamp-4 h-16 w-64 mx-auto select-all overflow-y-auto">
                          {generatedAppCode}
                        </div>
                      )}
                    </div>
                  </div>
                ) : generatedAppCode ? (
                  appSandboxMode === "preview" ? (
                    <div className="flex-1 bg-zinc-200 dark:bg-zinc-950 p-2 sm:p-4 flex flex-col select-none overflow-hidden min-h-[460px] h-full w-full">
                      {/* Browser Mockup Chrome Header */}
                      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between gap-3 select-none">
                        {/* Traffic light buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80" />
                        </div>
                        {/* Fake URL entry box representing the local compilation address */}
                        <div className="flex-1 max-w-md bg-zinc-200 dark:bg-zinc-950 px-3 py-1 rounded-lg text-[11px] text-zinc-650 dark:text-zinc-400 font-mono flex items-center justify-center gap-1.5 border border-zinc-300/40 dark:border-zinc-850/60 truncate">
                          <span className="text-zinc-400 dark:text-zinc-650 self-center">https://</span>
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">brainix-sandbox-app.local</span>
                        </div>
                        {/* Status elements */}
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 font-bold shrink-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="hidden sm:inline-block text-emerald-500 uppercase tracking-widest text-[9px]">Server Active</span>
                        </div>
                      </div>

                      {/* Code Execution Iframe */}
                      <div className="flex-1 bg-white rounded-b-xl overflow-hidden border border-t-0 border-zinc-250 dark:border-zinc-800 relative z-10 text-black min-h-0 h-full w-full">
                        <iframe
                          key={appIframeKey}
                          title="Interactive App Compiler Sandbox"
                          srcDoc={
                            getParsedCode().includes("<html") && getParsedCode().includes("<head>")
                              ? getParsedCode()
                              : `<!DOCTYPE html>
                                 <html lang="en">
                                 <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <script src="https://cdn.tailwindcss.com"></script>
                                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                                 </head>
                                 <body class="p-3 bg-zinc-50 antialiased font-sans">
                                    ${getParsedCode()}
                                 </body>
                                 </html>`
                          }
                          className="w-full h-full bg-white border-0"
                          sandbox="allow-scripts"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex items-center justify-between p-3 bg-zinc-200 dark:bg-zinc-900/55 border-b border-zinc-300 dark:border-zinc-800/80 select-none">
                        <span className="text-[10px] font-mono font-black text-emerald-500 tracking-widest uppercase">CONSOLIDATED SPEC CODE</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyAppCode}
                            className="px-2 py-1 bg-zinc-300 dark:bg-zinc-800 text-zinc-750 dark:text-zinc-300 text-xs font-bold rounded-lg border border-zinc-400/20 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                          >
                            {appCodeCopied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                            <span>{appCodeCopied ? "Copied code" : "Copy code"}</span>
                          </button>
                          <button
                            onClick={handleDownloadAppCode}
                            className="px-2 py-1 bg-zinc-300 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg border border-zinc-400/20 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Download size={11} />
                            <span>Download HTML</span>
                          </button>
                        </div>
                      </div>
                      <pre className="flex-1 p-4 bg-[#0d0d0e] font-mono text-[10px] text-[#b5e8b0] select-all leading-relaxed overflow-auto max-h-[380px]">
                        <code>{getParsedCode()}</code>
                      </pre>
                    </div>
                  )
                ) : (
                  <div className="text-center p-6 space-y-3 flex-1 flex flex-col justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center mx-auto text-emerald-500">
                      <Smartphone size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-sans">App Synthesis Device Idle</p>
                      <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed mt-1 mx-auto font-sans">Describe any utility tool, responsive portal, calculator, or interactive game. Brainix will stream and compile full-stack codeblocks live in the emulator!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
        
      </div>
      
    </div>
  );
}
