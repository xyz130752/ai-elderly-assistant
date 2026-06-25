import { NextResponse } from 'next/server';
import { recognizeVoice } from '@/lib/voice';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: '请先说话' }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    const result = await recognizeVoice(audioBuffer);

    return NextResponse.json({
      success: true,
      text: result.text,
      confidence: result.confidence,
    });
  } catch (error) {
    console.error('语音识别失败:', error);
    return NextResponse.json(
      { error: '语音识别失败，请重试' },
      { status: 500 }
    );
  }
}
