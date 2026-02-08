export interface Product {
  id: number
  name: string
  description: string
  shortDescription: string
  price: number
  stock: number
  categoryId: number // Crítico: alineado con el ID de la categoría en el Back
  photos: string[]
  discount?: number
  color?: string
  image?: string // Added for frontend mapping convenience
  // Optional fields used in View logic (mapping DTOs or enrichment)
  images?: string[]
  rating?: number
  reviews?: number
  reviewsList?: ProductReview[]
  specifications?: { key: string; value: string }[]
  model3d_url?: string
  category?: Category // Optional populated field
  brand?: string
  categoryName?: string
}

export interface ProductReview {
  id: number
  author: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  image?: string
  tag?: string
}
