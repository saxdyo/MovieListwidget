# 🎨 图标库 (Icon Library)

一个可以通过JSON订阅链接访问的图标库，支持多种格式和分类。

## 📋 目录结构

```
icons/
├── categories/
│   ├── social/          # 社交媒体图标
│   ├── tech/           # 技术相关图标
│   ├── business/       # 商业相关图标
│   ├── entertainment/  # 娱乐相关图标
│   └── misc/          # 其他图标
├── formats/
│   ├── svg/           # SVG格式
│   ├── png/           # PNG格式
│   └── json/          # JSON订阅文件
└── metadata/
    └── icons.json     # 图标元数据
```

## 🔗 订阅链接

### 完整图标库
```
https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/json/all-icons.json
```

### 分类订阅
- **社交媒体**: `https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/json/social.json`
- **技术相关**: `https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/json/tech.json`
- **商业相关**: `https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/json/business.json`
- **娱乐相关**: `https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/json/entertainment.json`

## 📦 使用方法

### 1. 直接访问图标
```
https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/svg/social/facebook.svg
```

### 2. 通过JSON订阅获取图标列表
```javascript
fetch('https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/json/all-icons.json')
  .then(response => response.json())
  .then(data => {
    console.log(data.icons);
  });
```

## 🎯 图标格式

- **SVG**: 矢量格式，可缩放，文件小
- **PNG**: 位图格式，适合特定尺寸
- **JSON**: 元数据格式，包含图标信息

## 📝 图标元数据格式

```json
{
  "name": "facebook",
  "category": "social",
  "tags": ["social", "facebook", "blue"],
  "formats": ["svg", "png"],
  "urls": {
    "svg": "https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/svg/social/facebook.svg",
    "png": "https://raw.githubusercontent.com/[你的用户名]/icon-library/main/icons/png/social/facebook.png"
  },
  "description": "Facebook社交媒体图标",
  "author": "Icon Library",
  "license": "MIT"
}
```

## 🚀 快速开始

1. 克隆仓库
```bash
git clone https://github.com/[你的用户名]/icon-library.git
```

2. 添加新图标
```bash
# 将图标文件放入对应分类目录
cp your-icon.svg icons/svg/social/
```

3. 更新元数据
```bash
# 编辑 icons/metadata/icons.json 添加新图标信息
```

4. 提交更改
```bash
git add .
git commit -m "Add new icon: your-icon"
git push origin main
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交Pull Request来添加新图标或改进现有功能！

## 📞 联系方式

如有问题或建议，请提交Issue或联系维护者。
