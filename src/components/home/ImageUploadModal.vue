<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>上传图片</h3>
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
              accept="image/jpeg,image/png,image/webp"
              class="hidden-input"
              @change="handleFileSelect"
            />
            <div v-if="!previewUrl" class="upload-placeholder">
              <div class="upload-icon">
                <i class="fas fa-cloud-upload-alt"></i>
              </div>
              <p class="upload-text">点击选择图片</p>
              <p class="upload-hint">支持 JPG、PNG、WebP，最大 5MB</p>
            </div>
            <div v-else class="preview-area">
              <img :src="previewUrl" alt="预览" class="preview-img" />
              <button class="change-btn" @click.stop="triggerFileInput">重新选择</button>
            </div>
          </div>

          <!-- 标题输入 -->
          <div class="form-group">
            <label>图片标题</label>
            <input
              v-model="title"
              type="text"
              class="form-input"
              placeholder="请输入图片标题"
            />
          </div>

          <!-- 描述输入 -->
          <div class="form-group">
            <label>图片描述</label>
            <textarea
              v-model="description"
              class="form-textarea"
              rows="3"
              placeholder="请输入图片描述（可选）"
            ></textarea>
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
  upload: [{ title: string; description: string; file: File }]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const fileData = ref<File | null>(null)
const title = ref('')
const description = ref('')
const uploading = ref(false)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过5MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('仅支持JPG/PNG/WebP格式')
    return
  }

  fileData.value = file
  const reader = new FileReader()
  reader.onload = (event) => {
    previewUrl.value = event.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleUpload = () => {
  if (!fileData.value) {
    alert('请先选择图片')
    return
  }
  if (!title.value) {
    alert('请输入图片标题')
    return
  }

  uploading.value = true
  emit('upload', {
    title: title.value,
    description: description.value,
    file: fileData.value
  })
}

// 暴露重置方法给父组件
const reset = () => {
  previewUrl.value = ''
  fileData.value = null
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

.preview-img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
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
