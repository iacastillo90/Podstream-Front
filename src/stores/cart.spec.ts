import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from './cart'
import type { Product } from '@/types/product'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds items to the cart', () => {
    const cart = useCartStore()
    const product: Product = {
      id: 1,
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      categoryId: 1,
      description: 'Desc',
      shortDescription: 'Short',
      stock: 10,
      photos: [],
    }

    cart.addItem(product)
    expect(cart.items.length).toBe(1)
    expect(cart.totalItems).toBe(1)
  })

  it('increments quantity correctly', () => {
    const cart = useCartStore()
    const product: Product = {
      id: 1,
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      categoryId: 1,
      description: 'Desc',
      shortDescription: 'Short',
      stock: 10,
      photos: [],
    }

    cart.addItem(product)
    cart.addItem(product)
    expect(cart.items[0].quantity).toBe(2)
    expect(cart.totalItems).toBe(2)
  })

  it('clears cart', () => {
    const cart = useCartStore()
    const product: Product = {
      id: 1,
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      categoryId: 1,
      description: 'Desc',
      shortDescription: 'Short',
      stock: 10,
      photos: [],
    }

    cart.addItem(product)
    cart.clearCart()
    expect(cart.items.length).toBe(0)
  })
})
