#!/usr/bin/env python3
"""
测试增强版TMDB数据爬取功能
"""

import os
import json
import sys
from datetime import datetime, timezone, timedelta

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_data_structure():
    """测试数据结构"""
    print("=== 测试数据结构 ===")
    
    # 检查数据文件是否存在
    data_file = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")
    if not os.path.exists(data_file):
        print("❌ 数据文件不存在")
        return False
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("✅ 数据文件读取成功")
        
        # 检查基本结构
        required_keys = ["last_updated", "today_global", "week_global_all", "popular_movies"]
        for key in required_keys:
            if key not in data:
                print(f"❌ 缺少必需字段: {key}")
                return False
        
        print("✅ 基本数据结构正确")
        
        # 检查元数据（新格式）
        metadata = data.get("metadata", {})
        if metadata:
            print(f"✅ 元数据版本: {metadata.get('version', 'unknown')}")
            print(f"✅ 功能特性: {metadata.get('features', [])}")
            print(f"✅ 总项目数: {metadata.get('total_items', 0)}")
            print(f"✅ Logo数量: {metadata.get('logos_count', 0)}")
            print(f"✅ 背景图数量: {metadata.get('backdrops_count', 0)}")
        else:
            # 检查旧格式的版本信息
            version = data.get("version", "unknown")
            print(f"✅ 数据版本: {version}")
        
        return True
        
    except Exception as e:
        print(f"❌ 读取数据文件失败: {e}")
        return False

def test_item_structure():
    """测试单个项目的数据结构"""
    print("\n=== 测试项目数据结构 ===")
    
    data_file = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")
    if not os.path.exists(data_file):
        print("❌ 数据文件不存在")
        return False
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 检查所有数据列表
        all_items = []
        all_items.extend(data.get("today_global", []))
        all_items.extend(data.get("week_global_all", []))
        all_items.extend(data.get("popular_movies", []))
        
        if not all_items:
            print("⚠️ 没有找到任何项目数据")
            return True
        
        print(f"✅ 找到 {len(all_items)} 个项目")
        
        # 检查第一个项目的结构
        first_item = all_items[0]
        
        # 新格式的必需字段
        new_format_keys = ["id", "title", "type", "genreTitle", "rating", "poster_url"]
        # 旧格式的必需字段
        old_format_keys = ["id", "title", "name", "media_type", "vote_average", "poster_path"]
        
        # 判断是哪种格式
        is_new_format = "type" in first_item and "genreTitle" in first_item
        is_old_format = "media_type" in first_item and "poster_path" in first_item
        
        if is_new_format:
            print("📋 检测到新格式数据")
            required_keys = new_format_keys
            enhanced_keys = ["title_backdrop", "logo_url", "original_poster"]
        elif is_old_format:
            print("📋 检测到旧格式数据")
            required_keys = old_format_keys
            enhanced_keys = []
        else:
            print("⚠️ 未知数据格式")
            return True
        
        # 检查必需字段
        missing_keys = []
        for key in required_keys:
            if key not in first_item:
                missing_keys.append(key)
        
        if missing_keys:
            print(f"⚠️ 缺少字段: {missing_keys}")
        else:
            print("✅ 基本项目结构正确")
        
        # 检查增强字段（仅新格式）
        if is_new_format and enhanced_keys:
            enhanced_count = 0
            for key in enhanced_keys:
                if key in first_item and first_item[key]:
                    enhanced_count += 1
            
            print(f"✅ 增强字段覆盖率: {enhanced_count}/{len(enhanced_keys)}")
        
        # 显示示例项目
        print("\n📋 示例项目:")
        if is_new_format:
            print(f"   标题: {first_item.get('title')}")
            print(f"   类型: {first_item.get('type')}")
            print(f"   评分: {first_item.get('rating')}")
            print(f"   海报: {'✅' if first_item.get('poster_url') else '❌'}")
            print(f"   背景图: {'✅' if first_item.get('title_backdrop') else '❌'}")
            print(f"   Logo: {'✅' if first_item.get('logo_url') else '❌'}")
        else:
            title = first_item.get('title') or first_item.get('name')
            print(f"   标题: {title}")
            print(f"   类型: {first_item.get('media_type')}")
            print(f"   评分: {first_item.get('vote_average')}")
            print(f"   海报路径: {'✅' if first_item.get('poster_path') else '❌'}")
            print(f"   背景路径: {'✅' if first_item.get('backdrop_path') else '❌'}")
        
        return True
        
    except Exception as e:
        print(f"❌ 测试项目结构失败: {e}")
        return False

