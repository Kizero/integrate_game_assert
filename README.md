# 🎮 游戏素材资产管理器 (Game Asset Manager)

> 专业的免费游戏素材收集、管理和分发工具

一个采用大师级架构设计的游戏素材管理系统,帮助游戏开发者高效地收集、管理和使用免费游戏素材。

## ✨ 核心功能

### 📥 素材收集 (Collection)
- 🌐 从多个免费素材网站自动收集
- 📁 支持本地文件/目录批量导入
- 🏷️ 自动分类和标注
- 🔄 可扩展的收集器架构

### 🗂️ 智能分类系统 (Taxonomy)
基于游戏行业标准的专业分类:

**视觉素材 (Visual Assets)**
- 👤 人物/角色 (Characters)
- 🏃 动画/动作 (Animations)
- ✨ 视觉特效 (VFX)
- 🖼️ 背景 (Backgrounds)
- 🎨 UI界面元素 (UI Elements)
- 🧩 瓦片地图 (Tilesets)
- 🎁 道具 (Props)
- 💫 粒子效果 (Particles)
- 🎭 精灵图 (Sprites)
- 🌈 纹理贴图 (Textures)

**音频素材 (Audio Assets)**
- 🎵 背景音乐 (Music)
- 🔊 音效 (SFX)
- 🌊 环境音 (Ambient)
- 🗣️ 语音 (Voice)

**其他素材 (Other Assets)**
- 🔤 字体 (Fonts)
- 🎨 着色器 (Shaders)
- 📜 脚本模板 (Scripts)
- 🎲 3D模型 (3D Models)
- 🧱 预制体 (Prefabs)

### 🔍 强大的搜索功能
- 全文搜索
- 按分类浏览
- 标签过滤
- 多条件组合查询

### 🚀 多种分发方式
- 📡 REST API - 供其他项目调用
- 💻 CLI 工具 - 命令行管理
- 📦 SDK - 直接集成到项目

## 🏗️ 架构设计

```
游戏素材管理器
├── 收集层 (Collection Layer)
│   ├── 在线收集器 (Online Collectors)
│   │   ├── OpenGameArt
│   │   ├── Itch.io
│   │   └── 可扩展...
│   └── 本地导入 (Local Import)
│
├── 管理层 (Management Layer)
│   ├── 分类系统 (Taxonomy)
│   ├── 元数据管理 (Metadata)
│   ├── 存储管理 (Storage)
│   └── 数据库 (SQLite)
│
└── 分发层 (Distribution Layer)
    ├── REST API
    ├── CLI Tool
    └── SDK/Library
```

## 📦 安装

```bash
# 克隆仓库
git clone <repository-url>
cd integrate_game_assert

# 安装依赖
npm install

# 构建项目
npm run build
```

## 🚀 快速开始

### 1️⃣ 命令行使用 (CLI)

```bash
# 查看帮助
npm run cli -- --help

# 导入本地素材
npm run cli import ./my-assets/hero.png \
  --category character \
  --tags "pixel-art,rpg,hero" \
  --license CC0

# 批量导入目录
npm run cli import ./my-assets --recursive

# 搜索素材
npm run cli search "pixel hero"

# 按分类浏览
npm run cli list character

# 查看统计信息
npm run cli list

# 导出素材
npm run cli export <asset-id> ./exports

# 查看所有分类
npm run cli categories

# 从在线源收集
npm run cli collect --list
npm run cli collect opengameart --category character --limit 10
```

### 2️⃣ API 服务使用

```bash
# 启动 API 服务
npm run serve

# 服务将运行在 http://localhost:3000
```

**API 端点:**

```
GET  /api/assets              # 获取素材列表
GET  /api/assets/:id          # 获取素材详情
GET  /api/assets/:id/download # 下载素材
GET  /api/search?q=keyword    # 搜索素材
GET  /api/categories          # 获取分类列表
GET  /api/statistics          # 获取统计信息
```

**示例请求:**

```bash
# 获取统计信息
curl http://localhost:3000/api/statistics

# 搜索素材
curl http://localhost:3000/api/search?q=hero&limit=10

# 按分类获取
curl http://localhost:3000/api/assets?category=character&limit=20

# 下载素材
curl -O http://localhost:3000/api/assets/<asset-id>/download
```

### 3️⃣ 编程方式使用 (SDK)

```typescript
import { AssetManager, AssetCategory } from 'game-asset-manager';

// 创建管理器实例
const manager = new AssetManager();

// 导入素材
const asset = await manager.importAsset('./hero.png', {
  category: AssetCategory.CHARACTER,
  subcategory: 'hero',
  tags: ['pixel-art', '2d', 'rpg'],
  license: 'CC0',
});

// 搜索素材
const results = manager.search('hero', 10);

// 按分类浏览
const characters = manager.browseByCategory(AssetCategory.CHARACTER);

// 按标签搜索
const pixelArts = manager.searchByTags(['pixel-art', '2d']);

// 导出素材
manager.exportAsset(asset.id, './my-game/assets');

// 查看统计
const stats = manager.getStatistics();
console.log(`总素材数: ${stats.totalAssets}`);
```

