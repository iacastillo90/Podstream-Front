import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios'
import type { ApiResponse, AppError } from '@/types/api'
import { useAuthStore } from '@/stores/auth'

const api: AxiosInstance = axios.create({
  baseURL: '/api', // Standard prefix, let Nginx handle proxying
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de Petición: Seguridad
 */
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('auth_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Opcional: ID de sesión para trazabilidad en logs del Backend
    const sessionId = localStorage.getItem('x_session_id')
    if (sessionId) {
      config.headers['X-Session-Id'] = sessionId
    }

    return config
  },
  (error) => Promise.reject(error),
)

/**
 * Interceptor de Respuesta: El "Filtro Inteligente"
 */
api.interceptors.response.use(
  (response) => {
    if (!response.data) {
      const error: AppError = {
        message: 'Respuesta vacía del servidor',
        status: response.status,
        isBusinessError: false,
      }
      return Promise.reject(error)
    }

    const { success, data, message } = response.data

    // 1. Caso estándar: Respuesta envuelta en ApiResponse
    if (success === true) {
      return data
    }

    // 2. Caso Auth/Legacy: Respuesta directa con token (backend no envuelve login todavía?)
    if ((response.data as any)?.token) {
      return response.data
    }

    // 3. Lax check for unwrapped objects (like User profile or Dashboard stats)
    if ((response.data as any)?.id || response.config.url?.includes('/admin/stats')) {
      return response.data
    }

    // 4. Lax check for Arrays (Lists)
    if (Array.isArray(response.data)) {
      return response.data
    }

    console.warn('API Interceptor Rejecting:', { url: response.config.url, data: response.data })

    // Business Error (success: false)
    const error: AppError = {
      message: message || 'Error de negocio desconocido',
      status: response.status,
      isBusinessError: true,
    }
    return Promise.reject(error)
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const authStore = useAuthStore()
    const appError: AppError = {
      message: error.message || 'Error de red desconocido',
      status: error.response?.status,
      isBusinessError: false,
    }

    if (error.response) {
      appError.message = error.response.data?.message || appError.message

      switch (appError.status) {
        case 401:
          authStore.logout()
          window.location.href = '/login?expired=true'
          break
        case 403:
          appError.message = 'No tienes permisos para realizar esta acción'
          break
        case 500:
          appError.message = 'Error crítico en el servidor. Contacte a soporte.'
          break
      }
    }

    return Promise.reject(appError)
  },
)

export const ContactService = {
  sendMessage: (data: { name: string; email: string; subject: string; message: string }) => {
    return api.post('/contact', data)
  },
}

export const ReviewService = {
  getAll: (productId: string) => api.get(`/products/${productId}/reviews`),
  create: (productId: string, data: any) => api.post(`/products/${productId}/reviews`, data),
}

export const RecommendationService = {
  getContentBased: (productId: string) => api.get(`/products/${productId}/recommendations`),
  getCollaborative: (userId: string) => api.get(`/recommendations/collaborative/${userId}`),
  getUserRecommendations: (userId: string | number, limit = 4) =>
    api.get(`/recommendations/user/${userId}`, { params: { limit } }),
}

export default api
