<template>
  <headerNav @open-login="showLoginModal = true"></headerNav>
  <main
    class="workspace"
    :style="{
      paddingBottom: playerStore.currentSong ? (isMusicPage ? '4rem' : '3rem') : '0'
    }"
  >
    <KeepAlive>
      <router-view />
    </KeepAlive>
  </main>
  <loginModel
    :modelValue="showLoginModal"
    @update:modelValue="showLoginModal = $event"
    @login-success="handleLoginSuccess"
  ></loginModel>

  <!-- 全局音乐播放器 -->
  <MusicPlayer
    v-if="playerStore.currentSong"
    :currentSong="playerStore.currentSong"
    :isPlaying="playerStore.isPlaying"
    :isLiked="false"
    :isMuted="playerStore.volume === 0"
    :currentTime="playerStore.currentTime"
    :duration="playerStore.duration"
    :volume="playerStore.volume * 100"
    :mini="!isMusicPage"
    @togglePlay="playerStore.togglePlay"
    @prev="playerStore.prevSong"
    @next="playerStore.nextSong"
    @toggleLike="() => {}"
    @toggleLyrics="playerStore.toggleLyricModal"
    @toggleMute="playerStore.toggleMute"
    @seek="playerStore.seekTo"
    @setVolume="playerStore.setVolume"
  />

  <!-- 全局歌词模态框 -->
  <LyricModal
    :visible="playerStore.showLyricModal"
    :song="playerStore.currentSong"
    :lyrics="playerStore.lyrics"
    :currentTime="playerStore.currentTime"
    @close="playerStore.showLyricModal = false"
  />

  <!-- 全局消息弹窗 -->
  <MessageModal ref="messageModalRef" />
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick, defineAsyncComponent } from 'vue'
  import { useRoute } from 'vue-router'
  import headerNav from './components/header-nav.vue'
  import loginModel from './components/loginModel.vue'
  import MessageModal from './components/MessageModal.vue'
  import { usePlayerStore } from './store/player'
  import { setMessageInstance } from './composables/useMessage'

  // 非首屏必需组件 - 动态导入
  const MusicPlayer = defineAsyncComponent(() => import('./components/music/MusicPlayer.vue'))
  const LyricModal = defineAsyncComponent(() => import('./components/music/LyricModal.vue'))

  const route = useRoute()
  const playerStore = usePlayerStore()

  const showLoginModal = ref(false)

  // 非音乐页面时显示迷你播放器
  const isMusicPage = computed(() => route.path === '/music')

  const handleLoginSuccess = () => {
    showLoginModal.value = false
  }

  // 监听 token 过期事件，自动弹出登录弹窗
  const handleTokenExpired = () => {
    showLoginModal.value = true
  }

  let cleanupAudio: (() => void) | null = null

  const messageModalRef = ref<InstanceType<typeof MessageModal> | null>(null)

  onMounted(() => {
    window.addEventListener('token-expired', handleTokenExpired)
    // 初始化全局音频监听
    cleanupAudio = playerStore.initAudioListeners()
    // 注册全局消息实例
    if (messageModalRef.value) {
      setMessageInstance(messageModalRef.value)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('token-expired', handleTokenExpired)
    if (cleanupAudio) cleanupAudio()
  })
</script>

<style>
  .workspace {
    padding-top: 64px;
    min-height: 100vh;
    box-sizing: border-box;
  }

  /* 桌面端：页面内容居中，两边留空 */
  @media (min-width: 769px) {
    .workspace {
      padding-left: max(calc((100vw - 1200px) / 2), 2rem);
      padding-right: max(calc((100vw - 1200px) / 2), 2rem);
    }
  }

  @media (max-width: 768px) {
    .workspace {
      padding-top: 56px;
    }
  }
</style>
