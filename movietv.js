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

// 格式化TMDB条目
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

// --------------- TMDB数据获取函数区 ---------------

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

// 获取今日热门影视（增强版横版海报支持）
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

// 获取本周热门影视（增强版横版海报支持）
async function loadWeekGlobalMovies(params = {}) {
  const { language = "zh-CN" } = params;
  try {
    const data = await loadTmdbTrendingData();
    if (data && data.week_global_all && data.week_global_all.length > 0) {
        return data.week_global_all.map(item => createEnhancedWidgetItem(item));
    } else {
        // 备用方案：使用标准TMDB API（优先中文）
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

// 获取热门电影（增强版横版海报支持）
async function tmdbPopularMovies(params = {}) {
  const { language = "zh-CN", page = 1, sort_by = "popularity.desc" } = params;
  try {
    // 第一页且是热门度排序时，使用预处理数据（带标题横版海报）
    if ((parseInt(page) || 1) === 1 && sort_by.startsWith("popularity")) {
        const data = await loadTmdbTrendingData();
        if (data.popular_movies && data.popular_movies.length > 0) {
            return data.popular_movies
                .slice(0, 15)
                .map(item => createEnhancedWidgetItem(item));
        }
    }
    
    // 其他情况使用标准TMDB API（优先中文）
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
      return res.results.map(item => formatTmdbItem(item, genreMap)).filter(Boolean);
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
      return res.results.map(item => formatTmdbItem(item, genreMap)).filter(Boolean);
    }
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

// 获取高评分电影或剧集
async function tmdbTopRated(params = {}) {
  const { language = "zh-CN", page = 1, type = "movie", sort_by = 
"vote_average.desc" } = params;
  try {
    // 如果选择的是评分排序，使用top_rated端点；否则使用discover端点
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
        .filter(item => item.posterPath); // 高分内容 top_rated
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
        .filter(item => item.posterPath); // 高分内容 discover
    }
  } catch (error) {
    console.error("Error fetching top rated:", error);
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
    // 构建API端点
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY
    };
    
    // 添加出品公司过滤器
    if (with_companies) {
      queryParams.with_companies = with_companies;
    }
    
    // 添加题材类型过滤器
    if (with_genres) {
      queryParams.with_genres = with_genres;
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => formatTmdbItem(item, genreMap[type]))
      .filter(item => item.posterPath); // 出品公司
  } catch (error) {
    console.error("Error fetching discover by company:", error);
    return [];
  }
}

// TMDB热门内容合并模块 - 整合今日热门、本周热门、热门电影、高分内容
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
            apiEndpoint = "/trending/tv/week`;  // 专门获取剧集
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
        if ((parseInt(page) || 1) === 1 && 
content_type.startsWith("popularity")) {
          const popularData = await loadTmdbTrendingData();
          if (popularData.popular_movies && popularData.popular_movies.length > 0) {
            results = await loadEnhancedTitlePosterWithBackdrops(popularData.popular_movies, max_items, "popular");
            console.log(`[TMDB热门内容] 热门电影加载完成: ${results.length}项`);
          }
        }
        
        // 如果缓存数据不足，补充API数据
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
          
          // 获取多页数据
          const pages = [1, 2];  // 获取前2页
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
            const pageResults = res.results.map(item => formatTmdbItem(item,
genreMap)).filter(Boolean);
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
        
        // 尝试从缓存获取高分内容
        if (trendingData && trendingData.popular_movies && 
trendingData.popular_movies.length > 0) {
          results = await 
loadEnhancedTitlePosterWithBackdrops(trendingData.popular_movies, max_items, "top_rated");
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

// 标题海报热门内容加载器
async function loadTmdbTitlePosterTrending(params = {}) {
  // 只根据sort_by切换内容类型，不再做强制联动
  let { 
    content_type = "today", 
    media_type = "all", 
    sort_by = "today", 
    language = "zh-CN", 
    page = 1,
    max_items = 30  // 调整为30项（增加剧集数量）
  } = params;

  // 如果sort_by有值，直接用sort_by作为内容类型
  if (["today","week","popular","top_rated"].includes(sort_by)) {
    content_type = sort_by;
  }
    
    try {
        console.log(`[标题海报] 加载${content_type}内容...`);
        
        // 获取TMDB热门数据（包含标题海报）
        let trendingData = await loadTmdbTrendingData();
        
        // 健康检查
        const health = checkDataHealth(trendingData);
        if (!health.healthy) {
          console.log(`[标题海报] 数据健康检查失败: ${health.issues.join(', ')}`);
          console.log("[标题海报] 尝试自动恢复...");
          
          // 尝试自动恢复
          const recoveredData = await autoRecoverData();
          if (recoveredData) {
            trendingData = recoveredData;
            console.log("[标题海报] 数据自动恢复成功");
          } else {
            console.log("[标题海报] 数据自动恢复失败，使用备用方案");
          }
        } else {
          console.log(`[标题海报] 数据健康检查通过 - 今日热门: ${health.stats.today_global || 
0}, 本周热门: ${health.stats.week_global_all || 0}, 热门电影: 
${health.stats.popular_movies || 0}`);
        }
        
        let results = [];
        
        // 根据内容类型获取数据
        switch (content_type) {
          case "today":
            // 今日热门 - 增强版，优先使用横版标题海报
            if (trendingData && trendingData.today_global && 
trendingData.today_global.length > 0) {
              results = await 
loadEnhancedTitlePosterWithBackdrops(trendingData.today_global, max_items, 
"today");
              console.log(`[标题海报] 今日热门加载完成: ${results.length}项`);
            }
            
            // 如果缓存数据不足，补充API数据
            if (results.length < max_items) {
              console.log(`[标题海报] 缓存数据不足，补充API数据...`);
              const res = await Widget.tmdb.get("/trending/all/day", { 
                params: { 
                  language: 'zh-CN',
                  region: 'CN',
                  api_key: API_KEY,
                  page: 1
                }
              });
              const genreMap = await fetchTmdbGenres();
              const apiResults = res.results
                .map(item => formatTmdbItem(item, genreMap))
                .filter(item => item.posterPath);
              
              // 合并结果，去重
              const existingIds = new Set(results.map(item => item.id));
              const newResults = apiResults.filter(item => 
!existingIds.has(item.id));
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "week":
            // 本周热门 - 增强版，优先使用横版标题海报
            if (trendingData && trendingData.week_global_all && 
trendingData.week_global_all.length > 0) {
              results = await 
loadEnhancedTitlePosterWithBackdrops(trendingData.week_global_all, max_items, 
"week");
              console.log(`[标题海报] 本周热门加载完成: ${results.length}项`);
            }
            
            // 如果缓存数据不足，补充API数据
            if (results.length < max_items) {
              console.log(`[标题海报] 缓存数据不足，补充API数据...`);
              const res = await Widget.tmdb.get("/trending/all/week", { 
                params: { 
                  language: 'zh-CN',
                  region: 'CN',
                  api_key: API_KEY,
                  page: 1
                }
              });
              const genreMap = await fetchTmdbGenres();
              const apiResults = res.results
                .map(item => formatTmdbItem(item, genreMap))
                .filter(item => item.posterPath);
              
              // 合并结果，去重
              const existingIds = new Set(results.map(item => item.id));
              const newResults = apiResults.filter(item => 
!existingIds.has(item.id));
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "popular":
            // 热门电影 - 增强版，优先使用横版标题海报
            if (trendingData && trendingData.popular_movies && 
trendingData.popular_movies.length > 0) {
              results = await 
loadEnhancedTitlePosterWithBackdrops(trendingData.popular_movies, max_items, 
"popular");
              console.log(`[标题海报] 热门电影加载完成: ${results.length}项`);
            }
            
            // 如果缓存数据不足，补充API数据
            if (results.length < max_items) {
              console.log(`[标题海报] 缓存数据不足，补充API数据...`);
              
              // 获取多页数据
              const pages = [1, 2];  // 获取前2页
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
                const pageResults = res.results.map(item => formatTmdbItem(item, genreMap));
                allApiResults.push(...pageResults);
              }
              
              // 合并结果，去重
              const existingIds = new Set(results.map(item => item.id));
              const newResults = allApiResults.filter(item => 
!existingIds.has(item.id) && item.posterPath);
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "top_rated":
            // 高分内容 - 增强版，优先使用横版标题海报
            console.log(`[标题海报] 加载高分内容数据...`);
            
            // 尝试从缓存获取高分内容
            if (trendingData && trendingData.popular_movies && 
trendingData.popular_movies.length > 0) {
              results = await 
loadEnhancedTitlePosterWithBackdrops(trendingData.popular_movies, max_items, 
"top_rated");
              console.log(`[标题海报] 高分内容加载完成: ${results.length}项`);
            }
            
            // 如果缓存数据不足，补充API数据
            if (results.length < max_items) {
              console.log(`[标题海报] 缓存数据不足，补充API数据...`);
              
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
              
              console.log(`[标题海报] 补充API数据: ${results.length}项`);
            }
            break;
            
          default:
            console.error("Unknown content type:", content_type);
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
        
        console.log(`[标题海报] 最终返回: ${results.length}项`);
        return results;
      } catch (error) {
        console.error("Error in loadTmdbTitlePosterTrending:", error);
        return [];
      }
}

 // -------------Bangumi模块函数-------------

// Bangumi热门新番 - 最新热门新番动画
async function bangumiHotNewAnime(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_origin_country = "JP",
    with_genres = "16",
    sort_by = "popularity.desc",
    vote_average_gte = "6.0",
    year = ""
  } = params;

  try {
    console.log(`[Bangumi新番] 开始获取动画数据，排序: ${sort_by}`);
    const endpoint = "/discover/tv";

    // 构建查询参数 - 支持多类型动画
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      vote_count_gte: 10  // 新番投票较少，降低门槛
    };
    
    // 动画类型筛选 - 确保只获取动画内容
    if (with_genres && with_genres !== "") {
      queryParams.with_genres = with_genres;
      // 确保包含动画类型
      if (!queryParams.with_genres.includes("16")) {
        queryParams.with_genres = `${queryParams.with_genres},16`;
      }
    } else {
      queryParams.with_genres = "16"; // 默认动画
    }
    
    // 添加制作地区
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
      console.log(`[Bangumi新番] 地区筛选: ${with_origin_country}`);
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    console.log(`[Bangumi新番] 获取到 ${res.results.length} 项动画数据`);
    
    const genreMap = await fetchTmdbGenres();
    let results = res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap);
        // 添加Bangumi新番标识
        formattedItem.type = "bangumi-new";
        formattedItem.source = "Bangumi热门新番";
        formattedItem.isNewAnime = true;
        
        // 优化日期显示
        if (formattedItem.releaseDate) {
          const date = new Date(formattedItem.releaseDate);
          if (!isNaN(date.getTime())) {
            formattedItem.airDate = formattedItem.releaseDate;
            formattedItem.airYear = date.getFullYear();
            formattedItem.isRecent = (new Date().getTime() - date.getTime()) < 
(365 * 24 * 60 * 60 * 1000); // 一年内
          }
        }
        
        return formattedItem;
      })
      .filter(item => item.posterPath);
    
    // 根据排序方式进一步优化结果
    if (sort_by.includes("first_air_date") || sort_by.includes("last_air_date")) {
      // 日期排序时，优先显示有播出日期的动画
      results = results.sort((a, b) => {
        const aDate = a.airDate ? new Date(a.airDate).getTime() : 0;
        const bDate = b.airDate ? new Date(b.airDate).getTime() : 0;
        
        if (sort_by.includes("desc")) {
          return bDate - aDate; // 最新在前
        } else {
          return aDate - bDate; // 最早在前
        }
      });
      
      console.log(`[Bangumi新番] 按播出日期排序完成，共 ${results.length} 项`);
    }
    
    return results;
  } catch (error) {
    console.error("[Bangumi新番] 获取动画数据失败:", error);
    return [];
  }
}

// TMDB影视榜单 - 热门电影和电视剧集榜单
async function tmdbMediaRanking(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    media_type = "tv",
    with_origin_country,
    with_genres,
    sort_by = "popularity.desc",
    vote_average_gte = "0",
    year = ""
  } = params;
  
  try {
    // 根据媒体类型选择API端点
    const endpoint = media_type === "movie" ? "/discover/movie" : 
"/discover/tv";
    
    // 构建查询参数 - 确保使用纯TMDB API
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      // 确保有足够投票数
      vote_count_gte: media_type === "movie" ? 100 : 50
    };
    
    // 添加制作地区 - 这是关键参数
    if (with_origin_country && with_origin_country !== "") {
      queryParams.with_origin_country = with_origin_country;
      console.log(`[TMDB影视榜单] 地区筛选: ${with_origin_country}`);
    }
    
    // 添加内容类型
    if (with_genres && with_genres !== "") {
      queryParams.with_genres = with_genres;
      console.log(`[TMDB影视榜单] 类型筛选: ${with_genres}`);
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 添加年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      if (media_type === "movie") {
        // 电影使用 release_date
        queryParams.release_date_gte = startDate;
        queryParams.release_date_lte = endDate;
        console.log(`[TMDB影视榜单] 电影年份筛选: ${year}年 (${startDate} - ${endDate})`);
      } else {
        // 剧集使用 first_air_date
        queryParams.first_air_date_gte = startDate;
        queryParams.first_air_date_lte = endDate;
        console.log(`[TMDB影视榜单] 剧集年份筛选: ${year}年 (${startDate} - ${endDate})`);
      }
    }
    
    // 根据媒体类型调整排序参数
    if (media_type === "movie") {
      // 电影使用 release_date
      if (sort_by.includes("first_air_date")) {
        queryParams.sort_by = sort_by.replace("first_air_date", "release_date");
      }
    } else {
      // 剧集使用 first_air_date
      if (sort_by.includes("release_date")) {
        queryParams.sort_by = sort_by.replace("release_date", "first_air_date");
      }
    }
    
    console.log(`[TMDB影视榜单] API请求参数:`, queryParams);
    
    // 发起API请求 - 直接使用Widget.tmdb，不使用任何缓存
    performanceMonitor.logRequest();
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    console.log(`[TMDB影视榜单] 返回数据数量: ${res.results.length}`);
    
    // 检查返回数据的地区分布
    const countryStats = {};
    res.results.forEach(item => {
      if (item.origin_country && item.origin_country.length > 0) {
        item.origin_country.forEach(country => {
          countryStats[country] = (countryStats[country] || 0) + 1;
        });
      }
    });
    console.log(`[TMDB影视榜单] 地区分布:`, countryStats);
    
    // 验证地区筛选是否生效
    if (with_origin_country && with_origin_country !== "") {
      const hasTargetCountry = res.results.some(item => 
        item.origin_country && item.origin_country.includes(with_origin_country)
      );
      if (!hasTargetCountry) {
        console.warn(`[TMDB影视榜单] 警告: 未找到目标地区 ${with_origin_country} 的内容`);
      }
    }
    
    const genreMap = await fetchTmdbGenres();
    const filteredResults = res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap);
        // 添加媒体类型标识
        formattedItem.type = `tmdb-${media_type}`;
        formattedItem.source = `TMDB影视榜单-${media_type === "movie" ? "电影" : "剧集"}`;
        formattedItem.contentType = media_type === "movie" ? "电影" : "剧集";
        formattedItem.mediaType = media_type;
        return formattedItem;
      })
      .filter(item => {
        // 过滤掉无海报
        if (!item.posterPath) return false;
        // 过滤掉综艺（真人秀、脱口秀、访谈、节目等）和纪录片、新闻
        const varietyGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
        if (item.genre_ids && item.genre_ids.some(id => 
            varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻'];
        if (showKeywords.some(k => lowerTitle.includes(k) || 
            lowerDesc.includes(k))) return false;
        // 过滤短剧（标题或副标题包含"短剧"）
        if (lowerTitle.includes('短剧') || lowerDesc.includes('短剧')) return false;
        // 过滤三级片
        const cat3Keywords = ['三级片','三級片','三級','3级片','3級片','3级','3級','R级','R級',
'限制级','限制級','成人片','情色片','无码','無碼','无码片','無碼片'];
        if (cat3Keywords.some(k => lowerTitle.includes(k) || 
            lowerDesc.includes(k) || (item.genreTitle && item.genreTitle.includes(k)))) {
          return false;
        }
        return true;
      });
    
    console.log(`[TMDB影视榜单] 最终过滤后数量: ${filteredResults.length}`);
    return filteredResults;
  } catch (error) {
    performanceMonitor.logError();
    console.error("Error fetching TMDB media ranking:", error);
    return [];
  }
}

