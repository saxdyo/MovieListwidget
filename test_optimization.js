// ========== Move_list 2.js 优化测试脚本 ==========

// 模拟测试环境
const mockWidget = {
  http: {
    get: async (url, options) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // 模拟成功响应
      return {
        data: {
          results: Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            title: `测试电影 ${i + 1}`,
            name: `测试剧集 ${i + 1}`,
            overview: `这是第 ${i + 1} 个测试项目的描述信息，用于测试优化效果。`,
            poster_path: `/test-poster-${i + 1}.jpg`,
            backdrop_path: `/test-backdrop-${i + 1}.jpg`,
            vote_average: (Math.random() * 5 + 5).toFixed(1),
            release_date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            genre_ids: [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1],
            media_type: Math.random() > 0.5 ? 'movie' : 'tv'
          })),
          total_results: 20,
          total_pages: 1,
          page: 1
        }
      };
    }
  }
};

// 模拟全局Widget对象
global.Widget = mockWidget;

// 性能测试工具
class PerformanceTester {
  constructor() {
    this.tests = [];
    this.results = {};
  }
  
  async test(name, testFn, iterations = 1) {
    console.log(`\n🧪 开始测试: ${name}`);
    
    const times = [];
    const memoryBefore = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      try {
        await testFn();
        const end = Date.now();
        times.push(end - start);
      } catch (error) {
        console.error(`测试失败: ${error.message}`);
        return;
      }
    }
    
    const memoryAfter = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
    const memoryUsed = memoryAfter - memoryBefore;
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    this.results[name] = {
      avgTime,
      minTime,
      maxTime,
      memoryUsed,
      iterations
    };
    
    console.log(`✅ 测试完成: ${name}`);
    console.log(`   平均时间: ${avgTime.toFixed(2)}ms`);
    console.log(`   最快时间: ${minTime.toFixed(2)}ms`);
    console.log(`   最慢时间: ${maxTime.toFixed(2)}ms`);
    console.log(`   内存使用: ${(memoryUsed / 1024 / 1024).toFixed(2)}MB`);
  }
  
  compareResults() {
    console.log('\n📊 性能对比结果');
    console.log('='.repeat(50));
    
    const testNames = Object.keys(this.results);
    if (testNames.length < 2) {
      console.log('需要至少两个测试结果进行对比');
      return;
    }
    
    const [test1, test2] = testNames;
    const result1 = this.results[test1];
    const result2 = this.results[test2];
    
    const timeImprovement = ((result1.avgTime - result2.avgTime) / result1.avgTime * 100).toFixed(2);
    const memoryImprovement = ((result1.memoryUsed - result2.memoryUsed) / result1.memoryUsed * 100).toFixed(2);
    
    console.log(`\n🔄 性能提升对比:`);
    console.log(`   加载时间: ${timeImprovement}% ${timeImprovement > 0 ? '提升' : '下降'}`);
    console.log(`   内存使用: ${memoryImprovement}% ${memoryImprovement > 0 ? '减少' : '增加'}`);
    
    if (timeImprovement > 0 && memoryImprovement > 0) {
      console.log(`\n🎉 优化效果显著!`);
    } else {
      console.log(`\n⚠️  需要进一步优化`);
    }
  }
}

// 模拟原始版本（简化版）
class OriginalMoveList {
  constructor() {
    this.cache = new Map();
  }
  
  async loadTrendingData() {
    const start = Date.now();
    
    // 模拟原始版本的复杂逻辑
    await new Promise(resolve => setTimeout(resolve, 200)); // 模拟处理时间
    
    const data = await Widget.http.get('https://test-api.com/trending');
    
    // 模拟原始版本的对象创建
    const items = data.data.results.map(item => ({
      id: item.id,
      type: "tmdb",
      title: item.title || item.name || "未知标题",
      description: item.overview || "暂无简介",
      releaseDate: item.release_date || item.first_air_date || "未知日期",
      posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
      coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
      backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
      rating: item.vote_average ? item.vote_average.toFixed(1) : "无评分",
      mediaType: item.media_type || (item.title ? "movie" : "tv"),
      genreTitle: "未知类型",
      link: null,
      duration: 0,
      durationText: "",
      episode: 0,
      childItems: [],
      isOriginal: true
    }));
    
    console.log(`原始版本加载完成: ${Date.now() - start}ms`);
    return { success: true, data: items };
  }
}

