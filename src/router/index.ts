/**
 * 博客前端路由配置
 *
 * 定义个人博客的所有页面路由，包括首页、音乐播放、知识库、博客文章等模块。
 *
 * @module router/index
 */

import { createRouter, createWebHistory } from 'vue-router'

/** 路由表定义 */
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/music',
    name: 'music',
    component: () => import('../views/music/index.vue')
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('../views/knowledge/index.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/blog/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