// 保留原有的TMDB热门剧集函数以保持兼容性
async function tmdbPopularTVShows(params = {}) {
  return await tmdbMediaRanking({
    ...params,
    media_type: "tv"
  });
}

// TMDB剧集时间榜 - 按时间和地区筛选的剧集内容
async function tmdbTVShowsByTime(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    time_period = "current_year",
    with_origin_country,
    with_genres,
    sort_by = "first_air_date.desc",
    vote_average_gte = "0"
  } = params;
  
  try {
    const endpoint = "/discover/tv";
    
    // 根据时间范围计算日期
    const dateRange = getTimePeriodDateRange(time_period);
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      // 时间筛选
      vote_count_gte: 20  // 较低门槛，包含更多时间范围内的剧集
    };
    
    // 添加时间范围
    if (dateRange.start) {
      queryParams.first_air_date_gte = dateRange.start;
    }
    if (dateRange.end) {
      queryParams.first_air_date_lte = dateRange.end;
    }
    
    // 添加制作地区
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    
    // 添加剧集类型
    if (with_genres) {
      queryParams.with_genres = with_genres;
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap);
        // 添加时间榜标识
        formattedItem.type = "tmdb-tv-time";
        formattedItem.source = `TMDB ${getTimePeriodName(time_period)}剧集`;
        formattedItem.timePeriod = time_period;
        formattedItem.contentType = "时间榜剧集";
        return formattedItem;
      })
      .filter(item => item.posterPath); // TMDB剧集时间榜
  } catch (error) {
    console.error("Error fetching TMDB TV shows by time:", error);
    return [];
  }
}

