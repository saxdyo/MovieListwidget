// ========== 优化后的Move_list脚本 - 移除重复函数 ==========

// ========== TVB播出平台优化模块 ==========

// TVB专用缓存系统
class TvbCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    this.lastCleanup = Date.now();
  }

  get(key) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < item.ttl) {
      this.hits++;
      return item.data;
    }
    if (item) {
      this.cache.delete(key);
    }
    this.misses++;
    return null;
  }

  set(key, data, ttl = 30 * 60 * 1000) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  stats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? ((this.hits / total) * 100).toFixed(2) : '0.00'
    };
  }
}

// TVB性能监控
class TvbPerformanceMonitor {
  constructor() {
    this.requests = 0;
    this.successes = 0;
    this.errors = 0;
    this.responseTimes = [];
    this.lastReset = Date.now();
  }

  recordRequest(success, responseTime = 0) {
    this.requests++;
    if (success) {
      this.successes++;
    } else {
      this.errors++;
    }
    if (responseTime > 0) {
      this.responseTimes.push(responseTime);
      if (this.responseTimes.length > 100) {
        this.responseTimes.shift();
      }
    }
  }

  getStats() {
    const uptime = Date.now() - this.lastReset;
    const avgResponseTime = this.responseTimes.length > 0 
      ? (this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length).toFixed(2)
      : 0;
    
    return {
      uptime: Math.floor(uptime / 1000),
      requests: this.requests,
      successRate: this.requests > 0 ? ((this.successes / this.requests) * 100).toFixed(2) : '0.00',
      avgResponseTime: `${avgResponseTime}ms`,
      errors: this.errors
    };
  }
}

// 初始化TVB优化组件
const tvbCache = new TvbCache(30);
const tvbPerformanceMonitor = new TvbPerformanceMonitor();

// 智能重试函数
async function tvbSmartRetry(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const result = await fn();
      const responseTime = Date.now() - startTime;
      
      tvbPerformanceMonitor.recordRequest(true, responseTime);
      return result;
    } catch (error) {
      tvbPerformanceMonitor.recordRequest(false);
      console.warn(`[TVB优化] 第${attempt + 1}次尝试失败: ${error.message}`);
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 增强的TVB数据获取函数
async function tmdbDiscoverByNetworkEnhanced(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_networks, 
    with_genres,
    air_status = "released",
    sort_by = "first_air_date.desc" 
  } = params;

  // 生成缓存键
  const cacheKey = `tvb_${with_networks}_${with_genres}_${air_status}_${sort_by}_${page}_${language}`;
  
  // 检查缓存
  const cachedData = tvbCache.get(cacheKey);
  if (cachedData) {
    console.log(`[TVB优化] 使用缓存数据，命中率: ${tvbCache.stats().hitRate}%`);
    return cachedData;
  }

  try {
    console.log(`[TVB优化] 开始获取TVB数据，参数:`, params);
    
    const fetchData = async () => {
      const beijingDate = getBeijingDate();
      const discoverParams = {
        language,
        page,
        sort_by,
        api_key: API_KEY
      };

      if (with_networks) {
        discoverParams.with_networks = with_networks;
      }

      if (with_genres) {
        discoverParams.with_genres = with_genres;
      }

      if (air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
      } else if (air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
      }

      const res = await Widget.tmdb.get("/discover/tv", {
        params: discoverParams
      });

      const genreMap = await fetchTmdbGenres();
      const processedData = res.results
        .map(item => formatTmdbItem(item, genreMap))
        .filter(Boolean)
        .map(item => ({ ...item, isTvbOptimized: true }));

      return processedData;
    };

    const processedData = await tvbSmartRetry(fetchData, 3, 1000);
    
    // 缓存结果
    tvbCache.set(cacheKey, processedData, 30 * 60 * 1000); // 30分钟缓存
    
    console.log(`[TVB优化] 成功获取${processedData.length}条TVB数据`);
    return processedData;
  } catch (error) {
    console.error(`[TVB优化] 数据获取失败: ${error.message}`);
    
    // 返回错误项
    return [{
      id: 'tvb-error',
      type: 'error',
      title: 'TVB数据获取失败',
      description: '网络连接或API服务暂时不可用，请稍后重试',
      isTvbOptimized: true
    }];
  }
}

