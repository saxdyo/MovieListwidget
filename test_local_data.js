// 测试本地数据包
console.log("=== 测试本地数据包 ===");

const fs = require('fs');
const path = require('path');

// 读取本地数据包
function testLocalDataPackage() {
    try {
        const dataPath = path.join(__dirname, 'data', 'TMDB_Trending.json');
        console.log(`[本地] 读取文件: ${dataPath}`);
        
        if (fs.existsSync(dataPath)) {
            const rawData = fs.readFileSync(dataPath, 'utf8');
            const data = JSON.parse(rawData);
            
            console.log(`[本地] 数据结构:`, Object.keys(data));
            
            if (data.today_global) {
                console.log(`[本地] 今日热门: ${data.today_global.length}项`);
                if (data.today_global.length > 0) {
                    const firstItem = data.today_global[0];
                    console.log(`[本地] 第一项:`, {
                        id: firstItem.id,
                        title: firstItem.title || firstItem.name,
                        media_type: firstItem.media_type,
                        poster_path: firstItem.poster_path,
                        backdrop_path: firstItem.backdrop_path
                    });
                }
            }
            
            if (data.week_global_all) {
                console.log(`[本地] 本周热门: ${data.week_global_all.length}项`);
            }
            
            if (data.popular_movies) {
                console.log(`[本地] 热门电影: ${data.popular_movies.length}项`);
            }
            
            // 检查数据有效性
            const isValid = data && (
                (Array.isArray(data.today_global) && data.today_global.length > 0) ||
                (Array.isArray(data.week_global_all) && data.week_global_all.length > 0) ||
                (Array.isArray(data.popular_movies) && data.popular_movies.length > 0)
            );
            
            if (isValid) {
                console.log("✅ 本地数据包有效");
                
                // 检查电影和剧集数据
                if (data.today_global) {
                    const movies = data.today_global.filter(item => item.media_type === 'movie');
                    const tvShows = data.today_global.filter(item => item.media_type === 'tv');
                    
                    console.log(`📽️ 电影数量: ${movies.length}`);
                    console.log(`📺 剧集数量: ${tvShows.length}`);
                    
                    // 检查海报路径
                    const itemsWithPoster = data.today_global.filter(item => item.poster_path);
                    console.log(`🖼️ 有海报的项目: ${itemsWithPoster.length}/${data.today_global.length}`);
                    
                    // 检查背景图路径
                    const itemsWithBackdrop = data.today_global.filter(item => item.backdrop_path);
                    console.log(`🎬 有背景图的项目: ${itemsWithBackdrop.length}/${data.today_global.length}`);
                }
            } else {
                console.log("❌ 本地数据包无效");
            }
        } else {
            console.log("❌ 本地数据包文件不存在");
        }
    } catch (error) {
        console.error("❌ 测试本地数据包时出错:", error);
    }
}

// 运行测试
testLocalDataPackage();