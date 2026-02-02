import api from './api'
import { ProductService } from '@/services/productService'
import type { Product, Category } from '@/types'

export const InventoryService = {
  async getAll(): Promise<Product[]> {
    return await api.get('/inventory')
  },

  async updateStock(id: number, stock: number): Promise<Product> {
    return await api.patch(`/inventory/${id}/stock`, { stock })
  },
}

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    return await ProductService.getCategories()
  },

  async create(category: Partial<Category>): Promise<Category> {
    return await api.post('/categories', category)
  },

  async update(id: number | string, category: Partial<Category>): Promise<Category> {
    return await api.put(`/categories/${id}`, category)
  },

  async delete(id: number | string): Promise<void> {
    return await api.delete(`/categories/${id}`)
  },
}
