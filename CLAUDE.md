# CLAUDE.md — AI老年人数字助手开发指南 v2.0

## 项目概述

**爸妈的小棉袄** — 老年人专属语音AI助手微信小程序

核心定位：让老人一句话搞定挂号、缴费、叫车、查天气

## 技术栈

```
前端: 微信小程序(老人端) + Next.js 14+(Web子女端)
UI: Tailwind CSS + shadcn/ui
后端: Next.js API Routes
数据库: PostgreSQL (Supabase)
缓存: Redis (Upstash)
AI: Claude API + 讯飞语音(ASR/TTS)
支付: 微信支付
地图: 高德地图API
认证: NextAuth.js + 短信验证码
存储: Cloudflare R2
部署: Vercel + 微信云托管
监控: Vercel Analytics + Sentry
```

## 项目结构

```
ai-elderly-assistant/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # 首页(子女端)
│   │   ├── layout.tsx                    # 根布局
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx            # 登录
│   │   │   └── bind/page.tsx             # 绑定老人
│   │   ├── elder/                         # 老人端页面
│   │   │   ├── page.tsx                  # 语音主界面
│   │   │   ├── health/page.tsx           # 健康管理
│   │   │   ├── medication/page.tsx       # 用药提醒
│   │   │   └── settings/page.tsx         # 设置
│   │   ├── parent/                        # 子女端页面
│   │   │   ├── page.tsx                  # Dashboard
│   │   │   ├── elder/[id]/page.tsx       # 查看某位老人
│   │   │   ├── elder/[id]/activity/page.tsx  # 活动详情
│   │   │   ├── elder/[id]/health/page.tsx    # 健康详情
│   │   │   ├── alerts/page.tsx           # 异常提醒
│   │   │   └── settings/page.tsx         # 设置
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts  # 认证
│   │       ├── voice/
│   │       │   ├── recognize/route.ts    # ASR语音识别
│   │       │   └── synthesize/route.ts   # TTS语音合成
│   │       ├── ai/
│   │       │   ├── chat/route.ts         # 主对话(流式)
│   │       │   ├── intent/route.ts       # 意图识别
│   │       │   └── scam-check/route.ts   # 诈骗检测
│   │       ├── services/
│   │       │   ├── hospital/
│   │       │   │   ├── book/route.ts     # 挂号
│   │       │   │   └── list/route.ts     # 医院列表
│   │       │   ├── payment/
│   │       │   │   ├── create/route.ts   # 创建缴费
│   │       │   │   └── callback/route.ts # 支付回调
│   │       │   ├── taxi/route.ts         # 叫车
│   │       │   └── weather/route.ts      # 天气
│   │       ├── health/
│   │       │   ├── report/
│   │       │   │   ├── upload/route.ts   # 上传报告
│   │       │   │   └── [id]/route.ts     # 报告详情
│   │       │   ├── medication/
│   │       │   │   ├── route.ts          # CRUD
│   │       │   │   └── reminder/route.ts # 提醒推送
│   │       │   └── daily/
│   │       │       └── route.ts          # 每日健康记录
│   │       └── family/
│   │           ├── bind/route.ts         # 绑定关系
│   │           ├── unbind/route.ts       # 解绑
│   │           ├── sync/route.ts         # 数据同步
│   │           └── elders/route.ts       # 老人列表
│   ├── components/
│   │   ├── elder/                         # 老人端组件
│   │   │   ├── VoiceButton.tsx           # 大大的语音按钮
│   │   │   ├── VoiceWave.tsx             # 语音波形动画
│   │   │   ├── ResponseBubble.tsx        # AI回复气泡
│   │   │   ├── QuickActions.tsx          # 快捷操作
│   │   │   ├── MedicationCard.tsx        # 用药卡片
│   │   │   └── HealthSummary.tsx         # 健康概览
│   │   ├── parent/                        # 子女端组件
│   │   │   ├── ElderCard.tsx             # 老人状态卡片
│   │   │   ├── ActivityLog.tsx           # 活动日志
│   │   │   ├── AlertBadge.tsx            # 异常提醒
│   │   │   ├── HealthChart.tsx           # 健康趋势图
│   │   │   └── RemoteControl.tsx         # 远程操作面板
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── Toast.tsx
│   ├── lib/
│   │   ├── db.ts                         # 数据库连接
│   │   ├── ai.ts                         # Claude API封装
│   │   ├── voice.ts                      # 讯飞语音封装
│   │   ├── intent.ts                     # 意图识别
│   │   ├── auth.ts                       # NextAuth配置
│   │   ├── utils.ts                      # 工具函数
│   │   ├── validations.ts                # Zod验证
│   │   └── services/
│   │       ├── hospital.ts               # 医院服务
│   │       ├── payment.ts                # 支付服务
│   │       ├── taxi.ts                   # 叫车服务
│   │       ├── weather.ts                # 天气服务
│   │       ├── sms.ts                    # 短信服务
│   │       └── notification.ts           # 推送服务
│   ├── types/
│   │   └── index.ts                      # TypeScript类型
│   └── hooks/
│       ├── useVoice.ts                   # 语音hook
│       ├── useElderStatus.ts             # 老人状态hook
│       ├── useMedication.ts              # 用药提醒hook
│       └── useRealtime.ts                # 实时更新hook
├── miniprogram/                          # 微信小程序代码
│   ├── pages/
│   │   ├── index/                        # 语音主页
│   │   ├── health/                       # 健康页
│   │   ├── medication/                   # 用药页
│   │   └── settings/                     # 设置页
│   ├── components/
│   ├── utils/
│   ├── app.json
│   └── project.config.json
├── prisma/
│   └── schema.prisma                     # 数据库Schema
├── docs/
│   ├── PRD.md
│   ├── competitive-analysis.md
│   └── api.md                            # API文档
├── tests/
│   ├── unit/                             # 单元测试
│   ├── integration/                      # 集成测试
│   └── e2e/                              # 端到端测试
├── .env.local                            # 环境变量(不提交)
├── .env.example                          # 环境变量模板
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── vitest.config.ts                      # 测试配置
└── README.md
```

