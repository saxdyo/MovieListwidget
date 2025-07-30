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
            { title: "家庭", value: "10751" }
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
            { title: "家庭", value: "10751" }
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
            { title: "恐怖", value: "27" }
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
    },
    {
      title: "✨ 动画",
      description: "按地区筛选的动画内容",
      requiresWebView: false,
      functionName: "listAnime",
      cacheDuration: 3600,
      params: [
        {
          name: "region",
          title: "选择地区/语言",
          type: "enumeration",
          value: "all",
          enumOptions: [
            { title: "全部地区", value: "all" },
            { title: "中国大陆", value: "country:cn" },
            { title: "美国", value: "country:us" },
            { title: "英国", value: "country:gb" },
            { title: "日本", value: "country:jp" },
            { title: "韩国", value: "country:kr" },
            { title: "欧美", value: "region:us-eu" },
            { title: "香港", value: "country:hk" },
            { title: "台湾", value: "country:tw" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "hs_desc",
          enumOptions: [
            { title: "热门度↓", value: "hs_desc" },
            { title: "热门度↑", value: "hs_asc" },
            { title: "评分↓", value: "r_desc" },
            { title: "评分↑", value: "r_asc" },
            { title: "播出时间↓", value: "date_desc" },
            { title: "播出时间↑", value: "date_asc" },
            { title: "投票数↓", value: "vote_desc" },
            { title: "投票数↑", value: "vote_asc" },
            { title: "默认排序", value: "d_desc" }
          ]
        },
        {
          name: "min_rating",
          title: "⭐最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "5.0分以上", value: "5.0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "9.0分以上", value: "9.0" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }

   ]
 };

const API_KEY = 'f3ae69ddca232b56265600eb919d46ab'; // TMDB API Key

// TMDB类型缓存
let tmdbGenresCache = null;

// 提取 TMDB 的种类信息
async function fetchTmdbGenres() {
  // 如果已有缓存，直接返回
  if (tmdbGenresCache) {
    return tmdbGenresCache;
  }
  
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      Widget.tmdb.get('/genre/movie/list', { params: { language: 'zh-CN', api_key: API_KEY } }),
      Widget.tmdb.get('/genre/tv/list', { params: { language: 'zh-CN', api_key: API_KEY } })
    ]);

    const genreData = {
      movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
      tv: tvGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {})
    };
    
    // 缓存结果
    tmdbGenresCache = genreData;
    return genreData;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return { movie: {}, tv: {} };
  }
}

// 获取TMDB类型标题（中文）
function getTmdbGenreTitles(genreIds, mediaType) {
  if (!Array.isArray(genreIds) || genreIds.length === 0) {
    return '';
  }
  
  // 如果没有缓存的类型数据，返回空字符串
  if (!tmdbGenresCache) {
    return '';
  }
  
  const genres = tmdbGenresCache[mediaType] || {};
  return genreIds
    .slice(0, 3) // 最多显示3个类型
    .map(id => genres[id])
    .filter(Boolean)
    .join('•');
}

