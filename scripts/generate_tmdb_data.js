const fs = require('fs');
const path = require('path');

// TMDB API 配置
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'your_tmdb_api_key_here';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// 数据文件路径
const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(DATA_DIR, 'TMDB_Trending.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 获取 TMDB 趋势数据
async function fetchTMDBTrendingData() {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&language=zh-CN`);
        
        if (!response.ok) {
            throw new Error(`TMDB API 请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取 TMDB 数据失败:', error);
        return null;
    }
}

// 获取 TMDB 配置信息
async function fetchTMDBConfig() {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/configuration?api_key=${TMDB_API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`TMDB 配置请求失败: ${response.status}`);
        }
        
        const config = await response.json();
        return config;
    } catch (error) {
        console.error('获取 TMDB 配置失败:', error);
        return null;
    }
}

// 获取电影类型信息
async function fetchTMDBGenres() {
    try {
        const [movieGenres, tvGenres] = await Promise.all([
            fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=zh-CN`),
            fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=zh-CN`)
        ]);
        
        const movieGenresData = await movieGenres.json();
        const tvGenresData = await tvGenres.json();
        
        const genres = {};
        
        // 合并电影和电视剧类型
        movieGenresData.genres.forEach(genre => {
            genres[genre.id] = genre.name;
        });
        
        tvGenresData.genres.forEach(genre => {
            genres[genre.id] = genre.name;
        });
        
        return genres;
    } catch (error) {
        console.error('获取类型信息失败:', error);
        return {};
    }
}

// 处理数据并生成自定义格式
function processTMDBData(rawData, config, genres) {
    const movies = [];
    const tvShows = [];
    const people = [];
    
    rawData.results.forEach(item => {
        const processedItem = {
            id: item.id,
            poster_path: item.poster_path,
            backdrop_path: item.backdrop_path,
            vote_average: item.vote_average,
            vote_count: item.vote_count,
            popularity: item.popularity,
            genre_ids: item.genre_ids || [],
            adult: item.adult || false,
            original_language: item.original_language,
            media_type: item.media_type
        };
        
        if (item.media_type === 'movie') {
            movies.push({
                ...processedItem,
                title: item.title,
                original_title: item.original_title,
                overview: item.overview,
                release_date: item.release_date,
                video: item.video || false
            });
        } else if (item.media_type === 'tv') {
            tvShows.push({
                ...processedItem,
                name: item.name,
                original_name: item.original_name,
                overview: item.overview,
                first_air_date: item.first_air_date,
                origin_country: item.origin_country || []
            });
        } else if (item.media_type === 'person') {
            people.push({
                ...processedItem,
                name: item.name,
                original_name: item.original_name,
                profile_path: item.profile_path,
                known_for_department: item.known_for_department,
                gender: item.gender
            });
        }
    });
    
    return {
        movies,
        tv_shows: tvShows,
        people
    };
}

// 生成完整的数据包
function generateDataPackage(processedData, config, genres) {
    const now = new Date().toISOString();
    
    return {
        last_updated: now,
        version: "1.0.0",
        description: "TMDB Trending Movies and TV Shows Data",
        data: processedData,
        metadata: {
            total_results: processedData.movies.length + processedData.tv_shows.length + processedData.people.length,
            total_pages: 1,
            page: 1,
            source: "TMDB API",
            api_version: "3",
            request_time: now,
            cache_duration: 3600
        },
        genres: genres,
        config: config
    };
}

// 主函数
async function generateTMDBDataFile() {
    console.log('开始生成 TMDB 数据文件...');
    
    // 检查 API 密钥
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your_tmdb_api_key_here') {
        console.error('请设置 TMDB_API_KEY 环境变量');
        console.log('获取 API 密钥: https://www.themoviedb.org/settings/api');
        return;
    }
    
    try {
        // 并行获取所有数据
        const [trendingData, config, genres] = await Promise.all([
            fetchTMDBTrendingData(),
            fetchTMDBConfig(),
            fetchTMDBGenres()
        ]);
        
        if (!trendingData) {
            console.error('无法获取趋势数据');
            return;
        }
        
        // 处理数据
        const processedData = processTMDBData(trendingData, config, genres);
        
        // 生成数据包
        const dataPackage = generateDataPackage(processedData, config, genres);
        
        // 写入文件
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dataPackage, null, 2), 'utf8');
        
        console.log(`✅ 数据文件已生成: ${OUTPUT_FILE}`);
        console.log(`📊 包含 ${processedData.movies.length} 部电影`);
        console.log(`📺 包含 ${processedData.tv_shows.length} 部剧集`);
        console.log(`👥 包含 ${processedData.people.length} 位演员`);
        console.log(`🕒 更新时间: ${dataPackage.last_updated}`);
        
    } catch (error) {
        console.error('生成数据文件失败:', error);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    generateTMDBDataFile();
}

module.exports = {
    generateTMDBDataFile,
    fetchTMDBTrendingData,
    processTMDBData
};