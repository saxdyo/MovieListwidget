WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "TMDB",
  description: "影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/MovieListwidget
",
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
            { name: "with_networks", title: "播出平台", type: "enumeration", value: "" },
            { name: "with_genres", title: "🎭内容类型", type: "enumeration", value: "" },
            { name: "air_status", title: "上映状态", type: "enumeration", value: "released" },
            { name: "sort_by", title: "🔢 排序方式", type: "enumeration", value: "first_air_date.desc" },
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
        { name: "with_companies", title: "出品公司", type: "enumeration", value: "" },
        { name: "with_genres", title: "🎭内容类型", type: "enumeration", value: "" },
        { name: "air_status", title: "上映状态", type: "enumeration", value: "released" },
        { name: "sort_by", title: "🔢 排序方式", type: "enumeration", value: "primary_release_date.desc" },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // -------------豆瓣模块-------------
    // --- 片单解析 ---
    {
      title: "豆瓣自定义片单",
      description: "支持格式:桌面/移动端豆列、官方榜单、App dispatch",
      requiresWebView: false,
      functionName: "loadEnhancedDoubanList",
      cacheDuration: 3600,
      params: [
        {
          name: "url", 
          title: "🔗 片单地址", 
          type: "input", 
          description: "支持格式:桌面/移动端豆列、官方榜单、App dispatch",
          placeholders: [
              { title: "一周电影口碑榜", 
              value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/movie_weekly_best/&dt_dapp=1" },
              { title: "华语口碑剧集榜", 
              value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/tv_chinese_best_weekly/&dt_dapp=1" },
              { title: "全球口碑剧集榜", 
              value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/tv_global_best_weekly/&dt_dapp=1" },
              { title: "国内热播综艺", 
              value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/show_domestic/&dt_dapp=1" },
              { title: "国外热播综艺", 
              value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/show_foreign/&dt_dapp=1" },
              { title: "当地影院热映", 
              value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/movie_showing/&dt_dapp=1" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // --- 实时热点 ---
    {
      title: "豆瓣电影实时热榜",
      description: "来自豆瓣的当前热门电影榜单",
      requiresWebView: false,
      functionName: "loadDoubanHotListWithTmdb",
      cacheDuration: 3600,
      params: [
        { name: "url", 
          title: "🔗 列表地址", 
          type: "constant", 
          value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/movie_real_time_hotest/&dt_dapp=1" },
        { name: "type", 
          title: "🎭 类型", 
          type: "constant", 
          value: "movie" }
      ]
    },
    {
      title: "豆瓣剧集实时热榜",
      description: "来自豆瓣的当前热门剧集榜单",
      requiresWebView: false,
      functionName: "loadDoubanHotListWithTmdb",
      cacheDuration: 3600,
      params: [
        { name: "url", 
          title: "🔗 列表地址", 
          type: "constant", 
          value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/tv_real_time_hotest/&dt_dapp=1" },
        { name: "type", 
          title: "🎭 类型", 
          type: "constant", 
          value: "tv" }
      ]
    },
    {
      title: "豆瓣书影音实时热榜",
      description: "来自豆瓣的书影音实时热榜",
      requiresWebView: false,
      functionName: "loadDoubanHotListWithTmdb",
      cacheDuration: 3600,
      params: [
        { name: "url", 
          title: "🔗 列表地址", 
          type: "constant", 
          value: "https://www.douban.com/doubanapp/dispatch?uri=/subject_collection/subject_real_time_hotest/&dt_dapp=1" },
        { name: "type", 
          title: "🎭 类型", 
          type: "constant", 
          value: "subject" }
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
        .map(id => genres[id]?.trim() || `未知类型(${id})`)
        .filter(Boolean)
        .join('•');
}

function getDoubanGenreTitles(genres, itemType) {
    if (!genres) {
        return "";
    }
    
    let genreArray = [];
    
    if (typeof genres === 'string') {
        const cleanGenres = genres.trim();
        if (cleanGenres) {
            if (cleanGenres.includes(',')) {
                genreArray = cleanGenres.split(',');
            } else if (cleanGenres.includes('、')) {
                genreArray = cleanGenres.split('、');
            } else if (cleanGenres.includes('/')) {
                genreArray = cleanGenres.split('/');
            } else if (cleanGenres.includes(' ')) {
                genreArray = cleanGenres.split(' ');
            } else {
                genreArray = [cleanGenres];
            }
        }
    } 
    else if (Array.isArray(genres)) {
        genreArray = genres.filter(g => g && g.trim());
    }
    
    if (genreArray.length === 0) {
        return "";
    }
    
    const cleanedGenres = genreArray
        .map(g => g.trim())
        .filter(g => g.length > 0 && !['/', '、', ',', ''].includes(g))
        .slice(0, 3);
    
    return cleanedGenres.join('•');
}

function extractGenresFromText(text) {
    if (!text) return [];
    
    const genreKeywords = [
        '动作', '科幻', '灾难', '爱情', '喜剧', '悬疑', '犯罪', '冒险', '奇幻', '战争',
        '历史', '武侠', '惊悚', '恐怖', '情色', '动画', '剧情', '西部', '家庭', '音乐',
        '运动', '古装', '歌舞', '传记', '短片', '纪录片', '文艺', '青春', '校园', '职场',
        '都市', '农村', '军事', '警匪', '谍战', '宫廷', '神话', '魔幻'
    ];
    
    const foundGenres = [];
    
    const typePattern = /(?:类型|genre)[\uff1a:\s]*([^\n\r]+)/i;
    const typeMatch = text.match(typePattern);
    if (typeMatch) {
        const typeText = typeMatch[1];
        const types = typeText.split(/[\/\u3001,\uff0c\s]+/).filter(t => t.trim());
        foundGenres.push(...types);
    }
    
    for (const keyword of genreKeywords) {
        if (text.includes(keyword) && !foundGenres.includes(keyword)) {
            foundGenres.push(keyword);
        }
    }
    
    return foundGenres.slice(0, 3);
}

function formatItemDescription(item) {
    let description = item.description || '';
    const hasRating = /评分|rating/i.test(description);
    const hasYear = /年份|year/i.test(description);
    const hasType = /类型|type/i.test(description);
    
    if (item.itemType && !hasType) {
        description = `类型: ${item.itemType} | ${description}`;
    }
    
    if (item.rating && !hasRating) {
        description = `评分: ${item.rating} | ${description}`;
    }
    
    if (item.releaseDate && !hasYear) {
        const year = String(item.releaseDate).substring(0,4);
        if (/^\d{4}$/.test(year)) {
            description = `年份: ${year} | ${description}`;
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

function parseDoubanAppDispatchUrl(url) {
    const cleanedUrl = url.replace(/\s+/g, '').trim();
    const questionMarkIndex = cleanedUrl.indexOf('?');
    const queryString = cleanedUrl.substring(questionMarkIndex + 1);
    
    const params = {};
    const paramPairs = queryString.split('&');
    for (const pair of paramPairs) {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    
    const uriParam = params['uri'];
    const cleanUri = (uriParam.startsWith('/') ? uriParam.substring(1) : uriParam).trim();
    
    if (cleanUri.includes('subject_collection/')) {
        return `https://m.douban.com/${cleanUri}`;
    }
    else if (cleanUri.includes('doulist/')) {
        return `https://www.douban.com/${cleanUri}`;
    }
    
    return null;
}

function detectItemTypeFromContent(item) {
  const aliases = (item.original_title || item.aka || item.alternate_title || "").toLowerCase();
  if (aliases.includes("电影版") || aliases.includes("(电影)") || aliases.includes("movie")) {
    return "movie";
  }
  if (aliases.includes("电视剧版") || aliases.includes("(电视剧)") || aliases.includes("tv") || aliases.includes("series")) {
    return "tv";
  }
  
  const description = (item.card_subtitle || item.description || item.abstract || "").toLowerCase();
  const title = (item.title || "").toLowerCase();
  
  if (description.includes("电影") && !description.includes("电视") && !description.includes("剧")) {
    return "movie";
  }
  
  if (description.includes("电视剧") || description.includes("剧集") || description.includes("集数") || 
      description.includes("季") || description.includes("全") && description.includes("集")) {
    return "tv";
  }
  
  if (description.includes("动画") || title.includes("动画") || 
      description.includes("番剧") || description.includes("anime") ||
      description.includes("animation") || aliases.includes("动画")) {
    
    if (description.includes("电影") || title.includes("电影") || 
        description.includes("剧场版") || title.includes("剧场版")) {
      return "movie";
    }
    
    if (description.includes("番剧") || description.includes("第") && description.includes("季") ||
        description.includes("集") && !description.includes("电影") ||
        description.includes("tv") || description.includes("series")) {
      return "tv";
    }
    
    return "multi";
  }
  
  if (description.includes("分钟") || description.includes("min") || description.includes("小时")) {
    return "movie";
  }
  
  if (title.includes("电影版")) {
    return "movie";
  }
  if (title.includes("电视剧版") || title.includes("剧版")) {
    return "tv";
  }
  
  return null;
}

function determineItemType(item, paramType) {
  if (paramType === "movie") return "电影";
  if (paramType === "tv") return "剧集";
  if (paramType === "subject") {
    if (item.subtype === "movie") return "电影";
    
    const cardSubtitle = item.card_subtitle || "";
    if (cardSubtitle.includes("电影")) return "电影";
    if (cardSubtitle.includes("剧集") || cardSubtitle.includes("电视剧")) return "剧集";
    
    return "综合";
  }
  return "未知";
}

function detectAndAssignTypePreferences(items) {
  const titleItemsMap = new Map();
  
  for (const item of items) {
    const title = item.title.trim();
    if (!titleItemsMap.has(title)) {
      titleItemsMap.set(title, []);
    }
    titleItemsMap.get(title).push(item);
  }
  
  const multiItemTitles = new Set();
  for (const [title, titleItems] of titleItemsMap.entries()) {
    if (titleItems.length > 1) {
      const hasMultipleTypes = titleItems.some((item, index) => {
        const otherItems = titleItems.filter((_, i) => i !== index);
        const itemType = detectItemTypeFromContent(item);
        return otherItems.some(otherItem => {
          const otherType = detectItemTypeFromContent(otherItem);
          return itemType && otherType && itemType !== otherType;
        });
      });
      
      if (hasMultipleTypes) {
        multiItemTitles.add(title);
      } else {
        multiItemTitles.add(title);
      }
    }
  }
  
  const itemsWithPreferences = [];
  const processedTitles = new Map();
  
  for (const item of items) {
    const title = item.title.trim();
    const isMultiTypeTitle = multiItemTitles.has(title);
    
    let assignedTypePreference = null;
    
    if (isMultiTypeTitle) {
      if (!processedTitles.has(title)) {
        processedTitles.set(title, []);
      }
      
      const sameTitle = processedTitles.get(title);
      const currentCount = sameTitle.length;
      
      if (currentCount === 0) {
        assignedTypePreference = "movie";
      } else if (currentCount === 1) {
        assignedTypePreference = "tv";
      }
      
      sameTitle.push(item.id);
    }
    
    itemsWithPreferences.push({
      ...item,
      isMultiTypeTitle: isMultiTypeTitle,
      assignedTypePreference: assignedTypePreference
    });
  }
  
  return itemsWithPreferences;
}

function getEditDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

function calculateSimilarity(str1, str2) {
    const cleanStr1 = str1.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]/g, '');
    const cleanStr2 = str2.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]/g, '');
    
    if (cleanStr1 === cleanStr2) return 1.0;
    
    const longer = cleanStr1.length > cleanStr2.length ? cleanStr1 : cleanStr2;
    const shorter = cleanStr1.length > cleanStr2.length ? cleanStr2 : cleanStr1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

function selectMatches(tmdbResults, originalTitle, originalYear, options = {}) {
    if (tmdbResults.length === 0) return options.returnArray ? [] : null;
    
    const {
        returnArray = false,
        preferredType = null,
        minThreshold = 0.7,
        doubanItem = null
    } = options;
    
    let actualPreferredType = preferredType;
    if (!actualPreferredType && doubanItem) {
        const detectedType = detectItemTypeFromContent(doubanItem);
        if (detectedType) {
            actualPreferredType = detectedType;
        } else if (doubanItem.subtype === "movie") {
            actualPreferredType = "movie";
        } else if (doubanItem.subtype === "tv") {
            actualPreferredType = "tv";
        }
    }
    
    const scoredResults = tmdbResults.map(result => {
        const title = result.title || result.name;
        const year = result.release_date || result.first_air_date;
        const yearString = year ? year.substring(0, 4) : '';
        
        let titleScore = calculateSimilarity(originalTitle, title);
        
        let yearScore = 1.0;
        if (originalYear && yearString) {
            const yearDiff = Math.abs(parseInt(originalYear) - parseInt(yearString));
            yearScore = Math.max(0, 1 - yearDiff * 0.1);
        }
        
        let typeScore = 1.0;
        if (actualPreferredType) {
            const resultType = result.media_type;
            if (actualPreferredType === resultType) {
                typeScore = 1.0;
            } else {
                typeScore = 0.5;
            }
        }
        
        const totalScore = (titleScore * 0.6) + (yearScore * 0.2) + (typeScore * 0.2);
        
        return {
            ...result,
            _score: totalScore,
            _titleScore: titleScore,
            _yearScore: yearScore,
            _typeScore: typeScore
        };
    });
    
    const filteredResults = scoredResults.filter(result => result._titleScore >= minThreshold);
    
    const sortedResults = filteredResults.sort((a, b) => b._score - a._score);
    
    if (returnArray) {
        return sortedResults;
    }
    
    return sortedResults.length > 0 ? sortedResults[0] : null;
}

function generateGenreTitleFromTmdb(tmdbItem, doubanItem) {
    let genres = doubanItem.genres;
    
    if (!genres || (Array.isArray(genres) && genres.length === 0)) {
        const textToExtract = [
            doubanItem.card_subtitle,
            doubanItem.description,
            doubanItem.abstract
        ].filter(Boolean).join(' ');
        
        if (textToExtract) {
            const extractedGenres = extractGenresFromText(textToExtract);
            if (extractedGenres.length > 0) {
                genres = extractedGenres;
            }
        }
    }
    
    if (!genres || (Array.isArray(genres) && genres.length === 0)) {
        if (tmdbItem.genre_ids && tmdbItem.genre_ids.length > 0) {
            genres = tmdbItem.genre_ids.map(id => mapTmdbGenreIdToChineseName(id)).filter(Boolean);
        }
    }
    
    if (!genres || (Array.isArray(genres) && genres.length === 0)) {
        return "";
    }
    
    return getDoubanGenreTitles(genres, determineItemType(doubanItem, doubanItem.type));
}

function mapTmdbGenreIdToChineseName(genreId) {
    const genreMap = {
        28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪",
        99: "纪录片", 18: "剧情", 10751: "家庭", 14: "奇幻", 36: "历史",
        27: "恐怖", 10402: "音乐", 9648: "悬疑", 10749: "爱情", 878: "科幻",
        10770: "电视电影", 53: "惊悚", 10752: "战争", 37: "西部",
        
        10759: "动作冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
        18: "剧情", 10751: "家庭", 10762: "儿童", 9648: "悬疑", 10763: "新闻",
        10764: "真人秀", 10765: "科幻奇幻", 10766: "肥皂剧", 10767: "脱口秀",
        10768: "战争政治", 37: "西部"
    };
    
    return genreMap[genreId] || null;
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
                backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "", // 背景图路径
                posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",  // 海报图路径
                logoPath: item.logo_path ? `https://image.tmdb.org/t/p/w500${item.logo_path}` : "", // logo路径
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
        logoPath: item.logo_path,  // 加入logo路径
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
        logoPath: item.logo_path,  // 加入logo路径
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
        logoPath: item.logo_path,  // 加入logo路径
        mediaType: item.type
            }));
    }
    
    const [data, genres] = await Promise.all([
        Widget.tmdb.get("/movie/popular", { 
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
        logoPath: item.logo_path,  // 加入logo路径
        rating: item.vote_average,
        mediaType: "movie",
        genreTitle: getTmdbGenreTitles(item.genre_ids, "movie")
    }));
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
    
    return allItems;
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
