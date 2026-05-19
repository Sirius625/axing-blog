<template>
  <Teleport to="body">
    <!-- Toast 消息提示 -->
    <transition-group
      name="toast"
      tag="div"
      class="toast-container"
      :class="{ 'toast-container--mobile': isMobile }"
    >
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="toast-item"
        :class="[`toast-item--${msg.type}`, { 'toast-item--mobile': isMobile }]"
      >
        <span class="toast-icon">
          <template v-if="msg.type === 'success'">✓</template>
          <template v-else-if="msg.type === 'error'">✕</template>
          <template v-else-if="msg.type === 'warning'">!</template>
          <template v-else>i</template>
        </span>
        <span class="toast-message">{{ msg.message }}</span>
      </div>
    </transition-group>

    <!-- Confirm 确认框 -->
    <transition name="confirm">
      <div v-if="confirmState.visible" class="confirm-overlay" @click.self="handleConfirmCancel">
        <div class="confirm-box" :class="{ 'confirm-box--mobile': isMobile }">
          <div class="confirm-header">
            <h3>{{ confirmState.title || '提示' }}</h3>
          </div>
          <div class="confirm-body">
            <p>{{ confirmState.message }}</p>
          </div>
          <div class="confirm-footer">
            <button class="confirm-btn confirm-btn--cancel" @click="handleConfirmCancel">
              {{ confirmState.cancelText || '取消' }}
            </button>
            <button
              class="confirm-btn confirm-btn--ok"
              :class="[`confirm-btn--${confirmState.type || 'primary'}`]"
              @click="handleConfirmOk"
            >
              {{ confirmState.confirmText || '确认' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, onUnmounted } from 'vue'

  // ==================== 类型定义 ====================
  type MessageType = 'success' | 'error' | 'warning' | 'info'
  type ConfirmType = MessageType | 'primary'

  interface MessageItem {
    id: number
    type: MessageType
    message: string
    duration: number
  }

  interface ConfirmOptions {
    title?: string
    message: string
    type?: ConfirmType
    confirmText?: string
    cancelText?: string
  }

  // ==================== Toast 消息状态 ====================
  const messages = ref<MessageItem[]>([])
  let msgId = 0

  const addMessage = (type: MessageType, message: string, duration = 2000) => {
    const id = ++msgId
    const item: MessageItem = { id, type, message, duration }
    messages.value.push(item)
    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id)
      }, duration)
    }
  }

  const removeMessage = (id: number) => {
    const idx = messages.value.findIndex((m) => m.id === id)
    if (idx !== -1) {
      messages.value.splice(idx, 1)
    }
  }

  // ==================== Confirm 确认框状态 ====================
  interface ConfirmState extends ConfirmOptions {
    visible: boolean
    resolve: ((value: boolean) => void) | null
  }

  const confirmState = reactive<ConfirmState>({
    visible: false,
    message: '',
    title: '',
    type: 'primary',
    confirmText: '',
    cancelText: '',
    resolve: null
  })

  const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmState.visible = true
      confirmState.message = options.message
      confirmState.title = options.title || '提示'
      confirmState.type = options.type || 'primary'
      confirmState.confirmText = options.confirmText || '确认'
      confirmState.cancelText = options.cancelText || '取消'
      confirmState.resolve = resolve
    })
  }

  const handleConfirmOk = () => {
    confirmState.visible = false
    confirmState.resolve?.(true)
  }

  const handleConfirmCancel = () => {
    confirmState.visible = false
    confirmState.resolve?.(false)
  }

  // ==================== 响应式检测 ====================
  const isMobile = ref(false)

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  // ==================== 暴露 API ====================
  defineExpose({
    success: (msg: string, duration?: number) => addMessage('success', msg, duration),
    error: (msg: string, duration?: number) => addMessage('error', msg, duration),
    warning: (msg: string, duration?: number) => addMessage('warning', msg, duration),
    info: (msg: string, duration?: number) => addMessage('info', msg, duration),
    confirm: (options: ConfirmOptions) => showConfirm(options)
  })
</script>

<style scoped>
  /* ==================== Toast 容器 ==================== */
  .toast-container {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    pointer-events: none;
  }

  .toast-container--mobile {
    top: 60px;
    left: 16px;
    right: 16px;
    transform: none;
  }

  /* ==================== Toast 条目 ==================== */
  .toast-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 15px;
    color: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    max-width: 500px;
    word-break: break-word;
  }

  .toast-item--mobile {
    width: 100%;
    max-width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .toast-item--success {
    background: #10b981;
  }

  .toast-item--error {
    background: #ef4444;
  }

  .toast-item--warning {
    background: #f59e0b;
    color: #1c1917;
  }

  .toast-item--info {
    background: #3b82f6;
  }

  .toast-icon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    background: rgba(255, 255, 255, 0.25);
  }

  .toast-item--warning .toast-icon {
    background: rgba(0, 0, 0, 0.15);
  }

  .toast-message {
    line-height: 1.4;
  }

  /* ==================== Toast 动画 ==================== */
  .toast-enter-active {
    transition: all 0.35s ease;
  }

  .toast-leave-active {
    transition: all 0.25s ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translateY(-16px) scale(0.95);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }

  /* ==================== Confirm 遮罩 ==================== */
  .confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  /* ==================== Confirm 弹窗 ==================== */
  .confirm-box {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
    width: 400px;
    max-width: 90vw;
    overflow: hidden;
  }

  .confirm-box--mobile {
    width: 88vw;
    border-radius: 10px;
  }

  .confirm-header {
    padding: 20px 24px 0;
  }

  .confirm-header h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #1f2937;
  }

  .confirm-body {
    padding: 12px 24px 20px;
  }

  .confirm-body p {
    margin: 0;
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
  }

  .confirm-footer {
    display: flex;
    gap: 10px;
    padding: 0 24px 20px;
  }

  .confirm-box--mobile .confirm-footer {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .confirm-btn {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .confirm-btn--cancel {
    background: #f3f4f6;
    color: #6b7280;
  }

  .confirm-btn--cancel:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .confirm-btn--ok {
    color: #fff;
  }

  .confirm-btn--primary {
    background: #3b82f6;
  }

  .confirm-btn--primary:hover {
    background: #2563eb;
  }

  .confirm-btn--error {
    background: #ef4444;
  }

  .confirm-btn--error:hover {
    background: #dc2626;
  }

  .confirm-btn--warning {
    background: #f59e0b;
    color: #1c1917;
  }

  .confirm-btn--warning:hover {
    background: #d97706;
  }

  /* Confirm 动画 */
  .confirm-enter-active {
    transition: all 0.25s ease;
  }

  .confirm-leave-active {
    transition: all 0.2s ease;
  }

  .confirm-enter-from {
    opacity: 0;
  }

  .confirm-enter-from .confirm-box {
    transform: scale(0.92);
  }

  .confirm-leave-to {
    opacity: 0;
  }
</style>
