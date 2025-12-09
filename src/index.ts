/**
 * 游戏素材管理器 - Game Asset Manager
 * 主入口文件
 */

// 核心模块
export { AssetManager } from './core/asset-manager.js';
export { AssetDatabase } from './core/database.js';
export {
  AssetCategory,
  AssetStyle,
  GameGenre,
  AssetQuality,
  AssetMetadata,
  CategoryRules,
  CommonTags,
  inferCategoryFromFileType,
} from './core/taxonomy.js';

// 收集器模块
export {
  BaseCollector,
  CollectorSource,
  CollectedAsset,
  OpenGameArtCollector,
  ItchCollector,
  createCollector,
  listCollectors,
} from './collectors/index.js';

// 默认导出
export { AssetManager as default } from './core/asset-manager.js';
