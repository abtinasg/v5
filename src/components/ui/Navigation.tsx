'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Image,
  Video,
  Music,
  Users,
  TrendingUp,
  CreditCard,
  User,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'چت', icon: MessageSquare },
  { href: '/images', label: 'عکس', icon: Image },
  { href: '/videos', label: 'ویدیو', icon: Video },
  { href: '/music', label: 'موسیقی', icon: Music },
  { href: '/agents', label: 'ایجنت‌ها', icon: Users },
  { href: '/financial', label: 'مالی', icon: TrendingUp },
  { href: '/credits', label: 'اعتبار', icon: CreditCard },
  { href: '/profile', label: 'پروفایل', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNav({ credits = 0 }: { credits?: number }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">هاب ایران</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/credits"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-sm font-medium shadow-lg shadow-amber-500/25"
          >
            <CreditCard className="w-4 h-4" />
            <span>{credits.toLocaleString('fa-IR')}</span>
          </Link>
          
          <Link 
            href="/profile"
            className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
          >
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
        </div>
      </div>
    </header>
  );
}
