import api from './api'
import type { LoginRequest, RegisterRequest } from '@/types'
import type { AuthResponse, User } from '@/types/auth'
import type { ChangePasswordRequest, UpdateProfileRequest } from '@/types/userProfile'

export const AuthService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await api.post('/auth/login', credentials)
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return await api.post('/auth/register', data)
  },

  async me(): Promise<User> {
    return await api.get('/auth/me')
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return await api.put('/auth/me', data)
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return await api.post('/auth/change-password', data)
  },

  async deleteAccount(): Promise<void> {
    return await api.delete('/auth/account')
  },
}