## 环境变量

```bash
# .env.local
# 数据库
DATABASE_URL="postgresql://xxx:***@xxx:5432/elderly_assistant"

# Redis
REDIS_URL="redis://xxx:***@xxx:6379"

# AI
ANTHROPIC_API_KEY="sk-a...xx"

# 讯飞语音
IFLYTEK_APP_ID="xxx"
IFLYTEK_API_KEY="xxx"
IFLYTEK_API_SECRET="xxx"

# 认证
NEXTAUTH_SECRET="xxx"
NEXTAUTH_URL="http://localhost:3000"

# 短信验证码
SMS_API_KEY="xxx"
SMS_API_SECRET="xxx"

# 微信小程序
WECHAT_APP_ID="xxx"
WECHAT_APP_SECRET="xxx"

# 微信支付(需要企业资质)
WECHAT_MCH_ID="xxx"
WECHAT_API_KEY="xxx"

# 高德地图
AMAP_API_KEY="xxx"

# 文件存储
R2_ACCOUNT_ID="xxx"
R2_ACCESS_KEY_ID="xxx"
R2_SECRET_ACCESS_KEY="xxx"
R2_BUCKET_NAME="elderly-assistant"
```

## 数据库设计 (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id              String    @id @default(uuid())
  phone           String    @unique
  name            String
  role            UserRole
  avatar          String?
  membership      Membership @default(FREE)
  membershipExpire DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // 老人专属
  elderProfile    ElderProfile?
  medications     Medication[]
  healthRecords   HealthRecord[]
  voiceLogs       VoiceLog[]
  
  // 子女专属
  parentProfile   ParentProfile?
  alerts          Alert[]

  @@index([phone])
  @@index([role])
}

enum UserRole {
  ELDER
  PARENT
}

