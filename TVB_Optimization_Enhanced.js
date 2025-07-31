// ========== TVB播出平台增强优化模块 ==========
// 基于Move_list 2.js脚本的完整优化方案

// 1. 增强的TVB缓存系统
class EnhancedTvbCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    this.lastCleanup = Date.now();
    this.cleanupInterval = 30 * 60 * 1000; // 30分钟清理一次
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
  
  set(key, data, ttl = 30 * 60 * 1000) { // 默认30分钟TTL
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

const enhancedTvbCache = new EnhancedTvbCache(50);

// 2. 网络状态检测
function detectNetworkCondition() {
  // 可以集成实际的网络检测逻辑
  // 这里提供基础实现
  return 'normal'; // 'fast', 'normal', 'slow', 'very_slow'
}

// 3. 智能重试机制
async function smartRetry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const result = await fn();
      const responseTime = Date.now() - startTime;
      
      // 记录性能指标
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
    sort_by = "first_air_date.desc",
    max_retries = 3,
    cache_ttl = 30 * 60 * 1000 // 30分钟缓存
  } = params;
  
  // 生成缓存键
  const cacheKey = `tvb_enhanced_${with_networks}_${with_genres}_${air_status}_${sort_by}_${page}_${language}`;
  
  try {
    // 1. 检查缓存
    const cachedData = enhancedTvbCache.get(cacheKey);
    if (cachedData) {
      console.log(`[TVB增强] 使用缓存数据，命中率: ${enhancedTvbCache.stats().hitRate}%`);
      return cachedData;
    }
    
    // 2. 网络条件检测
    const networkCondition = detectNetworkCondition();
    console.log(`[TVB增强] 网络条件: ${networkCondition}`);
    
    // 3. 构建优化的API参数
    const beijingDate = getBeijingDate();
    const discoverParams = {
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      include_adult: false,
      include_video: false
    };
    
    // 添加播出平台过滤器
    if (with_networks) {
      discoverParams.with_networks = with_networks;
    }
    
    // 添加题材类型过滤器
    if (with_genres) {
      discoverParams.with_genres = with_genres;
    }
    
    // 添加上映状态过滤器
    if (air_status === 'released') {
      discoverParams['first_air_date.lte'] = beijingDate;
    } else if (air_status === 'upcoming') {
      discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    // 4. 智能重试获取数据
    const fetchData = async () => {
      console.log(`[TVB增强] 开始获取TVB数据，参数:`, discoverParams);
      
      const res = await Widget.tmdb.get("/discover/tv", {
        params: discoverParams
      });
      
      if (!res || !res.results) {
        throw new Error("TMDB API返回数据格式错误");
      }
      
      return res;
    };
    
    const res = await smartRetry(fetchData, max_retries);
    
    // 5. 数据验证和优化处理
    const genreMap = await fetchTmdbGenres();
    const processedData = res.results
      .filter(item => {
        // 严格的数据验证
        return item && 
               item.id && 
               (item.title || item.name) && 
               item.poster_path &&
               typeof item.id === 'number' &&
               item.id > 0;
      })
      .map(item => {
        // 使用优化的格式化函数
        const formattedItem = formatTmdbItem(item, genreMap);
        
        // 添加增强的元数据
        return {
          ...formattedItem,
          isTvbEnhanced: true,
          networkCondition: networkCondition,
          cacheTimestamp: Date.now(),
          originalId: item.id,
          mediaType: 'tv',
          source: 'tmdb_discover_tv'
        };
      });
    
    // 6. 数据健康检查
    const healthCheck = checkTvbDataHealth(processedData);
    if (!healthCheck.healthy) {
      console.warn(`[TVB增强] 数据健康检查失败: ${healthCheck.reason}`);
    }
    
    // 7. 缓存结果
    enhancedTvbCache.set(cacheKey, processedData, cache_ttl);
    
    console.log(`[TVB增强] 成功获取${processedData.length}条TVB数据，健康度: ${healthCheck.validCount}/${healthCheck.totalCount}`);
    return processedData;
    
  } catch (error) {
    console.error(`[TVB增强] 数据获取失败: ${error.message}`);
    
    // 8. 降级策略
    return await getTvbEnhancedFallbackData(params);
  }
}

// 5. 增强的降级数据获取
async function getTvbEnhancedFallbackData(params) {
  try {
    console.warn(`[TVB增强] 启动降级数据获取`);
    
    // 尝试多个备用数据源
    const fallbackSources = [
      () => fetchTvbFallbackFromCache(params),
      () => fetchTvbFallbackFromAlternativeAPI(params),
      () => fetchTvbFallbackFromLocalData(params)
    ];
    
    for (const source of fallbackSources) {
      try {
        const fallbackData = await source();
        if (fallbackData && fallbackData.length > 0) {
          console.log(`[TVB增强] 降级数据源成功，获取${fallbackData.length}条数据`);
          return fallbackData.map(item => ({
            ...item,
            isTvbEnhanced: true,
            isFallback: true,
            fallbackSource: source.name
          }));
        }
      } catch (error) {
        console.warn(`[TVB增强] 降级数据源失败: ${error.message}`);
      }
    }
    
    // 返回错误信息
    return [{
      id: 'tvb-enhanced-error',
      type: 'error',
      title: 'TVB数据获取失败',
      description: '所有数据源都无法访问，请检查网络连接或稍后重试',
      isTvbEnhanced: true,
      isFallback: true,
      errorCode: 'ALL_SOURCES_FAILED'
    }];
    
  } catch (error) {
    console.error(`[TVB增强] 降级策略也失败: ${error.message}`);
    return [];
  }
}

