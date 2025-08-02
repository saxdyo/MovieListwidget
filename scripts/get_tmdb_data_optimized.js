#!/usr/bin/env node
/**
 * 优化的TMDB数据获取脚本
 * Optimized TMDB Data Fetcher
 * 
 * 功能特性：
 * - 智能缓存和重试机制
 * - 并发请求优化
 * - 智能图片选择算法
 * - 中国网络环境优化
 * - 完整的错误处理
 * - 支持Node.js和浏览器环境
 */

// 配置
const CONFIG = {
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/",
  REQUEST_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  CACHE_DURATION: 15 * 60 * 1000, // 15分钟缓存
  MAX_ITEMS_PER_CATEGORY: 15,
  MAX_CONCURRENT: 3
};

// 日志工具
function log(message, level = 'info') {
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  switch (level) {
    case 'error':
      console.error(`${prefix} ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`);
      break;
    case 'debug':
      console.log(`${prefix} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

// LRU缓存实现
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      this.hits++;
      return value;
    } else {
      this.misses++;
      return undefined;
    }
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  stats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total).toFixed(2) : '0.00'
    };
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

// 并发池
class PromisePool {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.activeCount = 0;
    this.queue = [];
  }

  async run(fn) {
    return new Promise((resolve, reject) => {
      const task = () => {
        this.activeCount++;
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.activeCount--;
            this.processNext();
          });
      };

      if (this.activeCount < this.maxConcurrent) {
        task();
      } else {
        this.queue.push(task);
      }
    });
  }

  processNext() {
    if (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const task = this.queue.shift();
      task();
    }
  }

  async all(tasks) {
    const pool = new PromisePool(this.maxConcurrent);
    return Promise.all(tasks.map(task => pool.run(task)));
  }
}

// TMDB数据获取类
class OptimizedTMDBCrawler {
  constructor(apiKey = null) {
    this.apiKey = apiKey || CONFIG.TMDB_API_KEY;
    this.cache = new LRUCache(50);
    this.requestStats = {
      total: 0,
      success: 0,
      failed: 0,
      cached: 0
    };
    this.pool = new PromisePool(CONFIG.MAX_CONCURRENT);
  }

  // 智能请求方法
  async _makeRequest(endpoint, params = {}) {
    const cacheKey = `tmdb_${endpoint}_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
      this.requestStats.cached++;
      return cached.data;
    }

    if (!this.apiKey) {
      log("TMDB API密钥未设置", 'warn');
      return { results: [] };
    }

    const url = `${CONFIG.BASE_URL}${endpoint}`;
    const requestParams = { api_key: this.apiKey, ...params };

    for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
      try {
        this.requestStats.total++;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

        const response = await fetch(`${url}?${new URLSearchParams(requestParams)}`, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'TMDB-Crawler/2.0',
            'Accept': 'application/json'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // 缓存结果
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });

        this.requestStats.success++;
        return data;

      } catch (error) {
        log(`TMDB请求失败 (尝试 ${attempt}/${CONFIG.MAX_RETRIES}): ${error.message}`, 'error');
        
        if (attempt < CONFIG.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
        } else {
          this.requestStats.failed++;
          return { results: [] };
        }
      }
    }
  }

  // 获取热门数据
  async fetchTrendingData(timeWindow = "day", mediaType = "all") {
    const endpoint = mediaType === "all" 
      ? `/trending/all/${timeWindow}` 
      : `/trending/${mediaType}/${timeWindow}`;
    
    return await this._makeRequest(endpoint, { language: "zh-CN" });
  }

  // 获取热门电影
  async fetchPopularMovies(page = 1) {
    const data = await this._makeRequest("/movie/popular", {
      language: "zh-CN",
      region: "CN",
      page: page
    });

    if (data && data.results) {
      data.results = data.results.slice(0, CONFIG.MAX_ITEMS_PER_CATEGORY);
    }

    return data;
  }

  // 获取媒体详情
  async getMediaDetails(mediaType, mediaId) {
    return await this._makeRequest(`/${mediaType}/${mediaId}`, { language: "zh-CN" });
  }

  // 获取媒体图片
  async getMediaImages(mediaType, mediaId) {
    return await this._makeRequest(`/${mediaType}/${mediaId}/images`, {
      include_image_language: "zh,en,null"
    });
  }

  // 生成图片URL
  getImageUrl(path, size = "original") {
    if (!path) return "";
    return `${CONFIG.IMAGE_BASE_URL}${size}${path}`;
  }

  // 选择最佳标题背景图
  selectBestTitleBackdrop(imageData, mediaType = "movie") {
    const backdrops = imageData?.backdrops || [];
    const logos = imageData?.logos || [];
    
    // 优先选择logo（对于剧集）
    if (mediaType === "tv" && logos.length > 0) {
      return this._selectBestImage(logos, true);
    }
    
    // 选择最佳背景图
    return this._selectBestImage(backdrops, false);
  }

  // 智能图片选择算法
  _selectBestImage(images, preferLogos = false) {
    if (!images || images.length === 0) return "";

    const calculateScore = (image) => {
      // 语言优先级：中文 > 英文 > 无语言 > 其他
      const lang = image.iso_639_1;
      let langScore = 3;
      if (lang === "zh") langScore = 0;
      else if (lang === "en") langScore = 1;
      else if (lang === null) langScore = 2;

      // 评分（负值，越高越好）
      const voteScore = -(image.vote_average || 0);
      
      // 分辨率（负值，越高越好）
      const width = image.width || 0;
      const height = image.height || 0;
      const resolutionScore = -(width * height);

      // 宽高比（接近16:9更好）
      const aspectRatio = width / height;
      const aspectScore = -Math.abs(aspectRatio - 16/9);

      return [langScore, voteScore, resolutionScore, aspectScore];
    };

    const sortedImages = images.sort((a, b) => {
      const scoreA = calculateScore(a);
      const scoreB = calculateScore(b);
      
      for (let i = 0; i < scoreA.length; i++) {
        if (scoreA[i] !== scoreB[i]) {
          return scoreA[i] - scoreB[i];
        }
      }
      return 0;
    });

    const bestImage = sortedImages[0];
    return this.getImageUrl(bestImage.file_path);
  }

  // 处理媒体项目
  async processMediaItem(item, mediaType = null) {
    const title = item.title || item.name;
    const itemType = mediaType || item.media_type;
    
    if (itemType === "person") return null;

    const releaseDate = itemType === "tv" ? item.first_air_date : item.release_date;
    const overview = item.overview;
    const rating = Math.round(item.vote_average * 10) / 10;
    const mediaId = item.id;

    // 基础数据验证
    if (rating === 0 && !releaseDate && !overview && !item.poster_path) {
      return null;
    }

    const posterUrl = this.getImageUrl(item.poster_path, "w500");

    // 获取详细信息
    const [detailData, imageData] = await Promise.all([
      this.getMediaDetails(itemType, mediaId),
      this.getMediaImages(itemType, mediaId)
    ]);

    // 处理类型信息
    const genres = detailData?.genres || [];
    const genreTitle = genres.slice(0, 3).map(g => g.name).join("•");

    // 获取标题背景图
    const titleBackdropUrl = this.selectBestTitleBackdrop(imageData, itemType);

    return {
      id: mediaId,
      title: title,
      type: itemType,
      genreTitle: genreTitle,
      rating: rating,
      release_date: releaseDate,
      overview: overview,
      poster_url: posterUrl,
      title_backdrop: titleBackdropUrl
    };
  }

  // 批量处理TMDB数据
  async processTmdbData(data, mediaType = "all") {
    const results = [];
    const items = data?.results || [];

    // 使用并发池处理
    const tasks = items.map(item => () => this.processMediaItem(item, mediaType));
    const processedItems = await this.pool.all(tasks);
    
    for (const item of processedItems) {
      if (item) {
        results.push(item);
      }
    }

    return results;
  }

  // 获取统计数据
  getStats() {
    return {
      ...this.requestStats,
      cacheStats: this.cache.stats(),
      hitRate: this.requestStats.total > 0 
        ? (this.requestStats.cached / this.requestStats.total).toFixed(2) 
        : '0.00'
    };
  }

  // 清理缓存
  clearCache() {
    this.cache.clear();
  }
}

