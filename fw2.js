// ========== FWWidgets fw2.js 脚本 ==========
// ✨ 动画模块数据函数集合

// 配置常量
const CONFIG = {
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  MAX_ITEMS: 30, // 最大条数
  MAX_CONCURRENT: 5, // 并发数
  LOG_LEVEL: 'info',
  LRU_CACHE_SIZE: 100, // LRU缓存最大容量
  ENABLE_TV_LOGOS: true, // 启用剧集Logo背景图功能
  TV_LOGO_CACHE_DURATION: 60 * 60 * 1000 // 剧集Logo缓存1小时
};

// API密钥配置
const API_KEY = "your_tmdb_api_key_here"; // 请替换为您的TMDB API密钥

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

// 创建缓存实例
const animeCache = new LRUCache(CONFIG.LRU_CACHE_SIZE);
const genreCache = new LRUCache(50);

// ========== ✨ 动画模块核心函数 ==========

/**
 * ✨ 获取TMDB动画类型数据
 * @param {Object} params - 参数对象
 * @returns {Promise<Array>} 动画数据数组
 */
async function fetchTmdbGenres() {
  const cacheKey = 'tmdb_genres';
  const cached = genreCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    log('[动画模块] 获取TMDB类型数据...', 'info');
    
    const [movieRes, tvRes] = await Promise.allSettled([
      Widget.tmdb.get("/genre/movie/list", { 
        params: { language: 'zh-CN', api_key: API_KEY }
      }),
      Widget.tmdb.get("/genre/tv/list", { 
        params: { language: 'zh-CN', api_key: API_KEY }
      })
    ]);
    
    const genres = {};
    
    // 合并电影和电视剧类型
    if (movieRes.status === 'fulfilled' && movieRes.value?.genres) {
      movieRes.value.genres.forEach(genre => genres[genre.id] = genre.name);
    }
    if (tvRes.status === 'fulfilled' && tvRes.value?.genres) {
      tvRes.value.genres.forEach(genre => genres[genre.id] = genre.name);
    }
    
    genreCache.set(cacheKey, genres);
    log(`[动画模块] 类型数据获取完成，共${Object.keys(genres).length}个类型`, 'info');
    return genres;
    
  } catch (error) {
    log(`[动画模块] 获取类型数据失败: ${error.message}`, 'error');
    return {};
  }
}

/**
 * 格式化TMDB项目数据
 * @param {Object} item - TMDB原始数据
 * @param {Object} genreMap - 类型映射
 * @returns {Object} 格式化后的数据
 */
function formatTmdbItem(item, genreMap) {
  // 选择中文标题
  function pickChineseTitle(...args) {
    for (const title of args) {
      if (title && typeof title === 'string' && title.trim()) {
        // 检查是否包含中文字符
        if (/[\u4e00-\u9fa5]/.test(title)) {
          return title.trim();
        }
      }
    }
    return args[0] || '未知标题';
  }
  
  // 处理描述
  function pickChineseDescription(overview) {
    if (!overview) return '暂无简介';
    
    // 如果描述太长，截断并添加省略号
    if (overview.length > 100) {
      return overview.substring(0, 100) + '...';
    }
    
    return overview;
  }
  
  const title = pickChineseTitle(item.title, item.name, item.original_title, item.original_name);
  const description = pickChineseDescription(item.overview);
  
  return {
    id: item.id,
    title: title,
    description: description,
    releaseDate: item.release_date || item.first_air_date || '未知日期',
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
    rating: item.vote_average ? item.vote_average.toFixed(1) : '无评分',
    voteCount: item.vote_count || 0,
    popularity: item.popularity || 0,
    mediaType: item.media_type || (item.title ? 'movie' : 'tv'),
    genreIds: item.genre_ids || [],
    genreMap: genreMap,
    genreTitle: item.genre_ids && item.genre_ids.length > 0 ? 
      item.genre_ids.slice(0, 3).map(id => genreMap[id]).filter(Boolean).join('•') : '未知类型'
  };
}

