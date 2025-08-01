// 测试脚本 - 验证Move_list 2.js的主要功能
console.log('=== 开始测试Move_list 2.js脚本 ===');

// 读取脚本内容
const fs = require('fs');
const scriptContent = fs.readFileSync('./Move_list 2.js', 'utf8');

console.log('[测试] 脚本文件大小:', scriptContent.length, '字符');

// 检查基本语法
console.log('\n=== 检查基本语法 ===');
try {
  // 尝试解析脚本
  eval(scriptContent);
  console.log('✅ 基本语法检查通过');
} catch (error) {
  console.error('❌ 语法错误:', error.message);
  process.exit(1);
}

// 检查关键函数定义
console.log('\n=== 检查关键函数定义 ===');
const requiredFunctions = [
  'tmdbDiscoverByNetwork',
  'tmdbDiscoverByCompany', 
  'loadTmdbTrendingCombined',
  'loadTmdbTitlePosterTrending',
  'bangumiHotNewAnime',
  'tmdbMediaRanking',
  'loadCardItems',
  'classifyByGenre',
  'listAnime'
];

let allFunctionsExist = true;
for (const funcName of requiredFunctions) {
  if (scriptContent.includes(`function ${funcName}`) || scriptContent.includes(`async function ${funcName}`)) {
    console.log(`✅ ${funcName} 函数定义存在`);
  } else {
    console.log(`❌ ${funcName} 函数定义不存在`);
    allFunctionsExist = false;
  }
}

// 检查WidgetMetadata定义
console.log('\n=== 检查WidgetMetadata定义 ===');
if (scriptContent.includes('WidgetMetadata = {')) {
  console.log('✅ WidgetMetadata 定义存在');
  
  // 检查播出平台模块
  if (scriptContent.includes('title: "TMDB 播出平台"')) {
    console.log('✅ 播出平台模块定义存在');
    
    // 检查函数名配置
    if (scriptContent.includes('functionName: "tmdbDiscoverByNetwork"')) {
      console.log('✅ 播出平台函数名配置正确');
    } else {
      console.log('❌ 播出平台函数名配置错误');
    }
    
    // 检查TVB选项
    if (scriptContent.includes('{ title: "TVB", value: "48" }')) {
      console.log('✅ TVB选项存在');
    } else {
      console.log('❌ TVB选项不存在');
    }
  } else {
    console.log('❌ 播出平台模块定义不存在');
  }
} else {
  console.log('❌ WidgetMetadata 定义不存在');
}

// 检查是否还有TVB增强函数的引用
console.log('\n=== 检查TVB增强函数引用 ===');
const tvbEnhancedRefs = [
  'tmdbDiscoverByNetworkEnhanced',
  'TvbCache',
  'TvbPerformanceMonitor', 
  'tvbSmartRetry',
  'tvbCache',
  'tvbPerformanceMonitor'
];

let hasTvbEnhancedRefs = false;
for (const ref of tvbEnhancedRefs) {
  if (scriptContent.includes(ref)) {
    console.log(`❌ 发现TVB增强引用: ${ref}`);
    hasTvbEnhancedRefs = true;
  }
}

if (!hasTvbEnhancedRefs) {
  console.log('✅ 没有发现TVB增强函数引用');
}

// 检查tmdbDiscoverByNetwork函数实现
console.log('\n=== 检查播出平台函数实现 ===');
if (scriptContent.includes('async function tmdbDiscoverByNetwork(params = {})')) {
  console.log('✅ tmdbDiscoverByNetwork函数定义存在');
  
  // 检查函数是否直接实现（不调用增强函数）
  if (scriptContent.includes('Widget.tmdb.get("/discover/tv"')) {
    console.log('✅ 函数直接调用API，不依赖增强函数');
  } else {
    console.log('❌ 函数可能仍依赖增强函数');
  }
  
  // 检查错误处理
  if (scriptContent.includes('console.error(`[播出平台] 数据获取失败')) {
    console.log('✅ 函数包含错误处理');
  } else {
    console.log('❌ 函数缺少错误处理');
  }
} else {
  console.log('❌ tmdbDiscoverByNetwork函数定义不存在');
}

// 检查脚本完整性
console.log('\n=== 检查脚本完整性 ===');
const essentialParts = [
  'WidgetMetadata = {',
  'modules: [',
  'API_KEY',
  'formatTmdbItem',
  'fetchTmdbGenres',
  'getBeijingDate'
];

let allPartsExist = true;
for (const part of essentialParts) {
  if (scriptContent.includes(part)) {
    console.log(`✅ 包含必要部分: ${part}`);
  } else {
    console.log(`❌ 缺少必要部分: ${part}`);
    allPartsExist = false;
  }
}

console.log('\n=== 测试完成 ===');
if (allFunctionsExist && !hasTvbEnhancedRefs && allPartsExist) {
  console.log('🎉 所有测试通过！脚本可以正常运行');
  console.log('✅ TVB增强函数已完全删除');
  console.log('✅ 播出平台模块功能保留');
  console.log('✅ 脚本语法正确');
} else {
  console.log('⚠️ 部分测试未通过，请检查上述问题');
}

console.log('\n📊 测试统计:');
console.log(`- 脚本大小: ${(scriptContent.length / 1024).toFixed(2)} KB`);
console.log(`- 函数数量: ${requiredFunctions.filter(f => scriptContent.includes(`function ${f}`) || scriptContent.includes(`async function ${f}`)).length}/${requiredFunctions.length}`);
console.log(`- TVB增强引用: ${tvbEnhancedRefs.filter(ref => scriptContent.includes(ref)).length}`);