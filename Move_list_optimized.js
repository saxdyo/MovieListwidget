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

// ... 后续将继续迁移和优化主流程、并发、横版标题海报等 ...