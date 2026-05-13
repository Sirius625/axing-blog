<template>
  <div class="gallery-app pt-16" :class="{ 'dark-mode': isDark }">
    <!-- 头部导航 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-area" @click="resetView">
          <div class="logo-icon">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <h1 @click="handletop">Lumina Gallery</h1>
        </div>

        <div class="header-actions">
          <button @click="toggleTheme" class="icon-btn" title="切换主题">
            <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>
          <button @click="showUploadModal = true" class="primary-btn">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <span>上传作品</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <!-- 控制栏 -->
      <div class="control-bar">
        <div class="search-box">
          <i class="fa-solid fa-search search-icon"></i>
          <input v-model="searchQuery" type="text" placeholder="搜索图片标题或描述..." class="search-input">
        </div>

        <div class="filter-controls">
          <select v-model="sortBy" class="select-input">
            <option value="newest">最新上传</option>
            <option value="popular">最受欢迎</option>
            <option value="name">名称排序</option>
          </select>

          <div class="view-toggle">
            <button @click="viewMode = 'grid'" :class="['toggle-btn', { active: viewMode === 'grid' }]" title="网格视图">
              <i class="fa-solid fa-grid-2"></i>
            </button>
            <button @click="viewMode = 'list'" :class="['toggle-btn', { active: viewMode === 'list' }]" title="列表视图">
              <i class="fa-solid fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 状态栏 -->
      <div class="status-bar">
        <span class="count-text">共找到 <strong>{{ filteredImages.length }}</strong> 张图片</span>
        <span v-if="loading" class="loading-indicator">
          <i class="fa-solid fa-circle-notch fa-spin"></i> 加载中...
        </span>
      </div>

      <!-- 图片列表 -->
      <transition-group name="list" :tag="viewMode === 'grid' ? 'div' : 'div'" :class="['image-container', viewMode]">
        <div v-for="image in filteredImages" :key="image.id" class="image-card" @click="openPreview(image)">
          <div class="image-wrapper">
            <img :src="image.url" :alt="image.title" class="card-image" loading="lazy">
            <div class="image-overlay">
              <div class="overlay-content">
                <p class="overlay-title">{{ image.title }}</p>
                <p class="overlay-author">{{ image.author }}</p>
              </div>
            </div>
            <div class="like-badge">
              <i class="fa-solid fa-heart"></i> {{ image.likes }}
            </div>
          </div>

          <div class="card-info">
            <div class="info-header">
              <h3 class="info-title">{{ image.title }}</h3>
              <span class="info-date">{{ formatDate(image.date) }}</span>
            </div>
            <p class="info-desc">{{ image.description }}</p>
          </div>
        </div>
      </transition-group>

      <!-- 空状态 -->
      <div v-if="filteredImages.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">
          <i class="fa-regular fa-image"></i>
        </div>
        <h3>未找到相关图片</h3>
        <p>尝试更换搜索关键词或清除筛选条件</p>
        <button @click="searchQuery = ''" class="link-btn">清除搜索</button>
      </div>
    </main>

    <!-- 上传模态框 -->
    <transition name="modal-fade">
      <div v-if="showUploadModal" class="modal-overlay">
        <div class="modal-backdrop" @click="showUploadModal = false"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h3>上传新作品</h3>
            <button @click="showUploadModal = false" class="close-btn">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- 替换原有的上传区域 -->
          <div class="upload-zone">
            <div class="file-picker">
              <input type="file" accept="image/jpeg,image/png,image/webp" class="file-input" @change="handleFileSelect"
                ref="fileInput">
              <div class="picker-text">点击选择图片或拖拽至此</div>
            </div>
            <div v-if="previewUrl" class="preview-area">
              <img :src="previewUrl" alt="预览图" class="preview-img">
              <button @click="previewUrl = null" class="remove-btn">移除</button>
            </div>
            <div class="form-group">
              <label>图片标题</label>
              <input type="text" class="form-input" v-model="imageTitle">
            </div>
            <div class="form-group">
              <label>图片描述</label>
              <textarea class="form-textarea" v-model="imageDesc"></textarea>
            </div>
          </div>


          <div class="modal-footer">
            <button @click="showUploadModal = false" class="secondary-btn">取消</button>
            <button @click="handleUpload" class="primary-btn">
              <i class="fa-solid fa-check"></i> 确认上传
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 预览模态框 -->
    <transition name="modal-fade">
      <div v-if="previewImage" class="preview-overlay" @click.self="closePreview">
        <button @click="closePreview" class="preview-close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="preview-content">
          <img :src="previewImage.url" :alt="previewImage.title" class="preview-image">
          <div class="preview-info">
            <h2 class="preview-title">{{ previewImage.title }}</h2>
            <p class="preview-desc">{{ previewImage.description }}</p>
            <div class="preview-meta">
              <span><i class="fa-regular fa-user"></i> {{ previewImage.author }}</span>
              <span><i class="fa-regular fa-calendar"></i> {{ formatDate(previewImage.date) }}</span>
              <span class="meta-likes"><i class="fa-solid fa-heart"></i> {{ previewImage.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast 提示 -->
    <transition name="toast-slide">
      <div v-if="toast.show" :class="['toast', toast.type]">
        <i :class="toast.type === 'success' ? 'fa-solid fa-check-circle' : 'fa-solid fa-info-circle'"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { post1, get1, del1 } from '@/api/index1'

// 状态定义
const isDark = ref(false);
const searchQuery = ref('');
const sortBy = ref('newest');
const viewMode = ref('grid');
const showUploadModal = ref(false);
const previewImage = ref(null);
const loading = ref(true);
const uploading = ref(false);
const toast = ref({ show: false, message: '', type: 'success' });
const handletop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
};
const images = ref([]);

// 从后端获取图片列表
const fetchImages = async () => {
  loading.value = true
  try {
    const result = await get1('/api/images', { params: { page: 1, pageSize: 50 } })
    if (result.success && result.data) {
      const data = result.data.data || []
      images.value = data.map(img => ({
        id: img.id,
        url: 'http://localhost:3030' + img.url,
        title: img.title,
        description: img.description || '',
        author: img.author || '匿名',
        likes: img.likes || 0,
        date: img.created_at ? img.created_at.split(' ')[0] : '未知'
      }))
    }
  } catch (e) {
    console.error('获取图片列表失败:', e)
  } finally {
    loading.value = false
  }
}

// 计算属性
const filteredImages = computed(() => {
  let result = images.value.filter(img =>
    img.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    img.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (sortBy.value === 'popular') {
    result.sort((a, b) => b.likes - a.likes);
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return result;
});

// 方法
const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const openPreview = (image) => {
  previewImage.value = image;
  document.body.style.overflow = 'hidden';
};

const closePreview = () => {
  previewImage.value = null;
  document.body.style.overflow = '';
};



// 新增状态变量
const previewUrl = ref(''); // 存储预览图地址
const fileData = ref(null); // 存储文件二进制数据
const imageTitle = ref(''); // 图片标题
const imageDesc = ref(''); // 图片描述

// 文件选择事件处理
const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 校验文件大小（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    showToast('文件大小不能超过5MB', 'error');
    return;
  }

  // 校验文件类型
  if (!file.type.startsWith('image/')) {
    showToast('仅支持JPG/PNG/WebP格式', 'error');
    return;
  }

  // 生成预览图
  const reader = new FileReader();
  reader.onload = (event) => {
    previewUrl.value = event.target.result;
    fileData.value = file;
  };
  reader.readAsDataURL(file);
};

// 真实上传到后端
const handleUpload = async () => {
  if (!fileData.value) {
    showToast('请先选择图片', 'error');
    return;
  }
  if (!imageTitle.value) {
    showToast('请输入图片标题', 'error');
    return;
  }

  uploading.value = true
  try {
    // 将文件转为 base64
    const reader = new FileReader()
    const base64 = await new Promise((resolve) => {
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(fileData.value)
    })

    const result = await post1('/api/images/upload', {
      title: imageTitle.value,
      description: imageDesc.value,
      imageBase64: base64
    })

    if (result.success && result.data) {
      showToast('上传成功！', 'success');
      // 重置表单
      previewUrl.value = '';
      fileData.value = null;
      imageTitle.value = '';
      imageDesc.value = '';
      showUploadModal.value = false;
      // 刷新列表
      fetchImages()
    } else {
      showToast(result.message || '上传失败', 'error');
    }
  } catch (e) {
    console.error('上传失败:', e)
    showToast('上传失败，请检查网络连接', 'error');
  } finally {
    uploading.value = false
  }
};

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('zh-CN', options);
};

