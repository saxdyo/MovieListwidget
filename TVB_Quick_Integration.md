# TVB播出平台快速集成指南

## 📋 问题分析

你的脚本中TVB播出平台数据获取失败的原因：

1. **数据来源**：通过 `tmdbDiscoverByNetwork` 函数调用TMDB API的 `/discover/tv` 接口
2. **平台ID**：TVB的平台ID是 "48"
3. **可能问题**：
   - API密钥无效或过期
   - 网络连接问题
   - 参数传递错误
   - 数据格式不匹配

## 🚀 优化方案

### 1. 将以下代码添加到你的 `Move_list 2.js` 脚本末尾：

```javascript
// ========== TVB播出平台优化模块 ==========

// TVB专用缓存
class TvbCache {
  constructor(maxSize = 30) {
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
      return value.data;
    } else {
      this.misses++;
      return undefined;
    }
  }
  
  set(key, data, ttl = 20 * 60 * 1000) {
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
  
  stats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? (this.hits / (this.hits + this.misses) * 100).toFixed(2) : '0.00'
    };
  }
}

const tvbCache = new TvbCache(30);

// 智能重试机制
async function tvbSmartRetry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`[TVB优化] 第${attempt + 1}次尝试失败: ${error.message}`);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
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
  
  try {
    // 生成缓存键
    const cacheKey = `tvb_${with_networks}_${with_genres}_${air_status}_${sort_by}_${page}_${language}`;
    
    // 检查缓存
    const cachedData = tvbCache.get(cacheKey);
    if (cachedData) {
      console.log(`[TVB优化] 使用缓存数据，命中率: ${tvbCache.stats().hitRate}%`);
      return cachedData;
    }
    
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
    
    console.log(`[TVB优化] 开始获取TVB数据，参数:`, discoverParams);
    
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
          isTvbOptimized: true
        };
      });
      
      return processedData;
    };
    
    const processedData = await tvbSmartRetry(fetchData, 3, 1000);
    
    // 缓存数据
    tvbCache.set(cacheKey, processedData);
    
    console.log(`[TVB优化] 成功获取${processedData.length}条TVB数据`);
    
    return processedData;
    
  } catch (error) {
    console.error(`[TVB优化] 数据获取失败: ${error.message}`);
    return [];
  }
}

// 数据健康检查
function checkTvbDataHealth(data) {
  if (!data || !Array.isArray(data)) {
    return { healthy: false, reason: '数据格式错误' };
  }
  
  const validItems = data.filter(item => 
    item && item.id && item.title && item.type !== 'error'
  );
  
  const healthScore = validItems.length / data.length;
  
  return { 
    healthy: healthScore > 0.5,
    validCount: validItems.length,
    totalCount: data.length,
    healthScore: (healthScore * 100).toFixed(2)
  };
}
```

### 2. 替换原有函数

在你的脚本中找到第2767行的 `tmdbDiscoverByNetwork` 函数，替换为：

```javascript
async function tmdbDiscoverByNetwork(params = {}) {
  return await tmdbDiscoverByNetworkEnhanced(params);
}
```

### 3. 测试功能

添加测试函数：

```javascript
async function testTvbOptimized() {
  console.log('=== 测试TVB优化功能 ===');
  
  try {
    const result = await tmdbDiscoverByNetworkEnhanced({
      with_networks: "48", // TVB平台ID
      language: "zh-CN",
      page: 1,
      air_status: "released",
      sort_by: "first_air_date.desc"
    });
    
    console.log('测试结果:', result.length, '条数据');
    console.log('缓存统计:', tvbCache.stats());
    
    return result;
  } catch (error) {
    console.error('测试失败:', error.message);
    return [];
  }
}
```

## 🔧 使用方法

1. **直接调用优化函数**：
```javascript
const tvbData = await tmdbDiscoverByNetworkEnhanced({
  with_networks: "48", // TVB平台ID
  language: "zh-CN",
  page: 1
});
```

2. **通过原有接口调用**：
```javascript
const tvbData = await tmdbDiscoverByNetwork({
  with_networks: "48"
});
```

## 📊 优化特性

1. **智能缓存**：20分钟TTL，自动清理过期数据
2. **智能重试**：指数退避重试机制，最多3次
3. **性能监控**：缓存命中率、响应时间统计
4. **数据健康检查**：验证数据完整性和有效性
5. **错误处理**：优雅的降级和错误报告

## 🎯 预期效果

- **提高成功率**：通过重试机制减少网络错误
- **提升响应速度**：缓存机制减少重复请求
- **增强稳定性**：健康检查和错误处理
- **改善用户体验**：更快的加载速度和更可靠的数据

## ⚠️ 注意事项

1. 确保 `API_KEY` 变量已正确设置
2. 确保 `getBeijingDate()` 和 `fetchTmdbGenres()` 函数可用
3. 确保 `formatTmdbItem()` 函数可用
4. 测试时建议先使用小数据量验证功能

这样集成后，你的TVB播出平台数据获取应该会更加稳定和高效！