// 集中配置区
const CONFIG = {
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  FRESH_DATA_DURATION: 2 * 60 * 60 * 1000, // 2小时内数据新鲜
  MAX_ITEMS: 30, // 横版标题海报最大条数
  MAX_CONCURRENT: typeof process !== 'undefined' && process.env.MAX_CONCURRENT ?
 parseInt(process.env.MAX_CONCURRENT) : 5, // 并发数支持环境变量
  LOG_LEVEL: typeof process !== 'undefined' && process.env.LOG_LEVEL ? 
process.env.LOG_LEVEL : 'info',
  LRU_CACHE_SIZE: 100 // LRU缓存最大容量
};

// 日志工具
function log(msg, level = 'info') {
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  if (levels[level] <= levels[CONFIG.LOG_LEVEL]) {
    if (level === 'error') {
      console.error(msg);
    } else if (level === 'warn') {
      console.warn(msg);
    } else {
      console.log(msg);
    }
  }
}

function setLogLevel(level) {
  if (['error','warn','info','debug'].includes(level)) {
    CONFIG.LOG_LEVEL = level;
    log(`[日志] 日志等级已切换为: ${level}`, 'info');
  }
}

// LRU缓存实现
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      this.hits++;
      return value;
    } else {
      this.misses++;
      return undefined;
    }
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  stats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? (this.hits / (this.hits + this.misses)).toFixed(2) : '0.00'
    };
  }
  
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

const backdropLRUCache = new LRUCache(CONFIG.LRU_CACHE_SIZE);
const trendingDataLRUCache = new LRUCache(10);

function getCachedBackdrop(key) { return backdropLRUCache.get(key); }
function cacheBackdrop(key, data) { backdropLRUCache.set(key, data); }
function getCachedTrendingData() { return trendingDataLRUCache.get('trending_data'); }
function cacheTrendingData(data) { trendingDataLRUCache.set('trending_data', data); }

function logCacheStats() {
  log(`[横版标题海报缓存] 命中率: ${JSON.stringify(backdropLRUCache.stats())}`, 'info');
  log(`[热门数据缓存] 命中率: ${JSON.stringify(trendingDataLRUCache.stats())}`, 'info');
}

// 并发池
class PromisePool {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.activeCount = 0;
    this.queue = [];
  }
  
  run(fn) {
    return new Promise((resolve, reject) => {
      const task = () => {
        this.activeCount++;
        fn().then(resolve, reject).finally(() => {
          this.activeCount--;
          if (this.queue.length > 0) {
            const next = this.queue.shift();
            next();
          }
        });
      };
      if (this.activeCount < this.maxConcurrent) {
        task();
      } else {
        this.queue.push(task);
      }
    });
  }
  
  async all(tasks) {
    const results = [];
    let i = 0;
    return new Promise((resolve, reject) => {
      const next = () => {
        if (i === tasks.length && this.activeCount === 0) {
          resolve(results);
        }
      };
      for (; i < tasks.length; i++) {
        this.run(tasks[i])
          .then(r => results.push(r))
          .catch(e => results.push(e))
          .finally(next);
      }
      next();
    });
  }
}

function getPromisePool(concurrent) { return new PromisePool(concurrent || CONFIG.MAX_CONCURRENT); }

async function batchGenerateBackdrops(items, generatorFn, concurrent) {
  const pool = getPromisePool(concurrent);
  const tasks = items.map(item => () => generatorFn(item));
  return await pool.all(tasks);
}

