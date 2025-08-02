// ========== TMDB热门内容模块使用示例 ==========
// 展示如何使用拆分后的模块

// 导入拆分后的模块
const TrendingModules = require('./tmdb_trending_modules.js');

// ========== 使用示例 ==========

// 示例1: 加载今日热门（全部内容）
async function exampleLoadTodayAll() {
  console.log("=== 示例1: 加载今日热门（全部内容） ===");
  
  const results = await TrendingModules.loadTodayTrending({
    media_type: "all",
    max_items: 20
  });
  
  console.log(`获取到 ${results.length} 项今日热门内容`);
  results.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} (${item.mediaType}) - ${item.rating}`);
  });
  
  return results;
}

// 示例2: 加载今日热门（仅电影）
async function exampleLoadTodayMovies() {
  console.log("=== 示例2: 加载今日热门（仅电影） ===");
  
  const results = await TrendingModules.loadTodayTrending({
    media_type: "movie",
    max_items: 15
  });
  
  console.log(`获取到 ${results.length} 项今日热门电影`);
  results.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} - ${item.rating}`);
  });
  
  return results;
}

// 示例3: 加载今日热门（仅剧集）
async function exampleLoadTodayTV() {
  console.log("=== 示例3: 加载今日热门（仅剧集） ===");
  
  const results = await TrendingModules.loadTodayTrending({
    media_type: "tv",
    max_items: 15
  });
  
  console.log(`获取到 ${results.length} 项今日热门剧集`);
  results.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} - ${item.rating}`);
  });
  
  return results;
}

// 示例4: 加载本周热门
async function exampleLoadWeekTrending() {
  console.log("=== 示例4: 加载本周热门 ===");
  
  const results = await TrendingModules.loadWeekTrending({
    media_type: "all",
    max_items: 20
  });
  
  console.log(`获取到 ${results.length} 项本周热门内容`);
  results.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} (${item.mediaType}) - ${item.rating}`);
  });
  
  return results;
}

// 示例5: 加载热门内容
async function exampleLoadPopularContent() {
  console.log("=== 示例5: 加载热门内容 ===");
  
  const results = await TrendingModules.loadPopularContent({
    media_type: "all",
    max_items: 20
  });
  
  console.log(`获取到 ${results.length} 项热门内容`);
  results.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} (${item.mediaType}) - ${item.rating}`);
  });
  
  return results;
}

// 示例6: 加载高分内容
async function exampleLoadTopRatedContent() {
  console.log("=== 示例6: 加载高分内容 ===");
  
  const results = await TrendingModules.loadTopRatedContent({
    media_type: "all",
    max_items: 20
  });
  
  console.log(`获取到 ${results.length} 项高分内容`);
  results.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} (${item.mediaType}) - ${item.rating}`);
  });
  
  return results;
}

// 示例7: 使用统一入口函数
async function exampleLoadByType() {
  console.log("=== 示例7: 使用统一入口函数 ===");
  
  // 加载今日热门
  const todayResults = await TrendingModules.loadTmdbTrendingByType({
    content_type: "today",
    media_type: "all",
    max_items: 10
  });
  
  console.log(`今日热门: ${todayResults.length} 项`);
  
  // 加载本周热门
  const weekResults = await TrendingModules.loadTmdbTrendingByType({
    content_type: "week",
    media_type: "all",
    max_items: 10
  });
  
  console.log(`本周热门: ${weekResults.length} 项`);
  
  // 加载热门内容
  const popularResults = await TrendingModules.loadTmdbTrendingByType({
    content_type: "popular",
    media_type: "all",
    max_items: 10
  });
  
  console.log(`热门内容: ${popularResults.length} 项`);
  
  // 加载高分内容
  const topRatedResults = await TrendingModules.loadTmdbTrendingByType({
    content_type: "top_rated",
    media_type: "all",
    max_items: 10
  });
  
  console.log(`高分内容: ${topRatedResults.length} 项`);
  
  return {
    today: todayResults,
    week: weekResults,
    popular: popularResults,
    topRated: topRatedResults
  };
}

// 示例8: 缓存管理
async function exampleCacheManagement() {
  console.log("=== 示例8: 缓存管理 ===");
  
  // 获取缓存数据
  const cachedData = TrendingModules.getCachedTrendingData();
  console.log("缓存数据:", cachedData ? "存在" : "不存在");
  
  // 缓存新数据
  const testData = { test: "data" };
  TrendingModules.cacheTrendingData(testData);
  console.log("已缓存测试数据");
  
  // 再次获取缓存数据
  const newCachedData = TrendingModules.getCachedTrendingData();
  console.log("新的缓存数据:", newCachedData);
  
  return newCachedData;
}

// 示例9: 日志管理
async function exampleLogManagement() {
  console.log("=== 示例9: 日志管理 ===");
  
  // 设置日志级别
  TrendingModules.log("这是一条信息日志", "info");
  TrendingModules.log("这是一条警告日志", "warn");
  TrendingModules.log("这是一条错误日志", "error");
  TrendingModules.log("这是一条调试日志", "debug");
  
  console.log("日志输出完成");
}

// 示例10: 工具函数使用
async function exampleUtilityFunctions() {
  console.log("=== 示例10: 工具函数使用 ===");
  
  // 深拷贝测试
  const originalObj = { a: 1, b: { c: 2 } };
  const clonedObj = TrendingModules.deepClone(originalObj);
  clonedObj.b.c = 3;
  
  console.log("原始对象:", originalObj);
  console.log("克隆对象:", clonedObj);
  console.log("深拷贝成功:", originalObj.b.c !== clonedObj.b.c);
  
  // 去重测试
  const array = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 1, name: "A" },
    { id: 3, name: "C" }
  ];
  
  const uniqueArray = TrendingModules.uniqBy(array, item => item.id);
  console.log("原始数组:", array);
  console.log("去重后数组:", uniqueArray);
  console.log("去重成功:", uniqueArray.length === 3);
  
  return { clonedObj, uniqueArray };
}

// ========== 主函数 ==========
async function runAllExamples() {
  console.log("开始运行TMDB热门内容模块使用示例...\n");
  
  try {
    // 运行所有示例
    await exampleLoadTodayAll();
    console.log("\n");
    
    await exampleLoadTodayMovies();
    console.log("\n");
    
    await exampleLoadTodayTV();
    console.log("\n");
    
    await exampleLoadWeekTrending();
    console.log("\n");
    
    await exampleLoadPopularContent();
    console.log("\n");
    
    await exampleLoadTopRatedContent();
    console.log("\n");
    
    await exampleLoadByType();
    console.log("\n");
    
    await exampleCacheManagement();
    console.log("\n");
    
    await exampleLogManagement();
    console.log("\n");
    
    await exampleUtilityFunctions();
    console.log("\n");
    
    console.log("所有示例运行完成！");
    
  } catch (error) {
    console.error("运行示例时出错:", error);
  }
}

// ========== 导出示例函数 ==========
module.exports = {
  // 基础示例
  exampleLoadTodayAll,
  exampleLoadTodayMovies,
  exampleLoadTodayTV,
  exampleLoadWeekTrending,
  exampleLoadPopularContent,
  exampleLoadTopRatedContent,
  
  // 高级示例
  exampleLoadByType,
  exampleCacheManagement,
  exampleLogManagement,
  exampleUtilityFunctions,
  
  // 主函数
  runAllExamples
};

// 如果直接运行此文件，则执行所有示例
if (require.main === module) {
  runAllExamples();
}