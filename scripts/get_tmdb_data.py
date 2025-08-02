#!/usr/bin/env python3
"""get_tmdb_data.py
抓取 TMDB 今日/本周趋势及热门电影数据, 并挑选适合的 Poster / Logo / 背景图等信息
输出到 data/TMDB_Trending.json, 供小组件 / 个人项目使用
"""

import os
import json
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Dict, List

import requests

# --------------------------- 配置 ---------------------------
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE = "https://image.tmdb.org/t/p/"

# 输出路径: <项目根>/data/TMDB_Trending.json
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)
SAVE_PATH = DATA_DIR / "TMDB_Trending.json"

# --------------------------- 工具函数 ---------------------------

def build_image_url(path: str | None, size: str = "original") -> str:
    """构造 TMDB 图片完整地址"""
    if not path:
        return ""
    return f"{IMAGE_BASE}{size}{path}"


def fetch_tmdb_data(time_window: str = "day", media_type: str = "all") -> Dict[str, Any]:
    """获取 Trending 数据"""
    if not TMDB_API_KEY:
        return {"results": []}

    endpoint = f"/trending/all/{time_window}" if media_type == "all" else f"/trending/{media_type}/{time_window}"
    url = f"{BASE_URL}{endpoint}"
    params = {"api_key": TMDB_API_KEY, "language": "zh-CN"}

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


def fetch_popular_movies() -> Dict[str, Any]:
    """获取热门电影前 15"""
    if not TMDB_API_KEY:
        return {"results": []}

    url = f"{BASE_URL}/movie/popular"
    params = {
        "api_key": TMDB_API_KEY,
        "language": "zh-CN",
        "region": "CN",
        "page": 1,
    }
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
    data["results"] = data.get("results", [])[:15]
    return data


def get_media_details(media_type: str, media_id: int) -> Dict[str, Any]:
    if not TMDB_API_KEY:
        return {"genres": []}
    url = f"{BASE_URL}/{media_type}/{media_id}"
    params = {"api_key": TMDB_API_KEY, "language": "zh-CN"}
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


def get_media_images(media_type: str, media_id: int) -> Dict[str, Any]:
    url = f"{BASE_URL}/{media_type}/{media_id}/images"
    params = {
        "api_key": TMDB_API_KEY,
        "include_image_language": "zh,en,null",
    }
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


# --------------------------- 图片挑选 ---------------------------

def _img_priority(img: Dict[str, Any]):
    """用于排序的优先级元组 (越小越优)"""
    lang = img.get("iso_639_1")
    if lang == "zh":
        lang_score = 0
    elif lang == "en":
        lang_score = 1
    elif lang is None:
        lang_score = 2
    else:
        lang_score = 3
    vote_score = -img.get("vote_average", 0)
    size_score = -(img.get("width", 0) * img.get("height", 0))
    return (lang_score, vote_score, size_score)


def pick_best(images: List[Dict[str, Any]]) -> str:
    if not images:
        return ""
    best = min(images, key=_img_priority)
    return build_image_url(best.get("file_path"))


def get_best_logo(image_data: Dict[str, Any]) -> str:
    return pick_best(image_data.get("logos", []))


def get_best_backdrop(image_data: Dict[str, Any]) -> str:
    return pick_best(image_data.get("backdrops", []))

# --------------------------- 数据处理 ---------------------------

def process_tmdb_data(raw: Dict[str, Any], media_type: str) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []

    for item in raw.get("results", []):
        item_type = media_type if media_type != "all" else item.get("media_type")
        if item_type == "person":
            continue  # 跳过演员条目

        title = item.get("title") or item.get("name")
        release_date = item.get("release_date") or item.get("first_air_date")
        rating = round(item.get("vote_average", 0), 1)
        media_id = item.get("id")

        # 获取详细信息 & 图片
        detail = get_media_details(item_type, media_id)
        genres = "•".join(g["name"] for g in detail.get("genres", [])[:3])

        images = get_media_images(item_type, media_id)
        logo_url = get_best_logo(images)
        backdrop_url = get_best_backdrop(images)

        poster_url = build_image_url(item.get("poster_path"))

        # 过滤无用条目
        if (
            rating == 0
            and not release_date
            and not item.get("overview")
            and not poster_url
        ):
            continue

        results.append(
            {
                "id": media_id,
                "title": title,
                "type": item_type,
                "genreTitle": genres,
                "rating": rating,
                "release_date": release_date,
                "overview": item.get("overview"),
                "poster_url": poster_url,
                "logo_url": logo_url,
                "title_backdrop": backdrop_url,
            }
        )

    return results

# --------------------------- I/O ---------------------------

def save_to_json(data: Dict[str, Any], path: Path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def print_section(title: str, items: List[Dict[str, Any]]):
    print(f"\n================= {title} =================")
    for idx, itm in enumerate(items, 1):
        print(f"{idx:2d}. {itm['title']} ({itm['type']}) 评分: {itm['rating']} | {itm['genreTitle']}")


# --------------------------- 主流程 ---------------------------

def main():
    print("=== 开始执行 TMDB 数据获取 ===")

    beijing_tz = timezone(timedelta(hours=8))
    now_str = datetime.now(beijing_tz).strftime("%Y-%m-%d %H:%M:%S")

    if not TMDB_API_KEY:
        print("未检测到 TMDB_API_KEY, 仅输出空数据文件以避免工作流失败")
        save_to_json(
            {
                "last_updated": now_str,
                "today_global": [],
                "week_global_all": [],
                "popular_movies": [],
            },
            SAVE_PATH,
        )
        print("get_tmdb_data.py 运行完成")
        return

    # 1. 今日趋势 (all)
    today_raw = fetch_tmdb_data("day", "all")
    today_list = process_tmdb_data(today_raw, "all")

    # 2. 本周趋势 (all)
    week_raw = fetch_tmdb_data("week", "all")
    week_list = process_tmdb_data(week_raw, "all")

    # 3. 热门电影
    popular_raw = fetch_popular_movies()
    popular_list = process_tmdb_data(popular_raw, "movie")

    print(f"✅ 数据抓取时间: {now_str}")
    print_section("今日热门", today_list)
    print_section("本周热门", week_list)
    if popular_list:
        print_section("热门电影", popular_list)

    save_to_json(
        {
            "last_updated": now_str,
            "today_global": today_list,
            "week_global_all": week_list,
            "popular_movies": popular_list,
        },
        SAVE_PATH,
    )

    print("\n================= 执行完成 =================")


if __name__ == "__main__":
    main()