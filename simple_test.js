// Widget API 兼容性检查
if (typeof Widget === 'undefined') {
  Widget = {
    tmdb: {
      get: async (endpoint, options) => {
        console.warn(`[兼容性] Widget.tmdb.get(${endpoint}) 在测试环境中不可用`);
        return { results: [] };
      }
    },
    http: {
      get: async (url, options) => {
        console.warn(`[兼容性] Widget.http.get(${url}) 在测试环境中不可用`);
        return { data: [] };
      }
    },
    dom: {
      parse: (html) => {
        console.warn(`[兼容性] Widget.dom.parse() 在测试环境中不可用`);
        return -1;
      },
      select: (docId, selector) => {
        console.warn(`[兼容性] Widget.dom.select() 在测试环境中不可用`);
        return [];
      },
      attr: async (elementId, attr) => {
        console.warn(`[兼容性] Widget.dom.attr() 在测试环境中不可用`);
        return '';
      },
      text: async (elementId) => {
        console.warn(`[兼容性] Widget.dom.text() 在测试环境中不可用`);
        return '';
      }
    }
  };
}

WidgetMetadata = {
  id: "simple.test",
  title: "简单测试",
  description: "简单测试脚本",
  author: "test",
  site: "https://test.com",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    {
      title: "TMDB 热门内容",
      description: "今日热门、本周热门、热门电影、高分内容合并模块",
      requiresWebView: false,
      functionName: "loadTmdbTrendingCombined",
      cacheDuration: 60,
      params: [
        { 
          name: "content_type", 
          title: "📺内容类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "今日热门", value: "today" },
            { title: "本周热门", value: "week" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
          ], 
          value: "today" 
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ]
};

const API_KEY = 'f3ae69ddca232b56265600eb919d46ab';

async function loadTmdbTrendingCombined(params = {}) {
  const { content_type = "today" } = params;
  
  try {
    // 返回测试数据
    return [
      {
        id: "1",
        type: "tmdb",
        title: "测试电影",
        description: "这是一个测试电影",
        posterPath: "https://image.tmdb.org/t/p/w500/test.jpg",
        backdropPath: "https://image.tmdb.org/t/p/w780/test.jpg",
        rating: "8.5",
        mediaType: "movie",
        genreTitle: "动作•冒险"
      }
    ];
  } catch (error) {
    console.error("Error in loadTmdbTrendingCombined:", error);
    return [];
  }
}

console.log("[系统] 简单测试脚本加载完成");