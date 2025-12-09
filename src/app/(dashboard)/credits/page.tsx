'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, History, Star, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatNumber, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export default function CreditsPage() {
  const [credits, setCredits] = useState(0);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch current credits
    fetch('/api/credits')
      .then((res) => res.json())
      .then((data) => setCredits(data.credits || 0))
      .catch(console.error);

    // Fetch packages
    fetch('/api/credits?action=packages')
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch(console.error);

    // Fetch transaction history
    fetch('/api/credits?action=history')
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch(console.error);
  }, []);

  const handlePurchase = async (packageId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to payment gateway
        toast.success('در حال انتقال به درگاه پرداخت...');
        // window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || 'خطا در خرید اعتبار');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'PURCHASE':
        return 'خرید اعتبار';
      case 'USAGE':
        return 'مصرف';
      case 'BONUS':
        return 'جایزه';
      case 'REFUND':
        return 'بازگشت وجه';
      default:
        return type;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Current Credits */}
      <Card variant="gradient" className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-1">موجودی اعتبار شما</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {formatNumber(credits)}
          <span className="text-lg text-gray-500 mr-2">کردیت</span>
        </p>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowHistory(false)}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            !showHistory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Plus className="w-4 h-4 inline ml-1" />
          خرید اعتبار
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            showHistory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <History className="w-4 h-4 inline ml-1" />
          تراکنش‌ها
        </button>
      </div>

      {!showHistory ? (
        /* Credit Packages */
        <div className="space-y-4">
          {packages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className={`p-4 relative ${index === 1 ? 'ring-2 ring-blue-500' : ''}`}
            >
              {index === 1 && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  محبوب‌ترین
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {pkg.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-500" />
                      {formatNumber(pkg.credits)} کردیت
                    </span>
                  </div>
                </div>
                
                <div className="text-left">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(pkg.price)}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => handlePurchase(pkg.id)}
                className="w-full mt-4"
                variant={index === 1 ? 'primary' : 'secondary'}
                isLoading={isLoading}
              >
                خرید
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        /* Transaction History */
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>هنوز تراکنشی ندارید</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <Card key={tx.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {getTransactionTypeLabel(tx.type)}
                    </h3>
                    {tx.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {tx.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${
                    tx.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.amount >= 0 ? '+' : ''}{formatNumber(tx.amount)}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
