import { AIModel, AgentType, MessageRole } from '@prisma/client';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  model: AIModel;
  agentType: AgentType;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string | null;
  avatar: string | null;
  credits: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  lastUpdate: Date;
}

export interface GeneratedMedia {
  id: string;
  prompt: string;
  url: string;
  model: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
}