const resetView = () => {
  searchQuery.value = '';
  sortBy.value = 'newest';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  fetchImages()
});
</script>

<style scoped>
.file-picker {
  position: relative;
  width: 100%;
  height: 12rem;
  background-color: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.picker-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #9ca3af;
  font-size: 1rem;
  text-align: center;
}

.preview-area {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
}

.preview-img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 0.375rem;
  display: block;
  margin: 0 auto 0.5rem;
}

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

  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

.gallery-app.dark-mode {
  --bg-color: transparent;
  --text-color: #e0e0e0;
  --card-bg: rgba(255, 255, 255, 0.08);
  --border-color: rgba(255, 255, 255, 0.15);
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
}

/* 头部样式 */
.app-header {
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.8);
}

.dark-mode .app-header {
  background-color: rgba(31, 41, 55, 0.8);
}

.header-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-md);
}

.primary-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

/* 主内容区 */
.app-main {
  z-index: 10;
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  /* 确保主区域透明，透出背景图 */
  background-color: transparent;
  min-height: calc(100vh - 4rem);
}

/* 控制栏 */
.control-bar {
  display: flex;
  flex-direction: column;
  md: flex-row;
  gap: 1rem;
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
    justify-content: space-between;
  }
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 28rem;
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

/* 图片卡片 */
.image-card {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.image-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image-container.grid .image-wrapper {
  aspect-ratio: 4 / 3;
}

.image-container.list .image-wrapper {
  height: 12rem;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.image-card:hover .card-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  color: white;
  transform: translateY(1rem);
  transition: transform 0.3s ease;
}

.image-card:hover .overlay-content {
  transform: translateY(0);
}

.overlay-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.overlay-author {
  font-size: 0.75rem;
  color: #e5e7eb;
  margin-top: 0.25rem;
}

.like-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  box-shadow: var(--shadow-sm);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.like-badge i {
  color: #ef4444;
  margin-right: 0.25rem;
}

.image-card:hover .like-badge {
  opacity: 1;
}

.card-info {
  padding: 1rem;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.info-title {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.info-date {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  margin-left: 0.5rem;
}

.info-desc {
  font-size: 0.875rem;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* 模态框通用样式 */
.modal-overlay,
.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.modal-container {
  background-color: var(--card-bg);
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.25rem;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #4b5563;
}

.modal-body {
  padding: 1.5rem;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.upload-zone:hover {
  border-color: var(--primary-color);
  background-color: rgba(79, 70, 229, 0.05);
}

.upload-icon {
  font-size: 2.5rem;
  color: #9ca3af;
  margin-bottom: 0.75rem;
  transition: color 0.2s;
}

.upload-zone:hover .upload-icon {
  color: var(--primary-color);
}

.upload-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.upload-hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.dark-mode .form-group label {
  color: #d1d5db;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  color: #1f2937;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.dark-mode .form-input,
.dark-mode .form-textarea {
  background-color: #374151;
  border-color: #4b5563;
  color: white;
}

.modal-footer {
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.dark-mode .modal-footer {
  background-color: #1f2937;
}

.secondary-btn {
  padding: 0.5rem 1rem;
  color: #374151;
  background: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-btn:hover {
  background-color: #e5e7eb;
}

.dark-mode .secondary-btn {
  color: #d1d5db;
}

.dark-mode .secondary-btn:hover {
  background-color: #374151;
}

/* 预览模态框特定样式 */
.preview-overlay {
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
}

.preview-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  z-index: 20;
}

.preview-close:hover {
  color: white;
}

.preview-content {
  max-width: 64rem;
  width: 100%;
  max-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  max-height: 80vh;
  max-width: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.preview-info {
  margin-top: 1.5rem;
  text-align: center;
  color: white;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.preview-desc {
  color: #d1d5db;
  max-width: 48rem;
  margin: 0 auto 1rem;
}

.preview-meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: #9ca3af;
}

.meta-likes {
  color: #f87171;
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
