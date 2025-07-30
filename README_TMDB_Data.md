# TMDB 数据包生成指南

本指南将帮助您创建类似 ForwardWidgets 的 TMDB_Trending.json 数据包文件。

## 📋 概述

这个项目包含：
- 示例数据文件：`data/TMDB_Trending.json`
- JavaScript 生成脚本：`scripts/generate_tmdb_data.js`
- Python 生成脚本：`scripts/generate_tmdb_data.py`
- 完整的数据结构和配置

## 🚀 快速开始

### 1. 获取 TMDB API 密钥

1. 访问 [TMDB 官网](https://www.themoviedb.org/)
2. 注册并登录账户
3. 进入 [API 设置页面](https://www.themoviedb.org/settings/api)
4. 申请 API 密钥（选择 "Developer" 选项）
5. 复制您的 API 密钥

### 2. 设置环境变量

#### Windows (CMD)
```cmd
set TMDB_API_KEY=your_api_key_here
```

#### Windows (PowerShell)
```powershell
$env:TMDB_API_KEY="your_api_key_here"
```

#### macOS/Linux
```bash
export TMDB_API_KEY="your_api_key_here"
```

### 3. 运行生成脚本

#### 使用 JavaScript (Node.js)
```bash
# 安装依赖
npm install

# 运行脚本
node scripts/generate_tmdb_data.js
```

#### 使用 Python
```bash
# 安装依赖
pip install requests

# 运行脚本
python scripts/generate_tmdb_data.py
```

## 📊 数据结构说明

### 主要字段

```json
{
  "last_updated": "2025-01-20T10:30:00Z",    // 最后更新时间
  "version": "1.0.0",                        // 数据版本
  "description": "TMDB Trending Movies and TV Shows Data",
  "data": {
    "movies": [...],                          // 电影列表
    "tv_shows": [...],                        // 电视剧列表
    "people": [...]                           // 演员列表
  },
  "metadata": {...},                          // 元数据信息
  "genres": {...},                            // 类型映射
  "config": {...}                             // TMDB 配置
}
```

### 电影数据结构

```json
{
  "id": 123456,                              // TMDB ID
  "title": "电影标题",                        // 中文标题
  "original_title": "Original Title",        // 原始标题
  "overview": "电影简介",                     // 简介
  "poster_path": "/poster.jpg",              // 海报路径
  "backdrop_path": "/backdrop.jpg",          // 背景图路径
  "release_date": "2025-01-15",             // 发布日期
  "vote_average": 8.5,                       // 平均评分
  "vote_count": 1250,                        // 评分数量
  "popularity": 95.6,                        // 热度
  "genre_ids": [28, 12, 16],                // 类型 ID 列表
  "adult": false,                            // 是否成人内容
  "video": false,                            // 是否视频
  "original_language": "en",                 // 原始语言
  "media_type": "movie"                      // 媒体类型
}
```

### 电视剧数据结构

```json
{
  "id": 654321,                              // TMDB ID
  "name": "剧集标题",                         // 中文标题
  "original_name": "Original Name",          // 原始标题
  "overview": "剧集简介",                     // 简介
  "poster_path": "/poster.jpg",              // 海报路径
  "backdrop_path": "/backdrop.jpg",          // 背景图路径
  "first_air_date": "2025-01-10",           // 首播日期
  "vote_average": 8.7,                       // 平均评分
  "vote_count": 1560,                        // 评分数量
  "popularity": 92.4,                        // 热度
  "genre_ids": [18, 80, 9648],              // 类型 ID 列表
  "origin_country": ["US"],                  // 原产国
  "original_language": "en",                 // 原始语言
  "media_type": "tv"                         // 媒体类型
}
```

## 🔧 自定义配置

### 修改数据源

在脚本中修改以下参数：

```javascript
// JavaScript 版本
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const url = `${TMDB_BASE_URL}/trending/all/day`; // 可以改为 week, month
```

```python
# Python 版本
TMDB_BASE_URL = 'https://api.themoviedb.org/3'
url = f"{TMDB_BASE_URL}/trending/all/day"  # 可以改为 week, month
```

### 可用的 API 端点

- `/trending/all/day` - 今日趋势
- `/trending/all/week` - 本周趋势
- `/trending/movie/day` - 今日电影趋势
- `/trending/tv/day` - 今日电视剧趋势
- `/movie/popular` - 热门电影
- `/tv/popular` - 热门电视剧

### 修改语言设置

```javascript
// JavaScript 版本
const params = {
    'api_key': TMDB_API_KEY,
    'language': 'zh-CN'  // 可以改为 'en-US', 'ja-JP' 等
};
```

```python
# Python 版本
params = {
    'api_key': TMDB_API_KEY,
    'language': 'zh-CN'  # 可以改为 'en-US', 'ja-JP' 等
}
```

## 📱 在 Widget 中使用

### 基本用法

```javascript
async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://your-domain.com/data/TMDB_Trending.json");
    return response.data;
}
```

### 处理数据

```javascript
async function displayTrendingMovies() {
    const data = await loadTmdbTrendingData();
    
    // 显示电影
    data.data.movies.forEach(movie => {
        console.log(`${movie.title} - ${movie.vote_average}/10`);
    });
    
    // 显示电视剧
    data.data.tv_shows.forEach(show => {
        console.log(`${show.name} - ${show.vote_average}/10`);
    });
}
```

### 获取类型名称

```javascript
function getGenreName(genreId, data) {
    return data.genres[genreId] || 'Unknown';
}

// 使用示例
const movie = data.data.movies[0];
const genres = movie.genre_ids.map(id => getGenreName(id, data));
console.log(`类型: ${genres.join(', ')}`);
```

## 🔄 自动化更新

### 使用 GitHub Actions

创建 `.github/workflows/update-tmdb-data.yml`：

```yaml
name: Update TMDB Data

on:
  schedule:
    - cron: '0 */6 * * *'  # 每6小时更新一次
  workflow_dispatch:  # 手动触发

jobs:
  update-data:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Generate TMDB data
      env:
        TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
      run: node scripts/generate_tmdb_data.js
    
    - name: Commit and push changes
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add data/TMDB_Trending.json
        git commit -m "Update TMDB trending data" || exit 0
        git push
```

### 使用 Cron 任务

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每6小时更新一次）
0 */6 * * * cd /path/to/your/project && python scripts/generate_tmdb_data.py
```

## 🛠️ 故障排除

### 常见问题

1. **API 密钥错误**
   ```
   错误: 获取 TMDB 数据失败: 401 Unauthorized
   解决: 检查 API 密钥是否正确设置
   ```

2. **网络连接问题**
   ```
   错误: 获取 TMDB 数据失败: Network Error
   解决: 检查网络连接，可能需要代理
   ```

3. **权限问题**
   ```
   错误: EACCES: permission denied
   解决: 确保脚本有写入权限
   ```

### 调试模式

在脚本中添加调试信息：

```javascript
// JavaScript 版本
console.log('API 密钥:', TMDB_API_KEY ? '已设置' : '未设置');
console.log('请求 URL:', url);
console.log('响应状态:', response.status);
```

```python
# Python 版本
print(f"API 密钥: {'已设置' if TMDB_API_KEY else '未设置'}")
print(f"请求 URL: {url}")
print(f"响应状态: {response.status_code}")
```

## 📚 相关资源

- [TMDB API 文档](https://developers.themoviedb.org/3)
- [TMDB API 密钥申请](https://www.themoviedb.org/settings/api)
- [ForwardWidgets 项目](https://github.com/quantumultxx/ForwardWidgets)

## 📄 许可证

本项目采用 MIT 许可证。请确保遵守 TMDB API 的使用条款。