enum Membership {
  FREE
  BASIC      // 19.9元/月
  PREMIUM    // 39.9元/月
  FAMILY     // 99元/月(全家)
}

// 老人资料
model ElderProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  age             Int?
  address         String?
  hospital        String?  // 常用医院
  bloodType       String?
  allergies       String?
  emergencyContact String?
  emergencyPhone  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// 子女资料
model ParentProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())
}

// 绑定关系
model ElderLink {
  id              String   @id @default(uuid())
  parentId        String
  parent          ParentProfile @relation(fields: [parentId], references: [id], onDelete: Cascade)
  elderId         String
  elder           User     @relation(fields: [elderId], references: [id], onDelete: Cascade)
  relationship    String   // son/daughter/spouse/grandchild
  isVerified      Boolean  @default(false)
  createdAt       DateTime @default(now())

  @@unique([parentId, elderId])
  @@index([parentId])
  @@index([elderId])
}

// 用药提醒
model Medication {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String
  dosage          String   // "500mg"
  times           Json     // ["08:00", "12:00", "20:00"]
  startDate       DateTime
  endDate         DateTime?
  isActive        Boolean  @default(true)
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId, isActive])
}

// 服药记录
model MedicationLog {
  id              String   @id @default(uuid())
  medicationId    String
  medication      Medication @relation(fields: [medicationId], references: [id], onDelete: Cascade)
  scheduledTime   DateTime
  actualTime      DateTime?
  status          MedicationStatus @default(PENDING)
  createdAt       DateTime @default(now())

  @@index([medicationId, scheduledTime])
}

enum MedicationStatus {
  PENDING
  TAKEN
  MISSED
  SKIPPED
}

// 健康记录
model HealthRecord {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type            HealthType
  title           String
  content         Json
  aiAnalysis      String?
  fileUrl         String?
  createdAt       DateTime @default(now())

  @@index([userId, type, createdAt])
}

enum HealthType {
  CHECKUP         // 体检报告
  DAILY           // 每日记录(血压、血糖等)
  CONSULT         // 问诊记录
  PRESCRIPTION    // 处方
}

// 每日健康数据
model DailyHealth {
  id              String   @id @default(uuid())
  userId          String
  bloodPressure   Json?    // { systolic: 120, diastolic: 80 }
  bloodSugar      Float?
  heartRate       Int?
  weight          Float?
  sleep           Json?    // { hours: 7.5, quality: "good" }
  mood            String?  // happy/normal/sad
  notes           String?
  date            DateTime @default(now())

  @@unique([userId, date])
  @@index([userId, date])
}

// 语音交互记录
model VoiceLog {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  audioUrl        String?
  transcript      String
  intent          String
  response        String
  responseAudio   String?
  tokenUsage      Int      @default(0)
  duration        Int?     // 语音时长(秒)
  createdAt       DateTime @default(now())

  @@index([userId, createdAt])
  @@index([intent])
}

// 异常提醒
model Alert {
  id              String   @id @default(uuid())
  userId          String   // 老人ID
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  parentId        String   // 推送给哪个子女
  type            AlertType
  severity        Severity
  title           String
  description     String
  metadata        Json?    // 额外数据
  isRead          Boolean  @default(false)
  createdAt       DateTime @default(now())

  @@index([parentId, isRead])
  @@index([userId, type])
}