// -------------TMDB剧集辅助函数-------------
 
// 获取时间范围的日期区间
function getTimePeriodDateRange(time_period) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  const periodMap = {
    current_year: { start: `${currentYear}-01-01`, end: `${currentYear}-12-31` },
    last_year: { start: `${lastYear}-01-01`, end: `${lastYear}-12-31` },
    recent_3_years: { start: `${currentYear - 2}-01-01`, end: `${currentYear}-12-31` },
    recent_5_years: { start: `${currentYear - 4}-01-01`, end: `${currentYear}-12-31` },
    "2020s": { start: "2020-01-01", end: "2029-12-31" },
    "2010s": { start: "2010-01-01", end: "2019-12-31" },
    "2000s": { start: "2000-01-01", end: "2009-12-31" },
    earlier: { start: "1900-01-01", end: "1999-12-31" }
  };
  
  return periodMap[time_period] || { start: null, end: null };
}

// 获取时间范围的中文名称
function getTimePeriodName(time_period) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  const periodMap = {
    current_year: "今年",
    last_year: "去年",
    recent_3_years: "近3年",
    recent_5_years: "近5年",
    "2020s": "2020年代",
    "2010s": "2010年代",
    "2000s": "2000年代",
    earlier: "更早"
  };
  
  return periodMap[time_period] || time_period;
}

