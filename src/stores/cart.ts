import { defineStore } from 'pinia'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'
import { getFullImageUrl } from '@/utils/imageHelper'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    /** Calcula el total de productos únicos */
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),

    /** Calcula el precio total alineado con la lógica del Back */
    totalPrice: (state) => state.items.reduce((acc, item) => acc + item.subTotal, 0),

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    /**
     * Añade un producto al carrito o incrementa su cantidad
     */
    addItem(product: Product, quantity: number = 1) {
      const existingItem = this.items.find((item) => item.productId === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
        existingItem.subTotal = existingItem.quantity * existingItem.price
      } else {
        // Resolve image URL safely
        let imageUrl = ''

        // Use helper directly or logic here. Since we have helper imported:
        imageUrl = getFullImageUrl(
          product.image ||
            (product.images && product.images.length > 0 ? product.images[0] : null) ||
            (product.photos && product.photos.length > 0 ? product.photos[0] : null),
        )

        this.items.push({
          productId: product.id,
          productName: product.name,
          quantity: quantity,
          price: product.price,
          subTotal: product.price * quantity,
          image: imageUrl,
          description: product.description,
        })
      }
    },

    /** Elimina un producto por completo */
    removeItem(productId: number) {
      this.items = this.items.filter((item) => item.productId !== productId)
    },

    /** Actualiza la cantidad de un ítem validando stock (Lógica Nivel Dios) */
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((i) => i.productId === productId)
      if (item && quantity > 0) {
        item.quantity = quantity
        item.subTotal = item.quantity * item.price
      }
    },

    clearCart() {
      this.items = []
    },
    fetchCart() {
      // Intentionally empty: Persistence plugin handles hydration.
      // This placeholder prevents errors in views calls.
      console.log('Cart fetched (local)')
    },
  },

  // PERSISTENCIA AUTOMÁTICA: Guarda el estado en localStorage bajo la clave 'podstream_cart'
  persist: {
    key: 'podstream_cart',
    storage: localStorage,
  },
})
