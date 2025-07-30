# TMDB数据拉取和横版海报生成系统

## 概述

这个增强的TMDB数据处理系统为Movie List Widget提供了强大的热门数据拉取和高质量横版海报生成功能。系统支持多种尺寸的横版海报、智能缓存、数据质量优化和带标题叠加效果。

## 主要特性

### 🖼️ 横版海报功能
- **多尺寸支持**: w300, w780, w1280, original
- **智能尺寸选择**: 根据设备屏幕自动选择最佳尺寸
- **标题叠加效果**: CSS支持的标题覆盖层
- **质量评估**: 自动评估和优化海报质量

### 🚀 数据处理增强
- **多数据源**: 支持预处理数据和实时API降级
- **智能缓存**: 30分钟智能缓存机制
- **中文优先**: 优先显示中文标题和简介
- **内容过滤**: 自动过滤综艺、纪录片等不需要的内容

### 📊 数据来源
- 今日热门影视
- 本周热门影视  
- 热门电影
- 热门剧集

## 系统架构

```
┌─────────────────────────────────────────┐
│            Widget Interface            │
├─────────────────────────────────────────┤
│         Enhanced Data Loader           │
├─────────────────────────────────────────┤
│    ┌─────────────┐  ┌─────────────────┐ │
│    │ Preprocess  │  │   Real-time     │ │
│    │ Data Source │  │   TMDB API      │ │
│    └─────────────┘  └─────────────────┘ │
├─────────────────────────────────────────┤
│         Backdrop Tools              │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ │
│  │Smart Size │ │ Quality  │ │  Cache   │ │
│  │ Selection │ │ Optimizer│ │ Manager  │ │
│  └───────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────┘
```

## 快速开始

### 1. 基础使用

```javascript
// 获取今日热门（自动使用横版海报）
const todayMovies = await loadTodayGlobalMedia({
    language: "zh-CN"
});

// 每个项目包含多种尺寸的横版海报
todayMovies.forEach(item => {
    console.log(item.title);
    console.log(item.backdropPath);     // 主要横版海报 (w1280)
    console.log(item.backdropHD);       // 高清横版海报 (original)
    console.log(item.backdrop780);      // 中等尺寸横版海报 (w780)
});
```

### 2. 自定义横版海报

```javascript
// 智能横版海报生成
const backdropUrl = createSmartBackdropUrl(item, 'auto');

// 带标题叠加的横版海报
const backdropWithTitle = generateBackdropWithTitleOverlay(item, {
    titlePosition: 'bottom-left',
    titleColor: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    fontSize: '24px'
});
```

### 3. 批量处理横版海报

```javascript
// 批量处理多个项目的横版海报
const processedBackdrops = await batchProcessBackdrops(items, {
    enableTitleOverlay: true,
    preferredSize: 'large',
    includeMetadata: true
});
```

## 数据生成器使用

### 1. 安装和配置

```bash
# 克隆项目
git clone <your-repo>
cd <your-repo>

# 设置API密钥（在generate-tmdb-data.js中）
const API_KEY = 'your_tmdb_api_key_here';
```

### 2. 生成预处理数据

```bash
# 运行数据生成器
node generate-tmdb-data.js
```

生成的数据将保存到 `data/TMDB_Trending.json`，包含：

```json
{
  "generated_at": "2024-01-01T00:00:00.000Z",
  "data_version": "2.0",
  "description": "带标题横版海报的TMDB热门数据",
  "today_global": [...],
  "week_global_all": [...],
  "popular_movies": [...],
  "popular_tv_shows": [...],
  "stats": {
    "today_count": 20,
    "week_count": 20,
    "movies_count": 15,
    "tv_shows_count": 15,
    "total_count": 70
  }
}
```

### 3. 部署数据文件

将生成的 `TMDB_Trending.json` 上传到你的GitHub仓库的 `data/` 目录，然后更新 `Move_list 2.js` 中的数据源URL。

## API参考

### 主要函数

#### `loadTmdbTrendingData()`
加载TMDB热门数据，优先使用预处理数据源，降级到实时API。

#### `generateEnhancedTrendingData()`
使用实时TMDB API生成增强的热门数据。

#### `processEnhancedMediaItems(items, genreMap, forceType)`
处理媒体项目，生成多种尺寸的图片URL和增强的元数据。

#### `createEnhancedWidgetItem(item)`
将处理后的数据转换为Widget标准格式。

### 横版海报工具

#### `createSmartBackdropUrl(item, preferredSize)`
- `item`: 媒体项目对象
- `preferredSize`: 'auto' | 'small' | 'medium' | 'large' | 'original'

