#!/usr/bin/env python3
"""
测试增强版TMDB数据获取功能
"""

import os
import json
import sys
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from scripts.get_tmdb_data_enhanced import (
    fetch_tmdb_data,
    fetch_popular_movies,
    get_media_details,
    get_media_images,
    get_best_logo,
    get_best_title_backdrop,
    process_tmdb_data
)

def test_basic_functions():
    """测试基本功能"""
    print("=== 测试基本功能 ===")
    
    # 测试获取趋势数据
    print("1. 测试获取趋势数据...")
    try:
        data = fetch_tmdb_data(time_window="day", media_type="all")
        print(f"   ✅ 获取到 {len(data.get('results', []))} 条趋势数据")
    except Exception as e:
        print(f"   ❌ 获取趋势数据失败: {e}")
    
    # 测试获取热门电影
    print("2. 测试获取热门电影...")
    try:
        data = fetch_popular_movies()
        print(f"   ✅ 获取到 {len(data.get('results', []))} 条热门电影数据")
    except Exception as e:
        print(f"   ❌ 获取热门电影失败: {e}")

def test_media_details():
    """测试媒体详情获取"""
    print("\n=== 测试媒体详情获取 ===")
    
    # 使用一个已知的电影ID进行测试
    test_movie_id = 550  # Fight Club
    test_tv_id = 1399    # Game of Thrones
    
    print(f"1. 测试电影详情 (ID: {test_movie_id})...")
    try:
        details = get_media_details("movie", test_movie_id)
        genres = details.get("genres", [])
        print(f"   ✅ 获取到电影详情，类型: {[g['name'] for g in genres[:3]]}")
    except Exception as e:
        print(f"   ❌ 获取电影详情失败: {e}")
    
    print(f"2. 测试电视剧详情 (ID: {test_tv_id})...")
    try:
        details = get_media_details("tv", test_tv_id)
        genres = details.get("genres", [])
        print(f"   ✅ 获取到电视剧详情，类型: {[g['name'] for g in genres[:3]]}")
    except Exception as e:
        print(f"   ❌ 获取电视剧详情失败: {e}")

def test_image_functions():
    """测试图片相关功能"""
    print("\n=== 测试图片相关功能 ===")
    
    test_movie_id = 550  # Fight Club
    
    print(f"1. 测试获取图片数据 (ID: {test_movie_id})...")
    try:
        image_data = get_media_images("movie", test_movie_id)
        backdrops = image_data.get("backdrops", [])
        logos = image_data.get("logos", [])
        print(f"   ✅ 获取到 {len(backdrops)} 张背景图，{len(logos)} 个logo")
    except Exception as e:
        print(f"   ❌ 获取图片数据失败: {e}")
        return
    
    print("2. 测试获取最佳背景图...")
    try:
        backdrop_url = get_best_title_backdrop(image_data)
        print(f"   ✅ 最佳背景图URL: {backdrop_url[:50]}...")
    except Exception as e:
        print(f"   ❌ 获取最佳背景图失败: {e}")
    
    print("3. 测试获取最佳logo...")
    try:
        logo_url = get_best_logo(image_data)
        print(f"   ✅ 最佳logo URL: {logo_url[:50]}...")
    except Exception as e:
        print(f"   ❌ 获取最佳logo失败: {e}")

def test_data_processing():
    """测试数据处理功能"""
    print("\n=== 测试数据处理功能 ===")
    
    print("1. 测试处理趋势数据...")
    try:
        raw_data = fetch_tmdb_data(time_window="day", media_type="all")
        processed_data = process_tmdb_data(raw_data, "day", "all")
        print(f"   ✅ 处理了 {len(processed_data)} 条数据")
        
        if processed_data:
            sample_item = processed_data[0]
            print(f"   📝 示例数据:")
            print(f"      - 标题: {sample_item.get('title')}")
            print(f"      - 类型: {sample_item.get('type')}")
            print(f"      - 评分: {sample_item.get('rating')}")
            print(f"      - 有Logo: {'是' if sample_item.get('logo_url') else '否'}")
            print(f"      - 有背景图: {'是' if sample_item.get('title_backdrop') else '否'}")
            
    except Exception as e:
        print(f"   ❌ 处理数据失败: {e}")

def test_save_and_load():
    """测试保存和加载功能"""
    print("\n=== 测试保存和加载功能 ===")
    
    test_data = {
        "last_updated": "2024-01-01 12:00:00",
        "today_global": [
            {
                "id": 550,
                "title": "Fight Club",
                "type": "movie",
                "genreTitle": "剧情•惊悚",
                "rating": 8.8,
                "release_date": "1999-10-15",
                "overview": "一个失眠的上班族遇到了一个肥皂商...",
                "poster_url": "https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                "title_backdrop": "https://image.tmdb.org/t/p/original/example_backdrop.jpg",
                "logo_url": "https://image.tmdb.org/t/p/original/example_logo.png"
            }
        ],
        "week_global_all": [],
        "popular_movies": []
    }
    
    test_file = "data/test_tmdb_data.json"
    
    print("1. 测试保存数据...")
    try:
        os.makedirs("data", exist_ok=True)
        with open(test_file, "w", encoding="utf-8") as f:
            json.dump(test_data, f, ensure_ascii=False, indent=2)
        print(f"   ✅ 数据已保存到 {test_file}")
    except Exception as e:
        print(f"   ❌ 保存数据失败: {e}")
        return
    
    print("2. 测试加载数据...")
    try:
        with open(test_file, "r", encoding="utf-8") as f:
            loaded_data = json.load(f)
        print(f"   ✅ 数据已加载，包含 {len(loaded_data.get('today_global', []))} 条记录")
        
        # 验证logo_url字段
        if loaded_data.get('today_global'):
            has_logo = loaded_data['today_global'][0].get('logo_url')
            print(f"   📝 Logo URL: {has_logo}")
            
    except Exception as e:
        print(f"   ❌ 加载数据失败: {e}")
    
    # 清理测试文件
    try:
        os.remove(test_file)
        print("   🧹 测试文件已清理")
    except:
        pass

def main():
    """主测试函数"""
    print("🚀 开始测试增强版TMDB数据获取功能")
    print("=" * 50)
    
    # 检查API密钥
    if not os.getenv("TMDB_API_KEY"):
        print("⚠️  未设置TMDB_API_KEY环境变量，部分测试可能失败")
        print("   请设置环境变量: export TMDB_API_KEY='your_api_key'")
        print()
    
    test_basic_functions()
    test_media_details()
    test_image_functions()
    test_data_processing()
    test_save_and_load()
    
    print("\n" + "=" * 50)
    print("✅ 测试完成")

if __name__ == "__main__":
    main()