/**
 * ✨ Bangumi热门新番 - 最新热门新番动画
 * @param {Object} params - 参数对象
 * @returns {Promise<Array>} 动画数据数组
 */
async function bangumiHotNewAnime(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_origin_country = "JP",
    with_genres = "16",
    sort_by = "popularity.desc",
    vote_average_gte = "6.0",
    year = "",
    max_items = CONFIG.MAX_ITEMS
  } = params;
  
  const cacheKey = `bangumi_${JSON.stringify(params)}`;
  const cached = animeCache.get(cacheKey);
  if (cached) {
    log(`[✨动画模块] 缓存命中，返回${cached.length}项数据`, 'info');
    return cached;
  }
  
  try {
    log(`[✨动画模块] 开始获取动画数据，排序: ${sort_by}`, 'info');
    const endpoint = "/discover/tv";
    
    // 构建查询参数 - 支持多类型动画
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      vote_count_gte: 10  // 新番投票较少，降低门槛
    };
    
    // 动画类型筛选 - 确保只获取动画内容
    if (with_genres && with_genres !== "") {
      queryParams.with_genres = with_genres;
      // 确保包含动画类型
      if (!queryParams.with_genres.includes("16")) {
        queryParams.with_genres = `${queryParams.with_genres},16`;
      }
    } else {
      queryParams.with_genres = "16"; // 默认动画
    }
    
    // 添加制作地区
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
      log(`[✨动画模块] 地区筛选: ${with_origin_country}`, 'info');
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
      log(`[✨动画模块] 最低评分: ${vote_average_gte}`, 'info');
    }
    
    // 添加年份筛选
    if (year && year !== "") {
      // 设置年份范围，从该年1月1日到12月31日
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      queryParams.first_air_date_gte = startDate;
      queryParams.first_air_date_lte = endDate;
      log(`[✨动画模块] 年份筛选: ${year}年 (${startDate} - ${endDate})`, 'info');
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    log(`[✨动画模块] 获取到 ${res.results.length} 项动画数据`, 'info');
    
    const genreMap = await fetchTmdbGenres();
    let results = res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap);
        // 添加Bangumi新番标识
        formattedItem.type = "bangumi-new";
        formattedItem.source = "✨Bangumi热门新番";
        formattedItem.isNewAnime = true;
        
        // 优化日期显示
        if (formattedItem.releaseDate) {
          const date = new Date(formattedItem.releaseDate);
          if (!isNaN(date.getTime())) {
            formattedItem.airDate = formattedItem.releaseDate;
            formattedItem.airYear = date.getFullYear();
            formattedItem.isRecent = (new Date().getTime() - date.getTime()) < (365 * 24 * 60 * 60 * 1000); // 一年内
          }
        }
        
        return formattedItem;
      })
      .filter(item => item.posterPath);
    
    // 根据排序方式进一步优化结果
    if (sort_by.includes("first_air_date") || sort_by.includes("last_air_date")) {
      // 日期排序时，优先显示有播出日期的动画
      results = results.sort((a, b) => {
        const aDate = a.airDate ? new Date(a.airDate).getTime() : 0;
        const bDate = b.airDate ? new Date(b.airDate).getTime() : 0;
        
        if (sort_by.includes("desc")) {
          return bDate - aDate; // 最新在前
        } else {
          return aDate - bDate; // 最早在前
        }
      });
      
      log(`[✨动画模块] 按播出日期排序完成，共 ${results.length} 项`, 'info');
    }
    
    // 限制返回数量
    results = results.slice(0, max_items);
    
    // 缓存结果
    animeCache.set(cacheKey, results);
    
    log(`[✨动画模块] 数据处理完成，返回 ${results.length} 项`, 'info');
    return results;
    
  } catch (error) {
    log(`[✨动画模块] 获取动画数据失败: ${error.message}`, 'error');
    return [];
  }
}

