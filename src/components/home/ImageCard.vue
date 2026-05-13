<template>
  <div class="image-card" @click="$emit('preview', image)">
    <div class="image-wrapper">
      <img :src="image.url" :alt="image.title" class="card-image" loading="lazy" />
      <div class="image-overlay">
        <div class="overlay-content">
          <p class="overlay-title">{{ image.title }}</p>
          <p class="overlay-author">{{ image.author }}</p>
        </div>
      </div>
      <div class="like-badge">
        <i class="fas fa-heart"></i>
        <span>{{ image.likes }}</span>
      </div>
    </div>
    <div class="card-info">
      <div class="info-header">
        <span class="info-title">{{ image.title }}</span>
        <span class="info-date">{{ image.date }}</span>
      </div>
      <p class="info-desc">{{ image.description }}</p>
    </div>
  </div>
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
  }
}>()

defineEmits<{
  preview: [image: any]
}>()
</script>

<style scoped>
.image-card {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.image-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.image-card:hover .card-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  color: white;
  transform: translateY(1rem);
  transition: transform 0.3s ease;
}

.image-card:hover .overlay-content {
  transform: translateY(0);
}

.overlay-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.overlay-author {
  font-size: 0.75rem;
  color: #e5e7eb;
  margin-top: 0.25rem;
}

.like-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  box-shadow: var(--shadow-sm);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.like-badge i {
  color: #ef4444;
  margin-right: 0.25rem;
}

.image-card:hover .like-badge {
  opacity: 1;
}

.card-info {
  padding: 1rem;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.info-title {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.info-date {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  margin-left: 0.5rem;
}

.info-desc {
  font-size: 0.875rem;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
