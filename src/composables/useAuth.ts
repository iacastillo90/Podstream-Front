import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const { user, isAuthenticated } = storeToRefs(authStore)

  const userRole = computed(() => user.value?.role || 'GUEST')
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isClient = computed(() => user.value?.role === 'CLIENT')
  const currentUser = computed(() => user.value)

  return {
    currentUser,
    isAuthenticated,
    userRole,
    isAdmin,
    isClient,
    login: authStore.login,
    logout: authStore.logout,
    setUser: authStore.updateUser, // Mapping setUser to updateUser in store
  }
}
