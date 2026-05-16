# Axing Blog 🎵

一个基于 Vue 3 + TypeScript + Vite 的个人博客项目，集成了图片画廊、音乐播放、前端知识体系、博客文章等功能。

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

### 🏠 首页 - 图片画廊 (Home)
- 图片画廊展示，支持网格/列表两种视图模式
- 图片上传（支持标题、描述、分类、可见性设置）
- 图片预览（支持缩放、拖拽、双指手势）
- 图片搜索（按标题/描述关键词搜索）
- 分类筛选（运动/日常/游戏/其他）
- 可见性筛选（公开/私密）
- 排序（最新上传/最多点赞/按名称）
- 深色/亮色主题切换
- 对接后端图片管理 API

### 🎵 音乐 (Music)
- 推荐歌单展示
- 歌单排行榜
- 歌曲搜索（带搜索历史记录）
- 歌曲播放与歌词展示
- 我喜欢的音乐列表（支持搜索过滤）
- 最近播放历史
- 全局音乐播放器（支持播放/暂停、上一首/下一首、音量调节、进度拖拽）
- 对接网易云音乐 API

### 📚 知识体系 (Knowledge)
- 前端知识体系框架展示
- 8 大分类、42 个知识点卡片
- 知识点分类：HTML、CSS、JavaScript、Vue、React、Node.js、数据库、工程化
- 每个知识点包含详细要点和推荐学习资源
- 支持分类筛选和关键词搜索

### 📝 博客文章 (Blog)
- 文章列表展示（支持分页）
- 文章分类筛选和关键词搜索
- 文章详情查看（支持 Markdown 渲染）
- 文章点赞功能
- 文章发布/编辑（支持 Markdown 编辑与实时预览）
- 文章删除（作者或管理员可操作）
- 文章统计（文章总数、分类数量）

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

在 `.env` 中配置：

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_MANAGE_API_BASE_URL=http://localhost:3030
```

## 项目结构

```
src/
├── api/                    # API 请求层
│   ├── index.ts            # Axios 封装（双服务架构：音乐API + 管理后台API）
│   ├── http.ts             # 网易云音乐 API 接口（推荐歌单、排行榜、搜索等）
│   └── http1.ts            # 管理后台 API 接口（用户认证、歌曲管理、文章等）
├── components/             # 公共组件
│   ├── header-nav.vue      # 顶部导航栏
│   ├── loginModel.vue      # 登录弹窗
│   ├── ConfirmDialog.vue   # 确认对话框
│   ├── home/               # 首页组件
│   │   ├── ImageCard.vue       # 图片卡片
│   │   ├── ImageUploadModal.vue # 图片上传弹窗
│   │   └── ImagePreviewModal.vue # 图片预览弹窗
│   ├── music/              # 音乐组件
│   │   ├── MusicPlayer.vue     # 全局音乐播放器
│   │   ├── MusicSidebar.vue    # 音乐侧边栏
│   │   ├── MusicSearch.vue     # 音乐搜索
│   │   ├── SongTable.vue       # 歌曲表格
│   │   ├── PlaylistCard.vue    # 歌单卡片
│   │   └── LyricModal.vue      # 歌词模态框
│   └── knowledge/          # 知识体系组件
│       ├── KnowledgeHeader.vue  # 知识体系头部
│       ├── KnowledgeFilter.vue  # 知识体系筛选
│       ├── KnowledgeCard.vue    # 知识卡片
│       └── KnowledgeModal.vue   # 知识详情弹窗
├── router/                 # 路由配置
├── store/                  # Pinia 状态管理
│   ├── index.ts            # 认证状态（useAuthStore）+ 系统设置（useSettingsStore）
│   └── player.ts           # 音乐播放器状态（usePlayerStore）
├── views/                  # 页面视图
│   ├── home/               # 首页（图片画廊）
│   ├── music/              # 音乐页面
│   ├── knowledge/          # 知识体系页面
│   └── blog/               # 博客文章页面
└── style/                  # 样式文件
```

## 后端依赖

本项目的音乐功能依赖网易云音乐 API 代理服务（端口 3000），歌曲管理、用户认证、文章等功能依赖管理后台服务（端口 3030）。详见 [project-server](../project-server/README.md)。
