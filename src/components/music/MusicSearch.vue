<template>
  <header class="search-header">
    <div class="flex items-center gap-4 flex-1 max-w-2xl relative">
      <div class="relative w-full group">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors"></i>
        <input
          ref="searchInputRef"
          v-model="query"
          @keyup.enter="$emit('search', query)"
          @focus="showHistory = true"
          @blur="handleBlur"
          type="text"
          placeholder="搜索音乐、歌手、歌词..."
          class="w-full pl-12 pr-10 py-2.5 bg-white/10 border border-white/10 rounded-full text-sm focus:bg-white/15 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 placeholder-white/30 text-white"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button v-if="query" @click="clearQuery" class="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
            <i class="fas fa-times-circle"></i>
          </button>
          <button @click="$emit('search', query)" class="w-7 h-7 flex items-center justify-center text-white/40 hover:text-purple-400 transition-colors" title="搜索">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- 搜索历史下拉框 -->
      <div v-if="showHistory && history.length > 0"
        class="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] rounded-xl shadow-xl border border-white/10 py-2 z-50 animate-fade-in-down">
        <div class="px-4 py-2 text-xs font-semibold text-white/40 flex justify-between items-center">
          <span>搜索历史</span>
          <button @click="$emit('clearHistory')" class="hover:text-purple-400 transition-colors">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <div class="max-h-60 overflow-y-auto custom-scrollbar">
          <div v-for="(item, index) in history" :key="index"
            @mousedown="selectHistory(item)"
            class="px-4 py-2.5 hover:bg-white/5 cursor-pointer flex items-center justify-between group transition-colors">
            <div class="flex items-center gap-3 text-sm text-white/70">
              <i class="fas fa-history text-white/30 group-hover:text-purple-400"></i>
              <span>{{ item }}</span>
            </div>
            <button @mousedown.stop="$emit('removeHistory', index)"
              class="text-white/30 hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/60">
        <i class="fas fa-cog"></i>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  history: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
  clearHistory: []
  removeHistory: [index: number]
}>()

const query = ref(props.modelValue)
const showHistory = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

const clearQuery = () => {
  query.value = ''
  emit('update:modelValue', '')
}

const handleBlur = () => {
  setTimeout(() => { showHistory.value = false }, 200)
}

const selectHistory = (item: string) => {
  query.value = item
  emit('update:modelValue', item)
  emit('search', item)
}
</script>

<style scoped>
.search-header {
  height: 4rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 10;
  position: sticky;
  top: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
