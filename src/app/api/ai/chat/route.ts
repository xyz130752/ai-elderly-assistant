import { NextResponse } from 'next/server';
import { chatWithElderWithContext } from '@/lib/ai';
import { identifyIntent } from '@/lib/intent';
import { geocode, drivingRoute, transitRoute, nearbySearch } from '@/lib/amap';
import { getMedicationSummary } from '@/lib/medication-store';

export async function POST(req: Request) {
  try {
    const { messages, userId = 'elder-001' } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: '请先说话' }, { status: 400 });
    }

    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    const intentResult = lastUserMsg ? identifyIntent(lastUserMsg.content) : null;
    let mapData = '';

    // 路线查询：从A到B
    const isRouteQuery = lastUserMsg && (
      lastUserMsg.content.includes('怎么走') ||
      lastUserMsg.content.includes('路线') ||
      (lastUserMsg.content.includes('从') && lastUserMsg.content.includes('到'))
    );
    console.log('=== 路线检查 ===');
    console.log('消息:', lastUserMsg?.content);
    console.log('是路线查询:', isRouteQuery);
    console.log('intent:', intentResult?.intent);

    if (isRouteQuery) {
      const text = lastUserMsg.content;
      const routeMatch = text.match(/从(.+?)[到去往](.+?)(怎么走|路线|多少钱|多远|多久|$)/);
      if (routeMatch) {
        const [, originAddr, destAddr] = routeMatch;
        try {
          const [originGeo, destGeo] = await Promise.all([
            geocode(originAddr.trim(), '深圳'),
            geocode(destAddr.trim(), '深圳'),
          ]);

          console.log('=== 地图查询 ===');
          console.log('出发地:', originAddr.trim(), '→', originGeo?.formattedAddress || '未找到');
          console.log('目的地:', destAddr.trim(), '→', destGeo?.formattedAddress || '未找到');

          if (originGeo && destGeo) {
            const [driving, transit] = await Promise.all([
              drivingRoute(originGeo.location, destGeo.location),
              transitRoute(originGeo.location, destGeo.location, '深圳'),
            ]);

            let routeInfo = `从${originGeo.formattedAddress}到${destGeo.formattedAddress}\n\n`;
            if (driving) {
              routeInfo += `【驾车】约${driving.duration}，${driving.distance}\n`;
              driving.steps.forEach((step, i) => {
                routeInfo += `  ${i + 1}. ${step}\n`;
              });
            }
            if (transit) {
              routeInfo += `\n【公交】约${transit.duration}，${transit.distance}\n`;
              transit.steps.forEach((step, i) => {
                routeInfo += `  ${i + 1}. ${step}\n`;
              });
            }
            mapData = routeInfo;
          }
        } catch (e) {
          console.error('地图查询失败:', e);
        }
      }
    }

    // 周边搜索：找附近的XX
    if (lastUserMsg && (
      lastUserMsg.content.includes('附近') ||
      lastUserMsg.content.includes('周边') ||
      lastUserMsg.content.includes('哪里有') ||
      lastUserMsg.content.includes('找一家')
    )) {
      const text = lastUserMsg.content;
      const searchMatch = text.match(/附近|周边|哪里有|找一家/);
      const keyword = text.replace(/.*(?:附近|周边|哪里有|找一家)/, '').replace(/[？?。，,.]/, '').trim();

      if (keyword && searchMatch) {
        try {
          const defaultLocation = '114.044450,22.659750';
          const results = await nearbySearch(defaultLocation, keyword);

          if (results.length > 0) {
            let searchInfo = `附近找到的${keyword}：\n\n`;
            results.forEach((item, i) => {
              searchInfo += `${i + 1}. ${item.name}\n   地址：${item.address}\n   距离：${item.distance}`;
              if (item.tel) searchInfo += `\n   电话：${item.tel}`;
              searchInfo += '\n';
            });
            mapData = searchInfo;
          }
        } catch (e) {
          console.error('周边搜索失败:', e);
        }
      }
    }

    // 根据意图获取上下文
    let intentContext = '';
    if (intentResult) {
      switch (intentResult.intent) {
        case 'WEATHER': intentContext = '用户想查天气'; break;
        case 'HOSPITAL': intentContext = '用户想挂号或看病'; break;
        case 'PAYMENT': intentContext = '用户想缴费'; break;
        case 'MEDICATION': {
          // 获取真实用药数据
          const medicationSummary = getMedicationSummary(userId);
          intentContext = `用户需要用药提醒\n\n${medicationSummary}`;
          break;
        }
        case 'HEALTH_REPORT': intentContext = '用户想解读体检报告'; break;
        case 'SCAM_CHECK': intentContext = '用户可能遇到诈骗'; break;
        case 'EMERGENCY': intentContext = '用户可能遇到紧急情况'; break;
        default: intentContext = '用户需要帮助';
      }
    }

    // 如果用户消息中包含用药相关关键词，即使intent没识别出来也注入用药数据
    const medicationKeywords = ['药', '吃药', '用药', '服药', '降压', '降糖', '降脂', '阿司匹林'];
    const isMedicationRelated = lastUserMsg && medicationKeywords.some(kw => lastUserMsg.content.includes(kw));
    if (isMedicationRelated && !intentContext.includes('用药')) {
      const medicationSummary = getMedicationSummary(userId);
      intentContext += `\n\n用药数据:\n${medicationSummary}`;
    }

    const context = [mapData, intentContext].filter(Boolean).join('\n\n');

    // 调用AI
    const response = await chatWithElderWithContext(
      messages.map((m: any) => ({ role: m.role, content: m.content })),
      context || undefined
    );

    return NextResponse.json({
      success: true,
      response,
      intent: intentResult?.intent || 'CHAT',
      confidence: intentResult?.confidence || 0.3,
    });
  } catch (error) {
    console.error('AI对话失败:', error);
    return NextResponse.json(
      { error: '出了点问题，稍后再试试' },
      { status: 500 }
    );
  }
}
