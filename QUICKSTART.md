# 🚀 快速开始 - 5分钟上手

## 第一步: 安装依赖

```bash
npm install
```

## 第二步: 尝试导入素材

```bash
# 导入单个文件
npm run cli import ./path/to/your/asset.png \
  --category character \
  --tags "pixel-art,hero" \
  --license CC0

# 或批量导入整个目录
npm run cli import ./path/to/assets --recursive
```

## 第三步: 查看素材库

```bash
# 查看统计信息
npm run cli list

# 查看所有分类
npm run cli categories

# 浏览特定分类
npm run cli list character
```

## 第四步: 搜索素材

```bash
# 关键词搜索
npm run cli search "hero"

# 标签搜索
npm run cli search --tags "pixel-art,rpg"
```

## 第五步: 导出素材

```bash
# 导出素材到你的游戏项目
npm run cli export <asset-id> ./my-game/assets
```

## 进阶: 从在线源收集

```bash
# 查看可用的收集源
npm run cli collect --list

# 从 OpenGameArt 收集
npm run cli collect opengameart \
  --category character \
  --limit 10
```

## 进阶: 启动 API 服务

```bash
npm run serve

# 访问 http://localhost:3000/api/statistics
```

## 更多帮助

```bash
npm run cli --help
```

查看完整文档: [README.md](./README.md) | [中文文档](./README_CN.md)
