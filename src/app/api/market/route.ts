import { NextResponse } from 'next/server';
// import axios from 'axios'; // Uncomment when integrating with real market APIs

// Iran market data sources
// In production, integrate with real data providers like:
// - Codal.ir (بورس)
// - Tgju.org (طلا و ارز)
// - Navasan.tech

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: Date;
}

// Mock data for demonstration
const mockMarketData: MarketItem[] = [
  { symbol: 'USD', name: 'دلار آمریکا', price: 65000, change: 500, changePercent: 0.77, lastUpdate: new Date() },
  { symbol: 'EUR', name: 'یورو', price: 71000, change: -300, changePercent: -0.42, lastUpdate: new Date() },
  { symbol: 'GOLD', name: 'طلای ۱۸ عیار', price: 4500000, change: 50000, changePercent: 1.12, lastUpdate: new Date() },
  { symbol: 'COIN', name: 'سکه امامی', price: 48000000, change: 500000, changePercent: 1.05, lastUpdate: new Date() },
  { symbol: 'BTC', name: 'بیتکوین', price: 6500000000, change: 100000000, changePercent: 1.56, lastUpdate: new Date() },
  { symbol: 'ETH', name: 'اتریوم', price: 250000000, change: -5000000, changePercent: -1.96, lastUpdate: new Date() },
];

// Sample stock data
const mockStockData: MarketItem[] = [
  { symbol: 'FOLD', name: 'فولاد مبارکه', price: 5890, change: 120, changePercent: 2.08, lastUpdate: new Date() },
  { symbol: 'SHPA', name: 'شپنا', price: 12450, change: -230, changePercent: -1.81, lastUpdate: new Date() },
  { symbol: 'KHOD', name: 'خودرو', price: 2340, change: 50, changePercent: 2.18, lastUpdate: new Date() },
  { symbol: 'BMLT', name: 'بانک ملت', price: 4520, change: 80, changePercent: 1.80, lastUpdate: new Date() },
  { symbol: 'PTAP', name: 'پتروشیمی تاپیکو', price: 15800, change: -150, changePercent: -0.94, lastUpdate: new Date() },
];

export async function GET() {
  try {
    // In production, fetch real data from APIs
    // const response = await axios.get('https://api.tgju.org/v1/market/currency');
    
    return NextResponse.json({
      currency: mockMarketData.filter(m => ['USD', 'EUR'].includes(m.symbol)),
      gold: mockMarketData.filter(m => ['GOLD', 'COIN'].includes(m.symbol)),
      crypto: mockMarketData.filter(m => ['BTC', 'ETH'].includes(m.symbol)),
      stocks: mockStockData,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Market data error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات بازار' },
      { status: 500 }
    );
  }
}
