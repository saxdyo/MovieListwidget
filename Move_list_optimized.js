// Move_list_optimized.js
// 优化版：见注释说明各优化点

// ========== 集中配置区（优化点4） ==========
const CONFIG = {
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  FRESH_DATA_DURATION: 2 * 60 * 60 * 1000, // 2小时内数据新鲜
  MAX_ITEMS: 30, // 横版标题海报最大条数
  MAX_CONCURRENT: typeof process !== 'undefined' && process.env.MAX_CONCURRENT ? parseInt(process.env.MAX_CONCURRENT) : 5, // 并发数支持环境变量
  API_KEY: (typeof process !== 'undefined' && process.env.TMDB_API_KEY) ? process.env.TMDB_API_KEY : 'f3ae69ddca232b56265600eb919d46ab', // 优先环境变量
  LOG_LEVEL: typeof process !== 'undefined' && process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
  LRU_CACHE_SIZE: 100 // LRU缓存最大容量
};

// ========== WidgetMetadata（原始结构迁移） ==========
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
    // ...（此处省略，后续可直接复制原有modules结构）
  ]
};

// ========== 日志工具（优化点5） ==========
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

// ========== LRU缓存实现与缓存统计（优化点1） ==========
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
      // 淘汰最久未用
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

// 横版标题海报缓存、数据缓存实例
const backdropLRUCache = new LRUCache(CONFIG.LRU_CACHE_SIZE);
const trendingDataLRUCache = new LRUCache(10); // 热门数据缓存可小些

// 缓存操作封装
function getCachedBackdrop(key) {
  return backdropLRUCache.get(key);
}
function cacheBackdrop(key, data) {
  backdropLRUCache.set(key, data);
}
function getCachedTrendingData() {
  return trendingDataLRUCache.get('trending_data');
}
function cacheTrendingData(data) {
  trendingDataLRUCache.set('trending_data', data);
}

// 缓存命中率日志
function logCacheStats() {
  log(`[横版标题海报缓存] 命中率: ${JSON.stringify(backdropLRUCache.stats())}`, 'info');
  log(`[热门数据缓存] 命中率: ${JSON.stringify(trendingDataLRUCache.stats())}`, 'info');
}

// ========== 动态并发控制与任务队列（优化点2） ==========
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

// 用于横版标题海报批量生成等场景
function getPromisePool(concurrent) {
  return new PromisePool(concurrent || CONFIG.MAX_CONCURRENT);
}

// 并发处理示例：批量生成横版标题海报
async function batchGenerateBackdrops(items, generatorFn, concurrent) {
  const pool = getPromisePool(concurrent);
  const tasks = items.map(item => () => generatorFn(item));
  return await pool.all(tasks);
}

// ========== 横版标题海报生成增量优化（优化点3） ==========
// 简单哈希函数（可替换为更强hash算法）
function simpleHash(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit int
  }
  return hash;
}

// 生成条目指纹
function getBackdropFingerprint(item) {
  // 只要影响横版标题海报的字段变了，指纹就会变
  const key = [
    item.id,
    item.title,
    item.name,
    item.backdrop_path,
    item.poster_path,
    item.vote_average,
    item.release_date,
    item.first_air_date
  ].join('|');
  return simpleHash(key).toString();
}

// 增量生成横版标题海报，缓存key用指纹
async function generateBackdropWithCache(item, generatorFn) {
  const fingerprint = getBackdropFingerprint(item);
  const cacheKey = `backdrop_${item.id}_${fingerprint}`;
  let cached = getCachedBackdrop(cacheKey);
  if (cached) {
    log(`[横版标题海报] 命中缓存: ${cacheKey}`, 'debug');
    return cached;
  }
  // 未命中则生成
  const result = await generatorFn(item);
  if (result) {
    cacheBackdrop(cacheKey, result);
  }
  return result;
}

// 批量增量生成横版标题海报
async function batchGenerateBackdropsWithCache(items, generatorFn, concurrent) {
  return await batchGenerateBackdrops(
    items,
    item => generateBackdropWithCache(item, generatorFn),
    concurrent
  );
}

// ... 后续将继续迁移和优化主流程、工具函数结构等 ...