<template>
  <div class="knowledge-app">
    <!-- 顶部标题区 -->
    <header class="knowledge-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-code"></i>
        </div>
        <div>
          <h1>前端知识体系</h1>
          <p class="header-subtitle">Frontend Knowledge Framework</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalItems }}</span>
          <span class="stat-label">知识点</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ categories.length }}</span>
          <span class="stat-label">分类</span>
        </div>
      </div>
    </header>

    <!-- 搜索过滤 -->
    <div class="filter-bar">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input v-model="searchQuery" type="text" placeholder="搜索知识点..." class="search-input">
      </div>
      <div class="category-tabs">
        <button v-for="cat in categories" :key="cat.id"
          :class="['tab-btn', { active: activeCategory === cat.id }]"
          @click="activeCategory = cat.id">
          <i :class="cat.icon"></i>
          <span>{{ cat.name }}</span>
        </button>
        <button :class="['tab-btn', { active: activeCategory === 'all' }]"
          @click="activeCategory = 'all'">
          <i class="fas fa-th-large"></i>
          <span>全部</span>
        </button>
      </div>
    </div>

    <!-- 知识卡片网格 -->
    <div class="knowledge-grid">
      <div v-for="item in filteredItems" :key="item.id" class="knowledge-card"
        @click="openDetail(item)">
        <div class="card-header" :style="{ background: item.color }">
          <i :class="item.icon"></i>
          <span class="card-badge">{{ item.category }}</span>
        </div>
        <div class="card-body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
        <div class="card-footer">
          <div class="tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <span class="card-arrow"><i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredItems.length === 0" class="empty-state">
      <i class="fas fa-search"></i>
      <h3>未找到相关知识点</h3>
      <p>尝试更换关键词搜索</p>
    </div>

    <!-- 详情弹窗 -->
    <transition name="modal-fade">
      <div v-if="selectedItem" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header" :style="{ background: selectedItem.color }">
            <div class="modal-header-content">
              <i :class="selectedItem.icon"></i>
              <div>
                <h2>{{ selectedItem.title }}</h2>
                <span class="modal-category">{{ selectedItem.category }}</span>
              </div>
            </div>
            <button class="modal-close" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-description">{{ selectedItem.description }}</p>
            <div class="modal-section">
              <h4><i class="fas fa-tags"></i> 相关标签</h4>
              <div class="tags">
                <span v-for="tag in selectedItem.tags" :key="tag" class="tag tag-lg">{{ tag }}</span>
              </div>
            </div>
            <div class="modal-section">
              <h4><i class="fas fa-list"></i> 核心知识点</h4>
              <ul class="knowledge-list">
                <li v-for="(point, index) in selectedItem.points" :key="index">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
            <div class="modal-section">
              <h4><i class="fas fa-link"></i> 推荐资源</h4>
              <div class="resource-links">
                <a v-for="(res, index) in selectedItem.resources" :key="index" :href="res.url"
                  target="_blank" class="resource-link">
                  <i :class="res.icon"></i>
                  <span>{{ res.name }}</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface KnowledgeItem {
  id: number
  title: string
  description: string
  category: string
  icon: string
  color: string
  tags: string[]
  points: string[]
  resources: { name: string; url: string; icon: string }[]
}

interface Category {
  id: string
  name: string
  icon: string
}

const searchQuery = ref('')
const activeCategory = ref<string>('all')
const selectedItem = ref<KnowledgeItem | null>(null)

const categories: Category[] = [
  { id: 'html', name: 'HTML', icon: 'fab fa-html5' },
  { id: 'css', name: 'CSS', icon: 'fab fa-css3-alt' },
  { id: 'javascript', name: 'JavaScript', icon: 'fab fa-js' },
  { id: 'vue', name: 'Vue', icon: 'fab fa-vuejs' },
  { id: 'react', name: 'React', icon: 'fab fa-react' },
  { id: 'engineering', name: '工程化', icon: 'fas fa-tools' },
]

