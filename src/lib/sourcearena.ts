import axios from 'axios';

const SOURCEARENA_BASE_URL = 'https://apis.sourcearena.ir/api';

// Types for SourceArena API responses
export interface SourceArenaPrice {
  price: string;
  change: string;
  percent: string;
  time?: string;
}

export interface SourceArenaCrypto {
  symbol: string;
  name: string;
  price_usd: string;
  price_toman: string;
  change_24h: string;
  market_cap?: string;
}

// Gold prices API
export async function getGoldPrices() {
  try {
    const response = await axios.get(`${SOURCEARENA_BASE_URL}/gold`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching gold prices from SourceArena:', error);
    throw error;
  }
}

// Currency prices API
export async function getCurrencyPrices() {
  try {
    const response = await axios.get(`${SOURCEARENA_BASE_URL}/currency`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching currency prices from SourceArena:', error);
    throw error;
  }
}

// Crypto prices API
export async function getCryptoPrices() {
  try {
    const response = await axios.get(`${SOURCEARENA_BASE_URL}/crypto`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices from SourceArena:', error);
    throw error;
  }
}

// Stock market API
export async function getStockPrices() {
  try {
    const response = await axios.get(`${SOURCEARENA_BASE_URL}/stock`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock prices from SourceArena:', error);
    throw error;
  }
}

// Get all market data at once
export async function getAllMarketData() {
  try {
    const [gold, currency, crypto, stock] = await Promise.allSettled([
      getGoldPrices(),
      getCurrencyPrices(),
      getCryptoPrices(),
      getStockPrices(),
    ]);

    return {
      gold: gold.status === 'fulfilled' ? gold.value : null,
      currency: currency.status === 'fulfilled' ? currency.value : null,
      crypto: crypto.status === 'fulfilled' ? crypto.value : null,
      stock: stock.status === 'fulfilled' ? stock.value : null,
    };
  } catch (error) {
    console.error('Error fetching all market data:', error);
    throw error;
  }
}
