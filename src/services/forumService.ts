import api from './api'
import type { ForumCategory, ForumTopic, ForumPost, ForumStats } from '@/types/forum'

export const ForumService = {
  // --- Categories ---
  async getCategories(): Promise<ForumCategory[]> {
    return await api.get('/forum/categories')
  },

  async getCategory(idOrSlug: string | number): Promise<ForumCategory> {
    return await api.get(`/forum/categories/${idOrSlug}`)
  },

  // --- Topics ---
  async getHomeStats(): Promise<ForumStats> {
    // If backend doesn't have this yet, return mock or try endpoint
    return await api.get('/forum/stats')
  },

  async getRecentTopics(limit = 5): Promise<ForumTopic[]> {
    const response = await api.get('/forum/topics/recent', { params: { limit } })
    const payload = response as unknown as { content?: ForumTopic[] }
    return payload.content || (Array.isArray(response) ? response : [])
  },

  async getPopularTopics(limit = 5): Promise<ForumTopic[]> {
    const response = await api.get('/forum/topics/popular', { params: { limit } })
    const payload = response as unknown as { content?: ForumTopic[] }
    return payload.content || (Array.isArray(response) ? response : [])
  },

  async getTopicsByCategory(
    categoryId: number,
    page = 0,
    size = 10,
  ): Promise<{ content: ForumTopic[]; totalElements: number; totalPages: number }> {
    const response = await api.get(`/forum/categories/${categoryId}/topics`, {
      params: { page, size },
    })
    // If interceptor unwraps it, response is the object. If not, check .data
    // Cast to unknown first to avoid ESLint 'unexpected any' if possible, or use a specific type assertion
    const payload = response as unknown as { data?: any }
    return payload.data || payload
  },

  async getTopic(id: number | string): Promise<ForumTopic> {
    if (!id || id === 'NaN' || Number.isNaN(Number(id))) throw new Error('Invalid Topic ID')
    const response = await api.get(`/forum/topics/${id}`)

    // Map author info if it's a nested object
    if (response && typeof response === 'object') {
      const topic = response as any

      // Construct logical author name
      let authorName = 'Usuario desconocido'
      if (topic.author) {
        if (topic.author.firstname && topic.author.lastname) {
          authorName = `${topic.author.firstname} ${topic.author.lastname}`
        } else if (topic.author.username) {
          authorName = topic.author.username
        } else if (topic.author.email) {
          authorName = topic.author.email
        }
      } else if (topic.authorName) {
        authorName = topic.authorName
      }

      return {
        ...topic,
        authorName,
        categoryName: topic.category?.name || topic.categoryName || 'Sin categoría',
        isPinned: topic.pinned || false,
        isLocked: topic.locked || false,
        repliesCount: topic.repliesCount || 0,
        views: topic.views || 0,
      }
    }

    return response
  },

  async createTopic(data: {
    categoryId: number
    title: string
    content: string
  }): Promise<ForumTopic> {
    return await api.post('/forum/topics', data)
  },

  // --- Posts (Replies) ---
  async getPosts(
    topicId: number | string,
    page = 0,
    size = 10,
  ): Promise<{ content: ForumPost[]; totalElements: number; totalPages: number }> {
    if (!topicId || topicId === 'NaN' || Number.isNaN(Number(topicId)))
      throw new Error('Invalid Topic ID')

    const response = await api.get(`/forum/topics/${topicId}/posts`, {
      params: { page, size },
    })

    // Helper function to map author name (reused logic)
    const mapAuthorName = (item: any) => {
      if (item.author) {
        if (item.author.firstname && item.author.lastname) {
          return `${item.author.firstname} ${item.author.lastname}`
        }
        return item.author.username || item.author.email || 'Usuario desconocido'
      }
      return item.authorName || 'Usuario desconocido'
    }

    // Handle pagination wrapper
    const payload = (response as any).data || response
    const content = payload.content || (Array.isArray(payload) ? payload : [])

    const mappedContent = content.map((post: any) => ({
      ...post,
      authorName: mapAuthorName(post),
    }))

    return {
      content: mappedContent,
      totalElements: payload.totalElements || mappedContent.length,
      totalPages: payload.totalPages || 1,
    }
  },

  async createPost(topicId: number, content: string): Promise<ForumPost> {
    return await api.post(`/forum/topics/${topicId}/posts`, { content })
  },

  // --- Admin: Categories ---
  async createCategory(data: Partial<ForumCategory>): Promise<ForumCategory> {
    return await api.post('/admin/forum/categories', data)
  },

  async updateCategory(id: number, data: Partial<ForumCategory>): Promise<ForumCategory> {
    return await api.put(`/admin/forum/categories/${id}`, data) // or PATCH
  },

  async deleteCategory(id: number): Promise<void> {
    return await api.delete(`/admin/forum/categories/${id}`)
  },

  // --- Admin: Moderation ---
  async getPendingContent(): Promise<{
    topics: ForumTopic[]
    posts: ForumPost[]
    totalPending?: number
  }> {
    try {
      const response = await api.get('/admin/forum/moderation/pending-topics')
      console.log('Pending content response:', response)

      const payload = (response as any).data || response

      // Handle wrapped response { topics: [...], totalPending: 5 }
      const topicsList = Array.isArray(payload.topics)
        ? payload.topics
        : Array.isArray(payload)
          ? payload
          : []

      // Map topics to standardize author (if not already handled by backend) and content fallback
      const mappedTopics = topicsList.map((item: any) => ({
        ...item,
        authorName:
          item.authorName ||
          (item.author
            ? item.author.username || item.author.firstname || item.author.email
            : 'Usuario desconocido'),
        // Backend now returns content, but we keep fallback just in case
        content: item.content || item.title || '',
        contentSnippet:
          item.contentSnippet || (item.content ? item.content.substring(0, 200) : item.title),
      }))

      return {
        topics: mappedTopics,
        posts: [], // Endpoint is pending-topics only for now
        totalPending: payload.totalPending || mappedTopics.length,
      }
    } catch (error) {
      console.error('Error fetching pending content:', error)
      return { topics: [], posts: [] }
    }
  },

  async approveContent(type: 'TOPIC' | 'POST', id: number): Promise<void> {
    return await api.post(`/admin/forum/moderation/${type.toLowerCase()}s/${id}/approve`)
  },

  async rejectContent(type: 'TOPIC' | 'POST', id: number, reason: string): Promise<void> {
    return await api.post(`/admin/forum/moderation/${type.toLowerCase()}s/${id}/reject`, { reason })
  },

  // --- Admin: Reports ---
  async getReports(): Promise<any[]> {
    // Replace any with ForumReport[] when imported
    return await api.get('/admin/forum/reports')
  },

  async resolveReport(id: number, action: 'RESOLVE' | 'DISMISS'): Promise<void> {
    return await api.post(`/admin/forum/reports/${id}/${action.toLowerCase()}`)
  },

  // --- User Activity ---
  async getMyTopics(): Promise<ForumTopic[]> {
    const response = await api.get('/forum/my-topics')
    // Handle pagination: backend returns { content: [...], totalPages: ... }
    const payload = response as unknown as { content?: ForumTopic[] }
    return payload.content || (Array.isArray(response) ? response : [])
  },

  async getMyPosts(): Promise<ForumPost[]> {
    const response = await api.get('/forum/my-posts')
    const payload = response as unknown as { content?: ForumPost[] }
    return payload.content || (Array.isArray(response) ? response : [])
  },

  async getNotifications(): Promise<import('@/types/forum').ForumNotification[]> {
    const response = await api.get('/forum/notifications')
    const payload = response as unknown as { content?: import('@/types/forum').ForumNotification[] }
    return payload.content || (Array.isArray(response) ? response : [])
  },

  async markNotificationRead(id: number): Promise<void> {
    return await api.post(`/forum/notifications/${id}/read`)
  },

  async markAllNotificationsRead(): Promise<void> {
    return await api.post('/forum/notifications/read-all')
  },

  async getUnreadNotificationCount(): Promise<number> {
    return await api.get('/forum/notifications/unread-count')
  },

  // --- Advanced ---
  async searchTopics(filters: import('@/types/forum').ForumSearchFilters): Promise<ForumTopic[]> {
    // Backend expects 'q' for query title
    const params = {
      ...filters,
      q: filters.query,
      query: undefined,
    }
    return await api.get('/forum/search', { params })
  },

  async getAdminStats(): Promise<import('@/types/forum').AdminForumStats> {
    return await api.get('/admin/forum/stats')
  },
}
