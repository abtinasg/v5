'use client';

import { useState } from 'react';
import { Mic, Play, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function VoicePage() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(data.voice.message || 'صدا در حال ساخت است');
        setText('');
      } else {
        toast.error(data.error || 'خطا در تبدیل متن به صدا');
      }
    } catch (error) {
      console.error('Voice generation error:', error);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          تبدیل متن به صدا
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          متن خود را وارد کنید تا به صدا تبدیل شود
        </p>
      </div>

      {/* Info Banner */}
      <Card variant="gradient" className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          تبدیل متن به گفتار با هوش مصنوعی
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          متن فارسی یا انگلیسی را به صدای طبیعی تبدیل کنید
        </p>
      </Card>

      {/* Generator Form */}
      <Card className="p-4">
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="متن خود را اینجا وارد کنید..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="rtl"
            disabled={isGenerating}
          />

          {/* Voice options */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">صدا:</span>
            {['مرد', 'زن', 'کودک'].map((voice) => (
              <span
                key={voice}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {voice}
              </span>
            ))}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Volume2 className="w-5 h-5 ml-2 animate-pulse" />
                در حال ساخت...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 ml-2" />
                تبدیل به صدا (۱۰ کردیت)
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Features Preview */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-white">
          قابلیت‌ها
        </h3>
        {[
          'پشتیبانی از فارسی و انگلیسی',
          'صداهای طبیعی و واضح',
          'دانلود فایل صوتی',
          'کیفیت بالا',
        ].map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl"
          >
            <Play className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
