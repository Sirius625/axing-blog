<template>
    <div
        class="flex h-screen text-gray-200 font-sans overflow-hidden selection:bg-purple-500 selection:text-white pt-16"
        style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);">
        <img src="https://gips2.baidu.com/it/u=641660390,3943119249&fm=3074&app=3074&f=PNG?w=2560&h=1440"
            alt="Background" class="ken-burns-img" loading="lazy">

        <!-- 移动端底部导航 Tab -->
        <div class="fixed bottom-20 left-0 right-0 z-40 flex md:hidden bg-[#1a1a2e]/95 backdrop-blur-xl border-t border-white/10">
            <button v-for="tab in mobileTabs" :key="tab.id" @click="switchTab(tab.id)"
                :class="activeTab === tab.id ? 'text-purple-400 bg-purple-500/10' : 'text-white/50'"
                class="flex-1 flex flex-col items-center py-2 text-xs transition-colors">
                <i :class="tab.icon" class="text-lg mb-0.5"></i>
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- 侧边栏 -->
        <aside
            class="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex-col hidden md:flex z-20 shadow-sm transition-all duration-300">
            <div class="p-6 flex items-center gap-3 cursor-pointer" @click="switchTab('recommend')">
                <div
                    class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                    <i class="fas fa-music"></i>
                </div>
                <h1 class="text-xl font-bold tracking-tight text-white">Music</h1>
            </div>

            <nav class="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 mt-4 px-2">发现音乐</div>
                <a href="#" @click.prevent="switchTab('recommend')"
                    :class="{ 'bg-purple-500/20 text-purple-300': activeTab === 'recommend', 'text-white/60 hover:bg-white/10': activeTab !== 'recommend' }"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
                    <i class="fas fa-compass w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span class="font-medium">推荐歌单</span>
                </a>
                <a href="#" @click.prevent="switchTab('toplist')"
                    :class="{ 'bg-purple-500/20 text-purple-300': activeTab === 'toplist', 'text-white/60 hover:bg-white/10': activeTab !== 'toplist' }"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
                    <i class="fas fa-trophy w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span class="font-medium">排行榜</span>
                </a>

                <div class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 mt-6 px-2">我的音乐</div>
                <a href="#" @click.prevent="switchTab('likes')"
                    :class="{ 'bg-purple-500/20 text-purple-300': activeTab === 'likes', 'text-white/60 hover:bg-white/10': activeTab !== 'likes' }"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
                    <i class="fas fa-heart w-5 text-center text-red-400"></i>
                    <span class="font-medium">我喜欢的</span>
                    <span v-if="likedSongs.length > 0"
                        class="ml-auto text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">{{ likedSongs.length
                        }}</span>
                </a>
                <a href="#" @click.prevent="switchTab('history')"
                    :class="{ 'bg-purple-500/20 text-purple-300': activeTab === 'history', 'text-white/60 hover:bg-white/10': activeTab !== 'history' }"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group">
                    <i class="fas fa-history w-5 text-center"></i>
                    <span class="font-medium">最近播放</span>
                </a>
            </nav>

            <div class="p-4 border-t border-white/10">
                <div
                    class="bg-white/5 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                    <img src="https://picsum.photos/100/100?random=user" alt="用户头像"
                        class="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-sm">
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-bold text-white/80 truncate">Music Lover</p>
                        <p class="text-xs text-white/40 truncate">VIP 会员</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- 主内容区 -->
        <main class="flex-1 flex flex-col relative overflow-hidden bg-transparent">
            <!-- 顶部搜索与操作栏 -->
            <header
                class="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
                <div class="flex items-center gap-4 flex-1 max-w-2xl relative">
                    <div class="relative w-full group">
                        <i
                            class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors"></i>
                        <input ref="searchInputRef" v-model="searchQuery" @keyup.enter="handleSearch"
                            @focus="showSearchHistory = true" @blur="outBlurSearch" type="text"
                            placeholder="搜索音乐、歌手、歌词..."
                            class="w-full pl-12 pr-10 py-2.5 bg-white/10 border border-white/10 rounded-full text-sm focus:bg-white/15 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 placeholder-white/30 text-white">
                        <button v-if="searchQuery" @click="searchQuery = ''"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    </div>

                    <!-- 搜索历史下拉框 -->
                    <div v-if="showSearchHistory && searchHistory.length > 0"
                        class="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] rounded-xl shadow-xl border border-white/10 py-2 z-50 animate-fade-in-down">
                        <div class="px-4 py-2 text-xs font-semibold text-white/40 flex justify-between items-center">
                            <span>搜索历史</span>
                            <button @click="clearSearchHistory" class="hover:text-purple-400 transition-colors"><i
                                    class="fas fa-trash-alt"></i></button>
                        </div>
                        <div class="max-h-60 overflow-y-auto custom-scrollbar">
                            <div v-for="(item, index) in searchHistory" :key="index"
                                @mousedown="handleHistoryClick(item)"
                                class="px-4 py-2.5 hover:bg-white/5 cursor-pointer flex items-center justify-between group transition-colors">
                                <div class="flex items-center gap-3 text-sm text-white/70">
                                    <i class="fas fa-history text-white/30 group-hover:text-purple-400"></i>
                                    <span>{{ item }}</span>
                                </div>
                                <button @mousedown.stop="removeSearchHistory(index)"
                                    class="text-white/30 hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/60">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </header>

            <!-- 内容滚动区域 -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-32" ref="scrollContainer"
                style="margin-bottom: 60px;">

                <!-- 加载状态 -->
                <div v-if="loading" class="flex flex-col items-center justify-center h-64 text-white/50">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-4"></div>
                    <p>正在加载音乐数据...</p>
                </div>

                <!-- 错误提示 -->
                <div v-else-if="error"
                    class="flex flex-col items-center justify-center h-64 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 p-6">
                    <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
                    <p class="font-medium">{{ error }}</p>
                    <button @click="refreshData"
                        class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">重试</button>
                </div>

                <!-- 搜索结果视图 -->
                <div v-else-if="activeTab === 'search'" class="space-y-8 animate-fade-in">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-white">
                            搜索 "<span class="text-purple-400">{{ searchQuery }}</span>" 的结果
                        </h2>
                        <span class="text-sm text-white/50">共找到 {{ searchResults.length }} 首歌曲</span>
                    </div>

                    <div v-if="searchResults.length === 0"
                        class="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <i class="fas fa-search text-4xl mb-4 opacity-30"></i>
                        <p>未找到相关歌曲，换个关键词试试？</p>
                    </div>

                    <div v-else class="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 overflow-hidden">
                        <table class="w-full text-left">
                            <thead class="bg-white/5 text-white/40 text-xs uppercase">
                                <tr>
                                    <th class="px-6 py-3 font-medium w-12">#</th>
                                    <th class="px-6 py-3 font-medium">歌曲</th>
                                    <th class="px-6 py-3 font-medium hidden sm:table-cell">歌手</th>
                                    <th class="px-6 py-3 font-medium hidden md:table-cell">专辑</th>
                                    <th class="px-6 py-3 font-medium text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/10">
                                <tr v-for="(song, index) in searchResults" :key="song.id"
                                    class="hover:bg-white/5 transition-colors group">
                                    <td class="px-6 py-4 text-white/40 text-sm">{{ index + 1 }}</td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <img :src="song.al?.picUrl || 'https://picsum.photos/50?random=' + song.id"
                                                class="w-10 h-10 rounded object-cover">
                                            <div>
                                                <div class="text-sm font-bold text-white/80 group-hover:text-purple-400 cursor-pointer"
                                                    @click="playSongFromSearch(song, index)">{{ song.name }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-white/50 hidden sm:table-cell">{{
                                        song.ar?.[0]?.name || '未知' }}</td>
                                    <td
                                        class="px-6 py-4 text-sm text-white/50 hidden md:table-cell truncate max-w-[150px]">
                                        {{ song.al?.name || '未知' }}</td>
                                    <td class="px-6 py-4 text-right">
                                        <button @click="toggleLike(song)" class="transition-colors"
                                            :class="isLiked(song.id) ? 'text-red-500' : 'text-white/30 hover:text-red-500'">
                                            <i :class="isLiked(song.id) ? 'fas' : 'far'" class="fa-heart"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 1. 推荐歌单视图 -->
                <div v-else-if="activeTab === 'recommend'" class="space-y-8 animate-fade-in">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                            推荐歌单 <i class="fas fa-chevron-right text-sm text-white/40 mt-1"></i>
                        </h2>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <div v-for="playlist in playlists" :key="playlist.id" @click="getPlaylistDetail(playlist.id)"
                            class="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/10">
                            <div class="relative aspect-square rounded-lg overflow-hidden mb-3 shadow-inner">
                                <img :src="playlist.coverImgUrl || 'https://picsum.photos/300/300?random=' + playlist.id"
                                    :alt="playlist.name"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                <div
                                    class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <div
                                        class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <i class="fas fa-play text-red-500 ml-1 text-lg"></i>
                                    </div>
                                </div>
                                <div
                                    class="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <i class="fas fa-headphones text-[10px]"></i>
                                    {{ formatNumber(playlist.playCount) }}
                                </div>
                            </div>
                            <h3
                                class="font-medium text-sm text-white/80 line-clamp-2 leading-relaxed group-hover:text-purple-400 transition-colors">
                                {{ playlist.name }}</h3>
                            <p class="text-xs text-white/50 mt-1 truncate">by {{ playlist?.copywriter || 'Unknown'
                            }}</p>
                        </div>
                    </div>
                </div>

                <!-- 2. 排行榜视图 -->
                <div v-else-if="activeTab === 'toplist'" class="space-y-8 animate-fade-in">
                    <h2 class="text-2xl font-bold text-white">官方排行榜</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div v-for="list in toplistData" :key="list.id" @click="getPlaylistDetail(list.id)"
                            class="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:shadow-lg transition-all border border-white/10 flex flex-col">
                            <div class="relative aspect-square rounded-lg overflow-hidden mb-3">
                                <img :src="list.coverImgUrl" :alt="list.name"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <span class="text-white text-xs font-bold">点击播放</span>
                                </div>
                            </div>
                            <h3 class="font-bold text-white/80 truncate">{{ list.name }}</h3>
                            <p class="text-xs text-white/50 mt-1 line-clamp-2">{{ list.updateFrequency || '每日更新' }}</p>
                        </div>
                    </div>
                </div>

                <!-- 3. 我喜欢的视图 -->
                <div v-else-if="activeTab === 'likes'" class="space-y-4 md:space-y-6 animate-fade-in">
                    <div
                        class="flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 p-4 md:p-8 rounded-2xl text-white shadow-lg shadow-purple-500/30 gap-4">
                        <div class="flex items-center gap-4 md:gap-6">
                            <div
                                class="w-16 h-16 md:w-32 md:h-32 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
                                <i class="fas fa-heart text-2xl md:text-5xl text-white/90"></i>
                            </div>
                            <div>
                                <h2 class="text-xl md:text-3xl font-bold mb-1 md:mb-2">我喜欢的音乐</h2>
                                <p class="text-white/80 text-xs md:text-sm">{{ filteredLikedSongs.length }} 首歌曲</p>
                            </div>
                        </div>
                        <button @click="playAllLiked"
                            class="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm md:text-base">
                            <i class="fas fa-play"></i> 播放全部
                        </button>
                    </div>

                    <!-- 我喜欢的搜索栏 -->
                    <div class="relative">
                        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/40"></i>
                        <input v-model="likedSearchQuery" type="text" placeholder="在喜欢的歌曲中搜索..."
                            class="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:bg-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 placeholder-white/30 text-white">
                        <button v-if="likedSearchQuery" @click="likedSearchQuery = ''"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    </div>

                    <div v-if="filteredLikedSongs.length === 0"
                        class="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <i v-if="likedSongs.length === 0" class="fas fa-music text-4xl mb-4 opacity-30"></i>
                        <i v-else class="fas fa-search text-4xl mb-4 opacity-30"></i>
                        <p>{{ likedSongs.length === 0 ? '暂无喜欢的歌曲，快去添加吧！' : '未找到匹配的歌曲' }}</p>
                    </div>

                    <div v-else class="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 overflow-hidden">
                        <table class="w-full text-left">
                            <thead class="bg-white/5 text-white/40 text-xs uppercase">
                                <tr>
                                    <th class="px-6 py-3 font-medium w-12">#</th>
                                    <th class="px-6 py-3 font-medium">歌曲</th>
                                    <th class="px-6 py-3 font-medium hidden sm:table-cell">歌手</th>
                                    <th class="px-6 py-3 font-medium hidden md:table-cell">专辑</th>
                                    <th class="px-6 py-3 font-medium text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/10">
                                <tr v-for="(song, index) in filteredLikedSongs" :key="song.id"
                                    class="hover:bg-white/5 transition-colors group">
                                    <td class="px-6 py-4 text-white/40 text-sm">{{ index + 1 }}</td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <img :src="song.al?.picUrl || 'https://picsum.photos/50?random=' + song.id"
                                                class="w-10 h-10 rounded object-cover">
                                            <div>
                                                <div class="text-sm font-bold text-white/80 group-hover:text-purple-400 cursor-pointer"
                                                    @click="playSong(song)">{{ song.name }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-white/50 hidden sm:table-cell">{{
                                        song.ar?.[0]?.name || '未知' }}</td>
                                    <td
                                        class="px-6 py-4 text-sm text-white/50 hidden md:table-cell truncate max-w-[150px]">
                                        {{ song.al?.name || '未知' }}</td>
                                    <td class="px-6 py-4 text-right">
                                        <button @click="toggleLike(song)"
                                            class="text-red-500 hover:text-red-400 transition-colors">
                                            <i class="fas fa-heart"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 4. 最近播放视图 -->
                <div v-else-if="activeTab === 'history'" class="space-y-6 animate-fade-in">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                            <i class="fas fa-history text-white/40"></i> 最近播放
                        </h2>
                        <button @click="clearHistory"
                            class="text-xs text-white/40 hover:text-purple-400 transition-colors px-3 py-1 border border-white/20 rounded-full hover:border-purple-500/50">清空历史</button>
                    </div>

                    <div v-if="historySongs.length === 0"
                        class="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <i class="fas fa-clock text-4xl mb-4 opacity-30"></i>
                        <p>暂无播放记录</p>
                    </div>

                    <div v-else class="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 overflow-hidden">
                        <div v-for="(song, index) in historySongs" :key="song.id + '-' + index" @click="playSong(song)"
                            class="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors group">
                            <div class="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                <img :src="song.al?.picUrl || 'https://picsum.photos/100?random=' + song.id"
                                    :alt="song.name" class="w-full h-full object-cover">
                                <div
                                    class="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                                    <i class="fas fa-play text-white text-xs"></i>
                                </div>
                            </div>

                            <div class="flex-1 min-w-0">
                                <h4
                                    class="text-sm font-bold text-white/80 truncate group-hover:text-purple-400 transition-colors">
                                    {{ song.name }}</h4>
                                <p class="text-xs text-white/50 truncate">{{ song.ar?.[0]?.name || '未知歌手' }}</p>
                            </div>

                            <div class="text-xs text-white/40 font-mono hidden sm:block">
                                {{ formatTime((song.dt || 0) / 1000) }}
                            </div>

                            <button @click.stop="toggleLike(song)"
                                class="p-2 rounded-full hover:bg-white/10 transition-colors"
                                :class="isLiked(song.id) ? 'text-red-500' : 'text-white/30'">
                                <i :class="isLiked(song.id) ? 'fas' : 'far'" class="fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部播放控制栏 -->
            <footer
                class="fixed bottom-0 left-0 right-0 h-20 md:h-20 bg-[#1a1a2e]/95 backdrop-blur-xl border-t border-white/10 px-2 md:px-6 flex items-center justify-between z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
                <!-- 当前播放信息 - 移动端只显示封面 -->
                <div class="flex items-center gap-2 md:gap-4 w-auto md:w-1/4 md:min-w-[240px]">
                    <div class="relative w-10 h-10 md:w-14 md:h-14 rounded-lg overflow-hidden shadow-md group cursor-pointer flex-shrink-0"
                        @click="toggleLyricModal">
                        <img :src="currentSong?.al?.picUrl || 'https://picsum.photos/200/200?random=play'"
                            alt="Album Cover" class="w-full h-full object-cover"
                            :class="{ 'animate-[spin_10s_linear_infinite]': isPlaying }">
                        <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                    <div class="hidden sm:block overflow-hidden max-w-[120px] md:max-w-none">
                        <h4 class="text-xs md:text-sm font-bold text-white/80 truncate hover:underline cursor-pointer"
                            @click="toggleLyricModal">{{ currentSong?.name || '未播放' }}</h4>
                        <p class="text-[10px] md:text-xs text-white/50 truncate hover:text-white/70 cursor-pointer">{{
                            currentSong?.ar?.[0]?.name || '-' }}</p>
                    </div>
                    <button @click="currentSong && toggleLike(currentSong)" class="transition-colors ml-1 md:ml-2 flex-shrink-0"
                        :class="currentSong && isLiked(currentSong.id) ? 'text-red-500' : 'text-white/40 hover:text-red-500'">
                        <i :class="currentSong && isLiked(currentSong.id) ? 'fas' : 'far'" class="fa-heart text-sm md:text-lg"></i>
                    </button>
                </div>

                <!-- 播放控制按钮 -->
                <div class="flex flex-col items-center flex-1 max-w-[180px] md:max-w-xl px-1 md:px-4">
                    <div class="flex items-center gap-3 md:gap-8 mb-1">
                        <button class="text-white/40 hover:text-white/70 transition-colors hidden md:block" title="随机播放">
                            <i class="fas fa-random text-sm"></i>
                        </button>
                        <button @click="prevSong"
                            class="text-white/60 hover:text-purple-400 transition-colors transform hover:scale-110">
                            <i class="fas fa-step-backward text-sm md:text-xl"></i>
                        </button>
                        <button @click="togglePlay"
                            class="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
                            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'" class="text-white ml-0.5 text-xs md:text-base"></i>
                        </button>
                        <button @click="nextSong"
                            class="text-white/60 hover:text-purple-400 transition-colors transform hover:scale-110">
                            <i class="fas fa-step-forward text-sm md:text-xl"></i>
                        </button>
                        <button class="text-white/40 hover:text-white/70 transition-colors hidden md:block" title="循环播放">
                            <i class="fas fa-redo text-sm"></i>
                        </button>
                    </div>
                    <div class="w-full flex items-center gap-1 md:gap-3 text-[10px] md:text-xs text-white/40 font-mono">
                        <span class="w-8 md:w-10 text-right">{{ formatTime(currentTime) }}</span>
                        <div class="flex-1 relative h-1 bg-white/20 rounded-full group cursor-pointer" @click="seek">
                            <div class="absolute top-0 left-0 h-full bg-purple-500 rounded-full pointer-events-none"
                                :style="{ width: (currentTime / duration * 100) + '%' }"></div>
                            <div class="absolute top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white border-2 border-purple-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                :style="{ left: (currentTime / duration * 100) + '%' }"></div>
                            <input type="range" min="0" :max="duration || 1" v-model.number="currentTime" @input="seek"
                                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                        </div>
                        <span class="w-8 md:w-10">{{ formatTime(duration) }}</span>
                    </div>
                </div>

                <!-- 音量与其他控制 - 移动端只显示歌词按钮 -->
                <div class="flex items-center justify-end gap-1 md:gap-4 w-auto md:w-1/4 md:min-w-[200px]">
                    <button @click="toggleLyricModal" class="text-white/40 hover:text-purple-400 transition-colors"
                        :class="{ 'text-purple-400': showLyricModal }" title="歌词">
                        <i class="fas fa-align-center text-sm md:text-base"></i>
                    </button>
                    <div class="items-center gap-2 group w-24 hidden md:flex">
                        <i class="fas fa-volume-up text-white/40 text-sm group-hover:text-white/60"></i>
                        <div class="flex-1 h-1 bg-white/20 rounded-full relative overflow-hidden">
                            <div class="absolute top-0 left-0 h-full bg-white/40 group-hover:bg-purple-500 transition-colors"
                                :style="{ width: volume * 100 + '%' }"></div>
                            <input type="range" min="0" max="1" step="0.01" v-model.number="volume"
                                @input="updateVolume" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                        </div>
                    </div>
                    <button class="text-white/40 hover:text-white/60 transition-colors hidden md:block">
                        <i class="fas fa-list-ul"></i>
                    </button>
                </div>
            </footer>

            <!-- 歌词模态框 -->
            <transition name="fade">
                <div v-if="showLyricModal" class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-2xl flex flex-col"
                    @click.self="showLyricModal = false">
                    <div class="flex justify-between items-center p-6 text-white/80">
                        <div class="flex items-center gap-4">
                            <img :src="currentSong?.al?.picUrl" class="w-12 h-12 rounded-lg object-cover shadow-lg">
                            <div>
                                <h2 class="text-xl font-bold text-white">{{ currentSong?.name }}</h2>
                                <p class="text-sm text-white/60">{{ currentSong?.ar?.[0]?.name }}</p>
                            </div>
                        </div>
                        <button @click="showLyricModal = false"
                            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="flex-1 flex items-center justify-center overflow-hidden relative mask-image-gradient"
                        style="z-index: 10000;">
                        <div
                            class="w-full max-w-2xl h-full flex flex-col items-center justify-center text-center space-y-8 overflow-y-auto py-20 custom-scrollbar-no-track">
                            <div v-for="(line, index) in lyrics" :key="index"
                                class="lyric-line text-2xl md:text-3xl font-medium text-white/40 cursor-pointer hover:text-white/80 transition-all duration-300 py-2"
                                :class="{ 'lyric-active text-white scale-110 font-bold drop-shadow-lg': currentLyricIndex === index }"
                                @click="seekToLyric(index)">
                                {{ line.text }}
                            </div>
                            <div v-if="lyrics.length === 0" class="text-white/40 flex flex-col items-center gap-4">
                                <i class="fas fa-music text-4xl opacity-50"></i>
                                <p>暂无歌词</p>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getPersonalized, getToplist, getTetail, getSongUrl, getLyric, getSearch } from '@/api/http'
