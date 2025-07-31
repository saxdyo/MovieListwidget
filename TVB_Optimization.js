// ========== TVB播出平台优化模块 ==========
// 基于你的Move_list 2.js脚本优化，可直接集成使用

// TVB专用缓存
class TvbCache {
  constructor(maxSize = 20) {
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
}

const tvbCache = new TvbCache(20);

// 网络条件检测（从你的脚本复制）
function detectNetworkCondition() {
  // 这里可以添加实际的网络检测逻辑
  // 暂时返回默认值
  return 'normal';
}

// 数据新鲜度检查
function isDataFresh(data, maxAge = 30 * 60 * 1000) {
  if (!data || !data.timestamp) return false;
  return (Date.now() - data.timestamp) < maxAge;
}

// 优化的TVB数据获取函数
async function tmdbDiscoverByNetworkOptimized(params = {}) {
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
  
  try {
    // 1. 检查缓存
    const cachedData = tvbCache.get(cacheKey);
    if (cachedData && isDataFresh(cachedData)) {
      console.log(`[TVB优化] 使用缓存数据`);
      return cachedData;
    }
    
    // 2. 网络条件检测
    const networkCondition = detectNetworkCondition();
    console.log(`[TVB优化] 网络条件: ${networkCondition}`);
    
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
    
    // 4. 智能重试机制
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`[TVB优化] 尝试获取数据 (第${retryCount + 1}次)`);
        
        const res = await Widget.tmdb.get("/discover/tv", {
          params: discoverParams
        });
        
        if (!res || !res.results) {
          throw new Error("API返回数据格式错误");
        }
        
        // 5. 数据验证和优化
        const genreMap = await fetchTmdbGenres();
        const processedData = res.results
          .filter(item => {
            // 过滤有效数据
            return item && item.id && (item.title || item.name) && item.poster_path;
          })
          .map(item => {
            // 使用优化的格式化函数
            const formattedItem = formatTmdbItem(item, genreMap);
            
            // 添加TVB优化标识
            return {
              ...formattedItem,
              isTvbOptimized: true,
              networkCondition: networkCondition,
              cacheTimestamp: Date.now()
            };
          });
        
        // 6. 缓存结果
        const cacheData = {
          data: processedData,
          timestamp: Date.now(),
          networkCondition: networkCondition
        };
        tvbCache.set(cacheKey, cacheData);
        
        console.log(`[TVB优化] 成功获取${processedData.length}条TVB数据`);
        return processedData;
        
      } catch (error) {
        retryCount++;
        console.warn(`[TVB优化] 第${retryCount}次尝试失败: ${error.message}`);
        
        if (retryCount >= maxRetries) {
          // 7. 降级策略
          return await getTvbFallbackData(params);
        }
        
        // 指数退避
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      }
    }
    
  } catch (error) {
    console.error(`[TVB优化] 最终失败: ${error.message}`);
    return await getTvbFallbackData(params);
  }
}

// TVB降级数据获取
async function getTvbFallbackData(params) {
  try {
    console.warn(`[TVB优化] 使用降级数据源`);
    
    // 尝试从备用数据源获取
    const fallbackData = await fetchTvbFallbackData(params);
    if (fallbackData && fallbackData.length > 0) {
      return fallbackData;
    }
    
    // 返回空数据但带有错误信息
    return [{
      id: 'tvb-error',
      type: 'error',
      title: 'TVB数据获取失败',
      description: '网络连接或API访问出现问题，请稍后重试',
      isTvbOptimized: true,
      isFallback: true
    }];
    
  } catch (error) {
    console.error(`[TVB优化] 降级数据也失败: ${error.message}`);
    return [];
  }
}

// 备用TVB数据源
async function fetchTvbFallbackData(params) {
  try {
    // 可以尝试其他数据源，比如本地缓存的历史数据
    // 或者从其他API获取TVB相关内容
    
    // 这里可以添加你的备用数据逻辑
    return [];
    
  } catch (error) {
    console.error(`[TVB优化] 备用数据源失败: ${error.message}`);
    return [];
  }
}

// TVB数据健康检查
function checkTvbDataHealth(data) {
  if (!data || !Array.isArray(data)) {
    return { healthy: false, reason: '数据格式错误' };
  }
  
  const validItems = data.filter(item => 
    item && item.id && item.title && item.type !== 'error'
  );
  
  if (validItems.length === 0) {
    return { healthy: false, reason: '没有有效数据' };
  }
  
  return { 
    healthy: true, 
    validCount: validItems.length,
    totalCount: data.length 
  };
}

// TVB性能监控
class TvbPerformanceMonitor {
  constructor() {
    this.requestCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
  }
  
  recordRequest(success, responseTime) {
    this.requestCount++;
    this.responseTimes.push(responseTime);
    
    if (success) {
      this.successCount++;
    } else {
      this.errorCount++;
    }
  }
  
  getStats() {
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    
    return {
      requestCount: this.requestCount,
      successCount: this.successCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0 ? (this.successCount / this.requestCount * 100).toFixed(2) : 0,
      avgResponseTime: avgResponseTime.toFixed(2)
    };
  }
}

const tvbPerformanceMonitor = new TvbPerformanceMonitor();

// 集成到你的脚本的方法：
// 1. 将上述函数复制到你的Move_list 2.js中
// 2. 在WidgetMetadata中修改TVB模块的functionName为"tmdbDiscoverByNetworkOptimized"
// 3. 确保API_KEY正确设置

// 使用示例：
// 在你的脚本中调用：
// const tvbData = await tmdbDiscoverByNetworkOptimized({
//   with_networks: "48", // TVB的ID
//   language: "zh-CN",
//   page: 1
// });

console.log("TVB优化模块已加载");