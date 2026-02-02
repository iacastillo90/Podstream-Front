import api from './api'
import type { AudioSample } from '@/types'

export const AudioLabService = {
  async getSamples(productId?: string): Promise<AudioSample[]> {
    const params = productId ? { productId } : {}
    return await api.get('/audiolab/samples', { params })
  },
}
