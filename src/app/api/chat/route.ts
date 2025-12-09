import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { openrouter, AI_MODELS, AGENT_PROMPTS, MODEL_CREDITS } from '@/lib/openrouter';
import { deductCredits, getUserCredits, FEATURE_COSTS } from '@/lib/credits';
import { AIModel, AgentType, MessageRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفا وارد شوید' }, { status: 401 });
    }

    const body = await request.json();
    const { chatId, message, model = 'GPT4', agentType = 'GENERAL' } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'پیام خالی است' }, { status: 400 });
    }

    // Check credits
    const credits = await getUserCredits(session.user.id);
    const requiredCredits = FEATURE_COSTS.CHAT_MESSAGE + MODEL_CREDITS[model as keyof typeof MODEL_CREDITS];
    
    if (credits < requiredCredits) {
      return NextResponse.json({ error: 'اعتبار کافی نیست' }, { status: 402 });
    }

    // Get or create chat
    let chat;
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: { id: chatId, userId: session.user.id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId: session.user.id,
          model: model as AIModel,
          agentType: agentType as AgentType,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: MessageRole.USER,
        content: message,
      },
    });

    // Prepare messages for AI
    const systemPrompt = AGENT_PROMPTS[agentType as keyof typeof AGENT_PROMPTS] || AGENT_PROMPTS.GENERAL;
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...chat.messages.map((m) => ({
        role: m.role.toLowerCase() as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Call OpenRouter
    const modelId = AI_MODELS[model as keyof typeof AI_MODELS];
    const completion = await openrouter.chat.completions.create({
      model: modelId,
      messages,
      stream: false,
      max_tokens: 2000,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'متاسفانه پاسخی دریافت نشد';

    // Save assistant message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: MessageRole.ASSISTANT,
        content: assistantMessage,
      },
    });

    // Deduct credits
    const deductResult = await deductCredits(
      session.user.id,
      requiredCredits,
      `پیام چت با مدل ${model}`
    );

    if (!deductResult.success) {
      console.error('Failed to deduct credits:', deductResult.error);
    }

    return NextResponse.json({
      success: true,
      chatId: chat.id,
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش پیام' },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفا وارد شوید' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (chatId) {
      const chat = await prisma.chat.findUnique({
        where: { id: chatId, userId: session.user.id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      return NextResponse.json(chat);
    }

    // Get all chats
    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت گفتگوها' },
      { status: 500 }
    );
  }
}

// Delete a chat
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفا وارد شوید' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json({ error: 'شناسه گفتگو الزامی است' }, { status: 400 });
    }

    // Verify chat belongs to user
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId: session.user.id },
    });

    if (!chat) {
      return NextResponse.json({ error: 'گفتگو یافت نشد' }, { status: 404 });
    }

    // Delete the chat (messages will cascade delete)
    await prisma.chat.delete({
      where: { id: chatId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error);
    return NextResponse.json(
      { error: 'خطا در حذف گفتگو' },
      { status: 500 }
    );
  }
}
