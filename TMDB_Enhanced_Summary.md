# TMDB增强数据爬取模块总结

## 🎯 项目概述

这是一个增强版的TMDB数据爬取模块，专门用于获取电影和电视剧的热门数据，包含Logo背景图、标题背景图等增强功能。

## ✨ 主要功能

### 核心功能
- 🎬 **今日热门数据**: 获取电影、电视剧、人物的今日热门
- 📺 **本周热门数据**: 获取本周热门内容
- 🎭 **热门电影**: 获取热门电影数据
- 🌍 **多语言支持**: 中文优先，支持英文和其他语言

### 增强功能
- 🎨 **Logo背景图**: 自动获取最佳质量的官方logo
- 🖼️ **标题背景图**: 获取高质量的标题背景图片
- 📸 **增强海报**: 智能选择最佳质量的海报图片
- 📊 **元数据统计**: 提供详细的数据统计信息
- 🔄 **自动更新**: 支持GitHub Actions自动定时更新

## 📁 文件结构

```
├── scripts/
│   ├── get_tmdb_data_enhanced.py    # 🚀 主爬取脚本
│   ├── test_enhanced_tmdb.py        # 🧪 测试脚本
│   ├── demo_enhanced_tmdb.py        # 🎬 演示脚本
│   └── quick_start.py               # ⚡ 快速启动脚本
├── .github/workflows/
│   └── tmdb-enhanced.yml            # 🔄 GitHub Actions工作流
├── data/
│   └── TMDB_Trending.json           # 📊 生成的数据文件
├── requirements.txt                  # 📦 Python依赖
├── TMDB_Enhanced_Setup_Guide.md     # 📖 详细使用指南
└── TMDB_Enhanced_Summary.md         # 📋 本总结文档
```

## 🚀 快速开始

### 1. 环境要求
- Python 3.8+
- TMDB API密钥

### 2. 一键启动
```bash
python3 scripts/quick_start.py
```

### 3. 手动运行
```bash
# 安装依赖
pip install -r requirements.txt

# 设置API密钥
export TMDB_API_KEY="your_api_key_here"

# 运行增强脚本
python3 scripts/get_tmdb_data_enhanced.py

# 运行测试
python3 scripts/test_enhanced_tmdb.py

# 查看演示
python3 scripts/demo_enhanced_tmdb.py
```

## 📊 数据格式

### 新格式（增强版）
```json
{
  "id": 12345,
  "title": "电影标题",
  "type": "movie",
  "genreTitle": "动作•冒险•科幻",
  "rating": 8.5,
  "release_date": "2024-01-01",
  "overview": "电影简介...",
  "poster_url": "https://image.tmdb.org/t/p/original/poster.jpg",
  "title_backdrop": "https://image.tmdb.org/t/p/original/backdrop.jpg",
  "logo_url": "https://image.tmdb.org/t/p/original/logo.png",
  "original_poster": "https://image.tmdb.org/t/p/original/original_poster.jpg"
}
```

### 元数据
```json
{
  "metadata": {
    "version": "2.0",
    "features": ["logo_background", "enhanced_posters", "title_backdrops"],
    "total_items": 45,
    "logos_count": 38,
    "backdrops_count": 42,
    "api_key_configured": true
  }
}
```

## 🎨 图片质量选择策略

### 优先级排序
1. **语言优先级**: 中文 > 英文 > 无语言标签 > 其他语言
2. **评分优先级**: 评分高的图片优先
3. **分辨率优先级**: 分辨率高的图片优先

### 支持的图片类型
- **海报 (posters)**: 电影/电视剧海报
- **背景图 (backdrops)**: 标题背景图片
- **Logo (logos)**: 官方logo图片

## 🔧 配置选项

### 环境变量
- `TMDB_API_KEY`: TMDB API密钥（必需）
- `TMDB_LANGUAGE`: 语言设置（默认: zh-CN）
- `TMDB_REGION`: 地区设置（默认: CN）

### GitHub Actions配置
- 自动运行频率: 每30分钟
- 支持手动触发
- 自动提交和推送更新

## 🧪 测试功能

### 测试覆盖
- ✅ 数据结构验证
- ✅ 项目格式检查
- ✅ 图片URL验证
- ✅ 时间戳格式检查
- ✅ 数据质量评估

### 兼容性
- ✅ 支持新旧数据格式
- ✅ 自动格式检测
- ✅ 向后兼容

## 📈 性能优化

### API调用优化
- 智能缓存机制
- 请求延迟控制（0.1秒间隔）
- 批量处理减少API调用

### 错误处理
- 完善的异常处理
- 自动重试机制
- 详细的错误日志

## 🔄 自动化

### GitHub Actions工作流
- 定时运行（每30分钟）
- 自动依赖安装
- 数据文件更新检测
- 自动提交和推送
- 运行状态统计

### 监控功能
- 文件大小监控
- API调用成功率
- 数据完整性检查
- 错误通知

## 💡 使用示例

### JavaScript前端
```javascript
fetch('/data/TMDB_Trending.json')
  .then(response => response.json())
  .then(data => {
    const todayItems = data.today_global;
    todayItems.forEach(item => {
      console.log(`标题: ${item.title}`);
      console.log(`海报: ${item.poster_url}`);
      console.log(`背景图: ${item.title_backdrop}`);
      console.log(`Logo: ${item.logo_url}`);
    });
  });
```

### Python后端
```python
import json

with open('data/TMDB_Trending.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

today_items = data['today_global']
for item in today_items:
    print(f"标题: {item.get('title')}")
    print(f"海报: {item.get('poster_url')}")
    print(f"背景图: {item.get('title_backdrop')}")
    print(f"Logo: {item.get('logo_url')}")
```

## 🛠️ 故障排除

### 常见问题
1. **API密钥无效**: 检查TMDB_API_KEY是否正确设置
2. **网络超时**: 脚本会自动重试，增加超时时间
3. **API限制**: 添加延迟避免触发频率限制
4. **数据格式不兼容**: 运行增强脚本升级数据格式

### 调试模式
```bash
export DEBUG=1
python3 scripts/get_tmdb_data_enhanced.py
```

## 📚 文档

- **详细指南**: `TMDB_Enhanced_Setup_Guide.md`
- **API文档**: TMDB官方API文档
- **示例代码**: 包含在演示脚本中

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个模块！

### 开发环境
```bash
git clone <repository-url>
cd <repository-name>
pip install -r requirements.txt
python3 scripts/test_enhanced_tmdb.py
```

## 📄 许可证

本项目采用MIT许可证。

## 🎉 更新日志

### v2.0 (当前版本)
- ✅ 添加Logo背景图功能
- ✅ 增强海报质量选择
- ✅ 添加元数据统计
- ✅ 改进错误处理
- ✅ 优化GitHub Actions工作流
- ✅ 添加测试和演示脚本
- ✅ 创建快速启动脚本

### v1.0 (原始版本)
- ✅ 基础TMDB数据爬取
- ✅ 热门电影和电视剧获取
- ✅ 基本图片URL生成

---

**注意**: 请确保遵守TMDB API的使用条款和限制。