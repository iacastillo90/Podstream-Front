import api from './api'
import type { Product, Category } from '@/types/product'
import type { PaginationResponse } from '@/types/api'

/**
 * Servicio de Productos alineado con IProductService.java
 */
export const ProductService = {
  /**
   * Obtiene todos los productos con paginación
   * El interceptor devuelve directamente el PaginationResponse
   */
  async getAll(
    page = 0,
    size = 10,
    filters: Record<string, unknown> = {}, // Replace fixed categoryId with generic filters object
  ): Promise<PaginationResponse<Product>> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())

    // Append all filters to query params
    Object.keys(filters).forEach((key) => {
      const value = filters[key]
      if (value !== null && value !== undefined && value !== '') {
        // Handle arrays (e.g. categories=[1,2])
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.append(key, value.join(','))
          }
        } else {
          params.append(key, value.toString())
        }
      }
    })

    return await api.get('/products', { params })
  },

  /**
   * Búsqueda avanzada vía Elasticsearch
   */
  async search(query: string): Promise<Product[]> {
    return await api.get('/search/products', {
      params: { query },
    })
  },

  /**
   * Obtiene un producto por ID
   */
  async getById(id: number): Promise<Product> {
    return await api.get(`/products/${id}`)
  },

  /**
   * Crea un nuevo producto (Solo Admin)
   * Enviamos el objeto que coincide con ProductDTO.java
   */
  async create(product: Omit<Product, 'id'>): Promise<Product> {
    return await api.post('/products', product)
  },

  /**
   * Actualiza stock o detalles
   */
  async update(id: number, product: Partial<Product>): Promise<Product> {
    return await api.put(`/products/${id}`, product)
  },

  /**
   * Obtiene todas las categorías para los filtros
   */
  async getCategories(): Promise<Category[]> {
    return await api.get('/categories')
  },

  /**
   * Obtiene especificaciones normalizadas para versus/comparación
   */
  async getSpecsNormalized(id: number | string): Promise<unknown> {
    return await api.get(`/products/${id}`)
  },

  /**
   * Sube un modelo 3D (.glb) para un producto
   */
  async uploadModel3D(productId: number, file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    return await api.post(`/admin/products/${productId}/model3d`, formData, {
      headers: {
        'Content-Type': null,
      },
      timeout: 300000,
    })
  },

  /**
   * Obtiene metadatos reales del backend para filtros dinámicos
   * Endpoint: GET /api/products/metadata
   */
  async getSearchMetadata(currentFilters: Record<string, unknown> = {}): Promise<unknown> {
    const params = new URLSearchParams()
    // Pass current filters to metadata endpoint to get context-aware counts
    Object.keys(currentFilters).forEach((key) => {
      const value = currentFilters[key]
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) params.append(key, value.join(','))
        } else {
          params.append(key, String(value))
        }
      }
    })

    return await api.get('/products/metadata', { params })
  },
}
