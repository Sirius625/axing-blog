<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ video.title }}</h2>
          <button class="close-btn" @click="close">&times;</button>
        </div>
        <div class="modal-body">
          <video :src="video.url" class="video-player" controls autoplay ref="videoRef"></video>
          <div class="video-details">
            <p class="description" v-if="video.description">{{ video.description }}</p>
            <div class="meta">
              <span><i class="fas fa-user"></i> {{ video.author }}</span>
              <span><i class="fas fa-calendar"></i> {{ video.date }}</span>
              <span :class="video.isPublic ? 'public' : 'private'">
                <i :class="video.isPublic ? 'fas fa-globe' : 'fas fa-lock'"></i>
                {{ video.isPublic ? '公开' : '私密' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{
    visible: boolean
    video: {
      id: number
      url: string
      title: string
      description: string
      author: string
      date: string
      isPublic: boolean
      duration: number
      fileSize: number
    }
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  const videoRef = ref<HTMLVideoElement | null>(null)

  const close = () => {
    if (videoRef.value) {
      videoRef.value.pause()
    }
    emit('close')
  }

  watch(
    () => props.visible,
    (val) => {
      if (!val && videoRef.value) {
        videoRef.value.pause()
      }
    }
  )
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease;
    padding: 1rem;
  }

  .modal-container {
    background: white;
    width: 90%;
    max-width: 800px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    animation: slideUp 0.3s ease;
  }

  .modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    padding: 0.25rem;
    line-height: 1;
  }

  .close-btn:hover {
    color: #333;
  }

  .modal-body {
    padding: 0;
  }

  .video-player {
    width: 100%;
    max-height: 70vh;
    background: #000;
    display: block;
  }

  .video-details {
    padding: 1rem 1.5rem;
  }

  .description {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 0.75rem;
    line-height: 1.5;
  }

  .meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #999;
  }

  .meta span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .meta i {
    font-size: 0.75rem;
  }

  .public {
    color: #4ade80;
  }

  .private {
    color: #f59e0b;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
