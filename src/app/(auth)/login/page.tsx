'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      toast.error('شماره موبایل معتبر نیست');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('کد تایید ارسال شد');
        // Store phone in sessionStorage for verify page
        sessionStorage.setItem('verifyPhone', phone);
        router.push('/verify');
      } else {
        toast.error(data.error || 'خطا در ارسال کد');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <ArrowLeft className="w-5 h-5" />
          <span>بازگشت</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ورود به AI Hub
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                شماره موبایل خود را وارد کنید
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-left pl-12"
                  dir="ltr"
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                دریافت کد تایید
              </Button>
            </form>

            {/* Terms */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              با ورود به اپلیکیشن،{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                قوانین و مقررات
              </Link>
              {' '}را می‌پذیرید.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
