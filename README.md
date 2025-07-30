# 图标库 - 自助上传系统

<p align="center">
  <img src="https://img.picgo.net/2025/07/13/PicStoreJson5de53c3c9bd498d4.jpg" alt="" width="400px"/>
  <br>
  <span>🎨 基于 PicGo API 和 GitHub Gist 的图标库管理系统</span>
</p>

## 项目用途

本项目是一个基于 Python Flask 的 Web 应用，允许用户通过移动端友好的网页上传图片到 PicGo API，并将图片的名称和 URL 存储到 GitHub Gist 的 JSON 文件中。项目具有以下功能：

- **图片上传**：用户输入名称并上传图片到 PicGo API
- **名称唯一性检查**：防止重复名称，重复时增加后缀数字自增1
- **Gist 更新**：将图片名称和 URL 以追加方式存储到 Gist 的 JSON 文件中
- **移动端适配**：前端页面针对手机优化，易于触摸操作
- **部署友好**：适配 Vercel 平台，支持一键部署
- **图标管理**：支持搜索、复制链接、删除图标等功能

## 技术栈

- **后端**：Python, Flask
- **前端**：HTML, CSS, JavaScript
- **依赖**：requests（用于 API 调用）
- **部署**：Vercel

## 数据格式

图标数据存储在 GitHub Gist 的 `icons.json` 文件中，格式如下：

```json
{
  "name": "Icon Library",
  "description": "图标库 - 自助上传系统",
  "icons": [
    {
      "name": "example_icon",
      "url": "https://img.picgo.net/2025/07/12/example.png",
      "upload_time": "2025-01-20T10:30:00"
    }
  ]
}
```

## 部署到 Vercel

### 准备工作

