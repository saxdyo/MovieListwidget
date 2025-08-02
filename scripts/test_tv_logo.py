#!/usr/bin/env python3
"""
专门测试剧集Logo背景图功能的脚本
"""

import os
import json
import requests
from datetime import datetime, timezone, timedelta

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"

def get_tv_logo_test_data():
    """获取测试用的剧集数据"""
    if not TMDB_API_KEY:
        print("❌ 未设置TMDB_API_KEY")
        return []
    
    # 获取热门剧集
    endpoint = "/tv/popular"
    url = f"{BASE_URL}{endpoint}"
    params = {
        "api_key": TMDB_API_KEY,
        "language": "zh-CN",
        "page": 1
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])[:5]  # 只取前5个剧集
    except Exception as e:
        print(f"❌ 获取剧集数据失败: {e}")
        return []

def get_tv_images(tv_id):
    """获取剧集图片数据"""
    if not TMDB_API_KEY:
        return {"logos": [], "backdrops": [], "posters": []}
    
    images_endpoint = f"/tv/{tv_id}/images"
    url = f"{BASE_URL}{images_endpoint}"
    params = {
        "api_key": TMDB_API_KEY,
        "include_image_language": "zh,en,null"
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ 获取剧集图片失败 {tv_id}: {e}")
        return {"logos": [], "backdrops": [], "posters": []}

def get_image_url(path, size="original"):
    """生成图片URL"""
    if not path:
        return ""
    return f"https://image.tmdb.org/t/p/{size}{path}"

def analyze_tv_logos(tv_data):
    """分析剧集logo数据"""
    print("📺 === 剧集Logo分析 ===")
    
    total_tv = len(tv_data)
    tv_with_logos = 0
    logo_details = []
    
    for tv in tv_data:
        tv_id = tv.get("id")
        tv_name = tv.get("name") or tv.get("title", "未知")
        
        print(f"\n🎬 分析剧集: {tv_name} (ID: {tv_id})")
        
        # 获取图片数据
        images = get_tv_images(tv_id)
        logos = images.get("logos", [])
        
        if logos:
            tv_with_logos += 1
            print(f"   ✅ 找到 {len(logos)} 个Logo")
            
            # 分析logo详情
            for i, logo in enumerate(logos[:3]):  # 只显示前3个
                file_path = logo.get("file_path", "")
                lang = logo.get("iso_639_1", "无")
                vote_avg = logo.get("vote_average", 0)
                width = logo.get("width", 0)
                height = logo.get("height", 0)
                
                print(f"     {i+1}. 语言: {lang}, 评分: {vote_avg}, 尺寸: {width}x{height}")
                print(f"        路径: {file_path}")
                print(f"        URL: {get_image_url(file_path)}")
        else:
            print(f"   ❌ 未找到Logo")
        
        # 检查背景图
        backdrops = images.get("backdrops", [])
        if backdrops:
            print(f"   🖼️ 找到 {len(backdrops)} 个背景图")
        else:
            print(f"   ❌ 未找到背景图")
        
        # 检查海报
        posters = images.get("posters", [])
        if posters:
            print(f"   📸 找到 {len(posters)} 个海报")
        else:
            print(f"   ❌ 未找到海报")
    
    print(f"\n📊 剧集Logo统计:")
    print(f"   总剧集数: {total_tv}")
    print(f"   有Logo的剧集: {tv_with_logos}")
    print(f"   Logo覆盖率: {tv_with_logos/total_tv*100:.1f}%" if total_tv > 0 else "Logo覆盖率: 0%")
    
    return {
        "total_tv": total_tv,
        "tv_with_logos": tv_with_logos,
        "coverage": tv_with_logos/total_tv*100 if total_tv > 0 else 0
    }

def test_logo_quality_selection():
    """测试logo质量选择算法"""
    print("\n🔍 === Logo质量选择测试 ===")
    
    if not TMDB_API_KEY:
        print("❌ 未设置TMDB_API_KEY，跳过测试")
        return
    
    # 获取一个热门剧集进行测试
    tv_data = get_tv_logo_test_data()
    if not tv_data:
        print("❌ 无法获取剧集数据")
        return
    
    test_tv = tv_data[0]
    tv_id = test_tv.get("id")
    tv_name = test_tv.get("name") or test_tv.get("title", "未知")
    
    print(f"🎬 测试剧集: {tv_name} (ID: {tv_id})")
    
    # 获取图片数据
    images = get_tv_images(tv_id)
    logos = images.get("logos", [])
    
    if not logos:
        print("❌ 该剧集没有Logo")
        return
    
    print(f"📋 找到 {len(logos)} 个Logo，分析质量选择:")
    
    # 按不同标准排序
    def sort_by_language(logos):
        def lang_score(logo):
            lang = logo.get("iso_639_1")
            if lang == "zh": return 0
            elif lang == "en": return 1
            elif lang is None: return 2
            else: return 3
        return sorted(logos, key=lang_score)
    
    def sort_by_rating(logos):
        return sorted(logos, key=lambda x: x.get("vote_average", 0), reverse=True)
    
    def sort_by_resolution(logos):
        return sorted(logos, key=lambda x: x.get("width", 0) * x.get("height", 0), reverse=True)
    
    def sort_by_transparency(logos):
        def transparency_score(logo):
            file_path = logo.get("file_path", "").lower()
            if "transparent" in file_path or "png" in file_path:
                return 0
            return 1
        return sorted(logos, key=transparency_score)
    
    # 显示排序结果
    print("\n📊 按语言排序 (中文优先):")
    lang_sorted = sort_by_language(logos)
    for i, logo in enumerate(lang_sorted[:3]):
        lang = logo.get("iso_639_1", "无")
        print(f"   {i+1}. 语言: {lang}, 路径: {logo.get('file_path', '')}")
    
    print("\n📊 按评分排序:")
    rating_sorted = sort_by_rating(logos)
    for i, logo in enumerate(rating_sorted[:3]):
        rating = logo.get("vote_average", 0)
        print(f"   {i+1}. 评分: {rating}, 路径: {logo.get('file_path', '')}")
    
    print("\n📊 按分辨率排序:")
    res_sorted = sort_by_resolution(logos)
    for i, logo in enumerate(res_sorted[:3]):
        width = logo.get("width", 0)
        height = logo.get("height", 0)
        print(f"   {i+1}. 尺寸: {width}x{height}, 路径: {logo.get('file_path', '')}")
    
    print("\n📊 按透明度排序 (PNG优先):")
    trans_sorted = sort_by_transparency(logos)
    for i, logo in enumerate(trans_sorted[:3]):
        file_path = logo.get("file_path", "")
        is_transparent = "transparent" in file_path.lower() or "png" in file_path.lower()
        print(f"   {i+1}. 透明: {'是' if is_transparent else '否'}, 路径: {file_path}")

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

def main():
    """主函数"""
    print("📺 剧集Logo背景图功能测试")
    print("=" * 50)
    
    # 检查API密钥
    if not TMDB_API_KEY:
        print("⚠️ 未设置TMDB_API_KEY，将进行有限测试")
    
    # 运行测试
    try:
        # 1. 分析剧集logo数据
        tv_data = get_tv_logo_test_data()
        if tv_data:
            analyze_tv_logos(tv_data)
        
        # 2. 测试logo质量选择
        test_logo_quality_selection()
        
        # 3. 测试URL生成
        test_logo_url_generation()
        
        print("\n" + "=" * 50)
        print("✅ 剧集Logo测试完成")
        
        if not TMDB_API_KEY:
            print("💡 提示: 设置TMDB_API_KEY可以获得更完整的测试结果")
        
    except Exception as e:
        print(f"❌ 测试过程中出错: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())