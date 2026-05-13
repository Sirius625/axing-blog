<template>
  <div class="playlist-card" @click="$emit('select', playlist)">
    <div class="card-image-wrapper">
      <img :src="playlist.coverImgUrl || playlist.picUrl" :alt="playlist.name" class="card-image" loading="lazy" />
      <div class="card-overlay">
        <i class="fas fa-play-circle play-icon"></i>
      </div>
      <div class="play-count">
        <i class="fas fa-headphones"></i>
        {{ formatCount(playlist.playCount || 0) }}
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ playlist.name }}</h3>
      <p class="card-desc">{{ playlist.description || playlist.copywriter || '' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  playlist: any
}>()

defineEmits<{
  select: [playlist: any]
}>()

const formatCount = (count: number) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}
</script>

<style scoped>
.playlist-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.playlist-card:hover .card-image {
  transform: scale(1.08);
}

.playlist-card:hover .card-overlay {
  opacity: 1;
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  aspect-ratio: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.play-icon {
  font-size: 3rem;
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
}

.play-count {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-info {
  padding: 0.75rem 0;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
