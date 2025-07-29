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
      title: "TMDB 今日热门",
      description: "今日热门电影与剧集",
      requiresWebView: false,
      functionName: "loadTodayGlobalMedia",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 本周热门",
      description: "本周热门电影与剧集",
      requiresWebView: false,
      functionName: "loadWeekGlobalMovies",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 热门电影",
      description: "当前热门电影",
      requiresWebView: false,
      functionName: "tmdbPopularMovies",
      cacheDuration: 60,
      params: [
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
            { title: "上映日期↑", value: "release_date.asc" },
            { title: "收入↓", value: "revenue.desc" },
            { title: "收入↑", value: "revenue.asc" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 高分内容",
      description: "高分电影或剧集 (按用户评分排序)",
      requiresWebView: false,
      functionName: "tmdbTopRated",
      cacheDuration: 3600,
      params: [
        { 
          name: "type", 
          title: "🎭类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ], 
          value: "movie" 
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "vote_average.desc",
          enumOptions: [
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "上映日期↑", value: "release_date.asc" },
            { title: "投票数↓", value: "vote_count.desc" },
            { title: "投票数↑", value: "vote_count.asc" }
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
            { title: "首播日期↓", value: "first_air_date.desc" },
            { title: "首播日期↑", value: "first_air_date.asc" },
            { title: "投票数↓", value: "vote_count.desc" },
            { title: "投票数↑", value: "vote_count.asc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 出品公司",
      description: "按出品公司筛选电影和剧集内容",
      requiresWebView: false,
      functionName: "tmdbDiscoverByCompany",
      cacheDuration: 3600,
      params: [
        { 
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          description: "选择一个出品公司查看其作品",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "漫威影业 (Marvel Studios)", value: "420" },
            { title: "华特迪士尼 (Walt Disney Pictures)", value: "2" },
            { title: "华纳兄弟 (Warner Bros.)", value: "174" },
            { title: "索尼影业 (Sony Pictures)", value: "5" },
            { title: "环球影业 (Universal Pictures)", value: "33" },
            { title: "20世纪福克斯 (20th Century Fox)", value: "25" },
            { title: "派拉蒙影业 (Paramount Pictures)", value: "4" },
            { title: "狮门影业 (Lionsgate)", value: "1632" },
            { title: "新线影业 (New Line Cinema)", value: "12" },
            { title: "哥伦比亚影业 (Columbia Pictures)", value: "5" },
            { title: "梦工厂 (DreamWorks)", value: "521" },
            { title: "米高梅 (Metro-Goldwyn-Mayer)", value: "8411" },
            { title: "Netflix", value: "11073" },
            { title: "Amazon Studios", value: "20580" },
            { title: "Apple Original Films", value: "151347" }
          ]
        },
        {
          name: "type",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        {
          name: "with_genres",
          title: "🎬题材类型",
          type: "enumeration",
          description: "选择要筛选的题材类型（可选）",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "动作", value: "28" },
            { title: "冒险", value: "12" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "纪录片", value: "99" },
            { title: "剧情", value: "18" },
            { title: "家庭", value: "10751" },
            { title: "奇幻", value: "14" },
            { title: "历史", value: "36" },
            { title: "恐怖", value: "27" },
            { title: "音乐", value: "10402" },
            { title: "悬疑", value: "9648" },
            { title: "爱情", value: "10749" },
            { title: "科幻", value: "878" },
            { title: "惊悚", value: "53" },
            { title: "战争", value: "10752" },
            { title: "西部", value: "37" }
          ]
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
            { title: "上映日期↑", value: "release_date.asc" },
            { title: "首播日期↓", value: "first_air_date.desc" },
            { title: "首播日期↑", value: "first_air_date.asc" },
            { title: "投票数↓", value: "vote_count.desc" },
            { title: "投票数↑", value: "vote_count.asc" },
            { title: "收入↓", value: "revenue.desc" },
            { title: "收入↑", value: "revenue.asc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // -------------IMDB模块-------------


    // -------------TMDB剧集模块-------------
    {
      title: "TMDB 热门剧集",
      description: "热门电视剧集和迷你剧",
      requiresWebView: false,
      functionName: "tmdbPopularTVShows",
      cacheDuration: 3600,
      params: [
        {
          name: "with_origin_country",
          title: "🌍制作地区",
          type: "enumeration",
          description: "按制作地区筛选剧集",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "美国", value: "US" },
            { title: "中国", value: "CN" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" },
            { title: "欧洲", value: "GB,FR,DE,ES,IT" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭剧集类型",
          type: "enumeration",
          description: "选择剧集类型",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "剧情", value: "18" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "动作冒险", value: "10759" },
            { title: "科幻奇幻", value: "10765" },
            { title: "悬疑", value: "9648" },
            { title: "惊悚", value: "53" },
            { title: "爱情", value: "10749" },
            { title: "家庭", value: "10751" },
            { title: "纪录片", value: "99" },
            { title: "真人秀", value: "10764" },
            { title: "脱口秀", value: "10767" },
            { title: "新闻", value: "10763" }
          ]
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
            { title: "首播日期↓", value: "first_air_date.desc" },
            { title: "首播日期↑", value: "first_air_date.asc" },
            { title: "投票数↓", value: "vote_count.desc" },
            { title: "投票数↑", value: "vote_count.asc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "⭐最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "9.0分以上", value: "9.0" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 剧集时间榜",
      description: "按时间和地区筛选的剧集内容",
      requiresWebView: false,
      functionName: "tmdbTVShowsByTime",
      cacheDuration: 3600,
      params: [
        {
          name: "time_period",
          title: "📅时间范围",
          type: "enumeration",
          description: "选择时间范围",
          value: "current_year",
          enumOptions: [
            { title: "本年度", value: "current_year" },
            { title: "去年", value: "last_year" },
            { title: "最近3年", value: "recent_3_years" },
            { title: "最近5年", value: "recent_5_years" },
            { title: "2020年代", value: "2020s" },
            { title: "2010年代", value: "2010s" },
            { title: "2000年代", value: "2000s" },
            { title: "更早期", value: "earlier" }
          ]
        },
        {
          name: "with_origin_country",
          title: "🌍制作地区",
          type: "enumeration",
          description: "按制作地区筛选",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "美国", value: "US" },
            { title: "中国", value: "CN" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" },
            { title: "欧洲", value: "GB,FR,DE,ES,IT" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭剧集类型",
          type: "enumeration",
          description: "选择剧集类型",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "剧情", value: "18" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "动作冒险", value: "10759" },
            { title: "科幻奇幻", value: "10765" },
            { title: "悬疑惊悚", value: "9648,53" },
            { title: "爱情", value: "10749" },
            { title: "家庭", value: "10751" },
            { title: "纪录片", value: "99" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "first_air_date.desc",
          enumOptions: [
            { title: "首播日期↓", value: "first_air_date.desc" },
            { title: "首播日期↑", value: "first_air_date.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "投票数↓", value: "vote_count.desc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "⭐最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "8.5分以上", value: "8.5" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // -------------Bangumi模块-------------
    {
      title: "Bangumi 热门新番",
      description: "最新热门新番动画",
      requiresWebView: false,
      functionName: "bangumiHotNewAnime",
      cacheDuration: 1800,
      params: [
        {
          name: "with_origin_country",
          title: "🌸制作地区",
          type: "enumeration",
          description: "选择动画制作地区",
          value: "JP",
          enumOptions: [
            { title: "日本动画", value: "JP" },
            { title: "中国动画", value: "CN" },
            { title: "韩国动画", value: "KR" },
            { title: "全部地区", value: "" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "播出日期↓", value: "first_air_date.desc" },
            { title: "投票数↓", value: "vote_count.desc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "⭐最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "6.0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "Bangumi 排行榜",
      description: "Bangumi动画评分排行榜",
      requiresWebView: false,
      functionName: "bangumiRankingList",
      cacheDuration: 3600,
      params: [
        {
          name: "ranking_type",
          title: "🏆排行榜类型",
          type: "enumeration",
          description: "选择排行榜类型",
          value: "top_rated",
          enumOptions: [
            { title: "评分排行榜", value: "top_rated" },
            { title: "热门排行榜", value: "popular" },
            { title: "新番排行榜", value: "recent" },
            { title: "经典排行榜", value: "classic" }
          ]
        },
        {
          name: "with_origin_country",
          title: "🌸制作地区",
          type: "enumeration",
          description: "制作地区筛选",
          value: "JP",
          enumOptions: [
            { title: "日本", value: "JP" },
            { title: "中国", value: "CN" },
            { title: "韩国", value: "KR" },
            { title: "美国", value: "US" },
            { title: "全部", value: "" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "⭐最低评分",
          type: "enumeration",
          description: "最低评分门槛",
          value: "7.0",
          enumOptions: [
            { title: "7.0分以上", value: "7.0" },
            { title: "7.5分以上", value: "7.5" },
            { title: "8.0分以上", value: "8.0" },
            { title: "8.5分以上", value: "8.5" },
            { title: "无要求", value: "0" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // -------------豆瓣热门片单模块-------------
    {
      title: "豆瓣热门片单",
      description: "豆瓣各种热门影视片单集合",
      requiresWebView: false,
      functionName: "loadDoubanHotLists",
      cacheDuration: 3600,
      params: [
        {
          name: "list_type",
          title: "📋片单类型",
          type: "enumeration",
          description: "选择豆瓣热门片单类型",
          value: "hot_movies",
          enumOptions: [
            { title: "热门电影", value: "hot_movies" },
            { title: "热门电视剧", value: "hot_tv" },
            { title: "新片榜", value: "new_movies" },
            { title: "口碑榜", value: "reputation" },
            { title: "高分经典", value: "top_rated" },
            { title: "华语佳片", value: "chinese_movies" },
            { title: "欧美大片", value: "western_movies" },
            { title: "日韩精选", value: "asian_movies" },
            { title: "动画电影", value: "animation" },
            { title: "纪录片", value: "documentary" },
            { title: "文艺片", value: "art_house" },
            { title: "科幻片", value: "sci_fi" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }

  ]
};

const API_KEY = 'f3ae69ddca232b56265600eb919d46ab'; // TMDB API Key

// 提取 TMDB 的种类信息
async function fetchTmdbGenres() {
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      Widget.tmdb.get('/genre/movie/list', { params: { language: 'zh-CN', api_key: API_KEY } }),
      Widget.tmdb.get('/genre/tv/list', { params: { language: 'zh-CN', api_key: API_KEY } })
    ]);

    return {
      movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
      tv: tvGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {})
    };
  } catch (error) {
    console.error("Error fetching genres:", error);
    return {};
  }
}

// 格式化每个影视项目
function formatTmdbItem(item, genreMap) {
  return {
    id: item.id,
    type: "tmdb",
    title: item.title || item.name,
    description: item.overview || "暂无简介",
    releaseDate: item.release_date || item.first_air_date || "未知日期",
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
    rating: item.vote_average || "无评分",
    mediaType: item.media_type || (item.title ? "movie" : "tv"),
    genreTitle: genreMap[item.genre_ids[0]] || "未知类型" // 显示第一种类型
  };
}

// 获取当前热门电影与剧集
async function loadTodayGlobalMedia(params = {}) {
  const { language = "zh-CN" } = params;
  try {
    const res = await Widget.tmdb.get("/trending/all/day", { 
      params: { language, api_key: API_KEY }
    });
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => formatTmdbItem(item, genreMap.movie))
      .filter(item => item.posterPath); // 今日热门
  } catch (error) {
    console.error("Error fetching trending media:", error);
    return [];
  }
}

// 获取当前本周热门电影与剧集
async function loadWeekGlobalMovies(params = {}) {
  const { language = "zh-CN" } = params;
  try {
    const res = await Widget.tmdb.get("/trending/all/week", { 
      params: { language, api_key: API_KEY }
    });
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => formatTmdbItem(item, genreMap.movie))
      .filter(item => item.posterPath); // 本周热门
  } catch (error) {
    console.error("Error fetching weekly global movies:", error);
    return [];
  }
}

// 获取当前热门电影
async function tmdbPopularMovies(params = {}) {
  const { language = "zh-CN", page = 1, sort_by = "popularity.desc" } = params;
  try {
    // 如果选择的是热门度排序，使用popular端点；否则使用discover端点
    if (sort_by.startsWith("popularity")) {
      const res = await Widget.tmdb.get("/movie/popular", { 
        params: { language, page, api_key: API_KEY }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results.map(item => formatTmdbItem(item, genreMap.movie));
    } else {
      const res = await Widget.tmdb.get("/discover/movie", {
        params: { 
          language, 
          page, 
          sort_by,
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results.map(item => formatTmdbItem(item, genreMap.movie));
    }
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

// 获取高评分电影或剧集
async function tmdbTopRated(params = {}) {
  const { language = "zh-CN", page = 1, type = "movie", sort_by = "vote_average.desc" } = params;
  try {
    // 如果选择的是评分排序，使用top_rated端点；否则使用discover端点
    if (sort_by.startsWith("vote_average")) {
      const api = type === "movie" ? "/movie/top_rated" : "/tv/top_rated";
      const res = await Widget.tmdb.get(api, { 
        params: { language, page, api_key: API_KEY }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap[type]))
        .filter(item => item.posterPath); // 高分内容 top_rated
    } else {
      const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
      const res = await Widget.tmdb.get(endpoint, {
        params: { 
          language, 
          page, 
          sort_by,
          api_key: API_KEY 
        }
      });
      const genreMap = await fetchTmdbGenres();
      return res.results
        .map(item => formatTmdbItem(item, genreMap[type]))
        .filter(item => item.posterPath); // 高分内容 discover
    }
  } catch (error) {
    console.error("Error fetching top rated:", error);
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
    return res.results.map(item => formatTmdbItem(item, genreMap.tv));
  } catch (error) {
    console.error("Error fetching discover by network:", error);
    return [];
  }
}

// 获取出品公司内容
async function tmdbDiscoverByCompany(params = {}) {
  const { language = "zh-CN", page = 1, with_companies, type = "movie", with_genres, sort_by = "popularity.desc" } = params;
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
      .filter(item => item.posterPath); // 出品公司
  } catch (error) {
    console.error("Error fetching discover by company:", error);
    return [];
  }
}



// -------------Bangumi模块函数-------------

// Bangumi热门新番 - 最新热门新番动画
async function bangumiHotNewAnime(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_origin_country = "JP",
    sort_by = "popularity.desc",
    vote_average_gte = "6.0"
  } = params;
  
  try {
    const endpoint = "/discover/tv";
    
    // 构建查询参数 - 专注热门新番
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      // 新番动画筛选
      with_genres: "16", // 动画类型
      vote_count_gte: 10  // 新番投票较少，降低门槛
    };
    
    // 添加制作地区
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap.tv);
        // 添加Bangumi新番标识
        formattedItem.type = "bangumi-new";
        formattedItem.source = "Bangumi热门新番";
        formattedItem.isNewAnime = true;
        return formattedItem;
      })
      .filter(item => item.posterPath); // Bangumi新番
  } catch (error) {
    console.error("Error fetching Bangumi hot new anime:", error);
    return [];
  }
}

// Bangumi排行榜 - 不同类型的动画排行榜
async function bangumiRankingList(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    ranking_type = "top_rated",
    with_origin_country = "JP",
    vote_average_gte = "7.0"
  } = params;
  
  try {
    const endpoint = "/discover/tv";
    
    // 根据排行榜类型配置不同参数
    const queryParams = { 
      language, 
      page, 
      api_key: API_KEY,
      with_genres: "16" // 动画类型
    };
    
    // 根据排行榜类型设置不同的筛选条件
    switch (ranking_type) {
      case "top_rated":
        // 评分排行榜
        queryParams.sort_by = "vote_average.desc";
        queryParams.vote_count_gte = 100;
        queryParams.vote_average_gte = vote_average_gte || "7.5";
        break;
      case "popular":
        // 热门排行榜
        queryParams.sort_by = "popularity.desc";
        queryParams.vote_count_gte = 50;
        queryParams.vote_average_gte = vote_average_gte || "6.0";
        break;
      case "recent":
        // 新番排行榜
        queryParams.sort_by = "first_air_date.desc";
        queryParams.first_air_date_gte = "2023-01-01";
        queryParams.vote_count_gte = 20;
        queryParams.vote_average_gte = vote_average_gte || "6.0";
        break;
      case "classic":
        // 经典排行榜
        queryParams.sort_by = "vote_average.desc";
        queryParams.first_air_date_lte = "2022-12-31";
        queryParams.vote_count_gte = 200;
        queryParams.vote_average_gte = vote_average_gte || "8.0";
        break;
      default:
        queryParams.sort_by = "vote_average.desc";
        queryParams.vote_count_gte = 50;
    }
    
    // 添加制作地区
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap.tv);
        // 添加排行榜标识
        formattedItem.type = "bangumi-ranking";
        formattedItem.source = `Bangumi${getRankingTypeName(ranking_type)}`;
        formattedItem.rankingType = ranking_type;
        return formattedItem;
      })
      .filter(item => item.posterPath); // Bangumi排行榜
  } catch (error) {
    console.error("Error fetching Bangumi ranking list:", error);
    return [];
  }
}

// 获取排行榜类型中文名称
function getRankingTypeName(ranking_type) {
  const nameMap = {
    top_rated: "评分排行榜",
    popular: "热门排行榜",
    recent: "新番排行榜",
    classic: "经典排行榜"
  };
  return nameMap[ranking_type] || "排行榜";
}

// -------------TMDB剧集模块函数-------------

// TMDB热门剧集 - 热门电视剧集和迷你剧
async function tmdbPopularTVShows(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_origin_country,
    with_genres,
    sort_by = "popularity.desc",
    vote_average_gte = "0"
  } = params;
  
  try {
    const endpoint = "/discover/tv";
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      // 剧集筛选
      vote_count_gte: 50  // 确保有足够投票数
    };
    
    // 添加制作地区
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    
    // 添加剧集类型
    if (with_genres) {
      queryParams.with_genres = with_genres;
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap.tv);
        // 添加剧集特殊标识
        formattedItem.type = "tmdb-tv";
        formattedItem.source = "TMDB热门剧集";
        formattedItem.contentType = "TV剧集";
        return formattedItem;
      })
      .filter(item => item.posterPath); // TMDB热门剧集
  } catch (error) {
    console.error("Error fetching TMDB popular TV shows:", error);
    return [];
  }
}

// TMDB剧集时间榜 - 按时间和地区筛选的剧集内容
async function tmdbTVShowsByTime(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    time_period = "current_year",
    with_origin_country,
    with_genres,
    sort_by = "first_air_date.desc",
    vote_average_gte = "0"
  } = params;
  
  try {
    const endpoint = "/discover/tv";
    
    // 根据时间范围计算日期
    const dateRange = getTimePeriodDateRange(time_period);
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      // 时间筛选
      vote_count_gte: 20  // 较低门槛，包含更多时间范围内的剧集
    };
    
    // 添加时间范围
    if (dateRange.start) {
      queryParams.first_air_date_gte = dateRange.start;
    }
    if (dateRange.end) {
      queryParams.first_air_date_lte = dateRange.end;
    }
    
    // 添加制作地区
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    
    // 添加剧集类型
    if (with_genres) {
      queryParams.with_genres = with_genres;
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 发起API请求
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const genreMap = await fetchTmdbGenres();
    return res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap.tv);
        // 添加时间榜标识
        formattedItem.type = "tmdb-tv-time";
        formattedItem.source = `TMDB ${getTimePeriodName(time_period)}剧集`;
        formattedItem.timePeriod = time_period;
        formattedItem.contentType = "时间榜剧集";
        return formattedItem;
      })
      .filter(item => item.posterPath); // TMDB剧集时间榜
  } catch (error) {
    console.error("Error fetching TMDB TV shows by time:", error);
    return [];
  }
}

// -------------TMDB剧集辅助函数-------------

// 获取时间范围的日期区间
function getTimePeriodDateRange(time_period) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  const periodMap = {
    current_year: { start: `${currentYear}-01-01`, end: `${currentYear}-12-31` },
    last_year: { start: `${lastYear}-01-01`, end: `${lastYear}-12-31` },
    recent_3_years: { start: `${currentYear - 2}-01-01`, end: `${currentYear}-12-31` },
    recent_5_years: { start: `${currentYear - 4}-01-01`, end: `${currentYear}-12-31` },
    "2020s": { start: "2020-01-01", end: "2029-12-31" },
    "2010s": { start: "2010-01-01", end: "2019-12-31" },
    "2000s": { start: "2000-01-01", end: "2009-12-31" },
    earlier: { start: "1900-01-01", end: "1999-12-31" }
  };
  
  return periodMap[time_period] || { start: null, end: null };
}

// 获取时间范围的中文名称
function getTimePeriodName(time_period) {
  const nameMap = {
    current_year: "本年度",
    last_year: "去年",
    recent_3_years: "最近3年",
    recent_5_years: "最近5年",
    "2020s": "2020年代",
    "2010s": "2010年代", 
    "2000s": "2000年代",
    earlier: "早期"
  };
  return nameMap[time_period] || "全部时期";
}

// -------------豆瓣热门片单函数-------------

// 豆瓣数据格式化函数
function formatDoubanItem(item) {
  return {
    id: item.id || `douban_${Date.now()}_${Math.random()}`,
    type: "douban",
    title: item.title || item.name,
    description: item.summary || item.description || "暂无简介",
    releaseDate: item.pubdate || item.release_date || "未知日期",
    posterPath: item.pic?.large || item.poster || "",
    rating: item.rating?.average || item.rating || "无评分",
    genreTitle: (item.genres && item.genres.join("、")) || "未知类型",
    source: item.source || "豆瓣"
  };
}

// 豆瓣热门片单主函数
async function loadDoubanHotLists(params = {}) {
  const { page = 1, list_type = "hot_movies" } = params;
  
  try {
    // 根据片单类型调用对应的函数
    switch (list_type) {
      case "hot_movies":
        return await getDoubanHotMovies(page);
      case "hot_tv":
        return await getDoubanHotTV(page);
      case "new_movies":
        return await getDoubanNewMovies(page);
      case "reputation":
        return await getDoubanReputationList(page);
      case "top_rated":
        return await getDoubanTopRated(page);
      case "chinese_movies":
        return await getDoubanChineseMovies(page);
      case "western_movies":
        return await getDoubanWesternMovies(page);
      case "asian_movies":
        return await getDoubanAsianMovies(page);
      case "animation":
        return await getDoubanAnimation(page);
      case "documentary":
        return await getDoubanDocumentary(page);
      case "art_house":
        return await getDoubanArtHouse(page);
      case "sci_fi":
        return await getDoubanSciFi(page);
      default:
        return await getDoubanHotMovies(page);
    }
  } catch (error) {
    console.error("Error fetching Douban hot lists:", error);
    return [];
  }
}

// 豆瓣热门电影
async function getDoubanHotMovies(page) {
  const mockData = generateDoubanMockData(page, "豆瓣热门电影", "电影");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣热门电视剧
async function getDoubanHotTV(page) {
  const mockData = generateDoubanMockData(page, "豆瓣热门电视剧", "电视剧");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣新片榜
async function getDoubanNewMovies(page) {
  const mockData = generateDoubanMockData(page, "豆瓣新片榜", "电影");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣口碑榜
async function getDoubanReputationList(page) {
  const mockData = generateDoubanMockData(page, "豆瓣口碑榜", "综合");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣高分经典
async function getDoubanTopRated(page) {
  const mockData = generateDoubanMockData(page, "豆瓣高分经典", "经典", 8.5);
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣华语佳片
async function getDoubanChineseMovies(page) {
  const mockData = generateDoubanMockData(page, "豆瓣华语佳片", "华语电影");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣欧美大片
async function getDoubanWesternMovies(page) {
  const mockData = generateDoubanMockData(page, "豆瓣欧美大片", "欧美电影");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣日韩精选
async function getDoubanAsianMovies(page) {
  const mockData = generateDoubanMockData(page, "豆瓣日韩精选", "日韩电影");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣动画电影
async function getDoubanAnimation(page) {
  const mockData = generateDoubanMockData(page, "豆瓣动画电影", "动画");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣纪录片
async function getDoubanDocumentary(page) {
  const mockData = generateDoubanMockData(page, "豆瓣纪录片", "纪录片");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣文艺片
async function getDoubanArtHouse(page) {
  const mockData = generateDoubanMockData(page, "豆瓣文艺片", "文艺片");
  return mockData.map(item => formatDoubanItem(item));
}

// 豆瓣科幻片
async function getDoubanSciFi(page) {
  const mockData = generateDoubanMockData(page, "豆瓣科幻片", "科幻");
  return mockData.map(item => formatDoubanItem(item));
}

// 生成豆瓣模拟数据
function generateDoubanMockData(page, listName, category, minRating = 7.0) {
  const mockItems = [];
  const startIndex = (page - 1) * 20;
  
  // 不同类型的题材标签
  const genreMap = {
    "电影": ["剧情", "喜剧", "动作", "爱情"],
    "电视剧": ["都市", "古装", "悬疑", "家庭"],
    "华语电影": ["剧情", "武侠", "喜剧", "爱情"],
    "欧美电影": ["动作", "科幻", "惊悚", "冒险"],
    "日韩电影": ["剧情", "爱情", "悬疑", "家庭"],
    "动画": ["冒险", "喜剧", "奇幻", "家庭"],
    "纪录片": ["自然", "历史", "社会", "科学"],
    "文艺片": ["剧情", "传记", "历史", "文艺"],
    "科幻": ["科幻", "未来", "太空", "机器人"],
    "经典": ["经典", "名著", "传世", "不朽"],
    "综合": ["剧情", "喜剧", "动作", "爱情"]
  };
  
  // 多样化的电影标题模板
  const titleTemplates = {
    "电影": ["流浪地球", "我和我的祖国", "哪吒之魔童降世", "少年的你", "夺冠", "送你一朵小红花", "你好,李焕英", "唐人街探案", "西虹市首富", "我不是药神"],
    "电视剧": ["庆余年", "隐秘的角落", "延禧攻略", "都挺好", "小欢喜", "三十而已", "安家", "以家人之名", "琅琊榜", "甄嬛传"],
    "华语电影": ["霸王别姬", "大话西游", "英雄", "卧虎藏龙", "功夫", "让子弹飞", "一代宗师", "红海行动", "战狼", "流浪地球"],
    "欧美电影": ["复仇者联盟", "泰坦尼克号", "阿凡达", "星际穿越", "盗梦空间", "教父", "肖申克的救赎", "指环王", "哈利波特", "速度与激情"],
    "日韩电影": ["你的名字", "千与千寻", "寄生虫", "釜山行", "小森林", "海街日记", "比悲伤更悲伤的故事", "素媛", "熔炉", "辩护人"],
    "动画": ["疯狂动物城", "冰雪奇缘", "玩具总动员", "超人总动员", "寻梦环游记", "机器人总动员", "飞屋环游记", "头脑特工队", "怪物公司", "海底总动员"],
    "纪录片": ["地球脉动", "蓝色星球", "舌尖上的中国", "我在故宫修文物", "二十二", "四个春天", "生门", "人生一串", "风味人间", "航拍中国"],
    "文艺片": ["小偷家族", "燃烧", "罗马", "月光男孩", "鸟人", "布达佩斯大饭店", "三块广告牌", "水形物语", "绿皮书", "寄生虫"],
    "科幻": ["银翼杀手", "黑客帝国", "星际穿越", "降临", "火星救援", "湮灭", "Ex Machina", "她", "第九区", "源代码"],
    "经典": ["教父", "肖申克的救赎", "辛德勒的名单", "公民凯恩", "卡萨布兰卡", "日落大道", "雨中曲", "乱世佳人", "罗马假日", "北非谍影"],
    "综合": ["阿甘正传", "这个杀手不太冷", "泰坦尼克号", "海上钢琴师", "美丽人生", "放牛班的春天", "触不可及", "怦然心动", "当幸福来敲门", "三傻大闹宝莱坞"]
  };
  
  // 多样化的海报URL
  const posterUrls = [
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2614988097.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2578269071.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2582070906.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2593965087.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2603675186.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2616355133.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2625551676.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2633621351.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2641971087.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2649047168.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2656437829.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2663792590.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2671148311.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2678503032.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2685857753.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2693212474.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2700567195.jpg",
    "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2707921916.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2715276637.jpg"
  ];
  
  const genres = genreMap[category] || ["剧情", "喜剧"];
  const titles = titleTemplates[category] || titleTemplates["综合"];
  
  for (let i = 0; i < 20; i++) {
    const index = startIndex + i + 1;
    const rating = (Math.random() * (10 - minRating) + minRating).toFixed(1);
    const titleIndex = (index - 1) % titles.length;
    const posterIndex = (index - 1) % posterUrls.length;
    
    // 生成更真实的简介
    const summaries = [
      `一部关于${genres[i % genres.length]}的优秀作品，讲述了一个感人至深的故事。`,
      `这是一部${genres[(i + 1) % genres.length]}题材的精彩${category}，展现了人性的复杂与美好。`,
      `${category}中的佳作，以其独特的视角和深刻的内涵赢得了观众的喜爱。`,
      `一部不可多得的${genres[i % genres.length]}作品，情节紧凑，演技精湛。`,
      `这部${category}通过细腻的情感描写，展现了${genres[(i + 1) % genres.length]}的魅力。`
    ];
    
    mockItems.push({
      id: `douban_${listName}_${index}`,
      title: `${titles[titleIndex]}${index > titles.length ? ` ${Math.floor(index / titles.length) + 1}` : ''}`,
      summary: summaries[i % summaries.length],
      pubdate: `202${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      pic: {
        large: posterUrls[posterIndex]
      },
      rating: {
        average: parseFloat(rating)
      },
      genres: [genres[i % genres.length], genres[(i + 1) % genres.length]],
      source: listName
    });
  }
  
  return mockItems;
}


