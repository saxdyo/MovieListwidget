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

// ... 后续将继续迁移和优化主流程、缓存、并发、横版标题海报等 ...