'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TopNav, BottomNav } from '@/components/ui/Navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [credits, setCredits] = useState(0);

  // Check if we're on the chat page (now at root, but keep for legacy /chat route)
  const isChatPage = pathname === '/chat' || pathname === '/';

  useEffect(() => {
    // Redirect /chat to home since chat is now at root
    if (pathname === '/chat') {
      router.replace('/');
      return;
    }
    
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router, pathname]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/credits')
        .then((res) => res.json())
        .then((data) => setCredits(data.credits || 0))
        .catch(console.error);
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNav credits={credits} />
      <main className={isChatPage ? 'pt-16 lg:pb-0 pb-20' : 'pt-16 pb-20'}>
        {children}
      </main>
      {/* Hide bottom nav on chat page for desktop */}
      <div className={isChatPage ? 'lg:hidden' : ''}>
        <BottomNav />
      </div>
    </div>
  );
}
