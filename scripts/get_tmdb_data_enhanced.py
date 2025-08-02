import os
import json
import requests
from datetime import datetime, timezone, timedelta
import time

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
SAVE_PATH = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")

def fetch_tmdb_data(time_window="day", media_type="all"):
    """获取TMDB趋势数据"""
    if not TMDB_API_KEY:
        return {"results": []}

    endpoint = f"/trending/all/{time_window}" if media_type == "all" else f"/trending/{media_type}/{time_window}"
    url = f"{BASE_URL}{endpoint}"
    params = {"api_key": TMDB_API_KEY, "language": "zh-CN"}

    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"获取趋势数据失败: {e}")
        return {"results": []}

def fetch_popular_movies():  
    """获取热门电影数据"""
    if not TMDB_API_KEY:
        return {"results": []}
    
    endpoint = "/movie/popular"
    url = f"{BASE_URL}{endpoint}"
    params = {
        "api_key": TMDB_API_KEY,
        "language": "zh-CN",
        "region": "CN",
        "page": 1
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        data["results"] = data["results"][:15]
        return data
    except requests.RequestException as e:
        print(f"获取热门电影失败: {e}")
        return {"results": []}

def get_media_details(media_type, media_id):
    """获取媒体详细信息"""
    if not TMDB_API_KEY:
        return {"genres": []}
    
    detail_endpoint = f"/{media_type}/{media_id}"
    url = f"{BASE_URL}{detail_endpoint}"
    params = {"api_key": TMDB_API_KEY, "language": "zh-CN"}
    
    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"获取媒体详情失败 {media_type}/{media_id}: {e}")
        return {"genres": []}

def get_media_images(media_type, media_id):
    """获取媒体图片数据"""
    if not TMDB_API_KEY:
        return {"backdrops": [], "logos": []}
    
    images_endpoint = f"/{media_type}/{media_id}/images"
    url = f"{BASE_URL}{images_endpoint}"
    params = {
        "api_key": TMDB_API_KEY,
        "include_image_language": "zh,en,null"
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"获取媒体图片失败 {media_type}/{media_id}: {e}")
        return {"backdrops": [], "logos": []}

def get_image_url(path, size="original"):
    """生成图片URL"""
    if not path:
        return ""
    return f"https://image.tmdb.org/t/p/{size}{path}"

def get_best_title_backdrop(image_data):
    """获取最佳标题背景图"""
    backdrops = image_data.get("backdrops", [])
    
    if not backdrops:
        return ""
    
    def get_priority_score(backdrop):
        lang = backdrop.get("iso_639_1")
        if lang == "zh":
            lang_score = 0
        elif lang == "en":
            lang_score = 1
        elif lang is None:
            lang_score = 2
        else:
            lang_score = 3
        
        vote_avg = -backdrop.get("vote_average", 0)
        width = backdrop.get("width", 0)
        height = backdrop.get("height", 0)
        resolution = -(width * height)
        
        return (lang_score, vote_avg, resolution)
    
    sorted_backdrops = sorted(backdrops, key=get_priority_score)
    best_backdrop = sorted_backdrops[0]
    return get_image_url(best_backdrop["file_path"])

def get_best_logo(image_data):
    """获取最佳logo"""
    logos = image_data.get("logos", [])
    
    if not logos:
        return ""
    
    def get_logo_priority_score(logo):
        lang = logo.get("iso_639_1")
        if lang == "zh":
            lang_score = 0
        elif lang == "en":
            lang_score = 1
        elif lang is None:
            lang_score = 2
        else:
            lang_score = 3
        
        vote_avg = -logo.get("vote_average", 0)
        width = logo.get("width", 0)
        height = logo.get("height", 0)
        resolution = -(width * height)
        
        return (lang_score, vote_avg, resolution)
    
    sorted_logos = sorted(logos, key=get_logo_priority_score)
    best_logo = sorted_logos[0]
    return get_image_url(best_logo["file_path"])

