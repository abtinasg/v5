'use client';

import { useState } from 'react';
import { Music, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function MusicPage() {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // TODO: Implement music generation API
    toast.success('درخواست ساخت موسیقی ثبت شد. پس از آماده شدن اطلاع داده می‌شود.');
    setPrompt('');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ساخت موسیقی با هوش مصنوعی
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          سبک موسیقی دلخواه را توصیف کنید
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card variant="gradient" className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          به زودی!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          قابلیت ساخت موسیقی با هوش مصنوعی به زودی راه‌اندازی می‌شود
        </p>
      </Card>

      {/* Generator Form */}
      <Card className="p-4 opacity-75">
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: یک موسیقی آرامش‌بخش با صدای پیانو..."
            className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="rtl"
            disabled
          />

          {/* Genre selector */}
          <div className="flex gap-2 flex-wrap opacity-50">
            {['پاپ', 'کلاسیک', 'جاز', 'الکترونیک', 'سنتی ایرانی'].map((genre) => (
              <span
                key={genre}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={true}
            className="w-full"
            size="lg"
          >
            <Clock className="w-5 h-5 ml-2" />
            به زودی (۳۰ کردیت)
          </Button>
        </div>
      </Card>

      {/* Features Preview */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-white">
          قابلیت‌های آینده
        </h3>
        {[
          'ساخت موسیقی از متن',
          'انتخاب سبک و ژانر',
          'تنظیم مدت زمان',
          'دانلود با کیفیت بالا',
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
