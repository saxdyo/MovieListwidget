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
      title: "✨ 动画片库",
      description: "按地区筛选的动画内容",
      requiresWebView: false,
      functionName: "listAnime",
      cacheDuration: 3600,
      params: [
        {
          name: "region",
          title: "🌍制作地区",
          type: "enumeration",
          description: "选择动画制作地区",
          value: "all",
          enumOptions: [
            { title: "全部地区", value: "all" },
            { title: "日本动画", value: "country_jp" },
            { title: "中国动画", value: "country_cn" },
            { title: "韩国动画", value: "country_kr" },
            { title: "美国动画", value: "country_us" },
            { title: "欧美地区", value: "region_us-eu" },
            { title: "港台地区", value: "country_hk" }
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
            { title: "播出日期↓", value: "first_air_date.desc" },
            { title: "播出日期↑", value: "first_air_date.asc" },
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
     // -------------豆瓣模块-------------
     // --- 片单解析 ---
     {
       title: "豆瓣片单(TMDB版)",
       description: "豆瓣片单地址",
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
             { title: "豆瓣热门电影", value: "https://m.douban.com/subject_collection/movie_hot_gaia" },
             { title: "热播新剧", value: "https://m.douban.com/subject_collection/tv_hot" },
             { title: "热播综艺", value: "https://m.douban.com/subject_collection/show_hot" },
             { title: "热播动漫", value: "https://m.douban.com/subject_collection/tv_animation" },
             { title: "影院热映", value: "https://m.douban.com/subject_collection/movie_showing" },
             { title: "实时热门电影", value: "https://m.douban.com/subject_collection/movie_real_time_hotest" },
             { title: "实时热门电视", value: "https://m.douban.com/subject_collection/tv_real_time_hotest" },
             { title: "豆瓣 Top 250", value: "https://m.douban.com/subject_collection/movie_top250" },
             { title: "一周电影口碑榜", value: "https://m.douban.com/subject_collection/movie_weekly_best" },
             { title: "华语口碑剧集榜", value: "https://m.douban.com/subject_collection/tv_chinese_best_weekly" },
             { title: "全球口碑剧集榜", value: "https://m.douban.com/subject_collection/tv_global_best_weekly" },
             { title: "国内综艺口碑榜", value: "https://m.douban.com/subject_collection/show_chinese_best_weekly" },
             { title: "全球综艺口碑榜", value: "https://m.douban.com/subject_collection/show_global_best_weekly" },
             { title: "第97届奥斯卡", value: "https://m.douban.com/subject_collection/EC7I7ZDRA?type=rank" },
             { title: "IMDB MOVIE TOP 250", value: "https://m.douban.com/doulist/1518184" },
             { title: "IMDB TV TOP 250", value: "https://m.douban.com/doulist/41573512" },
             { title: "意外结局电影", value: "https://m.douban.com/doulist/11324" }
           ]
         },
         {
           name: "page",
           title: "页码",
           type: "page"
         }
       ]
     },
     {
      title: "影视主题分类",
      description: "按类型/题材分类展示电影或剧集",
      requiresWebView: false,
      functionName: "classifyByGenre",
      cacheDuration: 3600,
      params: [
        {
          name: "type",
          title: "内容类型",
          type: "enumeration",
          description: "选择电影、剧集或全部",
          value: "movie",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        {
          name: "genre",
          title: "主题类型",
          type: "enumeration",
          description: "选择主题类型",
          value: "18",
          enumOptions: [
            { title: "剧情", value: "18" },
            { title: "喜剧", value: "35" },
            { title: "动作", value: "28" },
            { title: "爱情", value: "10749" },
            { title: "科幻", value: "878" },
            { title: "动画", value: "16" },
            { title: "犯罪", value: "80" },
            { title: "悬疑", value: "9648" },
            { title: "恐怖", value: "27" },
            { title: "纪录片", value: "99" }
          ]
        },
        {
          name: "with_origin_country",
          title: "地区",
          type: "enumeration",
          description: "选择制作地区",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "中国", value: "CN" },
            { title: "美国", value: "US" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" },
            { title: "欧洲", value: "GB,FR,DE,ES,IT" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
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
            { title: "投票数↓", value: "vote_count.desc" },
            { title: "投票数↑", value: "vote_count.asc" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN"
        }
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
  // 优先选用简体中文标题
  function pickChinese(...args) {
    for (const str of args) {
      if (str && /[\u4e00-\u9fa5]/.test(str)) return str;
    }
    return args.find(Boolean) || '';
  }
  return {
    id: item.id,
    type: "tmdb",
    title: pickChinese(item.title_zh, item.original_title_zh, item.name_zh, item.original_name_zh, item.original_title, item.original_name, item.title, item.name),
    description: item.overview || "暂无简介",
    releaseDate: item.release_date || item.first_air_date || "未知日期",
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
    rating: item.vote_average || "无评分",
    mediaType: item.media_type || (item.title ? "movie" : "tv"),
    genreTitle: genreMap[item.genre_ids && item.genre_ids[0]] || "未知类型"
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

// ✨ 动画片库 - 按地区筛选的动画内容
async function listAnime(params = {}) {
  const { 
    region = "all", 
    sort_by = "popularity.desc", 
    page = 1,
    language = "zh-CN",
    vote_average_gte = "0"
  } = params;
  
  try {
    console.log(`[动画片库] 请求参数: region=${region}, sort_by=${sort_by}, page=${page}, vote_average_gte=${vote_average_gte}`);
    
    // 构建查询参数
    const queryParams = {
      language,
      page: parseInt(page),
      sort_by,
      api_key: API_KEY,
      with_genres: "16", // 动画类型
      vote_count_gte: 5 // 最少投票数，确保质量
    };
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 添加地区筛选
    if (region && region !== "all") {
      if (region.startsWith("country_")) {
        const countryCode = region.replace("country_", "").toUpperCase();
        queryParams.with_origin_country = countryCode;
      } else if (region === "region_us-eu") {
        // 欧美地区，主要是美国、英国、加拿大、澳大利亚
        queryParams.with_origin_country = "US,GB,CA,AU";
      }
    }
    
    console.log(`[动画片库] TMDB查询参数:`, queryParams);
    
    // 发起TMDB API请求
    const res = await Widget.tmdb.get("/discover/tv", {
      params: queryParams
    });
    
    if (!res || !res.results) {
      console.error("[动画片库] API响应格式异常");
      return [];
    }
    
    const genreMap = await fetchTmdbGenres();
    const results = res.results
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap.tv);
        // 添加动画标识
        formattedItem.type = "anime";
        formattedItem.source = "动画片库";
        formattedItem.mediaType = "tv"; // 动画通常归类为tv
        return formattedItem;
      })
      .filter(item => item.posterPath && item.title); // 过滤掉没有海报和标题的项目
    
    console.log(`[动画片库] 成功获取 ${results.length} 个结果`);
    return results;
    
  } catch (error) {
    console.error("[动画片库] 获取数据时出错:", error);
    return [];
  }
}

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
      .filter(item => {
        // 过滤掉无海报
        if (!item.posterPath) return false;
        // 过滤掉综艺（真人秀、脱口秀、访谈、节目等）
        const varietyGenreIds = [10767]; // 只保留脱口秀过滤
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目'];
        if (showKeywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k))) return false;
        // 过滤短剧（标题或副标题包含"短剧"）
        if (lowerTitle.includes('短剧') || lowerDesc.includes('短剧')) return false;
        // 过滤三级片
        const cat3Keywords = ['三级片','三級片','三級','3级片','3級片','3级','3級','R级','R級','限制级','限制級','成人片','情色片','无码','無碼','无码片','無碼片'];
        if (cat3Keywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k) || (item.genreTitle && item.genreTitle.includes(k)))) return false;
        return true;
      }); // TMDB热门剧集
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

