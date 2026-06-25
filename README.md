# 🧡 爸妈的小棉袄 — AI老年人数字助手

> 让爸妈一句话搞定挂号、缴费、叫车、查天气

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入API密钥

# 3. 初始化数据库
npx prisma db push

# 4. 启动开发服务器
npm run dev
```

打开 http://localhost:3000

## 项目结构

```
src/
├── app/                    # Next.js App Router页面
│   ├── page.tsx            # 首页(选择老人/子女端)
│   ├── elder/page.tsx      # 老人端语音交互页
│   ├── parent/page.tsx     # 子女端Dashboard
│   └── api/                # API路由
│       ├── voice/          # 语音识别/合成
│       ├── ai/             # AI对话/意图识别/诈骗检测
│       ├── services/       # 天气/挂号/缴费/叫车
│       ├── health/         # 健康报告/用药提醒
│       └── family/         # 家庭绑定/数据同步
├── components/
│   ├── elder/              # 老人端组件
│   │   ├── VoiceButton     # 大大的语音按钮
│   │   ├── ResponseBubble  # AI回复气泡
│   │   └── QuickActions    # 快捷操作按钮
│   └── parent/             # 子女端组件
│       └── ElderCard       # 老人状态卡片
├── lib/
│   ├── db.ts               # Prisma数据库连接
│   ├── ai.ts               # Claude API封装
│   ├── voice.ts            # 讯飞语音ASR/TTS
│   ├── intent.ts           # 意图识别
│   └── utils.ts            # 工具函数
└── types/
    └── index.ts            # TypeScript类型定义
```

## 核心功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 🎤 语音交互 | ✅ | 按住说话，AI回复语音 |
| 🌤️ 查天气 | ✅ | 高德天气API |
| 🏥 挂号 | 🔲 | 需对接医院API |
| 💰 缴费 | 🔲 | 需对接支付平台 |
| 🚗 叫车 | 🔲 | 需对接滴滴API |
| 🛡️ 防诈骗 | ✅ | AI识别可疑信息 |
| 💊 用药提醒 | ✅ | 定时提醒吃药 |
| 📋 体检解读 | ✅ | AI解读体检报告 |
| 👨‍👩‍👧 子女远程 | ✅ | 查看状态/远程操作 |

## 技术栈

- **前端**: Next.js 15 + Tailwind CSS + Framer Motion
- **AI**: Anthropic Claude API
- **语音**: 讯飞语音(ASR/TTS)
- **数据库**: PostgreSQL (Prisma ORM)
- **地图**: 高德地图API
- **部署**: Vercel

## 环境变量

```bash
# 必须配置
ANTHROPIC_API_KEY=sk-a...      # Claude API密钥
IFLYTEK_APP_ID=xxx             # 讯飞开放平台AppID
IFLYTEK_API_KEY=xxx            # 讯飞API Key
IFLYTEK_API_SECRET=xxx         # 讯飞API Secret

# 可选配置
AMAP_API_KEY=xxx               # 高德地图(天气)
DATABASE_URL=postgresql://...  # PostgreSQL数据库
```

## 部署

```bash
# 推送到GitHub
git add . && git commit -m "feat: init" && git push

# 在 Vercel 导入项目，配置环境变量，点击 Deploy
```

## 文档

- [PRD产品需求文档](docs/PRD.md)
- [竞品分析报告](docs/competitive-analysis.md)
- [开发指南 (CLAUDE.md)](CLAUDE.md)
