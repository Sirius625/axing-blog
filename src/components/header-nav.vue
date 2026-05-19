<template>
  <!-- 头部导航 -->
  <header class="navbar">
    <div class="navbar-inner">
      <!-- Logo -->
      <div class="logo-area">
        <div class="logo-icon">
          <i class="fa-solid fa-crown"></i>
        </div>
        <h1 class="logo-text"><span class="logo-accent">BLOG</span></h1>
      </div>

      <!-- 导航链接 -->
      <nav class="nav-links">
        <router-link
          v-for="item in navItems"
          :key="item.id"
          :to="{ name: item.name }"
          class="nav-link"
          active-class="nav-link--active"
        >
          <i :class="item.icon" class="nav-link-icon"></i>
          <span>{{ item.text }}</span>
          <span class="nav-link-indicator"></span>
        </router-link>
      </nav>

      <!-- 用户区域 -->
      <div class="user-area">
        <button
          class="user-btn"
          @click="handleUserClick"
          :class="{ 'user-btn--logged': authStore.isLoggedIn }"
        >
          <div class="user-avatar" v-if="authStore.isLoggedIn">
            <i class="fa-solid fa-user"></i>
          </div>
          <i v-else class="fa-solid fa-circle-user user-icon"></i>
          <span class="user-name">{{ username }}</span>
          <i
            class="fa-solid fa-chevron-down user-arrow"
            :class="{ 'user-arrow--open': showLogoutMenu }"
          ></i>
        </button>

        <!-- 退出登录下拉菜单 -->
        <Transition name="dropdown">
          <div v-if="showLogoutMenu" class="dropdown-menu">
            <div class="dropdown-header">
              <div class="dropdown-avatar">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="dropdown-info">
                <p class="dropdown-name">{{ authStore.user?.name || '用户' }}</p>
                <p class="dropdown-role">{{ authStore.user?.role || '未登录' }}</p>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>退出登录</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useAuthStore } from '@/store'

  const emit = defineEmits<{
    (e: 'open-login'): void
  }>()

  const authStore = useAuthStore()

  const navItems = [
    { id: 1, text: '首页', name: 'home', icon: 'fa-solid fa-house' },
    { id: 2, text: '音乐', name: 'music', icon: 'fa-solid fa-music' },
    { id: 3, text: '博客', name: 'blog', icon: 'fa-solid fa-pen-fancy' },
    { id: 4, text: '知识', name: 'knowledge', icon: 'fa-solid fa-book' }
  ]

  const showLogoutMenu = ref(false)

  const username = computed(
    () => authStore.user?.name || localStorage.getItem('username') || '登陆'
  )

  const handleUserClick = () => {
    if (authStore.isLoggedIn) {
      showLogoutMenu.value = !showLogoutMenu.value
    } else {
      emit('open-login')
    }
  }

  const handleLogout = () => {
    authStore.logout()
    showLogoutMenu.value = false
  }

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-area')) {
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

<style scoped>
  /* ========== 导航栏容器 ========== */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    max-width: 100%;
    background: #0f172a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.3s ease;
  }

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* ========== Logo ========== */
  .logo-area {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #fff;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .logo-text {
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0;
    letter-spacing: 1px;
  }

  .logo-accent {
    color: #818cf8;
    font-weight: 300;
  }

  /* ========== 导航链接 ========== */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .nav-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    border-radius: 10px;
    text-decoration: none;
    color: #94a3b8;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.25s ease;
    overflow: hidden;
  }

  .nav-link-icon {
    font-size: 14px;
    transition: transform 0.25s ease;
  }

  .nav-link:hover {
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.06);
  }

  .nav-link:hover .nav-link-icon {
    transform: translateY(-1px);
  }

  .nav-link--active {
    color: #818cf8 !important;
    background: rgba(99, 102, 241, 0.1);
  }

  .nav-link--active .nav-link-icon {
    color: #818cf8;
  }

  .nav-link-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 20px;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 3px 3px 0 0;
    transition: transform 0.3s ease;
  }

  .nav-link--active .nav-link-indicator {
    transform: translateX(-50%) scaleX(1);
  }

  /* ========== 用户区域 ========== */
  .user-area {
    position: relative;
    flex-shrink: 0;
  }

  .user-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px 6px 6px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.04);
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.25s ease;
    font-size: 14px;
  }

  .user-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: #e2e8f0;
  }

  .user-btn--logged {
    border-color: rgba(99, 102, 241, 0.3);
    background: rgba(99, 102, 241, 0.08);
  }

  .user-btn--logged:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.12);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
  }

  .user-icon {
    font-size: 28px;
    color: #64748b;
  }

  .user-name {
    font-weight: 500;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-arrow {
    font-size: 10px;
    transition: transform 0.3s ease;
  }

  .user-arrow--open {
    transform: rotate(180deg);
  }

  /* ========== 下拉菜单 ========== */
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 220px;
    background: rgba(30, 41, 59, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    z-index: 10000;
  }

  .dropdown-header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .dropdown-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
  }

  .dropdown-info {
    flex: 1;
    min-width: 0;
  }

  .dropdown-name {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
  }

  .dropdown-role {
    margin: 2px 0 0;
    font-size: 12px;
    color: #64748b;
  }

  .dropdown-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 0;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 20px;
    border: none;
    background: none;
    color: #94a3b8;
    font-size: 14px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
  }

  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #e2e8f0;
  }

  .dropdown-item--danger {
    color: #f87171;
  }

  .dropdown-item--danger:hover {
    background: rgba(248, 113, 113, 0.08);
    color: #fca5a5;
  }

  /* ========== 过渡动画 ========== */
  .dropdown-enter-active {
    animation: dropdownIn 0.2s ease-out;
  }

  .dropdown-leave-active {
    animation: dropdownIn 0.15s ease-in reverse;
  }

  @keyframes dropdownIn {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* ========== 响应式 ========== */
  @media (max-width: 768px) {
    .navbar {
      width: 100%;
    }

    .navbar-inner {
      padding: 0 12px;
      height: 56px;
      max-width: 100%;
    }

    .nav-links {
      gap: 2px;
      flex-shrink: 1;
      min-width: 0;
      overflow: hidden;
    }

    .nav-link {
      padding: 6px 10px;
      font-size: 13px;
      white-space: nowrap;
    }

    .nav-link span {
      display: none;
    }

    .nav-link-icon {
      font-size: 16px;
    }

    .logo-area {
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 16px;
    }

    .logo-icon {
      width: 30px;
      height: 30px;
      font-size: 14px;
    }

    .user-btn {
      padding: 4px 10px 4px 4px;
      gap: 4px;
    }

    .user-avatar {
      width: 26px;
      height: 26px;
      font-size: 12px;
    }

    .user-name {
      display: none;
    }

    .user-arrow {
      display: none;
    }
  }
</style>
