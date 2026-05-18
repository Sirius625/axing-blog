<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>上传视频</h3>
          <button class="close-btn" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- 文件选择区域 -->
          <div class="upload-zone" @click="triggerFileInput">
            <input
              ref="fileInputRef"
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/x-matroska"
              class="hidden-input"
              @change="handleFileSelect"
            />
            <div v-if="!previewUrl" class="upload-placeholder">
              <div class="upload-icon">
                <i class="fas fa-video"></i>
              </div>
              <p class="upload-text">点击选择视频</p>
              <p class="upload-hint">支持 MP4、WebM、OGG、MKV，最大 100MB</p>
            </div>
            <div v-else class="preview-area">
              <video :src="previewUrl" class="preview-video" controls></video>
              <div class="file-info">
                <span class="file-name">{{ fileName }}</span>
                <span class="file-size">{{ formatFileSize(fileSize) }}</span>
              </div>
              <button class="change-btn" @click.stop="triggerFileInput">重新选择</button>
            </div>
          </div>

          <!-- 标题输入 -->
          <div class="form-group">
            <label>视频标题</label>
            <input v-model="title" type="text" class="form-input" placeholder="请输入视频标题" />
          </div>

          <!-- 可见性选择 -->
          <div class="form-group">
            <label>可见性</label>
            <div class="radio-group">
              <label class="radio-label" :class="{ active: isPublic }">
                <input type="radio" v-model="isPublic" :value="true" />
                <i class="fas fa-globe"></i> 公开
              </label>
              <label class="radio-label" :class="{ active: !isPublic }">
                <input type="radio" v-model="isPublic" :value="false" />
                <i class="fas fa-lock"></i> 私密
              </label>
            </div>
          </div>

          <!-- 描述输入 -->
          <div class="form-group">
            <label>视频描述</label>
            <div class="textarea-wrapper">
              <textarea
                v-model="description"
                class="form-textarea"
                rows="5"
                maxlength="200"
                placeholder="请输入视频描述（可选）"
              ></textarea>
              <span class="word-count" :class="{ 'word-limit': description.length >= 200 }">
                {{ description.length }}/200
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="$emit('close')">取消</button>
          <button class="primary-btn" :disabled="uploading" @click="handleUpload">
            <i v-if="uploading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-upload"></i>
            {{ uploading ? '上传中...' : '确认上传' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps<{
    visible: boolean
  }>()

  const emit = defineEmits<{
    close: []
    upload: [{ title: string; description: string; isPublic: boolean; file: File }]
  }>()

  const fileInputRef = ref<HTMLInputElement | null>(null)
  const previewUrl = ref('')
  const fileData = ref<File | null>(null)
  const fileName = ref('')
  const fileSize = ref(0)
  const title = ref('')
  const description = ref('')
  const isPublic = ref(true)
  const uploading = ref(false)

  const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

  const triggerFileInput = () => {
    fileInputRef.value?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + 'B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
  }

  const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    if (file.size > MAX_VIDEO_SIZE) {
      alert('文件大小不能超过 100MB')
      return
    }

    if (!file.type.startsWith('video/')) {
      alert('仅支持视频格式（MP4/WebM/OGG/MKV）')
      return
    }

    fileData.value = file
    fileName.value = file.name
    fileSize.value = file.size
    const reader = new FileReader()
    reader.onload = (event) => {
      previewUrl.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    if (!fileData.value) {
      alert('请先选择视频')
      return
    }
    if (!title.value) {
      alert('请输入视频标题')
      return
    }

    uploading.value = true
    emit('upload', {
      title: title.value,
      description: description.value,
      isPublic: isPublic.value,
      file: fileData.value
    })
  }

  // 暴露重置方法给父组件
  const reset = () => {
    previewUrl.value = ''
    fileData.value = null
    fileName.value = ''
    fileSize.value = 0
    title.value = ''
    description.value = ''
    uploading.value = false
  }

  defineExpose({ reset })
</script>

<style scoped>
  .hidden-input {
    display: none;
  }

  .modal-overlay {
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
    background-color: #fff;
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
    overflow-y: auto;
    flex: 1;
  }

  .upload-zone {
    border: 2px dashed #d1d5db;
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1.5rem;
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

  .preview-area {
    text-align: center;
  }

  .preview-video {
    max-width: 100%;
    max-height: 240px;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    background: #000;
  }

  .file-info {
    display: flex;
    justify-content: center;
    gap: 1rem;
    font-size: 0.8rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .file-name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    color: #9ca3af;
  }

  .change-btn {
    font-size: 0.8rem;
    color: var(--primary-color);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
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

  .textarea-wrapper {
    position: relative;
    padding-bottom: 1.75rem;
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

  .word-count {
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    font-size: 0.75rem;
    color: #9ca3af;
    pointer-events: none;
  }

  .word-count.word-limit {
    color: #ef4444;
  }

  .radio-group {
    display: flex;
    gap: 1rem;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: #374151;
    transition: all 0.2s;
    background-color: white;
  }

  .radio-label input {
    display: none;
  }

  .radio-label.active {
    border-color: var(--primary-color);
    background-color: rgba(79, 70, 229, 0.08);
    color: var(--primary-color);
  }

  .radio-label i {
    font-size: 0.9rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    background-color: #f9fafb;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
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

  .primary-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
</style>
