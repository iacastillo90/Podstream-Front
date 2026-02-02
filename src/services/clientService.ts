import api from './api'
import type { Client } from '@/types'

export const ClientService = {
  async getAll(): Promise<Client[]> {
    return await api.get('/clients')
  },

  async updateStatus(id: number | string, status: 'active' | 'inactive'): Promise<any> {
    return await api.patch(`/clients/${id}/status`, { status })
  },

  async delete(id: number | string): Promise<any> {
    return await api.delete(`/clients/${id}`)
  },
}
