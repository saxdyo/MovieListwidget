WidgetMetadata = {
  id: "widget.tmdb.movies",
  title: "TMDB 榜单",
  description: "来自 TMDB 的热门影视榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/blob/main/MovieListwidget",
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

async function fetchTmdbGenres() {
  if (global.tmdbGenresCache) return global.tmdbGenresCache;

  const [movieGenres] = await Promise.all([
    Widget.tmdb.get("/genre/movie/list", { params: { language: "zh-CN" } }),
  ]);

  global.tmdbGenresCache = {
    movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
  };
  return global.tmdbGenresCache;
}

function getGenreNames(genreIds, genreMap) {
  return genreIds.map(id => genreMap[id] || `未知(${id})`).join(" / ");
}

function formatTmdbItem(item, genreMap) {
  return {
    id: item.id,
    type: "tmdb",
    title: item.title || item.name,
    description: item.overview || "",
    releaseDate: item.release_date || item.first_air_date || "",
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    rating: item.vote_average,
    mediaType: item.media_type || (item.title ? "movie" : "tv"),
    genreTitle: getGenreNames(item.genre_ids || [], genreMap)
  };
}

async function loadTodayTrending(params = {}) {
  const { language = "zh-CN" } = params;
  const res = await Widget.tmdb.get("/trending/all/day", { params: { language } });
  const genreMap = (await fetchTmdbGenres()).movie;
  return res.results.map(item => formatTmdbItem(item, genreMap));
}

async function loadPopularMovies(params = {}) {
  const { language = "zh-CN", page = 1 } = params;
  const res = await Widget.tmdb.get("/movie/popular", { params: { language, page } });
  const genreMap = (await fetchTmdbGenres()).movie;
  return res.results.map(item => formatTmdbItem(item, genreMap));
}

async function loadTopRatedMovies(params = {}) {
  const { language = "zh-CN", page = 1 } = params;
  const res = await Widget.tmdb.get("/movie/top_rated", { params: { language, page } });
  const genreMap = (await fetchTmdbGenres()).movie;
  return res.results.map(item => formatTmdbItem(item, genreMap));
}
