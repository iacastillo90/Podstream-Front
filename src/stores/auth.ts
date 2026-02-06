import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthService } from '@/services/authService'
import type { User } from '@/types/auth'
import type { RegisterRequest } from '@/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role === 'ADMIN')

    // Actions
    const login = async (credentials: { username: string; password: string }) => {
      // Interceptor unwraps response, so we get AuthResponse directly
      const data = await AuthService.login(credentials)
      console.log('Login data received:', data)

      // AuthResponse might be flat OR nested with 'user' object
      token.value = data.token

      const payload = data as unknown as { user?: User }
      const userData = payload.user || (data as unknown as User)

      if (userData) {
        // Normalize role: Backend sends 'USER', frontend uses 'CLIENT'
        const roleRaw = String(userData.role)
        // Normalize both 'USER' and potential lowercase 'user' or 'client' just in case
        const role = roleRaw === 'USER' || roleRaw === 'user' ? 'CLIENT' : roleRaw

        // Construct name if separated
        const name =
          userData.name ||
          (userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.email)

        if (userData.id || userData.email) {
          user.value = {
            id: userData.id,
            name: name,
            email: userData.email,
            role: role as import('@/types/auth').UserRole,
          }
        }
      }

      // Always fetch full profile to ensure we have the correct data (and role)
      try {
        await fetchProfile()
      } catch (e) {
        console.warn('Failed to fetch profile after login:', e)
        // Ensure we at least have the basic info from login response if available
        if (!user.value && data.name) {
          user.value = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          }
        }
      }

      // Legacy support if needed, but Persist plugin handles 'podstream_auth' key usually
      localStorage.setItem('auth_token', data.token)

      return data
    }

    const register = async (registerData: RegisterRequest) => {
      const data = await AuthService.register(registerData)

      token.value = data.token
      user.value = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }

      localStorage.setItem('auth_token', data.token)
      return data
    }

    const fetchProfile = async () => {
      if (!token.value) return
      try {
        const userData = await AuthService.me()
        user.value = userData
      } catch (error) {
        console.error('Error fetching profile:', error)
        // Do NOT logout automatically here.
        // Let the interceptor handle 401s, or the caller handle the error.
        throw error
      }
    }

    const logout = () => {
      user.value = null
      token.value = null
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }

    const updateUser = (userData: User) => {
      user.value = userData
    }

    return {
      user,
      token,
      isAuthenticated,
      isAdmin,
      login,
      register,
      fetchProfile,
      logout,
      updateUser,
    }
  },
  {
    persist: true, // Enabled for pinia-plugin-persistedstate
  },
)
