import api from './api'
import type { StudioItem } from '@/types'

export const StudioService = {
  async getCatalog(): Promise<StudioItem[]> {
    return await api.get('/studio/catalog')
  },

  async saveBuild(payload: { name: string; items: any[] }): Promise<void> {
    return await api.post('/studio/builds', payload)
  },

  async getMyBuilds(): Promise<Record<string, unknown>[]> {
    // Return type based on store expectation
    return await api.get('/studio/builds/me')
  },
}
