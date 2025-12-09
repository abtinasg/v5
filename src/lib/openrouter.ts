import OpenAI from 'openai';

// OpenRouter uses OpenAI-compatible API
export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'AI Hub Iran',
  },
});

// Model mappings for OpenRouter
export const AI_MODELS = {
  GPT4: 'openai/gpt-4-turbo-preview',
  CLAUDE: 'anthropic/claude-3-sonnet-20240229',
  GEMINI: 'google/gemini-pro',
  LLAMA: 'meta-llama/llama-3-70b-instruct',
  MISTRAL: 'mistralai/mistral-large-latest',
} as const;

// Model display names (Persian)
export const MODEL_NAMES: Record<string, string> = {
  GPT4: 'GPT-4 Turbo',
  CLAUDE: 'Claude 3 Sonnet',
  GEMINI: 'Gemini Pro',
  LLAMA: 'Llama 3 70B',
  MISTRAL: 'Mistral Large',
};

// Credit costs per model (per 1000 tokens)
export const MODEL_CREDITS: Record<string, number> = {
  GPT4: 10,
  CLAUDE: 8,
  GEMINI: 5,
  LLAMA: 3,
  MISTRAL: 4,
};

// Agent types and their system prompts
export const AGENT_PROMPTS: Record<string, string> = {
  GENERAL: 'تو یک دستیار هوش مصنوعی هوشمند و مفید هستی. به فارسی پاسخ بده و سعی کن پاسخ‌های دقیق و کاربردی ارائه دهی.',
  CODER: 'تو یک برنامه‌نویس متخصص هستی. کد تمیز و بهینه بنویس، توضیحات کامل بده و بهترین روش‌ها را پیشنهاد کن. به فارسی توضیح بده.',
  WRITER: 'تو یک نویسنده حرفه‌ای هستی. محتوای خلاقانه، جذاب و با کیفیت بالا بنویس. سبک نوشتن را با نیاز کاربر تطبیق بده.',
  FINANCIAL: 'تو یک مشاور مالی متخصص بازار ایران هستی. تحلیل‌های دقیق از بازار بورس، ارز، طلا و رمزارزها ارائه بده. همیشه هشدار ریسک بده.',
  TRANSLATOR: 'تو یک مترجم حرفه‌ای هستی. متن‌ها را با دقت و حفظ معنا و لحن اصلی ترجمه کن.',
  MARKETING: 'تو یک متخصص بازاریابی دیجیتال هستی. استراتژی‌های بازاریابی، محتوا و تبلیغات پیشنهاد بده.',
};

export type AIModelType = keyof typeof AI_MODELS;
export type AgentTypeKey = keyof typeof AGENT_PROMPTS;
