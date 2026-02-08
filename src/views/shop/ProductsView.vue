<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Main Layout: Sidebar + Grid -->
    <div class="flex flex-col lg:flex-row gap-6 relative z-10">
      <!-- Sidebar Component (Sticky on Desktop) -->
      <div class="hidden lg:block w-64 shrink-0 sticky top-0 self-start pt-4 pl-1">
        <ProductFilterSidebar
          :is-open="isMobileSidebarOpen"
          :categories="categories"
          :brands="brands"
          :max-price-limit="maxPriceLimit"
          @update:filters="handleFilterUpdate"
          @close="isMobileSidebarOpen = false"
        />
      </div>

      <!-- Mobile Sidebar (Drawer) -->
      <ProductFilterSidebar
        v-if="isMobileSidebarOpen"
        :is-open="isMobileSidebarOpen"
        :categories="categories"
        :brands="brands"
        :max-price-limit="maxPriceLimit"
        @update:filters="handleFilterUpdate"
        @close="isMobileSidebarOpen = false"
      />

      <!-- Products Content -->
      <div class="flex-1 min-w-0">
        <!-- Hero Section -->
        <div class="relative h-[250px] md:h-[320px] rounded-2xl overflow-hidden group mb-8">
          <!-- Background Image -->
          <div class="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2670&auto=format&fit=crop"
              class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              alt="PodStream Shop"
            />
            <div
              class="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/50 to-transparent"
            ></div>
          </div>

          <!-- Hero Content -->
          <div class="relative h-full flex flex-col justify-center px-8 md:px-12 max-w-2xl">
            <h1 class="text-3xl md:text-5xl font-bold font-heading mb-2 text-white">Catálogo</h1>
            <p class="text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-md">
              Explora nuestra colección de equipos premium.
            </p>
          </div>
        </div>

        <!-- Search & Mobile Filter Toggle (Moved here) -->
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-light-white/10 pb-6 mb-6"
        >
          <div class="text-gray-400 text-sm md:text-base">
            Mostrando <span class="text-white font-bold">{{ products.length }}</span> productos
          </div>

          <div class="flex gap-4 w-full md:w-auto items-center">
            <!-- Search -->
            <div class="relative group/input flex-1 md:w-64">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i
                  class="fas fa-search text-gray-500 group-focus-within/input:text-brand-purple transition-colors"
                ></i>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar productos..."
                class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm"
              />
            </div>

            <!-- Mobile Filter Button -->
            <button
              class="lg:hidden bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition-colors border border-white/10"
              @click="isMobileSidebarOpen = true"
            >
              <i class="fas fa-filter text-brand-purple"></i>
            </button>
          </div>
        </div>
        <!-- min-w-0 prevents flex child from overflowing -->

        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        >
          <div
            v-for="n in 10"
            :key="n"
            class="bg-white/5 border border-white/5 rounded-2xl overflow-hidden"
          >
            <Skeleton height="160px" class="w-full" />
            <div class="p-3 space-y-2">
              <Skeleton height="16px" width="70%" />
              <Skeleton height="12px" width="40%" />
              <div class="flex justify-between items-center pt-1">
                <Skeleton height="20px" width="30%" />
                <Skeleton height="28px" width="28px" :rounded="true" />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="products.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-search text-3xl text-gray-600"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">No se encontraron productos</h3>
          <p class="text-gray-400 max-w-md">Prueba ajustando los filtros o tu búsqueda.</p>
          <button class="mt-6 text-brand-purple hover:underline font-bold" @click="resetFilters">
            Limpiar Filtros
          </button>
        </div>

        <!-- Results Grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart"
            @view-details="viewProductDetails"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ProductService } from '@/services/productService'
import type { Product, Category } from '@/types'
import { getFullImageUrl } from '@/utils/imageHelper'
import ProductCard from '@/components/shop/ProductCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import ProductFilterSidebar from '@/components/shop/ProductFilterSidebar.vue'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore() // Correct usage

// Data
const products = ref<Product[]>([]) // Store products fetched from API
const categories = ref<Category[]>([])
// Use simple brand structure or define interface
const brands = ref<{ name: string; count: number }[]>([])
const isLoading = ref(true)
const isMobileSidebarOpen = ref(false)

// Filter State (Matches Sidebar emit)
// Map 'categories' to 'category' (backend implementation calls for 'category' or 'categories'? Let's assume list of IDs)
// The backend specs said: category=1,2
const filters = ref({
  category: [] as number[], // Match backend param name
  brand: [] as string[],
  minPrice: null as number | null,
  maxPrice: null as number | null,
  inStock: false,
})
const searchQuery = ref('')

