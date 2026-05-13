<template>
  <transition name="modal-fade">
    <div v-if="image" class="preview-overlay" @click.self="$emit('close')">
      <button class="preview-close" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      <div class="preview-content">
        <img :src="image.url" :alt="image.title" class="preview-image" />
        <div class="preview-info">
          <h2 class="preview-title">{{ image.title }}</h2>
          <p v-if="image.description" class="preview-desc">{{ image.description }}</p>
          <div class="preview-meta">
            <span><i class="fas fa-user"></i> {{ image.author }}</span>
            <span class="meta-likes"><i class="fas fa-heart"></i> {{ image.likes }}</span>
            <span><i class="fas fa-calendar"></i> {{ image.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
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
</script>

<style scoped>
.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
}

.preview-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  z-index: 20;
}

.preview-close:hover {
  color: white;
}

.preview-content {
  max-width: 64rem;
  width: 100%;
  max-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  max-height: 80vh;
  max-width: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.preview-info {
  margin-top: 1.5rem;
  text-align: center;
  color: white;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.preview-desc {
  color: #d1d5db;
  max-width: 48rem;
  margin: 0 auto 1rem;
}

.preview-meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 0.875rem;
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
</style>
