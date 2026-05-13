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
        <button id="toggle-settings" class="nav-right" @click="$emit('open-login')">
            {{ username }}
        </button>
    </header>
</template>
<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{
    (e: 'open-login'): void
}>()

const navItems = [
    { id: 1, text: '首页', name: 'home' },
    { id: 2, text: '音乐', name: 'music' },
    { id: 3, text: '知识', name: 'knowledge' }
]

let username = localStorage.getItem('username') || '登陆'

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