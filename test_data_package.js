// 测试数据包加载
console.log("=== 测试数据包加载 ===");

// 模拟fetchSimpleData函数
async function fetchSimpleData() {
    const dataUrls = [
        "https://raw.githubusercontent.com/saxdyo/MovieListwidget/main/data/TMDB_Trending.json"
    ];
    
    for (const url of dataUrls) {
        try {
            console.log(`[数据包] 尝试获取: ${url}`);
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`[数据包] 获取成功`);
                console.log(`[数据包] 数据结构:`, Object.keys(data));
                
                if (data.today_global) {
                    console.log(`[数据包] 今日热门: ${data.today_global.length}项`);
                    if (data.today_global.length > 0) {
                        const firstItem = data.today_global[0];
                        console.log(`[数据包] 第一项:`, {
                            id: firstItem.id,
                            title: firstItem.title || firstItem.name,
                            media_type: firstItem.media_type,
                            poster_path: firstItem.poster_path,
                            backdrop_path: firstItem.backdrop_path
                        });
                    }
                }
                
                if (data.week_global_all) {
                    console.log(`[数据包] 本周热门: ${data.week_global_all.length}项`);
                }
                
                if (data.popular_movies) {
                    console.log(`[数据包] 热门电影: ${data.popular_movies.length}项`);
                }
                
                return data;
            }
        } catch (error) {
            console.log(`[数据包] 获取失败 ${url}: ${error.message}`);
        }
    }
    
    console.log("[数据包] 所有数据源都获取失败");
    return null;
}

// 模拟isValidTmdbData函数
function isValidTmdbData(data) {
    return data && (
        (Array.isArray(data.today_global) && data.today_global.length > 0) ||
        (Array.isArray(data.week_global_all) && data.week_global_all.length > 0) ||
        (Array.isArray(data.popular_movies) && data.popular_movies.length > 0)
    );
}

// 测试数据包加载
async function testDataPackage() {
    console.log("\n=== 开始测试数据包加载 ===");
    
    try {
        const data = await fetchSimpleData();
        
        if (data && isValidTmdbData(data)) {
            console.log("✅ 数据包加载成功且数据有效");
            
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
            console.log("❌ 数据包加载失败或数据无效");
        }
    } catch (error) {
        console.error("❌ 测试过程中出错:", error);
    }
}

// 运行测试
testDataPackage();