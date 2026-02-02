import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AcademyService } from '@/services/academyService'
import type { Course } from '@/types'

export const useAcademyStore = defineStore('academy', () => {
  const courses = ref<Course[]>([])
  const searchQuery = ref('')
  const selectedLevel = ref<string>('All')
  const isLoading = ref(false)

  const fetchCourses = async (forceRefresh = false) => {
    if (courses.value.length > 0 && !forceRefresh && selectedLevel.value === 'All') return

    isLoading.value = true
    try {
      const filters: Record<string, string> = {}
      if (selectedLevel.value !== 'All') filters.level = selectedLevel.value

      const data = await AcademyService.getCourses(filters)
      courses.value = data
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      isLoading.value = false
    }
  }

  const filteredCourses = computed(() => {
    return courses.value.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.value.toLowerCase())
      // Level filtering is handled by API now, but client-side fallback is ok
      const matchesLevel = selectedLevel.value === 'All' || course.level === selectedLevel.value

      return matchesSearch && matchesLevel
    })
  })

  return {
    courses,
    searchQuery,
    selectedLevel,
    isLoading,
    fetchCourses,
    filteredCourses,
  }
})
