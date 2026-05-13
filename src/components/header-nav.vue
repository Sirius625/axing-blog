<template>
    <!-- 头部导航 -->
    <header class="flex-row-between zindex" style="animation-delay: 0.1s;">
        <div class="flex items-center nav-left">
            <h1 class="">
                axing<span class="font-light">BLOG</span>
            </h1>
        </div>
        <nav class="flex-row-between nav-item">
            <router-link v-for="item in navItems" :key="item.id"
                :to="{ name: item.name }"
                class="text-white"
                active-class="nav-active"
                :exact-active-class="'nav-active'">
                {{ item.text }}
            </router-link>
        </nav>
        <div class="nav-right-wrapper">
            <button id="toggle-settings" class="nav-right" @click="handleUserClick">
                {{ username }}
            </button>
            <!-- 退出登录下拉菜单 -->
            <div v-if="showLogoutMenu" class="dropdown-menu">
                <button class="dropdown-item" @click="handleLogout">退出登录</button>
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store'

const emit = defineEmits<{
    (e: 'open-login'): void
}>()

const authStore = useAuthStore()

const navItems = [
    { id: 1, text: '首页', name: 'home' },
    { id: 2, text: '音乐', name: 'music' },
    { id: 3, text: '知识', name: 'knowledge' }
]

const username = ref(localStorage.getItem('username') || '登陆')
const showLogoutMenu = ref(false)

// 点击用户按钮
const handleUserClick = () => {
    if (authStore.isLoggedIn) {
        showLogoutMenu.value = !showLogoutMenu.value
    } else {
        emit('open-login')
    }
}

// 退出登录
const handleLogout = () => {
    authStore.logout()
    username.value = '登陆'
    showLogoutMenu.value = false
    window.location.reload()
}

// 点击页面其他区域关闭下拉菜单
const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.nav-right-wrapper')) {
        showLogoutMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>





<style>
/* @import url('https://cdn.tailwindcss.com');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'); */
.zindex {
    z-index: 9999;
}

.nav-item {
    width: 300px;
}

.nav-left {
    width: 200px;
}

.nav-right {
    width: 100px;
    height: 40px;
    color: rgb(8, 12, 0);
    font-size: 36px;
    /* background-color: #fff; */
}

.text-white {
    text-decoration: none;
    font-size: 24px;
    color: rgb(8, 12, 0);
}

.nav-active {
    color: rgb(7, 7, 236);
    text-decoration: underline;
}

.text-white:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    /* 文本阴影 */
}

.font-light {
    color: antiquewhite;
}

/* 用户按钮容器 */
.nav-right-wrapper {
    position: relative;
    width: 100px;
}

/* 下拉菜单 */
.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 120px;
    overflow: hidden;
    z-index: 10000;
    animation: fadeIn 0.2s ease;
}

.dropdown-item {
    display: block;
    width: 100%;
    padding: 10px 16px;
    border: none;
    background: none;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s;
}

.dropdown-item:hover {
    background: #f5f5f5;
    color: #e74c3c;
}

#canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.control-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    outline: none;
}

.control-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #38bdf8;
    cursor: pointer;
    transition: background .15s ease-in-out;
}

.control-slider::-webkit-slider-thumb:hover {
    background: #0ea5e9;
}

/* 动画类 */
.fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>