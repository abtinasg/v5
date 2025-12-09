'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (model: string) => void;
}

const models = [
  { id: 'GPT4', name: 'GPT-4 Turbo', description: 'قدرتمندترین', credits: 10, icon: '🚀' },
  { id: 'CLAUDE', name: 'Claude 3', description: 'تحلیلی و دقیق', credits: 8, icon: '🧠' },
  { id: 'GEMINI', name: 'Gemini Pro', description: 'گوگل', credits: 5, icon: '💎' },
  { id: 'LLAMA', name: 'Llama 3', description: 'متا', credits: 3, icon: '🦙' },
  { id: 'MISTRAL', name: 'Mistral', description: 'سریع', credits: 4, icon: '⚡' },
];

export function ModelSelector({ selectedModel, onSelect }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModelData = models.find((m) => m.id === selectedModel) || models[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700',
          'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750',
          'transition-all duration-200 text-sm font-medium'
        )}
      >
        <Sparkles className="w-4 h-4 text-blue-500" />
        <span className="text-gray-900 dark:text-white">{selectedModelData.name}</span>
        <ChevronDown className={cn(
          'w-4 h-4 text-gray-500 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onSelect(model.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-right transition-colors',
                  selectedModel === model.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span className="text-lg">{model.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {model.name}
                    </span>
                    {selectedModel === model.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{model.description}</span>
                    <span>•</span>
                    <span>{model.credits} کردیت</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Horizontal model selector for mobile
export function ModelSelectorHorizontal({ selectedModel, onSelect }: ModelSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onSelect(model.id)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-xl border-2 transition-all duration-200',
            selectedModel === model.id
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          )}
        >
          <div className="text-sm font-medium">{model.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {model.credits} کردیت/پیام
          </div>
        </button>
      ))}
    </div>
  );
}
