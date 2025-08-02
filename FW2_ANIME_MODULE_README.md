# FWWidgets fw2.js ✨动画模块使用指南

## 📖 概述

FWWidgets fw2.js 是一个专门为动画内容设计的JavaScript模块，提供了丰富的动画数据获取功能。该模块基于TMDB API，支持获取热门新番、动画电影、高分动画等多种类型的动画内容。

## 🚀 主要功能

### ✨ 核心函数

1. **`bangumiHotNewAnime`** - 获取热门新番动画
2. **`getPopularAnimeMovies`** - 获取热门动画电影
3. **`getLatestAnimeTV`** - 获取最新动画剧集
4. **`getTopRatedAnime`** - 获取高分动画内容
5. **`getAnimeByYear`** - 获取指定年份动画

### 🛠️ 工具函数

- **`fetchTmdbGenres`** - 获取TMDB类型数据
- **`formatTmdbItem`** - 格式化TMDB项目数据
- **`getAnimeModuleStats`** - 获取模块统计信息
- **`clearAnimeCache`** - 清理缓存

## 📦 安装和配置

### 1. 基本配置

```javascript
// 配置API密钥
const API_KEY = "your_tmdb_api_key_here"; // 请替换为您的TMDB API密钥

// 配置常量
const CONFIG = {
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  MAX_ITEMS: 30, // 最大条数
  MAX_CONCURRENT: 5, // 并发数
  LOG_LEVEL: 'info',
  LRU_CACHE_SIZE: 100, // LRU缓存最大容量
  ENABLE_TV_LOGOS: true, // 启用剧集Logo背景图功能
  TV_LOGO_CACHE_DURATION: 60 * 60 * 1000 // 剧集Logo缓存1小时
};
```

### 2. 环境要求

- Node.js 环境或浏览器环境
- TMDB API密钥
- Widget.tmdb对象（用于API调用）

## 🎯 使用示例

### 1. 获取热门新番动画

```javascript
// 基本用法
const hotAnime = await bangumiHotNewAnime();

// 带参数用法
const hotAnime = await bangumiHotNewAnime({
  language: "zh-CN",
  page: 1,
  with_origin_country: "JP",
  with_genres: "16",
  sort_by: "popularity.desc",
  vote_average_gte: "6.0",
  year: "2024",
  max_items: 20
});
```

### 2. 获取热门动画电影

```javascript
const animeMovies = await getPopularAnimeMovies({
  language: "zh-CN",
  page: 1,
  with_genres: "16",
  sort_by: "popularity.desc",
  vote_average_gte: "7.0",
  year: "2024",
  max_items: 15
});
```

### 3. 获取最新动画剧集

```javascript
const latestAnime = await getLatestAnimeTV({
  language: "zh-CN",
  page: 1,
  with_genres: "16",
  sort_by: "first_air_date.desc",
  vote_average_gte: "6.0",
  year: "2024",
  max_items: 10
});
```

### 4. 获取高分动画内容

```javascript
const topAnime = await getTopRatedAnime({
  language: "zh-CN",
  page: 1,
  with_genres: "16",
  vote_average_gte: "8.0",
  year: "2024",
  max_items: 20
});
```

### 5. 获取指定年份动画

```javascript
const yearAnime = await getAnimeByYear({
  year: "2024",
  language: "zh-CN",
  page: 1,
  with_genres: "16",
  sort_by: "popularity.desc",
  vote_average_gte: "6.0",
  max_items: 25
});
```

## 📊 参数说明

### 通用参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `language` | string | "zh-CN" | 语言设置 |
| `page` | number | 1 | 页码 |
| `with_genres` | string | "16" | 类型筛选（16=动画） |
| `sort_by` | string | "popularity.desc" | 排序方式 |
| `vote_average_gte` | string | "6.0" | 最低评分 |
| `year` | string | "" | 年份筛选 |
| `max_items` | number | 30 | 最大返回数量 |

### 排序方式选项

- `popularity.desc` - 按人气降序
- `vote_average.desc` - 按评分降序
- `first_air_date.desc` - 按首播日期降序
- `first_air_date.asc` - 按首播日期升序
- `release_date.desc` - 按发布日期降序
- `release_date.asc` - 按发布日期升序

