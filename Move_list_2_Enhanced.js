// 这是Move_list 2.js的增强版本，包含横版海报功能
// 直接复制这个文件内容到您的Widget中测试

WidgetMetadata = {
  id: "forward.combined.media.lists.enhanced",
  title: "影视榜单 (增强版)",
  description: "支持横版海报的影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    {
      title: "TMDB 今日热门 (增强版)",
      description: "今日热门电影与剧集 - 支持横版海报",
      requiresWebView: false,
      functionName: "loadTodayGlobalMediaEnhanced",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 本周热门 (增强版)",
      description: "本周热门电影与剧集 - 支持横版海报",
      requiresWebView: false,
      functionName: "loadWeekGlobalMoviesEnhanced",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    }
  ]
};

const API_KEY = 'f3ae69ddca232b56265600eb919d46ab';

// 缓存变量
let enhancedCache = null;
let enhancedCacheTime = 0;
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

// 处理增强的媒体项目
function processEnhancedMediaItem(item, genreMap) {
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
  
  return {
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
    
    // 增强的横版海报（多种尺寸）
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
    backdropHD: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : '',
    backdrop780: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : '',
    
    // 媒体信息
    mediaType: mediaType,
    popularity: item.popularity || 0,
    
    // 小组件标准字段
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// 生成增强的热门数据
async function generateEnhancedData() {
  const now = Date.now();
  if (enhancedCache && (now - enhancedCacheTime) < CACHE_DURATION) {
    console.log("[增强版] 使用缓存数据");
    return enhancedCache;
  }
  
  try {
    console.log("[增强版] 开始获取TMDB数据...");
    
    const [todayTrending, weekTrending, genreMap] = await Promise.all([
      Widget.tmdb.get("/trending/all/day", { 
        params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } 
      }),
      Widget.tmdb.get("/trending/all/week", { 
        params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } 
      }),
      fetchTmdbGenres()
    ]);
    
    const todayItems = todayTrending.results
      .map(item => processEnhancedMediaItem(item, genreMap))
      .filter(Boolean)
      .slice(0, 20);
    
    const weekItems = weekTrending.results
      .map(item => processEnhancedMediaItem(item, genreMap))
      .filter(Boolean)
      .slice(0, 20);
    
    const result = { todayItems, weekItems };
    
    // 缓存结果
    enhancedCache = result;
    enhancedCacheTime = now;
    
    console.log(`[增强版] 数据获取完成: 今日${todayItems.length}项, 本周${weekItems.length}项`);
    
    // 显示横版海报信息
    if (todayItems.length > 0) {
      const sample = todayItems[0];
      console.log(`[增强版] 示例项目: ${sample.title}`);
      console.log(`[增强版] 横版海报: ${sample.backdropPath ? '✅ 有' : '❌ 无'}`);
      console.log(`[增强版] 高清横版海报: ${sample.backdropHD ? '✅ 有' : '❌ 无'}`);
    }
    
    return result;
    
  } catch (error) {
    console.error("[增强版] 数据获取失败:", error);
    return { todayItems: [], weekItems: [] };
  }
}

// 今日热门（增强版）
async function loadTodayGlobalMediaEnhanced(params = {}) {
  console.log("[增强版] 获取今日热门数据...");
  const data = await generateEnhancedData();
  return data.todayItems;
}

// 本周热门（增强版）
async function loadWeekGlobalMoviesEnhanced(params = {}) {
  console.log("[增强版] 获取本周热门数据...");
  const data = await generateEnhancedData();
  return data.weekItems;
}

console.log("[增强版] 影视榜单 - 横版海报增强版加载完成！");
console.log("[增强版] 支持功能: 多尺寸横版海报、智能内容过滤、中文优先显示");