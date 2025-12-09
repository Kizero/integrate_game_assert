# 🎮 游戏素材资产管理器 - 使用指南

## 🌟 设计理念

这个工具采用**大师级的游戏开发思维**设计,核心理念是:

1. **收集阶段** - 智能化收集互联网上的免费游戏素材
2. **管理阶段** - 专业化分类和元数据管理
3. **分发阶段** - 便捷化提供给游戏项目使用

## 🎯 核心价值

### 为什么需要这个工具?

在游戏开发过程中,我们常常面临以下问题:

- 🔍 **素材难找** - 免费素材分散在各个网站,难以查找
- 📦 **管理混乱** - 下载的素材文件命名混乱,分类不清
- 🔄 **重复劳动** - 每次新项目都要重新寻找素材
- ⚖️ **协议不明** - 不清楚素材的使用许可
- 🤝 **团队协作** - 团队成员难以共享素材库

**游戏素材管理器** 一站式解决这些问题!

## 📋 完整工作流程

### 流程 1: 从零开始建立素材库

```bash
# 1. 初始化项目
npm install

# 2. 从在线源收集素材
npm run cli collect opengameart --category character --limit 20
npm run cli collect opengameart --category music --limit 10
npm run cli collect opengameart --category vfx --limit 15

# 3. 导入本地已有的素材
npm run cli import ./my-old-assets --recursive

# 4. 查看素材库统计
npm run cli list

# 5. 查看具体分类
npm run cli list character
npm run cli list music
```

### 流程 2: 在新项目中使用素材

```bash
# 1. 搜索需要的素材
npm run cli search "pixel hero"

# 2. 查看搜索结果,记下 ID

# 3. 导出到项目目录
npm run cli export <asset-id> ./my-game/assets/characters

# 4. 在游戏中使用
# 素材已经按分类整理,直接在代码中引用即可
```

### 流程 3: 团队协作

```bash
# 团队管理员启动 API 服务
npm run serve

# 团队成员通过 API 浏览和下载
# 访问 http://team-server:3000/api/assets
```

## 🎨 分类系统详解

### 为什么这样分类?

我们的分类系统基于游戏行业的**最佳实践**,参考了主流游戏引擎(Unity, Unreal, Godot)的素材组织方式。

### 视觉素材分类逻辑

```
视觉素材 (Visual)
├── CHARACTER (角色) - 可控制的游戏角色
│   ├── hero - 主角
│   ├── enemy - 敌人
│   ├── npc - 非玩家角色
│   └── boss - Boss角色
│
├── ANIMATION (动画) - 角色或物体的动作序列
│   ├── walk - 行走动画
│   ├── attack - 攻击动画
│   └── skill - 技能动画
│
├── VFX (特效) - 视觉效果
│   ├── explosion - 爆炸
│   ├── magic - 魔法效果
│   └── hit - 打击效果
│
├── BACKGROUND (背景) - 游戏场景背景
│   ├── forest - 森林
│   ├── dungeon - 地牢
│   └── city - 城市
│
├── UI (界面) - 用户界面元素
│   ├── button - 按钮
│   ├── panel - 面板
│   └── icon - 图标
│
└── TILESET (瓦片) - 用于构建关卡的瓦片集
    ├── ground - 地面
    ├── wall - 墙壁
    └── platform - 平台
```

### 音频素材分类逻辑

```
音频素材 (Audio)
├── MUSIC (音乐) - 背景音乐
│   ├── menu - 菜单音乐
│   ├── battle - 战斗音乐
│   └── boss - Boss音乐
│
├── SFX (音效) - 音效
│   ├── ui - 界面音效
│   ├── weapon - 武器音效
│   └── footstep - 脚步声
│
├── AMBIENT (环境音) - 环境氛围音效
└── VOICE (语音) - 角色语音
```

## 🔍 高级搜索技巧

### 1. 组合搜索

```bash
# 搜索像素风格的英雄角色
npm run cli search "pixel hero"

# 按标签精确搜索
npm run cli search --tags "pixel-art,rpg,hero"
```

### 2. 分类过滤

```bash
# 只在角色分类中搜索
npm run cli search "warrior" --category character
```

### 3. 通过编程进行复杂查询

```typescript
import { AssetManager, AssetCategory } from './src/index.js';

const manager = new AssetManager();

// 查找所有像素风格的角色
const results = manager.searchByTags(['pixel-art'], false)
  .filter(asset => asset.category === AssetCategory.CHARACTER);

// 查找特定分辨率的背景
const backgrounds = manager.browseByCategory(AssetCategory.BACKGROUND)
  .filter(asset => asset.resolution === '1920x1080');
```

## 🎮 实战案例

