#!/usr/bin/env python3
"""
修复版本的快速设置脚本
"""

import os
import json
import urllib.request
import urllib.parse
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

def make_request(url, headers=None, data=None, method='GET'):
    """发送 HTTP 请求"""
    try:
        if data:
            data = json.dumps(data).encode('utf-8')
            headers = headers or {}
            headers['Content-Type'] = 'application/json'
        
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        with urllib.request.urlopen(req) as response:
            response_text = response.read().decode('utf-8')
            return json.loads(response_text)
    except Exception as e:
        print(f"请求失败: {e}")
        return None

def generate_and_upload(config):
    """生成数据并上传"""
    print("📊 正在获取 TMDB 数据...")
    
    # 获取 TMDB 数据
    url = "https://api.themoviedb.org/3/trending/all/day"
    params = {'api_key': config['tmdb_key'], 'language': 'zh-CN'}
    url_with_params = url + '?' + urllib.parse.urlencode(params)
    
    tmdb_data = make_request(url_with_params)
    if not tmdb_data or 'results' not in tmdb_data:
        print("❌ 无法获取 TMDB 数据")
        return None
    
    print(f"✅ 获取到 {len(tmdb_data['results'])} 条数据")
    
    # 处理数据
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
            "total_results": len(tmdb_data['results']),
            "source": "TMDB API",
            "request_time": datetime.now().isoformat()
        }
    }
    
    # 分类数据
    movies_count = 0
    tv_count = 0
    
    for item in tmdb_data['results']:
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
    
    # 上传到 Gist
    print("📤 正在上传到 GitHub Gist...")
    
    url = f"https://api.github.com/gists/{config['gist_id']}"
    headers = {
        'Authorization': f'token {config["github_token"]}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    gist_data = {
        "description": f"TMDB 趋势数据更新 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "files": {
            "TMDB_Trending.json": {
                "content": json.dumps(processed_data, ensure_ascii=False, indent=2)
            }
        }
    }
    
    response_data = make_request(url, headers=headers, data=gist_data, method='PATCH')
    if response_data and 'files' in response_data:
        raw_url = response_data['files']['TMDB_Trending.json']['raw_url']
        print("✅ 上传成功！")
        return raw_url
    else:
        print("❌ 上传失败")
        return None

def main():
    print("🚀 TMDB 数据包快速设置")
    print("=" * 40)
    
    # 检查环境变量
    config = check_environment()
    if not config:
        return
    
    # 生成并上传数据
    raw_url = generate_and_upload(config)
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
    print("python3 quick_setup_fixed.py")

if __name__ == '__main__':
    main()