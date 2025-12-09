import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOtp, generateOtpCode, validatePhone, normalizePhone } from '@/lib/kavenegar';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || !validatePhone(phone)) {
      return NextResponse.json(
        { error: 'شماره موبایل معتبر نیست' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Save OTP to database
    await prisma.otpCode.create({
      data: {
        phone: normalizedPhone,
        code,
        expiresAt,
      },
    });

    // Send OTP via Kavenegar
    await sendOtp(normalizedPhone, code);

    return NextResponse.json({
      success: true,
      message: 'کد تایید ارسال شد',
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال کد تایید' },
      { status: 500 }
    );
  }
}