// ===============豆瓣功能函数===============

async function fetchTmdbDataForDouban(key, mediaType) {
    let searchTypes = [];
    
    if (mediaType === "movie") {
        searchTypes = ["movie"];
    } else if (mediaType === "tv") {
        searchTypes = ["tv"];
    } else if (mediaType === "multi") {
        searchTypes = ["movie", "tv"];
    } else {
        searchTypes = ["movie", "tv"];
    }
    
    const allResults = [];
    
    for (const type of searchTypes) {
        try {
            const tmdbResults = await Widget.tmdb.get(`/search/${type}`, {
                params: {
                    query: key,
                    language: "zh_CN",
                }
            });
            
            if (tmdbResults.results && tmdbResults.results.length > 0) {
                const resultsWithType = tmdbResults.results.map(result => ({
                    ...result,
                    media_type: type
                }));
                allResults.push(...resultsWithType);
            }
        } catch (error) {
            // Continue to next search type on error
        }
    }
    
    return allResults;
}

async function fetchImdbItemsForDouban(scItems) {
    const promises = scItems.map(async (scItem) => {
        const titleNormalizationRules = [
            { pattern: /^罗小黑战记/, replacement: '罗小黑战记', forceMovieType: true },
            { pattern: /^千与千寻/, replacement: '千与千寻', forceMovieType: true },
            { pattern: /^哈尔的移动城堡/, replacement: '哈尔的移动城堡', forceMovieType: true },
            { pattern: /^鬼灭之刃/, replacement: '鬼灭之刃', forceMovieType: true },
            { pattern: /^天气之子/, replacement: '天气之子', forceMovieType: true },
            { pattern: /^坂本日常 Part 2/, replacement: '坂本日常' },
            { pattern: /^苍兰诀2 影三界篇/, replacement: '苍兰诀', forceFirstResult: true },
            { pattern: /^沧元图2 元初山番外篇/, replacement: '沧元图' },
            { pattern: /^石纪元 第四季 Part 2/, replacement: '石纪元' },
            { pattern: /^双人独自露营/, replacement: 'ふたりソロキャンプ' },
            { pattern: /^地缚少年花子君 第二季 后篇/, replacement: '地缚少年花子君' },
            { pattern: /^更衣人偶坠入爱河 第二季/, replacement: '更衣人偶坠入爱河', forceFirstResult: true },
            { pattern: /^坏女孩/, replacement: '不良少女' },
            { pattern: / 第[^季]*季/, replacement: '' },
            { pattern: /^(歌手|全员加速中)\d{4}$/, replacement: (match, showName) => {
                const showMap = {
                    '歌手': '我是歌手',
                    '全员加速中': '全员加速中'
                };
                return showMap[showName] || showName;
            }},
            { pattern: /^奔跑吧(?! ?兄弟)/, replacement: '奔跑吧兄弟' },
            { pattern: /^(.+?[^0-9])\d+$/, replacement: (match, baseName) => {
                if (/^(歌手|全员加速中)\d{4}$/.test(match)) {
                    return match;
                }
                return baseName;
            }},
            { pattern: /^([^·]+)·(.*)$/, replacement: (match, part1, part2) => {
                if (part2 && !/^(慢享季|第.*季)/.test(part2)) {
                    return part1 + part2;
                }
                return part1;
            }}
        ];
        
        let title = scItem.title;
        let forceFirstResult = false;
        let forceMovieType = false;
        for (const rule of titleNormalizationRules) {
            if (rule.pattern.test(title)) {
                if (typeof rule.replacement === 'function') {
                    title = title.replace(rule.pattern, rule.replacement);
                } else {
                    title = title.replace(rule.pattern, rule.replacement);
                }
                if (rule.forceFirstResult) {
                    forceFirstResult = true;
                }
                if (rule.forceMovieType) {
                    forceMovieType = true;
                }
                break;
            }
        }
        
        let year = null;
        if (scItem.year) {
            year = String(scItem.year);
        } else if (scItem.card_subtitle) {
            const yearMatch = scItem.card_subtitle.match(/(\d{4})/);
            if (yearMatch) year = yearMatch[1];
        }

        let searchType = scItem.type;
        
        if (forceMovieType) {
            searchType = "movie";
        } else {
            let detectedType = detectItemTypeFromContent(scItem);
            
            if (scItem.type === "multi") {
                if (detectedType) {
                    searchType = detectedType;
                } else if (scItem.subtype && (scItem.subtype === "movie" || scItem.subtype === "tv")) {
                    searchType = scItem.subtype;
                } else {
                    searchType = "multi";
                }
            }
        }
        
        const tmdbDatas = await fetchTmdbDataForDouban(title, searchType);

        if (tmdbDatas.length !== 0) {
            
            if (scItem.isMultiTypeTitle) {
                const allMatches = selectMatches(tmdbDatas, title, year, { 
                    returnArray: true, 
                    doubanItem: scItem
                });

                return allMatches
                    .filter(match => {
                        return match.poster_path &&
                               match.id &&
                               (match.title || match.name) &&
                               (match.title || match.name).trim().length > 0;
                    })
                    .map(match => ({
                        id: match.id,
                        type: "tmdb",
                        title: match.title ?? match.name,
                        description: match.overview,
                        releaseDate: match.release_date ?? match.first_air_date,
                        backdropPath: match.backdrop_path,
                        posterPath: match.poster_path,
                        rating: match.vote_average,
                        mediaType: match.media_type,
                        genreTitle: generateGenreTitleFromTmdb(match, scItem),
                        originalDoubanTitle: scItem.title,
                        originalDoubanYear: scItem.year,
                        originalDoubanId: scItem.id
                    }));
            } else {
                const bestMatch = forceFirstResult && tmdbDatas.length > 0 ? 
                    tmdbDatas[0] : 
                    selectMatches(tmdbDatas, title, year, { 
                        doubanItem: scItem
                    });
                
                if (bestMatch && bestMatch.poster_path && bestMatch.id && 
                    (bestMatch.title || bestMatch.name) && 
                    (bestMatch.title || bestMatch.name).trim().length > 0) {
                    return {
                        id: bestMatch.id,
                        type: "tmdb",
                        title: bestMatch.title ?? bestMatch.name,
                        description: bestMatch.overview,
                        releaseDate: bestMatch.release_date ?? bestMatch.first_air_date,
                        backdropPath: bestMatch.backdrop_path,
                        posterPath: bestMatch.poster_path,
                        rating: bestMatch.vote_average,
                        mediaType: bestMatch.media_type,
                        genreTitle: generateGenreTitleFromTmdb(bestMatch, scItem),
                        originalDoubanTitle: scItem.title,
                        originalDoubanYear: scItem.year,
                        originalDoubanId: scItem.id
                    };
                }
            }
        }
        return null;
    });

    const results = await Promise.all(promises);
    
    const allItems = [];
    for (const result of results) {
        if (result) {
            if (Array.isArray(result)) {
                allItems.push(...result);
            } else {
                allItems.push(result);
            }
        }
    }
    
    let filteredItems = allItems.filter(item => {
        // 过滤掉综艺（真人秀、脱口秀、访谈、节目等）
        const varietyGenreIds = [10767]; // 只保留脱口秀过滤
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目'];
        if (showKeywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k))) return false;
        // 过滤短剧（标题或副标题包含"短剧"）
        if (lowerTitle.includes('短剧') || lowerDesc.includes('短剧')) return false;
        // 过滤三级片
        const cat3Keywords = ['三级片','三級片','三級','3级片','3級片','3级','3級','R级','R級','限制级','限制級','成人片','情色片','无码','無碼','无码片','無碼片'];
        if (cat3Keywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k) || (item.genreTitle && item.genreTitle.includes(k)))) return false;
        return true;
    });
    return filteredItems;
}

