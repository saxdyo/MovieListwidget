#!/usr/bin/env python3
"""
简化版剧集Logo背景图功能测试脚本
"""

import os
import json
from datetime import datetime, timezone, timedelta

def get_image_url(path, size="original"):
    """生成图片URL"""
    if not path:
        return ""
    return f"https://image.tmdb.org/t/p/{size}{path}"

def analyze_existing_data():
    """分析现有数据中的剧集logo情况"""
    print("📺 === 现有数据剧集Logo分析 ===")
    
    data_file = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")
    if not os.path.exists(data_file):
        print("❌ 数据文件不存在")
        return
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 收集所有剧集数据
        all_items = []
        all_items.extend(data.get("today_global", []))
        all_items.extend(data.get("week_global_all", []))
        all_items.extend(data.get("popular_movies", []))
        
        # 筛选剧集
        tv_shows = [item for item in all_items if item.get("media_type") == "tv"]
        
        if not tv_shows:
            print("❌ 现有数据中没有剧集")
            return
        
        print(f"📊 找到 {len(tv_shows)} 个剧集")
        
        for i, tv in enumerate(tv_shows, 1):
            tv_name = tv.get("name") or tv.get("title", "未知")
            tv_id = tv.get("id")
            poster_path = tv.get("poster_path")
            backdrop_path = tv.get("backdrop_path")
            
            print(f"\n{i}. 📺 {tv_name} (ID: {tv_id})")
            print(f"   海报: {'✅' if poster_path else '❌'} {poster_path or '无'}")
            print(f"   背景: {'✅' if backdrop_path else '❌'} {backdrop_path or '无'}")
            
            # 生成完整URL
            if poster_path:
                poster_url = get_image_url(poster_path)
                print(f"   海报URL: {poster_url}")
            
            if backdrop_path:
                backdrop_url = get_image_url(backdrop_path)
                print(f"   背景URL: {backdrop_url}")
            
            # 检查是否有logo相关字段（新格式）
            if "logo_url" in tv:
                logo_url = tv.get("logo_url")
                print(f"   Logo: {'✅' if logo_url else '❌'} {logo_url or '无'}")
            else:
                print(f"   Logo: ❌ 旧格式数据，需要运行增强脚本")
        
        # 统计
        posters_count = sum(1 for tv in tv_shows if tv.get("poster_path"))
        backdrops_count = sum(1 for tv in tv_shows if tv.get("backdrop_path"))
        
        print(f"\n📊 剧集图片统计:")
        print(f"   总剧集数: {len(tv_shows)}")
        print(f"   有海报: {posters_count}/{len(tv_shows)} ({posters_count/len(tv_shows)*100:.1f}%)")
        print(f"   有背景图: {backdrops_count}/{len(tv_shows)} ({backdrops_count/len(tv_shows)*100:.1f}%)")
        
    except Exception as e:
        print(f"❌ 分析数据时出错: {e}")

def test_logo_url_generation():
    """测试logo URL生成"""
    print("\n🔗 === Logo URL生成测试 ===")
    
    # 测试不同的图片尺寸
    test_path = "/example-logo.png"
    sizes = ["w92", "w154", "w185", "w300", "w500", "original"]
    
    print("📏 测试不同尺寸的URL生成:")
    for size in sizes:
        url = get_image_url(test_path, size)
        print(f"   {size}: {url}")
    
    # 测试空路径
    empty_url = get_image_url("")
    print(f"\n❌ 空路径测试: '{empty_url}'")
    
    # 测试实际可能的logo路径
    test_logos = [
        "/logos/example-tv-logo.png",
        "/logos/example-tv-logo-transparent.png",
        "/logos/example-tv-logo-white.png"
    ]
    
    print("\n🎨 测试实际logo路径:")
    for logo_path in test_logos:
        url = get_image_url(logo_path)
        print(f"   {logo_path} -> {url}")

