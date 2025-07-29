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
    // --- 播出平台模块 ---
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
                belongTo: {
                  paramName: "air_status",
                  value: ["released","upcoming",""],
                },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Tencent", value: "2007" },
            { title: "iQiyi", value: "1330" },
            { title: "Youku", value: "1419" },
            { title: "Bilibili", value: "1605" },
            { title: "MGTV", value: "1631" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" },
            { title: "HBO Max", value: "3186" },
            { title: "Apple TV+", value: "2552" },
            { title: "Hulu", value: "453" },
            { title: "Amazon Prime Video", value: "1024" },
            { title: "FOX", value: "19" },
            { title: "Paramount+", value: "4330" },
            { title: "TV Tokyo", value: "94" },
            { title: "BBC One", value: "332" },
            { title: "BBC Two", value: "295" },
            { title: "NBC", value: "6" },
            { title: "AMC+", value: "174" },
            { title: "We TV", value: "3732" },
            { title: "Viu TV", value: "2146" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming",""],
          },
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "犯罪", value: "80" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "剧情", value: "18" },
            { title: "家庭", value: "10751" },
            { title: "悬疑", value: "9648" },
            { title: "真人秀", value: "10764" },
            { title: "脱口秀", value: "10767" },
            { title: "纪录片", value: "99" },
            { title: "动作与冒险", value: "10759" },
            { title: "科幻与奇幻", value: "10765" },
            { title: "战争与政治", value: "10768" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          description: "默认已上映",
          value: "released",
          enumOptions: [
            { title: "已上映", value: "released" },
            { title: "未上映", value: "upcoming" },
            { title: "全部", value: "" }
          ]
        },
        {
          name: "sort_by",
          title: "🔢 排序方式",
          type: "enumeration",
          description: "选择内容排序方式,默认上映时间↓",
          value: "first_air_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "first_air_date.desc" },
            { title: "上映时间↑", value: "first_air_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" },
            { title: "最多投票", value: "vote_count.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // --- 出品公司模块 ---
    {
      title: "TMDB 出品公司",
      functionName: "tmdbCompanies",
      cacheDuration: 3600,
      params: [
        {
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          value: "",
          description: "选择一个公司以查看其剧集内容",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming",""],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Disney", value: "2" },
            { title: "Warner Bros", value: "174" },
            { title: "Columbia", value: "5" },
            { title: "Sony", value: "34" },
            { title: "Universal", value: "33" },
            { title: "Paramount", value: "4" },
            { title: "20th Century", value: "25" },
            { title: "Marvel", value: "420" },
            { title: "Toho", value: "882" },
            { title: "中国电影集团公司", value: "14714" },
            { title: "BBC", value: "3324" },
            { title: "A24", value: "41077" },
            { title: "Blumhouse", value: "3172" },
            { title: "Working Title Films", value: "10163" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming",""],
          },
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "冒险", value: "12" },
            { title: "剧情", value: "18" },
            { title: "动作", value: "28" },
            { title: "动画", value: "16" },
            { title: "历史", value: "36" },
            { title: "喜剧", value: "35" },
            { title: "奇幻", value: "14" },
            { title: "家庭", value: "10751" },
            { title: "恐怖", value: "27" },
            { title: "悬疑", value: "9648" },
            { title: "惊悚", value: "53" },
            { title: "战争", value: "10752" },
            { title: "爱情", value: "10749" },
            { title: "犯罪", value: "80" },
            { title: "科幻", value: "878" },
            { title: "记录", value: "99" },
            { title: "西部", value: "37" },
            { title: "音乐", value: "10402" },
            { title: "电视电影", value: "10770" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          description: "默认已上映",
          value: "released",
          enumOptions: [
            { title: "已上映", value: "released" },
            { title: "未上映", value: "upcoming" },
            { title: "全部", value: "" }
          ]
        },
        {
          name: "sort_by",
          title: "🔢 排序方式",
          type: "enumeration",
          description: "选择内容排序方式,默认上映时间↓",
          value: "primary_release_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "primary_release_date.desc" },
            { title: "上映时间↑", value: "primary_release_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" },
            { title: "最多投票", value: "vote_count.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
   // 在modules数组中添加以下新的模块配置
{
  title: "中国剧集",
  description: "中国大陆、香港、台湾等地区制作的剧集内容",
  requiresWebView: false,
  functionName: "tmdbChineseTV",
  cacheDuration: 3600,
  params: [
    { name: "with_genres", title: "🎭内容类型", type: "enumeration", description: "选择要筛选的内容类型", value: "", enumOptions: [
      { title: "全部类型", value: "" },
      { title: "古装历史", value: "36" },
      { title: "现代都市", value: "18" },
      { title: "悬疑犯罪", value: "80,9648" },
      { title: "青春校园", value: "18,10751" },
      { title: "武侠动作", value: "28,12" },
      { title: "家庭情感", value: "18,10751" },
      { title: "喜剧", value: "35" },
      { title: "科幻奇幻", value: "14,878" }
    ]},
    { name: "air_status", title: "上映状态", type: "enumeration", description: "默认已上映", value: "released", enumOptions: [
      { title: "已上映", value: "released" },
      { title: "未上映", value: "upcoming" },
      { title: "全部", value: "" }
    ]},
    { name: "sort_by", title: "🔢 排序方式", type: "enumeration", description: "选择内容排序方式,默认上映时间↓", value: "first_air_date.desc", enumOptions: [
      { title: "上映时间↓", value: "first_air_date.desc" },
      { title: "上映时间↑", value: "first_air_date.asc" },
      { title: "人气最高", value: "popularity.desc" },
      { title: "评分最高", value: "vote_average.desc" },
      { title: "最多投票", value: "vote_count.desc" }
    ]},
    { name: "page", title: "页码", type: "page" },
    { name: "language", title: "语言", type: "language", value: "zh-CN" }
  ]
},
{
  title: "日本剧集",
  description: "日本制作的电视剧、动漫剧集内容",
  requiresWebView: false,
  functionName: "tmdbJapaneseTV",
  cacheDuration: 3600,
  params: [
    { name: "with_genres", title: "🎭内容类型", type: "enumeration", description: "选择要筛选的内容类型", value: "", enumOptions: [
      { title: "全部类型", value: "" },
      { title: "动画", value: "16" },
      { title: "日剧", value: "18" },
      { title: "悬疑推理", value: "9648,80" },
      { title: "校园青春", value: "18,10751" },
      { title: "职场社会", value: "18" },
      { title: "家庭伦理", value: "18,10751" },
      { title: "医疗律政", value: "18" },
      { title: "科幻奇幻", value: "10765" }
    ]},
    { name: "air_status", title: "上映状态", type: "enumeration", description: "默认已上映", value: "released", enumOptions: [
      { title: "已上映", value: "released" },
      { title: "未上映", value: "upcoming" },
      { title: "全部", value: "" }
    ]},
    { name: "sort_by", title: "🔢 排序方式", type: "enumeration", description: "选择内容排序方式,默认上映时间↓", value: "first_air_date.desc", enumOptions: [
      { title: "上映时间↓", value: "first_air_date.desc" },
      { title: "上映时间↑", value: "first_air_date.asc" },
      { title: "人气最高", value: "popularity.desc" },
      { title: "评分最高", value: "vote_average.desc" },
      { title: "最多投票", value: "vote_count.desc" }
    ]},
    { name: "page", title: "页码", type: "page" },
    { name: "language", title: "语言", type: "language", value: "zh-CN" }
  ]
},
{
  title: "韩国剧集",
  description: "韩国制作的电视剧内容",
  requiresWebView: false,
  functionName: "tmdbKoreanTV",
  cacheDuration: 3600,
  params: [
    { name: "with_genres", title: "🎭内容类型", type: "enumeration", description: "选择要筛选的内容类型", value: "", enumOptions: [
      { title: "全部类型", value: "" },
      { title: "浪漫爱情", value: "10749,18" },
      { title: "悬疑惊悚", value: "9648,53" },
      { title: "家庭伦理", value: "18,10751" },
      { title: "职场社会", value: "18" },
      { title: "历史古装", value: "36" },
      { title: "青春校园", value: "18,10751" },
      { title: "喜剧", value: "35" },
      { title: "奇幻", value: "14" }
    ]},
    { name: "air_status", title: "上映状态", type: "enumeration", description: "默认已上映", value: "released", enumOptions: [
      { title: "已上映", value: "released" },
      { title: "未上映", value: "upcoming" },
      { title: "全部", value: "" }
    ]},
    { name: "sort_by", title: "🔢 排序方式", type: "enumeration", description: "选择内容排序方式,默认上映时间↓", value: "first_air_date.desc", enumOptions: [
      { title: "上映时间↓", value: "first_air_date.desc" },
      { title: "上映时间↑", value: "first_air_date.asc" },
      { title: "人气最高", value: "popularity.desc" },
      { title: "评分最高", value: "vote_average.desc" },
      { title: "最多投票", value: "vote_count.desc" }
    ]},
    { name: "page", title: "页码", type: "page" },
    { name: "language", title: "语言", type: "language", value: "zh-CN" }
  ]
},
{
  title: "美国剧集",
  description: "美国制作的电视剧内容",
  requiresWebView: false,
  functionName: "tmdbAmericanTV",
  cacheDuration: 3600,
  params: [
    { name: "with_genres", title: "🎭内容类型", type: "enumeration", description: "选择要筛选的内容类型", value: "", enumOptions: [
      { title: "全部类型", value: "" },
      { title: "剧情", value: "18" },
      { title: "喜剧", value: "35" },
      { title: "动作冒险", value: "10759" },
      { title: "科幻奇幻", value: "10765" },
      { title: "犯罪悬疑", value: "80,9648" },
      { title: "恐怖惊悚", value: "27,53" },
      { title: "超级英雄", value: "10765,28" },
      { title: "医务法律", value: "18" }
    ]},
    { name: "air_status", title: "上映状态", type: "enumeration", description: "默认已上映", value: "released", enumOptions: [
      { title: "已上映", value: "released" },
      { title: "未上映", value: "upcoming" },
      { title: "全部", value: "" }
    ]},
    { name: "sort_by", title: "🔢 排序方式", type: "enumeration", description: "选择内容排序方式,默认上映时间↓", value: "first_air_date.desc", enumOptions: [
      { title: "上映时间↓", value: "first_air_date.desc" },
      { title: "上映时间↑", value: "first_air_date.asc" },
      { title: "人气最高", value: "popularity.desc" },
      { title: "评分最高", value: "vote_average.desc" },
      { title: "最多投票", value: "vote_count.desc" }
    ]},
    { name: "page", title: "页码", type: "page" },
    { name: "language", title: "语言", type: "language", value: "zh-CN" }
  ]
},
{
  title: "欧洲剧集",
  description: "英国、法国、德国、西班牙等欧洲国家制作的剧集内容",
  requiresWebView: false,
  functionName: "tmdbEuropeanTV",
  cacheDuration: 3600,
  params: [
    { name: "with_genres", title: "🎭内容类型", type: "enumeration", description: "选择要筛选的内容类型", value: "", enumOptions: [
      { title: "全部类型", value: "" },
      { title: "犯罪悬疑", value: "80,9648" },
      { title: "历史古装", value: "36" },
      { title: "社会现实", value: "18" },
      { title: "喜剧", value: "35" },
      { title: "科幻奇幻", value: "10765" },
      { title: "政治惊悚", value: "10768,53" },
      { title: "家庭伦理", value: "18,10751" },
      { title: "传记", value: "99,36" }
    ]},
    { name: "air_status", title: "上映状态", type: "enumeration", description: "默认已上映", value: "released", enumOptions: [
      { title: "已上映", value: "released" },
      { title: "未上映", value: "upcoming" },
      { title: "全部", value: "" }
    ]},
    { name: "sort_by", title: "🔢 排序方式", type: "enumeration", description: "选择内容排序方式,默认上映时间↓", value: "first_air_date.desc", enumOptions: [
      { title: "上映时间↓", value: "first_air_date.desc" },
      { title: "上映时间↑", value: "first_air_date.asc" },
      { title: "人气最高", value: "popularity.desc" },
      { title: "评分最高", value: "vote_average.desc" },
      { title: "最多投票", value: "vote_count.desc" }
    ]},
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
        })
        .filter(item => item.posterPath); // 新增过滤
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
    })).filter(item => item.posterPath); // 新增过滤
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
    })).filter(item => item.posterPath); // 新增过滤
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
            })).filter(item => item.posterPath); // 新增过滤
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
    })).filter(item => item.posterPath); // 新增过滤
}

