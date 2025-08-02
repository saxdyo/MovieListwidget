// 测试Move_list 2.js中的Logo背景图功能集成

// 模拟数据 - 包含Logo的剧集数据
const testItemsWithLogo = [
  {
    id: 12345,
    title: "测试剧集1",
    type: "tv",
    media_type: "tv",
    logo_url: "https://image.tmdb.org/t/p/original/test-logo-1.png",
    poster_url: "https://image.tmdb.org/t/p/w500/test-poster-1.jpg",
    backdrop_path: "/test-backdrop-1.jpg",
    overview: "这是一个测试剧集",
    vote_average: 8.5,
    genre_ids: [18, 80],
    genreMap: { 18: "剧情", 80: "犯罪" }
  },
  {
    id: 12346,
    title: "测试电影1",
    type: "movie",
    media_type: "movie",
    logo_url: "https://image.tmdb.org/t/p/original/test-movie-logo-1.png",
    poster_url: "https://image.tmdb.org/t/p/w500/test-movie-poster-1.jpg",
    backdrop_path: "/test-movie-backdrop-1.jpg",
    overview: "这是一个测试电影",
    vote_average: 7.8,
    genre_ids: [28, 12],
    genreMap: { 28: "动作", 12: "冒险" }
  },
  {
    id: 12347,
    title: "无Logo剧集",
    type: "tv",
    media_type: "tv",
    poster_url: "https://image.tmdb.org/t/p/w500/test-poster-2.jpg",
    backdrop_path: "/test-backdrop-2.jpg",
    overview: "这个剧集没有Logo",
    vote_average: 6.5,
    genre_ids: [35],
    genreMap: { 35: "喜剧" }
  }
];

// 测试createEnhancedWidgetItem函数
function testCreateEnhancedWidgetItem() {
  console.log("🧪 === 测试createEnhancedWidgetItem函数 ===");
  
  testItemsWithLogo.forEach((item, index) => {
    console.log(`\n📋 测试项目 ${index + 1}: ${item.title}`);
    
    try {
      const result = createEnhancedWidgetItem(item);
      
      console.log(`   ID: ${result.id}`);
      console.log(`   标题: ${result.title}`);
      console.log(`   类型: ${result.mediaType} ${result.isTVShow ? '📺' : '🎬'}`);
      console.log(`   Logo: ${result.hasLogo ? '✅' : '❌'} ${result.logoUrl || '无'}`);
      console.log(`   海报: ${result.posterPath ? '✅' : '❌'}`);
      console.log(`   背景图: ${result.backdropPath ? '✅' : '❌'}`);
      console.log(`   评分: ${result.rating}`);
      console.log(`   类型: ${result.genreTitle}`);
      console.log(`   Logo状态: ${result.logoStatus}`);
      console.log(`   Logo质量: ${result.logoQuality}`);
      
      // 验证Logo相关字段
      if (result.hasLogo) {
        console.log(`   ✅ Logo功能正常: ${result.logoUrl}`);
      } else {
        console.log(`   ℹ️ 无Logo: ${item.title}`);
      }
      
    } catch (error) {
      console.error(`   ❌ 处理失败: ${error.message}`);
    }
  });
}

// 测试createSimpleWidgetItem函数
function testCreateSimpleWidgetItem() {
  console.log("\n🧪 === 测试createSimpleWidgetItem函数 ===");
  
  testItemsWithLogo.forEach((item, index) => {
    console.log(`\n📋 测试项目 ${index + 1}: ${item.title}`);
    
    try {
      const result = createSimpleWidgetItem(item);
      
      console.log(`   ID: ${result.id}`);
      console.log(`   标题: ${result.title}`);
      console.log(`   类型: ${result.mediaType} ${result.isTVShow ? '📺' : '🎬'}`);
      console.log(`   Logo: ${result.hasLogo ? '✅' : '❌'} ${result.logoUrl || '无'}`);
      console.log(`   海报: ${result.posterPath ? '✅' : '❌'}`);
      console.log(`   背景图: ${result.backdropPath ? '✅' : '❌'}`);
      console.log(`   评分: ${result.rating}`);
      console.log(`   类型: ${result.genreTitle}`);
      
    } catch (error) {
      console.error(`   ❌ 处理失败: ${error.message}`);
    }
  });
}

