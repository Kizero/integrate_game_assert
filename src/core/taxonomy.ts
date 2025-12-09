/**
 * 游戏素材分类系统 - Game Asset Taxonomy
 * 基于游戏行业标准的专业分类体系
 */

export enum AssetCategory {
  // ========== 视觉素材 Visual Assets ==========
  CHARACTER = 'character',           // 人物/角色
  ANIMATION = 'animation',           // 动画/动作
  VFX = 'vfx',                      // 视觉特效
  BACKGROUND = 'background',         // 背景
  UI = 'ui',                        // UI界面元素
  TILESET = 'tileset',              // 瓦片地图集
  PROP = 'prop',                    // 道具/物品
  PARTICLE = 'particle',            // 粒子效果
  SPRITE = 'sprite',                // 精灵图
  TEXTURE = 'texture',              // 纹理贴图

  // ========== 音频素材 Audio Assets ==========
  MUSIC = 'music',                  // 背景音乐
  SFX = 'sfx',                      // 音效
  AMBIENT = 'ambient',              // 环境音
  VOICE = 'voice',                  // 语音

  // ========== 其他素材 Other Assets ==========
  FONT = 'font',                    // 字体
  SHADER = 'shader',                // 着色器
  SCRIPT = 'script',                // 脚本模板
  MODEL_3D = '3d_model',            // 3D模型
  PREFAB = 'prefab',                // 预制体
}

export enum AssetStyle {
  PIXEL_ART = 'pixel_art',          // 像素风
  LOW_POLY = 'low_poly',            // 低模
  REALISTIC = 'realistic',          // 写实
  CARTOON = 'cartoon',              // 卡通
  ANIME = 'anime',                  // 动漫
  ABSTRACT = 'abstract',            // 抽象
  HAND_DRAWN = 'hand_drawn',        // 手绘
  FLAT = 'flat',                    // 扁平化
  ISOMETRIC = 'isometric',          // 等距/2.5D
}

export enum GameGenre {
  RPG = 'rpg',                      // 角色扮演
  ACTION = 'action',                // 动作
  PLATFORMER = 'platformer',        // 平台跳跃
  PUZZLE = 'puzzle',                // 益智解谜
  SHOOTER = 'shooter',              // 射击
  STRATEGY = 'strategy',            // 策略
  ADVENTURE = 'adventure',          // 冒险
  SIMULATION = 'simulation',        // 模拟
  CASUAL = 'casual',                // 休闲
  HORROR = 'horror',                // 恐怖
  FIGHTING = 'fighting',            // 格斗
  RACING = 'racing',                // 赛车
}

export enum AssetQuality {
  LOW = 'low',                      // 低质量
  MEDIUM = 'medium',                // 中等
  HIGH = 'high',                    // 高质量
  ULTRA = 'ultra',                  // 超高质量
}

export interface AssetMetadata {
  id: string;
  name: string;
  category: AssetCategory;
  subcategory?: string;
  style?: AssetStyle;
  genre?: GameGenre[];
  tags: string[];

  // 文件信息
  fileType: string;                 // 文件类型 (png, jpg, mp3, ogg, etc.)
  fileSize: number;                 // 文件大小(字节)
  filePath: string;                 // 本地存储路径

  // 详细信息
  description?: string;
  author?: string;
  license: string;                  // CC0, CC-BY, MIT, etc.
  sourceUrl?: string;               // 原始来源URL

  // 技术参数
  resolution?: string;              // 分辨率 (仅图片)
  duration?: number;                // 时长(秒) (仅音频/视频)
  frameRate?: number;               // 帧率 (仅动画)
  quality?: AssetQuality;

  // 元数据
  createdAt: Date;
  updatedAt: Date;
  downloadCount: number;
  rating?: number;                  // 评分 0-5
}

/**
 * 素材分类规则定义
 */
