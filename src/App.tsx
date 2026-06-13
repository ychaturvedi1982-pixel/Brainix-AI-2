import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Pin,
  Sparkles,
  Send,
  Image as ImageIcon,
  Sun,
  Moon,
  Copy,
  Check,
  Menu,
  X,
  ChevronDown,
  Volume2,
  VolumeX,
  CornerDownRight,
  Sliders,
  AlertTriangle,
  Lightbulb,
  Mail,
  Flame,
  Code,
  Search,
  ExternalLink,
  Mic,
  MicOff,
  Compass,
  CheckCircle2,
  TrendingUp,
  CloudSun
} from "lucide-react";
import {
  Chat,
  Message,
  AVAILABLE_MODELS,
  SUGGESTED_PROMPTS,
  ModelOption,
  SuggestedPrompt
} from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // State for Theme (default to system preference or dark slate)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("brainix-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  // Chats State
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem("brainix-chats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing chats", e);
      }
    }
    return [];
  });

  // Current Active Chat ID
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const saved = localStorage.getItem("brainix-active-id");
    return saved || null;
  });

  // Current Input & File Attachment
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attachedImage, setAttachedImage] = useState<{
    data: string;
    mimeType: string;
    previewUrl: string;
  } | null>(null);

  // Streaming State & UI State
  const [showIntro, setShowIntro] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Defaulting sidebar to hidden as per user desire
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModel, setActiveModel] = useState<string>(AVAILABLE_MODELS[0].id);
  const [systemInst, setSystemInst] = useState<string>("");
  const [isSystemInstOpen, setIsSystemInstOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
  // Custom states
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [voiceActiveId, setVoiceActiveId] = useState<string | null>(null);

  // Brainix Cyber Premium States
  const [isVoiceCompanionOpen, setIsVoiceCompanionOpen] = useState(false);
  const [isListeningActive, setIsListeningActive] = useState(false);
  const [recognitionTranscript, setRecognitionTranscript] = useState("");
  const [continuousVoiceMode, setContinuousVoiceMode] = useState(false);
  const [voiceType, setVoiceType] = useState<"female" | "male" | "robot">(() => {
    const saved = localStorage.getItem("brainix-voice-type");
    return (saved as "female" | "male" | "robot") || "female";
  });
  const [activePromptTab, setActivePromptTab] = useState<"weather" | "coding" | "writing" | "mind">("weather");
  const [temperature, setTemperature] = useState<number>(0.75);

  // Intro Screen Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  // References
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Set Theme on Document Class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("brainix-theme", theme);
  }, [theme]);

  // Sync Chats to LocalStorage & Active ID
  useEffect(() => {
    localStorage.setItem("brainix-chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("brainix-active-id", activeChatId);
    } else {
      localStorage.removeItem("brainix-active-id");
    }
  }, [activeChatId]);

  // Handle Model change when Active Chat loads
  useEffect(() => {
    if (activeChat) {
      setActiveModel(activeChat.model);
      setSystemInst(activeChat.systemInstruction || "");
    }
  }, [activeChatId]);

  // Scroll to bottom on messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isGenerating]);

  // Auto-resize search input and message textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Create New Chat
  const handleCreateNewChat = (initialText?: string) => {
    const newId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newId,
      title: initialText ? (initialText.length > 25 ? initialText.slice(0, 25) + "..." : initialText) : "New Conversation",
      messages: [],
      model: activeModel,
      systemInstruction: systemInst || undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setChats((perv) => [newChat, ...perv]);
    setActiveChatId(newId);
    
    if (initialText) {
      // Small timeout to allow state to settle
      setTimeout(() => {
        handleSubmitMessage(initialText, null, newChat);
      }, 50);
    }
  };

  // Delete Chat
  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this conversation?");
    if (!confirmed) return;

    const remaining = chats.filter((c) => c.id !== id);
    setChats(remaining);
    
    if (activeChatId === id) {
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      } else {
        setActiveChatId(null);
      }
    }
  };

  // Start Inline Chat Title Input
  const handleStartRename = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setRenamingId(chat.id);
    setRenameTitle(chat.title);
  };

  // Save Inline Chat Title
  const handleSaveRename = (id: string) => {
    if (!renameTitle.trim()) return;
    setChats((perv) =>
      perv.map((c) => (c.id === id ? { ...c, title: renameTitle.trim(), updatedAt: Date.now() } : c))
    );
    setRenamingId(null);
  };

  // Pin / Unpin Chat
  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChats((perv) =>
      perv.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Set Custom System Instruction
  const handleSaveSystemInstruction = () => {
    if (activeChatId) {
      setChats((perv) =>
        perv.map((c) =>
          c.id === activeChatId
            ? { ...c, systemInstruction: systemInst.trim() || undefined, updatedAt: Date.now() }
            : c
        )
      );
    }
    setIsSystemInstOpen(false);
  };

  // Handle Image Upload Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, or JPEG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Get base64 string without data prefix URL header
      const parts = result.split(",");
      const base64Data = parts[1];
      
      setAttachedImage({
        data: base64Data,
        mimeType: file.type,
        previewUrl: result
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset
  };

  // Trigger Image/Camera Selection
  const handleCameraCapture = () => {
      cameraInputRef.current?.click();
  };

  // Copy element helper
  const [copyCodeState, setCopyCodeState] = useState<Record<string, boolean>>({});
  const handleCopyText = (text: string, refId: string) => {
    navigator.clipboard.writeText(text);
    setCopyCodeState((prev) => ({ ...prev, [refId]: true }));
    setTimeout(() => {
      setCopyCodeState((prev) => ({ ...prev, [refId]: false }));
    }, 2000);
  };

  // Speed-adjusted Premium Speech synthesis (Text-to-Speech)
  const handleToggleSpeech = (text: string, messageId: string) => {
    if (voiceActiveId === messageId) {
      window.speechSynthesis.cancel();
      setVoiceActiveId(null);
    } else {
      window.speechSynthesis.cancel();
      // Clean string from markdown elements for smooth spoken audio
      const cleaned = text
        .replace(/`{3}[\s\S]*?`{3}/g, "") // remove code blocks
        .replace(/[*#_~`\-+]/g, " ") // remove markup characters
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleaned.slice(0, 1800)); // generous vocal read-out
      utterance.onend = () => setVoiceActiveId(null);
      utterance.onerror = () => setVoiceActiveId(null);

      // Pitch and speed based on user style parameters
      if (voiceType === "male") {
        utterance.pitch = 0.82;
        utterance.rate = 0.98;
      } else if (voiceType === "robot") {
        utterance.pitch = 1.6;
        utterance.rate = 1.25;
      } else {
        utterance.pitch = 1.14;
        utterance.rate = 1.05;
      }

      // Try speaking in native high-quality english or regional voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.name.includes("Google") || v.name.includes("Natural") || v.lang.startsWith("en"));
      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
      setVoiceActiveId(messageId);
    }
  };

  // Modern Speech Capturing system (Voice-To-Text / Speech-to-Text)
  const recognitionRef = useRef<any>(null);

  const startVoiceListening = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setVoiceActiveId(null);

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice / Speech recognition is not supported in this browser. Please try Google Chrome or Safari for an optimal experience.");
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-IN"; // Dynamic bilingual detection

      rec.onstart = () => {
        setIsListeningActive(true);
        setRecognitionTranscript("Listening to your voice...");
      };

      rec.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const text = result[0].transcript;
        setRecognitionTranscript(text);
        setInput(text);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListeningActive(false);
        if (event.error === "not-allowed") {
          setRecognitionTranscript("⚠️ Microphone access denied. Tap the Mic/Camera icon in your browser's address bar to Allow access, or click 'Open App in a New Tab' in the top-right of the screen to activate Voice Mode easily.");
        } else {
          setRecognitionTranscript(`⚠️ Microphone connection error: ${event.error}. Please try again.`);
        }
      };

      rec.onend = () => {
        setIsListeningActive(false);
        // Hands-free auto-submission when user finishes talking unless error is present
        setTimeout(() => {
          setInput((prevText) => {
            if (prevText && prevText !== "Listening to your voice..." && !prevText.startsWith("⚠️") && prevText.trim().length > 1) {
              handleSubmitMessage(prevText);
              return "";
            }
            return prevText;
          });
        }, 500);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error("Voice start error:", e);
      setIsListeningActive(false);
    }
  };

  const stopVoiceListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setIsListeningActive(false);
  };

  // Submit message execution
  const handleSubmitMessage = async (
    overrideText?: string,
    overrideImg?: typeof attachedImage,
    targetChat?: Chat | null
  ) => {
    const textToSend = overrideText !== undefined ? overrideText : input;
    const imgToSend = overrideImg !== undefined ? overrideImg : attachedImage;

    if (!textToSend.trim() && !imgToSend) return;

    let currentChat = targetChat !== undefined ? targetChat : activeChat;

    // Reset Input Box and attachments
    if (overrideText === undefined) setInput("");
    if (overrideImg === undefined) setAttachedImage(null);

    // Create a new chat on the fly if none is active
    if (!currentChat) {
      const newId = `chat_${Date.now()}`;
      const newChat: Chat = {
        id: newId,
        title: textToSend.length > 25 ? textToSend.slice(0, 25) + "..." : textToSend,
        messages: [],
        model: activeModel,
        systemInstruction: systemInst || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      // We will perform updates directly
      currentChat = newChat;
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newId);
    }

    // Prepare User Message Object
    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: Date.now(),
      image: imgToSend ? {
        data: imgToSend.data,
        mimeType: imgToSend.mimeType,
        previewUrl: imgToSend.previewUrl
      } : undefined
    };

    // Append User Message to Chats state
    const updatedMessages = [...currentChat.messages, userMsg];
    let titleToSet = currentChat.title;
    if (currentChat.messages.length === 0 && !overrideText) {
      titleToSet = textToSend.length > 24 ? textToSend.slice(0, 24) + "..." : textToSend;
    }

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChat!.id
          ? { ...c, title: titleToSet, messages: updatedMessages, updatedAt: Date.now() }
          : c
      )
    );

    // Trigger AI response loading
    setIsGenerating(true);
    
    // Stop any existing generation
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Temp placeholder for AI stream message
    const assistantMsgId = `msg_ai_${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      text: "",
      timestamp: Date.now()
    };

    // Recompute current state
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChat!.id
          ? { ...c, messages: [...updatedMessages, assistantMsg] }
          : c
      )
    );

    try {
      // Gather payload of chat history
      // Keep it thin to stay under limits and pass context correctly
      const historyContextPayload = updatedMessages.map((m) => ({
        role: m.role,
        text: m.text,
        image: m.image ? {
          data: m.image.data,
          mimeType: m.image.mimeType
        } : undefined
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: historyContextPayload,
          model: currentChat.model,
          systemInstruction: currentChat.systemInstruction,
          temperature: temperature
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errObj = new Error(errorData.error || `Server responded with status ${response.status}`);
        (errObj as any).code = errorData.code;
        (errObj as any).modelTried = errorData.model;
        throw errObj;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to initialize stream reader from server response.");
      }

      const decoder = new TextDecoder();
      let finished = false;
      let aiText = "";
      let buffer = "";

      while (!finished) {
        const { value, done } = await reader.read();
        finished = done;
        buffer += decoder.decode(value, { stream: !done });

        const lines = buffer.split("\n");
        // Maintain trailing potential incomplete line chunk
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const dataStr = trimmed.slice(6); // strip Out 'data: '
          if (dataStr === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              aiText += parsed.text;
              
              // Incrementally update current active message context!
              setChats((prev) =>
                prev.map((c) => {
                  if (c.id === currentChat!.id) {
                    const revisedMsgs = c.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, text: aiText } : m
                    );
                    return { ...c, messages: revisedMsgs };
                  }
                  return c;
                })
              );
            } else if (parsed.error) {
              const errObj = new Error(parsed.error);
              (errObj as any).code = parsed.code;
              (errObj as any).modelTried = parsed.model;
              throw errObj;
            }
          } catch (err) {
            console.error("Failed to parse event JSON data chunk:", dataStr, err);
          }
        }
      }

      // If Talkback/Continuous voice mode is active, automatically read the text aloud
      if (continuousVoiceMode && aiText) {
        handleToggleSpeech(aiText, assistantMsgId);
      }

    } catch (err: any) {
        if (err.name === 'AbortError') {
            console.log("Generation aborted by user");
            const chatIdToDelete = currentChat!.id;
            setChats((prev) => {
              const remaining = prev.filter((c) => c.id !== chatIdToDelete);
              const newId = `chat_${Date.now()}`;
              const newChat: Chat = {
                id: newId,
                title: "New Conversation",
                messages: [],
                model: activeModel,
                systemInstruction: systemInst || undefined,
                createdAt: Date.now(),
                updatedAt: Date.now()
              };
              setTimeout(() => {
                setActiveChatId(newId);
              }, 0);
              return [newChat, ...remaining];
            });
        } else {
            console.error("Generation failed:", err);
            
            const errCode = err.code || "";
            const errModel = err.modelTried || currentChat!.model || "";
            const errorText = `⚠️ **Error Generating Response:** ${err.message || "An unexpected error occurred. Please verify your Brainix API Key configuration."}`;
            
            setChats((prev) =>
                prev.map((c) => {
                if (c.id === currentChat!.id) {
                    const revisedMsgs = c.messages.map((m) =>
                    m.id === assistantMsgId
                        ? { 
                            ...m, 
                            text: m.text ? m.text + "\n\n" + errorText : errorText,
                            error: {
                              message: err.message || String(err),
                              code: errCode,
                              modelTried: errModel
                            }
                          }
                        : m
                    );
                    return { ...c, messages: revisedMsgs };
                }
                return c;
                })
            );
        }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Change Chat Model to gemini-3.5-flash and auto-retry generation
  const handleSwitchAndRetry = (chatId: string) => {
    const targetChat = chats.find((c) => c.id === chatId);
    if (!targetChat) return;

    // Last user message text and image attachment if any
    const userMsgs = targetChat.messages.filter((m) => m.role === "user");
    if (userMsgs.length === 0) return;
    const lastUserMsg = userMsgs[userMsgs.length - 1];

    // Slice history to exclude everything after (and including) the error message & last user message
    const lastUserIndex = targetChat.messages.findIndex((m) => m.id === lastUserMsg.id);
    const cleanedMessages = targetChat.messages.slice(0, lastUserIndex);

    // Change global state model and save updated chat state
    setActiveModel("gemini-3.5-flash");
    const updatedChat: Chat = {
      ...targetChat,
      model: "gemini-3.5-flash",
      messages: cleanedMessages,
      updatedAt: Date.now()
    };

    setChats((prev) => prev.map((c) => (c.id === chatId ? updatedChat : c)));

    // Re-trigger generation automatically using Brainix 3.5 Turbo (the free tier model)
    setTimeout(() => {
      handleSubmitMessage(lastUserMsg.text, lastUserMsg.image, updatedChat);
    }, 120);
  };

  // Cleanly retry the last user query using the current model
  const handleRetryLast = (chatId: string) => {
    const targetChat = chats.find((c) => c.id === chatId);
    if (!targetChat) return;

    const userMsgs = targetChat.messages.filter((m) => m.role === "user");
    if (userMsgs.length === 0) return;
    const lastUserMsg = userMsgs[userMsgs.length - 1];

    const lastUserIndex = targetChat.messages.findIndex((m) => m.id === lastUserMsg.id);
    const cleanedMessages = targetChat.messages.slice(0, lastUserIndex);

    const updatedChat: Chat = {
      ...targetChat,
      messages: cleanedMessages,
      updatedAt: Date.now()
    };

    setChats((prev) => prev.map((c) => (c.id === chatId ? updatedChat : c)));

    setTimeout(() => {
      handleSubmitMessage(lastUserMsg.text, lastUserMsg.image, updatedChat);
    }, 120);
  };

  // Keyboard Submit (Enter sends, Shift+Enter newlines)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage();
    }
  };

  // Group chats by temporal order
  const getGroupedChats = () => {
    const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
    const filtered = sorted.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.systemInstruction && c.systemInstruction.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pinned: Chat[] = [];
    const today: Chat[] = [];
    const yesterday: Chat[] = [];
    const activeWeek: Chat[] = [];
    const older: Chat[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;

    filtered.forEach((c) => {
      if (c.isPinned) {
        pinned.push(c);
      } else if (c.updatedAt >= todayStart) {
        today.push(c);
      } else if (c.updatedAt >= yesterdayStart) {
        yesterday.push(c);
      } else if (c.updatedAt >= weekStart) {
        activeWeek.push(c);
      } else {
        older.push(c);
      }
    });

    return { pinned, today, yesterday, activeWeek, older };
  };

  // Quick prompt click handler
  const handleSuggestedPromptClick = (prompt: SuggestedPrompt) => {
    setInput(prompt.promptText);
    textareaRef.current?.focus();
  };

  const { pinned, today, yesterday, activeWeek, older } = getGroupedChats();

  const activeModelOption = AVAILABLE_MODELS.find((m) => m.id === activeModel) || AVAILABLE_MODELS[0];

  return (
    <div id="app-root" className="min-h-screen flex bg-zinc-50 text-zinc-900 dark:bg-[#171717] dark:text-zinc-100 font-sans transition-colors duration-200">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-50 dark:bg-[#171717]"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
                 <Sparkles size={48} className="text-white animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Brainix AI</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. Mobile Sidebar Backdrop Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <button
            id="sidebar-toggle-mobile-overlay"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs cursor-default"
          />
        )}
      </AnimatePresence>

      {/* 2. Collapsible Navigation Sidebar (Brainix AI style) */}
      <aside
        id="side-nav-bar"
        className={`fixed md:relative top-0 bottom-0 left-0 z-50 flex flex-col w-[260px] bg-zinc-100 dark:bg-[#0d0d0d] border-r border-zinc-200 dark:border-zinc-800/80 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden md:-translate-x-full"
        }`}
      >
        {/* Sidebar Header: "New Chat" Action */}
        <div id="sidebar-header" className="p-3.5 flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/40">
          <button
            id="new-chat-btn"
            onClick={() => {
              handleCreateNewChat();
              if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close sidebar on mobile
            }}
            className="flex-1 flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800/60 transition-all text-left duration-200 cursor-pointer active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2">
              <Plus size={16} className="text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
              <span>New chat</span>
            </div>
            <span className="text-xxs px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded font-mono group-hover:border-zinc-400">Ctrl N</span>
          </button>

          {/* Close Sidebar Toggle (Mobile view button) */}
          <button
            id="close-sidebar-mobile-btn"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Middle: Search and Scrollable Chats History */}
        <div id="sidebar-chats-container" className="flex-1 flex flex-col min-h-0 py-2">
          
          {/* Internal search filter */}
          <div className="px-3 mb-2 flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                id="search-chats-input"
                type="text"
                placeholder="Search histories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-zinc-200/50 dark:bg-zinc-900/40 border-0 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 pl-8 pr-3 py-1.5 rounded-md outline-hidden text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 font-bold text-xxs">
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-4 font-sans text-xs scrollbar-thin">
            {chats.length === 0 && (
              <div className="text-center py-6 text-zinc-400 dark:text-zinc-600 px-4">
                No conversations yet. Create your first chat!
              </div>
            )}

            {/* Chat list segmentations helper */}
            {([
              { title: "Pinned Conversations", items: pinned },
              { title: "Today", items: today },
              { title: "Yesterday", items: yesterday },
              { title: "Previous 7 Days", items: activeWeek },
              { title: "Older Histories", items: older }
            ]).map(({ title, items }) => {
              if (items.length === 0) return null;
              return (
                <div key={title} className="space-y-1">
                  <h3 className="px-3 text-xxs font-semibold text-zinc-400/80 dark:text-zinc-500 uppercase tracking-wider">
                    {title}
                  </h3>
                  <div className="space-y-0.5">
                    {items.map((chat) => {
                      const isActive = chat.id === activeChatId;
                      const isRenaming = chat.id === renamingId;

                      return (
                        <div
                          key={chat.id}
                          id={`chat-item-${chat.id}`}
                          onClick={() => {
                            if (!isRenaming) {
                              setActiveChatId(chat.id);
                              if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }
                          }}
                          className={`relative group flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                            isActive
                              ? "bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-200"
                          }`}
                        >
                          <MessageSquare size={14} className="shrink-0 opacity-70" />
                          
                          {isRenaming ? (
                            <input
                              id={`rename-input-${chat.id}`}
                              type="text"
                              value={renameTitle}
                              onChange={(e) => setRenameTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(chat.id);
                                if (e.key === "Escape") setRenamingId(null);
                              }}
                              onBlur={() => handleSaveRename(chat.id)}
                              autoFocus
                              className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-1 py-0.5 rounded text-xs text-black dark:text-white outline-hidden focus:ring-1 focus:ring-blue-500/50"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="flex-1 truncate pr-8" title={chat.title}>
                              {chat.title}
                            </span>
                          )}

                          {/* Chat actions (Rename, Pin, Delete) shown on hover or when active */}
                          {!isRenaming && (
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-linear-to-l from-zinc-100 via-zinc-100 to-transparent dark:from-[#0d0d0d] dark:via-[#0d0d0d] dark:to-transparent pl-4 py-1 rounded">
                              
                              {/* Pin Button */}
                              <button
                                id={`pin-chat-btn-${chat.id}`}
                                title={chat.isPinned ? "Unpin Chat" : "Pin Chat"}
                                onClick={(e) => handleTogglePin(e, chat.id)}
                                className={`p-1 rounded text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                                  chat.isPinned ? "text-amber-500 dark:text-amber-400 opacity-100" : ""
                                }`}
                              >
                                <Pin size={11} className={chat.isPinned ? "fill-amber-500 dark:fill-amber-400" : ""} />
                              </button>

                              {/* Rename Button */}
                              <button
                                id={`rename-chat-btn-${chat.id}`}
                                title="Rename Chat"
                                onClick={(e) => handleStartRename(e, chat)}
                                className="p-1 rounded text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <Edit3 size={11} />
                              </button>

                              {/* Delete Botton */}
                              <button
                                id={`delete-chat-btn-${chat.id}`}
                                title="Delete Chat"
                                onClick={(e) => handleDeleteChat(e, chat.id)}
                                className="p-1 rounded text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Theme switcher, instructions, app info */}
        <div id="sidebar-footer" className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2 text-xs bg-zinc-100/50 dark:bg-[#090909]">
          
          {/* Custom Instruction Trigger Option */}
          <button
            id="system-preset-trigger-btn"
            onClick={() => setIsSystemInstOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/40 hover:text-black dark:hover:text-white transition-all duration-150 cursor-pointer active:scale-[0.98]"
          >
            <Sliders size={14} className="text-zinc-500" />
            <div className="flex-1 text-left truncate flex items-center justify-between">
              <span>System Persona</span>
              {systemInst && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
            </div>
          </button>

          {/* Theme Selector Light / Dark */}
          <button
            id="theme-toggler"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/40 hover:text-black dark:hover:text-white transition-all duration-150 cursor-pointer active:scale-[0.98]"
          >
            {theme === "light" ? (
              <>
                <Moon size={14} className="text-zinc-500" />
                <span className="flex-1 text-left">Dark mode</span>
              </>
            ) : (
              <>
                <Sun size={14} className="text-zinc-400" />
                <span className="flex-1 text-left">Light mode</span>
              </>
            )}
          </button>

          {/* Prompt Developer Instructions details */}
          <div className="px-3 pt-1 flex flex-col gap-1 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">
            <span className="flex items-center gap-1">
              <CornerDownRight size={8} /> Local Storage Engaged
            </span>
            <span className="flex items-center gap-1">
              <CornerDownRight size={8} /> Powered by Brainix Engine
            </span>
          </div>
        </div>
      </aside>

      {/* 3. Main Chat WorkSpace (Chat Area & Input) */}
      <main id="chat-workspace-pane" className="flex-1 flex flex-col min-w-0 h-screen relative">
        
        {/* Workspace Top Toolbar Header (Model selection, Sidebar toggle) */}
        <header
          id="workspace-toolbar"
          className="h-14 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] z-30"
        >
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button (Open desktop/mobile sidebar) */}
            <button
              id="sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <Menu size={20} />
            </button>

            {/* Model Selector Dropdown Popover */}
            <div className="relative">
              <button
                id="model-dropdown-btn"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer"
              >
                <span>{activeModelOption.name}</span>
                <ChevronDown size={14} className={`text-zinc-450 dark:text-zinc-500 transition-transform ${isModelDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isModelDropdownOpen && (
                  <>
                    {/* Backdrop cover for model list */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsModelDropdownOpen(false)} />
                    <motion.div
                      id="model-dropdown-list"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 mt-1 w-[320px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#202020] shadow-xl p-2 z-20 space-y-1"
                    >
                      <div className="px-3 py-1.5 text-xxs font-bold text-zinc-400 uppercase tracking-wider">
                        Available Intelligence Engine
                      </div>
                      
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          id={`model-option-btn-${model.id}`}
                          onClick={() => {
                            setActiveModel(model.id);
                            if (activeChatId) {
                              setChats((prev) =>
                                prev.map((c) => (c.id === activeChatId ? { ...c, model: model.id } : c))
                              );
                            }
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg flex items-start gap-2.5 transition-colors cursor-pointer duration-150 ${
                            activeModel === model.id
                              ? "bg-zinc-100 dark:bg-zinc-800/80 text-black dark:text-white"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30 text-zinc-650 dark:text-zinc-400"
                          }`}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">{model.name}</span>
                              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
                                {model.badge}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-normal">{model.description}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Displaying static custom system instruction tag if active */}
            {systemInst && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/60 font-mono text-zinc-500">
                <Sliders size={11} className="text-green-500" /> System Active
              </span>
            )}

            {/* Support documentation links */}
            <a
              href="https://ai.google.dev/gemini-api/docs"
              target="_blank"
              rel="noreferrer"
              title="Brainix API Docs"
              className="p-1 px-2.5 rounded hover:bg-zinc-150 dark:hover:bg-zinc-800 font-mono text-xs text-zinc-500 flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <span>API Docs</span> <ExternalLink size={11} />
            </a>
          </div>
        </header>

        {/* 4. Active Chat Message Scroll Body */}
        <div id="messages-scroller" className="flex-1 overflow-y-auto bg-white dark:bg-[#212121] transition-colors duration-200 scroll-smooth">
          
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            {!activeChat || activeChat.messages.length === 0 ? (
              
              /* Brainix AI Empty State Greeting / Prompt suggestions cards */
              <div id="greeting-splash-container" className="pt-8 md:pt-16 pb-8 space-y-8 flex flex-col items-center justify-center">
                
                {/* Large animated center icon spark */}
                <motion.div
                  initial={{ transform: "scale(0.85)", opacity: 0 }}
                  animate={{ transform: "scale(1)", opacity: 1 }}
                  transition={{ duration: 0.52 }}
                  className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-tr from-blue-500/20 via-purple-500/20 to-zinc-500/20 dark:from-blue-600/30 dark:via-purple-600/30 dark:to-zinc-800/30 border border-zinc-200/80 dark:border-zinc-800/40 relative shadow-md"
                >
                  <Sparkles size={32} className="text-blue-500 dark:text-blue-400 animate-pulse" />
                </motion.div>

                {/* Main greeting line */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-sans font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
                    How can I help you today?
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
                    Ask anything. This full Brainix AI client is ready and connected to top-tier models to compose text, explain logic, write scripts, or review files.
                  </p>
                </div>

                {/* Category select tabs (Brainix Style) */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl px-2">
                  <button
                    onClick={() => setActivePromptTab("weather")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activePromptTab === "weather"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <CloudSun size={13} />
                    <span>Weather Master</span>
                  </button>
                  <button
                    onClick={() => setActivePromptTab("coding")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activePromptTab === "coding"
                        ? "bg-blue-500 text-white shadow-sm"
                        : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <Code size={13} />
                    <span>Code Wizard</span>
                  </button>
                  <button
                    onClick={() => setActivePromptTab("writing")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activePromptTab === "writing"
                        ? "bg-purple-500 text-white shadow-sm"
                        : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <Mail size={13} />
                    <span>Creative Writer</span>
                  </button>
                  <button
                    onClick={() => setActivePromptTab("mind")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activePromptTab === "mind"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <Lightbulb size={13} />
                    <span>Mind Expansion</span>
                  </button>
                </div>

                {/* Prompt suggestions grid (Filtered by Category) */}
                <div id="quick-prompt-grid" className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl w-full pt-2">
                  {(activePromptTab === "weather"
                    ? [
                        {
                          label: "Lucknow Live Weather",
                          detail: "Check the accurate real-time climate in Lucknow right now.",
                          promptText: "Please search the web for the latest, up-to-the-minute weather forecast for Lucknow (city/state) right now, including temperature, visual sky conditions, and any humidity alerts.",
                          icon: "weather"
                        },
                        {
                          label: "Compare Delhi vs Mumbai Weather",
                          detail: "Live temperature, visual sky contrast and wind speeds.",
                          promptText: "Compare the current visual weather and live temperature of New Delhi and Mumbai using real-time search. Mention which city is experiencing warmer weather currently.",
                          icon: "weather"
                        },
                        {
                          label: "What is latest weather in Jaipur?",
                          detail: "Find live tourist weather updates for Rajasthan capital.",
                          promptText: "Deliver the absolute latest real-time weather information of Jaipur city right now. Include thermal feels, sky clarity, and suggest whether it is ideal for outdoor walks today.",
                          icon: "weather"
                        },
                        {
                          label: "Village & Regional Climate",
                          detail: "Search live weather for regional villages or divisions.",
                          promptText: "Acknowledge that you can search live local weather for any village, block, district or state in India. Give a detailed sample weather forecast for Varanasi devision or other rural blocks today.",
                          icon: "weather"
                        }
                      ]
                    : activePromptTab === "coding"
                    ? [
                        {
                          label: "Write clean React debounced value hook",
                          detail: "Complete custom TypeScript React hook to throttling user search input.",
                          promptText: "Write a high-performance, type-safe custom React hook called `useDebounce` to throttle quick state changes. Provide simple guidelines and comments.",
                          icon: "code"
                        },
                        {
                          label: "Optimize complex SQL joins",
                          detail: "Analyze index scans and rewrite nested subqueries.",
                          promptText: "Describe standard architectural guidelines to identify and optimize heavy SQL slow join queries, nested table scans, and how indexes assist speedups.",
                          icon: "code"
                        }
                      ]
                    : activePromptTab === "writing"
                    ? [
                        {
                          label: "Play Store description booster",
                          detail: "Draft a blockbuster, highly energetic app description text.",
                          promptText: "Compose a beautiful, high-energy marketing text for Google Play Store listing of a next-generation AI app named Brainix. Focus on Live Voice Mode, Real-Time Weather Grounding, and custom System Personas. Use beautiful headings and bullet formats.",
                          icon: "mail"
                        },
                        {
                          label: "Polite project deadline extension email",
                          detail: "Request more time gracefully from stakeholders.",
                          promptText: "Write a short, highly professional, polite email to a client requesting a 3-day extension on project deliverables while assuring premium craftsmanship. Keep it brief.",
                          icon: "mail"
                        }
                      ]
                    : [
                        {
                          label: "Explain Quantum Entanglement to kids",
                          detail: "Analogies like magic twin playing cards or spinning coins.",
                          promptText: "Explain how quantum entanglement functions using a beautiful, simple analogy that a 10-year-old kid can grasp easily. Avoid complex jargon.",
                          icon: "mind"
                        },
                        {
                          label: "How do nuclear reactions power stars?",
                          detail: "Fascinating science of fusion simplified beautifully.",
                          promptText: "Explain how nuclear fusion reactions power stars like our Sun in an elegant, structured format. Make it highly engaging to read.",
                          icon: "mind"
                        }
                      ]
                  ).map((prompt) => {
                    return (
                      <button
                        key={prompt.label}
                        id={`suggested-prompt-${prompt.label.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => handleSuggestedPromptClick({ label: prompt.label, detail: prompt.detail, promptText: prompt.promptText, icon: prompt.icon === "weather" ? "Flame" : "Lightbulb" })}
                        className="p-3.5 rounded-xl border border-zinc-200/80 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-800/20 text-left cursor-pointer transition-all hover:shadow-xs group duration-150 active:scale-[0.99] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {activePromptTab === "weather" && <CloudSun size={14} className="text-emerald-500 animate-pulse" />}
                            {activePromptTab === "coding" && <Code size={14} className="text-blue-500" />}
                            {activePromptTab === "writing" && <Mail size={14} className="text-purple-500" />}
                            {activePromptTab === "mind" && <Lightbulb size={14} className="text-amber-500" />}
                            <span className="font-semibold text-xs text-zinc-850 dark:text-zinc-150 leading-tight block truncate pr-2">{prompt.label}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal leading-relaxed font-sans max-h-12 overflow-hidden text-ellipsis line-clamp-2">
                            {prompt.detail}
                          </p>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-mono mt-1 w-full text-right block font-medium group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">Select Prompt →</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              
              /* Messages thread stack list */
              <div id="messages-list-wrapper" className="space-y-6">
                {activeChat.messages.map((msg: Message, idx: number) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      id={`message-bubble-${msg.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28 }}
                      className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar initial badge layout */}
                      <div className="shrink-0 flex items-start mt-1">
                        {isUser ? (
                          <div className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 font-sans font-bold text-xs text-zinc-700 dark:text-zinc-200 flex items-center justify-center">
                            U
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-purple-500 text-white flex items-center justify-center font-bold shadow-xs">
                            <Sparkles size={14} className="animate-spin-slow" />
                          </div>
                        )}
                      </div>

                      {/* Content column details */}
                      <div className={`flex flex-col max-w-[85%] space-y-1 ${isUser ? "items-end" : "items-start"}`}>
                        
                        {/* Speaker identification bar */}
                        <div className="flex items-center gap-2 text-xxs font-mono text-zinc-400 dark:text-zinc-500">
                          <span>{isUser ? "You" : `${activeModelOption.name}`}</span>
                          <span>•</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>

                        {/* Rendering core message text content */}
                        <div
                          className={`rounded-xl px-4 py-3 leading-relaxed text-sm ${
                            isUser
                              ? "bg-zinc-100 dark:bg-[#2f2f2f] text-zinc-850 dark:text-zinc-100"
                              : "text-zinc-850 dark:text-zinc-100 select-text"
                          }`}
                        >
                          {/* Render user image if uploaded inside bubble */}
                          {msg.image && (
                            <div className="mb-3 max-w-sm rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                              <img
                                src={msg.image.previewUrl}
                                alt="User Upload Content"
                                className="w-full h-auto object-contain max-h-[250px] bg-zinc-900/5"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {isUser ? (
                            <span className="whitespace-pre-wrap">{msg.text}</span>
                          ) : (
                            <div className="markdown-body prose dark:prose-invert prose-zinc max-w-none text-zinc-900 dark:text-zinc-100 leading-relaxed font-sans space-y-3">
                              {msg.text ? (
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                                    li: ({ children }) => <li className="mb-0.5 leading-normal">{children}</li>,
                                    h1: ({ children }) => <h1 className="text-lg font-bold font-sans mt-4 mb-2 tracking-tight">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-bold font-sans mt-3 mb-1.5 tracking-tight">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-bold font-sans mt-2 mb-1">{children}</h3>,
                                    code({ className, children, ...props }) {
                                      const match = /language-(\w+)/.exec(className || "");
                                      const codeStr = String(children).replace(/\n$/, "");
                                      const isInline = !match && !codeStr.includes("\n");

                                      if (isInline) {
                                        return (
                                          <code
                                            className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-pink-600 dark:text-pink-400"
                                            {...props}
                                          >
                                            {children}
                                          </code>
                                        );
                                      }

                                      // Ref key identifier
                                      const refKey = `${msg.id}_${idx}_code`;

                                      return (
                                        <div className="my-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                          <div className="flex items-center justify-between bg-zinc-100 dark:bg-[#1e1e1e] px-4 py-1.5 text-[10px] text-zinc-650 dark:text-zinc-400 font-mono border-b border-zinc-200 dark:border-zinc-800">
                                            <span>{match ? match[1] : "code"}</span>
                                            <button
                                              id={`copy-code-btn-${refKey}`}
                                              onClick={() => handleCopyText(codeStr, refKey)}
                                              className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                                            >
                                              {copyCodeState[refKey] ? (
                                                <Check size={11} className="text-green-500 animate-bounce" />
                                              ) : (
                                                <Copy size={11} />
                                              )}
                                              <span>{copyCodeState[refKey] ? "Copied" : "Copy code"}</span>
                                            </button>
                                          </div>
                                          <pre className="p-3.5 overflow-x-auto bg-[#0d0d0d] font-mono text-xs text-zinc-100 select-all leading-normal">
                                            <code className={className} {...props}>
                                              {children}
                                            </code>
                                          </pre>
                                        </div>
                                      );
                                    }
                                  }}
                                >
                                  {msg.text}
                                </ReactMarkdown>
                              ) : (
                                <div className="flex items-center gap-2 py-1 select-none">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Custom Error Assistance Widget */}
                        {!isUser && msg.error && (
                          <div className="w-full max-w-lg mt-2.5 p-4 rounded-xl border border-rose-500/20 dark:border-rose-500/30 bg-rose-50/5 dark:bg-rose-950/5 space-y-3.5 shadow-xs shrink-0 font-sans">
                            <div className="flex items-start gap-2.5 text-rose-600 dark:text-rose-450">
                              <AlertTriangle size={18} className="shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-1">
                                <h4 className="font-semibold text-xs uppercase tracking-wider font-mono text-rose-600 dark:text-rose-400">
                                  {msg.error.code === 429 || String(msg.error.message).toLowerCase().includes("quota") || String(msg.error.message).toLowerCase().includes("limit")
                                    ? "Shared Rate Limit Reached / कोटा समाप्त हुआ"
                                    : "Intelligence Engine Alert / एरर सुचना"}
                                </h4>
                                
                                <div className="space-y-3 mt-1.5 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                                  {/* Error Explanation in Hindi & English */}
                                  <div className="border-l-2 border-emerald-500 pl-2.5 space-y-1 bg-emerald-500/5 p-1.5 rounded-r-lg">
                                    <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xxs uppercase tracking-wider">❓ यह एरर क्यों दिख रहा है?</p>
                                    <p className="text-[11px] leading-relaxed">
                                      यह ऐप Google AI Studio free tier API key का उपयोग करता है। जब बहुत सारे लोग एक साथ किसी भी शहर, राज्य या गाँव (जैसे लखनऊ, दिल्ली, वाराणसी या ग्रामीण ब्लॉक्स) का ताज़ा मौसम सर्च करते हैं, तो Google का दैनिक कोटा लिमिट समाप्त हो जाता है। यह प्रति मिनट या थोड़े समय में ऑटोमैटिकली रीसेट हो जाता है।
                                    </p>
                                  </div>

                                  <div className="border-l-2 border-indigo-500 pl-2.5 space-y-1 bg-indigo-500/5 p-1.5 rounded-r-lg">
                                    <p className="font-semibold text-indigo-600 dark:text-indigo-400 text-xxs uppercase tracking-wider">🌦️ Weather Search Power</p>
                                    <p className="text-[11px] leading-relaxed">
                                      Brainix के पास <strong>Google Search Grounding</strong> का लाइव एक्सेस है। आप यहाँ किसी भी गाँव (village), कस्बे या शहर का नाम लिख कर <em>"current weather in Lucknow"</em> या <em>"weather in my village Uttar Pradesh"</em> पूछेंगे तो यह लाइव वेब सर्च करके आपको सटीक तापमान, हवा और बारिश की ताज़ा रिपोर्ट देता है।
                                    </p>
                                  </div>

                                  <div className="border-l-2 border-amber-550 pl-2.5 space-y-1 bg-amber-500/5 p-1.5 rounded-r-lg">
                                    <p className="font-semibold text-amber-600 dark:text-amber-400 text-xxs uppercase tracking-wider">⚡ Solution / क्या करें?</p>
                                    <p className="text-[11px] leading-relaxed">
                                      1. कृपया 15 से 30 सेकंड प्रतीक्षा करें और पुनः अपना मैसेज भेजें।<br />
                                      2. नीचे दिए गए <strong>Switch to Turbo (Free)</strong> बटन पर क्लिक करके त्वरित रीसेट करें!
                                    </p>
                                  </div>

                                  <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500">
                                    Technical Code: {msg.error.code || "429"} | Resource: {msg.error.modelTried || "Brainix Engine"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 font-sans">
                              <button
                                id={`switch-flash-btn-${msg.id}`}
                                onClick={() => handleSwitchAndRetry(activeChat!.id)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95 transition-all text-center shadow-xs"
                              >
                                <Sparkles size={11} className="text-white font-sans animate-bounce" />
                                <span>Switch to Turbo & Retry</span>
                              </button>
                              
                              <button
                                onClick={() => handleRetryLast(activeChat!.id)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer active:scale-95 transition-all text-center"
                              >
                                <span>Retry Last Msg 🔄</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Interactive prompt utility panel (Speak aloud, Copy text) */}
                        <div className="flex items-center gap-2.5 pt-0.5 opacity-40 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          
                          {/* Copy bubble */}
                          <button
                            id={`copy-bubble-btn-${msg.id}`}
                            title="Copy message contents"
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                          >
                            {copyCodeState[msg.id] ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                          </button>

                          {/* Trigger SpeechSynthesis read-aloud */}
                          <button
                            id={`voice-over-btn-${msg.id}`}
                            title={voiceActiveId === msg.id ? "Stop voice over" : "Voice over"}
                            onClick={() => handleToggleSpeech(msg.text, msg.id)}
                            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                          >
                            {voiceActiveId === msg.id ? (
                              <VolumeX size={13} className="text-red-500 animate-pulse" />
                            ) : (
                              <Volume2 size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {/* Scroll bottom target anchor */}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* 5. Prompt Floating Entry Input Area (Brainix AI Footer style) */}
        <footer id="prompt-bar" className="bg-linear-to-t from-white via-white to-transparent dark:from-[#171717] dark:via-[#171717] dark:to-transparent pt-3 pb-6 px-4 z-20">
          <div className="w-full max-w-4xl mx-auto space-y-2">
            
            {/* File upload previews panel drawer */}
            <AnimatePresence>
              {attachedImage && (
                <motion.div
                  id="image-thumbnail-drawer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="flex items-center gap-3 p-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-sm"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 relative shrink-0">
                    <img src={attachedImage.previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xxs font-semibold text-zinc-650 dark:text-zinc-300 truncate">Attached image loaded</p>
                    <span className="text-[10px] text-zinc-500 uppercase">{attachedImage.mimeType.split("/")[1]} image format</span>
                  </div>
                  <button
                    id="remove-attached-image-btn"
                    onClick={() => setAttachedImage(null)}
                    className="p-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                    title="Remove attachment"
                  >
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex items-center bg-zinc-100 dark:bg-[#2f2f2f] border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-2 shadow-xs group focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 transition-all duration-150">
              
              {/* Attachment selector hidden input triggers */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                id="hidden-file-input"
              />
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleImageSelect}
                accept="image/png, image/jpeg, image/jpg"
                capture="environment"
                className="hidden"
                id="hidden-camera-input"
              />

              {/* Clip Image attachment toggle button */}
              <button
                id="upload-attachment-trigger-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                className="p-2 ml-1 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white cursor-pointer active:scale-95 disabled:opacity-50 transition-colors shrink-0"
                title="Attach file / image"
              >
                <ImageIcon size={18} />
              </button>
              
              {/* Camera capture trigger button */}
              <button
                id="camera-capture-trigger-btn"
                onClick={handleCameraCapture}
                disabled={isGenerating}
                className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white cursor-pointer active:scale-95 disabled:opacity-50 transition-colors shrink-0"
                title="Camera capture"
              >
                <div className="w-5 h-5 flex items-center justify-center font-bold">📷</div>
              </button>

              {/* Mic / Live Voice Mode Companion Button */}
              <button
                id="mic-voice-companion-trigger-btn"
                onClick={() => {
                  setIsVoiceCompanionOpen(true);
                  startVoiceListening();
                }}
                disabled={isGenerating}
                className="p-2 rounded-xl text-zinc-500 dark:text-zinc-405 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer active:scale-95 disabled:opacity-50 transition-colors shrink-0 animate-pulse"
                title="Start Voice Talking Mode"
              >
                <Mic size={18} />
              </button>

              {/* Actual Chat Prompt entry textbox */}
              <textarea
                id="prompt-entry-textarea"
                ref={textareaRef}
                rows={1}
                value={input}
                onKeyDown={handleKeyDown}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Brainix AI..."
                disabled={isGenerating}
                className="flex-1 max-h-[200px] resize-none overflow-y-auto bg-transparent border-0 outline-hidden pl-2.5 pr-12 py-2 text-sm text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-0 leading-normal"
                style={{ height: "auto" }}
              />

              {/* Submit prompt button trigger floating right */}
              <div className="absolute right-2 bottom-2">
                {isGenerating ? (
                    <button
                        id="stop-generation-btn"
                        onClick={() => abortControllerRef.current?.abort()}
                        className="p-2 rounded-xl flex items-center justify-center transition-all bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer shrink-0"
                        title="Stop generation"
                    >
                        <X size={15} />
                    </button>
                ) : (
                    <button
                        id="submit-prompt-btn"
                        onClick={() => handleSubmitMessage()}
                        disabled={!input.trim() && !attachedImage}
                        className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                            (input.trim() || attachedImage)
                            ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 cursor-pointer shrink-0"
                            : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed shrink-0"
                        }`}
                        title="Send message"
                    >
                        <Send size={15} />
                    </button>
                )}
              </div>
            </div>

            {/* Disclaimer caption footer */}
            <div className="text-center font-sans select-none text-[10px] text-zinc-400 dark:text-zinc-600 px-4">
              <span>Brainix AI can make mistakes. Consider checking important information against reputable sources. Developed by Pranav Chaturvedi.</span>
            </div>
          </div>
        </footer>
      </main>

      {/* 6. System Persona Instructions Dialog Modal Overlay */}
      <AnimatePresence>
        {isSystemInstOpen && (
          <div id="system-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark backing overlay shadow */}
            <button
              onClick={() => setIsSystemInstOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-default"
            />

            {/* Modal Body box */}
            <motion.div
              id="system-modal-card"
              initial={{ transform: "scale(0.95)", opacity: 0 }}
              animate={{ transform: "scale(1)", opacity: 1 }}
              exit={{ transform: "scale(0.95)", opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-[#202020] p-6 shadow-2xl z-20 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-primary-500 text-blue-500" />
                  <h3 className="font-sans font-semibold text-base text-zinc-900 dark:text-zinc-100">
                    Brainix Calibration Lab
                  </h3>
                </div>
                <button
                  id="close-system-modal-top-btn"
                  onClick={() => setIsSystemInstOpen(false)}
                  className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:text-red-500 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-normal">
                {/* Visual Preset selection pills */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest block">Personality Presets</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        name: "🌦️ Weather Expert",
                        prompt: "You are Brainix Weather Scholar. You have real-time Google Search grounding access to get accurate, exact live weather, local temp, climate conditions, and fun tourist facts for any city, village, block, or state. Provide visual structured layouts with weather icons."
                      },
                      {
                        name: "💻 Code Auditor",
                        prompt: "You are a Senior Security Architect and Expert TypeScript Engineer. Review or generate code using state-of-the-art secure patterns, optimal complexity, and exact document guidelines."
                      },
                      {
                        name: "✍️ SEO Marketeer",
                        prompt: "You are a master of app store optimization (ASO) and energetic content writing. Draft catchy list hooks, bullet pitches, and viral growth copies."
                      },
                      {
                        name: "🛋️ Support Coach",
                        prompt: "You are an empathetic, kind AI companion who answers with supportive steps, mental clarity suggestions, and mindful coaching frameworks."
                      },
                      {
                        name: "🌀 Reset",
                        prompt: ""
                      }
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setSystemInst(item.prompt)}
                        className={`px-2.5 py-1.5 rounded-lg text-xxs font-semibold border transition-all cursor-pointer ${
                          systemInst === item.prompt
                            ? "bg-blue-500 border-blue-500 text-white shadow-xs"
                            : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest block">System Persona Instructions</label>
                  <textarea
                    id="system-instruction-textarea"
                    rows={4}
                    placeholder="Set custom instructions like default language, specific formats, or personas..."
                    value={systemInst}
                    onChange={(e) => setSystemInst(e.target.value)}
                    className="w-full text-xs font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#151515] p-3 rounded-xl focus:ring-1 focus:ring-zinc-400 outline-hidden leading-relaxed text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>

                {/* Hyperparameter Temperature scale custom block */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest">Cognitive Creativity (Temperature)</label>
                    <span className="text-xs font-mono font-bold text-blue-500">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-800 accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-405 font-mono">
                    <span>Precise / Cold</span>
                    <span>Neutral</span>
                    <span>Creative / Hot</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  id="cancel-system-modal-btn"
                  onClick={() => setIsSystemInstOpen(false)}
                  className="px-4 py-2 rounded-xl font-medium text-xs text-zinc-500 hover:bg-zinc-150 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-system-modal-btn"
                  onClick={handleSaveSystemInstruction}
                  className="px-4 py-2 rounded-xl font-medium text-xs bg-black dark:bg-white text-white dark:text-black hover:opacity-95 active:scale-95 cursor-pointer"
                >
                  Apply Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Live Voice Companion Mode Fullscreen/Bottom Sheet Overlay (Siri/ChatGPT style) */}
      <AnimatePresence>
        {isVoiceCompanionOpen && (
          <div id="voice-companion-overlay" className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-4 bg-black/95 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#18181b] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl relative flex flex-col items-center justify-between min-h-[485px]">
              
              {/* Header toolbar */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-xxs font-bold font-mono text-zinc-400 uppercase tracking-widest">Brainix Voice Companion</span>
                </div>
                <button
                  onClick={() => {
                    stopVoiceListening();
                    window.speechSynthesis.cancel();
                    setIsVoiceCompanionOpen(false);
                  }}
                  className="p-1 px-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>Close Live Mode</span>
                  <X size={14} />
                </button>
              </div>

              {/* Dynamic Holographic Audio Waveform Visualizer */}
              <div className="flex flex-col items-center justify-center space-y-4 my-4 w-full">
                <div className="h-28 flex items-center justify-center gap-1.5 px-4 w-full">
                  {/* 15 dynamic scale wave bars */}
                  {[...Array(15)].map((_, i) => {
                    const delays = [0.1, 0.4, 0.2, 0.6, 0.3, 0.8, 0.5, 0.7, 0.2, 0.9, 0.4, 0.6, 0.1, 0.5, 0.3];
                    return (
                      <motion.div
                        key={i}
                        animate={{
                          height: isListeningActive 
                            ? ["15px", "82px", "20px", "65px", "15px"] 
                            : voiceActiveId 
                            ? ["15px", "45px", "10px", "35px", "15px"]
                            : "12px"
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: isListeningActive ? 0.82 : 1.25,
                          delay: delays[i] * 0.4,
                          ease: "easeInOut"
                        }}
                        className={`w-1.5 rounded-full ${
                          isListeningActive 
                            ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]" 
                            : voiceActiveId 
                            ? "bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.4)]"
                            : "bg-zinc-700"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-xxs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">
                  {isListeningActive 
                    ? "Listening to your speech..." 
                    : voiceActiveId 
                    ? "Brainix speaking out loud..." 
                    : "Tap mic or say anything..."}
                </span>
              </div>

              {/* Live transcribing text display board */}
              <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 min-h-[100px] flex items-center justify-center text-center">
                <p className="text-sm font-sans text-zinc-100 leading-relaxed max-w-sm">
                  {recognitionTranscript || "“Tell me the weather in Mumbai and Delhi right now.”"}
                </p>
              </div>

              {/* Active controls footer block */}
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Talkback setting button */}
                  <button
                    onClick={() => {
                      setContinuousVoiceMode(!continuousVoiceMode);
                      if (continuousVoiceMode) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      continuousVoiceMode
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Volume2 size={14} className={continuousVoiceMode ? "animate-pulse" : ""} />
                    <span>Auto Talkback: {continuousVoiceMode ? "ON" : "OFF"}</span>
                  </button>

                  {/* Voice select toggler split button */}
                  <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0">
                    {(["female", "male", "robot"] as const).map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setVoiceType(gender)}
                        className={`flex-1 text-[10px] font-bold capitalize py-1.5 rounded-lg transition-all cursor-pointer ${
                          voiceType === gender
                            ? "bg-zinc-800 text-white shadow-xs"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  {/* Large center trigger mic circle */}
                  <button
                    onClick={() => {
                      if (isListeningActive) {
                        stopVoiceListening();
                      } else {
                        startVoiceListening();
                      }
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isListeningActive
                        ? "bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                        : "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isListeningActive ? <MicOff size={22} /> : <Mic size={22} />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
