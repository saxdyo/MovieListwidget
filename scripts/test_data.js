#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 数据文件路径
const DATA_FILE = path.join(__dirname, '../data/TMDB_Trending.json');

function testDataFile() {
    console.log('🧪 开始测试 TMDB 数据文件...\n');
    
    // 检查文件是否存在
    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ 数据文件不存在:', DATA_FILE);
        console.log('请先运行生成脚本: npm run generate');
        return false;
    }
    
    try {
        // 读取并解析 JSON
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        console.log('✅ 数据文件格式正确');
        
        // 检查必需字段
        const requiredFields = ['last_updated', 'version', 'description', 'data', 'metadata', 'genres', 'config'];
        const missingFields = requiredFields.filter(field => !(field in data));
        
        if (missingFields.length > 0) {
            console.error('❌ 缺少必需字段:', missingFields);
            return false;
        }
        
        console.log('✅ 所有必需字段都存在');
        
        // 检查数据结构
        const { movies, tv_shows, people } = data.data;
        
        console.log(`📊 电影数量: ${movies.length}`);
        console.log(`📺 电视剧数量: ${tv_shows.length}`);
        console.log(`👥 演员数量: ${people.length}`);
        
        // 检查电影数据结构
        if (movies.length > 0) {
            const movie = movies[0];
            const movieFields = ['id', 'title', 'original_title', 'overview', 'poster_path', 'vote_average', 'media_type'];
            const missingMovieFields = movieFields.filter(field => !(field in movie));
            
            if (missingMovieFields.length > 0) {
                console.error('❌ 电影数据缺少字段:', missingMovieFields);
                return false;
            }
            
            console.log('✅ 电影数据结构正确');
        }
        
        // 检查电视剧数据结构
        if (tv_shows.length > 0) {
            const tvShow = tv_shows[0];
            const tvFields = ['id', 'name', 'original_name', 'overview', 'poster_path', 'vote_average', 'media_type'];
            const missingTvFields = tvFields.filter(field => !(field in tvShow));
            
            if (missingTvFields.length > 0) {
                console.error('❌ 电视剧数据缺少字段:', missingTvFields);
                return false;
            }
            
            console.log('✅ 电视剧数据结构正确');
        }
        
        // 检查元数据
        const metadata = data.metadata;
        console.log(`📈 总结果数: ${metadata.total_results}`);
        console.log(`📄 总页数: ${metadata.total_pages}`);
        console.log(`🕒 请求时间: ${metadata.request_time}`);
        
        // 检查类型映射
        const genres = data.genres;
        console.log(`🎭 类型数量: ${Object.keys(genres).length}`);
        
        // 检查配置
        const config = data.config;
        if (config && config.images) {
            console.log('✅ TMDB 配置信息完整');
        }
        
        // 显示示例数据
        console.log('\n📋 示例数据:');
        if (movies.length > 0) {
            const movie = movies[0];
            console.log(`🎬 电影: ${movie.title} (${movie.vote_average}/10)`);
        }
        
        if (tv_shows.length > 0) {
            const tvShow = tv_shows[0];
            console.log(`📺 电视剧: ${tvShow.name} (${tvShow.vote_average}/10)`);
        }
        
        console.log('\n✅ 所有测试通过！数据文件格式正确。');
        return true;
        
    } catch (error) {
        console.error('❌ 解析数据文件失败:', error.message);
        return false;
    }
}

// 模拟 Widget 使用场景
function simulateWidgetUsage() {
    console.log('\n🎯 模拟 Widget 使用场景...\n');
    
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        // 模拟加载数据
        console.log('1. 加载 TMDB 数据...');
        console.log(`   数据版本: ${data.version}`);
        console.log(`   更新时间: ${data.last_updated}`);
        
        // 模拟显示热门电影
        console.log('\n2. 显示热门电影:');
        data.data.movies.slice(0, 3).forEach((movie, index) => {
            console.log(`   ${index + 1}. ${movie.title} - ${movie.vote_average}/10`);
        });
        
        // 模拟显示热门电视剧
        console.log('\n3. 显示热门电视剧:');
        data.data.tv_shows.slice(0, 3).forEach((show, index) => {
            console.log(`   ${index + 1}. ${show.name} - ${show.vote_average}/10`);
        });
        
        // 模拟获取类型名称
        console.log('\n4. 获取电影类型:');
        if (data.data.movies.length > 0) {
            const movie = data.data.movies[0];
            const genres = movie.genre_ids.map(id => data.genres[id]).filter(Boolean);
            console.log(`   ${movie.title} 的类型: ${genres.join(', ')}`);
        }
        
        console.log('\n✅ Widget 使用场景模拟完成！');
        
    } catch (error) {
        console.error('❌ 模拟失败:', error.message);
    }
}

// 主函数
function main() {
    const success = testDataFile();
    
    if (success) {
        simulateWidgetUsage();
    } else {
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = {
    testDataFile,
    simulateWidgetUsage
};