/**
 * ✨ 获取热门动画电影
 * @param {Object} params - 参数对象
 * @returns {Promise<Array>} 动画电影数据数组
 */
async function getPopularAnimeMovies(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_genres = "16",
    sort_by = "popularity.desc",
    vote_average_gte = "6.0",
    year = "",
    max_items = CONFIG.MAX_ITEMS
  } = params;
  
  const cacheKey = `anime_movies_${JSON.stringify(params)}`;
  const cached = animeCache.get(cacheKey);
  if (cached) {
    log(`[✨动画模块] 动画电影缓存命中，返回${cached.length}项数据`, 'info');
    return cached;
  }
  
  try {
    log(`[✨动画模块] 开始获取热门动画电影数据`, 'info');
    const endpoint = "/discover/movie";
    
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      with_genres: with_genres || "16", // 动画类型
      vote_count_gte: 50
    };
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 添加年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      queryParams.primary_release_date_gte = startDate;
      queryParams.primary_release_date_lte = endDate;
    }
    
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    log(`[✨动画模块] 获取到 ${res.results.length} 项动画电影数据`, 'info');
    
    const genreMap = await fetchTmdbGenres();
    let results = res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap);
        formattedItem.type = "anime-movie";
        formattedItem.source = "✨热门动画电影";
        formattedItem.mediaType = "movie";
        return formattedItem;
      })
      .filter(item => item.posterPath)
      .slice(0, max_items);
    
    // 缓存结果
    animeCache.set(cacheKey, results);
    
    log(`[✨动画模块] 动画电影数据处理完成，返回 ${results.length} 项`, 'info');
    return results;
    
  } catch (error) {
    log(`[✨动画模块] 获取动画电影数据失败: ${error.message}`, 'error');
    return [];
  }
}

/**
 * ✨ 获取最新动画剧集
 * @param {Object} params - 参数对象
 * @returns {Promise<Array>} 动画剧集数据数组
 */
async function getLatestAnimeTV(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_genres = "16",
    sort_by = "first_air_date.desc",
    vote_average_gte = "6.0",
    year = "",
    max_items = CONFIG.MAX_ITEMS
  } = params;
  
  const cacheKey = `anime_tv_${JSON.stringify(params)}`;
  const cached = animeCache.get(cacheKey);
  if (cached) {
    log(`[✨动画模块] 动画剧集缓存命中，返回${cached.length}项数据`, 'info');
    return cached;
  }
  
  try {
    log(`[✨动画模块] 开始获取最新动画剧集数据`, 'info');
    const endpoint = "/discover/tv";
    
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      with_genres: with_genres || "16", // 动画类型
      vote_count_gte: 10
    };
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 添加年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      queryParams.first_air_date_gte = startDate;
      queryParams.first_air_date_lte = endDate;
    }
    
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    log(`[✨动画模块] 获取到 ${res.results.length} 项动画剧集数据`, 'info');
    
    const genreMap = await fetchTmdbGenres();
    let results = res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap);
        formattedItem.type = "anime-tv";
        formattedItem.source = "✨最新动画剧集";
        formattedItem.mediaType = "tv";
        return formattedItem;
      })
      .filter(item => item.posterPath)
      .slice(0, max_items);
    
    // 缓存结果
    animeCache.set(cacheKey, results);
    
    log(`[✨动画模块] 动画剧集数据处理完成，返回 ${results.length} 项`, 'info');
    return results;
    
  } catch (error) {
    log(`[✨动画模块] 获取动画剧集数据失败: ${error.message}`, 'error');
    return [];
  }
}

/**
 * ✨ 获取高分动画内容
 * @param {Object} params - 参数对象
 * @returns {Promise<Array>} 高分动画数据数组
 */
