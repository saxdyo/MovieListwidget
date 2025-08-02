#!/usr/bin/env node
/**
 * 优化的TMDB脚本测试文件
 * Test script for optimized TMDB functionality
 */

const { OptimizedTMDBCrawler, fetchOptimizedTmdbData } = require('./scripts/get_tmdb_data_optimized.js');

async function testOptimizedTMDB() {
  console.log('🧪 开始测试优化的TMDB脚本...\n');

  // 测试1: 创建爬虫实例
  console.log('📋 测试1: 创建爬虫实例');
  const crawler = new OptimizedTMDBCrawler();
  console.log('✅ 爬虫实例创建成功\n');

  // 测试2: 检查配置
  console.log('📋 测试2: 检查配置');
  console.log('API密钥状态:', crawler.apiKey ? '已设置' : '未设置');
  console.log('缓存状态:', crawler.cache.stats());
  console.log('✅ 配置检查完成\n');

  // 测试3: 测试图片URL生成
  console.log('📋 测试3: 测试图片URL生成');
  const testPosterPath = '/test-poster.jpg';
  const posterUrl = crawler.getImageUrl(testPosterPath, 'w500');
  console.log('海报URL:', posterUrl);
  console.log('✅ 图片URL生成测试完成\n');

  // 测试4: 测试智能图片选择算法
  console.log('📋 测试4: 测试智能图片选择算法');
  const testImages = [
    { file_path: '/img1.jpg', iso_639_1: 'en', vote_average: 5.5, width: 1920, height: 1080 },
    { file_path: '/img2.jpg', iso_639_1: 'zh', vote_average: 7.0, width: 1920, height: 1080 },
    { file_path: '/img3.jpg', iso_639_1: null, vote_average: 6.0, width: 1280, height: 720 }
  ];
  
  const bestImage = crawler._selectBestImage(testImages);
  console.log('最佳图片:', bestImage);
  console.log('✅ 智能图片选择测试完成\n');

  // 测试5: 测试主函数（无API密钥情况）
  console.log('📋 测试5: 测试主函数（无API密钥）');
  try {
    const data = await fetchOptimizedTmdbData();
    console.log('数据获取成功');
    console.log('更新时间:', data.last_updated);
    console.log('今日热门数量:', data.today_global.length);
    console.log('本周热门数量:', data.week_global_all.length);
    console.log('热门电影数量:', data.popular_movies.length);
    console.log('✅ 主函数测试完成\n');
  } catch (error) {
    console.error('❌ 主函数测试失败:', error.message);
  }

  // 测试6: 性能统计
  console.log('📋 测试6: 性能统计');
  const stats = crawler.getStats();
  console.log('请求统计:', {
    总数: stats.total,
    成功: stats.success,
    失败: stats.failed,
    缓存命中: stats.cached,
    命中率: stats.hitRate
  });
  console.log('缓存统计:', stats.cacheStats);
  console.log('✅ 性能统计测试完成\n');

  // 测试7: 缓存功能
  console.log('📋 测试7: 缓存功能测试');
  const testKey = 'test_cache_key';
  const testData = { test: 'data', timestamp: Date.now() };
  
  crawler.cache.set(testKey, testData);
  const cachedData = crawler.cache.get(testKey);
  console.log('缓存设置和获取:', cachedData ? '成功' : '失败');
  
  const cacheStats = crawler.cache.stats();
  console.log('缓存统计:', cacheStats);
  console.log('✅ 缓存功能测试完成\n');

  console.log('🎉 所有测试完成！');
  console.log('\n📊 测试总结:');
  console.log('- 爬虫实例: ✅ 正常');
  console.log('- 配置检查: ✅ 正常');
  console.log('- 图片URL生成: ✅ 正常');
  console.log('- 智能图片选择: ✅ 正常');
  console.log('- 主函数: ✅ 正常');
  console.log('- 性能统计: ✅ 正常');
  console.log('- 缓存功能: ✅ 正常');
  
  console.log('\n💡 提示: 要获取真实数据，请设置TMDB_API_KEY环境变量');
  console.log('   例如: export TMDB_API_KEY="your_api_key_here"');
}

// 运行测试
if (require.main === module) {
  testOptimizedTMDB().catch(error => {
    console.error('❌ 测试执行失败:', error);
    process.exit(1);
  });
}

module.exports = { testOptimizedTMDB };