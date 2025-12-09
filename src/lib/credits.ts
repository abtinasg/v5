import prisma from './prisma';
import { TransactionType } from '@prisma/client';

export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  return user?.credits ?? 0;
}

export async function addCredits(
  userId: string,
  amount: number,
  type: TransactionType,
  description?: string
): Promise<boolean> {
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: amount } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount,
          type,
          description,
        },
      }),
    ]);
    return true;
  } catch (error) {
    console.error('Add credits error:', error);
    return false;
  }
}

export type DeductResult = 
  | { success: true }
  | { success: false; error: 'user_not_found' | 'insufficient_credits' | 'transaction_failed' };

export async function deductCredits(
  userId: string,
  amount: number,
  description?: string
): Promise<DeductResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return { success: false, error: 'user_not_found' };
    }

    if (user.credits < amount) {
      return { success: false, error: 'insufficient_credits' };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: TransactionType.USAGE,
          description,
        },
      }),
    ]);
    return { success: true };
  } catch (error) {
    console.error('Deduct credits error:', error);
    return { success: false, error: 'transaction_failed' };
  }
}

export async function getTransactionHistory(userId: string, limit = 20) {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// Credit packages
export const CREDIT_PACKAGES = [
  { id: 'basic', name: 'پایه', credits: 100, price: 50000, description: 'مناسب برای شروع' },
  { id: 'standard', name: 'استاندارد', credits: 500, price: 200000, description: 'محبوب‌ترین' },
  { id: 'premium', name: 'حرفه‌ای', credits: 1500, price: 500000, description: 'بهترین ارزش' },
  { id: 'enterprise', name: 'سازمانی', credits: 5000, price: 1500000, description: 'برای تیم‌ها' },
];

// Feature credit costs
export const FEATURE_COSTS = {
  CHAT_MESSAGE: 1, // per message
  IMAGE_GENERATION: 20, // per image
  VIDEO_GENERATION: 50, // per video
  MUSIC_GENERATION: 30, // per music
};
