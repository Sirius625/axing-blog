<template>
  <transition name="modal-fade">
    <div v-if="visible" class="lyric-overlay" @click.self="$emit('close')">
      <div class="lyric-container">
        <button class="lyric-close" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
        <div class="lyric-content">
          <div class="lyric-header">
            <img :src="song?.al?.picUrl || 'https://picsum.photos/200?random=' + song?.id" class="lyric-cover" />
            <div>
              <h2 class="lyric-title">{{ song?.name }}</h2>
              <p class="lyric-artist">{{ song?.ar?.[0]?.name || '未知' }}</p>
            </div>
          </div>
          <div class="lyric-scroll" ref="lyricScrollRef">
            <div v-if="lyrics.length === 0" class="lyric-empty">
              <i class="fas fa-music"></i>
              <p>暂无歌词</p>
            </div>
            <div v-else class="lyric-lines">
              <p v-for="(line, index) in lyrics" :key="index"
                :class="['lyric-line', { active: currentLineIndex === index }]">
                {{ line.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  visible: boolean
  song: any
  lyrics: { time: number; text: string }[]
  currentTime: number
}>()

defineEmits<{
  close: []
}>()

const lyricScrollRef = ref<HTMLElement | null>(null)

const currentLineIndex = ref(0)

const updateCurrentLine = (time: number) => {
  if (!props.lyrics.length) return
  let index = props.lyrics.findIndex((line, i) => {
    const nextLine = props.lyrics[i + 1]
    return time >= line.time && (!nextLine || time < nextLine.time)
  })
  if (index === -1) index = props.lyrics.length - 1
  currentLineIndex.value = index

  nextTick(() => {
    if (lyricScrollRef.value) {
      const activeEl = lyricScrollRef.value.querySelector('.lyric-line.active')
      activeEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

watch(() => props.currentTime, (time) => {
  updateCurrentLine(time)
})

watch(() => props.lyrics, () => {
  if (props.currentTime > 0) {
    updateCurrentLine(props.currentTime)
  }
})
</script>

<style scoped>
.lyric-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  padding: 1rem;
}

.lyric-container {
  width: 100%;
  max-width: 32rem;
  max-height: 80vh;
  background: rgba(26, 26, 46, 0.95);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.lyric-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}

.lyric-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lyric-content {
  padding: 2rem;
}

.lyric-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.lyric-cover {
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  object-fit: cover;
}

.lyric-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.lyric-artist {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0.25rem 0 0;
}

.lyric-scroll {
  max-height: 50vh;
  overflow-y: auto;
  padding: 1rem 0;
}

.lyric-empty {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.3);
}

.lyric-empty i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.lyric-lines {
  text-align: center;
}

.lyric-line {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  padding: 0.75rem 0;
  margin: 0;
  transition: all 0.3s ease;
  cursor: default;
}

.lyric-line.active {
  color: #a855f7;
  font-size: 1.15rem;
  font-weight: 600;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
