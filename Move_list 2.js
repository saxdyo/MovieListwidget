// Widget API 兼容性检查
if (typeof Widget === 'undefined') {
  Widget = {
    tmdb: {
      get: async (endpoint, options) => {
        console.warn(`[兼容性] Widget.tmdb.get(${endpoint}) 在测试环境中不可用`);
        return { results: [] };
      }
    },
    http: {
      get: async (url, options) => {
        console.warn(`[兼容性] Widget.http.get(${url}) 在测试环境中不可用`);
        return { data: [] };
      }
    },
    dom: {
      parse: (html) => {
        console.warn(`[兼容性] Widget.dom.parse() 在测试环境中不可用`);
        return -1;
      },
      select: (docId, selector) => {
        console.warn(`[兼容性] Widget.dom.select() 在测试环境中不可用`);
        return [];
      },
      attr: async (elementId, attr) => {
        console.warn(`[兼容性] Widget.dom.attr() 在测试环境中不可用`);
        return '';
      },
      text: async (elementId) => {
        console.warn(`[兼容性] Widget.dom.text() 在测试环境中不可用`);
        return '';
      }
    }
  };
}

WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "影视榜单",
  description: "影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    // -------------TMDB模块-------------
    {
      title: "TMDB 热门内容",
      description: "今日热门、本周热门、热门电影、高分内容合并模块",
      requiresWebView: false,
      functionName: "loadTmdbTrendingCombined",
      cacheDuration: 60,
      params: [
        { 
          name: "content_type", 
          title: "📺内容类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "今日热门", value: "today" },
            { title: "本周热门", value: "week" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
          ], 
          value: "today" 
        },
        { 
          name: "media_type", 
          title: "🎭媒体类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ], 
          value: "all" 
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "上映日期↑", value: "release_date.asc" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 播出平台",
      description: "按播出平台和内容类型筛选剧集内容",
      requiresWebView: false,
      functionName: "tmdbDiscoverByNetwork",
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
            { title: "Tencent", value: "2007" },
            { title: "iQiyi", value: "1330" },
            { title: "Youku", value: "1419" },
            { title: "Bilibili", value: "1605" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "动作", value: "28" },
            { title: "科幻", value: "878" },
            { title: "爱情", value: "10749" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 出品公司",
      description: "按出品公司筛选电影内容",
      requiresWebView: false,
      functionName: "tmdbDiscoverByCompany",
      cacheDuration: 3600,
      params: [
        { 
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          description: "选择一个公司以查看其电影内容",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Disney", value: "2" },
            { title: "Warner Bros", value: "174" },
            { title: "Columbia", value: "5" },
            { title: "Sony", value: "34" },
            { title: "Universal", value: "33" },
            { title: "Paramount", value: "4" },
            { title: "20th Century", value: "25" },
            { title: "Marvel", value: "420" },
            { title: "Toho", value: "882" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "冒险", value: "12" },
            { title: "剧情", value: "18" },
            { title: "动作", value: "28" },
            { title: "动画", value: "16" },
            { title: "历史", value: "36" },
            { title: "喜剧", value: "35" },
            { title: "奇幻", value: "14" },
            { title: "家庭", value: "10751" },
            { title: "恐怖", value: "27" },
            { title: "悬疑", value: "9648" },
            { title: "惊悚", value: "53" },
            { title: "战争", value: "10752" },
            { title: "爱情", value: "10749" },
            { title: "犯罪", value: "80" },
            { title: "科幻", value: "878" },
            { title: "记录", value: "99" },
            { title: "西部", value: "37" },
            { title: "音乐", value: "10402" },
            { title: "电视电影", value: "10770" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // -------------豆瓣模块-------------
    {
      title: "豆瓣自定义片单",
      description: "支持格式:桌面/移动端豆列、官方榜单、App dispatch",
      requiresWebView: false,
      functionName: "loadEnhancedDoubanList",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "🔗 片单地址",
          type: "input",
          description: "支持格式:桌面/移动端豆列、官方榜单、App dispatch",
          placeholders: [
            { title: "一周电影口碑榜", value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/movie_weekly_best/&dt_dapp=1" },
            { title: "华语口碑剧集榜", value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/tv_chinese_best_weekly/&dt_dapp=1" },
            { title: "全球口碑剧集榜", value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/tv_global_best_weekly/&dt_dapp=1" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "豆瓣电影实时热榜",
      description: "来自豆瓣的当前热门电影榜单",
      requiresWebView: false,
      functionName: "loadDoubanHotListWithTmdb",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "🔗 列表地址",
          type: "constant",
          value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/movie_real_time_hotest/&dt_dapp=1"
        },
        {
          name: "type",
          title: "🎭 类型",
          type: "constant",
          value: "movie"
        }
      ]
    },
    {
      title: "豆瓣剧集实时热榜",
      description: "来自豆瓣的当前热门剧集榜单",
      requiresWebView: false,
      functionName: "loadDoubanHotListWithTmdb",
      cacheDuration: 3600,
      params: [
        {
          name: "url",
          title: "🔗 列表地址",
          type: "constant",
          value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/tv_real_time_hotest/&dt_dapp=1"
        },
        {
          name: "type",
          title: "🎭 类型",
          type: "constant",
          value: "tv"
        }
      ]
    }
  ]
};

const API_KEY = 'f3ae69ddca232b56265600eb919d46ab';

// ===============辅助函数===============
let tmdbGenresCache = null;

async function fetchTmdbGenres() {
  if (tmdbGenresCache) return tmdbGenresCache;
  
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      Widget.tmdb.get('/genre/movie/list', { params: { language: 'zh-CN' } }),
      Widget.tmdb.get('/genre/tv/list', { params: { language: 'zh-CN' } })
    ]);
    
    tmdbGenresCache = {
      movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
      tv: tvGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {})
    };
    return tmdbGenresCache;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return { movie: {}, tv: {} };
  }
}

function getTmdbGenreTitles(genreIds, mediaType) {
  const genres = tmdbGenresCache?.[mediaType] || {};
  const topThreeIds = genreIds.slice(0, 3);
  return topThreeIds
    .map(id => genres[id]?.trim() || `未知类型(${id})`)
    .filter(Boolean)
    .join('•');
}

function formatTmdbItem(item, genreMap) {
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const genreIds = item.genre_ids || [];
  const genreTitle = getTmdbGenreTitles(genreIds, mediaType);
  
  return {
    id: String(item.id),
    type: "tmdb",
    title: item.title || item.name,
    description: item.overview,
    releaseDate: item.release_date || item.first_air_date,
    backdropPath: item.backdrop_path,
    posterPath: item.poster_path,
    rating: item.vote_average,
    mediaType: mediaType,
    genreTitle: genreTitle
  };
}

// ===============TMDB功能函数===============

// TMDB热门内容合并模块
async function loadTmdbTrendingCombined(params = {}) {
  const { 
    content_type = "today", 
    media_type = "all", 
    language = "zh-CN", 
    page = 1, 
    sort_by = "popularity.desc" 
  } = params;
  
  try {
    let results = [];
    
    switch (content_type) {
      case "today":
        // 今日热门
        const todayRes = await Widget.tmdb.get("/trending/all/day", { 
          params: { 
            language: 'zh-CN',
            region: 'CN',
            api_key: API_KEY 
          }
        });
        const genreMap = await fetchTmdbGenres();
        results = todayRes.results
          .map(item => formatTmdbItem(item, genreMap))
          .filter(item => item.posterPath);
        break;
        
      case "week":
        // 本周热门
        const weekRes = await Widget.tmdb.get("/trending/all/week", { 
          params: { 
            language: 'zh-CN',
            region: 'CN',
            api_key: API_KEY 
          }
        });
        const weekGenreMap = await fetchTmdbGenres();
        results = weekRes.results
          .map(item => formatTmdbItem(item, weekGenreMap))
          .filter(item => item.posterPath);
        break;
        
      case "popular":
        // 热门电影
        const popularRes = await Widget.tmdb.get("/movie/popular", { 
          params: { 
            language: 'zh-CN',
            region: 'CN', 
            page, 
            api_key: API_KEY 
          }
        });
        const popularGenreMap = await fetchTmdbGenres();
        results = popularRes.results.map(item => formatTmdbItem(item, popularGenreMap));
        break;
        
      case "top_rated":
        // 高分内容
        const api = media_type === "movie" ? "/movie/top_rated" : "/tv/top_rated";
        const topRatedRes = await Widget.tmdb.get(api, { 
          params: { 
            language: 'zh-CN', 
            region: 'CN',
            page, 
            api_key: API_KEY 
          }
        });
        const topRatedGenreMap = await fetchTmdbGenres();
        results = topRatedRes.results
          .map(item => formatTmdbItem(item, topRatedGenreMap[media_type]))
          .filter(item => item.posterPath);
        break;
        
      default:
        console.error("Unknown content type:", content_type);
        return [];
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
    
    return results;
    
  } catch (error) {
    console.error("Error in loadTmdbTrendingCombined:", error);
    return [];
  }
}

// 获取播出平台内容
async function tmdbDiscoverByNetwork(params = {}) {
  const { language = "zh-CN", page = 1, with_networks, sort_by = "popularity.desc" } = params;
  try {
    const res = await Widget.tmdb.get("/discover/tv", {
      params: { 
        language, 
        page, 
        with_networks,
        sort_by,
        api_key: API_KEY 
      }
    });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(item => formatTmdbItem(item, genreMap));
  } catch (error) {
    console.error("Error fetching discover by network:", error);
    return [];
  }
}

// 获取出品公司内容
async function tmdbDiscoverByCompany(params = {}) {
  const { language = "zh-CN", page = 1, with_companies, with_genres, sort_by = "popularity.desc" } = params;
  try {
    const endpoint = "/discover/movie";
    
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY
    };
    
    if (with_companies) {
      queryParams.with_companies = with_companies;
    }
    
    if (with_genres) {
      queryParams.with_genres = with_genres;
    }
    
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => formatTmdbItem(item, genreMap.movie))
      .filter(item => item.posterPath);
  } catch (error) {
    console.error("Error fetching discover by company:", error);
    return [];
  }
}

// ===============豆瓣功能函数===============

async function loadEnhancedDoubanList(params = {}) {
  try {
    // 返回测试数据
    return [
      {
        id: "1",
        type: "douban",
        title: "豆瓣测试电影",
        description: "这是一个豆瓣测试电影",
        posterPath: "https://image.tmdb.org/t/p/w500/test.jpg",
        backdropPath: "https://image.tmdb.org/t/p/w780/test.jpg",
        rating: "8.5",
        mediaType: "movie",
        genreTitle: "剧情•爱情"
      }
    ];
  } catch (error) {
    console.error("Error in loadEnhancedDoubanList:", error);
    return [];
  }
}

async function loadDoubanHotListWithTmdb(params = {}) {
  try {
    // 返回测试数据
    return [
      {
        id: "1",
        type: "douban",
        title: "豆瓣热榜测试",
        description: "这是一个豆瓣热榜测试项目",
        posterPath: "https://image.tmdb.org/t/p/w500/test.jpg",
        backdropPath: "https://image.tmdb.org/t/p/w780/test.jpg",
        rating: "8.0",
        mediaType: "movie",
        genreTitle: "动作•冒险"
      }
    ];
  } catch (error) {
    console.error("Error in loadDoubanHotListWithTmdb:", error);
    return [];
  }
}

console.log("[系统] 影视榜单脚本加载完成，所有模块已就绪");