import { toggleLikeSong, getSongs, addHistory, getHistory, deleteHistory, playSongCount } from '@/api/http1'

// --- 类型定义 ---
interface Playlist {
    id: number
    name: string
    coverImgUrl: string
    playCount: number
    creator?: {
        nickname: string
    }
    copywriter: string
}

interface Song {
    id: number
    name: string
    ar: { name: string }[]
    al: { picUrl: string, name?: string }
    dt: number // duration
}

interface LyricLine {
    time: number
    text: string
}


// 移动端底部导航 Tab 配置
const mobileTabs = [
    { id: 'recommend' as const, label: '推荐', icon: 'fas fa-compass' },
    { id: 'toplist' as const, label: '排行榜', icon: 'fas fa-trophy' },
    { id: 'likes' as const, label: '喜欢', icon: 'fas fa-heart' },
    { id: 'history' as const, label: '历史', icon: 'fas fa-history' },
]

const playlists = ref<Playlist[]>([])
const toplistData = ref<any[]>([])
const currentSong = ref<Song | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const searchQuery = ref('')
const likedSearchQuery = ref('') // 我喜欢的列表搜索
const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref<'recommend' | 'toplist' | 'likes' | 'history' | 'search'>('recommend')

// 持久化数据
const likedSongs = ref<Song[]>([])
const historySongs = ref<Song[]>([])
const searchHistory = ref<string[]>([])

