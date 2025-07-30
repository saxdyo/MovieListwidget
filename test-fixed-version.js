#!/usr/bin/env node

/**
 * 测试修复版的横版海报字段映射
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

// 加载修复版功能
const fs = require('fs');
eval(fs.readFileSync('./Move_list_2_Fixed.js', 'utf8'));

async function testFixedVersion() {
    console.log('🔧 测试修复版横版海报字段映射...\n');
    
    try {
        // 获取数据
        console.log('📊 获取今日热门数据...');
        const todayData = await loadTodayGlobalMediaFixed({ language: 'zh-CN' });
        
        if (todayData && todayData.length > 0) {
            console.log(`✅ 成功获取 ${todayData.length} 项数据\n`);
            
            // 检查第一项的所有横版海报字段
            const sample = todayData[0];
            console.log(`🎬 示例项目: ${sample.title}\n`);
            
            console.log('🖼️ 横版海报字段检查:');
            
            // 主要字段
            const mainFields = ['backdropPath', 'backdrop', 'backgroundPath'];
            mainFields.forEach(field => {
                console.log(`  ${field}: ${sample[field] ? '✅ 有' : '❌ 无'}`);
            });
            
            // 横幅字段
            const bannerFields = ['banner', 'bannerUrl', 'bannerHD', 'bannerMedium'];
            bannerFields.forEach(field => {
                console.log(`  ${field}: ${sample[field] ? '✅ 有' : '❌ 无'}`);
            });
            
            // 缩略图字段
            const thumbnailFields = ['thumbnail', 'thumbnailUrl', 'thumbnailHD'];
            thumbnailFields.forEach(field => {
                console.log(`  ${field}: ${sample[field] ? '✅ 有' : '❌ 无'}`);
            });
            
            // 通用图片字段
            const generalFields = ['image', 'photo', 'picture'];
            generalFields.forEach(field => {
                console.log(`  ${field}: ${sample[field] ? '✅ 有' : '❌ 无'}`);
            });
            
            // 高级字段
            const advancedFields = ['landscapeImage', 'wideImage', 'heroImage'];
            advancedFields.forEach(field => {
                console.log(`  ${field}: ${sample[field] ? '✅ 有' : '❌ 无'}`);
            });
            
            // 统计有横版海报的字段数量
            const allBackdropFields = [
                ...mainFields, ...bannerFields, ...thumbnailFields, 
                ...generalFields, ...advancedFields,
                'backdropHD', 'backdropOriginal', 'backdrop780', 'backdropMedium'
            ];
            
            const availableFields = allBackdropFields.filter(field => sample[field]);
            
            console.log(`\n📊 统计结果:`);
            console.log(`  总横版海报字段数: ${allBackdropFields.length}`);
            console.log(`  可用字段数: ${availableFields.length}`);
            console.log(`  覆盖率: ${Math.round(availableFields.length / allBackdropFields.length * 100)}%`);
            
            console.log(`\n✅ 可用的横版海报字段:`);
            availableFields.forEach(field => {
                console.log(`  - ${field}`);
            });
            
            // 显示URL示例
            if (sample.backdropPath) {
                console.log(`\n🔗 横版海报URL示例:`);
                console.log(`  标准: ${sample.backdropPath}`);
                if (sample.backdropHD) console.log(`  高清: ${sample.backdropHD}`);
                if (sample.backdrop780) console.log(`  中等: ${sample.backdrop780}`);
            }
            
        } else {
            console.log('❌ 未获取到数据');
        }
        
        console.log('\n🎉 修复版测试完成！');
        console.log('\n💡 使用说明:');
        console.log('1. Widget界面现在可以使用任何一个横版海报字段名');
        console.log('2. 推荐使用: backdropPath, backdrop, banner 或 image');
        console.log('3. 如果需要高清图片，使用: backdropHD 或 bannerHD');
        console.log('4. 所有字段都指向同一个横版海报URL');
        
    } catch (error) {
        console.error('❌ 测试过程中出现错误:', error.message);
    }
}

// 运行测试
testFixedVersion();