export const CategoryRules = {
  [AssetCategory.CHARACTER]: {
    name: '角色/人物',
    nameEn: 'Characters',
    description: '游戏中的角色、敌人、NPC等人物素材',
    fileTypes: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'aseprite'],
    subcategories: [
      'hero',           // 主角
      'enemy',          // 敌人
      'npc',            // NPC
      'monster',        // 怪物
      'boss',           // Boss
      'animal',         // 动物
      'robot',          // 机器人
    ],
  },

  [AssetCategory.ANIMATION]: {
    name: '动画/动作',
    nameEn: 'Animations',
    description: '角色动作、特效动画等',
    fileTypes: ['png', 'gif', 'sprite', 'json', 'aseprite'],
    subcategories: [
      'walk',           // 行走
      'run',            // 奔跑
      'jump',           // 跳跃
      'attack',         // 攻击
      'death',          // 死亡
      'idle',           // 待机
      'skill',          // 技能
    ],
  },

  [AssetCategory.VFX]: {
    name: '视觉特效',
    nameEn: 'Visual Effects',
    description: '游戏中的各种视觉特效',
    fileTypes: ['png', 'gif', 'mp4', 'webm'],
    subcategories: [
      'explosion',      // 爆炸
      'fire',           // 火焰
      'water',          // 水效
      'lightning',      // 闪电
      'magic',          // 魔法
      'smoke',          // 烟雾
      'blood',          // 血液
      'hit',            // 打击
    ],
  },

  [AssetCategory.BACKGROUND]: {
    name: '背景',
    nameEn: 'Backgrounds',
    description: '游戏场景背景',
    fileTypes: ['png', 'jpg', 'jpeg', 'svg'],
    subcategories: [
      'forest',         // 森林
      'dungeon',        // 地牢
      'city',           // 城市
      'sky',            // 天空
      'ocean',          // 海洋
      'desert',         // 沙漠
      'mountain',       // 山脉
      'space',          // 太空
    ],
  },

  [AssetCategory.UI]: {
    name: 'UI界面',
    nameEn: 'UI Elements',
    description: '用户界面元素',
    fileTypes: ['png', 'svg', 'jpg'],
    subcategories: [
      'button',         // 按钮
      'panel',          // 面板
      'icon',           // 图标
      'bar',            // 进度条/血条
      'menu',           // 菜单
      'dialog',         // 对话框
      'hud',            // HUD元素
    ],
  },

  [AssetCategory.TILESET]: {
    name: '瓦片地图',
    nameEn: 'Tilesets',
    description: '瓦片地图素材集',
    fileTypes: ['png', 'tsx', 'json'],
    subcategories: [
      'ground',         // 地面
      'wall',           // 墙壁
      'platform',       // 平台
      'decoration',     // 装饰
    ],
  },

  [AssetCategory.MUSIC]: {
    name: '背景音乐',
    nameEn: 'Music',
    description: '游戏背景音乐',
    fileTypes: ['mp3', 'ogg', 'wav', 'flac'],
    subcategories: [
      'menu',           // 菜单音乐
      'battle',         // 战斗音乐
      'boss',           // Boss音乐
      'ambient',        // 氛围音乐
      'victory',        // 胜利音乐
      'defeat',         // 失败音乐
    ],
  },

  [AssetCategory.SFX]: {
    name: '音效',
    nameEn: 'Sound Effects',
    description: '游戏音效',
    fileTypes: ['mp3', 'ogg', 'wav'],
    subcategories: [
      'ui',             // UI音效
      'footstep',       // 脚步声
      'weapon',         // 武器音效
      'impact',         // 碰撞音效
      'magic',          // 魔法音效
      'voice',          // 语音
    ],
  },

  [AssetCategory.FONT]: {
    name: '字体',
    nameEn: 'Fonts',
    description: '游戏字体',
    fileTypes: ['ttf', 'otf', 'woff', 'woff2'],
    subcategories: [
      'pixel',          // 像素字体
      'handwritten',    // 手写字体
      'serif',          // 衬线字体
      'sans-serif',     // 无衬线字体
    ],
  },

  [AssetCategory.MODEL_3D]: {
    name: '3D模型',
    nameEn: '3D Models',
    description: '3D游戏模型',
    fileTypes: ['obj', 'fbx', 'gltf', 'glb', 'blend'],
    subcategories: [
      'character',      // 角色模型
      'prop',           // 道具模型
      'environment',    // 环境模型
      'vehicle',        // 载具模型
    ],
  },
};

/**
 * 常用标签库
 */
export const CommonTags = {
  // 风格标签
  style: ['2d', '3d', 'pixel', 'vector', 'hand-drawn', 'low-poly', 'realistic', 'cartoon'],

  // 主题标签
  theme: ['fantasy', 'sci-fi', 'medieval', 'modern', 'horror', 'cute', 'dark', 'colorful'],

  // 颜色标签
  color: ['monochrome', 'colorful', 'pastel', 'dark', 'bright', 'neon'],

  // 用途标签
  usage: ['commercial', 'personal', 'game-jam', 'prototype', 'production'],
};

/**
 * 根据文件类型推断素材类别
 */
export function inferCategoryFromFileType(fileType: string): AssetCategory | null {
  const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
  const audioTypes = ['mp3', 'ogg', 'wav', 'flac', 'aac'];
  const model3DTypes = ['obj', 'fbx', 'gltf', 'glb', 'blend', 'dae'];
  const fontTypes = ['ttf', 'otf', 'woff', 'woff2'];

  const ext = fileType.toLowerCase();

  if (audioTypes.includes(ext)) {
    return ext === 'mp3' || ext === 'ogg' ? AssetCategory.MUSIC : AssetCategory.SFX;
  }

  if (model3DTypes.includes(ext)) {
    return AssetCategory.MODEL_3D;
  }

  if (fontTypes.includes(ext)) {
    return AssetCategory.FONT;
  }

  // 图片类型需要进一步分析
  return null;
}
