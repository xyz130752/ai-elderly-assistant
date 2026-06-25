import { NextResponse } from 'next/server';

const AMAP_KEY = process.env.AMAP_API_KEY || '';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || '深圳';

    if (!AMAP_KEY) {
      // 返回模拟数据
      return NextResponse.json({
        success: true,
        data: {
          city,
          temperature: 28,
          condition: '晴',
          humidity: 65,
          wind: '东南风3级',
          suggestion: '今天天气不错，适合出门，记得带伞',
        },
      });
    }

    // 调用高德天气API
    const response = await fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${encodeURIComponent(city)}&extensions=all`
    );
    const result = await response.json();

    if (result.status === '1' && result.forecasts?.[0]) {
      const forecast = result.forecasts[0];
      const today = forecast.casts[0];

      return NextResponse.json({
        success: true,
        data: {
          city: forecast.city,
          temperature: parseInt(today.daytemp),
          condition: today.dayweather,
          humidity: parseInt(today.humidity || '65'),
          wind: today.winddirection + today.windpower + '级',
          suggestion: getWeatherSuggestion(today.dayweather, parseInt(today.daytemp)),
        },
      });
    }

    return NextResponse.json({ error: '获取天气失败' }, { status: 500 });
  } catch (error) {
    console.error('天气查询失败:', error);
    return NextResponse.json({ error: '天气查询失败' }, { status: 500 });
  }
}

function getWeatherSuggestion(condition: string, temp: number): string {
  if (temp > 35) return '天气很热，尽量别出门，出门记得戴帽子和防晒';
  if (temp < 5) return '天气很冷，多穿点衣服，注意保暖';
  if (condition.includes('雨')) return '今天有雨，出门记得带伞';
  if (condition.includes('雪')) return '今天有雪，路滑注意安全';
  return '天气不错，适合出门活动';
}
