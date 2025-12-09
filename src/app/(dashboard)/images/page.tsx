'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Download, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
}

export default function ImagesPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedSize, setSelectedSize] = useState('1024x1024');

  useEffect(() => {
    fetch('/api/image')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: selectedSize }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('تصویر با موفقیت ساخته شد!');
        setImages((prev) => [data.image, ...prev]);
        setPrompt('');
      } else {
        toast.error(data.error || 'خطا در ساخت تصویر');
      }
    } catch {
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
          ساخت عکس با هوش مصنوعی
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          توضیحات دلخواه بنویسید تا عکس بسازیم
        </p>
      </div>

      {/* Generator Form */}
      <Card className="p-4">
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: یک گربه فضانورد روی ماه در حال نوشیدن چای..."
            className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="rtl"
          />

          {/* Size selector */}
          <div className="flex gap-2">
            {['1024x1024', '1792x1024', '1024x1792'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {size === '1024x1024' ? 'مربع' : size === '1792x1024' ? 'افقی' : 'عمودی'}
              </button>
            ))}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                در حال ساخت...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 ml-2" />
                ساخت تصویر (۲۰ کردیت)
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Gallery */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          گالری من
        </h2>
        
        {images.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>هنوز تصویری نساخته‌اید</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden p-0">
                <div className="relative aspect-square">
                  <Image
                    src={image.imageUrl}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm line-clamp-2 mb-2">
                        {image.prompt}
                      </p>
                      <a
                        href={image.imageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-white text-sm"
                      >
                        <Download className="w-4 h-4" />
                        دانلود
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