// 横版标题海报指纹缓存
function simpleHash(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

function getBackdropFingerprint(item) {
  const key = [item.id, item.title, item.name, item.backdrop_path, item.poster_path, item.vote_average, item.release_date, item.first_air_date].join('|');
  return simpleHash(key).toString();
}

async function generateBackdropWithCache(item, generatorFn) {
  const key = getBackdropFingerprint(item);
  const cached = getCachedBackdrop(key);
  if (cached) {
    return cached;
  }
  const result = await generatorFn(item);
  cacheBackdrop(key, result);
  return result;
}

// 获取当前北京时间
function getBeijingDate() {
  const date = new Date();
  const tzOffset = 480; // 北京时间与UTC时间差为8小时，即480分钟
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const bjDate = new Date(utc + (tzOffset * 60000));
  const year = bjDate.getFullYear();
  const month = String(bjDate.getMonth() + 1).padStart(2, '0');
  const day = String(bjDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// TMDB辅助函数
function getTmdbGenreTitles(ids, mediaType) {
  const names = ids
    .map(id => genreMap?.[mediaType]?.[id])
    .filter(Boolean);
  return names.length > 0 ? names.join('•') : "未知类型";
}

// 格式化TMDB条目（统一版本）
function formatTmdbItem(item, genreMap) {
  // 优先选用中文标题（增强版）
  function pickChineseTitle(...args) {
    // 第一轮：寻找包含中文的标题
    for (const str of args) {
      if (str && typeof str === 'string' && /[\u4e00-\u9fa5]/.test(str.trim())) {
        return str.trim();
      }
    }
    // 第二轮：寻找非空标题
    for (const str of args) {
      if (str && typeof str === 'string' && str.trim().length > 0) {
        return str.trim();
      }
    }
    return '未知标题';
  }
  
  // 优先使用中文简介
  function pickChineseDescription(overview) {
    if (!overview || typeof overview !== 'string') return "暂无简介";
    const trimmed = overview.trim();
    return trimmed.length > 0 ? trimmed : "暂无简介";
  }
  
  const title = pickChineseTitle(
    item.title_zh,          // 中文标题
    item.name_zh,           // 中文剧集名
    item.original_title_zh, // 中文原始标题
    item.original_name_zh,  // 中文原始剧集名
    item.title,             // 标题
    item.name,              // 剧集名
    item.original_title,    // 原始标题
    item.original_name      // 原始剧集名
  );
  
  const description = pickChineseDescription(item.overview);
  if (!/[\u4e00-\u9fa5]/.test(title) && !/[\u4e00-\u9fa5]/.test(description)) {
    return null;
  }
  
  return {
    id: item.id,
    type: "tmdb",
    title: title,
    description: description,
    releaseDate: item.release_date || item.first_air_date || "未知日期",
    // 生成智能图片URL
    posterPath: createSmartPosterUrl(item, 'w500'),
    backdropPath: item.backdrop_path ? createSmartImageUrl(item.backdrop_path, 'backdrop', 'w1280') : "",
    coverUrl: createSmartPosterUrl(item, 'w500'),
    rating: item.vote_average ? item.vote_average.toFixed(1) : "无评分",
    mediaType: item.media_type || (item.title ? "movie" : "tv"),
    genreTitle: getTmdbGenreTitles(item.genre_ids || [], item.media_type || (item.title ? "movie" : "tv")) || "未知类型",
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// 简化的组件项目创建器（统一版本）
function createSimpleWidgetItem(item) {
  return {
    id: item.id.toString(),
    type: "tmdb",
    title: item.title || "未知标题",
    genreTitle: item.genreTitle || "",
    rating: item.vote_average || 0,
    description: item.overview || "",
    releaseDate: item.release_date || "",
    
    // 海报
    posterPath: item.poster_url || "",
    coverUrl: item.poster_url || "",
    
    // 横版海报
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
    
    // 媒体信息
    mediaType: item.media_type || "movie",
    popularity: item.popularity || 0,
    voteCount: item.vote_count || 0,
    
    // 小组件标准字段
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// 增强的小组件项目创建器（统一版本）
function createEnhancedWidgetItem(item) {
  // 处理标题海报
  let titleBackdropUrl = "";
  if (item.title_backdrop) {
    if (typeof item.title_backdrop === 'string') {
      titleBackdropUrl = item.title_backdrop;
    } else if (item.title_backdrop.url) {
      titleBackdropUrl = item.title_backdrop.url;
    }
  }
  
  // 处理显示标题
  const displayTitle = item.displayTitle || item.title || "未知标题";
  
  const result = {
    id: item.id.toString(),
    type: "tmdb",
    title: displayTitle,
    genreTitle: item.genreTitle || item.genre_title || "",
    rating: item.rating || item.vote_average || 0,
    description: item.overview || item.description || "",
    releaseDate: item.release_date || item.releaseDate || "",
    
    // 标准海报
    posterPath: item.poster_url || item.poster_path || "",
    coverUrl: item.poster_url || item.poster_path || "",
    
    // 增强的横版海报（带标题效果）
    backdropPath: titleBackdropUrl || item.title_backdrop || item.backdrop_path || "",
    backdropHD: item.title_backdrop_hd || item.backdrop_hd || "",
    backdrop780: item.backdrop_w780 || "",
    
    // 高清海报
    posterHD: item.poster_hd || "",
    
    // 媒体信息
    mediaType: item.type || item.media_type || "movie",
    popularity: item.popularity || 0,
    voteCount: item.vote_count || 0,
    originalLanguage: item.original_language || "",
    
    // 标题海报特有字段
    hasTitlePoster: item.hasTitlePoster || false,
    category: item.category || "",
    titleBackdropType: item.title_backdrop?.type || "none",
    
    // 小组件标准字段
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
  
  // 调试信息
  console.log(`[增强项目] ${result.title} - 标题海报: ${result.backdropPath ? '✅' : '❌'} - 分类: ${result.category}`);
  
  return result;
}

// 智能图片URL生成器
function createSmartPosterUrl(item, preferredSize = 'w500') {
  if (!item.poster_path) return '';
  return `https://image.tmdb.org/t/p/${preferredSize}${item.poster_path}`;
}

function createSmartImageUrl(path, type = 'poster', size = 'w500') {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// TMDB类型缓存
let tmdbGenresCache = null;

// 提取 TMDB 的种类信息
async function fetchTmdbGenres() {
  // 如果已有缓存，直接返回
  if (tmdbGenresCache) {
    return tmdbGenresCache;
  }
  
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      Widget.tmdb.get('/genre/movie/list', { params: { language: 'zh-CN', api_key: API_KEY } }),
      Widget.tmdb.get('/genre/tv/list', { params: { language: 'zh-CN', api_key: API_KEY } })
    ]);

    const genreData = {
      movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
      tv: tvGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {})
    };
    
    // 缓存结果
    tmdbGenresCache = genreData;
    return genreData;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return { movie: {}, tv: {} };
  }
}

// 性能监控
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

const API_KEY = (typeof process !== 'undefined' && process.env.TMDB_API_KEY) ? process.env.TMDB_API_KEY : 'f3ae69ddca232b56265600eb919d46ab';

// 导出到global
global.tmdbDiscoverByNetworkEnhanced = tmdbDiscoverByNetworkEnhanced;
global.CONFIG = CONFIG;
global.performanceMonitor = performanceMonitor;

// ========== 主要功能函数（移除重复版本）==========

// 获取横版海报支持的TMDB横版海报列表
async function loadTmdbTrendingData() {
  const cached = getCachedTrendingData();
  if (cached && (Date.now() - cached.time) < CONFIG.FRESH_DATA_DURATION) {
    console.log("[TMDB热门] 使用缓存数据");
    return cached.data;
  }

  try {
    console.log("[TMDB热门] 开始使用 TMDB API 获取热门数据");
    // 并行获取今日、本周、热门电影和高分内容
    const [todayResponse, weekResponse, popularResponse, topRatedResponse] = await Promise.all([
      Widget.tmdb.get("/trending/all/day", { params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } }),
      Widget.tmdb.get("/trending/all/week", { params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } }),
      Widget.tmdb.get("/movie/popular", { params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } }),
      Widget.tmdb.get("/movie/top_rated", { params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } }),
    ]);

    const result = { today_global: [], week_global_all: [], popular_movies: [], top_rated: [] };

    const genreMap = await fetchTmdbGenres();

    // 处理今日热门
    if (todayResponse.data && todayResponse.data.results) {
      result.today_global = todayResponse.data.results.slice(0, 20)
        .map(item => formatTmdbItem(item, genreMap))
        .filter(Boolean);
    }

    // 处理本周热门
    if (weekResponse.data && weekResponse.data.results) {
      result.week_global_all = weekResponse.data.results.slice(0, 20)
        .map(item => formatTmdbItem(item, genreMap))
        .filter(Boolean);
    }

    // 处理热门电影
    if (popularResponse.data && popularResponse.data.results) {
      result.popular_movies = popularResponse.data.results.slice(0, 20)
        .map(item => formatTmdbItem(item, genreMap))
        .filter(Boolean);
    }

    // 处理高分内容（电影top_rated）
    if (topRatedResponse.data && topRatedResponse.data.results) {
      result.top_rated = topRatedResponse.data.results.slice(0, 20)
        .map(item => formatTmdbItem(item, genreMap))
        .filter(Boolean);
    }

    cacheTrendingData({ data: result, time: Date.now() });
    return result;
  } catch (error) {
    console.error("[TMDB热门] 获取数据失败:", error);
    return { today_global: [], week_global_all: [], popular_movies: [], top_rated: [] };
  }
}

// TMDB热门内容合并模块（统一版本）
async function loadTmdbTrendingCombined(params = {}) {
  const { 
    sort_by = "today",
    media_type = "all", 
    language = "zh-CN", 
    page = 1, 
    content_type = "popularity.desc",
    max_items = 30
  } = params;
  
  try {
    let results = [];
    
    // 使用sort_by作为内容类型选择器
    switch (sort_by) {
      case "today":
        console.log(`[TMDB热门内容] 加载今日热门数据...`);
        const todayData = await loadTmdbTrendingData();
        if (todayData && todayData.today_global && todayData.today_global.length > 0) {
          results = todayData.today_global.map(item => createEnhancedWidgetItem(item));
          console.log(`[TMDB热门内容] 从缓存获取今日热门: ${results.length}项`);
        }
        
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
          let apiEndpoint = "/trending/all/day";
          if (media_type === "tv") {
            apiEndpoint = "/trending/tv/day";
            console.log(`[TMDB热门内容] 选择剧集专用API: ${apiEndpoint}`);
          }
          
          const pages = [1, 2, 3];
          const allApiResults = [];
          
          for (const pageNum of pages) {
            const res = await Widget.tmdb.get(apiEndpoint, { 
              params: { 
                language: 'zh-CN',
                region: 'CN',
                api_key: API_KEY,
                page: pageNum
              }
            });
            const genreMap = await fetchTmdbGenres();
            const pageResults = res.results
              .map(item => formatTmdbItem(item, genreMap))
              .filter(item => item.posterPath);
            allApiResults.push(...pageResults);
          }
          
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => !existingIds.has(item.id));
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;
        
      case "week":
        console.log(`[TMDB热门内容] 加载本周热门数据...`);
        const weekData = await loadTmdbTrendingData();
        if (weekData && weekData.week_global_all && weekData.week_global_all.length > 0) {
          results = weekData.week_global_all.map(item => createEnhancedWidgetItem(item));
          console.log(`[TMDB热门内容] 从缓存获取本周热门: ${results.length}项`);
        }
        
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
          let apiEndpoint = "/trending/all/week";
          if (media_type === "tv") {
            apiEndpoint = "/trending/tv/week";
            console.log(`[TMDB热门内容] 选择剧集专用API: ${apiEndpoint}`);
          }
          
          const pages = [1, 2, 3];
          const allApiResults = [];
          
          for (const pageNum of pages) {
            const res = await Widget.tmdb.get(apiEndpoint, { 
              params: { 
                language: 'zh-CN',
                region: 'CN',
                api_key: API_KEY,
                page: pageNum
              }
            });
            const genreMap = await fetchTmdbGenres();
            const pageResults = res.results
              .map(item => formatTmdbItem(item, genreMap))
              .filter(item => item.posterPath);
            allApiResults.push(...pageResults);
          }
          
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => !existingIds.has(item.id));
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;

      case "popular":
        console.log(`[TMDB热门内容] 加载热门电影数据...`);
        if ((parseInt(page) || 1) === 1 && content_type.startsWith("popularity")) {
          const popularData = await loadTmdbTrendingData();
          if (popularData.popular_movies && popularData.popular_movies.length > 0) {
            results = popularData.popular_movies.map(item => createEnhancedWidgetItem(item));
            console.log(`[TMDB热门内容] 热门电影加载完成: ${results.length}项`);
          }
        }
        
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
          const pages = [1, 2, 3];
          const allApiResults = [];

          for (const pageNum of pages) {
            const res = await Widget.tmdb.get("/movie/popular", {
              params: {
                language: 'zh-CN',
                region: 'CN',
                page: pageNum,
                api_key: API_KEY
              }
            });
            const genreMap = await fetchTmdbGenres();
            const pageResults = res.results.map(item => formatTmdbItem(item, genreMap)).filter(Boolean);
            allApiResults.push(...pageResults);
          }

          for (const pageNum of pages) {
            const res = await Widget.tmdb.get("/tv/popular", {
              params: {
                language: 'zh-CN',
                region: 'CN',
                page: pageNum,
                api_key: API_KEY
              }
            });
            const genreMap = await fetchTmdbGenres();
            const pageResults = res.results.map(item => formatTmdbItem(item, genreMap)).filter(Boolean);
            allApiResults.push(...pageResults);
          }

          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => 
            !existingIds.has(item.id) && item.posterPath);
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;

      case "top_rated":
        console.log(`[TMDB热门内容] 加载高分内容数据...`);
        if (content_type.startsWith("vote_average")) {
          const popularData = await loadTmdbTrendingData();
          if (popularData.popular_movies && popularData.popular_movies.length > 0) {
            results = popularData.popular_movies.map(item => createEnhancedWidgetItem(item));
            console.log(`[TMDB热门内容] 高分内容加载完成: ${results.length}项`);
          }
          
          if (results.length < max_items) {
            console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
            const endpoints = [
              { api: "/movie/top_rated", mediaType: "movie" },
              { api: "/tv/top_rated", mediaType: "tv" }
            ];
            
            for (const endpoint of endpoints) {
              const res = await Widget.tmdb.get(endpoint.api, { 
                params: { 
                  language: 'zh-CN', 
                  region: 'CN',
                  page: 1, 
                  api_key: API_KEY 
                }
              });
              const genreMap = await fetchTmdbGenres();
              const endpointResults = res.results
                .map(item => formatTmdbItem(item, genreMap[endpoint.mediaType]))
                .filter(item => item.posterPath);
              results.push(...endpointResults);
            }
            
            console.log(`[TMDB热门内容] 补充API数据: ${results.length}项`);
          }
        } else {
          const endpoints = [
            { api: "/discover/movie", mediaType: "movie" },
            { api: "/discover/tv", mediaType: "tv" }
          ];
          
          for (const endpoint of endpoints) {
            const res = await Widget.tmdb.get(endpoint.api, {
              params: { 
                language: 'zh-CN',
                region: 'CN', 
                page: 1, 
                sort_by: content_type,
                api_key: API_KEY 
              }
            });
            const genreMap = await fetchTmdbGenres();
            const endpointResults = res.results
              .map(item => formatTmdbItem(item, genreMap[endpoint.mediaType]))
              .filter(item => item.posterPath);
            results.push(...endpointResults);
          }
          
          console.log(`[TMDB热门内容] 获取discover内容: ${results.length}项`);
        }
        break;
        
      default:
        console.error("Unknown content type:", sort_by);
        return [];
    }
    
    // 根据媒体类型过滤结果
    if (media_type !== "all") {
      results = results.filter(item => {
        if (media_type === "movie") {
          return item.mediaType === "movie";
        } else if (media_type === "tv") {
          return item.mediaType === "tv";
        }
        return true;
      });
    }
    
    // 限制返回数量
    results = results.slice(0, max_items);
    
    console.log(`[TMDB热门内容] 最终返回: ${results.length}项`);
    return results;
  } catch (error) {
    console.error("Error in loadTmdbTrendingCombined:", error);
    return [];
  }
}

