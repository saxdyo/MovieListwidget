# 图标库 (Icon Library)

一个现代化的 React 图标库，提供丰富的 SVG 图标组件。

## 特性

- 🎨 **40+ 精美图标** - 包含常用的 UI 图标
- 🎯 **TypeScript 支持** - 完整的类型定义
- 🎪 **高度可定制** - 支持大小、颜色、样式自定义
- ♿ **无障碍友好** - 支持 ARIA 标签和键盘导航
- 📦 **轻量级** - 基于 SVG，无额外依赖
- 🔧 **易于使用** - 简单的 API 设计

## 安装

```bash
npm install icon-library
# 或
yarn add icon-library
```

## 使用方法

### 基本用法

```tsx
import { Icon } from 'icon-library';

function App() {
  return (
    <div>
      <Icon name="home" size={24} color="#333" />
      <Icon name="search" size={32} color="blue" />
      <Icon name="heart" size={48} color="red" />
    </div>
  );
}
```

### 直接导入特定图标

```tsx
import { HomeIcon, SearchIcon, HeartIcon } from 'icon-library';

function App() {
  return (
    <div>
      <HomeIcon size={24} color="#333" />
      <SearchIcon size={32} color="blue" />
      <HeartIcon size={48} color="red" />
    </div>
  );
}
```

### 交互功能

```tsx
import { Icon } from 'icon-library';

function App() {
  const handleIconClick = () => {
    console.log('图标被点击了！');
  };

  return (
    <Icon 
      name="heart" 
      size={32} 
      color="#ff4757"
      onClick={handleIconClick}
      onMouseEnter={() => console.log('鼠标进入')}
      onMouseLeave={() => console.log('鼠标离开')}
    />
  );
}
```

### 禁用状态

```tsx
import { Icon } from 'icon-library';

function App() {
  return (
    <Icon 
      name="delete" 
      size={32} 
      color="#ff4757"
      disabled
      title="此操作不可用"
    />
  );
}
```

## API 参考

### Icon 组件属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `name` | `IconName` | - | 图标名称（必需） |
| `size` | `number \| string` | `24` | 图标大小 |
| `color` | `string` | `'currentColor'` | 图标颜色 |
| `className` | `string` | `''` | 自定义 CSS 类名 |
| `style` | `CSSProperties` | `{}` | 自定义样式 |
| `onClick` | `(event) => void` | - | 点击事件处理函数 |
| `onMouseEnter` | `(event) => void` | - | 鼠标进入事件处理函数 |
| `onMouseLeave` | `(event) => void` | - | 鼠标离开事件处理函数 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `title` | `string` | - | 图标标题（用于无障碍访问） |

### 可用图标

#### 基础图标
- `home` - 首页
- `search` - 搜索
- `user` - 用户
- `settings` - 设置
- `heart` - 心形
- `star` - 星形

#### 箭头图标
- `arrow-left` - 左箭头
- `arrow-right` - 右箭头
- `arrow-up` - 上箭头
- `arrow-down` - 下箭头

#### 操作图标
- `close` - 关闭
- `menu` - 菜单
- `plus` - 加号
- `minus` - 减号
- `edit` - 编辑
- `delete` - 删除

#### 文件图标
- `download` - 下载
- `upload` - 上传
- `share` - 分享
- `file` - 文件
- `folder` - 文件夹

#### 社交图标
- `like` - 点赞
- `comment` - 评论
- `notification` - 通知

#### 时间图标
- `calendar` - 日历
- `clock` - 时钟

#### 位置图标
- `location` - 位置
- `phone` - 电话
- `email` - 邮件
- `link` - 链接

#### 媒体图标
- `image` - 图片
- `video` - 视频

#### 安全图标
- `lock` - 锁定
- `unlock` - 解锁
- `eye` - 眼睛
- `eye-off` - 隐藏眼睛

#### 状态图标
- `check` - 勾选
- `info` - 信息
- `warning` - 警告
- `error` - 错误
- `success` - 成功

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 开发模式

```bash
npm run dev
```

### 运行示例

```bash
npm run storybook
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