const knowledgeItems: KnowledgeItem[] = [
  // HTML
  {
    id: 1, title: 'HTML5 语义化标签', description: '使用语义化标签构建清晰、可访问的页面结构，包括 header、nav、main、article、section、aside、footer 等。',
    category: 'HTML', icon: 'fab fa-html5', color: 'linear-gradient(135deg, #e44d26, #f16529)', tags: ['HTML5', '语义化', 'SEO'],
    points: ['语义化标签的正确使用场景', 'SEO 优化与搜索引擎理解', '无障碍访问（ARIA）', '文档大纲结构'],
    resources: [
      { name: 'MDN HTML 参考', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML', icon: 'fas fa-book' },
      { name: 'HTML5 语义化指南', url: 'https://www.w3schools.com/html/html5_semantic_elements.asp', icon: 'fas fa-graduation-cap' }
    ]
  },
  {
    id: 2, title: '表单与输入验证', description: 'HTML5 表单控件、输入类型、属性验证及自定义表单样式。',
    category: 'HTML', icon: 'fab fa-html5', color: 'linear-gradient(135deg, #e44d26, #f16529)', tags: ['表单', '验证', '输入'],
    points: ['input 类型与属性详解', '表单验证 API', '自定义表单样式', '文件上传处理'],
    resources: [
      { name: 'MDN 表单指南', url: 'https://developer.mozilla.org/zh-CN/docs/Learn/Forms', icon: 'fas fa-book' }
    ]
  },
  {
    id: 3, title: 'Canvas 与 SVG', description: '使用 Canvas API 绘制 2D 图形和 SVG 矢量图形。',
    category: 'HTML', icon: 'fab fa-html5', color: 'linear-gradient(135deg, #e44d26, #f16529)', tags: ['Canvas', 'SVG', '图形'],
    points: ['Canvas 绘图基础', '路径、渐变与变换', 'SVG 视图与坐标系统', '动画与交互'],
    resources: [
      { name: 'MDN Canvas 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API', icon: 'fas fa-book' }
    ]
  },

  // CSS
  {
    id: 4, title: 'Flexbox 布局', description: '弹性盒子布局模型，实现一维空间的灵活布局分配。',
    category: 'CSS', icon: 'fab fa-css3-alt', color: 'linear-gradient(135deg, #264de4, #2965f1)', tags: ['Flexbox', '布局', '响应式'],
    points: ['主轴与交叉轴概念', 'flex 属性详解', '对齐与分配方式', '常见布局模式'],
    resources: [
      { name: 'Flexbox 完全指南', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', icon: 'fas fa-newspaper' },
      { name: 'Flexbox 青蛙游戏', url: 'https://flexboxfroggy.com/', icon: 'fas fa-gamepad' }
    ]
  },
  {
    id: 5, title: 'Grid 网格布局', description: 'CSS Grid 二维布局系统，同时控制行和列的布局。',
    category: 'CSS', icon: 'fab fa-css3-alt', color: 'linear-gradient(135deg, #264de4, #2965f1)', tags: ['Grid', '布局', '响应式'],
    points: ['网格容器与项目', '轨道大小与命名', '网格区域定位', '隐式网格与自动填充'],
    resources: [
      { name: 'CSS Grid 完全指南', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', icon: 'fas fa-newspaper' },
      { name: 'Grid 花园游戏', url: 'https://cssgridgarden.com/', icon: 'fas fa-gamepad' }
    ]
  },
  {
    id: 6, title: 'CSS 动画与过渡', description: '使用 transition 和 animation 创建流畅的页面动画效果。',
    category: 'CSS', icon: 'fab fa-css3-alt', color: 'linear-gradient(135deg, #264de4, #2965f1)', tags: ['动画', '过渡', '交互'],
    points: ['transition 过渡属性', 'keyframes 关键帧动画', '动画性能优化', 'CSS 变量与动画结合'],
    resources: [
      { name: 'CSS 动画指南', url: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations', icon: 'fas fa-book' }
    ]
  },
  {
    id: 7, title: '响应式设计', description: '使用媒体查询、相对单位和弹性布局实现跨设备适配。',
    category: 'CSS', icon: 'fab fa-css3-alt', color: 'linear-gradient(135deg, #264de4, #2965f1)', tags: ['响应式', '移动端', '媒体查询'],
    points: ['媒体查询断点策略', '相对单位 rem/em/vw/vh', '移动优先设计', '图片与字体响应式'],
    resources: [
      { name: '响应式设计基础', url: 'https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Responsive_Design', icon: 'fas fa-book' }
    ]
  },
  {
    id: 8, title: 'CSS 预处理器', description: 'Sass/SCSS、Less 等预处理器增强 CSS 开发效率。',
    category: 'CSS', icon: 'fab fa-css3-alt', color: 'linear-gradient(135deg, #264de4, #2965f1)', tags: ['Sass', 'Less', '预处理器'],
    points: ['变量与嵌套规则', 'Mixin 与函数', '继承与占位符', '模块化组织'],
    resources: [
      { name: 'Sass 官方文档', url: 'https://sass-lang.com/documentation/', icon: 'fas fa-book' }
    ]
  },

  // JavaScript
  {
    id: 9, title: 'ES6+ 核心语法', description: 'ES2015 及之后版本的重要 JavaScript 语言特性。',
    category: 'JavaScript', icon: 'fab fa-js', color: 'linear-gradient(135deg, #f7df1e, #e6a700)', tags: ['ES6', '语法', '现代JS'],
    points: ['let/const 与块级作用域', '箭头函数与 this 绑定', '解构赋值与展开运算符', 'Promise 与 async/await', '模块化 import/export'],
    resources: [
      { name: 'ES6 入门教程', url: 'https://es6.ruanyifeng.com/', icon: 'fas fa-book' },
      { name: 'MDN JavaScript 指南', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide', icon: 'fas fa-book' }
    ]
  },
  {
    id: 10, title: '闭包与作用域', description: '理解 JavaScript 的作用域链、闭包机制及其应用场景。',
    category: 'JavaScript', icon: 'fab fa-js', color: 'linear-gradient(135deg, #f7df1e, #e6a700)', tags: ['闭包', '作用域', '进阶'],
    points: ['执行上下文与作用域链', '闭包的定义与原理', '闭包的实际应用', '内存管理'],
    resources: [
      { name: 'MDN 闭包详解', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures', icon: 'fas fa-book' }
    ]
  },
  {
    id: 11, title: '原型链与继承', description: 'JavaScript 基于原型的继承机制。',
    category: 'JavaScript', icon: 'fab fa-js', color: 'linear-gradient(135deg, #f7df1e, #e6a700)', tags: ['原型', '继承', 'OOP'],
    points: ['原型与原型链', '构造函数与 new', 'class 语法糖', '多种继承方式'],
    resources: [
      { name: 'MDN 继承与原型链', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain', icon: 'fas fa-book' }
    ]
  },
  {
    id: 12, title: 'DOM 操作与事件', description: '文档对象模型操作和事件处理机制。',
    category: 'JavaScript', icon: 'fab fa-js', color: 'linear-gradient(135deg, #f7df1e, #e6a700)', tags: ['DOM', '事件', '浏览器'],
    points: ['DOM 选择与遍历', '事件捕获与冒泡', '事件委托模式', '自定义事件'],
    resources: [
      { name: 'MDN DOM 参考', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model', icon: 'fas fa-book' }
    ]
  },
  {
    id: 13, title: '异步编程', description: 'JavaScript 异步编程模型：回调、Promise、async/await。',
    category: 'JavaScript', icon: 'fab fa-js', color: 'linear-gradient(135deg, #f7df1e, #e6a700)', tags: ['异步', 'Promise', '事件循环'],
    points: ['事件循环机制', '宏任务与微任务', 'Promise 链式调用', 'async/await 语法糖', '并发控制'],
    resources: [
      { name: 'JavaScript 事件循环', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop', icon: 'fas fa-book' }
    ]
  },
  {
    id: 14, title: 'TypeScript 基础', description: 'TypeScript 类型系统与工程实践。',
    category: 'JavaScript', icon: 'fab fa-js', color: 'linear-gradient(135deg, #f7df1e, #e6a700)', tags: ['TypeScript', '类型', '工程化'],
    points: ['基础类型与接口', '泛型编程', '类型守卫与断言', '装饰器与高级类型'],
    resources: [
      { name: 'TypeScript 官方文档', url: 'https://www.typescriptlang.org/docs/', icon: 'fas fa-book' }
    ]
  },

  // Vue
  {
    id: 15, title: 'Vue 3 组合式 API', description: 'Vue 3 Composition API 的核心概念与最佳实践。',
    category: 'Vue', icon: 'fab fa-vuejs', color: 'linear-gradient(135deg, #42b883, #35495e)', tags: ['Vue3', 'Composition API', '响应式'],
    points: ['ref 与 reactive', 'computed 与 watch', '生命周期钩子', 'provide/inject 依赖注入'],
    resources: [
      { name: 'Vue 3 官方文档', url: 'https://vuejs.org/guide/introduction.html', icon: 'fas fa-book' },
      { name: 'Vue 3 中文文档', url: 'https://cn.vuejs.org/', icon: 'fas fa-language' }
    ]
  },
  {
    id: 16, title: 'Vue Router', description: 'Vue 官方路由管理器，实现 SPA 页面导航。',
    category: 'Vue', icon: 'fab fa-vuejs', color: 'linear-gradient(135deg, #42b883, #35495e)', tags: ['路由', '导航', 'SPA'],
    points: ['路由配置与动态路由', '导航守卫', '路由懒加载', '路由元信息'],
    resources: [
      { name: 'Vue Router 文档', url: 'https://router.vuejs.org/', icon: 'fas fa-book' }
    ]
  },
  {
    id: 17, title: 'Pinia 状态管理', description: 'Vue 3 官方推荐的状态管理库，替代 Vuex。',
    category: 'Vue', icon: 'fab fa-vuejs', color: 'linear-gradient(135deg, #42b883, #35495e)', tags: ['Pinia', '状态管理', 'Store'],
    points: ['Store 定义与使用', 'Actions 与 Getters', '插件系统', 'SSR 支持'],
    resources: [
      { name: 'Pinia 官方文档', url: 'https://pinia.vuejs.org/', icon: 'fas fa-book' }
    ]
  },
  {
    id: 18, title: 'Vue 组件设计', description: 'Vue 组件化开发模式与设计模式。',
    category: 'Vue', icon: 'fab fa-vuejs', color: 'linear-gradient(135deg, #42b883, #35495e)', tags: ['组件', '设计模式', '复用'],
    points: ['组件通信方式', '插槽与作用域插槽', '高阶组件与组合函数', '组件库设计'],
    resources: [
      { name: 'Vue 组件基础', url: 'https://vuejs.org/guide/essentials/component-basics.html', icon: 'fas fa-book' }
    ]
  },

  // React
  {
    id: 19, title: 'React Hooks', description: 'React 16.8+ 的 Hooks API，函数组件的状态与副作用管理。',
    category: 'React', icon: 'fab fa-react', color: 'linear-gradient(135deg, #61dafb, #20232a)', tags: ['Hooks', '函数组件', '状态'],
    points: ['useState 与 useEffect', 'useContext 与 useReducer', '自定义 Hooks', 'Hooks 规则'],
    resources: [
      { name: 'React Hooks 文档', url: 'https://react.dev/reference/react/hooks', icon: 'fas fa-book' }
    ]
  },
  {
    id: 20, title: 'React 组件与 Props', description: 'React 组件化开发，Props 数据流与组件组合。',
    category: 'React', icon: 'fab fa-react', color: 'linear-gradient(135deg, #61dafb, #20232a)', tags: ['组件', 'Props', 'JSX'],
    points: ['JSX 语法详解', '组件 Props 类型检查', '组件组合模式', 'Render Props'],
    resources: [
      { name: 'React 官方文档', url: 'https://react.dev/', icon: 'fas fa-book' }
    ]
  },
  {
    id: 21, title: 'React Router', description: 'React 应用的路由解决方案。',
    category: 'React', icon: 'fab fa-react', color: 'linear-gradient(135deg, #61dafb, #20232a)', tags: ['路由', '导航', 'SPA'],
    points: ['路由配置与嵌套路由', '路由参数与查询', '导航守卫', '代码分割'],
    resources: [
      { name: 'React Router 文档', url: 'https://reactrouter.com/', icon: 'fas fa-book' }
    ]
  },
  {
    id: 22, title: 'Redux / Zustand', description: 'React 状态管理方案对比与实践。',
    category: 'React', icon: 'fab fa-react', color: 'linear-gradient(135deg, #61dafb, #20232a)', tags: ['状态管理', 'Redux', 'Zustand'],
    points: ['Redux Toolkit 使用', 'Zustand 轻量方案', '中间件与副作用', '性能优化'],
    resources: [
      { name: 'Redux 官方文档', url: 'https://redux.js.org/', icon: 'fas fa-book' },
      { name: 'Zustand 文档', url: 'https://github.com/pmndrs/zustand', icon: 'fab fa-github' }
    ]
  },

  // 工程化
  {
    id: 23, title: 'Webpack / Vite', description: '前端构建工具的核心概念与配置。',
    category: '工程化', icon: 'fas fa-tools', color: 'linear-gradient(135deg, #8e44ad, #9b59b6)', tags: ['构建工具', 'Webpack', 'Vite'],
    points: ['Webpack 核心概念', 'Loader 与 Plugin', 'Vite 开发体验', '性能优化策略'],
    resources: [
      { name: 'Webpack 官方文档', url: 'https://webpack.js.org/', icon: 'fas fa-book' },
      { name: 'Vite 官方文档', url: 'https://vitejs.dev/', icon: 'fas fa-book' }
    ]
  },
  {
    id: 24, title: 'Git 版本控制', description: 'Git 分布式版本控制系统的工作流程与最佳实践。',
    category: '工程化', icon: 'fas fa-tools', color: 'linear-gradient(135deg, #8e44ad, #9b59b6)', tags: ['Git', '版本控制', '协作'],
    points: ['Git 工作流', '分支管理策略', '合并与变基', 'Git Hooks'],
    resources: [
      { name: 'Git 官方文档', url: 'https://git-scm.com/doc', icon: 'fas fa-book' }
    ]
  },
  {
    id: 25, title: 'CI/CD 持续集成', description: '自动化构建、测试与部署流水线。',
    category: '工程化', icon: 'fas fa-tools', color: 'linear-gradient(135deg, #8e44ad, #9b59b6)', tags: ['CI/CD', '自动化', 'DevOps'],
    points: ['GitHub Actions 配置', '自动化测试集成', '自动化部署策略', 'Docker 容器化'],
    resources: [
      { name: 'GitHub Actions 文档', url: 'https://docs.github.com/en/actions', icon: 'fab fa-github' }
    ]
  },
  {
    id: 26, title: '性能优化', description: '前端性能优化策略与最佳实践。',
    category: '工程化', icon: 'fas fa-tools', color: 'linear-gradient(135deg, #8e44ad, #9b59b6)', tags: ['性能', '优化', '加载'],
    points: ['代码分割与懒加载', '图片优化与 CDN', '缓存策略', 'Core Web Vitals', '构建产物分析'],
    resources: [
      { name: 'Web Vitals', url: 'https://web.dev/vitals/', icon: 'fas fa-chart-line' },
      { name: 'Lighthouse', url: 'https://developer.chrome.com/docs/lighthouse/', icon: 'fas fa-lightbulb' }
    ]
  },
  {
    id: 27, title: '测试体系', description: '前端测试金字塔：单元测试、集成测试、E2E 测试。',
    category: '工程化', icon: 'fas fa-tools', color: 'linear-gradient(135deg, #8e44ad, #9b59b6)', tags: ['测试', 'Jest', 'Cypress'],
    points: ['Vitest/Jest 单元测试', 'Vue Test Utils', 'Cypress E2E 测试', '测试覆盖率'],
    resources: [
      { name: 'Vitest 文档', url: 'https://vitest.dev/', icon: 'fas fa-book' },
      { name: 'Cypress 文档', url: 'https://www.cypress.io/', icon: 'fas fa-book' }
    ]
  },
  {
    id: 28, title: '网络与安全', description: 'HTTP 协议、浏览器安全机制与前端防护。',
    category: '工程化', icon: 'fas fa-tools', color: 'linear-gradient(135deg, #8e44ad, #9b59b6)', tags: ['网络', '安全', 'HTTP'],
    points: ['HTTP/HTTPS 协议', 'CORS 跨域', 'XSS 与 CSRF 防护', '认证与授权'],
    resources: [
      { name: 'MDN HTTP 参考', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP', icon: 'fas fa-book' }
    ]
  },
]

const totalItems = computed(() => knowledgeItems.length)

const filteredItems = computed(() => {
  let items = knowledgeItems
  if (activeCategory.value !== 'all') {
    items = items.filter(item => item.category === categories.find(c => c.id === activeCategory.value)?.name)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  return items
})

const openDetail = (item: KnowledgeItem) => {
  selectedItem.value = item
  document.body.style.overflow = 'hidden'
}

// 点击遮罩关闭时恢复滚动
const closeModal = () => {
  selectedItem.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
.knowledge-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding-bottom: 2rem;
}

/* 头部 */
.knowledge-header {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.header-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
  letter-spacing: 0.05em;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 过滤栏 */
.filter-bar {
  padding: 1.5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  max-width: 400px;
  margin-bottom: 1rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.3);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* 知识卡片网格 */
.knowledge-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.knowledge-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.knowledge-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 1.25rem;
}

.card-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  backdrop-filter: blur(4px);
}

.card-body {
  padding: 1.25rem;
}

.card-body h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem;
}

.card-body p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.35rem;
  color: rgba(255, 255, 255, 0.5);
}

.card-arrow {
  color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.knowledge-card:hover .card-arrow {
  color: rgba(255, 255, 255, 0.6);
  transform: translateX(4px);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: rgba(255, 255, 255, 0.6);
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

/* 详情弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.modal-container {
  background: #1a1a2e;
  border-radius: 1rem;
  width: 100%;
  max-width: 560px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: white;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-header-content i {
  font-size: 1.5rem;
}

.modal-header-content h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.modal-category {
  font-size: 0.75rem;
  opacity: 0.7;
}

.modal-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1.5rem;
}

.modal-section {
  margin-bottom: 1.5rem;
}

.modal-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-section h4 i {
  font-size: 0.75rem;
}

.tag-lg {
  font-size: 0.8rem;
  padding: 0.3rem 0.75rem;
}

.knowledge-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.knowledge-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.knowledge-list li:last-child {
  border-bottom: none;
}

.knowledge-list li i {
  color: #4ade80;
  font-size: 0.85rem;
}

.resource-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resource-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s;
}

.resource-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.15);
}

.resource-link span {
  flex: 1;
  font-size: 0.85rem;
}

.resource-link .fa-external-link-alt {
  font-size: 0.7rem;
  opacity: 0.4;
}

/* 弹窗动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条 */
.modal-container::-webkit-scrollbar {
  width: 6px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 响应式 */
@media (max-width: 768px) {
  .knowledge-header {
    padding: 1.5rem 1rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .header-stats {
    width: 100%;
    justify-content: flex-start;
  }

  .filter-bar {
    padding: 1rem;
  }

  .knowledge-grid {
    padding: 0 1rem;
    grid-template-columns: 1fr;
  }

  .modal-container {
    max-height: 90vh;
    margin: 0.5rem;
  }
}
</style>
