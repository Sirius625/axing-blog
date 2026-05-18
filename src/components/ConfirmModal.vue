<template>
  <Teleport to="body">
    <transition name="confirm-fade">
      <div v-if="visible" class="confirm-overlay" @click.self="handleCancel">
        <div class="confirm-box" :class="{ 'confirm-box--mobile': isMobile }">
          <div class="confirm-header">
            <h3>{{ title }}</h3>
          </div>
          <div class="confirm-body">
            <p>{{ message }}</p>
          </div>
          <div class="confirm-footer">
            <button class="confirm-btn confirm-btn--cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button
              class="confirm-btn confirm-btn--ok"
              :class="[`confirm-btn--${type}`]"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  type ConfirmType = 'primary' | 'warning' | 'error'

  const props = withDefaults(
    defineProps<{
      visible: boolean
      title?: string
      message: string
      type?: ConfirmType
      confirmText?: string
      cancelText?: string
    }>(),
    {
      title: '提示',
      type: 'primary',
      confirmText: '确认',
      cancelText: '取消'
    }
  )

  const emit = defineEmits<{
    confirm: []
    cancel: []
    'update:visible': [value: boolean]
  }>()

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

  const handleConfirm = () => {
    emit('confirm')
    emit('update:visible', false)
  }

  const handleCancel = () => {
    emit('cancel')
    emit('update:visible', false)
  }
</script>

<style scoped>
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

  .confirm-box {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
    width: 380px;
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
    color: #f1f5f9;
  }

  .confirm-body {
    padding: 12px 24px 20px;
  }

  .confirm-body p {
    margin: 0;
    font-size: 14px;
    color: #94a3b8;
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
    background: rgba(255, 255, 255, 0.06);
    color: #94a3b8;
  }

  .confirm-btn--cancel:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
  }

  .confirm-btn--ok {
    color: #fff;
  }

  .confirm-btn--primary {
    background: #6366f1;
  }

  .confirm-btn--primary:hover {
    background: #4f46e5;
  }

  .confirm-btn--warning {
    background: #f59e0b;
    color: #1c1917;
  }

  .confirm-btn--warning:hover {
    background: #d97706;
  }

  .confirm-btn--error {
    background: #ef4444;
  }

  .confirm-btn--error:hover {
    background: #dc2626;
  }

  /* 动画 */
  .confirm-fade-enter-active {
    transition: all 0.25s ease;
  }

  .confirm-fade-leave-active {
    transition: all 0.2s ease;
  }

  .confirm-fade-enter-from {
    opacity: 0;
  }

  .confirm-fade-enter-from .confirm-box {
    transform: scale(0.92);
  }

  .confirm-fade-leave-to {
    opacity: 0;
  }
</style>
