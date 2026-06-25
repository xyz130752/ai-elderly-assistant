# 🧡 爸妈的小棉袄 — AI老年人数字助手

## 产品需求文档 (PRD) v1.0

**版本**: v1.0  
**日期**: 2026-06-24  
**定位**: 让爸妈一句话搞定数字生活

---

## 1. 产品概述

### 1.1 一句话定位
**爸妈的AI小棉袄** — 老年人专属语音AI助手，一句话完成挂号、缴费、叫车、查天气

### 1.2 痛点分析
```
现实: 3亿中国老人，1.3亿独居，90%不会用智能手机挂号
现状: 大字版App只是放大了字体，操作流程一样复杂
需求: 老人需要的是"说一句话就搞定"，不是"教他们点这里再点那里"
```

### 1.3 核心价值
- **语音优先**: 所有功能都能用嘴巴说完成
- **极简交互**: 一个按钮（大大的）、一句话（简单的）
- **子女代办**: 子女远程帮爸妈操作，不用跑腿
- **防诈骗**: AI自动识别可疑信息，保护老人

### 1.4 目标用户
| 用户 | 需求 | 使用方式 |
|------|------|---------|
| 老人(60+) | 挂号、缴费、叫车、查天气 | 微信小程序，语音交互 |
| 子女(30-50) | 远程帮爸妈操作、监控健康 | 手机App，远程协助 |

---

## 2. MVP功能清单

### 2.1 功能优先级

| 模块 | 功能 | 优先级 | 复杂度 | 工时 |
|------|------|--------|--------|------|
| 🔐 用户系统 | 手机号登录 | P0 | 低 | 1天 |
| 🔐 用户系统 | 老人+子女绑定 | P0 | 中 | 2天 |
| 🎤 语音交互 | 语音输入(普通话) | P0 | 中 | 2天 |
| 🎤 语音交互 | 语音输出(TTS) | P0 | 低 | 1天 |
| 🏥 就医助手 | 挂号预约 | P0 | 高 | 3天 |
| 🏥 就医助手 | 体检报告解读 | P0 | 中 | 2天 |
| 🏥 就医助手 | 用药提醒 | P0 | 低 | 1天 |
| 💰 生活缴费 | 水电煤缴费 | P0 | 中 | 2天 |
| 💰 生活缴费 | 话费充值 | P0 | 低 | 1天 |
| 🚗 出行助手 | 叫车(滴滴) | P0 | 中 | 2天 |
| 🚗 出行助手 | 查公交/地铁 | P1 | 中 | 2天 |
| 🌤️ 生活助手 | 查天气 | P0 | 低 | 1天 |
| 🌤️ 生活助手 | 查菜谱 | P1 | 低 | 1天 |
| 🛡️ 安全防护 | 诈骗电话识别 | P0 | 中 | 2天 |
| 🛡️ 安全防护 | 可疑链接拦截 | P0 | 中 | 2天 |
| 👨‍👩‍👧 子女端 | 远程查看爸妈状态 | P0 | 中 | 2天 |
| 👨‍👩‍👧 子女端 | 远程帮操作 | P1 | 高 | 3天 |
| 💬 AI陪伴 | 日常聊天 | P1 | 低 | 1天 |
| 💬 AI陪伴 | 听戏曲/相声 | P2 | 低 | 1天 |
| **合计** | | | | **约35天** |

### 2.2 用户故事

#### 老人端
```
US-001: 作为老人，我想说"帮我挂个号"就能预约医生
  输入: 语音"帮我挂个号，挂内科"
  输出: "好的，您要去哪家医院？附近有XX医院和XX医院"
  交互: 老人选择后，AI自动完成挂号

US-002: 作为老人，我想说"今天天气怎么样"
  输入: 语音"今天天气怎么样"
  输出: "今天深圳晴天，28度，适合出门，记得带伞"

US-003: 作为老人，我想说"帮我交电费"
  输入: 语音"帮我交电费"
  输出: "您本月电费是156元，确认支付吗？"
  确认后自动完成支付

US-004: 作为老人，我想设置吃药提醒
  输入: 语音"提醒我每天早上8点吃降压药"
  输出: "好的，已设置每天8点提醒您吃降压药"

US-005: 作为老人，有人给我打电话说中奖了，我想确认是不是骗子
  输入: 语音转文字内容
  输出: "这是典型的中奖诈骗，请不要相信，不要转账"
```

