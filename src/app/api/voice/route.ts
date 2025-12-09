import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { deductCredits, getUserCredits, FEATURE_COSTS } from '@/lib/credits';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفا وارد شوید' }, { status: 401 });
    }

    const body = await request.json();
    const { text, voice = 'default', language = 'fa' } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: 'متن را وارد کنید' }, { status: 400 });
    }

    // Check credits
    const credits = await getUserCredits(session.user.id);
    if (credits < FEATURE_COSTS.VOICE_GENERATION) {
      return NextResponse.json({ error: 'اعتبار کافی نیست' }, { status: 402 });
    }

    // TODO: Integrate with voice generation API (e.g., ElevenLabs, OpenAI TTS, etc.)
    // For now, create a pending record
    const voiceGeneration = await prisma.generatedVoice.create({
      data: {
        userId: session.user.id,
        text,
        voiceUrl: '', // Will be updated when audio is ready
        model: 'text-to-speech-ai',
        status: 'PROCESSING',
      },
    });

    // Deduct credits
    const deductResult = await deductCredits(
      session.user.id,
      FEATURE_COSTS.VOICE_GENERATION,
      'تبدیل متن به صدا با AI'
    );

    if (!deductResult.success) {
      console.error('Failed to deduct credits:', deductResult.error);
    }

    // Simulate voice generation process (in production, this would be async)
    // The voice URL would be updated via webhook or polling
    setTimeout(async () => {
      try {
        // In production: receive webhook from voice generation service
        // For demo: simulate completion with a placeholder
        await prisma.generatedVoice.update({
          where: { id: voiceGeneration.id },
          data: {
            status: 'COMPLETED',
            voiceUrl: `https://placeholder-audio.com/${voiceGeneration.id}.mp3`,
          },
        });
      } catch (error) {
        console.error('Error updating voice status:', error);
      }
    }, 10000); // Simulate 10 second processing

    return NextResponse.json({
      success: true,
      voice: {
        id: voiceGeneration.id,
        status: voiceGeneration.status,
        message: 'صدا در حال ساخت است. پس از آماده شدن اطلاع داده می‌شود.',
      },
    });
  } catch (error) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { error: 'خطا در تبدیل متن به صدا' },
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

    const voices = await prisma.generatedVoice.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(voices);
  } catch (error) {
    console.error('Get voices error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت فایل‌های صوتی' },
      { status: 500 }
    );
  }
}
