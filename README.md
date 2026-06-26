# 🧡 爸妈的小棉袄 — AI老年人数字助手

> 让爸妈一句话搞定挂号、缴费、叫车、查天气

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## 📖 项目简介

**爸妈的小棉袄**是一款专为老年人设计的语音AI助手。老人只需按住按钮说一句话，就能完成查天气、挂号、缴费、叫车等日常操作。

### ✨ 核心特性

- 🎤 **语音优先** — 按住说话，AI语音回复，完全不用打字
- 🌤️ **查天气** — "今天天气怎么样"，自动获取天气并给穿衣建议
- 🏥 **语音挂号** — "帮我挂个号"，AI帮你预约医院
- 💰 **生活缴费** — "帮我交电费"，一句话完成缴费
- 🚗 **叫车出行** — "帮我叫个车"，语音叫出租车
- 🛡️ **防诈骗** — AI自动识别可疑信息，保护老人
- 💊 **用药提醒** — 定时提醒吃药，再也不会忘
- 👨‍👩‍👧 **子女远程** — 子女可远程帮爸妈操作

## 🚀 快速开始

### 方式一：本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/xyz130752/ai-elderly-assistant.git
cd ai-elderly-assistant

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的API密钥

# 4. 启动开发服务器
npm run dev
```

打开 http://localhost:3000

### 方式二：Docker 部署

```bash
# 1. 克隆仓库
git clone https://github.com/xyz130752/ai-elderly-assistant.git
cd ai-elderly-assistant

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的API密钥

# 3. 一键启动
docker-compose up -d

# 4. 查看日志
docker-compose logs -f
```

访问 http://localhost:3000

## 📁 项目结构

```
ai-elderly-assistant/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── elder/page.tsx     # 老人端
│   │   ├── parent/page.tsx    # 子女端
│   │   └── api/               # API路由
│   ├── components/            # UI组件
│   │   ├── elder/             # 老人端组件
│   │   └── parent/            # 子女端组件
│   ├── lib/                   # 工具库
│   │   ├── ai.ts             # AI封装
│   │   ├── voice.ts          # 语音封装
│   │   └── intent.ts         # 意图识别
│   └── types/                 # TypeScript类型
├── docs/                      # 项目文档
│   ├── PRD.md                # 产品需求文档
│   └── competitive-analysis.md
├── prisma/                    # 数据库Schema
├── Dockerfile                 # Docker镜像
├── docker-compose.yml         # Docker编排
└── CLAUDE.md                  # Claude Code开发指南
```

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [Next.js 15](https://nextjs.org/) | React框架 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 样式 |
| [TypeScript 5](https://www.typescriptlang.org/) | 类型安全 |
| [Prisma](https://www.prisma.io/) | ORM |
| [Xiaomi MiMo API](https://github.com/XiaomiMiMo) | AI大模型 |
| [高德地图API](https://lbs.amap.com/) | 天气/地图 |

## ⚙️ 环境变量

复制 `.env.example` 为 `.env.local`，填入以下配置：

```bash
# 必须配置
AI_API_KEY=your_api_key          # MiMo API密钥
AI_BASE_URL=https://token-plan-cn.xiaomimimo.com/v1
AI_MODEL=mimo-v2.5-pro

# 可选配置
AMAP_API_KEY=your_amap_key       # 高德地图(天气)
DATABASE_URL=postgresql://...    # PostgreSQL数据库
```

## 📚 文档

- [产品需求文档 (PRD)](docs/PRD.md)
- [竞品分析报告](docs/competitive-analysis.md)
- [Claude Code 开发指南](CLAUDE.md)

## 🤝 贡献指南

欢迎贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目开发。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [小米 MiMo](https://github.com/XiaomiMiMo) - AI大模型
- [高德地图](https://lbs.amap.com/) - 地图服务

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！
