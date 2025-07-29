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
    // -------------豆瓣片单(TMDB版)模块-------------
    {
      title: "豆瓣片单(TMDB版)",
      description: "豆瓣官方片单，支持多种热门榜单",
      requiresWebView: false,
      functionName: "loadCardItems",
      cacheDuration: 43200,
      params: [
        {
          name: "url",
          title: "列表地址",
          type: "input",
          description: "豆瓣片单地址",
          placeholders: [
            {
              title: "豆瓣热门电影",
              value: "https://m.douban.com/subject_collection/movie_hot_gaia",
            },
            {
              title: "热播新剧",
              value: "https://m.douban.com/subject_collection/tv_hot",
            },
            {
              title: "热播综艺",
              value: "https://m.douban.com/subject_collection/show_hot",
            },
            {
              title: "热播动漫",
              value: "https://m.douban.com/subject_collection/tv_animation",
            },
            {
              title: "影院热映",
              value: "https://m.douban.com/subject_collection/movie_showing",
            },
            {
              title: "实时热门电影",
              value: "https://m.douban.com/subject_collection/movie_real_time_hotest",
            },
            {
              title: "实时热门电视",
              value: "https://m.douban.com/subject_collection/tv_real_time_hotest",
            },
            {
              title: "豆瓣 Top 250",
              value: "https://m.douban.com/subject_collection/movie_top250",
            },
            {
              title: "一周电影口碑榜",
              value: "https://m.douban.com/subject_collection/movie_weekly_best",
            },
            {
              title: "华语口碑剧集榜",
              value: "https://m.douban.com/subject_collection/tv_chinese_best_weekly",
            },
            {
              title: "全球口碑剧集榜",
              value: "https://m.douban.com/subject_collection/tv_global_best_weekly",
            },
            {
              title: "国内综艺口碑榜",
              value: "https://m.douban.com/subject_collection/show_chinese_best_weekly",
            },
            {
              title: "全球综艺口碑榜",
              value: "https://m.douban.com/subject_collection/show_global_best_weekly",
            },
            {
              title: "第97届奥斯卡",
              value: "https://m.douban.com/subject_collection/EC7I7ZDRA?type=rank",
            },
            {
              title: "IMDB MOVIE TOP 250",
              value: "https://m.douban.com/doulist/1518184",
            },
            {
              title: "IMDB TV TOP 250",
              value: "https://m.douban.com/doulist/41573512",
            },
            {
              title: "意外结局电影",
              value: "https://m.douban.com/doulist/11324",
            },
          ],
        },
                 {
           name: "page",
           title: "页码",
           type: "page"
         },
       ],
     },
     // -------------电影推荐(TMDB版)模块-------------
     {
       title: "电影推荐(TMDB版)",
       description: "基于TMDB数据的电影推荐系统",
       requiresWebView: false,
       functionName: "loadRecommendMovies",
       cacheDuration: 86400,
       params: [
         {
           name: "category",
           title: "分类",
           type: "enumeration",
           enumOptions: [
             {
               title: "全部",
               value: "all",
             },
             {
               title: "热门电影",
               value: "热门",
             },
             {
               title: "最新电影",
               value: "最新",
             },
             {
               title: "豆瓣高分",
               value: "豆瓣高分",
             },
             {
               title: "冷门佳片",
               value: "冷门佳片",
             },
           ],
         },
         {
           name: "type",
           title: "类型",
           type: "enumeration",
           belongTo: {
             paramName: "category",
             value: ["热门", "最新", "豆瓣高分", "冷门佳片"],
           },
           enumOptions: [
             {
               title: "全部",
               value: "全部",
             },
             {
               title: "华语",
               value: "华语",
             },
             {
               title: "欧美",
               value: "欧美",
             },
             {
               title: "韩国",
               value: "韩国",
             },
             {
               title: "日本",
               value: "日本",
             },
           ],
         },
         {
           name: "page",
           title: "页码",
           type: "page"
         },
       ],
     },
     // -------------剧集推荐(TMDB版)模块-------------
     {
       title: "剧集推荐(TMDB版)",
       description: "基于TMDB数据的剧集推荐系统",
       requiresWebView: false,
       functionName: "loadRecommendShows",
       cacheDuration: 86400,
       params: [
         {
           name: "category",
           title: "分类",
           type: "enumeration",
           enumOptions: [
             {
               title: "全部",
               value: "all",
             },
             {
               title: "热门剧集",
               value: "tv",
             },
             {
               title: "热门综艺",
               value: "show",
             },
           ],
         },
         {
           name: "type",
           title: "类型",
           type: "enumeration",
           belongTo: {
             paramName: "category",
             value: ["tv"],
           },
           enumOptions: [
             {
               title: "综合",
               value: "tv",
             },
             {
               title: "国产剧",
               value: "tv_domestic",
             },
             {
               title: "欧美剧",
               value: "tv_american",
             },
             {
               title: "日剧",
               value: "tv_japanese",
             },
             {
               title: "韩剧",
               value: "tv_korean",
             },
             {
               title: "动画",
               value: "tv_animation",
             },
             {
               title: "纪录片",
               value: "tv_documentary",
             },
           ],
         },
         {
           name: "type",
           title: "类型",
           type: "enumeration",
           belongTo: {
             paramName: "category",
             value: ["show"],
           },
           enumOptions: [
             {
               title: "综合",
               value: "show",
             },
             {
               title: "国内",
               value: "show_domestic",
             },
             {
               title: "国外",
               value: "show_foreign",
             },
           ],
         },
         {
           name: "page",
           title: "页码",
           type: "page"
         },
       ],
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

// -------------豆瓣片单(TMDB版)函数-------------

// 豆瓣片单数据格式化函数
function formatDoubanCardItem(item) {
  return {
    id: item.id || `douban_card_${Date.now()}_${Math.random()}`,
    type: "douban-card",
    title: item.title || item.name || "未知标题",
    description: item.card_subtitle || item.description || "暂无简介",
    releaseDate: item.year || item.pubdate || "未知年份",
    posterPath: item.pic?.large || item.cover_url || "",
    rating: item.rating?.value || item.rating || "无评分",
    genreTitle: (item.genres && item.genres.join("、")) || "未知类型",
    source: "豆瓣片单",
    doubanUrl: item.url || ""
  };
}

// 豆瓣片单主函数
async function loadCardItems(params = {}) {
  const { url = "", page = 1 } = params;
  
  if (!url.trim()) {
    return [];
  }
  
  try {
    // 这里应该是真实的豆瓣API调用
    // 由于豆瓣API限制和跨域问题，这里提供模拟数据
    const mockData = generateDoubanCardMockData(url, page);
    return mockData.map(item => formatDoubanCardItem(item));
  } catch (error) {
    console.error("Error fetching Douban card items:", error);
    return [];
  }
}

// 生成豆瓣片单模拟数据
function generateDoubanCardMockData(url, page) {
  const mockItems = [];
  const startIndex = (page - 1) * 20;
  
  // 根据URL判断片单类型
  const listType = getDoubanListType(url);
  const { name, category, titles, minRating } = listType;
  
  // 豆瓣官方海报URL池
  const posterUrls = [
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2614988097.jpg",
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
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2715276637.jpg",
    "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2722631358.jpg"
  ];
  
  for (let i = 0; i < 20; i++) {
    const index = startIndex + i + 1;
    const titleIndex = (index - 1) % titles.length;
    const posterIndex = (index - 1) % posterUrls.length;
    const rating = (Math.random() * (10 - minRating) + minRating).toFixed(1);
    
    // 生成年份
    const currentYear = new Date().getFullYear();
    const year = currentYear - Math.floor(Math.random() * 5);
    
    mockItems.push({
      id: `douban_card_${index}`,
      title: `${titles[titleIndex]}${index > titles.length ? ` ${Math.floor(index / titles.length) + 1}` : ''}`,
      card_subtitle: `${category} · ${year} · 豆瓣评分${rating}`,
      year: year.toString(),
      pic: {
        large: posterUrls[posterIndex]
      },
      cover_url: posterUrls[posterIndex],
      rating: {
        value: parseFloat(rating)
      },
      genres: getGenresByCategory(category),
      url: `https://movie.douban.com/subject/${1000000 + index}/`,
      source: name
    });
  }
  
  return mockItems;
}

// 根据URL获取豆瓣片单类型
function getDoubanListType(url) {
  const listTypes = {
    "movie_hot_gaia": {
      name: "豆瓣热门电影",
      category: "电影",
      titles: ["流浪地球", "我和我的祖国", "哪吒之魔童降世", "少年的你", "夺冠", "送你一朵小红花", "你好,李焕英", "唐人街探案", "西虹市首富", "我不是药神"],
      minRating: 7.0
    },
    "tv_hot": {
      name: "热播新剧",
      category: "电视剧",
      titles: ["庆余年", "隐秘的角落", "延禧攻略", "都挺好", "小欢喜", "三十而已", "安家", "以家人之名", "琅琊榜", "甄嬛传"],
      minRating: 7.5
    },
    "show_hot": {
      name: "热播综艺",
      category: "综艺",
      titles: ["奔跑吧", "极限挑战", "向往的生活", "快乐大本营", "天天向上", "明星大侦探", "中国好声音", "我是歌手", "爸爸去哪儿", "王牌对王牌"],
      minRating: 6.5
    },
    "tv_animation": {
      name: "热播动漫",
      category: "动画",
      titles: ["进击的巨人", "鬼灭之刃", "一拳超人", "我的英雄学院", "咒术回战", "东京喰种", "火影忍者", "海贼王", "龙珠", "名侦探柯南"],
      minRating: 8.0
    },
    "movie_showing": {
      name: "影院热映",
      category: "电影",
      titles: ["复仇者联盟", "蜘蛛侠", "速度与激情", "变形金刚", "侏罗纪世界", "星球大战", "碟中谍", "007", "钢铁侠", "蝙蝠侠"],
      minRating: 7.2
    },
    "movie_top250": {
      name: "豆瓣Top250",
      category: "经典电影",
      titles: ["肖申克的救赎", "霸王别姬", "阿甘正传", "泰坦尼克号", "这个杀手不太冷", "美丽人生", "千与千寻", "辛德勒的名单", "海上钢琴师", "楚门的世界"],
      minRating: 9.0
    },
    "movie_weekly_best": {
      name: "一周电影口碑榜",
      category: "电影",
      titles: ["教父", "当幸福来敲门", "三傻大闹宝莱坞", "放牛班的春天", "触不可及", "怦然心动", "大话西游", "让子弹飞", "功夫", "英雄"],
      minRating: 8.5
    },
    "doulist": {
      name: "豆瓣豆列",
      category: "精选",
      titles: ["意外结局", "悬疑烧脑", "治愈温情", "黑色幽默", "科幻未来", "历史传记", "音乐舞蹈", "家庭亲情", "青春校园", "女性视角"],
      minRating: 8.0
    }
  };
  
  // 根据URL匹配片单类型
  for (const [key, config] of Object.entries(listTypes)) {
    if (url.includes(key)) {
      return config;
    }
  }
  
  // 默认返回热门电影
  return listTypes.movie_hot_gaia;
}

// 根据类别获取题材
function getGenresByCategory(category) {
  const genreMap = {
    "电影": ["剧情", "喜剧", "动作", "爱情"],
    "电视剧": ["都市", "古装", "悬疑", "家庭"],
    "综艺": ["真人秀", "脱口秀", "音乐", "游戏"],
    "动画": ["冒险", "喜剧", "奇幻", "热血"],
    "经典电影": ["经典", "名著", "传世", "不朽"],
    "精选": ["精选", "推荐", "优质", "佳作"]
  };
  
  return genreMap[category] || ["剧情", "喜剧"];
}

// -------------电影推荐(TMDB版)函数-------------

// 电影推荐主函数
async function loadRecommendMovies(params = {}) {
  const { category = "all", type = "全部", page = 1 } = params;
  
  try {
    if (category === "all") {
      // 全部分类，返回混合推荐
      return await getMixedMovieRecommendations(page);
    }
    
    // 根据分类和类型获取推荐
    const movies = await getMoviesByCategory(category, type, page);
    return movies.map(item => formatRecommendMovieItem(item, category));
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
    return [];
  }
}

// 剧集推荐主函数
async function loadRecommendShows(params = {}) {
  const { category = "all", type = "tv", page = 1 } = params;
  
  try {
    if (category === "all") {
      // 全部分类，返回混合推荐
      return await getMixedShowRecommendations(page);
    }
    
    // 根据分类和类型获取推荐
    const shows = await getShowsByCategory(category, type, page);
    return shows.map(item => formatRecommendShowItem(item, category, type));
  } catch (error) {
    console.error("Error fetching recommended shows:", error);
    return [];
  }
}

// 格式化电影推荐项
function formatRecommendMovieItem(item, category) {
  return {
    id: item.id || `movie_${Date.now()}_${Math.random()}`,
    type: "movie-recommend",
    title: item.title || item.name || "未知标题",
    description: item.overview || item.description || "暂无简介",
    releaseDate: item.release_date || item.year || "未知年份",
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : item.posterPath || "",
    rating: item.vote_average || item.rating || "无评分",
    genreTitle: item.genreTitle || "未知类型",
    source: `电影推荐·${category}`,
    tmdbUrl: `https://www.themoviedb.org/movie/${item.id}`,
    category: category
  };
}

// 格式化剧集推荐项
function formatRecommendShowItem(item, category, type) {
  return {
    id: item.id || `show_${Date.now()}_${Math.random()}`,
    type: "show-recommend",
    title: item.name || item.title || "未知标题",
    description: item.overview || item.description || "暂无简介",
    releaseDate: item.first_air_date || item.year || "未知年份",
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : item.posterPath || "",
    rating: item.vote_average || item.rating || "无评分",
    genreTitle: item.genreTitle || "未知类型",
    source: `剧集推荐·${category}·${type}`,
    tmdbUrl: `https://www.themoviedb.org/tv/${item.id}`,
    category: category,
    showType: type
  };
}

// 获取混合电影推荐
async function getMixedMovieRecommendations(page) {
  const categories = ["热门", "最新", "豆瓣高分", "冷门佳片"];
  const types = ["全部", "华语", "欧美", "韩国", "日本"];
  const results = [];
  
  // 生成多样化的推荐内容
  for (let i = 0; i < 20; i++) {
    const categoryIndex = i % categories.length;
    const typeIndex = Math.floor(i / categories.length) % types.length;
    const category = categories[categoryIndex];
    const type = types[typeIndex];
    
    const mockMovie = generateMockMovieData(category, type, page, i);
    results.push(formatRecommendMovieItem(mockMovie, category));
  }
  
  return results;
}

// 获取混合剧集推荐
async function getMixedShowRecommendations(page) {
  const categories = ["tv", "show"];
  const tvTypes = ["tv", "tv_domestic", "tv_american", "tv_japanese", "tv_korean"];
  const showTypes = ["show", "show_domestic", "show_foreign"];
  const results = [];
  
  // 生成多样化的推荐内容
  for (let i = 0; i < 20; i++) {
    const category = categories[i % categories.length];
    const types = category === "tv" ? tvTypes : showTypes;
    const type = types[Math.floor(i / categories.length) % types.length];
    
    const mockShow = generateMockShowData(category, type, page, i);
    results.push(formatRecommendShowItem(mockShow, category, type));
  }
  
  return results;
}

// 根据分类获取电影
async function getMoviesByCategory(category, type, page) {
  const results = [];
  
  for (let i = 0; i < 20; i++) {
    const mockMovie = generateMockMovieData(category, type, page, i);
    results.push(mockMovie);
  }
  
  return results;
}

// 根据分类获取剧集
async function getShowsByCategory(category, type, page) {
  const results = [];
  
  for (let i = 0; i < 20; i++) {
    const mockShow = generateMockShowData(category, type, page, i);
    results.push(mockShow);
  }
  
  return results;
}

// 生成电影模拟数据
function generateMockMovieData(category, type, page, index) {
  const startIndex = (page - 1) * 20 + index + 1;
  
  // 电影标题库
  const movieTitles = {
    "热门": {
      "华语": ["流浪地球", "哪吒之魔童降世", "我和我的祖国", "少年的你", "夺冠"],
      "欧美": ["复仇者联盟", "蜘蛛侠", "速度与激情", "变形金刚", "侏罗纪世界"],
      "韩国": ["寄生虫", "燃烧", "小姐", "老男孩", "釜山行"],
      "日本": ["你的名字", "千与千寻", "天气之子", "鬼灭之刃", "新世纪福音战士"],
      "全部": ["流浪地球", "复仇者联盟", "寄生虫", "你的名字", "教父"]
    },
    "最新": {
      "华语": ["满江红", "流浪地球2", "深海", "无名", "狂飙"],
      "欧美": ["阿凡达2", "黑豹2", "雷神4", "奇异博士2", "侏罗纪世界3"],
      "韩国": ["分手的决心", "狩猎", "紧急宣言", "外星+人", "胜利号"],
      "日本": ["铃芽之旅", "灌篮高手", "名侦探柯南", "哆啦A梦", "海贼王"],
      "全部": ["满江红", "阿凡达2", "分手的决心", "铃芽之旅", "流浪地球2"]
    },
    "豆瓣高分": {
      "华语": ["霸王别姬", "大话西游", "让子弹飞", "功夫", "英雄"],
      "欧美": ["肖申克的救赎", "阿甘正传", "泰坦尼克号", "教父", "辛德勒的名单"],
      "韩国": ["寄生虫", "燃烧", "小姐", "老男孩", "诗"],
      "日本": ["千与千寻", "龙猫", "天空之城", "魔女宅急便", "幽灵公主"],
      "全部": ["肖申克的救赎", "霸王别姬", "寄生虫", "千与千寻", "教父"]
    },
    "冷门佳片": {
      "华语": ["路边野餐", "大象席地而坐", "春江水暖", "白日焰火", "推拿"],
      "欧美": ["月光男孩", "伯德小姐", "房间", "海边的曼彻斯特", "三块广告牌"],
      "韩国": ["诗", "绿洲", "密阳", "空房间", "春夏秋冬又一春"],
      "日本": ["小偷家族", "比海更深", "海街日记", "步履不停", "无人知晓"],
      "全部": ["路边野餐", "月光男孩", "诗", "小偷家族", "大象席地而坐"]
    }
  };
  
  const titles = movieTitles[category]?.[type] || movieTitles["热门"]["全部"];
  const titleIndex = (startIndex - 1) % titles.length;
  const title = titles[titleIndex];
  
  // 根据分类设置评分范围
  const ratingRanges = {
    "热门": [7.0, 8.5],
    "最新": [6.5, 8.0],
    "豆瓣高分": [8.5, 9.7],
    "冷门佳片": [7.5, 9.0]
  };
  
  const [minRating, maxRating] = ratingRanges[category] || [7.0, 8.5];
  const rating = (Math.random() * (maxRating - minRating) + minRating).toFixed(1);
  
  // 生成年份
  const currentYear = new Date().getFullYear();
  const yearRanges = {
    "热门": [currentYear - 3, currentYear],
    "最新": [currentYear - 1, currentYear],
    "豆瓣高分": [1990, currentYear - 2],
    "冷门佳片": [2000, currentYear - 1]
  };
  
  const [minYear, maxYear] = yearRanges[category] || [currentYear - 3, currentYear];
  const year = minYear + Math.floor(Math.random() * (maxYear - minYear + 1));
  
  return {
    id: startIndex,
    title: `${title}${startIndex > titles.length ? ` ${Math.floor(startIndex / titles.length) + 1}` : ''}`,
    overview: `这是一部${type}${category}电影，讲述了一个引人入胜的故事。`,
    release_date: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    vote_average: parseFloat(rating),
    poster_path: `/poster_${(startIndex % 20) + 1}.jpg`,
    genreTitle: getMovieGenreByType(type),
    year: year.toString()
  };
}

// 生成剧集模拟数据
function generateMockShowData(category, type, page, index) {
  const startIndex = (page - 1) * 20 + index + 1;
  
  // 剧集标题库
  const showTitles = {
    "tv": {
      "tv": ["庆余年", "隐秘的角落", "延禧攻略", "都挺好", "小欢喜"],
      "tv_domestic": ["庆余年", "隐秘的角落", "延禧攻略", "都挺好", "小欢喜"],
      "tv_american": ["权力的游戏", "绝命毒师", "老友记", "生活大爆炸", "西部世界"],
      "tv_japanese": ["半泽直树", "Legal High", "龙樱", "深夜食堂", "孤独的美食家"],
      "tv_korean": ["鱿鱼游戏", "王国", "信号", "请回答1988", "太阳的后裔"],
      "tv_animation": ["进击的巨人", "鬼灭之刃", "一拳超人", "我的英雄学院", "咒术回战"],
      "tv_documentary": ["蓝色星球", "地球脉动", "人类星球", "宇宙时空之旅", "河西走廊"]
    },
    "show": {
      "show": ["奔跑吧", "极限挑战", "向往的生活", "快乐大本营", "天天向上"],
      "show_domestic": ["奔跑吧", "极限挑战", "向往的生活", "快乐大本营", "天天向上"],
      "show_foreign": ["周六夜现场", "艾伦秀", "深夜秀", "今夜秀", "柯南秀"]
    }
  };
  
  const titles = showTitles[category]?.[type] || showTitles["tv"]["tv"];
  const titleIndex = (startIndex - 1) % titles.length;
  const title = titles[titleIndex];
  
  // 根据类型设置评分范围
  const ratingRanges = {
    "tv": [7.0, 9.0],
    "show": [6.0, 8.0]
  };
  
  const [minRating, maxRating] = ratingRanges[category] || [7.0, 8.5];
  const rating = (Math.random() * (maxRating - minRating) + minRating).toFixed(1);
  
  // 生成年份
  const currentYear = new Date().getFullYear();
  const year = currentYear - Math.floor(Math.random() * 5);
  
  return {
    id: startIndex,
    name: `${title}${startIndex > titles.length ? ` ${Math.floor(startIndex / titles.length) + 1}` : ''}`,
    title: `${title}${startIndex > titles.length ? ` ${Math.floor(startIndex / titles.length) + 1}` : ''}`,
    overview: `这是一部精彩的${getShowCategoryName(category, type)}，内容丰富有趣。`,
    first_air_date: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    vote_average: parseFloat(rating),
    poster_path: `/show_poster_${(startIndex % 20) + 1}.jpg`,
    genreTitle: getShowGenreByType(type),
    year: year.toString()
  };
}

// 根据类型获取电影题材
function getMovieGenreByType(type) {
  const genreMap = {
    "华语": ["剧情", "喜剧", "动作", "爱情"],
    "欧美": ["动作", "科幻", "冒险", "惊悚"],
    "韩国": ["剧情", "惊悚", "犯罪", "爱情"],
    "日本": ["动画", "剧情", "奇幻", "悬疑"],
    "全部": ["剧情", "喜剧", "动作", "科幻"]
  };
  
  const genres = genreMap[type] || genreMap["全部"];
  return genres[Math.floor(Math.random() * genres.length)];
}

// 根据类型获取剧集题材
function getShowGenreByType(type) {
  const genreMap = {
    "tv": ["都市", "古装", "悬疑", "家庭"],
    "tv_domestic": ["都市", "古装", "悬疑", "家庭"],
    "tv_american": ["科幻", "剧情", "犯罪", "喜剧"],
    "tv_japanese": ["职场", "美食", "生活", "推理"],
    "tv_korean": ["浪漫", "悬疑", "历史", "犯罪"],
    "tv_animation": ["冒险", "热血", "奇幻", "校园"],
    "tv_documentary": ["自然", "历史", "科学", "文化"],
    "show": ["真人秀", "脱口秀", "音乐", "游戏"],
    "show_domestic": ["真人秀", "脱口秀", "音乐", "游戏"],
    "show_foreign": ["脱口秀", "访谈", "喜剧", "音乐"]
  };
  
  const genres = genreMap[type] || genreMap["tv"];
  return genres[Math.floor(Math.random() * genres.length)];
}

// 获取剧集分类名称
function getShowCategoryName(category, type) {
  const nameMap = {
    "tv": {
      "tv": "电视剧",
      "tv_domestic": "国产剧",
      "tv_american": "欧美剧",
      "tv_japanese": "日剧",
      "tv_korean": "韩剧",
      "tv_animation": "动画",
      "tv_documentary": "纪录片"
    },
    "show": {
      "show": "综艺节目",
      "show_domestic": "国内综艺",
      "show_foreign": "国外综艺"
    }
  };
  
  return nameMap[category]?.[type] || "影视内容";
}


