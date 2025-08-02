# 剧集Logo背景图功能指南

## 🎯 功能概述

剧集Logo背景图功能是TMDB增强数据爬取模块的核心特性之一，专门为电视剧集提供高质量的官方logo图片，支持透明背景和多种格式。

## ✨ 主要特性

### 🎨 Logo获取功能
- **自动获取**: 自动从TMDB API获取剧集官方logo
- **智能选择**: 基于语言、质量、格式智能选择最佳logo
- **透明支持**: 优先选择透明背景的PNG格式logo
- **多尺寸**: 支持多种尺寸的logo URL生成

### 📊 质量选择算法
1. **语言优先级**: 中文 > 英文 > 无语言标签 > 其他语言
2. **透明度优先级**: 透明背景 > 非透明背景
3. **评分优先级**: 评分高的logo优先
4. **分辨率优先级**: 高分辨率logo优先

### 🔧 技术实现
- **API集成**: 调用TMDB `/tv/{id}/images` 接口
- **图片处理**: 智能解析logo元数据
- **URL生成**: 自动生成完整logo URL
- **状态跟踪**: 实时监控logo获取状态

## 📁 文件结构

```
├── scripts/
│   ├── get_tmdb_data_enhanced.py    # 🚀 主增强脚本（包含剧集logo功能）
│   ├── test_tv_logo.py              # 🧪 完整版剧集logo测试
│   └── test_tv_logo_simple.py       # 📋 简化版剧集logo测试
├── data/
│   └── TMDB_Trending.json           # 📊 包含logo_url字段的数据文件
└── TV_Logo_Background_Guide.md      # 📖 本指南文档
```

## 🚀 快速开始

### 1. 环境准备
```bash
# 设置API密钥
export TMDB_API_KEY="your_tmdb_api_key_here"

# 安装依赖（如果需要）
pip install requests
```

### 2. 运行增强脚本
```bash
# 运行主增强脚本
python3 scripts/get_tmdb_data_enhanced.py
```

### 3. 测试功能
```bash
# 运行简化版测试
python3 scripts/test_tv_logo_simple.py

# 运行完整版测试（需要API密钥）
python3 scripts/test_tv_logo.py
```

## 📊 数据格式

### 新格式（包含Logo）
```json
{
  "id": 654321,
  "title": "示例剧集",
  "type": "tv",
  "genreTitle": "剧情•悬疑•犯罪",
  "rating": 8.7,
  "release_date": "2025-01-10",
  "overview": "剧集简介...",
  "poster_url": "https://image.tmdb.org/t/p/original/poster.jpg",
  "title_backdrop": "https://image.tmdb.org/t/p/original/backdrop.jpg",
  "logo_url": "https://image.tmdb.org/t/p/original/logo.png",
  "original_poster": "https://image.tmdb.org/t/p/original/original_poster.jpg",
  "has_logo": true
}
```

### 元数据统计
```json
{
  "metadata": {
    "version": "2.1",
    "features": ["logo_background", "enhanced_posters", "title_backdrops", "tv_logo_optimization"],
    "logo_coverage": {
      "total": "15/20",
      "movies": "8/10",
      "tv_shows": "7/10"
    }
  }
}
```

## 🎨 Logo质量选择策略

### 优先级排序
1. **语言匹配**: 优先选择中文logo
2. **透明度**: 优先选择透明背景logo
3. **用户评分**: 选择评分高的logo
4. **分辨率**: 选择高分辨率logo

### 支持的格式
- **PNG**: 透明背景，最佳质量
- **JPG**: 标准格式
- **SVG**: 矢量格式（较少见）

### 尺寸选项
- `w92`: 92px宽度
- `w154`: 154px宽度
- `w185`: 185px宽度
- `w300`: 300px宽度
- `w500`: 500px宽度
- `original`: 原始尺寸

## 💡 使用示例

