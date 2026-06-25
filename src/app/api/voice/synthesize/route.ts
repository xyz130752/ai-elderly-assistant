import { NextResponse } from 'next/server';
import { synthesizeVoice } from '@/lib/voice';

export async function POST(req: Request) {
  try {
    const { text, speed, volume } = await req.json();

    if (!text) {
      return NextResponse.json({ error: '请提供要合成的文字' }, { status: 400 });
    }

    const audioBuffer = await synthesizeVoice(text, { speed, volume });

    return new Response(new Uint8Array(audioBuffer), {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('语音合成失败:', error);
    return NextResponse.json(
      { error: '语音合成失败，请重试' },
      { status: 500 }
    );
  }
}
