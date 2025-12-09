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
    const { prompt, genre = 'general', duration = '30' } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'توضیحات موسیقی را وارد کنید' }, { status: 400 });
    }

    // Check credits
    const credits = await getUserCredits(session.user.id);
    if (credits < FEATURE_COSTS.MUSIC_GENERATION) {
      return NextResponse.json({ error: 'اعتبار کافی نیست' }, { status: 402 });
    }

    // TODO: Integrate with music generation API (e.g., Suno, MusicLM, etc.)
    // For now, create a pending record
    const music = await prisma.generatedMusic.create({
      data: {
        userId: session.user.id,
        prompt,
        musicUrl: '', // Will be updated when music is ready
        model: 'text-to-music-ai',
        status: 'PROCESSING',
      },
    });

    // Deduct credits
    const deductResult = await deductCredits(
      session.user.id,
      FEATURE_COSTS.MUSIC_GENERATION,
      'ساخت موسیقی با AI'
    );

    if (!deductResult.success) {
      console.error('Failed to deduct credits:', deductResult.error);
    }

    // Simulate music generation process (in production, this would be async)
    // The music URL would be updated via webhook or polling
    setTimeout(async () => {
      try {
        // In production: receive webhook from music generation service
        // For demo: simulate completion with a placeholder
        await prisma.generatedMusic.update({
          where: { id: music.id },
          data: {
            status: 'COMPLETED',
            musicUrl: `https://placeholder-audio.com/${music.id}.mp3`,
          },
        });
      } catch (error) {
        console.error('Error updating music status:', error);
      }
    }, 20000); // Simulate 20 second processing

    return NextResponse.json({
      success: true,
      music: {
        id: music.id,
        status: music.status,
        message: 'موسیقی در حال ساخت است. پس از آماده شدن اطلاع داده می‌شود.',
      },
    });
  } catch (error) {
    console.error('Music generation error:', error);
    return NextResponse.json(
      { error: 'خطا در ساخت موسیقی' },
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

    const musics = await prisma.generatedMusic.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(musics);
  } catch (error) {
    console.error('Get musics error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت موسیقی‌ها' },
      { status: 500 }
    );
  }
}
