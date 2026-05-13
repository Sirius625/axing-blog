# Axing Blog 🎵

一个基于 Vue 3 + TypeScript + Vite 的个人博客项目，集成了音乐播放、前端知识体系等功能。

## 技术栈

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **语言**: TypeScript
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 请求**: Axios
- **CSS 框架**: Tailwind CSS 4
- **图标**: Font Awesome

## 功能模块

### 🏠 首页 (Home)
- 个人博客首页展示
- 深色渐变主题风格

### 🎵 音乐 (Music)
- 推荐歌单展示
- 歌单排行榜
- 歌曲搜索
- 歌曲播放与歌词展示
- 对接网易云音乐 API

### 📚 知识体系 (Knowledge)
- 前端知识体系框架展示
- 6 大分类、28 个知识点卡片
- 知识点分类：HTML/CSS、JavaScript、Vue/React、工程化、Node.js、计算机基础

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 环境变量

在 `src/.env` 中配置：

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 项目结构

```
src/
├── api/          # API 请求层
│   ├── index.ts  # Axios 封装
│   └── http.ts   # 业务 API 接口
├── components/   # 公共组件
│   ├── header-nav.vue    # 顶部导航栏
│   ├── loginModel.vue    # 登录弹窗
│   └── ConfirmDialog.vue # 确认对话框
├── router/       # 路由配置
├── store/        # Pinia 状态管理
├── views/        # 页面视图
│   ├── home/     # 首页
│   ├── music/    # 音乐页面
│   └── knowledge/ # 知识体系页面
└── style/        # 样式文件
```