#### 子女端
```
US-010: 作为子女，我想远程查看爸妈今天的活动
  输入: 打开App查看
  输出: 爸妈今日语音交互记录、健康数据、消费记录

US-011: 作为子女，我想远程帮爸妈挂号
  输入: 在App上选择医院、科室、时间
  输出: 挂号成功，爸妈手机收到提醒

US-012: 作为子女，我想收到爸妈的异常提醒
  触发: 爸妈接到可疑电话/访问可疑链接
  输出: 推送警报到子女手机
```

---

## 3. 技术架构

### 3.1 技术栈

```json
{
  "frontend": "微信小程序(老人端) + Next.js(Web子女端)",
  "ui": "大字体 + 高对比度 + 极简交互",
  "backend": "Next.js API Routes",
  "database": "PostgreSQL (Supabase)",
  "ai": "Claude API + 讯飞语音(ASR/TTS)",
  "voice": "讯飞语音识别 + 讯飞语音合成",
  "payment": "微信支付",
  "mapping": "高德地图API",
  "deploy": "Vercel + 微信云托管"
}
```

### 3.2 项目结构

```
ai-elderly-assistant/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # 首页(子女端)
│   │   ├── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx            # 登录
│   │   │   └── bind/page.tsx             # 绑定老人
│   │   ├── elder/                         # 老人端页面
│   │   │   ├── page.tsx                  # 语音主界面
│   │   │   ├── health/page.tsx           # 健康管理
│   │   │   └── settings/page.tsx         # 设置
│   │   ├── parent/                        # 子女端页面
│   │   │   ├── page.tsx                  # Dashboard
│   │   │   ├── elder/[id]/page.tsx       # 查看某位老人
│   │   │   └── alerts/page.tsx           # 异常提醒
│   │   └── api/
│   │       ├── auth/                     # 认证
│   │       ├── voice/                    # 语音处理
│   │       │   ├── recognize/route.ts    # ASR语音识别
│   │       │   └── synthesize/route.ts   # TTS语音合成
│   │       ├── ai/                       # AI对话
│   │       │   ├── chat/route.ts         # 主对话
│   │       │   └── intent/route.ts       # 意图识别
│   │       ├── services/                 # 第三方服务
│   │       │   ├── hospital/route.ts     # 医院挂号
│   │       │   ├── payment/route.ts      # 缴费
│   │       │   ├── taxi/route.ts         # 叫车
│   │       │   └── weather/route.ts      # 天气
│   │       ├── health/                   # 健康模块
│   │       │   ├── report/route.ts       # 体检报告
│   │       │   └── medication/route.ts   # 用药提醒
│   │       └── family/                   # 家庭模块
│   │           ├── bind/route.ts         # 绑定关系
│   │           └── sync/route.ts         # 数据同步
│   ├── components/
│   │   ├── elder/                         # 老人端组件
│   │   │   ├── VoiceButton.tsx           # 大大的语音按钮
│   │   │   ├── VoiceWave.tsx             # 语音波形动画
│   │   │   ├── ResponseBubble.tsx        # AI回复气泡
│   │   │   └── QuickActions.tsx          # 快捷操作
│   │   ├── parent/                        # 子女端组件
│   │   │   ├── ElderCard.tsx             # 老人状态卡片
│   │   │   ├── ActivityLog.tsx           # 活动日志
│   │   │   └── AlertBadge.tsx            # 异常提醒
│   │   └── shared/
│   │       ├── Header.tsx
│   │       └── Loading.tsx
│   ├── lib/
│   │   ├── db.ts                         # 数据库
│   │   ├── ai.ts                         # AI封装
│   │   ├── voice.ts                      # 语音封装
│   │   ├── intent.ts                     # 意图识别
│   │   └── services/                     # 第三方服务封装
│   │       ├── hospital.ts
│   │       ├── payment.ts
│   │       ├── taxi.ts
│   │       └── weather.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       ├── useVoice.ts                   # 语音hook
│       └── useElderStatus.ts             # 老人状态hook
├── miniprogram/                          # 微信小程序代码
├── docs/
│   └── PRD.md
├── prisma/
│   └── schema.prisma
└── package.json
```

