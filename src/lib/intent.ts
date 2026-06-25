export type Intent =
  | 'WEATHER'
  | 'HOSPITAL'
  | 'PAYMENT'
  | 'TAXI'
  | 'MEDICATION'
  | 'HEALTH_REPORT'
  | 'SCAM_CHECK'
  | 'CHAT'
  | 'MUSIC'
  | 'EMERGENCY';

export interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: Record<string, string>;
}

const INTENT_PATTERNS: Record<Intent, { keywords: string[]; patterns: RegExp[] }> = {
  WEATHER: {
    keywords: ['天气', '气温', '下雨', '出太阳', '冷不冷', '热不热', '穿什么'],
    patterns: [/今天.*天气/, /明天.*天气/, /会下雨吗/],
  },
  HOSPITAL: {
    keywords: ['挂号', '看病', '预约', '医院', '医生', '不舒服'],
    patterns: [/挂.*号/, /看.*科/, /去.*医院/],
  },
  PAYMENT: {
    keywords: ['交费', '缴费', '电费', '水费', '话费', '充值', '燃气'],
    patterns: [/交.*费/, /充.*值/, /多少.*钱/],
  },
  TAXI: {
    keywords: ['打车', '叫车', '出行', '去哪', '怎么走', '滴滴'],
    patterns: [/打.*车/, /叫.*车/, /去.*地方/],
  },
  MEDICATION: {
    keywords: ['吃药', '药', '提醒', '降压药', '降糖药'],
    patterns: [/吃.*药/, /药.*提醒/, /该吃药了/],
  },
  HEALTH_REPORT: {
    keywords: ['体检', '报告', '化验', '检查结果'],
    patterns: [/体检.*报告/, /化验.*结果/],
  },
  SCAM_CHECK: {
    keywords: ['中奖', '转账', '验证码', '安全账户', '公检法', '骗子'],
    patterns: [/中.*奖/, /转.*账/, /是不是骗/],
  },
  CHAT: {
    keywords: ['聊天', '陪我', '无聊', '讲故事', '笑话'],
    patterns: [/陪.*聊/, /讲.*故事/],
  },
  MUSIC: {
    keywords: ['戏曲', '唱歌', '音乐', '听歌', '相声'],
    patterns: [/听.*歌/, /放.*音乐/, /唱.*戏/],
  },
  EMERGENCY: {
    keywords: ['救命', '120', '着火', '摔倒', '急救', '好疼'],
    patterns: [/救.*命/, /打.*120/, /摔倒了/],
  },
};

export function identifyIntent(text: string): IntentResult {
  const normalizedText = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    for (const keyword of config.keywords) {
      if (normalizedText.includes(keyword)) score += 1;
    }
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) score += 2;
    }
    scores[intent] = score;
  }

  const maxScore = Math.max(...Object.values(scores));
  const bestIntent = (Object.entries(scores).find(([_, s]) => s === maxScore)?.[0] || 'CHAT') as Intent;

  return {
    intent: bestIntent,
    confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3,
    entities: extractEntities(normalizedText, bestIntent),
  };
}

function extractEntities(text: string, _intent: Intent): Record<string, string> {
  const entities: Record<string, string> = {};
  const timeMatch = text.match(/(今天|明天|后天|下周|上午|下午|晚上)/);
  if (timeMatch) entities.time = timeMatch[1];
  const locationMatch = text.match(/(去|到|在)(.*?)(吗|呢|吧|$)/);
  if (locationMatch) entities.location = locationMatch[2];
  const amountMatch = text.match(/(\d+(\.\d+)?)\s*元/);
  if (amountMatch) entities.amount = amountMatch[1];
  return entities;
}
