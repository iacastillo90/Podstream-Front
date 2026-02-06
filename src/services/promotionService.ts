import api from './api'

import type { Promotion } from '@/types'

export const PromotionService = {
  create: (data: Omit<Promotion, 'id'>) => {
    return api.post('/promotions', data) as unknown as Promise<unknown>
  },
  getAll: () => {
    return api.get<Promotion[]>('/promotions')
  },
  delete: (id: number | string) => {
    return api.delete(`/promotions/${id}`)
  },
  update: (id: number | string, data: Partial<Promotion>) => {
    return api.put(`/promotions/${id}`, data) as unknown as Promise<unknown>
  },
}
