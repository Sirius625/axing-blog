<template>
  <div class="player-bar">
    <div class="player-progress-bar">
      <div class="progress-track" ref="progressRef" @click="seekTo">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
      </div>
    </div>
    <div class="player-inner">
      <!-- 左侧歌曲信息 -->
      <div class="player-left">
        <template v-if="currentSong">
          <div class="cover-wrapper">
            <img
              :src="currentSong.al?.picUrl || 'https://picsum.photos/50'"
              class="player-cover"
              :class="{ playing: isPlaying }"
            />
            <div class="cover-ring" :class="{ playing: isPlaying }"></div>
          </div>
          <div class="player-song-info">
            <p class="player-song-name">{{ currentSong.name }}</p>
            <p class="player-song-artist">{{ currentSong.ar?.[0]?.name || '-未知' }}</p>
          </div>
          <button
            @click="$emit('toggleLike', currentSong)"
            class="like-btn"
            :class="{ liked: isLiked }"
          >
            <i :class="isLiked ? 'fas' : 'far'" class="fa-heart"></i>
          </button>
        </template>
        <template v-else>
          <div class="player-empty-info">
            <div class="empty-icon-wrap">
              <i class="fas fa-music"></i>
            </div>
            <span class="empty-text">选择一首歌曲开始播放</span>
          </div>
        </template>
      </div>

      <!-- 中间控制 -->
      <div class="player-center">
        <div class="player-controls">
          <button class="control-btn skip-btn" @click="$emit('prev')" title="上一首">
            <i class="fas fa-step-backward"></i>
          </button>
          <button
            class="control-btn play-btn"
            @click="$emit('togglePlay')"
            :title="isPlaying ? '暂停' : '播放'"
          >
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
          <button class="control-btn skip-btn" @click="$emit('next')" title="下一首">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
        <div class="player-progress">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar desktop-progress" ref="progressRef2" @click="seekTo">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
          </div>
          <span class="time">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 右侧控制 -->
      <div class="player-right">
        <button class="control-btn lyric-btn" @click="$emit('toggleLyrics')" title="歌词">
          <i class="fas fa-microphone-alt"></i>
        </button>
        <div class="volume-control" :title="isMobile ? '切换静音' : '调节音量'">
          <button class="control-btn" @click="$emit('toggleMute')">
            <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
          </button>
          <div v-if="!isMobile" class="volume-bar" ref="volumeRef" @click="setVolume">
            <div class="volume-fill" :style="{ width: volume + '%' }"></div>
            <div class="volume-thumb" :style="{ left: volume + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'

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

  const progressRef = ref<HTMLElement | null>(null)
  const progressRef2 = ref<HTMLElement | null>(null)

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

  // 检测是否为移动端
  const isMobile = ref(false)
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
</script>

