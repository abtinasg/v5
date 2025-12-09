'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, User, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ModelSelector } from '@/components/chat/ModelSelector';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { LoginModal } from '@/components/ui/LoginModal';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('GPT4');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [credits, setCredits] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isAuthenticated = status === 'authenticated';

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Fetch credits when authenticated
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/credits')
        .then((res) => res.json())
        .then((data) => setCredits(data.credits || 0))
        .catch(console.error);
    }
  }, [session]);

  const loadChat = useCallback(async (chatId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const res = await fetch(`/api/chat?chatId=${chatId}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setMessages(
            data.messages.map((m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role.toLowerCase() as 'user' | 'assistant',
              content: m.content,
            }))
          );
          setCurrentChatId(chatId);
          setSelectedModel(data.model);
        }
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
      toast.error('خطا در بارگذاری گفتگو');
    }
  }, [isAuthenticated]);

  const handleSend = async (content: string) => {
    // If user is not authenticated, show login modal
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (isLoading) return;

    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Add user message optimistically
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingContent('');

    try {
      abortControllerRef.current = new AbortController();
      
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentChatId,
          message: content,
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'خطا در ارسال پیام');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chatId') {
                setCurrentChatId(data.chatId);
              } else if (data.type === 'content') {
                fullContent += data.content;
                setStreamingContent(fullContent);
              } else if (data.type === 'done') {
                // Add the complete assistant message
                const assistantMessage: Message = {
                  id: Date.now().toString() + '-assistant',
                  role: 'assistant',
                  content: fullContent,
                };
                setMessages((prev) => [...prev, assistantMessage]);
                setStreamingContent('');
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return;
      }
      toast.error((error as Error).message || 'خطا در ارتباط با سرور');
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      setStreamingContent('');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setCurrentChatId(null);
    setStreamingContent('');
    setIsLoading(false);
  };

  // Show loading state while checking auth status
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">هاب ایران</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
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
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-blue-500/25"
              >
                ورود / ثبت‌نام
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-0">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar - only show for authenticated users */}
          {isAuthenticated && (
            <ChatSidebar
              currentChatId={currentChatId}
              onSelectChat={loadChat}
              onNewChat={handleNewChat}
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          )}

          {/* Main chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAuthenticated && (
                  <button
                    onClick={handleNewChat}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors lg:hidden"
                  >
                    <Plus className="w-4 h-4" />
                    جدید
                  </button>
                )}
              </div>
              
              <ModelSelector
                selectedModel={selectedModel}
                onSelect={setSelectedModel}
              />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 && !streamingContent ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">AI</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    سلام! چطور می‌تونم کمکتون کنم؟
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    سوال بپرسید، متن بنویسید، کد بزنید یا هر کمکی نیاز دارید بگید
                  </p>
                  
                  {/* Quick prompts */}
                  <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-sm">
                    {[
                      'یک ایمیل رسمی بنویس',
                      'کد پایتون بزن',
                      'ترجمه کن به انگلیسی',
                      'ایده‌های کسب و کار',
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                    />
                  ))}
                  {streamingContent && (
                    <ChatMessage
                      role="assistant"
                      content={streamingContent}
                    />
                  )}
                  {isLoading && !streamingContent && (
                    <ChatMessage role="assistant" content="" isTyping />
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
