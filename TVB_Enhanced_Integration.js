// ========== TVB播出平台完整优化集成 ==========
// 基于Move_list 2.js的现有优化架构

// 1. TVB专用缓存系统
class TvbEnhancedCache {
  constructor(maxSize = 30) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    this.lastCleanup = Date.now();
    this.cleanupInterval = 15 * 60 * 1000; // 15分钟清理
  }
  
  get(key) {
    this.cleanupIfNeeded();
    
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      if (this.isDataFresh(value)) {
        this.cache.delete(key);
        this.cache.set(key, value);
        this.hits++;
        return value.data;
      } else {
        this.cache.delete(key);
        this.misses++;
        return undefined;
      }
    } else {
      this.misses++;
      return undefined;
    }
  }
  
  set(key, data, ttl = 20 * 60 * 1000) { // 20分钟TTL
    this.cleanupIfNeeded();
    
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data: data,
      timestamp: Date.now(),
      ttl: ttl
    });
  }
  
  isDataFresh(cacheEntry) {
    return (Date.now() - cacheEntry.timestamp) < cacheEntry.ttl;
  }
  
  cleanupIfNeeded() {
    if (Date.now() - this.lastCleanup > this.cleanupInterval) {
      this.cleanup();
      this.lastCleanup = Date.now();
    }
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (!this.isDataFresh(value)) {
        this.cache.delete(key);
      }
    }
  }
  
  stats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? (this.hits / (this.hits + this.misses) * 100).toFixed(2) : '0.00',
      lastCleanup: new Date(this.lastCleanup).toLocaleString()
    };
  }
}

const tvbCache = new TvbEnhancedCache(30);

// 2. TVB性能监控
class TvbPerformanceMonitor {
  constructor() {
    this.requests = 0;
    this.successes = 0;
    this.errors = 0;
    this.responseTimes = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.startTime = Date.now();
  }
  
  recordRequest(success, responseTime) {
    this.requests++;
    if (success) {
      this.successes++;
      if (responseTime) {
        this.responseTimes.push(responseTime);
        if (this.responseTimes.length > 100) {
          this.responseTimes.shift();
        }
      }
    } else {
      this.errors++;
    }
  }
  
  recordCache(hit) {
    if (hit) {
      this.cacheHits++;
    } else {
      this.cacheMisses++;
    }
  }
  
  getStats() {
    const avgResponseTime = this.responseTimes.length > 0 
      ? (this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length).toFixed(2)
      : 0;
    
    const successRate = this.requests > 0 
      ? ((this.successes / this.requests) * 100).toFixed(2)
      : 0;
    
    const cacheHitRate = (this.cacheHits + this.cacheMisses) > 0
      ? ((this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100).toFixed(2)
      : 0;
    
    return {
      uptime: Date.now() - this.startTime,
      requests: this.requests,
      successes: this.successes,
      errors: this.errors,
      successRate: `${successRate}%`,
      avgResponseTime: `${avgResponseTime}ms`,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      cacheHitRate: `${cacheHitRate}%`
    };
  }
  
  reset() {
    this.requests = 0;
    this.successes = 0;
    this.errors = 0;
    this.responseTimes = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.startTime = Date.now();
  }
}

const tvbPerformanceMonitor = new TvbPerformanceMonitor();

// 3. 智能重试机制
async function tvbSmartRetry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const result = await fn();
      const responseTime = Date.now() - startTime;
      
