/**
 * 数据库管理 - Database Manager
 * 使用 SQLite 存储素材元数据
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs-extra';
import { AssetMetadata, AssetCategory } from './taxonomy.js';

export class AssetDatabase {
  private db: Database.Database;

  constructor(dbPath: string = './storage/database/assets.db') {
    // 确保目录存在
    fs.ensureDirSync(path.dirname(dbPath));

    this.db = new Database(dbPath);
    this.initialize();
  }

  /**
   * 初始化数据库表
   */
  private initialize() {
    this.db.exec(`
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
      CREATE INDEX IF NOT EXISTS idx_tags ON assets(tags);
      CREATE INDEX IF NOT EXISTS idx_license ON assets(license);

      -- 标签表 (用于标签搜索)
      CREATE TABLE IF NOT EXISTS asset_tags (
        asset_id TEXT NOT NULL,
        tag TEXT NOT NULL,
        PRIMARY KEY (asset_id, tag),
        FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_tag ON asset_tags(tag);

      -- 收藏/集合表
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
  }

  /**
   * 添加素材
   */
  addAsset(asset: AssetMetadata): void {
    const stmt = this.db.prepare(`
      INSERT INTO assets (
        id, name, category, subcategory, style, genre, tags,
        file_type, file_size, file_path,
        description, author, license, source_url,
        resolution, duration, frame_rate, quality,
        created_at, updated_at, download_count, rating
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    stmt.run(
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
      asset.rating || null
    );

    // 添加标签
    const tagStmt = this.db.prepare('INSERT INTO asset_tags (asset_id, tag) VALUES (?, ?)');
    for (const tag of asset.tags) {
      tagStmt.run(asset.id, tag);
    }
  }

  /**
   * 获取素材
   */
  getAsset(id: string): AssetMetadata | null {
    const row = this.db.prepare('SELECT * FROM assets WHERE id = ?').get(id) as any;
    if (!row) return null;

    return this.rowToAsset(row);
  }

  /**
   * 按分类搜索素材
   */
  searchByCategory(category: AssetCategory, limit: number = 100): AssetMetadata[] {
    const rows = this.db.prepare('SELECT * FROM assets WHERE category = ? LIMIT ?')
      .all(category, limit) as any[];

    return rows.map(row => this.rowToAsset(row));
  }

  /**
   * 按标签搜索素材
   */
  searchByTags(tags: string[], matchAll: boolean = false): AssetMetadata[] {
    if (tags.length === 0) return [];

    let query: string;
    if (matchAll) {
      // 匹配所有标签
      query = `
        SELECT a.* FROM assets a
        WHERE a.id IN (
          SELECT asset_id FROM asset_tags
          WHERE tag IN (${tags.map(() => '?').join(',')})
          GROUP BY asset_id
          HAVING COUNT(DISTINCT tag) = ?
        )
      `;
    } else {
      // 匹配任意标签
      query = `
        SELECT DISTINCT a.* FROM assets a
        JOIN asset_tags t ON a.id = t.asset_id
        WHERE t.tag IN (${tags.map(() => '?').join(',')})
      `;
    }

    const params = matchAll ? [...tags, tags.length] : tags;
    const rows = this.db.prepare(query).all(...params) as any[];

    return rows.map(row => this.rowToAsset(row));
  }

  /**
   * 全文搜索
   */
  search(keyword: string, limit: number = 50): AssetMetadata[] {
    const rows = this.db.prepare(`
      SELECT * FROM assets
      WHERE name LIKE ? OR description LIKE ? OR tags LIKE ?
      LIMIT ?
    `).all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, limit) as any[];

    return rows.map(row => this.rowToAsset(row));
  }

  /**
   * 获取所有分类的统计信息
   */
  getStatistics() {
    const categoryCounts = this.db.prepare(`
      SELECT category, COUNT(*) as count
      FROM assets
      GROUP BY category
    `).all() as any[];

    const totalAssets = this.db.prepare('SELECT COUNT(*) as count FROM assets').get() as any;
    const totalSize = this.db.prepare('SELECT SUM(file_size) as size FROM assets').get() as any;

    return {
      totalAssets: totalAssets.count,
      totalSize: totalSize.size || 0,
      byCategory: Object.fromEntries(
        categoryCounts.map(row => [row.category, row.count])
      ),
    };
  }

  /**
   * 更新下载计数
   */
  incrementDownloadCount(id: string): void {
    this.db.prepare('UPDATE assets SET download_count = download_count + 1 WHERE id = ?').run(id);
  }

  /**
   * 删除素材
   */
  deleteAsset(id: string): void {
    this.db.prepare('DELETE FROM assets WHERE id = ?').run(id);
  }

  /**
   * 将数据库行转换为 AssetMetadata
   */
  private rowToAsset(row: any): AssetMetadata {
    return {
      id: row.id,
      name: row.name,
      category: row.category as AssetCategory,
      subcategory: row.subcategory,
      style: row.style,
      genre: row.genre ? JSON.parse(row.genre) : undefined,
      tags: JSON.parse(row.tags),
      fileType: row.file_type,
      fileSize: row.file_size,
      filePath: row.file_path,
      description: row.description,
      author: row.author,
      license: row.license,
      sourceUrl: row.source_url,
      resolution: row.resolution,
      duration: row.duration,
      frameRate: row.frame_rate,
      quality: row.quality,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      downloadCount: row.download_count,
      rating: row.rating,
    };
  }

  /**
   * 关闭数据库
   */
  close(): void {
    this.db.close();
  }
}
