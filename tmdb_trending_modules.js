// ========== TMDB热门内容模块拆分 ==========
// 按内容类型拆分的独立模块

// 基础配置和工具函数
const CONFIG = {
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  FRESH_DATA_DURATION: 2 * 60 * 60 * 1000, // 2小时内数据新鲜
  MAX_ITEMS: 30, // 最大条数
  MAX_CONCURRENT: 5, // 并发数
  LOG_LEVEL: 'info',
  LRU_CACHE_SIZE: 100, // LRU缓存最大容量
  ENABLE_TV_LOGOS: true, // 启用剧集Logo背景图功能
  TV_LOGO_CACHE_DURATION: 60 * 60 * 1000 // 剧集Logo缓存1小时
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

// 缓存实例
const trendingDataLRUCache = new LRUCache(10);
const backdropLRUCache = new LRUCache(CONFIG.LRU_CACHE_SIZE);

// 缓存工具函数
function getCachedTrendingData() { return trendingDataLRUCache.get('trending_data'); }
function cacheTrendingData(data) { trendingDataLRUCache.set('trending_data', data); }
function getCachedBackdrop(key) { return backdropLRUCache.get(key); }
function cacheBackdrop(key, data) { backdropLRUCache.set(key, data); }

// 工具函数
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
function uniqBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// ========== 今日热门模块 ==========
async function loadTodayTrending(params = {}) {
  const { 
    media_type = "all", 
    language = "zh-CN", 
    max_items = 30 
  } = params;
  
  try {
    let results = [];
    
    console.log(`[今日热门模块] 加载今日热门数据...`);
    
    // 尝试从缓存获取数据
    const todayData = await loadTmdbTrendingData();
    if (todayData && todayData.today_global && todayData.today_global.length > 0) {
      results = todayData.today_global.map(item => createEnhancedWidgetItem(item));
      console.log(`[今日热门模块] 从缓存获取今日热门: ${results.length}项`);
    }
    
    // 如果缓存数据不足，补充API数据
    if (results.length < max_items) {
      console.log(`[今日热门模块] 缓存数据不足，补充API数据...`);
      
      // 根据媒体类型选择API端点
      let apiEndpoint = "/trending/all/day";
      if (media_type === "tv") {
        apiEndpoint = "/trending/tv/day";  // 专门获取剧集
        console.log(`[今日热门模块] 选择剧集专用API: ${apiEndpoint}`);
      } else if (media_type === "movie") {
        apiEndpoint = "/trending/movie/day";  // 专门获取电影
        console.log(`[今日热门模块] 选择电影专用API: ${apiEndpoint}`);
      }
      
      // 获取多页数据以增加数量
      const pages = [1, 2, 3];  // 获取前3页
      const allApiResults = [];
      
      for (const pageNum of pages) {
        const res = await Widget.tmdb.get(apiEndpoint, { 
          params: { 
            language: 'zh-CN',
            region: 'CN',
            api_key: API_KEY,
            page: pageNum
          }
        });
        const genreMap = await fetchTmdbGenres();
        const pageResults = res.results
          .map(item => formatTmdbItem(item, genreMap))
          .filter(item => item.posterPath);
        allApiResults.push(...pageResults);
      }
      
      // 合并结果，去重
      const existingIds = new Set(results.map(item => item.id));
      const newResults = allApiResults.filter(item => !existingIds.has(item.id));
      results = [...results, ...newResults];
      console.log(`[今日热门模块] 补充API数据: ${newResults.length}项`);
    }
    
    // 根据媒体类型过滤结果
    if (media_type !== "all") {
      results = results.filter(item => {
        if (media_type === "movie") {
          return item.mediaType === "movie";
        } else if (media_type === "tv") {
          return item.mediaType === "tv";
        }
        return true;
      });
    }
    
    // 限制返回数量
    results = results.slice(0, max_items);
    
    console.log(`[今日热门模块] 最终返回: ${results.length}项`);
    return results;
    
  } catch (error) {
    console.error("Error in loadTodayTrending:", error);
    return [];
  }
}

// ========== 本周热门模块 ==========
async function loadWeekTrending(params = {}) {
  const { 
    media_type = "all", 
    language = "zh-CN", 
    max_items = 30 
  } = params;
  
  try {
    let results = [];
    
    console.log(`[本周热门模块] 加载本周热门数据...`);
    
    // 尝试从缓存获取数据
    const weekData = await loadTmdbTrendingData();
    if (weekData && weekData.week_global_all && weekData.week_global_all.length > 0) {
      results = weekData.week_global_all.map(item => createEnhancedWidgetItem(item));
      console.log(`[本周热门模块] 从缓存获取本周热门: ${results.length}项`);
    }
    
    // 如果缓存数据不足，补充API数据
    if (results.length < max_items) {
      console.log(`[本周热门模块] 缓存数据不足，补充API数据...`);
      
      // 根据媒体类型选择API端点
      let apiEndpoint = "/trending/all/week";
      if (media_type === "tv") {
        apiEndpoint = "/trending/tv/week";  // 专门获取剧集
        console.log(`[本周热门模块] 选择剧集专用API: ${apiEndpoint}`);
      } else if (media_type === "movie") {
        apiEndpoint = "/trending/movie/week";  // 专门获取电影
        console.log(`[本周热门模块] 选择电影专用API: ${apiEndpoint}`);
      }
      
      // 获取多页数据以增加数量
      const pages = [1, 2, 3];  // 获取前3页
      const allApiResults = [];
      
      for (const pageNum of pages) {
        const res = await Widget.tmdb.get(apiEndpoint, { 
          params: { 
            language: 'zh-CN',
            region: 'CN',
            api_key: API_KEY,
            page: pageNum
          }
        });
        const genreMap = await fetchTmdbGenres();
        const pageResults = res.results
          .map(item => formatTmdbItem(item, genreMap))
          .filter(item => item.posterPath);
        allApiResults.push(...pageResults);
      }
      
      // 合并结果，去重
      const existingIds = new Set(results.map(item => item.id));
      const newResults = allApiResults.filter(item => !existingIds.has(item.id));
      results = [...results, ...newResults];
      console.log(`[本周热门模块] 补充API数据: ${newResults.length}项`);
    }
    
    // 根据媒体类型过滤结果
    if (media_type !== "all") {
      results = results.filter(item => {
        if (media_type === "movie") {
          return item.mediaType === "movie";
        } else if (media_type === "tv") {
          return item.mediaType === "tv";
        }
        return true;
      });
    }
    
    // 限制返回数量
    results = results.slice(0, max_items);
    
    console.log(`[本周热门模块] 最终返回: ${results.length}项`);
    return results;
    
  } catch (error) {
    console.error("Error in loadWeekTrending:", error);
    return [];
  }
}

// ========== 热门内容模块 ==========
async function loadPopularContent(params = {}) {
  const { 
    media_type = "all", 
    language = "zh-CN", 
    page = 1,
    content_type = "popularity.desc",
    max_items = 30 
  } = params;
  
  try {
    let results = [];
    
    console.log(`[热门内容模块] 加载热门内容数据...`);
    
    // 尝试从缓存获取数据
    if ((parseInt(page) || 1) === 1 && content_type.startsWith("popularity")) {
      const popularData = await loadTmdbTrendingData();
      if (popularData.popular_movies && popularData.popular_movies.length > 0) {
        results = await loadEnhancedTitlePosterWithBackdrops(popularData.popular_movies, max_items, "popular");
        console.log(`[热门内容模块] 热门内容加载完成: ${results.length}项`);
      }
    }
    
    // 如果缓存数据不足，补充API数据
    if (results.length < max_items) {
      console.log(`[热门内容模块] 缓存数据不足，补充API数据...`);

      // 根据媒体类型选择API端点
      const endpoints = [];
      if (media_type === "all" || media_type === "movie") {
        endpoints.push({ api: "/movie/popular", mediaType: "movie" });
      }
      if (media_type === "all" || media_type === "tv") {
        endpoints.push({ api: "/tv/popular", mediaType: "tv" });
      }

      const pages = [1, 2, 3];  // 获取前3页
      const allApiResults = [];

      for (const endpoint of endpoints) {
        for (const pageNum of pages) {
          const res = await Widget.tmdb.get(endpoint.api, {
            params: {
              language: 'zh-CN',
              region: 'CN',
              page: pageNum,
              api_key: API_KEY
            }
          });
          const genreMap = await fetchTmdbGenres();
          const pageResults = res.results.map(item => formatTmdbItem(item, genreMap));
          allApiResults.push(...pageResults);
        }
      }

      // 合并结果，去重
      const existingIds = new Set(results.map(item => item.id));
      const newResults = allApiResults.filter(item => !existingIds.has(item.id) && item.posterPath);
      results = [...results, ...newResults];
      console.log(`[热门内容模块] 补充API数据: ${newResults.length}项`);
    }
    
    // 根据媒体类型过滤结果
    if (media_type !== "all") {
      results = results.filter(item => {
        if (media_type === "movie") {
          return item.mediaType === "movie";
        } else if (media_type === "tv") {
          return item.mediaType === "tv";
        }
        return true;
      });
    }
    
    // 限制返回数量
    results = results.slice(0, max_items);
    
    console.log(`[热门内容模块] 最终返回: ${results.length}项`);
    return results;
    
  } catch (error) {
    console.error("Error in loadPopularContent:", error);
    return [];
  }
}

// ========== 高分内容模块 ==========
async function loadTopRatedContent(params = {}) {
  const { 
    media_type = "all", 
    language = "zh-CN", 
    content_type = "vote_average.desc",
    max_items = 30 
  } = params;
  
  try {
    let results = [];
    
    console.log(`[高分内容模块] 加载高分内容数据...`);
    
    if (content_type.startsWith("vote_average")) {
      // 尝试从缓存获取高分内容
      const popularData = await loadTmdbTrendingData();
      if (popularData.popular_movies && popularData.popular_movies.length > 0) {
        results = await loadEnhancedTitlePosterWithBackdrops(popularData.popular_movies, max_items, "top_rated");
        console.log(`[高分内容模块] 高分内容加载完成: ${results.length}项`);
      }
      
      // 如果缓存数据不足，补充API数据
      if (results.length < max_items) {
        console.log(`[高分内容模块] 缓存数据不足，补充API数据...`);
        
        // 根据媒体类型选择API端点
        const endpoints = [];
        if (media_type === "all" || media_type === "movie") {
          endpoints.push({ api: "/movie/top_rated", mediaType: "movie" });
        }
        if (media_type === "all" || media_type === "tv") {
          endpoints.push({ api: "/tv/top_rated", mediaType: "tv" });
        }
        
        for (const endpoint of endpoints) {
          const res = await Widget.tmdb.get(endpoint.api, { 
            params: { 
              language: 'zh-CN', 
              region: 'CN',
              page: 1, 
              api_key: API_KEY 
            }
          });
          const genreMap = await fetchTmdbGenres();
          const endpointResults = res.results
            .map(item => formatTmdbItem(item, genreMap))
            .filter(item => item.posterPath);
          results.push(...endpointResults);
        }
        
        console.log(`[高分内容模块] 补充API数据: ${results.length}项`);
      }
    } else {
      // 使用discover API
      const endpoints = [];
      if (media_type === "all" || media_type === "movie") {
        endpoints.push({ api: "/discover/movie", mediaType: "movie" });
      }
      if (media_type === "all" || media_type === "tv") {
        endpoints.push({ api: "/discover/tv", mediaType: "tv" });
      }
      
      for (const endpoint of endpoints) {
        const res = await Widget.tmdb.get(endpoint.api, {
          params: { 
            language: 'zh-CN',
            region: 'CN', 
            page: 1, 
            sort_by: content_type,
            api_key: API_KEY 
          }
        });
        const genreMap = await fetchTmdbGenres();
        const endpointResults = res.results
          .map(item => formatTmdbItem(item, genreMap))
          .filter(item => item.posterPath);
        results.push(...endpointResults);
      }
      
      console.log(`[高分内容模块] 获取discover内容: ${results.length}项`);
    }
    
    // 根据媒体类型过滤结果
    if (media_type !== "all") {
      results = results.filter(item => {
        if (media_type === "movie") {
          return item.mediaType === "movie";
        } else if (media_type === "tv") {
          return item.mediaType === "tv";
        }
        return true;
      });
    }
    
    // 限制返回数量
    results = results.slice(0, max_items);
    
    console.log(`[高分内容模块] 最终返回: ${results.length}项`);
    return results;
    
  } catch (error) {
    console.error("Error in loadTopRatedContent:", error);
    return [];
  }
}

// ========== 统一入口函数 ==========
async function loadTmdbTrendingByType(params = {}) {
  const { 
    content_type = "today",  // 内容类型：today, week, popular, top_rated
    media_type = "all", 
    language = "zh-CN", 
    page = 1, 
    sort_by = "popularity.desc",
    max_items = 30 
  } = params;
  
  try {
    console.log(`[TMDB热门内容] 加载内容类型: ${content_type}, 媒体类型: ${media_type}`);
    
    let results = [];
    
    switch (content_type) {
      case "today":
        results = await loadTodayTrending({ media_type, language, max_items });
        break;
        
      case "week":
        results = await loadWeekTrending({ media_type, language, max_items });
        break;
        
      case "popular":
        results = await loadPopularContent({ media_type, language, page, content_type: sort_by, max_items });
        break;
        
      case "top_rated":
        results = await loadTopRatedContent({ media_type, language, content_type: sort_by, max_items });
        break;
        
      default:
        console.error("Unknown content type:", content_type);
        return [];
    }
    
    console.log(`[TMDB热门内容] 最终返回: ${results.length}项`);
    return results;
    
  } catch (error) {
    console.error("Error in loadTmdbTrendingByType:", error);
    return [];
  }
}

// ========== 导出模块 ==========
module.exports = {
  // 配置
  CONFIG,
  
  // 缓存工具
  getCachedTrendingData,
  cacheTrendingData,
  getCachedBackdrop,
  cacheBackdrop,
  
  // 日志工具
  log,
  
  // 主要功能函数
  loadTmdbTrendingByType,
  loadTodayTrending,
  loadWeekTrending,
  loadPopularContent,
  loadTopRatedContent,
  
  // 工具函数
  deepClone,
  uniqBy
};