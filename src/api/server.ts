/**
 * API 分发服务器
 * 提供 REST API 供其他项目调用
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { AssetManager } from '../core/asset-manager.js';
import { AssetCategory } from '../core/taxonomy.js';

const app = express();
const manager = new AssetManager();

app.use(express.json());

// 跨域支持
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/**
 * GET /api/assets
 * 获取素材列表
 */
app.get('/api/assets', (req: Request, res: Response) => {
  try {
    const { category, tags, limit = '50' } = req.query;

    let assets;

    if (category && typeof category === 'string') {
      assets = manager.browseByCategory(category as AssetCategory, parseInt(limit as string));
    } else if (tags && typeof tags === 'string') {
      const tagList = tags.split(',').map(t => t.trim());
      assets = manager.searchByTags(tagList);
    } else {
      // 返回统计信息
      const stats = manager.getStatistics();
      return res.json({ success: true, data: stats });
    }

    res.json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/assets/:id
 * 获取单个素材详情
 */
app.get('/api/assets/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = manager.getAsset(id);

    if (!asset) {
      return res.status(404).json({ success: false, error: '素材不存在' });
    }

    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/assets/:id/download
 * 下载素材文件
 */
app.get('/api/assets/:id/download', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = manager.getAsset(id);

    if (!asset) {
      return res.status(404).json({ success: false, error: '素材不存在' });
    }

    // 设置响应头
    res.setHeader('Content-Type', `application/${asset.fileType}`);
    res.setHeader('Content-Disposition', `attachment; filename="${asset.name}.${asset.fileType}"`);

    // 发送文件
    res.sendFile(path.resolve(asset.filePath));
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/search
 * 搜索素材
 */
app.get('/api/search', (req: Request, res: Response) => {
  try {
    const { q, limit = '50' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: '缺少搜索关键词' });
    }

    const assets = manager.search(q, parseInt(limit as string));

    res.json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/categories
 * 获取所有分类
 */
app.get('/api/categories', (req: Request, res: Response) => {
  try {
    const categories = Object.values(AssetCategory).map(cat => ({
      value: cat,
      label: cat,
    }));

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/statistics
 * 获取统计信息
 */
app.get('/api/statistics', (req: Request, res: Response) => {
  try {
    const stats = manager.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * 健康检查
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'game-asset-manager' });
});

/**
 * 404 处理
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: '接口不存在' });
});

/**
 * 启动服务器
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 游戏素材管理器 API 服务启动成功`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`📚 API文档:`);
  console.log(`   GET /api/assets - 获取素材列表`);
  console.log(`   GET /api/assets/:id - 获取素材详情`);
  console.log(`   GET /api/assets/:id/download - 下载素材`);
  console.log(`   GET /api/search?q=keyword - 搜索素材`);
  console.log(`   GET /api/categories - 获取分类列表`);
  console.log(`   GET /api/statistics - 获取统计信息`);
});

export default app;
