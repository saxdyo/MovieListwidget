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
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "IMDB 年度精选",
      description: "按年份和地区筛选IMDB高分内容",
      requiresWebView: false,
      functionName: "imdbYearlySelection",
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
          name: "primary_release_year",
          title: "📅年份筛选",
          type: "enumeration",
          description: "选择上映/播出年份",
          value: "2024",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" },
            { title: "2021年", value: "2021" },
            { title: "2020年", value: "2020" },
            { title: "2019年", value: "2019" },
            { title: "2018年", value: "2018" },
            { title: "2017年", value: "2017" },
            { title: "2016年", value: "2016" },
            { title: "2015年", value: "2015" }
          ]
        },
        {
          name: "with_origin_country",
          title: "🌍制片地区",
          type: "enumeration",
          description: "按制片地区筛选",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "美国", value: "US" },
            { title: "中国大陆", value: "CN" },
            { title: "香港", value: "HK" },
            { title: "台湾", value: "TW" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" },
            { title: "英国", value: "GB" },
            { title: "法国", value: "FR" },
            { title: "德国", value: "DE" },
            { title: "北欧", value: "SE,NO,DK,FI" },
            { title: "印度", value: "IN" },
            { title: "泰国", value: "TH" }
          ]
        },
        {
          name: "with_genres",
          title: "🎬主题筛选",
          type: "enumeration",
          description: "选择主题类型",
          value: "",
          enumOptions: [
            { title: "全部主题", value: "" },
            { title: "剧情", value: "18" },
            { title: "动作", value: "28" },
            { title: "喜剧", value: "35" },
            { title: "惊悚", value: "53" },
            { title: "科幻", value: "878" },
            { title: "犯罪", value: "80" },
            { title: "爱情", value: "10749" },
            { title: "恐怖", value: "27" },
            { title: "悬疑", value: "9648" },
            { title: "动画", value: "16" }
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
            { title: "热门度↓", value: "popularity.desc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "首播日期↓", value: "first_air_date.desc" },
            { title: "投票数↓", value: "vote_count.desc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "⭐最低评分",
          type: "enumeration",
          description: "设置最低IMDB评分",
          value: "6.5",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "6.5分以上", value: "6.5" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
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
    // -------------豆瓣片单模块（优化版）-------------
    // 1. 豆瓣综合榜单
    {
      title: "豆瓣综合榜单",
      description: "豆瓣电影电视剧综合榜单，支持多维度筛选",
      requiresWebView: false,
      functionName: "loadDoubanComprehensiveList",
      cacheDuration: 3600,
      params: [
        {
          name: "content_type",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要查看的内容类型",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "电视剧", value: "tv" },
            { title: "综艺", value: "variety" },
            { title: "纪录片", value: "documentary" },
            { title: "动画", value: "animation" },
            { title: "全部", value: "all" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "rating_desc",
          enumOptions: [
            { title: "豆瓣评分↓", value: "rating_desc" },
            { title: "豆瓣评分↑", value: "rating_asc" },
            { title: "上映时间↓", value: "release_date_desc" },
            { title: "上映时间↑", value: "release_date_asc" },
            { title: "热度↓", value: "popularity_desc" },
            { title: "热度↑", value: "popularity_asc" },
            { title: "评价人数↓", value: "vote_count_desc" },
            { title: "评价人数↑", value: "vote_count_asc" },
            { title: "片长↓", value: "duration_desc" },
            { title: "片长↑", value: "duration_asc" }
          ]
        },
        {
          name: "region",
          title: "🌍地区筛选",
          type: "enumeration",
          description: "按制作地区筛选内容",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "中国大陆", value: "mainland_china" },
            { title: "香港", value: "hong_kong" },
            { title: "台湾", value: "taiwan" },
            { title: "美国", value: "usa" },
            { title: "日本", value: "japan" },
            { title: "韩国", value: "korea" },
            { title: "英国", value: "uk" },
            { title: "法国", value: "france" },
            { title: "德国", value: "germany" },
            { title: "意大利", value: "italy" },
            { title: "西班牙", value: "spain" },
            { title: "俄罗斯", value: "russia" },
            { title: "印度", value: "india" },
            { title: "泰国", value: "thailand" },
            { title: "其他亚洲", value: "other_asia" },
            { title: "其他欧洲", value: "other_europe" }
          ]
        },
        {
          name: "genre",
          title: "🎬题材类型",
          type: "enumeration",
          description: "按题材类型筛选",
          value: "",
          enumOptions: [
            { title: "全部题材", value: "" },
            { title: "剧情", value: "drama" },
            { title: "喜剧", value: "comedy" },
            { title: "动作", value: "action" },
            { title: "爱情", value: "romance" },
            { title: "科幻", value: "sci_fi" },
            { title: "悬疑", value: "mystery" },
            { title: "惊悚", value: "thriller" },
            { title: "恐怖", value: "horror" },
            { title: "犯罪", value: "crime" },
            { title: "战争", value: "war" },
            { title: "冒险", value: "adventure" },
            { title: "奇幻", value: "fantasy" },
            { title: "家庭", value: "family" },
            { title: "音乐", value: "musical" },
            { title: "历史", value: "history" },
            { title: "传记", value: "biography" },
            { title: "运动", value: "sport" },
            { title: "西部", value: "western" }
          ]
        },
        {
          name: "year_range",
          title: "📅年份范围",
          type: "enumeration",
          description: "按年份范围筛选",
          value: "",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" },
            { title: "2021年", value: "2021" },
            { title: "2020年", value: "2020" },
            { title: "2020年代", value: "2020s" },
            { title: "2010年代", value: "2010s" },
            { title: "2000年代", value: "2000s" },
            { title: "1990年代", value: "1990s" },
            { title: "1980年代", value: "1980s" },
            { title: "更早", value: "earlier" }
          ]
        },
        {
          name: "rating_range",
          title: "⭐评分范围",
          type: "enumeration",
          description: "设置豆瓣评分范围",
          value: "",
          enumOptions: [
            { title: "全部评分", value: "" },
            { title: "9.0分以上", value: "9.0+" },
            { title: "8.5-9.0分", value: "8.5-9.0" },
            { title: "8.0-8.5分", value: "8.0-8.5" },
            { title: "7.5-8.0分", value: "7.5-8.0" },
            { title: "7.0-7.5分", value: "7.0-7.5" },
            { title: "6.5-7.0分", value: "6.5-7.0" },
            { title: "6.0-6.5分", value: "6.0-6.5" },
            { title: "6.0分以下", value: "6.0-" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // 2. 豆瓣经典榜单
    {
      title: "豆瓣经典榜单",
      description: "豆瓣经典电影电视剧榜单",
      requiresWebView: false,
      functionName: "loadDoubanClassicList",
      cacheDuration: 86400,
      params: [
        {
          name: "list_type",
          title: "🏆榜单类型",
          type: "enumeration",
          description: "选择经典榜单类型",
          value: "top250",
          enumOptions: [
            { title: "豆瓣电影Top250", value: "top250" },
            { title: "豆瓣电视剧Top100", value: "tv_top100" },
            { title: "华语电影经典", value: "chinese_classic" },
            { title: "欧美电影经典", value: "western_classic" },
            { title: "日韩电影经典", value: "asian_classic" },
            { title: "动画电影经典", value: "animation_classic" },
            { title: "纪录片经典", value: "documentary_classic" },
            { title: "短片经典", value: "short_classic" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "ranking",
          enumOptions: [
            { title: "榜单排名", value: "ranking" },
            { title: "豆瓣评分↓", value: "rating_desc" },
            { title: "上映时间↓", value: "release_date_desc" },
            { title: "评价人数↓", value: "vote_count_desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // 3. 豆瓣热门榜单
    {
      title: "豆瓣热门榜单",
      description: "豆瓣当前热门影视内容",
      requiresWebView: false,
      functionName: "loadDoubanHotList",
      cacheDuration: 1800,
      params: [
        {
          name: "hot_type",
          title: "🔥热门类型",
          type: "enumeration",
          description: "选择热门榜单类型",
          value: "hot_movies",
          enumOptions: [
            { title: "热门电影", value: "hot_movies" },
            { title: "热门电视剧", value: "hot_tv" },
            { title: "热播剧集", value: "trending_tv" },
            { title: "新片热映", value: "new_releases" },
            { title: "口碑佳作", value: "reputation" },
            { title: "院线热映", value: "in_theaters" },
            { title: "即将上映", value: "coming_soon" },
            { title: "网络热播", value: "online_popular" }
          ]
        },
        {
          name: "region",
          title: "🌍地区筛选",
          type: "enumeration",
          description: "按地区筛选热门内容",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "华语", value: "chinese" },
            { title: "欧美", value: "western" },
            { title: "日韩", value: "asian" },
            { title: "其他", value: "others" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity_desc",
          enumOptions: [
            { title: "热度↓", value: "popularity_desc" },
            { title: "豆瓣评分↓", value: "rating_desc" },
            { title: "上映时间↓", value: "release_date_desc" },
            { title: "评价人数↓", value: "vote_count_desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // 4. 豆瓣年度榜单
    {
      title: "豆瓣年度榜单",
      description: "豆瓣年度影视作品榜单",
      requiresWebView: false,
      functionName: "loadDoubanYearlyList",
      cacheDuration: 86400,
      params: [
        {
          name: "year",
          title: "📅年份选择",
          type: "enumeration",
          description: "选择年份",
          value: "2024",
          enumOptions: [
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" },
            { title: "2021年", value: "2021" },
            { title: "2020年", value: "2020" },
            { title: "2019年", value: "2019" },
            { title: "2018年", value: "2018" },
            { title: "2017年", value: "2017" },
            { title: "2016年", value: "2016" },
            { title: "2015年", value: "2015" }
          ]
        },
        {
          name: "content_type",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择内容类型",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "电视剧", value: "tv" },
            { title: "综艺", value: "variety" },
            { title: "纪录片", value: "documentary" },
            { title: "动画", value: "animation" }
          ]
        },
        {
          name: "region",
          title: "🌍地区筛选",
          type: "enumeration",
          description: "按地区筛选",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "华语", value: "chinese" },
            { title: "欧美", value: "western" },
            { title: "日韩", value: "asian" },
            { title: "其他", value: "others" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "rating_desc",
          enumOptions: [
            { title: "豆瓣评分↓", value: "rating_desc" },
            { title: "热度↓", value: "popularity_desc" },
            { title: "上映时间↓", value: "release_date_desc" },
            { title: "评价人数↓", value: "vote_count_desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // 5. 豆瓣主题片单
    {
      title: "豆瓣主题片单",
      description: "豆瓣特色主题影视片单",
      requiresWebView: false,
      functionName: "loadDoubanThemeList",
      cacheDuration: 86400,
      params: [
        {
          name: "theme_type",
          title: "🎨主题类型",
          type: "enumeration",
          description: "选择主题片单类型",
          value: "hidden_gems",
          enumOptions: [
            { title: "高分冷门佳作", value: "hidden_gems" },
            { title: "小众艺术电影", value: "art_house" },
            { title: "经典老片重温", value: "classic_rewatch" },
            { title: "女性视角电影", value: "female_perspective" },
            { title: "青春校园题材", value: "youth_campus" },
            { title: "科幻未来世界", value: "sci_fi_future" },
            { title: "治愈温情故事", value: "healing_stories" },
            { title: "黑色幽默作品", value: "dark_comedy" },
            { title: "历史传记片", value: "historical_biography" },
            { title: "音乐舞蹈片", value: "music_dance" },
            { title: "悬疑烧脑片", value: "mind_bending" },
            { title: "家庭亲情片", value: "family_bonds" }
          ]
        },
        {
          name: "content_type",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择内容类型",
          value: "all",
          enumOptions: [
            { title: "全部类型", value: "all" },
            { title: "电影", value: "movie" },
            { title: "电视剧", value: "tv" },
            { title: "纪录片", value: "documentary" },
            { title: "动画", value: "animation" }
          ]
        },
        {
          name: "region",
          title: "🌍地区偏好",
          type: "enumeration",
          description: "按地区偏好筛选",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "华语作品", value: "chinese" },
            { title: "欧美作品", value: "western" },
            { title: "日韩作品", value: "asian" },
            { title: "其他地区", value: "others" }
          ]
        },
        {
          name: "rating_filter",
          title: "⭐评分要求",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "7.0+",
          enumOptions: [
            { title: "无要求", value: "" },
            { title: "6.0分以上", value: "6.0+" },
            { title: "7.0分以上", value: "7.0+" },
            { title: "8.0分以上", value: "8.0+" },
            { title: "8.5分以上", value: "8.5+" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // 6. 豆瓣自定义搜索
    {
      title: "豆瓣自定义搜索",
      description: "自定义关键词搜索豆瓣影视内容",
      requiresWebView: false,
      functionName: "loadDoubanCustomSearch",
      cacheDuration: 1800,
      params: [
        { 
          name: "keyword", 
          title: "🔍搜索关键词", 
          type: "input",
          description: "输入电影/电视剧名称、演员、导演等关键词"
        },
        {
          name: "search_type",
          title: "🎯搜索类型",
          type: "enumeration",
          description: "选择搜索范围",
          value: "all",
          enumOptions: [
            { title: "全部内容", value: "all" },
            { title: "电影", value: "movie" },
            { title: "电视剧", value: "tv" },
            { title: "人物", value: "person" },
            { title: "书籍", value: "book" },
            { title: "音乐", value: "music" }
          ]
        },
        {
          name: "sort_by",
          title: "📊排序方式",
          type: "enumeration",
          description: "搜索结果排序方式",
          value: "relevance",
          enumOptions: [
            { title: "相关度", value: "relevance" },
            { title: "豆瓣评分↓", value: "rating_desc" },
            { title: "上映时间↓", value: "release_date_desc" },
            { title: "热度↓", value: "popularity_desc" }
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

// -------------IMDB模块函数-------------

// IMDB热门内容 - 基于IMDB评分的高质量内容
async function imdbPopularContent(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    type = "movie", 
    with_genres, 
    with_origin_country,
    sort_by = "vote_average.desc",
    vote_average_gte = "7.0"
  } = params;
  
  try {
    // 构建API端点
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      // IMDB高分筛选
      vote_count_gte: 100,  // 至少100个投票
      with_watch_monetization_types: "flatrate|free|ads|rent|buy" // 确保内容可观看
    };
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 添加题材类型过滤器
    if (with_genres) {
      queryParams.with_genres = with_genres;
    }
    
    // 添加地区过滤器
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
        const formattedItem = formatTmdbItem(item, genreMap[type]);
        // 添加IMDB特殊标识
        formattedItem.type = "imdb";
        formattedItem.source = "IMDB高分精选";
        return formattedItem;
      })
      .filter(item => item.posterPath); // IMDB高分精选
  } catch (error) {
    console.error("Error fetching IMDB popular content:", error);
    return [];
  }
}

// IMDB年度精选 - 按年份和地区筛选的精品内容
async function imdbYearlySelection(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    type = "movie", 
    primary_release_year,
    with_origin_country,
    with_genres,
    sort_by = "vote_average.desc",
    vote_average_gte = "6.5"
  } = params;
  
  try {
    // 构建API端点
    const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      // 确保内容质量
      vote_count_gte: 50  // 至少50个投票
    };
    
    // 添加年份筛选
    if (primary_release_year) {
      if (type === "movie") {
        queryParams.primary_release_year = primary_release_year;
      } else {
        queryParams.first_air_date_year = primary_release_year;
      }
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 添加地区过滤器
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
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
      .map(item => {
        const formattedItem = formatTmdbItem(item, genreMap[type]);
        // 添加年度精选标识
        formattedItem.type = "imdb-yearly";
        formattedItem.source = `IMDB ${primary_release_year || '全年'}精选`;
        formattedItem.year = primary_release_year || new Date(item.release_date || item.first_air_date).getFullYear();
        return formattedItem;
      })
      .filter(item => item.posterPath); // IMDB年度精选
  } catch (error) {
    console.error("Error fetching IMDB yearly selection:", error);
    return [];
  }
}

// -------------Bangumi模块函数-------------

// Bangumi热门新番 - 最新热门新番动画
async function bangumiHotNewAnime(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    season_year = "2024",
    with_origin_country = "JP",
    sort_by = "popularity.desc",
    vote_average_gte = "6.0"
  } = params;
  
  try {
    const endpoint = "/discover/tv";
    
    // 构建查询参数 - 专注指定年份的新番
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: API_KEY,
      // 新番动画筛选
      with_genres: "16", // 动画类型
      first_air_date_year: season_year, // 指定年份新番
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
        formattedItem.source = `Bangumi ${season_year}年新番`;
        formattedItem.seasonYear = season_year;
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

// -------------豆瓣片单函数（优化实现）-------------

// 豆瓣数据格式化函数
function formatDoubanItem(item, source = "豆瓣") {
  return {
    id: item.id || item.subject?.id,
    type: "douban",
    title: item.title || item.subject?.title || item.name,
    description: item.description || item.summary || item.subject?.summary || "暂无简介",
    releaseDate: item.release_date || item.pubdate || item.subject?.pubdate || "未知日期",
    posterPath: item.poster || item.pic?.large || item.subject?.pic?.large || item.image || "",
    backdropPath: item.backdrop || item.pic?.large || item.subject?.pic?.large || "",
    rating: item.rating?.average || item.subject?.rating?.average || "无评分",
    ratingCount: item.rating?.numRaters || item.subject?.rating?.numRaters || 0,
    genres: item.genres || item.subject?.genres || [],
    directors: item.directors || item.subject?.directors || [],
    actors: item.casts || item.subject?.casts || [],
    countries: item.countries || item.subject?.countries || [],
    languages: item.languages || item.subject?.languages || [],
    duration: item.durations?.[0] || item.subject?.durations?.[0] || "",
    year: item.year || item.subject?.year || new Date().getFullYear(),
    source: source,
    doubanUrl: `https://movie.douban.com/subject/${item.id || item.subject?.id}/`
  };
}

// 1. 豆瓣综合榜单
async function loadDoubanComprehensiveList(params = {}) {
  const { 
    page = 1, 
    content_type = "movie", 
    sort_by = "rating_desc", 
    region = "", 
    genre = "", 
    year_range = "", 
    rating_range = "" 
  } = params;
  
  try {
    // 构建豆瓣API请求参数
    const apiParams = {
      start: (page - 1) * 20,
      count: 20,
      type: content_type === "all" ? "" : content_type
    };
    
    // 添加地区筛选
    if (region) {
      apiParams.countries = getDoubanRegionCode(region);
    }
    
    // 添加题材筛选
    if (genre) {
      apiParams.genres = getDoubanGenreCode(genre);
    }
    
    // 添加年份筛选
    if (year_range) {
      const yearFilter = getDoubanYearRange(year_range);
      if (yearFilter.start) apiParams.year_range = `${yearFilter.start},${yearFilter.end}`;
    }
    
    // 添加评分筛选
    if (rating_range) {
      const ratingFilter = getDoubanRatingRange(rating_range);
      if (ratingFilter.min) apiParams.rating = `${ratingFilter.min},${ratingFilter.max}`;
    }
    
    // 添加排序参数
    apiParams.sort = getDoubanSortCode(sort_by);
    
    // 模拟豆瓣API调用（实际应用中需要真实API）
    const mockData = generateMockDoubanData(apiParams, "综合榜单");
    
    return mockData.map(item => formatDoubanItem(item, "豆瓣综合榜单"));
  } catch (error) {
    console.error("Error fetching Douban comprehensive list:", error);
    return [];
  }
}

// 2. 豆瓣经典榜单
async function loadDoubanClassicList(params = {}) {
  const { page = 1, list_type = "top250", sort_by = "ranking" } = params;
  
  try {
    const apiParams = {
      start: (page - 1) * 20,
      count: 20,
      list_type: list_type,
      sort: getDoubanSortCode(sort_by)
    };
    
    // 根据榜单类型设置不同的数据源
    const listConfig = getDoubanClassicListConfig(list_type);
    const mockData = generateMockDoubanData(apiParams, listConfig.name);
    
    return mockData.map(item => formatDoubanItem(item, listConfig.name));
  } catch (error) {
    console.error("Error fetching Douban classic list:", error);
    return [];
  }
}

// 3. 豆瓣热门榜单
async function loadDoubanHotList(params = {}) {
  const { page = 1, hot_type = "hot_movies", region = "", sort_by = "popularity_desc" } = params;
  
  try {
    const apiParams = {
      start: (page - 1) * 20,
      count: 20,
      hot_type: hot_type,
      sort: getDoubanSortCode(sort_by)
    };
    
    if (region) {
      apiParams.countries = getDoubanRegionCode(region);
    }
    
    const hotConfig = getDoubanHotListConfig(hot_type);
    const mockData = generateMockDoubanData(apiParams, hotConfig.name);
    
    return mockData.map(item => formatDoubanItem(item, hotConfig.name));
  } catch (error) {
    console.error("Error fetching Douban hot list:", error);
    return [];
  }
}

// 4. 豆瓣年度榜单
async function loadDoubanYearlyList(params = {}) {
  const { 
    page = 1, 
    year = "2024", 
    content_type = "movie", 
    region = "", 
    sort_by = "rating_desc" 
  } = params;
  
  try {
    const apiParams = {
      start: (page - 1) * 20,
      count: 20,
      year: year,
      type: content_type,
      sort: getDoubanSortCode(sort_by)
    };
    
    if (region) {
      apiParams.countries = getDoubanRegionCode(region);
    }
    
    const mockData = generateMockDoubanData(apiParams, `${year}年度榜单`);
    
    return mockData.map(item => formatDoubanItem(item, `豆瓣${year}年度榜单`));
  } catch (error) {
    console.error("Error fetching Douban yearly list:", error);
    return [];
  }
}

// 5. 豆瓣主题片单
async function loadDoubanThemeList(params = {}) {
  const { 
    page = 1, 
    theme_type = "hidden_gems", 
    content_type = "all", 
    region = "", 
    rating_filter = "7.0+" 
  } = params;
  
  try {
    const apiParams = {
      start: (page - 1) * 20,
      count: 20,
      theme: theme_type,
      type: content_type === "all" ? "" : content_type
    };
    
    if (region) {
      apiParams.countries = getDoubanRegionCode(region);
    }
    
    if (rating_filter) {
      const ratingFilter = getDoubanRatingRange(rating_filter);
      if (ratingFilter.min) apiParams.rating = `${ratingFilter.min},${ratingFilter.max}`;
    }
    
    const themeConfig = getDoubanThemeConfig(theme_type);
    const mockData = generateMockDoubanData(apiParams, themeConfig.name);
    
    return mockData.map(item => formatDoubanItem(item, themeConfig.name));
  } catch (error) {
    console.error("Error fetching Douban theme list:", error);
    return [];
  }
}

// 6. 豆瓣自定义搜索
async function loadDoubanCustomSearch(params = {}) {
  const { 
    page = 1, 
    keyword = "", 
    search_type = "all", 
    sort_by = "relevance" 
  } = params;
  
  if (!keyword.trim()) {
    return [];
  }
  
  try {
    const apiParams = {
      start: (page - 1) * 20,
      count: 20,
      q: keyword.trim(),
      type: search_type === "all" ? "" : search_type,
      sort: getDoubanSortCode(sort_by)
    };
    
    const mockData = generateMockDoubanSearchData(apiParams);
    
    return mockData.map(item => formatDoubanItem(item, "豆瓣搜索"));
  } catch (error) {
    console.error("Error fetching Douban custom search:", error);
    return [];
  }
}

// -------------豆瓣辅助函数-------------

// 获取豆瓣地区代码
function getDoubanRegionCode(region) {
  const regionMap = {
    "mainland_china": "中国大陆",
    "hong_kong": "香港",
    "taiwan": "台湾",
    "usa": "美国",
    "japan": "日本",
    "korea": "韩国",
    "uk": "英国",
    "france": "法国",
    "germany": "德国",
    "italy": "意大利",
    "spain": "西班牙",
    "russia": "俄罗斯",
    "india": "印度",
    "thailand": "泰国",
    "chinese": "中国大陆,香港,台湾",
    "western": "美国,英国,法国,德国,意大利",
    "asian": "日本,韩国,泰国,印度",
    "others": ""
  };
  return regionMap[region] || "";
}

// 获取豆瓣题材代码
function getDoubanGenreCode(genre) {
  const genreMap = {
    "drama": "剧情",
    "comedy": "喜剧",
    "action": "动作",
    "romance": "爱情",
    "sci_fi": "科幻",
    "mystery": "悬疑",
    "thriller": "惊悚",
    "horror": "恐怖",
    "crime": "犯罪",
    "war": "战争",
    "adventure": "冒险",
    "fantasy": "奇幻",
    "family": "家庭",
    "musical": "音乐",
    "history": "历史",
    "biography": "传记",
    "sport": "运动",
    "western": "西部"
  };
  return genreMap[genre] || "";
}

// 获取豆瓣年份范围
function getDoubanYearRange(yearRange) {
  const currentYear = new Date().getFullYear();
  const rangeMap = {
    "2024": { start: 2024, end: 2024 },
    "2023": { start: 2023, end: 2023 },
    "2022": { start: 2022, end: 2022 },
    "2021": { start: 2021, end: 2021 },
    "2020": { start: 2020, end: 2020 },
    "2020s": { start: 2020, end: currentYear },
    "2010s": { start: 2010, end: 2019 },
    "2000s": { start: 2000, end: 2009 },
    "1990s": { start: 1990, end: 1999 },
    "1980s": { start: 1980, end: 1989 },
    "earlier": { start: 1900, end: 1979 }
  };
  return rangeMap[yearRange] || { start: null, end: null };
}

// 获取豆瓣评分范围
function getDoubanRatingRange(ratingRange) {
  const rangeMap = {
    "9.0+": { min: 9.0, max: 10.0 },
    "8.5-9.0": { min: 8.5, max: 9.0 },
    "8.0-8.5": { min: 8.0, max: 8.5 },
    "7.5-8.0": { min: 7.5, max: 8.0 },
    "7.0-7.5": { min: 7.0, max: 7.5 },
    "6.5-7.0": { min: 6.5, max: 7.0 },
    "6.0-6.5": { min: 6.0, max: 6.5 },
    "6.0-": { min: 0.0, max: 6.0 },
    "6.0+": { min: 6.0, max: 10.0 },
    "7.0+": { min: 7.0, max: 10.0 },
    "8.0+": { min: 8.0, max: 10.0 },
    "8.5+": { min: 8.5, max: 10.0 }
  };
  return rangeMap[ratingRange] || { min: null, max: null };
}

// 获取豆瓣排序代码
function getDoubanSortCode(sortBy) {
  const sortMap = {
    "rating_desc": "rating",
    "rating_asc": "rating_asc",
    "release_date_desc": "time",
    "release_date_asc": "time_asc",
    "popularity_desc": "hot",
    "popularity_asc": "hot_asc",
    "vote_count_desc": "vote",
    "vote_count_asc": "vote_asc",
    "duration_desc": "duration",
    "duration_asc": "duration_asc",
    "ranking": "rank",
    "relevance": "relevance"
  };
  return sortMap[sortBy] || "rating";
}

// 获取经典榜单配置
function getDoubanClassicListConfig(listType) {
  const configMap = {
    "top250": { name: "豆瓣电影Top250", filter: "top250" },
    "tv_top100": { name: "豆瓣电视剧Top100", filter: "tv_top" },
    "chinese_classic": { name: "华语电影经典", filter: "chinese_classic" },
    "western_classic": { name: "欧美电影经典", filter: "western_classic" },
    "asian_classic": { name: "日韩电影经典", filter: "asian_classic" },
    "animation_classic": { name: "动画电影经典", filter: "animation_classic" },
    "documentary_classic": { name: "纪录片经典", filter: "documentary_classic" },
    "short_classic": { name: "短片经典", filter: "short_classic" }
  };
  return configMap[listType] || { name: "豆瓣经典榜单", filter: "classic" };
}

// 获取热门榜单配置
function getDoubanHotListConfig(hotType) {
  const configMap = {
    "hot_movies": { name: "豆瓣热门电影", filter: "hot_movies" },
    "hot_tv": { name: "豆瓣热门电视剧", filter: "hot_tv" },
    "trending_tv": { name: "豆瓣热播剧集", filter: "trending_tv" },
    "new_releases": { name: "豆瓣新片热映", filter: "new_releases" },
    "reputation": { name: "豆瓣口碑佳作", filter: "reputation" },
    "in_theaters": { name: "豆瓣院线热映", filter: "in_theaters" },
    "coming_soon": { name: "豆瓣即将上映", filter: "coming_soon" },
    "online_popular": { name: "豆瓣网络热播", filter: "online_popular" }
  };
  return configMap[hotType] || { name: "豆瓣热门榜单", filter: "hot" };
}

// 获取主题片单配置
function getDoubanThemeConfig(themeType) {
  const configMap = {
    "hidden_gems": { name: "豆瓣高分冷门佳作", filter: "hidden_gems" },
    "art_house": { name: "豆瓣小众艺术电影", filter: "art_house" },
    "classic_rewatch": { name: "豆瓣经典老片重温", filter: "classic_rewatch" },
    "female_perspective": { name: "豆瓣女性视角电影", filter: "female_perspective" },
    "youth_campus": { name: "豆瓣青春校园题材", filter: "youth_campus" },
    "sci_fi_future": { name: "豆瓣科幻未来世界", filter: "sci_fi_future" },
    "healing_stories": { name: "豆瓣治愈温情故事", filter: "healing_stories" },
    "dark_comedy": { name: "豆瓣黑色幽默作品", filter: "dark_comedy" },
    "historical_biography": { name: "豆瓣历史传记片", filter: "historical_biography" },
    "music_dance": { name: "豆瓣音乐舞蹈片", filter: "music_dance" },
    "mind_bending": { name: "豆瓣悬疑烧脑片", filter: "mind_bending" },
    "family_bonds": { name: "豆瓣家庭亲情片", filter: "family_bonds" }
  };
  return configMap[themeType] || { name: "豆瓣主题片单", filter: "theme" };
}

// 生成模拟豆瓣数据（实际应用中应替换为真实API调用）
function generateMockDoubanData(params, sourceName) {
  // 这里应该是真实的豆瓣API调用
  // 由于豆瓣API限制，这里提供模拟数据结构
  const mockItems = [];
  const count = params.count || 20;
  
  for (let i = 0; i < count; i++) {
    mockItems.push({
      id: `douban_${Date.now()}_${i}`,
      title: `${sourceName}示例影片${i + 1}`,
      description: "这是一个示例描述，实际使用时会从豆瓣API获取真实数据。",
      release_date: "2024-01-01",
      poster: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2614988097.jpg",
      rating: {
        average: (Math.random() * 3 + 7).toFixed(1),
        numRaters: Math.floor(Math.random() * 100000) + 1000
      },
      genres: ["剧情", "爱情"],
      directors: [{ name: "示例导演" }],
      casts: [{ name: "示例演员1" }, { name: "示例演员2" }],
      countries: ["中国大陆"],
      languages: ["汉语普通话"],
      durations: ["120分钟"],
      year: 2024
    });
  }
  
  return mockItems;
}

// 生成模拟豆瓣搜索数据
function generateMockDoubanSearchData(params) {
  // 模拟搜索结果
  return generateMockDoubanData(params, `搜索"${params.q}"`);
}
