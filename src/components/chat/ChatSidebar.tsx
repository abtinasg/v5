'use client';

import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHistory {
  id: string;
  title: string;
  updatedAt: string;
  messages?: { content: string }[];
}

interface ChatSidebarProps {
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ currentChatId, onSelectChat, onNewChat, isOpen, onToggle }: ChatSidebarProps) {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/chat?chatId=${chatId}`, { method: 'DELETE' });
      if (res.ok) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (currentChatId === chatId) {
          onNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'امروز';
    if (diffDays === 1) return 'دیروز';
    if (diffDays < 7) return `${diffDays} روز پیش`;
    return new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-72 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            گفتگوی جدید
          </button>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg lg:hidden mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1" style={{ height: 'calc(100vh - 80px)' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              گفتگویی یافت نشد
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-colors group',
                  currentChatId === chat.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                )}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-20 right-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
