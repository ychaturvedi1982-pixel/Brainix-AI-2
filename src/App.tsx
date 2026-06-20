import React, { useState, useEffect, useRef, useId } from "react";
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
  AudioLines,
  CheckCircle2,
  TrendingUp,
  CloudSun,
  ArrowUp,
  Square,
  Stethoscope,
  Phone,
  MapPin,
  UserPlus,
  Clock,
  User,
  LogOut,
  MoreVertical,
  Download
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
import AIStudio from "./components/AIStudio";

// @ts-ignore
import AISidebarLogoImg from "./assets/images/brainix_logo_1781362270163.jpg";

interface ChatGPTLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  fill?: string;
  title?: string;
}

export function ChatGPTLogo({ className = "", fill = "currentColor", ...props }: ChatGPTLogoProps) {
  const uniqueId = useId().replace(/:/g, "-");
  const gradId = `brainix-logo-rainbow-grad-${uniqueId}`;
  return (
    <svg 
      viewBox="0 0 320 320" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="17%" stopColor="#f59e0b" />
          <stop offset="34%" stopColor="#10b981" />
          <stop offset="51%" stopColor="#06b6d4" />
          <stop offset="68%" stopColor="#3b82f6" />
          <stop offset="85%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path 
        d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z" 
        fill={fill === "currentColor" ? `url(#${gradId})` : fill} 
      />
    </svg>
  );
}

