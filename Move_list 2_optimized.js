// ========== 优化工具与结构集成（见注释区分，原有业务逻辑保留） ==========

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

// ========== 核心工具函数（去重版本）==========

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

// ========== TMDB数据获取函数区（统一版本）==========

// 获取横版海报支持的TMDB横版海报列表（统一版本）
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

// TMDB热门内容合并模块（统一版本）- 整合今日热门、本周热门、热门电影、高分内容
async function loadTmdbTrendingCombined(params = {}) {
  const { 
    sort_by = "today",  // 现在sort_by包含内容类型
    media_type = "all", 
    language = "zh-CN", 
    page = 1, 
    content_type = "popularity.desc",  // 现在content_type包含排序方式
    max_items = 30  // 调整为30项（增加剧集数量）
  } = params;
  
  try {
    let results = [];
    
    // 使用sort_by作为内容类型选择器
    switch (sort_by) {
      case "today":
        // 今日热门 - 增强版
        console.log(`[TMDB热门内容] 加载今日热门数据...`);
        
        // 尝试多个数据源
        const todayData = await loadTmdbTrendingData();
        if (todayData && todayData.today_global && todayData.today_global.length > 0) {
          results = todayData.today_global.map(item => createEnhancedWidgetItem(item));
          console.log(`[TMDB热门内容] 从缓存获取今日热门: ${results.length}项`);
        }
        
        // 如果缓存数据不足，补充API数据
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
          
          // 根据媒体类型选择API端点
          let apiEndpoint = "/trending/all/day";
          if (media_type === "tv") {
            apiEndpoint = "/trending/tv/day";  // 专门获取剧集
            console.log(`[TMDB热门内容] 选择剧集专用API: ${apiEndpoint}`);
          }
          
          // 获取多页数据以增加数量
          const pages = [1, 2, 3];  // 获取前3页
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
          
          // 合并结果，去重
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => 
            !existingIds.has(item.id));
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;
        
      case "week":
        // 本周热门 - 增强版
        console.log(`[TMDB热门内容] 加载本周热门数据...`);
        
        const weekData = await loadTmdbTrendingData();
        if (weekData && weekData.week_global_all && weekData.week_global_all.length > 0) {
          results = weekData.week_global_all.map(item => createEnhancedWidgetItem(item));
          console.log(`[TMDB热门内容] 从缓存获取本周热门: ${results.length}项`);
        }
        
        // 如果缓存数据不足，补充API数据
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
          
          // 根据媒体类型选择API端点
          let apiEndpoint = "/trending/all/week";
          if (media_type === "tv") {
            apiEndpoint = "/trending/tv/week";  // 专门获取剧集
            console.log(`[TMDB热门内容] 选择剧集专用API: ${apiEndpoint}`);
          }
          
          // 获取多页数据以增加数量
          const pages = [1, 2, 3];  // 获取前3页
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
          
          // 合并结果，去重
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => 
            !existingIds.has(item.id));
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;
        
      case "popular":
        // 热门电影 - 增强版，优先使用横版标题海报
        console.log(`[TMDB热门内容] 加载热门电影数据...`);
        
        // 尝试多个数据源
        if ((parseInt(page) || 1) === 1 && content_type.startsWith("popularity")) {
          const popularData = await loadTmdbTrendingData();
          if (popularData.popular_movies && popularData.popular_movies.length > 0) {
            results = await loadEnhancedTitlePosterWithBackdrops(popularData.popular_movies, max_items, "popular");
            console.log(`[TMDB热门内容] 热门电影加载完成: ${results.length}项`);
          }
        }
        
        // 如果缓存数据不足，补充API数据
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);

          // 获取多页电影和剧集数据
          const pages = [1, 2, 3];  // 获取前3页
          const allApiResults = [];

          // 获取热门电影
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

          // 获取热门剧集
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

          // 合并结果，去重
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => 
            !existingIds.has(item.id) && item.posterPath);
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;
        
      case "top_rated":
        // 高分内容 - 增强版，优先使用横版标题海报
        console.log(`[TMDB热门内容] 加载高分内容数据...`);
        
        if (content_type.startsWith("vote_average")) {
          // 尝试从缓存获取高分内容
          const popularData = await loadTmdbTrendingData();
          if (popularData.popular_movies && popularData.popular_movies.length > 0) {
            results = await loadEnhancedTitlePosterWithBackdrops(popularData.popular_movies, max_items, "top_rated");
            console.log(`[TMDB热门内容] 高分内容加载完成: ${results.length}项`);
          }
          
          // 如果缓存数据不足，补充API数据
          if (results.length < max_items) {
            console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
            
            // 获取电影和剧集的高分内容
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
          // 使用discover API
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

// ========== Widget元数据和配置 ==========

WidgetMetadata = {
  id: "forward.combined.media.lists.optimized",
  title: "TMDB影视榜单（优化版）",
  description: "TMDB影视动画榜单 - 已优化重复函数",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "1.2.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    // 保留原有模块配置，但使用优化后的函数
    {
      title: "TMDB 热门内容（优化版）",
      description: "今日热门、本周热门、热门电影、高分内容合并模块（已去除重复函数）",
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
        { 
          name: "content_type", 
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
            { title: "上映日期↑", value: "release_date.asc" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TVB 播出平台（优化版）",
      description: "按播出平台和内容类型筛选剧集内容（优化版）",
      requiresWebView: false,
      functionName: "tmdbDiscoverByNetworkEnhanced",
      cacheDuration: 3600,
      params: [
        { 
          name: "with_networks",
          title: "播出平台",
          type: "enumeration",
          description: "选择一个平台以查看其剧集内容",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "TVB", value: "48" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" },
            { title: "Apple TV+", value: "2552" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "剧情", value: "18" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "动作", value: "28" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    }
  ]
};

// ========== 必要的配置和变量 ==========

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

// TMDB类型缓存
let tmdbGenresCache = null;

// 提取 TMDB 的种类信息（统一版本）
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

// ========== 辅助函数（仅保留必要的）==========

// 智能图片URL生成器
function createSmartPosterUrl(item, size = 'w500') {
  if (item.poster_path) {
    return `https://image.tmdb.org/t/p/${size}${item.poster_path}`;
  }
  return '';
}

function createSmartImageUrl(path, type = 'poster', size = 'w500') {
  if (path) {
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
  return '';
}

// 创建增强的小组件项目
function createEnhancedWidgetItem(item) {
  return {
    id: item.id ? item.id.toString() : Math.random().toString(),
    type: item.type || "tmdb",
    title: item.title || "未知标题",
    description: item.description || "暂无简介",
    releaseDate: item.releaseDate || "",
    posterPath: item.posterPath || item.coverUrl || "",
    backdropPath: item.backdropPath || "",
    coverUrl: item.posterPath || item.coverUrl || "",
    rating: item.rating || "无评分",
    mediaType: item.mediaType || "movie",
    genreTitle: item.genreTitle || "",
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// 增强标题海报加载器（简化版）
async function loadEnhancedTitlePosterWithBackdrops(items, maxItems, type) {
  const processedItems = items.slice(0, maxItems).map(item => createEnhancedWidgetItem(item));
  console.log(`[${type}] 处理了 ${processedItems.length} 项内容`);
  return processedItems;
}

// 导出到global
global.tmdbDiscoverByNetworkEnhanced = tmdbDiscoverByNetworkEnhanced;
global.loadTmdbTrendingCombined = loadTmdbTrendingCombined;
global.CONFIG = CONFIG;
global.performanceMonitor = performanceMonitor;

console.log("Move_list 2.js 优化版本已加载 - 重复函数已清理");