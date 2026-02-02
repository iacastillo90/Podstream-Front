/**
 * Reflejo exacto de com.podStream.PodStream.Models.ApiResponse<T>
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string // ISO LocalDateTime
}

export interface PaginationResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface AppError {
  message: string
  code?: string
  status?: number
  isBusinessError: boolean // true = backend returned success:false, false = HTTP error
}
