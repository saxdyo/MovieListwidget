#!/usr/bin/env python3
"""
TMDB 标题海报热门爬取模块 - 项目演示
Project Demo for TMDB Trending Crawler Module
"""

import os
import json
from pathlib import Path
from datetime import datetime

def print_banner():
    """打印项目横幅"""
    banner = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                         🎬 TMDB 标题海报热门爬取模块                          ║
║                      TMDB Trending Movie & TV Poster Crawler                ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_project_structure():
    """检查项目结构"""
    print("📁 检查项目结构...")
    
    required_files = [
        "scripts/get_tmdb_data.py",
        "scripts/generate_logo.py", 
        ".github/workflows/tmdb-trending-crawler.yml",
        "requirements.txt",
        "TMDB_Crawler_Guide.md"
    ]
    
    required_dirs = [
        "scripts",
        "data", 
        "icons/generated",
        ".github/workflows"
    ]
    
    print("\n✅ 核心文件:")
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"   ✓ {file_path}")
        else:
            print(f"   ✗ {file_path} (缺失)")
    
    print("\n✅ 目录结构:")
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"   ✓ {dir_path}/")
        else:
            print(f"   ✗ {dir_path}/ (缺失)")

def check_generated_assets():
    """检查生成的资源"""
    print("\n🎨 检查生成的Logo和背景图...")
    
    generated_dir = Path("icons/generated")
    if not generated_dir.exists():
        print("   ❌ 生成目录不存在")
        return
    
    # Logo文件
    logo_sizes = [64, 128, 256, 512, 1024]
    print("\n📱 Logo 图标:")
    for size in logo_sizes:
        logo_file = generated_dir / f"tmdb_logo_{size}x{size}.png"
        if logo_file.exists():
            file_size = logo_file.stat().st_size / 1024
            print(f"   ✓ {size}x{size} Logo ({file_size:.1f} KB)")
        else:
            print(f"   ✗ {size}x{size} Logo (缺失)")
    
    # 背景图文件
    background_files = [
        ("横幅背景", "tmdb_banner_1200x400.png"),
        ("GitHub预览", "github_social_preview.png"),
        ("Full HD", "tmdb_background_1920x1080.png"),
        ("HD", "tmdb_background_1280x720.png"),
        ("16:9", "tmdb_background_1600x900.png"),
        ("4:3", "tmdb_background_800x600.png")
    ]
    
    print("\n🖼️ 背景图片:")
    for desc, filename in background_files:
        bg_file = generated_dir / filename
        if bg_file.exists():
            file_size = bg_file.stat().st_size / 1024
            print(f"   ✓ {desc} ({file_size:.1f} KB)")
        else:
            print(f"   ✗ {desc} (缺失)")

def check_data_file():
    """检查数据文件"""
    print("\n📊 检查数据文件...")
    
    data_file = Path("data/TMDB_Trending.json")
    if not data_file.exists():
        print("   ❌ 数据文件不存在")
        return
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"   ✓ 数据文件存在 ({data_file.stat().st_size / 1024:.1f} KB)")
        print(f"   📅 最后更新: {data.get('last_updated', '未知')}")
        print(f"   🎬 今日热门: {len(data.get('today_global', []))} 条")
        print(f"   📺 本周热门: {len(data.get('week_global_all', []))} 条")
        print(f"   🍿 热门电影: {len(data.get('popular_movies', []))} 条")
        
    except Exception as e:
        print(f"   ❌ 读取数据文件失败: {e}")

def show_usage_examples():
    """显示使用示例"""
    print("\n💻 使用示例:")
    
    print("\n1. 手动运行爬虫:")
    print("   export TMDB_API_KEY='your_api_key'")
    print("   python3 scripts/get_tmdb_data.py")
    
    print("\n2. 生成Logo和背景图:")
    print("   python3 scripts/generate_logo.py")
    
    print("\n3. 读取数据 (Python):")
    print("""   import json
   with open('data/TMDB_Trending.json', 'r') as f:
       data = json.load(f)
   print(f"共有 {len(data['today_global'])} 条今日热门数据")""")
    
    print("\n4. GitHub Actions 自动运行:")
    print("   - 设置仓库 Secret: TMDB_API_KEY")
    print("   - 每15分钟自动执行")
    print("   - 数据变化时自动提交")

def show_project_info():
    """显示项目信息"""
    print("\n📋 项目信息:")
    print("   🎯 项目名称: TMDB 标题海报热门爬取模块")
    print("   🔧 开发语言: Python 3.11+")
    print("   📦 主要依赖: requests, Pillow, Flask")
    print("   🤖 自动化: GitHub Actions")
    print("   📊 数据格式: JSON")
    print("   🌐 数据源: TMDB API")
    print("   🎨 图形资源: 自动生成Logo和背景图")

def show_features():
    """显示功能特性"""
    print("\n✨ 功能特性:")
    features = [
        "🎯 实时热门数据获取 - 今日/本周全球热门内容",
        "🖼️ 标题背景图抓取 - 智能选择最佳质量的背景图",  
        "🔄 自动定时更新 - GitHub Actions 每15分钟运行",
        "📊 结构化数据输出 - JSON 格式，易于集成",
        "🌏 多语言支持 - 优先中文，回退英文",
        "⚡ 高性能爬取 - 请求重试、错误恢复",
        "🛡️ 数据质量控制 - 自动过滤低质量数据",
        "🎨 Logo和背景图生成 - 多尺寸、多格式"
    ]
    
    for feature in features:
        print(f"   {feature}")

def main():
    """主函数"""
    print_banner()
    show_project_info()
    show_features()
    check_project_structure()
    check_generated_assets()
    check_data_file()
    show_usage_examples()
    
    print("\n" + "="*80)
    print("🎉 TMDB 标题海报热门爬取模块演示完成!")
    print("📖 详细使用说明请查看: TMDB_Crawler_Guide.md")
    print("🚀 开始使用: python3 scripts/get_tmdb_data.py")
    print("=" * 80)

if __name__ == "__main__":
    main()