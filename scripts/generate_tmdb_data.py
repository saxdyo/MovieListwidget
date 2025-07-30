#!/usr/bin/env python3
"""
TMDB 数据包生成脚本
用于生成类似 ForwardWidgets 的 TMDB_Trending.json 数据文件
"""

import os
import json
import requests
from datetime import datetime
from pathlib import Path

# TMDB API 配置
TMDB_API_KEY = os.environ.get('TMDB_API_KEY', 'your_tmdb_api_key_here')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# 数据文件路径
DATA_DIR = Path(__file__).parent.parent / 'data'
OUTPUT_FILE = DATA_DIR / 'TMDB_Trending.json'

# 确保数据目录存在
DATA_DIR.mkdir(exist_ok=True)

def fetch_tmdb_trending_data():
    """获取 TMDB 趋势数据"""
    try:
        url = f"{TMDB_BASE_URL}/trending/all/day"
        params = {
            'api_key': TMDB_API_KEY,
            'language': 'zh-CN'
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
    except requests.RequestException as e:
        print(f"获取 TMDB 数据失败: {e}")
        return None

def fetch_tmdb_config():
    """获取 TMDB 配置信息"""
    try:
        url = f"{TMDB_BASE_URL}/configuration"
        params = {'api_key': TMDB_API_KEY}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
    except requests.RequestException as e:
        print(f"获取 TMDB 配置失败: {e}")
        return None

def fetch_tmdb_genres():
    """获取电影类型信息"""
    try:
        # 并行获取电影和电视剧类型
        movie_url = f"{TMDB_BASE_URL}/genre/movie/list"
        tv_url = f"{TMDB_BASE_URL}/genre/tv/list"
        
        params = {
            'api_key': TMDB_API_KEY,
            'language': 'zh-CN'
        }
        
        movie_response = requests.get(movie_url, params=params)
        tv_response = requests.get(tv_url, params=params)
        
        movie_response.raise_for_status()
        tv_response.raise_for_status()
        
        movie_genres = movie_response.json()['genres']
        tv_genres = tv_response.json()['genres']
        
        # 合并类型信息
        genres = {}
        for genre in movie_genres + tv_genres:
            genres[genre['id']] = genre['name']
        
        return genres
    except requests.RequestException as e:
        print(f"获取类型信息失败: {e}")
        return {}

def process_tmdb_data(raw_data, config, genres):
    """处理数据并生成自定义格式"""
    movies = []
    tv_shows = []
    people = []
    
    for item in raw_data['results']:
        processed_item = {
            'id': item['id'],
            'poster_path': item.get('poster_path'),
            'backdrop_path': item.get('backdrop_path'),
            'vote_average': item.get('vote_average', 0),
            'vote_count': item.get('vote_count', 0),
            'popularity': item.get('popularity', 0),
            'genre_ids': item.get('genre_ids', []),
            'adult': item.get('adult', False),
            'original_language': item.get('original_language', 'en'),
            'media_type': item['media_type']
        }
        
        if item['media_type'] == 'movie':
            movies.append({
                **processed_item,
                'title': item.get('title', ''),
                'original_title': item.get('original_title', ''),
                'overview': item.get('overview', ''),
                'release_date': item.get('release_date', ''),
                'video': item.get('video', False)
            })
        elif item['media_type'] == 'tv':
            tv_shows.append({
                **processed_item,
                'name': item.get('name', ''),
                'original_name': item.get('original_name', ''),
                'overview': item.get('overview', ''),
                'first_air_date': item.get('first_air_date', ''),
                'origin_country': item.get('origin_country', [])
            })
        elif item['media_type'] == 'person':
            people.append({
                **processed_item,
                'name': item.get('name', ''),
                'original_name': item.get('original_name', ''),
                'profile_path': item.get('profile_path'),
                'known_for_department': item.get('known_for_department', ''),
                'gender': item.get('gender', 0)
            })
    
    return {
        'movies': movies,
        'tv_shows': tv_shows,
        'people': people
    }

def generate_data_package(processed_data, config, genres):
    """生成完整的数据包"""
    now = datetime.now().isoformat()
    
    return {
        'last_updated': now,
        'version': '1.0.0',
        'description': 'TMDB Trending Movies and TV Shows Data',
        'data': processed_data,
        'metadata': {
            'total_results': len(processed_data['movies']) + len(processed_data['tv_shows']) + len(processed_data['people']),
            'total_pages': 1,
            'page': 1,
            'source': 'TMDB API',
            'api_version': '3',
            'request_time': now,
            'cache_duration': 3600
        },
        'genres': genres,
        'config': config
    }

def main():
    """主函数"""
    print('开始生成 TMDB 数据文件...')
    
    # 检查 API 密钥
    if not TMDB_API_KEY or TMDB_API_KEY == 'your_tmdb_api_key_here':
        print('请设置 TMDB_API_KEY 环境变量')
        print('获取 API 密钥: https://www.themoviedb.org/settings/api')
        return
    
    try:
        # 获取所有数据
        trending_data = fetch_tmdb_trending_data()
        config = fetch_tmdb_config()
        genres = fetch_tmdb_genres()
        
        if not trending_data:
            print('无法获取趋势数据')
            return
        
        # 处理数据
        processed_data = process_tmdb_data(trending_data, config, genres)
        
        # 生成数据包
        data_package = generate_data_package(processed_data, config, genres)
        
        # 写入文件
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(data_package, f, ensure_ascii=False, indent=2)
        
        print(f'✅ 数据文件已生成: {OUTPUT_FILE}')
        print(f'📊 包含 {len(processed_data["movies"])} 部电影')
        print(f'📺 包含 {len(processed_data["tv_shows"])} 部剧集')
        print(f'👥 包含 {len(processed_data["people"])} 位演员')
        print(f'🕒 更新时间: {data_package["last_updated"]}')
        
    except Exception as e:
        print(f'生成数据文件失败: {e}')

if __name__ == '__main__':
    main()