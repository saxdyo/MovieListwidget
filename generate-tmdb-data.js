#!/usr/bin/env node

/**
 * TMDB数据生成器 - 生成带标题横版海报的预处理数据
 * 用于Move_list 2.js的热门数据源
 * 
 * 使用方法：
 * 1. 设置TMDB API密钥
 * 2. 运行：node generate-tmdb-data.js
 * 3. 生成的数据保存到 data/TMDB_Trending.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const API_KEY = 'f3ae69ddca232b56265600eb919d46ab'; // 替换为你的TMDB API密钥
const OUTPUT_DIR = './data';
const OUTPUT_FILE = 'TMDB_Trending.json';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// HTTP请求封装
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error(`JSON解析失败: ${error.message}`));
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// 构建TMDB API URL
function buildTmdbUrl(endpoint, params = {}) {
    const baseUrl = 'https://api.themoviedb.org/3';
    const defaultParams = {
        api_key: API_KEY,
        language: 'zh-CN',
        region: 'CN'
    };
    
    const allParams = { ...defaultParams, ...params };
    const queryString = Object.entries(allParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    
    return `${baseUrl}${endpoint}?${queryString}`;
}

// 优先选择中文内容
function pickChineseContent(primaryCN, secondaryCN, primaryEN, secondaryEN, fallback = '') {
    if (primaryCN && /[\u4e00-\u9fa5]/.test(primaryCN)) return primaryCN;
    if (secondaryCN && /[\u4e00-\u9fa5]/.test(secondaryCN)) return secondaryCN;
    if (primaryEN && primaryEN.trim()) return primaryEN;
    if (secondaryEN && secondaryEN.trim()) return secondaryEN;
    return fallback;
}

// 处理单个媒体项目
function processMediaItem(item, genreMap) {
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    const releaseDate = item.release_date || item.first_air_date || '';
    const year = releaseDate ? releaseDate.substring(0, 4) : '';
    
    // 优先使用中文标题
    const title = pickChineseContent(
        item.title,
        item.name,
        item.original_title,
        item.original_name,
        '未知标题'
    );
    
    // 简介处理
    const overview = item.overview && item.overview.trim() ? 
        (item.overview.length > 200 ? item.overview.substring(0, 197) + '...' : item.overview) : 
        '暂无简介';
    
    // 生成类型标签
    let genreTitle = mediaType === 'movie' ? '电影' : '剧集';
    if (item.genre_ids && item.genre_ids.length > 0 && genreMap[mediaType]) {
        const genres = genreMap[mediaType];
        const genreNames = item.genre_ids
            .slice(0, 2)
            .map(id => genres[id])
            .filter(Boolean);
        if (genreNames.length > 0) {
            genreTitle = genreNames.join('•');
        }
    }
    
    return {
        id: item.id,
        title: title,
        genreTitle: genreTitle,
        rating: parseFloat((item.vote_average || 0).toFixed(1)),
        overview: overview,
        release_date: releaseDate,
        year: year ? parseInt(year) : null,
        
        // 多种尺寸图片URL
        poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
        poster_hd: item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : '',
        
        // 横版海报（用于标题展示）
        title_backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
        title_backdrop_hd: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : '',
        backdrop_w780: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : '',
        
        // 附加信息
        type: mediaType,
        popularity: item.popularity || 0,
        vote_count: item.vote_count || 0,
        adult: item.adult || false,
        original_language: item.original_language || 'unknown'
    };
}

// 过滤和质量控制
function filterAndSortItems(items) {
    // 过滤不需要的内容类型
    const unwantedGenreIds = [10764, 10767, 10763, 99]; // 真人秀、脱口秀、新闻、纪录片
    const unwantedKeywords = ['综艺', '真人秀', '脱口秀', '访谈', '节目', '纪录片', '新闻', '短剧'];
    
    return items
        .filter(item => {
            // 必须有海报和横版海报
            if (!item.poster_path || !item.backdrop_path) return false;
            
            // 必须有标题
            if (!item.title && !item.name) return false;
            
            // 过滤不需要的类型
            if (item.genre_ids && item.genre_ids.some(id => unwantedGenreIds.includes(id))) return false;
            
            // 过滤不需要的关键词
            const title = (item.title || item.name || '').toLowerCase();
            const overview = (item.overview || '').toLowerCase();
            if (unwantedKeywords.some(keyword => title.includes(keyword) || overview.includes(keyword))) return false;
            
            return true;
        })
        .sort((a, b) => {
            // 按人气和评分排序
            const scoreA = (a.popularity || 0) * 0.6 + (a.vote_average || 0) * 0.4;
            const scoreB = (b.popularity || 0) * 0.6 + (b.vote_average || 0) * 0.4;
            return scoreB - scoreA;
        });
}

// 主要数据生成函数
async function generateTmdbData() {
    console.log('开始生成TMDB热门数据...');
    
    try {
        // 获取类型映射
        console.log('获取类型映射...');
        const [movieGenres, tvGenres] = await Promise.all([
            makeRequest(buildTmdbUrl('/genre/movie/list')),
            makeRequest(buildTmdbUrl('/genre/tv/list'))
        ]);
        
        const genreMap = {
            movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
            tv: tvGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {})
        };
        
        // 并行获取所有数据
        console.log('获取热门数据...');
        const [todayTrending, weekTrending, popularMovies, popularTVShows] = await Promise.all([
            makeRequest(buildTmdbUrl('/trending/all/day')),
            makeRequest(buildTmdbUrl('/trending/all/week')),
            makeRequest(buildTmdbUrl('/movie/popular')),
            makeRequest(buildTmdbUrl('/tv/popular'))
        ]);
        
        console.log('处理数据...');
        
        // 处理并过滤数据
        const today_global = filterAndSortItems(todayTrending.results)
            .slice(0, 20)
            .map(item => processMediaItem(item, genreMap));
        
        const week_global_all = filterAndSortItems(weekTrending.results)
            .slice(0, 20)
            .map(item => processMediaItem(item, genreMap));
        
        const popular_movies = filterAndSortItems(popularMovies.results)
            .slice(0, 15)
            .map(item => processMediaItem(item, genreMap));
        
        const popular_tv_shows = filterAndSortItems(popularTVShows.results)
            .slice(0, 15)
            .map(item => processMediaItem(item, genreMap));
        
        // 生成最终数据
        const finalData = {
            generated_at: new Date().toISOString(),
            data_version: '2.0',
            description: '带标题横版海报的TMDB热门数据',
            
            today_global,
            week_global_all,
            popular_movies,
            popular_tv_shows,
            
            // 统计信息
            stats: {
                today_count: today_global.length,
                week_count: week_global_all.length,
                movies_count: popular_movies.length,
                tv_shows_count: popular_tv_shows.length,
                total_count: today_global.length + week_global_all.length + popular_movies.length + popular_tv_shows.length
            }
        };
        
        // 保存数据
        const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
        fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf8');
        
        console.log(`✅ 数据生成完成！`);
        console.log(`📊 统计信息:`);
        console.log(`   - 今日热门: ${finalData.stats.today_count}个`);
        console.log(`   - 本周热门: ${finalData.stats.week_count}个`);
        console.log(`   - 热门电影: ${finalData.stats.movies_count}个`);
        console.log(`   - 热门剧集: ${finalData.stats.tv_shows_count}个`);
        console.log(`   - 总计: ${finalData.stats.total_count}个`);
        console.log(`📁 输出文件: ${outputPath}`);
        
        return finalData;
        
    } catch (error) {
        console.error('❌ 数据生成失败:', error.message);
        throw error;
    }
}

// 验证生成的数据
function validateData(data) {
    const requiredFields = ['today_global', 'week_global_all', 'popular_movies'];
    
    for (const field of requiredFields) {
        if (!data[field] || !Array.isArray(data[field]) || data[field].length === 0) {
            throw new Error(`数据验证失败: ${field} 字段无效`);
        }
        
        // 验证每个项目的必需字段
        for (const item of data[field]) {
            if (!item.id || !item.title || !item.poster_url || !item.title_backdrop) {
                throw new Error(`数据验证失败: 项目缺少必需字段 (${JSON.stringify(item)})`);
            }
        }
    }
    
    console.log('✅ 数据验证通过');
    return true;
}

// 主程序
async function main() {
    try {
        console.log('🚀 TMDB数据生成器启动');
        console.log(`📝 API密钥: ${API_KEY.substring(0, 8)}...`);
        console.log(`📂 输出目录: ${OUTPUT_DIR}`);
        
        const data = await generateTmdbData();
        validateData(data);
        
        console.log('🎉 所有任务完成！');
        
    } catch (error) {
        console.error('💥 程序执行失败:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = {
    generateTmdbData,
    validateData,
    processMediaItem,
    filterAndSortItems
};