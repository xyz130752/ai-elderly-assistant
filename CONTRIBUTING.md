# 贡献指南

感谢你对 **爸妈的小棉袄** 项目的关注！我们欢迎任何形式的贡献。

## 🐛 报告 Bug

如果你发现了 Bug，请通过 [GitHub Issues](https://github.com/xyz130752/ai-elderly-assistant/issues) 报告，并包含以下信息：

1. Bug 的详细描述
2. 复现步骤
3. 期望行为 vs 实际行为
4. 截图或日志（如有）
5. 你的运行环境（操作系统、Node.js 版本等）

## 💡 提交功能建议

欢迎通过 [GitHub Issues](https://github.com/xyz130752/ai-elderly-assistant/issues) 提交功能建议，标题以 `[Feature]` 开头。

## 🔧 提交代码

### 开发流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的修改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 提交前运行 `npm run lint` 确保代码风格一致
- Commit message 使用英文，格式：`<type>: <description>`

### Commit 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## 📝 开发环境搭建

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/你的用户名/ai-elderly-assistant.git
cd ai-elderly-assistant

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local

# 4. 启动开发服务器
npm run dev
```

## 📞 联系方式

如有问题，可通过 GitHub Issues 联系我们。

---

感谢你的贡献！🎉