// 我喜欢的列表过滤（本地搜索）
const filteredLikedSongs = computed(() => {
    const query = likedSearchQuery.value.trim().toLowerCase()
    if (!query) return likedSongs.value
    return likedSongs.value.filter(song => {
        const nameMatch = song.name.toLowerCase().includes(query)
        const artistMatch = song.ar?.[0]?.name?.toLowerCase().includes(query)
        const albumMatch = song.al?.name?.toLowerCase().includes(query)
        return nameMatch || artistMatch || albumMatch
    })
})

const showLyricModal = ref(false)
const showSearchHistory = ref(false)
const lyrics = ref<LyricLine[]>([])
const currentLyricIndex = ref(-1)
const searchResults = ref<Song[]>([])
const searchInputRef = ref<HTMLInputElement | null>(null)

// 播放队列
const playQueue = ref<Song[]>([])
const queueIndex = ref(0)

const audioPlayer = new Audio()
audioPlayer.volume = volume.value

// --- 方法 ---

const outBlurSearch = () => {
    setTimeout(() => showSearchHistory.value = false, 200)
}

const formatNumber = (num: number) => {
    if (!num) return '0'
    if (num > 100000000) return (num / 100000000).toFixed(1) + '亿'
    if (num > 10000) return (num / 10000).toFixed(1) + '万'
    return num.toString()
}

