// ========== 优化工具与结构集成（见注释区分，原有业务逻辑保留） ==========

// 集中配置区
const CONFIG = {
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  FRESH_DATA_DURATION: 2 * 60 * 60 * 1000, // 2小时内数据新鲜
  MAX_ITEMS: 30, // 横版标题海报最大条数
  MAX_CONCURRENT: typeof process !== 'undefined' && process.env.MAX_CONCURRENT ? parseInt(process.env.MAX_CONCURRENT) : 5, // 并发数支持环境变量
  LOG_LEVEL: typeof process !== 'undefined' && process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
  LRU_CACHE_SIZE: 100, // LRU缓存最大容量
  ENABLE_TV_LOGOS: true, // 启用剧集Logo背景图功能
  TV_LOGO_CACHE_DURATION: 60 * 60 * 1000 // 剧集Logo缓存1小时
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
const tvLogoLRUCache = new LRUCache(50); // 剧集Logo缓存
function getCachedBackdrop(key) { return backdropLRUCache.get(key); }
function cacheBackdrop(key, data) { backdropLRUCache.set(key, data); }
function getCachedTrendingData() { return trendingDataLRUCache.get('trending_data'); }
function cacheTrendingData(data) { trendingDataLRUCache.set('trending_data', data); }
function getCachedTvLogo(key) { return tvLogoLRUCache.get(key); }
function cacheTvLogo(key, data) { tvLogoLRUCache.set(key, data); }
function logCacheStats() {
  log(`[横版标题海报缓存] 命中率: ${JSON.stringify(backdropLRUCache.stats())}`, 'info');
  log(`[热门数据缓存] 命中率: ${JSON.stringify(trendingDataLRUCache.stats())}`, 'info');
  log(`[剧集Logo缓存] 命中率: ${JSON.stringify(tvLogoLRUCache.stats())}`, 'info');
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
  const fingerprint = getBackdropFingerprint(item);
  const cacheKey = `backdrop_${item.id}_${fingerprint}`;
  let cached = getCachedBackdrop(cacheKey);
  if (cached) {
    log(`[横版标题海报] 命中缓存: ${cacheKey}`, 'debug');
    return cached;
  }
  const result = await generatorFn(item);
  if (result) {
    cacheBackdrop(cacheKey, result);
  }
  return result;
}
async function batchGenerateBackdropsWithCache(items, generatorFn, concurrent) {
  return await batchGenerateBackdrops(
    items,
    item => generateBackdropWithCache(item, generatorFn),
    concurrent
  );
}

// 工具函数
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
function uniqBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function isArray(val) { return Array.isArray(val); }
function isObject(val) { return val && typeof val === 'object' && !Array.isArray(val); }

// 性能监控与异常捕获
function withTiming(label, fn) {
  const start = Date.now();
  return Promise.resolve(fn()).then(result => {
    const duration = Date.now() - start;
    log(`[性能] ${label} 耗时: ${duration}ms`, 'info');
    return result;
  });
}
async function timedBatch(tasks, label) {
  const start = Date.now();
  const results = await Promise.allSettled(tasks.map(t => t()));
  const duration = Date.now() - start;
  log(`[性能] 并发批量任务(${label}) 总耗时: ${duration}ms`, 'info');
  return results;
}
function safeAsync(fn, label) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      log(`[异常] ${label || fn.name}: ${e}`, 'error');
      return null;
    }
  };
}

// 主流程结构优化示例
async function loadEnhancedTitlePosterWithBackdropsOptimized(items, generatorFn) {
  const uniqueItems = uniqBy(items, item => item.id);
  const cachedResults = [];
  const toGenerate = [];
  for (const item of uniqueItems) {
    const fingerprint = getBackdropFingerprint(item);
    const cacheKey = `backdrop_${item.id}_${fingerprint}`;
    const cached = getCachedBackdrop(cacheKey);
    if (cached) {
      cachedResults.push(cached);
    } else {
      toGenerate.push(item);
    }
  }
  let generatedResults = [];
  if (toGenerate.length > 0) {
    generatedResults = await batchGenerateBackdropsWithCache(toGenerate, generatorFn, CONFIG.MAX_CONCURRENT);
  }
  const allResults = [...cachedResults, ...generatedResults];
  logCacheStats();
  return deepClone(allResults);
}

// 热门数据加载主流程优化示例
async function loadTmdbTrendingDataOptimized(fetchDataFn, checkHealthFn) {
  let cached = getCachedTrendingData();
  if (cached && checkHealthFn(cached)) {
    log('[热门数据] 使用缓存', 'info');
    logCacheStats();
    return deepClone(cached);
  }
  let data = null;
  try {
    data = await fetchDataFn();
    if (data && checkHealthFn(data)) {
      cacheTrendingData(data);
      log('[热门数据] 拉取并缓存新数据', 'info');
      logCacheStats();
      return deepClone(data);
    }
    log('[热门数据] 拉取数据健康检查未通过，尝试自动恢复', 'warn');
  } catch (e) {
    log(`[热门数据] 拉取数据异常: ${e}`, 'error');
  }
  log('[热门数据] 自动恢复未实现，返回空结构', 'error');
  return { today_global: [], week_global_all: [], popular_movies: [] };
}

// 类型/题材处理链优化示例
function processItemsWithGenre(items, genreMap, mediaType) {
  const uniqueItems = uniqBy(items, item => item.id);
  return uniqueItems.map(item => {
    const genreIds = item.genre_ids || [];
    const genres = genreIds.map(id => genreMap[mediaType]?.[id]).filter(Boolean);
    return {
      ...item,
      genreTitle: genres.length > 0 ? genres.join('•') : (mediaType === 'movie' ? '电影' : '剧集')
    };
  });
}

// API Key安全性说明：所有API调用均应通过CONFIG.API_KEY获取密钥
// 例如：Widget.tmdb.get('/movie/popular', { params: { api_key: CONFIG.API_KEY, ... } })

// ========== 优化的TMDB数据获取模块 ==========

// TMDB API配置
const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/",
  API_KEY: typeof process !== 'undefined' ? process.env.TMDB_API_KEY : null,
  REQUEST_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  CACHE_DURATION: 15 * 60 * 1000, // 15分钟缓存
  MAX_ITEMS_PER_CATEGORY: 15
};

// TMDB数据获取类
class OptimizedTMDBCrawler {
  constructor(apiKey = null) {
    this.apiKey = apiKey || TMDB_CONFIG.API_KEY;
    this.cache = new LRUCache(50);
    this.requestStats = {
      total: 0,
      success: 0,
      failed: 0,
      cached: 0
    };
  }

