<template>
  <div class="video-card" @click="handleClick">
    <div class="video-thumbnail">
      <div class="thumbnail-placeholder">
        <i class="fas fa-video"></i>
      </div>
      <video
        :src="video.url"
        class="thumbnail-video"
        preload="metadata"
        muted
        playsinline
        @mouseenter="playPreview"
        @mouseleave="stopPreview"
        ref="videoRef"
      ></video>
      <div class="play-overlay">
        <i class="fas fa-play"></i>
      </div>
      <div class="video-duration" v-if="video.duration > 0">
        {{ formatDuration(video.duration) }}
      </div>
    </div>
    <div class="video-info">
      <h3 class="video-title">{{ video.title }}</h3>
      <p class="video-description" v-if="video.description">{{ video.description }}</p>
      <div class="video-meta">
        <span class="author"> <i class="fas fa-user"></i> {{ video.author }} </span>
        <span class="date"> <i class="fas fa-calendar"></i> {{ video.date }} </span>
        <span class="visibility" :class="{ public: video.isPublic, private: !video.isPublic }">
          <i :class="video.isPublic ? 'fas fa-globe' : 'fas fa-lock'"></i>
          {{ video.isPublic ? '公开' : '私密' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps<{
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
    play: [video: typeof props.video]
  }>()

  const videoRef = ref<HTMLVideoElement | null>(null)
  let previewTimer: ReturnType<typeof setTimeout> | null = null

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const playPreview = () => {
    if (videoRef.value) {
      videoRef.value.currentTime = 0
      videoRef.value.play().catch(() => {})
    }
  }

  const stopPreview = () => {
    if (videoRef.value) {
      videoRef.value.pause()
      videoRef.value.currentTime = 0
    }
  }

  const handleClick = () => {
    emit('play', props.video)
  }
</script>

<style scoped>
  .video-card {
    background-color: var(--card-bg);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
  }

  .video-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }

  .video-thumbnail {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: #000;
    overflow: hidden;
  }

  .thumbnail-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    z-index: 1;
    pointer-events: none;
  }

  .thumbnail-placeholder i {
    font-size: 3.5rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .thumbnail-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    position: relative;
    z-index: 2;
  }

  .video-card:hover .thumbnail-video {
    transform: scale(1.05);
  }

  .play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .video-card:hover .play-overlay {
    opacity: 1;
  }

  .play-overlay i {
    font-size: 3rem;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .video-duration {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 0.15rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .video-info {
    padding: 0.75rem;
  }

  .video-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .video-description {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0 0 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .video-meta {
    display: flex;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: #9ca3af;
    flex-wrap: wrap;
  }

  .video-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .video-meta i {
    font-size: 0.7rem;
  }

  .visibility.public {
    color: #4ade80;
  }

  .visibility.private {
    color: #f59e0b;
  }
</style>
