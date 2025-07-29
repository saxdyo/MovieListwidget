WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "影视榜单",
  description: "影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "1.2.0",
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
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "收入↓", value: "revenue.desc" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" },
        { name: "release_status", title: "上映状态", type: "enumeration", value: "all", enumOptions: [
            { title: "全部", value: "all" },
            { title: "已上映", value: "released" },
            { title: "未上映", value: "unreleased" }
        ]}
      ]
    },
    {
      title: "TMDB 高分内容",
      description: "高分电影或剧集 (按用户评分排序)",
      requiresWebView: false,
      functionName: "tmdbTopRated",
      cacheDuration: 3600,
      params: [
        { name: "type", title: "🎭类型", type: "enumeration", enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ], value: "movie" },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          value: "vote_average.desc",
          enumOptions: [
            { title: "评分↓", value: "vote_average.desc" },
            { title: "热门度↓", value: "popularity.desc" },
            { title: "上映日期↓", value: "release_date.desc" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" },
        { name: "release_status", title: "上映状态", type: "enumeration", value: "all", enumOptions: [
            { title: "全部", value: "all" },
            { title: "已上映", value: "released" },
            { title: "未上映", value: "unreleased" }
        ]}
      ]
    },
    {
      title: "TMDB 播出平台",
      description: "按播出平台和内容类型筛选剧集内容",
      requiresWebView: false,
      functionName: "tmdbDiscoverByNetwork",
      cacheDuration: 3600,
      params: [
        { name: "with_networks", title: "播出平台", type: "enumeration", value: "", enumOptions: [
            { title: "全部", value: "" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" },
            { title: "Tencent", value: "2007" },
            { title: "iQiyi", value: "1330" }
          ]},
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "TMDB 出品公司",
      description: "按出品公司筛选电影和剧集内容",
      requiresWebView: false,
      functionName: "tmdbDiscoverByCompany",
      cacheDuration: 3600,
      params: [
        { name: "with_companies", title: "出品公司", type: "enumeration", value: "", enumOptions: [
            { title: "全部", value: "" },
            { title: "Marvel Studios", value: "420" },
            { title: "Walt Disney", value: "2" },
            { title: "Warner Bros.", value: "174" },
            { title: "Netflix", value: "11073" }
          ]},
        { name: "type", title: "🎭内容类型", type: "enumeration", value: "movie", enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]},
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" },
        { name: "release_status", title: "上映状态", type: "enumeration", value: "all", enumOptions: [
            { title: "全部", value: "all" },
            { title: "已上映", value: "released" },
            { title: "未上映", value: "unreleased" }
        ]}
      ]
    },
    // -------------IMDB模块-------------
    {
      title: "IMDB 热门内容",
      description: "基于IMDB评分的热门电影和剧集",
      requiresWebView: false,
      functionName: "imdbPopularContent",
      cacheDuration: 3600,
      params: [
        { name: "type", title: "🎭内容类型", type: "enumeration", value: "movie", enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]},
        { name: "sort_by", title: "📊排序方式", type: "enumeration", value: "vote_average.desc", enumOptions: [
            { title: "评分↓", value: "vote_average.desc" },
            { title: "热门度↓", value: "popularity.desc" },
            { title: "上映日期↓", value: "release_date.desc" }
          ]},
        { name: "vote_average_gte", title: "⭐最低评分", type: "enumeration", value: "7.0", enumOptions: [
            { title: "无要求", value: "0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" }
          ]},
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" },
        { name: "release_status", title: "上映状态", type: "enumeration", value: "all", enumOptions: [
            { title: "全部", value: "all" },
            { title: "已上映", value: "released" },
            { title: "未上映", value: "unreleased" }
        ]}
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
        { name: "with_origin_country", title: "🌸制作地区", type: "enumeration", value: "JP", enumOptions: [
            { title: "日本动画", value: "JP" },
            { title: "中国动画", value: "CN" },
            { title: "全部地区", value: "" }
          ]},
        { name: "sort_by", title: "📊排序方式", type: "enumeration", value: "popularity.desc", enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "评分↓", value: "vote_average.desc" }
          ]},
        { name: "vote_average_gte", title: "⭐最低评分", type: "enumeration", value: "6.0", enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" }
          ]},
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
        { name: "ranking_type", title: "🏆排行榜类型", type: "enumeration", value: "top_rated", enumOptions: [
            { title: "评分排行榜", value: "top_rated" },
            { title: "热门排行榜", value: "popular" },
            { title: "新番排行榜", value: "recent" }
          ]},
        { name: "vote_average_gte", title: "⭐最低评分", type: "enumeration", value: "7.0", enumOptions: [
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" }
          ]},
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // -------------豆瓣模块-------------
    {
      title: "豆瓣片单大全",
      description: "豆瓣Top250、热播榜、口碑榜等官方榜单合集",
      requiresWebView: false,
      functionName: "doubanMixedRanking",
      cacheDuration: 3600,
      params: [
        {
          name: "douban_type",
          title: "📀片单类型",
          type: "enumeration",
          value: "movie_top250",
          enumOptions: [
            { title: "豆瓣电影Top250", value: "movie_top250" },
            { title: "豆瓣实时热榜", value: "movie_hot" },
            { title: "豆瓣一周口碑榜", value: "movie_weekly" },
            { title: "豆瓣新片榜", value: "movie_new" },
            { title: "豆瓣电视剧Top250", value: "tv_top250" },
            { title: "豆瓣国产剧榜", value: "tv_chinese" },
            { title: "豆瓣热门剧集", value: "tv_hot" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    }
  ]
};

const API_KEY = 'f3ae69ddca232b56265600eb919d46ab';

// 格式化豆瓣项目
function formatDoubanItem(item) {
  if (!item.cover || !item.id) return null;

  return {
    id: item.id,
    type: "douban",
    title: item.title || "未知标题",
    description: item.card_subtitle || item.intro || "暂无简介",
    releaseDate: item.pubdate?.[0] || "未知日期",
    posterPath: item.cover,
    backdropPath: "",
    rating: item.rating?.value || "无评分",
    mediaType: item.type || "movie",
    genreTitle: item.types?.[0] || "未知类型",
    source: "豆瓣"
  };
}

// 豆瓣综合榜单
async function doubanMixedRanking(params = {}) {
  const { douban_type = "movie_top250", page = 1, language = "zh-CN" } = params;

  const doubanUrls = {
    movie_top250: "https://m.douban.com/rexxar/api/v2/subject_collection/movie_top250/items",
    movie_hot: "https://m.douban.com/rexxar/api/v2/subject_collection/movie_real_time_hotest/items",
    movie_weekly: "https://m.douban.com/rexxar/api/v2/subject_collection/movie_weekly_best/items",
    movie_new: "https://m.douban.com/rexxar/api/v2/subject_collection/movie_latest/items",
    tv_top250: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_top250/items",
    tv_chinese: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_domestic/items",
    tv_hot: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_hot/items"
  };

  const url = doubanUrls[douban_type];
  if (!url) return [];

  try {
    const res = await Widget.fetch.get(url, {
      params: { start: (page - 1) * 20, count: 20 }
    });

    return res.data.subject_collection_items
      .map(formatDoubanItem)
      .filter(item => item !== null);
  } catch (error) {
    console.error("Error fetching Douban ranking:", error);
    return [];
  }
}