---

## 4. 数据库设计

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
  role            UserRole  // elder/parent
  avatar          String?
  createdAt       DateTime  @default(now())

  // 老人专属
  elderProfile    ElderProfile?
  medications     Medication[]
  healthRecords   HealthRecord[]
  voiceLogs       VoiceLog[]
  
  // 子女专属
  parentProfile   ParentProfile?
  alerts          Alert[]
}

enum UserRole {
  ELDER
  PARENT
}

// 老人资料
model ElderProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  age             Int?
  address         String?  // 住址(用于叫车/挂号)
  hospital        String?  // 常用医院
  bloodType       String?  // 血型
  allergies       String?  // 过敏史
  emergencyContact String? // 紧急联系人
  emergencyPhone  String?  // 紧急联系电话
}

// 子女资料
model ParentProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  linkedElders    ElderLink[]
}

// 绑定关系
model ElderLink {
  id              String   @id @default(uuid())
  parentId        String
  parent          ParentProfile @relation(fields: [parentId], references: [id])
  elderId         String
  elder           User     @relation(fields: [elderId], references: [id])
  relationship    String   // son/daughter/...
  isVerified      Boolean  @default(false)
  createdAt       DateTime @default(now())

  @@unique([parentId, elderId])
}

// 用药提醒
model Medication {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  name            String   // 药名
  dosage          String   // 剂量
  times           Json     // ["08:00", "20:00"]
  startDate       DateTime
  endDate         DateTime?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
}

// 健康记录
model HealthRecord {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  type            String   // checkup/consult/daily
  title           String
  content         Json
  aiAnalysis      String?
  fileUrl         String?
  createdAt       DateTime @default(now())
}

// 语音交互记录
model VoiceLog {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  audioUrl        String?  // 原始音频
  transcript      String   // 识别文字
  intent          String   // 意图: weather/hospital/payment/...
  response        String   // AI回复
  responseAudio   String?  // 回复音频
  timestamp       DateTime @default(now())

  @@index([userId, timestamp])
}

// 异常提醒
model Alert {
  id              String   @id @default(uuid())
  userId          String   // 老人ID
  user            User     @relation(fields: [userId], references: [id])
  parentId        String   // 推送给哪个子女
  type            String   // scam_link/suspicious_call/health_emergency
  severity        String   // low/medium/high
  title           String
  description     String
  isRead          Boolean  @default(false)
  createdAt       DateTime @default(now())

  @@index([parentId, isRead])
}
```

---

## 5. AI意图识别系统

### 5.1 意图分类

```typescript
// src/lib/intent.ts

