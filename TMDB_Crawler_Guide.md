# 🎬 TMDB 标题海报热门爬取模块

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/your-username/your-repo/TMDB%20标题海报热门爬取)](https://github.com/your-username/your-repo/actions)
[![Python Version](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

自动爬取 TMDB (The Movie Database) 热门电影电视剧数据，包含标题背景图的高质量数据爬虫。

## ✨ 功能特性

- 🎯 **实时热门数据获取**: 自动获取今日/本周全球热门内容
- 🖼️ **标题背景图抓取**: 智能选择最佳质量的标题背景图
- 🔄 **自动定时更新**: GitHub Actions 每15分钟自动运行
- 📊 **结构化数据输出**: JSON 格式，易于集成和使用
- 🌏 **多语言支持**: 优先获取中文数据，回退英文
- ⚡ **高性能爬取**: 请求重试、并发处理、错误恢复
- 🛡️ **数据质量控制**: 自动过滤低质量数据

## 🚀 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置 TMDB API

1. 访问 [TMDB API](https://www.themoviedb.org/settings/api) 获取 API 密钥
2. 设置环境变量：

```bash
export TMDB_API_KEY="your_api_key_here"
```

### 3. 运行爬虫

```bash
# 手动运行
python scripts/get_tmdb_data.py

# 生成 Logo 和背景图
python scripts/generate_logo.py
```

## 📊 数据结构

生成的 `data/TMDB_Trending.json` 文件包含以下结构：

```json
{
  "last_updated": "2024-01-20 15:30:00",
  "today_global": [
    {
      "id": 123456,
      "title": "电影标题",
      "type": "movie",
      "genreTitle": "动作•冒险•科幻",
      "rating": 8.5,
      "release_date": "2024-01-15",
      "overview": "电影简介...",
      "poster_url": "https://image.tmdb.org/t/p/original/poster.jpg",
      "title_backdrop": "https://image.tmdb.org/t/p/original/backdrop.jpg"
    }
  ],
  "week_global_all": [...],
  "popular_movies": [...]
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | number | TMDB 媒体 ID |
| `title` | string | 媒体标题 |
| `type` | string | 媒体类型 (movie/tv) |
| `genreTitle` | string | 类型标签，最多3个，用•分隔 |
| `rating` | number | 评分 (0-10) |
| `release_date` | string | 发布日期 |
| `overview` | string | 内容简介 |
| `poster_url` | string | 海报图片URL |
| `title_backdrop` | string | 标题背景图URL |

## 🤖 自动化运行

### GitHub Actions 配置

项目包含完整的 GitHub Actions 工作流，自动执行以下任务：

1. **定时触发**: 每15分钟自动运行
2. **数据获取**: 调用 TMDB API 获取最新数据  
3. **质量检查**: 验证数据完整性和质量
4. **自动提交**: 检测到变化时自动提交到仓库
5. **错误处理**: 失败时重试并生成详细报告

### 设置步骤

1. Fork 此仓库到你的 GitHub 账户
2. 在仓库设置中添加 Secret：
   - `TMDB_API_KEY`: 你的 TMDB API 密钥
3. 启用 GitHub Actions
4. 工作流将自动开始运行

## 🎨 Logo 和背景图

使用内置的 Logo 生成器创建项目品牌资源：

```bash
python scripts/generate_logo.py
```

生成的文件：
- 多尺寸 Logo 图标 (64px - 1024px)
- 横幅背景图 (1200x400)
- GitHub 社交预览图 (1280x640)
- 多种分辨率背景图

## 🔧 配置选项

### 环境变量

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `TMDB_API_KEY` | ✅ | - | TMDB API 密钥 |

### 脚本参数

爬虫脚本支持以下自定义：

```python
# 修改 scripts/get_tmdb_data.py 中的配置
REQUEST_TIMEOUT = 30        # 请求超时时间
MAX_RETRIES = 3            # 最大重试次数
RETRY_DELAY = 2            # 重试延迟
```

## 📈 数据使用示例

### Python 读取数据

```python
import json

# 读取数据
with open('data/TMDB_Trending.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 获取今日热门电影
today_movies = [item for item in data['today_global'] 
                if item['type'] == 'movie']

# 打印前5部电影
for movie in today_movies[:5]:
    print(f"{movie['title']} - 评分: {movie['rating']}")
```

### JavaScript/Node.js 使用

```javascript
const fs = require('fs');

// 读取数据
const data = JSON.parse(fs.readFileSync('data/TMDB_Trending.json', 'utf8'));

// 获取本周热门电视剧
const weeklyTVShows = data.week_global_all.filter(item => item.type === 'tv');

console.log(`本周共有 ${weeklyTVShows.length} 部热门电视剧`);
```

## 🛠️ 开发指南

### 项目结构

```
.
├── scripts/
│   ├── get_tmdb_data.py      # 主爬虫脚本
│   └── generate_logo.py      # Logo生成器
├── data/
│   └── TMDB_Trending.json    # 数据输出文件
├── icons/
│   └── generated/            # 生成的图标和背景
├── .github/
│   └── workflows/
│       └── tmdb-trending-crawler.yml  # GitHub Actions工作流
├── requirements.txt          # Python依赖
└── TMDB_Crawler_Guide.md    # 使用指南
```

### 扩展功能

添加新的数据类型：

```python
def fetch_top_rated_movies(self):
    """获取评分最高的电影"""
    endpoint = "/movie/top_rated"
    params = {"language": "zh-CN", "page": 1}
    return self._make_request(endpoint, params)
```

### 贡献代码

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/new-feature`)
3. 提交更改 (`git commit -am 'Add new feature'`)
4. 推送分支 (`git push origin feature/new-feature`)
5. 创建 Pull Request

## 📜 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [TMDB API 文档](https://developers.themoviedb.org/3)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Python Requests 库](https://docs.python-requests.org/)

## 🐛 问题反馈

如果遇到问题，请在 [Issues](https://github.com/your-username/your-repo/issues) 页面报告。

---

Made with ❤️ by [Your Name]