### JavaScript前端
```javascript
// 获取剧集数据
fetch('/data/TMDB_Trending.json')
  .then(response => response.json())
  .then(data => {
    // 筛选剧集
    const tvShows = data.today_global.filter(item => item.type === 'tv');
    
    tvShows.forEach(show => {
      console.log(`剧集: ${show.title}`);
      console.log(`Logo: ${show.logo_url}`);
      console.log(`背景图: ${show.title_backdrop}`);
      
      // 在页面上显示logo
      if (show.logo_url) {
        const logoImg = document.createElement('img');
        logoImg.src = show.logo_url;
        logoImg.alt = `${show.title} Logo`;
        document.body.appendChild(logoImg);
      }
    });
  });
```

### Python后端
```python
import json

# 读取数据
with open('data/TMDB_Trending.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 获取剧集数据
tv_shows = [item for item in data['today_global'] if item.get('type') == 'tv']

for show in tv_shows:
    print(f"剧集: {show.get('title')}")
    print(f"Logo: {show.get('logo_url', '无')}")
    print(f"背景图: {show.get('title_backdrop', '无')}")
    
    # 检查logo状态
    if show.get('has_logo'):
        print("✅ 有Logo")
    else:
        print("❌ 无Logo")
```

### CSS样式示例
```css
/* Logo容器样式 */
.tv-logo {
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
    padding: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
}

.tv-logo img {
    max-width: 100%;
    max-height: 80px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

/* 无Logo时的占位符 */
.tv-logo.no-logo {
    background: linear-gradient(45deg, #333, #444);
    color: #fff;
    font-size: 14px;
    text-align: center;
}
```

## 📈 性能优化

### API调用优化
- **批量处理**: 减少API调用次数
- **缓存机制**: 避免重复请求
- **延迟控制**: 0.1秒间隔避免频率限制
- **错误重试**: 自动重试失败的请求

### 内存优化
- **流式处理**: 逐个处理剧集数据
- **及时释放**: 释放不需要的数据
- **压缩输出**: 优化JSON文件大小

## 🧪 测试功能

### 测试覆盖
- ✅ Logo URL生成测试
- ✅ 质量选择算法测试
- ✅ 数据格式验证
- ✅ 覆盖率统计
- ✅ 错误处理测试

### 测试命令
```bash
# 基础测试
python3 scripts/test_tv_logo_simple.py

# 完整测试（需要API密钥）
python3 scripts/test_tv_logo.py

# 集成测试
python3 scripts/test_enhanced_tmdb.py
```

## 🔧 配置选项

### 环境变量
- `TMDB_API_KEY`: TMDB API密钥（必需）
- `TMDB_LANGUAGE`: 语言设置（默认: zh-CN）
- `DEBUG`: 调试模式（可选）

### 脚本参数
- `media_type`: 媒体类型（tv/movie/all）
- `max_items`: 最大项目数
- `logo_priority`: Logo优先级设置

## 📊 监控和统计

### 覆盖率统计
- 总剧集数
- 有Logo的剧集数
- Logo覆盖率百分比
- 按语言分类统计

### 质量指标
- Logo分辨率分布
- 格式类型统计
- 评分分布
- 透明度支持率

## 🛠️ 故障排除

### 常见问题
1. **Logo获取失败**: 检查API密钥和网络连接
2. **覆盖率低**: 某些剧集可能没有官方logo
3. **质量不佳**: 调整质量选择算法参数
4. **URL无效**: 检查TMDB图片服务状态

### 调试方法
```bash
# 启用调试模式
export DEBUG=1
python3 scripts/get_tmdb_data_enhanced.py

# 查看详细日志
python3 scripts/test_tv_logo.py
```

## 🎉 更新日志

### v2.1 (当前版本)
- ✅ 添加剧集logo优化功能
- ✅ 支持透明背景logo优先选择
- ✅ 改进logo质量选择算法
- ✅ 添加剧集logo覆盖率统计
- ✅ 创建专门的剧集logo测试脚本

### v2.0
- ✅ 基础logo背景图功能
- ✅ 支持电影和剧集logo获取
- ✅ 基本质量选择算法

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进剧集logo功能！

### 开发建议
- 优化logo质量选择算法
- 添加更多logo格式支持
- 改进错误处理机制
- 增加logo缓存功能

---

**注意**: 请确保遵守TMDB API的使用条款和限制。