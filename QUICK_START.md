# ⚡ 5分钟快速开始

## 🎯 最简单的方案（推荐）

### 步骤1：获取 API 密钥（2分钟）

1. **TMDB API 密钥**
   - 访问：https://www.themoviedb.org/settings/api
   - 注册并申请 API 密钥
   - 复制你的 API 密钥

2. **GitHub Token**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 勾选 `gist` 权限
   - 复制生成的 token

### 步骤2：创建 GitHub Gist（1分钟）

1. 访问：https://gist.github.com/
2. 点击 "Create a new gist"
3. 文件名：`TMDB_Trending.json`
4. 内容：
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

### 步骤3：运行设置脚本（1分钟）

```bash
# 安装依赖
pip install requests

# 运行设置脚本
python setup.py
```

按提示输入你的：
- TMDB API 密钥
- GitHub Token
- Gist ID

### 步骤4：使用生成的 URL（30秒）

脚本会输出类似这样的 URL：
```
https://gist.githubusercontent.com/username/gist-id/raw/TMDB_Trending.json
```

### 步骤5：在 Widget 中使用

```javascript
async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://gist.githubusercontent.com/username/gist-id/raw/TMDB_Trending.json");
    return response.data;
}
```

## 🚀 一键更新

设置完成后，要更新数据只需运行：

```bash
python scripts/simple_gist_upload.py
```

## 📱 完整 Widget 示例

```javascript
async function createTmdbWidget() {
    const data = await loadTmdbTrendingData();
    
    const widget = new ListWidget();
    widget.setPadding(10, 10, 10, 10);
    
    // 标题
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

## 🔄 自动更新（可选）

如果你想要自动更新，可以设置 GitHub Actions：

1. 在 GitHub 仓库设置中添加 Secrets：
   - `GITHUB_TOKEN`（自动提供）
   - `GIST_ID`（你的 Gist ID）
   - `TMDB_API_KEY`（你的 TMDB API 密钥）

2. 推送代码到 GitHub

3. GitHub Actions 会每6小时自动更新数据

## ❓ 常见问题

**Q: 需要服务器吗？**
A: 不需要！使用 GitHub Gist 完全免费，无需服务器。

**Q: 数据多久更新一次？**
A: 可以手动更新，也可以设置自动更新（每6小时）。

**Q: 需要编程知识吗？**
A: 不需要！只需要运行脚本，按提示输入信息即可。

**Q: 免费吗？**
A: 完全免费！GitHub Gist 和 TMDB API 都是免费的。

## 🎉 完成！

现在你有了一个完全可用的 TMDB 数据包，可以在任何 Widget 中使用！

总时间：不到5分钟 🚀