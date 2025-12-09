import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { deductCredits, getUserCredits, FEATURE_COSTS } from '@/lib/credits';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفا وارد شوید' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, size = '1024x1024', quality = 'standard' } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'توضیحات عکس را وارد کنید' }, { status: 400 });
    }

    // Check credits
    const credits = await getUserCredits(session.user.id);
    if (credits < FEATURE_COSTS.IMAGE_GENERATION) {
      return NextResponse.json({ error: 'اعتبار کافی نیست' }, { status: 402 });
    }

    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: size as '1024x1024' | '1792x1024' | '1024x1792',
      quality: quality as 'standard' | 'hd',
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'خطا در ساخت تصویر' }, { status: 500 });
    }

    // Save to database
    const image = await prisma.generatedImage.create({
      data: {
        userId: session.user.id,
        prompt,
        imageUrl,
        model: 'dall-e-3',
      },
    });

    // Deduct credits
    await deductCredits(
      session.user.id,
      FEATURE_COSTS.IMAGE_GENERATION,
      'ساخت تصویر با DALL-E'
    );

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'خطا در ساخت تصویر' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفا وارد شوید' }, { status: 401 });
    }

    const images = await prisma.generatedImage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت تصاویر' },
      { status: 500 }
    );
  }
}
