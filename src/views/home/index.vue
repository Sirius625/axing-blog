<template>
  <div :class="['gallery-app', { 'dark-mode': isDark }]">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-area" @click="resetView">
          <div class="logo-icon">
            <i class="fas fa-images"></i>
          </div>
          <h1>图片画廊</h1>
        </div>
        <div class="header-actions">
          <button
            class="icon-btn"
            @click="toggleTheme"
            :title="isDark ? '切换亮色模式' : '切换暗色模式'"
          >
            <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
          <button class="primary-btn video-btn" @click="showVideoUploadModal = true">
            <i class="fas fa-video"></i>
            <span>上传视频</span>
          </button>
          <button class="primary-btn" @click="showUploadModal = true">
            <i class="fas fa-upload"></i>
            <span>上传图片</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Tab 切换栏 -->
    <div class="tab-bar">
      <button
        :class="['tab-btn', { active: activeTab === 'images' }]"
        @click="activeTab = 'images'"
      >
        <i class="fas fa-images"></i>
        <span>图片</span>
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'videos' }]"
        @click="activeTab = 'videos'"
      >
        <i class="fas fa-video"></i>
        <span>视频</span>
      </button>
    </div>

    <!-- 主内容区 -->
    <main class="app-main">
      <!-- ===== 图片 Tab ===== -->
      <template v-if="activeTab === 'images'">
        <!-- 控制栏 -->
        <div class="control-bar">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索图片标题或描述..."
              class="search-input"
              @input="handleSearchInput"
            />
          </div>
          <div class="filter-controls">
            <!-- 分类筛选 -->
            <select v-model="selectedCategory" class="select-input" @change="handleCategoryChange">
              <option value="">全部分类</option>
              <option value="运动">🏃 运动</option>
              <option value="日常">☕ 日常</option>
              <option value="游戏">🎮 游戏</option>
              <option value="其他">📦 其他</option>
            </select>
            <select
              v-model="selectedVisibility"
              class="select-input"
              @change="handleVisibilityChange"
            >
              <option value="">全部可见性</option>
              <option value="1">🌍 公开</option>
              <option value="0">🔒 私密</option>
            </select>
            <select v-model="sortBy" class="select-input">
              <option value="newest">最新上传</option>
              <option value="popular">最多点赞</option>
              <option value="name">按名称</option>
            </select>
            <div class="view-toggle">
              <button
                :class="['toggle-btn', { active: viewMode === 'grid' }]"
                @click="viewMode = 'grid'"
                title="网格视图"
              >
                <i class="fas fa-th"></i>
              </button>
              <button
                :class="['toggle-btn', { active: viewMode === 'list' }]"
                @click="viewMode = 'list'"
                title="列表视图"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 状态栏 -->
        <div class="status-bar">
          <span class="count-text">
            共 <strong>{{ filteredImages.length }}</strong> 张图片
          </span>
          <span v-if="loading" class="loading-indicator">
            <i class="fas fa-spinner fa-spin"></i> 加载中...
          </span>
        </div>

        <!-- 图片网格 -->
        <div v-if="filteredImages.length > 0" :class="['image-container', viewMode]">
          <ImageCard
            v-for="img in filteredImages"
            :key="img.id"
            :image="img"
            @preview="openPreview"
          />
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-images"></i>
          </div>
          <h3>暂无图片</h3>
          <p>点击上方「上传图片」按钮分享你的作品</p>
          <button class="link-btn" @click="showUploadModal = true">立即上传</button>
        </div>
      </template>

      <!-- ===== 视频 Tab ===== -->
      <template v-if="activeTab === 'videos'">
        <!-- 视频控制栏 -->
        <div class="control-bar">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="videoSearchQuery"
              type="text"
              placeholder="搜索视频标题或描述..."
              class="search-input"
              @input="handleVideoSearchInput"
            />
          </div>
          <div class="filter-controls">
            <select v-model="videoVisibility" class="select-input">
              <option value="">全部可见性</option>
              <option value="1">🌍 公开</option>
              <option value="0">🔒 私密</option>
            </select>
            <select v-model="videoSortBy" class="select-input">
              <option value="newest">最新上传</option>
              <option value="title">按名称</option>
            </select>
          </div>
        </div>

        <!-- 状态栏 -->
        <div class="status-bar">
          <span class="count-text">
            共 <strong>{{ filteredVideos.length }}</strong> 个视频
          </span>
          <span v-if="videoLoading" class="loading-indicator">
            <i class="fas fa-spinner fa-spin"></i> 加载中...
          </span>
        </div>

        <!-- 视频网格 -->
        <div v-if="filteredVideos.length > 0" class="video-container">
          <VideoCard
            v-for="video in filteredVideos"
            :key="video.id"
            :video="video"
            @play="playVideo"
          />
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-video"></i>
          </div>
          <h3>暂无视频</h3>
          <p>点击上方「上传视频」按钮分享你的视频</p>
          <button class="link-btn" @click="showVideoUploadModal = true">立即上传</button>
        </div>
      </template>
    </main>

    <!-- 图片上传弹窗 -->
    <ImageUploadModal
      ref="uploadModalRef"
      :visible="showUploadModal"
      @close="showUploadModal = false"
      @upload="handleUpload"
    />

    <!-- 视频上传弹窗 -->
    <VideoUploadModal
      ref="videoUploadModalRef"
      :visible="showVideoUploadModal"
      @close="showVideoUploadModal = false"
      @upload="handleVideoUpload"
    />

    <!-- 预览弹窗 -->
    <ImagePreviewModal :image="previewImage" @close="closePreview" />

    <!-- 视频预览弹窗 -->
    <VideoPreviewModal
      :visible="showVideoPreview"
      :video="
        playingVideo || {
          id: 0,
          url: '',
          title: '',
          description: '',
          author: '',
          date: '',
          isPublic: false,
          duration: 0,
          fileSize: 0
        }
      "
      @close="closeVideoPreview"
    />

    <!-- Toast 提示 -->
    <transition name="toast-slide">
      <div v-if="toast.show" :class="['toast', toast.type]">
        <i
          :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"
        ></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
  import { get1, post1 } from '@/api/index'

  // 图片服务器基础地址
  const IMAGE_BASE_URL = import.meta.env.VITE_MANAGE_API_BASE_URL || 'http://localhost:3030'
  import ImageCard from '@/components/home/ImageCard.vue'
  // 非首屏必需组件 - 动态导入（弹窗类组件）
  const ImageUploadModal = defineAsyncComponent(() => import('@/components/home/ImageUploadModal.vue'))
  const VideoUploadModal = defineAsyncComponent(() => import('@/components/home/VideoUploadModal.vue'))
  const ImagePreviewModal = defineAsyncComponent(() => import('@/components/home/ImagePreviewModal.vue'))
  const VideoCard = defineAsyncComponent(() => import('@/components/home/VideoCard.vue'))
  const VideoPreviewModal = defineAsyncComponent(() => import('@/components/home/VideoPreviewModal.vue'))

  // 状态
  const images = ref<any[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const selectedVisibility = ref('')
  const sortBy = ref('newest')

  const viewMode = ref('grid')
  const isDark = ref(false)
  const showUploadModal = ref(false)
  const showVideoUploadModal = ref(false)
  const previewImage = ref<any>(null)
  const uploadModalRef = ref<InstanceType<typeof ImageUploadModal> | null>(null)
  const videoUploadModalRef = ref<InstanceType<typeof VideoUploadModal> | null>(null)

  const toast = ref({ show: false, message: '', type: 'success' })

  // Tab 切换
  const activeTab = ref<'images' | 'videos'>('images')

  // 视频相关状态
  const videos = ref<any[]>([])
  const videoLoading = ref(false)
  const videoSearchQuery = ref('')
  const videoSortBy = ref('newest')
  const videoVisibility = ref('')
  const showVideoPreview = ref(false)
  const playingVideo = ref<any>(null)

  // 获取视频列表
  const fetchVideos = async () => {
    videoLoading.value = true
    try {
      const res = await get1('/api/videos?page=1&pageSize=100&_t=' + Date.now())
      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.data || []
        videos.value = list.map((v: any) => ({
          id: v.id,
          url: IMAGE_BASE_URL + v.url,
          title: v.title,
          description: v.description || '',
          author: v.author || '匿名',
          isPublic: v.is_public,
          duration: v.duration || 0,
          fileSize: v.file_size || 0,
          date: v.created_at ? v.created_at.split(' ')[0] || v.created_at.split('T')[0] : '未知'
        }))
      }
    } catch (e) {
      console.error('获取视频列表失败:', e)
    } finally {
      videoLoading.value = false
    }
  }

  // 视频计算属性
  const filteredVideos = computed(() => {
    let result = videos.value

    // 按可见性筛选
    if (videoVisibility.value !== '') {
      const isPublicVal = videoVisibility.value === '1' ? 1 : 0
      result = result.filter((v) => v.isPublic === isPublicVal)
    }

    // 按关键词搜索
    if (videoSearchQuery.value) {
      const q = videoSearchQuery.value.toLowerCase()
      result = result.filter(
        (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
      )
    }

    if (videoSortBy.value === 'title') {
      result.sort((a: any, b: any) => a.title.localeCompare(b.title))
    } else {
      result.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
    return result
  })

  // 视频搜索防抖
  let videoSearchTimer: ReturnType<typeof setTimeout> | null = null
  const handleVideoSearchInput = () => {
    if (videoSearchTimer) clearTimeout(videoSearchTimer)
    videoSearchTimer = setTimeout(() => {}, 300)
  }

  // 播放视频
  const playVideo = (video: any) => {
    playingVideo.value = video
    showVideoPreview.value = true
    document.body.style.overflow = 'hidden'
  }

  const closeVideoPreview = () => {
    showVideoPreview.value = false
    playingVideo.value = null
    document.body.style.overflow = ''
  }

  // 获取图片列表
  const fetchImages = async () => {
    loading.value = true
    try {
      let url = '/api/images?page=1&pageSize=100&_t=' + Date.now()
      // 根据可见性筛选参数传递
      if (selectedVisibility.value !== '') {
        url += '&isPublic=' + selectedVisibility.value
      }
      const res = await get1(url)
      console.log('fetchImages response:', res)

      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.data || []
        console.log('fetchImages list:', list)
        images.value = list.map((img: any) => ({
          id: img.id,
          url: IMAGE_BASE_URL + img.url,
          title: img.title,
          description: img.description || '',
          category: img.category || '其他',
          author: img.author || '匿名',
          likes: img.likes || 0,
          isPublic: img.is_public,
          date: img.created_at ? img.created_at.split(' ')[0] : '未知'
        }))
        console.log('images.value after map:', images.value)
      } else {
        console.warn('fetchImages: no data returned', res)
      }
    } catch (e) {
      console.error('获取图片列表失败:', e)
    } finally {
      loading.value = false
    }
  }

  // 计算属性
  const filteredImages = computed(() => {
    let result = images.value

    // 按分类筛选
    if (selectedCategory.value) {
      result = result.filter((img) => img.category === selectedCategory.value)
    }

    // 按可见性筛选
    if (selectedVisibility.value !== '') {
      const isPublicVal = selectedVisibility.value === '1' ? 1 : 0
      result = result.filter((img) => img.isPublic === isPublicVal)
    }

    // 按关键词搜索
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (img) => img.title.toLowerCase().includes(q) || img.description.toLowerCase().includes(q)
      )
    }

    if (sortBy.value === 'popular') {
      result.sort((a, b) => b.likes - a.likes)
    } else if (sortBy.value === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
    return result
  })

  // 搜索输入防抖
  let searchTimer: ReturnType<typeof setTimeout> | null = null
  const handleSearchInput = () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      // 搜索已通过计算属性实时过滤，这里只是触发更新
    }, 300)
  }

  // 分类切换 - 从后端重新获取
  const handleCategoryChange = async () => {
    loading.value = true
    try {
      let url = '/api/images?page=1&pageSize=100'
      if (selectedCategory.value) {
        url += '&category=' + encodeURIComponent(selectedCategory.value)
      }
      // 保持可见性筛选
      if (selectedVisibility.value !== '') {
        url += '&isPublic=' + selectedVisibility.value
      }
      const res = await get1(url)

      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.data || []
        images.value = list.map((img: any) => ({
          id: img.id,
          url: IMAGE_BASE_URL + img.url,
          title: img.title,
          description: img.description || '',
          category: img.category || '其他',
          author: img.author || '匿名',
          likes: img.likes || 0,
          isPublic: img.is_public,
          date: img.created_at ? img.created_at.split(' ')[0] : '未知'
        }))
      }
    } catch (e) {
      console.error('获取图片列表失败:', e)
    } finally {
      loading.value = false
    }
  }

  // 可见性切换 - 从后端重新获取
  const handleVisibilityChange = async () => {
    loading.value = true
    try {
      let url = '/api/images?page=1&pageSize=100'
      if (selectedVisibility.value !== '') {
        url += '&isPublic=' + selectedVisibility.value
      }
      if (selectedCategory.value) {
        url += '&category=' + encodeURIComponent(selectedCategory.value)
      }
      const res = await get1(url)
      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.data || []
        images.value = list.map((img: any) => ({
          id: img.id,
          url: IMAGE_BASE_URL + img.url,
          title: img.title,
          description: img.description || '',
          category: img.category || '其他',
          author: img.author || '匿名',
          likes: img.likes || 0,
          isPublic: img.is_public,
          date: img.created_at ? img.created_at.split(' ')[0] : '未知'
        }))
      }
    } catch (e) {
      console.error('获取图片列表失败:', e)
    } finally {
      loading.value = false
    }
  }

  // 方法
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const openPreview = (image: any) => {
    previewImage.value = image
    document.body.style.overflow = 'hidden'
  }

  const closePreview = () => {
    previewImage.value = null
    document.body.style.overflow = ''
  }

  const handleUpload = async (data: {
    title: string
    description: string
    category: string
    isPublic: boolean
    file: File
  }) => {
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(data.file)
      })

      const result = await post1('/api/images/upload', {
        title: data.title,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic,
        imageBase64: base64
      })

      if (result.success && result.data) {
        showToast('上传成功！', 'success')
        showUploadModal.value = false
        uploadModalRef.value?.reset()
        fetchImages()
      } else {
        showToast(result.message || '上传失败', 'error')
      }
    } catch (e) {
      console.error('上传失败:', e)
      showToast('上传失败，请检查网络连接', 'error')
    }
  }

  const handleVideoUpload = async (data: {
    title: string
    description: string
    isPublic: boolean
    file: File
  }) => {
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(data.file)
      })

      const result = await post1('/api/videos/upload', {
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        videoBase64: base64,
        fileSize: data.file.size
      })

      if (result.success && result.data) {
        showToast('视频上传成功！', 'success')
        showVideoUploadModal.value = false
        videoUploadModalRef.value?.reset()
        fetchVideos()
      } else {
        showToast(result.message || '上传失败', 'error')
      }
    } catch (e) {
      console.error('视频上传失败:', e)
      showToast('视频上传失败，请检查网络连接', 'error')
    }
  }

  const showToast = (message: string, type: string = 'success') => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }

  const resetView = () => {
    searchQuery.value = ''
    sortBy.value = 'newest'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    fetchImages()
    fetchVideos()
  })