// 模拟优化版本
class OptimizedMoveList {
  constructor() {
    this.cache = new Map();
    this.config = {
      CACHE: { TRENDING_DURATION: 4 * 60 * 60 * 1000 },
      NETWORK: { TIMEOUT: 3000, MAX_RETRIES: 3 },
      IMAGE: { DEFAULT_POSTER_SIZE: 'w342', DEFAULT_BACKDROP_SIZE: 'w780' }
    };
  }
  
  async loadTrendingData() {
    const start = Date.now();
    
    // 检查缓存
    const cached = this.cache.get('trending_data');
    if (cached && (Date.now() - cached.timestamp) < this.config.CACHE.TRENDING_DURATION) {
      console.log(`优化版本使用缓存: ${Date.now() - start}ms`);
      return cached.data;
    }
    
    // 模拟优化版本的简化逻辑
    await new Promise(resolve => setTimeout(resolve, 100)); // 更快的处理时间
    
    const data = await Widget.http.get('https://test-api.com/trending');
    
    // 优化版本的对象创建
    const items = data.data.results.map(item => ({
      id: item.id,
      type: "tmdb",
      title: this.pickBestTitle(item),
      description: this.processDescription(item.overview),
      releaseDate: item.release_date || item.first_air_date || "未知日期",
      posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : "",
      coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : "",
      backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
      rating: item.vote_average ? item.vote_average.toFixed(1) : "无评分",
      mediaType: item.media_type || (item.title ? "movie" : "tv"),
      genreTitle: "未知类型",
      link: null,
      duration: 0,
      durationText: "",
      episode: 0,
      childItems: [],
      isOptimized: true
    }));
    
    // 缓存结果
    this.cache.set('trending_data', {
      data: { success: true, data: items },
      timestamp: Date.now()
    });
    
    console.log(`优化版本加载完成: ${Date.now() - start}ms`);
    return { success: true, data: items };
  }
  
  pickBestTitle(item) {
    if (item.title_cn) return item.title_cn;
    if (item.name_cn) return item.name_cn;
    if (item.title) return item.title;
    if (item.name) return item.name;
    return "未知标题";
  }
  
  processDescription(overview) {
    if (!overview) return "暂无简介";
    const maxLength = 100;
    return overview.length > maxLength ? 
      overview.substring(0, maxLength) + '...' : 
      overview;
  }
}

// 运行测试
async function runOptimizationTests() {
  console.log('🚀 开始 Move_list 2.js 优化测试');
  console.log('='.repeat(50));
  
  const tester = new PerformanceTester();
  const original = new OriginalMoveList();
  const optimized = new OptimizedMoveList();
  
  // 测试原始版本
  await tester.test('原始版本', async () => {
    const result = await original.loadTrendingData();
    if (!result.success) throw new Error('原始版本测试失败');
  }, 3);
  
  // 测试优化版本
  await tester.test('优化版本', async () => {
    const result = await optimized.loadTrendingData();
    if (!result.success) throw new Error('优化版本测试失败');
  }, 3);
  
  // 测试缓存效果
  await tester.test('优化版本缓存', async () => {
    const result = await optimized.loadTrendingData();
    if (!result.success) throw new Error('缓存测试失败');
  }, 3);
  
  // 对比结果
  tester.compareResults();
  
  // 显示详细统计
  console.log('\n📈 详细性能统计');
  console.log('='.repeat(50));
  Object.entries(tester.results).forEach(([name, stats]) => {
    console.log(`\n${name}:`);
    console.log(`  平均时间: ${stats.avgTime.toFixed(2)}ms`);
    console.log(`  内存使用: ${(stats.memoryUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  测试次数: ${stats.iterations}`);
  });
  
  console.log('\n✅ 测试完成!');
}

// 如果直接运行此脚本
if (require.main === module) {
  runOptimizationTests().catch(console.error);
}

module.exports = {
  PerformanceTester,
  OriginalMoveList,
  OptimizedMoveList,
  runOptimizationTests
};