#### `generateBackdropWithTitleOverlay(item, options)`
选项参数：
- `titlePosition`: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
- `titleColor`: CSS颜色值
- `backgroundColor`: CSS背景颜色
- `fontSize`: CSS字体大小
- `fontWeight`: CSS字体重量

#### `batchProcessBackdrops(items, options)`
批量处理选项：
- `enableTitleOverlay`: 是否启用标题叠加
- `preferredSize`: 首选尺寸
- `includeMetadata`: 是否包含元数据

### 缓存管理

#### `cacheBackdrop(key, data)`
缓存横版海报数据。

#### `getCachedBackdrop(key, maxAge)`
获取缓存的横版海报数据。

## 配置选项

### 数据源配置

```javascript
// 在 loadTmdbTrendingData() 中配置多个数据源
const dataSources = [
    "https://raw.githubusercontent.com/saxdyo/MovieListwidget/main/data/TMDB_Trending.json",
    "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/TMDB_Trending.json"
];
```

### 缓存配置

```javascript
// 缓存持续时间（毫秒）
const TRENDING_CACHE_DURATION = 30 * 60 * 1000; // 30分钟

// 横版海报缓存大小
const BACKDROP_CACHE_SIZE = 100;
```

### 内容过滤配置

```javascript
// 过滤的类型ID
const unwantedGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片

// 过滤的关键词
const unwantedKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻', '短剧'];
```

## 横版海报尺寸说明

| 尺寸标识 | TMDB规格 | 宽度 | 适用场景 |
|---------|----------|------|----------|
| w300 | w300 | 300px | 移动设备小图 |
| w780 | w780 | 780px | 平板和中等屏幕 |
| w1280 | w1280 | 1280px | 桌面和大屏幕 |
| original | original | 原始尺寸 | 高清显示 |

## 数据结构

### 增强的媒体项目

```javascript
{
  id: 12345,
  title: "电影标题",
  genreTitle: "动作•科幻",
  rating: 8.5,
  overview: "电影简介...",
  release_date: "2024-01-01",
  year: 2024,
  
  // 海报URL
  poster_url: "https://image.tmdb.org/t/p/w500/poster.jpg",
  poster_hd: "https://image.tmdb.org/t/p/w780/poster.jpg",
  
  // 横版海报URL（多种尺寸）
  title_backdrop: "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
  title_backdrop_hd: "https://image.tmdb.org/t/p/original/backdrop.jpg",
  backdrop_w780: "https://image.tmdb.org/t/p/w780/backdrop.jpg",
  
  // 附加信息
  type: "movie",
  popularity: 1234.5,
  vote_count: 5678,
  adult: false,
  original_language: "en"
}
```

## 性能优化

### 缓存策略
- **内存缓存**: 热门数据缓存30分钟
- **横版海报缓存**: LRU缓存，最多100项
- **智能预加载**: 根据用户行为预加载相关数据

### 网络优化
- **并行请求**: 同时请求多个数据源
- **降级机制**: 预处理数据 → 实时API → 缓存数据
- **超时控制**: 8秒超时，快速降级

### 图片优化
- **智能尺寸**: 根据设备自动选择最佳尺寸
- **质量评估**: 基于人气、评分、投票数等指标
- **懒加载支持**: 提供多种尺寸便于实现懒加载

## 故障排除

### 常见问题

1. **数据获取失败**
   - 检查TMDB API密钥是否有效
   - 确认网络连接正常
   - 查看控制台错误信息

2. **横版海报显示问题**
   - 检查图片URL是否正确
   - 确认TMDB图片服务可访问
   - 尝试不同的尺寸选项

3. **缓存问题**
   - 清除浏览器缓存
   - 重启应用程序
   - 检查缓存配置

### 调试模式

```javascript
// 启用调试日志
const DEBUG_MODE = true;

if (DEBUG_MODE) {
    console.log("[调试] 数据加载状态");
    console.log("[调试] 横版海报URL:", backdropUrl);
    console.log("[调试] 缓存命中:", cacheHit);
}
```

## 更新日志

### v2.0.0 (当前版本)
- ✨ 新增增强的TMDB数据拉取系统
- 🖼️ 新增多尺寸横版海报支持
- 💾 新增智能缓存机制
- 🎨 新增标题叠加效果
- 🚀 新增质量优化器
- 📊 新增数据生成器工具

### v1.0.0
- 基础TMDB数据拉取功能
- 简单横版海报支持

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

- 作者: saxdyo
- 项目地址: https://github.com/saxdyo/MovieListwidget
- 问题反馈: [GitHub Issues](https://github.com/saxdyo/MovieListwidget/issues)