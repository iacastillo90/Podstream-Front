import api from './api'
import type { Category } from '@/types/product'

export const categoryService = {
  /**
   * Obtiene todas las categorías
   */
  async getAll(): Promise<Category[]> {
    return await api.get('/categories')
  },
}