// 测试Logo背景图样式生成
function testLogoBackgroundStyle() {
  console.log("\n🧪 === 测试Logo背景图样式生成 ===");
  
  testItemsWithLogo.forEach((item, index) => {
    console.log(`\n📋 测试项目 ${index + 1}: ${item.title}`);
    
    try {
      const widgetItem = createEnhancedWidgetItem(item);
      const style = createLogoBackgroundStyle(widgetItem, {
        useLogoAsBackground: true,
        logoOpacity: 0.9,
        logoSize: 'contain'
      });
      
      console.log(`   样式对象:`, style);
      console.log(`   背景图: ${style.backgroundImage || '无'}`);
      console.log(`   尺寸: ${style.backgroundSize || '无'}`);
      console.log(`   位置: ${style.backgroundPosition || '无'}`);
      
    } catch (error) {
      console.error(`   ❌ 样式生成失败: ${error.message}`);
    }
  });
}

// 测试Logo可用性检查
function testLogoAvailability() {
  console.log("\n🧪 === 测试Logo可用性检查 ===");
  
  try {
    const widgetItems = testItemsWithLogo.map(item => createEnhancedWidgetItem(item));
    const stats = checkLogoAvailability(widgetItems);
    
    console.log("📊 Logo统计结果:");
    console.log(`   总项目数: ${stats.total}`);
    console.log(`   有Logo的项目: ${stats.withLogo} (${stats.logoCoverage}%)`);
    console.log(`   剧集总数: ${stats.tvShows}`);
    console.log(`   剧集Logo: ${stats.tvShowsWithLogo} (${stats.tvLogoCoverage}%)`);
    console.log(`   电影总数: ${stats.movies}`);
    console.log(`   电影Logo: ${stats.moviesWithLogo} (${stats.movieLogoCoverage}%)`);
    
  } catch (error) {
    console.error(`❌ Logo可用性检查失败: ${error.message}`);
  }
}

// 测试Logo质量优化
function testLogoOptimization() {
  console.log("\n🧪 === 测试Logo质量优化 ===");
  
  testItemsWithLogo.forEach((item, index) => {
    console.log(`\n📋 测试项目 ${index + 1}: ${item.title}`);
    
    try {
      const widgetItem = createEnhancedWidgetItem(item);
      
      if (widgetItem.hasLogo) {
        const optimizedHigh = optimizeLogoDisplay(widgetItem, { logoQuality: 'high' });
        const optimizedMedium = optimizeLogoDisplay(widgetItem, { logoQuality: 'medium' });
        const optimizedLow = optimizeLogoDisplay(widgetItem, { logoQuality: 'low' });
        
        console.log(`   原始Logo: ${widgetItem.logoUrl}`);
        console.log(`   高质量: ${optimizedHigh.logoUrl}`);
        console.log(`   中等质量: ${optimizedMedium.logoUrl}`);
        console.log(`   低质量: ${optimizedLow.logoUrl}`);
        console.log(`   优化状态: ${optimizedHigh.logoOptimized ? '✅' : '❌'}`);
      } else {
        console.log(`   ℹ️ 无Logo，跳过优化测试`);
      }
      
    } catch (error) {
      console.error(`   ❌ Logo优化失败: ${error.message}`);
    }
  });
}

// 测试Logo报告生成
function testLogoReport() {
  console.log("\n🧪 === 测试Logo报告生成 ===");
  
  try {
    const widgetItems = testItemsWithLogo.map(item => createEnhancedWidgetItem(item));
    const report = generateLogoReport(widgetItems);
    
    console.log("📋 报告生成成功");
    console.log(`   总项目数: ${report.total}`);
    console.log(`   Logo覆盖率: ${report.logoCoverage}%`);
    
  } catch (error) {
    console.error(`❌ Logo报告生成失败: ${error.message}`);
  }
}

// 主测试函数
function runAllTests() {
  console.log("🎬 === Move_list 2.js Logo背景图功能测试 ===");
  console.log("=" * 60);
  
  try {
    // 运行所有测试
    testCreateEnhancedWidgetItem();
    testCreateSimpleWidgetItem();
    testLogoBackgroundStyle();
    testLogoAvailability();
    testLogoOptimization();
    testLogoReport();
    
    console.log("\n" + "=" * 60);
    console.log("✅ 所有测试完成！");
    console.log("💡 如果看到Logo相关字段正常显示，说明集成成功");
    
  } catch (error) {
    console.error("❌ 测试过程中出现错误:", error);
  }
}

// 如果直接运行此脚本
if (typeof window !== 'undefined') {
  // 浏览器环境
  console.log("🌐 浏览器环境检测到，请在控制台运行 runAllTests() 开始测试");
  window.runAllTests = runAllTests;
} else {
  // Node.js环境
  console.log("🖥️ Node.js环境检测到，开始运行测试...");
  runAllTests();
}

// 导出测试函数（如果支持模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testCreateEnhancedWidgetItem,
    testCreateSimpleWidgetItem,
    testLogoBackgroundStyle,
    testLogoAvailability,
    testLogoOptimization,
    testLogoReport,
    testItemsWithLogo
  };
}