async function getTopRatedAnime(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_genres = "16",
    vote_average_gte = "7.0",
    year = "",
    max_items = CONFIG.MAX_ITEMS
  } = params;
  
  const cacheKey = `top_anime_${JSON.stringify(params)}`;
  const cached = animeCache.get(cacheKey);
  if (cached) {
    log(`[✨动画模块] 高分动画缓存命中，返回${cached.length}项数据`, 'info');
    return cached;
  }
  
  try {
    log(`[✨动画模块] 开始获取高分动画数据`, 'info');
    
    // 获取电影和剧集的高分内容
    const endpoints = [
      { api: "/discover/movie", mediaType: "movie", source: "✨高分动画电影" },
      { api: "/discover/tv", mediaType: "tv", source: "✨高分动画剧集" }
    ];
    
    let allResults = [];
    
    for (const endpoint of endpoints) {
      const queryParams = { 
        language, 
        page, 
        sort_by: "vote_average.desc",
        api_key: API_KEY,
        with_genres: with_genres || "16",
        vote_average_gte: vote_average_gte,
        vote_count_gte: 100
      };
      
      // 添加年份筛选
      if (year && year !== "") {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        if (endpoint.mediaType === "movie") {
          queryParams.primary_release_date_gte = startDate;
          queryParams.primary_release_date_lte = endDate;
        } else {
          queryParams.first_air_date_gte = startDate;
          queryParams.first_air_date_lte = endDate;
        }
      }
      
      const res = await Widget.tmdb.get(endpoint.api, {
        params: queryParams
      });
      
      const genreMap = await fetchTmdbGenres();
      const endpointResults = res.results
        .map(item => {
          const formattedItem = formatTmdbItem(item, genreMap);
          formattedItem.type = `top-anime-${endpoint.mediaType}`;
          formattedItem.source = endpoint.source;
          formattedItem.mediaType = endpoint.mediaType;
          return formattedItem;
        })
        .filter(item => item.posterPath);
      
      allResults.push(...endpointResults);
    }
    
    // 按评分排序
    allResults.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    
    // 限制返回数量
    allResults = allResults.slice(0, max_items);
    
    // 缓存结果
    animeCache.set(cacheKey, allResults);
    
    log(`[✨动画模块] 高分动画数据处理完成，返回 ${allResults.length} 项`, 'info');
    return allResults;
    
  } catch (error) {
    log(`[✨动画模块] 获取高分动画数据失败: ${error.message}`, 'error');
    return [];
  }
}

/**
 * ✨ 获取指定年份的动画内容
 * @param {Object} params - 参数对象
 * @returns {Promise<Array>} 指定年份动画数据数组
 */
async function getAnimeByYear(params = {}) {
  const { 
    year = new Date().getFullYear().toString(),
    language = "zh-CN", 
    page = 1, 
    with_genres = "16",
    sort_by = "popularity.desc",
    vote_average_gte = "6.0",
    max_items = CONFIG.MAX_ITEMS
  } = params;
  
  const cacheKey = `anime_year_${year}_${JSON.stringify(params)}`;
  const cached = animeCache.get(cacheKey);
  if (cached) {
    log(`[✨动画模块] ${year}年动画缓存命中，返回${cached.length}项数据`, 'info');
    return cached;
  }
  
  try {
    log(`[✨动画模块] 开始获取${year}年动画数据`, 'info');
    
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    // 获取电影和剧集
    const endpoints = [
      { 
        api: "/discover/movie", 
        mediaType: "movie", 
        source: `✨${year}年动画电影`,
        dateField: "primary_release_date"
      },
      { 
        api: "/discover/tv", 
        mediaType: "tv", 
        source: `✨${year}年动画剧集`,
        dateField: "first_air_date"
      }
    ];
    
    let allResults = [];
    
    for (const endpoint of endpoints) {
      const queryParams = { 
        language, 
        page, 
        sort_by,
        api_key: API_KEY,
        with_genres: with_genres || "16",
        vote_average_gte: vote_average_gte,
        vote_count_gte: 10
      };
      
      // 添加日期筛选
      queryParams[`${endpoint.dateField}_gte`] = startDate;
      queryParams[`${endpoint.dateField}_lte`] = endDate;
      
      const res = await Widget.tmdb.get(endpoint.api, {
        params: queryParams
      });
      
      const genreMap = await fetchTmdbGenres();
      const endpointResults = res.results
        .map(item => {
          const formattedItem = formatTmdbItem(item, genreMap);
          formattedItem.type = `anime-${endpoint.mediaType}-${year}`;
          formattedItem.source = endpoint.source;
          formattedItem.mediaType = endpoint.mediaType;
          formattedItem.year = year;
          return formattedItem;
        })
        .filter(item => item.posterPath);
      
      allResults.push(...endpointResults);
    }
    
    // 限制返回数量
    allResults = allResults.slice(0, max_items);
    
    // 缓存结果
    animeCache.set(cacheKey, allResults);
    
    log(`[✨动画模块] ${year}年动画数据处理完成，返回 ${allResults.length} 项`, 'info');
    return allResults;
    
  } catch (error) {
    log(`[✨动画模块] 获取${year}年动画数据失败: ${error.message}`, 'error');
    return [];
  }
}

