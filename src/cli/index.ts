#!/usr/bin/env node
/**
 * CLI 工具 - Command Line Interface
 * 游戏素材管理器命令行工具
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { AssetManager } from '../core/asset-manager.js';
import { AssetCategory, CategoryRules } from '../core/taxonomy.js';
import { createCollector, listCollectors } from '../collectors/index.js';
import path from 'path';

const program = new Command();
const manager = new AssetManager();

// 初始化数据库
await manager.init();

program
  .name('game-asset-manager')
  .description('🎮 专业的游戏素材收集、管理和分发工具')
  .version('1.0.0');

/**
 * 导入命令 - 导入本地素材
 */
program
  .command('import <path>')
  .description('导入本地素材文件或目录')
  .option('-c, --category <category>', '指定素材分类')
  .option('-s, --subcategory <subcategory>', '指定子分类')
  .option('-t, --tags <tags>', '添加标签(逗号分隔)')
  .option('-l, --license <license>', '指定许可证', 'Unknown')
  .option('-a, --author <author>', '指定作者')
  .option('-d, --description <description>', '添加描述')
  .option('-r, --recursive', '递归导入目录', false)
  .action(async (assetPath, options) => {
    const spinner = ora('正在导入素材...').start();

    try {
      const absolutePath = path.resolve(assetPath);
      const tags = options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [];

      const importOptions = {
        category: options.category as AssetCategory,
        subcategory: options.subcategory,
        tags,
        license: options.license,
        author: options.author,
        description: options.description,
      };

      // 检查是文件还是目录
      const fs = await import('fs-extra');
      const stats = await fs.stat(absolutePath);

      if (stats.isDirectory()) {
        const assets = await manager.importDirectory(absolutePath, importOptions, options.recursive);
        spinner.succeed(chalk.green(`✓ 成功导入 ${assets.length} 个素材`));
      } else {
        const asset = await manager.importAsset(absolutePath, importOptions);
        spinner.succeed(chalk.green(`✓ 成功导入素材: ${asset.name}`));
        console.log(chalk.gray(`  ID: ${asset.id}`));
        console.log(chalk.gray(`  分类: ${asset.category}`));
      }
    } catch (error) {
      spinner.fail(chalk.red(`✗ 导入失败: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * 收集命令 - 从在线源收集素材
 */
program
  .command('collect [source]')
  .description('从在线源收集免费游戏素材')
  .option('-c, --category <category>', '指定收集的分类')
  .option('-l, --limit <number>', '限制收集数量', '10')
  .option('--list', '列出所有可用的收集源')
  .action(async (source, options) => {
    if (options.list) {
      console.log(chalk.bold('\n📦 可用的收集源:\n'));
      const collectors = listCollectors();
      collectors.forEach((collector, index) => {
        console.log(chalk.cyan(`${index + 1}. ${collector.name}`));
        console.log(chalk.gray(`   URL: ${collector.url}`));
        console.log(chalk.gray(`   说明: ${collector.description}`));
        console.log(chalk.gray(`   许可: ${collector.license}\n`));
      });
      return;
    }

    if (!source) {
      console.log(chalk.red('✗ 请指定收集源,使用 --list 查看可用源'));
      process.exit(1);
    }

    const spinner = ora(`从 ${source} 收集素材...`).start();

    try {
      const collector = createCollector(source);
      const assets = await collector.collectAssets({
        category: options.category as AssetCategory,
        limit: parseInt(options.limit),
      });

      spinner.succeed(chalk.green(`✓ 找到 ${assets.length} 个素材`));

      // 显示素材列表
      console.log(chalk.bold('\n素材列表:\n'));
      assets.slice(0, 10).forEach((asset, index) => {
        console.log(chalk.cyan(`${index + 1}. ${asset.name}`));
        console.log(chalk.gray(`   分类: ${asset.category}`));
        console.log(chalk.gray(`   作者: ${asset.author || '未知'}`));
        console.log(chalk.gray(`   来源: ${asset.sourceUrl}\n`));
      });

      if (assets.length > 10) {
        console.log(chalk.gray(`... 还有 ${assets.length - 10} 个素材\n`));
      }
    } catch (error) {
      spinner.fail(chalk.red(`✗ 收集失败: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * 搜索命令
 */
program
  .command('search <keyword>')
  .description('搜索素材')
  .option('-c, --category <category>', '限制搜索分类')
  .option('-t, --tags <tags>', '按标签搜索(逗号分隔)')
  .option('-l, --limit <number>', '限制结果数量', '20')
  .action(async (keyword, options) => {
    try {
      let assets;

      if (options.tags) {
        const tags = options.tags.split(',').map((t: string) => t.trim());
        assets = manager.searchByTags(tags);
      } else if (options.category) {
        assets = manager.browseByCategory(options.category as AssetCategory);
      } else {
        assets = manager.search(keyword, parseInt(options.limit));
      }

      console.log(chalk.bold(`\n🔍 找到 ${assets.length} 个素材:\n`));

      assets.slice(0, parseInt(options.limit)).forEach((asset, index) => {
        console.log(chalk.cyan(`${index + 1}. ${asset.name}`));
        console.log(chalk.gray(`   ID: ${asset.id}`));
        console.log(chalk.gray(`   分类: ${asset.category}${asset.subcategory ? ` > ${asset.subcategory}` : ''}`));
        console.log(chalk.gray(`   大小: ${(asset.fileSize / 1024).toFixed(2)} KB`));
        console.log(chalk.gray(`   许可: ${asset.license}`));
        if (asset.tags.length > 0) {
          console.log(chalk.gray(`   标签: ${asset.tags.join(', ')}`));
        }
        console.log();
      });
    } catch (error) {
      console.error(chalk.red(`✗ 搜索失败: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * 导出命令
 */
program
  .command('export <assetId> <targetDir>')
  .description('导出素材到指定目录')
  .action(async (assetId, targetDir) => {
    const spinner = ora('正在导出素材...').start();

    try {
      const exportedPath = manager.exportAsset(assetId, path.resolve(targetDir));
      spinner.succeed(chalk.green(`✓ 素材已导出到: ${exportedPath}`));
    } catch (error) {
      spinner.fail(chalk.red(`✗ 导出失败: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * 列表命令
 */
program
  .command('list [category]')
  .description('列出素材')
  .option('-l, --limit <number>', '限制数量', '20')
  .action(async (category, options) => {
    try {
      if (!category) {
        // 显示统计信息
        const stats = manager.getStatistics();
        console.log(chalk.bold('\n📊 素材库统计:\n'));
        console.log(chalk.cyan(`总素材数: ${stats.totalAssets}`));
        console.log(chalk.cyan(`总大小: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB\n`));

        console.log(chalk.bold('各分类素材数量:\n'));
        Object.entries(stats.byCategory).forEach(([cat, count]) => {
          const rule = CategoryRules[cat as AssetCategory];
          const name = rule ? rule.name : cat;
          console.log(chalk.gray(`  ${name}: ${count}`));
        });
        console.log();
        return;
      }

      const assets = manager.browseByCategory(category as AssetCategory, parseInt(options.limit));

      console.log(chalk.bold(`\n📦 ${category} 分类素材 (${assets.length}):\n`));

      assets.forEach((asset, index) => {
        console.log(chalk.cyan(`${index + 1}. ${asset.name}`));
        console.log(chalk.gray(`   ID: ${asset.id}`));
        console.log(chalk.gray(`   大小: ${(asset.fileSize / 1024).toFixed(2)} KB\n`));
      });
    } catch (error) {
      console.error(chalk.red(`✗ 列表获取失败: ${(error as Error).message}`));
      process.exit(1);
    }
  });

/**
 * 分类命令
 */
program
  .command('categories')
  .description('显示所有分类')
  .action(() => {
    console.log(chalk.bold('\n🎯 游戏素材分类系统:\n'));

    Object.entries(CategoryRules).forEach(([key, rule]) => {
      console.log(chalk.cyan(`${rule.name} (${rule.nameEn})`));
      console.log(chalk.gray(`  类型: ${key}`));
      console.log(chalk.gray(`  说明: ${rule.description}`));
      console.log(chalk.gray(`  文件类型: ${rule.fileTypes.join(', ')}`));
      console.log(chalk.gray(`  子分类: ${rule.subcategories.join(', ')}`));
      console.log();
    });
  });

/**
 * 删除命令
 */
program
  .command('delete <assetId>')
  .description('删除素材')
  .action(async (assetId) => {
    const spinner = ora('正在删除素材...').start();

    try {
      manager.deleteAsset(assetId);
      spinner.succeed(chalk.green('✓ 素材已删除'));
    } catch (error) {
      spinner.fail(chalk.red(`✗ 删除失败: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse();
