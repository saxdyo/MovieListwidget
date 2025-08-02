# TMDB热门内容模块拆分说明

## 概述

本项目将 `Move_list 2.js` 脚本中的热门内容模块按内容类型拆分为独立的模块，提高代码的可维护性和复用性。

## 文件结构

```
├── tmdb_trending_modules.js          # 拆分后的核心模块
├── tmdb_trending_usage_example.js    # 使用示例
├── TMDB_TRENDING_MODULES_README.md   # 说明文档
└── Move_list 2.js                    # 原始脚本（保持不变）
```

## 模块拆分详情

### 1. 核心模块 (`tmdb_trending_modules.js`)

#### 基础配置
- `CONFIG`: 统一配置对象，包含缓存时间、最大条数、并发数等设置
- `LRUCache`: LRU缓存实现类
- 日志工具函数

#### 独立功能模块

##### 今日热门模块 (`loadTodayTrending`)
- **功能**: 加载今日热门数据
- **支持**: 全部内容、仅电影、仅剧集
- **API端点**: `/trending/all/day`, `/trending/movie/day`, `/trending/tv/day`

##### 本周热门模块 (`loadWeekTrending`)
- **功能**: 加载本周热门数据
- **支持**: 全部内容、仅电影、仅剧集
- **API端点**: `/trending/all/week`, `/trending/movie/week`, `/trending/tv/week`

##### 热门内容模块 (`loadPopularContent`)
- **功能**: 加载热门内容数据
- **支持**: 全部内容、仅电影、仅剧集
- **API端点**: `/movie/popular`, `/tv/popular`

##### 高分内容模块 (`loadTopRatedContent`)
- **功能**: 加载高分内容数据
- **支持**: 全部内容、仅电影、仅剧集
- **API端点**: `/movie/top_rated`, `/tv/top_rated`, `/discover/movie`, `/discover/tv`

#### 统一入口函数 (`loadTmdbTrendingByType`)
- **功能**: 根据内容类型调用对应的模块
- **参数**: `content_type` (today/week/popular/top_rated)

## 使用方法

### 1. 基础使用

```javascript
const TrendingModules = require('./tmdb_trending_modules.js');

// 加载今日热门（全部内容）
const todayResults = await TrendingModules.loadTodayTrending({
  media_type: "all",
  max_items: 20
});

// 加载今日热门（仅电影）
const todayMovies = await TrendingModules.loadTodayTrending({
  media_type: "movie",
  max_items: 15
});

// 加载今日热门（仅剧集）
const todayTV = await TrendingModules.loadTodayTrending({
  media_type: "tv",
  max_items: 15
});
```

### 2. 使用统一入口函数

```javascript
// 加载今日热门
const todayResults = await TrendingModules.loadTmdbTrendingByType({
  content_type: "today",
  media_type: "all",
  max_items: 20
});

// 加载本周热门
const weekResults = await TrendingModules.loadTmdbTrendingByType({
  content_type: "week",
  media_type: "all",
  max_items: 20
});

// 加载热门内容
const popularResults = await TrendingModules.loadTmdbTrendingByType({
  content_type: "popular",
  media_type: "all",
  max_items: 20
});

// 加载高分内容
const topRatedResults = await TrendingModules.loadTmdbTrendingByType({
  content_type: "top_rated",
  media_type: "all",
  max_items: 20
});
```

### 3. 缓存管理

```javascript
// 获取缓存数据
const cachedData = TrendingModules.getCachedTrendingData();

// 缓存新数据
TrendingModules.cacheTrendingData(newData);

// 获取背景图缓存
const backdropData = TrendingModules.getCachedBackdrop(key);

// 缓存背景图数据
TrendingModules.cacheBackdrop(key, data);
```

### 4. 日志管理

```javascript
// 输出不同级别的日志
TrendingModules.log("信息日志", "info");
TrendingModules.log("警告日志", "warn");
TrendingModules.log("错误日志", "error");
TrendingModules.log("调试日志", "debug");
```

### 5. 工具函数

```javascript
// 深拷贝对象
const clonedObj = TrendingModules.deepClone(originalObj);

// 数组去重
const uniqueArray = TrendingModules.uniqBy(array, item => item.id);
```

## 参数说明

### 通用参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `media_type` | string | "all" | 媒体类型：all/movie/tv |
| `language` | string | "zh-CN" | 语言设置 |
| `max_items` | number | 30 | 最大返回条数 |

### 特殊参数

| 模块 | 参数名 | 类型 | 默认值 | 说明 |
|------|--------|------|--------|------|
| 热门内容 | `page` | number | 1 | 页码 |
| 热门内容 | `content_type` | string | "popularity.desc" | 内容类型 |
| 高分内容 | `content_type` | string | "vote_average.desc" | 内容类型 |

## 返回数据格式

所有模块返回的数据格式统一：

```javascript
[
  {
    id: "123",
    title: "电影标题",
    description: "电影描述",
    mediaType: "movie", // 或 "tv"
    posterPath: "海报路径",
    backdropPath: "背景图路径",
    rating: "8.5",
    releaseDate: "2024-01-01",
    genreTitle: "动作,冒险"
  }
  // ... 更多项目
]
```

## 错误处理

所有模块都包含完善的错误处理：

```javascript
try {
  const results = await TrendingModules.loadTodayTrending(params);
  // 处理结果
} catch (error) {
  console.error("加载失败:", error);
  // 返回空数组作为默认值
}
```

## 性能优化

### 1. 缓存机制
- LRU缓存自动管理内存使用
- 缓存命中率统计
- 自动清理过期缓存

### 2. 并发控制
- 可配置的并发数限制
- 避免API请求过载

### 3. 数据去重
- 自动去除重复内容
- 基于ID的去重机制

## 扩展性

### 1. 添加新的内容类型
```javascript
// 在 loadTmdbTrendingByType 函数中添加新的 case
case "new_type":
  results = await loadNewTypeContent(params);
  break;
```

### 2. 自定义配置
```javascript
// 修改 CONFIG 对象
CONFIG.MAX_ITEMS = 50;
CONFIG.CACHE_DURATION = 60 * 60 * 1000; // 1小时
```

### 3. 添加新的API端点
```javascript
// 在对应模块中添加新的API端点
const newEndpoint = "/new/api/endpoint";
```

## 测试

运行使用示例：

```bash
node tmdb_trending_usage_example.js
```

## 注意事项

1. **依赖关系**: 模块依赖 `Move_list 2.js` 中的一些函数，如 `loadTmdbTrendingData`、`formatTmdbItem` 等
2. **API密钥**: 确保 `API_KEY` 已正确设置
3. **网络环境**: 需要稳定的网络连接访问TMDB API
4. **缓存策略**: 根据实际需求调整缓存时间和大小

## 版本历史

- **v1.0.0**: 初始版本，完成基础模块拆分
- 支持今日热门、本周热门、热门内容、高分内容四个模块
- 提供统一入口函数和独立模块函数
- 包含完整的缓存管理和错误处理

## 贡献

欢迎提交Issue和Pull Request来改进这个模块。