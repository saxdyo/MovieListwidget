// === 测试媒体类型横版标题海报 ===

// 模拟 Widget 对象
const Widget = {
    tmdb: {
        get: async (endpoint, options) => {
            console.log(`[模拟API] 调用: ${endpoint}`);
            return {
                results: [
                    // 电影示例
                    {
                        id: 123456,
                        title: "测试电影",
                        original_title: "Test Movie",
                        overview: "这是一个测试电影",
                        poster_path: "/test-movie-poster.jpg",
                        backdrop_path: "/test-movie-backdrop.jpg",
                        release_date: "2025-01-15",
                        vote_average: 8.5,
                        vote_count: 1250,
                        popularity: 95.6,
                        genre_ids: [28, 12, 16],
                        media_type: "movie"
                    },
                    // 剧集示例
                    {
                        id: 654321,
                        name: "测试剧集",
                        original_name: "Test TV Show",
                        overview: "这是一个测试剧集",
                        poster_path: "/test-tv-poster.jpg",
                        backdrop_path: "/test-tv-backdrop.jpg",
                        first_air_date: "2025-01-10",
                        vote_average: 8.7,
                        vote_count: 1560,
                        popularity: 92.4,
                        genre_ids: [18, 80, 9648],
                        origin_country: ["US"],
                        media_type: "tv"
                    }
                ]
            };
        }
    }
};

// 模拟 API_KEY
const API_KEY = "test_api_key";

// 模拟 createTitlePosterWithOverlay 函数
async function createTitlePosterWithOverlay(item, options = {}) {
    const {
        title = item.title || item.name || "未知标题",
        subtitle = item.genreTitle || item.genre_title || "",
        rating = item.rating || item.vote_average || 0,
        year = item.year || (item.release_date ? item.release_date.substring(0, 4) : "") || (item.first_air_date ? item.first_air_date.substring(0, 4) : ""),
        showRating = true,
        showYear = true,
        overlayOpacity = 0.7,
        textColor = "#FFFFFF",
        backgroundColor = "rgba(0, 0, 0, 0.6)",
        mediaType = item.mediaType || item.media_type || (item.name && !item.title ? "tv" : "movie")
    } = options;
    
    // 获取背景图片
    let backgroundUrl = "";
    if (item.backdrop_path) {
        backgroundUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
    } else if (item.poster_path) {
        backgroundUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    } else {
        console.log(`[标题海报] 项目 ${title} 没有背景图片，跳过生成`);
        return null;
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
        backgroundColor: backgroundColor,
        mediaType: mediaType
    };
    
    console.log(`[横版海报] 生成带标题的横版海报: ${title} (${mediaType})`);
    console.log(`[横版海报] 背景URL: ${backgroundUrl}`);
    console.log(`[横版海报] 项目数据:`, {
        title: item.title || item.name,
        backdrop_path: item.backdrop_path,
        poster_path: item.poster_path,
        first_air_date: item.first_air_date,
        release_date: item.release_date,
        media_type: item.media_type,
        mediaType: item.mediaType
    });
    return titlePoster;
}

// 模拟 batchProcessBackdrops 函数
async function batchProcessBackdrops(items, options = {}) {
    const {
        enableTitleOverlay = true,
        preferredSize = 'auto',
        includeMetadata = true,
        forceRegenerate = false,
        maxConcurrent = 3
    } = options;
    
    console.log(`[横版海报] 开始批量处理 ${items.length} 项横版海报...`);
    
    const results = [];
    
    for (const item of items) {
        try {
            // 生成带标题的横版海报
            const titlePoster = await createTitlePosterWithOverlay(item, {
                title: item.title || item.name,
                subtitle: item.genreTitle || item.genre_title || "",
                rating: item.vote_average || item.rating || 0,
                year: item.year || (item.release_date ? item.release_date.substring(0, 4) : "") || (item.first_air_date ? item.first_air_date.substring(0, 4) : ""),
                showRating: true,
                showYear: true,
                overlayOpacity: 0.7,
                textColor: "#FFFFFF",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                mediaType: item.mediaType || item.media_type || (item.name && !item.title ? "tv" : "movie")
            });
            
            const result = {
                id: item.id,
                title: item.title || item.name,
                backdropUrl: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
                titlePoster: titlePoster,
                mediaType: item.mediaType || item.media_type || (item.name && !item.title ? "tv" : "movie")
            };
            
            if (includeMetadata) {
                result.metadata = {
                    title: item.title || item.name,
                    year: item.release_date ? item.release_date.substring(0, 4) : (item.first_air_date ? item.first_air_date.substring(0, 4) : ""),
                    rating: item.vote_average || item.rating || 0,
                    mediaType: item.mediaType || item.media_type || (item.name && !item.title ? "tv" : "movie")
                };
            }
            
            console.log(`[横版海报] 完成处理: ${result.title} (${result.mediaType})`);
            results.push(result);
            
        } catch (error) {
            console.error(`[横版海报] 处理项目失败: ${item.title || item.name}`, error);
        }
    }
    
    console.log(`[横版海报] 批量处理完成: ${results.length} 项成功`);
    return results;
}

