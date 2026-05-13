<template>
  <headerNav @open-login="showLoginModal = true"></headerNav>
  <main class="workspace">
    <router-view />
  </main>
  <loginModel :modelValue="showLoginModal" @update:modelValue="showLoginModal = $event"
    @login-success="handleLoginSuccess"></loginModel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import headerNav from './components/header-nav.vue';
import loginModel from './components/loginModel.vue';

const showLoginModal = ref(false)

const handleLoginSuccess = () => {
  showLoginModal.value = false
  // 刷新页面以更新 headerNav 中的用户名
  window.location.reload()
}
</script>

<style>

</style>
