<template>
  <aside class="sidebar">
    <div class="p-6 flex items-center gap-3 cursor-pointer" @click="$emit('switchTab', 'recommend')">
      <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
        <i class="fas fa-music"></i>
      </div>
      <h1 class="text-xl font-bold tracking-tight text-white">Music</h1>
    </div>

    <nav class="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
      <div class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 mt-4 px-2">发现音乐</div>
      <a href="#" @click.prevent="$emit('switchTab', 'recommend')"
        :class="{ 'bg-purple-500/20 text-purple-300': activeTab === 'recommend', 'text-white/60 hover:bg-white/10': activeTab !== 'recommend' }"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
        <i class="fas fa-compass w-5 text-center group-hover:scale-110 transition-transform"></i>
        <span class="font-medium">推荐歌单</span>
      </a>
      <a href="#" @click.prevent="$emit('switchTab', 'toplist')"
        :class="{ 'bg-purple-500/20 text-purple-300': activeTab === 'toplist', 'text-white/60 hover:bg-white/10': activeTab !== 'toplist' }"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
        <i class="fas fa-trophy w-5 text-center group-hover:scale-110 transition-transform"></i>
        <span class="font-medium">排行榜</span>
      </a>

      <div class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 mt-6 px-2">我的音乐</div>
      <a href="#" @click.prevent="$emit('switchTab', 'likes')"
        :class="{ 'bg-purple-500/20 text-purple-300': activeTab === 'likes', 'text-white/60 hover:bg-white/10': activeTab !== 'likes' }"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
        <i class="fas fa-heart w-5 text-center text-red-400"></i>
        <span class="font-medium">我喜欢的</span>
        <span v-if="likedCount > 0" class="ml-auto text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">{{ likedCount }}</span>
      </a>
      <a href="#" @click.prevent="$emit('switchTab', 'history')"
        :class="{ 'bg-purple-500/20 text-purple-300': activeTab === 'history', 'text-white/60 hover:bg-white/10': activeTab !== 'history' }"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
        <i class="fas fa-history w-5 text-center"></i>
        <span class="font-medium">最近播放</span>
      </a>
    </nav>

    <div class="p-4 border-t border-white/10">
      <div class="bg-white/5 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
        <img src="https://picsum.photos/100/100?random=user" alt="用户头像"
          class="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-sm">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-white/80 truncate">Music Lover</p>
          <p class="text-xs text-white/40 truncate">VIP 会员</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: string
  likedCount: number
}>()

defineEmits<{
  switchTab: [tab: string]
}>()
</script>

<style scoped>
.sidebar {
  width: 16rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
</style>
