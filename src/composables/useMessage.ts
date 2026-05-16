import { ref, onMounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import MessageModal from '@/components/MessageModal.vue'

type ConfirmType = 'success' | 'error' | 'warning' | 'info' | 'primary'

interface MessageAPI {
  success: (msg: string, duration?: number) => void
  error: (msg: string, duration?: number) => void
  warning: (msg: string, duration?: number) => void
  info: (msg: string, duration?: number) => void
  confirm: (options: {
    title?: string
    message: string
    type?: ConfirmType
    confirmText?: string
    cancelText?: string
  }) => Promise<boolean>
}

const messageRef = ref<ComponentPublicInstance<MessageAPI> | null>(null)

// 设置为全局可调用，用于 .ts 文件等非组件场景
let globalInstance: MessageAPI | null = null

export function setMessageInstance(instance: MessageAPI) {
  globalInstance = instance
  messageRef.value = instance as any
}

export function useMessage(): MessageAPI {
  // 如果在组件中调用，优先用 ref
  const getApi = (): MessageAPI => {
    if (messageRef.value) {
      return {
        success: (...args: [string, number?]) => (messageRef.value as any).success(...args),
        error: (...args: [string, number?]) => (messageRef.value as any).error(...args),
        warning: (...args: [string, number?]) => (messageRef.value as any).warning(...args),
        info: (...args: [string, number?]) => (messageRef.value as any).info(...args),
        confirm: (options: any) => (messageRef.value as any).confirm(options)
      }
    }
    if (globalInstance) {
      return globalInstance
    }
    // fallback：延迟到组件挂载后
    // 返回一个 proxy 延迟调用
    const delayedApi: MessageAPI = {
      success(msg: string, duration?: number) {
        setTimeout(() => {
          globalInstance?.success(msg, duration)
        }, 0)
      },
      error(msg: string, duration?: number) {
        setTimeout(() => {
          globalInstance?.error(msg, duration)
        }, 0)
      },
      warning(msg: string, duration?: number) {
        setTimeout(() => {
          globalInstance?.warning(msg, duration)
        }, 0)
      },
      info(msg: string, duration?: number) {
        setTimeout(() => {
          globalInstance?.info(msg, duration)
        }, 0)
      },
      confirm(options: any): Promise<boolean> {
        return new Promise((resolve) => {
          setTimeout(async () => {
            if (globalInstance) {
              const result = await globalInstance.confirm(options)
              resolve(result)
            } else {
              resolve(false)
            }
          }, 0)
        })
      }
    }
    return delayedApi
  }

  return getApi()
}

export default useMessage
