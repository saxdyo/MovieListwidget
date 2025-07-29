/* ==========================================================
 *  MovieListWidget – 影视&动画聚合榜单
 *  Author : saxdyo
 *  Repo   : https://github.com/saxdyo/MovieListWidget
 *  Ver    : 2.0.0
 * ========================================================== */

/* ==========================================================
 *  1. 全局配置中心（改这里就行）
 * ========================================================== */
const CONFIG = {
  tmdbKey: 'f3ae69ddca232b56265600eb919d46ab',
  cacheDuration: { short: 60, medium: 1800, long: 3600 },
  language: 'zh-CN',

  /* 枚举统一收口，方便后期维护 */
  enum: {
    sortBy: {
      popularity_desc : '热门度↓', popularity_asc : '热门度↑',
      vote_desc       : '评分↓',   vote_asc       : '评分↑',
      date_desc       : '日期↓',   date_asc       : '日期↑',
      revenue_desc    : '收入↓',   revenue_asc    : '收入↑'
    },
    mediaType: { movie: '电影', tv: '剧集' },
    region: {
      US:'美国', CN:'中国', JP:'日本', KR:'韩国', GB:'英国',
      EU:'欧洲', ALL:'全部'
    },
    year: {
      current: '本年度', last: '去年', recent3: '近3年',
      recent5: '近5年', y2020s: '2020年代', y2010s: '2010年代'
    },
    network: {
      '': '全部', 213:'Netflix', 2739:'Disney+', 49:'HBO',
      2007:'Tencent', 1330:'iQiyi', 1419:'Youku', 1605:'Bilibili'
    },
    company: {
      '':'全部', 420:'漫威', 2:'迪士尼', 174:'华纳', 5:'索尼',
      33:'环球', 25:'20世纪福克斯', 4:'派拉蒙', 521:'梦工厂'
    },
    bangumiRank: {
      top_rated:'评分榜', popular:'热门榜',
      recent:'新番榜', classic:'经典榜'
    }
  }
};

/* ==========================================================
 *  2. 元数据声明（供宿主读取）
 * ========================================================== */
WidgetMetadata = {
  id: "forward.combined.media.lists.v2",
  title: "影视榜单 Pro",
  description: "聚合 TMDB / IMDB / Bangumi / 豆瓣 的高质量片单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: CONFIG.cacheDuration.medium,
  modules: buildModuleList()
};

/* 根据 CONFIG.enum 自动生成宿主所需的 params */
function buildModuleList() {
  const e = CONFIG.enum;
  return [
    /* ---------- 今日 & 本周热门 ---------- */
    quickModule('今日热门', 'loadTodayTrending', 60, [
      { name:'language', type:'language', value:CONFIG.language }
    ]),
    quickModule('本周热门', 'loadWeekTrending', 60, [
      { name:'language', type:'language', value:CONFIG.language }
    ]),

    /* ---------- 电影 ---------- */
    filterModule('热门电影', 'discoverMovies', 3600, {
      sort_by: { type:'enum', value:'popularity_desc', options:e.sortBy },
      with_genres:{ type:'genre', value:'' },
      vote_gte:{ type:'enum', value:'0', options:{0:'全部',7:'7+',8:'8+',9:'9+'} }
    }),

    /* ---------- 剧集 ---------- */
    filterModule('热门剧集', 'discoverTV', 3600, {
      sort_by:{ type:'enum', value:'popularity_desc', options:e.sortBy },
      with_networks:{ type:'enum', value:'', options:e.network },
      with_genres:{ type:'genre', value:'' },
      vote_gte:{ type:'enum', value:'0', options:{0:'全部',7:'7+',8:'8+',9:'9+'} }
    }),

    /* ---------- 出品公司 ---------- */
    filterModule('按公司筛选', 'discoverByCompany', 3600, {
      with_companies:{ type:'enum', value:'', options:e.company },
      type:{ type:'enum', value:'movie', options:e.mediaType },
      sort_by:{ type:'enum', value:'popularity_desc', options:e.sortBy }
    }),

    /* ---------- 年度精选 ---------- */
    filterModule('年度精选', 'yearlySelection', 3600, {
      year:{ type:'enum', value:'current', options:e.year },
      region:{ type:'enum', value:'ALL', options:e.region },
      type:{ type:'enum', value:'movie', options:e.mediaType },
      vote_gte:{ type:'enum', value:'7', options:{0:'全部',7:'7+',8:'8+',9:'9+'} }
    }),

    /* ---------- Bangumi ---------- */
    filterModule('Bangumi 新番', 'bangumiNewAnime', 1800, {
      year:{ type:'enum', value:'current', options:e.year },
      region:{ type:'enum', value:'JP', options:{JP:'日本',CN:'中国'} },
      vote_gte:{ type:'enum', value:'6', options:{0:'全部',6:'6+',7:'7+',8:'8+'} }
    }),
    filterModule('Bangumi 排行', 'bangumiRanking', 3600, {
      rank_type:{ type:'enum', value:'top_rated', options:e.bangumiRank },
      vote_gte:{ type:'enum', value:'7', options:{0:'全部',7:'7+',8:'8+',9:'9+'} }
    }),

    /* ---------- 豆瓣 ---------- */
    quickModule('豆瓣实时热榜', 'doubanRealtime', 3600, [
      { name:'type', type:'constant', value:'movie' }
    ]),
    quickModule('豆瓣自定义片单', 'doubanCustom', 3600, [
      { name:'url', type:'input', description:'支持豆列/官方榜单/App dispatch' }
    ])
  ];
}

