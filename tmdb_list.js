WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "影视榜单",
  description: "影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "1.1.0",
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
      ]
    },
    {
      title: "TMDB 本周热门",
      description: "本周热门电影与剧集",
      requiresWebView: false,
      functionName: "loadWeekGlobalMovies",
      cacheDuration: 60,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
        { name: "page", title: "页码", type: "page" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
        { name: "page", title: "页码", type: "page" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
        {
          name: "type",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要查看的内容类型",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        {
          name: "with_genres",
          title: "🎬主题类型",
          type: "enumeration",
          description: "选择主题类型进行筛选",
          value: "",
          enumOptions: [
            { title: "全部主题", value: "" },
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
          name: "with_origin_country",
          title: "🌍地区筛选",
          type: "enumeration",
          description: "按制片地区筛选内容",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "美国", value: "US" },
            { title: "中国", value: "CN" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" },
            { title: "英国", value: "GB" },
            { title: "法国", value: "FR" },
            { title: "德国", value: "DE" },
            { title: "意大利", value: "IT" },
            { title: "西班牙", value: "ES" },
            { title: "俄罗斯", value: "RU" },
            { title: "印度", value: "IN" },
            { title: "泰国", value: "TH" },
            { title: "加拿大", value: "CA" },
            { title: "澳大利亚", value: "AU" },
            { title: "墨西哥", value: "MX" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "vote_average.desc",
          enumOptions: [
            { title: "IMDB评分↓", value: "vote_average.desc" },
            { title: "IMDB评分↑", value: "vote_average.asc" },
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "上映日期↑", value: "release_date.asc" },
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
          description: "设置IMDB最低评分要求",
          value: "7.0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "9.0分以上", value: "9.0" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
      ]
    },
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
          name: "season_year",
          title: "📅年份",
          type: "enumeration",
          description: "选择新番年份",
          value: "2024",
          enumOptions: [
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" }
          ]
        },
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "with_release_type",
          title: "📅上映状态",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "已上映", value: "3|2|1" },
            { title: "未上映", value: "4|5|6" }
          ]
        }
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
        { name: "url", title: "🔗 片单地址", type: "input", description: "支持格式:桌面/移动端豆列、官方榜单、App dispatch" },
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
        { name: "url", title: "🔗 列表地址", type: "constant", value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/movie_real_time_hotest/&dt_dapp=1" },
        { name: "type", title: "🎭 类型", type: "constant", value: "movie" }
      ]
    }
  ]
};

const API_KEY = 'f3ae69ddca232b56265600eb919d46ab';

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

function formatTmdbItem(item, genreMap) {
  if (!item.poster_path) return null;
  return {
    id: item.id,
    type: "tmdb",
    title: item.title || item.name,
    description: item.overview || "暂无简介",
    releaseDate: item.release_date || item.first_air_date || "未知日期",
    posterPath: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
    backdropPath: item.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
      : "",
    rating: item.vote_average || "无评分",
    mediaType: item.media_type || (item.title ? "movie" : "tv"),
    genreTitle: genreMap[item.genre_ids?.[0]] || "未知类型"
  };
}