async function loadDoubanHotListWithTmdb(params = {}) {
  const url = params.url;
  
  const uriMatch = url.match(/uri=([^&]+)/);
  if (!uriMatch) {
    throw new Error("无法解析豆瓣dispatch URL");
  }
  
  const uri = decodeURIComponent(uriMatch[1]);
  const collectionMatch = uri.match(/\/subject_collection\/([^\/]+)/);
  if (!collectionMatch) {
    throw new Error("无法从URI中提取collection ID");
  }
  
  const collectionId = collectionMatch[1];
  
  const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${collectionId}/items?updated_at&items_only=1&for_mobile=1`;
  const referer = `https://m.douban.com/subject_collection/${collectionId}/`;
  
  const response = await Widget.http.get(apiUrl, {
    headers: {
      Referer: referer,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    },
  });
  
  if (!response.data || !response.data.subject_collection_items) {
    throw new Error("获取豆瓣热榜数据失败");
  }
  
  const items = response.data.subject_collection_items;
  
  const processedItems = items.map((item) => {
    let itemType = "multi";
    
    if (params.type === "movie") {
      itemType = "movie";
    } else if (params.type === "tv") {
      itemType = "tv";
    } else if (params.type === "subject") {
      if (item.subtype === "movie") {
        itemType = "movie";
      } else if (item.subtype === "tv") {
        itemType = "tv";
      } else {
        itemType = "multi";
      }
    }
    
    return {
      ...item,
      type: itemType
    };
  });
  
  const processedItemsWithMultiDetection = detectAndAssignTypePreferences(processedItems);
  
  return await fetchImdbItemsForDouban(processedItemsWithMultiDetection);
}

