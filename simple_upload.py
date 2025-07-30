#!/usr/bin/env python3
"""
使用 curl 的简单版本
"""

import os
import json
import subprocess
from datetime import datetime

def check_environment():
    """检查环境变量"""
    print("🔍 检查环境变量...")
    
    tmdb_key = os.environ.get('TMDB_API_KEY')
    github_token = os.environ.get('GITHUB_TOKEN')
    gist_id = os.environ.get('GIST_ID')
    
    if not tmdb_key:
        print("❌ 请设置 TMDB_API_KEY 环境变量")
        return None
    
    if not github_token:
        print("❌ 请设置 GITHUB_TOKEN 环境变量")
        return None
    
    if not gist_id:
        print("❌ 请设置 GIST_ID 环境变量")
        return None
    
    print("✅ 所有环境变量已设置")
    return {
        'tmdb_key': tmdb_key,
        'github_token': github_token,
        'gist_id': gist_id
    }

def get_tmdb_data(config):
    """获取 TMDB 数据"""
    print("📊 正在获取 TMDB 数据...")
    
    url = f"https://api.themoviedb.org/3/trending/all/day?api_key={config['tmdb_key']}&language=zh-CN"
    
    try:
        result = subprocess.run(['curl', '-s', url], capture_output=True, text=True)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            print(f"✅ 获取到 {len(data.get('results', []))} 条数据")
            return data
        else:
            print("❌ 获取 TMDB 数据失败")
            return None
    except Exception as e:
        print(f"❌ 获取 TMDB 数据失败: {e}")
        return None

def process_data(tmdb_data):
    """处理数据"""
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
    
    movies_count = 0
    tv_count = 0
    
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
            movies_count += 1
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
            tv_count += 1
    
    print(f"✅ 处理完成：{movies_count} 部电影，{tv_count} 部电视剧")
    return processed_data

def upload_to_gist(data, config):
    """上传到 Gist"""
    print("📤 正在上传到 GitHub Gist...")
    
    url = f"https://api.github.com/gists/{config['gist_id']}"
    
    gist_data = {
        "description": f"TMDB 趋势数据更新 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "files": {
            "TMDB_Trending.json": {
                "content": json.dumps(data, ensure_ascii=False, indent=2)
            }
        }
    }
    
    headers = [
        '-H', f'Authorization: token {config["github_token"]}',
        '-H', 'Accept: application/vnd.github.v3+json',
        '-H', 'Content-Type: application/json'
    ]
    
    try:
        result = subprocess.run([
            'curl', '-s', '-X', 'PATCH', url,
            *headers,
            '-d', json.dumps(gist_data)
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            response_data = json.loads(result.stdout)
            raw_url = response_data['files']['TMDB_Trending.json']['raw_url']
            print("✅ 上传成功！")
            return raw_url
        else:
            print(f"❌ 上传失败: {result.stderr}")
            return None
    except Exception as e:
        print(f"❌ 上传失败: {e}")
        return None

def main():
    print("🚀 TMDB 数据包快速设置")
    print("=" * 40)
    
    # 检查环境变量
    config = check_environment()
    if not config:
        return
    
    # 获取 TMDB 数据
    tmdb_data = get_tmdb_data(config)
    if not tmdb_data:
        return
    
    # 处理数据
    processed_data = process_data(tmdb_data)
    
    # 上传到 Gist
    raw_url = upload_to_gist(processed_data, config)
    if not raw_url:
        return
    
    print("\n🎉 设置完成！")
    print("=" * 50)
    print(f"📊 数据 URL: {raw_url}")
    print(f"🌐 Gist 页面: https://gist.github.com/{config['gist_id']}")
    print()
    print("📱 在 Widget 中使用:")
    print("```javascript")
    print("async function loadTmdbTrendingData() {")
    print(f"    const response = await Widget.http.get('{raw_url}');")
    print("    return response.data;")
    print("}")
    print("```")
    print()
    print("🔄 要更新数据，再次运行:")
    print("python3 simple_upload.py")

if __name__ == '__main__':
    main()