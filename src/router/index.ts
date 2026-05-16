import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
