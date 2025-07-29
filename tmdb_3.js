WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "影视榜单",
  description: "影视动画榜单",
  author: "阿米诺斯",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    // -------------TMDB模块-------------
    // --- 热门模块 ---
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // --- 常规发现模块 ---
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
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // --- 播出平台模块（已优化） ---
    {
        title: "流媒体剧集库",
        description: "按平台、类型、年份筛选剧集",
        requiresWebView: false,
        functionName: "tmdbDiscoverTVShows",
        cacheDuration: 3600,
        params: [
            {
                name: "platform",
                title: "🎬 播出平台",
                type: "enumeration",
                value: "213",
                enumOptions: [
                    { title: "Netflix", value: "213" },
                    { title: "Disney+", value: "2739" },
                    { title: "HBO Max", value: "3186" },
                    { title: "Apple TV+", value: "2552" },
                    { title: "Hulu", value: "453" },
                    { title: "Amazon Prime", value: "1024" },
                    { title: "腾讯视频", value: "2007" },
                    { title: "爱奇艺", value: "1330" },
                    { title: "优酷", value: "1419" },
                    { title: "哔哩哔哩", value: "1605" },
                    { title: "芒果TV", value: "1631" }
                ]
            },
            {
                name: "genre",
                title: "🎭 剧集类型",
                type: "enumeration",
                value: "",
                enumOptions: [
                    { title: "全部类型", value: "" },
                    { title: "剧情", value: "18" },
                    { title: "喜剧", value: "35" },
                    { title: "动作冒险", value: "10759" },
                    { title: "科幻奇幻", value: "10765" },
                    { title: "犯罪", value: "80" },
                    { title: "悬疑", value: "9648" },
                    { title: "动画", value: "16" },
                    { title: "纪录片", value: "99" }
                ]
            },
            {
                name: "year",
                title: "📆 首播年份",
                type: "string",
                value: "",
                description: "例如：2023 或 2020-2023"
            },
            {
                name: "sort_by",
                title: "🔢 排序方式",
                type: "enumeration",
                value: "popularity.desc",
                enumOptions: [
                    { title: "人气最高", value: "popularity.desc" },
                    { title: "评分最高", value: "vote_average.desc" },
                    { title: "最新上线", value: "first_air_date.desc" }
                ]
            },
            { name: "page", title: "页码", type: "page" },
            { name: "language", title: "语言", type: "language", value: "zh-CN" }
        ]
    },
    // --- 出品公司模块（已优化） ---
    {
        title: "电影公司片库",
        description: "按公司、类型、年份筛选电影",
        requiresWebView: false,
        functionName: "tmdbDiscoverMoviesByCompany",
        cacheDuration: 3600,
        params: [
            {
                name: "company",
                title: "🏢 出品公司",
                type: "enumeration",
                value: "2",
                enumOptions: [
                    { title: "迪士尼 Disney", value: "2" },
                    { title: "华纳兄弟 Warner Bros.", value: "174" },
                    { title: "环球影业 Universal", value: "33" },
                    { title: "索尼影业 Sony", value: "34" },
                    { title: "派拉蒙 Paramount", value: "4" },
                    { title: "20世纪影业 20th Century", value: "25" },
                    { title: "漫威影业 Marvel", value: "420" },
                    { title: "A24", value: "41077" },
                    { title: "皮克斯 Pixar", value: "3" },
                    { title: "梦工厂动画 DreamWorks", value: "521" }
                ]
            },
            {
                name: "genre",
                title: "🎭 电影类型",
                type: "enumeration",
                value: "",
                enumOptions: [
                    { title: "全部类型", value: "" },
                    { title: "动作", value: "28" },
                    { title: "冒险", value: "12" },
                    { title: "科幻", value: "878" },
                    { title: "奇幻", value: "14" },
                    { title: "剧情", value: "18" },
                    { title: "喜剧", value: "35" },
                    { title: "动画", value: "16" },
                    { title: "恐怖", value: "27" },
                    { title: "悬疑", value: "9648" },
                    { title: "犯罪", value: "80" },
                    { title: "纪录片", value: "99" }
                ]
            },
            {
                name: "year",
                title: "📆 上映年份",
                type: "string",
                value: "",
                description: "例如：2023 或 2020-2023"
            },
            {
                name: "sort_by",
                title: "🔢 排序方式",
                type: "enumeration",
                value: "popularity.desc",
                enumOptions: [
                    { title: "人气最高", value: "popularity.desc" },
                    { title: "评分最高", value: "vote_average.desc" },
                    { title: "最新上映", value: "primary_release_date.desc" }
                ]
            },
            { name: "page", title: "页码", type: "page" },
            { name: "language", title: "语言", type: "language", value: "zh-CN" }
        ]
    }
  ]
};