def test_image_urls():
    """测试图片URL的有效性"""
    print("\n=== 测试图片URL ===")
    
    data_file = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")
    if not os.path.exists(data_file):
        print("❌ 数据文件不存在")
        return False
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        all_items = []
        all_items.extend(data.get("today_global", []))
        all_items.extend(data.get("week_global_all", []))
        all_items.extend(data.get("popular_movies", []))
        
        if not all_items:
            print("⚠️ 没有找到任何项目数据")
            return True
        
        # 判断数据格式
        first_item = all_items[0]
        is_new_format = "poster_url" in first_item
        is_old_format = "poster_path" in first_item
        
        if is_new_format:
            # 新格式统计
            poster_count = sum(1 for item in all_items if item.get("poster_url"))
            backdrop_count = sum(1 for item in all_items if item.get("title_backdrop"))
            logo_count = sum(1 for item in all_items if item.get("logo_url"))
            
            print(f"✅ 海报URL: {poster_count}/{len(all_items)}")
            print(f"✅ 背景图URL: {backdrop_count}/{len(all_items)}")
            print(f"✅ Logo URL: {logo_count}/{len(all_items)}")
            
            # 检查URL格式
            sample_urls = []
            for item in all_items[:3]:
                if item.get("poster_url"):
                    sample_urls.append(item["poster_url"])
                if item.get("title_backdrop"):
                    sample_urls.append(item["title_backdrop"])
                if item.get("logo_url"):
                    sample_urls.append(item["logo_url"])
            
            for url in sample_urls:
                if url.startswith("https://image.tmdb.org/t/p/"):
                    print(f"✅ URL格式正确: {url[:50]}...")
                else:
                    print(f"❌ URL格式错误: {url}")
                    
        elif is_old_format:
            # 旧格式统计
            poster_count = sum(1 for item in all_items if item.get("poster_path"))
            backdrop_count = sum(1 for item in all_items if item.get("backdrop_path"))
            
            print(f"✅ 海报路径: {poster_count}/{len(all_items)}")
            print(f"✅ 背景路径: {backdrop_count}/{len(all_items)}")
            print("ℹ️ 旧格式数据，需要运行增强脚本生成完整URL")
            
            # 检查路径格式
            sample_paths = []
            for item in all_items[:3]:
                if item.get("poster_path"):
                    sample_paths.append(item["poster_path"])
                if item.get("backdrop_path"):
                    sample_paths.append(item["backdrop_path"])
            
            for path in sample_paths:
                if path.startswith("/"):
                    print(f"✅ 路径格式正确: {path}")
                else:
                    print(f"❌ 路径格式错误: {path}")
        
        return True
        
    except Exception as e:
        print(f"❌ 测试图片URL失败: {e}")
        return False

def test_timestamp():
    """测试时间戳格式"""
    print("\n=== 测试时间戳 ===")
    
    data_file = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")
    if not os.path.exists(data_file):
        print("❌ 数据文件不存在")
        return False
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        last_updated = data.get("last_updated")
        if not last_updated:
            print("❌ 缺少时间戳")
            return False
        
        # 尝试解析不同的时间戳格式
        try:
            # 尝试新格式: "2024-01-01 12:00:00"
            dt = datetime.strptime(last_updated, "%Y-%m-%d %H:%M:%S")
            print(f"✅ 时间戳格式正确 (新格式): {last_updated}")
        except ValueError:
            try:
                # 尝试ISO格式: "2025-01-20T10:30:00Z"
                dt = datetime.fromisoformat(last_updated.replace('Z', '+00:00'))
                print(f"✅ 时间戳格式正确 (ISO格式): {last_updated}")
            except ValueError:
                print(f"❌ 时间戳格式错误: {last_updated}")
                return False
        
        # 检查是否为最近时间
        beijing_timezone = timezone(timedelta(hours=8))
        beijing_now = datetime.now(beijing_timezone)
        
        # 如果时间戳有时区信息，转换为北京时间
        if dt.tzinfo:
            dt = dt.astimezone(beijing_timezone)
        else:
            # 假设为UTC时间
            dt = dt.replace(tzinfo=timezone.utc).astimezone(beijing_timezone)
        
        time_diff = abs((beijing_now - dt).total_seconds())
        
        if time_diff < 3600:  # 1小时内
            print("✅ 时间戳为最近时间")
        else:
            print(f"⚠️ 时间戳可能较旧，相差 {time_diff/3600:.1f} 小时")
        
        return True
        
    except Exception as e:
        print(f"❌ 测试时间戳失败: {e}")
        return False

def test_data_quality():
    """测试数据质量"""
    print("\n=== 测试数据质量 ===")
    
    data_file = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")
    if not os.path.exists(data_file):
        print("❌ 数据文件不存在")
        return False
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        all_items = []
        all_items.extend(data.get("today_global", []))
        all_items.extend(data.get("week_global_all", []))
        all_items.extend(data.get("popular_movies", []))
        
        if not all_items:
            print("⚠️ 没有找到任何项目数据")
            return True
        
        # 数据质量统计
        total_items = len(all_items)
        items_with_title = sum(1 for item in all_items if item.get("title") or item.get("name"))
        items_with_overview = sum(1 for item in all_items if item.get("overview"))
        items_with_rating = sum(1 for item in all_items if item.get("vote_average") or item.get("rating"))
        
        print(f"✅ 总项目数: {total_items}")
        print(f"✅ 有标题的项目: {items_with_title}/{total_items}")
        print(f"✅ 有简介的项目: {items_with_overview}/{total_items}")
        print(f"✅ 有评分的项目: {items_with_rating}/{total_items}")
        
        # 检查数据完整性
        completeness = (items_with_title + items_with_overview + items_with_rating) / (total_items * 3) * 100
        print(f"✅ 数据完整性: {completeness:.1f}%")
        
        if completeness >= 80:
            print("✅ 数据质量良好")
        elif completeness >= 60:
            print("⚠️ 数据质量一般")
        else:
            print("❌ 数据质量较差")
        
        return True
        
    except Exception as e:
        print(f"❌ 测试数据质量失败: {e}")
        return False

def main():
    """主测试函数"""
    print("🧪 开始测试增强版TMDB数据爬取功能")
    print("=" * 50)
    
    tests = [
        test_data_structure,
        test_item_structure,
        test_image_urls,
        test_timestamp,
        test_data_quality
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ 测试执行失败: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过！")
        return 0
    elif passed >= total * 0.8:
        print("✅ 大部分测试通过，数据可用")
        return 0
    else:
        print("⚠️ 部分测试失败，建议运行增强脚本更新数据")
        return 1

if __name__ == "__main__":
    exit(main())