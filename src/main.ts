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
import '@fortawesome/fontawesome-free/css/all.min.css'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