// ===============辅助函数===============
let tmdbGenresCache = null;

async function fetchTmdbGenres() {
    if (tmdbGenresCache) return tmdbGenresCache;
    
    const [movieGenres, tvGenres] = await Promise.all([
        Widget.tmdb.get('/genre/movie/list', { params: { language: 'zh-CN' } }),
        Widget.tmdb.get('/genre/tv/list', { params: { language: 'zh-CN' } })
    ]);
    
    tmdbGenresCache = {
        movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
        tv: tvGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {})
    };
    return tmdbGenresCache;
}

function getTmdbGenreTitles(genreIds, mediaType) {
    const genres = tmdbGenresCache?.[mediaType] || {};
    const topThreeIds = genreIds.slice(0, 3); 
    return topThreeIds
        .map(id => genres[id]?.trim() || `\u672a\u77e5\u7c7b\u578b(${id})`)
        .filter(Boolean)
        .join('•');
}

function formatItemDescription(item) {
    let description = item.description || '';
    const hasRating = /\u8bc4\u5206|rating/i.test(description);
    const hasYear = /\u5e74\u4efd|year/i.test(description);
    const hasType = /\u7c7b\u578b|type/i.test(description);
    
    if (item.itemType && !hasType) {
        description = `\u7c7b\u578b: ${item.itemType} | ${description}`;
    }
    
    if (item.rating && !hasRating) {
        description = `\u8bc4\u5206: ${item.rating} | ${description}`;
    }
    
    if (item.releaseDate && !hasYear) {
        const year = String(item.releaseDate).substring(0,4);
        if (/^\d{4}$/.test(year)) {
            description = `\u5e74\u4efd: ${year} | ${description}`;
        }
    }
    
    return description
        .replace(/^\|\s*/, '')
        .replace(/\s*\|$/, '')
        .trim();
}

function calculatePagination(params) {
    let page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 20;
    
    if (typeof params.start !== 'undefined') {
        page = Math.floor(parseInt(params.start) / limit) + 1;
    }
    
    const start = (page - 1) * limit;
    return { page, limit, start };
}

function getBeijingDate() {
    const now = new Date();
    const beijingTime = now.getTime() + (8 * 60 * 60 * 1000);
    const beijingDate = new Date(beijingTime);
    return `${beijingDate.getUTCFullYear()}-${String(beijingDate.getUTCMonth() + 1).padStart(2, '0')}-${String(beijingDate.getUTCDate()).padStart(2, '0')}`;
}

// ================TMDB功能函数===============
async function fetchTmdbData(api, params) {
    const [data, genres] = await Promise.all([
        Widget.tmdb.get(api, { params: params }),
        fetchTmdbGenres()
    ]);

    return data.results
        .filter((item) => {
            return item.poster_path &&
                   item.id &&
                   (item.title || item.name) &&
                   (item.title || item.name).trim().length > 0;
        })
        .map((item) => {
            const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
            const genreIds = item.genre_ids || [];
            const genreTitle = getTmdbGenreTitles(genreIds, mediaType);

            return {
                id: item.id,
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
        });
}

async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://raw.githubusercontent.com/quantumultxx/ForwardWidgets/refs/heads/main/data/TMDB_Trending.json");
    return response.data;
}

