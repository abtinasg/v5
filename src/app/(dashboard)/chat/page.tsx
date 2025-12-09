'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to home page since chat is now the home page
export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}