</script>

<style scoped>
  /* 基础变量 */
  .gallery-app {
    --primary-color: #667eea;
    --primary-hover: #5a6fd6;
    --bg-color: transparent;
    --text-color: #e0e0e0;
    --card-bg: rgba(255, 255, 255, 0.05);
    --border-color: rgba(255, 255, 255, 0.1);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.4);
    --radius: 0.75rem;

    min-height: 100%;
    background: linear-gradient(135deg, #1e1b4b, #312e81, #3730a3);
    color: var(--text-color);
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    transition:
      background-color 0.3s,
      color 0.3s;
  }

  .gallery-app.dark-mode {
    --bg-color: transparent;
    --text-color: #e0e0e0;
    --card-bg: rgba(255, 255, 255, 0.08);
    --border-color: rgba(255, 255, 255, 0.15);
    background: linear-gradient(135deg, #1e1b4b, #312e81, #3730a3);
  }

  /* 头部样式 */
  .app-header {
    background: transparent;
    position: sticky;
    top: 0;
    z-index: 40;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .dark-mode .app-header {
    background: transparent;
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  .header-content {
    padding: 0 2rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    .header-content {
      padding: 0 0.75rem;
      height: 3.5rem;
    }

    .header-actions {
      gap: 0.5rem;
    }

    .primary-btn span {
      display: none;
    }

    .primary-btn {
      padding: 0.5rem;
      font-size: 0.85rem;
    }

    .logo-area h1 {
      font-size: 1rem;
    }

    .logo-icon {
      width: 2rem;
      height: 2rem;
      font-size: 1rem;
    }
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .logo-icon {
    width: 2.5rem;
    height: 2.5rem;
    background-color: var(--primary-color);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
    box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
  }

  .logo-area h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.025em;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .icon-btn {
    padding: 0.5rem;
    border-radius: 9999px;
    color: #6b7280;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .icon-btn:hover {
    background-color: #f3f4f6;
    color: var(--text-color);
  }

  .dark-mode .icon-btn:hover {
    background-color: #374151;
  }

  .primary-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);
  }

  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  /* Tab 切换栏 */
  .tab-bar {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.5rem 2rem 0;
    background-color: transparent;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 1.2rem;
    border: 1px solid var(--border-color);
    border-radius: 0.4rem 0.4rem 0 0;
    background-color: rgba(255, 255, 255, 0.05);
    color: #9ca3af;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(5px);
  }

  .tab-btn:hover {
    color: var(--text-color);
    background-color: rgba(255, 255, 255, 0.1);
  }

  .tab-btn.active {
    color: var(--primary-color);
    background-color: var(--card-bg);
    border-bottom-color: var(--card-bg);
    box-shadow: 0 -2px 10px rgba(102, 126, 234, 0.15);
  }

  .tab-btn i {
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    .tab-bar {
      padding: 0.35rem 0.75rem 0;
      gap: 0.2rem;
    }

    .tab-btn {
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
    }

    .tab-btn span {
      display: none;
    }
  }

  /* 主内容区 */
  .app-main {
    z-index: 10;
    padding: 2rem 2rem 6rem;
    background-color: transparent;
    min-height: calc(100vh - 4rem);
  }

  @media (max-width: 768px) {
    .app-main {
      padding: 1rem 0.75rem 5rem;
    }
  }

  /* 控制栏 */
  .control-bar {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
    background-color: var(--card-bg);
    padding: 1rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    backdrop-filter: blur(5px);
  }

  @media (min-width: 768px) {
    .control-bar {
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
    }
  }

  .search-box {
    position: relative;
    flex: 1;
    max-width: 32rem;
    min-width: 12rem;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: #f9fafb;
    color: var(--text-color);
    outline: none;
    transition: all 0.2s;
  }

  .search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
    background-color: var(--card-bg);
  }

  .dark-mode .search-input {
    background-color: #374151;
    border-color: #4b5563;
  }

  .filter-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 100%;
    flex-wrap: wrap;
  }

  @media (max-width: 767px) {
    .filter-controls {
      display: flex;
      flex-wrap: nowrap;
      gap: 0.5rem;
    }

    .filter-controls .select-input {
      flex: 1;
      min-width: 0;
      font-size: 0.8rem;
      padding: 0.4rem 1.6rem 0.4rem 0.5rem;
    }

    .filter-controls .view-toggle {
      display: none;
    }
  }

  .select-input {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: #f9fafb;
    color: var(--text-color);
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
  }

  .select-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }

  .dark-mode .select-input {
    background-color: #374151;
    border-color: #4b5563;
  }

  .view-toggle {
    display: flex;
    background-color: #f3f4f6;
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .dark-mode .view-toggle {
    background-color: #374151;
  }

  .toggle-btn {
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-btn.active {
    background-color: white;
    color: var(--primary-color);
    box-shadow: var(--shadow-sm);
  }

  .dark-mode .toggle-btn.active {
    background-color: #4b5563;
    color: white;
  }

  /* 状态栏 */
  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .count-text strong {
    color: var(--text-color);
  }

  .loading-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
  }

  /* 视频容器 */
  .video-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 640px) {
    .video-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .video-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1280px) {
    .video-container {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* 图片容器 */
  .image-container.grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 640px) {
    .image-container.grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .image-container.grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1280px) {
    .image-container.grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .image-container.list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* 空状态 */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: var(--radius);
    backdrop-filter: blur(5px);
  }

  .dark-mode .empty-state {
    background-color: rgba(31, 41, 55, 0.5);
  }

  .empty-icon {
    background-color: #f3f4f6;
    padding: 1.5rem;
    border-radius: 9999px;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }

  .dark-mode .empty-icon {
    background-color: #374151;
  }

  .empty-icon i {
    font-size: 2rem;
    color: #9ca3af;
  }

  .empty-state h3 {
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 0.25rem;
  }

  .empty-state p {
    color: #6b7280;
    margin-bottom: 1rem;
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem;
  }

  .link-btn:hover {
    text-decoration: underline;
  }

  /* Toast 提示 */
  .toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background-color: #1f2937;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 60;
  }

  .toast.success i {
    color: #4ade80;
  }

  .toast.info i {
    color: #60a5fa;
  }

  /* 动画 */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }

  .toast-slide-enter-active,
  .toast-slide-leave-active {
    transition: all 0.3s ease;
  }

  .toast-slide-enter-from,
  .toast-slide-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
</style>