/**
 * ✨ 获取动画模块统计信息
 * @returns {Object} 统计信息
 */
function getAnimeModuleStats() {
  return {
    animeCache: animeCache.stats(),
    genreCache: genreCache.stats(),
    config: CONFIG,
    functions: [
      'bangumiHotNewAnime',
      'getPopularAnimeMovies', 
      'getLatestAnimeTV',
      'getTopRatedAnime',
      'getAnimeByYear'
    ]
  };
}

/**
 * ✨ 清理动画模块缓存
 */
function clearAnimeCache() {
  animeCache.clear();
  genreCache.clear();
  log('[✨动画模块] 缓存已清理', 'info');
}

// ========== 导出函数 ==========

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // 核心函数
    bangumiHotNewAnime,
    getPopularAnimeMovies,
    getLatestAnimeTV,
    getTopRatedAnime,
    getAnimeByYear,
    
    // 工具函数
    fetchTmdbGenres,
    formatTmdbItem,
    getAnimeModuleStats,
    clearAnimeCache,
    
    // 配置
    CONFIG
  };
}

// 如果在浏览器环境中
if (typeof window !== 'undefined') {
  window.AnimeModule = {
    bangumiHotNewAnime,
    getPopularAnimeMovies,
    getLatestAnimeTV,
    getTopRatedAnime,
    getAnimeByYear,
    fetchTmdbGenres,
    formatTmdbItem,
    getAnimeModuleStats,
    clearAnimeCache,
    CONFIG
  };
}

// 全局函数（兼容性）
if (typeof global !== 'undefined') {
  global.bangumiHotNewAnime = bangumiHotNewAnime;
  global.getPopularAnimeMovies = getPopularAnimeMovies;
  global.getLatestAnimeTV = getLatestAnimeTV;
  global.getTopRatedAnime = getTopRatedAnime;
  global.getAnimeByYear = getAnimeByYear;
  global.getAnimeModuleStats = getAnimeModuleStats;
  global.clearAnimeCache = clearAnimeCache;
}

// 初始化日志
log('[✨动画模块] FWWidgets fw2.js 脚本加载完成！', 'info');
log('[✨动画模块] 可用函数:', 'info');
log('  - bangumiHotNewAnime: 获取热门新番动画', 'info');
log('  - getPopularAnimeMovies: 获取热门动画电影', 'info');
log('  - getLatestAnimeTV: 获取最新动画剧集', 'info');
log('  - getTopRatedAnime: 获取高分动画内容', 'info');
log('  - getAnimeByYear: 获取指定年份动画', 'info');
log('  - getAnimeModuleStats: 获取模块统计信息', 'info');
log('  - clearAnimeCache: 清理缓存', 'info');