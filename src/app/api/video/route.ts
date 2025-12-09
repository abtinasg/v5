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
    const { prompt, duration = '5', quality = 'standard' } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'توضیحات ویدیو را وارد کنید' }, { status: 400 });
    }

    // Check credits
    const credits = await getUserCredits(session.user.id);
    if (credits < FEATURE_COSTS.VIDEO_GENERATION) {
      return NextResponse.json({ error: 'اعتبار کافی نیست' }, { status: 402 });
    }

    // TODO: Integrate with video generation API (e.g., Runway, Pika, etc.)
    // For now, create a pending record
    const video = await prisma.generatedVideo.create({
      data: {
        userId: session.user.id,
        prompt,
        videoUrl: '', // Will be updated when video is ready
        model: 'text-to-video-ai',
        status: 'PROCESSING',
      },
    });

    // Deduct credits
    const deductResult = await deductCredits(
      session.user.id,
      FEATURE_COSTS.VIDEO_GENERATION,
      'ساخت ویدیو با AI'
    );

    if (!deductResult.success) {
      console.error('Failed to deduct credits:', deductResult.error);
    }

    // Simulate video generation process (in production, this would be async)
    // The video URL would be updated via webhook or polling
    setTimeout(async () => {
      try {
        // In production: receive webhook from video generation service
        // For demo: simulate completion with a placeholder
        await prisma.generatedVideo.update({
          where: { id: video.id },
          data: {
            status: 'COMPLETED',
            videoUrl: `https://placeholder-video.com/${video.id}.mp4`,
          },
        });
      } catch (error) {
        console.error('Error updating video status:', error);
      }
    }, 30000); // Simulate 30 second processing

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        status: video.status,
        message: 'ویدیو در حال ساخت است. پس از آماده شدن اطلاع داده می‌شود.',
      },
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'خطا در ساخت ویدیو' },
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

    const videos = await prisma.generatedVideo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت ویدیوها' },
      { status: 500 }
    );
  }
}
