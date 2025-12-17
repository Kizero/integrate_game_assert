#!/bin/bash

echo "=== 游戏素材管理器 - 诊断脚本 ==="
echo ""

echo "1. 检查 Node.js 版本:"
node --version
echo ""

echo "2. 检查 npm 版本:"
npm --version
echo ""

echo "3. 检查当前目录:"
pwd
echo ""

echo "4. 检查关键文件:"
ls -la src/collectors/base-collector.ts 2>/dev/null && echo "✓ base-collector.ts 存在" || echo "✗ base-collector.ts 不存在"
ls -la package.json 2>/dev/null && echo "✓ package.json 存在" || echo "✗ package.json 不存在"
echo ""

echo "5. 检查 CollectedAsset 导出:"
grep "export interface CollectedAsset" src/collectors/base-collector.ts 2>/dev/null && echo "✓ CollectedAsset 已导出" || echo "✗ CollectedAsset 未导出"
echo ""

echo "6. 检查 node_modules:"
if [ -d "node_modules" ]; then
    echo "✓ node_modules 存在"
    ls node_modules/tsx 2>/dev/null && echo "✓ tsx 已安装" || echo "✗ tsx 未安装"
    ls node_modules/sql.js 2>/dev/null && echo "✓ sql.js 已安装" || echo "✗ sql.js 未安装"
else
    echo "✗ node_modules 不存在 - 需要运行 npm install"
fi
echo ""

echo "7. 检查 Git 分支:"
git branch --show-current
echo ""

echo "=== 诊断完成 ==="