// 优化的TMDB数据获取主函数
async function fetchOptimizedTmdbData() {
  const crawler = new OptimizedTMDBCrawler();
  const beijingTime = new Date().toLocaleString("zh-CN", { 
    timeZone: "Asia/Shanghai",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  log("=== 开始执行优化的TMDB数据获取 ===", 'info');

  try {
    // 并发获取所有数据
    const [todayData, weekData, popularData] = await Promise.all([
      crawler.fetchTrendingData("day", "all"),
      crawler.fetchTrendingData("week", "all"),
      crawler.fetchPopularMovies(1)
    ]);

    // 处理数据
    const [todayProcessed, weekProcessed, popularProcessed] = await Promise.all([
      crawler.processTmdbData(todayData, "all"),
      crawler.processTmdbData(weekData, "all"),
      crawler.processTmdbData(popularData, "movie")
    ]);

    const result = {
      last_updated: beijingTime,
      today_global: todayProcessed,
      week_global_all: weekProcessed,
      popular_movies: popularProcessed
    };

    // 输出统计信息
    const stats = crawler.getStats();
    log(`✅ TMDB数据获取完成 - 请求: ${stats.total}, 成功: ${stats.success}, 缓存命中: ${stats.cached}`, 'info');
    log(`📊 缓存命中率: ${stats.hitRate}`, 'info');

    return result;

  } catch (error) {
    log(`❌ TMDB数据获取失败: ${error.message}`, 'error');
    return {
      last_updated: beijingTime,
      today_global: [],
      week_global_all: [],
      popular_movies: []
    };
  }
}

// 保存数据到JSON文件（Node.js环境）
async function saveTmdbDataToFile(data, filepath = "./data/TMDB_Trending.json") {
  if (typeof process === 'undefined') {
    log("浏览器环境，跳过文件保存", 'warn');
    return;
  }

  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // 确保目录存在
    const dir = path.dirname(filepath);
    await fs.mkdir(dir, { recursive: true });
    
    // 保存文件
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
    log(`✅ 数据已保存到: ${filepath}`, 'info');
    
  } catch (error) {
    log(`❌ 保存文件失败: ${error.message}`, 'error');
  }
}

// 打印结果
function printTrendingResults(results, sectionTitle) {
  log("", 'info');
  log(`================= ${sectionTitle} =================`, 'info');
  
  results.forEach((item, index) => {
    const title = item.title;
    const itemType = item.type;
    const rating = item.rating;
    const genreTitle = item.genreTitle;
    
    log(`${String(index + 1).padStart(2)}. ${title} (${itemType}) 评分: ${rating} | ${genreTitle}`, 'info');
  });
}

// 主执行函数
async function main() {
  try {
    const data = await fetchOptimizedTmdbData();
    
    // 打印结果
    printTrendingResults(data.today_global, "今日热门");
    printTrendingResults(data.week_global_all, "本周热门");
    
    if (data.popular_movies && data.popular_movies.length > 0) {
      printTrendingResults(data.popular_movies, "热门电影");
    }
    
    // 在Node.js环境中保存文件
    if (typeof process !== 'undefined') {
      await saveTmdbDataToFile(data);
    }
    
    log("================= 执行完成 =================", 'info');
    return data;
    
  } catch (error) {
    log(`❌ 主函数执行失败: ${error.message}`, 'error');
    throw error;
  }
}

// 导出函数（Node.js环境）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    OptimizedTMDBCrawler,
    fetchOptimizedTmdbData,
    saveTmdbDataToFile,
    main,
    CONFIG
  };
}

// 浏览器环境下的全局函数
if (typeof window !== 'undefined') {
  window.OptimizedTMDBCrawler = OptimizedTMDBCrawler;
  window.fetchOptimizedTmdbData = fetchOptimizedTmdbData;
  window.main = main;
}

// 如果直接运行此脚本
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(error => {
    log(`脚本执行失败: ${error.message}`, 'error');
    process.exit(1);
  });
}