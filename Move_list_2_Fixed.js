// Move_list 2.js 修复版 - 解决横版海报显示问题
// 包含多种横版海报字段名映射，确保Widget界面能正确调用

WidgetMetadata = {
  id: "forward.combined.media.lists.fixed",
  title: "影视榜单 (修复版)",
  description: "修复横版海报显示的影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "2.1.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    {
      title: "TMDB 今日热门 (修复版)",
      description: "今日热门 - 修复横版海报显示",
      requiresWebView: false,
      functionName: "loadTodayGlobalMediaFixed",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 本周热门 (修复版)",
      description: "本周热门 - 修复横版海报显示",
      requiresWebView: false,
      functionName: "loadWeekGlobalMoviesFixed",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 热门电影 (修复版)",
      description: "热门电影 - 修复横版海报显示",
      requiresWebView: false,
      functionName: "tmdbPopularMoviesFixed",
      cacheDuration: 60,
      params: [
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "上映日期↓", value: "release_date.desc" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ]
};

const API_KEY = 'f3ae69ddca232b56265600eb919d46ab';

// 缓存变量
let fixedCache = null;
let fixedCacheTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟

// 获取TMDB类型信息
async function fetchTmdbGenres() {
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      Widget.tmdb.get('/genre/movie/list', { params: { language: 'zh-CN', api_key: API_KEY } }),
      Widget.tmdb.get('/genre/tv/list', { params: { language: 'zh-CN', api_key: API_KEY } })
    ]);

    return {
      movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
      tv: tvGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {})
    };
  } catch (error) {
    console.error("Error fetching genres:", error);
    return { movie: {}, tv: {} };
  }
}

// 生成类型标签
function generateGenreTitle(genreIds, mediaType, genreMap) {
  if (!Array.isArray(genreIds) || genreIds.length === 0 || !genreMap) {
    return mediaType === 'movie' ? '电影' : '剧集';
  }
  
  const genres = genreMap[mediaType] || {};
  const genreNames = genreIds
    .slice(0, 2)
    .map(id => genres[id])
    .filter(Boolean);
  
  return genreNames.length > 0 ? genreNames.join('•') : (mediaType === 'movie' ? '电影' : '剧集');
}

// 选择中文标题
function pickChineseTitle(item) {
  const candidates = [item.title, item.name, item.original_title, item.original_name];
  
  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'string' && /[\u4e00-\u9fa5]/.test(candidate.trim())) {
      return candidate.trim();
    }
  }
  
  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  
  return '未知标题';
}

