/**
 * 素材收集器基类 - Base Collector
 * 所有收集器的基础抽象类
 */

import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { AssetCategory } from '../core/taxonomy.js';

export interface CollectorSource {
  name: string;
  url: string;
  description: string;
  categories: AssetCategory[];
  license: string;
}

export interface CollectedAsset {
  name: string;
  category: AssetCategory;
  subcategory?: string;
  downloadUrl: string;
  sourceUrl: string;
  license: string;
  author?: string;
  description?: string;
  tags?: string[];
  previewUrl?: string;
}

export abstract class BaseCollector {
  protected source: CollectorSource;
  protected tempDir: string = './temp/downloads';

  constructor(source: CollectorSource) {
    this.source = source;
    fs.ensureDirSync(this.tempDir);
  }

  /**
   * 收集素材列表(抽象方法,子类实现)
   */
  abstract collectAssets(options?: any): Promise<CollectedAsset[]>;

  /**
   * 下载单个素材文件
   */
  async downloadAsset(asset: CollectedAsset): Promise<string> {
    try {
      console.log(`📥 下载: ${asset.name}`);

      const response = await axios.get(asset.downloadUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      // 从URL或Content-Type推断文件扩展名
      const ext = this.inferFileExtension(asset.downloadUrl, response.headers['content-type']);
      const fileName = `${this.sanitizeFileName(asset.name)}.${ext}`;
      const filePath = path.join(this.tempDir, fileName);

      await fs.writeFile(filePath, response.data);

      console.log(`✓ 下载完成: ${fileName}`);
      return filePath;
    } catch (error) {
      console.error(`✗ 下载失败: ${asset.name}`, error);
      throw error;
    }
  }

  /**
   * 批量下载素材
   */
  async downloadAssets(assets: CollectedAsset[], concurrent: number = 3): Promise<string[]> {
    const results: string[] = [];
    const chunks = this.chunkArray(assets, concurrent);

    for (const chunk of chunks) {
      const downloads = chunk.map(asset => this.downloadAsset(asset).catch(() => null));
      const paths = await Promise.all(downloads);
      results.push(...paths.filter((p): p is string => p !== null));
    }

    return results;
  }

  /**
   * 推断文件扩展名
   */
  protected inferFileExtension(url: string, contentType?: string): string {
    // 先从URL推断
    const urlExt = path.extname(url).slice(1).toLowerCase();
    if (urlExt && this.isValidExtension(urlExt)) {
      return urlExt;
    }

    // 从Content-Type推断
    if (contentType) {
      const mimeMap: Record<string, string> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'audio/mpeg': 'mp3',
        'audio/ogg': 'ogg',
        'audio/wav': 'wav',
        'application/zip': 'zip',
      };

      const ext = mimeMap[contentType.toLowerCase()];
      if (ext) return ext;
    }

    return 'bin'; // 默认扩展名
  }

  /**
   * 验证文件扩展名
   */
  private isValidExtension(ext: string): boolean {
    const validExts = [
      'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp',
      'mp3', 'ogg', 'wav', 'flac',
      'ttf', 'otf', 'woff', 'woff2',
      'zip', 'rar', '7z',
    ];
    return validExts.includes(ext);
  }

  /**
   * 清理文件名
   */
  protected sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 100);
  }

  /**
   * 将数组分块
   */
  protected chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 获取源信息
   */
  getSource(): CollectorSource {
    return this.source;
  }

  /**
   * 清理临时文件
   */
  async cleanup(): Promise<void> {
    await fs.remove(this.tempDir);
  }
}