def process_tmdb_data(data, time_window, media_type):
    """处理TMDB数据"""
    results = []
    
    for item in data.get("results", []):
        title = item.get("title") or item.get("name")
        item_type = media_type if media_type != "all" else item.get("media_type")
        
        if item_type == "tv":
            release_date = item.get("first_air_date")
        else:
            release_date = item.get("release_date")
        
        overview = item.get("overview")
        rating = round(item.get("vote_average", 0), 1)
        media_id = item.get("id")

        poster_url = get_image_url(item.get("poster_path"))

        # 获取详细信息
        detail_data = get_media_details(item_type, media_id)
        genres = detail_data.get("genres", [])
        genre_title = "•".join([g["name"] for g in genres[:3]])

        # 获取图片数据
        image_data = get_media_images(item_type, media_id)
        title_backdrop_url = get_best_title_backdrop(image_data)
        logo_url = get_best_logo(image_data)

        # 跳过人物类型
        if item_type == "person":
            continue
            
        # 跳过无效数据
        if (rating == 0 and 
            not release_date and 
            not overview and 
            "None" in poster_url):
            continue

        # 添加延迟避免API限制
        time.sleep(0.1)

        results.append({
            "id": media_id,
            "title": title,
            "type": item_type,
            "genreTitle": genre_title,
            "rating": rating,
            "release_date": release_date,
            "overview": overview,
            "poster_url": poster_url,
            "title_backdrop": title_backdrop_url,
            "logo_url": logo_url
        })
    
    return results

def save_to_json(data, filepath):
    """保存数据到JSON文件"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def print_trending_results(results, section_title):
    """打印趋势结果"""
    print("")
    print(f"================= {section_title}  =================")
    
    for i, item in enumerate(results, 1):
        title = item.get("title")
        item_type = item.get("type")
        rating = item.get("rating")
        genre_title = item.get("genreTitle")
        has_logo = "✅" if item.get("logo_url") else "❌"
        
        print(f"{i:2d}. {title} ({item_type}) 评分: {rating} | {genre_title} | Logo: {has_logo}")

def main():
    """主函数"""
    print("=== 开始执行TMDB数据获取 (增强版) ===")
    
    if not TMDB_API_KEY:
        beijing_timezone = timezone(timedelta(hours=8))
        beijing_now = datetime.now(beijing_timezone)
        last_updated = beijing_now.strftime("%Y-%m-%d %H:%M:%S")
        
        print(f"✅ 热门数据获取时间: {last_updated}")
        print("⚠️  未设置TMDB_API_KEY，使用空数据")
        
        data_to_save = {
            "last_updated": last_updated,
            "today_global": [],
            "week_global_all": [],
            "popular_movies": []
        }
        save_to_json(data_to_save, SAVE_PATH)
        print("")
        print("================= 执行完成 =================")
        print("get_tmdb_data_enhanced.py 运行完成")
        return

    print("🔄 获取今日热门数据...")
    today_global = fetch_tmdb_data(time_window="day", media_type="all")
    today_processed = process_tmdb_data(today_global, "day", "all")

    print("🔄 获取本周热门数据...")
    week_global_all = fetch_tmdb_data(time_window="week", media_type="all")
    week_processed = process_tmdb_data(week_global_all, "week", "all")

    print("🔄 获取热门电影数据...")
    popular_movies = fetch_popular_movies()
    popular_processed = process_tmdb_data(popular_movies, "popular", "movie")

    beijing_timezone = timezone(timedelta(hours=8))
    beijing_now = datetime.now(beijing_timezone)
    last_updated = beijing_now.strftime("%Y-%m-%d %H:%M:%S")

    print(f"✅ 热门数据获取时间: {last_updated}")

    print_trending_results(today_processed, "今日热门")
    print_trending_results(week_processed, "本周热门")
    
    if popular_processed:
        print_trending_results(popular_processed, "热门电影")

    data_to_save = {
        "last_updated": last_updated,
        "today_global": today_processed,
        "week_global_all": week_processed,
        "popular_movies": popular_processed
    }

    save_to_json(data_to_save, SAVE_PATH)
    
    print("")
    print("================= 执行完成 =================")
    print("✅ 数据已保存到:", SAVE_PATH)

if __name__ == "__main__":
    main()