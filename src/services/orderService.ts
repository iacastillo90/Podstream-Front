import api from './api'
import type { Order } from '@/types'

export const orderService = {
  /**
   * Obtiene los pedidos del usuario actual
   */
  async getMyOrders(): Promise<Order[]> {
    return await api.get('/orders/my-orders')
  },

  /**
   * Obtiene un pedido por ID
   */
  async getById(id: number | string): Promise<Order> {
    return await api.get(`/orders/${id}`)
  },

  /**
   * Crea una orden a partir del carrito actual
   * Endpoint: POST /api/orders/create-from-cart
   */
  async createFromCart(): Promise<Order> {
    return await api.post('/orders/create-from-cart')
  },

  /**
   * Confirma la recepción del pedido (Cliente)
   * Endpoint: POST /api/orders/{id}/confirm-delivery
   */
  async confirmDelivery(id: number | string): Promise<void> {
    return await api.post(`/orders/${id}/confirm-delivery`)
  },

  /**
   * Admin: Obtener todas las órdenes
   * Endpoint: GET /api/admin/orders (Assuming standard pattern)
   */
  async getAll(): Promise<Order[]> {
    return await api.get('/admin/orders')
  },
}

export const OrderService = orderService
