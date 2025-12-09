'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Phone, LogOut, Moon, Sun, Bell, Shield, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    // Check system dark mode
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, [session]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('لطفا نام خود را وارد کنید');
      return;
    }
    setIsSaving(true);
    try {
      // TODO: Implement save profile API
      toast.success('پروفایل به‌روزرسانی شد');
    } catch {
      toast.error('خطا در ذخیره پروفایل');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const menuItems = [
    {
      icon: Bell,
      label: 'اعلان‌ها',
      description: 'تنظیمات اعلان و پیام‌ها',
      onClick: () => toast('به زودی...'),
    },
    {
      icon: Shield,
      label: 'حریم خصوصی',
      description: 'سیاست حفظ حریم خصوصی',
      onClick: () => toast('به زودی...'),
    },
    {
      icon: HelpCircle,
      label: 'راهنما و پشتیبانی',
      description: 'سوالات متداول و تماس',
      onClick: () => toast('به زودی...'),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card className="p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {session?.user?.name || 'کاربر جدید'}
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span dir="ltr">{session?.user?.phone}</span>
          </div>
        </div>
      </Card>

      {/* Edit Profile */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
          ویرایش پروفایل
        </h3>
        <div className="space-y-4">
          <Input
            label="نام و نام خانوادگی"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام خود را وارد کنید"
          />
          <Button onClick={handleSave} className="w-full" isLoading={isSaving}>
            ذخیره تغییرات
          </Button>
        </div>
      </Card>

      {/* Settings */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
          تنظیمات
        </h3>
        
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">حالت تاریک</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تغییر ظاهر اپلیکیشن
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isDarkMode ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="flex-1 text-right">
              <p className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </Card>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        variant="danger"
        className="w-full"
      >
        <LogOut className="w-5 h-5 ml-2" />
        خروج از حساب
      </Button>

      {/* Version */}
      <p className="text-center text-sm text-gray-400">
        نسخه ۱.۰.۰
      </p>
    </div>
  );
}
