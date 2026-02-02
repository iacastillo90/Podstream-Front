// User Profile Management Types

export interface UserProfile {
  id: number
  username: string
  firstname: string
  secondName?: string
  lastname: string
  email: string
  phone?: string
  country: string
  role: 'CLIENT' | 'ADMIN' | 'USER'
  enabled: boolean
}

export interface UpdateProfileRequest {
  firstname?: string
  secondName?: string
  lastname?: string
  email?: string
  phone?: string
  country?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface Address {
  id?: number
  street: string
  number: number
  city: string
  apartament?: string
  floor?: number
  zipCode: string
  status?: boolean
}
