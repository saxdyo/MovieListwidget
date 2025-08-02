#!/usr/bin/env python3
"""
TMDB增强版模块演示脚本
"""

import os
import json
from datetime import datetime, timezone, timedelta

def create_demo_data():
    """创建演示数据"""
    beijing_timezone = timezone(timedelta(hours=8))
    beijing_now = datetime.now(beijing_timezone)
    last_updated = beijing_now.strftime("%Y-%m-%d %H:%M:%S")
    
    demo_data = {
        "last_updated": last_updated,
        "today_global": [
            {
                "id": 550,
                "title": "搏击俱乐部",
                "type": "movie",
                "genreTitle": "剧情•惊悚",
                "rating": 8.8,
                "release_date": "1999-10-15",
                "overview": "一个失眠的上班族遇到了一个肥皂商，两人建立了地下搏击俱乐部，但事情开始失控...",
                "poster_url": "https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                "title_backdrop": "https://image.tmdb.org/t/p/original/example_backdrop.jpg",
                "logo_url": "https://image.tmdb.org/t/p/original/example_logo.png"
            },
            {
                "id": 1399,
                "title": "权力的游戏",
                "type": "tv",
                "genreTitle": "剧情•奇幻•冒险",
                "rating": 9.3,
                "release_date": "2011-04-17",
                "overview": "九个家族争夺铁王座，在维斯特洛大陆上展开了一场史诗般的权力斗争...",
                "poster_url": "https://image.tmdb.org/t/p/original/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
                "title_backdrop": "https://image.tmdb.org/t/p/original/example_backdrop_2.jpg",
                "logo_url": "https://image.tmdb.org/t/p/original/example_logo_2.png"
            }
        ],
        "week_global_all": [
            {
                "id": 299536,
                "title": "复仇者联盟3：无限战争",
                "type": "movie",
                "genreTitle": "动作•冒险•科幻",
                "rating": 8.4,
                "release_date": "2018-04-27",
                "overview": "复仇者联盟和他们的盟友必须愿意牺牲一切，以阻止灭霸在毁灭宇宙之前收集所有六颗无限宝石...",
                "poster_url": "https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
                "title_backdrop": "https://image.tmdb.org/t/p/original/example_backdrop_3.jpg",
                "logo_url": "https://image.tmdb.org/t/p/original/example_logo_3.png"
            }
        ],
        "popular_movies": [
            {
                "id": 299536,
                "title": "复仇者联盟3：无限战争",
                "type": "movie",
                "genreTitle": "动作•冒险•科幻",
                "rating": 8.4,
                "release_date": "2018-04-27",
                "overview": "复仇者联盟和他们的盟友必须愿意牺牲一切，以阻止灭霸在毁灭宇宙之前收集所有六颗无限宝石...",
                "poster_url": "https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
                "title_backdrop": "https://image.tmdb.org/t/p/original/example_backdrop_3.jpg",
                "logo_url": "https://image.tmdb.org/t/p/original/example_logo_3.png"
            }
        ]
    }
    
    return demo_data

def save_demo_data(data, filepath):
    """保存演示数据"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def print_demo_results(data, section_title):
    """打印演示结果"""
    print("")
    print(f"================= {section_title}  =================")
    
    items = data.get(section_title.lower().replace(" ", "_"), [])
    
    for i, item in enumerate(items, 1):
        title = item.get("title")
        item_type = item.get("type")
        rating = item.get("rating")
        genre_title = item.get("genreTitle")
        has_logo = "✅" if item.get("logo_url") else "❌"
        has_backdrop = "✅" if item.get("title_backdrop") else "❌"
        
        print(f"{i:2d}. {title} ({item_type}) 评分: {rating} | {genre_title}")
        print(f"    Logo: {has_logo} | 背景图: {has_backdrop}")

def main():
    """主函数"""
    print("🎬 TMDB增强版模块演示")
    print("=" * 50)
    
    # 检查API密钥
    if not os.getenv("TMDB_API_KEY"):
        print("⚠️  未设置TMDB_API_KEY，使用演示数据")
        print("   要获取真实数据，请设置环境变量: export TMDB_API_KEY='your_api_key'")
        print()
    
    # 创建演示数据
    demo_data = create_demo_data()
    
    # 保存演示数据
    save_path = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")
    save_demo_data(demo_data, save_path)
    
    print(f"✅ 演示数据已保存到: {save_path}")
    print(f"📅 更新时间: {demo_data['last_updated']}")
    
    # 显示演示结果
    print_demo_results(demo_data, "今日热门")
    print_demo_results(demo_data, "本周热门")
    print_demo_results(demo_data, "热门电影")
    
    print("\n" + "=" * 50)
    print("🎉 演示完成!")
    print("\n📊 新增功能:")
    print("• ✅ Logo背景图获取")
    print("• ✅ 智能图片选择算法")
    print("• ✅ 多语言支持")
    print("• ✅ 增强的错误处理")
    print("• ✅ 自动GitHub Actions部署")

if __name__ == "__main__":
    main()