1. **创建 GitHub Gist**：
   - 登录 GitHub，访问 [gist.github.com](https://gist.github.com/)
   - 创建一个新 Gist，文件名设为 `icons.json`，初始内容如下：
     ```json
     {
       "name": "Icon Library",
       "description": "图标库 - 自助上传系统",
       "icons": []
     }
     ```
   - 复制 Gist ID（URL 中的哈希值，例如 `https://gist.github.com/username/1234567890abcdef` 中的 `1234567890abcdef`）

2. **生成 GitHub Personal Access Token**：
   - 访问 GitHub 设置 > Developer settings > Personal access tokens > Tokens (classic)
   - 创建新 Token，勾选 `gist` 权限，复制 Token

3. **获取 PicGo API 密钥**：
   - 确保你有 PicGo API 的密钥（`X-API-Key`），通常由 [PicGo](https://www.picgo.net) 服务提供

### 手动部署到 Vercel

1. **创建 GitHub 仓库**：
   - 将项目文件推送到 GitHub 仓库
   - 确保 `requirements.txt` 和 `vercel.json` 已正确配置

2. **登录 Vercel**：
   - 访问 [vercel.com](https://vercel.com/) 并登录

3. **导入仓库**：
   - 点击 "Add New" > "Project"
   - 选择你的 GitHub 仓库并导入

4. **配置环境变量**：
   - 在 Vercel 项目设置的 "Environment Variables" 页面，添加以下变量：
     - `PICGO_API_KEY`：你的 PicGo API 密钥
     - `GIST_ID`：你的 Gist ID
     - `GITHUB_USER`：你的 GITHUB USER
     - `GITHUB_TOKEN`：你的 GitHub Personal Access Token
   - 确保变量名称与 `api/index.py` 中的一致

5. **部署**：
   - 点击 "Deploy"，Vercel 将自动检测 `vercel.json` 并构建项目
   - 部署完成后，访问提供的 URL（例如 `https://your-project.vercel.app`）

### 一键部署到 Vercel

你可以通过以下按钮一键部署项目到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/icon-library&env=PICGO_API_KEY,GIST_ID,GITHUB_USER,GITHUB_TOKEN&env-description=PicGo%20API%20Key,%20GitHub%20Gist%20ID,%20and%20GitHub%20Personal%20Access%20Token)

**步骤**：
1. 点击上方按钮，登录 Vercel
2. 选择你的 GitHub 仓库（需先将项目推送到 GitHub）
3. 在部署配置页面，输入以下环境变量：
   - `PICGO_API_KEY`：你的 PicGo API 密钥
   - `GIST_ID`：你的 Gist ID
   - `GITHUB_USER`：你的 GITHUB USER
   - `GITHUB_TOKEN`：你的 GitHub Personal Access Token
4. 点击 "Deploy"，等待部署完成

## 使用方法

### 1. 访问网站
- 打开部署后的 URL（例如 `https://your-project.vercel.app`）
- 页面显示一个简单的表单，包含名称输入框、图片选择器和上传按钮

### 2. 上传图片
- 在 "名称" 输入框中输入一个唯一的名称（例如 `my_icon`）
- 点击 "选择文件" 选择一张图片（支持 PNG、JPG、GIF、SVG、WebP 格式）
- 点击 "上传" 按钮

### 3. 查看结果
- 上传成功后，页面将显示成功消息，包含名称和图片 URL
- 如果名称已存在或上传失败，页面将显示错误消息
- 成功上传后，检查 GitHub Gist 的 `icons.json`，确认新条目已追加到 `icons` 数组

### 4. 管理图标
- **搜索图标**：使用搜索框快速查找图标
- **复制链接**：点击图标卡片上的 "复制链接" 按钮
- **删除图标**：点击图标卡片上的 "删除" 按钮
- **刷新列表**：点击 "🔄 刷新" 按钮更新图标列表

### 5. 移动端使用
- 页面已优化为移动端友好，支持触摸操作
- 在手机浏览器中打开 URL，操作与桌面端相同

## 项目文件说明

- **api/index.py**：Flask 后端，处理图片上传和 Gist 更新
- **templates/index.html**：前端页面，包含上传表单和图标展示
- **static/css/style.css**：CSS 样式，适配移动端
- **static/js/script.js**：JavaScript 脚本，处理前端交互逻辑
- **requirements.txt**：列出 Flask 和 requests 依赖
- **vercel.json**：Vercel 配置文件，定义构建和路由规则

## API 接口

### 上传图标
```
POST /api/upload
Content-Type: multipart/form-data

参数：
- name: 图标名称
- image: 图片文件
```

### 获取图标列表
```
GET /api/icons
```

### 删除图标
```
DELETE /api/delete/<icon_name>
```

## 注意事项

### 安全性
- 不要在代码中硬编码 `PICGO_API_KEY` 或 `GITHUB_TOKEN`，始终使用 Vercel 环境变量
- 确保 GitHub Token 仅具有 `gist` 权限以降低风险

### 错误处理
- 名称重复、API 失败或服务器错误会返回清晰的错误消息
- 检查 Vercel 日志以调试部署问题

### Vercel 配置
- 如果遇到 Python 版本问题，可在 Vercel 项目设置中指定 Python 版本
- 确保 `requirements.txt` 包含所有依赖

### 扩展功能
- 可添加图片预览功能（修改 `script.js` 和 `index.html`）
- 可扩展为多用户系统，增加用户认证
- 可添加图标分类和标签功能

## 故障排查

### 部署失败
- 检查 Vercel 日志，确保环境变量正确设置
- 确保 `requirements.txt` 无误
- 验证 `vercel.json` 配置正确

### 上传失败
- 确认 `PICGO_API_KEY` 有效
- 检查 Gist 是否存在且 `GITHUB_TOKEN` 有 `gist` 权限
- 验证图片格式是否支持

### 页面不显示
- 验证 `vercel.json` 中的路由配置
- 确保静态文件正确加载
- 检查浏览器控制台是否有错误

## 免费AI抠图软件推荐

可以先用 ChatGPT 对图片进行"剪影反白"，并"背景透明"，或者用下面的软件一键抠图：

<p align="center">
  <img src="https://img.picgo.net/2025/07/13/9918cb3bf6b53967de011ed8b2b7fab708897cb381bff4fa.jpg" alt="" width="400px"/>
  <br>
  <a href="https://apps.apple.com/cn/app/%E6%A4%B0%E5%AD%90%E8%AE%BE%E8%AE%A1-%E6%9E%81%E7%AE%80%E4%B8%93%E4%B8%9A%E8%83%8C%E6%99%AF%E7%A7%BB%E9%99%A4/id6736813907">椰子设计 - 极简专业背景移除</a>
  <br>
  <span>一键抠图，谁用谁知道</span>
</p>

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0 (2025-01-20)
- 初始版本发布
- 支持图片上传到 PicGo API
- 支持 GitHub Gist 存储
- 移动端适配
- 图标搜索和管理功能
