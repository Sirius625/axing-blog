/**
 * 个人博客应用 - 入口文件
 *
 * 基于 Vue 3 + Pinia + Vue Router 构建的个人博客系统。
 * 包含首页、音乐播放、知识库、博客文章等模块。
 *
 * @module main
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
import './style.css'
import './style/style.css'
import { createPinia } from 'pinia'

// FontAwesome 按需导入（非首屏必需，动态加载）
const loadFontAwesome = () => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
  link.integrity = 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=='
  link.crossOrigin = 'anonymous'
  link.referrerPolicy = 'no-referrer'
  document.head.appendChild(link)
}

// 首屏加载完成后延迟加载 FontAwesome
if (document.readyState === 'complete') {
  loadFontAwesome()
} else {
  window.addEventListener('load', loadFontAwesome)
}

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
