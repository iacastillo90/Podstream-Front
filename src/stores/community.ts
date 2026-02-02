import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CommunityService } from '@/services/communityService'
import type { SetupPost } from '@/types'

export const useCommunityStore = defineStore('community', () => {
  const posts = ref<SetupPost[]>([])
  const activeTag = ref('ALL')
  const isLoading = ref(false)

  const fetchPosts = async (forceRefresh = false) => {
    if (posts.value.length > 0 && !forceRefresh && activeTag.value === 'ALL') return

    isLoading.value = true
    try {
      const filters: Record<string, string> = {}
      if (activeTag.value !== 'ALL') filters.tag = activeTag.value

      const data = await CommunityService.getPosts(filters)
      posts.value = data
    } catch (error) {
      console.error('Failed to fetch community posts:', error)
    } finally {
      isLoading.value = false
    }
  }

  const likePost = async (id: string) => {
    try {
      await CommunityService.likePost(id)
      const post = posts.value.find((p) => p.id === id)
      if (post) post.likes++
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  // Filter Logic (Client side fallback if needed, but API handles main filtering)
  const filteredPosts = computed(() => {
    if (activeTag.value === 'ALL') return posts.value
    return posts.value.filter((post) => post.tags.includes(activeTag.value))
  })

  return {
    posts,
    activeTag,
    isLoading,
    fetchPosts,
    likePost,
    filteredPosts,
  }
})