def simulate_logo_selection():
    """模拟logo选择算法"""
    print("\n🔍 === Logo选择算法模拟 ===")
    
    # 模拟一些logo数据
    sample_logos = [
        {"file_path": "/logos/tv-show-zh.png", "iso_639_1": "zh", "vote_average": 8.5, "width": 300, "height": 150},
        {"file_path": "/logos/tv-show-en.png", "iso_639_1": "en", "vote_average": 9.0, "width": 400, "height": 200},
        {"file_path": "/logos/tv-show-transparent.png", "iso_639_1": None, "vote_average": 7.5, "width": 350, "height": 175},
        {"file_path": "/logos/tv-show-white.png", "iso_639_1": "en", "vote_average": 8.0, "width": 320, "height": 160}
    ]
    
    print("📋 模拟logo数据:")
    for i, logo in enumerate(sample_logos, 1):
        lang = logo.get("iso_639_1", "无")
        rating = logo.get("vote_average", 0)
        width = logo.get("width", 0)
        height = logo.get("height", 0)
        file_path = logo.get("file_path", "")
        
        print(f"   {i}. 语言: {lang}, 评分: {rating}, 尺寸: {width}x{height}")
        print(f"      路径: {file_path}")
        print(f"      URL: {get_image_url(file_path)}")
    
    # 模拟选择算法
    def select_best_logo(logos, media_type="tv"):
        def get_priority_score(logo):
            lang = logo.get("iso_639_1")
            
            # 语言优先级
            if lang == "zh":
                lang_score = 0
            elif lang == "en":
                lang_score = 1
            elif lang is None:
                lang_score = 2
            else:
                lang_score = 3
            
            # 评分优先级
            vote_avg = -logo.get("vote_average", 0)
            
            # 尺寸优先级
            width = logo.get("width", 0)
            height = logo.get("height", 0)
            resolution = -(width * height)
            
            # 对于剧集，优先选择透明背景的logo
            if media_type == "tv":
                file_path = logo.get("file_path", "").lower()
                if "transparent" in file_path or "png" in file_path:
                    transparency_bonus = -1
                else:
                    transparency_bonus = 0
            else:
                transparency_bonus = 0
            
            return (lang_score, transparency_bonus, vote_avg, resolution)
        
        sorted_logos = sorted(logos, key=get_priority_score)
        return sorted_logos[0] if sorted_logos else None
    
    print("\n🏆 选择最佳logo:")
    best_logo = select_best_logo(sample_logos, "tv")
    if best_logo:
        lang = best_logo.get("iso_639_1", "无")
        rating = best_logo.get("vote_average", 0)
        file_path = best_logo.get("file_path", "")
        print(f"   最佳选择: 语言={lang}, 评分={rating}, 路径={file_path}")
        print(f"   完整URL: {get_image_url(file_path)}")
    else:
        print("   没有找到合适的logo")

def show_enhancement_plan():
    """显示增强计划"""
    print("\n📋 === 剧集Logo增强计划 ===")
    
    print("🎯 目标:")
    print("   - 为所有剧集添加logo背景图")
    print("   - 优化logo质量选择算法")
    print("   - 提高剧集logo覆盖率")
    
    print("\n🔧 实现方案:")
    print("   1. 调用TMDB API获取剧集logo数据")
    print("   2. 智能选择最佳质量logo（中文优先）")
    print("   3. 支持透明背景logo（PNG格式）")
    print("   4. 生成完整logo URL")
    print("   5. 添加logo状态统计")
    
    print("\n📊 预期效果:")
    print("   - 剧集logo覆盖率 > 80%")
    print("   - 支持多种logo格式和尺寸")
    print("   - 智能质量选择算法")
    print("   - 完整的URL生成")
    
    print("\n🚀 使用方法:")
    print("   1. 设置TMDB_API_KEY环境变量")
    print("   2. 运行增强脚本: python3 scripts/get_tmdb_data_enhanced.py")
    print("   3. 检查生成的logo_url字段")
    print("   4. 查看logo覆盖率统计")

def main():
    """主函数"""
    print("📺 剧集Logo背景图功能测试（简化版）")
    print("=" * 50)
    
    # 运行测试
    try:
        # 1. 分析现有数据
        analyze_existing_data()
        
        # 2. 测试URL生成
        test_logo_url_generation()
        
        # 3. 模拟logo选择
        simulate_logo_selection()
        
        # 4. 显示增强计划
        show_enhancement_plan()
        
        print("\n" + "=" * 50)
        print("✅ 剧集Logo测试完成")
        print("💡 提示: 设置TMDB_API_KEY并运行增强脚本可获得完整功能")
        
    except Exception as e:
        print(f"❌ 测试过程中出错: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())