# TMDB增强数据爬取模块使用指南

## 概述

这是一个增强版的TMDB数据爬取模块，专门用于获取电影和电视剧的热门数据，包含以下增强功能：

- 🎬 **Logo背景图**: 自动获取最佳质量的logo图片
- 🖼️ **标题背景图**: 获取高质量的标题背景图片
- 📸 **增强海报**: 智能选择最佳质量的海报图片
- 📊 **元数据统计**: 提供详细的数据统计信息
- 🔄 **自动更新**: 支持GitHub Actions自动定时更新

## 功能特性

### 核心功能
- 获取今日热门数据（电影、电视剧、人物）
- 获取本周热门数据
- 获取热门电影数据
- 智能图片质量选择（中文优先 > 英文 > 无语言标签）
- 自动过滤无效数据

### 增强功能
- **Logo获取**: 自动获取每个项目的官方logo
- **背景图获取**: 获取高质量的标题背景图片
- **海报优化**: 从多个海报中选择最佳质量
- **元数据跟踪**: 记录版本、功能特性和统计信息
- **错误处理**: 完善的错误处理和重试机制

## 文件结构

```
├── scripts/
│   ├── get_tmdb_data_enhanced.py    # 主爬取脚本
│   └── test_enhanced_tmdb.py        # 测试脚本
├── .github/workflows/
│   └── tmdb-enhanced.yml            # GitHub Actions工作流
├── data/
│   └── TMDB_Trending.json           # 生成的数据文件
├── requirements.txt                  # Python依赖
└── TMDB_Enhanced_Setup_Guide.md     # 本说明文档
```

## 安装和配置

### 1. 环境要求
- Python 3.8+
- TMDB API密钥

### 2. 安装依赖
```bash
pip install -r requirements.txt
```

### 3. 配置API密钥
设置环境变量：
```bash
export TMDB_API_KEY="your_tmdb_api_key_here"
```

或在GitHub Secrets中设置：
- 仓库设置 → Secrets and variables → Actions
- 添加 `TMDB_API_KEY` 密钥

## 使用方法

### 本地运行
```bash
# 运行主脚本
python scripts/get_tmdb_data_enhanced.py

# 运行测试
python scripts/test_enhanced_tmdb.py
```

### GitHub Actions自动运行
1. 推送代码到GitHub仓库
2. 在仓库设置中配置 `TMDB_API_KEY` 密钥
3. 工作流将自动运行（每30分钟一次）

## 数据格式

### 基本结构
```json
{
  "last_updated": "2024-01-01 12:00:00",
  "today_global": [...],
  "week_global_all": [...],
  "popular_movies": [...],
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

### 单个项目结构
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

## 图片质量选择策略

### 优先级排序
1. **语言优先级**: 中文 > 英文 > 无语言标签 > 其他语言
2. **评分优先级**: 评分高的图片优先
3. **分辨率优先级**: 分辨率高的图片优先

### 支持的图片类型
- **海报 (posters)**: 电影/电视剧海报
- **背景图 (backdrops)**: 标题背景图片
- **Logo (logos)**: 官方logo图片

## 配置选项

### 环境变量
- `TMDB_API_KEY`: TMDB API密钥（必需）
- `TMDB_LANGUAGE`: 语言设置（默认: zh-CN）
- `TMDB_REGION`: 地区设置（默认: CN）

### 脚本参数
- `time_window`: 时间窗口（day/week）
- `media_type`: 媒体类型（all/movie/tv）
- `max_items`: 最大项目数（默认: 15）

## 错误处理

### 常见错误
1. **API密钥无效**: 检查TMDB_API_KEY是否正确设置
2. **网络超时**: 脚本会自动重试，增加超时时间
3. **API限制**: 添加延迟避免触发频率限制

### 调试模式
```bash
# 启用详细日志
export DEBUG=1
python scripts/get_tmdb_data_enhanced.py
```

## 性能优化

### API调用优化
- 智能缓存机制
- 请求延迟控制（0.1秒间隔）
- 批量处理减少API调用

### 内存优化
- 流式处理大数据集
- 及时释放不需要的数据
- 压缩JSON输出

## 监控和维护

### 健康检查
```bash
# 运行完整测试
python scripts/test_enhanced_tmdb.py
```

### 日志监控
- 检查GitHub Actions运行日志
- 监控数据文件大小变化
- 跟踪API调用成功率

### 数据质量检查
- 验证图片URL有效性
- 检查数据完整性
- 统计覆盖率指标

## 故障排除

### 问题诊断
1. **数据为空**: 检查API密钥和网络连接
2. **图片缺失**: 检查TMDB图片服务状态
3. **更新失败**: 检查GitHub Actions配置

### 常见解决方案
```bash
# 重新安装依赖
pip install -r requirements.txt --force-reinstall

# 清理缓存
rm -rf ~/.cache/pip

# 重置数据文件
rm data/TMDB_Trending.json
```

## 更新日志

### v2.0 (当前版本)
- ✅ 添加Logo背景图功能
- ✅ 增强海报质量选择
- ✅ 添加元数据统计
- ✅ 改进错误处理
- ✅ 优化GitHub Actions工作流

### v1.0 (原始版本)
- ✅ 基础TMDB数据爬取
- ✅ 热门电影和电视剧获取
- ✅ 基本图片URL生成

## 贡献指南

欢迎提交Issue和Pull Request来改进这个模块！

### 开发环境设置
```bash
# 克隆仓库
git clone <repository-url>
cd <repository-name>

# 安装开发依赖
pip install -r requirements.txt

# 运行测试
python scripts/test_enhanced_tmdb.py
```

### 代码规范
- 使用Python 3.8+语法
- 遵循PEP 8代码风格
- 添加适当的注释和文档字符串
- 包含单元测试

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 支持

如果您遇到问题或需要帮助，请：
1. 查看本文档的故障排除部分
2. 检查GitHub Issues
3. 提交新的Issue描述问题

---

**注意**: 请确保遵守TMDB API的使用条款和限制。