## 📋 返回数据格式

所有函数都返回格式化的动画数据数组，每个项目包含以下字段：

```javascript
{
  id: 1,                    // TMDB ID
  title: "动画标题",         // 中文标题
  description: "简介",       // 动画简介
  releaseDate: "2024-01-15", // 发布日期
  posterPath: "海报URL",     // 海报图片URL
  backdropPath: "背景URL",   // 背景图片URL
  rating: "8.5",            // 评分
  voteCount: 1500,          // 投票数
  popularity: 85.2,         // 人气值
  mediaType: "tv",          // 媒体类型（movie/tv）
  genreIds: [16, 1, 2],     // 类型ID数组
  genreMap: {...},          // 类型映射
  genreTitle: "动画•动作•冒险", // 类型标题
  type: "bangumi-new",      // 自定义类型标识
  source: "✨Bangumi热门新番", // 数据来源
  isNewAnime: true,         // 是否为新番
  airDate: "2024-01-15",    // 播出日期
  airYear: 2024,            // 播出年份
  isRecent: true            // 是否为新近作品
}
```

## 🔧 高级功能

### 1. 缓存管理

```javascript
// 获取缓存统计信息
const stats = getAnimeModuleStats();
console.log('缓存统计:', stats);

// 清理缓存
clearAnimeCache();
```

### 2. 日志控制

```javascript
// 设置日志级别
setLogLevel('debug'); // 可选: error, warn, info, debug
```

### 3. 错误处理

```javascript
try {
  const anime = await bangumiHotNewAnime();
  console.log('获取成功:', anime.length, '项');
} catch (error) {
  console.error('获取失败:', error.message);
}
```

## 🎨 特色功能

### 1. 智能中文标题选择
- 优先选择包含中文字符的标题
- 支持多语言标题回退机制

### 2. 智能缓存系统
- LRU缓存算法
- 自动缓存过期管理
- 缓存命中率统计

### 3. 灵活的参数配置
- 支持多种排序方式
- 支持年份筛选
- 支持评分筛选
- 支持地区筛选

### 4. 数据优化
- 自动过滤无海报的项目
- 智能描述截断
- 类型信息格式化

## 🚀 性能优化

### 1. 缓存策略
- 30分钟数据缓存
- 类型数据24小时缓存
- LRU算法自动清理

### 2. 并发控制
- 最大并发数限制
- 请求频率控制
- 错误重试机制

### 3. 数据压缩
- 智能图片尺寸选择
- 描述文本截断
- 冗余数据过滤

## 🔍 调试和监控

### 1. 日志输出
```javascript
// 查看详细日志
setLogLevel('debug');

// 查看缓存统计
const stats = getAnimeModuleStats();
console.log('缓存统计:', JSON.stringify(stats, null, 2));
```

### 2. 性能监控
```javascript
// 监控缓存命中率
const stats = getAnimeModuleStats();
console.log(`缓存命中率: ${stats.animeCache.hitRate}`);
```

## 📝 注意事项

1. **API密钥配置**: 请确保正确配置TMDB API密钥
2. **网络环境**: 确保网络环境能够访问TMDB API
3. **请求限制**: 注意TMDB API的请求频率限制
4. **缓存管理**: 定期清理缓存以释放内存
5. **错误处理**: 建议添加适当的错误处理机制

## 🆘 常见问题

### Q: 如何获取TMDB API密钥？
A: 访问 https://www.themoviedb.org/settings/api 注册并获取API密钥

### Q: 为什么返回的数据为空？
A: 检查API密钥配置、网络连接和参数设置

### Q: 如何提高缓存命中率？
A: 合理设置缓存大小，避免频繁清理缓存

### Q: 支持哪些语言？
A: 支持TMDB API支持的所有语言，默认使用中文

## 📞 技术支持

如有问题或建议，请通过以下方式联系：

- 提交Issue到项目仓库
- 查看项目文档
- 参考示例代码

---

**版本**: 1.0.0  
**更新时间**: 2024年  
**兼容性**: Node.js 12+, 现代浏览器