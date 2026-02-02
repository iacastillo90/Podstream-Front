import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ProductService } from '@/services/productService'
import type { VersusProduct } from '@/types'

export const useVersusStore = defineStore('versus', () => {
  const selectedProducts = ref<VersusProduct[]>([])
  const searchResults = ref<any[]>([])
  const isSearching = ref(false)

  // Available products for the dropdown (mapped from searchResults)
  const availableProducts = computed(() => searchResults.value)

  const searchProducts = async (query: string) => {
    if (!query) {
      searchResults.value = []
      return
    }
    isSearching.value = true
    try {
      const data = await ProductService.search(query)
      searchResults.value = data
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      isSearching.value = false
    }
  }

  const addProduct = async (productId: number | string) => {
    if (selectedProducts.value.find((p) => p.id === productId)) return
    if (selectedProducts.value.length >= 3) {
      alert('Máximo 3 productos para comparar')
      return
    }

    try {
      const data = await ProductService.getSpecsNormalized(productId)

      // Adapter: Map API response to View structure
      const newProduct: VersusProduct = {
        id: data.id,
        name: data.name,
        image: data.image,
        price: data.price,
        specs: {
          quality: data.radar?.buildQuality || 0,
          features: data.radar?.features || 0,
          value: data.radar?.value || 0,
          durability: data.radar?.durability || data.radar?.buildQuality || 0,
          easeOfUse: data.radar?.easeOfUse || 0,
        },
        details: [
          { name: 'Type', value: data.specs?.type || 'N/A' },
          { name: 'Freq', value: data.specs?.frequencyResponse || 'N/A' },
          { name: 'Connector', value: data.specs?.connection || 'N/A' },
        ],
      }

      selectedProducts.value.push(newProduct)
      searchResults.value = [] // Close dropdown
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  const removeProduct = (id: number | string) => {
    selectedProducts.value = selectedProducts.value.filter((p) => p.id !== id)
  }

  return {
    selectedProducts,
    availableProducts,
    searchProducts,
    addProduct,
    removeProduct,
  }
})
