export interface ForumCategory {
  id: number
  name: string
  description: string
  slug: string
  icon?: string
  color?: string
  topicsCount: number
  postsCount: number
  lastActivity?: string // ISO Date
}

export interface ForumTopic {
  id: number
  title: string
  content: string
  categoryId: number
  categoryName?: string
  categorySlug?: string
  authorId: number
  authorName: string
  authorAvatar?: string
  createdAt: string
  updatedAt: string
  views: number
  repliesCount: number
  isPinned: boolean
  isLocked: boolean
  lastReplyAt?: string
  lastReplyAuthor?: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED'
}

export interface ForumPost {
  id: number
  topicId: number
  authorId: number
  authorName: string
  authorAvatar?: string
  authorRole?: string
  content: string
  createdAt: string
  updatedAt?: string
  likes: number
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED'
  topic?: ForumTopic // For My Posts view where topic info is nested
}

// ...

export interface ForumReport {
  id: number
  type: 'TOPIC' | 'POST'
  contentId: number
  contentSnippet: string
  reporterId: number
  reporterName: string
  reason: string
  createdAt: string
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED'
}

export interface ForumStats {
  totalTopics: number
  totalPosts: number
  totalUsers: number
  activeUsers24h: number
  pendingApprovals: number
  activeReports: number
}

export interface ForumNotification {
  id: number
  userId: number
  type:
    | 'TOPIC_REPLY'
    | 'POST_REPLY'
    | 'TOPIC_APPROVED'
    | 'TOPIC_REJECTED'
    | 'POST_APPROVED'
    | 'POST_REJECTED'
    | 'REPLY_LIKED'
    | 'TOPIC_LIKED'
    | 'NEW_REPLY'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

export interface ForumSearchFilters {
  query: string
  categoryId?: number
  authorId?: number
  dateRange?: 'ALL' | '24H' | 'WEEK' | 'MONTH'
  sortBy?: 'RELEVANCE' | 'DATE' | 'VIEWS'
}

export interface AdminForumStats {
  overview: ForumStats
  topContributors: { userId: number; name: string; avatar?: string; score: number }[]
  topicsByDate: { date: string; count: number }[]
  popularCategories: { id: number; name: string; count: number }[]
}