const INTENTS = {
  // 生活服务
  WEATHER: {
    keywords: ['天气', '气温', '下雨', '出太阳', '冷不冷', '热不热'],
    handler: 'handleWeather'
  },
  HOSPITAL: {
    keywords: ['挂号', '看病', '预约医生', '医院', '不舒服'],
    handler: 'handleHospital'
  },
  MEDICATION: {
    keywords: ['吃药', '药', '提醒', '降压药', '降糖药'],
    handler: 'handleMedication'
  },
  PAYMENT: {
    keywords: ['交费', '缴费', '电费', '水费', '话费', '充值'],
    handler: 'handlePayment'
  },
  TAXI: {
    keywords: ['打车', '叫车', '出行', '去哪', '怎么走'],
    handler: 'handleTaxi'
  },
  
  // 健康相关
  HEALTH_REPORT: {
    keywords: ['体检', '报告', '化验', '检查结果'],
    handler: 'handleHealthReport'
  },
  HEALTH_CONSULT: {
    keywords: ['头疼', '发烧', '咳嗽', '不舒服', '哪里痛'],
    handler: 'handleHealthConsult'
  },
  
  // 防诈骗
  SCAM_CHECK: {
    keywords: ['中奖', '转账', '验证码', '安全账户', '公检法'],
    handler: 'handleScamCheck'
  },
  
  // 陪伴
  CHAT: {
    keywords: ['聊天', '陪我', '无聊', '讲故事'],
    handler: 'handleChat'
  },
  MUSIC: {
    keywords: ['戏曲', '唱歌', '音乐', '听歌', '相声'],
    handler: 'handleMusic'
  },
  
  // 紧急
  EMERGENCY: {
    keywords: ['救命', '120', '着火', '摔倒', '急救'],
    handler: 'handleEmergency'
  }
};
```

### 5.2 AI对话Prompt

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

回复格式: 直接用口语回复，不要用markdown，不要用列表，就像跟老人面对面说话一样。
`;
```

---

## 6. 老人端UI设计

### 6.1 设计原则
- **超大按钮**: 最小48px，推荐64px
- **高对比度**: 白底黑字，关键信息用橙色
- **语音优先**: 首页就是大大的语音按钮
- **极少文字**: 能用图标不用文字，能用语音不打字

### 6.2 老人端首页原型

```
┌─────────────────────────────────────────────────┐
│                                                 │
│            🧡 爸妈的小棉袄                       │
│                                                 │
│                                                 │
│         ┌─────────────────────┐                 │
│         │                     │                 │
│         │    🎙️              │                 │
│         │                     │                 │
│         │   按住说话           │                 │
│         │                     │                 │
│         └─────────────────────┘                 │
│              (64px大按钮)                        │
│                                                 │
│                                                 │
│    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐         │
│    │ 🏥  │  │ 💰  │  │ 🚗  │  │ 🌤️  │         │
│    │挂号 │  │缴费 │  │叫车 │  │天气 │         │
│    └─────┘  └─────┘  └─────┘  └─────┘         │
│                                                 │
│    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐         │
│    │ 💊  │  │ 📋  │  │ 📞  │  │ ⚙️  │         │
│    │吃药 │  │报告 │  │子女 │  │设置 │         │
│    └─────┘  └─────┘  └─────┘  └─────┘         │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 6.3 语音交互流程

```
用户按住按钮说话
    ↓
语音识别(讯飞ASR)
    ↓
意图识别(AI判断要做什么)
    ↓
┌─────────────────────────────────────┐
│ 意图          →  执行动作           │
├─────────────────────────────────────┤
│ 查天气        →  调用天气API        │
│ 挂号          →  调用医院API        │
│ 交费          →  调用微信支付       │
│ 叫车          →  调用滴滴API        │
│ 诈骗识别      →  AI分析+警告        │
│ 日常聊天      →  AI对话             │
│ 紧急情况      →  自动拨打120+通知子女│
└─────────────────────────────────────┘
    ↓
生成回复文本
    ↓
语音合成(讯飞TTS)
    ↓
播放回复音频
```

---

## 7. 子女端设计

### 7.1 子女端首页

