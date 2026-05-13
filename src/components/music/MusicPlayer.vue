<template>
  <div v-if="currentSong" class="player-bar">
    <div class="player-inner">
      <!-- 左侧歌曲信息 -->
      <div class="player-left">
        <img :src="currentSong.al?.picUrl || 'https://picsum.photos/50'" class="player-cover" />
        <div class="player-song-info">
          <p class="player-song-name">{{ currentSong.name }}</p>
          <p class="player-song-artist">{{ currentSong.ar?.[0]?.name || '未知' }}</p>
        </div>
        <button @click="$emit('toggleLike', currentSong)" class="like-btn"
          :class="{ liked: isLiked }">
          <i :class="isLiked ? 'fas' : 'far'" class="fa-heart"></i>
        </button>
      </div>

      <!-- 中间控制 -->
      <div class="player-center">
        <div class="player-controls">
          <button class="control-btn" @click="$emit('prev')">
            <i class="fas fa-step-backward"></i>
          </button>
          <button class="control-btn play-btn" @click="$emit('togglePlay')">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
          <button class="control-btn" @click="$emit('next')">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
        <div class="player-progress">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar" ref="progressRef" @click="seekTo">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
          </div>
          <span class="time">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 右侧音量控制 -->
      <div class="player-right">
        <button class="control-btn" @click="$emit('toggleLyrics')">
          <i class="fas fa-microphone-alt"></i>
        </button>
        <div class="volume-control">
          <button class="control-btn" @click="$emit('toggleMute')">
            <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
          </button>
          <div class="volume-bar" ref="volumeRef" @click="setVolume">
            <div class="volume-fill" :style="{ width: volume + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentSong: any
  isPlaying: boolean
  isLiked: boolean
  isMuted: boolean
  currentTime: number
  duration: number
  volume: number
}>()

const emit = defineEmits<{
  togglePlay: []
  prev: []
  next: []
  toggleLike: [song: any]
  toggleLyrics: []
  toggleMute: []
  seek: [time: number]
  setVolume: [volume: number]
}>()

const progressPercent = computed(() => {
  if (props.duration === 0) return 0
  return (props.currentTime / props.duration) * 100
})

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const seekTo = (e: MouseEvent) => {
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  emit('seek', percent * props.duration)
}

const setVolume = (e: MouseEvent) => {
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('setVolume', percent * 100)
}
</script>

<style scoped>
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background: rgba(26, 26, 46, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 50;
  padding: 0 1rem;
}

.player-inner {
  max-width: 80rem;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.player-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.player-cover {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  object-fit: cover;
}

.player-song-info {
  min-width: 0;
}

.player-song-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.player-song-artist {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.like-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.like-btn.liked {
  color: #ef4444;
}

.player-center {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  max-width: 500px;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  padding: 0.25rem;
}

.control-btn:hover {
  color: white;
}

.play-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.time {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  min-width: 2.5rem;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-bar:hover .progress-thumb {
  opacity: 1;
}

.player-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  justify-content: flex-end;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-bar {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  cursor: pointer;
}

.volume-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  transition: width 0.1s;
}
</style>