<style scoped>
  /* ========== 基础变量 ========== */
  :root {
    --player-bg: rgba(18, 18, 36, 0.95);
    --player-border: rgba(255, 255, 255, 0.08);
    --text-primary: rgba(255, 255, 255, 0.9);
    --text-secondary: rgba(255, 255, 255, 0.5);
    --accent-start: #a855f7;
    --accent-end: #ec4899;
    --control-color: rgba(255, 255, 255, 0.55);
    --control-hover: rgba(255, 255, 255, 0.9);
  }

  /* ========== 播放器容器 ========== */
  .player-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5.5rem;
    background: rgba(10, 8, 30, 0.98);
    border-top: 1px solid var(--player-border);
    z-index: 50;
    padding: 0 1.5rem;
    touch-action: none;
    overflow: visible;
  }

  /* ========== 顶部进度条 ========== */
  .player-progress-bar {
    position: absolute;
    top: -3px;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 2;
  }

  .progress-track {
    height: 100%;
    background: rgba(255, 255, 255, 0.06);
    cursor: pointer;
    position: relative;
    transition: height 0.15s;
  }

  .player-bar:hover .progress-track {
    height: 4px;
  }

  .progress-track .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    border-radius: 0 2px 2px 0;
    transition: width 0.1s linear;
    position: relative;
  }

  .progress-track .progress-thumb {
    display: none;
  }

  /* ========== 内层布局 ========== */
  .player-inner {
    max-width: 90rem;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  /* ========== 左侧 ========== */
  .player-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex: 1;
    min-width: 0;
  }

  .cover-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .player-cover {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    transition: all 0.4s ease;
  }

  .player-cover.playing {
    animation: spin 8s linear infinite;
    border-radius: 50%;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .cover-ring {
    display: none;
  }

  .player-song-info {
    min-width: 0;
    flex: 1;
  }

  .player-song-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    line-height: 1.3;
  }

  .player-song-artist {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin: 0;
    margin-top: 0.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
  }

  .like-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.35);
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.25s ease;
    flex-shrink: 0;
    padding: 0.3rem;
  }

  .like-btn:hover {
    color: rgba(255, 255, 255, 0.6);
    transform: scale(1.15);
  }

  .like-btn.liked {
    color: #f43f5e;
    text-shadow: 0 0 12px rgba(244, 63, 94, 0.5);
  }

  .like-btn.liked:hover {
    transform: scale(1.2);
  }

  .player-empty-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .empty-icon-wrap {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.2);
    font-size: 1.1rem;
  }

  .empty-text {
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.85rem;
  }

  /* ========== 中间控制 ========== */
  .player-center {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    max-width: 520px;
  }

  .player-controls {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .control-btn {
    background: none;
    border: none;
    color: var(--control-color);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    padding: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-btn:hover {
    color: var(--control-hover);
    transform: scale(1.1);
  }

  .skip-btn {
    font-size: 0.95rem;
  }

  .play-btn {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
    color: white;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(168, 85, 247, 0.35);
    transition: all 0.25s ease;
  }

  .play-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
  }

  .play-btn:active {
    transform: scale(0.95);
  }

  /* ========== 进度条 ========== */
  .player-progress {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
  }

  .time {
    font-size: 0.7rem;
    color: var(--text-secondary);
    min-width: 2.5rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    transition: height 0.15s;
  }

  .progress-bar:hover {
    height: 6px;
  }

  .progress-bar .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    border-radius: 3px;
    transition: width 0.1s linear;
    position: relative;
  }

  .progress-bar .progress-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition:
      opacity 0.2s,
      transform 0.15s;
  }

  .progress-bar:hover .progress-thumb {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  /* ========== 右侧 ========== */
  .player-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    justify-content: flex-end;
  }

  .lyric-btn {
    font-size: 1rem;
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .volume-bar {
    width: 80px;
    height: 4px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }

  .volume-bar:hover {
    height: 6px;
    background: rgba(255, 255, 255, 0.18);
  }

  .volume-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    border-radius: 3px;
    transition: width 0.1s;
  }

  .volume-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .volume-bar:hover .volume-thumb {
    opacity: 1;
  }

  /* ========== 移动端样式 ========== */
  @media (max-width: 768px) {
    .player-bar {
      height: 4.5rem;
      padding: 0 0.5rem;
      background: rgba(10, 8, 30, 0.97);
      border-top: 1px solid rgba(168, 85, 247, 0.15);
      box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.4);
    }

    .player-progress-bar {
      top: 0;
      height: 2px;
    }

    .progress-track {
      height: 2px;
      background: rgba(255, 255, 255, 0.05);
    }

    .player-bar:hover .progress-track {
      height: 2px;
    }

    .progress-track .progress-fill {
      border-radius: 0;
    }

    .player-inner {
      gap: 0;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
    }

    .player-left {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      min-width: 0;
      overflow: hidden;
    }

    .cover-wrapper {
      flex-shrink: 0;
    }

    .player-cover {
      width: 2rem;
      height: 2rem;
      border-radius: 0.4rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .player-cover.playing {
      animation: none;
      border-radius: 0.4rem;
    }

    .player-song-info {
      min-width: 0;
      flex: 1;
      overflow: hidden;
    }

    .player-song-name {
      max-width: 100%;
      font-size: 0.7rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
    }

    .player-song-artist {
      display: none;
    }

    .like-btn {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
      padding: 0.2rem;
    }

    .like-btn.liked {
      color: #f43f5e;
      text-shadow: 0 0 10px rgba(244, 63, 94, 0.5);
    }

    .player-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0 0.5rem;
    }

    .player-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.7rem;
    }

    .player-controls .control-btn {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.45);
      padding: 0.2rem;
    }

    .player-controls .control-btn:active {
      color: rgba(255, 255, 255, 0.85);
      transform: scale(0.9);
    }

    .player-controls .play-btn {
      width: 2.2rem;
      height: 2.2rem;
      font-size: 0.8rem;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      color: white;
      box-shadow: 0 3px 12px rgba(168, 85, 247, 0.35);
      border: none;
    }

    .player-controls .play-btn:active {
      transform: scale(0.92);
      box-shadow: 0 1px 6px rgba(168, 85, 247, 0.25);
    }

    .player-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0;
    }

    .player-right .control-btn {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.35);
      padding: 0.2rem;
    }

    .time {
      display: none;
    }

    .player-progress {
      display: flex;
      align-items: center;
      gap: 0;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0;
    }

    .player-progress .progress-bar {
      height: 3px;
      border-radius: 0;
      background: rgba(255, 255, 255, 0.35);
    }

    .player-progress .progress-bar:hover {
      height: 3px;
    }

    .player-progress .progress-fill {
      border-radius: 0;
      background: linear-gradient(90deg, #a855f7, #ec4899);
    }

    .player-progress .progress-thumb {
      display: none;
    }

    .volume-control .control-btn {
      font-size: 0.85rem;
    }
  }
</style>
