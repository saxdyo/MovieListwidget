// 测试剧集标题海报修复
console.log("=== 测试剧集标题海报修复 ===");

// 模拟环境
const Widget = {
    tmdb: {
        get: async (endpoint, options) => {
            console.log(`[模拟] 调用 TMDB API: ${endpoint}`);
            // 返回模拟剧集数据
            return {
                data: {
                    results: [
                        {
                            id: 1,
                            name: "测试剧集1",
                            title: null,
                            backdrop_path: "/tv-backdrop-1.jpg",
                            poster_path: "/tv-poster-1.jpg",
                            vote_average: 8.5,
                            first_air_date: "2024-01-01",
                            release_date: null,
                            media_type: "tv"
                        },
                        {
                            id: 2,
                            name: "测试剧集2",
                            title: null,
                            backdrop_path: null,
                            poster_path: "/tv-poster-2.jpg",
                            vote_average: 7.8,
                            first_air_date: "2024-01-15",
                            release_date: null,
                            media_type: "tv"
                        },
                        {
                            id: 3,
                            name: "测试剧集3",
                            title: null,
                            backdrop_path: null,
                            poster_path: null,
                            vote_average: 6.5,
                            first_air_date: "2024-02-01",
                            release_date: null,
                            media_type: "tv"
                        }
                    ]
                }
            };
        }
    }
};

// 模拟 createTitlePosterWithOverlay 函数（修复版本）
async function createTitlePosterWithOverlay(item, options = {}) {
    try {
        const {
            title = item.title || item.name || "未知标题",
            subtitle = item.genreTitle || item.genre_title || "",
            rating = item.rating || item.vote_average || 0,
            year = item.year || (item.release_date ? item.release_date.substring(0, 4) : "") || (item.first_air_date ? item.first_air_date.substring(0, 4) : ""),
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
            posterPath: item.posterPath,
            first_air_date: item.first_air_date,
            release_date: item.release_date,
            media_type: item.media_type
        });
        return titlePoster;
    } catch (error) {
        console.error("[标题海报] 创建带覆盖的标题海报时出错:", error);
        return null;
    }
}

// 测试函数
async function testTVShowTitlePoster() {
    console.log("\n=== 测试剧集标题海报生成 ===");
    
    // 测试1: 有背景图片的剧集
    console.log("\n1. 测试有背景图片的剧集:");
    const tvShow1 = {
        name: "测试剧集1",
        backdrop_path: "/tv-backdrop-1.jpg",
        poster_path: "/tv-poster-1.jpg",
        vote_average: 8.5,
        first_air_date: "2024-01-01",
        media_type: "tv"
    };
    
    const titlePoster1 = await createTitlePosterWithOverlay(tvShow1);
    console.log(`结果: ${titlePoster1 ? '成功' : '失败'}`);
    if (titlePoster1) {
        console.log(`   标题: ${titlePoster1.title}`);
        console.log(`   年份: ${titlePoster1.year}`);
    }
    
    // 测试2: 只有海报图片的剧集
    console.log("\n2. 测试只有海报图片的剧集:");
    const tvShow2 = {
        name: "测试剧集2",
        backdrop_path: null,
        poster_path: "/tv-poster-2.jpg",
        vote_average: 7.8,
        first_air_date: "2024-01-15",
        media_type: "tv"
    };
    
    const titlePoster2 = await createTitlePosterWithOverlay(tvShow2);
    console.log(`结果: ${titlePoster2 ? '成功' : '失败'}`);
    if (titlePoster2) {
        console.log(`   标题: ${titlePoster2.title}`);
        console.log(`   年份: ${titlePoster2.year}`);
    }
    
    // 测试3: 没有任何图片的剧集
    console.log("\n3. 测试没有任何图片的剧集:");
    const tvShow3 = {
        name: "测试剧集3",
        backdrop_path: null,
        poster_path: null,
        vote_average: 6.5,
        first_air_date: "2024-02-01",
        media_type: "tv"
    };
    
    const titlePoster3 = await createTitlePosterWithOverlay(tvShow3);
    console.log(`结果: ${titlePoster3 ? '成功' : '失败'}`);
    
    // 测试4: 强制生成剧集标题海报
    console.log("\n4. 测试强制生成剧集标题海报:");
    const titlePoster4 = await createTitlePosterWithOverlay(tvShow3, { forceGenerate: true });
    console.log(`结果: ${titlePoster4 ? '成功' : '失败'}`);
    if (titlePoster4) {
        console.log(`   标题: ${titlePoster4.title}`);
        console.log(`   年份: ${titlePoster4.year}`);
    }
    
    // 测试5: 对比电影和剧集的年份提取
    console.log("\n5. 对比电影和剧集的年份提取:");
    
    const movie = {
        title: "测试电影",
        backdrop_path: "/movie-backdrop.jpg",
        release_date: "2024-03-01",
        first_air_date: null,
        media_type: "movie"
    };
    
    const tvShow = {
        name: "测试剧集",
        backdrop_path: "/tv-backdrop.jpg",
        release_date: null,
        first_air_date: "2024-03-15",
        media_type: "tv"
    };
    
    const moviePoster = await createTitlePosterWithOverlay(movie);
    const tvPoster = await createTitlePosterWithOverlay(tvShow);
    
    console.log(`电影年份: ${moviePoster ? moviePoster.year : '失败'}`);
    console.log(`剧集年份: ${tvPoster ? tvPoster.year : '失败'}`);
}

// 运行测试
testTVShowTitlePoster().then(() => {
    console.log("\n=== 剧集标题海报测试完成 ===");
}).catch(error => {
    console.error("测试出错:", error);
});