// 创建修复版小组件项目（包含所有可能的横版海报字段名）
function createFixedWidgetItem(item, genreMap) {
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const title = pickChineseTitle(item);
  const genreTitle = generateGenreTitle(item.genre_ids, mediaType, genreMap);
  
  // 过滤不需要的内容
  const unwantedGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
  if (item.genre_ids && item.genre_ids.some(id => unwantedGenreIds.includes(id))) {
    return null;
  }
  
  const lowerTitle = title.toLowerCase();
  const unwantedKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻', '短剧'];
  if (unwantedKeywords.some(keyword => lowerTitle.includes(keyword))) {
    return null;
  }
  
  // 生成横版海报URL
  const backdropUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '';
  const backdropHDUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : '';
  const backdrop780Url = item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : '';
  
  const result = {
    id: item.id.toString(),
    type: "tmdb",
    title: title,
    genreTitle: genreTitle,
    rating: parseFloat((item.vote_average || 0).toFixed(1)),
    description: item.overview || '暂无简介',
    releaseDate: item.release_date || item.first_air_date || '',
    
    // 标准海报
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
    coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
    
    // === 横版海报字段 - 多种可能的字段名映射 ===
    // 主要横版海报字段
    backdropPath: backdropUrl,
    
    // 其他可能的横版海报字段名
    backdrop: backdropUrl,                    // 简短字段名
    backgroundPath: backdropUrl,              // 背景路径
    bannerUrl: backdropUrl,                   // 横幅URL
    banner: backdropUrl,                      // 横幅
    thumbnailUrl: backdropUrl,                // 缩略图URL
    thumbnail: backdropUrl,                   // 缩略图
    landscapeImage: backdropUrl,              // 横向图片
    wideImage: backdropUrl,                   // 宽屏图片
    heroImage: backdropUrl,                   // 主图
    
    // 高清横版海报
    backdropHD: backdropHDUrl,
    backdropOriginal: backdropHDUrl,
    bannerHD: backdropHDUrl,
    thumbnailHD: backdropHDUrl,
    
    // 中等尺寸横版海报
    backdrop780: backdrop780Url,
    backdropMedium: backdrop780Url,
    bannerMedium: backdrop780Url,
    
    // === 额外的图片字段（确保兼容性）===
    image: backdropUrl,                       // 通用图片字段
    photo: backdropUrl,                       // 照片字段
    picture: backdropUrl,                     // 图片字段
    
    // 媒体信息
    mediaType: mediaType,
    popularity: item.popularity || 0,
    voteCount: item.vote_count || 0,
    
    // 小组件标准字段
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
  
  // 调试日志
  console.log(`[修复版] ${result.title} - 横版海报字段:`);
  console.log(`  backdropPath: ${result.backdropPath ? '✅' : '❌'}`);
  console.log(`  backdrop: ${result.backdrop ? '✅' : '❌'}`);
  console.log(`  backgroundPath: ${result.backgroundPath ? '✅' : '❌'}`);
  console.log(`  banner: ${result.banner ? '✅' : '❌'}`);
  
  return result;
}

// 生成修复版数据
async function generateFixedData() {
  const now = Date.now();
  if (fixedCache && (now - fixedCacheTime) < CACHE_DURATION) {
    console.log("[修复版] 使用缓存数据");
    return fixedCache;
  }
  
  try {
    console.log("[修复版] 开始获取TMDB数据...");
    
    const [todayTrending, weekTrending, popularMovies, genreMap] = await Promise.all([
      Widget.tmdb.get("/trending/all/day", { 
        params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } 
      }),
      Widget.tmdb.get("/trending/all/week", { 
        params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } 
      }),
      Widget.tmdb.get("/movie/popular", { 
        params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } 
      }),
      fetchTmdbGenres()
    ]);
    
    const todayItems = todayTrending.results
      .map(item => createFixedWidgetItem(item, genreMap))
      .filter(Boolean)
      .slice(0, 20);
    
    const weekItems = weekTrending.results
      .map(item => createFixedWidgetItem(item, genreMap))
      .filter(Boolean)
      .slice(0, 20);
    
    const movieItems = popularMovies.results
      .map(item => createFixedWidgetItem(item, genreMap))
      .filter(Boolean)
      .slice(0, 15);
    
    const result = { todayItems, weekItems, movieItems };
    
    // 缓存结果
    fixedCache = result;
    fixedCacheTime = now;
    
    console.log(`[修复版] 数据获取完成: 今日${todayItems.length}项, 本周${weekItems.length}项, 热门电影${movieItems.length}项`);
    
    // 显示修复信息
    if (todayItems.length > 0) {
      const sample = todayItems[0];
      console.log(`[修复版] 示例项目: ${sample.title}`);
      console.log(`[修复版] 包含横版海报字段数量: ${Object.keys(sample).filter(key => 
        key.includes('backdrop') || key.includes('banner') || key.includes('background') || key.includes('thumbnail')
      ).length}`);
    }
    
    return result;
    
  } catch (error) {
    console.error("[修复版] 数据获取失败:", error);
    return { todayItems: [], weekItems: [], movieItems: [] };
  }
}

// 今日热门（修复版）
async function loadTodayGlobalMediaFixed(params = {}) {
  console.log("[修复版] 获取今日热门数据...");
  const data = await generateFixedData();
  return data.todayItems;
}

// 本周热门（修复版）
async function loadWeekGlobalMoviesFixed(params = {}) {
  console.log("[修复版] 获取本周热门数据...");
  const data = await generateFixedData();
  return data.weekItems;
}

// 热门电影（修复版）
async function tmdbPopularMoviesFixed(params = {}) {
  console.log("[修复版] 获取热门电影数据...");
  const data = await generateFixedData();
  return data.movieItems;
}

console.log("[修复版] 影视榜单 - 横版海报修复版加载完成！");
console.log("[修复版] 已添加多种横版海报字段名映射，确保Widget界面能正确调用:");
console.log("  - backdropPath, backdrop, backgroundPath");
console.log("  - banner, bannerUrl, thumbnail, thumbnailUrl");
console.log("  - landscapeImage, wideImage, heroImage");
console.log("  - image, photo, picture (通用字段)");