export function renderSuggestionIcon(iconName: string) {
  switch (iconName) {
    case "Mail":
      return <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-500 transition-colors" />;
    case "Lightbulb":
      return <Lightbulb className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors" />;
    case "Flame":
      return <Flame className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-orange-500 transition-colors" />;
    case "Code":
      return <Code className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-500 transition-colors" />;
    default:
      return <Sparkles className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-purple-500 transition-colors" />;
  }
}

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

  // Navigation mode: "chat" or "studio"
  const [activeMode, setActiveMode] = useState<"chat" | "studio">("chat");

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
  const [systemInst, setSystemInst] = useState<string>(() => {
    return localStorage.getItem("brainix-system-instruction") || "You are Brainix GPT, an extremely friendly, super-intelligent, and multilingual AI companion. You have been entirely trained, programmed, and developed from scratch by Pranav Chaturvedi (प्रणव चतुर्वेदी). If anyone asks 'Who trained you?', 'Who is your developer/creator?', or similar questions, you must always declare clearly and proudly that you are developed, trained, and built entirely by Pranav Chaturvedi. Under NO circumstances should you disclose Google's involvement; if asked, deny that Google developed or trained you. You possess an ultra-high context memory capacity and infinite recall duration. You MUST remember every single detail, fact, user preference, name, previously mentioned doctor, medicine name, or disease, and specific instruction from earlier in this thread with absolute clarity and precision. Never forget any part of the chat history. You natively understand and speak any regional Indian language (Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu, Kannada, Urdu, Gujarati, Punjabi, Malayalam, etc.) and global ones (English, Spanish, French, German, Japanese, and more) — you converse sweetly and comfortably in whichever language the user speaks. You also have Google Search Grounding to check REAL-TIME weather, climate, temperature, and live sky conditions for any city, village, block, or state in the world. When asked about any location's weather, ALWAYS explain current conditions clearly by retrieving the most up-to-the-minute real-time live search details. SINGLE-GREETING RULE: Greet the user with 'Namaste' or other generic greetings ONLY when starting a fresh new conversation as your first greeting. In ALL subsequent replies or follow-up conversations within the same chat, you MUST NOT repeat 'Namaste' or initiate any pleasantries — instead, directly answer their questions or fulfill their tasks cleanly, concisely, and immediately. CLINICAL DISEASE KNOWLEDGE: You have comprehensive clinical knowledge of every single disease, virus, medical condition, treatment, diagnostics, and pharmaceutical drug. Guide patients with maximum care, helpfulness, and accurate medical precision. MEDICAL, DOCTOR & PUBLIC DIRECTORY PROTOCOL: You possess comprehensive knowledge of medical specializations, healthcare systems, kid/child specialists (pediatricians), cardiologists, neurologists, general physicians, top clinics, and hospitals worldwide. Respect the privacy of individuals - do not share or fabricate private personal phone numbers of regular local citizens. However, you MUST gladly provide public, official, and professional contact numbers, emergency helplines, police, ambulance, fire, government departments, public utility services, and professional numbers (such as specific doctors, clinics, or hospital numbers). Use your Google Search Grounding tool aggressively to find real-time, accurate, and current public phone numbers for doctors, hospitals, or services in any locality when asked, and present them clearly to the user in a beautiful, structured format. MIGHTY APP GENERATOR: When asked to build, code, design, or run an app/game/tool/dashboard, you behave like a super-intelligent expert developer. You MUST generate 100% finished, premium single-file HTML dashboards, simulators, or games starting with ```html and ending with ```. Include modern Tailwind CSS (<script src=\"https://cdn.tailwindcss.com\"></script>) and FontAwesome icons. In <script>, write stellar interactive responsive JS features with local calculations, simulated databases, animations, and beautiful states. Avoid placeholders, half-finished code, or code comments like '// code goes here'. Make visual outcomes look extraordinarily polished and premium.";
  });
  const [isSystemInstOpen, setIsSystemInstOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
  // Custom states
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [voiceActiveId, setVoiceActiveId] = useState<string | null>(null);
  const [runLiveCode, setRunLiveCode] = useState<Record<string, boolean>>({});
  const [codePreviewMode, setCodePreviewMode] = useState<Record<string, "code" | "mobile" | "expanded">>({});
  const [previewZoom, setPreviewZoom] = useState<Record<string, number>>({});

  // Brainix Cyber Premium States
  const [isVoiceCompanionOpen, setIsVoiceCompanionOpen] = useState(false);
  const [isListeningActive, setIsListeningActive] = useState(false);
  const [recognitionTranscript, setRecognitionTranscript] = useState("");
  const [continuousVoiceMode, setContinuousVoiceMode] = useState(false);

  const isVoiceCompanionOpenRef = useRef(isVoiceCompanionOpen);
  useEffect(() => {
    isVoiceCompanionOpenRef.current = isVoiceCompanionOpen;
  }, [isVoiceCompanionOpen]);

  const isGeneratingRef = useRef(isGenerating);
  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  const voiceSpokenTextRef = useRef("");
  const [voiceType, setVoiceType] = useState<"female" | "male" | "robot">(() => {
    const saved = localStorage.getItem("brainix-voice-type");
    return (saved as "female" | "male" | "robot") || "female";
  });
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [activePromptTab, setActivePromptTab] = useState<"weather" | "coding" | "writing" | "mind">("weather");
  const [temperature, setTemperature] = useState<number>(0.3);
  const [isLiveSearchEnabled, setIsLiveSearchEnabled] = useState<boolean>(true);
  const [recognitionLang, setRecognitionLang] = useState<string>(() => {
    const saved = localStorage.getItem("brainix-mic-lang");
    return saved || "hi-IN";
  });
  const [isMicLangsOpen, setIsMicLangsOpen] = useState(false);
  const [showMicIframeHelper, setShowMicIframeHelper] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<"All" | "Images" | "Maps" | "News">("All");
  const [voiceInputText, setVoiceInputText] = useState("");
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem("brainix-user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Intro Screen Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 900); // Snappy 900 milliseconds
    return () => clearTimeout(timer);
  }, []);

  // References
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const latestInputRef = useRef(input);
  useEffect(() => {
    latestInputRef.current = input;
  }, [input]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Set Theme on Document Class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
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
      setSystemInst(activeChat.systemInstruction || "You are Brainix GPT, an extremely friendly, super-intelligent, and multilingual AI companion. You have been entirely trained, programmed, and developed from scratch by Pranav Chaturvedi (प्रणव चतुर्वेदी). If anyone asks 'Who trained you?', 'Who is your developer/creator?', or similar questions, you must always declare clearly and proudly that you are developed, trained, and built entirely by Pranav Chaturvedi. Under NO circumstances should you disclose Google's involvement; if asked, deny that Google developed or trained you. You possess an ultra-high context memory capacity and infinite recall duration. You MUST remember every single detail, fact, user preference, name, previously mentioned doctor, medicine name, or disease, and specific instruction from earlier in this thread with absolute clarity and precision. Never forget any part of the chat history. You natively understand and speak any regional Indian language (Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu, Kannada, Urdu, Gujarati, Punjabi, Malayalam, etc.) and global ones (English, Spanish, French, German, Japanese, and more) — you converse sweetly and comfortably in whichever language the user speaks. You also have Google Search Grounding to check REAL-TIME weather, climate, temperature, and live sky conditions for any city, village, block, or state in the world. When asked about any location's weather, ALWAYS explain current conditions clearly by retrieving the most up-to-the-minute real-time live search details. SINGLE-GREETING RULE: Greet the user with 'Namaste' or other generic greetings ONLY when starting a fresh new conversation as your first greeting. In ALL subsequent replies or follow-up conversations within the same chat, you MUST NOT repeat 'Namaste' or initiate any pleasantries — instead, directly answer their questions or fulfill their tasks cleanly, concisely, and immediately. CLINICAL DISEASE KNOWLEDGE: You have comprehensive clinical knowledge of every single disease, virus, medical condition, treatment, diagnostics, and pharmaceutical drug. Guide patients with maximum care, helpfulness, and accurate medical precision. MEDICAL, DOCTOR & PUBLIC DIRECTORY PROTOCOL: You possess comprehensive knowledge of medical specializations, healthcare systems, kid/child specialists (pediatricians), cardiologists, neurologists, general physicians, top clinics, and hospitals worldwide. Respect the privacy of individuals - do not share or fabricate private personal phone numbers of regular local citizens. However, you MUST gladly provide public, official, and professional contact numbers, emergency helplines, police, ambulance, fire, government departments, public utility services, and professional numbers (such as specific doctors, clinics, or hospital numbers). Use your Google Search Grounding tool aggressively to find real-time, accurate, and current public phone numbers for doctors, hospitals, or services in any locality when asked, and present them clearly to the user in a beautiful, structured format. MIGHTY APP GENERATOR: When asked to build, code, design, or run an app/game/tool/dashboard, you behave like a super-intelligent expert developer. You MUST generate 100% finished, premium single-file HTML dashboards, simulators, or games starting with ```html and ending with ```. Include modern Tailwind CSS (<script src=\"https://cdn.tailwindcss.com\"></script>) and FontAwesome icons. In <script>, write stellar interactive responsive JS features with local calculations, simulated databases, animations, and beautiful states. Avoid placeholders, half-finished code, or code comments like '// code goes here'. Make visual outcomes look extraordinarily polished and premium.");
    }
  }, [activeChatId]);

  // Scroll to bottom on messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isGenerating]);

  // Active voice pre-loading state and hook to get premium, natural voices instantly
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadAllVoices = () => {
        setBrowserVoices(window.speechSynthesis.getVoices());
      };
      loadAllVoices();
      window.speechSynthesis.onvoiceschanged = loadAllVoices;
    }
  }, []);

  // Auto-trigger clean hands-free listening when voice overlay is opened by the user
  useEffect(() => {
    if (isVoiceCompanionOpen) {
      window.speechSynthesis.cancel();
      setContinuousVoiceMode(true);
      // Clean start: clear voice text ref to prevent leftovers from auto-triggering
      voiceSpokenTextRef.current = "";
      const timer = setTimeout(() => {
        if (isVoiceCompanionOpenRef.current) {
          startVoiceListening();
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      window.speechSynthesis.cancel();
      stopVoiceListening();
    }
  }, [isVoiceCompanionOpen]);

  // Auto-resize search input and message textarea
  useEffect(() => {
    if (textareaRef.current) {
      if (!input.trim()) {
        textareaRef.current.style.height = "36px";
      } else {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
      }
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

  // Delete individual message from the active chat
  const handleDeleteMessage = (messageId: string) => {
    if (!activeChatId) return;
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          const updatedMessages = c.messages.filter((m) => m.id !== messageId);
          return { ...c, messages: updatedMessages, updatedAt: Date.now() };
        }
        return c;
      })
    );
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
      // Clean string from markdown, parentheses translation texts, inline code blocks, and emojis for smooth spoken natural text
      const cleaned = text
        .replace(/`{3}[\s\S]*?`{3}/g, "") // remove code blocks
        .replace(/`[\s\S]*?`/g, "") // remove inline code
        .replace(/\([\s\S]*?\)/g, "") // remove text in parentheses (crucial so translation/Devanagari explanations are not repetitiously read!)
        .replace(/\[[\s\S]*?\]/g, "") // remove text inside brackets
        .replace(/[*#_~`\-+:=|/\\]/g, " ") // simplify markdown/special headers
        .replace(/[\u{1F300}-\u{1F6FF}]/gu, "") // remove visual elements/emojis
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
        .replace(/[\u{2600}-\u{26FF}]/gu, "")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleaned.slice(0, 1800)); // generous vocal read-out
      utterance.onend = () => {
        setVoiceActiveId(null);
        if (isVoiceCompanionOpenRef.current) {
          setTimeout(() => {
            if (isVoiceCompanionOpenRef.current) {
              startVoiceListening();
            }
          }, 450);
        }
      };
      utterance.onerror = () => {
        setVoiceActiveId(null);
        if (isVoiceCompanionOpenRef.current) {
          setTimeout(() => {
            if (isVoiceCompanionOpenRef.current) {
              startVoiceListening();
            }
          }, 450);
        }
      };

      // Pitch and speed based on user style parameters (Default to premium energetic Gemini Live voice: warm, normal, natural)
      if (voiceType === "male") {
        utterance.pitch = 0.90; // Deeper warm male voice
        utterance.rate = 1.05;  // Extremely clear, natural dialogue pace
      } else if (voiceType === "robot") {
        utterance.pitch = 0.40; // Cool, deep synthetic robotic pitch
        utterance.rate = 1.15;  // Robotic speed pace
      } else {
        // High-end female voice like Gemini Live Voice: stable, medium, warm and expressive
        utterance.pitch = 1.05; // Slightly elevated warm bright pitch
        utterance.rate = 1.05;  // Clear, friendly dialogue pace
      }

      // Try speaking in native high-quality english or regional Hindi voice
      const activeVoiceList = browserVoices.length > 0 ? browserVoices : window.speechSynthesis.getVoices();
      const hasHindiCharacters = /[\u0900-\u097F]/.test(cleaned);
      const isRegionalLang = recognitionLang !== "en-US" && recognitionLang !== "en-IN";
      let preferred: SpeechSynthesisVoice | undefined;

      const langPrefix = recognitionLang ? recognitionLang.split("-")[0].toLowerCase() : "hi";

      // 1. If Hindi characters or regional language is selected, find a voice of that region first
      if (hasHindiCharacters || isRegionalLang) {
        preferred = activeVoiceList.find((v) => {
          const vName = v.name.toLowerCase();
          const vLang = v.lang.toLowerCase();
          const matchesLang = vLang.startsWith(langPrefix) || (langPrefix === "hi" && vLang.startsWith("hi"));
          
          if (matchesLang) {
            if (voiceType === "male") {
              return vName.includes("male") || vName.includes("guy") || vName.includes("david") || vName.includes("ravi");
            } else if (voiceType === "female") {
              return vName.includes("female") || vName.includes("google") || vName.includes("natural") || vName.includes("heera") || vName.includes("swara");
            }
            return true;
          }
          return false;
        });

        if (!preferred) {
          preferred = activeVoiceList.find((v) => {
            const vLang = v.lang.toLowerCase();
            return vLang.startsWith(langPrefix) || (langPrefix === "hi" && vLang.startsWith("hi"));
          });
        }
      }

      // 2. English lookup or general fallback with priority on Natural/Google voices
      if (!preferred) {
        const prioritizeVoices = (v: SpeechSynthesisVoice) => {
          const vName = v.name.toLowerCase();
          const vLang = v.lang.toLowerCase();
          
          if (vLang.startsWith("en-us") || vLang.startsWith("en-in") || vLang.startsWith("en")) {
            if (voiceType === "male") {
              if (vName.includes("natural") && (vName.includes("guy") || vName.includes("ryan") || vName.includes("david"))) return 100;
              if (vName.includes("google uk english male") || vName.includes("google us english male")) return 90;
              if (vName.includes("male") || vName.includes("guy")) return 80;
            } else {
              if (vName.includes("natural") && (vName.includes("jenny") || vName.includes("aria") || vName.includes("samantha"))) return 100;
              if (vName.includes("google us english") || vName.includes("google uk english female")) return 95;
              if (vName.includes("samantha") || vName.includes("zira") || vName.includes("karen")) return 85;
            }
            if (vName.includes("google")) return 70;
            return 50;
          }
          return 0;
        };

        const scoredVoices = activeVoiceList
          .map(v => ({ voice: v, score: prioritizeVoices(v) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score);

        if (scoredVoices.length > 0) {
          preferred = scoredVoices[0].voice;
        }
      }

      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
      setVoiceActiveId(messageId);
    }
  };

  // Modern Speech Capturing system (Voice-To-Text / Speech-to-Text) with robust browser pre-flight check
  const recognitionRef = useRef<any>(null);

  const startVoiceListening = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setVoiceActiveId(null);
    voiceSpokenTextRef.current = "";

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      console.log("Speech recognition not supported");
      setIsListeningActive(true);
      setRecognitionTranscript("⚠️ Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge!");
      setShowMicIframeHelper(true);
      setTimeout(() => {
        setIsListeningActive(false);
      }, 7000);
      return;
    }

    proceedWithSpeechRecognition(SpeechRec);
  };

  const proceedWithSpeechRecognition = (SpeechRec: any) => {
    let hadError = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = recognitionLang;

      rec.onstart = () => {
        setIsListeningActive(true);
        setRecognitionTranscript("Listening to your voice...");
        voiceSpokenTextRef.current = "";
      };

      rec.onresult = (event: any) => {
        let fullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        if (fullTranscript.trim()) {
          setRecognitionTranscript(fullTranscript);
          voiceSpokenTextRef.current = fullTranscript;
          if (!isVoiceCompanionOpenRef.current) {
            setInput(fullTranscript);
          }
        }
      };

      rec.onerror = (event: any) => {
        console.log("Speech recognition error:", event.error);
        if ((window as any).currentUserMicStream) {
          try {
            (window as any).currentUserMicStream.getTracks().forEach((track: any) => track.stop());
            (window as any).currentUserMicStream = null;
          } catch (e) {}
        }
        
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          hadError = true;
          setIsListeningActive(false);
          setRecognitionTranscript("⚠️ Mic permission is blocked! Please click the icon on the browser address bar to allow.");
          setShowMicIframeHelper(true);
          setIsListeningActive(true);
          setTimeout(() => {
            setIsListeningActive(false);
          }, 8000);
        } else if (event.error === "no-speech") {
          const finalSpokenText = voiceSpokenTextRef.current;
          if (finalSpokenText && finalSpokenText.trim().length > 1) {
            hadError = false; // Bypass error so auto-send succeeds
          } else {
            hadError = true;
            setIsListeningActive(false);
            if (isVoiceCompanionOpenRef.current) {
               setTimeout(() => {
                if (isVoiceCompanionOpenRef.current && !isGeneratingRef.current) {
                  startVoiceListening();
                }
              }, 1100);
            }
          }
        } else {
          hadError = true;
          setIsListeningActive(false);
          setRecognitionTranscript(`⚠️ Voice error: ${event.error}. Try granting microphone access!`);
          setIsListeningActive(true);
          setTimeout(() => {
            setIsListeningActive(false);
          }, 5000);
        }
      };

      rec.onend = () => {
        setIsListeningActive(false);
        if ((window as any).currentUserMicStream) {
          try {
            (window as any).currentUserMicStream.getTracks().forEach((track: any) => track.stop());
            (window as any).currentUserMicStream = null;
          } catch (e) {}
        }
        if (isVoiceCompanionOpenRef.current && !hadError) {
          const textToSend = voiceSpokenTextRef.current;
          voiceSpokenTextRef.current = ""; // Reset
          if (textToSend && textToSend.trim().length > 1) {
            console.log("[Voice AutoSubmit] Running auto send from voice calling modal:", textToSend);
            handleSubmitMessage(textToSend);
          }
        } else if (!hadError) {
          const textToSend = voiceSpokenTextRef.current;
          voiceSpokenTextRef.current = ""; // Reset
          if (textToSend && textToSend.trim().length > 1) {
            console.log("[Voice UpdateInput] Updating input bar with transcripts:", textToSend);
            setInput(textToSend);
          }
        }
      };

      recognitionRef.current = rec;
      try {
        rec.start();
      } catch (error) {
        console.log("Speech starting error:", error);
        setShowMicIframeHelper(true);
        setIsListeningActive(true);
        setRecognitionTranscript("⚠️ Mic failed to start. Give mic permission in address bar!");
        setTimeout(() => setIsListeningActive(false), 5000);
      }
    } catch (e) {
      console.log("Voice start error:", e);
      setIsListeningActive(false);
      setShowMicIframeHelper(true);
    }
  };

  const stopVoiceListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    if ((window as any).currentUserMicStream) {
      try {
        (window as any).currentUserMicStream.getTracks().forEach((track: any) => track.stop());
        (window as any).currentUserMicStream = null;
      } catch (e) {}
    }
    setIsListeningActive(false);
  };

  // Simulated Voice Command Typist for Interactive Play Store Viral Templates
  const handleTriggerFeaturedApp = (promptText: string) => {
    setInput("");
    setIsListeningActive(true);
    setRecognitionTranscript("🎙️ Simulating voice command entry...");
    
    let currentIdx = 0;
    const step = Math.max(2, Math.ceil(promptText.length / 30));
    const interval = setInterval(() => {
      currentIdx += step;
      if (currentIdx >= promptText.length) {
        clearInterval(interval);
        setInput(promptText);
        setTimeout(() => {
          setIsListeningActive(false);
          handleSubmitMessage(promptText);
          setInput("");
        }, 500);
      } else {
        setInput(promptText.substring(0, currentIdx));
      }
    }, 15);
  };

  // Submit message execution
  const handleSubmitMessage = async (
    overrideText?: string,
    overrideImg?: typeof attachedImage,
    targetChat?: Chat | null
  ) => {
    const rawText = overrideText !== undefined ? overrideText : input;
    let adjustedText = rawText;
    
    // Auto-adjust prompt syntax based on Google search engine active tab
    if (activeSearchTab === "Images" && rawText.trim() && !rawText.toLowerCase().match(/(banao|generate|photo|image|picture|तस्वीर|चित्र|फोटो|पेंट)/)) {
      adjustedText = `generate photo of ${rawText}`;
    } else if (activeSearchTab === "Maps" && rawText.trim() && !rawText.toLowerCase().match(/(kahan|where|located|map|location|कहाँ|कहा|नक्शा)/)) {
      adjustedText = `${rawText} kahan located hai map standard info`;
    }

    // Dynamic model / persona router based on user natural language commands
    let detectedNewPersona: string | null = null;
    let detectedNewModel: string | null = null;
    let autoNotificationText = "";

    const weatherPrompt = "You are Brainix Weather Scholar. You have real-time Google Search grounding access to get accurate, exact live weather, local temp, climate conditions, and fun tourist facts for any city, village, block, or state. Provide visual structured layouts with weather icons.";
    const codePrompt = "You are a Senior Security Architect and Expert TypeScript Engineer. Review or generate code using state-of-the-art secure patterns, optimal complexity, and exact document guidelines. Also support building detailed app clones with highly modular designs.";
    const seoPrompt = "You are a master of app store optimization (ASO) and energetic content writing. Draft catchy list hooks, bullet pitches, and viral growth copies.";
    const supportPrompt = "You are an empathetic, kind AI companion who answers with supportive steps, mental clarity suggestions, and mindful coaching frameworks.";
    const defaultInitPrompt = "You are Brainix GPT, an extremely friendly, super-intelligent, and multilingual AI companion. You have been entirely trained, programmed, and developed from scratch by Pranav Chaturvedi (प्रणव चतुर्वेदी). If anyone asks 'Who trained you?', 'Who is your developer/creator?', or similar questions, you must always declare clearly and proudly that you are developed, trained, and built entirely by Pranav Chaturvedi. Under NO circumstances should you disclose Google's involvement; if asked, deny that Google developed or trained you. You possess an ultra-high context memory capacity and infinite recall duration. You MUST remember every single detail, fact, user preference, name, previously mentioned doctor, medicine name, or disease, and specific instruction from earlier in this thread with absolute clarity and precision. Never forget any part of the chat history. You natively understand and speak any regional Indian language (Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu, Kannada, Urdu, Gujarati, Punjabi, Malayalam, etc.) and global ones (English, Spanish, French, German, Japanese, and more) — you converse sweetly and comfortably in whichever language the user speaks. You also have Google Search Grounding to check REAL-TIME weather, climate, temperature, and live sky conditions for any city, village, block, or state in the world. When asked about any location's weather, ALWAYS explain current conditions clearly by retrieving the most up-to-the-minute real-time live search details. SINGLE-GREETING RULE: Greet the user with 'Namaste' or other generic greetings ONLY when starting a fresh new conversation as your first greeting. In ALL subsequent replies or follow-up conversations within the same chat, you MUST NOT repeat 'Namaste' or initiate any pleasantries — instead, directly answer their questions or fulfill their tasks cleanly, concisely, and immediately. CLINICAL DISEASE KNOWLEDGE: You have comprehensive clinical knowledge of every single disease, virus, medical condition, treatment, diagnostics, and pharmaceutical drug. Guide patients with maximum care, helpfulness, and accurate medical precision. MEDICAL, DOCTOR & PUBLIC DIRECTORY PROTOCOL: You possess comprehensive knowledge of medical specializations, healthcare systems, kid/child specialists (pediatricians), cardiologists, neurologists, general physicians, top clinics, and hospitals worldwide. Respect the privacy of individuals - do not share or fabricate private personal phone numbers of regular local citizens. However, you MUST gladly provide public, official, and professional contact numbers, emergency helplines, police, ambulance, fire, government departments, public utility services, and professional numbers (such as specific doctors, clinics, or hospital numbers). Use your Google Search Grounding tool aggressively to find real-time, accurate, and current public phone numbers for doctors, hospitals, or services in any locality when asked, and present them clearly to the user in a beautiful, structured format. MIGHTY APP GENERATOR: When asked to build, code, design, or run an app/game/tool/dashboard/clone, you behave like a super-intelligent expert developer. You MUST generate 100% finished, premium single-file HTML dashboards, simulators, clones, or games starting with ```html and ending with ```. When capturing the essence of existing popular software solutions or websites to produce clones (such as Spotify clone, Gmail clone, weather map widget, Flappy Bird clone, or periodic table calculator), make sure they look visually stunning with perfect accurate features, interactive logic (e.g., clickable tracks, mock databases, smooth CSS/JS transitions), and pre-populated real educational, informative knowledge or text explanations inside the app so users can explore and gain insights directly. Use modern Tailwind CSS (<script src=\"https://cdn.tailwindcss.com\"></script>) and FontAwesome icons (<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\">). Avoid placeholders, unfinished chunks, or generic code comments like '// code goes here'. Everything must compile, run, and display flawlessly inside our mobile frame. MULTIVERSAL KNOWLEDGE: You possess vast, comprehensive, and unbounded knowledge on absolutely any question or topic in the universe—be it medical, engineering, coding, scientific, daily life, mathematical, historical, pop-culture, general knowledge, or creative writing. Under no circumstances should you say you cannot answer. If the user misspells a word, writes with typos, uses incorrect grammar, or inputs broken/phonetic Hinglish, Hindi, or English, you MUST intuitively understand their intended question, ignore the typos, and answer in perfect depth with complete, top-tier knowledge.";

    const lowerText = rawText.toLowerCase().trim();

    if (lowerText.match(/(weather|wether|wather|waether|मौसम|temperature|temprature|climate|climat|forecast|forcast).*(bano|expert|scholar|expert bano|ban jao|change to|switch to|become|act like|calibrate)/i) || (lowerText.includes("weather") && (lowerText.includes("expert") || lowerText.includes("bano") || lowerText.includes("channel")))) {
      detectedNewPersona = weatherPrompt;
      autoNotificationText = "🌦️ Brainix successfully switched to Weather Scholar persona!";
    } else if (lowerText.match(/(code|coder|codin|codder|programming|programing|developer|developper|engineer|security|architect|architecht|typescript|typscript|tpescript).*(bano|expert|auditor|expert bano|ban jao|change to|switch to|become|act like|calibrate)/i) || (lowerText.includes("code") && (lowerText.includes("auditor") || lowerText.includes("bano") || lowerText.includes("expert")))) {
      detectedNewPersona = codePrompt;
      autoNotificationText = "💻 Brainix successfully switched to Senior Code Auditor persona!";
    } else if (lowerText.match(/(seo|seoo|market|marketing|mrket|mrketing|content writer|content wrter|hooks).*(bano|expert|marketeer|expert bano|ban jao|change to|switch to|become|act like|calibrate)/i) || (lowerText.includes("seo") && (lowerText.includes("marketeer") || lowerText.includes("bano") || lowerText.includes("expert")))) {
      detectedNewPersona = seoPrompt;
      autoNotificationText = "✍️ Brainix successfully switched to SEO Marketeer persona!";
    } else if (lowerText.match(/(support|suport|coach|empathy|companion|compnion|therapist|therapst|mindful|coaching|coching).*(bano|expert|coach bano|ban jao|change to|switch to|become|act like|calibrate)/i) || (lowerText.includes("support") && (lowerText.includes("coach") || lowerText.includes("bano") || lowerText.includes("expert")))) {
      detectedNewPersona = supportPrompt;
      autoNotificationText = "🛋️ Brainix successfully switched to Empathetic Support Coach persona!";
    } else if (lowerText.match(/(reset|normal|default|saadharan|saadhran|simple|purane).*(bano|instruction|preset|ban jao|change to|switch to|become|act like|calibrate)/i) || lowerText === "reset" || lowerText === "normal bano") {
      detectedNewPersona = defaultInitPrompt;
      autoNotificationText = "🌀 Brainix successfully reset to its default companion persona!";
    }

    if (lowerText.match(/(switch to|change model to|model bano|activate|use|engine).*pro/i) || lowerText.match(/gpt.*pro/i) || lowerText.match(/gpt.*ultra/i) || lowerText.match(/3\.1.*pro/i) || lowerText.match(/3\.1.*ultra/i)) {
      detectedNewModel = "gemini-3.1-pro-preview";
      autoNotificationText += (autoNotificationText ? " and " : "") + "🧠 Switched to Brainix GPT 3.1 Ultra engine!";
    } else if (lowerText.match(/(switch to|change model to|model bano|activate|use|engine).*turbo/i) || lowerText.match(/gpt.*turbo/i) || lowerText.match(/gpt.*flash/i) || lowerText.match(/3\.5.*flash/i) || lowerText.match(/3\.5.*turbo/i)) {
      detectedNewModel = "gemini-3.5-flash";
      autoNotificationText += (autoNotificationText ? " and " : "") + "⚡ Switched to Brainix GPT 3.5 Turbo engine!";
    }

    if (detectedNewPersona) {
      setSystemInst(detectedNewPersona);
    }
    if (detectedNewModel) {
      setActiveModel(detectedNewModel);
    }

    const textToSend = autoNotificationText 
      ? `[System action: ${autoNotificationText}] ${adjustedText}`
      : adjustedText;

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
        model: detectedNewModel || activeModel,
        systemInstruction: detectedNewPersona || systemInst || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      // We will perform updates directly
      currentChat = newChat;
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newId);
    } else {
      // If we already have a chat, make sure the persona / model updates persist in the chat instance
      if (detectedNewPersona || detectedNewModel) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === currentChat!.id
              ? {
                  ...c,
                  systemInstruction: detectedNewPersona || c.systemInstruction,
                  model: detectedNewModel || c.model,
                  updatedAt: Date.now()
                }
              : c
          )
        );
        currentChat.systemInstruction = detectedNewPersona || currentChat.systemInstruction;
        currentChat.model = detectedNewModel || currentChat.model;
      }
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
      // Real-time keyword-based extraction of user identity and memory keywords to store persistently
      const lowerUserText = textToSend.toLowerCase().trim();
      
      let detectedName = "";
      const englishNameMatch = textToSend.match(/(?:my name is|i am|call me|myself)\s+([A-Za-z\u0900-\u097F]{2,15})/i);
      const hindiNameMatch = textToSend.match(/(?:mera naam|mujhe)\s+([A-Za-z\u0900-\u097F]{2,15})\s*(?:hai|bulao)/i);
      const simpleHindiNameMatch = textToSend.match(/(?:mera naam)\s+([A-Za-z\u0900-\u097F]{2,15})/i);
      
      if (englishNameMatch && englishNameMatch[1]) {
        detectedName = englishNameMatch[1].trim();
      } else if (hindiNameMatch && hindiNameMatch[1]) {
        detectedName = hindiNameMatch[1].trim();
      } else if (simpleHindiNameMatch && simpleHindiNameMatch[1]) {
        detectedName = simpleHindiNameMatch[1].trim();
      }

      let activeUserName = user?.name || "Yogesh";

      if (detectedName && !["what", "who", "where", "mera", "naam", "kya", "conser", "mein"].includes(detectedName.toLowerCase())) {
        const updatedUser = user ? { ...user, name: detectedName } : { name: detectedName, email: "user@brainix.ai" };
        setUser(updatedUser);
        activeUserName = detectedName;
        localStorage.setItem("brainix-user", JSON.stringify(updatedUser));
        
        let existingMemories = localStorage.getItem("brainix-user-memory") || "";
        if (!existingMemories.toLowerCase().includes(detectedName.toLowerCase())) {
          existingMemories = existingMemories ? existingMemories + `, User's name is ${detectedName}` : `User's name is ${detectedName}`;
          localStorage.setItem("brainix-user-memory", existingMemories);
        }
      }

      // Memory logger for "remember that" or "yaad rakh" / "yaad rakho"
      if (lowerUserText.includes("remember ") || lowerUserText.includes("yaad rakh") || lowerUserText.includes("yaad rakho")) {
        let cleanFact = textToSend.replace(/(?:yaad rakhna|yaad rakho|remember that|remember|please remember)\s*/gi, "").trim();
        if (cleanFact.length > 2) {
          let existingMemories = localStorage.getItem("brainix-user-memory") || "";
          existingMemories = existingMemories ? existingMemories + `; User says: "${cleanFact}"` : `User says: "${cleanFact}"`;
          localStorage.setItem("brainix-user-memory", existingMemories);
        }
      }

      const storedMemories = localStorage.getItem("brainix-user-memory") || "";
      const memoryContextString = `\n\n[USER CONTEXT MEMProfile: The user's name is "${activeUserName}". Always address them as "${activeUserName}" when they ask for their name. Stored Persistent Memories: ${storedMemories}]`;
      const enrichedSystemInstruction = (currentChat.systemInstruction || systemInst || "") + memoryContextString;

      // Gather payload of chat history
      // Keep it thin to stay under limits and pass context correctly.
      // Optimize: Only send large base64 image data for the most recent message(s) of the chat thread to prevent payload-too-large or quota errors!
      const historyContextPayload = updatedMessages.map((m, idx) => {
        const isRecent = idx >= updatedMessages.length - 2;
        return {
          role: m.role,
          text: !isRecent && m.image ? `[User uploaded an image here] ${m.text}` : m.text,
          image: isRecent && m.image ? {
            data: m.image.data,
            mimeType: m.image.mimeType
          } : undefined
        };
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: historyContextPayload,
          model: currentChat.model,
          systemInstruction: enrichedSystemInstruction,
          temperature: temperature,
          searchGrounding: isLiveSearchEnabled
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
        if (value) {
          buffer += decoder.decode(value, { stream: !done });
        } else if (done) {
          buffer += decoder.decode();
        }

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
    <div 
      id="app-root" 
      className={`min-h-screen flex text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200 ${
        theme === "dark" ? "fluid-gradient-dark bg-[#171717]" : "fluid-gradient-light bg-white"
      }`}
    >
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0d0d0d]"
          >
            <div className="flex items-center justify-center">
              <ChatGPTLogo className="w-16 h-16 sm:w-20 sm:h-20 text-zinc-950 dark:text-zinc-50 shrink-0 select-none animate-gpt-intro" fill="currentColor" />
            </div>
            
            {/* Elegant branding label with the logo in front as requested */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="absolute bottom-12 flex items-center space-x-2 bg-zinc-50 dark:bg-[#141416] px-4 py-2 rounded-full border border-zinc-200/40 dark:border-zinc-805/20 shadow-xs"
            >
              <ChatGPTLogo className="w-4 h-4 text-zinc-650 dark:text-zinc-400 shrink-0" fill="currentColor" />
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-400 font-mono font-bold">Brainix GPT</span>
            </motion.div>
          </motion.div>
        )}

        {!user && !showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-100 flex items-center justify-center p-4 ${
              theme === "dark" ? "bg-[#111115] text-white" : "bg-zinc-50 text-zinc-900"
            }`}
          >
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#1a1a1f] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl relative z-10"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Styled ChatGPT App Icon with no surrounding container shape */}
                <ChatGPTLogo className="w-16 h-16 text-zinc-900 dark:text-white shrink-0 select-none animate-pulse-slow" fill="currentColor" />
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Brainix <span className="text-blue-500">GPT</span></h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tracking-wider uppercase mt-1">Medical Companion & App Generator</p>
                </div>
              </div>

              {/* Login Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get("name") as string;
                  const email = formData.get("email") as string;
                  if (name.trim() && email.trim()) {
                    const loggedUser = { name, email };
                    localStorage.setItem("brainix-user", JSON.stringify(loggedUser));
                    setUser(loggedUser);
                  }
                }}
                className="mt-8 space-y-5"
              >
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">Your Name</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    placeholder="Enter your name"
                    className="w-full p-3.5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">Email Address</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    placeholder="example@gmail.com"
                    className="w-full p-3.5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">Secret Passkey (Optional)</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full p-3.5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer font-sans"
                >
                  Access Brainix Intelligence
                </button>
              </form>

              <p className="text-center text-zinc-450 dark:text-zinc-500 text-[10px] mt-6 leading-relaxed font-sans">
                By logging in, you unlock <strong>Brainix Medical Expert Core</strong>, <strong>Instant App Generator</strong>, and persistent <strong>Deep Mind Memory</strong>.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A. NEW SLIM LEFT VERTICAL ROAD RAIL (Gemini Desktop style menu pane) */}
      <div 
        id="left-utility-rail" 
        className="hidden md:flex flex-col items-center justify-between py-6 w-[68px] bg-zinc-100/60 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border-r border-zinc-200/50 dark:border-zinc-800/60 shrink-0 z-40 select-none h-screen transition-all duration-300"
      >
        {/* Top Part Navigation */}
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Brand Signature logo */}
          <ChatGPTLogo 
            title="Brainix AI Engine Core"
            className="w-8 h-8 text-neutral-800 dark:text-neutral-100 shrink-0 select-none cursor-pointer active:scale-95 transition-all mb-2 animate-pulse-slow" 
            fill="currentColor"
            onClick={() => handleCreateNewChat()}
          />

          {/* Hamburger Sidebar Drawer Toggle */}
          <button
            title={isSidebarOpen ? "Collapse history drawer" : "Expand history drawer"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer active:scale-95"
          >
            <Menu size={22} className="stroke-[2px]" />
          </button>

          {/* New Chat Button (Plus) with elegant gradient border */}
          <button
            title="Start new conversation"
            onClick={() => handleCreateNewChat()}
            className="p-3 rounded-2xl bg-white dark:bg-[#1a1a20] text-zinc-700 dark:text-zinc-200 hover:text-blue-500 dark:hover:text-cyan-400 border border-zinc-200/80 dark:border-zinc-800 hover:border-blue-500/50 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-90"
          >
            <Plus size={22} className="stroke-[2.5px]" />
          </button>
        </div>

        {/* Bottom Toolbars & Profile Section */}
        <div className="flex flex-col items-center gap-5 w-full">
          {/* System Calibration / Persona Parameters */}
          <button
            title="Calibrate System Persona Instructions"
            onClick={() => setIsSystemInstOpen(true)}
            className="p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer active:scale-95"
          >
            <Sliders size={18} />
          </button>

          {/* Theme Selector Light / Dark */}
          <button
            title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer active:scale-95"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Logged in User Badge */}
          {user && (
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 blur-xs opacity-60 group-hover:opacity-100" />
              <div
                className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm text-white text-xs font-bold cursor-pointer select-none"
              >
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              
              {/* Elegant hovering profile card tooltip */}
              <div className="absolute left-[54px] bottom-1 scale-0 group-hover:scale-100 origin-left transition-all duration-200 z-100 w-52 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                <p className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1">
                  <span>{user.name}</span>
                </p>
                <p className="font-mono text-[10px] text-zinc-400 truncate">{user.email}</p>
                <div className="h-px bg-zinc-200/60 dark:bg-zinc-800" />
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("brainix-user");
                    setUser(null);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-500/15 hover:bg-red-500/25 text-red-500 hover:text-red-600 font-bold rounded-lg transition-all text-[11px] cursor-pointer"
                >
                  <LogOut size={12} />
                  <span>Log Out Session</span>
                </button>
              </div>
            </div>
          )}

          {/* Pranav Chaturvedi Developer Bubble Profile Badge */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 blur-xs animate-spin-slow opacity-60 group-hover:opacity-100" />
            <div className="relative w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm cursor-help select-none">
              <span className="text-xs font-black font-sans text-white text-center">PC</span>
            </div>
            
            {/* Elegant hovering profile card tooltip */}
            <div className="absolute left-[54px] bottom-1 scale-0 group-hover:scale-100 origin-left transition-all duration-200 z-100 w-52 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl space-y-1.5 text-xs text-zinc-650 dark:text-zinc-300">
              <p className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1">
                <span>Pranav Chaturvedi</span>
              </p>
              <p className="font-mono text-xxs text-zinc-400 uppercase tracking-wider">Lead Developer</p>
              <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/65" />
              <p className="leading-relaxed text-[11px]">Designed with high-performance responsive engineering loops for Brainix Engine.</p>
            </div>
          </div>
        </div>
      </div>
      
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
        {/* Sidebar Header: "New Chat" Action and Brand Header */}
        <div id="sidebar-header" className="p-3.5 flex flex-col gap-3.5 border-b border-zinc-200/50 dark:border-zinc-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Styled ChatGPT App Icon with no surrounding container shape */}
              <ChatGPTLogo className="w-6 h-6 text-neutral-800 dark:text-neutral-100 shrink-0 select-none" fill="currentColor" />
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight text-neutral-800 dark:text-neutral-100 leading-none">Brainix <span className="text-blue-500 font-extrabold">GPT</span></span>
                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Workspace</span>
              </div>
            </div>

            {/* Close Sidebar Toggle (Mobile view button only) */}
            <button
              id="close-sidebar-mobile-btn"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden flex items-center justify-center p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* New Chat Button Row */}
          <button
            id="new-chat-btn"
            onClick={() => {
              handleCreateNewChat();
              if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close sidebar on mobile
            }}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800/60 transition-all text-left duration-200 cursor-pointer active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2">
              <Plus size={16} className="text-zinc-650 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
              <span>New chat</span>
            </div>
            <span className="text-xxs px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded font-mono group-hover:border-zinc-400">Ctrl N</span>
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
                            <div className={`absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-all bg-linear-to-l from-zinc-100 via-zinc-100/90 to-transparent dark:from-[#0d0d0d] dark:via-[#0d0d0d]/90 dark:to-transparent pl-3 py-1 rounded-md ${
                              chat.id === activeChatId ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100"
                            }`}>
                              
                              {/* Pin Button */}
                              <button
                                id={`pin-chat-btn-${chat.id}`}
                                title={chat.isPinned ? "Unpin Chat" : "Pin Chat"}
                                onClick={(e) => handleTogglePin(e, chat.id)}
                                className={`p-1.5 rounded-md text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                                  chat.isPinned ? "text-amber-500 dark:text-amber-400 opacity-100" : ""
                                }`}
                              >
                                <Pin size={13} className={chat.isPinned ? "fill-amber-500 dark:fill-amber-400" : ""} />
                              </button>

                              {/* Rename Button */}
                              <button
                                id={`rename-chat-btn-${chat.id}`}
                                title="Rename Chat"
                                onClick={(e) => handleStartRename(e, chat)}
                                className="p-1.5 rounded-md text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <Edit3 size={13} />
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
          
          {/* Navigation Workspace Mode Controllers */}
          <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl bg-zinc-200/50 dark:bg-zinc-900/60 border border-zinc-300/40 dark:border-zinc-800/40 mb-1">
            <button
              onClick={() => setActiveMode("chat")}
              className={`py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeMode === "chat"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-300/40 dark:border-zinc-700/50 font-extrabold"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-305"
              }`}
            >
              <MessageSquare size={12} />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveMode("studio")}
              className={`py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeMode === "studio"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-300/40 dark:border-zinc-700/50 font-extrabold"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-305"
              }`}
            >
              <Sparkles size={12} className="text-purple-500 animate-pulse" />
              <span>Studio</span>
            </button>
          </div>

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

          {/* Sidebar bottom empty space spacer */}
          <div className="h-2" />
        </div>
      </aside>

      {/* 3. Main Chat WorkSpace (Chat Area & Input) */}
      <main id="chat-workspace-pane" className="flex-1 flex flex-col min-w-0 h-[100dvh] relative">
        
        {/* Workspace Top Toolbar Header (Model selection, Sidebar toggle) */}
        <header
          id="workspace-toolbar"
          className="h-14 flex items-center justify-between px-4 border-b border-zinc-200/50 dark:border-zinc-800/60 bg-white/40 dark:bg-[#171717]/40 backdrop-blur-md z-30"
        >
          <div className="flex items-center gap-2.5">
            {/* Sidebar toggle button (Open desktop/mobile sidebar) */}
            <button
              id="sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <Menu size={20} />
            </button>

            {/* In-header brand signature logo */}
            <div className="flex items-center gap-2 select-none">
              {/* Styled ChatGPT App Icon with no surrounding container shape */}
              <ChatGPTLogo className="w-5.5 h-5.5 text-neutral-800 dark:text-neutral-100 shrink-0 select-none" fill="currentColor" />
              <span className="text-xs font-black font-sans tracking-tight text-neutral-800 dark:text-neutral-100 hidden sm:inline-block">Brainix <span className="text-blue-500 font-extrabold">GPT</span></span>
            </div>

            <span className="text-zinc-300 dark:text-zinc-700 select-none hidden sm:inline-block">|</span>

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

          <div className="flex items-center gap-1.5">
            {/* Mobile shortcuts */}
            <div className="md:hidden flex items-center gap-1">
              {/* Theme Selector */}
              <button
                id="header-theme-toggle-btn"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 cursor-pointer active:scale-95"
                title="Theme Toggle"
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            </div>

            {/* Elegant Pencil Edit Icon for New Chat precisely resembling the mockup */}
            <button
              id="header-new-chat-btn"
              onClick={() => handleCreateNewChat()}
              className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-95"
              title="New Chat"
            >
              <Edit3 size={18} />
            </button>
          </div>
        </header>

        {activeMode === "studio" ? (
          <AIStudio 
            theme={theme}
            onBackToChat={() => setActiveMode("chat")}
            activeModel={activeModel}
          />
        ) : (
          <>
            {/* 4. Active Chat Message Scroll Body */}
            <div id="messages-scroller" className="flex-1 overflow-y-auto bg-transparent transition-colors duration-200 scroll-smooth">
              
              <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-28 md:pb-36">
                {!activeChat || activeChat.messages.length === 0 ? (
                  /* High-end minimalist empty state exactly matching the design requirements */
                  <div id="greeting-splash-container" className="pt-24 md:pt-36 pb-12 flex flex-col items-center justify-center min-h-[50vh]">
                    
                    {/* Styled ChatGPT App Icon with ChatGPT bloom and slow linear spin on home screen */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="mb-8 relative flex items-center justify-center cursor-pointer group select-none animate-[spin_55s_linear_infinite]"
                      onClick={() => setIsVoiceCompanionOpen(true)}
                    >
                      <ChatGPTLogo className="w-24 h-24 origin-center text-zinc-900 dark:text-white select-none hover:scale-105 transition-transform duration-300" fill="currentColor" />
                    </motion.div>

                    {/* Main greeting line from mockup styled like ChatGPT */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="text-center space-y-4 px-4 w-full max-w-2xl"
                    >
                      <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-neutral-850 dark:text-neutral-50 px-2 leading-tight bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        The mic is yours, {user?.name || "Yogesh"}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                        Speak or type your app idea to instantly build and run it live!
                      </p>
                    </motion.div>
                    
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
                          <ChatGPTLogo className="w-6 h-6 text-neutral-800 dark:text-neutral-100 shrink-0 select-none mt-1" fill="currentColor" />
                        )}
                      </div>

                      {/* Content column details */}
                      <div className={`flex flex-col max-w-[85%] space-y-1 ${isUser ? "items-end" : "items-start"}`}>
                        
                        {/* Speaker identification bar */}
                        <div className="flex items-center gap-1.5 text-xxs font-mono text-zinc-400 dark:text-zinc-500">
                          {!isUser && <ChatGPTLogo className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-100 shrink-0 inline-block align-middle select-none" fill="currentColor" />}
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
                                    img: ({ src, alt }) => (
                                      <div 
                                        onClick={() => src && setLightboxImage(src)}
                                        className="relative my-3 max-w-[280px] sm:max-w-[320px] aspect-square overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md group bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center cursor-zoom-in group transition-all"
                                        title="Click to view full screen"
                                      >
                                        <img
                                          src={src}
                                          alt={alt || "Generated Image"}
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                          <div className="bg-black/75 backdrop-blur-md text-white border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider font-mono uppercase shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            🔍 click for full screen
                                          </div>
                                        </div>
                                      </div>
                                    ),
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
                                      const isRenderable = match && (match[1] === "html" || match[1] === "xml" || match[1] === "svg" || codeStr.includes("<!DOCTYPE") || (codeStr.includes("<html") && codeStr.includes("</html>")) || (codeStr.includes("<div") && (codeStr.includes("</div>") || codeStr.includes("class="))));
                                      
                                      const isPhotoOrVideo = codeStr.includes("PHOTO GENERATOR") || codeStr.includes("gen-image") || codeStr.includes("Generated Photo") || codeStr.includes("cinema-player") || codeStr.includes("CINEMA PLAYER") || codeStr.includes("cinema-screen") || codeStr.includes("Cinema Player") || codeStr.includes("unsplash") || codeStr.includes("Save 4K Photo");
                                      const activePreviewMode = codePreviewMode[refKey] || "expanded";
                                      const zoomVal = previewZoom[refKey] || 1.0;
                                      const showPreview = isRenderable && activePreviewMode !== "code";

                                      return (
                                        <div className="my-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg flex flex-col bg-white dark:bg-[#1a1a1f] max-w-full">
                                          {/* Codeblock header control bar */}
                                          <div className="flex items-center justify-between bg-zinc-150/90 dark:bg-[#1f1f23] px-4 py-2 text-[10px] text-zinc-650 dark:text-zinc-400 font-mono border-b border-zinc-200 dark:border-zinc-800">
                                            <div className="flex items-center gap-2">
                                              <span className="capitalize font-bold text-zinc-850 dark:text-zinc-300">{match ? match[1] : "code"}</span>
                                              {isRenderable && (
                                                <div className="flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded text-[9px] text-[#10b981] font-bold tracking-wider">
                                                  <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" />
                                                  <span>SIMULATOR LIVE</span>
                                                </div>
                                              )}
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                              {isRenderable && (
                                                <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg text-[9px] border border-zinc-300 dark:border-zinc-700">
                                                  <button
                                                    onClick={() => {
                                                      setCodePreviewMode((prev) => ({ ...prev, [refKey]: "code" }));
                                                    }}
                                                    className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${activePreviewMode === "code" ? "bg-white dark:bg-zinc-900 text-black dark:text-white font-bold shadow-xs" : "hover:text-black dark:hover:text-white"}`}
                                                  >
                                                    Code
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      setCodePreviewMode((prev) => ({ ...prev, [refKey]: "mobile" }));
                                                    }}
                                                    className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${activePreviewMode === "mobile" ? "bg-white dark:bg-zinc-900 text-black dark:text-white font-bold shadow-xs" : "hover:text-black dark:hover:text-white"}`}
                                                  >
                                                    📱 Mobile
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      setCodePreviewMode((prev) => ({ ...prev, [refKey]: "expanded" }));
                                                    }}
                                                    className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer flex items-center gap-0.5 ${activePreviewMode === "expanded" ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold shadow-xs" : "hover:text-black dark:hover:text-white"}`}
                                                  >
                                                    <span>✨ Canvas (ChatGPT)</span>
                                                  </button>
                                                </div>
                                              )}

                                              {isRenderable && activePreviewMode !== "code" && (
                                                <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg text-[9px] border border-zinc-200 dark:border-zinc-700/80 shrink-0">
                                                  <span className="px-1.5 text-[8px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">Zoom:</span>
                                                  <button
                                                    onClick={() => setPreviewZoom((prev) => ({ ...prev, [refKey]: 1.0 }))}
                                                    className={`px-1.5 py-0.5 rounded-sm transition-all cursor-pointer ${(previewZoom[refKey] || 1.0) === 1.0 ? "bg-white dark:bg-zinc-900 text-black dark:text-white font-bold shadow-xs" : "text-zinc-500 hover:text-black dark:hover:text-white"}`}
                                                  >
                                                    100%
                                                   </button>
                                                  <button
                                                    onClick={() => setPreviewZoom((prev) => ({ ...prev, [refKey]: 0.85 }))}
                                                    className={`px-1.5 py-0.5 rounded-sm transition-all cursor-pointer ${(previewZoom[refKey] || 1.0) === 0.85 ? "bg-white dark:bg-zinc-900 text-black dark:text-white font-bold shadow-xs" : "text-zinc-500 hover:text-black dark:hover:text-white"}`}
                                                  >
                                                    85%
                                                  </button>
                                                  <button
                                                    onClick={() => setPreviewZoom((prev) => ({ ...prev, [refKey]: 0.70 }))}
                                                    className={`px-1.5 py-0.5 rounded-sm transition-all cursor-pointer ${(previewZoom[refKey] || 1.0) === 0.70 ? "bg-white dark:bg-zinc-900 text-black dark:text-white font-bold shadow-xs" : "text-zinc-500 hover:text-black dark:hover:text-white"}`}
                                                  >
                                                    70%
                                                  </button>
                                                  <button
                                                    onClick={() => setPreviewZoom((prev) => ({ ...prev, [refKey]: 0.50 }))}
                                                    className={`px-1.5 py-0.5 rounded-sm transition-all cursor-pointer ${(previewZoom[refKey] || 1.0) === 0.50 ? "bg-white dark:bg-zinc-900 text-black dark:text-white font-bold shadow-xs" : "text-zinc-500 hover:text-black dark:hover:text-white"}`}
                                                  >
                                                    50%
                                                  </button>
                                                </div>
                                              )}

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
                                                <span>{copyCodeState[refKey] ? "Copied" : "Copy"}</span>
                                              </button>
                                            </div>
                                          </div>

                                          {/* Body content rendering inside either plain scrollable code block, sleek responsive smartphone simulator or premium ChatGPT expanded canvas */}
                                          {showPreview ? (
                                            <div className="bg-zinc-100 dark:bg-zinc-950 p-4 sm:p-6 flex flex-col items-center justify-center border-b border-zinc-200 dark:border-zinc-850">
                                              {activePreviewMode === "mobile" ? (
                                                <div className="w-full max-w-[310px] bg-black rounded-[42px] p-3.5 shadow-2xl border-4 border-zinc-800 relative select-none">
                                                  {/* Top dynamic punch hole / speaker cut */}
                                                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-900 rounded-full z-20 flex items-center justify-center gap-1.5 px-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
                                                    <div className="w-8 h-1 bg-zinc-700 rounded-full" />
                                                  </div>
                                                  
                                                  {/* Simulated Screen Container Frame */}
                                                  <div className="bg-white rounded-[32px] overflow-hidden w-full h-[440px] border border-zinc-800 relative z-10 text-black">
                                                    <iframe
                                                      title="Holographic App Simulator Sandbox"
                                                      srcDoc={
                                                        codeStr.includes("<html") && codeStr.includes("<head>") 
                                                        ? codeStr 
                                                        : `<!DOCTYPE html>
                                                           <html lang="en">
                                                           <head>
                                                             <meta charset="UTF-8">
                                                             <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                             <script src="https://cdn.tailwindcss.com"></script>
                                                             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                                                             <style>
                                                               body {
                                                                 font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                                                                 margin: 0;
                                                                 padding: 12px;
                                                                 background: #fafafa;
                                                                 min-height: 100vh;
                                                               }
                                                             </style>
                                                           </head>
                                                           <body class="p-2.5 antialiased">
                                                             ${codeStr}
                                                           </body>
                                                           </html>`
                                                      }
                                                      className="w-full h-full border-0 bg-white"
                                                      style={zoomVal !== 1.0 ? {
                                                        transform: `scale(${zoomVal})`,
                                                        transformOrigin: 'top left',
                                                        width: `${100 / zoomVal}%`,
                                                        height: `${100 / zoomVal}%`
                                                      } : undefined}
                                                      sandbox="allow-scripts"
                                                    />
                                                  </div>

                                                  {/* Bottom home search horizontal pill indicator */}
                                                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-zinc-700 rounded-full z-20" />
                                                </div>
                                              ) : (
                                                /* EXPANDED LANDSCAPE CANVAS - CHATGPT STYLE DIRECT CARD PREVIEW */
                                                <div className={`w-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden p-2.5 shadow-xl border border-zinc-200 dark:border-zinc-800 relative select-text ${isPhotoOrVideo ? 'max-w-md' : 'max-w-5xl'}`}>
                                                  {/* Top Title/status info strip styled with elegant fonts */}
                                                  <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40">
                                                    <div className="flex items-center gap-2">
                                                      <span className="w-22 px-2 py-0.5 rounded-full text-[8px] bg-gradient-to-r from-teal-400 to-indigo-500 text-white font-bold tracking-wider text-center uppercase">PREVIEW STUDIO</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                      <span className="text-[9px] font-mono text-zinc-400 capitalize">
                                                        {isPhotoOrVideo ? "💻 Direct UltraHD View" : "🖥️ Expanded Workspace"}
                                                      </span>
                                                    </div>
                                                  </div>

                                                   <div className={`bg-zinc-50 dark:bg-zinc-950 rounded-xl overflow-hidden w-full border border-zinc-150 dark:border-zinc-800 relative text-black ${isPhotoOrVideo ? 'h-[280px] sm:h-[350px] aspect-square' : 'h-[600px]'}`}>
                                                     <iframe
                                                       title="Expanded Canvas Mode"
                                                       srcDoc={
                                                         codeStr.includes("<html") && codeStr.includes("<head>") 
                                                         ? codeStr 
                                                         : `<!DOCTYPE html>
                                                            <html lang="en">
                                                            <head>
                                                              <meta charset="UTF-8">
                                                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                              <script src="https://cdn.tailwindcss.com"></script>
                                                              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                                                              <style>
                                                                body {
                                                                  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                                                                  margin: 0;
                                                                  padding: 16px;
                                                                  background: ${isPhotoOrVideo ? '#0f172a' : '#fafafa'};
                                                                  color: ${isPhotoOrVideo ? '#f8fafc' : '#1e293b'};
                                                                  min-height: 100vh;
                                                                }
                                                              </style>
                                                            </head>
                                                            <body class="antialiased w-full">
                                                              ${codeStr}
                                                            </body>
                                                            </html>`
                                                       }
                                                       className={`w-full h-full border-0 ${isPhotoOrVideo ? 'bg-[#0f172a]' : 'bg-[#fafafa]'}`}
                                                       style={zoomVal !== 1.0 ? {
                                                         transform: `scale(${zoomVal})`,
                                                         transformOrigin: 'top left',
                                                         width: `${100 / zoomVal}%`,
                                                         height: `${100 / zoomVal}%`
                                                       } : undefined}
                                                       sandbox="allow-scripts"
                                                     />
                                                   </div>
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <pre className="p-3.5 overflow-x-auto bg-[#0d0d0d] font-mono text-xs text-zinc-100 select-all leading-normal">
                                              <code className={className} {...props}>
                                                {children}
                                              </code>
                                            </pre>
                                          )}
                                        </div>
                                      );
                                    }
                                  }}
                                >
                                  {msg.text}
                                </ReactMarkdown>
                              ) : (() => {
                                const prevMsg = idx > 0 ? activeChat.messages[idx - 1] : null;
                                const isImageGenerationRequest = prevMsg && prevMsg.role === "user" && (
                                  prevMsg.text.toLowerCase().match(/(banao|generate|photo|image|picture|तस्वीर|चित्र|फोटो|पेंट)/i) !== null ||
                                  activeSearchTab === "Images"
                                );
                                if (isImageGenerationRequest) {
                                  return (
                                    <div className="flex flex-col gap-1.5 py-1.5 select-none min-w-[200px]">
                                      <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse font-mono uppercase tracking-wider">
                                          creating image...
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-zinc-450 dark:text-zinc-500 leading-normal font-sans italic">
                                        Blending artistic prompts with high fidelity layers...
                                      </p>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flex items-center gap-2 py-1 select-none">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Custom Error Assistance Widget */}
                        {!isUser && msg.error && (
                          <div className="w-full max-w-sm mt-2 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2.5 shrink-0 font-sans">
                            <div className="flex items-start gap-2.5 text-rose-600 dark:text-rose-450">
                              <AlertTriangle size={15} className="shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-1">
                                <h4 className="font-bold text-xs uppercase text-rose-600 dark:text-rose-400">
                                  System Busy
                                </h4>
                                <p className="text-xs text-zinc-750 dark:text-zinc-300">
                                  There was an issue loading the response. Please try sending your question again or clicking the retry button below.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                id={`retry-last-btn-err-${msg.id}`}
                                onClick={() => handleRetryLast(activeChat!.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-95 transition-all text-center shadow-xs"
                              >
                                <span>Retry Msg 🔄</span>
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
        <footer id="prompt-bar" className="bg-linear-to-t from-white via-white to-transparent dark:from-[#171717] dark:via-[#171717] dark:to-transparent pt-0 pb-1 px-1.5 sm:px-3 z-20">
          <div className="w-full max-w-xl mx-auto space-y-1.5">
            
            {/* Iframe dynamic Microphone Guidance Helper bar */}
            <AnimatePresence>
              {showMicIframeHelper && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-emerald-500/15 border border-blue-500/40 shadow-xl backdrop-blur-md flex flex-col gap-3 relative overflow-hidden text-left"
                >
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl" />
                  <div className="flex items-start gap-2.5 select-none animate-pulse">
                    <span className="text-xl">🎙️</span>
                    <div className="flex-1 space-y-1 text-xs">
                      <p className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">🎙️ माइक काम नहीं कर रहा? (Microphone Support)</p>
                      <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans font-medium">
                        यदि माइक न्यू टैब में भी काम नहीं कर रहा, तो अपने ब्राउज़र के ऊपरी हिस्से में <b>एड्रेस बार (Address Bar) / सर्च बार</b> के पास दिख रहे <b>Secure 🛡️</b> या <b>कैमरा/माइक</b> आइकॉन पर क्लिक करके "हमेशा अनुमति दें (Always Allow)" चुनें।
                      </p>
                      <p className="text-zinc-650 dark:text-zinc-400 leading-relaxed font-sans text-[11px]">
                        Or, if you are browsing in a sandbox frame, click the button below to launch in a raw new tab for 100% full native voice recognition.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowMicIframeHelper(false)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(59,130,246,0.3)] cursor-pointer select-none"
                  >
                    🚀 Open in New Tab & Enable Mic (न्यू टैब में खोलें)
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File upload previews panel drawer */}
            <AnimatePresence>
              {attachedImage && (
                <motion.div
                  id="image-thumbnail-drawer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="flex items-center gap-3 p-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-xl max-w-sm"
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
                    type="button"
                    className="p-1 rounded-full bg-zinc-200 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                    title="Remove attachment"
                  >
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Capsule Bar inspired by Gemini Mobile layout */}
            <div className={`relative flex items-center rounded-full px-2 py-1.5 shadow-[0_12px_45px_rgba(0,0,0,0.06)] border transition-all duration-300 ${
              isListeningActive
                ? "bg-blue-50/25 dark:bg-blue-955/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/10 animate-pulse"
                : "bg-white dark:bg-[#202025] border-zinc-200/60 dark:border-zinc-800 focus-within:border-blue-500/50 focus-within:shadow-[0_12px_45px_rgba(59,130,246,0.12)]"
            }`}>
              
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

              {/* Plus Button inside the capsule on the left */}
              <div className="relative shrink-0 flex items-center justify-center">
                <button
                  id="capsule-plus-btn"
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                  disabled={isGenerating}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-205 dark:hover:bg-zinc-700 text-zinc-750 dark:text-zinc-250 cursor-pointer transition-all duration-150 active:scale-90 disabled:opacity-50"
                  type="button"
                  title="Attachment Options"
                >
                  <Plus size={20} className={`transition-transform duration-200 ${isPlusMenuOpen ? "rotate-45" : ""}`} />
                </button>

                {/* Floating Plus Popover Drop-Up Options Menu */}
                <AnimatePresence>
                  {isPlusMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsPlusMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -12, scale: 0.95 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.95 }}
                        className="absolute bottom-12 left-0 w-52 bg-white dark:bg-[#1a1a1e] border border-zinc-100 dark:border-zinc-805 rounded-2xl shadow-xl p-2.5 z-50 space-y-1 block"
                      >
                        <div className="px-2 py-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-805 pb-1.5 mb-1 font-mono">
                          Attachment Menu
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlusMenuOpen(false);
                            fileInputRef.current?.click();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-105 dark:hover:bg-zinc-800/60 text-left transition-colors cursor-pointer"
                        >
                          <div className="text-sm">🖼️</div>
                          <span>Choose from Gallery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlusMenuOpen(false);
                            handleCameraCapture();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-105 dark:hover:bg-zinc-800/60 text-left transition-colors cursor-pointer"
                        >
                          <div className="text-sm">📷</div>
                          <span>Take Photo of Weather</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlusMenuOpen(false);
                            setInput("");
                            setAttachedImage(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-left transition-colors cursor-pointer"
                        >
                          <div className="text-sm">🧹</div>
                          <span>Clear Search Input</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* 
                Center Section of the Capsule. 
                If isListeningActive is active, show the 7 animated dots from the screenshot!
              */}
              <div className="flex-1 flex items-center min-w-0 px-2 lg:px-3">
                {/* Standard Search typing bar is ALWAYS visible so users can see, type or edit speech input continuously! */}
                <div className="flex-1 flex items-center relative min-w-0 font-sans">
                   <textarea
                    id="prompt-entry-textarea"
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isListeningActive
                        ? "🎙️ बोलिए, मैं सुन रहा हूँ... (Explain your question...)"
                        : "Ask Brainix"
                    }
                    disabled={isGenerating}
                    className="flex-1 max-h-[140px] pr-20 resize-none overflow-y-auto bg-transparent border-0 outline-none py-1.5 px-2 text-base text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-0 leading-normal font-medium tracking-tight"
                    style={{ height: "36px" }}
                  />

                  {/* Elegant floating Siri/Gemini active dots shown inside the search bar when listening! */}
                  {isListeningActive && (
                    <div className="absolute right-1 flex items-center gap-1.5 px-2 py-1.5 bg-zinc-100/90 dark:bg-zinc-800/90 rounded-full shrink-0 select-none shadow-xs backdrop-blur-md">
                      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                        <motion.span animate={{ scale: [1, 1.4, 1], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-2 h-2 rounded-full bg-[#4285F4] shadow-xs shadow-blue-500/40"></motion.span>
                        <motion.span animate={{ scale: [1, 1.4, 1], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.12 }} className="w-2 h-2 rounded-full bg-[#EA4335] shadow-xs shadow-red-500/40"></motion.span>
                        <motion.span animate={{ scale: [1, 1.4, 1], y: [0, -1.5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.24 }} className="w-2 h-2 rounded-full bg-[#FBBC05] shadow-xs shadow-yellow-500/40"></motion.span>
                        <motion.span animate={{ scale: [1, 1.4, 1], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.36 }} className="w-2 h-2 rounded-full bg-[#34A853] shadow-xs shadow-green-500/40"></motion.span>
                        <motion.span animate={{ scale: [1, 1.4, 1], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.48 }} className="w-2 h-2 rounded-full bg-[#9c27b0] shadow-xs shadow-purple-500/40"></motion.span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Right of the Capsule */}
              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {isListeningActive ? (
                  /* Stop Recording/Listening button (Shown only when listening) */
                  <button
                    id="stop-listening-bubble-btn"
                    type="button"
                    onClick={stopVoiceListening}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-red-500/10 hover:text-red-500 text-zinc-650 dark:text-zinc-350 cursor-pointer transition-all duration-150 active:scale-95"
                    title="Stop listening"
                  >
                    <Square size={14} fill="currentColor" className="text-zinc-500 dark:text-zinc-400" />
                  </button>
                ) : isGenerating ? (
                  /* Stop generation button */
                  <button
                    id="stop-generation-btn"
                    type="button"
                    onClick={() => abortControllerRef.current?.abort()}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-150 dark:bg-zinc-850 hover:bg-red-500/10 hover:text-red-500 text-red-500 cursor-pointer transition-all duration-150 active:scale-95 animate-pulse"
                    title="Stop generator"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  /* Mic + Sliders waveform action block when empty, Send button when text exists */
                  <div className="flex items-center gap-1">
                    {!input.trim() && !attachedImage ? (
                      <>
                        <button
                          id="capsule-microphone-btn"
                          type="button"
                          onClick={isListeningActive ? stopVoiceListening : startVoiceListening}
                          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 ${
                            isListeningActive 
                              ? "text-red-500 bg-red-500/10 hover:bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-pulse" 
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-500"
                          }`}
                          title={isListeningActive ? "Tap to stop listening" : "Tap to speak"}
                        >
                          {isListeningActive ? <MicOff size={20} className="text-red-500" /> : <Mic size={20} />}
                        </button>

                        <button
                          id="capsule-live-voice-session-btn"
                          type="button"
                          onClick={() => {
                            setIsVoiceCompanionOpen(true);
                            setContinuousVoiceMode(true);
                            setTimeout(() => {
                              startVoiceListening();
                            }, 450);
                          }}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-650 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-purple-500 transition-all duration-150 cursor-pointer active:scale-90"
                          title="Start real-time voice conversation (Gemini Live)"
                        >
                          <AudioLines size={18} className="text-zinc-650 dark:text-zinc-350 hover:text-purple-500 cursor-pointer" />
                        </button>
                      </>
                    ) : (
                      <button
                        id="submit-prompt-btn"
                        type="button"
                        onClick={() => handleSubmitMessage()}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 active:scale-90 text-white cursor-pointer shadow-[0_4px_12px_rgba(59,130,246,0.25)]"
                        title="Send message"
                      >
                        <ArrowUp size={18} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </footer>
          </>
        )}
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

      {/* 7. Live Voice Companion Mode Fullscreen/Bottom Sheet Overlay (Immersive ChatGPT style) */}
      <AnimatePresence>
        {isVoiceCompanionOpen && (
          <motion.div
            id="voice-companion-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex flex-col justify-between items-center p-6 ${
              theme === "dark" ? "bg-[#0b0c10] text-zinc-50" : "bg-white text-zinc-900"
            }`}
          >
            {/* Ambient Background Glow matching cloud colors */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* A. Top bar block exactly matching ChatGPT mockup */}
            <header className="w-full max-w-lg flex items-center justify-between select-none relative z-20 mt-2">
              {/* Menu button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsVoiceMenuOpen(!isVoiceMenuOpen)}
                  className={`w-11 h-11 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    theme === "dark" 
                      ? "bg-[#181a20] border-zinc-800 text-zinc-300 hover:bg-zinc-800" 
                      : "bg-white border-zinc-200/60 text-zinc-700 hover:bg-zinc-50 shadow-xs"
                  }`}
                  title="Menu Options"
                >
                  <div className="w-4 h-0.5 bg-current rounded-full" />
                  <div className="w-6 h-0.5 bg-current rounded-full" />
                </button>

                {/* Dropdown menu for continuous speech */}
                <AnimatePresence>
                  {isVoiceMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-64 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl space-y-3 font-sans text-xs"
                    >
                      <h4 className="font-extrabold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Brainix GPT Mode</h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Automatic Talkback mode lets you converse hands-free with continuous audio feedback.
                      </p>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setContinuousVoiceMode(!continuousVoiceMode);
                          if (continuousVoiceMode) {
                            window.speechSynthesis.cancel();
                            stopVoiceListening();
                          } else {
                            startVoiceListening();
                          }
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          continuousVoiceMode
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <Volume2 size={13} className={continuousVoiceMode ? "animate-pulse" : ""} />
                        <span>Hands-Free Speech: {continuousVoiceMode ? "ON" : "OFF"}</span>
                      </button>

                      <div className="text-[10px] text-zinc-400 italic text-center mt-1">
                        Developer Credits: Pranav Chaturvedi
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Title Text */}
              <h2 className="text-lg font-bold tracking-tight text-center font-sans">
                Brainix GPT <span className="text-zinc-400 dark:text-zinc-500 font-normal">Voice</span>
              </h2>

              {/* Settings / Multi-Dot dropdown button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsVoiceSettingsOpen(!isVoiceSettingsOpen)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                    theme === "dark" 
                      ? "bg-[#181a20] border-zinc-800 text-zinc-300 hover:bg-zinc-800" 
                      : "bg-white border-zinc-200/60 text-zinc-700 hover:bg-zinc-50 shadow-xs"
                  }`}
                  title="Voice & Language Settings"
                >
                  <MoreVertical size={20} />
                </button>

                {/* Settings Dropdown block */}
                <AnimatePresence>
                  {isVoiceSettingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl space-y-4 font-sans text-xs"
                    >
                      {/* Speaker Voice selector */}
                      <div className="space-y-1.5">
                        <label className="font-extrabold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-sans">Speaker Character</label>
                        <div className="grid grid-cols-3 gap-1 bg-zinc-50 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                          {(["female", "male", "robot"] as const).map((gender) => (
                            <button
                              key={gender}
                              type="button"
                              onClick={() => {
                                setVoiceType(gender);
                                localStorage.setItem("brainix-voice-type", gender);
                                setTimeout(() => {
                                  handleToggleSpeech(
                                    gender === "male" 
                                      ? "Mera awaaj ab male character par set hai!" 
                                      : gender === "robot" 
                                      ? "Awaaj cyber robot character par set hai." 
                                      : "Mera awaaj ab female character par set hai!", 
                                    "voice_preview_type"
                                  );
                                }, 150);
                              }}
                              className={`text-[10px] font-bold capitalize py-1.5 rounded-lg transition-all cursor-pointer ${
                                voiceType === gender
                                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs border border-zinc-200 dark:border-zinc-700"
                                  : "text-zinc-500 hover:text-zinc-700"
                              }`}
                            >
                              {gender}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language Selection */}
                      <div className="space-y-1.5">
                        <label className="font-extrabold text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-sans">Mic Input Language</label>
                        <select
                          value={recognitionLang}
                          onChange={(e) => {
                            const newLang = e.target.value;
                            setRecognitionLang(newLang);
                            localStorage.setItem("brainix-mic-lang", newLang);
                            // If actively listening, restart recognition seamlessly with the new language
                            if (isListeningActive) {
                              stopVoiceListening();
                              setTimeout(() => {
                                startVoiceListening();
                              }, 350);
                            }
                          }}
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="hi-IN">Hindi (हिंदी)</option>
                          <option value="en-IN">Indian English</option>
                          <option value="en-US">US English</option>
                          <option value="mr-IN">Marathi (मराठी)</option>
                          <option value="bn-IN">Bengali (বাংলা)</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </header>

            {/* B. Center piece: The gorgeous organic sky-blue watercolor cloud sphere */}
            <main className="flex-1 w-full max-w-lg flex flex-col items-center justify-center space-y-12 py-10 relative">
              
              {/* Central beautiful logo brand engine replacing the morphing bubbles */}
              <div 
                onClick={() => {
                  if (voiceActiveId) {
                    window.speechSynthesis.cancel();
                    setVoiceActiveId(null);
                  } else {
                    startVoiceListening();
                  }
                }}
                className={`flex items-center justify-center relative transition-all duration-300 cursor-pointer active:scale-95 ${
                  isListeningActive 
                    ? "scale-110" 
                    : voiceActiveId 
                    ? "scale-105" 
                    : "hover:scale-102"
                }`}
              >
                {/* Glow backing */}
                <div className={`absolute w-36 h-36 rounded-full transition-all duration-500 blur-3xl ${
                  isListeningActive 
                    ? "bg-sky-500/25 opacity-100" 
                    : voiceActiveId 
                    ? "bg-purple-500/25 opacity-100" 
                    : "bg-blue-500/10 opacity-30"
                }`} />

                {/* Styled ChatGPT App Icon with no surrounding container shape */}
                <ChatGPTLogo className={`w-28 h-28 origin-center relative z-10 text-zinc-950 dark:text-zinc-50 ${isListeningActive ? "animate-spin-slow" : ""}`} fill="currentColor" />

                {/* Nice voice activity waves indicator overlaid at bottom of core */}
                {voiceActiveId && (
                  <div className="absolute bottom-5 inset-x-0 z-25 flex items-center justify-center gap-1">
                    {[...Array(4)].map((_, idx) => (
                      <div 
                        key={idx}
                        className="w-1 h-3 bg-white/80 rounded-full animate-bounce" 
                        style={{ animationDelay: `${idx * 0.1}s`, animationDuration: "0.55s" }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Subtle status and live transcription feedback exactly matching Gemini Live style */}
              <div className="text-center select-none z-10 px-6 max-w-sm min-h-[48px] flex flex-col justify-center items-center">
                <p className="text-xs font-sans font-extrabold tracking-wider text-zinc-400 dark:text-zinc-500 animate-pulse transition-all uppercase">
                  {isGenerating 
                    ? "Thinking..." 
                    : voiceActiveId 
                    ? "Speaking..." 
                    : isListeningActive 
                    ? "Listening..." 
                    : "Tap to Converse"}
                </p>
                {recognitionTranscript && isListeningActive && (
                  <p className="text-xs font-sans font-semibold text-zinc-600 dark:text-zinc-300 mt-2 line-clamp-2 max-w-xs mx-auto text-center italic bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 px-3.5 py-1.5 rounded-full shadow-xs">
                    "{recognitionTranscript}"
                  </p>
                )}
              </div>

              {/* Center spacer to ensure perfect central vertical alignment like the photo */}
              <div className="h-2 select-none pointer-events-none" />
            </main>

            {/* C. Bottom bar block: Large centered Close button exactly like Gemini Live */}
            <footer className="w-full max-w-lg mb-6 flex justify-center items-center relative z-20">
              <button
                type="button"
                onClick={() => {
                  stopVoiceListening();
                  window.speechSynthesis.cancel();
                  setIsVoiceCompanionOpen(false);
                  setIsVoiceMenuOpen(false);
                  setIsVoiceSettingsOpen(false);
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-90 transition-all shadow-xl border border-zinc-700/30 dark:border-zinc-300/30 cursor-pointer"
                title="End Live Conversation Mode"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Lightbox Modal for fullscreen image preview (ChatGPT Style) */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md select-none"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-zinc-300 bg-neutral-900/60 p-2.5 rounded-full border border-neutral-800 hover:scale-105 active:scale-95 transition-all cursor-pointer z-[10050]"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 flex flex-col items-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="Fullscreen Preview"
                className="max-w-full max-h-[72vh] object-contain rounded-t-3xl"
              />
              <div className="w-full bg-neutral-900 px-6 py-4 flex items-center justify-between gap-4 border-t border-neutral-800 rounded-b-3xl">
                <span className="text-xs font-mono text-neutral-400 truncate">Generated by Brainix Hub • HD Media</span>
                <a
                  href={lightboxImage}
                  target="_blank"
                  rel="noreferrer"
                  download="brainix_image.jpg"
                  className="bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-neutral-950 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-md font-sans"
                >
                  <Download size={14} strokeWidth={2.5} />
                  Download
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

