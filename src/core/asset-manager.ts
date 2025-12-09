/**
 * 素材管理器核心 - Asset Manager Core
 * 负责素材的收集、存储、管理和分发
 */

import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import mime from 'mime-types';
import { AssetDatabase } from './database.js';
import { AssetMetadata, AssetCategory, inferCategoryFromFileType } from './taxonomy.js';

export interface ImportOptions {
  category?: AssetCategory;
  subcategory?: string;
  tags?: string[];
  license?: string;
  author?: string;
  description?: string;
  sourceUrl?: string;
}

export class AssetManager {
  private db: AssetDatabase;
  private storageRoot: string;

  constructor(
    dbPath: string = './storage/database/assets.db',
    storageRoot: string = './storage/assets'
  ) {
    this.db = new AssetDatabase(dbPath);
    this.storageRoot = storageRoot;
    fs.ensureDirSync(storageRoot);
  }

  /**
   * 导入单个素材文件
   */
  async importAsset(filePath: string, options: ImportOptions = {}): Promise<AssetMetadata> {
    // 验证文件存在
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName).slice(1).toLowerCase();

    // 生成唯一ID
    const assetId = this.generateAssetId(filePath);

    // 推断分类
    const category = options.category || inferCategoryFromFileType(fileExt) || AssetCategory.SPRITE;

    // 确定存储路径
    const categoryDir = path.join(this.storageRoot, category);
    fs.ensureDirSync(categoryDir);

    const storedFileName = `${assetId}.${fileExt}`;
    const storedPath = path.join(categoryDir, storedFileName);

    // 复制文件到存储目录
    fs.copyFileSync(filePath, storedPath);

    // 提取元数据
    const metadata: AssetMetadata = {
      id: assetId,
      name: options.description || fileName.replace(new RegExp(`\\.${fileExt}$`), ''),
      category,
      subcategory: options.subcategory,
      tags: options.tags || [],
      fileType: fileExt,
      fileSize: stats.size,
      filePath: storedPath,
      license: options.license || 'Unknown',
      author: options.author,
      description: options.description,
      sourceUrl: options.sourceUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloadCount: 0,
    };

    // 如果是图片,提取分辨率
    if (this.isImageFile(fileExt)) {
      metadata.resolution = await this.getImageResolution(storedPath);
    }

    // 保存到数据库
    this.db.addAsset(metadata);

    return metadata;
  }

  /**
   * 批量导入素材目录
   */
  async importDirectory(
    dirPath: string,
    options: ImportOptions = {},
    recursive: boolean = true
  ): Promise<AssetMetadata[]> {
    const results: AssetMetadata[] = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory() && recursive) {
        const subResults = await this.importDirectory(fullPath, options, recursive);
        results.push(...subResults);
      } else if (stats.isFile()) {
        try {
          const asset = await this.importAsset(fullPath, options);
          results.push(asset);
          console.log(`✓ 导入成功: ${file}`);
        } catch (error) {
          console.error(`✗ 导入失败: ${file}`, error);
        }
      }
    }

    return results;
  }

  /**
   * 获取素材
   */
  getAsset(id: string): AssetMetadata | null {
    return this.db.getAsset(id);
  }

  /**
   * 按分类浏览素材
   */
  browseByCategory(category: AssetCategory, limit: number = 100): AssetMetadata[] {
    return this.db.searchByCategory(category, limit);
  }

  /**
   * 搜索素材
   */
  search(keyword: string, limit: number = 50): AssetMetadata[] {
    return this.db.search(keyword, limit);
  }

  /**
   * 按标签搜索
   */
  searchByTags(tags: string[], matchAll: boolean = false): AssetMetadata[] {
    return this.db.searchByTags(tags, matchAll);
  }

  /**
   * 导出素材到指定目录
   */
  exportAsset(assetId: string, targetDir: string): string {
    const asset = this.db.getAsset(assetId);
    if (!asset) {
      throw new Error(`素材不存在: ${assetId}`);
    }

    fs.ensureDirSync(targetDir);
    const targetPath = path.join(targetDir, `${asset.name}.${asset.fileType}`);
    fs.copyFileSync(asset.filePath, targetPath);

    // 更新下载计数
    this.db.incrementDownloadCount(assetId);

    return targetPath;
  }

  /**
   * 批量导出素材
   */
  exportAssets(assetIds: string[], targetDir: string): string[] {
    return assetIds.map(id => this.exportAsset(id, targetDir));
  }

  /**
   * 获取统计信息
   */
  getStatistics() {
    return this.db.getStatistics();
  }

  /**
   * 删除素材
   */
  deleteAsset(assetId: string): void {
    const asset = this.db.getAsset(assetId);
    if (!asset) {
      throw new Error(`素材不存在: ${assetId}`);
    }

    // 删除文件
    if (fs.existsSync(asset.filePath)) {
      fs.unlinkSync(asset.filePath);
    }

    // 从数据库删除
    this.db.deleteAsset(assetId);
  }

  /**
   * 生成素材唯一ID
   */
  private generateAssetId(filePath: string): string {
    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    return hash.substring(0, 16);
  }

  /**
   * 判断是否是图片文件
   */
  private isImageFile(ext: string): boolean {
    const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];
    return imageExts.includes(ext.toLowerCase());
  }

  /**
   * 获取图片分辨率
   */
  private async getImageResolution(imagePath: string): Promise<string> {
    try {
      // 如果安装了 sharp,使用它来获取图片信息
      const sharp = await import('sharp');
      const metadata = await sharp.default(imagePath).metadata();
      return `${metadata.width}x${metadata.height}`;
    } catch (error) {
      // 如果 sharp 不可用,返回未知
      return 'unknown';
    }
  }

  /**
   * 关闭管理器
   */
  close(): void {
    this.db.close();
  }
}