const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// 切换 Tab
const switchTab = (tab: 'recommend' | 'toplist' | 'likes' | 'history' | 'search') => {
    activeTab.value = tab
    if (tab === 'toplist' && toplistData.value.length === 0) {
        fetchTopList()
    }
    if (tab !== 'search') {
        showSearchHistory.value = false
    }
}

// 获取推荐歌单
const fetchRecommendPlaylists = async () => {
    loading.value = true
    error.value = null
    try {
        const songNum = 20
        const response = await getPersonalized(songNum)
        playlists.value = response.result || []
    } catch (e) {
        console.warn('Failed to fetch from local backend, using mock data', e)
        error.value = '无法获取推荐歌单，请重试。'
        // playlists.value = Array.from({ length: 10 }).map((_, i) => ({
        //     id: i,
        //     name: `每日推荐歌单 ${i + 1} - 精选华语流行金曲`,
        //     coverImgUrl: `https://picsum.photos/300/300?random=${i}`,
        //     playCount: Math.floor(Math.random() * 1000000),
        //     creator: { nickname: 'CloudMusic Official' },
        //     copywriter: '为你精心挑选的每日推荐歌单，包含最新最热的华语流行金曲，满足你的听歌需求。'
        // }))
    } finally {
        loading.value = false
    }
}