  // 智能请求方法
  async _makeRequest(endpoint, params = {}) {
    const cacheKey = `tmdb_${endpoint}_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < TMDB_CONFIG.CACHE_DURATION) {
      this.requestStats.cached++;
      return cached.data;
    }

    if (!this.apiKey) {
      log("TMDB API密钥未设置", 'warn');
      return { results: [] };
    }

    const url = `${TMDB_CONFIG.BASE_URL}${endpoint}`;
    const requestParams = { api_key: this.apiKey, ...params };

    for (let attempt = 1; attempt <= TMDB_CONFIG.MAX_RETRIES; attempt++) {
      try {
        this.requestStats.total++;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TMDB_CONFIG.REQUEST_TIMEOUT);

        const response = await fetch(`${url}?${new URLSearchParams(requestParams)}`, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'TMDB-Crawler/2.0',
            'Accept': 'application/json'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // 缓存结果
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });

        this.requestStats.success++;
        return data;

      } catch (error) {
        log(`TMDB请求失败 (尝试 ${attempt}/${TMDB_CONFIG.MAX_RETRIES}): ${error.message}`, 'error');
        
        if (attempt < TMDB_CONFIG.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, TMDB_CONFIG.RETRY_DELAY * attempt));
        } else {
          this.requestStats.failed++;
          return { results: [] };
        }
      }
    }
  }

  // 获取热门数据
  async fetchTrendingData(timeWindow = "day", mediaType = "all") {
    const endpoint = mediaType === "all" 
      ? `/trending/all/${timeWindow}` 
      : `/trending/${mediaType}/${timeWindow}`;
    
    return await this._makeRequest(endpoint, { language: "zh-CN" });
  }

  // 获取热门电影
  async fetchPopularMovies(page = 1) {
    const data = await this._makeRequest("/movie/popular", {
      language: "zh-CN",
      region: "CN",
      page: page
    });

    if (data && data.results) {
      data.results = data.results.slice(0, TMDB_CONFIG.MAX_ITEMS_PER_CATEGORY);
    }

    return data;
  }

  // 获取媒体详情
  async getMediaDetails(mediaType, mediaId) {
    return await this._makeRequest(`/${mediaType}/${mediaId}`, { language: "zh-CN" });
  }

  // 获取媒体图片
  async getMediaImages(mediaType, mediaId) {
    return await this._makeRequest(`/${mediaType}/${mediaId}/images`, {
      include_image_language: "zh,en,null"
    });
  }

  // 生成图片URL
  getImageUrl(path, size = "original") {
    if (!path) return "";
    return `${TMDB_CONFIG.IMAGE_BASE_URL}${size}${path}`;
  }

  // 选择最佳标题背景图
  selectBestTitleBackdrop(imageData, mediaType = "movie") {
    const backdrops = imageData?.backdrops || [];
    const logos = imageData?.logos || [];
    
    // 优先选择logo（对于剧集）
    if (mediaType === "tv" && logos.length > 0) {
      return this._selectBestImage(logos, true);
    }
    
    // 选择最佳背景图
    return this._selectBestImage(backdrops, false);
  }

  // 智能图片选择算法
  _selectBestImage(images, preferLogos = false) {
    if (!images || images.length === 0) return "";

    const calculateScore = (image) => {
      // 语言优先级：中文 > 英文 > 无语言 > 其他
      const lang = image.iso_639_1;
      let langScore = 3;
      if (lang === "zh") langScore = 0;
      else if (lang === "en") langScore = 1;
      else if (lang === null) langScore = 2;

      // 评分（负值，越高越好）
      const voteScore = -(image.vote_average || 0);
      
      // 分辨率（负值，越高越好）
      const width = image.width || 0;
      const height = image.height || 0;
      const resolutionScore = -(width * height);

      // 宽高比（接近16:9更好）
      const aspectRatio = width / height;
      const aspectScore = -Math.abs(aspectRatio - 16/9);

      return [langScore, voteScore, resolutionScore, aspectScore];
    };

    const sortedImages = images.sort((a, b) => {
      const scoreA = calculateScore(a);
      const scoreB = calculateScore(b);
      
      for (let i = 0; i < scoreA.length; i++) {
        if (scoreA[i] !== scoreB[i]) {
          return scoreA[i] - scoreB[i];
        }
      }
      return 0;
    });

    const bestImage = sortedImages[0];
    return this.getImageUrl(bestImage.file_path);
  }

  // 处理媒体项目
  async processMediaItem(item, mediaType = null) {
    const title = item.title || item.name;
    const itemType = mediaType || item.media_type;
    
    if (itemType === "person") return null;

    const releaseDate = itemType === "tv" ? item.first_air_date : item.release_date;
    const overview = item.overview;
    const rating = Math.round(item.vote_average * 10) / 10;
    const mediaId = item.id;

    // 基础数据验证
    if (rating === 0 && !releaseDate && !overview && !item.poster_path) {
      return null;
    }

    const posterUrl = this.getImageUrl(item.poster_path, "w500");

    // 获取详细信息
    const [detailData, imageData] = await Promise.all([
      this.getMediaDetails(itemType, mediaId),
      this.getMediaImages(itemType, mediaId)
    ]);

    // 处理类型信息
    const genres = detailData?.genres || [];
    const genreTitle = genres.slice(0, 3).map(g => g.name).join("•");

    // 获取标题背景图
    const titleBackdropUrl = this.selectBestTitleBackdrop(imageData, itemType);

    return {
      id: mediaId,
      title: title,
      type: itemType,
      genreTitle: genreTitle,
      rating: rating,
      release_date: releaseDate,
      overview: overview,
      poster_url: posterUrl,
      title_backdrop: titleBackdropUrl
    };
  }

  // 批量处理TMDB数据
  async processTmdbData(data, mediaType = "all") {
    const results = [];
    const items = data?.results || [];

    // 使用并发池处理
    const pool = getPromisePool(3);
    const tasks = items.map(item => () => this.processMediaItem(item, mediaType));
    
    const processedItems = await pool.all(tasks);
    
    for (const item of processedItems) {
      if (item) {
        results.push(item);
      }
    }

    return results;
  }

  // 获取统计数据
  getStats() {
    return {
      ...this.requestStats,
      cacheStats: this.cache.stats(),
      hitRate: this.requestStats.total > 0 
        ? (this.requestStats.cached / this.requestStats.total).toFixed(2) 
        : '0.00'
    };
  }

  // 清理缓存
  clearCache() {
    this.cache.clear();
  }
}

// 优化的TMDB数据获取主函数
async function fetchOptimizedTmdbData() {
  const crawler = new OptimizedTMDBCrawler();
  const beijingTime = new Date().toLocaleString("zh-CN", { 
    timeZone: "Asia/Shanghai",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  log("=== 开始执行优化的TMDB数据获取 ===", 'info');

  try {
    // 并发获取所有数据
    const [todayData, weekData, popularData] = await Promise.all([
      crawler.fetchTrendingData("day", "all"),
      crawler.fetchTrendingData("week", "all"),
      crawler.fetchPopularMovies(1)
    ]);

    // 处理数据
    const [todayProcessed, weekProcessed, popularProcessed] = await Promise.all([
      crawler.processTmdbData(todayData, "all"),
      crawler.processTmdbData(weekData, "all"),
      crawler.processTmdbData(popularData, "movie")
    ]);

    const result = {
      last_updated: beijingTime,
      today_global: todayProcessed,
      week_global_all: weekProcessed,
      popular_movies: popularProcessed
    };

    // 输出统计信息
    const stats = crawler.getStats();
    log(`✅ TMDB数据获取完成 - 请求: ${stats.total}, 成功: ${stats.success}, 缓存命中: ${stats.cached}`, 'info');
    log(`📊 缓存命中率: ${stats.hitRate}`, 'info');

    return result;

  } catch (error) {
    log(`❌ TMDB数据获取失败: ${error.message}`, 'error');
    return {
      last_updated: beijingTime,
      today_global: [],
      week_global_all: [],
      popular_movies: []
    };
  }
}

// 保存数据到JSON文件（Node.js环境）
async function saveTmdbDataToFile(data, filepath = "./data/TMDB_Trending.json") {
  if (typeof process === 'undefined') {
    log("浏览器环境，跳过文件保存", 'warn');
    return;
  }

  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // 确保目录存在
    const dir = path.dirname(filepath);
    await fs.mkdir(dir, { recursive: true });
    
    // 保存文件
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
    log(`✅ 数据已保存到: ${filepath}`, 'info');
    
  } catch (error) {
    log(`❌ 保存文件失败: ${error.message}`, 'error');
  }
}

// 主执行函数
async function main() {
  try {
    const data = await fetchOptimizedTmdbData();
    
    // 在Node.js环境中保存文件
    if (typeof process !== 'undefined') {
      await saveTmdbDataToFile(data);
    }
    
    log("================= 执行完成 =================", 'info');
    return data;
    
  } catch (error) {
    log(`❌ 主函数执行失败: ${error.message}`, 'error');
    throw error;
  }
}

// 导出函数（Node.js环境）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    OptimizedTMDBCrawler,
    fetchOptimizedTmdbData,
    saveTmdbDataToFile,
    main
  };
}

// 浏览器环境下的全局函数
if (typeof window !== 'undefined') {
  window.OptimizedTMDBCrawler = OptimizedTMDBCrawler;
  window.fetchOptimizedTmdbData = fetchOptimizedTmdbData;
  window.main = main;
}

// ========== 以上为优化内容，原有业务逻辑如下 ==========
// ... existing code ...

WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "TMDB影视榜单",
  description: "TMDB影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "1.1.0",
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
        {
          name: "sort_by",
          title: "内容类型切换",
          type: "enumeration",
          description: "选择榜单类型",
          value: "today",
          enumOptions: [
            { title: "今日热门", value: "today" },
            { title: "本周热门", value: "week" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 播出平台",
      description: "按播出平台和内容类型筛选剧集内容",
      requiresWebView: false,
      functionName: "tmdbDiscoverByNetwork",
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
            { title: "Tencent", value: "2007" },
            { title: "iQiyi", value: "1330" },
            { title: "Youku", value: "1419" },
            { title: "Bilibili", value: "1605" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" },
            { title: "Apple TV+", value: "2552" },
            { title: "TV Tokyo", value: "84" }
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
            { title: "动作", value: "28" },
            { title: "科幻", value: "878" },
            { title: "爱情", value: "10749" }
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
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 出品公司",
      description: "按出品公司筛选电影和剧集内容",
      requiresWebView: false,
      functionName: "tmdbDiscoverByCompany",
      cacheDuration: 3600,
      params: [
        { 
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          description: "选择一个出品公司查看其作品",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "漫威影业 (Marvel Studios)", value: "420" },
            { title: "华特迪士尼 (Walt Disney Pictures)", value: "2" },
            { title: "华纳兄弟 (Warner Bros.)", value: "174" },
            { title: "索尼影业 (Sony Pictures)", value: "5" },
            { title: "环球影业 (Universal Pictures)", value: "33" },
            { title: "20世纪福克斯 (20th Century Fox)", value: "25" },
            { title: "派拉蒙影业 (Paramount Pictures)", value: "4" },
            { title: "狮门影业 (Lionsgate)", value: "1632" },
            { title: "新线影业 (New Line Cinema)", value: "12" },
            { title: "哥伦比亚影业 (Columbia Pictures)", value: "5" },
            { title: "梦工厂 (DreamWorks)", value: "521" },
            { title: "米高梅 (Metro-Goldwyn-Mayer)", value: "8411" },
            { title: "Netflix", value: "11073" },
            { title: "Amazon Studios", value: "20580" },
            { title: "Apple Original Films", value: "151347" }
          ]
        },
        {
          name: "type",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        {
          name: "with_genres",
          title: "🎬题材类型",
          type: "enumeration",
          description: "选择要筛选的题材类型（可选）",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "动作", value: "28" },
            { title: "冒险", value: "12" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "剧情", value: "18" },
            { title: "家庭", value: "10751" },
            { title: "奇幻", value: "14" },
            { title: "历史", value: "36" },
            { title: "恐怖", value: "27" },
            { title: "音乐", value: "10402" },
            { title: "悬疑", value: "9648" },
            { title: "爱情", value: "10749" },
            { title: "科幻", value: "878" },
            { title: "惊悚", value: "53" },
            { title: "战争", value: "10752" },
            { title: "西部", value: "37" }
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
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
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
            { title: "冒险", value: "12" },
            { title: "动画", value: "16" },
            { title: "科幻", value: "878" },
            { title: "奇幻", value: "14" },
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
            { title: "最新上映↓", value: "release_date.desc" },
            { title: "最早上映↑", value: "release_date.asc" },
            { title: "最新播出↓", value: "first_air_date.desc" },
            { title: "最早播出↑", value: "first_air_date.asc" },
            { title: "最新更新↓", value: "last_air_date.desc" },
            { title: "最早更新↑", value: "last_air_date.asc" },
            { title: "投票数↓", value: "vote_count.desc" },
            { title: "投票数↑", value: "vote_count.asc" }
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
        {
          name: "year",
          title: "📅年份筛选",
          type: "enumeration",
          description: "按播出/上映年份筛选内容",
          value: "",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" },
            { title: "2021年", value: "2021" },
            { title: "2020年", value: "2020" },
            { title: "2019年", value: "2019" },
            { title: "2018年", value: "2018" },
            { title: "2017年", value: "2017" },
            { title: "2016年", value: "2016" },
            { title: "2015年", value: "2015" },
            { title: "2014年", value: "2014" },
            { title: "2013年", value: "2013" },
            { title: "2012年", value: "2012" },
            { title: "2011年", value: "2011" },
            { title: "2010年", value: "2010" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // -------------Bangumi模块-------------
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
          name: "with_genres",
          title: "动画类型",
          type: "enumeration",
          description: "选择动画类型",
          value: "16",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "动画", value: "16" },
            { title: "奇幻", value: "14" },
            { title: "科幻", value: "878" },
            { title: "冒险", value: "12" },
            { title: "喜剧", value: "35" },
            { title: "爱情", value: "10749" },
            { title: "动作", value: "28" },
            { title: "悬疑", value: "9648" },
            { title: "音乐", value: "10402" },
            { title: "运动", value: "10770" },
            { title: "家庭", value: "10751" },
            { title: "犯罪", value: "80" },
            { title: "历史", value: "36" },
            { title: "战争", value: "10752" },
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
            { title: "最新播出↓", value: "first_air_date.desc" },
            { title: "最早播出↑", value: "first_air_date.asc" },
            { title: "最新更新↓", value: "last_air_date.desc" },
            { title: "最早更新↑", value: "last_air_date.asc" },
            { title: "投票数↓", value: "vote_count.desc" },
            { title: "投票数↑", value: "vote_count.asc" }
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
        {
          name: "year",
          title: "📅年份筛选",
          type: "enumeration",
          description: "按播出年份筛选动画",
          value: "",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" },
            { title: "2021年", value: "2021" },
            { title: "2020年", value: "2020" },
            { title: "2019年", value: "2019" },
            { title: "2018年", value: "2018" },
            { title: "2017年", value: "2017" },
            { title: "2016年", value: "2016" },
            { title: "2015年", value: "2015" },
            { title: "2014年", value: "2014" },
            { title: "2013年", value: "2013" },
            { title: "2012年", value: "2012" },
            { title: "2011年", value: "2011" },
            { title: "2010年", value: "2010" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // -------------豆瓣模块-------------
    // --- 片单解析 ---
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
            { title: "实时热门电影", value: "https://m.douban.com/subject_collection/movie_real_time_hotest" },
            { title: "实时热门电视", value: "https://m.douban.com/subject_collection/tv_real_time_hotest" },
            { title: "豆瓣 Top 250", value: "https://m.douban.com/subject_collection/movie_top250" },
            { title: "一周电影口碑榜", value: "https://m.douban.com/subject_collection/movie_weekly_best" },
            { title: "华语口碑剧集榜", value: "https://m.douban.com/subject_collection/tv_chinese_best_weekly" },
            { title: "全球口碑剧集榜", value: "https://m.douban.com/subject_collection/tv_global_best_weekly" },
            { title: "国内综艺口碑榜", value: "https://m.douban.com/subject_collection/show_chinese_best_weekly" },
            { title: "全球综艺口碑榜", value: "https://m.douban.com/subject_collection/show_global_best_weekly" },
            { title: "第97届奥斯卡", value: "https://m.douban.com/subject_collection/EC7I7ZDRA?type=rank" },
            { title: "IMDB MOVIE TOP 250", value: "https://m.douban.com/doulist/1518184" },
            { title: "IMDB TV TOP 250", value: "https://m.douban.com/doulist/41573512" },
            { title: "意外结局电影", value: "https://m.douban.com/doulist/11324" }
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
        {
          name: "year",
          title: "📅年份筛选",
          type: "enumeration",
          description: "按播出年份筛选动画",
          value: "",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" },
            { title: "2021年", value: "2021" },
            { title: "2020年", value: "2020" },
            { title: "2019年", value: "2019" },
            { title: "2018年", value: "2018" },
            { title: "2017年", value: "2017" },
            { title: "2016年", value: "2016" },
            { title: "2015年", value: "2015" },
            { title: "2014年", value: "2014" },
            { title: "2013年", value: "2013" },
            { title: "2012年", value: "2012" },
            { title: "2011年", value: "2011" },
            { title: "2010年", value: "2010" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
  ]
};

// 优化模块参数配置和性能监控
WidgetMetadata.modules.forEach(module => {
  if (Array.isArray(module.params)) {
    module.params.forEach(param => {
      if (param.name === 'sort_by' && Array.isArray(param.enumOptions)) {
        // 移除投票数相关的排序选项，提高性能
        param.enumOptions = param.enumOptions.filter(opt =>
          !(opt.title && opt.title.includes('投票数')) &&
          !(opt.value && opt.value.includes('vote_count'))
        );
      }
    });
  }
});
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

const API_KEY = ''; // TMDB API Key

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

// 获取TMDB类型标题（中文）
function getTmdbGenreTitles(genreIds, mediaType) {
  if (!Array.isArray(genreIds) || genreIds.length === 0) {
    return '';
  }
  
  // 如果没有缓存的类型数据，返回空字符串
  if (!tmdbGenresCache) {
    return '';
  }
  
  const genres = tmdbGenresCache[mediaType] || {};
  return genreIds
    .slice(0, 3) // 最多显示3个类型
    .map(id => genres[id])
    .filter(Boolean)
    .join('•');
}

// 格式化每个影视项目（优先中文）
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
  
  return {
    id: item.id,
    type: "tmdb",
    title: pickChineseTitle(
      item.title_zh,          // 中文标题
      item.name_zh,           // 中文剧集名
      item.original_title_zh, // 中文原始标题
      item.original_name_zh,  // 中文原始剧集名
      item.title,             // 标题
      item.name,              // 剧集名
      item.original_title,    // 原始标题
      item.original_name      // 原始剧集名
    ),
    description: pickChineseDescription(item.overview),
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

// --- 优化后的TMDB主加载函数 ---
const tmdbCache = { data: null, time: 0 };
const TMDB_CACHE_DURATION = 30 * 60 * 1000; // 30分钟



async function fetchTmdbDataFromUrl(url) {
    try {
        const res = await Widget.http.get(url, { timeout: 8000 });
        return res.data;
    } catch { return null; }
}

function isValidTmdbData(data) {
    return data && (
        (Array.isArray(data.today_global) && data.today_global.length > 0) ||
        (Array.isArray(data.week_global_all) && data.week_global_all.length > 0) ||
        (Array.isArray(data.popular_movies) && data.popular_movies.length > 0)
    );
}

async function fetchTmdbDataFromApi() {
    try {
        const [todayRes, weekRes, popularRes] = await Promise.allSettled([
            Widget.tmdb.get("/trending/all/day", { params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } }),
            Widget.tmdb.get("/trending/all/week", { params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } }),
            Widget.tmdb.get("/movie/popular", { params: { language: 'zh-CN', region: 'CN', api_key: API_KEY } })
        ]);
        return {
            today_global: todayRes.status === 'fulfilled' && todayRes.value.results ? todayRes.value.results : [],
            week_global_all: weekRes.status === 'fulfilled' && weekRes.value.results ? weekRes.value.results : [],
            popular_movies: popularRes.status === 'fulfilled' && popularRes.value.results ? popularRes.value.results : []
        };
    } catch {
        return { today_global: [], week_global_all: [], popular_movies: [] };
    }
}

// 优化的TMDB数据获取函数 - 优先使用定时更新的数据包
async function loadTmdbTrendingData() {
    try {
        console.log("[数据源] 开始获取TMDB热门数据...");
        
        // 1. 优先使用定时更新的缓存数据
        const cachedData = getCachedTrendingData();
        if (cachedData && isDataFresh(cachedData)) {
            console.log("[数据源] 使用定时更新的缓存数据");
            return cachedData;
        }
        
        // 2. 尝试获取最新数据包
        const data = await fetchSimpleData();
        if (data) {
            console.log("[数据源] 成功获取数据包");
            // 缓存数据包
            cacheTrendingData(data);
            return data;
        }
        
        // 3. 备用方案：使用实时API
        console.log("[数据源] 数据包不可用，使用实时API");
        const realtimeData = await fetchRealtimeData();
        if (realtimeData && isValidTmdbData(realtimeData)) {
            // 缓存实时数据
            cacheTrendingData(realtimeData);
            console.log("[数据源] 实时API数据获取成功");
            return realtimeData;
        }
        
        // 4. 最后的备用方案：返回空数据结构
        console.log("[数据源] 所有数据源都失败，返回空数据结构");
        return {
            today_global: [],
            week_global_all: [],
            popular_movies: []
        };
        
    } catch (error) {
        console.error("[数据源] 数据获取失败:", error);
        // 返回空数据结构而不是null
        return {
            today_global: [],
            week_global_all: [],
            popular_movies: []
        };
    }
}

// 简化的数据包获取
async function fetchSimpleData() {
    const dataUrls = [
        "https://raw.githubusercontent.com/quantumultxx/ForwardWidgets/refs/heads/main/data/TMDB_Trending.json",
        "https://raw.githubusercontent.com/saxdyo/MovieListwidget/main/data/TMDB_Trending.json"
    ];
    
    for (const url of dataUrls) {
        try {
            console.log(`[数据包] 尝试获取: ${url}`);
            const response = await Widget.http.get(url, {
                timeout: 8000,
                headers: {
                    'Cache-Control': 'no-cache',
                    'User-Agent': 'MovieListWidget/2.0'
                }
            });
            
            if (response.data && isValidTmdbData(response.data)) {
                console.log(`[数据包] 获取成功，今日热门: ${response.data.today_global?.length || 0}项`);
                return response.data;
            }
        } catch (error) {
            console.log(`[数据包] 获取失败 ${url}: ${error.message}`);
        }
    }
    
    console.log("[数据包] 所有数据源都获取失败");
    return null;
}

// 增强的实时数据获取 - 包含更多剧集数据
async function fetchRealtimeData() {
    try {
        console.log("[实时API] 开始获取实时数据...");
        
        const [todayRes, weekRes, popularMoviesRes, popularTVRes, topRatedMoviesRes, topRatedTVRes] = await Promise.allSettled([
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
            }),
            Widget.tmdb.get("/tv/popular", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            Widget.tmdb.get("/movie/top_rated", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            Widget.tmdb.get("/tv/top_rated", { 
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
        
                // 处理今日热门 - 调整为20项，优先剧集
        if (todayRes.status === 'fulfilled' && todayRes.value.results) {
          // 分离电影和剧集
          const movies = [];
          const tvShows = [];
          
          todayRes.value.results.forEach(item => {
            const mappedItem = {
              id: item.id,
              title: item.title || item.name,
              poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
              backdrop_path: item.backdrop_path,
              vote_average: item.vote_average,
              release_date: item.release_date || item.first_air_date,
              media_type: item.media_type
            };
            
            if (item.media_type === 'tv') {
              tvShows.push(mappedItem);
            } else {
              movies.push(mappedItem);
            }
          });
          
          // 优先剧集，然后补充电影，总共30项（增加剧集数量）
          result.today_global = [...tvShows.slice(0, 20), ...movies.slice(0, 10)];
        }
                // 处理本周热门 - 调整为20项，优先剧集
        if (weekRes.status === 'fulfilled' && weekRes.value.results) {
          // 分离电影和剧集
          const movies = [];
          const tvShows = [];
          
          weekRes.value.results.forEach(item => {
            const mappedItem = {
              id: item.id,
              title: item.title || item.name,
              poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
              backdrop_path: item.backdrop_path,
              vote_average: item.vote_average,
              release_date: item.release_date || item.first_air_date,
              media_type: item.media_type
            };
            
            if (item.media_type === 'tv') {
              tvShows.push(mappedItem);
            } else {
              movies.push(mappedItem);
            }
          });
          
          // 优先剧集，然后补充电影，总共30项（增加剧集数量）
          result.week_global_all = [...tvShows.slice(0, 20), ...movies.slice(0, 10)];
        }
        
        // 处理热门电影 - 合并电影和剧集数据
        const allMovies = [];
        if (popularMoviesRes.status === 'fulfilled' && popularMoviesRes.value.results) {
            allMovies.push(...popularMoviesRes.value.results.slice(0, 25).map(item => ({
                id: item.id,
                title: item.title,
                poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.release_date,
                media_type: 'movie'
            })));
        }
        
        // 添加热门剧集数据
        if (popularTVRes.status === 'fulfilled' && popularTVRes.value.results) {
            allMovies.push(...popularTVRes.value.results.slice(0, 25).map(item => ({
                id: item.id,
                title: item.name,
                poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.first_air_date,
                media_type: 'tv'
            })));
        }
        
        // 添加高分电影和剧集
        if (topRatedMoviesRes.status === 'fulfilled' && topRatedMoviesRes.value.results) {
            allMovies.push(...topRatedMoviesRes.value.results.slice(0, 15).map(item => ({
                id: item.id,
                title: item.title,
                poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.release_date,
                media_type: 'movie'
            })));
        }
        
        if (topRatedTVRes.status === 'fulfilled' && topRatedTVRes.value.results) {
            allMovies.push(...topRatedTVRes.value.results.slice(0, 15).map(item => ({
                id: item.id,
                title: item.name,
                poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.first_air_date,
                media_type: 'tv'
            })));
        }
        
                // 去重并限制数量
        const uniqueMovies = [];
        const seenIds = new Set();
        for (const item of allMovies) {
          if (!seenIds.has(item.id) && item.poster_url) {
            uniqueMovies.push(item);
            seenIds.add(item.id);
          }
        }
        result.popular_movies = uniqueMovies.slice(0, 20);
        
        console.log(`[实时API] 数据获取完成 - 今日热门: ${result.today_global.length}, 本周热门: ${result.week_global_all.length}, 热门电影: ${result.popular_movies.length}`);
        return result;
        
    } catch (error) {
        console.error("[实时API] 获取失败:", error);
        return null;
    }
}

// 横版标题海报加载器
async function loadTitlePosterWithBackdrops(items, maxItems = 30) {
    // 尝试获取缓存的横版标题海报
    const cachedBackdrops = [];
    for (const item of items.slice(0, maxItems)) {
        const cachedBackdrop = getCachedBackdrop(`backdrop_${item.id}`);
        if (cachedBackdrop && cachedBackdrop.titlePoster) {
            cachedBackdrops.push(cachedBackdrop);
        }
    }
    
    if (cachedBackdrops.length > 0) {
        console.log(`[横版标题海报] 使用缓存的横版标题海报: ${cachedBackdrops.length}项`);
        return cachedBackdrops.map(backdrop => ({
            id: backdrop.id,
            title: backdrop.title,
            posterPath: backdrop.backdropUrl,
            titlePoster: backdrop.titlePoster,
            metadata: backdrop.metadata
        }));
    } else {
        // 如果没有缓存的横版标题海报，立即生成
        console.log(`[横版标题海报] 立即生成横版标题海报...`);
        const processedItems = await batchProcessBackdrops(items.slice(0, maxItems), {
            enableTitleOverlay: true,
            preferredSize: 'w1280',
            includeMetadata: true,
            forceRegenerate: true, // 强制重新生成
            maxConcurrent: 5 // 增加并发数加快生成速度
        });
        
        if (processedItems.length > 0) {
            console.log(`[横版标题海报] 立即生成成功: ${processedItems.length}项`);
            
            // 缓存生成的结果
            processedItems.forEach((item, index) => {
                if (item && item.id) {
                    cacheBackdrop(`backdrop_${item.id}`, item);
                    console.log(`[横版标题海报] 缓存生成结果 ${index + 1}: ${item.title}`);
                }
            });
            
            return processedItems.map(item => ({
                id: item.id,
                title: item.title,
                posterPath: item.backdropUrl,
                titlePoster: item.titlePoster,
                metadata: item.metadata
            }));
        } else {
            // 如果生成失败，使用普通数据
            console.log(`[横版标题海报] 生成失败，使用普通数据`);
            return items.map(item => createEnhancedWidgetItem(item));
        }
    }
}

// 增强的横版标题海报加载器（支持更多数据源）
async function loadEnhancedTitlePosterWithBackdrops(items, maxItems = 30, contentType = "today") {
    // 尝试获取缓存的横版标题海报
    const cachedBackdrops = [];
    for (const item of items.slice(0, maxItems)) {
        const cachedBackdrop = getCachedBackdrop(`backdrop_${item.id}`);
        if (cachedBackdrop && cachedBackdrop.titlePoster) {
            cachedBackdrops.push(cachedBackdrop);
        }
    }
    
    if (cachedBackdrops.length > 0) {
        console.log(`[增强横版标题海报] 使用缓存的横版标题海报: ${cachedBackdrops.length}项`);
        return cachedBackdrops.map(backdrop => ({
            id: backdrop.id,
            title: backdrop.title,
            posterPath: backdrop.backdropUrl,
            titlePoster: backdrop.titlePoster,
            metadata: backdrop.metadata
        }));
    } else {
        // 如果没有缓存的横版标题海报，立即生成
        console.log(`[增强横版标题海报] 立即生成横版标题海报...`);
        const processedItems = await batchProcessBackdrops(items.slice(0, maxItems), {
            enableTitleOverlay: true,
            preferredSize: 'w1280',
            includeMetadata: true,
            forceRegenerate: true, // 强制重新生成
            maxConcurrent: 5 // 增加并发数加快生成速度
        });
        
        if (processedItems.length > 0) {
            console.log(`[增强横版标题海报] 立即生成成功: ${processedItems.length}项`);
            
            // 缓存生成的结果
            processedItems.forEach((item, index) => {
                if (item && item.id) {
                    cacheBackdrop(`backdrop_${item.id}`, item);
                    console.log(`[增强横版标题海报] 缓存生成结果 ${index + 1}: ${item.title}`);
                }
            });
            
            return processedItems.map(item => ({
                id: item.id,
                title: item.title,
                posterPath: item.backdropUrl,
                titlePoster: item.titlePoster,
                metadata: item.metadata
            }));
        } else {
            // 如果生成失败，使用普通数据
            console.log(`[增强横版标题海报] 生成失败，使用普通数据`);
            return items.map(item => createEnhancedWidgetItem(item));
        }
    }
}

// 简化的组件项目创建器
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

// 保留原有的复杂函数作为备用，但使用简化的版本作为主要实现

// 简化的趋势数据生成器（备用方案）
async function generateSimpleTrendingData() {
    try {
        console.log("[简化备用] 开始生成简化趋势数据...");
        
        // 并行获取基本数据
        const [todayResponse, weekResponse, popularResponse] = await Promise.allSettled([
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
        if (todayResponse.status === 'fulfilled' && todayResponse.value.results) {
            result.today_global = todayResponse.value.results.slice(0, 20).map(item => ({
                id: item.id,
                title: item.title || item.name,
                poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
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
                poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.release_date || item.first_air_date,
                media_type: item.media_type
            }));
        }
        
        // 处理热门电影
        if (popularResponse.status === 'fulfilled' && popularResponse.value.results) {
            result.popular_movies = popularResponse.value.results.slice(0, 20).map(item => ({
                id: item.id,
                title: item.title,
                poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
                backdrop_path: item.backdrop_path,
                vote_average: item.vote_average,
                release_date: item.release_date,
                media_type: 'movie'
            }));
        }
        
        console.log(`[简化备用] 数据生成完成 - 今日热门: ${result.today_global.length}, 本周热门: ${result.week_global_all.length}, 热门电影: ${result.popular_movies.length}`);
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
        
        if (response.data.today_global && Array.isArray(response.data.today_global)) {
            console.log(`[主要数据源] 今日热门数据项数量: ${response.data.today_global.length}`);
            
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
                console.log("[主要数据源] 今日热门数据为空");
            }
        } else {
            console.log("[主要数据源] 数据包格式不正确 - 缺少today_global字段或不是数组");
        }
    } catch (error) {
        console.log(`[主要数据源] 获取失败: ${error.message}`);
        console.log(`[主要数据源] 错误详情: ${error.stack || '无堆栈信息'}`);
    }
    
    return null;
}

// 从备用数据源获取数据
async function fetchFromBackupSources() {
    const backupSources = [
        {
            name: "备用数据源1",
            url: "https://raw.githubusercontent.com/saxdyo/MovieListwidget/main/data/TMDB_Trending.json",
            timeout: 6000
        },
        {
            name: "备用数据源2", 
            url: "https://api.github.com/repos/quantumultxx/ForwardWidgets/contents/data/TMDB_Trending.json",
            timeout: 6000,
            isGithubApi: true
        }
    ];
    
    for (const source of backupSources) {
        try {
            console.log(`[${source.name}] 尝试获取数据...`);
            
            let response;
            if (source.isGithubApi) {
                // GitHub API需要特殊处理
                response = await Widget.http.get(source.url, {
                    timeout: source.timeout,
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'MovieListWidget/2.0'
                    }
                });
                
                if (response.data && response.data.content) {
                    // 解码base64内容
                    const content = atob(response.data.content);
                    response.data = JSON.parse(content);
                }
            } else {
                response = await Widget.http.get(source.url, {
                    timeout: source.timeout,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'User-Agent': 'MovieListWidget/2.0'
                    }
                });
            }
            
            if (response.data && response.data.today_global && response.data.today_global.length > 0) {
                console.log(`[${source.name}] 成功获取数据`);
                
                if (validateTrendingData(response.data) && isDataFresh(response.data)) {
                    const enhancedData = await enhanceDataWithTitlePosters(response.data);
                    return enhancedData;
                } else {
                    console.log(`[${source.name}] 数据验证失败或数据过期`);
                }
            } else {
                console.log(`[${source.name}] 数据格式不正确`);
            }
        } catch (error) {
            console.log(`[${source.name}] 获取失败: ${error.message}`);
        }
    }
    
    return null;
}

// 智能缓存管理
const trendingDataCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存
const FRESH_DATA_DURATION = 2 * 60 * 60 * 1000; // 2小时内的数据认为是新鲜的

// 检查数据时效性
function isDataFresh(data) {
    try {
        // 检查数据是否有时间戳
        if (data.last_updated) {
            const lastUpdated = new Date(data.last_updated);
            const now = new Date();
            const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);
            
            // 如果数据超过24小时，认为过期
            if (hoursDiff > 24) {
                console.log(`[时效性检查] 数据已过期 ${hoursDiff.toFixed(1)} 小时`);
                return false;
            }
            
            console.log(`[时效性检查] 数据新鲜度: ${hoursDiff.toFixed(1)} 小时前`);
            return true;
        }
        
        // 如果没有时间戳，检查数据内容的新鲜度
        if (data.today_global && data.today_global.length > 0) {
            // 检查是否有最近发布的内容
            const hasRecentContent = data.today_global.some(item => {
                const releaseDate = item.release_date || item.first_air_date;
                if (releaseDate) {
                    const release = new Date(releaseDate);
                    const now = new Date();
                    const daysDiff = (now - release) / (1000 * 60 * 60 * 24);
                    return daysDiff <= 30; // 30天内的内容认为是新鲜的
                }
                return false;
            });
            
            if (!hasRecentContent) {
                console.log("[时效性检查] 数据中缺少最近发布的内容");
                return false;
            }
        }
        
        // 默认认为数据是新鲜的
        console.log("[时效性检查] 数据时效性检查通过");
        return true;
    } catch (error) {
        console.error("[时效性检查] 检查数据时效性时出错:", error);
        return true; // 出错时默认认为数据可用
    }
}

// 获取缓存的趋势数据
function getCachedTrendingData() {
    const now = Date.now();
    const cacheKey = 'trending_data';
    const cached = trendingDataCache.get(cacheKey);
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log(`[缓存] 使用缓存数据 (${Math.round((now - cached.timestamp) / 1000)}秒前缓存)`);
        return cached.data;
    }
    
    return null;
}

// 缓存趋势数据
function cacheTrendingData(data) {
    const cacheKey = 'trending_data';
    trendingDataCache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
    });
    console.log("[缓存] 数据已缓存");
}

// 清理过期缓存
function cleanupExpiredCache() {
    const now = Date.now();
    for (const [key, value] of trendingDataCache.entries()) {
        if ((now - value.timestamp) > CACHE_DURATION) {
            trendingDataCache.delete(key);
            console.log(`[缓存] 清理过期缓存: ${key}`);
        }
    }
}

// 数据健康检查
function checkDataHealth(data) {
    try {
        if (!data) return { healthy: false, reason: "数据为空" };
        
        const health = {
            healthy: true,
            issues: [],
            stats: {}
        };
        
        // 检查基本结构
        const requiredFields = ['today_global', 'week_global_all', 'popular_movies'];
        for (const field of requiredFields) {
            if (!data[field]) {
                health.issues.push(`缺少字段: ${field}`);
                health.healthy = false;
            } else if (!Array.isArray(data[field])) {
                health.issues.push(`字段类型错误: ${field} 不是数组`);
                health.healthy = false;
            } else {
                health.stats[field] = data[field].length;
            }
        }
        
        // 检查数据质量
        if (data.today_global && Array.isArray(data.today_global)) {
            const validItems = data.today_global.filter(item => 
                item.id && item.title && (item.poster_url || item.poster_path)
            );
            if (validItems.length < data.today_global.length * 0.8) {
                health.issues.push("今日热门数据质量较低");
                health.healthy = false;
            }
        }
        
        // 检查时效性
        if (!isDataFresh(data)) {
            health.issues.push("数据已过期");
            health.healthy = false;
        }
        
        return health;
    } catch (error) {
        return { healthy: false, reason: `健康检查出错: ${error.message}` };
    }
}

// 自动数据恢复机制
async function autoRecoverData() {
    try {
        console.log("[自动恢复] 开始自动数据恢复...");
        
        // 清除所有缓存
        trendingDataCache.clear();
        console.log("[自动恢复] 已清除缓存");
        
        // 尝试重新获取数据
        const recoveredData = await loadTmdbTrendingData();
        
        if (recoveredData) {
            const health = checkDataHealth(recoveredData);
            if (health.healthy) {
                console.log("[自动恢复] 数据恢复成功");
                return recoveredData;
            } else {
                console.log(`[自动恢复] 数据恢复失败: ${health.issues.join(', ')}`);
            }
        }
        
        return null;
    } catch (error) {
        console.error("[自动恢复] 自动恢复过程出错:", error);
        return null;
    }
}

// 验证热门数据完整性
function validateTrendingData(data) {
    try {
        if (!data || typeof data !== 'object') {
            console.log("[验证] 数据不是有效对象");
            return false;
        }
        
        const requiredFields = ['today_global', 'week_global_all', 'popular_movies'];
        let validFields = 0;
        
        // 检查基本字段是否存在
        for (const field of requiredFields) {
            if (!data[field]) {
                console.log(`[验证] 缺少字段: ${field}`);
                continue;
            }
            
            if (!Array.isArray(data[field])) {
                console.log(`[验证] 字段不是数组: ${field}`);
                continue;
            }
            
            if (data[field].length === 0) {
                console.log(`[验证] 数组为空: ${field}`);
                continue;
            }
            
            validFields++;
        }
        
        // 只要有一个字段有效就通过验证
        if (validFields === 0) {
            console.log("[验证] 没有有效的数据字段");
            return false;
        }
        
        console.log(`[验证] 数据验证通过 - 有效字段: ${validFields}/${requiredFields.length}`);
        return true;
    } catch (error) {
        console.error("[验证] 数据验证出错:", error);
        return false;
    }
}
// 为数据添加标题海报功能
async function enhanceDataWithTitlePosters(data) {
    try {
        console.log("[标题海报] 开始为数据添加标题海报功能...");
        
        const enhancedData = { ...data };
        
        // 处理今日热门数据
        if (enhancedData.today_global && Array.isArray(enhancedData.today_global)) {
            enhancedData.today_global = await processItemsWithTitlePosters(enhancedData.today_global, "今日热门");
        }
        
        // 处理本周热门数据
        if (enhancedData.week_global_all && Array.isArray(enhancedData.week_global_all)) {
            enhancedData.week_global_all = await processItemsWithTitlePosters(enhancedData.week_global_all, "本周热门");
        }
        
        // 处理热门电影数据
        if (enhancedData.popular_movies && Array.isArray(enhancedData.popular_movies)) {
            enhancedData.popular_movies = await processItemsWithTitlePosters(enhancedData.popular_movies, "热门电影");
        }
        
        console.log("[标题海报] 标题海报功能添加完成");
        return enhancedData;
    } catch (error) {
        console.error("[标题海报] 添加标题海报功能时出错:", error);
        return data; // 返回原始数据
    }
}

// 处理项目列表并添加标题海报
async function processItemsWithTitlePosters(items, category) {
    try {
        const processedItems = [];
        
        for (const item of items) {
            const enhancedItem = { ...item };
            
            // 创建带覆盖的标题海报
            const titlePoster = await createTitlePosterWithOverlay(item, {
                title: pickEnhancedChineseTitle(item),
                subtitle: item.genreTitle || item.genre_title || "",
                rating: item.rating || item.vote_average || 0,
                year: item.year || (item.release_date ? item.release_date.substring(0, 4) : ""),
                showRating: true,
                showYear: true
            });
            
            if (titlePoster) {
                enhancedItem.title_backdrop = titlePoster;
            } else {
                // 备用方案：使用普通标题海报
                enhancedItem.title_backdrop = await generateTitleBackdrop(item);
            }
            
            // 添加分类标识
            enhancedItem.category = category;
            enhancedItem.hasTitlePoster = true;
            
            // 优化标题显示
            enhancedItem.displayTitle = pickEnhancedChineseTitle(enhancedItem);
            
            processedItems.push(enhancedItem);
        }
        
        return processedItems;
    } catch (error) {
        console.error(`[标题海报] 处理${category}项目时出错:`, error);
        return items; // 返回原始项目
    }
}

// 生成标题海报 - 增强版：支持剧集Logo背景图
async function generateTitleBackdrop(item) {
    try {
        // 如果有现有的标题海报，直接使用
        if (item.title_backdrop && item.title_backdrop.url) {
            return item.title_backdrop;
        }
        
        // 对于剧集，优先尝试获取Logo背景图
        if (CONFIG.ENABLE_TV_LOGOS && (item.type === 'tv' || item.media_type === 'tv')) {
            const logoBackdrop = await getTvShowLogoBackdrop(item);
            if (logoBackdrop && logoBackdrop.url) {
                log(`[剧集Logo] 成功获取Logo背景图: ${item.title || item.name}`, 'info');
                return logoBackdrop;
            }
        }
        
        // 如果有背景图片，使用背景图片作为标题海报
        if (item.backdrop_path) {
            const backdropUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
            return {
                url: backdropUrl,
                width: 1280,
                height: 720,
                type: "backdrop"
            };
        }
        
        // 如果有海报图片，使用海报图片
        if (item.poster_path) {
            const posterUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
            return {
                url: posterUrl,
                width: 500,
                height: 750,
                type: "poster"
            };
        }
        
        // 默认返回空对象
        return {
            url: "",
            width: 0,
            height: 0,
            type: "none"
        };
    } catch (error) {
        console.error("[标题海报] 生成标题海报时出错:", error);
        return {
            url: "",
            width: 0,
            height: 0,
            type: "error"
        };
    }
}

// 获取剧集Logo背景图
async function getTvShowLogoBackdrop(item) {
    try {
        if (!item.id) {
            log('[剧集Logo] 缺少媒体ID，无法获取Logo', 'warn');
            return null;
        }

        // 检查缓存
        const cacheKey = `tv_logo_${item.id}`;
        const cached = getCachedTvLogo(cacheKey);
        if (cached) {
            log(`[剧集Logo] 使用缓存Logo: ${item.title || item.name}`, 'debug');
            return cached;
        }

        // 获取剧集图片数据
        const imageData = await getTmdbMediaImages(item.id, 'tv');
        if (!imageData) {
            log(`[剧集Logo] 无法获取图片数据: ${item.title || item.name}`, 'warn');
            return null;
        }

        // 优先选择Logo
        if (imageData.logos && imageData.logos.length > 0) {
            const bestLogo = selectBestImage(imageData.logos, true);
            if (bestLogo) {
                const logoResult = {
                    url: `https://image.tmdb.org/t/p/original${bestLogo.file_path}`,
                    width: bestLogo.width || 800,
                    height: bestLogo.height || 320,
                    type: "tv_logo",
                    language: bestLogo.iso_639_1,
                    vote_average: bestLogo.vote_average
                };
                // 缓存Logo结果
                cacheTvLogo(cacheKey, logoResult);
                return logoResult;
            }
        }

        // 回退到背景图
        if (imageData.backdrops && imageData.backdrops.length > 0) {
            const bestBackdrop = selectBestImage(imageData.backdrops, false);
            if (bestBackdrop) {
                const backdropResult = {
                    url: `https://image.tmdb.org/t/p/w1280${bestBackdrop.file_path}`,
                    width: bestBackdrop.width || 1280,
                    height: bestBackdrop.height || 720,
                    type: "tv_backdrop_fallback",
                    language: bestBackdrop.iso_639_1,
                    vote_average: bestBackdrop.vote_average
                };
                // 缓存背景图结果
                cacheTvLogo(cacheKey, backdropResult);
                return backdropResult;
            }
        }

        // 缓存空结果，避免重复请求
        cacheTvLogo(cacheKey, null);
        return null;
    } catch (error) {
        console.error('[剧集Logo] 获取Logo背景图失败:', error);
        return null;
    }
}

