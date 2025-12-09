import { NextResponse } from 'next/server';
import { getAllMarketData } from '@/lib/sourcearena';

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: Date;
}

// Fallback mock data in case API fails
const mockMarketData: MarketItem[] = [
  { symbol: 'USD', name: 'دلار آمریکا', price: 65000, change: 500, changePercent: 0.77, lastUpdate: new Date() },
  { symbol: 'EUR', name: 'یورو', price: 71000, change: -300, changePercent: -0.42, lastUpdate: new Date() },
  { symbol: 'GOLD', name: 'طلای ۱۸ عیار', price: 4500000, change: 50000, changePercent: 1.12, lastUpdate: new Date() },
  { symbol: 'COIN', name: 'سکه امامی', price: 48000000, change: 500000, changePercent: 1.05, lastUpdate: new Date() },
  { symbol: 'BTC', name: 'بیتکوین', price: 6500000000, change: 100000000, changePercent: 1.56, lastUpdate: new Date() },
  { symbol: 'ETH', name: 'اتریوم', price: 250000000, change: -5000000, changePercent: -1.96, lastUpdate: new Date() },
];

const mockStockData: MarketItem[] = [
  { symbol: 'FOLD', name: 'فولاد مبارکه', price: 5890, change: 120, changePercent: 2.08, lastUpdate: new Date() },
  { symbol: 'SHPA', name: 'شپنا', price: 12450, change: -230, changePercent: -1.81, lastUpdate: new Date() },
  { symbol: 'KHOD', name: 'خودرو', price: 2340, change: 50, changePercent: 2.18, lastUpdate: new Date() },
  { symbol: 'BMLT', name: 'بانک ملت', price: 4520, change: 80, changePercent: 1.80, lastUpdate: new Date() },
  { symbol: 'PTAP', name: 'پتروشیمی تاپیکو', price: 15800, change: -150, changePercent: -0.94, lastUpdate: new Date() },
];

// Transform SourceArena data to our format
function transformMarketData(sourceData: any): MarketItem[] {
  if (!sourceData || !Array.isArray(sourceData)) return [];
  
  return sourceData.map((item: any) => ({
    symbol: item.symbol || item.code || '',
    name: item.name || item.title || '',
    price: parseFloat(item.price || item.p || 0),
    change: parseFloat(item.change || item.d || 0),
    changePercent: parseFloat(item.percent || item.dp || 0),
    lastUpdate: new Date(),
  }));
}

export async function GET() {
  try {
    // Fetch real data from SourceArena API
    const marketData = await getAllMarketData();
    
    // Transform and structure the data
    const response = {
      currency: marketData.currency ? transformMarketData(marketData.currency) : mockMarketData.filter(m => ['USD', 'EUR'].includes(m.symbol)),
      gold: marketData.gold ? transformMarketData(marketData.gold) : mockMarketData.filter(m => ['GOLD', 'COIN'].includes(m.symbol)),
      crypto: marketData.crypto ? transformMarketData(marketData.crypto) : mockMarketData.filter(m => ['BTC', 'ETH'].includes(m.symbol)),
      stocks: marketData.stock ? transformMarketData(marketData.stock) : mockStockData,
      lastUpdate: new Date().toISOString(),
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Market data error:', error);
    
    // Return fallback mock data if API fails
    return NextResponse.json({
      currency: mockMarketData.filter(m => ['USD', 'EUR'].includes(m.symbol)),
      gold: mockMarketData.filter(m => ['GOLD', 'COIN'].includes(m.symbol)),
      crypto: mockMarketData.filter(m => ['BTC', 'ETH'].includes(m.symbol)),
      stocks: mockStockData,
      lastUpdate: new Date().toISOString(),
    });
  }
}
