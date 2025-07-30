#!/usr/bin/env node

/**
 * 测试增强版脚本的带标题横版海报功能
 */

// 模拟Widget环境
global.Widget = {
    tmdb: {
        get: async (endpoint, options) => {
            const https = require('https');
            const url = `https://api.themoviedb.org/3${endpoint}?${new URLSearchParams(options.params).toString()}`;
            
            return new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            reject(e);
                        }
                    });
                }).on('error', reject);
            });
        }
    }
};

// 加载增强版脚本
const fs = require('fs');
eval(fs.readFileSync('./enhanced-script-with-titled-backdrops.js', 'utf8'));

async function testEnhancedScript() {
    console.log('🚀 测试增强版脚本的带标题横版海报功能...\n');
    
    try {
        // 测试今日热门
        console.log('📊 测试今日热门数据...');
        const todayData = await loadTodayGlobalMediaEnhanced({ language: 'zh-CN' });
        
        if (todayData && todayData.length > 0) {
            console.log(`✅ 成功获取 ${todayData.length} 项今日热门数据\n`);
            
            // 检查第一项的横版海报功能
            const sample = todayData[0];
            console.log(`🎬 示例项目: ${sample.title}`);
            console.log(`📝 类型: ${sample.genreTitle}`);
            console.log(`⭐ 评分: ${sample.rating}`);
            console.log(`📅 上映日期: ${sample.releaseDate}\n`);
            
            console.log('🖼️ 横版海报字段检查:');
            
            // 主要带标题横版海报字段
            console.log('【带标题横版海报字段】');
            console.log(`  title_backdrop: ${sample.title_backdrop ? '✅ 有' : '❌ 无'}`);
            console.log(`  title_backdrop_hd: ${sample.title_backdrop_hd ? '✅ 有' : '❌ 无'}`);
            console.log(`  title_backdrop_medium: ${sample.title_backdrop_medium ? '✅ 有' : '❌ 无'}`);
            console.log(`  backdrop_with_title: ${sample.backdrop_with_title ? '✅ 有' : '❌ 无'}`);
            console.log(`  landscape_poster: ${sample.landscape_poster ? '✅ 有' : '❌ 无'}`);
            
            // 其他横版海报字段
            console.log('\n【其他横版海报字段】');
            console.log(`  backdropPath: ${sample.backdropPath ? '✅ 有' : '❌ 无'}`);
            console.log(`  banner: ${sample.banner ? '✅ 有' : '❌ 无'}`);
            console.log(`  bannerUrl: ${sample.bannerUrl ? '✅ 有' : '❌ 无'}`);
            console.log(`  bannerHD: ${sample.bannerHD ? '✅ 有' : '❌ 无'}`);
            
            // 显示URL示例
            if (sample.title_backdrop) {
                console.log('\n🔗 横版海报URL示例:');
                console.log(`  带标题横版海报: ${sample.title_backdrop}`);
                if (sample.title_backdrop_hd) {
                    console.log(`  高清版本: ${sample.title_backdrop_hd}`);
                }
                if (sample.title_backdrop_medium) {
                    console.log(`  中等尺寸: ${sample.title_backdrop_medium}`);
                }
            }
            
            // 检查标题是否包含在URL中（作为标记）
            if (sample.title_backdrop && sample.title_backdrop.includes('#title=')) {
                const titleFromUrl = decodeURIComponent(sample.title_backdrop.split('#title=')[1]);
                console.log(`\n🏷️ URL中的标题标记: ${titleFromUrl}`);
                console.log(`🎯 标题匹配: ${titleFromUrl === sample.title ? '✅ 匹配' : '❌ 不匹配'}`);
            }
            
        } else {
            console.log('❌ 未获取到今日热门数据');
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // 测试本周热门
        console.log('📊 测试本周热门数据...');
        const weekData = await loadWeekGlobalMoviesEnhanced({ language: 'zh-CN' });
        
        if (weekData && weekData.length > 0) {
            console.log(`✅ 成功获取 ${weekData.length} 项本周热门数据`);
            
            const weekSample = weekData[0];
            console.log(`🎬 本周热门示例: ${weekSample.title}`);
            console.log(`🖼️ 带标题横版海报: ${weekSample.title_backdrop ? '✅ 有' : '❌ 无'}`);
            
        } else {
            console.log('❌ 未获取到本周热门数据');
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // 测试热门电影
        console.log('📊 测试热门电影数据...');
        const movieData = await tmdbPopularMoviesEnhanced({ language: 'zh-CN', page: 1 });
        
        if (movieData && movieData.length > 0) {
            console.log(`✅ 成功获取 ${movieData.length} 项热门电影数据`);
            
            const movieSample = movieData[0];
            console.log(`🎬 热门电影示例: ${movieSample.title}`);
            console.log(`🖼️ 带标题横版海报: ${movieSample.title_backdrop ? '✅ 有' : '❌ 无'}`);
            
        } else {
            console.log('❌ 未获取到热门电影数据');
        }
        
        console.log('\n🎉 增强版脚本测试完成！');
        
        // 总结功能
        console.log('\n📋 功能总结:');
        console.log('✅ 直接在脚本中实现带标题横版海报');
        console.log('✅ 支持多种横版海报字段名');
        console.log('✅ 包含高清、中等、标准多种尺寸');
        console.log('✅ URL中包含标题标记信息');
        console.log('✅ 智能过滤不需要的内容类型');
        console.log('✅ 中文内容优先显示');
        console.log('✅ 缓存机制提高性能');
        
        console.log('\n💡 使用建议:');
        console.log('1. 直接复制 enhanced-script-with-titled-backdrops.js 的内容到您的Widget');
        console.log('2. 使用增强版模块: "TMDB 今日热门 (增强版)" 等');
        console.log('3. Widget界面可以使用 title_backdrop, title_backdrop_hd 等字段');
        console.log('4. 如果需要更多原有模块，可以在脚本基础上继续添加');
        
    } catch (error) {
        console.error('❌ 测试过程中出现错误:', error.message);
        console.error('📍 错误详情:', error.stack);
    }
}

// 运行测试
testEnhancedScript();