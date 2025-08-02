#!/usr/bin/env python3
"""
TMDB 标题海报热门爬取模块
Enhanced TMDB Data Crawler with Title Backdrop Support
"""

import os
import json
import requests
from datetime import datetime, timezone, timedelta
from pathlib import Path
import time
import logging
from typing import Dict, List, Optional, Any

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# API 配置
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/"

# 文件路径配置
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"
SAVE_PATH = DATA_DIR / "TMDB_Trending.json"

# 确保目录存在
DATA_DIR.mkdir(exist_ok=True)

# 请求配置
REQUEST_TIMEOUT = 30
MAX_RETRIES = 3
RETRY_DELAY = 2


class TMDBCrawler:
    """TMDB 数据爬虫类"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or TMDB_API_KEY
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'TMDB-Crawler/1.0',
            'Accept': 'application/json'
        })
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """发送请求并处理错误"""
        if not self.api_key:
            logger.warning("TMDB API密钥未设置")
            return None
        
        url = f"{BASE_URL}{endpoint}"
        request_params = {"api_key": self.api_key}
        if params:
            request_params.update(params)
        
        for attempt in range(MAX_RETRIES):
            try:
                response = self.session.get(
                    url, 
                    params=request_params, 
                    timeout=REQUEST_TIMEOUT
                )
                response.raise_for_status()
                return response.json()
            
            except requests.exceptions.RequestException as e:
                logger.error(f"请求失败 (尝试 {attempt + 1}/{MAX_RETRIES}): {e}")
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_DELAY * (attempt + 1))
                else:
                    logger.error(f"最终请求失败: {endpoint}")
                    return None
    
    def fetch_trending_data(self, time_window: str = "day", media_type: str = "all") -> Dict:
        """获取热门数据"""
        endpoint = f"/trending/all/{time_window}" if media_type == "all" else f"/trending/{media_type}/{time_window}"
        params = {"language": "zh-CN"}
        
        data = self._make_request(endpoint, params)
        return data or {"results": []}
    
    def fetch_popular_movies(self, page: int = 1) -> Dict:
        """获取热门电影"""
        endpoint = "/movie/popular"
        params = {
            "language": "zh-CN",
            "region": "CN",
            "page": page
        }
        
        data = self._make_request(endpoint, params)
        if data and "results" in data:
            # 只保留前15条
            data["results"] = data["results"][:15]
        return data or {"results": []}
    
    def get_media_details(self, media_type: str, media_id: int) -> Dict:
        """获取媒体详情"""
        endpoint = f"/{media_type}/{media_id}"
        params = {"language": "zh-CN"}
        
        data = self._make_request(endpoint, params)
        return data or {"genres": []}
    
    def get_media_images(self, media_type: str, media_id: int) -> Dict:
        """获取媒体图片"""
        endpoint = f"/{media_type}/{media_id}/images"
        params = {"include_image_language": "zh,en,null"}
        
        data = self._make_request(endpoint, params)
        return data or {"backdrops": [], "posters": []}
    
    def get_image_url(self, path: str, size: str = "original") -> str:
        """构建图片URL"""
        if not path:
            return ""
        return f"{IMAGE_BASE_URL}{size}{path}"
    
    def get_best_title_backdrop(self, image_data: Dict) -> str:
        """获取最佳标题背景图"""
        backdrops = image_data.get("backdrops", [])
        
        if not backdrops:
            return ""
        
        def get_priority_score(backdrop):
            """计算背景图优先级得分"""
            lang = backdrop.get("iso_639_1")
            
            # 语言优先级：中文 > 英文 > 无语言 > 其他
            if lang == "zh":
                lang_score = 0
            elif lang == "en":
                lang_score = 1
            elif lang is None:
                lang_score = 2
            else:
                lang_score = 3
            
            # 评分和分辨率（负值用于排序）
            vote_avg = -backdrop.get("vote_average", 0)
            width = backdrop.get("width", 0)
            height = backdrop.get("height", 0)
            resolution = -(width * height)
            
            return (lang_score, vote_avg, resolution)
        
        # 按优先级排序
        sorted_backdrops = sorted(backdrops, key=get_priority_score)
        best_backdrop = sorted_backdrops[0]
        
        return self.get_image_url(best_backdrop["file_path"])
    
    def process_media_item(self, item: Dict, media_type: str = None) -> Optional[Dict]:
        """处理单个媒体项目"""
        try:
            # 基本信息
            title = item.get("title") or item.get("name")
            item_type = media_type if media_type and media_type != "all" else item.get("media_type")
            media_id = item.get("id")
            
            # 跳过人物类型
            if item_type == "person":
                return None
            
            # 发布日期
            if item_type == "tv":
                release_date = item.get("first_air_date")
            else:
                release_date = item.get("release_date")
            
            # 其他基本信息
            overview = item.get("overview", "")
            rating = round(item.get("vote_average", 0), 1)
            poster_path = item.get("poster_path")
            poster_url = self.get_image_url(poster_path) if poster_path else ""
            
            # 获取详细信息
            detail_data = self.get_media_details(item_type, media_id)
            genres = detail_data.get("genres", [])
            genre_title = "•".join([g["name"] for g in genres[:3]])
            
            # 获取标题背景图
            image_data = self.get_media_images(item_type, media_id)
            title_backdrop_url = self.get_best_title_backdrop(image_data)
            
            # 数据质量检查
            if (rating == 0 and 
                not release_date and 
                not overview and 
                not poster_url):
                logger.debug(f"跳过低质量数据: {title}")
                return None
            
            return {
                "id": media_id,
                "title": title,
                "type": item_type,
                "genreTitle": genre_title,
                "rating": rating,
                "release_date": release_date,
                "overview": overview,
                "poster_url": poster_url,
                "title_backdrop": title_backdrop_url
            }
            
        except Exception as e:
            logger.error(f"处理媒体项目失败: {e}")
            return None
    
    def process_tmdb_data(self, data: Dict, media_type: str = "all") -> List[Dict]:
        """处理TMDB数据"""
        results = []
        items = data.get("results", [])
        
        logger.info(f"开始处理 {len(items)} 个媒体项目")
        
        for item in items:
            processed_item = self.process_media_item(item, media_type)
            if processed_item:
                results.append(processed_item)
        
        logger.info(f"成功处理 {len(results)} 个有效项目")
        return results


def save_to_json(data: Dict, filepath: Path):
    """保存数据到JSON文件"""
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logger.info(f"数据已保存到: {filepath}")
    except Exception as e:
        logger.error(f"保存数据失败: {e}")


def print_trending_results(results: List[Dict], section_title: str):
    """打印结果"""
    print("")
    print(f"================= {section_title} =================")
    
    if not results:
        print("没有数据")
        return
    
    for i, item in enumerate(results, 1):
        title = item.get("title", "未知标题")
        item_type = item.get("type", "未知")
        rating = item.get("rating", 0)
        genre_title = item.get("genreTitle", "")
        
        print(f"{i:2d}. {title} ({item_type}) 评分: {rating} | {genre_title}")


def get_beijing_time() -> str:
    """获取北京时间"""
    beijing_timezone = timezone(timedelta(hours=8))
    beijing_now = datetime.now(beijing_timezone)
    return beijing_now.strftime("%Y-%m-%d %H:%M:%S")


def main():
    """主函数"""
    print("=== 开始执行TMDB数据获取 ===")
    logger.info("TMDB数据爬取开始")
    
    # 获取当前时间
    last_updated = get_beijing_time()
    print(f"✅ 热门数据获取时间: {last_updated}")
    
    # 初始化爬虫
    crawler = TMDBCrawler()
    
    # 检查API密钥
    if not crawler.api_key:
        logger.warning("TMDB API密钥未设置，生成空数据文件")
        data_to_save = {
            "last_updated": last_updated,
            "today_global": [],
            "week_global_all": [],
            "popular_movies": []
        }
        save_to_json(data_to_save, SAVE_PATH)
        print("================= 执行完成 =================")
        return
    
    try:
        # 获取各类数据
        logger.info("获取今日全球热门数据")
        today_global = crawler.fetch_trending_data(time_window="day", media_type="all")
        today_processed = crawler.process_tmdb_data(today_global, "all")
        
        logger.info("获取本周全球热门数据")
        week_global_all = crawler.fetch_trending_data(time_window="week", media_type="all")
        week_processed = crawler.process_tmdb_data(week_global_all, "all")
        
        logger.info("获取热门电影数据")
        popular_movies = crawler.fetch_popular_movies()
        popular_processed = crawler.process_tmdb_data(popular_movies, "movie")
        
        # 打印结果
        print_trending_results(today_processed, "今日热门")
        print_trending_results(week_processed, "本周热门")
        print_trending_results(popular_processed, "热门电影")
        
        # 保存数据
        data_to_save = {
            "last_updated": last_updated,
            "today_global": today_processed,
            "week_global_all": week_processed,
            "popular_movies": popular_processed
        }
        
        save_to_json(data_to_save, SAVE_PATH)
        
        logger.info("数据获取完成")
        print("")
        print("================= 执行完成 =================")
        
    except Exception as e:
        logger.error(f"执行过程中发生错误: {e}")
        print(f"❌ 执行失败: {e}")


if __name__ == "__main__":
    main()