/* ==========================================================
 *  3. 工具箱
 * ========================================================== */
const api = {
  tmdb: (path, params) =>
    Widget.tmdb.get(path, { params:{ api_key: CONFIG.tmdbKey, ...params } })
};

const genreMapCache = {}; // <id,name> 缓存
async function fetchGenreMap(type = 'movie') {
  if (genreMapCache[type]) return genreMapCache[type];
  const { genres } = await api.tmdb(`/genre/${type}/list`, { language:CONFIG.language });
  genreMapCache[type] = genres.reduce((m, g) => (m[g.id] = g.name, m), {});
  return genreMapCache[type];
}

function formatItem(raw, type) {
  return {
    id: raw.id,
    title: raw.title || raw.name,
    overview: raw.overview || '暂无简介',
    date: raw.release_date || raw.first_air_date || '未知',
    poster: raw.poster_path ? `https://image.tmdb.org/t/p/w500${raw.poster_path}` : '',
    backdrop: raw.backdrop_path ? `https://image.tmdb.org/t/p/w1280${raw.backdrop_path}` : '',
    rating: raw.vote_average || 0,
    mediaType: type,
    genres: raw.genre_ids?.map(id => genreMapCache[type]?.[id]).filter(Boolean) || []
  };
}

/* ==========================================================
 *  4. 业务实现
 * ========================================================== */
/* 通用分页 & 错误兜底 */
async function safeFetch(fn, params) {
  try { return await fn(params); }
  catch (e) { console.error(e); return []; }
}

/* 今日热门 */
async function loadTodayTrending({ language = CONFIG.language } = {}) {
  const { results } = await api.tmdb('/trending/all/day', { language });
  await fetchGenreMap('movie'); // 预加载
  return results.map(r => formatItem(r, r.title ? 'movie' : 'tv'));
}

/* 本周热门 */
async function loadWeekTrending({ language = CONFIG.language } = {}) {
  const { results } = await api.tmdb('/trending/all/week', { language });
  await fetchGenreMap('movie');
  return results.map(r => formatItem(r, r.title ? 'movie' : 'tv'));
}

/* 电影发现 */
async function discoverMovies({ page = 1, sort_by = 'popularity_desc', with_genres = '', vote_gte = 0 } = {}) {
  const params = {
    language: CONFIG.language,
    page,
    sort_by: sort_by.replace('_', '.'),
    with_genres,
    'vote_average.gte': vote_gte,
    vote_count_gte: 50
  };
  const { results } = await api.tmdb('/discover/movie', params);
  const gMap = await fetchGenreMap('movie');
  return results.map(r => formatItem(r, 'movie'));
}

/* 剧集发现 */
async function discoverTV({ page = 1, sort_by = 'popularity_desc', with_networks, with_genres, vote_gte = 0 } = {}) {
  const params = {
    language: CONFIG.language,
    page,
    sort_by: sort_by.replace('_', '.'),
    with_networks,
    with_genres,
    'vote_average.gte': vote_gte,
    vote_count_gte: 30
  };
  const { results } = await api.tmdb('/discover/tv', params);
  const gMap = await fetchGenreMap('tv');
  return results.map(r => formatItem(r, 'tv'));
}

/* 公司片单 */
async function discoverByCompany({ page = 1, type = 'movie', with_companies = '', sort_by = 'popularity_desc' } = {}) {
  const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
  const params = {
    language: CONFIG.language,
    page,
    sort_by: sort_by.replace('_', '.'),
    with_companies,
    vote_count_gte: 50
  };
  const { results } = await api.tmdb(endpoint, params);
  const gMap = await fetchGenreMap(type);
  return results.map(r => formatItem(r, type));
}

