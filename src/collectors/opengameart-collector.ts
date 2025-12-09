/**
 * OpenGameArt.org 收集器
 * 从 OpenGameArt 收集免费游戏素材
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseCollector, CollectorSource, CollectedAsset } from './base-collector.js';
import { AssetCategory } from '../core/taxonomy.js';

export class OpenGameArtCollector extends BaseCollector {
  constructor() {
    const source: CollectorSource = {
      name: 'OpenGameArt.org',
      url: 'https://opengameart.org',
      description: '最大的免费游戏素材社区之一',
      categories: Object.values(AssetCategory),
      license: 'CC0, CC-BY, GPL等多种开源协议',
    };
    super(source);
  }

  async collectAssets(options: {
    category?: AssetCategory;
    page?: number;
    limit?: number;
  } = {}): Promise<CollectedAsset[]> {
    const { category, page = 0, limit = 20 } = options;

    try {
      console.log(`🔍 从 OpenGameArt 收集素材...`);

      const url = this.buildSearchUrl(category, page);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const assets: CollectedAsset[] = [];

      // 解析素材列表
      $('.art-preview').each((index, element) => {
        if (assets.length >= limit) return false;

        const $item = $(element);
        const title = $item.find('.art-preview-title a').text().trim();
        const pageUrl = $item.find('.art-preview-title a').attr('href');
        const author = $item.find('.username').text().trim();
        const previewImg = $item.find('.art-preview-image img').attr('src');

        if (title && pageUrl) {
          assets.push({
            name: title,
            category: category || AssetCategory.SPRITE,
            downloadUrl: `${this.source.url}${pageUrl}`,
            sourceUrl: `${this.source.url}${pageUrl}`,
            license: 'CC0/CC-BY',
            author: author || undefined,
            previewUrl: previewImg ? `${this.source.url}${previewImg}` : undefined,
          });
        }
      });

      console.log(`✓ 找到 ${assets.length} 个素材`);
      return assets;
    } catch (error) {
      console.error('收集失败:', error);
      return [];
    }
  }

  private buildSearchUrl(category?: AssetCategory, page: number = 0): string {
    let url = `${this.source.url}/art-search-advanced`;

    const params: string[] = [];
    if (category) {
      params.push(`field_art_type=${this.mapCategory(category)}`);
    }
    if (page > 0) {
      params.push(`page=${page}`);
    }

    return params.length > 0 ? `${url}?${params.join('&')}` : url;
  }

  private mapCategory(category: AssetCategory): string {
    const map: Record<string, string> = {
      [AssetCategory.CHARACTER]: '2d',
      [AssetCategory.BACKGROUND]: 'texture',
      [AssetCategory.MUSIC]: 'music',
      [AssetCategory.SFX]: 'sound',
      [AssetCategory.MODEL_3D]: '3d',
    };
    return map[category] || '2d';
  }
}