```
┌─────────────────────────────────────────────────┐
│  🧡 小棉袄 · 家人版                   [设置]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  👨‍👩‍👧 我的家人                                   │
│  ┌─────────────────────────────────────────────┐│
│  │ 👴 爸爸 · 张建国                             ││
│  │ 状态: 🟢 在线  最后活跃: 10分钟前            ││
│  │ 今日: 语音交互8次 | 血压正常 | 未出门        ││
│  │                          [查看] [帮操作]    ││
│  ├─────────────────────────────────────────────┤│
│  │ 👵 妈妈 · 李秀英                             ││
│  │ 状态: 🟢 在线  最后活跃: 1小时前             ││
│  │ 今日: 语音交互3次 | 血压偏高 | 已出门        ││
│  │                          [查看] [帮操作]    ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  ⚠️ 异常提醒 (2)                                │
│  ┌─────────────────────────────────────────────┐│
│  │ 🔴 爸爸接到可疑电话 (诈骗)  10:32           ││
│  │ 🟡 妈妈本月药费超出预算     09:15           ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  📊 本周概览                                    │
│  ┌─────────────────────────────────────────────┐│
│  │ 语音交互: 45次  │  就医: 2次  │  缴费: 5次  ││
│  └─────────────────────────────────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

### 7.2 远程帮操作功能

```
┌─────────────────────────────────────────────────┐
│  ← 返回        帮爸爸挂号                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  选择医院:                                       │
│  ○ 深圳市人民医院 (2.3km)                       │
│  ● 深圳市第二人民医院 (3.1km)  ← 爸爸常去       │
│  ○ 北大深圳医院 (5.2km)                         │
│                                                 │
│  选择科室:                                       │
│  [内科] [外科] [骨科] [眼科] [心内科]            │
│                                                 │
│  选择时间:                                       │
│  明天上午 ✓ | 明天下午 | 后天上午 | 后天下午     │
│                                                 │
│  确认挂号信息:                                   │
│  ┌─────────────────────────────────────────────┐│
│  │ 患者: 张建国                                 ││
│  │ 医院: 深圳市第二人民医院                     ││
│  │ 科室: 内科                                   ││
│  │ 时间: 2026-06-25 上午                        ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  [确认挂号]  挂号成功后会通知爸爸                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 8. 防诈骗AI系统

### 8.1 诈骗识别规则

```typescript
const SCAM_PATTERNS = {
  // 关键词匹配
  keywords: [
    '中奖', '领奖', '转账', '汇款',
    '验证码', '密码', '安全账户',
    '公检法', '法院', '公安局',
    '海外遗产', '投资理财', '高回报',
    '刷单', '兼职', '日赚'
  ],
  
  // 行为模式
  patterns: [
    { desc: '要求转账到陌生账户', severity: 'high' },
    { desc: '索要验证码', severity: 'high' },
    { desc: '威胁恐吓语气', severity: 'high' },
    { desc: '催促立即操作', severity: 'medium' },
    { desc: '声称中奖需缴费', severity: 'high' }
  ],
  
  // AI分析提示
  aiPrompt: `请分析以下对话内容是否为诈骗:
{content}
判断标准:
1. 是否涉及转账/汇款
2. 是否索要验证码/密码
3. 是否声称公检法
4. 是否催促立即操作
5. 是否承诺高额回报
输出: { isScam: boolean, confidence: number, reason: string }`
};
```

### 8.2 异常检测

```typescript
const ANOMALY_DETECTION = {
  // 健康异常
  health: [
    { metric: 'blood_pressure', threshold: { systolic: 160, diastolic: 100 } },
    { metric: 'blood_sugar', threshold: { min: 3.9, max: 11.1 } },
    { metric: 'heart_rate', threshold: { min: 50, max: 120 } }
  ],
  
  // 行为异常
  behavior: [
    { desc: '24小时无语音交互', alert: '可能身体不适' },
    { desc: '深夜频繁使用手机', alert: '可能失眠' },
    { desc: '短时间内多次拨打同一号码', alert: '可能遭遇诈骗' }
  ],
  
  // 推送策略
  push: {
    immediate: ['scam_detected', 'health_emergency'],
    daily: ['medication_missed', 'low_activity'],
    weekly: ['spending_summary', 'health_trend']
  }
};
```

---

## 9. API接口设计

### 9.1 语音模块
```typescript
// POST /api/voice/recognize
// 语音识别
Request: FormData { audio: Blob, format: "wav" }
Response: { text: "帮我挂个号", confidence: 0.95 }

// POST /api/voice/synthesize
// 语音合成
Request: { text: "好的，您要去哪家医院？", speed: 0.8 }
Response: { audioUrl: "/audio/xxx.wav" }
```

