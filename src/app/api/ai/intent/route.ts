import { NextResponse } from 'next/server';
import { identifyIntent } from '@/lib/intent';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: '请提供文字' }, { status: 400 });
    }

    const result = identifyIntent(text);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('意图识别失败:', error);
    return NextResponse.json(
      { error: '识别失败，请重试' },
      { status: 500 }
    );
  }
}
