import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserCredits, getTransactionHistory, CREDIT_PACKAGES } from '@/lib/credits';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفا وارد شوید' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'packages') {
      return NextResponse.json(CREDIT_PACKAGES);
    }

    if (action === 'history') {
      const transactions = await getTransactionHistory(session.user.id);
      return NextResponse.json(transactions);
    }

    // Default: get current credits
    const credits = await getUserCredits(session.user.id);
    return NextResponse.json({ credits });
  } catch (error) {
    console.error('Credits API error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات' },
      { status: 500 }
    );
  }
}

// Purchase credits (placeholder for payment integration)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفا وارد شوید' }, { status: 401 });
    }

    const body = await request.json();
    const { packageId } = body;

    const selectedPackage = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (!selectedPackage) {
      return NextResponse.json({ error: 'پکیج نامعتبر است' }, { status: 400 });
    }

    // TODO: Integrate with payment gateway (Zarinpal, Pay.ir, etc.)
    // For now, return payment URL placeholder
    return NextResponse.json({
      success: true,
      paymentUrl: `/payment?package=${packageId}`,
      package: selectedPackage,
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    return NextResponse.json(
      { error: 'خطا در خرید اعتبار' },
      { status: 500 }
    );
  }
}
