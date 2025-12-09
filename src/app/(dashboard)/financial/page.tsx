'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketData {
  currency: MarketItem[];
  gold: MarketItem[];
  crypto: MarketItem[];
  stocks: MarketItem[];
  lastUpdate: string;
}

export default function FinancialPage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('currency');

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/market');
      const data = await res.json();
      setMarketData(data);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // Auto refresh every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'currency', label: 'ارز' },
    { id: 'gold', label: 'طلا' },
    { id: 'crypto', label: 'رمزارز' },
    { id: 'stocks', label: 'بورس' },
  ];

  const getActiveData = (): MarketItem[] => {
    if (!marketData) return [];
    return marketData[activeTab as keyof typeof marketData] as MarketItem[] || [];
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            بازار مالی ایران
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {marketData?.lastUpdate
              ? `آخرین به‌روزرسانی: ${new Date(marketData.lastUpdate).toLocaleTimeString('fa-IR')}`
              : 'در حال بارگذاری...'}
          </p>
        </div>
        <button
          onClick={fetchMarketData}
          disabled={isLoading}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Market Data */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          getActiveData().map((item) => (
            <Card key={item.symbol} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.symbol}
                  </span>
                </div>
                
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {formatNumber(item.price)}
                    <span className="text-xs text-gray-500 mr-1">ریال</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{item.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Financial Agent CTA */}
      <Card variant="gradient" className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white">
              مشاور مالی هوشمند
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              سوالات مالی و سرمایه‌گذاری خود را بپرسید
            </p>
          </div>
        </div>
        <Link href="/chat?agent=FINANCIAL">
          <Button className="w-full mt-4">
            شروع گفتگو
          </Button>
        </Link>
      </Card>
    </div>
  );
}
