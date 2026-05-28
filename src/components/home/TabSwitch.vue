<template>
  <div class="tab-bar">
    <button
      :class="['tab-btn', { active: activeTab === 'videos' }]"
      @click="handleSwitch('videos')"
    >
      <i
        :class="['tab-icon', { 'icon-animate': animatingTab === 'videos' }]"
        class="fas fa-video"
      ></i>
      <span>视频</span>
    </button>
    <button
      :class="['tab-btn', { active: activeTab === 'images' }]"
      @click="handleSwitch('images')"
    >
      <i
        :class="['tab-icon', { 'icon-animate': animatingTab === 'images' }]"
        class="fas fa-images"
      ></i>
      <span>图片</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps<{
    activeTab: string
  }>()

  const emit = defineEmits<{
    'update:activeTab': [value: 'images' | 'videos']
  }>()

  const animatingTab = ref<string | null>(null)

  const handleSwitch = (tab: 'images' | 'videos') => {
    if (tab === props.activeTab) return
    animatingTab.value = tab
    emit('update:activeTab', tab)
    setTimeout(() => {
      animatingTab.value = null
    }, 500)
  }
</script>

<style scoped>
  .tab-bar {
    display: flex;
    gap: 0.25rem;
    position: relative;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.9rem;
    border: 1px solid var(--border-color);
    border-radius: 0.4rem;
    background-color: rgba(255, 255, 255, 0.05);
    color: #9ca3af;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    position: relative;
    overflow: hidden;
  }

  .tab-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, #667eea, #764ba2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tab-btn:hover {
    color: var(--text-color);
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  .tab-btn:active {
    transform: translateY(0) scale(0.97);
  }

  .tab-btn.active {
    color: #fff;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-color: transparent;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
  }

  .tab-btn.active::before {
    opacity: 1;
  }

  .tab-icon {
    font-size: 0.8rem;
    transition: transform 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .tab-btn.active .tab-icon {
    animation: icon-bounce 0.5s ease;
  }

  .tab-btn:not(.active) .tab-icon.icon-animate {
    animation: icon-spin 0.5s ease;
  }

  .tab-btn span {
    position: relative;
    z-index: 1;
  }

  @keyframes icon-bounce {
    0% {
      transform: scale(1) rotate(0deg);
    }

    25% {
      transform: scale(1.3) rotate(-10deg);
    }

    50% {
      transform: scale(1.3) rotate(10deg);
    }

    75% {
      transform: scale(1.1) rotate(-5deg);
    }

    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes icon-spin {
    0% {
      transform: rotate(0deg) scale(1);
    }

    50% {
      transform: rotate(180deg) scale(1.2);
    }

    100% {
      transform: rotate(360deg) scale(1);
    }
  }

  @media (max-width: 768px) {
    .tab-btn {
      padding: 0.3rem 0.6rem;
      font-size: 0.75rem;
    }

    .tab-btn span {
      display: none;
    }
  }
</style>
