# TMDB 增强版数据获取模块

## 概述

这是一个增强版的TMDB数据获取模块，除了原有的标题海报功能外，还新增了**Logo背景图**获取功能。该模块可以自动获取电影和电视剧的官方Logo，为你的应用提供更丰富的视觉元素。

## 新增功能

### 🎨 Logo背景图支持
- 自动获取每个媒体项目的官方Logo
- 智能选择最佳Logo（优先中文，其次英文，最后无语言标识）
- 基于评分和分辨率进行排序
- 支持电影和电视剧Logo获取

### 📊 增强的数据结构
每个媒体项目现在包含以下字段：
```json
{
  "id": 550,
  "title": "Fight Club",
  "type": "movie",
  "genreTitle": "剧情•惊悚",
  "rating": 8.8,
  "release_date": "1999-10-15",
  "overview": "一个失眠的上班族遇到了一个肥皂商...",
  "poster_url": "https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "title_backdrop": "https://image.tmdb.org/t/p/original/example_backdrop.jpg",
  "logo_url": "https://image.tmdb.org/t/p/original/example_logo.png"
}
```

## 文件结构

```
├── scripts/
│   ├── get_tmdb_data_enhanced.py    # 增强版主脚本
│   └── test_enhanced_tmdb.py        # 测试脚本
├── .github/workflows/
│   └── tmdb-enhanced.yml            # GitHub Actions工作流
├── data/
│   └── TMDB_Trending.json           # 输出数据文件
└── requirements.txt                  # Python依赖
```

## 安装和设置

### 1. 环境要求
- Python 3.11+
- TMDB API密钥

### 2. 安装依赖
```bash
pip install -r requirements.txt
```

### 3. 设置API密钥
```bash
export TMDB_API_KEY="your_tmdb_api_key_here"
```

### 4. 获取TMDB API密钥
1. 访问 [TMDB官网](https://www.themoviedb.org/)
2. 注册并登录账户
3. 进入设置页面申请API密钥
4. 复制API密钥并设置环境变量

## 使用方法

### 手动运行
```bash
# 运行增强版脚本
python scripts/get_tmdb_data_enhanced.py

# 运行测试脚本
python scripts/test_enhanced_tmdb.py
```

### 自动运行（GitHub Actions）
1. 在GitHub仓库设置中添加`TMDB_API_KEY`密钥
2. 推送代码到仓库
3. GitHub Actions将每15分钟自动运行一次

## 功能特性

### 🔄 自动数据更新
- 每15分钟自动获取最新数据
- 支持手动触发更新
- 智能检测数据变化

### 🛡️ 错误处理
- 完善的异常处理机制
- API请求超时保护
- 网络错误重试机制

### 📈 性能优化
- 请求间隔控制避免API限制
- 缓存机制减少重复请求
- 智能数据过滤

### 🌍 多语言支持
- 优先获取中文内容
- 支持英文和通用内容
- 智能语言排序

## 数据输出

### 今日热门 (today_global)
获取当天最热门的电影和电视剧

### 本周热门 (week_global_all)
获取本周最热门的媒体内容

### 热门电影 (popular_movies)
获取当前最受欢迎的电影（限制15部）

## Logo获取策略

### 优先级排序
1. **中文Logo** (iso_639_1: "zh") - 最高优先级
2. **英文Logo** (iso_639_1: "en") - 次优先级
3. **无语言标识** (iso_639_1: null) - 第三优先级
4. **其他语言** - 最低优先级

### 质量评估
- **评分** (vote_average): 用户评分越高越好
- **分辨率** (width × height): 分辨率越高越好

## 故障排除

### 常见问题

#### 1. API密钥错误
```
错误: 获取趋势数据失败: 401 Client Error
解决: 检查TMDB_API_KEY是否正确设置
```

#### 2. 网络超时
```
错误: 获取媒体详情失败: timeout
解决: 检查网络连接，脚本会自动重试
```

#### 3. 数据为空
```
问题: 获取到的数据为空
解决: 检查API密钥权限和网络连接
```

### 调试模式
```bash
# 设置调试环境变量
export TMDB_DEBUG=1
python scripts/get_tmdb_data_enhanced.py
```

## 更新日志

### v2.0.0 (增强版)
- ✅ 新增Logo背景图获取功能
- ✅ 优化图片选择算法
- ✅ 增强错误处理机制
- ✅ 改进数据输出格式
- ✅ 添加测试脚本

### v1.0.0 (原版)
- ✅ 基础TMDB数据获取
- ✅ 标题海报功能
- ✅ 自动GitHub Actions部署

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

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 支持

如果你遇到任何问题或有建议，请：
1. 查看本文档的故障排除部分
2. 运行测试脚本检查功能
3. 提交GitHub Issue

---

**注意**: 使用TMDB API需要遵守其使用条款和限制。请确保你的使用符合TMDB的服务条款。