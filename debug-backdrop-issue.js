#!/usr/bin/env node

/**
 * 调试横版海报显示问题
 * 分析数据结构和字段映射
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

// 加载增强版功能
const fs = require('fs');
eval(fs.readFileSync('./Move_list_2_Enhanced.js', 'utf8'));

async function debugBackdropIssue() {
    console.log('🔍 开始调试横版海报显示问题...\n');
    
    try {
        // 获取数据
        console.log('📊 获取今日热门数据...');
        const todayData = await loadTodayGlobalMediaEnhanced({ language: 'zh-CN' });
        
        if (todayData && todayData.length > 0) {
            console.log(`✅ 成功获取 ${todayData.length} 项数据\n`);
            
            // 分析前3项的数据结构
            console.log('🔬 详细分析前3项数据结构:\n');
            
            for (let i = 0; i < Math.min(3, todayData.length); i++) {
                const item = todayData[i];
                console.log(`--- 项目 ${i + 1}: ${item.title} ---`);
                console.log(`ID: ${item.id}`);
                console.log(`类型: ${item.type}`);
                console.log(`媒体类型: ${item.mediaType}`);
                console.log(`评分: ${item.rating}`);
                
                // 检查海报字段
                console.log('\n📸 图片字段检查:');
                console.log(`posterPath: ${item.posterPath ? '✅ 有' : '❌ 无'} ${item.posterPath || ''}`);
                console.log(`coverUrl: ${item.coverUrl ? '✅ 有' : '❌ 无'} ${item.coverUrl || ''}`);
                
                // 检查横版海报字段
                console.log('\n🖼️ 横版海报字段检查:');
                console.log(`backdropPath: ${item.backdropPath ? '✅ 有' : '❌ 无'} ${item.backdropPath || ''}`);
                console.log(`backdropHD: ${item.backdropHD ? '✅ 有' : '❌ 无'} ${item.backdropHD || ''}`);
                console.log(`backdrop780: ${item.backdrop780 ? '✅ 有' : '❌ 无'} ${item.backdrop780 || ''}`);
                
                // 检查可能的其他横版海报字段名
                console.log('\n🔍 检查其他可能的横版海报字段:');
                console.log(`backdrop: ${item.backdrop ? '✅ 有' : '❌ 无'} ${item.backdrop || ''}`);
                console.log(`backgroundPath: ${item.backgroundPath ? '✅ 有' : '❌ 无'} ${item.backgroundPath || ''}`);
                console.log(`thumbnail: ${item.thumbnail ? '✅ 有' : '❌ 无'} ${item.thumbnail || ''}`);
                console.log(`banner: ${item.banner ? '✅ 有' : '❌ 无'} ${item.banner || ''}`);
                
                // 显示完整对象结构（仅显示字段名）
                console.log('\n🗂️ 完整字段列表:');
                console.log(Object.keys(item).join(', '));
                
                console.log('\n' + '='.repeat(60) + '\n');
            }
            
            // 生成修复建议
            console.log('💡 修复建议:\n');
            
            const sample = todayData[0];
            if (sample.backdropPath) {
                console.log('✅ backdropPath字段存在，可能的问题:');
                console.log('1. Widget界面需要其他字段名（如backdrop、backgroundPath等）');
                console.log('2. Widget组件没有正确读取backdropPath字段');
                console.log('3. CSS样式问题导致横版海报不显示');
                
                console.log('\n🔧 建议的修复方案:');
                console.log('1. 添加多个横版海报字段名映射');
                console.log('2. 检查Widget组件的横版海报显示逻辑');
                console.log('3. 确认CSS样式支持横版海报');
            } else {
                console.log('❌ backdropPath字段缺失，需要修复数据处理逻辑');
            }
            
        } else {
            console.log('❌ 未获取到数据');
        }
        
    } catch (error) {
        console.error('❌ 调试过程中出现错误:', error.message);
        console.error('📍 错误详情:', error.stack);
    }
}

// 运行调试
debugBackdropIssue();