/* ---------- 以下为各业务函数，已统一注入 with_release_type ---------- */
async function loadTodayGlobalMedia(params = {}) {
  const { language = "zh-CN", with_release_type } = params;
  try {
    const res = await Widget.tmdb.get("/trending/all/day", {
      params: { language, api_key: API_KEY, with_release_type }
    });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => formatTmdbItem(i, genreMap.movie)).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function loadWeekGlobalMovies(params = {}) {
  const { language = "zh-CN", with_release_type } = params;
  try {
    const res = await Widget.tmdb.get("/trending/all/week", {
      params: { language, api_key: API_KEY, with_release_type }
    });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => formatTmdbItem(i, genreMap.movie)).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function tmdbPopularMovies(params = {}) {
  const { language = "zh-CN", page = 1, sort_by = "popularity.desc", with_release_type } = params;
  try {
    const query = { language, page, with_release_type, api_key: API_KEY };
    let res;
    if (sort_by.startsWith("popularity")) {
      res = await Widget.tmdb.get("/movie/popular", { params: query });
    } else {
      res = await Widget.tmdb.get("/discover/movie", { params: { ...query, sort_by } });
    }
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => formatTmdbItem(i, genreMap.movie)).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function tmdbTopRated(params = {}) {
  const { language = "zh-CN", page = 1, type = "movie", sort_by = "vote_average.desc", with_release_type } = params;
  try {
    const query = { language, page, with_release_type, api_key: API_KEY };
    let res;
    if (sort_by.startsWith("vote_average")) {
      const api = type === "movie" ? "/movie/top_rated" : "/tv/top_rated";
      res = await Widget.tmdb.get(api, { params: query });
    } else {
      const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
      res = await Widget.tmdb.get(endpoint, { params: { ...query, sort_by } });
    }
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => formatTmdbItem(i, genreMap[type])).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function tmdbDiscoverByNetwork(params = {}) {
  const { language = "zh-CN", page = 1, with_networks, sort_by = "popularity.desc", with_release_type } = params;
  try {
    const res = await Widget.tmdb.get("/discover/tv", {
      params: { language, page, with_networks, sort_by, with_release_type, api_key: API_KEY }
    });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => formatTmdbItem(i, genreMap.tv)).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function tmdbDiscoverByCompany(params = {}) {
  const { language = "zh-CN", page = 1, with_companies, type = "movie", with_genres, sort_by = "popularity.desc", with_release_type } = params;
  try {
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    const query = { language, page, sort_by, with_release_type, api_key: API_KEY };
    if (with_companies) query.with_companies = with_companies;
    if (with_genres) query.with_genres = with_genres;
    const res = await Widget.tmdb.get(endpoint, { params: query });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => formatTmdbItem(i, genreMap[type])).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function imdbPopularContent(params = {}) {
  const {
    language = "zh-CN",
    page = 1,
    type = "movie",
    with_genres,
    with_origin_country,
    sort_by = "vote_average.desc",
    vote_average_gte = "7.0",
    with_release_type
  } = params;
  try {
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    const query = {
      language,
      page,
      sort_by,
      with_release_type,
      api_key: API_KEY,
      vote_count_gte: 100,
      with_watch_monetization_types: "flatrate|free|ads|rent|buy"
    };
    if (vote_average_gte && vote_average_gte !== "0") query.vote_average_gte = vote_average_gte;
    if (with_genres) query.with_genres = with_genres;
    if (with_origin_country) query.with_origin_country = with_origin_country;
    const res = await Widget.tmdb.get(endpoint, { params: query });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => {
      const f = formatTmdbItem(i, genreMap[type]);
      if (f) { f.type = "imdb"; f.source = "IMDB高分精选"; }
      return f;
    }).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function bangumiHotNewAnime(params = {}) {
  const {
    language = "zh-CN",
    page = 1,
    season_year = "2024",
    with_origin_country = "JP",
    sort_by = "popularity.desc",
    vote_average_gte = "6.0",
    with_release_type
  } = params;
  try {
    const query = {
      language,
      page,
      sort_by,
      with_release_type,
      api_key: API_KEY,
      with_genres: "16",
      first_air_date_year: season_year,
      vote_count_gte: 10
    };
    if (with_origin_country) query.with_origin_country = with_origin_country;
    if (vote_average_gte && vote_average_gte !== "0") query.vote_average_gte = vote_average_gte;
    const res = await Widget.tmdb.get("/discover/tv", { params: query });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => {
      const f = formatTmdbItem(i, genreMap.tv);
      if (f) {
        f.type = "bangumi-new";
        f.source = `Bangumi ${season_year}年新番`;
        f.seasonYear = season_year;
        f.isNewAnime = true;
      }
      return f;
    }).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function bangumiRankingList(params = {}) {
  const {
    language = "zh-CN",
    page = 1,
    ranking_type = "top_rated",
    with_origin_country = "JP",
    vote_average_gte = "7.0",
    with_release_type
  } = params;
  try {
    const query = { language, page, with_release_type, api_key: API_KEY, with_genres: "16" };
    switch (ranking_type) {
      case "top_rated":
        query.sort_by = "vote_average.desc";
        query.vote_count_gte = 100;
        query.vote_average_gte = vote_average_gte || "7.5";
        break;
      case "popular":
        query.sort_by = "popularity.desc";
        query.vote_count_gte = 50;
        query.vote_average_gte = vote_average_gte || "6.0";
        break;
      case "recent":
        query.sort_by = "first_air_date.desc";
        query.first_air_date_gte = "2023-01-01";
        query.vote_count_gte = 20;
        query.vote_average_gte = vote_average_gte || "6.0";
        break;
      case "classic":
        query.sort_by = "vote_average.desc";
        query.first_air_date_lte = "2022-12-31";
        query.vote_count_gte = 200;
        query.vote_average_gte = vote_average_gte || "8.0";
        break;
      default:
        query.sort_by = "vote_average.desc";
        query.vote_count_gte = 50;
    }
    if (with_origin_country) query.with_origin_country = with_origin_country;
    const res = await Widget.tmdb.get("/discover/tv", { params: query });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => {
      const f = formatTmdbItem(i, genreMap.tv);
      if (f) {
        f.type = "bangumi-ranking";
        f.source = `Bangumi${getRankingTypeName(ranking_type)}`;
        f.rankingType = ranking_type;
      }
      return f;
    }).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function tmdbPopularTVShows(params = {}) {
  const {
    language = "zh-CN",
    page = 1,
    with_origin_country,
    with_genres,
    sort_by = "popularity.desc",
    vote_average_gte = "0",
    with_release_type
  } = params;
  try {
    const query = {
      language,
      page,
      sort_by,
      with_release_type,
      api_key: API_KEY,
      vote_count_gte: 50
    };
    if (with_origin_country) query.with_origin_country = with_origin_country;
    if (with_genres) query.with_genres = with_genres;
    if (vote_average_gte && vote_average_gte !== "0") query.vote_average_gte = vote_average_gte;
    const res = await Widget.tmdb.get("/discover/tv", { params: query });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => {
      const f = formatTmdbItem(i, genreMap.tv);
      if (f) {
        f.type = "tmdb-tv";
        f.source = "TMDB热门剧集";
        f.contentType = "TV剧集";
      }
      return f;
    }).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

async function tmdbTVShowsByTime(params = {}) {
  const {
    language = "zh-CN",
    page = 1,
    time_period = "current_year",
    with_origin_country,
    with_genres,
    sort_by = "first_air_date.desc",
    vote_average_gte = "0",
    with_release_type
  } = params;
  try {
    const dateRange = getTimePeriodDateRange(time_period);
    const query = {
      language,
      page,
      sort_by,
      with_release_type,
      api_key: API_KEY,
      vote_count_gte: 20
    };
    if (dateRange.start) query.first_air_date_gte = dateRange.start;
    if (dateRange.end) query.first_air_date_lte = dateRange.end;
    if (with_origin_country) query.with_origin_country = with_origin_country;
    if (with_genres) query.with_genres = with_genres;
    if (vote_average_gte && vote_average_gte !== "0") query.vote_average_gte = vote_average_gte;
    const res = await Widget.tmdb.get("/discover/tv", { params: query });
    const genreMap = await fetchTmdbGenres();
    return res.results.map(i => {
      const f = formatTmdbItem(i, genreMap.tv);
      if (f) {
        f.type = "tmdb-tv-time";
        f.source = `TMDB ${getTimePeriodName(time_period)}剧集`;
        f.timePeriod = time_period;
        f.contentType = "时间榜剧集";
      }
      return f;
    }).filter(Boolean);
  } catch (e) { console.error(e); return []; }
}

function getRankingTypeName(ranking_type) {
  const nameMap = {
    top_rated: "评分排行榜",
    popular: "热门排行榜",
    recent: "新番排行榜",
    classic: "经典排行榜"
  };
  return nameMap[ranking_type] || "排行榜";
}

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