// 获取排行榜
const fetchTopList = async () => {
    loading.value = true
    try {
        const res = await getToplist()
        toplistData.value = res.data.list || []
    } catch (e) {
        console.error('Fetch toplist error', e)
        error.value = '无法获取推荐歌单，请重试。'
    } finally {
        loading.value = false
    }
}

// 获取歌单详情并播放第一首
const getPlaylistDetail = async (id: number) => {
    loading.value = true
    try {
        const response = await getTetail(id)
        const tracks = response.data.playlist?.tracks || []

        if (tracks.length > 0) {
            // 转换数据格式
            const songs: Song[] = tracks.map((t: any) => ({
                id: t.id,
                name: t.name,
                ar: t.ar || [{ name: 'Unknown' }],
                al: t.al || { picUrl: '', name: '' },
                dt: t.dt || 0
            }))

            // 【关键】设置整个歌单为播放队列，并从第一首开始播放
            setPlayQueue(songs, 0)
        }
    } catch (e) {
        console.error('Failed to get playlist detail', e)
    } finally {
        loading.value = false
    }
}


// 设置播放队列
const setPlayQueue = (songs: Song[], startIndex: number = 0) => {
    playQueue.value = songs
    queueIndex.value = startIndex
    if (songs.length > 0) {
        playSong(songs[startIndex])
    }
}

