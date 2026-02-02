import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  timeout?: number
}

export const useUIStore = defineStore('ui', () => {
  // State
  const globalLoading = ref(false)
  const sidebarOpen = ref(false)
  const notifications = ref<Notification[]>([])

  // Actions
  const setLoading = (loading: boolean) => {
    globalLoading.value = loading
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setSidebar = (value: boolean) => {
    sidebarOpen.value = value
  }

  const showToast = (message: string, type: Notification['type'] = 'info', timeout = 3000) => {
    const id = Date.now().toString()
    notifications.value.push({ id, type, message, timeout })

    if (timeout > 0) {
      setTimeout(() => {
        removeToast(id)
      }, timeout)
    }
  }

  const removeToast = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    globalLoading,
    sidebarOpen,
    notifications,
    setLoading,
    toggleSidebar,
    setSidebar,
    showToast,
    removeToast,
  }
})
