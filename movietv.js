// --- TVB优化及其他增强 TMDB 数据获取函数 ---
// 详细过滤：仅返回包含中文信息的影视条目

// 避免非支持内容
function pickEnhancedChineseTitle(item) {
    // 同 pickChineseTitle 的功能，用于增强版本
    if (item.title_zh && /[\u4e00-\u9fa5]/.test(item.title_zh)) return item.title_zh.trim();
    if (item.name_zh && /[\u4e00-\u9fa5]/.test(item.name_zh)) return item.name_zh.trim();
    if (item.original_title_zh && /[\u4e00-\u9fa5]/.test(item.original_title_zh)) return item.original_title_zh.trim();
    if (item.original_name_zh && /[\u4e00-\u9fa5]/.test(item.original_name_zh)) return item.original_name_zh.trim();
    if (item.title) return item.title.trim();
    if (item.name) return item.name.trim();
    if (item.original_title) return item.original_title.trim();
    if (item.original_name) return item.original_name.trim();
    return '未知标题';
}
function pickChineseDescription(overview) {
    if (!overview || typeof overview !== 'string') return "暂无简介";
    const trimmed = overview.trim();
    return trimmed.length > 0 ? trimmed : "暂无简介";
}

// 格式化每个影视项目（优先中文）
function formatTmdbItem(item, genreMap) {
  function pickChineseTitle(...args) {
    // 第一轮：寻找包含中文的标题
    for (const str of args) {
      if (str && typeof str === 'string' && /[\u4e00-\u9fa5]/.test(str.trim())) {
        return str.trim();
      }
    }
    // 第二轮：寻找非空标题
    for (const str of args) {
      if (str && typeof str === 'string' && str.trim().length > 0) {
        return str.trim();
      }
    }
    return '未知标题';
  }
  
  // 优先使用中文简介
  function pickChineseDescription(overview) {
    if (!overview || typeof overview !== 'string') return "暂无简介";
    const trimmed = overview.trim();
    return trimmed.length > 0 ? trimmed : "暂无简介";
  }
  
  // 生成标题和简介
  const finalTitle = pickChineseTitle(
    item.title_zh,           // 中文标题
    item.name_zh,            // 中文剧集名
    item.original_title_zh,  // 中文原始标题
    item.original_name_zh,   // 中文原始剧集名
    item.title,              // 标题
    item.name,               // 剧集名
    item.original_title,     // 原始标题
    item.original_name       // 原始剧集名
  );
  const finalDesc = pickChineseDescription(item.overview);

  // 如果标题和简介都不包含中文，跳过该条目
  if (!/[\u4e00-\u9fa5]/.test(finalTitle) && !/[\u4e00-\u9fa5]/.test(finalDesc)) {
    return null;
  }

  return {
    id: item.id,
    type: "tmdb",
    title: finalTitle,
    description: finalDesc,
    releaseDate: item.release_date || item.first_air_date || "未知日期",
    // 生成智能图片URL
    posterPath: createSmartPosterUrl(item, 'w500'),
    backdropPath: item.backdrop_path ? createSmartImageUrl(item.backdrop_path, 'backdrop', 'w1280') : "",
    coverUrl: createSmartPosterUrl(item, 'w500'),
    rating: item.vote_average ? item.vote_average.toFixed(1) : "无评分",
    mediaType: item.media_type || (item.title ? "movie" : "tv"),
    genreTitle: getTmdbGenreTitles(item.genre_ids || [], item.media_type || (item.title ? "movie" : "tv")) || "未知类型",
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// TMDB 按出品公司获取内容（增强过滤）
async function tmdbDiscoverByCompany(params = {}) {
  const { language = "zh-CN", page = 1, with_companies, type = "movie", with_genres, sort_by = "popularity.desc" } = params;
  if (language !== 'zh-CN') { return []; }
  try {
    // 构建API端点
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY
    };
    
    // 添加出品公司过滤器
    if (with_companies) {
      queryParams.with_companies = with_companies;
    }
    
    // 添加题材类型过滤器
    if (with_genres) {
      queryParams.with_genres = with_genres;
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => formatTmdbItem(item, genreMap[type]))
      .filter(item => item && item.posterPath); // 仅返回中文条目
  } catch (error) {
    console.error("Error fetching discover by company:", error);
    return [];
  }
}

// TMDB 按播出平台获取内容（调用TVB优化）
async function tmdbDiscoverByNetwork(params = {}) {
  return await tmdbDiscoverByNetworkEnhanced(params);
}
async function tmdbDiscoverByNetworkEnhanced(params = {}) {
  const { 
    language = "zh-CN",
    page = 1,
    with_networks,
    with_genres,
    air_status = "released",
    sort_by = "first_air_date.desc"
  } = params;
  if (language !== 'zh-CN') { return []; }
  // 生成缓存键
  const cacheKey = `tvb_${with_networks}_${with_genres}_${air_status}_${sort_by}_${page}_${language}`;
  
  // 检查缓存
  const cachedData = tvbCache.get(cacheKey);
  if (cachedData) {
    console.log(`[TVB优化] 使用缓存数据，命中率: ${tvbCache.stats().hitRate}%`);
    return cachedData;
  }
  
  try {
    console.log(`[TVB优化] 开始获取TVB数据，参数:`, params);

    const fetchData = async () => {
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
      const res = await Widget.tmdb.get("/discover/tv", { params: discoverParams });
      const genreMap = await fetchTmdbGenres();
      const processedData = res.results
        .map(item => formatTmdbItem(item, genreMap))
        .filter(item => item)  // 过滤掉无中文条目
        .map(item => ({ ...item, isTvbOptimized: true }));
      return processedData;
    };
    
    const processedData = await tvbSmartRetry(fetchData, 3, 1000);
    
    // 缓存结果
    tvbCache.set(cacheKey, processedData, 30 * 60 * 1000); // 30分钟缓存
    
    console.log(`[TVB优化] 成功获取${processedData.length}条TVB数据`);
    return processedData;
  } catch (error) {
    console.error(`[TVB优化] 数据获取失败: ${error.message}`);
    
    // 返回错误项
    return [{
      id: 'tvb-error',
      type: 'error',
      title: 'TVB数据获取失败',
      description: '网络连接或API服务暂时不可用，请稍后重试',
      isTvbOptimized: true
    }];
  }
}

// 获取本周热门影视（增强版横版海报支持）
async function loadWeekGlobalMovies(params = {}) {
  const { language = "zh-CN" } = params;
  if (language !== 'zh-CN') { return []; }
  try {
    const data = await loadTmdbTrendingData();
    if (data && data.week_global_all && data.week_global_all.length > 0) {
      return data.week_global_all.map(item => createEnhancedWidgetItem(item));
    } else {
      // 备用方案：使用标准TMDB API（优先中文）
      console.log("[备用方案] 使用标准TMDB API获取本周热门");
      const res = await Widget.tmdb.get("/trending/all/week", { 
        params: { 
          language: 'zh-CN',
          region: 'CN',
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap))
        .filter(item => item && item.posterPath);
    }
  } catch (error) {
    console.error("Error fetching weekly global movies:", error);
    return [];
  }
}

// 获取热门电影（增强版横版海报支持）
async function tmdbPopularMovies(params = {}) {
  const { language = "zh-CN", page = 1, sort_by = "popularity.desc" } = params;
  if (language !== 'zh-CN') { return []; }
  try {
    // 第一页且是热门度排序时，使用预处理数据（带标题横版海报）
    if ((parseInt(page) || 1) === 1 && sort_by.startsWith("popularity")) {
      const data = await loadTmdbTrendingData();
      if (data.popular_movies && data.popular_movies.length > 0) {
        return data.popular_movies
          .slice(0, 15)
          .map(item => createEnhancedWidgetItem(item));
      }
    }
    
    // 其他情况使用标准TMDB API（优先中文）
    if (sort_by.startsWith("popularity")) {
      const res = await Widget.tmdb.get("/movie/popular", { 
        params: { 
          language: 'zh-CN',
          region: 'CN', 
          page, 
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results.map(item => formatTmdbItem(item, genreMap))
                        .filter(item => item);
    } else {
      const res = await Widget.tmdb.get("/discover/movie", {
        params: { 
          language: 'zh-CN',
          region: 'CN', 
          page, 
          sort_by,
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results.map(item => formatTmdbItem(item, genreMap))
                        .filter(item => item);
    }
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

// 获取高评分电影或剧集
async function tmdbTopRated(params = {}) {
  const { language = "zh-CN", page = 1, type = "movie", sort_by = "vote_average.desc" } = params;
  if (language !== 'zh-CN') { return []; }
  try {
    // 如果选择的是评分排序，使用top_rated端点；否则使用discover端点
    if (sort_by.startsWith("vote_average")) {
      const api = type === "movie" ? "/movie/top_rated" : "/tv/top_rated";
      const res = await Widget.tmdb.get(api, { 
        params: { 
          language: 'zh-CN', 
          region: 'CN',
          page, 
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap[type]))
        .filter(item => item && item.posterPath); // 保留带海报的条目
    } else {
      const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
      const res = await Widget.tmdb.get(endpoint, {
        params: { 
          language: 'zh-CN',
          region: 'CN', 
          page, 
          sort_by,
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap[type]))
        .filter(item => item && item.posterPath);
    }
  } catch (error) {
    console.error("Error fetching top rated:", error);
    return [];
  }
}

// TMDB热门内容合并模块 - 整合今日热门、本周热门、热门电影、高分内容
async function loadTmdbTrendingCombined(params = {}) {
  const { 
    sort_by = "today",  // 现在sort_by包含内容类型
    media_type = "all", 
    language = "zh-CN", 
    page = 1, 
    content_type = "popularity.desc",  // 现在content_type包含排序方式
    max_items = 30
  } = params;
  if (language !== 'zh-CN') { return []; }
  try {
    let results = [];
    
    // 使用sort_by作为内容类型选择器
    switch (sort_by) {
      case "today":
        console.log(`[TMDB热门内容] 加载今日热门数据...`);
        
        // 尝试多个数据源
        const todayData = await loadTmdbTrendingData();
        if (todayData && todayData.today_global && todayData.today_global.length > 0) {
          results = todayData.today_global.map(item => createEnhancedWidgetItem(item));
          console.log(`[TMDB热门内容] 从缓存获取今日热门: ${results.length}项`);
        }
        
        // 如果缓存数据不足，补充API数据
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
          
          let apiEndpoint = "/trending/all/day";
          if (media_type === "tv") {
            apiEndpoint = "/trending/tv/day";  // 专门获取剧集
            console.log(`[TMDB热门内容] 选择剧集专用API: ${apiEndpoint}`);
          }
          
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
              .filter(item => item && item.posterPath);
            allApiResults.push(...pageResults);
          }
          
          // 合并结果，去重
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => !existingIds.has(item.id));
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;
        
      case "week":
        console.log(`[TMDB热门内容] 加载本周热门数据...`);
        
        const weekData = await loadTmdbTrendingData();
        if (weekData && weekData.week_global_all && weekData.week_global_all.length > 0) {
          results = weekData.week_global_all.map(item => createEnhancedWidgetItem(item));
          console.log(`[TMDB热门内容] 从缓存获取本周热门: ${results.length}项`);
        }
        
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
          
          let apiEndpoint = "/trending/all/week";
          if (media_type === "tv") {
            apiEndpoint = "/trending/tv/week";
            console.log(`[TMDB热门内容] 选择剧集专用API: ${apiEndpoint}`);
          }
          
          const pages = [1, 2, 3];
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
              .filter(item => item && item.posterPath);
            allApiResults.push(...pageResults);
          }
          
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => !existingIds.has(item.id));
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;
        
      case "popular":
        console.log(`[TMDB热门内容] 加载热门电影数据...`);
        
        if ((parseInt(page) || 1) === 1 && content_type.startsWith("popularity")) {
          const popularData = await loadTmdbTrendingData();
          if (popularData.popular_movies && popularData.popular_movies.length > 0) {
            results = await loadEnhancedTitlePosterWithBackdrops(popularData.popular_movies, max_items, "popular");
            console.log(`[TMDB热门内容] 热门电影加载完成: ${results.length}项`);
          }
        }
                
        if (results.length < max_items) {
          console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
  
          const pages = [1, 2, 3];
          const allApiResults = [];
  
          // 获取热门电影
          for (const pageNum of pages) {
            const res = await Widget.tmdb.get("/movie/popular", {
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
  
          // 获取热门剧集
          for (const pageNum of pages) {
            const res = await Widget.tmdb.get("/tv/popular", {
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
  
          // 合并结果，去重
          const existingIds = new Set(results.map(item => item.id));
          const newResults = allApiResults.filter(item => !existingIds.has(item.id) && item.posterPath);
          results = [...results, ...newResults];
          console.log(`[TMDB热门内容] 补充API数据: ${newResults.length}项`);
        }
        break;
        
      case "top_rated":
        console.log(`[TMDB热门内容] 加载高分内容数据...`);
        
        if (content_type.startsWith("vote_average")) {
          const popularData = await loadTmdbTrendingData();
          if (popularData.popular_movies && popularData.popular_movies.length > 0) {
            results = await loadEnhancedTitlePosterWithBackdrops(popularData.popular_movies, max_items, "top_rated");
            console.log(`[TMDB热门内容] 高分内容加载完成: ${results.length}项`);
          }
          
          if (results.length < max_items) {
            console.log(`[TMDB热门内容] 缓存数据不足，补充API数据...`);
            
            const endpoints = [
              { api: "/movie/top_rated", mediaType: "movie" },
              { api: "/tv/top_rated", mediaType: "tv" }
            ];
            
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
                .map(item => formatTmdbItem(item, genreMap[endpoint.mediaType]))
                .filter(item => item && item.posterPath);
              results.push(...endpointResults);
            }
            
            console.log(`[TMDB热门内容] 补充API数据: ${results.length}项`);
          }
        } else {
          const endpoints = [
            { api: "/discover/movie", mediaType: "movie" },
            { api: "/discover/tv", mediaType: "tv" }
          ];
          
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
              .map(item => formatTmdbItem(item, genreMap[endpoint.mediaType]))
              .filter(item => item && item.posterPath);
            results.push(...endpointResults);
          }
          
          console.log(`[TMDB热门内容] 获取discover内容: ${results.length}项`);
        }
        break;
        
      default:
        console.error("Unknown content type:", sort_by);
        return [];
    }
    
    // 按媒体类型过滤
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
    
    results = results.slice(0, max_items);
    console.log(`[TMDB热门内容] 最终返回: ${results.length}项`);
    return results;
    
  } catch (error) {
    console.error("Error in loadTmdbTrendingCombined:", error);
    return [];
  }
}

// 标题海报热门内容加载器
async function loadTmdbTitlePosterTrending(params = {}) {
    let { 
      content_type = "today", 
      media_type = "all", 
      sort_by = "today", 
      language = "zh-CN", 
      page = 1,
      max_items = 30
    } = params;

    if (["today","week","popular","top_rated"].includes(sort_by)) {
      content_type = sort_by;
    }
      
    if (language !== 'zh-CN') { return []; }
      
    try {
        console.log(`[标题海报] 加载${content_type}内容...`);
        
        let trendingData = await loadTmdbTrendingData();
        
        // 健康检查
        const health = checkDataHealth(trendingData);
        if (!health.healthy) {
          console.log(`[标题海报] 数据健康检查失败: ${health.issues.join(', ')}`);
          console.log("[标题海报] 尝试自动恢复...");
          
          const recoveredData = await autoRecoverData();
          if (recoveredData) {
            trendingData = recoveredData;
            console.log("[标题海报] 数据自动恢复成功");
          } else {
            console.log("[标题海报] 数据自动恢复失败，使用备用方案");
          }
        } else {
          console.log(`[标题海报] 数据健康检查通过 - 今日热门: ${health.stats.today_global || 0}, 本周热门: ${health.stats.week_global_all || 0}, 热门电影: ${health.stats.popular_movies || 0}`);
        }
        
        let results = [];
        
        switch (content_type) {
          case "today":
            if (trendingData && trendingData.today_global && trendingData.today_global.length > 0) {
              results = await loadEnhancedTitlePosterWithBackdrops(trendingData.today_global, max_items, "today");
              console.log(`[标题海报] 今日热门加载完成: ${results.length}项`);
            }
            
            if (results.length < max_items) {
              console.log(`[标题海报] 缓存数据不足，补充API数据...`);
              const res = await Widget.tmdb.get("/trending/all/day", { 
                params: { 
                  language: 'zh-CN',
                  region: 'CN',
                  api_key: API_KEY,
                  page: 1
                }
              });
              const genreMap = await fetchTmdbGenres();
              const apiResults = res.results
                .map(item => formatTmdbItem(item, genreMap))
                .filter(item => item && item.posterPath);
              
              const existingIds = new Set(results.map(item => item.id));
              const newResults = apiResults.filter(item => !existingIds.has(item.id));
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "week":
            if (trendingData && trendingData.week_global_all && trendingData.week_global_all.length > 0) {
              results = await loadEnhancedTitlePosterWithBackdrops(trendingData.week_global_all, max_items, "week");
              console.log(`[标题海报] 本周热门加载完成: ${results.length}项`);
            }
            
            if (results.length < max_items) {
              console.log(`[标题海报] 缓存数据不足，补充API数据...`);
              const res = await Widget.tmdb.get("/trending/all/week", { 
                params: { 
                  language: 'zh-CN',
                  region: 'CN',
                  api_key: API_KEY,
                  page: 1
                }
              });
              const genreMap = await fetchTmdbGenres();
              const apiResults = res.results
                .map(item => formatTmdbItem(item, genreMap))
                .filter(item => item && item.posterPath);
              
              const existingIds = new Set(results.map(item => item.id));
              const newResults = apiResults.filter(item => !existingIds.has(item.id));
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "popular":
            if (trendingData && trendingData.popular_movies && trendingData.popular_movies.length > 0) {
              results = await loadEnhancedTitlePosterWithBackdrops(trendingData.popular_movies, max_items, "popular");
              console.log(`[标题海报] 热门电影加载完成: ${results.length}项`);
            }
            
            if (results.length < max_items) {
              console.log(`[标题海报] 缓存数据不足，补充API数据...`);
              const res = await Widget.tmdb.get("/movie/popular", {
                params: {
                  language: 'zh-CN',
                  region: 'CN',
                  api_key: API_KEY,
                  page: 1
                }
              });
              const genreMap = await fetchTmdbGenres();
              const apiResults = res.results
                .map(item => formatTmdbItem(item, genreMap))
                .filter(item => item && item.posterPath);
              
              const existingIds = new Set(results.map(item => item.id));
              const newResults = apiResults.filter(item => !existingIds.has(item.id));
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          case "top_rated":
            if (trendingData && trendingData.popular_movies && trendingData.popular_movies.length > 0) {
              results = await loadEnhancedTitlePosterWithBackdrops(trendingData.popular_movies, max_items, "top_rated");
              console.log(`[标题海报] 高分内容加载完成: ${results.length}项`);
            }
            
            if (results.length < max_items) {
              console.log(`[标题海报] 缓存数据不足，补充API数据...`);
              const resMovie = await Widget.tmdb.get("/movie/top_rated", { 
                params: { 
                  language: 'zh-CN', 
                  region: 'CN',
                  page: 1,
                  api_key: API_KEY 
                }
              });
              const resTv = await Widget.tmdb.get("/tv/top_rated", { 
                params: { 
                  language: 'zh-CN', 
                  region: 'CN',
                  page: 1,
                  api_key: API_KEY 
                }
              });
              const genreMap = await fetchTmdbGenres();
              const movieResults = resMovie.results.map(item => formatTmdbItem(item, genreMap.movie))
                .filter(item => item && item.posterPath);
              const tvResults = resTv.results.map(item => formatTmdbItem(item, genreMap.tv))
                .filter(item => item && item.posterPath);
              const apiResults = [...movieResults, ...tvResults];
              
              const existingIds = new Set(results.map(item => item.id));
              const newResults = apiResults.filter(item => !existingIds.has(item.id));
              results = [...results, ...newResults];
              console.log(`[标题海报] 补充API数据: ${newResults.length}项`);
            }
            break;
            
          default:
            console.error("Unknown content type in title poster loader:", content_type);
            return [];
        }
        
        console.log(`[标题海报] 最终返回: ${results.length}项`);
        return results;
        
    } catch (error) {
        console.error("Error in loadTmdbTitlePosterTrending:", error);
        return [];
    }
}

// 简化的组件项目创建器 - 针对中国网络
function createSimpleWidgetItem(item) {
  const posterUrl = item.poster_url || (item.poster_path ? createSmartImageUrl(item.poster_path, 'poster', 'w342') : "");
  const backdropUrl = item.backdrop_path ? createSmartImageUrl(item.backdrop_path, 'backdrop', 'w780') : "";
  
  const finalTitle = item.title || item.name || "未知标题";
  const finalDesc = item.overview || "暂无简介";
  // 如果标题和简介都不包含中文，跳过该条目
  if (!/[\u4e00-\u9fa5]/.test(finalTitle) && !/[\u4e00-\u9fa5]/.test(finalDesc)) {
    return null;
  }
  
  return {
    id: item.id,
    type: "tmdb",
    title: finalTitle,
    description: finalDesc,
    releaseDate: item.release_date || item.first_air_date || "未知日期",
    posterPath: posterUrl,
    coverUrl: posterUrl,
    backdropPath: backdropUrl,
    rating: item.vote_average ? item.vote_average.toFixed(1) : "无评分",
    mediaType: item.media_type || (item.title ? "movie" : "tv"),
    genreTitle: item.genre_ids && item.genre_ids.length > 0 ? 
      item.genre_ids.slice(0, 3).map(id => item.genreMap?.[id]).filter(Boolean).join('•') : "未知类型",
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: [],
    isChinaOptimized: true // 标记为中国网络优化
  };
}

// Enhanced widget item creator - retains Chinese content
function createEnhancedWidgetItem(item) {
    let titleBackdropUrl = "";
    if (item.title_backdrop) {
        if (typeof item.title_backdrop === 'string') {
            titleBackdropUrl = item.title_backdrop;
        } else if (item.title_backdrop.url) {
            titleBackdropUrl = item.title_backdrop.url;
        }
    }
    const displayTitle = pickEnhancedChineseTitle(item);
    const posterUrl = item.poster_url || item.poster_path || "";
    const backdropUrl = titleBackdropUrl || item.backdrop_path || "";
    const result = {
        id: item.id,
        type: "tmdb",
        title: displayTitle,
        description: item.overview || item.description || "",
        releaseDate: item.release_date || item.first_air_date || "未知日期",
        posterPath: posterUrl ? createSmartImageUrl(posterUrl.replace('https://image.tmdb.org/t/p/w500', ''), 'poster', 'w342') : posterUrl,
        coverUrl: posterUrl ? createSmartImageUrl(posterUrl.replace('https://image.tmdb.org/t/p/w500', ''), 'poster', 'w342') : posterUrl,
        backdropPath: backdropUrl ? createSmartImageUrl(backdropUrl.replace('https://image.tmdb.org/t/p/w1280', ''), 'backdrop', 'w780') : backdropUrl,
        backdropHD: item.title_backdrop_hd || item.backdrop_hd || "",
        backdrop780: item.backdrop_w780 || "",
        posterHD: item.poster_hd || "",
        rating: item.vote_average ? item.vote_average.toFixed(1) : "无评分",
        mediaType: item.media_type || (item.title ? "movie" : "tv"),
        genreTitle: generateEnhancedGenreTitle(item.genre_ids || [], item.media_type || (item.title ? "movie" : "tv"), item.genreMap || {}),
        link: null,
        duration: 0,
        durationText: "",
        episode: 0,
        childItems: [],
        category: item.category || "热门",
        isChinaOptimized: true,
        hasTitleBackdrop: !!titleBackdropUrl
    };
    console.log(`[增强项目] ${result.title} - 标题海报: ${result.backdropPath ? '✅' : '❌'} - 分类: ${result.category} - 中国优化: 是`);
    return result;
}

// 全局赋值
global.loadTmdbTrendingData = loadTmdbTrendingData;
global.loadTmdbTitlePosterTrending = loadTmdbTitlePosterTrending;
global.fetchSimpleData = fetchSimpleData;
global.fetchRealtimeData = fetchRealtimeData;
global.createSimpleWidgetItem = createSimpleWidgetItem;
