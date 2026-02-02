import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { StudioService } from '@/services/studioService'
import type { StudioItem } from '@/types'

export const useStudioStore = defineStore('studio', () => {
  const items = ref<StudioItem[]>([])
  const availableItems = ref<StudioItem[]>([]) // Catalog loaded from API
  const myBuilds = ref<Record<string, unknown>[]>([])
  const selectedItemId = ref<number | string | null>(null)
  const deskTexture = ref('dark_wood')
  const viewMode = ref<'2D' | '3D'>('3D')
  const isLoading = ref(false)

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price, 0)
  })

  const totalPower = computed(() => {
    return items.value.reduce((sum, item) => sum + item.powerUsage, 0)
  })

  // API Actions
  const fetchCatalog = async (forceRefresh = false) => {
    if (availableItems.value.length > 0 && !forceRefresh) return

    isLoading.value = true
    try {
      const data = await StudioService.getCatalog()
      availableItems.value = data
    } catch (error) {
      console.error('Failed to fetch studio catalog:', error)
      // Fallback or empty if offline
    } finally {
      isLoading.value = false
    }
  }

  const saveBuild = async (name: string) => {
    isLoading.value = true
    try {
      const payload = {
        name,
        items: items.value.map((i) => ({
          productId: i.productId,
          x: i.x,
          y: i.y,
          rotation: i.rotation,
          scale: i.scale,
        })),
      }
      await StudioService.saveBuild(payload)
      alert('¡Setup guardado correctamente!')
    } catch (error) {
      console.error('Failed to save build:', error)
      alert('Error al guardar el setup.')
    } finally {
      isLoading.value = false
    }
  }

  const loadMyBuilds = async () => {
    try {
      const data = await StudioService.getMyBuilds()
      myBuilds.value = data
    } catch (error) {
      console.error('Failed to fetch builds:', error)
    }
  }

  // Canvas Actions
  const addItem = (product: StudioItem) => {
    const newItem: StudioItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      model3d: product.model3d,
      price: product.price, // Ensure backend sends number
      powerUsage: product.powerUsage || 0,
      x: 40 + (Math.random() * 20 - 10),
      y: 40 + (Math.random() * 20 - 10),
      z: 0,
      rotation: 0,
      scale: 1,
      layer: 10,
      dimensions: product.dimensions,
    }
    items.value.push(newItem)
    selectedItemId.value = newItem.id
  }

  const removeItem = (id: number | string) => {
    items.value = items.value.filter((i) => i.id !== id)
    if (selectedItemId.value === id) selectedItemId.value = null
  }

  const clearStudio = () => {
    items.value = []
    selectedItemId.value = null
  }

  const updateItem = (id: number | string, props: Partial<StudioItem>) => {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      Object.assign(item, props)
    }
  }

  return {
    items,
    availableItems,
    myBuilds,
    selectedItemId,
    deskTexture,
    viewMode,
    isLoading,
    totalPrice,
    totalPower,
    fetchCatalog,
    saveBuild,
    loadMyBuilds,
    addItem,
    removeItem,
    clearStudio,
    updateItem,
  }
})
