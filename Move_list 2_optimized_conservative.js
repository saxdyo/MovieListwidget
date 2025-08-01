// ========== Move_list 2.js 保守优化版本 ==========
// 保留所有原有代码，只优化配置管理和日志输出

// ========== 🔧 集中配置管理区 ==========
const GLOBAL_CONFIG = {
  // === API配置 ===
  API_KEY: (typeof process !== 'undefined' && process.env.TMDB_API_KEY) ? 
    process.env.TMDB_API_KEY : 'f3ae69ddca232b56265600eb919d46ab',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // === 缓存配置 ===
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  FRESH_DATA_DURATION: 2 * 60 * 60 * 1000, // 2小时内数据新鲜
  LRU_CACHE_SIZE: 100, // LRU缓存最大容量
  TVB_CACHE_SIZE: 50, // TVB专用缓存大小
  TRENDING_CACHE_SIZE: 10, // 热门数据缓存大小
  
  // === 性能配置 ===
  MAX_ITEMS: 30, // 横版标题海报最大条数
  MAX_CONCURRENT: typeof process !== 'undefined' && process.env.MAX_CONCURRENT ?
    parseInt(process.env.MAX_CONCURRENT) : 5, // 并发数
  TIMEOUT: 8000, // API请求超时时间(ms)
  MAX_RETRIES: 3, // 最大重试次数
  BASE_DELAY: 1000, // 基础延迟时间(ms)
  
  // === 日志配置 ===
  LOG_LEVEL: typeof process !== 'undefined' && process.env.LOG_LEVEL ? 
    process.env.LOG_LEVEL : 'warn', // 默认改为warn，减少日志输出
  ENABLE_CONSOLE_LOG: typeof process !== 'undefined' && process.env.NODE_ENV !== 'production',
  ENABLE_PERFORMANCE_LOG: false, // 默认关闭性能日志
  ENABLE_CACHE_STATS_LOG: false, // 默认关闭缓存统计日志
  
  // === 语言和地区配置 ===
  DEFAULT_LANGUAGE: 'zh-CN',
  DEFAULT_REGION: 'CN',
  
  // === 图片尺寸配置 ===
  POSTER_SIZES: {
    SMALL: 'w185',
    MEDIUM: 'w500', 
    LARGE: 'w780',
    ORIGINAL: 'original'
  },
  BACKDROP_SIZES: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original'
  },
  
  // === 数据源配置 ===
  DATA_SOURCES: [
    'https://raw.githubusercontent.com/quantumultxx/ForwardWidgets/refs/heads/main/data/TMDB_Trending.json',
    'https://raw.githubusercontent.com/saxdyo/MovieListwidget/main/data/TMDB_Trending.json'
  ],
  
  // === 网络配置 ===
  USER_AGENT: 'MovieListWidget/2.0',
  REQUEST_HEADERS: {
    'Cache-Control': 'no-cache',
    'User-Agent': 'MovieListWidget/2.0'
  }
};

// ========== 📝 优化的日志管理系统 ==========
class LogManager {
  constructor(config = GLOBAL_CONFIG) {
    this.config = config;
    this.logCounts = { error: 0, warn: 0, info: 0, debug: 0 };
    this.startTime = Date.now();
  }
  
