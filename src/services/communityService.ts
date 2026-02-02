import api from './api'
import type { SetupPost } from '@/types'

export const CommunityService = {
  async getPosts(filters?: Record<string, string>): Promise<SetupPost[]> {
    return await api.get('/community/posts', { params: filters })
  },

  async likePost(id: string): Promise<void> {
    return await api.post(`/community/posts/${id}/like`)
  },
}
