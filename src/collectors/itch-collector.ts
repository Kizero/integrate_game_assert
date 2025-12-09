/**
 * Itch.io 免费素材收集器
 * 从 Itch.io 收集免费游戏素材
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseCollector, CollectorSource, CollectedAsset } from './base-collector.js';
import { AssetCategory } from '../core/taxonomy.js';

export class ItchCollector extends BaseCollector {
  constructor() {
    const source: CollectorSource = {
      name: 'Itch.io Game Assets',
      url: 'https://itch.io/game-assets/free',
      description: 'Itch.io 平台上的免费游戏素材',
      categories: Object.values(AssetCategory),
      license: '多种协议,需查看具体素材',
    };
    super(source);
  }

  async collectAssets(options: {
    category?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<CollectedAsset[]> {
    const { category = 'all', page = 1, limit = 20 } = options;

    try {
      console.log(`🔍 从 Itch.io 收集免费素材...`);

      const url = `${this.source.url}?page=${page}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const assets: CollectedAsset[] = [];

      $('.game_cell').each((index, element) => {
        if (assets.length >= limit) return false;

        const $item = $(element);
        const title = $item.find('.title').text().trim();
        const gameUrl = $item.find('.thumb_link').attr('href');
        const author = $item.find('.game_author a').text().trim();
        const previewImg = $item.find('.game_thumb').attr('data-background_image');

        if (title && gameUrl) {
          assets.push({
            name: title,
            category: AssetCategory.SPRITE, // 需要进一步解析确定类别
            downloadUrl: gameUrl,
            sourceUrl: gameUrl,
            license: 'Various',
            author: author || undefined,
            previewUrl: previewImg,
          });
        }
      });

      console.log(`✓ 找到 ${assets.length} 个素材包`);
      return assets;
    } catch (error) {
      console.error('收集失败:', error);
      return [];
    }
  }
}