      tvbPerformanceMonitor.recordRequest(true, responseTime);
      return result;
    } catch (error) {
      lastError = error;
      tvbPerformanceMonitor.recordRequest(false, 0);
      
      console.warn(`[TVB优化] 第${attempt + 1}次尝试失败: ${error.message}`);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt); // 指数退避
        console.log(`[TVB优化] ${delay}ms后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// 4. 增强的TVB数据获取函数
async function tmdbDiscoverByNetworkEnhanced(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_networks, 
    with_genres,
    air_status = "released",
    sort_by = "first_air_date.desc" 
  } = params;
  
  try {
    // 生成缓存键
    const cacheKey = `tvb_enhanced_${with_networks}_${with_genres}_${air_status}_${sort_by}_${page}_${language}`;
    
    // 检查缓存
    const cachedData = tvbCache.get(cacheKey);
    if (cachedData) {
      tvbPerformanceMonitor.recordCache(true);
      console.log(`[TVB增强] 使用缓存数据，命中率: ${tvbCache.stats().hitRate}%`);
      return cachedData;
    }
    
    tvbPerformanceMonitor.recordCache(false);
    
    // 网络状态检测
    const networkCondition = detectNetworkCondition();
    console.log(`[TVB增强] 网络条件: ${networkCondition}`);
    
    // 构建API参数
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
    
    console.log(`[TVB增强] 开始获取TVB数据，参数:`, discoverParams);
    
    // 使用智能重试获取数据
    const fetchData = async () => {
      const res = await Widget.tmdb.get("/discover/tv", {
        params: discoverParams
      });
      
      if (!res || !res.results) {
        throw new Error("API返回数据格式错误");
      }
      
      const genreMap = await fetchTmdbGenres();
      const processedData = res.results.map(item => {
        const formattedItem = formatTmdbItem(item, genreMap);
        return {
          ...formattedItem,
          isTvbEnhanced: true,
          networkCondition: networkCondition,
          cacheSource: 'api'
        };
      });
      
      return processedData;
    };
    
    const processedData = await tvbSmartRetry(fetchData, 3, 1000);
    
    // 数据健康检查
    const healthCheck = checkTvbDataHealth(processedData);
    if (!healthCheck.healthy) {
      console.warn(`[TVB增强] 数据健康检查失败: ${healthCheck.reason}`);
    }
    
    // 缓存数据
    const cache_ttl = networkCondition === 'slow' ? 30 * 60 * 1000 : 20 * 60 * 1000;
    tvbCache.set(cacheKey, processedData, cache_ttl);
    
    console.log(`[TVB增强] 成功获取${processedData.length}条TVB数据，健康度: ${healthCheck.validCount}/${healthCheck.totalCount}`);
    
    return processedData;
    
  } catch (error) {
    console.error(`[TVB增强] 数据获取失败: ${error.message}`);
    
    // 降级处理
    return await getTvbEnhancedFallbackData(params);
  }
}

// 5. 降级数据获取
async function getTvbEnhancedFallbackData(params) {
  try {
    console.warn(`[TVB增强] 启动降级数据获取`);
    
    // 尝试多个降级数据源
    const fallbackSources = [
      () => fetchTvbFallbackFromCache(params),
      () => fetchTvbFallbackFromAlternativeAPI(params),
      () => fetchTvbFallbackFromLocalData(params)
    ];
    
    for (const fallbackSource of fallbackSources) {
      try {
        const fallbackData = await fallbackSource();
        if (fallbackData && fallbackData.length > 0) {
          console.log(`[TVB增强] 降级数据源成功，获取${fallbackData.length}条数据`);
          return fallbackData.map(item => ({
            ...item,
            isTvbEnhanced: true,
            cacheSource: 'fallback'
          }));
        }
      } catch (error) {
        console.warn(`[TVB增强] 降级数据源失败: ${error.message}`);
      }
    }
    
    // 返回错误项
    return [{
      id: 'tvb-enhanced-error',
      type: 'error',
      title: 'TVB数据获取失败',
      description: '所有数据源都无法获取TVB数据，请检查网络连接和API配置',
      isTvbEnhanced: true,
      cacheSource: 'error'
    }];
    
  } catch (error) {
    console.error(`[TVB增强] 降级策略也失败: ${error.message}`);
    return [];
  }
}

// 6. 备用数据源
async function fetchTvbFallbackFromCache(params) {
  // 从其他缓存获取相关数据
  return [];
}

async function fetchTvbFallbackFromAlternativeAPI(params) {
  // 从其他API获取TVB相关内容
  return [];
}

async function fetchTvbFallbackFromLocalData(params) {
  // 从本地数据包获取
  return [];
}

// 7. 数据健康检查
function checkTvbDataHealth(data) {
  if (!data || !Array.isArray(data)) {
    return { 
      healthy: false, 
      reason: '数据格式错误',
      validCount: 0,
      totalCount: 0
    };
  }
  
  const validItems = data.filter(item => 
    item && 
    item.id && 
    item.title && 
    item.type !== 'error' && 
    (item.posterPath || item.coverUrl)
  );
  
  const healthScore = data.length > 0 ? validItems.length / data.length : 0;
  
  return { 
    healthy: healthScore > 0.5,
    validCount: validItems.length,
    totalCount: data.length,
    healthScore: (healthScore * 100).toFixed(2),
    reason: healthScore > 0.5 ? '数据健康' : '有效数据不足'
  };
}

// 8. 诊断功能
function diagnoseTvbIssues() {
  const cacheStats = tvbCache.stats();
  const performanceStats = tvbPerformanceMonitor.getStats();
  
  console.log('=== TVB诊断报告 ===');
  console.log('缓存统计:', cacheStats);
  console.log('性能统计:', performanceStats);
  
  const issues = [];
  
  if (performanceStats.successRate < 80) {
    issues.push('成功率过低，可能存在网络或API问题');
  }
  
  if (cacheStats.hitRate < 30) {
    issues.push('缓存命中率过低，建议调整缓存策略');
  }
  
  if (performanceStats.avgResponseTime > 5000) {
    issues.push('响应时间过长，建议优化网络连接');
  }
  
  return {
    cacheStats,
    performanceStats,
    issues,
    recommendations: issues.length > 0 ? issues : ['系统运行正常']
  };
}

// 9. 测试功能
async function testTvbEnhanced() {
  console.log('=== 测试TVB增强功能 ===');
  
  try {
    const result = await tmdbDiscoverByNetworkEnhanced({
      with_networks: "48", // TVB平台ID
      language: "zh-CN",
      page: 1,
      air_status: "released",
      sort_by: "first_air_date.desc"
    });
    
    console.log('测试结果:', result.length, '条数据');
    console.log('诊断报告:', diagnoseTvbIssues());
    
    return result;
  } catch (error) {
    console.error('测试失败:', error.message);
    return [];
  }
}

// 10. 集成到原有脚本的替换函数
// 在你的Move_list 2.js中，将原有的tmdbDiscoverByNetwork函数替换为：
/*
async function tmdbDiscoverByNetwork(params = {}) {
  return await tmdbDiscoverByNetworkEnhanced(params);
}
*/

// 11. 在WidgetMetadata中修改TVB模块配置
/*
{
  title: "TMDB 播出平台",
  description: "优化的TVB播出平台数据获取",
  requiresWebView: false,
  functionName: "tmdbDiscoverByNetworkEnhanced", // 使用增强版函数
  cacheDuration: 3600,
  params: [
    // ... 原有参数保持不变
  ]
}
*/

console.log("TVB增强优化模块已加载");
console.log("使用方法: await tmdbDiscoverByNetworkEnhanced({ with_networks: '48' })");