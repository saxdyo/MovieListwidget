const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY environment variable is required');
    process.exit(1);
}

// 创建数据目录
async function ensureDataDir() {
    const dataDir = path.join(__dirname, '..', 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
    return dataDir;
}

// 获取TMDB数据
async function fetchTMDBData(endpoint, params = {}) {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'zh-CN',
                ...params
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.message);
        return null;
    }
}

// 获取类型映射
async function getGenreMap() {
    const [movieGenres, tvGenres] = await Promise.all([
        fetchTMDBData('/genre/movie/list'),
        fetchTMDBData('/genre/tv/list')
    ]);
    
    return {
        movie: movieGenres?.genres?.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}) || {},
        tv: tvGenres?.genres?.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}) || {}
    };
}

// 处理媒体项目
function processMediaItems(items, genreMap, forceType = null) {
    return items
        .filter(item => item.poster_path && item.backdrop_path && (item.title || item.name))
        .map(item => {
            const mediaType = forceType || item.media_type || (item.title ? 'movie' : 'tv');
            const releaseDate = item.release_date || item.first_air_date || '';
            const year = releaseDate ? releaseDate.substring(0, 4) : '';
            
            // 生成类型标签
            const genreTitle = item.genre_ids ? 
                item.genre_ids.slice(0, 2)
                    .map(id => genreMap[mediaType]?.[id] || '')
                    .filter(Boolean)
                    .join('•') : '';
            
            return {
                id: item.id,
                title: item.title || item.name,
                genreTitle: genreTitle,
                rating: item.vote_average || 0,
                overview: item.overview || '',
                release_date: releaseDate,
                year: year ? parseInt(year) : null,
                poster_url: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                title_backdrop: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
                type: mediaType
            };
        });
}

// 主函数
async function generateTrendingData() {
    console.log('开始生成TMDB热门数据...');
    
    try {
        // 获取类型映射
        const genreMap = await getGenreMap();
        
        // 并行获取数据
        const [todayTrending, weekTrending, popularMovies] = await Promise.all([
            fetchTMDBData('/trending/all/day'),
            fetchTMDBData('/trending/all/week'),
            fetchTMDBData('/movie/popular')
        ]);
        
        if (!todayTrending || !weekTrending || !popularMovies) {
            throw new Error('Failed to fetch required data from TMDB');
        }
        
        // 处理数据
        const data = {
            today_global: processMediaItems(todayTrending.results.slice(0, 20), genreMap),
            week_global_all: processMediaItems(weekTrending.results.slice(0, 20), genreMap),
            popular_movies: processMediaItems(popularMovies.results.slice(0, 15), genreMap, 'movie')
        };
        
        // 保存数据
        const dataDir = await ensureDataDir();
        const filePath = path.join(dataDir, 'TMDB_Trending.json');
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        
        console.log(`数据生成完成:`);
        console.log(`- 今日热门: ${data.today_global.length} 项`);
        console.log(`- 本周热门: ${data.week_global_all.length} 项`);
        console.log(`- 热门电影: ${data.popular_movies.length} 项`);
        console.log(`文件保存至: ${filePath}`);
        
    } catch (error) {
        console.error('生成数据时发生错误:', error);
        process.exit(1);
    }
}

// 运行脚本
if (require.main === module) {
    generateTrendingData();
}

module.exports = { generateTrendingData };