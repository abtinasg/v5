'use client';

import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Code2, 
  PenTool, 
  TrendingUp, 
  Languages, 
  Megaphone,
  ArrowLeft,
  Youtube
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

const agents = [
  {
    id: 'GENERAL',
    name: 'دستیار عمومی',
    description: 'پاسخ به سوالات عمومی و کمک در موضوعات مختلف',
    icon: MessageSquare,
    color: 'from-blue-500 to-indigo-500',
    examples: ['یک ایمیل رسمی بنویس', 'درباره هوش مصنوعی توضیح بده'],
  },
  {
    id: 'CODER',
    name: 'برنامه‌نویس',
    description: 'نوشتن، بررسی و توضیح کد برنامه‌نویسی',
    icon: Code2,
    color: 'from-green-500 to-emerald-500',
    examples: ['یک تابع مرتب‌سازی بنویس', 'این کد رو اصلاح کن'],
  },
  {
    id: 'WRITER',
    name: 'نویسنده',
    description: 'نوشتن مقاله، داستان و محتوای خلاقانه',
    icon: PenTool,
    color: 'from-purple-500 to-pink-500',
    examples: ['یک داستان کوتاه بنویس', 'متن تبلیغاتی بساز'],
  },
  {
    id: 'FINANCIAL',
    name: 'مشاور مالی',
    description: 'تحلیل بازار و مشاوره سرمایه‌گذاری',
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-500',
    examples: ['وضعیت بورس چطوره؟', 'استراتژی سرمایه‌گذاری پیشنهاد بده'],
  },
  {
    id: 'TRANSLATOR',
    name: 'مترجم',
    description: 'ترجمه حرفه‌ای متون به زبان‌های مختلف',
    icon: Languages,
    color: 'from-cyan-500 to-blue-500',
    examples: ['این متن رو ترجمه کن', 'انگلیسی به فارسی'],
  },
  {
    id: 'MARKETING',
    name: 'بازاریاب',
    description: 'استراتژی بازاریابی و تولید محتوای تبلیغاتی',
    icon: Megaphone,
    color: 'from-red-500 to-pink-500',
    examples: ['کمپین تبلیغاتی طراحی کن', 'کپشن اینستاگرام بنویس'],
  },
  {
    id: 'FANTUBE',
    name: 'فان‌تیوب',
    description: 'ایجاد محتوای ویدیویی، پیشنهاد عنوان و توضیحات',
    icon: Youtube,
    color: 'from-rose-500 to-red-500',
    examples: ['ایده ویدیو برای یوتیوب', 'عنوان جذاب پیشنهاد بده'],
  },
];

export default function AgentsPage() {
  const router = useRouter();

  const handleSelectAgent = (agentId: string) => {
    // Navigate to chat with selected agent
    router.push(`/chat?agent=${agentId}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ایجنت‌های تخصصی
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          دستیار مناسب کارتان را انتخاب کنید
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid gap-4">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="p-4 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => handleSelectAgent(agent.id)}
          >
            <div className="flex gap-4">
              <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                <agent.icon className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {agent.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {agent.description}
                </p>
                
                {/* Example prompts */}
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {agent.examples.map((example) => (
                    <span
                      key={example}
                      className="flex-shrink-0 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
              
              <ArrowLeft className="w-5 h-5 text-gray-400 flex-shrink-0 self-center" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
