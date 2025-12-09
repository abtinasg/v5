'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { X, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
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
        setStep('verify');
      } else {
        toast.error(data.error || 'خطا در ارسال کد');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length < 4) {
      toast.error('کد تایید معتبر نیست');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('phone-otp', {
        phone,
        code,
        redirect: false,
      });

      if (result?.error) {
        toast.error('کد تایید اشتباه است');
      } else {
        toast.success('خوش آمدید!');
        onClose();
        router.refresh();
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setCode('');
  };

  const handleClose = () => {
    setStep('phone');
    setPhone('');
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'phone' ? (
          <>
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">AI</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ورود به AI Hub
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                برای ارسال پیام ابتدا وارد شوید
              </p>
            </div>

            {/* Phone Form */}
            <form onSubmit={handleSendOtp} className="space-y-6">
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
          </>
        ) : (
          <>
            {/* Back button */}
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">تغییر شماره</span>
            </button>

            {/* Verify */}
            <div className="text-center mb-8 mt-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                کد تایید
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                کد ارسال شده به {phone} را وارد کنید
              </p>
            </div>

            {/* Code Form */}
            <form onSubmit={handleVerify} className="space-y-6">
              <Input
                type="text"
                placeholder="کد ۴ رقمی"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-2xl tracking-[1rem]"
                maxLength={6}
                dir="ltr"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                تایید و ورود
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
