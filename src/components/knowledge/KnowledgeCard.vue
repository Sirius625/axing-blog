<template>
  <div class="knowledge-card" @click="$emit('select', item)">
    <div class="card-header" :style="{ background: item.color }">
      <i :class="item.icon"></i>
      <span class="card-badge">{{ item.category }}</span>
    </div>
    <div class="card-body">
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </div>
    <div class="card-footer">
      <div class="tags">
        <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <span class="card-arrow"><i class="fas fa-arrow-right"></i></span>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    item: {
      id: number
      title: string
      description: string
      category: string
      icon: string
      color: string
      tags: string[]
    }
  }>()

  defineEmits<{
    select: [item: any]
  }>()
</script>

<style scoped>
  .knowledge-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .knowledge-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .card-header {
    padding: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    font-size: 1.25rem;
  }

  .card-badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    backdrop-filter: blur(4px);
  }

  .card-body {
    padding: 1.25rem;
  }

  .card-body h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    margin: 0 0 0.5rem;
  }

  .card-body p {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 0.35rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .card-arrow {
    color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
  }

  .knowledge-card:hover .card-arrow {
    color: rgba(255, 255, 255, 0.6);
    transform: translateX(4px);
  }
</style>