### 案例 1: 制作一个像素风RPG游戏

```bash
# 1. 收集角色素材
npm run cli collect opengameart --category character --limit 20
npm run cli search "pixel rpg" --category character

# 2. 收集背景素材
npm run cli search "pixel forest" --category background
npm run cli search "pixel dungeon" --category background

# 3. 收集UI素材
npm run cli search "pixel ui" --category ui

# 4. 收集音乐
npm run cli search "rpg music" --category music

# 5. 导出到项目
mkdir -p ./my-rpg/assets
npm run cli export <character-id> ./my-rpg/assets/characters
npm run cli export <bg-id> ./my-rpg/assets/backgrounds
# ... 继续导出其他素材
```

### 案例 2: Game Jam 快速原型

```bash
# 时间紧迫,快速收集各类素材
npm run cli collect opengameart --category character --limit 5
npm run cli collect opengameart --category music --limit 3
npm run cli collect opengameart --category sfx --limit 10

# 查看收集的素材
npm run cli list

# 批量导出
# (可以编写脚本批量导出)
```

### 案例 3: 建立公司素材库

```bash
# 1. 系统化收集
npm run cli collect opengameart --limit 100
npm run cli import ./purchased-assets --recursive

# 2. 启动 API 服务供全公司使用
npm run serve

# 3. 团队成员通过 API 使用
# 开发工具可以集成 API,直接在编辑器中浏览和下载素材
```

## 🛠️ 自定义和扩展

### 添加自己的素材收集器

假设你经常从某个特定网站下载素材:

```typescript
// src/collectors/my-custom-collector.ts
import { BaseCollector, CollectorSource, CollectedAsset } from './base-collector.js';

export class MyCustomCollector extends BaseCollector {
  constructor() {
    super({
      name: '我的素材网站',
      url: 'https://my-asset-site.com',
      description: '我常用的素材网站',
      categories: [...],
      license: 'CC0',
    });
  }

  async collectAssets(options?: any): Promise<CollectedAsset[]> {
    // 实现你的收集逻辑
    // 可以使用网页抓取、API调用等方式
    return [];
  }
}
```

### 自定义分类

如果你的项目有特殊需求:

```typescript
// 在 taxonomy.ts 中添加新分类
export enum AssetCategory {
  // 现有分类...
  CUTSCENE = 'cutscene',  // 过场动画
  DIALOGUE = 'dialogue',  // 对话框
}
```

## 📊 素材管理最佳实践

### 1. 标签规范

建议使用统一的标签命名:

```
风格: pixel-art, low-poly, realistic, cartoon
维度: 2d, 3d
主题: fantasy, sci-fi, medieval, modern
颜色: colorful, monochrome, dark, bright
用途: prototype, production, game-jam
```

### 2. 导入时添加完整元数据

```bash
npm run cli import ./asset.png \
  --category character \
  --subcategory hero \
  --tags "pixel-art,rpg,hero,2d" \
  --license "CC0" \
  --author "Artist Name" \
  --description "主角角色 - 战士"
```

### 3. 定期备份数据库

```bash
# 备份数据库文件
cp ./storage/database/assets.db ./backups/assets-$(date +%Y%m%d).db
```

## 🚀 性能优化建议

### 大量素材管理

如果素材库超过 10,000 个素材:

1. 定期清理未使用的素材
2. 考虑分库管理(按项目或类型)
3. 使用更强大的数据库(PostgreSQL)

### API 服务优化

```typescript
// 添加缓存
// 添加分页
// 压缩响应
```

## 🎓 学习资源

### 推荐的免费素材网站

- [OpenGameArt.org](https://opengameart.org) - 最大的免费游戏素材社区
- [Itch.io](https://itch.io/game-assets/free) - 独立开发者素材平台
- [Kenney.nl](https://kenney.nl) - 高质量游戏素材
- [Freesound.org](https://freesound.org) - 免费音效库

### 许可协议说明

- **CC0** - 完全公开,可商用,无需署名
- **CC-BY** - 可商用,需要署名
- **GPL** - 开源协议,衍生作品需开源
- **MIT** - 宽松开源协议

## 💬 常见问题

**Q: 可以用于商业项目吗?**
A: 取决于素材的许可协议,CC0 和 CC-BY 通常可以商用。

**Q: 如何批量导出?**
A: 可以使用编程方式或编写脚本批量导出。

**Q: 支持什么文件格式?**
A: 图片(PNG, JPG, GIF, SVG)、音频(MP3, OGG, WAV)、3D模型(OBJ, FBX, GLTF)等。

**Q: 数据库文件可以共享吗?**
A: 可以,但要注意素材文件路径的问题。

---

**祝你的游戏开发之旅顺利! 🎮✨**
