'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [countdown, setCountdown] = useState(120);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('verifyPhone');
    if (!storedPhone) {
      router.push('/login');
      return;
    }
    setPhone(storedPhone);
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newCode.every((c) => c) && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (verifyCode?: string) => {
    const fullCode = verifyCode || code.join('');
    
    if (fullCode.length !== 6) {
      toast.error('کد ۶ رقمی را وارد کنید');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('phone-otp', {
        phone,
        code: fullCode,
        redirect: false,
      });

      if (result?.ok) {
        toast.success('ورود موفق!');
        sessionStorage.removeItem('verifyPhone');
        router.push('/chat');
      } else {
        toast.error('کد وارد شده صحیح نیست');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        toast.success('کد جدید ارسال شد');
        setCountdown(120);
        setCode(['', '', '', '', '', '']);
      } else {
        toast.error('خطا در ارسال کد');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="p-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <ArrowLeft className="w-5 h-5" />
          <span>تغییر شماره</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                کد تایید را وارد کنید
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                کد ۶ رقمی ارسال شده به{' '}
                <span className="font-medium text-gray-900 dark:text-white" dir="ltr">
                  {phone}
                </span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex gap-2 justify-center mb-6" dir="ltr">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Submit Button */}
            <Button
              onClick={() => handleSubmit()}
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={code.some((c) => !c)}
            >
              تایید و ورود
            </Button>

            {/* Resend */}
            <div className="text-center mt-6">
              {countdown > 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  ارسال مجدد کد تا {formatTime(countdown)}
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  ارسال مجدد کد
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
