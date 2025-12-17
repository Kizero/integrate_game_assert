# 安装指南

## macOS 用户

### 方案1: 使用 SQL.js (无需编译,推荐)

项目已更新为使用 SQL.js,这是一个纯 JavaScript 实现的 SQLite,**无需任何编译工具**。

直接安装即可:

```bash
npm install
```

如果遇到 `sharp` 的编译问题,可以跳过它(非必需):

```bash
npm install --no-optional
```

### 方案2: 如果使用旧版本 (better-sqlite3)

如果你拉取的是使用 `better-sqlite3` 的版本,需要安装 Xcode Command Line Tools:

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 然后安装依赖
npm install
```

## Linux 用户

直接安装即可:

```bash
npm install
```

## Windows 用户

直接安装即可:

```bash
npm install
```

## 验证安装

安装完成后,运行:

```bash
# 构建项目
npm run build

# 查看帮助
npm run cli -- --help
```

如果能正常显示帮助信息,说明安装成功!

## 常见问题

### Q: sharp 安装失败怎么办?

A: `sharp` 用于提取图片元数据,不是必需的。可以跳过:

```bash
npm install --no-optional
```

或者在 package.json 中将 sharp 移到 optionalDependencies。

### Q: 为什么使用 SQL.js 而不是 better-sqlite3?

A:
- **SQL.js**: 纯 JavaScript,无需编译,跨平台兼容性好
- **better-sqlite3**: 性能更好,但需要编译 C++ 扩展

对于素材管理器这种使用场景,SQL.js 的性能完全够用,且更易安装。

### Q: 数据库文件在哪里?

A: `./storage/database/assets.db`

### Q: 可以切换回 better-sqlite3 吗?

A: 可以,如果你的系统支持编译,better-sqlite3 性能会更好。修改 package.json 中的依赖即可。

## 下一步

查看 [快速开始指南](./QUICKSTART.md)
