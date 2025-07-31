# TVB播出平台优化集成指南

## 📋 问题分析

### TVB数据获取失败的可能原因：

1. **API密钥问题**
   - 检查 `API_KEY` 是否正确设置
   - 确认TMDB API密钥是否有效

2. **网络连接问题**
   - TMDB API访问受限
   - 网络延迟过高

3. **参数配置问题**
   - `with_networks` 参数未正确传递
   - 参数格式错误

4. **数据格式问题**
   - API返回数据不符合预期格式
   - 数据验证失败

## 🔧 优化方案

### 1. 增强的缓存系统
```javascript
// 在你的脚本中添加增强缓存
class EnhancedTvbCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    this.lastCleanup = Date.now();
    this.cleanupInterval = 30 * 60 * 1000; // 30分钟清理
  }
  
  // ... 完整实现见 TVB_Optimization_Enhanced.js
}
```

### 2. 智能重试机制
```javascript
async function smartRetry(fn, maxRetries = 3, baseDelay = 1000) {
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
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt); // 指数退避
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
```

### 3. 数据健康检查
```javascript
function checkTvbDataHealth(data) {
  if (!data || !Array.isArray(data)) {
    return { healthy: false, reason: '数据格式错误' };
  }
  
  const validItems = data.filter(item => 
    item && item.id && item.title && item.type !== 'error' && item.posterPath
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

## 📝 集成步骤

### 步骤1: 复制优化函数
将 `TVB_Optimization_Enhanced.js` 中的所有函数复制到你的 `Move_list 2.js` 中。

### 步骤2: 替换原有函数
在你的脚本中找到 `tmdbDiscoverByNetwork` 函数（第2767行），替换为：

```javascript
async function tmdbDiscoverByNetwork(params = {}) {
  return await tmdbDiscoverByNetworkEnhanced(params);
}
```

### 步骤3: 更新WidgetMetadata配置
在WidgetMetadata中找到TVB模块配置，可以添加一个新的增强版模块：

```javascript
{
  title: "TMDB 播出平台 (增强版)",
  description: "优化的TVB播出平台数据获取，包含智能缓存和重试机制",
  requiresWebView: false,
  functionName: "tmdbDiscoverByNetworkEnhanced",
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
        { title: "TVB", value: "48" },
        // ... 其他平台
      ]
    },
    // ... 其他参数
  ]
}
```

### 步骤4: 添加诊断工具
在你的脚本中添加诊断函数：

```javascript
// 诊断TVB问题
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
  
  return {
    cache: cacheStats,
    performance: performanceStats,
    apiKeyConfigured: !!(API_KEY && API_KEY !== 'your_api_key_here'),
    networkCondition: detectNetworkCondition()
  };
}
```

## 🧪 测试方法

### 1. 基础测试
```javascript
// 测试TVB数据获取
async function testTvbData() {
  try {
    const result = await tmdbDiscoverByNetworkEnhanced({
      with_networks: "48", // TVB平台ID
      language: "zh-CN",
      page: 1,
      max_retries: 3
    });
    
    console.log('TVB数据获取结果:', result.length, '条数据');
    console.log('数据健康度:', checkTvbDataHealth(result));
    
    return result;
  } catch (error) {
    console.error('TVB测试失败:', error.message);
    return [];
  }
}
```

### 2. 性能测试
```javascript
// 测试性能指标
function testPerformance() {
  const stats = tvbPerformanceMonitor.getStats();
  console.log('性能统计:', stats);
  
  const cacheStats = enhancedTvbCache.stats();
  console.log('缓存统计:', cacheStats);
  
  return { performance: stats, cache: cacheStats };
}
```

### 3. 诊断测试
```javascript
// 完整诊断
function fullDiagnosis() {
  const diagnosis = diagnoseTvbIssues();
  console.log('完整诊断报告:', diagnosis);
  
  // 测试网络连接
  console.log('网络状态:', detectNetworkCondition());
  
  // 测试API密钥
  console.log('API密钥状态:', diagnosis.apiKeyConfigured);
  
  return diagnosis;
}
```

## 🔍 故障排除

### 常见问题及解决方案：

1. **API密钥错误**
   ```javascript
   // 检查API密钥配置
   console.log('API密钥:', API_KEY ? '已配置' : '未配置');
   ```

2. **网络连接问题**
   ```javascript
   // 测试网络连接
   async function testNetworkConnection() {
     try {
       const response = await Widget.tmdb.get("/configuration", {
         params: { api_key: API_KEY }
       });
       console.log('网络连接正常');
       return true;
     } catch (error) {
       console.error('网络连接失败:', error.message);
       return false;
     }
   }
   ```

3. **数据格式问题**
   ```javascript
   // 验证数据格式
   function validateTvbData(data) {
     if (!Array.isArray(data)) {
       console.error('数据格式错误: 不是数组');
       return false;
     }
     
     const validItems = data.filter(item => 
       item && item.id && item.title && item.posterPath
     );
     
     console.log(`数据验证: ${validItems.length}/${data.length} 有效`);
     return validItems.length > 0;
   }
   ```

## 📊 监控指标

### 关键性能指标：

1. **缓存命中率**: 目标 > 80%
2. **API成功率**: 目标 > 95%
3. **平均响应时间**: 目标 < 2000ms
4. **数据健康度**: 目标 > 90%

### 监控代码：
```javascript
// 定期监控
setInterval(() => {
  const stats = tvbPerformanceMonitor.getStats();
  const cacheStats = enhancedTvbCache.stats();
  
  console.log('=== 定期监控 ===');
  console.log('API成功率:', stats.successRate + '%');
  console.log('缓存命中率:', cacheStats.hitRate + '%');
  console.log('平均响应时间:', stats.avgResponseTime + 'ms');
  
  // 告警条件
  if (parseFloat(stats.successRate) < 90) {
    console.warn('⚠️ API成功率过低');
  }
  
  if (parseFloat(cacheStats.hitRate) < 70) {
    console.warn('⚠️ 缓存命中率过低');
  }
}, 5 * 60 * 1000); // 每5分钟检查一次
```

## 🚀 使用建议

1. **逐步集成**: 先测试增强版函数，确认无误后再完全替换
2. **监控日志**: 密切关注控制台日志，及时发现问题
3. **定期维护**: 定期清理缓存，重置性能统计
4. **备用方案**: 保留原有的降级数据获取逻辑

## 📞 技术支持

如果遇到问题，请检查：

1. API密钥是否正确配置
2. 网络连接是否正常
3. 控制台是否有错误信息
4. 数据格式是否符合预期

使用 `diagnoseTvbIssues()` 函数获取详细的诊断信息。