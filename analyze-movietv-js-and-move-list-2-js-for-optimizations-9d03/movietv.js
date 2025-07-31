// ========== 优化工具与结构集成（见注释区分，原有业务逻辑保留） ==========

// 集中配置区
const CONFIG = {
  CACHE_DURATION: 30 * 60 * 1000,
  FRESH_DATA_DURATION: 2 * 60 * 60 * 1000,
  MAX_ITEMS: 30,
  MAX_CONCURRENT: typeof process !== 'undefined' && process.env.MAX_CONCURRENT ? parseInt(process.env.MAX_CONCURRENT) : 5,
  API_KEY: (typeof process !== 'undefined' && process.env.TMDB_API_KEY) ? process.env.TMDB_API_KEY : 'f3ae69ddca232b56265600eb919d46ab',
  LOG_LEVEL: typeof process !== 'undefined' && process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
  LRU_CACHE_SIZE: 100
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

// ========== 以上为优化内容，原有业务逻辑如下 ==========
// ... existing code ...