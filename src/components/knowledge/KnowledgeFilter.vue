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
        v-for="cat in categories"
        :key="cat.id"
        :class="['tab-btn', { active: activeCategory === cat.id }]"
        @click="selectCategory(cat.id)"
      >
        <i :class="cat.icon"></i>
        <span>{{ cat.name }}</span>
      </button>
      <button
        :class="['tab-btn', { active: activeCategory === 'all' }]"
        @click="selectCategory('all')"
      >
        <i class="fas fa-th-large"></i>
        <span>全部</span>
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
    color: rgba(255, 255, 255, 0.3);
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: white;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s;
  }

  .search-input:focus {
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.1);
  }

  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 2rem;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.85rem;
  }

  .tab-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 768px) {
    .filter-bar {
      padding: 1rem;
    }
  }
</style>
