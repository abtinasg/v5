'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Settings } from 'lucide-react';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ModelSelector } from '@/components/chat/ModelSelector';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('GPT4');
  const [isLoading, setIsLoading] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    if (isLoading) return;

    // Add user message optimistically
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentChatId,
          message: content,
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Add assistant message
        const assistantMessage: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Update chat ID if new chat
        if (data.chatId && !currentChatId) {
          setCurrentChatId(data.chatId);
        }
      } else {
        toast.error(data.error || 'خطا در ارسال پیام');
        // Remove optimistic message
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            گفتگوی جدید
          </button>
          
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
          >
            <Settings className="w-4 h-4" />
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {showModelSelector && (
          <ModelSelector
            selectedModel={selectedModel}
            onSelect={(model) => {
              setSelectedModel(model);
              setShowModelSelector(false);
            }}
          />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
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
            {isLoading && (
              <ChatMessage role="assistant" content="" isTyping />
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
