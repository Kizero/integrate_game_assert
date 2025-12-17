/**
 * 数据库管理 - Database Manager (SQL.js 版本)
 * 使用 SQL.js (纯 JavaScript 实现,无需编译)
 */

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs-extra';
import { AssetMetadata, AssetCategory } from './taxonomy.js';

export class AssetDatabase {
  private db: SqlJsDatabase | null = null;
  private dbPath: string;
  private SQL: any;

  constructor(dbPath: string = './storage/database/assets.db') {
    this.dbPath = dbPath;
    fs.ensureDirSync(path.dirname(dbPath));
  }

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    this.SQL = await initSqlJs();

    // 尝试加载现有数据库
    if (fs.existsSync(this.dbPath)) {
      const buffer = fs.readFileSync(this.dbPath);
      this.db = new this.SQL.Database(buffer);
    } else {
      this.db = new this.SQL.Database();
      await this.createTables();
    }
  }

  /**
   * 创建数据库表
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(`
      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        style TEXT,
        genre TEXT,
        tags TEXT,

        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        file_path TEXT NOT NULL,

        description TEXT,
        author TEXT,
        license TEXT NOT NULL,
        source_url TEXT,

        resolution TEXT,
        duration REAL,
        frame_rate INTEGER,
        quality TEXT,

        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        download_count INTEGER DEFAULT 0,
        rating REAL
      );

      CREATE INDEX IF NOT EXISTS idx_category ON assets(category);
      CREATE INDEX IF NOT EXISTS idx_subcategory ON assets(subcategory);
      CREATE INDEX IF NOT EXISTS idx_license ON assets(license);

      CREATE TABLE IF NOT EXISTS asset_tags (
        asset_id TEXT NOT NULL,
        tag TEXT NOT NULL,
        PRIMARY KEY (asset_id, tag),
        FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_tag ON asset_tags(tag);

      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS collection_assets (
        collection_id TEXT NOT NULL,
        asset_id TEXT NOT NULL,
        PRIMARY KEY (collection_id, asset_id),
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
        FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
      );
    `);

    this.save();
  }

  /**
   * 保存数据库到文件
   */
  private save(): void {
    if (!this.db) return;
    const data = this.db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(this.dbPath, buffer);
  }

  /**
   * 添加素材
   */
  addAsset(asset: AssetMetadata): void {
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(
      `INSERT INTO assets (
        id, name, category, subcategory, style, genre, tags,
        file_type, file_size, file_path,
        description, author, license, source_url,
        resolution, duration, frame_rate, quality,
        created_at, updated_at, download_count, rating
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        asset.id,
        asset.name,
        asset.category,
        asset.subcategory || null,
        asset.style || null,
        asset.genre ? JSON.stringify(asset.genre) : null,
        JSON.stringify(asset.tags),
        asset.fileType,
        asset.fileSize,
        asset.filePath,
        asset.description || null,
        asset.author || null,
        asset.license,
        asset.sourceUrl || null,
        asset.resolution || null,
        asset.duration || null,
        asset.frameRate || null,
        asset.quality || null,
        asset.createdAt.toISOString(),
        asset.updatedAt.toISOString(),
        asset.downloadCount,
        asset.rating || null,
      ]
    );

    // 添加标签
    for (const tag of asset.tags) {
      this.db.run('INSERT INTO asset_tags (asset_id, tag) VALUES (?, ?)', [asset.id, tag]);
    }

    this.save();
  }

  /**
   * 获取素材
   */
  getAsset(id: string): AssetMetadata | null {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM assets WHERE id = ?', [id]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    return this.rowToAsset(result[0].columns, result[0].values[0]);
  }

  /**
   * 按分类搜索素材
   */
  searchByCategory(category: AssetCategory, limit: number = 100): AssetMetadata[] {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM assets WHERE category = ? LIMIT ?', [category, limit]);
    if (result.length === 0) return [];

    return result[0].values.map(row => this.rowToAsset(result[0].columns, row));
  }

  /**
   * 按标签搜索素材
   */
  searchByTags(tags: string[], matchAll: boolean = false): AssetMetadata[] {
    if (!this.db) throw new Error('Database not initialized');
    if (tags.length === 0) return [];

    let query: string;
    let params: any[];

    if (matchAll) {
      query = `
        SELECT a.* FROM assets a
        WHERE a.id IN (
          SELECT asset_id FROM asset_tags
          WHERE tag IN (${tags.map(() => '?').join(',')})
          GROUP BY asset_id
          HAVING COUNT(DISTINCT tag) = ?
        )
      `;
      params = [...tags, tags.length];
    } else {
      query = `
        SELECT DISTINCT a.* FROM assets a
        JOIN asset_tags t ON a.id = t.asset_id
        WHERE t.tag IN (${tags.map(() => '?').join(',')})
      `;
      params = tags;
    }

    const result = this.db.exec(query, params);
    if (result.length === 0) return [];

    return result[0].values.map(row => this.rowToAsset(result[0].columns, row));
  }

  /**
   * 全文搜索
   */
  search(keyword: string, limit: number = 50): AssetMetadata[] {
    if (!this.db) throw new Error('Database not initialized');

    const pattern = `%${keyword}%`;
    const result = this.db.exec(
      `SELECT * FROM assets
       WHERE name LIKE ? OR description LIKE ? OR tags LIKE ?
       LIMIT ?`,
      [pattern, pattern, pattern, limit]
    );

    if (result.length === 0) return [];
    return result[0].values.map(row => this.rowToAsset(result[0].columns, row));
  }

  /**
   * 获取统计信息
   */
  getStatistics() {
    if (!this.db) throw new Error('Database not initialized');

    const countResult = this.db.exec('SELECT COUNT(*) as count FROM assets');
    const sizeResult = this.db.exec('SELECT SUM(file_size) as size FROM assets');
    const categoryResult = this.db.exec('SELECT category, COUNT(*) as count FROM assets GROUP BY category');

    const totalAssets = countResult[0]?.values[0]?.[0] || 0;
    const totalSize = sizeResult[0]?.values[0]?.[0] || 0;

    const byCategory: Record<string, number> = {};
    if (categoryResult.length > 0) {
      categoryResult[0].values.forEach((row: any[]) => {
        byCategory[row[0]] = row[1];
      });
    }

    return {
      totalAssets: Number(totalAssets),
      totalSize: Number(totalSize),
      byCategory,
    };
  }

  /**
   * 更新下载计数
   */
  incrementDownloadCount(id: string): void {
    if (!this.db) throw new Error('Database not initialized');

    this.db.run('UPDATE assets SET download_count = download_count + 1 WHERE id = ?', [id]);
    this.save();
  }

  /**
   * 删除素材
   */
  deleteAsset(id: string): void {
    if (!this.db) throw new Error('Database not initialized');

    this.db.run('DELETE FROM assets WHERE id = ?', [id]);
    this.save();
  }

  /**
   * 将数据库行转换为 AssetMetadata
   */
  private rowToAsset(columns: string[], row: any[]): AssetMetadata {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });

    return {
      id: obj.id,
      name: obj.name,
      category: obj.category as AssetCategory,
      subcategory: obj.subcategory,
      style: obj.style,
      genre: obj.genre ? JSON.parse(obj.genre) : undefined,
      tags: JSON.parse(obj.tags || '[]'),
      fileType: obj.file_type,
      fileSize: obj.file_size,
      filePath: obj.file_path,
      description: obj.description,
      author: obj.author,
      license: obj.license,
      sourceUrl: obj.source_url,
      resolution: obj.resolution,
      duration: obj.duration,
      frameRate: obj.frame_rate,
      quality: obj.quality,
      createdAt: new Date(obj.created_at),
      updatedAt: new Date(obj.updated_at),
      downloadCount: obj.download_count,
      rating: obj.rating,
    };
  }

  /**
   * 关闭数据库
   */
  close(): void {
    if (this.db) {
      this.save();
      this.db.close();
      this.db = null;
    }
  }
}