// 播放歌曲
const playSong = async (song: Song) => {
    // 如果这首歌在队列中，更新索引；如果不在，尝试找到它或追加到末尾
    const indexInQueue = playQueue.value.findIndex(s => s.id === song.id)
    if (indexInQueue !== -1) {
        queueIndex.value = indexInQueue
    } else {
        // 可选策略：如果不在队列中，是单独点击播放的，可以追加到队列末尾
        // playQueue.value.push(song)
        // queueIndex.value = playQueue.value.length - 1
    }

    currentSong.value = song
    lyrics.value = []
    currentLyricIndex.value = -1

    // 添加到最近播放
    addToHistory(song)

    try {
        const res = await getSongUrl(song.id)
        const url = res.data?.[0]?.url

        if (url) {
            audioPlayer.src = url
            audioPlayer.play()
            isPlaying.value = true
            fetchLyrics(song.id)
            playSongCount(song.id) // 记录播放次数
        } else {
            console.warn('No URL found, skipping to next')
            nextSong() // 如果没链接，自动跳下一首
        }
    } catch (e) {
        console.error('Play error', e)
        nextSong() // 出错也跳下一首
    }
}

// 从搜索结果播放（建立临时队列）
const playSongFromSearch = (song: Song, index: number) => {
    setPlayQueue(searchResults.value, index)
}

