<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  >
    <table class="w-full text-left">
      <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
        <tr>
          <th class="px-6 py-3 font-medium w-12">#</th>
          <th class="px-6 py-3 font-medium">歌曲</th>
          <th class="px-6 py-3 font-medium hidden sm:table-cell">歌手</th>
          <th class="px-6 py-3 font-medium hidden md:table-cell">专辑</th>
          <th class="px-6 py-3 font-medium text-right">操作</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="(song, index) in songs"
          :key="song.id"
          class="hover:bg-gray-50 transition-colors group"
        >
          <td class="px-6 py-4 text-gray-400 text-sm">{{ startIndex + index + 1 }}</td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <img
                :src="song.al?.picUrl || 'https://picsum.photos/50?random=' + song.id"
                class="w-10 h-10 rounded object-cover"
              />
              <div>
                <div
                  class="text-sm font-bold text-gray-800 group-hover:text-purple-600 cursor-pointer"
                  @click="$emit('play', song, startIndex + index)"
                >
                  {{ song.name }}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
            {{ song.ar?.[0]?.name || '未知' }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell truncate max-w-[150px]">
            {{ song.al?.name || '未知' }}
          </td>
          <td class="px-6 py-4 text-right">
            <button
              @click="$emit('toggleLike', song)"
              class="transition-colors"
              :class="isLiked(song.id) ? 'text-red-400' : 'text-gray-400 hover:text-red-400'"
            >
              <i :class="isLiked(song.id) ? 'fas' : 'far'" class="fa-heart"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    songs: any[]
    startIndex?: number
    isLiked: (id: number) => boolean
  }>()

  const startIndex = props.startIndex ?? 0

  defineEmits<{
    play: [song: any, index: number]
    toggleLike: [song: any]
  }>()
</script>
