// ========== fw2.js 动画模块测试脚本 ==========

// 模拟Widget.tmdb对象（用于测试）
global.Widget = {
  tmdb: {
    get: async (endpoint, options) => {
      console.log(`[测试] 模拟API调用: ${endpoint}`);
      console.log(`[测试] 参数:`, options.params);
      
      // 返回模拟数据
      return {
        results: [
          {
            id: 1,
            title: "测试动画1",
            name: "Test Anime 1",
            original_title: "テストアニメ1",
            overview: "这是一个测试动画的简介，用于验证fw2.js动画模块的功能。",
            release_date: "2024-01-15",
            first_air_date: "2024-01-15",
            poster_path: "/test1.jpg",
            backdrop_path: "/backdrop1.jpg",
            vote_average: 8.5,
            vote_count: 1500,
            popularity: 85.2,
            media_type: "tv",
            genre_ids: [16, 1, 2]
          },
          {
            id: 2,
            title: "测试动画2",
            name: "Test Anime 2",
            original_title: "テストアニメ2",
            overview: "第二个测试动画，用于验证数据格式化功能。",
            release_date: "2024-02-20",
            first_air_date: "2024-02-20",
            poster_path: "/test2.jpg",
            backdrop_path: "/backdrop2.jpg",
            vote_average: 7.8,
            vote_count: 1200,
            popularity: 72.1,
            media_type: "movie",
            genre_ids: [16, 3, 4]
          }
        ]
      };
    }
  }
};

// 模拟genres API响应
global.Widget.tmdb.get = async (endpoint, options) => {
  console.log(`[测试] 模拟API调用: ${endpoint}`);
  
  if (endpoint.includes("/genre/")) {
    return {
      genres: [
        { id: 1, name: "动作" },
        { id: 2, name: "冒险" },
        { id: 3, name: "喜剧" },
        { id: 4, name: "剧情" },
        { id: 16, name: "动画" }
      ]
    };
  }
  
  // 返回模拟数据
  return {
    results: [
      {
        id: 1,
        title: "测试动画1",
        name: "Test Anime 1",
        original_title: "テストアニメ1",
        overview: "这是一个测试动画的简介，用于验证fw2.js动画模块的功能。",
        release_date: "2024-01-15",
        first_air_date: "2024-01-15",
        poster_path: "/test1.jpg",
        backdrop_path: "/backdrop1.jpg",
        vote_average: 8.5,
        vote_count: 1500,
        popularity: 85.2,
        media_type: "tv",
        genre_ids: [16, 1, 2]
      },
      {
        id: 2,
        title: "测试动画2",
        name: "Test Anime 2",
        original_title: "テストアニメ2",
        overview: "第二个测试动画，用于验证数据格式化功能。",
        release_date: "2024-02-20",
        first_air_date: "2024-02-20",
        poster_path: "/test2.jpg",
        backdrop_path: "/backdrop2.jpg",
        vote_average: 7.8,
        vote_count: 1200,
        popularity: 72.1,
        media_type: "movie",
        genre_ids: [16, 3, 4]
      }
    ]
  };
};

// 加载fw2.js脚本
try {
  require('./fw2.js');
  console.log('\n✅ fw2.js 脚本加载成功！\n');
} catch (error) {
  console.error('❌ fw2.js 脚本加载失败:', error.message);
  process.exit(1);
}

// 测试函数
async function testAnimeModule() {
  console.log('🧪 开始测试 ✨动画模块 功能...\n');
  
  try {
    // 测试1: 获取热门新番动画
    console.log('📺 测试1: 获取热门新番动画');
    const hotAnime = await bangumiHotNewAnime({
      max_items: 5,
      vote_average_gte: "6.0"
    });
    console.log(`✅ 获取到 ${hotAnime.length} 项热门新番`);
    if (hotAnime.length > 0) {
      console.log(`   示例: ${hotAnime[0].title} (${hotAnime[0].rating}分)`);
    }
    console.log('');
    
    // 测试2: 获取热门动画电影
    console.log('🎬 测试2: 获取热门动画电影');
    const animeMovies = await getPopularAnimeMovies({
      max_items: 3,
      vote_average_gte: "7.0"
    });
    console.log(`✅ 获取到 ${animeMovies.length} 项动画电影`);
    if (animeMovies.length > 0) {
      console.log(`   示例: ${animeMovies[0].title} (${animeMovies[0].rating}分)`);
    }
    console.log('');
    
    // 测试3: 获取最新动画剧集
    console.log('📺 测试3: 获取最新动画剧集');
    const latestAnime = await getLatestAnimeTV({
      max_items: 3,
      sort_by: "first_air_date.desc"
    });
    console.log(`✅ 获取到 ${latestAnime.length} 项最新动画剧集`);
    if (latestAnime.length > 0) {
      console.log(`   示例: ${latestAnime[0].title} (${latestAnime[0].releaseDate})`);
    }
    console.log('');
    
    // 测试4: 获取高分动画
    console.log('⭐ 测试4: 获取高分动画');
    const topAnime = await getTopRatedAnime({
      max_items: 3,
      vote_average_gte: "8.0"
    });
    console.log(`✅ 获取到 ${topAnime.length} 项高分动画`);
    if (topAnime.length > 0) {
      console.log(`   示例: ${topAnime[0].title} (${topAnime[0].rating}分)`);
    }
    console.log('');
    
    // 测试5: 获取指定年份动画
    console.log('📅 测试5: 获取2024年动画');
    const yearAnime = await getAnimeByYear({
      year: "2024",
      max_items: 3
    });
    console.log(`✅ 获取到 ${yearAnime.length} 项2024年动画`);
    if (yearAnime.length > 0) {
      console.log(`   示例: ${yearAnime[0].title} (${yearAnime[0].year}年)`);
    }
    console.log('');
    
    // 测试6: 获取模块统计信息
    console.log('📊 测试6: 获取模块统计信息');
    const stats = getAnimeModuleStats();
    console.log('✅ 模块统计信息:');
    console.log(`   动画缓存: ${JSON.stringify(stats.animeCache)}`);
    console.log(`   类型缓存: ${JSON.stringify(stats.genreCache)}`);
    console.log(`   可用函数: ${stats.functions.length} 个`);
    console.log('');
    
    // 测试7: 缓存功能测试
    console.log('💾 测试7: 缓存功能测试');
    console.log('   第一次调用（无缓存）...');
    const firstCall = await bangumiHotNewAnime({ max_items: 2 });
    console.log('   第二次调用（有缓存）...');
    const secondCall = await bangumiHotNewAnime({ max_items: 2 });
    console.log(`✅ 缓存测试完成，两次调用结果数量: ${firstCall.length} vs ${secondCall.length}`);
    console.log('');
    
    // 测试8: 清理缓存
    console.log('🧹 测试8: 清理缓存');
    clearAnimeCache();
    console.log('✅ 缓存清理完成');
    console.log('');
    
    console.log('🎉 所有测试完成！✨动画模块功能正常！');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
    console.error(error.stack);
  }
}

// 运行测试
testAnimeModule().then(() => {
  console.log('\n🏁 测试脚本执行完成');
}).catch(error => {
  console.error('❌ 测试脚本执行失败:', error.message);
});