// 模拟 loadEnhancedTitlePosterWithBackdrops 函数
async function loadEnhancedTitlePosterWithBackdrops(items, maxItems = 30, contentType = "today") {
    console.log(`[增强横版标题海报] 立即生成横版标题海报...`);
    const processedItems = await batchProcessBackdrops(items.slice(0, maxItems), {
        enableTitleOverlay: true,
        preferredSize: 'w1280',
        includeMetadata: true,
        forceRegenerate: true,
        maxConcurrent: 5
    });
    
    if (processedItems.length > 0) {
        console.log(`[增强横版标题海报] 立即生成成功: ${processedItems.length}项`);
        
        return processedItems.map(item => ({
            id: item.id,
            title: item.title,
            posterPath: item.backdropUrl,
            titlePoster: item.titlePoster,
            metadata: item.metadata,
            mediaType: item.mediaType || item.media_type || (item.name && !item.title ? "tv" : "movie")
        }));
    } else {
        console.log(`[增强横版标题海报] 生成失败，使用普通数据`);
        return items.map(item => ({
            id: item.id,
            title: item.title || item.name,
            mediaType: item.mediaType || item.media_type || (item.name && !item.title ? "tv" : "movie")
        }));
    }
}

// 模拟 loadTmdbTitlePosterTrending 函数
async function loadTmdbTitlePosterTrending(params = {}) {
    let { 
        content_type = "today", 
        media_type = "all", 
        sort_by = "today", 
        language = "zh-CN", 
        page = 1,
        max_items = 30
    } = params;

    if (["today","week","popular","top_rated"].includes(sort_by)) {
        content_type = sort_by;
    }
    
    try {
        console.log(`[标题海报] 加载${content_type}内容，媒体类型: ${media_type}...`);
        
        // 模拟获取数据
        const res = await Widget.tmdb.get("/trending/all/day", { 
            params: { 
                language: 'zh-CN',
                region: 'CN',
                api_key: API_KEY,
                page: 1
            }
        });
        
        let results = res.results;
        
        // 根据媒体类型过滤结果
        if (media_type !== "all") {
            results = results.filter(item => {
                if (media_type === "movie") {
                    return item.media_type === "movie";
                } else if (media_type === "tv") {
                    return item.media_type === "tv";
                }
                return true;
            });
            console.log(`[标题海报] 媒体类型过滤后: ${results.length}项 (${media_type})`);
        }
        
        // 确保所有项目都有正确的媒体类型信息
        results = results.map(item => {
            // 确保 mediaType 字段存在
            if (!item.mediaType) {
                if (item.media_type) {
                    item.mediaType = item.media_type;
                } else if (item.name && !item.title) {
                    item.mediaType = "tv";
                } else {
                    item.mediaType = "movie";
                }
            }
            
            // 确保标题字段正确
            if (!item.title && item.name) {
                item.title = item.name;
            }
            
            // 确保年份字段正确
            if (!item.year) {
                if (item.release_date) {
                    item.year = item.release_date.substring(0, 4);
                } else if (item.first_air_date) {
                    item.year = item.first_air_date.substring(0, 4);
                }
            }
            
            return item;
        });
        
        // 限制返回数量
        results = results.slice(0, max_items);
        
        console.log(`[标题海报] 最终返回: ${results.length}项`);
        console.log(`[标题海报] 媒体类型分布:`, {
            movie: results.filter(item => item.mediaType === "movie").length,
            tv: results.filter(item => item.mediaType === "tv").length,
            all: results.length
        });
        
        // 调用横版标题海报生成
        const titlePosterResults = await loadEnhancedTitlePosterWithBackdrops(results, max_items, content_type);
        
        console.log(`[标题海报] 横版标题海报生成完成: ${titlePosterResults.length}项`);
        titlePosterResults.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.title} (${item.mediaType}) - 标题海报: ${item.titlePoster ? '成功' : '失败'}`);
        });
        
        return titlePosterResults;
        
    } catch (error) {
        console.error("Error in loadTmdbTitlePosterTrending:", error);
        return [];
    }
}

// 测试函数
async function testMediaTypeTitlePoster() {
    console.log("=== 测试媒体类型横版标题海报 ===\n");
    
    // 测试全部类型
    console.log("1. 测试全部类型 (all):");
    await loadTmdbTitlePosterTrending({ media_type: "all" });
    console.log("\n");
    
    // 测试电影类型
    console.log("2. 测试电影类型 (movie):");
    await loadTmdbTitlePosterTrending({ media_type: "movie" });
    console.log("\n");
    
    // 测试剧集类型
    console.log("3. 测试剧集类型 (tv):");
    await loadTmdbTitlePosterTrending({ media_type: "tv" });
    console.log("\n");
    
    console.log("=== 测试完成 ===");
}

// 运行测试
testMediaTypeTitlePoster().then(() => {
    console.log("所有测试完成");
}).catch(error => {
    console.error("测试过程中出现错误:", error);
});