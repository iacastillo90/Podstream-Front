export * from './api'
export * from './auth'
export * from './product'
export * from './address'
export * from './cart'

// --- Remaining Domain Interfaces ---

export interface OrderItem {
  id?: number // Optional if backend doesn't send item ID, use productId
  productId: number
  name: string
  quantity: number
  price: number
  image?: string // UI convenience
}

export interface Order {
  id: number
  userId: number
  clientName?: string
  userName?: string // Added for Admin view
  status:
    | 'PENDING'
    | 'PAID'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'PENDING_PAYMENT'
    | 'PAYMENT_CONFIRMED'
    | 'PROCESSING' // Added missing status
  total: number
  date: string
  items?: OrderItem[]
  subtotal?: number
  tax?: number
}

export interface Promotion {
  id: number
  name: string
  description: string
  code: string
  discount: number
  startDate: string
  endDate: string
  imageUrl?: string
  active: boolean
  status?: 'active' | 'inactive'
}

export interface Invoice {
  id: number
  clientId: number
  clientName: string
  amount: number
  date: string
  status: 'PAID' | 'PENDING' | 'OVERDUE'
  items?: { description: string; quantity: number; price: number; name?: string }[]
  total: number
  subtotal?: number
  taxes?: number
}

export interface SupportTicket {
  id?: number | string
  subject: string
  message: string
  status: 'PENDING' | 'OPEN' | 'CLOSED' | 'IN_PROGRESS'
  createdAt?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  type: 'SUPPORT' | 'MONITORING'
}

export interface ContactMessage {
  id?: number | string
  name: string
  email: string
  subject: string
  message: string
  read?: boolean
  createdAt?: string
}

export interface ForumTopic {
  id: number
  categoryId: number
  title: string
  author: string
  createdAt: string
  views: number
  replies: number
}

export interface Client {
  id: number
  name: string
  email: string
  address?: string
  purchases: number
  purchaseHistory: Record<string, unknown>[]
  status: 'active' | 'inactive'
}

export interface AudioSample {
  id: string
  micId: string
  micName: string
  sampleName: string
  audioUrl: string
  environment: 'QUIET' | 'CAFE' | 'KEYBOARD' | 'ECHO'
  waveformData?: number[]
}

export interface ForumPost {
  id: number
  topicId: number
  author: string
  content: string
  createdAt: string
  likes: number
}

export interface DashboardStats {
  totalIncome: number
  incomeGrowth: number
  newClients: number
  clientsGrowth: number
  pendingOrders: number
  ordersGrowth: number
  conversionRate: number
  conversionGrowth: number
  topClient?: { name: string; avatar: string; purchases: number }
  salesByCategory?: Record<string, number>
  forumActivity?: Record<string, number>
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstname: string
  lastname: string
  country: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface Course {
  id: string
  title: string
  instructor: string
  thumbnail: string
  level: 'Beginner' | 'Intermediate' | 'Pro'
  duration: string
  lessonsCount: number
  progress?: number // 0-100
  tags: string[]
}

export interface StudioItem {
  id: number | string
  productId: number | string
  name: string
  category: 'microphone' | 'interface' | 'headphone' | 'monitor' | 'accessory'
  image: string
  model3d?: string // URL to GLB/GLTF
  price: number
  powerUsage: number // Watts
  x: number // Canvas Position %
  y: number // Canvas Position %
  z: number // Height from desk
  rotation: number
  scale: number
  layer: number
  dimensions?: { width: number; height: number; depth: number }
}

export interface Hotspot {
  id: string
  x: number // %
  y: number // %
  productId: string
  productName: string
}

export interface SetupPost {
  id: string
  user: string
  userAvatar: string
  image: string
  title: string
  description: string
  tags: string[]
  likes: number
  hotspots: Hotspot[]
}

export interface VersusProduct {
  id: number | string
  name: string
  image: string
  price: number
  specs: {
    quality: number
    features: number
    value: number
    durability: number
    easeOfUse: number
  }
  details: { name: string; value: string }[]
}
