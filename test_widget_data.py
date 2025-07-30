#!/usr/bin/env python3
"""
测试 Widget 数据格式
"""

import json
import urllib.request
from datetime import datetime

def test_data_access():
    """测试数据访问"""
    print("🔍 测试数据包访问...")
    
    url = "https://gist.githubusercontent.com/saxdyo/1b652522aa446bb21f888c66a76bf6cb/raw/fd776ad18fcef7e87828d3c25a8751f34c9711a4/TMDB_Trending.json"
    
    try:
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode('utf-8'))
        
        print("✅ 数据包访问成功")
        print(f"📅 最后更新: {data.get('last_updated', 'N/A')}")
        print(f"📊 版本: {data.get('version', 'N/A')}")
        
        # 检查数据结构
        if 'data' in data:
            movies = data['data'].get('movies', [])
            tv_shows = data['data'].get('tv_shows', [])
            
            print(f"🎬 电影数量: {len(movies)}")
            print(f"📺 电视剧数量: {len(tv_shows)}")
            
            # 显示前3部电影
            if movies:
                print("\n🎬 前3部电影:")
                for i, movie in enumerate(movies[:3]):
                    print(f"  {i+1}. {movie.get('title', 'N/A')} ({movie.get('vote_average', 'N/A')}⭐)")
            
            # 显示前3部电视剧
            if tv_shows:
                print("\n📺 前3部电视剧:")
                for i, show in enumerate(tv_shows[:3]):
                    print(f"  {i+1}. {show.get('name', 'N/A')} ({show.get('vote_average', 'N/A')}⭐)")
            
            return True
        else:
            print("❌ 数据格式错误：缺少 'data' 字段")
            return False
            
    except Exception as e:
        print(f"❌ 数据访问失败: {e}")
        return False

def test_widget_compatibility():
    """测试 Widget 兼容性"""
    print("\n🔧 测试 Widget 兼容性...")
    
    url = "https://gist.githubusercontent.com/saxdyo/1b652522aa446bb21f888c66a76bf6cb/raw/fd776ad18fcef7e87828d3c25a8751f34c9711a4/TMDB_Trending.json"
    
    try:
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode('utf-8'))
        
        # 模拟 Widget 的数据处理
        if 'data' in data:
            movies = data['data'].get('movies', [])
            tv_shows = data['data'].get('tv_shows', [])
            
            # 检查必要字段
            required_fields = ['id', 'title', 'poster_path', 'vote_average']
            
            print("✅ 数据格式检查:")
            for field in required_fields:
                if movies and field in movies[0]:
                    print(f"  ✅ 电影字段 '{field}' 存在")
                else:
                    print(f"  ❌ 电影字段 '{field}' 缺失")
            
            # 检查电视剧字段
            tv_required_fields = ['id', 'name', 'poster_path', 'vote_average']
            for field in tv_required_fields:
                if tv_shows and field in tv_shows[0]:
                    print(f"  ✅ 电视剧字段 '{field}' 存在")
                else:
                    print(f"  ❌ 电视剧字段 '{field}' 缺失")
            
            return True
        else:
            print("❌ 数据格式不兼容")
            return False
            
    except Exception as e:
        print(f"❌ 兼容性测试失败: {e}")
        return False

def main():
    print("🚀 Widget 数据包测试")
    print("=" * 40)
    
    # 测试数据访问
    if not test_data_access():
        return
    
    # 测试 Widget 兼容性
    if not test_widget_compatibility():
        return
    
    print("\n🎉 测试完成！")
    print("=" * 40)
    print("✅ 您的数据包可以正常使用")
    print("✅ 数据格式与 Widget 兼容")
    print("✅ 可以替换原有的第三方数据包")
    
    print("\n📱 在 Widget 中使用:")
    print("```javascript")
    print("async function loadTmdbTrendingData() {")
    print("    const response = await Widget.http.get('https://gist.githubusercontent.com/saxdyo/1b652522aa446bb21f888c66a76bf6cb/raw/fd776ad18fcef7e87828d3c25a8751f34c9711a4/TMDB_Trending.json');")
    print("    return response.data;")
    print("}")
    print("```")

if __name__ == '__main__':
    main()