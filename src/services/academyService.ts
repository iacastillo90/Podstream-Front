import api from './api'
import type { Course } from '@/types'

export const AcademyService = {
  async getCourses(filters?: Record<string, string>): Promise<Course[]> {
    return await api.get('/academy/courses', { params: filters })
  },
}