// 创建简化版小组件项目（仅展示基础信息）
function createSimpleWidgetItem(item) {
    const title = item.title || "未知标题";
    const description = item.overview || "";
    if (!/[\u4e00-\u9fa5]/.test(title) && !/[\u4e00-\u9fa5]/.test(description)) {
      return null;
    }
    return {
        id: item.id.toString(),
        type: "tmdb",
        title: title,
        genreTitle: item.genreTitle || "",
        rating: item.vote_average || 0,
        description: description,
        releaseDate: item.release_date || "",
        
        // 海报
        posterPath: item.poster_url || "",
        coverUrl: item.poster_url || "",
        
        // 横版海报
        backdropPath: item.backdrop_path ? 
`https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
        
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

// -------------老的简化版趋势数据生成（备用）-------------
async function generateSimpleTrendingData() {
    try {
        console.log("[简化备用] 开始生成简化趋势数据...");
        
        // 并行获取基本数据
        const [todayResponse, weekResponse, popularResponse] = await 
Promise.allSettled([
            Widget.tmdb.get("/trending/all/day", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            Widget.tmdb.get("/trending/all/week", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            Widget.tmdb.get("/movie/popular", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            })
        ]);
        
        const result = {
            today_global: [],
            week_global_all: [],
            popular_movies: []
        };
        
        // 处理今日热门
        if (todayResponse.status === 'fulfilled' && todayResponse.value.results) 
{
            result.today_global = todayResponse.value.results.slice(0, 20).map(item => ({
                id: item.id,
                title: item.title || item.name,
                poster_url: item.poster_path ? 
`https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.release_date || item.first_air_date,
                media_type: item.media_type
            }));
        }
        
        // 处理本周热门
        if (weekResponse.status === 'fulfilled' && weekResponse.value.results) {
            result.week_global_all = weekResponse.value.results.slice(0, 20).map(item => ({
                id: item.id,
                title: item.title || item.name,
                poster_url: item.poster_path ? 
`https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.release_date || item.first_air_date,
                media_type: item.media_type
            }));
        }
        
        // 处理热门电影
        if (popularResponse.status === 'fulfilled' && 
popularResponse.value.results) {
            result.popular_movies = popularResponse.value.results.slice(0, 20).map(item => ({
                id: item.id,
                title: item.title,
                poster_url: item.poster_path ? 
`https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.release_date,
                media_type: 'movie'
            }));
        }
        
        console.log(`[简化备用] 数据生成完成 - 今日热门: ${result.today_global.length}, 本周热门: 
${result.week_global_all.length}, 热门电影: ${result.popular_movies.length}`);
        return result;
    } catch (error) {
        console.error("[简化备用] 生成简化趋势数据失败:", error);
        return null;
    }
}

