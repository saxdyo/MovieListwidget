#!/usr/bin/env python3
"""
增强版TMDB数据爬取模块演示脚本
"""

import os
import json
import sys
from datetime import datetime, timezone, timedelta

def load_tmdb_data():
    """加载TMDB数据"""
    data_file = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")
    
    if not os.path.exists(data_file):
        print("❌ 数据文件不存在，请先运行增强脚本")
        return None
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 读取数据文件失败: {e}")
        return None

def demo_basic_info(data):
    """演示基本信息"""
    print("🎬 === TMDB数据基本信息 ===")
    
    last_updated = data.get("last_updated", "未知")
    print(f"📅 最后更新: {last_updated}")
    
    # 检查版本信息
    version = data.get("version", "未知")
    metadata = data.get("metadata", {})
    if metadata:
        version = metadata.get("version", version)
        features = metadata.get("features", [])
        print(f"📋 版本: {version}")
        print(f"✨ 功能特性: {', '.join(features)}")
    else:
        print(f"📋 版本: {version}")
    
    # 统计项目数量
    today_count = len(data.get("today_global", []))
    week_count = len(data.get("week_global_all", []))
    popular_count = len(data.get("popular_movies", []))
    
    print(f"📊 今日热门: {today_count} 个项目")
    print(f"📊 本周热门: {week_count} 个项目")
    print(f"📊 热门电影: {popular_count} 个项目")
    print(f"📊 总计: {today_count + week_count + popular_count} 个项目")
    
    # 显示增强功能统计
    if metadata:
        total_items = metadata.get("total_items", 0)
        logos_count = metadata.get("logos_count", 0)
        backdrops_count = metadata.get("backdrops_count", 0)
        
        print(f"🎨 Logo覆盖率: {logos_count}/{total_items} ({logos_count/total_items*100:.1f}%)" if total_items > 0 else "🎨 Logo覆盖率: 0/0")
        print(f"🖼️ 背景图覆盖率: {backdrops_count}/{total_items} ({backdrops_count/total_items*100:.1f}%)" if total_items > 0 else "🖼️ 背景图覆盖率: 0/0")

def demo_data_format(data):
    """演示数据格式"""
    print("\n📋 === 数据格式演示 ===")
    
    # 获取第一个项目作为示例
    all_items = []
    all_items.extend(data.get("today_global", []))
    all_items.extend(data.get("week_global_all", []))
    all_items.extend(data.get("popular_movies", []))
    
    if not all_items:
        print("❌ 没有找到任何数据")
        return
    
    first_item = all_items[0]
    
    # 判断数据格式
    is_new_format = "type" in first_item and "genreTitle" in first_item
    is_old_format = "media_type" in first_item and "poster_path" in first_item
    
    if is_new_format:
        print("🆕 检测到新格式数据（增强版）")
        print("📋 示例项目结构:")
        print(f"   ID: {first_item.get('id')}")
        print(f"   标题: {first_item.get('title')}")
        print(f"   类型: {first_item.get('type')}")
        print(f"   类型: {first_item.get('genreTitle')}")
        print(f"   评分: {first_item.get('rating')}")
        print(f"   海报: {first_item.get('poster_url', '无')[:50]}...")
        print(f"   背景图: {first_item.get('title_backdrop', '无')[:50]}...")
        print(f"   Logo: {first_item.get('logo_url', '无')[:50]}...")
        
    elif is_old_format:
        print("📋 检测到旧格式数据")
        print("📋 示例项目结构:")
        title = first_item.get('title') or first_item.get('name')
        print(f"   ID: {first_item.get('id')}")
        print(f"   标题: {title}")
        print(f"   类型: {first_item.get('media_type')}")
        print(f"   评分: {first_item.get('vote_average')}")
        print(f"   海报路径: {first_item.get('poster_path', '无')}")
        print(f"   背景路径: {first_item.get('backdrop_path', '无')}")
        print("💡 提示: 运行增强脚本可获取完整URL和Logo")