async function loadEnhancedDoubanList(params = {}) {
    const url = params.url;
    
    if (url.includes("douban.com/doulist/")) {
        return loadEnhancedDefaultList(params);
    } 
    else if (url.includes("douban.com/subject_collection/")) {
        return loadEnhancedSubjectCollection(params);
    } 
    else if (url.includes("m.douban.com/doulist/")) {
        const desktopUrl = url.replace("m.douban.com", "www.douban.com");
        return loadEnhancedDefaultList({ ...params, url: desktopUrl });
    }
    else if (url.includes("douban.com/doubanapp/dispatch")) {
        const parsedUrl = parseDoubanAppDispatchUrl(url);
        return loadEnhancedDoubanList({ ...params, url: parsedUrl });
    }
    
    return [];
}

async function loadEnhancedDefaultList(params = {}) {
    const url = params.url;
    const listId = url.match(/doulist\/(\d+)/)?.[1];
    const page = params.page || 1;
    const count = 25;
    const start = (page - 1) * count;
    const pageUrl = `https://www.douban.com/doulist/${listId}/?start=${start}&sort=seq&playable=0&sub_type=`;

    const response = await Widget.http.get(pageUrl, {
        headers: {
            Referer: `https://movie.douban.com/explore`,
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });

    const docId = Widget.dom.parse(response.data);
    const videoElementIds = Widget.dom.select(docId, ".doulist-item .title a");

    let doubanItems = [];
    for (const itemId of videoElementIds) {
        const link = await Widget.dom.attr(itemId, "href");
        const text = await Widget.dom.text(itemId);
        const chineseTitle = text.trim().split(' ')[0];
        if (chineseTitle) {
            doubanItems.push({ title: chineseTitle, type: "multi" });
        }
    }

    return await fetchImdbItemsForDouban(doubanItems);
}

async function loadEnhancedItemsFromApi(params = {}) {
    const url = params.url;
    const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
    const response = await Widget.http.get(url, {
        headers: {
            Referer: `https://m.douban.com/subject_collection/${listId}/`,
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });

    const scItems = response.data.subject_collection_items;
    return await fetchImdbItemsForDouban(scItems);
}

async function loadEnhancedSubjectCollection(params = {}) {
    const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
    const page = params.page || 1;
    const count = 20;
    const start = (page - 1) * count;
    
    let pageUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;
    if (params.type) {
        pageUrl += `&type=${params.type}`;
    }
    
    return await loadEnhancedItemsFromApi({ ...params, url: pageUrl });
}

// 辅助函数：解析豆瓣App dispatch URL
function parseDoubanAppDispatchUrl(url) {
    const uriMatch = url.match(/uri=([^&]+)/);
    if (!uriMatch) {
        return url;
    }
    
    const uri = decodeURIComponent(uriMatch[1]);
    return `https://www.douban.com${uri}`;
}

// 辅助函数：检测内容类型
function detectItemTypeFromContent(item) {
    const title = item.title || '';
    const subtitle = item.card_subtitle || '';
    
    // 电影关键词
    const movieKeywords = ['电影', '影片', '院线', '票房', '导演', '主演'];
    // 电视剧关键词
    const tvKeywords = ['剧集', '电视剧', '连续剧', '季', '集', '播出'];
    // 综艺关键词
    const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目'];
    
    const content = (title + ' ' + subtitle).toLowerCase();
    
    if (movieKeywords.some(keyword => content.includes(keyword))) {
        return 'movie';
    }
    
    if (tvKeywords.some(keyword => content.includes(keyword))) {
        return 'tv';
    }
    
    if (showKeywords.some(keyword => content.includes(keyword))) {
        return 'tv'; // 综艺也归类为tv
    }
    
    return null;
}

// 辅助函数：检测并分配类型偏好
function detectAndAssignTypePreferences(items) {
    return items.map(item => {
        const detectedType = detectItemTypeFromContent(item);
        return {
            ...item,
            detectedType: detectedType,
            isMultiTypeTitle: item.type === "multi" && !detectedType
        };
    });
}

// 辅助函数：选择最佳匹配
function selectMatches(tmdbResults, title, year, options = {}) {
    if (!tmdbResults || tmdbResults.length === 0) {
        return options.returnArray ? [] : null;
    }
    
    // 简化匹配逻辑：优先选择评分高的
    const sortedResults = tmdbResults.sort((a, b) => {
        const scoreA = (a.vote_average || 0) + (a.popularity || 0) * 0.01;
        const scoreB = (b.vote_average || 0) + (b.popularity || 0) * 0.01;
        return scoreB - scoreA;
    });
    
    if (options.returnArray) {
        return sortedResults.slice(0, 3); // 返回前3个最佳匹配
    }
    
    return sortedResults[0];
}

// 辅助函数：生成题材标题
function generateGenreTitleFromTmdb(tmdbItem, doubanItem) {
    const mediaType = tmdbItem.media_type || 'unknown';
    
    if (mediaType === 'movie') {
        return '电影';
    } else if (mediaType === 'tv') {
        return '剧集';
    }
    
    return '影视';
}

// 解析豆瓣片单（TMDB版）
async function loadCardItems(params = {}) {
  try {
    const url = params.url;
    if (!url) throw new Error("缺少片单 URL");
    if (url.includes("douban.com/doulist/")) {
      // 豆瓣桌面端豆列
      const listId = url.match(/doulist\/(\d+)/)?.[1];
      if (!listId) throw new Error("无法获取片单 ID");
      const page = params.page || 1;
      const count = 25;
      const start = (page - 1) * count;
      const pageUrl = `https://www.douban.com/doulist/${listId}/?start=${start}&sort=seq&playable=0&sub_type=`;
      const response = await Widget.http.get(pageUrl, {
        headers: {
          Referer: `https://movie.douban.com/explore`,
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
      if (!response || !response.data) throw new Error("获取片单数据失败");
      const docId = Widget.dom.parse(response.data);
      if (docId < 0) throw new Error("解析 HTML 失败");
      const videoElementIds = Widget.dom.select(docId, ".doulist-item .title a");
      let doubanIds = [];
      for (const itemId of videoElementIds) {
        const text = await Widget.dom.text(itemId);
        const chineseTitle = text.trim().split(' ')[0];
        if (chineseTitle) doubanIds.push({ title: chineseTitle, type: "multi" });
      }
      return await fetchImdbItemsForDouban(doubanIds);
    } else if (url.includes("douban.com/subject_collection/")) {
      // 豆瓣官方榜单
      const listId = url.match(/subject_collection\/(\w+)/)?.[1];
      if (!listId) throw new Error("无法获取合集 ID");
      const page = params.page || 1;
      const count = 20;
      const start = (page - 1) * count;
      let pageUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;
      params.url = pageUrl;
      const response = await Widget.http.get(pageUrl, {
        headers: {
          Referer: `https://m.douban.com/subject_collection/${listId}/`,
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
      if (response.data && response.data.subject_collection_items) {
        return await fetchImdbItemsForDouban(response.data.subject_collection_items);
      }
      return [];
    } else if (url.includes("m.douban.com/doulist/")) {
      // 移动端豆列转桌面端
      const desktopUrl = url.replace("m.douban.com", "www.douban.com");
      return await loadCardItems({ ...params, url: desktopUrl });
    } else if (url.includes("douban.com/doubanapp/dispatch")) {
      // App dispatch
      const parsedUrl = parseDoubanAppDispatchUrl(url);
      return await loadCardItems({ ...params, url: parsedUrl });
    }
    return [];
  } catch (error) {
    console.error("解析豆瓣片单(TMDB版)失败:", error);
    throw error;
  }
}

// 按类型/题材分类展示电影或剧集
async function classifyByGenre(params = {}) {
  const { type = "movie", genre = "", page = 1, language = "zh-CN", with_origin_country = "", sort_by = "popularity.desc" } = params;
  try {
    if (type === 'all') {
      // 并发请求电影和剧集
      const [movieRes, tvRes] = await Promise.all([
        classifyByGenre({ ...params, type: 'movie' }),
        classifyByGenre({ ...params, type: 'tv' })
      ]);
      // 合并去重（按id）
      const all = [...movieRes, ...tvRes];
      const seen = new Set();
      const unique = all.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
      return unique;
    }
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    const queryParams = {
      language,
      page,
      api_key: API_KEY,
      sort_by
    };
    if (genre) {
      queryParams.with_genres = genre;
    }
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    const res = await Widget.tmdb.get(endpoint, { params: queryParams });
    const genreMap = await fetchTmdbGenres();
    const genreDict = type === "movie" ? genreMap.movie : genreMap.tv;
    return res.results
      .map(item => formatTmdbItem(item, genreDict))
      .filter(item => {
        // 复用过滤逻辑
        if (!item.posterPath) return false;
        const varietyGenreIds = [10767];
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目'];
        if (showKeywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k))) return false;
        if (lowerTitle.includes('短剧') || lowerDesc.includes('短剧')) return false;
        const adultKeywords = ['19禁', '성인', '成人', '情色', '色情', 'AV', '에로', '야동'];
        if (adultKeywords.some(k => lowerTitle.includes(k) || lowerDesc.includes(k) || (item.genreTitle && item.genreTitle.includes(k)))) return false;
        return true;
      });
  } catch (error) {
    console.error("Error in classifyByGenre:", error);
    return [];
  }
}