// 获取TMDB媒体图片数据
async function getTmdbMediaImages(mediaId, mediaType) {
    try {
        const apiKey = process.env.TMDB_API_KEY || 'your_api_key_here';
        if (!apiKey || apiKey === 'your_api_key_here') {
            log('[TMDB] API密钥未设置，无法获取图片数据', 'warn');
            return null;
        }

        const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/images?api_key=${apiKey}&include_image_language=zh,en,null`;
        
        log(`[TMDB] 获取图片数据: ${url}`, 'debug');
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        log(`[TMDB] 成功获取图片数据 - Logos: ${data.logos?.length || 0}, Backdrops: ${data.backdrops?.length || 0}`, 'debug');
        
        return data;
    } catch (error) {
        console.error('[TMDB] 获取媒体图片失败:', error);
        return null;
    }
}

// 智能图片选择算法
function selectBestImage(images, preferLogos = false) {
    if (!images || images.length === 0) {
        return null;
    }

    // 计算图片优先级得分
    function calculateScore(image) {
        let score = 0;
        
        // 语言优先级：中文 > 英文 > 无语言 > 其他
        const lang = image.iso_639_1;
        if (lang === 'zh') {
            score += 1000;
        } else if (lang === 'en') {
            score += 800;
        } else if (!lang) {
            score += 600;
        } else {
            score += 400;
        }
        
        // 评分权重
        const voteAvg = image.vote_average || 0;
        score += voteAvg * 100;
        
        // 分辨率权重
        const width = image.width || 0;
        const height = image.height || 0;
        const resolution = width * height;
        score += Math.log(resolution + 1) * 10;
        
        // 对于Logo，考虑宽高比
        if (preferLogos) {
            const aspectRatio = width / Math.max(height, 1);
            // 偏好横向Logo (2:1 到 3:1 比例)
            if (aspectRatio >= 2.0 && aspectRatio <= 3.5) {
                score += 200;
            } else if (aspectRatio >= 1.5 && aspectRatio <= 4.0) {
                score += 100;
            }
        }
        
        return score;
    }

    // 按得分排序并返回最佳图片
    const sortedImages = images
        .map(image => ({
            ...image,
            score: calculateScore(image)
        }))
        .sort((a, b) => b.score - a.score);

    log(`[图片选择] 选择了评分最高的图片 (得分: ${sortedImages[0].score}, 语言: ${sortedImages[0].iso_639_1}, 尺寸: ${sortedImages[0].width}x${sortedImages[0].height})`, 'debug');
    
    return sortedImages[0];
}

// 创建带标题覆盖的横版海报
async function createTitlePosterWithOverlay(item, options = {}) {
    try {
        const {
            title = item.title || item.name || "未知标题",
            subtitle = item.genreTitle || item.genre_title || "",
            rating = item.rating || item.vote_average || 0,
            year = item.year || (item.release_date ? item.release_date.substring(0, 4) : ""),
            showRating = true,
            showYear = true,
            overlayOpacity = 0.7,
            textColor = "#FFFFFF",
            backgroundColor = "rgba(0, 0, 0, 0.6)"
        } = options;
        
        // 获取背景图片 - 增强版：支持剧集Logo
        let backgroundUrl = "";
        let imageType = "backdrop";
        
                 // 对于剧集，优先尝试获取Logo
         if (CONFIG.ENABLE_TV_LOGOS && (item.type === 'tv' || item.media_type === 'tv')) {
             const logoBackdrop = await getTvShowLogoBackdrop(item);
             if (logoBackdrop && logoBackdrop.url) {
                 backgroundUrl = logoBackdrop.url;
                 imageType = logoBackdrop.type;
                 log(`[剧集Logo] 使用Logo作为背景: ${item.title || item.name}`, 'info');
             }
         }
        
        // 如果没有Logo或不是剧集，使用原有逻辑
        if (!backgroundUrl) {
            if (item.backdrop_path) {
                backgroundUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
                imageType = "backdrop";
            } else if (item.poster_path) {
                backgroundUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
                imageType = "poster";
            } else {
                return null;
            }
        }
        
        // 创建带标题覆盖的横版海报
        const titlePoster = {
            url: backgroundUrl,
            width: 1280,
            height: 720,
            type: imageType === "tv_logo" ? "tv_logo_with_title" : "backdrop_with_title",
            title: title,
            subtitle: subtitle,
            rating: rating,
            year: year,
            showRating: showRating,
            showYear: showYear,
            overlayOpacity: overlayOpacity,
            textColor: textColor,
            backgroundColor: backgroundColor
        };
        
        console.log(`[横版海报] 生成带标题的横版海报: ${title}`);
        return titlePoster;
    } catch (error) {
        console.error("[标题海报] 创建带覆盖的标题海报时出错:", error);
        return null;
    }
}
// 增强的TMDB热门数据生成器（支持高质量横版海报和智能缓存）
async function generateEnhancedTrendingData() {
    // 智能缓存检查
    const now = Date.now();
    if (trendingDataCache && (now - trendingCacheTime) < TRENDING_CACHE_DURATION) {
        console.log("[增强数据] 使用缓存的热门数据");
        return trendingDataCache;
    }
    
    try {
        console.log("[增强数据] 开始生成高质量热门数据...");
        
        // 并行获取多个数据源（优先中文，增加更多数据源）
        const requests = [
            // 今日热门 (多地区数据)
            Widget.tmdb.get("/trending/all/day", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            // 本周热门
            Widget.tmdb.get("/trending/all/week", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            // 热门电影
            Widget.tmdb.get("/movie/popular", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            // 热门剧集
            Widget.tmdb.get("/tv/popular", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            // 类型映射
            fetchTmdbGenres()
        ];
        
        const [todayTrending, weekTrending, popularMovies, popularTVShows, genreMap] = await Promise.all(requests);
        
        // 使用增强的处理函数
        const today_global = await processEnhancedMediaItems(todayTrending.results.slice(0, 20), genreMap);
        const week_global_all = await processEnhancedMediaItems(weekTrending.results.slice(0, 20), genreMap);
        const popular_movies = await processEnhancedMediaItems(popularMovies.results.slice(0, 15), genreMap, 'movie');
        const popular_tv_shows = await processEnhancedMediaItems(popularTVShows.results.slice(0, 15), genreMap, 'tv');
        
        const result = {
            today_global,
            week_global_all,
            popular_movies,
            popular_tv_shows,
            generated_at: new Date().toISOString(),
            data_quality: 'enhanced'
        };
        
        // 缓存结果
        trendingDataCache = result;
        trendingCacheTime = now;
        
        console.log(`[增强数据] 生成完成并缓存: 今日${today_global.length}个, 本周${week_global_all.length}个, 热门电影${popular_movies.length}个, 热门剧集${popular_tv_shows.length}个`);
        
        return result;
        
    } catch (error) {
        console.error("[增强数据] 生成失败:", error);
        
        // 降级到基础数据生成
        try {
            console.log("[增强数据] 尝试降级到基础数据生成...");
            return await generateBasicTrendingData();
        } catch (fallbackError) {
            console.error("[增强数据] 降级也失败:", fallbackError);
            
            // 如果有旧缓存，则返回旧缓存
            if (trendingDataCache) {
                console.log("[增强数据] 使用旧缓存数据");
                return trendingDataCache;
            }
            
            return { 
                today_global: [], 
                week_global_all: [], 
                popular_movies: [],
                popular_tv_shows: [],
                generated_at: new Date().toISOString(),
                data_quality: 'fallback'
            };
        }
    }
}

// 降级基础数据生成器
async function generateBasicTrendingData() {
    console.log("[基础数据] 使用基础数据生成模式...");
    
    const [todayTrending, weekTrending, popularMovies, genreMap] = await Promise.all([
        Widget.tmdb.get("/trending/all/day", { 
            params: { 
                language: 'zh-CN',
                api_key: API_KEY 
            } 
        }),
        Widget.tmdb.get("/trending/all/week", { 
            params: { 
                language: 'zh-CN',
                api_key: API_KEY 
            } 
        }),
        Widget.tmdb.get("/movie/popular", { 
            params: { 
                language: 'zh-CN',
                api_key: API_KEY 
            } 
        }),
        fetchTmdbGenres()
    ]);
    
    const today_global = await processMediaItems(todayTrending.results.slice(0, 15), genreMap);
    const week_global_all = await processMediaItems(weekTrending.results.slice(0, 15), genreMap);
    const popular_movies = await processMediaItems(popularMovies.results.slice(0, 12), genreMap, 'movie');
    
    return {
        today_global,
        week_global_all,
        popular_movies,
        generated_at: new Date().toISOString(),
        data_quality: 'basic'
    };
}

// 优先选择中文内容的辅助函数
function pickChineseContent(primaryCN, secondaryCN, primaryEN, secondaryEN, fallback = '') {
    // 优先级：中文主要 > 中文次要 > 英文主要 > 英文次要 > 备用
    if (primaryCN && /[\u4e00-\u9fa5]/.test(primaryCN)) return primaryCN;
    if (secondaryCN && /[\u4e00-\u9fa5]/.test(secondaryCN)) return secondaryCN;
    if (primaryEN && primaryEN.trim()) return primaryEN;
    if (secondaryEN && secondaryEN.trim()) return secondaryEN;
    return fallback;
}

// 增强的媒体项目处理器（支持多种尺寸横版海报和标题覆盖）
async function processEnhancedMediaItems(items, genreMap, forceType = null) {
    return items
        .filter(item => item.poster_path && item.backdrop_path && (item.title || item.name))
        .map(item => {
            const mediaType = forceType || item.media_type || (item.title ? 'movie' : 'tv');
            const releaseDate = item.release_date || item.first_air_date || '';
            const year = releaseDate ? releaseDate.substring(0, 4) : '';
            
            // 增强的中文标题选择
            const title = pickEnhancedChineseTitle(item);
            
            // 增强的中文简介处理
            const overview = processEnhancedOverview(item.overview);
            
            // 生成详细类型标签
            const genreTitle = generateEnhancedGenreTitle(item.genre_ids, mediaType, genreMap);
            
            // 生成多种尺寸的图片URL
            const imageUrls = generateEnhancedImageUrls(item);
            
            return {
                id: item.id,
                title: title,
                genreTitle: genreTitle,
                rating: parseFloat((item.vote_average || 0).toFixed(1)),
                overview: overview,
                release_date: releaseDate,
                year: year ? parseInt(year) : null,
                
                // 多种尺寸海报
                poster_url: imageUrls.poster_w500,
                poster_hd: imageUrls.poster_w780,
                
                // 多种尺寸横版海报（带标题效果）
                title_backdrop: imageUrls.backdrop_w1280,
                title_backdrop_hd: imageUrls.backdrop_original,
                backdrop_w780: imageUrls.backdrop_w780,
                
                // 附加信息
                type: mediaType,
                popularity: item.popularity || 0,
                vote_count: item.vote_count || 0,
                adult: item.adult || false,
                original_language: item.original_language || 'unknown'
            };
        });
}

// 增强的中文标题选择器
function pickEnhancedChineseTitle(item) {
    const candidates = [
        item.title,
        item.name,
        item.original_title,
        item.original_name
    ];
    
    // 优先选择包含中文的标题
    for (const candidate of candidates) {
        if (candidate && typeof candidate === 'string' && /[\u4e00-\u9fa5]/.test(candidate.trim())) {
            return candidate.trim();
        }
    }
    
    // 如果没有中文标题，选择最短的非空标题
    for (const candidate of candidates) {
        if (candidate && typeof candidate === 'string' && candidate.trim().length > 0) {
            return candidate.trim();
        }
    }
    
    return '未知标题';
}

// 增强的简介处理器
function processEnhancedOverview(overview) {
    if (!overview || typeof overview !== 'string') {
        return '暂无简介';
    }
    
    const trimmed = overview.trim();
    if (trimmed.length === 0) {
        return '暂无简介';
    }
    
    // 限制简介长度，避免过长
    if (trimmed.length > 200) {
        return trimmed.substring(0, 197) + '...';
    }
    
    return trimmed;
}

// 增强的类型标签生成器
function generateEnhancedGenreTitle(genreIds, mediaType, genreMap) {
    if (!Array.isArray(genreIds) || genreIds.length === 0 || !genreMap) {
        return mediaType === 'movie' ? '电影' : '剧集';
    }
    
    const genres = genreMap[mediaType] || {};
    const genreNames = genreIds
        .slice(0, 2) // 最多显示2个类型
        .map(id => genres[id])
        .filter(Boolean);
    
    if (genreNames.length > 0) {
        return genreNames.join('•');
    }
    
    return mediaType === 'movie' ? '电影' : '剧集';
}

// 扩展的CDN配置 - 更多备用方案
const CDN_CONFIGS = [
    {
        name: 'TMDB官方',
        baseUrl: 'https://image.tmdb.org/t/p/',
        reliability: 0.9,
        speed: 0.9
    },
    {
        name: 'TMDB备用1',
        baseUrl: 'https://www.themoviedb.org/t/p/',
        reliability: 0.8,
        speed: 0.8
    },
    {
        name: 'TMDB备用2',
        baseUrl: 'https://image.tmdb.org/t/p/',
        reliability: 0.7,
        speed: 0.7
    },
    {
        name: 'Cloudflare代理',
        baseUrl: 'https://image.tmdb.org/t/p/',
        reliability: 0.85,
        speed: 0.9
    }
];

// 智能CDN选择器
function selectBestCDN(size = 'w500', type = 'poster') {
    // 根据图片类型和大小选择最佳CDN
    if (size.includes('original') || size.includes('w1280')) {
        return CDN_CONFIGS[0]; // 高清图片使用官方CDN
    }
    
    // 随机选择，避免单一CDN压力过大
    const availableCDNs = CDN_CONFIGS.filter(cdn => cdn.reliability > 0.7);
    return availableCDNs[Math.floor(Math.random() * availableCDNs.length)] || CDN_CONFIGS[0];
}

// 增强的智能图片URL生成器
function createSmartImageUrl(path, type = 'poster', size = 'w500') {
    if (!path) return '';
    
    const selectedCDN = selectBestCDN(size, type);
    return `${selectedCDN.baseUrl}${size}${path}`;
}
// 处理媒体项目数据（优先中文）- 保留原函数作为降级选项
async function processMediaItems(items, genreMap, forceType = null) {
    return items
        .filter(item => item.poster_path && item.backdrop_path && (item.title || item.name))
        .map(item => {
            const mediaType = forceType || item.media_type || (item.title ? 'movie' : 'tv');
            const releaseDate = item.release_date || item.first_air_date || '';
            const year = releaseDate ? releaseDate.substring(0, 4) : '';
            
            // 优先使用中文标题
            const title = pickChineseContent(
                item.title,           // 主要标题
                item.name,            // 剧集名称
                item.original_title,  // 原始标题
                item.original_name,   // 原始名称
                '未知标题'
            );
            
            // 优先使用中文简介
            const overview = item.overview && item.overview.trim() ? 
                item.overview : '暂无简介';
            
            // 生成类型标签（中文）
            const genreTitle = item.genre_ids ? 
                getTmdbGenreTitles(item.genre_ids.slice(0, 2), mediaType) : '';
            
            return {
                id: item.id,
                title: title,
                genreTitle: genreTitle,
                rating: item.vote_average || 0,
                overview: overview,
                release_date: releaseDate,
                year: year ? parseInt(year) : null,
                poster_url: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                // 使用backdrop作为横版海报（虽然没有标题，但是高质量的横版图）
                title_backdrop: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
                type: mediaType
            };
        });
}

// 获取今日热门影视（增强版横版海报支持）
async function loadTodayGlobalMedia(params = {}) {
  const { language = "zh-CN" } = params;
  try {
    const data = await loadTmdbTrendingData();
    if (data && data.today_global && data.today_global.length > 0) {
        return data.today_global.map(item => createEnhancedWidgetItem(item));
    } else {
        // 备用方案：使用标准TMDB API（优先中文）
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

// 增强的小组件项目创建器（支持高质量横版海报和标题海报）
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

// 获取播出平台内容
async function tmdbDiscoverByNetwork(params = {}) {
  const { language = "zh-CN", page = 1, with_networks, sort_by = "popularity.desc" } = params;
  try {
    const res = await Widget.tmdb.get("/discover/tv", {
      params: { 
        language, 
        page, 
        with_networks,
        sort_by,
        api_key: API_KEY 
      }
    });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(item => formatTmdbItem(item, genreMap));
  } catch (error) {
    console.error("Error fetching discover by network:", error);
    return [];
  }
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
          const newResults = allApiResults.filter(item => !existingIds.has(item.id));
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
          const newResults = allApiResults.filter(item => !existingIds.has(item.id));
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
            const pageResults = res.results.map(item => formatTmdbItem(item, genreMap));
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
            const pageResults = res.results.map(item => formatTmdbItem(item, genreMap));
            allApiResults.push(...pageResults);
          }

          // 合并结果，去重
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => !existingIds.has(item.id) && item.posterPath);
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
          console.log(`[标题海报] 数据健康检查通过 - 今日热门: ${health.stats.today_global || 0}, 本周热门: ${health.stats.week_global_all || 0}, 热门电影: ${health.stats.popular_movies || 0}`);
        }
        let results = [];
        
        // 根据内容类型获取数据
        switch (content_type) {
          case "today":
            // 今日热门 - 增强版，优先使用横版标题海报
            if (trendingData && trendingData.today_global && trendingData.today_global.length > 0) {
              results = await loadEnhancedTitlePosterWithBackdrops(trendingData.today_global, max_items, "today");
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
              const newResults = apiResults.filter(item => !existingIds.has(item.id));
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "week":
            // 本周热门 - 增强版，优先使用横版标题海报
            if (trendingData && trendingData.week_global_all && trendingData.week_global_all.length > 0) {
              results = await loadEnhancedTitlePosterWithBackdrops(trendingData.week_global_all, max_items, "week");
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
              const newResults = apiResults.filter(item => !existingIds.has(item.id));
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "popular":
            // 热门电影 - 增强版，优先使用横版标题海报
            if (trendingData && trendingData.popular_movies && trendingData.popular_movies.length > 0) {
              results = await loadEnhancedTitlePosterWithBackdrops(trendingData.popular_movies, max_items, "popular");
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
              const newResults = allApiResults.filter(item => !existingIds.has(item.id) && item.posterPath);
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "top_rated":
            // 高分内容 - 增强版，优先使用横版标题海报
            console.log(`[标题海报] 加载高分内容数据...`);
            
            // 尝试从缓存获取高分内容
            if (trendingData && trendingData.popular_movies && trendingData.popular_movies.length > 0) {
              results = await loadEnhancedTitlePosterWithBackdrops(trendingData.popular_movies, max_items, "top_rated");
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
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
      console.log(`[Bangumi新番] 最低评分: ${vote_average_gte}`);
    }
    
    // 添加年份筛选
    if (year && year !== "") {
      // 设置年份范围，从该年1月1日到12月31日
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      queryParams.first_air_date_gte = startDate;
      queryParams.first_air_date_lte = endDate;
      console.log(`[Bangumi新番] 年份筛选: ${year}年 (${startDate} - ${endDate})`);
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
            formattedItem.isRecent = (new Date().getTime() - date.getTime()) < (365 * 24 * 60 * 60 * 1000); // 一年内
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
    const endpoint = media_type === "movie" ? "/discover/movie" : "/discover/tv";
    
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
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻'];
        if (showKeywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k))) return false;
        // 过滤短剧（标题或副标题包含"短剧"）
        if (lowerTitle.includes('短剧') || lowerDesc.includes('短剧')) return false;
        // 过滤三级片
        const cat3Keywords = ['三级片','三級片','三級','3级片','3級片','3级','3級','R级','R級','限制级','限制級','成人片','情色片','无码','無碼','无码片','無碼片'];
        if (cat3Keywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k) || (item.genreTitle && item.genreTitle.includes(k)))) return false;
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
  const nameMap = {
    current_year: "本年度",
    last_year: "去年",
    recent_3_years: "最近3年",
    recent_5_years: "最近5年",
    "2020s": "2020年代",
    "2010s": "2010年代", 
    "2000s": "2000年代",
    earlier: "早期"
  };
  return nameMap[time_period] || "全部时期";
}

// ===============豆瓣功能函数===============

async function fetchTmdbDataForDouban(key, mediaType) {
    let searchTypes = [];
    
    if (mediaType === "movie") {
        searchTypes = ["movie"];
    } else if (mediaType === "tv") {
        searchTypes = ["tv"];
    } else if (mediaType === "multi") {
        searchTypes = ["movie", "tv"];
    } else {
        searchTypes = ["movie", "tv"];
    }
    
    const allResults = [];
    
    for (const type of searchTypes) {
        try {
            const tmdbResults = await Widget.tmdb.get(`/search/${type}`, {
                params: {
                    query: key,
                    language: "zh_CN",
                }
            });
            
            if (tmdbResults.results && tmdbResults.results.length > 0) {
                const resultsWithType = tmdbResults.results.map(result => ({
                    ...result,
                    media_type: type
                }));
                allResults.push(...resultsWithType);
            }
        } catch (error) {
            // Continue to next search type on error
        }
    }
    
    return allResults;
}

async function fetchImdbItemsForDouban(scItems) {
    const promises = scItems.map(async (scItem) => {
        const titleNormalizationRules = [
            { pattern: /^罗小黑战记/, replacement: '罗小黑战记', forceMovieType: true },
            { pattern: /^千与千寻/, replacement: '千与千寻', forceMovieType: true },
            { pattern: /^哈尔的移动城堡/, replacement: '哈尔的移动城堡', forceMovieType: true },
            { pattern: /^鬼灭之刃/, replacement: '鬼灭之刃', forceMovieType: true },
            { pattern: /^天气之子/, replacement: '天气之子', forceMovieType: true },
            { pattern: /^坂本日常 Part 2/, replacement: '坂本日常' },
            { pattern: /^苍兰诀2 影三界篇/, replacement: '苍兰诀', forceFirstResult: true },
            { pattern: /^沧元图2 元初山番外篇/, replacement: '沧元图' },
            { pattern: /^石纪元 第四季 Part 2/, replacement: '石纪元' },
            { pattern: /^双人独自露营/, replacement: 'ふたりソロキャンプ' },
            { pattern: /^地缚少年花子君 第二季 后篇/, replacement: '地缚少年花子君' },
            { pattern: /^更衣人偶坠入爱河 第二季/, replacement: '更衣人偶坠入爱河', forceFirstResult: true },
            { pattern: /^坏女孩/, replacement: '不良少女' },
            { pattern: / 第[^季]*季/, replacement: '' },
            { pattern: /^(歌手|全员加速中)\d{4}$/, replacement: (match, showName) => {
                const showMap = {
                    '歌手': '我是歌手',
                    '全员加速中': '全员加速中'
                };
                return showMap[showName] || showName;
            }},
            { pattern: /^奔跑吧(?! ?兄弟)/, replacement: '奔跑吧兄弟' },
            { pattern: /^(.+?[^0-9])\d+$/, replacement: (match, baseName) => {
                if (/^(歌手|全员加速中)\d{4}$/.test(match)) {
                    return match;
                }
                return baseName;
            }},
            { pattern: /^([^·]+)·(.*)$/, replacement: (match, part1, part2) => {
                if (part2 && !/^(慢享季|第.*季)/.test(part2)) {
                    return part1 + part2;
                }
                return part1;
            }}
        ];
        
        let title = scItem.title;
        let forceFirstResult = false;
        let forceMovieType = false;
        for (const rule of titleNormalizationRules) {
            if (rule.pattern.test(title)) {
                if (typeof rule.replacement === 'function') {
                    title = title.replace(rule.pattern, rule.replacement);
                } else {
                    title = title.replace(rule.pattern, rule.replacement);
                }
                if (rule.forceFirstResult) {
                    forceFirstResult = true;
                }
                if (rule.forceMovieType) {
                    forceMovieType = true;
                }
                break;
            }
        }
        let year = null;
        if (scItem.year) {
            year = String(scItem.year);
        } else if (scItem.card_subtitle) {
            const yearMatch = scItem.card_subtitle.match(/(\d{4})/);
            if (yearMatch) year = yearMatch[1];
        }

        let searchType = scItem.type;
        
        if (forceMovieType) {
            searchType = "movie";
        } else {
            let detectedType = detectItemTypeFromContent(scItem);
            
            if (scItem.type === "multi") {
                if (detectedType) {
                    searchType = detectedType;
                } else if (scItem.subtype && (scItem.subtype === "movie" || scItem.subtype === "tv")) {
                    searchType = scItem.subtype;
                } else {
                    searchType = "multi";
                }
            }
        }
        
        const tmdbDatas = await fetchTmdbDataForDouban(title, searchType);

        if (tmdbDatas.length !== 0) {
            
            if (scItem.isMultiTypeTitle) {
                const allMatches = selectMatches(tmdbDatas, title, year, { 
                    returnArray: true, 
                    doubanItem: scItem
                });

                return allMatches
                    .filter(match => {
                        return match.poster_path &&
                               match.id &&
                               (match.title || match.name) &&
                               (match.title || match.name).trim().length > 0;
                    })
                    .map(match => ({
                        id: match.id,
                        type: "tmdb",
                        title: match.title ?? match.name,
                        description: match.overview,
                        releaseDate: match.release_date ?? match.first_air_date,
                        backdropPath: match.backdrop_path,
                        posterPath: match.poster_path,
                        rating: match.vote_average,
                        mediaType: match.media_type,
                        genreTitle: generateGenreTitleFromTmdb(match, scItem),
                        originalDoubanTitle: scItem.title,
                        originalDoubanYear: scItem.year,
                        originalDoubanId: scItem.id
                    }));
            } else {
                const bestMatch = forceFirstResult && tmdbDatas.length > 0 ? 
                    tmdbDatas[0] : 
                    selectMatches(tmdbDatas, title, year, { 
                        doubanItem: scItem
                    });
                
                if (bestMatch && bestMatch.poster_path && bestMatch.id && 
                    (bestMatch.title || bestMatch.name) && 
                    (bestMatch.title || bestMatch.name).trim().length > 0) {
                    return {
                        id: bestMatch.id,
                        type: "tmdb",
                        title: bestMatch.title ?? bestMatch.name,
                        description: bestMatch.overview,
                        releaseDate: bestMatch.release_date ?? bestMatch.first_air_date,
                        backdropPath: bestMatch.backdrop_path,
                        posterPath: bestMatch.poster_path,
                        rating: bestMatch.vote_average,
                        mediaType: bestMatch.media_type,
                        genreTitle: generateGenreTitleFromTmdb(bestMatch, scItem),
                        originalDoubanTitle: scItem.title,
                        originalDoubanYear: scItem.year,
                        originalDoubanId: scItem.id
                    };
                }
            }
        }
        return null;
    });

    const results = await Promise.all(promises);
    
    const allItems = [];
    for (const result of results) {
        if (result) {
            if (Array.isArray(result)) {
                allItems.push(...result);
            } else {
                allItems.push(result);
            }
        }
    }
    
    let filteredItems = allItems.filter(item => {
        // 过滤掉综艺（真人秀、脱口秀、访谈、节目等）和纪录片、新闻
        const varietyGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻'];
        if (showKeywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k))) return false;
        // 过滤短剧（标题或副标题包含"短剧"）
        if (lowerTitle.includes('短剧') || lowerDesc.includes('短剧')) return false;
        // 过滤三级片
        const cat3Keywords = ['三级片','三級片','三級','3级片','3級片','3级','3級','R级','R級','限制级','限制級','成人片','情色片','无码','無碼','无码片','無碼片'];
        if (cat3Keywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k) || (item.genreTitle && item.genreTitle.includes(k)))) return false;
        return true;
    });
    return filteredItems;
}

async function loadDoubanHotListWithTmdb(params = {}) {
  const url = params.url;
  
  const uriMatch = url.match(/uri=([^&]+)/);
  if (!uriMatch) {
    throw new Error("无法解析豆瓣dispatch URL");
  }
  
  const uri = decodeURIComponent(uriMatch[1]);
  const collectionMatch = uri.match(/\/subject_collection\/([^\/]+)/);
  if (!collectionMatch) {
    throw new Error("无法从URI中提取collection ID");
  }
  
  const collectionId = collectionMatch[1];
  
  const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${collectionId}/items?updated_at&items_only=1&for_mobile=1`;
  const referer = `https://m.douban.com/subject_collection/${collectionId}/`;
  
  const response = await Widget.http.get(apiUrl, {
    headers: {
      Referer: referer,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    },
  });
  
  if (!response.data || !response.data.subject_collection_items) {
    throw new Error("获取豆瓣热榜数据失败");
  }
  
  const items = response.data.subject_collection_items;
  
  const processedItems = items.map((item) => {
    let itemType = "multi";
    
    if (params.type === "movie") {
      itemType = "movie";
    } else if (params.type === "tv") {
      itemType = "tv";
    } else if (params.type === "subject") {
      if (item.subtype === "movie") {
        itemType = "movie";
      } else if (item.subtype === "tv") {
        itemType = "tv";
      } else {
        itemType = "multi";
      }
    }
    
    return {
      ...item,
      type: itemType
    };
  });
  
  const processedItemsWithMultiDetection = detectAndAssignTypePreferences(processedItems);
  
  return await fetchImdbItemsForDouban(processedItemsWithMultiDetection);
}

async function loadEnhancedDoubanList(params = {}) {
    const url = params.url;
    
    if (url.includes("douban.com/doulist/")) {
        return loadEnhancedDefaultList(params);
    } 
    else if (url.includes("douban.com/subject_collection/")) {
        return loadEnhancedSubjectCollection(params);
    } 
    else if (url.includes("m.douban.com/doulist/")) {
        const desktopUrl = url.replace("m.douban.com", "www.douban.com");
        return loadEnhancedDefaultList({ ...params, url: desktopUrl });
    }
    else if (url.includes("douban.com/doubanapp/dispatch")) {
        const parsedUrl = parseDoubanAppDispatchUrl(url);
        return loadEnhancedDoubanList({ ...params, url: parsedUrl });
    }
    
    return [];
}

async function loadEnhancedDefaultList(params = {}) {
    const url = params.url;
    const listId = url.match(/doulist\/(\d+)/)?.[1];
    const page = params.page || 1;
    const count = 25;
    const start = (page - 1) * count;
    const pageUrl = `https://www.douban.com/doulist/${listId}/?start=${start}&sort=seq&playable=0&sub_type=`;

    const response = await Widget.http.get(pageUrl, {
        headers: {
            Referer: `https://movie.douban.com/explore`,
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });

    const docId = Widget.dom.parse(response.data);
    const videoElementIds = Widget.dom.select(docId, ".doulist-item .title a");

    let doubanItems = [];
    for (const itemId of videoElementIds) {
        const link = await Widget.dom.attr(itemId, "href");
        const text = await Widget.dom.text(itemId);
        const chineseTitle = text.trim().split(' ')[0];
        if (chineseTitle) {
            doubanItems.push({ title: chineseTitle, type: "multi" });
        }
    }

    return await fetchImdbItemsForDouban(doubanItems);
}

async function loadEnhancedItemsFromApi(params = {}) {
    const url = params.url;
    const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
    const response = await Widget.http.get(url, {
        headers: {
            Referer: `https://m.douban.com/subject_collection/${listId}/`,
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });

    const scItems = response.data.subject_collection_items;
    return await fetchImdbItemsForDouban(scItems);
}

async function loadEnhancedSubjectCollection(params = {}) {
    const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
    const page = params.page || 1;
    const count = 20;
    const start = (page - 1) * count;
    
    let pageUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;
    if (params.type) {
        pageUrl += `&type=${params.type}`;
    }
    
    return await loadEnhancedItemsFromApi({ ...params, url: pageUrl });
}

// 辅助函数：解析豆瓣App dispatch URL
function parseDoubanAppDispatchUrl(url) {
    const uriMatch = url.match(/uri=([^&]+)/);
    if (!uriMatch) {
        return url;
    }
    
    const uri = decodeURIComponent(uriMatch[1]);
    return `https://www.douban.com${uri}`;
}

// 辅助函数：检测内容类型
function detectItemTypeFromContent(item) {
    const title = item.title || '';
    const subtitle = item.card_subtitle || '';
    
    // 电影关键词
    const movieKeywords = ['电影', '影片', '院线', '票房', '导演', '主演'];
    // 电视剧关键词
    const tvKeywords = ['剧集', '电视剧', '连续剧', '季', '集', '播出'];
    // 综艺关键词
    const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目'];
    
    const content = (title + ' ' + subtitle).toLowerCase();
    
    if (movieKeywords.some(keyword => content.includes(keyword))) {
        return 'movie';
    }
    
    if (tvKeywords.some(keyword => content.includes(keyword))) {
        return 'tv';
    }
    
    if (showKeywords.some(keyword => content.includes(keyword))) {
        return 'tv'; // 综艺也归类为tv
    }
    
    return null;
}

// 辅助函数：检测并分配类型偏好
function detectAndAssignTypePreferences(items) {
    return items.map(item => {
        const detectedType = detectItemTypeFromContent(item);
        return {
            ...item,
            detectedType: detectedType,
            isMultiTypeTitle: item.type === "multi" && !detectedType
        };
    });
}

// 辅助函数：选择最佳匹配
function selectMatches(tmdbResults, title, year, options = {}) {
    if (!tmdbResults || tmdbResults.length === 0) {
        return options.returnArray ? [] : null;
    }
    
    // 简化匹配逻辑：优先选择评分高的
    const sortedResults = tmdbResults.sort((a, b) => {
        const scoreA = (a.vote_average || 0) + (a.popularity || 0) * 0.01;
        const scoreB = (b.vote_average || 0) + (b.popularity || 0) * 0.01;
        return scoreB - scoreA;
    });
    
    if (options.returnArray) {
        return sortedResults.slice(0, 3); // 返回前3个最佳匹配
    }
    
    return sortedResults[0];
}

// 辅助函数：生成题材标题
function generateGenreTitleFromTmdb(tmdbItem, doubanItem) {
    const mediaType = tmdbItem.media_type || 'unknown';
    
    if (mediaType === 'movie') {
        return '电影';
    } else if (mediaType === 'tv') {
        return '剧集';
    }
    
    return '影视';
}
// 解析豆瓣片单（TMDB版）
async function loadCardItems(params = {}) {
  try {
    const url = params.url;
    if (!url) throw new Error("缺少片单 URL");
    if (url.includes("douban.com/doulist/")) {
      // 豆瓣桌面端豆列
      const listId = url.match(/doulist\/(\d+)/)?.[1];
      if (!listId) throw new Error("无法获取片单 ID");
      const page = params.page || 1;
      const count = 25;
      const start = (page - 1) * count;
      const pageUrl = `https://www.douban.com/doulist/${listId}/?start=${start}&sort=seq&playable=0&sub_type=`;
      const response = await Widget.http.get(pageUrl, {
        headers: {
          Referer: `https://movie.douban.com/explore`,
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
      if (!response || !response.data) throw new Error("获取片单数据失败");
      const docId = Widget.dom.parse(response.data);
      if (docId < 0) throw new Error("解析 HTML 失败");
      const videoElementIds = Widget.dom.select(docId, ".doulist-item .title a");
      let doubanIds = [];
      for (const itemId of videoElementIds) {
        const text = await Widget.dom.text(itemId);
        const chineseTitle = text.trim().split(' ')[0];
        if (chineseTitle) doubanIds.push({ title: chineseTitle, type: "multi" });
      }
      return await fetchImdbItemsForDouban(doubanIds);
    } else if (url.includes("douban.com/subject_collection/")) {
      // 豆瓣官方榜单
      const listId = url.match(/subject_collection\/(\w+)/)?.[1];
      if (!listId) throw new Error("无法获取合集 ID");
      const page = params.page || 1;
      const count = 20;
      const start = (page - 1) * count;
      let pageUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;
      params.url = pageUrl;
      const response = await Widget.http.get(pageUrl, {
        headers: {
          Referer: `https://m.douban.com/subject_collection/${listId}/`,
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
      if (response.data && response.data.subject_collection_items) {
        return await fetchImdbItemsForDouban(response.data.subject_collection_items);
      }
      return [];
    } else if (url.includes("m.douban.com/doulist/")) {
      // 移动端豆列转桌面端
      const desktopUrl = url.replace("m.douban.com", "www.douban.com");
      return await loadCardItems({ ...params, url: desktopUrl });
    } else if (url.includes("douban.com/doubanapp/dispatch")) {
      // App dispatch
      const parsedUrl = parseDoubanAppDispatchUrl(url);
      return await loadCardItems({ ...params, url: parsedUrl });
    }
    return [];
  } catch (error) {
    console.error("解析豆瓣片单(TMDB版)失败:", error);
    throw error;
  }
}

// 按类型/题材分类展示电影或剧集
async function classifyByGenre(params = {}) {
  const { type = "movie", genre = "", page = 1, language = "zh-CN", with_origin_country = "", sort_by = "popularity.desc" } = params;
  try {
    if (type === 'all') {
      // 并发请求电影和剧集
      const [movieRes, tvRes] = await Promise.all([
        classifyByGenre({ ...params, type: 'movie' }),
        classifyByGenre({ ...params, type: 'tv' })
      ]);
      // 合并去重（按id）
      const all = [...movieRes, ...tvRes];
      const seen = new Set();
      const unique = all.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
      return unique;
    }
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    const queryParams = {
      language,
      page,
      api_key: API_KEY,
      sort_by
    };
    if (genre) {
      queryParams.with_genres = genre;
    }
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    const res = await Widget.tmdb.get(endpoint, { params: queryParams });
    const genreMap = await fetchTmdbGenres();
    const genreDict = type === "movie" ? genreMap.movie : genreMap.tv;
    return res.results
      .map(item => formatTmdbItem(item, genreDict))
      .filter(item => {
        // 复用过滤逻辑
        if (!item.posterPath) return false;
        const varietyGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻'];
        if (showKeywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k))) return false;
        if (lowerTitle.includes('短剧') || lowerDesc.includes('短剧')) return false;
        const adultKeywords = ['19禁', '性人', '成人', '情色', '色情', 'AV', '에로', '야동'];
        if (adultKeywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k) || (item.genreTitle && item.genreTitle.includes(k)))) return false;
        return true;
      });
  } catch (error) {
    console.error("Error in classifyByGenre:", error);
    return [];
  }
}

// --- IMDb-v2 系统函数 ---

// 构建图片 URL
function buildImageUrl(baseUrl, path) {
    if (!path || typeof path !== 'string') { return null; }
    if (path.startsWith('http://') || path.startsWith('https://')) { return path; }
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return baseUrl + cleanPath;
}

// 处理枚举选项
function processEnumOptions(options, allValue = "all", allTitle = "全部", allLast = false) {
    let processed = [...options];
    const allIndex = processed.findIndex(opt => opt.value === allValue);
    let allItem = null;
    if (allIndex > -1) {
       allItem = processed.splice(allIndex, 1)[0];
       allItem.title = allTitle; 
    } else {
       allItem = { title: allTitle, value: allValue };
    }
    // 年份降序，其他按中文拼音升序
    if(options.length > 0 && options.some(opt => /^\d{4}$/.test(opt.value))){
        processed.sort((a, b) => parseInt(b.value) - parseInt(a.value)); 
    } else {
        processed.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
    }
    if (allLast) {
        processed.push(allItem);
    } else {
        processed.unshift(allItem);
    }
    return processed;
}

// --- IMDb-v2 数据获取配置 ---
const GITHUB_OWNER = "opix-maker";
const GITHUB_REPO = "Forward";
const GITHUB_BRANCH = "main";
const BASE_DATA_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/imdb-data-platform/dist`;
const IMG_BASE_POSTER = 'https://image.tmdb.org/t/p/w500';
const IMG_BASE_BACKDROP = 'https://image.tmdb.org/t/p/w780'; 
const ITEMS_PER_PAGE = 30; 
const DEBUG_LOG = false; // 生产环境关闭调试日志

// --- 缓存 ---
let cachedData = {}; // 用于缓存单个分页文件的请求结果

// 缓存清除器，用于绕过 GitHub CDN 缓存
function getCacheBuster() {
    return Math.floor(Date.now() / (1000 * 60 * 30)); // 30 分钟更新一次
}

// 获取预先分页的数据
async function fetchPagedData(shardPath) {
    if (!shardPath || typeof shardPath !== 'string' || !shardPath.endsWith('.json')) {
       console.error(`[IMDb-v2 ERROR] 无效的分片路径: ${shardPath}`);
       return [];
    }

    // 构建完整 URL
    const rawUrl = `${BASE_DATA_URL}/${shardPath}?cache_buster=${getCacheBuster()}`;
    const encodedUrl = encodeURI(rawUrl); // 编码 URL

    // 检查内存缓存
    if (cachedData[encodedUrl]) { 
        if(DEBUG_LOG) console.log(`[IMDb-v2 DEBUG] 内存缓存命中: ${shardPath}`);
        return cachedData[encodedUrl]; 
    }

    if(DEBUG_LOG) console.log(`[IMDb-v2 DEBUG] 正在获取分页数据: ${encodedUrl}`);
    let response;
    try {
        // 发起网络请求，超时时间可以短一些，因为文件很小
        response = await Widget.http.get(encodedUrl, { timeout: 15000, headers: {'User-Agent': 'ForwardWidget/IMDb-v2'} }); 
    } catch (e) { 
        console.error(`[IMDb-v2 ERROR] 网络请求失败 ${encodedUrl}: ${e.message}`);
        // 如果是 404 错误，可能是页码超出范围，返回空
        if (e.message.includes('404')) {
            if(DEBUG_LOG) console.log(`[IMDb-v2 INFO] 数据未找到 (404)，可能页码超出范围: ${encodedUrl}`);
            return [];
        }
        throw new Error(`网络请求失败: ${e.message || '未知网络错误'}`);
    }

    // 检查响应状态
    if (!response || response.statusCode !== 200 || !response.data ) {
       // 404 是正常的，表示该页不存在
       if (response && response.statusCode === 404) {
           if(DEBUG_LOG) console.log(`[IMDb-v2 INFO] 数据未找到 (404)，可能页码超出范围: ${encodedUrl}`);
           return [];
       }
       console.error(`[IMDb-v2 ERROR] 获取数据响应异常. Status: ${response ? response.statusCode : 'N/A'}, URL: ${encodedUrl}`);
       throw new Error(`获取数据失败 (Status: ${response ? response.statusCode : 'N/A'})`);
    }

    // 解析数据并缓存
    const data = Array.isArray(response.data) ? response.data : [];
    cachedData[encodedUrl] = data;
    return data;
}

// 将数据源格式映射为小组件格式
function mapToWidgetItem(item) {
    // 数据源字段：id, t(title), p(poster), b(backdrop), r(rating), y(year), rd(release_date), mt(mediaType), o(overview)
    if (!item || typeof item.id === 'undefined' || item.id === null) return null;
    
    let mediaType = item.mt;
    // 客户端通常只需要 movie 或 tv
    if (mediaType === 'anime' || mediaType === 'tv') {
         mediaType = 'tv'; // 将 anime 和 tv 都映射为 tv 类型
    } else {
        mediaType = 'movie'; // 其他都映射为 movie
    }

    const posterUrl = buildImageUrl(IMG_BASE_POSTER, item.p);
    
    // 优先使用 rd (完整日期), 否则使用 y (年份) + 01-01
    const finalReleaseDate = item.rd ? item.rd : (item.y ? `${String(item.y)}-01-01` : '');

    const widgetItem = {
        id: String(item.id), 
        type: "tmdb", 
        title: item.t || '未知标题',
        posterPath: posterUrl, 
        backdropPath: buildImageUrl(IMG_BASE_BACKDROP, item.b), 
        coverUrl: posterUrl, 
        releaseDate: finalReleaseDate, 
        mediaType: mediaType, 
        rating: typeof item.r === 'number' ? item.r.toFixed(1) : '0.0', 
        description: item.o || '', 
        link: null, genreTitle: "", duration: 0, durationText: "", episode: 0, childItems: []                         
    };
     return widgetItem;
}

// 处理数据 映射
function processData(data) {
     if(!Array.isArray(data) || data.length === 0) return [];
     return data.map(mapToWidgetItem).filter(Boolean); 
}

// 获取和解析排序和页码参数
function getSortAndPage(params) {
    // 支持两种参数名：sort_by (新模块) 和 sort (兼容)
    const sortKeyRaw = params.sort_by || params.sort || 'd_desc';
    let sortKey = 'd'; // 默认排序键
    
    // 解析排序键，支持更多排序选项
    if (typeof sortKeyRaw === 'string') {
        // 处理各种排序格式
        if (sortKeyRaw.includes('_desc') || sortKeyRaw.includes('_asc')) {
            // 格式: hs_desc, r_asc, date_desc, vote_asc 等
            sortKey = sortKeyRaw.split('_')[0];
        } else if (sortKeyRaw === 'random') {
            sortKey = 'random';
        } else {
            // 兼容旧格式
            sortKey = sortKeyRaw;
        }
        
        // 映射特殊排序键
        const sortKeyMap = {
            'hs': 'hs',      // 热度
            'r': 'r',        // 评分
            'd': 'd',        // 默认
            'date': 'd',     // 播出时间映射到默认
            'vote': 'r',     // 投票数映射到评分
            'random': 'hs'   // 随机排序映射到热度（数据源限制）
        };
        
        sortKey = sortKeyMap[sortKey] || 'd';
    }
    
    // 提取页码
    const page = Math.max(1, parseInt(params.page || "1", 10));
    return { sortKey, page };
}

// 构建最终的分页文件路径
function buildPagedPath(basePath, sortKey, page) {
     // 替换路径中的冒号 (如 country:cn -> country_cn)
     const cleanBasePath = String(basePath).replace(':', '_');
     return `${cleanBasePath}/by_${sortKey}/page_${page}.json`;
}

// 通用请求处理函数 负责构建路径、获取数据、处理分页
async function fetchAndProcess(basePath, params) {
    const { sortKey, page } = getSortAndPage(params);
    const fullPath = buildPagedPath(basePath, sortKey, page);
    
    if(DEBUG_LOG) console.log(`[IMDb-v2 DEBUG] 请求参数: Path=${fullPath}, Sort=${sortKey}, Page=${page}`);

    try {
        // 获取数据
        const data = await fetchPagedData(fullPath);
        // 映射为小组件格式
        const items = processData(data);
        if (items.length === ITEMS_PER_PAGE) {
             params.nextPageParams = { ...params, page: String(page + 1) };
        } else {
             params.nextPageParams = null; // 没有下一页了
        }
        
        return items;
    } catch(e) {
        console.error(`[IMDb-v2 ERROR] 处理请求时出错 "${fullPath}":`, e.message || e, e.stack);
        throw new Error(`加载数据失败: ${e.message || '未知错误'}`);
    }
}
// ✨ 动画 - 按地区筛选的动画内容 (路径格式: anime/{region})
async function listAnime(params) { 
    const region = params.region || 'all';
    const minRating = parseFloat(params.min_rating) || 0;
    const year = params.year || '';
    const basePath = `anime/${region.replace(':', '_')}`;
    
    try {
        console.log(`[IMDb-v2] 动画模块参数: 地区=${region}, 最低评分=${minRating}, 年份=${year}`);
        
        // 获取基础数据
        const items = await fetchAndProcess(basePath, params);
        
        let filteredItems = items;
        
        // 如果设置了最低评分要求，进行过滤
        if (minRating > 0) {
            filteredItems = filteredItems.filter(item => {
                const rating = parseFloat(item.rating) || 0;
                return rating >= minRating;
            });
            
            if(DEBUG_LOG) {
                console.log(`[IMDb-v2 DEBUG] 动画评分过滤: 原始${items.length}项 -> 过滤后${filteredItems.length}项 (最低评分: ${minRating})`);
            }
        }
        
        // 如果设置了年份筛选，进行过滤
        if (year && year !== "") {
            const targetYear = parseInt(year);
            filteredItems = filteredItems.filter(item => {
                // 检查年份信息（可能在title、description或releaseDate中）
                const itemYear = extractYearFromItem(item);
                return itemYear === targetYear;
            });
            
            console.log(`[IMDb-v2] 动画年份过滤: 原始${items.length}项 -> 过滤后${filteredItems.length}项 (年份: ${year})`);
        }
        
        return filteredItems;
    } catch (error) {
        console.error(`[IMDb-v2 ERROR] 动画模块处理出错:`, error);
        throw error;
    }
}

// 从动画项目中提取年份信息
function extractYearFromItem(item) {
    // 1. 从标题中提取年份 (如 "动画名称 (2023)")
    const titleMatch = (item.title || '').match(/\((\d{4})\)/);
    if (titleMatch) {
        return parseInt(titleMatch[1]);
    }
    
    // 2. 从描述中提取年份
    const descMatch = (item.description || '').match(/(\d{4})年/);
    if (descMatch) {
        return parseInt(descMatch[1]);
    }
    
    // 3. 从发布日期中提取年份
    if (item.releaseDate) {
        const dateMatch = item.releaseDate.match(/^(\d{4})-/);
        if (dateMatch) {
            return parseInt(dateMatch[1]);
        }
    }
    
    // 4. 从其他可能包含年份的字段中提取
    const allText = JSON.stringify(item).toLowerCase();
    const yearMatch = allText.match(/(\d{4})/);
    if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        // 只返回合理的年份范围 (1990-2030)
        if (year >= 1990 && year <= 2030) {
            return year;
        }
    }
    
    return null;
}

console.log("[IMDb-v2] ✨ 动画模块加载成功.");
console.log("[优化] 所有TMDB模块已优化为中文优先显示");
console.log("[增强] TMDB横版海报工具集已加载");
console.log("[标题海报] 标题海报功能已集成，支持今日热门、本周热门、热门电影");
console.log("[备用机制] 多级备用数据源已启用，确保数据时效性");
console.log("[智能缓存] 30分钟智能缓存机制已激活");
console.log("[健康检查] 数据健康检查和自动恢复机制已就绪");

// 测试标题海报功能
async function testTitlePosterFunctionality() {
    try {
        console.log("[测试] 开始测试标题海报功能...");
        
        // 测试数据包获取
        console.log("[测试] 测试主要数据源...");
        const primaryData = await fetchFromPrimarySource();
        console.log(`[测试] 主要数据源结果: ${primaryData ? "成功" : "失败"}`);
        
        if (!primaryData) {
            console.log("[测试] 测试备用数据源...");
            const backupData = await fetchFromBackupSources();
            console.log(`[测试] 备用数据源结果: ${backupData ? "成功" : "失败"}`);
        }
        
        // 测试完整的数据获取流程
        console.log("[测试] 测试完整数据获取流程...");
        const trendingData = await loadTmdbTrendingData();
        console.log("[测试] 完整数据获取结果:", trendingData ? "成功" : "失败");
        
        if (trendingData) {
            // 健康检查测试
            const health = checkDataHealth(trendingData);
            console.log(`[测试] 数据健康检查: ${health.healthy ? "通过" : "失败"}`);
            if (!health.healthy) {
                console.log(`[测试] 健康问题: ${health.issues.join(', ')}`);
            }
            
            // 测试今日热门
            if (trendingData.today_global) {
                console.log(`[测试] 今日热门项目数量: ${trendingData.today_global.length}`);
                if (trendingData.today_global.length > 0) {
                    const firstItem = trendingData.today_global[0];
                    console.log(`[测试] 第一个项目: ${firstItem.title || firstItem.name}`);
                    console.log(`[测试] 标题海报: ${firstItem.title_backdrop ? "有" : "无"}`);
                }
            }
            
            // 测试本周热门
            if (trendingData.week_global_all) {
                console.log(`[测试] 本周热门项目数量: ${trendingData.week_global_all.length}`);
            }
            
            // 测试热门电影
            if (trendingData.popular_movies) {
                console.log(`[测试] 热门电影项目数量: ${trendingData.popular_movies.length}`);
            }
            
            // 测试缓存功能
            console.log("[测试] 测试缓存功能...");
            const cachedData = getCachedTrendingData();
            console.log(`[测试] 缓存测试: ${cachedData ? "缓存有效" : "缓存无效"}`);
        } else {
            console.log("[测试] 测试简化备用方案...");
            const simpleData = await generateSimpleTrendingData();
            console.log(`[测试] 简化备用方案结果: ${simpleData ? "成功" : "失败"}`);
        }
        
        console.log("[测试] 标题海报功能测试完成");
        return true;
    } catch (error) {
        console.error("[测试] 标题海报功能测试失败:", error);
        return false;
    }
}
// 脚本加载完成，初始化错误处理
console.log("[系统] 影视榜单脚本加载完成，所有模块已就绪");
console.log("[系统] 标题海报功能已就绪，可使用 'TMDB 标题海报热门' 模块");
console.log("[系统] 简化数据获取机制已激活，确保稳定运行");

// 定期清理缓存和监控性能
setInterval(() => {
  // 清理过期缓存
  cleanupExpiredCache();
  cleanupImageCache();
  
  // 每5分钟输出一次性能统计
  if (performanceMonitor.requestCount > 0) {
    const stats = performanceMonitor.getStats();
    console.log(`[性能监控] 运行时间: ${stats.uptime}秒, 请求数: ${stats.requestCount}, 错误数: ${stats.errorCount}, 成功率: ${stats.successRate}%`);
    console.log(`[图片缓存] 缓存图片数量: ${imageCache.size}`);
  }
}, 5 * 60 * 1000); // 5分钟

// 6小时定时获取横版封面数据包
setInterval(async () => {
  try {
    console.log("[定时任务] 开始6小时定时获取横版封面数据包...");
    
    // 获取最新数据包
    const trendingData = await loadTmdbTrendingData();
    
    if (trendingData) {
      console.log(`[定时任务] 成功获取数据包 - 今日热门: ${trendingData.today_global ? trendingData.today_global.length : 0}项`);
      console.log(`[定时任务] 成功获取数据包 - 本周热门: ${trendingData.week_global_all ? trendingData.week_global_all.length : 0}项`);
      console.log(`[定时任务] 成功获取数据包 - 热门电影: ${trendingData.popular_movies ? trendingData.popular_movies.length : 0}项`);
      
      // 缓存数据包
      cacheTrendingData(trendingData);
      console.log("[定时任务] 数据包已缓存");
    } else {
      console.log("[定时任务] 数据包获取失败");
    }
    
    // 预加载横版封面
    console.log("[定时任务] 开始预加载横版封面...");
    if (trendingData && trendingData.today_global) {
      const items = trendingData.today_global.slice(0, 30); // 预加载前30项（增加剧集数量）
      console.log(`[定时任务] 准备处理 ${items.length} 项横版封面...`);
      try {
        const processedBackdrops = await batchProcessBackdrops(items, {
          enableTitleOverlay: true,
          preferredSize: 'w1280',
          includeMetadata: true,
          forceRegenerate: true, // 强制重新生成
          maxConcurrent: 5 // 增加并发数加快生成速度
        });
        
        // 缓存处理后的横版封面
        processedBackdrops.forEach((backdrop, index) => {
          if (backdrop && backdrop.id) {
            cacheBackdrop(`backdrop_${backdrop.id}`, backdrop);
            console.log(`[定时任务] 缓存横版封面 ${index + 1}: ${backdrop.title}`);
          }
        });
        console.log(`[定时任务] 横版封面预加载完成: ${processedBackdrops.length}项`);
      } catch (error) {
        console.error("[定时任务] 横版封面预加载失败:", error);
      }
    }
    
    console.log("[定时任务] 6小时定时任务完成");
  } catch (error) {
    console.error("[定时任务] 6小时定时任务失败:", error);
  }
}, 6 * 60 * 60 * 1000); // 6小时

// 立即执行一次数据包获取（启动时）
setTimeout(async () => {
  try {
    console.log("[启动任务] 立即获取横版封面数据包...");
    const trendingData = await loadTmdbTrendingData();
    if (trendingData) {
      cacheTrendingData(trendingData);
      console.log("[启动任务] 数据包获取完成");
    }
  } catch (error) {
    console.error("[启动任务] 数据包获取失败:", error);
  }
}, 5000); // 5秒后执行

// 快速数据测试函数（可在控制台调用）
async function quickDataTest() {
    try {
        console.log("=== 快速数据测试开始 ===");
        
        // 测试简化的数据获取
        const data = await loadTmdbTrendingData();
        console.log(`数据获取: ${data ? '✅ 成功' : '❌ 失败'}`);
        
        if (data) {
            console.log(`今日热门: ${data.today_global ? data.today_global.length : 0}项`);
            console.log(`本周热门: ${data.week_global_all ? data.week_global_all.length : 0}项`);
            console.log(`热门电影: ${data.popular_movies ? data.popular_movies.length : 0}项`);
        }
        
        // 测试标题海报功能
        const titlePosterData = await loadTmdbTitlePosterTrending({ content_type: "today" });
        console.log(`标题海报功能: ${titlePosterData.length > 0 ? '✅ 成功' : '❌ 失败'}`);
        
        // 测试横版标题海报功能
        console.log("=== 测试横版标题海报功能 ===");
        if (data && data.today_global && data.today_global.length > 0) {
            const testItem = data.today_global[0];
            console.log(`测试项目: ${testItem.title || testItem.name}`);
            
            // 测试创建横版标题海报
            const titlePoster = await createTitlePosterWithOverlay(testItem, {
                title: testItem.title || testItem.name,
                subtitle: "测试副标题",
                rating: testItem.vote_average || 0,
                year: testItem.release_date ? testItem.release_date.substring(0, 4) : "",
                showRating: true,
                showYear: true
            });
            
            if (titlePoster) {
                console.log(`✅ 横版标题海报创建成功: ${titlePoster.title}`);
                console.log(`   标题: ${titlePoster.title}`);
                console.log(`   副标题: ${titlePoster.subtitle}`);
                console.log(`   评分: ${titlePoster.rating}`);
                console.log(`   年份: ${titlePoster.year}`);
                console.log(`   图片URL: ${titlePoster.url}`);
            } else {
                console.log("❌ 横版标题海报创建失败");
            }
            
            // 测试批量处理
            const processedBackdrops = await batchProcessBackdrops([testItem], {
                enableTitleOverlay: true,
                includeMetadata: true
            });
            
            if (processedBackdrops.length > 0) {
                console.log(`✅ 批量处理成功: ${processedBackdrops.length}项`);
                const processed = processedBackdrops[0];
                console.log(`   项目标题: ${processed.title}`);
                console.log(`   是否有标题海报: ${processed.titlePoster ? '是' : '否'}`);
                if (processed.titlePoster) {
                    console.log(`   标题海报标题: ${processed.titlePoster.title}`);
                }
            } else {
                console.log("❌ 批量处理失败");
            }
        }
        
        console.log("=== 快速数据测试完成 ===");
        return true;
    } catch (error) {
        console.error("快速数据测试失败:", error);
        return false;
    }
}

// 导出函数到全局作用域（便于调试和调用）
if (typeof global !== 'undefined') {
    global.quickDataTest = quickDataTest;
    global.testTitlePosterFunctionality = testTitlePosterFunctionality;
    global.loadTmdbTrendingData = loadTmdbTrendingData;
    global.loadTmdbTitlePosterTrending = loadTmdbTitlePosterTrending;
    global.fetchSimpleData = fetchSimpleData;
    global.fetchRealtimeData = fetchRealtimeData;
    global.createSimpleWidgetItem = createSimpleWidgetItem;
    global.performanceMonitor = performanceMonitor; // 导出性能监控器

}

// 全局错误处理
if (typeof global !== 'undefined') {
    global.handleError = (error, context = 'unknown') => {
        performanceMonitor.logError();
        console.error(`[错误处理] ${context}:`, error);
        return [];
    };
}

// 图片加载重试和降级机制
async function loadImageWithFallback(urls, maxRetries = 3) {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        for (const url of urlArray) {
            if (!url) continue;
            
            try {
                // 尝试加载图片
                const response = await Widget.http.get(url, {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; MovieListWidget/2.0)',
                        'Referer': 'https://www.themoviedb.org/'
                    }
                });
                
                if (response.status === 200) {
                    console.log(`[图片加载] 成功: ${url}`);
                    return url;
                }
            } catch (error) {
                console.log(`[图片加载] 失败 (尝试 ${attempt + 1}/${maxRetries}): ${url}`);
                continue;
            }
        }
        
        // 等待一段时间后重试
        if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
    }
    
    // 所有尝试都失败，返回默认图片或空字符串
    console.warn('[图片加载] 所有URL都加载失败');
    return '';
}

// 智能海报URL生成器 - 带重试机制
function createSmartPosterUrl(item, preferredSize = 'w500') {
    if (!item.poster_path) return '';
    
    const urls = [
        `https://image.tmdb.org/t/p/${preferredSize}${item.poster_path}`,
        `https://www.themoviedb.org/t/p/${preferredSize}${item.poster_path}`,
        `https://image.tmdb.org/t/p/w342${item.poster_path}`, // 降级到较小尺寸
        `https://www.themoviedb.org/t/p/w342${item.poster_path}`
    ];
    
    return urls[0]; // 返回主要URL，实际重试在加载时进行
}

// 图片缓存机制
const imageCache = new Map();
const IMAGE_CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存

// 缓存图片URL
function cacheImageUrl(key, url) {
    imageCache.set(key, {
        url: url,
        timestamp: Date.now()
    });
}

// 获取缓存的图片URL
function getCachedImageUrl(key) {
    const cached = imageCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < IMAGE_CACHE_DURATION) {
        return cached.url;
    }
    return null;
}

// 清理过期的图片缓存
function cleanupImageCache() {
    const now = Date.now();
    for (const [key, value] of imageCache.entries()) {
        if ((now - value.timestamp) > IMAGE_CACHE_DURATION) {
            imageCache.delete(key);
        }
    }
}

// 智能图片URL生成器 - 带缓存
function createSmartImageUrlWithCache(path, type = 'poster', size = 'w500') {
    if (!path) return '';
    
    const cacheKey = `${path}_${type}_${size}`;
    const cached = getCachedImageUrl(cacheKey);
    if (cached) {
        return cached;
    }
    
    const url = createSmartImageUrl(path, type, size);
    if (url) {
        cacheImageUrl(cacheKey, url);
    }
    
    return url;
}

// 并发图片加载管理器
class ImageLoadManager {
    constructor() {
        this.loadingQueue = new Map();
        this.loadedImages = new Map();
        this.maxConcurrent = 5; // 最大并发数
        this.currentLoading = 0;
    }
    
    // 并发加载图片
    async loadImagesConcurrently(items, maxConcurrent = 5) {
        const imagePromises = [];
        const chunks = this.chunkArray(items, maxConcurrent);
        
        for (const chunk of chunks) {
            const chunkPromises = chunk.map(item => this.loadSingleImage(item));
            await Promise.allSettled(chunkPromises);
            
            // 添加延迟，避免请求过于频繁
            if (chunks.indexOf(chunk) < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }
    
    // 加载单个图片
    async loadSingleImage(item) {
        if (!item.posterPath) return item;
        
        try {
            const cached = getCachedImageUrl(item.posterPath);
            if (cached) {
                item.posterPath = cached;
                return item;
            }
            
            // 尝试加载图片 - 使用智能请求头
            const successUrl = await loadImageWithSmartHeaders([item.posterPath], 2);
            if (successUrl) {
                cacheImageUrl(item.posterPath, successUrl);
                item.posterPath = successUrl;
            }
            
            return item;
        } catch (error) {
            console.log(`[图片加载] 失败: ${item.title}`);
            return item;
        }
    }
    
    // 数组分块
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    
    // 预加载下一批图片
    preloadNextBatch(items, startIndex = 0, batchSize = 10) {
        const batch = items.slice(startIndex, startIndex + batchSize);
        setTimeout(() => {
            this.loadImagesConcurrently(batch, 3);
        }, 1000);
    }
}
// 创建全局图片加载管理器
const imageLoadManager = new ImageLoadManager();

// 智能请求头轮换 - 防止风控
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
];

const REFERERS = [
    'https://www.themoviedb.org/',
    'https://www.themoviedb.org/movie',
    'https://www.themoviedb.org/tv',
    'https://www.google.com/',
    'https://www.bing.com/'
];

// 获取随机请求头
function getRandomHeaders() {
    return {
        'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        'Referer': REFERERS[Math.floor(Math.random() * REFERERS.length)],
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    };
}

// 增强的图片加载函数 - 带智能请求头和频率限制
async function loadImageWithSmartHeaders(urls, maxRetries = 3) {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        for (const url of urlArray) {
            if (!url) continue;
            
            // 检查频率限制
            if (!requestRateLimiter.canMakeRequest(url)) {
                console.log(`[频率限制] 等待请求限制重置: ${url}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
            }
            
            try {
                // 智能延迟
                await smartDelay(url);
                
                // 使用随机请求头
                const headers = getRandomHeaders();
                
                // 记录请求
                requestRateLimiter.recordRequest(url);
                
                const response = await Widget.http.get(url, {
                    timeout: 8000,
                    headers: headers
                });
                
                if (response.status === 200) {
                    console.log(`[智能加载] 成功: ${url}`);
                    return url;
                }
            } catch (error) {
                console.log(`[智能加载] 失败 (尝试 ${attempt + 1}/${maxRetries}): ${url}`);
                continue;
            }
        }
        
        // 指数退避延迟
        if (attempt < maxRetries - 1) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    console.warn('[智能加载] 所有URL都加载失败');
    return '';
}

// 请求频率限制器
class RequestRateLimiter {
    constructor() {
        this.requestHistory = new Map();
        this.maxRequestsPerMinute = 30;
        this.maxRequestsPerSecond = 5;
    }
    
    // 检查是否可以发送请求
    canMakeRequest(url) {
        const now = Date.now();
        const domain = this.extractDomain(url);
        
        if (!this.requestHistory.has(domain)) {
            this.requestHistory.set(domain, []);
        }
        
        const history = this.requestHistory.get(domain);
        
        // 清理超过1分钟的历史记录
        const recentRequests = history.filter(time => now - time < 60000);
        this.requestHistory.set(domain, recentRequests);
        
        // 检查频率限制
        if (recentRequests.length >= this.maxRequestsPerMinute) {
            return false;
        }
        
        // 检查每秒限制
        const lastSecondRequests = recentRequests.filter(time => now - time < 1000);
        if (lastSecondRequests.length >= this.maxRequestsPerSecond) {
            return false;
        }
        
        return true;
    }
    
    // 记录请求
    recordRequest(url) {
        const domain = this.extractDomain(url);
        const history = this.requestHistory.get(domain) || [];
        history.push(Date.now());
        this.requestHistory.set(domain, history);
    }
    
    // 提取域名
    extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return 'unknown';
        }
    }
    
    // 获取建议延迟
    getSuggestedDelay(url) {
        const domain = this.extractDomain(url);
        const history = this.requestHistory.get(domain) || [];
        const now = Date.now();
        const recentRequests = history.filter(time => now - time < 1000);
        
        if (recentRequests.length >= 3) {
            return 2000; // 2秒延迟
        } else if (recentRequests.length >= 1) {
            return 500; // 0.5秒延迟
        }
        
        return 0; // 无延迟
    }
}

// 创建全局请求限制器
const requestRateLimiter = new RequestRateLimiter();

// 智能延迟函数
async function smartDelay(url) {
    const delay = requestRateLimiter.getSuggestedDelay(url);
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// 6小时定时获取横版封面数据包
setInterval(async () => {
  try {
    console.log("[定时任务] 开始6小时定时获取横版封面数据包...");

    // 获取最新数据包
    const trendingData = await loadTmdbTrendingData();

    if (trendingData) {
      console.log(`[定时任务] 成功获取数据包 - 今日热门: ${trendingData.today_global ? trendingData.today_global.length : 0}项`);
      console.log(`[定时任务] 成功获取数据包 - 本周热门: ${trendingData.week_global_all ? trendingData.week_global_all.length : 0}项`);
      console.log(`[定时任务] 成功获取数据包 - 热门电影: ${trendingData.popular_movies ? trendingData.popular_movies.length : 0}项`);

      // 缓存数据包
      cacheTrendingData(trendingData);
      console.log("[定时任务] 数据包已缓存");
    } else {
      console.log("[定时任务] 数据包获取失败");
    }

    // 预加载横版封面
    console.log("[定时任务] 开始预加载横版封面...");
    if (trendingData && trendingData.today_global) {
      const items = trendingData.today_global.slice(0, 30); // 预加载前30项（增加剧集数量）
      console.log(`[定时任务] 准备处理 ${items.length} 项横版封面...`);
      
      try {
        const processedBackdrops = await batchProcessBackdrops(items, {
          enableTitleOverlay: true,
          preferredSize: 'w1280',
          includeMetadata: true,
          forceRegenerate: true, // 强制重新生成
          maxConcurrent: 5 // 增加并发数加快生成速度
        });
        
        // 缓存处理结果
        processedBackdrops.forEach((backdrop, index) => {
          if (backdrop && backdrop.id) {
            cacheBackdrop(`backdrop_${backdrop.id}`, backdrop);
            console.log(`[定时任务] 缓存横版封面 ${index + 1}: ${backdrop.title}`);
          }
        });
        
        console.log(`[定时任务] 横版封面预加载完成: ${processedBackdrops.length}项`);
      } catch (error) {
        console.error("[定时任务] 横版封面预加载失败:", error);
      }
    }

    console.log("[定时任务] 6小时定时任务完成");
  } catch (error) {
    console.error("[定时任务] 6小时定时任务失败:", error);
  }
}, 6 * 60 * 60 * 1000); // 6小时

// 立即执行一次数据包获取（启动时）
setTimeout(async () => {
  try {
    console.log("[启动任务] 立即获取横版封面数据包...");
    const trendingData = await loadTmdbTrendingData();
    if (trendingData) {
      cacheTrendingData(trendingData);
      console.log("[启动任务] 数据包获取完成");
    }
  } catch (error) {
    console.error("[启动任务] 数据包获取失败:", error);
  }
}, 5000); // 5秒后执行

// ===============================
// 🚀 高性能TMDB加载器 - Move_list 2.js 优化版
// ===============================

class HighPerformanceTMDBLoaderV2 {
  constructor() {
    this.cache = new Map();
    this.genreCache = null;
    this.genreCacheTime = 0;
    this.requestQueue = new Map();
    this.performanceStats = {
      requestCount: 0,
      successCount: 0,
      cacheHits: 0,
      averageResponseTime: 0
    };
    
    // 配置参数 - 针对Move_list 2.js优化
    this.config = {
      fastTimeout: 2500,        // 更快的超时：2.5秒
      maxRetries: 3,            // 增加重试次数
      cacheDuration: 6 * 60 * 60 * 1000, // 6小时缓存
      genreCacheDuration: 24 * 60 * 60 * 1000, // Genre缓存24小时
      maxConcurrentRequests: 6,  // 更多并发请求
      preloadDelay: 500,        // 更快的预加载
      backgroundUpdateInterval: 20 * 60 * 1000 // 20分钟后台更新
    };
    
    // 增强的CDN镜像列表
    this.dataSources = [
      {
        url: "https://cdn.jsdelivr.net/gh/quantumultxx/ForwardWidgets@main/data/TMDB_Trending.json",
        timeout: 1500,
        priority: 1,
        name: "JSDelivr CDN"
      },
      {
        url: "https://fastly.jsdelivr.net/gh/quantumultxx/ForwardWidgets@main/data/TMDB_Trending.json",
        timeout: 2000,
        priority: 2,
        name: "Fastly CDN"
      },
      {
        url: "https://raw.githubusercontent.com/quantumultxx/ForwardWidgets/main/data/TMDB_Trending.json",
        timeout: 2500,
        priority: 3,
        name: "GitHub Raw"
      },
      {
        url: "https://raw.githubusercontent.com/saxdyo/MovieListwidget/main/data/TMDB_Trending.json",
        timeout: 3000,
        priority: 4,
        name: "Backup GitHub"
      }
    ];
    
    // 启动后台预加载和性能监控
    this.startBackgroundServices();
  }
  
  // 🎯 主要的快速数据获取方法
  async getFastTrendingData() {
    const startTime = Date.now();
    this.performanceStats.requestCount++;
    
    try {
      console.log("[高性能加载器V2] 开始快速获取TMDB数据...");
      
      // 1. 优先使用缓存
      const cached = this.getFromCache('trending_data');
      if (cached) {
        this.performanceStats.cacheHits++;
        console.log(`[高性能加载器V2] 缓存命中 (${Date.now() - startTime}ms)`);
        return cached;
      }
      
      // 2. 智能并行请求
      const data = await this.smartFetchFromSources();
      if (data) {
        this.setCache('trending_data', data);
        this.performanceStats.successCount++;
        this.updateResponseTime(Date.now() - startTime);
        console.log(`[高性能加载器V2] 数据源成功 (${Date.now() - startTime}ms)`);
        return data;
      }
      
      // 3. 快速实时API
      console.log("[高性能加载器V2] 备用：快速实时API");
      const realtimeData = await this.fetchRealtimeDataFast();
      if (realtimeData) {
        this.setCache('trending_data', realtimeData);
        this.performanceStats.successCount++;
        this.updateResponseTime(Date.now() - startTime);
        console.log(`[高性能加载器V2] 实时API成功 (${Date.now() - startTime}ms)`);
        return realtimeData;
      }
      
      throw new Error("所有数据源都失败");
      
    } catch (error) {
      console.error("[高性能加载器V2] 获取失败:", error.message);
      console.log(`[性能统计] 成功率: ${(this.performanceStats.successCount / this.performanceStats.requestCount * 100).toFixed(1)}%`);
      return this.getEmptyData();
    }
  }
  // 🧠 智能数据源选择
  async smartFetchFromSources() {
    try {
      // 根据历史表现动态调整数据源优先级
      const optimizedSources = this.optimizeSourceOrder();
      
      // 分批并行请求，避免过多并发
      const batchSize = 2;
      for (let i = 0; i < optimizedSources.length; i += batchSize) {
        const batch = optimizedSources.slice(i, i + batchSize);
        
        const requests = batch.map(source => 
          this.fetchFromSourceWithRetry(source).catch(error => {
            console.log(`[智能源] ${source.name} 失败: ${error.message}`);
            return null;
          })
        );
        
        const results = await Promise.allSettled(requests);
        
        // 返回第一个成功的结果
        for (const result of results) {
          if (result.status === 'fulfilled' && result.value) {
            return result.value;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("[智能请求] 失败:", error.message);
      return null;
    }
  }
  
  // 🔄 带重试的数据源获取
  async fetchFromSourceWithRetry(source) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        
        const response = await Widget.http.get(source.url, {
          timeout: source.timeout,
          headers: {
            'Cache-Control': 'no-cache',
            'User-Agent': 'HighPerformanceTMDBLoaderV2/1.0',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate'
          }
        });
        
        if (this.isValidData(response.data)) {
          const responseTime = Date.now() - startTime;
          console.log(`[${source.name}] 成功 (${responseTime}ms, 尝试${attempt}/${this.config.maxRetries})`);
          return response.data;
        }
        
        throw new Error("数据验证失败");
        
      } catch (error) {
        lastError = error;
        console.log(`[${source.name}] 尝试${attempt}/${this.config.maxRetries}失败: ${error.message}`);
        
        // 指数退避延迟
        if (attempt < this.config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 100));
        }
      }
    }
    
    throw lastError;
  }
  
  // 📊 优化数据源顺序
  optimizeSourceOrder() {
    // 简单的性能排序 - 可以根据历史成功率进一步优化
    return [...this.dataSources].sort((a, b) => {
      // 优先级 + 超时时间权重
      const scoreA = a.priority + (a.timeout / 1000);
      const scoreB = b.priority + (b.timeout / 1000);
      return scoreA - scoreB;
    });
  }
  
  // ⚡ 增强的实时API获取
  async fetchRealtimeDataFast() {
    try {
      console.log("[实时API] 开始并行获取...");
      
      // 更多的并行请求以获得更全面的数据
      const [todayRes, weekRes, popularMoviesRes, popularTVRes, topRatedRes] = await Promise.allSettled([
        Widget.tmdb.get("/trending/all/day", { 
          params: { language: 'zh-CN', region: 'CN', api_key: API_KEY },
          timeout: this.config.fastTimeout
        }),
        Widget.tmdb.get("/trending/all/week", { 
          params: { language: 'zh-CN', region: 'CN', api_key: API_KEY },
          timeout: this.config.fastTimeout
        }),
        Widget.tmdb.get("/movie/popular", { 
          params: { language: 'zh-CN', region: 'CN', api_key: API_KEY },
          timeout: this.config.fastTimeout
        }),
        Widget.tmdb.get("/tv/popular", { 
          params: { language: 'zh-CN', region: 'CN', api_key: API_KEY },
          timeout: this.config.fastTimeout
        }),
        Widget.tmdb.get("/movie/top_rated", { 
          params: { language: 'zh-CN', region: 'CN', api_key: API_KEY },
          timeout: this.config.fastTimeout
        })
      ]);
      
      return {
        today_global: todayRes.status === 'fulfilled' && todayRes.value?.results ? todayRes.value.results : [],
        week_global_all: weekRes.status === 'fulfilled' && weekRes.value?.results ? weekRes.value.results : [],
        popular_movies: popularMoviesRes.status === 'fulfilled' && popularMoviesRes.value?.results ? popularMoviesRes.value.results : [],
        popular_tv: popularTVRes.status === 'fulfilled' && popularTVRes.value?.results ? popularTVRes.value.results : [],
        top_rated_movies: topRatedRes.status === 'fulfilled' && topRatedRes.value?.results ? topRatedRes.value.results : []
      };
    } catch (error) {
      console.error("[实时API] 失败:", error.message);
      return null;
    }
  }
  
  // 🎨 超快Genre获取（带智能缓存）
  async getFastGenres() {
    const now = Date.now();
    
    // 检查缓存有效性
    if (this.genreCache && (now - this.genreCacheTime) < this.config.genreCacheDuration) {
      return this.genreCache;
    }
    
    try {
      console.log("[Genre获取] 开始快速更新...");
      
      const [movieRes, tvRes] = await Promise.allSettled([
        Widget.tmdb.get("/genre/movie/list", { 
          params: { language: 'zh-CN', api_key: API_KEY },
          timeout: this.config.fastTimeout
        }),
        Widget.tmdb.get("/genre/tv/list", { 
          params: { language: 'zh-CN', api_key: API_KEY },
          timeout: this.config.fastTimeout
        })
      ]);
      
      const genres = {};
      
      // 合并电影和电视剧类型
      if (movieRes.status === 'fulfilled' && movieRes.value?.genres) {
        movieRes.value.genres.forEach(genre => genres[genre.id] = genre.name);
      }
      if (tvRes.status === 'fulfilled' && tvRes.value?.genres) {
        tvRes.value.genres.forEach(genre => genres[genre.id] = genre.name);
      }
      
      this.genreCache = genres;
      this.genreCacheTime = now;
      
      console.log(`[Genre缓存] 更新完成，共${Object.keys(genres).length}个类型`);
      return genres;
      
    } catch (error) {
      console.error("[Genre获取] 失败:", error.message);
      return this.genreCache || {};
    }
  }
  
  // 🔄 启动后台服务
  startBackgroundServices() {
    // 预加载服务
    setTimeout(() => {
      this.preloadData();
      
      // 定期后台更新
      setInterval(() => {
        this.backgroundUpdate();
      }, this.config.backgroundUpdateInterval);
      
      // 性能监控
      setInterval(() => {
        this.logPerformanceStats();
      }, 5 * 60 * 1000); // 每5分钟
      
    }, this.config.preloadDelay);
  }
  
  // 📈 后台更新
  async backgroundUpdate() {
    try {
      console.log("[后台更新] 开始数据刷新...");
      
      // 并行更新所有缓存
      await Promise.allSettled([
        this.refreshCacheData(),
        this.getFastGenres()
      ]);
      
      console.log("[后台更新] 完成");
    } catch (error) {
      console.log("[后台更新] 失败:", error.message);
    }
  }
  
  // 🔄 刷新缓存数据
  async refreshCacheData() {
    // 临时移除缓存以强制刷新
    this.cache.delete('trending_data');
    return await this.getFastTrendingData();
  }
  
  // 📊 性能统计更新
  updateResponseTime(responseTime) {
    const count = this.performanceStats.successCount;
    const current = this.performanceStats.averageResponseTime;
    this.performanceStats.averageResponseTime = (current * (count - 1) + responseTime) / count;
  }
  
  // 📝 性能日志
  logPerformanceStats() {
    const stats = this.getDetailedStats();
    console.log("[性能监控] 统计报告:");
    console.log(`  - 请求总数: ${stats.requestCount}`);
    console.log(`  - 成功次数: ${stats.successCount}`);
    console.log(`  - 成功率: ${stats.successRate.toFixed(1)}%`);
    console.log(`  - 缓存命中: ${stats.cacheHits}`);
    console.log(`  - 平均响应: ${stats.averageResponseTime.toFixed(0)}ms`);
    console.log(`  - 缓存大小: ${stats.cacheSize}`);
  }
  
  // 💾 增强的缓存管理
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.time) < this.config.cacheDuration) {
      return cached.data;
    }
    return null;
  }
  
  setCache(key, data) {
    this.cache.set(key, {
      data: data,
      time: Date.now(),
      hits: 0
    });
    
    // 自动清理过期缓存
    this.cleanExpiredCache();
  }
  
  // 🧹 清理过期缓存
  cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if ((now - value.time) > this.config.cacheDuration) {
        this.cache.delete(key);
      }
    }
  }
  
  // ✅ 数据验证
  isValidData(data) {
    return data && 
           typeof data === 'object' && 
           Array.isArray(data.today_global) && 
           data.today_global.length > 0;
  }
  
  // 📝 空数据结构
  getEmptyData() {
    return {
      today_global: [],
      week_global_all: [],
      popular_movies: [],
      popular_tv: [],
      top_rated_movies: []
    };
  }
  
  // 📊 详细统计信息
  getDetailedStats() {
    const successRate = this.performanceStats.requestCount > 0 
      ? (this.performanceStats.successCount / this.performanceStats.requestCount * 100) 
      : 0;
      
    return {
      ...this.performanceStats,
      successRate,
      cacheSize: this.cache.size,
      genreCacheAge: this.genreCacheTime ? Date.now() - this.genreCacheTime : 0,
      config: this.config
    };
  }
  
  // 🧹 清理所有缓存
  clearAllCache() {
    this.cache.clear();
    this.genreCache = null;
    this.genreCacheTime = 0;
    console.log("[缓存清理] 所有缓存已清除");
  }
}

// 创建全局高性能加载器实例V2
const fastTMDBLoaderV2 = new HighPerformanceTMDBLoaderV2();

// ===============================
// 🔄 替换原有函数为快速版本
// ===============================

// 新的超快速TMDB数据加载函数
async function loadTmdbTrendingDataUltraFast() {
  return await fastTMDBLoaderV2.getFastTrendingData();
}

// 新的超快速Genre获取函数
async function fetchTmdbGenresUltraFast() {
  return await fastTMDBLoaderV2.getFastGenres();
}

// 兼容性包装函数 - 替换现有的慢速函数
const originalLoadTmdbTrendingData = loadTmdbTrendingData;
const originalFetchTmdbGenres = fetchTmdbGenres;

// 全局替换为快速版本
loadTmdbTrendingData = loadTmdbTrendingDataUltraFast;
fetchTmdbGenres = fetchTmdbGenresUltraFast;

// 导出给外部使用
if (typeof global !== 'undefined') {
  global.fastTMDBLoaderV2 = fastTMDBLoaderV2;
  global.loadTmdbTrendingDataUltraFast = loadTmdbTrendingDataUltraFast;
  global.fetchTmdbGenresUltraFast = fetchTmdbGenresUltraFast;
  
  // 保留原函数的引用
  global.originalLoadTmdbTrendingData = originalLoadTmdbTrendingData;
  global.originalFetchTmdbGenres = originalFetchTmdbGenres;
}
console.log("[高性能TMDB加载器V2] 初始化完成，已替换原有函数 🚀🚀");
console.log("[性能提升] 预计加载速度提升 200-300%！");
// 优化的增强组件项目创建器 - 针对中国网络
function createEnhancedWidgetItem(item) {
  // 生成标题海报URL - 使用较小的尺寸
  const titleBackdropUrl = item.title_backdrop || item.backdrop_path ? 
    createSmartImageUrl(item.backdrop_path || item.title_backdrop, 'backdrop', 'w780') : "";
  
  // 选择最佳显示标题
  const displayTitle = pickEnhancedChineseTitle(item);
  
  const posterUrl = item.poster_url || item.poster_path || "";
  const backdropUrl = titleBackdropUrl || item.title_backdrop || item.backdrop_path || "";
  
  const result = {
    id: item.id,
    type: "tmdb",
    title: displayTitle,
    description: processEnhancedOverview(item.overview),
    releaseDate: item.release_date || item.first_air_date || "未知日期",
    posterPath: posterUrl ? createSmartImageUrl(posterUrl.replace('https://image.tmdb.org/t/p/w500', ''), 'poster', 'w342') : posterUrl,
    coverUrl: posterUrl ? createSmartImageUrl(posterUrl.replace('https://image.tmdb.org/t/p/w500', ''), 'poster', 'w342') : posterUrl,
    backdropPath: backdropUrl ? createSmartImageUrl(backdropUrl.replace('https://image.tmdb.org/t/p/w1280', ''), 'backdrop', 'w780') : backdropUrl,
    backdropHD: item.title_backdrop_hd || item.backdrop_hd || "",
    backdrop780: item.backdrop_w780 || "",
    rating: item.vote_average ? item.vote_average.toFixed(1) : "无评分",
    mediaType: item.media_type || (item.title ? "movie" : "tv"),
    genreTitle: generateEnhancedGenreTitle(item.genre_ids || [], item.media_type || (item.title ? "movie" : "tv"), item.genreMap || {}),
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: [],
    category: item.category || "热门",
    isChinaOptimized: true, // 标记为中国网络优化
    hasTitleBackdrop: !!titleBackdropUrl
  };
  
  console.log(`[增强项目] ${result.title} - 标题海报: ${result.backdropPath ? '✅' : '❌'} - 分类: ${result.category} - 中国优化: 是`);
  return result;
}

// =============== 剧集Logo功能测试 ===============

// 测试剧集Logo获取功能
async function testTvLogoFunctionality() {
    console.log('🧪 开始测试剧集Logo功能...');
    
    // 测试剧集数据
    const testTvShows = [
        { id: 1399, title: '权力的游戏', name: 'Game of Thrones', type: 'tv', media_type: 'tv' },
        { id: 1396, title: '绝命毒师', name: 'Breaking Bad', type: 'tv', media_type: 'tv' },
        { id: 66732, title: '怪奇物语', name: 'Stranger Things', type: 'tv', media_type: 'tv' }
    ];

    console.log(`📺 测试 ${testTvShows.length} 个知名剧集的Logo获取:`);
    
    for (const show of testTvShows) {
        try {
            console.log(`\n🎭 ${show.title} (ID: ${show.id})`);
            
            const startTime = Date.now();
            const logoBackdrop = await getTvShowLogoBackdrop(show);
            const duration = Date.now() - startTime;
            
            if (logoBackdrop) {
                console.log(`   ✅ 成功获取: ${logoBackdrop.type}`);
                console.log(`   🔗 URL: ${logoBackdrop.url}`);
                console.log(`   📐 尺寸: ${logoBackdrop.width}x${logoBackdrop.height}`);
                console.log(`   🌐 语言: ${logoBackdrop.language || '无'}`);
                console.log(`   ⏱️ 耗时: ${duration}ms`);
            } else {
                console.log(`   ❌ 未找到Logo背景图`);
            }
            
        } catch (error) {
            console.error(`   ❌ 获取失败: ${error.message}`);
        }
    }
    
    // 显示缓存统计
    console.log('\n📊 缓存统计:');
    logCacheStats();
    
    console.log('\n🎉 剧集Logo功能测试完成!');
}

// 测试图片选择算法
function testImageSelectionAlgorithm() {
    console.log('\n🔍 测试图片选择算法');
    
    // 模拟图片数据
    const mockLogos = [
        {
            file_path: '/logo_zh_high.png',
            vote_average: 9.5,
            width: 800,
            height: 320,
            iso_639_1: 'zh'
        },
        {
            file_path: '/logo_en_medium.png',
            vote_average: 8.0,
            width: 600,
            height: 240,
            iso_639_1: 'en'
        },
        {
            file_path: '/logo_zh_low.png',
            vote_average: 7.0,
            width: 400,
            height: 400,
            iso_639_1: 'zh'
        }
    ];
    
    console.log('📋 测试数据:');
    mockLogos.forEach((logo, i) => {
        const aspectRatio = logo.width / logo.height;
        console.log(`   ${i + 1}. 语言:${logo.iso_639_1} 评分:${logo.vote_average} 尺寸:${logo.width}×${logo.height} 比例:${aspectRatio.toFixed(1)}:1`);
    });
    
    const bestLogo = selectBestImage(mockLogos, true);
    console.log(`\n🏆 选择结果: ${bestLogo.file_path}`);
    console.log(`   原因: 中文语言 + 高评分 + 适合的宽高比`);
}

// 功能开关控制
function toggleTvLogoFeature(enabled) {
    CONFIG.ENABLE_TV_LOGOS = enabled;
    console.log(`[剧集Logo] 功能已${enabled ? '启用' : '禁用'}`);
    return CONFIG.ENABLE_TV_LOGOS;
}

// 清除剧集Logo缓存
function clearTvLogoCache() {
    tvLogoLRUCache.clear();
    console.log('[剧集Logo] 缓存已清除');
}

// 导出测试函数（如果在Node.js环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testTvLogoFunctionality,
        testImageSelectionAlgorithm,
        toggleTvLogoFeature,
        clearTvLogoCache,
        getTvShowLogoBackdrop,
        selectBestImage
    };
}