// 获取歌词
const fetchLyrics = async (id: number) => {
    try {
        const res = await getLyric(id)
        const lyricStr = res.data
        if (lyricStr) {
            parseLyrics(lyricStr)
        }
    } catch (e) {
        console.error('Fetch lyrics error', e)
    }
}

// 解析歌词
const parseLyrics = (lyricStr: string) => {
    const lines = lyricStr.split('\n')
    const parsed: LyricLine[] = []
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

    lines.forEach(line => {
        const match = timeReg.exec(line)
        if (match) {
            const minutes = parseInt(match[1])
            const seconds = parseInt(match[2])
            const milliseconds = parseInt(match[3].padEnd(3, '0'))
            const time = minutes * 60 + seconds + milliseconds / 1000
            const text = line.replace(timeReg, '').trim()
            if (text) {
                parsed.push({ time, text })
            }
        }
    })
    lyrics.value = parsed
}

const togglePlay = () => {
    if (!currentSong.value) return
    if (isPlaying.value) {
        audioPlayer.pause()
    } else {
        audioPlayer.play()
    }
    isPlaying.value = !isPlaying.value
}

const prevSong = () => {
    if (playQueue.value.length === 0) return

    let prevIndex = queueIndex.value - 1
    if (prevIndex < 0) {
        prevIndex = playQueue.value.length - 1 // 循环到末尾
    }

    queueIndex.value = prevIndex
    playSong(playQueue.value[prevIndex])
}

const nextSong = () => {
    if (playQueue.value.length === 0) return

    // 计算下一首的索引（循环播放：最后一首之后回到第一首）
    let nextIndex = queueIndex.value + 1
    if (nextIndex >= playQueue.value.length) {
        nextIndex = 0 // 循环到开头
    }

    queueIndex.value = nextIndex
    playSong(playQueue.value[nextIndex])
}

const seek = (e: Event) => {
    const target = e.target as HTMLInputElement
    const time = parseFloat(target.value)
    audioPlayer.currentTime = time
    currentTime.value = time
}

const updateVolume = (e: Event) => {
    const target = e.target as HTMLInputElement
    const vol = parseFloat(target.value)
    audioPlayer.volume = vol
    volume.value = vol
}

const seekToLyric = (index: number) => {
    const time = lyrics.value[index].time
    audioPlayer.currentTime = time
    currentTime.value = time
}

const toggleLyricModal = () => {
    if (!currentSong.value) return
    showLyricModal.value = !showLyricModal.value
}

// --- 搜索逻辑 ---

const handleSearch = async () => {
    const keyword = searchQuery.value.trim()
    if (!keyword) return

    // 1. 保存搜索历史
    saveSearchHistory(keyword)

    // 2. 切换到搜索视图
    activeTab.value = 'search'
    showSearchHistory.value = false

    // 3. 执行搜索
    loading.value = true
    error.value = null
    try {
        const res = await getSearch(keyword, 30, 1)
        const data = res.data

        if (data.result && data.result.songs) {
            searchResults.value = data.result.songs.map((s: any) => ({
                id: s.id,
                name: s.name,
                ar: s.artists || [{ name: 'Unknown' }],
                al: s.album || { picUrl: '', name: '' },
                dt: s.duration || 0
            }))
        } else {
            searchResults.value = []
        }
    } catch (e) {
        console.error('Search error', e)
        error.value = '搜索失败，请检查网络连接'
        searchResults.value = []
    } finally {
        loading.value = false
    }
}

const handleHistoryClick = (keyword: string) => {
    searchQuery.value = keyword
    handleSearch()
}

// --- 搜索历史管理 ---

const saveSearchHistory = (keyword: string) => {
    // 移除重复项
    const index = searchHistory.value.indexOf(keyword)
    if (index !== -1) {
        searchHistory.value.splice(index, 1)
    }
    // 添加到头部
    searchHistory.value.unshift(keyword)
    // 限制数量（最多10条）
    if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
    }
    localStorage.setItem('search_history', JSON.stringify(searchHistory.value))
}

const removeSearchHistory = (index: number) => {
    searchHistory.value.splice(index, 1)
    localStorage.setItem('search_history', JSON.stringify(searchHistory.value))
}

const clearSearchHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('search_history')
}

const refreshData = () => {
    if (activeTab.value === 'recommend') fetchRecommendPlaylists()
    else if (activeTab.value === 'toplist') fetchTopList()
}

// --- 喜欢与历史逻辑 ---

