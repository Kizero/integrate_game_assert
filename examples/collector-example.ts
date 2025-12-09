/**
 * 收集器使用示例 - Collector Example
 */

import { createCollector, AssetManager, AssetCategory } from '../src/index.js';

async function main() {
  console.log('=== 素材收集器示例 ===\n');

  // 创建 OpenGameArt 收集器
  const collector = createCollector('opengameart');

  console.log(`使用收集器: ${collector.getSource().name}`);
  console.log(`来源: ${collector.getSource().url}\n`);

  // 收集素材列表
  console.log('正在收集素材列表...');
  const assets = await collector.collectAssets({
    category: AssetCategory.CHARACTER,
    limit: 5,
  });

  console.log(`\n找到 ${assets.length} 个素材:\n`);

  // 显示素材信息
  assets.forEach((asset, index) => {
    console.log(`${index + 1}. ${asset.name}`);
    console.log(`   分类: ${asset.category}`);
    console.log(`   作者: ${asset.author || '未知'}`);
    console.log(`   许可: ${asset.license}`);
    console.log(`   来源: ${asset.sourceUrl}\n`);
  });

  // 下载第一个素材(示例)
  if (assets.length > 0) {
    console.log('下载示例素材...');
    try {
      const filePath = await collector.downloadAsset(assets[0]);
      console.log(`✓ 下载完成: ${filePath}\n`);

      // 导入到素材库
      const manager = new AssetManager();
      const imported = await manager.importAsset(filePath, {
        category: assets[0].category,
        tags: assets[0].tags,
        license: assets[0].license,
        author: assets[0].author,
        sourceUrl: assets[0].sourceUrl,
      });

      console.log(`✓ 已导入到素材库: ${imported.name}`);
      console.log(`  ID: ${imported.id}`);

      manager.close();
    } catch (error) {
      console.error('下载/导入失败:', error);
    }
  }

  // 清理临时文件
  await collector.cleanup();
}

main().catch(console.error);
