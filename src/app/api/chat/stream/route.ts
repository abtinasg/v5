import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { openrouter, AI_MODELS, AGENT_PROMPTS, MODEL_CREDITS } from '@/lib/openrouter';
import { deductCredits, getUserCredits, FEATURE_COSTS } from '@/lib/credits';
import { AIModel, AgentType, MessageRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'لطفا وارد شوید' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { chatId, message, model = 'GPT4', agentType = 'GENERAL' } = body;

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'پیام خالی است' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check credits
    const credits = await getUserCredits(session.user.id);
    const requiredCredits = FEATURE_COSTS.CHAT_MESSAGE + MODEL_CREDITS[model as keyof typeof MODEL_CREDITS];

    if (credits < requiredCredits) {
      return new Response(JSON.stringify({ error: 'اعتبار کافی نیست' }), {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      });
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

    // Call OpenRouter with streaming
    const modelId = AI_MODELS[model as keyof typeof AI_MODELS];
    const stream = await openrouter.chat.completions.create({
      model: modelId,
      messages,
      stream: true,
      max_tokens: 2000,
    });

    let fullResponse = '';
    const chatIdToSave = chat.id;
    const userId = session.user.id;

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Send chat ID first
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chatId', chatId: chatIdToSave })}\n\n`));

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`));
            }
          }

          // Save assistant message after stream completes
          await prisma.message.create({
            data: {
              chatId: chatIdToSave,
              role: MessageRole.ASSISTANT,
              content: fullResponse || 'متاسفانه پاسخی دریافت نشد',
            },
          });

          // Deduct credits
          await deductCredits(
            userId,
            requiredCredits,
            `پیام چت با مدل ${model}`
          );

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'خطا در دریافت پاسخ' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Stream chat API error:', error);
    return new Response(JSON.stringify({ error: 'خطا در پردازش پیام' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
