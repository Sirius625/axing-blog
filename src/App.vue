<template>
  <headerNav @open-login="showLoginModal = true"></headerNav>
  <main class="workspace">
    <router-view />
  </main>
  <loginModel :modelValue="showLoginModal" @update:modelValue="showLoginModal = $event"
    @login-success="handleLoginSuccess"></loginModel>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import headerNav from './components/header-nav.vue';
import loginModel from './components/loginModel.vue';

const showLoginModal = ref(false)

const handleLoginSuccess = () => {
  showLoginModal.value = false
  // 刷新页面以更新 headerNav 中的用户名
  window.location.reload()
}

// 监听 token 过期事件，自动弹出登录弹窗
const handleTokenExpired = () => {
  showLoginModal.value = true
}

onMounted(() => {
  window.addEventListener('token-expired', handleTokenExpired)
})

onUnmounted(() => {
  window.removeEventListener('token-expired', handleTokenExpired)
})
</script>

<style>
.workspace {
  padding-top: 64px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .workspace {
    padding-top: 56px;
  }
}
</style>