// 6. 备用数据源实现
async function fetchTvbFallbackFromCache(params) {
  // 尝试从其他缓存获取历史数据
  return [];
}

async function fetchTvbFallbackFromAlternativeAPI(params) {
  // 尝试其他API源
  return [];
}

async function fetchTvbFallbackFromLocalData(params) {
  // 尝试本地存储的数据
  return [];
}

// 7. 增强的数据健康检查
function checkTvbDataHealth(data) {
  if (!data || !Array.isArray(data)) {
    return { healthy: false, reason: '数据格式错误', validCount: 0, totalCount: 0 };
  }
  
  const validItems = data.filter(item => 
    item && 
    item.id && 
    item.title && 
    item.type !== 'error' &&
    item.posterPath
  );
  
  const errorItems = data.filter(item => item.type === 'error');
  
  if (validItems.length === 0) {
    return { 
      healthy: false, 
      reason: '没有有效数据', 
      validCount: 0, 
      totalCount: data.length,
      errorCount: errorItems.length
    };
  }
  
  const healthScore = validItems.length / data.length;
  
  return { 
    healthy: healthScore > 0.5, // 超过50%的数据有效
    validCount: validItems.length,
    totalCount: data.length,
    errorCount: errorItems.length,
    healthScore: (healthScore * 100).toFixed(2),
    reason: healthScore > 0.5 ? '数据健康' : '数据质量较低'
  };
}

// 8. 增强的性能监控
class TvbPerformanceMonitor {
  constructor() {
    this.requestCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.lastReset = Date.now();
  }
  
  recordRequest(success, responseTime) {
    this.requestCount++;
    if (responseTime > 0) {
      this.responseTimes.push(responseTime);
    }
    
    if (success) {
      this.successCount++;
    } else {
      this.errorCount++;
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
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    
    const cacheHitRate = this.cacheHits + this.cacheMisses > 0 
      ? (this.cacheHits / (this.cacheHits + this.cacheMisses) * 100).toFixed(2)
      : 0;
    
    return {
      requestCount: this.requestCount,
      successCount: this.successCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0 ? (this.successCount / this.requestCount * 100).toFixed(2) : 0,
      avgResponseTime: avgResponseTime.toFixed(2),
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      cacheHitRate: cacheHitRate,
      uptime: ((Date.now() - this.lastReset) / 1000 / 60).toFixed(2) + '分钟'
    };
  }
  
  reset() {
    this.requestCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.lastReset = Date.now();
  }
}

const tvbPerformanceMonitor = new TvbPerformanceMonitor();

// 9. 调试和诊断工具
function diagnoseTvbIssues() {
  const cacheStats = enhancedTvbCache.stats();
  const performanceStats = tvbPerformanceMonitor.getStats();
  
  console.log('=== TVB诊断报告 ===');
  console.log('缓存状态:', cacheStats);
  console.log('性能统计:', performanceStats);
  
  // 检查API密钥
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('❌ API密钥未正确配置');
  } else {
    console.log('✅ API密钥已配置');
  }
  
  // 检查网络连接
  console.log('🌐 网络状态检测:', detectNetworkCondition());
  
  return {
    cache: cacheStats,
    performance: performanceStats,
    apiKeyConfigured: !!(API_KEY && API_KEY !== 'your_api_key_here'),
    networkCondition: detectNetworkCondition()
  };
}

// 10. 集成到你的脚本的方法
// 在你的Move_list 2.js中添加以下代码：

// 替换原有的tmdbDiscoverByNetwork函数
// async function tmdbDiscoverByNetwork(params = {}) {
//   return await tmdbDiscoverByNetworkEnhanced(params);
// }

// 在WidgetMetadata中修改TVB模块配置
// {
//   title: "TMDB 播出平台 (增强版)",
//   description: "优化的TVB播出平台数据获取",
//   requiresWebView: false,
//   functionName: "tmdbDiscoverByNetworkEnhanced", // 使用增强版函数
//   cacheDuration: 3600,
//   params: [
//     // ... 原有参数配置 ...
//   ]
// }

// 使用示例
async function testTvbEnhanced() {
  console.log('=== 测试TVB增强功能 ===');
  
  const result = await tmdbDiscoverByNetworkEnhanced({
    with_networks: "48", // TVB平台ID
    language: "zh-CN",
    page: 1,
    max_retries: 3
  });
  
  console.log('测试结果:', result.length, '条数据');
  console.log('诊断报告:', diagnoseTvbIssues());
  
  return result;
}

console.log("TVB增强优化模块已加载");
console.log("使用方法: await tmdbDiscoverByNetworkEnhanced({ with_networks: '48' })");