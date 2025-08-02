#!/usr/bin/env node
/**
 * 测试Move_list 2.js中的剧集Logo功能
 * Test TV Logo functionality in Move_list 2.js
 */

// 模拟全局环境
global.process = process;
global.console = console;
global.fetch = require('node-fetch'); // 需要安装: npm install node-fetch

// 导入Move_list 2.js文件
require('./Move_list 2.js');

async function testJavaScriptTvLogos() {
    console.log('🧪 测试JavaScript版本的剧集Logo功能');
    console.log('=' .repeat(50));
    
    // 检查函数是否存在
    if (typeof testTvLogoFunctionality === 'function') {
        console.log('✅ testTvLogoFunctionality 函数已加载');
        
        // 测试图片选择算法（不需要API）
        if (typeof testImageSelectionAlgorithm === 'function') {
            console.log('\n📊 测试图片选择算法:');
            testImageSelectionAlgorithm();
        }
        
        // 测试功能开关
        if (typeof toggleTvLogoFeature === 'function') {
            console.log('\n🔧 测试功能开关:');
            console.log('当前状态:', CONFIG.ENABLE_TV_LOGOS);
            toggleTvLogoFeature(false);
            toggleTvLogoFeature(true);
        }
        
        // 如果有TMDB API密钥，测试实际功能
        if (process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'your_api_key_here') {
            console.log('\n🌐 检测到TMDB API密钥，运行完整测试...');
            await testTvLogoFunctionality();
        } else {
            console.log('\n⚠️ 未设置TMDB API密钥，跳过实际API测试');
            console.log('   提示: 设置环境变量 TMDB_API_KEY 以启用完整测试');
        }
        
    } else {
        console.log('❌ testTvLogoFunctionality 函数未找到');
        console.log('   请检查Move_list 2.js文件是否正确加载');
    }
    
    // 测试核心函数是否存在
    console.log('\n🔍 检查核心函数:');
    const functions = [
        'getTvShowLogoBackdrop',
        'selectBestImage', 
        'getTmdbMediaImages',
        'generateTitleBackdrop',
        'createTitlePosterWithOverlay'
    ];
    
    functions.forEach(funcName => {
        const exists = typeof eval(funcName) === 'function';
        console.log(`   ${exists ? '✅' : '❌'} ${funcName}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 JavaScript版本剧集Logo功能测试完成!');
}

// 运行测试
if (require.main === module) {
    testJavaScriptTvLogos().catch(error => {
        console.error('❌ 测试过程中发生错误:', error);
        process.exit(1);
    });
}

module.exports = { testJavaScriptTvLogos };