// 格式化每个影视项目（优先中文）
function formatTmdbItem(item, genreMap) {
  // 优先选用中文标题（增强版）
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
  
  return {
    id: item.id,
    type: "tmdb",
    title: pickChineseTitle(
      item.title_zh,          // 中文标题
      item.name_zh,           // 中文剧集名
      item.original_title_zh, // 中文原始标题
      item.original_name_zh,  // 中文原始剧集名
      item.title,             // 标题
      item.name,              // 剧集名
      item.original_title,    // 原始标题
      item.original_name      // 原始剧集名
    ),
    description: pickChineseDescription(item.overview),
    releaseDate: item.release_date || item.first_air_date || "未知日期",
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
    coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
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

// 增强的TMDB数据拉取和处理系统（支持带标题横版海报）
async function loadTmdbTrendingData() {
    // 优先使用增强的实时数据处理（带横版海报）
    console.log("[数据源] 使用增强的实时TMDB API处理");
    return await generateEnhancedTrendingData();
    
    // 以下代码保留作为备用（如果需要预处理数据源）
    /*
    try {
        // 尝试从多个数据源获取预处理数据
        const dataSources = [
            "https://raw.githubusercontent.com/saxdyo/MovieListwidget/main/data/TMDB_Trending.json",
            "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/TMDB_Trending.json"
        ];
        
        for (const dataSource of dataSources) {
            try {
                const response = await Widget.http.get(dataSource, {
                    timeout: 5000,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'User-Agent': 'MovieListWidget/2.0'
                    }
                });
                
                if (response.data && response.data.today_global && response.data.today_global.length > 0) {
                    console.log(`[数据源] 成功获取预处理数据: ${dataSource}`);
                    // 验证数据完整性
                    if (validateTrendingData(response.data)) {
                        return response.data;
                    }
                }
            } catch (sourceError) {
                console.log(`[数据源] ${dataSource} 不可用: ${sourceError.message}`);
                continue;
            }
        }
        
        console.log("[数据源] 预处理数据不可用，使用实时TMDB API处理");
    } catch (error) {
        console.log("[数据源] 预处理数据获取失败，使用实时TMDB API处理");
    }
    
    // 使用增强的实时数据处理
    return await generateEnhancedTrendingData();
    */
}

// 验证热门数据完整性
function validateTrendingData(data) {
    try {
        const requiredFields = ['today_global', 'week_global_all', 'popular_movies'];
        return requiredFields.every(field => 
            data[field] && 
            Array.isArray(data[field]) && 
            data[field].length > 0 &&
            data[field].every(item => 
                item.id && 
                item.title && 
                item.poster_url && 
                item.title_backdrop
            )
        );
    } catch (error) {
        return false;
    }
}

// 增强的TMDB热门数据生成器（支持高质量横版海报和智能缓存）
async function generateEnhancedTrendingData() {
    // 智能缓存检查
    const now = Date.now();
    if (trendingDataCache && (now - trendingCacheTime) < TRENDING_CACHE_DURATION) {
        console.log("[增强数据] 使用缓存的热门数据");
        return trendingDataCache;
    }
    
    try {
        console.log("[增强数据] 开始生成高质量热门数据...");
        
        // 并行获取多个数据源（优先中文，增加更多数据源）
        const requests = [
            // 今日热门 (多地区数据)
            Widget.tmdb.get("/trending/all/day", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            // 本周热门
            Widget.tmdb.get("/trending/all/week", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            // 热门电影
            Widget.tmdb.get("/movie/popular", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            // 热门剧集
            Widget.tmdb.get("/tv/popular", { 
                params: { 
                    language: 'zh-CN',
                    region: 'CN', 
                    api_key: API_KEY 
                } 
            }),
            // 类型映射
            fetchTmdbGenres()
        ];
        
        const [todayTrending, weekTrending, popularMovies, popularTVShows, genreMap] = await Promise.all(requests);
        
        // 使用增强的处理函数
        const today_global = await processEnhancedMediaItems(todayTrending.results.slice(0, 20), genreMap);
        const week_global_all = await processEnhancedMediaItems(weekTrending.results.slice(0, 20), genreMap);
        const popular_movies = await processEnhancedMediaItems(popularMovies.results.slice(0, 15), genreMap, 'movie');
        const popular_tv_shows = await processEnhancedMediaItems(popularTVShows.results.slice(0, 15), genreMap, 'tv');
        
        const result = {
            today_global,
            week_global_all,
            popular_movies,
            popular_tv_shows,
            generated_at: new Date().toISOString(),
            data_quality: 'enhanced'
        };
        
        // 缓存结果
        trendingDataCache = result;
        trendingCacheTime = now;
        
        console.log(`[增强数据] 生成完成并缓存: 今日${today_global.length}个, 本周${week_global_all.length}个, 热门电影${popular_movies.length}个, 热门剧集${popular_tv_shows.length}个`);
        
        return result;
        
    } catch (error) {
        console.error("[增强数据] 生成失败:", error);
        
        // 降级到基础数据生成
        try {
            console.log("[增强数据] 尝试降级到基础数据生成...");
            return await generateBasicTrendingData();
        } catch (fallbackError) {
            console.error("[增强数据] 降级也失败:", fallbackError);
            
            // 如果有旧缓存，则返回旧缓存
            if (trendingDataCache) {
                console.log("[增强数据] 使用旧缓存数据");
                return trendingDataCache;
            }
            
            return { 
                today_global: [], 
                week_global_all: [], 
                popular_movies: [],
                popular_tv_shows: [],
                generated_at: new Date().toISOString(),
                data_quality: 'fallback'
            };
        }
    }
}

// 降级基础数据生成器
async function generateBasicTrendingData() {
    console.log("[基础数据] 使用基础数据生成模式...");
    
    const [todayTrending, weekTrending, popularMovies, genreMap] = await Promise.all([
        Widget.tmdb.get("/trending/all/day", { 
            params: { 
                language: 'zh-CN',
                api_key: API_KEY 
            } 
        }),
        Widget.tmdb.get("/trending/all/week", { 
            params: { 
                language: 'zh-CN',
                api_key: API_KEY 
            } 
        }),
        Widget.tmdb.get("/movie/popular", { 
            params: { 
                language: 'zh-CN',
                api_key: API_KEY 
            } 
        }),
        fetchTmdbGenres()
    ]);
    
    const today_global = await processMediaItems(todayTrending.results.slice(0, 15), genreMap);
    const week_global_all = await processMediaItems(weekTrending.results.slice(0, 15), genreMap);
    const popular_movies = await processMediaItems(popularMovies.results.slice(0, 12), genreMap, 'movie');
    
    return {
        today_global,
        week_global_all,
        popular_movies,
        generated_at: new Date().toISOString(),
        data_quality: 'basic'
    };
}

// 优先选择中文内容的辅助函数
function pickChineseContent(primaryCN, secondaryCN, primaryEN, secondaryEN, fallback = '') {
    // 优先级：中文主要 > 中文次要 > 英文主要 > 英文次要 > 备用
    if (primaryCN && /[\u4e00-\u9fa5]/.test(primaryCN)) return primaryCN;
    if (secondaryCN && /[\u4e00-\u9fa5]/.test(secondaryCN)) return secondaryCN;
    if (primaryEN && primaryEN.trim()) return primaryEN;
    if (secondaryEN && secondaryEN.trim()) return secondaryEN;
    return fallback;
}

// 增强的媒体项目处理器（支持多种尺寸横版海报和标题覆盖）
async function processEnhancedMediaItems(items, genreMap, forceType = null) {
    return items
        .filter(item => item.poster_path && item.backdrop_path && (item.title || item.name))
        .map(item => {
            const mediaType = forceType || item.media_type || (item.title ? 'movie' : 'tv');
            const releaseDate = item.release_date || item.first_air_date || '';
            const year = releaseDate ? releaseDate.substring(0, 4) : '';
            
            // 增强的中文标题选择
            const title = pickEnhancedChineseTitle(item);
            
            // 增强的中文简介处理
            const overview = processEnhancedOverview(item.overview);
            
            // 生成详细类型标签
            const genreTitle = generateEnhancedGenreTitle(item.genre_ids, mediaType, genreMap);
            
            // 生成多种尺寸的图片URL
            const imageUrls = generateEnhancedImageUrls(item);
            
            return {
                id: item.id,
                title: title,
                genreTitle: genreTitle,
                rating: parseFloat((item.vote_average || 0).toFixed(1)),
                overview: overview,
                release_date: releaseDate,
                year: year ? parseInt(year) : null,
                
                // 多种尺寸海报
                poster_url: imageUrls.poster_w500,
                poster_hd: imageUrls.poster_w780,
                
                // 多种尺寸横版海报（带标题效果）
                title_backdrop: imageUrls.backdrop_w1280,
                title_backdrop_hd: imageUrls.backdrop_original,
                backdrop_w780: imageUrls.backdrop_w780,
                
                // 附加信息
                type: mediaType,
                popularity: item.popularity || 0,
                vote_count: item.vote_count || 0,
                adult: item.adult || false,
                original_language: item.original_language || 'unknown'
            };
        });
}

// 增强的中文标题选择器
function pickEnhancedChineseTitle(item) {
    const candidates = [
        item.title,
        item.name,
        item.original_title,
        item.original_name
    ];
    
    // 优先选择包含中文的标题
    for (const candidate of candidates) {
        if (candidate && typeof candidate === 'string' && /[\u4e00-\u9fa5]/.test(candidate.trim())) {
            return candidate.trim();
        }
    }
    
    // 如果没有中文标题，选择最短的非空标题
    for (const candidate of candidates) {
        if (candidate && typeof candidate === 'string' && candidate.trim().length > 0) {
            return candidate.trim();
        }
    }
    
    return '未知标题';
}

// 增强的简介处理器
function processEnhancedOverview(overview) {
    if (!overview || typeof overview !== 'string') {
        return '暂无简介';
    }
    
    const trimmed = overview.trim();
    if (trimmed.length === 0) {
        return '暂无简介';
    }
    
    // 限制简介长度，避免过长
    if (trimmed.length > 200) {
        return trimmed.substring(0, 197) + '...';
    }
    
    return trimmed;
}

// 增强的类型标签生成器
function generateEnhancedGenreTitle(genreIds, mediaType, genreMap) {
    if (!Array.isArray(genreIds) || genreIds.length === 0 || !genreMap) {
        return mediaType === 'movie' ? '电影' : '剧集';
    }
    
    const genres = genreMap[mediaType] || {};
    const genreNames = genreIds
        .slice(0, 2) // 最多显示2个类型
        .map(id => genres[id])
        .filter(Boolean);
    
    if (genreNames.length > 0) {
        return genreNames.join('•');
    }
    
    return mediaType === 'movie' ? '电影' : '剧集';
}

// 增强的图片URL生成器
function generateEnhancedImageUrls(item) {
    const baseUrl = 'https://image.tmdb.org/t/p/';
    
    return {
        // 海报URL (多种尺寸)
        poster_w342: item.poster_path ? `${baseUrl}w342${item.poster_path}` : '',
        poster_w500: item.poster_path ? `${baseUrl}w500${item.poster_path}` : '',
        poster_w780: item.poster_path ? `${baseUrl}w780${item.poster_path}` : '',
        poster_original: item.poster_path ? `${baseUrl}original${item.poster_path}` : '',
        
        // 横版海报URL (多种尺寸，用于标题展示)
        backdrop_w300: item.backdrop_path ? `${baseUrl}w300${item.backdrop_path}` : '',
        backdrop_w780: item.backdrop_path ? `${baseUrl}w780${item.backdrop_path}` : '',
        backdrop_w1280: item.backdrop_path ? `${baseUrl}w1280${item.backdrop_path}` : '',
        backdrop_original: item.backdrop_path ? `${baseUrl}original${item.backdrop_path}` : ''
    };
}

// 处理媒体项目数据（优先中文）- 保留原函数作为降级选项
async function processMediaItems(items, genreMap, forceType = null) {
    return items
        .filter(item => item.poster_path && item.backdrop_path && (item.title || item.name))
        .map(item => {
            const mediaType = forceType || item.media_type || (item.title ? 'movie' : 'tv');
            const releaseDate = item.release_date || item.first_air_date || '';
            const year = releaseDate ? releaseDate.substring(0, 4) : '';
            
            // 优先使用中文标题
            const title = pickChineseContent(
                item.title,           // 主要标题
                item.name,            // 剧集名称
                item.original_title,  // 原始标题
                item.original_name,   // 原始名称
                '未知标题'
            );
            
            // 优先使用中文简介
            const overview = item.overview && item.overview.trim() ? 
                item.overview : '暂无简介';
            
            // 生成类型标签（中文）
            const genreTitle = item.genre_ids ? 
                getTmdbGenreTitles(item.genre_ids.slice(0, 2), mediaType) : '';
            
            return {
                id: item.id,
                title: title,
                genreTitle: genreTitle,
                rating: item.vote_average || 0,
                overview: overview,
                release_date: releaseDate,
                year: year ? parseInt(year) : null,
                poster_url: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                // 使用backdrop作为横版海报（虽然没有标题，但是高质量的横版图）
                title_backdrop: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
                type: mediaType
            };
        });
}

// 获取今日热门影视（增强版横版海报支持）
async function loadTodayGlobalMedia(params = {}) {
  const { language = "zh-CN" } = params;
  try {
    const data = await loadTmdbTrendingData();
    if (data && data.today_global && data.today_global.length > 0) {
        return data.today_global.map(item => createEnhancedWidgetItem(item));
    } else {
        // 备用方案：使用标准TMDB API（优先中文）
        console.log("[备用方案] 使用标准TMDB API获取今日热门");
        const res = await Widget.tmdb.get("/trending/all/day", { 
            params: { 
                language: 'zh-CN',
                region: 'CN',
                api_key: API_KEY 
            }
        });
        const genreMap = await fetchTmdbGenres();
        return res.results
            .map(item => formatTmdbItem(item, genreMap))
            .filter(item => item.posterPath);
    }
  } catch (error) {
    console.error("Error fetching trending media:", error);
    return [];
  }
}

// 增强的小组件项目创建器（支持高质量横版海报）
function createEnhancedWidgetItem(item) {
    const result = {
        id: item.id.toString(),
        type: "tmdb",
        title: item.title,
        genreTitle: item.genreTitle,
        rating: item.rating,
        description: item.overview,
        releaseDate: item.release_date,
        
        // 标准海报
        posterPath: item.poster_url,
        coverUrl: item.poster_url,
        
        // 增强的横版海报（带标题效果）
        backdropPath: item.title_backdrop, // 主要横版海报
        backdropHD: item.title_backdrop_hd, // 高清横版海报
        backdrop780: item.backdrop_w780, // 中等尺寸横版海报
        
        // 高清海报
        posterHD: item.poster_hd,
        
        // 媒体信息
        mediaType: item.type,
        popularity: item.popularity,
        voteCount: item.vote_count,
        originalLanguage: item.original_language,
        
        // 小组件标准字段
        link: null,
        duration: 0,
        durationText: "",
        episode: 0,
        childItems: []
    };
    
    // 调试信息
    console.log(`[增强项目] ${result.title} - 横版海报: ${result.backdropPath ? '✅' : '❌'}`);
    
    return result;
}

// 获取本周热门影视（增强版横版海报支持）
async function loadWeekGlobalMovies(params = {}) {
  const { language = "zh-CN" } = params;
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
            .filter(item => item.posterPath);
    }
  } catch (error) {
    console.error("Error fetching weekly global movies:", error);
    return [];
  }
}

// 获取热门电影（增强版横版海报支持）
async function tmdbPopularMovies(params = {}) {
  const { language = "zh-CN", page = 1, sort_by = "popularity.desc" } = params;
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
      return res.results.map(item => formatTmdbItem(item, genreMap));
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
      return res.results.map(item => formatTmdbItem(item, genreMap));
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
        .filter(item => item.posterPath); // 高分内容 top_rated
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
    return res.results.map(item => formatTmdbItem(item, genreMap));
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
        const formattedItem = formatTmdbItem(item, genreMap);
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
        const formattedItem = formatTmdbItem(item, genreMap);
        // 添加剧集特殊标识
        formattedItem.type = "tmdb-tv";
        formattedItem.source = "TMDB热门剧集";
        formattedItem.contentType = "TV剧集";
        return formattedItem;
      })
      .filter(item => {
        // 过滤掉无海报
        if (!item.posterPath) return false;
        // 过滤掉综艺（真人秀、脱口秀、访谈、节目等）和纪录片、新闻
        const varietyGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻'];
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
        const formattedItem = formatTmdbItem(item, genreMap);
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
        // 过滤掉综艺（真人秀、脱口秀、访谈、节目等）和纪录片、新闻
        const varietyGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻'];
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
        const varietyGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
        if (item.genre_ids && item.genre_ids.some(id => varietyGenreIds.includes(id))) return false;
        const lowerTitle = (item.title || '').toLowerCase();
        const lowerDesc = (item.description || '').toLowerCase();
        const showKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻'];
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

// --- IMDb-v2 系统函数 ---

// 构建图片 URL
function buildImageUrl(baseUrl, path) {
    if (!path || typeof path !== 'string') { return null; }
    if (path.startsWith('http://') || path.startsWith('https://')) { return path; }
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return baseUrl + cleanPath;
}

// 处理枚举选项
function processEnumOptions(options, allValue = "all", allTitle = "全部", allLast = false) {
    let processed = [...options];
    const allIndex = processed.findIndex(opt => opt.value === allValue);
    let allItem = null;
    if (allIndex > -1) {
       allItem = processed.splice(allIndex, 1)[0];
       allItem.title = allTitle; 
    } else {
       allItem = { title: allTitle, value: allValue };
    }
    // 年份降序，其他按中文拼音升序
    if(options.length > 0 && options.some(opt => /^\d{4}$/.test(opt.value))){
        processed.sort((a, b) => parseInt(b.value) - parseInt(a.value)); 
    } else {
        processed.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
    }
    if (allLast) {
        processed.push(allItem);
    } else {
        processed.unshift(allItem);
    }
    return processed;
}

// --- IMDb-v2 数据获取配置 ---
const GITHUB_OWNER = "opix-maker";
const GITHUB_REPO = "Forward";
const GITHUB_BRANCH = "main";
const BASE_DATA_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/imdb-data-platform/dist`;
const IMG_BASE_POSTER = 'https://image.tmdb.org/t/p/w500';
const IMG_BASE_BACKDROP = 'https://image.tmdb.org/t/p/w780'; 
const ITEMS_PER_PAGE = 30; 
const DEBUG_LOG = true;

// --- 缓存 ---
let cachedData = {}; // 用于缓存单个分页文件的请求结果
let trendingDataCache = null; // 缓存热门数据
let trendingCacheTime = 0; // 缓存时间戳
const TRENDING_CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存

// 缓存清除器，用于绕过 GitHub CDN 缓存
function getCacheBuster() {
    return Math.floor(Date.now() / (1000 * 60 * 30)); // 30 分钟更新一次
}

// 强制清除Widget缓存（调试用）
if (typeof trendingDataCache !== 'undefined') {
    trendingDataCache = null;
    trendingCacheTime = 0;
    console.log("[调试] 已清除缓存，将使用最新数据");
}

// 获取预先分页的数据
async function fetchPagedData(shardPath) {
    if (!shardPath || typeof shardPath !== 'string' || !shardPath.endsWith('.json')) {
       console.error(`[IMDb-v2 ERROR] 无效的分片路径: ${shardPath}`);
       return [];
    }

    // 构建完整 URL
    const rawUrl = `${BASE_DATA_URL}/${shardPath}?cache_buster=${getCacheBuster()}`;
    const encodedUrl = encodeURI(rawUrl); // 编码 URL

    // 检查内存缓存
    if (cachedData[encodedUrl]) { 
        if(DEBUG_LOG) console.log(`[IMDb-v2 DEBUG] 内存缓存命中: ${shardPath}`);
        return cachedData[encodedUrl]; 
    }

    if(DEBUG_LOG) console.log(`[IMDb-v2 DEBUG] 正在获取分页数据: ${encodedUrl}`);
    let response;
    try {
        // 发起网络请求，超时时间可以短一些，因为文件很小
        response = await Widget.http.get(encodedUrl, { timeout: 15000, headers: {'User-Agent': 'ForwardWidget/IMDb-v2'} }); 
    } catch (e) { 
        console.error(`[IMDb-v2 ERROR] 网络请求失败 ${encodedUrl}: ${e.message}`); 
        // 如果是 404 错误，可能是页码超出范围，返回空
        if (e.message.includes('404')) {
            if(DEBUG_LOG) console.log(`[IMDb-v2 INFO] 数据未找到 (404)，可能页码超出范围: ${encodedUrl}`);
            return [];
        }
        throw new Error(`网络请求失败: ${e.message || '未知网络错误'}`);
    }

    // 检查响应状态
    if (!response || response.statusCode !== 200 || !response.data ) {
       // 404 是正常的，表示该页不存在
       if (response && response.statusCode === 404) {
           if(DEBUG_LOG) console.log(`[IMDb-v2 INFO] 数据未找到 (404)，可能页码超出范围: ${encodedUrl}`);
           return [];
       }
       console.error(`[IMDb-v2 ERROR] 获取数据响应异常. Status: ${response ? response.statusCode : 'N/A'}, URL: ${encodedUrl}`);
       throw new Error(`获取数据失败 (Status: ${response ? response.statusCode : 'N/A'})`);
    }

    // 解析数据并缓存
    const data = Array.isArray(response.data) ? response.data : [];
    cachedData[encodedUrl] = data;
    return data;
}

// 将数据源格式映射为小组件格式
function mapToWidgetItem(item) {
    // 数据源字段：id, t(title), p(poster), b(backdrop), r(rating), y(year), rd(release_date), mt(mediaType), o(overview)
    if (!item || typeof item.id === 'undefined' || item.id === null) return null;
    
    let mediaType = item.mt;
    // 客户端通常只需要 movie 或 tv
    if (mediaType === 'anime' || mediaType === 'tv') {
         mediaType = 'tv'; // 将 anime 和 tv 都映射为 tv 类型
    } else {
        mediaType = 'movie'; // 其他都映射为 movie
    }

    const posterUrl = buildImageUrl(IMG_BASE_POSTER, item.p);
    
    // 优先使用 rd (完整日期), 否则使用 y (年份) + 01-01
    const finalReleaseDate = item.rd ? item.rd : (item.y ? `${String(item.y)}-01-01` : '');

    const widgetItem = {
        id: String(item.id), 
        type: "tmdb", 
        title: item.t || '未知标题',
        posterPath: posterUrl, 
        backdropPath: buildImageUrl(IMG_BASE_BACKDROP, item.b), 
        coverUrl: posterUrl, 
        releaseDate: finalReleaseDate, 
        mediaType: mediaType, 
        rating: typeof item.r === 'number' ? item.r.toFixed(1) : '0.0', 
        description: item.o || '', 
        link: null, genreTitle: "", duration: 0, durationText: "", episode: 0, childItems: []                         
    };
     return widgetItem;
}

// 处理数据 映射
function processData(data) {
     if(!Array.isArray(data) || data.length === 0) return [];
     return data.map(mapToWidgetItem).filter(Boolean); 
}

// 获取和解析排序和页码参数
function getSortAndPage(params) {
    // 支持两种参数名：sort_by (新模块) 和 sort (兼容)
    const sortKeyRaw = params.sort_by || params.sort || 'd_desc';
    let sortKey = 'd'; // 默认排序键
    
    // 解析排序键，支持更多排序选项
    if (typeof sortKeyRaw === 'string') {
        // 处理各种排序格式
        if (sortKeyRaw.includes('_desc') || sortKeyRaw.includes('_asc')) {
            // 格式: hs_desc, r_asc, date_desc, vote_asc 等
            sortKey = sortKeyRaw.split('_')[0];
        } else if (sortKeyRaw === 'random') {
            sortKey = 'random';
        } else {
            // 兼容旧格式
            sortKey = sortKeyRaw;
        }
        
        // 映射特殊排序键
        const sortKeyMap = {
            'hs': 'hs',      // 热度
            'r': 'r',        // 评分
            'd': 'd',        // 默认
            'date': 'd',     // 播出时间映射到默认
            'vote': 'r',     // 投票数映射到评分
            'random': 'hs'   // 随机排序映射到热度（数据源限制）
        };
        
        sortKey = sortKeyMap[sortKey] || 'd';
    }
    
    // 提取页码
    const page = Math.max(1, parseInt(params.page || "1", 10));
    return { sortKey, page };
}

// 构建最终的分页文件路径
function buildPagedPath(basePath, sortKey, page) {
     // 替换路径中的冒号 (如 country:cn -> country_cn)
     const cleanBasePath = String(basePath).replace(':', '_');
     return `${cleanBasePath}/by_${sortKey}/page_${page}.json`;
}

// 通用请求处理函数 负责构建路径、获取数据、处理分页
async function fetchAndProcess(basePath, params) {
    const { sortKey, page } = getSortAndPage(params);
    const fullPath = buildPagedPath(basePath, sortKey, page);
    
    if(DEBUG_LOG) console.log(`[IMDb-v2 DEBUG] 请求参数: Path=${fullPath}, Sort=${sortKey}, Page=${page}`);

    try {
        // 获取数据
        const data = await fetchPagedData(fullPath);
        // 映射为小组件格式
        const items = processData(data);
        if (items.length === ITEMS_PER_PAGE) {
             params.nextPageParams = { ...params, page: String(page + 1) };
        } else {
             params.nextPageParams = null; // 没有下一页了
        }
        
        return items;
    } catch(e) {
        console.error(`[IMDb-v2 ERROR] 处理请求时出错 "${fullPath}":`, e.message || e, e.stack);
        throw new Error(`加载数据失败: ${e.message || '未知错误'}`);
    }
}

// ✨ 动画 - 按地区筛选的动画内容 (路径格式: anime/{region})
async function listAnime(params) { 
    const region = params.region || 'all';
    const minRating = parseFloat(params.min_rating) || 0;
    const basePath = `anime/${region.replace(':', '_')}`;
    
    try {
        // 获取基础数据
        const items = await fetchAndProcess(basePath, params);
        
        // 如果设置了最低评分要求，进行过滤
        if (minRating > 0) {
            const filteredItems = items.filter(item => {
                const rating = parseFloat(item.rating) || 0;
                return rating >= minRating;
            });
            
            if(DEBUG_LOG) {
                console.log(`[IMDb-v2 DEBUG] 动画评分过滤: 原始${items.length}项 -> 过滤后${filteredItems.length}项 (最低评分: ${minRating})`);
            }
            
            return filteredItems;
        }
        
        return items;
    } catch (error) {
        console.error(`[IMDb-v2 ERROR] 动画模块处理出错:`, error);
        throw error;
    }
}

// ===============TMDB横版海报工具集===============

// 智能横版海报生成器 - 根据内容类型和设备自动选择最佳尺寸
function createSmartBackdropUrl(item, preferredSize = 'auto') {
    if (!item.backdrop_path) return '';
    
    const baseUrl = 'https://image.tmdb.org/t/p/';
    const sizes = {
        'small': 'w300',
        'medium': 'w780', 
        'large': 'w1280',
        'original': 'original'
    };
    
    // 自动选择最佳尺寸
    if (preferredSize === 'auto') {
        // 根据屏幕尺寸智能选择
        const screenWidth = typeof window !== 'undefined' ? window.screen.width : 1920;
        if (screenWidth <= 480) preferredSize = 'small';
        else if (screenWidth <= 1024) preferredSize = 'medium';
        else if (screenWidth <= 1920) preferredSize = 'large';
        else preferredSize = 'original';
    }
    
    return `${baseUrl}${sizes[preferredSize] || sizes.large}${item.backdrop_path}`;
}

// 横版海报标题叠加器 - 为横版海报添加标题叠加效果（CSS）
function generateBackdropWithTitleOverlay(item, options = {}) {
    const {
        titlePosition = 'bottom-left',
        titleColor = '#ffffff',
        backgroundColor = 'rgba(0, 0, 0, 0.6)',
        fontSize = '24px',
        fontWeight = 'bold'
    } = options;
    
    const backdropUrl = createSmartBackdropUrl(item, options.size);
    
    return {
        backdropUrl,
        titleOverlay: {
            title: item.title || '未知标题',
            position: titlePosition,
            style: {
                color: titleColor,
                backgroundColor: backgroundColor,
                fontSize: fontSize,
                fontWeight: fontWeight,
                padding: '12px 16px',
                borderRadius: '8px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }
        },
        cssClasses: ['backdrop-with-title', `title-${titlePosition}`]
    };
}

// 批量横版海报处理器
async function batchProcessBackdrops(items, options = {}) {
    const {
        enableTitleOverlay = true,
        preferredSize = 'auto',
        includeMetadata = true
    } = options;
    
    return items.map(item => {
        const result = {
            id: item.id,
            backdropUrl: createSmartBackdropUrl(item, preferredSize)
        };
        
        if (enableTitleOverlay) {
            const overlay = generateBackdropWithTitleOverlay(item, options);
            result.titleOverlay = overlay.titleOverlay;
            result.cssClasses = overlay.cssClasses;
        }
        
        if (includeMetadata) {
            result.metadata = {
                title: item.title,
                year: item.year,
                rating: item.rating,
                mediaType: item.type
            };
        }
        
        return result;
    });
}

// 横版海报缓存管理器
const backdropCache = new Map();
const BACKDROP_CACHE_SIZE = 100;

function cacheBackdrop(key, data) {
    if (backdropCache.size >= BACKDROP_CACHE_SIZE) {
        // 删除最老的缓存项
        const firstKey = backdropCache.keys().next().value;
        backdropCache.delete(firstKey);
    }
    backdropCache.set(key, {
        data,
        timestamp: Date.now()
    });
}

function getCachedBackdrop(key, maxAge = 30 * 60 * 1000) { // 30分钟
    const cached = backdropCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < maxAge) {
        return cached.data;
    }
    return null;
}

// 横版海报质量优化器
function optimizeBackdropQuality(items) {
    return items
        .filter(item => item.backdrop_path) // 只保留有横版海报的项目
        .sort((a, b) => {
            // 按人气和评分排序，确保高质量内容优先
            const scoreA = (a.popularity || 0) * 0.6 + (a.rating || 0) * 0.4;
            const scoreB = (b.popularity || 0) * 0.6 + (b.rating || 0) * 0.4;
            return scoreB - scoreA;
        })
        .map(item => ({
            ...item,
            backdropQuality: calculateBackdropQuality(item)
        }));
}

// 横版海报质量评估器
function calculateBackdropQuality(item) {
    let score = 0;
    
    // 基础分数
    if (item.backdrop_path) score += 30;
    
    // 内容质量
    if (item.rating >= 7) score += 20;
    else if (item.rating >= 6) score += 10;
    
    // 人气度
    if (item.popularity >= 100) score += 20;
    else if (item.popularity >= 50) score += 10;
    
    // 投票数
    if (item.vote_count >= 1000) score += 15;
    else if (item.vote_count >= 100) score += 8;
    
    // 标题质量
    if (item.title && /[\u4e00-\u9fa5]/.test(item.title)) score += 10; // 中文标题
    if (item.title && item.title.length > 0 && item.title.length <= 20) score += 5; // 合适长度
    
    return Math.min(score, 100); // 最高100分
}

console.log("[IMDb-v2] ✨ 动画模块加载成功.");
console.log("[优化] 所有TMDB模块已优化为中文优先显示");
console.log("[增强] TMDB横版海报工具集已加载");

// 脚本加载完成，初始化错误处理
console.log("[系统] 影视榜单脚本加载完成，所有模块已就绪");