## 📚 使用示例

### 示例 1: 基础使用

```bash
npm run build
node dist/examples/basic-usage.js
```

### 示例 2: 收集器使用

```bash
node dist/examples/collector-example.js
```

### 示例 3: API 客户端

```bash
# 先启动 API 服务
npm run serve

# 在另一个终端运行客户端示例
node dist/examples/api-client-example.js
```

## 🎯 使用场景

### 场景 1: 游戏快速原型开发
```bash
# 收集所需素材
npm run cli collect opengameart --category character --limit 5
npm run cli collect opengameart --category music --limit 3

# 导出到项目
npm run cli export <asset-id> ./my-game/assets
```

### 场景 2: 素材库管理
```bash
# 导入整个素材目录
npm run cli import ./downloaded-assets --recursive

# 查看库存
npm run cli list

# 搜索需要的素材
npm run cli search "forest background"
```

### 场景 3: 团队协作
```bash
# 启动 API 服务供团队使用
npm run serve

# 团队成员通过 API 获取素材
# GET http://localhost:3000/api/search?q=hero
```

## 🎨 素材来源

目前支持的免费素材网站:

| 网站 | 类型 | 许可协议 |
|------|------|---------|
| [OpenGameArt.org](https://opengameart.org) | 综合 | CC0, CC-BY, GPL等 |
| [Itch.io](https://itch.io/game-assets/free) | 综合 | 多种 |
| *更多即将支持...* | | |

## 📁 项目结构

```
.
├── src/
│   ├── core/               # 核心模块
│   │   ├── taxonomy.ts     # 分类系统
│   │   ├── database.ts     # 数据库管理
│   │   └── asset-manager.ts # 素材管理器
│   ├── collectors/         # 收集器模块
│   │   ├── base-collector.ts
│   │   ├── opengameart-collector.ts
│   │   └── itch-collector.ts
│   ├── api/               # API 服务
│   │   └── server.ts
│   ├── cli/               # CLI 工具
│   │   └── index.ts
│   └── index.ts           # 主入口
├── examples/              # 示例代码
├── storage/              # 存储目录
│   ├── assets/           # 素材文件
│   └── database/         # 数据库文件
└── README.md
```

## 🔧 配置

### 数据库路径
默认: `./storage/database/assets.db`

### 素材存储路径
默认: `./storage/assets`

### 自定义配置

```typescript
const manager = new AssetManager(
  './custom/path/assets.db',  // 数据库路径
  './custom/assets'           // 存储路径
);
```

## 🛠️ 开发指南

### 添加新的收集器

1. 创建收集器类继承 `BaseCollector`
2. 实现 `collectAssets()` 方法
3. 在 `collectors/index.ts` 中注册

```typescript
import { BaseCollector, CollectedAsset } from './base-collector.js';

export class MyCollector extends BaseCollector {
  constructor() {
    super({
      name: 'My Source',
      url: 'https://example.com',
      description: '我的素材源',
      categories: [AssetCategory.CHARACTER],
      license: 'CC0',
    });
  }

  async collectAssets(options?: any): Promise<CollectedAsset[]> {
    // 实现收集逻辑
    return [];
  }
}
```

### 添加新的素材分类

在 `src/core/taxonomy.ts` 中添加:

```typescript
export enum AssetCategory {
  // ... 现有分类
  NEW_CATEGORY = 'new_category',
}

export const CategoryRules = {
  // ... 现有规则
  [AssetCategory.NEW_CATEGORY]: {
    name: '新分类',
    nameEn: 'New Category',
    description: '新分类的描述',
    fileTypes: ['png', 'jpg'],
    subcategories: ['sub1', 'sub2'],
  },
};
```

## 🤝 贡献

欢迎贡献!请查看贡献指南。

## 📄 许可证

MIT License

## 🎯 路线图

- [ ] 支持更多素材来源 (Kenney.nl, CraftPix等)
- [ ] 添加素材预览功能
- [ ] 实现素材评分和推荐系统
- [ ] 添加 Web UI 界面
- [ ] 支持素材版本管理
- [ ] 添加素材自动优化功能
- [ ] 支持团队协作功能
- [ ] 云端同步功能

## 💡 灵感来源

这个工具的设计受到以下理念启发:
- **收集** - 像素材猎人一样,从互联网收集优质免费素材
- **管理** - 像图书馆管理员一样,精心分类和标注
- **分发** - 像素材商店一样,便捷地提供给需要的项目

## 📞 联系方式

如有问题或建议,欢迎提 Issue 或 Pull Request!

---

**Happy Game Development! 🎮✨**