// 从主要数据源获取数据
async function fetchFromPrimarySource() {
    try {
        console.log("[主要数据源] 尝试获取TMDB热门数据包...");
        
        const response = await Widget.http.get("https://raw.githubusercontent.com/quantumultxx/ForwardWidgets/refs/heads/main/data/TMDB_Trending.json", {
            timeout: 8000,
            headers: {
                'Cache-Control': 'no-cache',
                'User-Agent': 'MovieListWidget/2.0'
            }
        });
        
        console.log(`[主要数据源] HTTP响应状态: ${response.status || 'unknown'}`);
        
        if (!response.data) {
            console.log("[主要数据源] 响应数据为空");
            return null;
        }
        
        console.log(`[主要数据源] 响应数据类型: ${typeof response.data}`);
        console.log(`[主要数据源] 响应数据键: ${Object.keys(response.data).join(', ')}`);
        
        if (response.data.today_global && 
Array.isArray(response.data.today_global)) {
            console.log(`[主要数据源] 今日热门数据项数量: 
${response.data.today_global.length}`);
            
            if (response.data.today_global.length > 0) {
                console.log("[主要数据源] 成功获取TMDB热门数据包");
                
                // 验证数据完整性和时效性
                const isValid = validateTrendingData(response.data);
                const isFresh = isDataFresh(response.data);
                
                console.log(`[主要数据源] 数据验证: ${isValid ? '通过' : '失败'}`);
                console.log(`[主要数据源] 数据时效性: ${isFresh ? '新鲜' : '过期'}`);
                
                if (isValid && isFresh) {
                    const enhancedData = await enhanceDataWithTitlePosters(response.data);
                    return enhancedData;
                } else {
                    console.log("[主要数据源] 数据验证失败或数据过期");
                }
            } else {
                console.log("[主要数据源] 数据包有效但内容为空");
            }
        } else {
            console.log("[主要数据源] 数据包不包含有效的热门数据");
        }
        
        // 备用方案：生成简化趋势数据
        console.log("[备用方案] 尝试生成简化趋势数据");
        const simpleData = await generateSimpleTrendingData();
        if (simpleData) {
            const enhancedData = await enhanceDataWithTitlePosters(simpleData);
            return enhancedData;
        }
        
        console.log("[主要数据源] 未能获取数据");
        return null;
    } catch (error) {
        console.error("[主要数据源] 请求失败:", error);
        return null;
    }
}

// 导出到global
global.tmdbDiscoverByNetworkEnhanced = tmdbDiscoverByNetworkEnhanced;
global.CONFIG = CONFIG;
global.performanceMonitor = performanceMonitor; // 导出性能监控器
```