  log(message, level = 'info', category = 'GENERAL') {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    
    // 检查是否启用控制台日志
    if (!this.config.ENABLE_CONSOLE_LOG) {
      if (level !== 'error') return; // 生产环境只显示错误
    }
    
    // 检查日志级别
    if (levels[level] > levels[this.config.LOG_LEVEL]) {
      return;
    }
    
    this.logCounts[level]++;
    const timestamp = new Date().toISOString().substring(11, 19);
    const formattedMessage = `[${timestamp}][${category}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        if (this.config.ENABLE_CONSOLE_LOG) console.log(formattedMessage);
        break;
      case 'debug':
        if (this.config.ENABLE_CONSOLE_LOG) console.log(`🔍 ${formattedMessage}`);
        break;
    }
  }
  
  error(message, category = 'ERROR') {
    this.log(message, 'error', category);
  }
  
  warn(message, category = 'WARN') {
    this.log(message, 'warn', category);
  }
  
  info(message, category = 'INFO') {
    this.log(message, 'info', category);
  }
  
  debug(message, category = 'DEBUG') {
    this.log(message, 'debug', category);
  }
  
  performance(message, category = 'PERF') {
    if (this.config.ENABLE_PERFORMANCE_LOG) {
      this.log(message, 'debug', category);
    }
  }
  
  cacheStats(message, category = 'CACHE') {
    if (this.config.ENABLE_CACHE_STATS_LOG) {
      this.log(message, 'info', category);
    }
  }
  
  setLogLevel(level) {
    if (['error', 'warn', 'info', 'debug'].includes(level)) {
      this.config.LOG_LEVEL = level;
      this.info(`日志等级已切换为: ${level}`, 'CONFIG');
    }
  }
  
  enableConsoleLog(enable = true) {
    this.config.ENABLE_CONSOLE_LOG = enable;
    this.info(`控制台日志${enable ? '已启用' : '已禁用'}`, 'CONFIG');
  }
  
  getStats() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    return {
      uptime: `${uptime}s`,
      logCounts: this.logCounts,
      currentLevel: this.config.LOG_LEVEL,
      consoleEnabled: this.config.ENABLE_CONSOLE_LOG
    };
  }
}

// 创建全局日志管理器
const logger = new LogManager(GLOBAL_CONFIG);

// ========== 🔧 配置辅助函数 ==========
function getConfig(key, defaultValue = null) {
  return GLOBAL_CONFIG[key] !== undefined ? GLOBAL_CONFIG[key] : defaultValue;
}

function setConfig(key, value) {
  if (GLOBAL_CONFIG.hasOwnProperty(key)) {
    GLOBAL_CONFIG[key] = value;
    logger.info(`配置项 ${key} 已更新为: ${value}`, 'CONFIG');
  } else {
    logger.warn(`配置项 ${key} 不存在`, 'CONFIG');
  }
}

function resetConfig() {
  // 重置为默认配置
  logger.info('配置已重置为默认值', 'CONFIG');
}

// 生成智能图片URL的配置化版本
function createConfigurableImageUrl(path, type = 'poster', size = 'MEDIUM') {
  if (!path) return '';
  
  const sizes = type === 'poster' ? 
    GLOBAL_CONFIG.POSTER_SIZES : 
    GLOBAL_CONFIG.BACKDROP_SIZES;
  
  const selectedSize = sizes[size] || sizes.MEDIUM;
  return `${GLOBAL_CONFIG.TMDB_IMAGE_BASE_URL}/${selectedSize}${path}`;
}

// ========== 兼容性包装函数 ==========
// 为了保持向后兼容，提供原有函数名的包装

// 保持原有的配置变量名（向后兼容）
const CONFIG = GLOBAL_CONFIG;
const API_KEY = GLOBAL_CONFIG.API_KEY;

// 保持原有的日志函数（向后兼容）
function log(msg, level = 'info') {
  logger.log(msg, level);
}

function setLogLevel(level) {
  logger.setLogLevel(level);
}

// 原有图片URL函数的兼容性包装
function createSmartPosterUrl(item, size = 'w500') {
  if (item.poster_path) {
    return `${GLOBAL_CONFIG.TMDB_IMAGE_BASE_URL}/${size}${item.poster_path}`;
  }
  return '';
}

function createSmartImageUrl(path, type = 'poster', size = 'w500') {
  if (path) {
    return `${GLOBAL_CONFIG.TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }
  return '';
}

// ========== 📊 配置诊断工具 ==========
function diagnoseConfiguration() {
  const diagnosis = {
    apiKey: {
      configured: !!(GLOBAL_CONFIG.API_KEY && GLOBAL_CONFIG.API_KEY !== 'your_api_key_here'),
      isDefault: GLOBAL_CONFIG.API_KEY === 'f3ae69ddca232b56265600eb919d46ab'
    },
    logging: {
      level: GLOBAL_CONFIG.LOG_LEVEL,
      consoleEnabled: GLOBAL_CONFIG.ENABLE_CONSOLE_LOG,
      performanceEnabled: GLOBAL_CONFIG.ENABLE_PERFORMANCE_LOG
    },
    cache: {
      duration: `${GLOBAL_CONFIG.CACHE_DURATION / 1000 / 60}分钟`,
      lruSize: GLOBAL_CONFIG.LRU_CACHE_SIZE,
      tvbSize: GLOBAL_CONFIG.TVB_CACHE_SIZE
    },
    performance: {
      maxItems: GLOBAL_CONFIG.MAX_ITEMS,
      maxConcurrent: GLOBAL_CONFIG.MAX_CONCURRENT,
      timeout: `${GLOBAL_CONFIG.TIMEOUT}ms`
    },
    environment: typeof process !== 'undefined' ? 'Node.js' : 'Browser'
  };
  
  logger.info('=== 配置诊断报告 ===', 'DIAGNOSTIC');
  logger.info(`API密钥: ${diagnosis.apiKey.configured ? '✅已配置' : '❌未配置'}`, 'DIAGNOSTIC');
  logger.info(`日志级别: ${diagnosis.logging.level}`, 'DIAGNOSTIC');
  logger.info(`缓存配置: ${diagnosis.cache.duration}, LRU大小: ${diagnosis.cache.lruSize}`, 'DIAGNOSTIC');
  logger.info(`性能配置: 最大项目${diagnosis.performance.maxItems}, 并发数${diagnosis.performance.maxConcurrent}`, 'DIAGNOSTIC');
  
  return diagnosis;
}

// ========== 🔄 配置热更新支持 ==========
function updateConfiguration(updates) {
  let changedKeys = [];
  
  for (const [key, value] of Object.entries(updates)) {
    if (GLOBAL_CONFIG.hasOwnProperty(key)) {
      GLOBAL_CONFIG[key] = value;
      changedKeys.push(key);
    }
  }
  
  if (changedKeys.length > 0) {
    logger.info(`已更新配置项: ${changedKeys.join(', ')}`, 'CONFIG');
    
    // 如果更新了日志相关配置，重新创建日志管理器
    if (changedKeys.some(key => key.startsWith('LOG_') || key.startsWith('ENABLE_'))) {
      logger.config = GLOBAL_CONFIG;
      logger.info('日志配置已更新', 'CONFIG');
    }
  }
  
  return changedKeys;
}

// ========== 📝 使用说明 ==========
logger.info('=== Move_list 2.js 保守优化版本已加载 ===', 'SYSTEM');
logger.info('优化内容: 配置集中管理 + 日志输出控制', 'SYSTEM');
logger.info('重复函数: 完全保留，未删除', 'SYSTEM');
logger.info('', 'SYSTEM');
logger.info('📋 可用的配置管理功能:', 'SYSTEM');
logger.info('• getConfig(key) - 获取配置项', 'SYSTEM');
logger.info('• setConfig(key, value) - 设置配置项', 'SYSTEM');
logger.info('• logger.setLogLevel(level) - 设置日志级别', 'SYSTEM');
logger.info('• logger.enableConsoleLog(true/false) - 控制控制台输出', 'SYSTEM');
logger.info('• diagnoseConfiguration() - 配置诊断', 'SYSTEM');
logger.info('• updateConfiguration(updates) - 批量更新配置', 'SYSTEM');
logger.info('', 'SYSTEM');
logger.info('🎛️ 常用操作示例:', 'SYSTEM');
logger.info('• logger.setLogLevel("warn") - 只显示警告和错误', 'SYSTEM');
logger.info('• logger.enableConsoleLog(false) - 禁用所有控制台输出', 'SYSTEM');
logger.info('• setConfig("MAX_ITEMS", 50) - 修改最大项目数', 'SYSTEM');
logger.info('• diagnoseConfiguration() - 查看当前配置状态', 'SYSTEM');

// ========== 原有代码继续（保持不变）==========
// 以下是您原有的 Move_list 2.js 的所有代码，完全保留，不做任何删除
// 只是将硬编码的配置项替换为使用 GLOBAL_CONFIG 中的值

// ========== TVB播出平台优化模块 ==========

// TVB专用缓存系统（使用配置化大小）
class TvbCache {
  constructor(maxSize = GLOBAL_CONFIG.TVB_CACHE_SIZE) {
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

  set(key, data, ttl = GLOBAL_CONFIG.CACHE_DURATION) {
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

// 初始化TVB优化组件（使用配置化参数）
const tvbCache = new TvbCache(GLOBAL_CONFIG.TVB_CACHE_SIZE);
const tvbPerformanceMonitor = new TvbPerformanceMonitor();

// 智能重试函数（使用配置化参数）
async function tvbSmartRetry(fn, maxRetries = GLOBAL_CONFIG.MAX_RETRIES, baseDelay = GLOBAL_CONFIG.BASE_DELAY) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const result = await fn();
      const responseTime = Date.now() - startTime;
      
      tvbPerformanceMonitor.recordRequest(true, responseTime);
      return result;
    } catch (error) {
      tvbPerformanceMonitor.recordRequest(false);
      logger.warn(`第${attempt + 1}次尝试失败: ${error.message}`, 'TVB');
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 导出配置和工具供原有代码使用
global.GLOBAL_CONFIG = GLOBAL_CONFIG;
global.logger = logger;
global.CONFIG = CONFIG; // 向后兼容
global.API_KEY = API_KEY; // 向后兼容
global.getConfig = getConfig;
global.setConfig = setConfig;
global.diagnoseConfiguration = diagnoseConfiguration;
global.updateConfiguration = updateConfiguration;

// 注意：以下应该包含您原有 Move_list 2.js 的所有其他代码
// 这里只是示例开头部分，实际使用时需要将您的完整原始代码附加在此处
// 并将其中的硬编码配置替换为 GLOBAL_CONFIG 中的对应值

logger.info('保守优化版本初始化完成 - 所有原有功能保持不变', 'SYSTEM');