async function loadTodayGlobalMedia() {
    const data = await loadTmdbTrendingData();
    return data.today_global.map(item => ({
        id: item.id.toString(),
        type: "tmdb",
        title: item.title,
        genreTitle: item.genreTitle,
        rating: item.rating,
        description: item.overview,
        releaseDate: item.release_date,
        posterPath: item.poster_url,
        backdropPath: item.title_backdrop,
        mediaType: item.type,
    }));
}

async function loadWeekGlobalMovies(params) {
    const data = await loadTmdbTrendingData();
    return data.week_global_all.map(item => ({
        id: item.id.toString(),
        type: "tmdb",
        title: item.title,
        genreTitle: item.genreTitle,
        rating: item.rating,
        description: item.overview,
        releaseDate: item.release_date,
        posterPath: item.poster_url,
        backdropPath: item.title_backdrop,
        mediaType: item.type,
    }));
}

async function tmdbPopularMovies(params) {
    if ((parseInt(params.page) || 1) === 1) {
        const data = await loadTmdbTrendingData();
        return data.popular_movies
      .slice(0, 15)
      .map(item => ({
        id: item.id.toString(),
        type: "tmdb",
        title: item.title,
        genreTitle: item.genreTitle,
        rating: item.rating,
        description: item.overview,
        releaseDate: item.release_date,
        posterPath: item.poster_url,
        backdropPath: item.title_backdrop,
        mediaType: item.type
            }));
    }
    
    const [data, genres] = await Promise.all([
        Widget.tmdb.get(`/movie/popular`, { 
            params: { 
                language: params.language || 'zh-CN',
                page: parseInt(params.page) || 1,
                region: 'CN'
            } 
        }),
        fetchTmdbGenres()
    ]);
    
    return data.results.map(item => ({
        id: String(item.id),
        type: "tmdb",
        title: item.title,
        description: item.overview,
        releaseDate: item.release_date,
        backdropPath: item.backdrop_path,
        posterPath: item.poster_path,
        rating: item.vote_average,
        mediaType: "movie",
        genreTitle: getTmdbGenreTitles(item.genre_ids, "movie")
    }));
}

async function tmdbTopRated(params) {
    const type = params.type || 'movie';
    const api = type === 'movie' ? `movie/top_rated` : `tv/top_rated`;
    return await fetchTmdbData(api, params);
}

// 新的函数：根据平台筛选剧集（替换旧的 tmdbDiscoverByNetwork）
async function tmdbDiscoverTVShows(params = {}) {
    const api = "discover/tv";
    const discoveryParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        with_networks: params.platform,
        sort_by: params.sort_by || "popularity.desc",
    };

    if (params.genre) {
        discoveryParams.with_genres = params.genre;
    }

    if (params.year) {
        if (params.year.includes('-')) {
            const [startYear, endYear] = params.year.split('-');
            discoveryParams['first_air_date.gte'] = `${startYear.trim()}-01-01`;
            discoveryParams['first_air_date.lte'] = `${endYear.trim()}-12-31`;
        } else {
            discoveryParams['first_air_date.gte'] = `${params.year.trim()}-01-01`;
            discoveryParams['first_air_date.lte'] = `${params.year.trim()}-12-31`;
        }
    }

    return await fetchTmdbData(api, discoveryParams);
}

// 新的函数：根据公司筛选电影（替换旧的 tmdbCompanies）
async function tmdbDiscoverMoviesByCompany(params = {}) {
    const api = "discover/movie";
    const discoveryParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        with_companies: params.company,
        sort_by: params.sort_by || "popularity.desc",
    };

    if (params.genre) {
        discoveryParams.with_genres = params.genre;
    }

    if (params.year) {
        if (params.year.includes('-')) {
            const [startYear, endYear] = params.year.split('-');
            discoveryParams['primary_release_date.gte'] = `${startYear.trim()}-01-01`;
            discoveryParams['primary_release_date.lte'] = `${endYear.trim()}-12-31`;
        } else {
            discoveryParams['primary_release_date.gte'] = `${params.year.trim()}-01-01`;
            discoveryParams['primary_release_date.lte'] = `${params.year.trim()}-12-31`;
        }
    }

    return await fetchTmdbData(api, discoveryParams);
}
