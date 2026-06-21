export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  image?: {
    data: string;       // Pure Base64 payload (for server ingestion)
    mimeType: string;   // e.g. "image/png"
    previewUrl: string; // Data URL for rendering directly in browser
  };
  video?: {
    data: string;       // Pure Base64 payload or mockup (for simulation)
    name: string;       // e.g. "my_trip.mp4"
    mimeType: string;   // e.g. "video/mp4"
    previewUrl: string; // URL/objectUrl for local playback
  };
  error?: {
    message: string;
    code?: number | string;
    modelTried?: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  systemInstruction?: string;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "gemini-3.5-flash",
    name: "Brainix GPT 3.5 Turbo",
    description: "Fast, intelligent, and live weather-grounded. Perfect for active day-to-day chats.",
    badge: "Turbo",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Brainix GPT 3.1 Ultra",
    description: "Advanced model for deep logical synthesis, complex programming, and research.",
    badge: "Ultra",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  }
];

export interface SuggestedPrompt {
  label: string;
  detail: string;
  promptText: string;
  icon: string;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    label: "Draft a professional email",
    detail: "requesting extra project feedback gracefully",
    promptText: "Write a polite, professional email to my project manager requesting constructive feedback on my latest deliverables. Keep it concise, professional, and invite honest critiques.",
    icon: "Mail"
  },
  {
    label: "Explain a complex concept",
    detail: "quantum computing for a ten-year-old child",
    promptText: "Explain how quantum computing works, but in simple terms that a ten-year-old would understand. Use analogies like coins, spinning, or magic card tricks.",
    icon: "Lightbulb"
  },
  {
    label: "Create a workout routine",
    detail: "for bodyweight exercises at home",
    promptText: "Design a 45-minute home workout routine using only bodyweight exercises. Include a warm-up, a high-intensity circuit, and a cool-down block with target sets/reps.",
    icon: "Flame"
  },
  {
    label: "Optimize code snippet",
    detail: "to improve time and space complexity",
    promptText: "Review the following code and suggest ways to optimize its execution speed and memory footprints. Explain the reasoning step-by-step.",
    icon: "Code"
  }
];
