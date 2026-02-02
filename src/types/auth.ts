export type UserRole = 'ADMIN' | 'CLIENT' | 'USER'

export interface AuthResponse {
  token: string
  id: number
  name: string
  email: string
  role: UserRole
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  // Extended Profile Fields
  firstName?: string
  lastName?: string // Usually duplicate of name or family name
  secondName?: string
  firstLastName?: string
  secondLastName?: string
  phone?: string
  designation?: string
  profileImage?: string
  street?: string
  city?: string
  country?: string
  zipCode?: string
  currentPassword?: string // For form handling
  newPassword?: string
  confirmPassword?: string
}
