/**
 * 基础使用示例 - Basic Usage Example
 */

import { AssetManager, AssetCategory } from '../src/index.js';

async function main() {
  // 创建资产管理器实例
  const manager = new AssetManager();

  console.log('=== 游戏素材管理器示例 ===\n');

  // 1. 导入本地素材
  console.log('1. 导入素材文件...');
  try {
    const asset = await manager.importAsset('./examples/sample-assets/hero.png', {
      category: AssetCategory.CHARACTER,
      subcategory: 'hero',
      tags: ['pixel-art', '2d', 'rpg'],
      license: 'CC0',
      author: '示例作者',
      description: '主角角色素材',
    });

    console.log(`✓ 成功导入: ${asset.name}`);
    console.log(`  ID: ${asset.id}`);
    console.log(`  分类: ${asset.category}\n`);
  } catch (error) {
    console.log(`  (跳过 - 示例文件不存在)\n`);
  }

  // 2. 搜索素材
  console.log('2. 搜索素材...');
  const searchResults = manager.search('hero', 10);
  console.log(`✓ 找到 ${searchResults.length} 个相关素材\n`);

  // 3. 按分类浏览
  console.log('3. 浏览角色素材...');
  const characters = manager.browseByCategory(AssetCategory.CHARACTER, 5);
  console.log(`✓ 找到 ${characters.length} 个角色素材\n`);

  // 4. 按标签搜索
  console.log('4. 按标签搜索...');
  const tagResults = manager.searchByTags(['pixel-art', '2d'], false);
  console.log(`✓ 找到 ${tagResults.length} 个带有这些标签的素材\n`);

  // 5. 导出素材
  if (searchResults.length > 0) {
    console.log('5. 导出素材...');
    try {
      const exportPath = manager.exportAsset(searchResults[0].id, './exports');
      console.log(`✓ 素材已导出到: ${exportPath}\n`);
    } catch (error) {
      console.log(`  (导出失败)\n`);
    }
  }

  // 6. 查看统计信息
  console.log('6. 统计信息:');
  const stats = manager.getStatistics();
  console.log(`✓ 总素材数: ${stats.totalAssets}`);
  console.log(`✓ 总大小: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log('✓ 分类统计:');
  Object.entries(stats.byCategory).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count}`);
  });

  // 关闭管理器
  manager.close();
}

main().catch(console.error);
