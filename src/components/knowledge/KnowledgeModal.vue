<template>
  <transition name="modal-fade">
    <div v-if="item" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header" :style="{ background: item.color }">
          <div class="modal-header-content">
            <i :class="item.icon"></i>
            <div>
              <h2>{{ item.title }}</h2>
              <span class="modal-category">{{ item.category }}</span>
            </div>
          </div>
          <button class="modal-close" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-description">{{ item.description }}</p>
          <div class="modal-section">
            <h4><i class="fas fa-tags"></i> 相关标签</h4>
            <div class="tags">
              <span v-for="tag in item.tags" :key="tag" class="tag tag-lg">{{ tag }}</span>
            </div>
          </div>
          <div class="modal-section">
            <h4><i class="fas fa-list"></i> 核心知识点</h4>
            <ul class="knowledge-list">
              <li v-for="(point, index) in item.points" :key="index">
                <i class="fas fa-check-circle"></i>
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>
          <div class="modal-section">
            <h4><i class="fas fa-link"></i> 推荐资源</h4>
            <div class="resource-links">
              <a
                v-for="(res, index) in item.resources"
                :key="index"
                :href="res.url"
                target="_blank"
                class="resource-link"
              >
                <i :class="res.icon"></i>
                <span>{{ res.name }}</span>
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
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
      points: string[]
      resources: { name: string; url: string; icon: string }[]
    } | null
  }>()

  defineEmits<{
    close: []
  }>()
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
  }

  .modal-container {
    background: #ffffff;
    border-radius: 1rem;
    width: 100%;
    max-width: 560px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
  }

  .modal-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: white;
  }

  .modal-header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .modal-header-content i {
    font-size: 1.5rem;
  }

  .modal-header-content h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .modal-category {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-description {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #6b7280;
    margin: 0 0 1.5rem;
  }

  .modal-section {
    margin-bottom: 1.5rem;
  }

  .modal-section h4 {
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .modal-section h4 i {
    font-size: 0.75rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    background: #f3f4f6;
    border-radius: 0.35rem;
    color: #6b7280;
  }

  .tag-lg {
    font-size: 0.8rem;
    padding: 0.3rem 0.75rem;
  }

  .knowledge-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .knowledge-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
  }

  .knowledge-list li:last-child {
    border-bottom: none;
  }

  .knowledge-list li i {
    color: #4ade80;
    font-size: 0.85rem;
  }

  .resource-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .resource-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    color: #6b7280;
    text-decoration: none;
    transition: all 0.2s;
  }

  .resource-link:hover {
    background: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
  }

  .resource-link span {
    flex: 1;
    font-size: 0.85rem;
  }

  .resource-link .fa-external-link-alt {
    font-size: 0.7rem;
    opacity: 0.4;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }

  .modal-container::-webkit-scrollbar {
    width: 6px;
  }

  .modal-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-container::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .modal-container::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  @media (max-width: 768px) {
    .modal-container {
      max-height: 90vh;
      margin: 0.5rem;
    }
  }
</style>