/* 年度精选 */
async function yearlySelection({ page = 1, type = 'movie', year = 'current', region = 'ALL', vote_gte = 7 } = {}) {
  const date = getYearRange(year);
  const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
  const params = {
    language: CONFIG.language,
    page,
    sort_by: 'vote_average.desc',
    [type === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte']: date.start,
    [type === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte']: date.end,
    with_origin_country: region === 'ALL' ? '' : region,
    'vote_average.gte': vote_gte,
    vote_count_gte: 100
  };
  const { results } = await api.tmdb(endpoint, params);
  const gMap = await fetchGenreMap(type);
  return results.map(r => formatItem(r, type));
}

/* Bangumi 新番 */
async function bangumiNewAnime({ page = 1, year = 'current', region = 'JP', vote_gte = 6 } = {}) {
  const date = getYearRange(year);
  const params = {
    language: CONFIG.language,
    page,
    sort_by: 'popularity.desc',
    with_genres: 16,
    'first_air_date.gte': date.start,
    'first_air_date.lte': date.end,
    with_origin_country: region,
    'vote_average.gte': vote_gte,
    vote_count_gte: 10
  };
  const { results } = await api.tmdb('/discover/tv', params);
  const gMap = await fetchGenreMap('tv');
  return results.map(r => ({ ...formatItem(r, 'tv'), source: 'Bangumi 新番' }));
}

/* Bangumi 排行 */
async function bangumiRanking({ page = 1, rank_type = 'top_rated', vote_gte = 7 } = {}) {
  const params = {
    language: CONFIG.language,
    page,
    with_genres: 16,
    'vote_average.gte': vote_gte,
    vote_count_gte: 100,
    ...rankParams(rank_type)
  };
  const { results } = await api.tmdb('/discover/tv', params);
  const gMap = await fetchGenreMap('tv');
  return results.map(r => ({ ...formatItem(r, 'tv'), source: `Bangumi ${CONFIG.enum.bangumiRank[rank_type]}` }));
}

/* 豆瓣实时热榜（复用原逻辑，保持兼容） */
async function doubanRealtime({ type = 'movie' } = {}) {
  const url = 'https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/movie_real_time_hotest/&dt_dapp=1';
  return safeFetch(Widget.loadEnhancedDoubanList, { url, type });
}

/* 豆瓣自定义片单（复用原逻辑） */
async function doubanCustom({ url, page = 1 } = {}) {
  return safeFetch(Widget.loadEnhancedDoubanList, { url, page });
}

/* ==========================================================
 *  5. 辅助小函数
 * ========================================================== */
function getYearRange(key) {
  const y = new Date().getFullYear();
  const map = {
    current: { start: `${y}-01-01`, end: `${y}-12-31` },
    last:    { start: `${y-1}-01-01`, end: `${y-1}-12-31` },
    recent3: { start: `${y-2}-01-01`, end: `${y}-12-31` },
    recent5: { start: `${y-4}-01-01`, end: `${y}-12-31` },
    y2020s:  { start: '2020-01-01', end: '2029-12-31' },
    y2010s:  { start: '2010-01-01', end: '2019-12-31' }
  };
  return map[key] || map.current;
}

function rankParams(type) {
  switch (type) {
    case 'top_rated': return { sort_by: 'vote_average.desc', vote_count_gte: 200 };
    case 'popular':   return { sort_by: 'popularity.desc',   vote_count_gte: 50 };
    case 'recent':    return { sort_by: 'first_air_date.desc', 'first_air_date.gte': '2023-01-01', vote_count_gte: 20 };
    case 'classic':   return { sort_by: 'vote_average.desc', 'first_air_date.lte': '2020-12-31', vote_count_gte: 300 };
    default:          return { sort_by: 'vote_average.desc', vote_count_gte: 100 };
  }
}

/* ==========================================================
 *  6. 宿主工具函数（简化书写）
 * ========================================================== */
function quickModule(title, fn, cache, params) {
  return { title, functionName: fn, cacheDuration: cache, params };
}
function filterModule(title, fn, cache, filterMap) {
  const params = Object.entries(filterMap).map(([k, v]) => ({
    name: k,
    title: v.title || k,
    type: v.type,
    value: v.value,
    enumOptions: v.options ? Object.entries(v.options).map(([val, title]) => ({ value: val, title })) : undefined,
    description: v.description
  }));
  return { title, functionName: fn, cacheDuration: cache, params };
}
