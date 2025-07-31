WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "TMDB影视榜单",
  description: "TMDB影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "1.2.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    // -------------TMDB模块-------------
    {
      title: "TMDB 标题海报热门",
      description: "今日热门、本周热门、热门电影 - 带标题海报效果",
      requiresWebView: false,
      functionName: "loadTmdbTitlePosterTrending",
      cacheDuration: 60,
      params: [
        { 
          name: "content_type", 
          title: "📺内容类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "今日热门", value: "today" },
            { title: "本周热门", value: "week" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
          ], 
          value: "today" 
        },
        { 
          name: "media_type", 
          title: "🎭媒体类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ], 
          value: "all" 
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 热门内容",
      description: "今日热门、本周热门、热门电影、高分内容合并模块",
      requiresWebView: false,
      functionName: "loadTmdbTrendingCombined",
      cacheDuration: 60,
      params: [
        {
          name: "sort_by",
          title: "📺内容类型",
          type: "enumeration",
          description: "选择内容类型",
          value: "today",
          enumOptions: [
            { title: "今日热门", value: "today" },
            { title: "本周热门", value: "week" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
          ]
        },
        { 
          name: "media_type", 
          title: "🎭媒体类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ], 
          value: "all" 
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 影视榜单",
      description: "热门电影和电视剧集榜单",
      requiresWebView: false,
      functionName: "tmdbMediaRanking",
      cacheDuration: 3600,
      params: [
        {
          name: "media_type",
          title: "🎭媒体类型",
          type: "enumeration",
          description: "选择媒体类型",
          value: "tv",
          enumOptions: [
            { title: "剧集", value: "tv" },
            { title: "电影", value: "movie" }
          ]
        },
        {
          name: "with_origin_country",
          title: "🌍制作地区",
          type: "enumeration",
          description: "按制作地区筛选内容",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "美国", value: "US" },
            { title: "中国", value: "CN" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" },
            { title: "欧洲", value: "GB,FR,DE,ES,IT" }
          ]
        },
        {
          name: "with_genres",
          title: "🎬内容类型",
          type: "enumeration",
          description: "选择内容类型",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "剧情", value: "18" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "动作", value: "28" },
            { title: "科幻", value: "878" },
            { title: "动画", value: "16" },
            { title: "悬疑", value: "9648" },
            { title: "惊悚", value: "53" },
            { title: "爱情", value: "10749" },
            { title: "家庭", value: "10751" },
            { title: "恐怖", value: "27" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "上映日期↑", value: "release_date.asc" },
            { title: "首播日期↓", value: "first_air_date.desc" },
            { title: "首播日期↑", value: "first_air_date.asc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "⭐最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "9.0分以上", value: "9.0" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "Bangumi 热门新番",
      description: "最新热门新番动画",
      requiresWebView: false,
      functionName: "bangumiHotNewAnime",
      cacheDuration: 1800,
      params: [
        {
          name: "with_origin_country",
          title: "🌸制作地区",
          type: "enumeration",
          description: "选择动画制作地区",
          value: "JP",
          enumOptions: [
            { title: "日本动画", value: "JP" },
            { title: "中国动画", value: "CN" },
            { title: "韩国动画", value: "KR" },
            { title: "全部地区", value: "" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "首播日期↓", value: "first_air_date.desc" },
            { title: "首播日期↑", value: "first_air_date.asc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "⭐最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "6.0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "8.5分以上", value: "8.5" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "豆瓣片单(TMDB版)",
      description: "豆瓣片单地址",
      requiresWebView: false,
      functionName: "loadCardItems",
      cacheDuration: 43200,
      params: [
        {
          name: "url",
          title: "列表地址",
          type: "input",
          description: "豆瓣片单地址",
          placeholders: [
            { title: "豆瓣热门电影", value: "https://m.douban.com/subject_collection/movie_hot_gaia" },
            { title: "热播新剧", value: "https://m.douban.com/subject_collection/tv_hot" },
            { title: "热播综艺", value: "https://m.douban.com/subject_collection/show_hot" },
            { title: "热播动漫", value: "https://m.douban.com/subject_collection/tv_animation" },
            { title: "影院热映", value: "https://m.douban.com/subject_collection/movie_showing" },
            { title: "豆瓣 Top 250", value: "https://m.douban.com/subject_collection/movie_top250" },
            { title: "一周电影口碑榜", value: "https://m.douban.com/subject_collection/movie_weekly_best" },
            { title: "华语口碑剧集榜", value: "https://m.douban.com/subject_collection/tv_chinese_best_weekly" },
            { title: "全球口碑剧集榜", value: "https://m.douban.com/subject_collection/tv_global_best_weekly" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        }
      ]
    },
    {
      title: "影视主题分类",
      description: "按类型/题材分类展示电影或剧集",
      requiresWebView: false,
      functionName: "classifyByGenre",
      cacheDuration: 3600,
      params: [
        {
          name: "type",
          title: "内容类型",
          type: "enumeration",
          description: "选择电影、剧集或全部",
          value: "movie",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        {
          name: "genre",
          title: "主题类型",
          type: "enumeration",
          description: "选择主题类型",
          value: "18",
          enumOptions: [
            { title: "剧情", value: "18" },
            { title: "喜剧", value: "35" },
            { title: "动作", value: "28" },
            { title: "爱情", value: "10749" },
            { title: "科幻", value: "878" },
            { title: "动画", value: "16" },
            { title: "犯罪", value: "80" },
            { title: "悬疑", value: "9648" },
            { title: "恐怖", value: "27" }
          ]
        },
        {
          name: "with_origin_country",
          title: "地区",
          type: "enumeration",
          description: "选择制作地区",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "中国", value: "CN" },
            { title: "美国", value: "US" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" },
            { title: "欧洲", value: "GB,FR,DE,ES,IT" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "上映日期↑", value: "release_date.asc" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN"
        }
      ]
    },
    {
      title: "✨ 动画",
      description: "按地区筛选的动画内容",
      requiresWebView: false,
      functionName: "listAnime",
      cacheDuration: 3600,
      params: [
        {
          name: "region",
          title: "选择地区/语言",
          type: "enumeration",
          value: "all",
          enumOptions: [
            { title: "全部地区", value: "all" },
            { title: "中国大陆", value: "country:cn" },
            { title: "美国", value: "country:us" },
            { title: "英国", value: "country:gb" },
            { title: "日本", value: "country:jp" },
            { title: "韩国", value: "country:kr" },
            { title: "欧美", value: "region:us-eu" },
            { title: "香港", value: "country:hk" },
            { title: "台湾", value: "country:tw" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "hs_desc",
          enumOptions: [
            { title: "热门度↓", value: "hs_desc" },
            { title: "热门度↑", value: "hs_asc" },
            { title: "评分↓", value: "r_desc" },
            { title: "评分↑", value: "r_asc" },
            { title: "播出时间↓", value: "date_desc" },
            { title: "播出时间↑", value: "date_asc" }
          ]
        },
        {
          name: "min_rating",
          title: "⭐最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "5.0分以上", value: "5.0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "9.0分以上", value: "9.0" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
  ]
};

// ===============常量和配置===============
const API_KEY = 'f3ae69ddca232b56265600eb919d46ab'; // TMDB API Key

// 性能监控配置
const performanceMonitor = {
  startTime: Date.now(),
  requestCount: 0,
  errorCount: 0,
  
  logRequest() {
    this.requestCount++;
  },
  
  logError() {
    this.errorCount++;
  },
  
  getStats() {
    const uptime = Date.now() - this.startTime;
    return {
      uptime: Math.round(uptime / 1000),
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0 ? ((this.requestCount - this.errorCount) / this.requestCount * 100).toFixed(1) : 0
    };
  }
};

// 请求频率限制器
class RequestRateLimiter {
  constructor() {
    this.requestHistory = new Map();
    this.maxRequestsPerMinute = 20; // 降低到20/分钟防风控
    this.maxRequestsPerSecond = 2;  // 降低到2/秒防风控
    this.domainDelays = new Map();  // 域名延迟映射
  }
  
  canMakeRequest(url) {
    const now = Date.now();
    const domain = this.extractDomain(url);
    
    if (!this.requestHistory.has(domain)) {
      this.requestHistory.set(domain, []);
    }
    
    const history = this.requestHistory.get(domain);
    const recentRequests = history.filter(time => now - time < 60000);
    this.requestHistory.set(domain, recentRequests);
    
    // 检查频率限制
    if (recentRequests.length >= this.maxRequestsPerMinute) return false;
    
    const lastSecondRequests = recentRequests.filter(time => now - time < 1000);
    if (lastSecondRequests.length >= this.maxRequestsPerSecond) return false;
    
    return true;
  }
  
  recordRequest(url) {
    const domain = this.extractDomain(url);
    const history = this.requestHistory.get(domain) || [];
    history.push(Date.now());
    this.requestHistory.set(domain, history);
  }
  
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }
  
  getSuggestedDelay(url) {
    const domain = this.extractDomain(url);
    const baseDelay = this.domainDelays.get(domain) || 500;
    const history = this.requestHistory.get(domain) || [];
    const now = Date.now();
    const recentRequests = history.filter(time => now - time < 5000);
    
    return baseDelay + (recentRequests.length * 300); // 动态增加延迟
  }
}

// 智能缓存管理器
class SmartCacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.defaultTTL = 30 * 60 * 1000; // 30分钟
  }
  
  set(key, data, ttl = this.defaultTTL) {
    if (this.cache.size >= this.maxSize) {
      // 清理最老的缓存
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// 全局实例
const requestRateLimiter = new RequestRateLimiter();
const smartCache = new SmartCacheManager();

// ===============工具函数===============

// 随机延迟函数（防风控）
async function smartDelay(url) {
  const baseDelay = requestRateLimiter.getSuggestedDelay(url);
  const randomDelay = Math.random() * 1000; // 0-1秒随机延迟
  const totalDelay = baseDelay + randomDelay;
  
  if (totalDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, totalDelay));
  }
}

// 智能请求头生成器（防风控）
function getSmartHeaders() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  ];
  
  const referers = [
    'https://www.themoviedb.org/',
    'https://www.google.com/',
    'https://www.bing.com/'
  ];
  
  return {
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Referer': referers[Math.floor(Math.random() * referers.length)],
    'Accept': 'application/json,text/plain,*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };
}

// 智能HTTP请求包装器
async function smartHttpRequest(url, options = {}) {
  const cacheKey = `http_${url}_${JSON.stringify(options)}`;
  const cached = smartCache.get(cacheKey);
  if (cached) return cached;
  
  // 检查频率限制
  if (!requestRateLimiter.canMakeRequest(url)) {
    console.log(`[频率限制] 等待请求限制重置: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // 智能延迟
  await smartDelay(url);
  
  // 记录请求
  requestRateLimiter.recordRequest(url);
  performanceMonitor.logRequest();
  
  try {
    const response = await Widget.http.get(url, {
      timeout: 10000,
      headers: getSmartHeaders(),
      ...options
    });
    
    // 缓存成功响应
    if (response && response.data) {
      smartCache.set(cacheKey, response, 10 * 60 * 1000); // 10分钟缓存
    }
    
    return response;
  } catch (error) {
    performanceMonitor.logError();
    throw error;
  }
}

// 智能TMDB API请求
async function smartTmdbRequest(endpoint, params = {}) {
  const queryParams = {
    language: 'zh-CN',
    api_key: API_KEY,
    ...params
  };
  
  const url = `https://api.themoviedb.org/3${endpoint}?${new URLSearchParams(queryParams)}`;
  const cacheKey = `tmdb_${endpoint}_${JSON.stringify(queryParams)}`;
  
  const cached = smartCache.get(cacheKey);
  if (cached) return cached;
  
  const response = await smartHttpRequest(url);
  if (response && response.data) {
    smartCache.set(cacheKey, response.data, 15 * 60 * 1000); // 15分钟缓存
    return response.data;
  }
  
  throw new Error(`TMDB API request failed: ${endpoint}`);
}

// 优化的中文标题选择器
function pickBestChineseTitle(item) {
  const candidates = [
    item.title,
    item.name,
    item.original_title,
    item.original_name
  ].filter(Boolean);
  
  // 优先选择包含中文的标题
  for (const candidate of candidates) {
    if (/[\u4e00-\u9fa5]/.test(candidate)) {
      return candidate.trim();
    }
  }
  
  // 返回第一个非空标题
  return candidates[0]?.trim() || '未知标题';
}

// 通用数据格式化器
function formatMediaItem(item, options = {}) {
  const {
    mediaType = item.media_type || (item.title ? "movie" : "tv"),
    genreMap = {}
  } = options;
  
  return {
    id: item.id?.toString() || '',
    type: "tmdb",
    title: pickBestChineseTitle(item),
    description: item.overview?.trim() || "暂无简介",
    releaseDate: item.release_date || item.first_air_date || "",
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
    coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
    rating: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
    mediaType: mediaType,
    genreTitle: getGenreTitles(item.genre_ids, mediaType, genreMap),
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// 类型缓存和处理
let genresCache = null;

async function fetchGenres() {
  if (genresCache) return genresCache;
  
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      smartTmdbRequest('/genre/movie/list'),
      smartTmdbRequest('/genre/tv/list')
    ]);
    
    genresCache = {
      movie: movieGenres.genres?.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}) || {},
      tv: tvGenres.genres?.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}) || {}
    };
    
    return genresCache;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return { movie: {}, tv: {} };
  }
}

function getGenreTitles(genreIds, mediaType, genreMap) {
  if (!Array.isArray(genreIds) || !genreMap[mediaType]) return '';
  
  return genreIds
    .slice(0, 2)
    .map(id => genreMap[mediaType][id])
    .filter(Boolean)
    .join('•');
}

// 内容过滤器
function filterContent(items) {
  const unwantedGenres = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
  const unwantedKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻', '短剧', '三级片', '成人'];
  
  return items.filter(item => {
    if (!item.posterPath) return false;
    
    // 检查类型ID
    if (item.genre_ids?.some(id => unwantedGenres.includes(id))) return false;
    
    // 检查标题和描述
    const content = `${item.title} ${item.description}`.toLowerCase();
    if (unwantedKeywords.some(keyword => content.includes(keyword))) return false;
    
    return true;
  });
}

// ===============主要功能函数===============

// 统一的TMDB数据获取函数
async function fetchTmdbData(endpoint, params = {}) {
  try {
    const data = await smartTmdbRequest(endpoint, params);
    const genreMap = await fetchGenres();
    
    if (!data.results) return [];
    
    const formattedItems = data.results.map(item => 
      formatMediaItem(item, { genreMap })
    );
    
    return filterContent(formattedItems);
  } catch (error) {
    console.error(`Error fetching TMDB data from ${endpoint}:`, error);
    return [];
  }
}

// TMDB 标题海报热门
async function loadTmdbTitlePosterTrending(params = {}) {
  const { content_type = "today", media_type = "all", page = 1 } = params;
  
  try {
    let endpoint = "";
    let requestParams = { page };
    
    switch (content_type) {
      case "today":
        endpoint = "/trending/all/day";
        break;
      case "week":
        endpoint = "/trending/all/week";
        break;
      case "popular":
        endpoint = "/movie/popular";
        break;
      case "top_rated":
        endpoint = "/movie/top_rated";
        break;
      default:
        endpoint = "/trending/all/day";
    }
    
    let results = await fetchTmdbData(endpoint, requestParams);
    
    // 根据媒体类型过滤
    if (media_type !== "all") {
      results = results.filter(item => item.mediaType === media_type);
    }
    
    // 添加标题海报标识
    return results.map(item => ({
      ...item,
      hasTitlePoster: true,
      titlePosterSource: "TMDB API"
    }));
    
  } catch (error) {
    console.error("Error in loadTmdbTitlePosterTrending:", error);
    return [];
  }
}

// TMDB 热门内容合并
async function loadTmdbTrendingCombined(params = {}) {
  const { sort_by = "today", media_type = "all", page = 1 } = params;
  
  const endpointMap = {
    today: "/trending/all/day",
    week: "/trending/all/week", 
    popular: "/movie/popular",
    top_rated: "/movie/top_rated"
  };
  
  const endpoint = endpointMap[sort_by] || endpointMap.today;
  let results = await fetchTmdbData(endpoint, { page });
  
  if (media_type !== "all") {
    results = results.filter(item => item.mediaType === media_type);
  }
  
  return results;
}

// TMDB 影视榜单
async function tmdbMediaRanking(params = {}) {
  const { 
    media_type = "tv", 
    with_origin_country, 
    with_genres, 
    sort_by = "popularity.desc",
    vote_average_gte = "0",
    page = 1 
  } = params;
  
  const endpoint = media_type === "movie" ? "/discover/movie" : "/discover/tv";
  const requestParams = { page, sort_by };
  
  if (with_origin_country) requestParams.with_origin_country = with_origin_country;
  if (with_genres) requestParams.with_genres = with_genres;
  if (vote_average_gte !== "0") requestParams.vote_average_gte = vote_average_gte;
  
  return await fetchTmdbData(endpoint, requestParams);
}

// Bangumi 热门新番
async function bangumiHotNewAnime(params = {}) {
  const { 
    with_origin_country = "JP", 
    sort_by = "popularity.desc",
    vote_average_gte = "6.0",
    page = 1 
  } = params;
  
  const requestParams = {
    page,
    sort_by,
    with_genres: "16", // 动画类型
    vote_count_gte: 10
  };
  
  if (with_origin_country) requestParams.with_origin_country = with_origin_country;
  if (vote_average_gte !== "0") requestParams.vote_average_gte = vote_average_gte;
  
  const results = await fetchTmdbData("/discover/tv", requestParams);
  
  return results.map(item => ({
    ...item,
    type: "bangumi-new",
    source: "Bangumi热门新番",
    isNewAnime: true
  }));
}

// ===============豆瓣功能函数===============

// 优化的豆瓣搜索匹配器
async function searchTmdbForDouban(title, mediaType = "multi") {
  const searchTypes = mediaType === "multi" ? ["movie", "tv"] : [mediaType];
  const allResults = [];
  
  for (const type of searchTypes) {
    try {
      const data = await smartTmdbRequest(`/search/${type}`, { query: title });
      if (data.results) {
        allResults.push(...data.results.map(item => ({ ...item, media_type: type })));
      }
    } catch (error) {
      console.log(`Search failed for ${type}: ${title}`);
    }
  }
  
  return allResults;
}

// 豆瓣标题规范化
function normalizeDoubanTitle(title) {
  const rules = [
    { pattern: /^(.+?[^0-9])\d+$/, replacement: '$1' },
    { pattern: / 第[^季]*季/, replacement: '' },
    { pattern: /^([^·]+)·(.*)$/, replacement: '$1' }
  ];
  
  let normalized = title;
  for (const rule of rules) {
    if (rule.pattern.test(normalized)) {
      normalized = normalized.replace(rule.pattern, rule.replacement);
      break;
    }
  }
  
  return normalized.trim();
}

// 豆瓣项目处理器
async function processDoubanItems(doubanItems) {
  const results = [];
  
  for (const item of doubanItems) {
    try {
      const normalizedTitle = normalizeDoubanTitle(item.title);
      const tmdbResults = await searchTmdbForDouban(normalizedTitle, item.type || "multi");
      
      if (tmdbResults.length > 0) {
        // 选择最佳匹配（按评分和人气度排序）
        const bestMatch = tmdbResults.sort((a, b) => {
          const scoreA = (a.vote_average || 0) + (a.popularity || 0) * 0.01;
          const scoreB = (b.vote_average || 0) + (b.popularity || 0) * 0.01;
          return scoreB - scoreA;
        })[0];
        
        if (bestMatch && bestMatch.poster_path) {
          const genreMap = await fetchGenres();
          const formattedItem = formatMediaItem(bestMatch, { genreMap });
          formattedItem.originalDoubanTitle = item.title;
          results.push(formattedItem);
        }
      }
    } catch (error) {
      console.log(`Failed to process douban item: ${item.title}`);
    }
  }
  
  return filterContent(results);
}

// 豆瓣片单加载器
async function loadCardItems(params = {}) {
  try {
    const url = params.url;
    if (!url) throw new Error("缺少片单 URL");
    
    if (url.includes("douban.com/doulist/")) {
      return await loadDoubanList(params);
    } else if (url.includes("douban.com/subject_collection/")) {
      return await loadDoubanCollection(params);
    } else if (url.includes("m.douban.com/doulist/")) {
      const desktopUrl = url.replace("m.douban.com", "www.douban.com");
      return await loadCardItems({ ...params, url: desktopUrl });
    }
    
    return [];
  } catch (error) {
    console.error("豆瓣片单加载失败:", error);
    return [];
  }
}

// 豆瓣豆列加载器
async function loadDoubanList(params = {}) {
  const url = params.url;
  const listId = url.match(/doulist\/(\d+)/)?.[1];
  const page = params.page || 1;
  const start = (page - 1) * 25;
  
  const pageUrl = `https://www.douban.com/doulist/${listId}/?start=${start}&sort=seq&playable=0&sub_type=`;
  
  const response = await smartHttpRequest(pageUrl, {
    headers: {
      Referer: "https://movie.douban.com/explore",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
  });
  
  const docId = Widget.dom.parse(response.data);
  const videoElementIds = Widget.dom.select(docId, ".doulist-item .title a");
  
  const doubanItems = [];
  for (const itemId of videoElementIds) {
    const text = await Widget.dom.text(itemId);
    const title = text.trim().split(' ')[0];
    if (title) {
      doubanItems.push({ title, type: "multi" });
    }
  }
  
  return await processDoubanItems(doubanItems);
}

// 豆瓣合集加载器
async function loadDoubanCollection(params = {}) {
  const url = params.url;
  const listId = url.match(/subject_collection\/(\w+)/)?.[1];
  const page = params.page || 1;
  const start = (page - 1) * 20;
  
  const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=20&updated_at&items_only=1&for_mobile=1`;
  
  const response = await smartHttpRequest(apiUrl, {
    headers: {
      Referer: `https://m.douban.com/subject_collection/${listId}/`,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15"
    }
  });
  
  if (!response.data?.subject_collection_items) {
    throw new Error("获取豆瓣合集数据失败");
  }
  
  const doubanItems = response.data.subject_collection_items.map(item => ({
    title: item.title,
    type: item.subtype || "multi"
  }));
  
  return await processDoubanItems(doubanItems);
}

// 影视主题分类
async function classifyByGenre(params = {}) {
  const { 
    type = "movie", 
    genre = "", 
    page = 1, 
    with_origin_country = "", 
    sort_by = "popularity.desc" 
  } = params;
  
  try {
    if (type === 'all') {
      const [movieResults, tvResults] = await Promise.all([
        classifyByGenre({ ...params, type: 'movie' }),
        classifyByGenre({ ...params, type: 'tv' })
      ]);
      
      // 合并并去重
      const all = [...movieResults, ...tvResults];
      const seen = new Set();
      return all.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    }
    
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    const requestParams = { page, sort_by };
    
    if (genre) requestParams.with_genres = genre;
    if (with_origin_country) requestParams.with_origin_country = with_origin_country;
    
    return await fetchTmdbData(endpoint, requestParams);
  } catch (error) {
    console.error("Error in classifyByGenre:", error);
    return [];
  }
}

// ===============动画模块===============

// IMDb-v2 配置
const GITHUB_OWNER = "opix-maker";
const GITHUB_REPO = "Forward";  
const GITHUB_BRANCH = "main";
const BASE_DATA_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/imdb-data-platform/dist`;
const ITEMS_PER_PAGE = 30;

// 获取分页数据
async function fetchPagedData(shardPath) {
  if (!shardPath?.endsWith('.json')) {
    console.error(`无效的分片路径: ${shardPath}`);
    return [];
  }
  
  const cacheBuster = Math.floor(Date.now() / (1000 * 60 * 30)); // 30分钟
  const url = `${BASE_DATA_URL}/${shardPath}?cache_buster=${cacheBuster}`;
  
  try {
    const response = await smartHttpRequest(url, { timeout: 15000 });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (error.message?.includes('404')) {
      return []; // 页码超出范围
    }
    throw new Error(`获取动画数据失败: ${error.message}`);
  }
}

// 映射为小组件格式
function mapAnimeToWidgetItem(item) {
  if (!item?.id) return null;
  
  const mediaType = item.mt === 'anime' || item.mt === 'tv' ? 'tv' : 'movie';
  const posterUrl = item.p ? `https://image.tmdb.org/t/p/w500${item.p}` : '';
  const backdropUrl = item.b ? `https://image.tmdb.org/t/p/w780${item.b}` : '';
  const releaseDate = item.rd || (item.y ? `${item.y}-01-01` : '');
  
  return {
    id: String(item.id),
    type: "tmdb",
    title: item.t || '未知标题',
    posterPath: posterUrl,
    backdropPath: backdropUrl,
    coverUrl: posterUrl,
    releaseDate: releaseDate,
    mediaType: mediaType,
    rating: typeof item.r === 'number' ? item.r.toFixed(1) : '0.0',
    description: item.o || '',
    link: null,
    genreTitle: "",
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// 处理排序和页码参数
function getSortAndPage(params) {
  const sortKeyRaw = params.sort_by || params.sort || 'd_desc';
  let sortKey = 'd';
  
  if (typeof sortKeyRaw === 'string') {
    if (sortKeyRaw.includes('_desc') || sortKeyRaw.includes('_asc')) {
      sortKey = sortKeyRaw.split('_')[0];
    } else {
      sortKey = sortKeyRaw;
    }
    
    const sortKeyMap = {
      'hs': 'hs',
      'r': 'r', 
      'd': 'd',
      'date': 'd',
      'vote': 'r',
      'random': 'hs'
    };
    
    sortKey = sortKeyMap[sortKey] || 'd';
  }
  
  const page = Math.max(1, parseInt(params.page || "1", 10));
  return { sortKey, page };
}

// 构建分页文件路径
function buildPagedPath(basePath, sortKey, page) {
  const cleanBasePath = String(basePath).replace(':', '_');
  return `${cleanBasePath}/by_${sortKey}/page_${page}.json`;
}

// 动画列表
async function listAnime(params) {
  const region = params.region || 'all';
  const minRating = parseFloat(params.min_rating) || 0;
  const basePath = `anime/${region.replace(':', '_')}`;
  
  try {
    const { sortKey, page } = getSortAndPage(params);
    const fullPath = buildPagedPath(basePath, sortKey, page);
    
    const data = await fetchPagedData(fullPath);
    const items = data.map(mapAnimeToWidgetItem).filter(Boolean);
    
    // 评分过滤
    let filteredItems = items;
    if (minRating > 0) {
      filteredItems = items.filter(item => {
        const rating = parseFloat(item.rating) || 0;
        return rating >= minRating;
      });
    }
    
    // 设置下一页参数
    if (items.length === ITEMS_PER_PAGE) {
      params.nextPageParams = { ...params, page: String(page + 1) };
    } else {
      params.nextPageParams = null;
    }
    
    return filteredItems;
  } catch (error) {
    console.error('动画模块处理出错:', error);
    throw error;
  }
}

// ===============清理和监控===============

// 定期清理缓存
setInterval(() => {
  smartCache.cleanup();
  
  if (performanceMonitor.requestCount > 0) {
    const stats = performanceMonitor.getStats();
    console.log(`[性能监控] 运行时间: ${stats.uptime}秒, 请求数: ${stats.requestCount}, 错误数: ${stats.errorCount}, 成功率: ${stats.successRate}%`);
  }
}, 5 * 60 * 1000); // 5分钟

console.log("[系统] 影视榜单脚本优化完成 v1.2.0");
console.log("[优化] 移除重复函数，统一数据获取接口");
console.log("[性能] 智能缓存和频率限制已启用");
console.log("[防风控] 请求头轮换和延迟机制已激活");






