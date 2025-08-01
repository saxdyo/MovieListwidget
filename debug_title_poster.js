// 调试标题海报问题
console.log("=== 标题海报问题调试脚本 ===");

// 模拟环境
const Widget = {
    tmdb: {
        get: async (endpoint, options) => {
            console.log(`[模拟] 调用 TMDB API: ${endpoint}`);
            // 返回模拟数据
            return {
                data: {
                    results: [
                        {
                            id: 1,
                            title: "测试电影",
                            name: "测试电影",
                            backdrop_path: "/test-backdrop.jpg",
                            poster_path: "/test-poster.jpg",
                            vote_average: 8.5,
                            release_date: "2024-01-01",
                            overview: "这是一个测试电影"
                        },
                        {
                            id: 2,
                            title: "测试剧集",
                            name: "测试剧集",
                            backdrop_path: null,
                            poster_path: "/test-poster2.jpg",
                            vote_average: 7.8,
                            first_air_date: "2024-01-15",
                            overview: "这是一个测试剧集"
                        }
                    ]
                }
            };
        }
    }
};

// 模拟 createTitlePosterWithOverlay 函数
async function createTitlePosterWithOverlay(item, options = {}) {
    try {
        const {
            title = item.title || item.name || "未知标题",
            subtitle = item.genreTitle || item.genre_title || "",
            rating = item.rating || item.vote_average || 0,
            year = item.year || (item.release_date ? item.release_date.substring(0, 4) : ""),
            showRating = true,
            showYear = true,
            overlayOpacity = 0.7,
            textColor = "#FFFFFF",
            backgroundColor = "rgba(0, 0, 0, 0.6)"
        } = options;
        
        // 获取背景图片
        let backgroundUrl = "";
        if (item.backdrop_path) {
            backgroundUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
        } else if (item.poster_path) {
            backgroundUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        } else if (item.backdropPath) {
            backgroundUrl = item.backdropPath;
        } else if (item.posterPath) {
            backgroundUrl = item.posterPath;
        } else {
            console.log(`[标题海报] 项目 ${title} 没有背景图片，跳过生成`);
            // 如果强制生成，使用默认背景
            if (options.forceGenerate) {
                backgroundUrl = "https://via.placeholder.com/1280x720/2c3e50/ffffff?text=No+Image";
                console.log(`[标题海报] 使用默认背景图片`);
            } else {
                return null;
            }
        }
        
        // 创建带标题覆盖的横版海报
        const titlePoster = {
            url: backgroundUrl,
            width: 1280,
            height: 720,
            type: "backdrop_with_title",
            title: title,
            subtitle: subtitle,
            rating: rating,
            year: year,
            showRating: showRating,
            showYear: showYear,
            overlayOpacity: overlayOpacity,
            textColor: textColor,
            backgroundColor: backgroundColor
        };
        
        console.log(`[横版海报] 生成带标题的横版海报: ${title}`);
        console.log(`[横版海报] 背景URL: ${backgroundUrl}`);
        console.log(`[横版海报] 项目数据:`, {
            title: item.title || item.name,
            backdrop_path: item.backdrop_path,
            poster_path: item.poster_path,
            backdropPath: item.backdropPath,
            posterPath: item.posterPath
        });
        return titlePoster;
    } catch (error) {
        console.error("[标题海报] 创建带覆盖的标题海报时出错:", error);
        return null;
    }
}

// 测试函数
async function testTitlePoster() {
    console.log("\n=== 测试标题海报生成 ===");
    
    // 测试1: 有背景图片的项目
    console.log("\n1. 测试有背景图片的项目:");
    const item1 = {
        title: "测试电影",
        backdrop_path: "/test-backdrop.jpg",
        poster_path: "/test-poster.jpg",
        vote_average: 8.5,
        release_date: "2024-01-01"
    };
    
    const titlePoster1 = await createTitlePosterWithOverlay(item1);
    console.log(`结果: ${titlePoster1 ? '成功' : '失败'}`);
    
    // 测试2: 只有海报图片的项目
    console.log("\n2. 测试只有海报图片的项目:");
    const item2 = {
        title: "测试剧集",
        backdrop_path: null,
        poster_path: "/test-poster2.jpg",
        vote_average: 7.8,
        first_air_date: "2024-01-15"
    };
    
    const titlePoster2 = await createTitlePosterWithOverlay(item2);
    console.log(`结果: ${titlePoster2 ? '成功' : '失败'}`);
    
    // 测试3: 没有任何图片的项目
    console.log("\n3. 测试没有任何图片的项目:");
    const item3 = {
        title: "无图片项目",
        backdrop_path: null,
        poster_path: null,
        vote_average: 6.5,
        release_date: "2024-02-01"
    };
    
    const titlePoster3 = await createTitlePosterWithOverlay(item3);
    console.log(`结果: ${titlePoster3 ? '成功' : '失败'}`);
    
    // 测试4: 强制生成
    console.log("\n4. 测试强制生成:");
    const titlePoster4 = await createTitlePosterWithOverlay(item3, { forceGenerate: true });
    console.log(`结果: ${titlePoster4 ? '成功' : '失败'}`);
}

// 运行测试
testTitlePoster().then(() => {
    console.log("\n=== 测试完成 ===");
}).catch(error => {
    console.error("测试出错:", error);
});