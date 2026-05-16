<template>
  <transition name="modal-fade">
    <div
      v-if="image"
      class="preview-overlay"
      @wheel.prevent="handleWheel"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @touchstart="startTouch"
      @touchmove="onTouch"
      @touchend="endTouch"
    >
      <!-- 顶部工具栏 -->
      <div class="preview-toolbar">
        <button class="toolbar-btn" @click="zoomIn" title="放大">
          <i class="fas fa-search-plus"></i>
        </button>
        <button class="toolbar-btn" @click="zoomOut" title="缩小">
          <i class="fas fa-search-minus"></i>
        </button>
        <button class="toolbar-btn" @click="resetZoom" title="重置">
          <i class="fas fa-expand"></i>
        </button>
        <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
        <button class="toolbar-btn close-btn" @click="$emit('close')" title="关闭">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- 图片容器 -->
      <div class="preview-content" ref="containerRef">
        <img
          :src="image.url"
          :alt="image.title"
          class="preview-image"
          :style="{
            transform: `translate(${posX}px, ${posY}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }"
          draggable="false"
          @load="imageLoaded = true"
        />
      </div>

      <!-- 底部信息 -->
      <div class="preview-info" v-if="!isDragging">
        <h2 class="preview-title">{{ image.title }}</h2>
        <p v-if="image.description" class="preview-desc">{{ image.description }}</p>
        <div class="preview-meta">
          <span><i class="fas fa-user"></i> {{ image.author }}</span>
          <span class="meta-likes"><i class="fas fa-heart"></i> {{ image.likes }}</span>
          <span><i class="fas fa-calendar"></i> {{ image.date }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{
    image: {
      id: number
      url: string
      title: string
      description: string
      author: string
      likes: number
      date: string
    } | null
  }>()

  defineEmits<{
    close: []
  }>()

  const scale = ref(1)
  const posX = ref(0)
  const posY = ref(0)
  const isDragging = ref(false)
  const dragStartX = ref(0)
  const dragStartY = ref(0)
  const dragStartPosX = ref(0)
  const dragStartPosY = ref(0)
  const imageLoaded = ref(false)
  const containerRef = ref<HTMLElement | null>(null)

  // 触摸相关
  let lastTouchDist = 0
  let lastTouchCenter = { x: 0, y: 0 }

  const MIN_SCALE = 0.5
  const MAX_SCALE = 5

  const zoomIn = () => {
    scale.value = Math.min(scale.value * 1.3, MAX_SCALE)
  }

  const zoomOut = () => {
    scale.value = Math.max(scale.value / 1.3, MIN_SCALE)
  }

  const resetZoom = () => {
    scale.value = 1
    posX.value = 0
    posY.value = 0
  }

  const handleWheel = (e: WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(scale.value * delta, MIN_SCALE), MAX_SCALE)

    // 以鼠标位置为中心缩放
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      const mouseX = e.clientX - rect.left - rect.width / 2
      const mouseY = e.clientY - rect.top - rect.height / 2
      posX.value = mouseX - (mouseX - posX.value) * (newScale / scale.value)
      posY.value = mouseY - (mouseY - posY.value) * (newScale / scale.value)
    }

    scale.value = newScale
  }

  // 鼠标拖拽
  const startDrag = (e: MouseEvent) => {
    if (scale.value <= 1) return
    isDragging.value = true
    dragStartX.value = e.clientX
    dragStartY.value = e.clientY
    dragStartPosX.value = posX.value
    dragStartPosY.value = posY.value
  }

  const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return
    posX.value = dragStartPosX.value + (e.clientX - dragStartX.value)
    posY.value = dragStartPosY.value + (e.clientY - dragStartY.value)
  }

  const endDrag = () => {
    isDragging.value = false
  }

  // 触摸支持
  const startTouch = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      if (scale.value <= 1) return
      isDragging.value = true
      dragStartX.value = e.touches[0].clientX
      dragStartY.value = e.touches[0].clientY
      dragStartPosX.value = posX.value
      dragStartPosY.value = posY.value
    } else if (e.touches.length === 2) {
      // 双指缩放
      const t1 = e.touches[0]
      const t2 = e.touches[1]
      lastTouchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
      lastTouchCenter = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
      }
    }
  }

  const onTouch = (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1 && isDragging.value) {
      posX.value = dragStartPosX.value + (e.touches[0].clientX - dragStartX.value)
      posY.value = dragStartPosY.value + (e.touches[0].clientY - dragStartY.value)
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0]
      const t2 = e.touches[1]
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
      if (lastTouchDist > 0) {
        const delta = dist / lastTouchDist
        const newScale = Math.min(Math.max(scale.value * delta, MIN_SCALE), MAX_SCALE)
        scale.value = newScale
      }
      lastTouchDist = dist
    }
  }

  const endTouch = () => {
    isDragging.value = false
    lastTouchDist = 0
  }

  // 切换图片时重置
  watch(
    () => props.image,
    () => {
      scale.value = 1
      posX.value = 0
      posY.value = 0
      imageLoaded.value = false
    }
  )
</script>

<style scoped>
  .preview-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(8px);
    user-select: none;
    -webkit-user-select: none;
  }

  /* 顶部工具栏 */
  .preview-toolbar {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 20;
  }

  .toolbar-btn {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .toolbar-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .close-btn {
    margin-left: 0.5rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .close-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }

  .zoom-level {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
    min-width: 3rem;
    text-align: center;
    font-family: monospace;
  }

  /* 图片容器 */
  .preview-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .preview-image {
    max-height: 85vh;
    max-width: 100%;
    object-fit: contain;
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    transition: transform 0.05s linear;
    will-change: transform;
    touch-action: none;
  }

  /* 底部信息 */
  .preview-info {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: white;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    padding: 1rem 2rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 90%;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .preview-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .preview-desc {
    color: #d1d5db;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .preview-meta {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    font-size: 0.8rem;
    color: #9ca3af;
  }

  .meta-likes {
    color: #f87171;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .preview-overlay {
      padding: 0.5rem;
    }

    .preview-toolbar {
      top: 0.5rem;
      padding: 0.3rem 0.4rem;
      gap: 0.2rem;
    }

    .toolbar-btn {
      width: 1.75rem;
      height: 1.75rem;
      font-size: 0.75rem;
    }

    .zoom-level {
      font-size: 0.65rem;
      min-width: 2rem;
    }

    .preview-content {
      padding-bottom: 0;
    }

    .preview-image {
      max-height: 70vh;
    }

    .preview-info {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      width: 100%;
      max-width: 100%;
      margin-top: 0.5rem;
      padding: 0.6rem 0.75rem;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      pointer-events: auto;
    }

    .preview-title {
      font-size: 0.9rem;
      margin-bottom: 0.15rem;
    }

    .preview-desc {
      font-size: 0.75rem;
      margin-bottom: 0.3rem;
    }

    .preview-meta {
      gap: 0.75rem;
      font-size: 0.7rem;
      flex-wrap: wrap;
    }
  }
</style>
