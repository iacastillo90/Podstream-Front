import api from './api'
import type { Invoice } from '@/types'

export const InvoiceService = {
  async getAll(): Promise<any> {
    // The view expects response.data.data, so we assume the API returns standard generic response
    return await api.get('/invoices')
  },

  async markAsPaid(id: number | string): Promise<any> {
    return await api.patch(`/invoices/${id}/pay`)
  },

  async getById(id: number | string): Promise<Invoice> {
    return await api.get(`/invoices/${id}`)
  },
}
