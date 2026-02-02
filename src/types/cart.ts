export interface CartItem {
  productId: number
  productName: string
  quantity: number
  price: number
  subTotal: number
  image?: string
  description?: string
}

export interface Cart {
  id: number
  clientId: number
  items: CartItem[]
  totalPrice: number
}