// 获取播出平台内容（优化版）
async function tmdbDiscoverByNetwork(params = {}) {
  return await tmdbDiscoverByNetworkEnhanced(params);
}

// 获取出品公司内容
async function tmdbDiscoverByCompany(params = {}) {
  const { language = "zh-CN", page = 1, with_companies, type = "movie", with_genres, sort_by = "popularity.desc" } = params;
  try {
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY
    };
    
    if (with_companies) {
      queryParams.with_companies = with_companies;
    }
    
    if (with_genres) {
      queryParams.with_genres = with_genres;
    }
    
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => formatTmdbItem(item, genreMap[type]))
      .filter(item => item.posterPath);
  } catch (error) {
    console.error("Error fetching discover by company:", error);
    return [];
  }
}

// 获取热门电影
async function tmdbPopularMovies(params = {}) {
  const { language = "zh-CN", page = 1, sort_by = "popularity.desc" } = params;
  try {
    if ((parseInt(page) || 1) === 1 && sort_by.startsWith("popularity")) {
      const data = await loadTmdbTrendingData();
      if (data.popular_movies && data.popular_movies.length > 0) {
        return data.popular_movies
          .slice(0, 15)
          .map(item => createEnhancedWidgetItem(item));
      }
    }
    
    if (sort_by.startsWith("popularity")) {
      const res = await Widget.tmdb.get("/movie/popular", { 
        params: { 
          language: 'zh-CN',
          region: 'CN', 
          page, 
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results.map(item => formatTmdbItem(item, genreMap));
    } else {
      const res = await Widget.tmdb.get("/discover/movie", {
        params: { 
          language: 'zh-CN',
          region: 'CN', 
          page, 
          sort_by,
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results.map(item => formatTmdbItem(item, genreMap));
    }
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

// 获取高评分电影或剧集
async function tmdbTopRated(params = {}) {
  const { language = "zh-CN", page = 1, type = "movie", sort_by = "vote_average.desc" } = params;
  try {
    if (sort_by.startsWith("vote_average")) {
      const api = type === "movie" ? "/movie/top_rated" : "/tv/top_rated";
      const res = await Widget.tmdb.get(api, { 
        params: { 
          language: 'zh-CN', 
          region: 'CN',
          page, 
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap[type]))
        .filter(item => item.posterPath);
    } else {
      const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
      const res = await Widget.tmdb.get(endpoint, {
        params: { 
          language: 'zh-CN',
          region: 'CN', 
          page, 
          sort_by,
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap[type]))
        .filter(item => item.posterPath);
    }
  } catch (error) {
    console.error("Error fetching top rated:", error);
    return [];
  }
}

// 获取本周热门影视
async function loadWeekGlobalMovies(params = {}) {
  const { language = "zh-CN" } = params;
  try {
    const data = await loadTmdbTrendingData();
    if (data && data.week_global_all && data.week_global_all.length > 0) {
      return data.week_global_all.map(item => createEnhancedWidgetItem(item));
    } else {
      console.log("[备用方案] 使用标准TMDB API获取本周热门");
      const res = await Widget.tmdb.get("/trending/all/week", { 
        params: { 
          language: 'zh-CN',
          region: 'CN',
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap))
        .filter(item => item.posterPath);
    }
  } catch (error) {
    console.error("Error fetching weekly global movies:", error);
    return [];
  }
}

// 获取今日热门影视
async function loadTodayGlobalMedia(params = {}) {
  const { language = "zh-CN" } = params;
  try {
    const data = await loadTmdbTrendingData();
    if (data && data.today_global && data.today_global.length > 0) {
      return data.today_global.map(item => createEnhancedWidgetItem(item));
    } else {
      console.log("[备用方案] 使用标准TMDB API获取今日热门");
      const res = await Widget.tmdb.get("/trending/all/day", { 
        params: { 
          language: 'zh-CN',
          region: 'CN',
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap))
        .filter(item => item.posterPath);
    }
  } catch (error) {
    console.error("Error fetching trending media:", error);
    return [];
  }
}

// ========== 其他功能函数（保持原有功能）==========

// 这里可以添加其他必要的函数，但避免重复定义

console.log("[优化完成] 重复函数已移除，脚本已优化");