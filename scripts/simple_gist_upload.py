#!/usr/bin/env python3
"""
最简单的 TMDB 数据上传方案
直接将数据上传到 GitHub Gist，无需部署服务器
"""

import os
import json
import requests
from datetime import datetime

# 配置信息 - 请修改这些值
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', 'your_github_token_here')
GIST_ID = os.environ.get('GIST_ID', 'your_gist_id_here')
TMDB_API_KEY = os.environ.get('TMDB_API_KEY', 'your_tmdb_api_key_here')

def get_tmdb_data():
    """获取 TMDB 趋势数据"""
    try:
        url = "https://api.themoviedb.org/3/trending/all/day"
        params = {
            'api_key': TMDB_API_KEY,
            'language': 'zh-CN'
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
    except Exception as e:
        print(f"获取 TMDB 数据失败: {e}")
        return None

def upload_to_gist(data):
    """上传数据到 GitHub Gist"""
    try:
        gist_url = f"https://api.github.com/gists/{GIST_ID}"
        
        headers = {
            'Authorization': f'token {GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        # 准备数据
        gist_data = {
            "description": f"TMDB 趋势数据更新 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "files": {
                "TMDB_Trending.json": {
                    "content": json.dumps(data, ensure_ascii=False, indent=2)
                }
            }
        }
        
        response = requests.patch(gist_url, headers=headers, json=gist_data)
        response.raise_for_status()
        
        gist_info = response.json()
        raw_url = gist_info['files']['TMDB_Trending.json']['raw_url']
        
        print(f"✅ 数据已上传到 Gist")
        print(f"📊 原始数据 URL: {raw_url}")
        print(f"🌐 Gist 页面: https://gist.github.com/{GIST_ID}")
        
        return raw_url
        
    except Exception as e:
        print(f"上传到 Gist 失败: {e}")
        return None

def main():
    print("🚀 开始生成并上传 TMDB 数据...")
    
    # 检查配置
    if GITHUB_TOKEN == 'your_github_token_here':
        print("❌ 请设置 GITHUB_TOKEN 环境变量")
        print("获取方法: https://github.com/settings/tokens")
        return
    
    if GIST_ID == 'your_gist_id_here':
        print("❌ 请设置 GIST_ID 环境变量")
        print("创建 Gist: https://gist.github.com/")
        return
    
    if TMDB_API_KEY == 'your_tmdb_api_key_here':
        print("❌ 请设置 TMDB_API_KEY 环境变量")
        print("获取方法: https://www.themoviedb.org/settings/api")
        return
    
    # 获取 TMDB 数据
    print("📡 正在获取 TMDB 数据...")
    tmdb_data = get_tmdb_data()
    
    if not tmdb_data:
        print("❌ 无法获取 TMDB 数据")
        return
    
    # 处理数据
    print("🔧 正在处理数据...")
    processed_data = {
        "last_updated": datetime.now().isoformat(),
        "version": "1.0.0",
        "description": "TMDB Trending Data",
        "data": {
            "movies": [],
            "tv_shows": [],
            "people": []
        },
        "metadata": {
            "total_results": len(tmdb_data.get('results', [])),
            "source": "TMDB API",
            "request_time": datetime.now().isoformat()
        }
    }
    
    # 分类数据
    for item in tmdb_data.get('results', []):
        if item.get('media_type') == 'movie':
            processed_data['data']['movies'].append({
                'id': item['id'],
                'title': item.get('title', ''),
                'overview': item.get('overview', ''),
                'poster_path': item.get('poster_path'),
                'vote_average': item.get('vote_average', 0),
                'release_date': item.get('release_date', ''),
                'media_type': 'movie'
            })
        elif item.get('media_type') == 'tv':
            processed_data['data']['tv_shows'].append({
                'id': item['id'],
                'name': item.get('name', ''),
                'overview': item.get('overview', ''),
                'poster_path': item.get('poster_path'),
                'vote_average': item.get('vote_average', 0),
                'first_air_date': item.get('first_air_date', ''),
                'media_type': 'tv'
            })
    
    # 上传到 Gist
    print("📤 正在上传到 GitHub Gist...")
    raw_url = upload_to_gist(processed_data)
    
    if raw_url:
        print(f"\n🎉 完成！您现在可以在 Widget 中使用以下 URL:")
        print(f"   {raw_url}")
        print(f"\n📱 Widget 代码示例:")
        print(f"   async function loadTmdbData() {{")
        print(f"       const response = await Widget.http.get('{raw_url}');")
        print(f"       return response.data;")
        print(f"   }}")

if __name__ == '__main__':
    main()