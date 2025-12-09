# 贡献指南

感谢你对游戏素材管理器项目的关注!

## 如何贡献

### 报告问题
- 使用 GitHub Issues 报告 bug
- 提供详细的复现步骤
- 包含系统环境信息

### 提交代码

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

### 代码规范

- 使用 TypeScript
- 遵循现有的代码风格
- 添加必要的注释
- 编写单元测试(如果适用)

### 添加新的收集器

如果你想添加对新素材网站的支持:

1. 在 `src/collectors/` 创建新的收集器类
2. 继承 `BaseCollector`
3. 实现 `collectAssets()` 方法
4. 在 `src/collectors/index.ts` 中注册
5. 添加相关文档

### 改进分类系统

如果你有更好的分类建议:

1. 在 Issue 中讨论
2. 更新 `src/core/taxonomy.ts`
3. 更新相关文档

## 开发设置

```bash
git clone <your-fork>
cd integrate_game_assert
npm install
npm run build
npm run dev
```

## 测试

```bash
npm test
```

## 提交信息规范

使用语义化的提交信息:

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例:
```
feat: 添加 Kenney.nl 收集器
fix: 修复分类推断错误
docs: 更新 API 文档
```

## 行为准则

- 尊重所有贡献者
- 保持建设性的讨论
- 欢迎新手参与

感谢你的贡献! 🎮✨