async function tmdbTopRated(params) {
    const type = params.type || 'movie';
    const api = type === 'movie' ? `movie/top_rated` : `tv/top_rated`;
    return await fetchTmdbData(api, params);
}

async function tmdbDiscoverByNetwork(params = {}) {
    const api = "discover/tv";
    const beijingDate = getBeijingDate();
    const discoverParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        with_networks: params.with_networks,
        sort_by: params.sort_by || "first_air_date.desc",
    };
    
    if (params.air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    if (params.with_genres) {
        discoverParams.with_genres = params.with_genres;
    }
    
    return await fetchTmdbData(api, discoverParams);
}

async function tmdbCompanies(params = {}) {
    const api = "discover/movie";
    const beijingDate = getBeijingDate();
    const withCompanies = String(params.with_companies || '').trim();

    const cleanParams = {
        page: params.page || 1,
        language: params.language || "zh-CN",
        sort_by: params.sort_by || "primary_release_date.desc",
        include_adult: false,
        include_video: false
    };

    if (withCompanies) {
        cleanParams.with_companies = withCompanies;
    }

    if (params.air_status === 'released') {
        cleanParams['primary_release_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        cleanParams['primary_release_date.gte'] = beijingDate;
    }

    if (params.with_genres) {
        cleanParams.with_genres = String(params.with_genres).trim();
    }

    return await fetchTmdbData(api, cleanParams);
}

// ================地区剧集功能函数===============
async function tmdbChineseTV(params = {}) {
    const api = "discover/tv";
    const beijingDate = getBeijingDate();
    const discoverParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        sort_by: params.sort_by || "first_air_date.desc",
        'origin_country': 'CN,HK,TW,MO'
    };
    
    if (params.air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    if (params.with_genres) {
        discoverParams.with_genres = params.with_genres;
    }
    
    return await fetchTmdbData(api, discoverParams);
}

async function tmdbJapaneseTV(params = {}) {
    const api = "discover/tv";
    const beijingDate = getBeijingDate();
    const discoverParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        sort_by: params.sort_by || "first_air_date.desc",
        'origin_country': 'JP'
    };
    
    if (params.air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    if (params.with_genres) {
        discoverParams.with_genres = params.with_genres;
    }
    
    return await fetchTmdbData(api, discoverParams);
}

async function tmdbKoreanTV(params = {}) {
    const api = "discover/tv";
    const beijingDate = getBeijingDate();
    const discoverParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        sort_by: params.sort_by || "first_air_date.desc",
        'origin_country': 'KR'
    };
    
    if (params.air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    if (params.with_genres) {
        discoverParams.with_genres = params.with_genres;
    }
    
    return await fetchTmdbData(api, discoverParams);
}

async function tmdbAmericanTV(params = {}) {
    const api = "discover/tv";
    const beijingDate = getBeijingDate();
    const discoverParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        sort_by: params.sort_by || "first_air_date.desc",
        'origin_country': 'US'
    };
    
    if (params.air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    if (params.with_genres) {
        discoverParams.with_genres = params.with_genres;
    }
    
    return await fetchTmdbData(api, discoverParams);
}

async function tmdbEuropeanTV(params = {}) {
    const api = "discover/tv";
    const beijingDate = getBeijingDate();
    const discoverParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        sort_by: params.sort_by || "first_air_date.desc",
        'origin_country': 'GB,FR,DE,ES,IT,SE,DK,NO,NL,BE'
    };
    
    if (params.air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    if (params.with_genres) {
        discoverParams.with_genres = params.with_genres;
    }
    
    return await fetchTmdbData(api, discoverParams);
}