### 9.2 AI对话
```typescript
// POST /api/ai/chat
// AI对话(含意图识别+回复生成)
Request: {
  userId: "uuid",
  text: "今天天气怎么样",
  context: [...对话历史]
}
Response: {
  intent: "WEATHER",
  response: "今天深圳28度，晴天，适合出门",
  audioUrl: "/audio/xxx.wav",
  actions: [
    { type: "weather_query", data: { city: "深圳" } }
  ]
}
```

### 9.3 服务模块
```typescript
// POST /api/services/hospital/book
// 挂号预约
Request: {
  elderId: "uuid",
  hospitalId: "xxx",
  department: "内科",
  date: "2026-06-25",
  timeSlot: "morning"
}
Response: { success: true, bookingId: "xxx", message: "挂号成功" }

// POST /api/services/payment/pay
// 缴费
Request: {
  elderId: "uuid",
  type: "electricity",  // electricity/water/gas/phone
  amount: 156.00
}
Response: { success: true, transactionId: "xxx" }

// POST /api/services/taxi/book
// 叫车
Request: {
  elderId: "uuid",
  from: "深圳市龙华区xxx",
  to: "深圳市人民医院"
}
Response: { success: true, orderId: "xxx", eta: "5分钟" }
```

### 9.4 家庭模块
```typescript
// GET /api/family/elders
// 获取绑定的老人列表
Response: {
  elders: [
    {
      id: "uuid",
      name: "张建国",
      relation: "father",
      status: "online",
      lastActive: "2026-06-24T10:30:00",
      todayActivity: { voiceCount: 8, healthStatus: "normal" }
    }
  ]
}

// GET /api/family/elders/:id/activity
// 获取老人活动详情
Response: {
  activities: [
    { time: "08:00", type: "voice", content: "查天气" },
    { time: "08:30", type: "medication", content: "吃降压药" },
    { time: "09:00", type: "voice", content: "叫车去医院" }
  ]
}

// POST /api/family/elders/:id/book-hospital
// 子女远程帮挂号
Request: { hospitalId, department, date, timeSlot }
Response: { success: true, bookingId: "xxx" }
```

---

## 10. 开发排期 (4周Sprint)

### Week 1: 基础架构 + 语音系统
| 天 | 任务 |
|----|------|
| Day 1-2 | 项目初始化、数据库、认证 |
| Day 3-4 | 讯飞语音ASR/TTS集成 |
| Day 5 | AI意图识别系统 |
| Day 6-7 | 老人端语音交互UI |

### Week 2: 核心服务
| 天 | 任务 |
|----|------|
| Day 1-2 | 医院挂号对接 |
| Day 3 | 水电煤缴费对接 |
| Day 4 | 叫车服务对接 |
| Day 5-6 | 天气/菜谱等生活服务 |
| Day 7 | 防诈骗AI系统 |

### Week 3: 健康 + 子女端
| 天 | 任务 |
|----|------|
| Day 1-2 | 体检报告AI解读 |
| Day 3 | 用药提醒系统 |
| Day 4-5 | 子女端Dashboard |
| Day 6-7 | 远程帮操作功能 |

### Week 4: 联调 + 上线
| 天 | 任务 |
|----|------|
| Day 1-2 | 前后端联调 |
| Day 3-4 | 测试+Bug修复 |
| Day 5 | 性能优化 |
| Day 6 | 微信小程序审核 |
| Day 7 | 部署上线 |

---

## 11. 商业模式

### 11.1 收入来源

| 产品 | 价格 | 描述 |
|------|------|------|
| 基础版 | 0元 | 语音交互30次/天、基础服务 |
| 孝心版 | 19.9元/月 | 无限语音、全家健康档案、子女远程协助 |
| 安心版 | 39.9元/月 | 全功能+24小时人工客服+紧急救援 |

### 11.2 增长策略
1. **子女孝心营销**: "给爸妈最好的礼物"
2. **社区推广**: 与社区老年大学合作
3. **子女口碑**: 邀请好友得会员
4. **内容营销**: 短视频展示老人使用场景

---

*文档版本: v1.0 | 最后更新: 2026-06-24*