def demo_image_quality(data):
    """演示图片质量选择"""
    print("\n🖼️ === 图片质量选择演示 ===")
    
    all_items = []
    all_items.extend(data.get("today_global", []))
    all_items.extend(data.get("week_global_all", []))
    all_items.extend(data.get("popular_movies", []))
    
    if not all_items:
        print("❌ 没有找到任何数据")
        return
    
    # 统计图片质量
    if "poster_url" in all_items[0]:  # 新格式
        poster_urls = [item.get("poster_url") for item in all_items if item.get("poster_url")]
        backdrop_urls = [item.get("title_backdrop") for item in all_items if item.get("title_backdrop")]
        logo_urls = [item.get("logo_url") for item in all_items if item.get("logo_url")]
        
        print(f"📸 海报URL: {len(poster_urls)}/{len(all_items)}")
        print(f"🖼️ 背景图URL: {len(backdrop_urls)}/{len(all_items)}")
        print(f"🎨 Logo URL: {len(logo_urls)}/{len(all_items)}")
        
        # 显示示例URL
        if poster_urls:
            print(f"📸 示例海报: {poster_urls[0]}")
        if backdrop_urls:
            print(f"🖼️ 示例背景图: {backdrop_urls[0]}")
        if logo_urls:
            print(f"🎨 示例Logo: {logo_urls[0]}")
            
    else:  # 旧格式
        poster_paths = [item.get("poster_path") for item in all_items if item.get("poster_path")]
        backdrop_paths = [item.get("backdrop_path") for item in all_items if item.get("backdrop_path")]
        
        print(f"📸 海报路径: {len(poster_paths)}/{len(all_items)}")
        print(f"🖼️ 背景路径: {len(backdrop_paths)}/{len(all_items)}")
        
        if poster_paths:
            print(f"📸 示例海报路径: {poster_paths[0]}")
            print(f"📸 完整URL: https://image.tmdb.org/t/p/original{poster_paths[0]}")
        if backdrop_paths:
            print(f"🖼️ 示例背景路径: {backdrop_paths[0]}")
            print(f"🖼️ 完整URL: https://image.tmdb.org/t/p/original{backdrop_paths[0]}")

def demo_usage_examples(data):
    """演示使用示例"""
    print("\n💡 === 使用示例 ===")
    
    all_items = []
    all_items.extend(data.get("today_global", []))
    all_items.extend(data.get("week_global_all", []))
    all_items.extend(data.get("popular_movies", []))
    
    if not all_items:
        print("❌ 没有找到任何数据")
        return
    
    # 示例1: 获取所有电影
    movies = [item for item in all_items if item.get("media_type") == "movie" or item.get("type") == "movie"]
    print(f"🎬 电影数量: {len(movies)}")
    
    # 示例2: 获取所有电视剧
    tv_shows = [item for item in all_items if item.get("media_type") == "tv" or item.get("type") == "tv"]
    print(f"📺 电视剧数量: {len(tv_shows)}")
    
    # 示例3: 获取高评分项目
    high_rated = []
    for item in all_items:
        rating = item.get("vote_average") or item.get("rating", 0)
        if rating >= 8.0:
            high_rated.append(item)
    
    print(f"⭐ 高评分项目 (≥8.0): {len(high_rated)}")
    
    # 示例4: 获取有Logo的项目
    if "logo_url" in all_items[0]:
        items_with_logo = [item for item in all_items if item.get("logo_url")]
        print(f"🎨 有Logo的项目: {len(items_with_logo)}")
    
    # 示例5: 获取有背景图的项目
    if "title_backdrop" in all_items[0]:
        items_with_backdrop = [item for item in all_items if item.get("title_backdrop")]
        print(f"🖼️ 有背景图的项目: {len(items_with_backdrop)}")

def demo_api_integration():
    """演示API集成"""
    print("\n🔗 === API集成示例 ===")
    
    print("📡 前端JavaScript使用示例:")
    print("""
// 获取TMDB数据
fetch('/data/TMDB_Trending.json')
  .then(response => response.json())
  .then(data => {
    // 显示今日热门
    const todayItems = data.today_global;
    todayItems.forEach(item => {
      console.log(`标题: ${item.title}`);
      console.log(`海报: ${item.poster_url}`);
      console.log(`背景图: ${item.title_backdrop}`);
      console.log(`Logo: ${item.logo_url}`);
    });
  });
""")
    
    print("🐍 Python使用示例:")
    print("""
import json

# 读取数据
with open('data/TMDB_Trending.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 获取今日热门
today_items = data['today_global']
for item in today_items:
    print(f"标题: {item.get('title')}")
    print(f"海报: {item.get('poster_url')}")
    print(f"背景图: {item.get('title_backdrop')}")
    print(f"Logo: {item.get('logo_url')}")
""")

def main():
    """主演示函数"""
    print("🎬 TMDB增强数据爬取模块演示")
    print("=" * 50)
    
    # 加载数据
    data = load_tmdb_data()
    if not data:
        return 1
    
    # 运行演示
    demo_basic_info(data)
    demo_data_format(data)
    demo_image_quality(data)
    demo_usage_examples(data)
    demo_api_integration()
    
    print("\n" + "=" * 50)
    print("🎉 演示完成！")
    print("💡 提示: 运行增强脚本可获取最新数据和Logo背景图")
    
    return 0

if __name__ == "__main__":
    exit(main())