// Computed max price from data
const maxPriceLimit = ref(5000) // Will be updated by metadata

// Fetch Data
const fetchProducts = async () => {
  isLoading.value = true
  try {
    // Construct filter object for Service
    const activeFilters = {
      query: searchQuery.value || undefined,
      category: filters.value.category.length > 0 ? filters.value.category : undefined,
      brand: filters.value.brand.length > 0 ? filters.value.brand : undefined,
      minPrice: filters.value.minPrice || undefined,
      maxPrice: filters.value.maxPrice || undefined,
      inStock: filters.value.inStock || undefined,
    }

    // Call API with filters
    const response = await ProductService.getAll(0, 50, activeFilters) // Page 0, Size 50 (for now)

    const rawData =
      (response as { content?: unknown[] }).content ||
      (response as { data?: unknown[] }).data ||
      response

    // Map response
    products.value = (Array.isArray(rawData) ? rawData : []).map((p: unknown) => {
      const prod = p as {
        price?: number
        categoryId?: number
        image?: string
        images?: string[]
        photos?: string[]
        imageCollection?: string[]
        brand?: string
      }
      return {
        ...(p as Record<string, unknown>),
        price: Number(prod.price),
        categoryId: Number(prod.categoryId),
        image: getFullImageUrl(
          prod.image ||
            (prod.images && prod.images.length > 0 ? prod.images[0] : null) ||
            (prod.photos && prod.photos.length > 0 ? prod.photos[0] : null) ||
            (prod.imageCollection && prod.imageCollection.length > 0
              ? prod.imageCollection[0]
              : null),
        ),
        // Brand is now real if backend sends it, otherwise fallback
        brand: prod.brand,
      }
    }) as Product[]

    // Fetch Metadata for Sidebar based on CURRENT filters (to update counts)
    // Note: Usually metadata is fetched with the same query.
    fetchMetadata(activeFilters)
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchMetadata = async (activeFilters: Record<string, unknown>) => {
  try {
    const meta = await ProductService.getSearchMetadata(activeFilters)
    // Update Sidebar props if meta is valid
    if (meta) {
      const metadata = meta as { categories?: unknown[]; maxPrice?: number; brands?: unknown[] }
      if (metadata.categories) {
        categories.value = (metadata.categories as { name: string; count: number }[]).map((c) => ({
          id: 0, // Dummy ID to satisfy Category interface
          name: c.name,
          count: c.count,
        }))
      }
      if (metadata.maxPrice) maxPriceLimit.value = metadata.maxPrice
      if (metadata.brands) brands.value = metadata.brands as { name: string; count: number }[]
    }
  } catch (e) {
    console.error('Error fetching metadata', e)
  }
}

// Fetch Initial Data
const fetchInitialData = async () => {
  // 1. Fetch Categories (Static list for initial state or rely on metadata?)
  // Let's rely on metadata or initial load
  // If we have categoryId in route, set it
  if (route.query.categoryId) {
    filters.value.category = [Number(route.query.categoryId)]
  }
  await fetchProducts()
}

// Handler
// Handler
const handleFilterUpdate = (newFilters: Record<string, unknown>) => {
  // Map sidebar event structure to our state
  // Sidebar emits: { categories: [], brands: [], minPrice, maxPrice, inStock }
  const filtersData = newFilters as {
    categories?: number[]
    brands?: string[]
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
  }

  // Access ref value
  filters.value.category = filtersData.categories || []
  filters.value.brand = filtersData.brands || []
  filters.value.minPrice = filtersData.minPrice ?? null
  filters.value.maxPrice = filtersData.maxPrice ?? null
  filters.value.inStock = filtersData.inStock ?? false

  // Reset page
  // pagination.value.page = 0
  fetchProducts()
}

const resetFilters = () => {
  filters.value = {
    category: [],
    brand: [],
    minPrice: null,
    maxPrice: null,
    inStock: false,
  }
  searchQuery.value = ''
  fetchProducts()
}

// Watch search query with debounce
let timeout: number
watch(searchQuery, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    fetchProducts()
  }, 500) as unknown as number
})

const addToCart = (product: Product) => {
  cartStore.addItem(product)
  alert('Producto agregado al carrito')
}

const viewProductDetails = (product: Product) => {
  router.push(`/products/${product.id}`)
}

// Initial Load
onMounted(() => {
  fetchInitialData()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
