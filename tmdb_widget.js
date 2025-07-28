WidgetMetadata = {
  id: "widget.tmdb.movies",
  title: "TMDB 榜单",
  description: "来自 TMDB 的热门影视榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 300,
  modules: [
    {
      title: "TMDB 今日热门",
      description: "今日全球热门影视（电影和剧集）",
      functionName: "loadTodayTrending",
      cacheDuration: 300,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 热门电影",
      description: "当前最受欢迎的电影",
      functionName: "loadPopularMovies",
      cacheDuration: 300,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page", value: 1 }
      ]
    },
    {
      title: "TMDB 高分电影",
      description: "用户评分最高的电影",
      functionName: "loadTopRatedMovies",
      cacheDuration: 3600,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page", value: 1 }
      ]
    }
  ]
};
