#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 配置
const BASE_URL = 'https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons';
const ICONS_DIR = path.join(__dirname, '../icons');
const METADATA_FILE = path.join(ICONS_DIR, 'metadata/icons.json');

// 读取图标元数据
function readMetadata() {
  try {
    const data = fs.readFileSync(METADATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading metadata:', error);
    return null;
  }
}

// 扫描图标文件
function scanIcons() {
  const icons = [];
  const categories = ['social', 'tech', 'business', 'entertainment', 'misc'];
  
  categories.forEach(category => {
    const categoryPath = path.join(ICONS_DIR, 'svg', category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath);
      files.forEach(file => {
        if (file.endsWith('.svg')) {
          const name = path.basename(file, '.svg');
          icons.push({
            name,
            category,
            tags: [category, name],
            formats: ['svg'],
            urls: {
              svg: `${BASE_URL}/svg/${category}/${file}`
            },
            description: `${name}图标`,
            author: 'Icon Library',
            license: 'MIT'
          });
        }
      });
    }
  });
  
  return icons;
}

// 更新分类JSON文件
function updateCategoryJson(category, icons) {
  const categoryIcons = icons.filter(icon => icon.category === category);
  const categoryData = {
    name: getCategoryName(category),
    description: getCategoryDescription(category),
    category,
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    totalIcons: categoryIcons.length,
    icons: categoryIcons,
    metadata: {
      baseUrl: BASE_URL,
      formats: ['svg', 'png'],
      license: 'MIT',
      author: 'Icon Library'
    }
  };
  
  const outputPath = path.join(ICONS_DIR, 'json', `${category}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(categoryData, null, 2));
  console.log(`Updated ${category}.json with ${categoryIcons.length} icons`);
}

// 更新完整图标库JSON
function updateAllIconsJson(icons) {
  const allIconsData = {
    name: '完整图标库',
    description: '包含所有分类的图标库',
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    totalIcons: icons.length,
    categories: ['social', 'tech', 'business', 'entertainment', 'misc'],
    icons,
    metadata: {
      baseUrl: BASE_URL,
      formats: ['svg', 'png'],
      license: 'MIT',
      author: 'Icon Library'
    }
  };
  
  const outputPath = path.join(ICONS_DIR, 'json', 'all-icons.json');
  fs.writeFileSync(outputPath, JSON.stringify(allIconsData, null, 2));
  console.log(`Updated all-icons.json with ${icons.length} icons`);
}

// 获取分类名称
function getCategoryName(category) {
  const names = {
    social: '社交媒体图标',
    tech: '技术相关图标',
    business: '商业相关图标',
    entertainment: '娱乐相关图标',
    misc: '其他图标'
  };
  return names[category] || category;
}

// 获取分类描述
function getCategoryDescription(category) {
  const descriptions = {
    social: '社交媒体相关图标集合',
    tech: '技术、编程、开发相关图标集合',
    business: '商业、办公、金融相关图标集合',
    entertainment: '娱乐、游戏、媒体相关图标集合',
    misc: '其他分类的图标集合'
  };
  return descriptions[category] || `${category}相关图标集合`;
}

// 主函数
function main() {
  console.log('开始更新图标库JSON文件...');
  
  // 扫描所有图标
  const icons = scanIcons();
  console.log(`找到 ${icons.length} 个图标`);
  
  // 更新分类JSON文件
  const categories = ['social', 'tech', 'business', 'entertainment', 'misc'];
  categories.forEach(category => {
    updateCategoryJson(category, icons);
  });
  
  // 更新完整图标库JSON
  updateAllIconsJson(icons);
  
  console.log('JSON文件更新完成！');
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { scanIcons, updateCategoryJson, updateAllIconsJson };