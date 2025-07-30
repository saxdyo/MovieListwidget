#!/usr/bin/env python3
"""
TMDB 数据包快速设置脚本
最简单的配置方式
"""

import os
import json
import requests
from datetime import datetime

def get_user_input():
    """获取用户输入"""
    print("🚀 TMDB 数据包快速设置")
    print("=" * 40)
    
    # 获取 TMDB API 密钥
    tmdb_key = input("请输入你的 TMDB API 密钥: ").strip()
    if not tmdb_key:
        print("❌ TMDB API 密钥不能为空")
        return None
    
    # 获取 GitHub Token
    github_token = input("请输入你的 GitHub Token: ").strip()
    if not github_token:
        print("❌ GitHub Token 不能为空")
        return None
    
    # 获取 Gist ID
    gist_id = input("请输入你的 Gist ID: ").strip()
    if not gist_id:
        print("❌ Gist ID 不能为空")
        return None
    
    return {
        'tmdb_key': tmdb_key,
        'github_token': github_token,
        'gist_id': gist_id
    }

def test_tmdb_api(api_key):
    """测试 TMDB API"""
    try:
        url = "https://api.themoviedb.org/3/trending/all/day"
        params = {'api_key': api_key, 'language': 'zh-CN'}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"✅ TMDB API 测试成功，获取到 {len(data.get('results', []))} 条数据")
        return True
    except Exception as e:
        print(f"❌ TMDB API 测试失败: {e}")
        return False

def test_github_gist(token, gist_id):
    """测试 GitHub Gist"""
    try:
        url = f"https://api.github.com/gists/{gist_id}"
        headers = {
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        print("✅ GitHub Gist 测试成功")
        return True
    except Exception as e:
        print(f"❌ GitHub Gist 测试失败: {e}")
        return False

def generate_sample_data(tmdb_key):
    """生成示例数据"""
    try:
        url = "https://api.themoviedb.org/3/trending/all/day"
        params = {'api_key': tmdb_key, 'language': 'zh-CN'}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        tmdb_data = response.json()
        
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
        
        return processed_data
    except Exception as e:
        print(f"❌ 生成示例数据失败: {e}")
        return None

def upload_to_gist(data, token, gist_id):
    """上传数据到 Gist"""
    try:
        url = f"https://api.github.com/gists/{gist_id}"
        
        headers = {
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        gist_data = {
            "description": f"TMDB 趋势数据更新 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "files": {
                "TMDB_Trending.json": {
                    "content": json.dumps(data, ensure_ascii=False, indent=2)
                }
            }
        }
        
        response = requests.patch(url, headers=headers, json=gist_data)
        response.raise_for_status()
        
        gist_info = response.json()
        raw_url = gist_info['files']['TMDB_Trending.json']['raw_url']
        
        return raw_url
    except Exception as e:
        print(f"❌ 上传到 Gist 失败: {e}")
        return None

def save_config(config):
    """保存配置到文件"""
    try:
        with open('config.json', 'w') as f:
            json.dump(config, f, indent=2)
        print("✅ 配置已保存到 config.json")
    except Exception as e:
        print(f"❌ 保存配置失败: {e}")

def main():
    print("🎬 TMDB 数据包快速设置工具")
    print("这个工具会帮你快速设置 TMDB 数据包")
    print()
    
    # 获取用户输入
    config = get_user_input()
    if not config:
        return
    
    print("\n🔍 正在测试配置...")
    
    # 测试 TMDB API
    if not test_tmdb_api(config['tmdb_key']):
        return
    
    # 测试 GitHub Gist
    if not test_github_gist(config['github_token'], config['gist_id']):
        return
    
    print("\n📊 正在生成示例数据...")
    
    # 生成示例数据
    sample_data = generate_sample_data(config['tmdb_key'])
    if not sample_data:
        return
    
    print(f"✅ 生成了 {len(sample_data['data']['movies'])} 部电影和 {len(sample_data['data']['tv_shows'])} 部电视剧的数据")
    
    print("\n📤 正在上传到 GitHub Gist...")
    
    # 上传到 Gist
    raw_url = upload_to_gist(sample_data, config['github_token'], config['gist_id'])
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
    print("🔄 要更新数据，运行:")
    print("python scripts/simple_gist_upload.py")
    print()
    print("💡 提示：")
    print("- 数据会每6小时自动更新（如果设置了 GitHub Actions）")
    print("- 你也可以手动运行更新脚本")
    print("- 所有配置已保存，下次可以直接使用")
    
    # 保存配置
    save_config(config)

if __name__ == '__main__':
    main()