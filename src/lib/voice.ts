import * as crypto from 'crypto';

const IFLYTEK_APP_ID = process.env.IFLYTEK_APP_ID || '';
const IFLYTEK_API_KEY = process.env.IFLYTEK_API_KEY || '';
const IFLYTEK_API_SECRET = process.env.IFLYTEK_API_SECRET || '';

function generateSigna(apiSecret: string, timestamp: string, path: string): string {
  const signatureOrigin = `host: api.xfyun.cn\ndate: ${timestamp}\nPOST ${path} HTTP/1.1`;
  return crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64');
}

export async function recognizeVoice(audioBuffer: Buffer): Promise<{
  text: string;
  confidence: number;
}> {
  const timestamp = Date.now().toString();
  const signa = generateSigna(IFLYTEK_API_SECRET, timestamp, '/v2/iat');

  const response = await fetch('https://api.xfyun.cn/v2/iat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `api_key="${IFLYTEK_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signa}"`,
    },
    body: JSON.stringify({
      common: { app_id: IFLYTEK_APP_ID },
      business: { language: 'zh_cn', domain: 'iat' },
      data: {
        status: 2,
        format: 'audio/L16;rate=16000',
        encoding: 'raw',
        audio: audioBuffer.toString('base64'),
      },
    }),
  });

  const result = await response.json();
  const words = result.data?.result?.ws || [];
  const text = words.map((w: any) => w.cw?.map((c: any) => c.w).join('')).join('');

  return { text: text || '', confidence: 0.9 };
}

export async function synthesizeVoice(
  text: string,
  options?: { speed?: number; volume?: number; voice?: string }
): Promise<Buffer> {
  const timestamp = Date.now().toString();
  const signa = generateSigna(IFLYTEK_API_SECRET, timestamp, '/v2/tts');

  const response = await fetch('https://api.xfyun.cn/v2/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `api_key="${IFLYTEK_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signa}"`,
    },
    body: JSON.stringify({
      common: { app_id: IFLYTEK_APP_ID },
      business: {
        aue: 'raw',
        auf: 'audio/L16;rate=16000',
        vcn: options?.voice || 'xiaoyan',
        speed: options?.speed || 50,
        volume: options?.volume || 70,
      },
      data: {
        status: 2,
        text: Buffer.from(text).toString('base64'),
      },
    }),
  });

  const result = await response.json();
  return Buffer.from(result.data?.audio || '', 'base64');
}