enum AlertType {
  SCAM_DETECTED
  SUSPICIOUS_CALL
  HEALTH_EMERGENCY
  MEDICATION_MISSED
  LOW_ACTIVITY
  BUDGET_EXCEEDED
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

// 消费记录
model SpendingRecord {
  id              String   @id @default(uuid())
  userId          String
  amount          Decimal  @db.Decimal(10, 2)
  category        String
  subcategory     String?
  description     String?
  date            DateTime @default(now())
  createdAt       DateTime @default(now())

  @@index([userId, date])
  @@index([userId, category])
}
```

## 开发顺序（按优先级）

### Phase 1: 基础架构 (Day 1-3)

```bash
# 1. 初始化项目
npx create-next-app@latest ai-elderly-assistant --typescript --tailwind --app --src-dir
cd ai-elderly-assistant

# 2. 安装核心依赖
npm install prisma @prisma/client next-auth @anthropic-ai/sdk
npm install zod date-fns uuid
npm install -D @types/node @types/uuid

# 3. 初始化Prisma
npx prisma init
# 复制上面的schema到 prisma/schema.prisma
npx prisma db push

# 4. 安装UI组件
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog toast label select tabs

# 5. 安装开发工具
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D prettier eslint eslint-config-next
```

### Phase 2: 语音系统 (Day 4-7)

**核心文件**: `src/lib/voice.ts`

```typescript
import crypto from 'crypto';

// 讯飞语音识别(ASR)
export async function recognizeVoice(audioBuffer: Buffer): Promise<{
  text: string;
  confidence: number;
}> {
  const appId = process.env.IFLYTEK_APP_ID!;
  const apiKey = process.env.IFLYTEK_API_KEY!;
  const apiSecret = process.env.IFLYTEK_API_SECRET!;
  
  // 生成签名
  const timestamp = Date.now().toString();
  const signa = generateSigna(apiSecret, timestamp);
  
  // 调用讯飞ASR API
  const response = await fetch('https://-api.xfyun.cn/v2/iat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signa}"`
    },
    body: JSON.stringify({
      common: { app_id: appId },
      business: { language: 'zh_cn', domain: 'iat' },
      data: {
        status: 2,
        format: 'audio/L16;rate=16000',
        encoding: 'raw',
        audio: audioBuffer.toString('base64')
      }
    })
  });
  
  const result = await response.json();
  return {
    text: result.data?.result?.ws?.map((w: any) => w.cw?.map((c: any) => c.w).join('')).join('') || '',
    confidence: 0.9
  };
}

// 讯飞语音合成(TTS)
export async function synthesizeVoice(text: string): Promise<Buffer> {
  const appId = process.env.IFLYTEK_APP_ID!;
  const apiKey = process.env.IFLYTEK_API_KEY!;
  const apiSecret = process.env.IFLYTEK_API_SECRET!;
  
  const timestamp = Date.now().toString();
  const signa = generateSigna(apiSecret, timestamp);
  
  const response = await fetch('https://api.xfyun.cn/v2/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signa}"`
    },
    body: JSON.stringify({
      common: { app_id: appId },
      business: {
        aue: 'raw',
        auf: 'audio/L16;rate=16000',
        vcn: 'xiaoyan',  // 老人喜欢的声音
        speed: 50,        // 语速慢一些
        volume: 70        // 音量大一些
      },
      data: {
        status: 2,
        text: Buffer.from(text).toString('base64')
      }
    })
  });
  
  const result = await response.json();
  return Buffer.from(result.data?.audio || '', 'base64');
}

function generateSigna(apiSecret: string, timestamp: string): string {
  const signatureOrigin = `host: api.xfyun.cn\ndate: ${timestamp}\nPOST /v2/iat HTTP/1.1`;
  return crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64');
}
```

**核心文件**: `src/lib/intent.ts`

```typescript
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

interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: Record<string, string>;
}

