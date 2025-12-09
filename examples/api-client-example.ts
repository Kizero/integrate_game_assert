/**
 * API 客户端使用示例 - API Client Example
 * 演示如何从其他项目调用素材管理器的 API
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function main() {
  console.log('=== API 客户端示例 ===\n');

  try {
    // 1. 获取统计信息
    console.log('1. 获取统计信息...');
    const statsResponse = await axios.get(`${API_BASE_URL}/statistics`);
    const stats = statsResponse.data.data;
    console.log(`✓ 总素材数: ${stats.totalAssets}`);
    console.log(`✓ 总大小: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB\n`);

    // 2. 获取所有分类
    console.log('2. 获取分类列表...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
    const categories = categoriesResponse.data.data;
    console.log(`✓ 可用分类: ${categories.length} 个\n`);

    // 3. 按分类获取素材
    console.log('3. 获取角色素材...');
    const assetsResponse = await axios.get(`${API_BASE_URL}/assets`, {
      params: {
        category: 'character',
        limit: 5,
      },
    });
    const assets = assetsResponse.data.data;
    console.log(`✓ 找到 ${assets.length} 个角色素材\n`);

    // 4. 搜索素材
    console.log('4. 搜索素材...');
    const searchResponse = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        q: 'hero',
        limit: 5,
      },
    });
    const searchResults = searchResponse.data.data;
    console.log(`✓ 搜索结果: ${searchResults.length} 个\n`);

    // 5. 获取单个素材详情
    if (searchResults.length > 0) {
      const assetId = searchResults[0].id;
      console.log('5. 获取素材详情...');
      const assetResponse = await axios.get(`${API_BASE_URL}/assets/${assetId}`);
      const asset = assetResponse.data.data;
      console.log(`✓ 素材名称: ${asset.name}`);
      console.log(`✓ 分类: ${asset.category}`);
      console.log(`✓ 大小: ${(asset.fileSize / 1024).toFixed(2)} KB`);
      console.log(`✓ 许可: ${asset.license}\n`);

      // 6. 下载素材
      console.log('6. 下载素材...');
      const downloadUrl = `${API_BASE_URL}/assets/${assetId}/download`;
      console.log(`✓ 下载链接: ${downloadUrl}\n`);
    }

    // 7. 按标签搜索
    console.log('7. 按标签搜索...');
    const tagSearchResponse = await axios.get(`${API_BASE_URL}/assets`, {
      params: {
        tags: 'pixel-art,2d',
      },
    });
    const tagResults = tagSearchResponse.data.data;
    console.log(`✓ 找到 ${tagResults.length} 个带有指定标签的素材\n`);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API 请求失败:', error.message);
      console.error('请确保 API 服务器正在运行 (npm run serve)');
    } else {
      console.error('错误:', error);
    }
  }
}

// 检查服务器是否运行
async function checkServer() {
  try {
    await axios.get('http://localhost:3000/health');
    return true;
  } catch {
    return false;
  }
}

checkServer().then(isRunning => {
  if (isRunning) {
    main().catch(console.error);
  } else {
    console.log('⚠️  API 服务器未运行');
    console.log('请先启动服务器: npm run serve');
  }
});
