# 🎬 TMDB 标题海报热门爬取模块

<div align="center">

![TMDB Crawler Banner](icons/generated/tmdb_banner_1200x400.png)

[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TMDB API](https://img.shields.io/badge/TMDB-API-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/documentation/api)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**自动爬取 TMDB 热门电影电视剧数据，包含高质量标题背景图的智能爬虫系统**

[🚀 快速开始](#-快速开始) • [📊 数据结构](#-数据结构) • [🎨 Logo资源](#-logo和背景图) • [📖 使用指南](#-使用指南)

</div>

## ✨ 功能亮点

### 🎯 核心功能
- **实时热门数据** - 今日/本周全球热门电影电视剧
- **智能图片选择** - 自动获取最佳质量的标题背景图
- **多语言支持** - 优先中文内容，智能回退英文
- **数据质量控制** - 自动过滤低质量和不完整数据

### 🤖 自动化特性
- **定时执行** - GitHub Actions 每15分钟自动运行
- **错误恢复** - 请求重试机制和错误处理
- **版本控制** - 数据变化时自动提交到仓库
- **状态监控** - 详细的执行日志和状态报告

### 🎨 品牌资源
- **多尺寸Logo** - 64px到1024px的完整Logo套装
- **背景图片** - 多种分辨率的项目背景图
- **社交预览** - GitHub和社交媒体优化的预览图

## 🚀 快速开始

### 1️⃣ 环境配置

```bash
# 克隆或下载项目文件
git clone <your-repo> # 或复制项目文件到本地

# 安装Python依赖
pip install -r requirements.txt
```

### 2️⃣ API配置

获取 TMDB API 密钥：
1. 访问 [TMDB API 设置页面](https://www.themoviedb.org/settings/api)
2. 注册账户并申请 API Key
3. 设置环境变量：

```bash
# Linux/macOS
export TMDB_API_KEY="your_tmdb_api_key_here"

# Windows
set TMDB_API_KEY=your_tmdb_api_key_here
```

### 3️⃣ 运行爬虫

```bash
# 手动执行数据爬取
python3 scripts/get_tmdb_data.py

# 生成Logo和背景图
python3 scripts/generate_logo.py

# 运行项目演示
python3 demo_project.py
```

## 📊 数据结构

生成的数据文件位于 `data/TMDB_Trending.json`，包含以下结构：

<details>
<summary>点击查看完整数据结构</summary>

```json
{
  "last_updated": "2025-01-20 15:30:00",
  "today_global": [
    {
      "id": 507089,
      "title": "五等分的新娘",
      "type": "movie", 
      "genreTitle": "动画•喜剧•爱情",
      "rating": 8.2,
      "release_date": "2022-05-20",
      "overview": "五胞胎姐妹的高中生活即将结束...",
      "poster_url": "https://image.tmdb.org/t/p/original/poster.jpg",
      "title_backdrop": "https://image.tmdb.org/t/p/original/backdrop.jpg"
    }
  ],
  "week_global_all": [...],
  "popular_movies": [...]
}
```
</details>

### 📋 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | Number | TMDB媒体ID | `507089` |
| `title` | String | 媒体标题 | `"五等分的新娘"` |
| `type` | String | 媒体类型 | `"movie"` / `"tv"` |
| `genreTitle` | String | 类型标签(最多3个) | `"动画•喜剧•爱情"` |
| `rating` | Number | 评分(0-10) | `8.2` |
| `release_date` | String | 发布日期 | `"2022-05-20"` |
| `overview` | String | 内容简介 | `"电影简介..."` |
| `poster_url` | String | 海报图片URL | `"https://image.tmdb.org/..."` |
| `title_backdrop` | String | 标题背景图URL | `"https://image.tmdb.org/..."` |

## 🤖 GitHub Actions 自动化

### 工作流配置

项目包含完整的 GitHub Actions 配置 (`.github/workflows/tmdb-trending-crawler.yml`)：

- ⏰ **定时触发**: 每15分钟自动执行
- 🔧 **环境配置**: Python 3.11, 依赖缓存
- 🎬 **数据获取**: 调用TMDB API获取最新数据
- 📊 **变化检测**: 智能检测数据文件变化
- 📤 **自动提交**: 变化时自动提交到仓库
- 📝 **状态报告**: 生成详细的执行总结

### 设置步骤

1. **Fork仓库** 到你的GitHub账户
2. **添加Secret**: 在仓库设置中添加 `TMDB_API_KEY`
3. **启用Actions**: 在Actions页面启用工作流
4. **自动运行**: 工作流将立即开始执行

## 🎨 Logo和背景图

### 生成资源

运行Logo生成器创建完整的品牌资源套装：

```bash
python3 scripts/generate_logo.py
```

### 生成文件

<div align="center">

| 类型 | 文件名 | 尺寸 | 用途 |
|------|--------|------|------|
| 🏷️ Logo | `tmdb_logo_64x64.png` | 64x64 | 小图标 |
| 🏷️ Logo | `tmdb_logo_512x512.png` | 512x512 | 标准Logo |
| 🏷️ Logo | `tmdb_logo_1024x1024.png` | 1024x1024 | 高清Logo |
| 🖼️ 横幅 | `tmdb_banner_1200x400.png` | 1200x400 | 项目横幅 |
| 🌐 预览 | `github_social_preview.png` | 1280x640 | 社交预览 |
| 🌅 背景 | `tmdb_background_1920x1080.png` | 1920x1080 | Full HD背景 |

</div>

### 设计特色

- 🎨 **TMDB品牌色彩** - 蓝色渐变主题
- 🎬 **电影元素** - 胶片图案设计  
- 🌟 **现代风格** - 简洁专业的视觉效果
- 📱 **多平台适配** - 支持各种使用场景

## 📈 数据使用示例

### Python 集成

```python
import json
import requests
from datetime import datetime

# 读取本地数据
with open('data/TMDB_Trending.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 获取今日热门电影
today_movies = [item for item in data['today_global'] 
                if item['type'] == 'movie']

# 显示电影信息
for movie in today_movies[:5]:
    print(f"🎬 {movie['title']}")
    print(f"   评分: {movie['rating']} ⭐")
    print(f"   类型: {movie['genreTitle']}")
    print(f"   发布: {movie['release_date']}")
    print()
```

### JavaScript 使用

```javascript
// Node.js环境
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/TMDB_Trending.json', 'utf8'));

// 筛选高分电影
const highRatedMovies = data.today_global
  .filter(item => item.type === 'movie' && item.rating >= 8.0)
  .sort((a, b) => b.rating - a.rating);

console.log(`发现 ${highRatedMovies.length} 部高分电影`);

// Web前端
fetch('./data/TMDB_Trending.json')
  .then(response => response.json())
  .then(data => {
    const movieList = data.popular_movies.slice(0, 10);
    // 渲染电影列表...
  });
```

### 数据API化

```python
from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route('/api/trending/today')
def get_today_trending():
    with open('data/TMDB_Trending.json', 'r') as f:
        data = json.load(f)
    return jsonify(data['today_global'])

@app.route('/api/movies/popular')  
def get_popular_movies():
    with open('data/TMDB_Trending.json', 'r') as f:
        data = json.load(f)
    return jsonify(data['popular_movies'])

if __name__ == '__main__':
    app.run(debug=True)
```

## 🛠️ 配置和自定义

### 环境变量

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `TMDB_API_KEY` | ✅ | - | TMDB API访问密钥 |

### 脚本配置

在 `scripts/get_tmdb_data.py` 中可自定义：

```python
# 请求配置
REQUEST_TIMEOUT = 30        # 请求超时时间(秒)
MAX_RETRIES = 3            # 最大重试次数  
RETRY_DELAY = 2            # 重试延迟(秒)

# 数据配置
IMAGE_SIZE = "original"     # 图片尺寸
MAX_GENRES = 3             # 最大类型数量
```

### 扩展功能

添加新的数据类型：

```python
def fetch_top_rated_tv_shows(self):
    """获取评分最高的电视剧"""
    endpoint = "/tv/top_rated"
    params = {
        "language": "zh-CN",
        "page": 1
    }
    return self._make_request(endpoint, params)
```

## 📖 使用指南

### 🎯 基础使用

1. **本地开发**: 直接运行脚本获取数据
2. **数据集成**: 将JSON数据集成到你的应用
3. **定制品牌**: 使用生成的Logo和背景图

### 🔄 自动化部署

1. **GitHub Actions**: 设置自动化数据更新
2. **Webhook集成**: 数据更新时触发外部系统
3. **API服务**: 将数据包装为Web API

### 🎨 品牌定制

1. **Logo使用**: 各尺寸Logo适用不同场景
2. **颜色主题**: 基于TMDB品牌色的设计
3. **自定义生成**: 修改Logo生成脚本创建个性化资源

## 🤝 贡献指南

### 开发环境

```bash
# 1. Fork项目
git fork <repository-url>

# 2. 创建功能分支  
git checkout -b feature/new-feature

# 3. 开发和测试
python3 scripts/get_tmdb_data.py
python3 demo_project.py

# 4. 提交更改
git commit -am 'Add new feature'
git push origin feature/new-feature

# 5. 创建Pull Request
```

### 代码规范

- 使用 Python 3.11+ 语法
- 遵循 PEP 8 代码风格  
- 添加适当的类型注解
- 编写清晰的文档字符串

## 📜 开源协议

本项目采用 [MIT 协议](LICENSE) 开源。

## 🔗 相关资源

- 📚 [TMDB API 文档](https://developers.themoviedb.org/3)
- 🐙 [GitHub Actions 文档](https://docs.github.com/en/actions)  
- 🐍 [Python Requests 库](https://docs.python-requests.org/)
- 🎨 [PIL/Pillow 图像处理](https://pillow.readthedocs.io/)

## 💬 支持和反馈

- 🐛 [报告问题](https://github.com/your-username/your-repo/issues)
- 💡 [功能建议](https://github.com/your-username/your-repo/discussions)
- 📧 联系方式: your-email@example.com

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个Star支持一下！**

Made with ❤️ by [Your Name] | Powered by TMDB API

</div>