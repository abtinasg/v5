'use client';

import { useState } from 'react';
import { Video, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function VideosPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(data.video.message || 'ویدیو در حال ساخت است');
        setPrompt('');
      } else {
        toast.error(data.error || 'خطا در ساخت ویدیو');
      }
    } catch (error) {
      console.error('Video generation error:', error);
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
          ساخت ویدیو با هوش مصنوعی
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          توضیحات دلخواه بنویسید تا ویدیو بسازیم
        </p>
      </div>

      {/* Info Banner */}
      <Card variant="gradient" className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Video className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          ساخت ویدیو با هوش مصنوعی
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          ویدیوهای خود را با توضیحات متنی بسازید
        </p>
      </Card>

      {/* Generator Form */}
      <Card className="p-4">
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: یک موشک در حال پرواز به سمت ماه..."
            className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="rtl"
            disabled={isGenerating}
          />

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Clock className="w-5 h-5 ml-2 animate-spin" />
                در حال ساخت...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 ml-2" />
                ساخت ویدیو (۵۰ کردیت)
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Features Preview */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-white">
          قابلیت‌های آینده
        </h3>
        {[
          'ساخت ویدیو از متن',
          'تبدیل عکس به ویدیو',
          'ویرایش ویدیو با AI',
          'افزودن موسیقی اتوماتیک',
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
