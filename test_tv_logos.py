#!/usr/bin/env python3
"""
测试剧集Logo背景图获取功能
Test TV Show Logo Backdrop Retrieval
"""

import os
import sys
from pathlib import Path

# 添加scripts目录到路径
sys.path.append(str(Path(__file__).parent / "scripts"))

from get_tmdb_data import TMDBCrawler
import json


def test_tv_logo_retrieval():
    """测试剧集Logo获取"""
    print("🧪 测试剧集Logo背景图获取功能")
    print("=" * 50)
    
    # 初始化爬虫
    crawler = TMDBCrawler()
    
    if not crawler.api_key:
        print("⚠️ TMDB API密钥未设置，使用模拟数据测试...")
        
        # 模拟数据测试
        mock_image_data = {
            "backdrops": [
                {
                    "file_path": "/mock_backdrop.jpg",
                    "vote_average": 8.5,
                    "width": 1920,
                    "height": 1080,
                    "iso_639_1": "en"
                }
            ],
            "logos": [
                {
                    "file_path": "/mock_logo.png",
                    "vote_average": 9.0,
                    "width": 500,
                    "height": 200,
                    "iso_639_1": "zh"
                },
                {
                    "file_path": "/mock_logo_en.png", 
                    "vote_average": 8.0,
                    "width": 600,
                    "height": 240,
                    "iso_639_1": "en"
                }
            ]
        }
        
        print("\n📺 测试剧集 (TV) - 应该优先选择logo:")
        tv_result = crawler.get_best_title_backdrop(mock_image_data, "tv")
        print(f"   结果: {tv_result}")
        print(f"   期望: 包含 'mock_logo.png' (中文logo优先)")
        
        print("\n🎬 测试电影 (Movie) - 应该选择backdrop:")
        movie_result = crawler.get_best_title_backdrop(mock_image_data, "movie")
        print(f"   结果: {movie_result}")
        print(f"   期望: 包含 'mock_backdrop.jpg' (背景图)")
        
        print("\n✅ 模拟测试完成")
        return
    
    # 真实API测试
    print("🌐 使用真实API测试...")
    
    # 测试一些知名剧集
    test_tv_shows = [
        {"name": "权力的游戏", "id": 1399},
        {"name": "绝命毒师", "id": 1396}, 
        {"name": "纸牌屋", "id": 1425},
        {"name": "怪奇物语", "id": 66732}
    ]
    
    print(f"\n📺 测试 {len(test_tv_shows)} 个知名剧集的Logo获取:")
    print("-" * 50)
    
    for show in test_tv_shows:
        print(f"\n🎭 {show['name']} (ID: {show['id']})")
        
        try:
            # 获取剧集图片数据
            image_data = crawler.get_media_images("tv", show['id'])
            
            if not image_data:
                print("   ❌ 无法获取图片数据")
                continue
            
            # 统计可用图片
            logos_count = len(image_data.get("logos", []))
            backdrops_count = len(image_data.get("backdrops", []))
            
            print(f"   📊 可用图片: {logos_count} 个logos, {backdrops_count} 个backdrops")
            
            # 获取最佳标题背景图
            title_backdrop = crawler.get_best_title_backdrop(image_data, "tv")
            
            if title_backdrop:
                print(f"   ✅ 标题背景图: {title_backdrop}")
                
                # 判断是否为logo
                if any(logo.get("file_path") in title_backdrop for logo in image_data.get("logos", [])):
                    print("   🏷️ 类型: Logo (推荐)")
                else:
                    print("   🖼️ 类型: Backdrop (回退)")
            else:
                print("   ❌ 未找到合适的标题背景图")
                
        except Exception as e:
            print(f"   ❌ 获取失败: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 剧集Logo测试完成!")


def test_image_selection_algorithm():
    """测试图片选择算法"""
    print("\n🔍 测试图片选择算法")
    print("=" * 30)
    
    crawler = TMDBCrawler()
    
    # 测试数据：包含不同语言和质量的图片
    test_logos = [
        {
            "file_path": "/logo_zh_high.png",
            "vote_average": 9.5,
            "width": 800,
            "height": 320,  # 比例 2.5:1
            "iso_639_1": "zh"
        },
        {
            "file_path": "/logo_en_medium.png", 
            "vote_average": 8.0,
            "width": 600,
            "height": 240,  # 比例 2.5:1
            "iso_639_1": "en"
        },
        {
            "file_path": "/logo_zh_low.png",
            "vote_average": 7.0,
            "width": 400,
            "height": 400,  # 比例 1:1 (不理想)
            "iso_639_1": "zh"
        }
    ]
    
    print("📋 测试数据:")
    for i, logo in enumerate(test_logos, 1):
        aspect_ratio = logo["width"] / logo["height"]
        print(f"   {i}. 语言:{logo['iso_639_1']} 评分:{logo['vote_average']} "
              f"尺寸:{logo['width']}×{logo['height']} 比例:{aspect_ratio:.1f}:1")
    
    # 测试选择
    best_logo = crawler._select_best_image(test_logos, prefer_logos=True)
    
    print(f"\n🏆 选择结果: {best_logo['file_path']}")
    print(f"   原因: 中文语言 + 高评分 + 适合的宽高比")


if __name__ == "__main__":
    test_tv_logo_retrieval()
    test_image_selection_algorithm()