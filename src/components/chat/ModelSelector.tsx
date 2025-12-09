'use client';

import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (model: string) => void;
}

const models = [
  { id: 'GPT4', name: 'GPT-4 Turbo', description: 'قدرتمندترین', credits: 10 },
  { id: 'CLAUDE', name: 'Claude 3', description: 'تحلیلی و دقیق', credits: 8 },
  { id: 'GEMINI', name: 'Gemini Pro', description: 'گوگل', credits: 5 },
  { id: 'LLAMA', name: 'Llama 3', description: 'متا', credits: 3 },
  { id: 'MISTRAL', name: 'Mistral', description: 'سریع', credits: 4 },
];

export function ModelSelector({ selectedModel, onSelect }: ModelSelectorProps) {
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