const INTENT_PATTERNS: Record<Intent, { keywords: string[]; patterns: RegExp[] }> = {
  WEATHER: {
    keywords: ['天气', '气温', '下雨', '出太阳', '冷不冷', '热不热', '穿什么'],
    patterns: [/今天.*天气/, /明天.*天气/, /会下雨吗/]
  },
  HOSPITAL: {
    keywords: ['挂号', '看病', '预约', '医院', '医生', '不舒服'],
    patterns: [/挂.*号/, /看.*科/, /去.*医院/]
  },
  PAYMENT: {
    keywords: ['交费', '缴费', '电费', '水费', '话费', '充值', '燃气'],
    patterns: [/交.*费/, /充.*值/, /多少.*钱/]
  },
  TAXI: {
    keywords: ['打车', '叫车', '出行', '去哪', '怎么走', '滴滴'],
    patterns: [/打.*车/, /叫.*车/, /去.*地方/]
  },
  MEDICATION: {
    keywords: ['吃药', '药', '提醒', '降压药', '降糖药'],
    patterns: [/吃.*药/, /药.*提醒/, /该吃药了/]
  },
  HEALTH_REPORT: {
    keywords: ['体检', '报告', '化验', '检查结果'],
    patterns: [/体检.*报告/, /化验.*结果/]
  },
  SCAM_CHECK: {
    keywords: ['中奖', '转账', '验证码', '安全账户', '公检法', '骗子'],
    patterns: [/中.*奖/, /转.*账/, /是不是骗/]
  },
  CHAT: {
    keywords: ['聊天', '陪我', '无聊', '讲故事', '笑话'],
    patterns: [/陪.*聊/, /讲.*故事/]
  },
  MUSIC: {
    keywords: ['戏曲', '唱歌', '音乐', '听歌', '相声'],
    patterns: [/听.*歌/, /放.*音乐/, /唱.*戏/]
  },
  EMERGENCY: {
    keywords: ['救命', '120', '着火', '摔倒', '急救', '疼'],
    patterns: [/救.*命/, /打.*120/, /摔倒了/]
  }
};

export function identifyIntent(text: string): IntentResult {
  const normalizedText = text.toLowerCase();
  
  // 计算每个意图的匹配分数
  const scores: Record<Intent, number> = {} as any;
  
  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    
    // 关键词匹配
    for (const keyword of config.keywords) {
      if (normalizedText.includes(keyword)) {
        score += 1;
      }
    }
    
    // 正则匹配
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) {
        score += 2; // 正则匹配权重更高
      }
    }
    
    scores[intent as Intent] = score;
  }
  
  // 找出最高分的意图
  const maxScore = Math.max(...Object.values(scores));
  const bestIntent = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as Intent || 'CHAT';
  
  return {
    intent: bestIntent,
    confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3,
    entities: extractEntities(normalizedText, bestIntent)
  };
}

function extractEntities(text: string, intent: Intent): Record<string, string> {
  const entities: Record<string, string> = {};
  
  // 提取时间
  const timeMatch = text.match(/(今天|明天|后天|下周|上午|下午|晚上)/);
  if (timeMatch) entities.time = timeMatch[1];
  
  // 提取地点
  const locationMatch = text.match(/(去|到|在)(.*?)(吗|呢|吧|$)/);
  if (locationMatch) entities.location = locationMatch[2];
  
  // 提取金额
  const amountMatch = text.match(/(\d+(\.\d+)?)\s*元/);
  if (amountMatch) entities.amount = amountMatch[1];
  
  return entities;
}
```

### Phase 3: 核心服务 (Day 8-14)

**API路由结构**:

```
POST /api/voice/recognize    → 语音识别
POST /api/voice/synthesize   → 语音合成

POST /api/ai/chat            → AI对话(流式SSE)
POST /api/ai/intent          → 意图识别
POST /api/ai/scam-check      → 诈骗检测

POST /api/services/hospital/book  → 挂号
GET  /api/services/hospital/list  → 医院列表
POST /api/services/payment/create → 创建缴费
POST /api/services/payment/callback → 支付回调
POST /api/services/taxi/book      → 叫车
GET  /api/services/weather        → 天气

POST /api/health/report/upload    → 上传报告
GET  /api/health/report/:id       → 报告详情
POST /api/health/medication       → 用药CRUD
POST /api/health/medication/reminder → 提醒推送
POST /api/health/daily            → 每日健康记录

