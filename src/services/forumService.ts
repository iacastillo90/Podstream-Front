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
    const payload = response as unknown as {
      content?: Record<string, unknown>[]
      data?: Record<string, unknown>[]
    }
    // Handle both direct page/size response or wrapped .data
    // Just return what we have, the component usually handles the shape.
    // However the return type says { content: ForumTopic[]... }
    // Ideally we should map it. For now let's just cast it to expected output if structurally similar.
    return (payload.data || payload) as unknown as {
      content: ForumTopic[]
      totalElements: number
      totalPages: number
    }
  },

  async getTopic(id: number | string): Promise<ForumTopic> {
    if (!id || id === 'NaN' || Number.isNaN(Number(id))) throw new Error('Invalid Topic ID')
    const response = await api.get(`/forum/topics/${id}`)

    // Map author info if it's a nested object
    if (response && typeof response === 'object') {
      const msg = response as unknown as Record<string, unknown>
      // Cast to partial shape to check standard properties
      const topic = msg as {
        id?: number
        title?: string
        content?: string
        author?: {
          firstname?: string
          lastname?: string
          username?: string
          email?: string
          id?: number
        }
        authorId?: number
        authorName?: string
        category?: { name: string; id: number; slug: string }
        categoryId?: number
        categoryName?: string
        categorySlug?: string
        pinned?: boolean
        locked?: boolean
        repliesCount?: number
        views?: number
        createdAt?: string
        updatedAt?: string
      }

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
        id: topic.id || 0,
        title: topic.title || '',
        content: topic.content || '',
        categoryId: topic.categoryId || topic.category?.id || 0,
        categoryName: topic.category?.name || topic.categoryName || 'Sin categoría',
        categorySlug: topic.category?.slug || topic.categorySlug || '',
        authorId: topic.authorId || topic.author?.id || 0,
        authorName,
        createdAt: topic.createdAt || new Date().toISOString(),
        updatedAt: topic.updatedAt || new Date().toISOString(),
        isPinned: topic.pinned || false,
        isLocked: topic.locked || false,
        repliesCount: topic.repliesCount || 0,
        views: topic.views || 0,
      } as ForumTopic
    }

    return response as unknown as ForumTopic
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
    const mapAuthorName = (item: {
      author?: {
        firstname?: string
        lastname?: string
        username?: string
        email?: string
      }
      authorName?: string
    }) => {
      if (item.author) {
        if (item.author.firstname && item.author.lastname) {
          return `${item.author.firstname} ${item.author.lastname}`
        }
        return item.author.username || item.author.email || 'Usuario desconocido'
      }
      return item.authorName || 'Usuario desconocido'
    }

    // Handle pagination wrapper
    const payload =
      (
        response as unknown as {
          data?: { content?: unknown[]; totalElements?: number; totalPages?: number }
          content?: unknown[] // support direct content array or page object
          totalElements?: number
          totalPages?: number
        }
      ).data ||
      (response as unknown as {
        content?: unknown[]
        totalElements?: number
        totalPages?: number
      })

    const content = payload.content || (Array.isArray(payload) ? (payload as unknown[]) : [])

    const mappedContent = content.map((post: unknown) => ({
      ...(post as object),
      authorName: mapAuthorName(
        post as {
          author?: {
            firstname?: string
            lastname?: string
            username?: string
            email?: string
          }
          authorName?: string
        },
      ),
    }))

    return {
      content: mappedContent as unknown as ForumPost[],
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

      const payload =
        (
          response as {
            data?: { topics?: Record<string, unknown>[]; totalPending?: number }
          }
        ).data || (response as { topics?: Record<string, unknown>[]; totalPending?: number })

      // Handle wrapped response { topics: [...], totalPending: 5 }
      const topicsList = Array.isArray(payload.topics)
        ? payload.topics
        : Array.isArray(payload)
          ? (payload as Record<string, unknown>[])
          : []

      // Map topics to standardize author (if not already handled by backend) and content fallback
      const mappedTopics = topicsList.map((item: Record<string, unknown>) => {
        const author = item.author as
          | { username?: string; firstname?: string; email?: string }
          | undefined
        return {
          ...item,
          authorName:
            (item.authorName as string) ||
            (author ? author.username || author.firstname || author.email : 'Usuario desconocido'),
          // Backend now returns content, but we keep fallback just in case
          content: (item.content as string) || (item.title as string) || '',
          contentSnippet:
            (item.contentSnippet as string) ||
            ((item.content as string)
              ? (item.content as string).substring(0, 200)
              : (item.title as string)),
        }
      })

      return {
        topics: mappedTopics as unknown as ForumTopic[],
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
  async getReports(): Promise<import('@/types/forum').ForumReport[]> {
    // Explicitly cast to unknown then ForumReport[] to avoid checks if api returns strict types
    return (await api.get(
      '/admin/forum/reports',
    )) as unknown as import('@/types/forum').ForumReport[]
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
    const payload = response as unknown as {
      content?: import('@/types/forum').ForumNotification[]
    }
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
