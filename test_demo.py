#!/usr/bin/env python3
"""
TMDB 数据包设置演示
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime

def demo_setup():
    print("🎬 TMDB 数据包快速设置演示")
    print("=" * 50)
    
    print("📋 请按以下步骤操作：")
    print()
    print("1️⃣ 获取 TMDB API 密钥")
    print("   访问：https://www.themoviedb.org/settings/api")
    print("   注册并申请 API 密钥")
    print()
    
    print("2️⃣ 获取 GitHub Token")
    print("   访问：https://github.com/settings/tokens")
    print("   点击 'Generate new token (classic)'")
    print("   勾选 gist 权限")
    print()
    
    print("3️⃣ 创建 GitHub Gist")
    print("   访问：https://gist.github.com/")
    print("   文件名：TMDB_Trending.json")
    print("   内容：")
    print("   {")
    print('     "last_updated": "2025-01-20T10:30:00Z",')
    print('     "version": "1.0.0",')
    print('     "description": "TMDB Trending Data",')
    print('     "data": {')
    print('       "movies": [],')
    print('       "tv_shows": []')
    print("     }")
    print("   }")
    print()
    
    print("4️⃣ 运行设置脚本")
    print("   python3 simple_setup.py")
    print()
    
    print("5️⃣ 按提示输入信息")
    print("   - TMDB API 密钥")
    print("   - GitHub Token")
    print("   - Gist ID")
    print()
    
    print("6️⃣ 获取生成的 URL")
    print("   脚本会输出类似这样的 URL：")
    print("   https://gist.githubusercontent.com/username/gist-id/raw/TMDB_Trending.json")
    print()
    
    print("7️⃣ 在 Widget 中使用")
    print("   async function loadTmdbTrendingData() {")
    print("       const response = await Widget.http.get('你的URL');")
    print("       return response.data;")
    print("   }")
    print()
    
    print("🎉 完成！")
    print("总时间：不到5分钟")

if __name__ == '__main__':
    demo_setup()