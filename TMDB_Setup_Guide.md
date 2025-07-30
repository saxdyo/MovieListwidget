# 🎯 TMDB 数据包设置指南

## ✅ 您的专属数据包已就绪！

### 📊 数据 URL：
```
https://gist.githubusercontent.com/saxdyo/1b652522aa446bb21f888c66a76bf6cb/raw/fd776ad18fcef7e87828d3c25a8751f34c9711a4/TMDB_Trending.json
```

## 🔄 替换原有数据包

### 原来的代码：
```javascript
async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://raw.githubusercontent.com/quantumultxx/ForwardWidgets/refs/heads/main/data/TMDB_Trending.json");
    return response.data;
}
```

### 替换为您的数据包：
```javascript
async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://gist.githubusercontent.com/saxdyo/1b652522aa446bb21f888c66a76bf6cb/raw/fd776ad18fcef7e87828d3c25a8751f34c9711a4/TMDB_Trending.json");
    return response.data;
}
```

## 🤖 自动更新设置

### 1. 设置 GitHub Secrets
在您的 GitHub 仓库中设置以下 Secrets：
- `TMDB_API_KEY`: `[您的 TMDB API Key]`
- `GITHUB_TOKEN`: `[您的 GitHub Token]`
- `GIST_ID`: `[您的 Gist ID]`

### 2. 自动更新频率
- ⏰ **每12小时自动更新一次**
- 🖱️ **支持手动触发更新**
- 📊 **数据实时同步**

## 📱 Widget 使用示例

```javascript
// 加载数据
async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://gist.githubusercontent.com/saxdyo/1b652522aa446bb21f888c66a76bf6cb/raw/fd776ad18fcef7e87828d3c25a8751f34c9711a4/TMDB_Trending.json");
    return response.data;
}

// 使用数据
async function createWidget() {
    const data = await loadTmdbTrendingData();
    
    // 显示电影数据
    const movies = data.data.movies;
    const tvShows = data.data.tv_shows;
    
    // 您的 Widget 逻辑...
}
```

## 🎯 优势

### ✅ 完全独立
- 不再依赖第三方仓库
- 数据完全由您控制
- 可以自定义数据格式

### ✅ 实时更新
- 自动获取最新趋势
- 无需手动维护
- 数据始终保持新鲜

### ✅ 稳定可靠
- GitHub Gist 高可用性
- 自动备份和版本控制
- 支持历史数据查看

## 🔧 手动更新

如果需要手动更新数据，运行：
```bash
python3 simple_upload.py
```

## 📊 数据格式

您的数据包包含：
- 🎬 **电影数据** (16部)
- 📺 **电视剧数据** (4部)
- 📅 **更新时间戳**
- 📈 **元数据信息**

现在您拥有了完全属于自己的 TMDB 数据包，不再需要依赖任何第三方！