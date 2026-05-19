<template>
  <div class="filter-bar">
    <div class="search-box">
      <i class="fas fa-search"></i>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索知识点..."
        class="search-input"
        @input="onSearch"
      />
    </div>
    <div class="category-tabs">
      <button
        :class="['tab-btn', { active: activeCategory === 'all' }]"
        @click="selectCategory('all')"
      >
        <i class="fas fa-th-large"></i>
        <span>全部</span>
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="['tab-btn', { active: activeCategory === cat.id }]"
        @click="selectCategory(cat.id)"
      >
        <i :class="cat.icon"></i>
        <span>{{ cat.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{
    modelValue: string
    activeCategory: string
    categories: { id: string; name: string; icon: string }[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    'update:activeCategory': [value: string]
  }>()

  const searchQuery = ref(props.modelValue)

  watch(
    () => props.modelValue,
    (val) => {
      searchQuery.value = val
    }
  )

  const onSearch = () => {
    emit('update:modelValue', searchQuery.value)
  }

  const selectCategory = (id: string) => {
    emit('update:activeCategory', id)
  }
</script>

<style scoped>
  .filter-bar {
    padding: 1.5rem 2rem;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
  }

  .search-box {
    position: relative;
    max-width: 400px;
    margin-bottom: 1rem;
  }

  .search-box i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.75rem;
    color: #374151;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s;
    box-sizing: border-box;
  }

  .search-input:focus {
    border-color: rgba(99, 102, 241, 0.5);
    background: #ffffff;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 2rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.78rem;
  }

  .tab-btn:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  @media (max-width: 768px) {
    .filter-bar {
      padding: 0.75rem;
    }
  }
</style>