const isLiked = (id: number) => likedSongs.value.some(s => s.id === id)

const toggleLike = async (song: Song) => {
    try {
        // 发送喜欢/取消喜欢请求到后端
        await toggleLikeSong(song)
    } catch (e) {
        console.error('Like toggle error', e)
        return
    }
    const index = likedSongs.value.findIndex(s => s.id === song.id)
    if (index !== -1) {
        likedSongs.value.splice(index, 1)
    } else {
        likedSongs.value.unshift(song)
    }
    // saveLikes()
}

// const saveLikes = () => {
//     localStorage.setItem('liked_songs', JSON.stringify(likedSongs.value))
// }

const addToHistory = async (song: Song) => {
    try {
        await addHistory(song)
    } catch (e) {
        console.warn('Failed to add history on backend', e)
    }
    // 移除重复项
    historySongs.value = historySongs.value.filter(s => s.id !== song.id)
    // 添加到头部
    historySongs.value.unshift(song)
    // 限制数量
    if (historySongs.value.length > 50) historySongs.value.pop()

    localStorage.setItem('play_history', JSON.stringify(historySongs.value))
}


const clearHistory = async () => {
    try {
        await deleteHistory()
        historySongs.value = []
        localStorage.removeItem('play_history')
    } catch (e) {
        console.warn('Failed to clear history on backend', e)
    }

}

const playAllLiked = () => {
    if (likedSongs.value.length > 0) {
        setPlayQueue(likedSongs.value, 0)
    }
}
// 获取喜欢的歌曲
const getLikedSongs = async () => {
    try {
        // 这里需要根据实际后端接口调整
        const response = await getSongs(1, 100) // 获取前100首喜欢的歌曲
        likedSongs.value = response.data || []
    } catch (e) {
        console.error('Failed to fetch liked songs', e)
    }
}

const getHistorySongs = async () => {
    try {
        const response = await getHistory(1, 50) // 获取前50条播放历史
        console.log("🚀 ~ getHistorySongs ~ response:", response)
        historySongs.value = response.data || []
    } catch (e) {
        console.error('Failed to fetch history songs', e)
    }
}


// --- 生命周期 ---
onMounted(() => {
    fetchRecommendPlaylists()

    // 获取细化歌曲
    getLikedSongs()
    // 获取最近播放历史
    getHistorySongs()
    // const savedLikes = localStorage.getItem('liked_songs')
    // if (savedLikes) likedSongs.value = JSON.parse(savedLikes)
    // console.log("🚀 ~ likedSongs.value:", likedSongs.value)

    const savedHistory = localStorage.getItem('play_history')
    if (savedHistory) historySongs.value = JSON.parse(savedHistory)

    const savedSearchHistory = localStorage.getItem('search_history')
    if (savedSearchHistory) searchHistory.value = JSON.parse(savedSearchHistory)

    // 使用 requestAnimationFrame 节流歌词更新，避免每帧都执行 findIndex
    let rafId: number | null = null
    const onTimeUpdate = () => {
        if (rafId !== null) return
        rafId = requestAnimationFrame(() => {
            rafId = null
            currentTime.value = audioPlayer.currentTime
            duration.value = audioPlayer.duration || 0

            if (lyrics.value.length > 0) {
                const idx = lyrics.value.findIndex((l, i) => {
                    const next = lyrics.value[i + 1]
                    return audioPlayer.currentTime >= l.time && (!next || audioPlayer.currentTime < next.time)
                })
                if (idx !== -1 && idx !== currentLyricIndex.value) {
                    currentLyricIndex.value = idx
                    const container = document.querySelector('.custom-scrollbar-no-track')
                    const activeLine = document.querySelector('.lyric-active')
                    if (container && activeLine) {
                        const offset = (activeLine as HTMLElement).offsetTop - container.clientHeight / 2
                        container.scrollTo({ top: offset, behavior: 'smooth' })
                    }
                }
            }
        })
    }
    audioPlayer.addEventListener('timeupdate', onTimeUpdate)

    audioPlayer.addEventListener('ended', () => {
        isPlaying.value = false
        nextSong()
    })
})

onUnmounted(() => {
    audioPlayer.pause()
    audioPlayer.src = ''
})
</script>

<style scoped>
/* 动态图片层 - 使用 will-change 和 translateZ 开启 GPU 加速 */
.ken-burns-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
    transform: translateZ(0);
    animation: kenBurns 30s ease-in-out infinite alternate;
    pointer-events: none;
}


@keyframes kenBurns {
    0% {
        transform: scale(1) translate(0, 0) translateZ(0);
    }

    100% {
        transform: scale(1.08) translate(-1%, -1%) translateZ(0);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}

.custom-scrollbar-no-track::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}

.mask-image-gradient {
    mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
}

.lyric-line {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.lyric-active {
    color: #ffffff;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-down {
    animation: fadeInDown 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