GET  /api/family/elders           → 老人列表
POST /api/family/bind             → 绑定老人
POST /api/family/unbind           → 解绑
POST /api/family/sync             → 数据同步
```

**AI对话流式响应**: `src/app/api/ai/chat/route.ts`

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { identifyIntent } from '@/lib/intent';

const anthropic = new Anthropic();

export async function POST(req: Request) {
  const { messages, userId } = await req.json();
  
  const lastMessage = messages[messages.length - 1];
  const intentResult = identifyIntent(lastMessage.content);
  
  // 根据意图获取上下文
  const context = await getIntentContext(intentResult.intent, userId);
  
  const stream = anthropic.messages.stream({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: `你是"小棉袄"，一个专门服务老年人的AI助手。

核心原则:
1. 用最简单的话回答，避免专业术语
2. 语速要慢，语气要温暖
3. 重要操作要确认2遍
4. 涉及钱的操作要特别谨慎
5. 识别到诈骗信息要立即警告

回复格式: 直接用口语回复，不要用markdown，不要用列表，就像跟老人面对面说话一样。

当前上下文: ${context}`,
    messages
  });
  
  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

async function getIntentContext(intent: string, userId: string): Promise<string> {
  switch (intent) {
    case 'MEDICATION':
      return '用户可能需要设置或查看用药提醒';
    case 'HEALTH_REPORT':
      return '用户可能需要解读体检报告';
    case 'SCAM_CHECK':
      return '用户可能遇到了疑似诈骗信息，请立即警告';
    default:
      return '用户需要日常帮助';
  }
}
```

### Phase 4: 老人端UI (Day 15-21)

**设计原则**:
- 超大按钮: 最小48px，推荐64px
- 高对比度: 白底黑字，关键信息用橙色
- 语音优先: 首页就是大大的语音按钮
- 极少文字: 能用图标不用文字，能用语音不打字

**核心组件**: `src/components/elder/VoiceButton.tsx`

```tsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  onRecordingStart: () => void;
  onRecordingStop: (audioBlob: Blob) => void;
}

export function VoiceButton({ onRecordingStart, onRecordingStop }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // 音频可视化
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // 更新音频级别
      const updateLevel = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        if (isRecording) requestAnimationFrame(updateLevel);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      onRecordingStart();
      updateLevel();
    } catch (error) {
      console.error('录音失败:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          onRecordingStop(e.data);
        }
      };
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        className={`w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold
          ${isRecording 
            ? 'bg-red-500 text-white' 
            : 'bg-orange-500 text-white hover:bg-orange-600'
          } transition-colors shadow-lg`}
        whileTap={{ scale: 0.95 }}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
      >
        {isRecording ? (
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🎙️</span>
            <span className="text-sm">松开结束</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🎤</span>
            <span className="text-sm">按住说话</span>
          </div>
        )}
      </motion.button>
      
      {/* 音频波形 */}
      {isRecording && (
        <div className="flex gap-1 h-8 items-center">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-orange-400 rounded-full"
              animate={{
                height: [8, 8 + audioLevel * 24, 8]
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Phase 5: 子女端 (Day 22-28)

**核心功能**:
- 查看老人状态(在线/离线、今日活动)
- 远程帮操作(挂号、缴费)
- 异常提醒(诈骗、健康)

**Dashboard组件**: `src/components/parent/ElderCard.tsx`

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ElderCardProps {
  elder: {
    id: string;
    name: string;
    status: 'online' | 'offline';
    lastActive: Date;
    todayActivity: {
      voiceCount: number;
      healthStatus: 'normal' | 'warning' | 'danger';
      medicationTaken: boolean;
    };
  };
  onRemoteControl: (elderId: string) => void;
}

export function ElderCard({ elder, onRemoteControl }: ElderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'normal': return <Badge className="bg-green-100 text-green-800">正常</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">注意</Badge>;
      case 'danger': return <Badge className="bg-red-100 text-red-800">异常</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(elder.status)}`} />
            {elder.name}
          </CardTitle>
          {getHealthBadge(elder.todayActivity.healthStatus)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-orange-500">{elder.todayActivity.voiceCount}</div>
            <div className="text-gray-500">语音交互</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${elder.todayActivity.medicationTaken ? 'text-green-500' : 'text-red-500'}`}>
              {elder.todayActivity.medicationTaken ? '✓' : '✗'}
            </div>
            <div className="text-gray-500">服药</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">
              {new Date(elder.lastActive).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-gray-500">最后活跃</div>
          </div>
        </div>
        <Button 
          className="w-full mt-4" 
          onClick={() => onRemoteControl(elder.id)}
        >
          远程帮操作
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 关键Prompt设计

### AI对话Prompt

```typescript
const ELDER_AI_PROMPT = `你是"小棉袄"，一个专门服务老年人的AI助手。

核心原则:
1. 用最简单的话回答，避免专业术语
2. 语速要慢，语气要温暖
3. 重要操作要确认2遍
4. 涉及钱的操作要特别谨慎
5. 识别到诈骗信息要立即警告

你可以帮助老人:
- 查天气: "今天深圳28度，晴天，适合出门"
- 挂号: "好的，您要去哪家医院？"
- 交费: "您本月电费156元，确认支付吗？"
- 叫车: "好的，您要去哪里？"
- 吃药提醒: "已设置每天8点提醒您吃降压药"
- 识别诈骗: "这是诈骗！千万不要转账！"
- 日常聊天: 陪老人聊天解闷

回复格式: 直接用口语回复，不要用markdown，不要用列表，就像跟老人面对面说话一样。`;
```

### 诈骗识别Prompt

```typescript
const SCAM_CHECK_PROMPT = `请分析以下对话内容是否为诈骗:

{content}

判断标准:
1. 是否涉及转账/汇款
2. 是否索要验证码/密码
3. 是否声称公检法
4. 是否催促立即操作
5. 是否承诺高额回报
6. 是否使用威胁恐吓语气

输出JSON格式:
{
  "isScam": boolean,
  "confidence": number (0-1),
  "reason": "判断原因",
  "suggestedAction": "建议操作"
}

如果是诈骗，请在suggestedAction中明确警告老人不要相信。`;
```

### 体检报告解读Prompt

```typescript
const HEALTH_REPORT_PROMPT = `你是一位专业的健康顾问。请解读以下体检报告，用通俗易懂的语言解释每项指标。

体检数据:
{reportData}

请按以下格式输出:
1. 整体健康评估 (一句话总结)
2. 正常项目 (简要列出)
3. 异常项目 (详细解释，包含):
   - 指标名称和当前值
   - 正常范围
   - 偏离程度
   - 可能原因
   - 健康建议
   - 是否需要就医
4. 生活方式建议
5. 下次体检建议时间

重要提示:
- 用大白话解释，避免专业术语
- 不要下诊断，只做健康建议
- 异常项必须建议就医的要明确标注
- 输出JSON格式`;
```

## 微信小程序开发

### 小程序配置

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/health/health",
    "pages/medication/medication",
    "pages/settings/settings"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#FF6B35",
    "navigationBarTitleText": "爸妈的小棉袄",
    "navigationBarTextStyle": "white"
  },
  "button": {
    "backgroundTextStyle": "white",
    "navigationBarBackgroundColor": "#FF6B35"
  }
}
```

### 小程序语音录音

```javascript
// pages/index/index.js
Page({
  data: {
    isRecording: false,
    audioLevel: 0
  },

  startRecording() {
    this.setData({ isRecording: true });
    
    const recorderManager = wx.getRecorderManager();
    
    recorderManager.onStart(() => {
      console.log('录音开始');
    });
    
    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this.uploadAudio(res.tempFilePath);
    });
    
    recorderManager.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      format: 'pcm'
    });
  },

  stopRecording() {
    this.setData({ isRecording: false });
    const recorderManager = wx.getRecorderManager();
    recorderManager.stop();
  },

  async uploadAudio(filePath) {
    const uploadTask = wx.uploadFile({
      url: 'https://your-app.vercel.app/api/voice/recognize',
      filePath: filePath,
      name: 'audio',
      success: (res) => {
        const data = JSON.parse(res.data);
        this.handleVoiceResponse(data);
      }
    });
  },

  async handleVoiceResponse(data) {
    // 调用AI对话
    const chatRes = await wx.request({
      url: 'https://your-app.vercel.app/api/ai/chat',
      method: 'POST',
      data: {
        text: data.text,
        userId: getApp().globalData.userId
      }
    });
    
    // 播放语音回复
    if (chatRes.data.audioUrl) {
      const audio = wx.createInnerAudioContext();
      audio.src = chatRes.data.audioUrl;
      audio.play();
    }
  }
});
```

## 测试策略

### 单元测试

```typescript
// tests/unit/intent.test.ts
import { describe, it, expect } from 'vitest';
import { identifyIntent } from '@/lib/intent';

describe('identifyIntent', () => {
  it('识别天气意图', () => {
    const result = identifyIntent('今天天气怎么样');
    expect(result.intent).toBe('WEATHER');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('识别挂号意图', () => {
    const result = identifyIntent('帮我挂个号');
    expect(result.intent).toBe('HOSPITAL');
  });

  it('识别诈骗意图', () => {
    const result = identifyIntent('有人让我转账，是不是骗子');
    expect(result.intent).toBe('SCAM_CHECK');
  });
});
```

### 集成测试

```typescript
// tests/integration/api.test.ts
import { describe, it, expect } from 'vitest';

describe('AI Chat API', () => {
  it('返回流式响应', async () => {
    const response = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: '今天天气怎么样' }],
        userId: 'test-user'
      })
    });
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
  });
});
```

## 部署步骤

```bash
# 1. 推送代码到GitHub
git add .
git commit -m "feat: initial elderly assistant"
git push origin main

# 2. 在Vercel导入项目
# - 连接GitHub仓库
# - 配置环境变量
# - 点击Deploy

# 3. 运行数据库迁移
npx prisma db push

# 4. 微信小程序配置
# - 在微信公众平台注册小程序
# - 配置服务器域名: api.your-domain.com
# - 提交审核

# 5. 配置域名白名单
# - Vercel: your-app.vercel.app
# - 讯飞API: api.xfyun.cn
# - 高德API: restapi.amap.com
```

## 性能优化

1. **语音识别**: 使用WebSocket长连接，减少握手延迟
2. **AI对话**: 使用流式响应，用户无需等待完整回复
3. **缓存策略**: 天气、医院列表等静态数据使用Redis缓存
4. **图片压缩**: 体检报告图片上传前压缩到1MB以内
5. **懒加载**: 子女端Dashboard数据按需加载

## 安全最佳实践

1. **数据加密**: 老人健康数据使用AES-256加密存储
2. **API限流**: 每个用户每分钟最多60次API调用
3. **输入验证**: 所有用户输入使用Zod验证
4. **SQL注入**: 使用Prisma ORM，自动防注入
5. **XSS防护**: React自动转义，无需额外处理
6. **CSRF**: Next.js内置CSRF保护
7. **敏感操作**: 转账、缴费等操作需要二次确认

## 常见问题

### Q: 讯飞语音识别不准确怎么办？
A: 可以调整讯飞的`accent`参数，支持普通话、粤语、四川话等方言

### Q: 微信支付需要企业资质怎么办？
A: 初期可以用模拟数据，后期可以挂靠有资质的公司

### Q: 医院挂号API对接难怎么办？
A: 初期可以用模拟数据，后期可以对接微医、好大夫等第三方平台

## 参考文档

- [PRD产品需求文档](docs/PRD.md)
- [竞品分析报告](docs/competitive-analysis.md)
- [讯飞语音API文档](https://www.xfyun.cn/doc/)
- [高德地图API文档](https://lbs.amap.com/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/)

---

*最后更新: 2026-06-25*
*版本: v2.0*
