import { NextResponse } from 'next/server';
import { checkScam } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: '请提供要检查的内容' }, { status: 400 });
    }

    const result = await checkScam(content);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('诈骗检测失败:', error);
    return NextResponse.json(
      { error: '检测失败，请重试' },
      { status: 500 }
    );
  }
}
