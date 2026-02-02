import api from './api'

export const paymentService = {
  /**
   * Creates a MercadoPago preference for an order
   * Endpoint: POST /api/payments/create-preference
   */
  async createPreference(orderId: number) {
    return await api.post('/payments/create-preference', { orderId })
  },

  /**
   * Admin: Refunds an order
   * Endpoint: POST /api/payments/{orderId}/refund
   */
  async refundOrder(orderId: number, reason?: string) {
    return await api.post(`/payments/${orderId}/refund`, { reason })
  },
}
