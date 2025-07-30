# 🌐 在线解决方案（最简单）

## 方案1：使用 GitHub Gist（推荐）

### 步骤1：创建 GitHub Gist
1. 访问 https://gist.github.com/
2. 点击 "Create a new gist"
3. 文件名输入：`TMDB_Trending.json`
4. 内容输入：
```json
{
  "last_updated": "2025-01-20T10:30:00Z",
  "version": "1.0.0",
  "description": "TMDB Trending Data",
  "data": {
    "movies": [],
    "tv_shows": []
  }
}
```
5. 点击 "Create secret gist"
6. 复制 Gist ID（URL 中的哈希值）

### 步骤2：设置环境变量
```bash
export GITHUB_TOKEN="your_github_token"
export GIST_ID="your_gist_id"
export TMDB_API_KEY="your_tmdb_api_key"
```

### 步骤3：运行脚本
```bash
python scripts/simple_gist_upload.py
```

### 步骤4：在 Widget 中使用
```javascript
async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://gist.githubusercontent.com/your-username/your-gist-id/raw/TMDB_Trending.json");
    return response.data;
}
```

## 方案2：使用 GitHub Actions（全自动）

### 步骤1：设置 Secrets
在 GitHub 仓库设置中添加：
- `GITHUB_TOKEN`：自动提供
- `GIST_ID`：你的 Gist ID
- `TMDB_API_KEY`：你的 TMDB API 密钥

### 步骤2：推送代码
```bash
git add .
git commit -m "Add TMDB update workflow"
git push
```

### 步骤3：自动更新
GitHub Actions 会每6小时自动更新数据

## 方案3：使用在线 JSON 服务

### 使用 JSONBin.io
1. 访问 https://jsonbin.io/
2. 创建账户并获取 API 密钥
3. 上传你的 JSON 数据
4. 获取直接访问 URL

### 使用 Pastebin
1. 访问 https://pastebin.com/
2. 粘贴你的 JSON 数据
3. 设置为公开
4. 获取原始数据 URL

## 方案4：使用 Vercel（一键部署）

### 步骤1：Fork 这个仓库

### 步骤2：在 Vercel 中导入
1. 访问 https://vercel.com/
2. 导入你的 GitHub 仓库
3. 设置环境变量
4. 部署

### 步骤3：获取数据 URL
```
https://your-project.vercel.app/api/tmdb-data
```

## 🚀 最快开始方式

### 1. 获取 API 密钥
- TMDB API: https://www.themoviedb.org/settings/api
- GitHub Token: https://github.com/settings/tokens

### 2. 创建 Gist
- 访问 https://gist.github.com/
- 创建新的 Gist
- 复制 Gist ID

### 3. 运行脚本
```bash
# 设置环境变量
export GITHUB_TOKEN="your_token"
export GIST_ID="your_gist_id"
export TMDB_API_KEY="your_tmdb_key"

# 运行脚本
python scripts/simple_gist_upload.py
```

### 4. 使用生成的 URL
脚本会输出类似这样的 URL：
```
https://gist.githubusercontent.com/username/gist-id/raw/TMDB_Trending.json
```

### 5. 在 Widget 中使用
```javascript
async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://gist.githubusercontent.com/username/gist-id/raw/TMDB_Trending.json");
    return response.data;
}
```

## 📱 完整 Widget 示例

```javascript
async function createTmdbWidget() {
    const data = await loadTmdbTrendingData();
    
    const widget = new ListWidget();
    widget.setPadding(10, 10, 10, 10);
    
    // 添加标题
    const title = widget.addText("🎬 TMDB 趋势");
    title.font = Font.boldSystemFont(16);
    widget.addSpacer(10);
    
    // 显示热门电影
    data.data.movies.slice(0, 3).forEach((movie, index) => {
        const movieText = widget.addText(`${index + 1}. ${movie.title} (${movie.vote_average}/10)`);
        movieText.font = Font.systemFont(12);
    });
    
    return widget;
}

// 使用
const widget = await createTmdbWidget();
Script.setWidget(widget);
Script.complete();
```

## ⚡ 一键解决方案

如果你想要最简单的方案，只需要：

1. **获取 API 密钥**（5分钟）
2. **创建 GitHub Gist**（2分钟）
3. **运行一次脚本**（1分钟）
4. **复制生成的 URL**（30秒）

总共不到10分钟就能完成！