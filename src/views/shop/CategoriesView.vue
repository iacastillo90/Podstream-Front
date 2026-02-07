<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Main Layout: Sidebar + Content -->
    <div class="flex flex-col lg:flex-row gap-6 relative z-10">
      <!-- Sidebar Component (Sticky on Desktop) -->
      <div class="hidden lg:block w-64 shrink-0 sticky top-0 self-start pt-4 pl-1">
        <ProductFilterSidebar
          :is-open="isMobileSidebarOpen"
          :categories="sidebarCategories"
          :brands="sidebarBrands"
          :max-price-limit="maxPriceLimit"
          @update:filters="handleSidebarRedirect"
          @close="isMobileSidebarOpen = false"
        />
      </div>

      <!-- Mobile Sidebar (Drawer) -->
      <ProductFilterSidebar
        v-if="isMobileSidebarOpen"
        :is-open="isMobileSidebarOpen"
        :categories="sidebarCategories"
        :brands="sidebarBrands"
        :max-price-limit="maxPriceLimit"
        @update:filters="handleSidebarRedirect"
        @close="isMobileSidebarOpen = false"
      />

      <!-- Content Column -->
      <div class="flex-1 min-w-0">
        <!-- Hero Section -->
        <div class="relative h-[250px] md:h-[320px] rounded-2xl overflow-hidden group mb-8">
          <!-- Background Image -->
          <div class="absolute inset-0">
            <img
              src="https://public.readdy.ai/ai/img_res/39ed129298cf242ada1e460d9777c871.jpg"
              class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              alt="PodStream Categories"
            />
            <div
              class="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/50 to-transparent"
            ></div>
          </div>

          <!-- Hero Content -->
          <div class="relative h-full flex flex-col justify-center px-8 md:px-12 max-w-2xl">
            <h1 class="text-3xl md:text-5xl font-bold font-heading mb-4 text-white">Categorías</h1>
            <p class="text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-md">
              Descubre nuestra selección de equipos profesionales.
            </p>
          </div>
        </div>

        <!-- Search/Filter Bar -->
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5 pb-6 mb-8"
        >
          <div class="flex items-center gap-4 w-full md:w-auto">
            <!-- Mobile Sidebar Toggle -->
            <button
              class="lg:hidden bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition-colors border border-white/10"
              @click="isMobileSidebarOpen = true"
            >
              <i class="fas fa-filter text-brand-purple"></i>
            </button>
            <div class="text-gray-400 text-sm md:text-base">
              Explora
              <span class="text-white font-bold">{{ filteredCategories.length }}</span> categorías
            </div>
          </div>

          <div class="w-full md:w-auto flex gap-4">
            <div class="relative group/input flex-1 md:w-64">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i
                  class="fas fa-search text-gray-500 group-focus-within/input:text-brand-purple transition-colors"
                ></i>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar categorías..."
                class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard
            v-for="(category, index) in filteredCategories"
            :key="index"
            class="group relative overflow-hidden flex flex-col h-full hover:border-brand-purple/50 transition-all duration-300"
          >
            <!-- Image -->
            <div class="h-72 relative overflow-hidden rounded-t-xl -mx-[1px] -mt-[1px]">
              <div
                class="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent z-10 opacity-60"
              ></div>
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute bottom-3 left-3 z-20">
                <div
                  class="w-8 h-8 rounded-full bg-brand-purple/20 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-brand-purple/40 transition-colors"
                >
                  <i class="fas fa-layer-group text-white text-xs"></i>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4 flex flex-col flex-1">
              <h3
                class="text-lg font-bold font-heading text-white mb-1 group-hover:text-brand-purple transition-colors line-clamp-1"
              >
                {{ category.name }}
              </h3>
              <p class="text-gray-400 text-xs mb-3 flex-1 line-clamp-2">
                {{ category.description }}
              </p>

              <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-xs text-gray-300">
                  <i class="fas fa-info-circle text-brand-blue"></i>
                  <span class="truncate">{{ category.info }}</span>
                </div>
              </div>

              <button
                class="w-full py-2 bg-white/5 hover:bg-brand-purple border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 group/btn"
                @click="viewCategoryProducts(category)"
              >
                Ver Productos
                <i
                  class="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"
                ></i>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import ProductFilterSidebar from '@/components/shop/ProductFilterSidebar.vue'
import { CategoryService } from '@/services/inventoryService'
import { ProductService } from '@/services/productService'
import type { Category } from '@/types'

// Extended interface for view-specific fields
interface ViewCategory extends Category {
  image: string
  info: string
  slug: number | string
}

const router = useRouter()
const searchQuery = ref('')
const categories = ref<ViewCategory[]>([])
// Sidebar Data
const sidebarCategories = ref<(Category & { count?: number })[]>([])
const sidebarBrands = ref<{ name: string; count: number }[]>([])
const maxPriceLimit = ref(5000)
const isMobileSidebarOpen = ref(false)

const fetchCategories = async () => {
  try {
    const response = await CategoryService.getAll()
    const categoriesData = (
      Array.isArray(response) ? response : (response as { data: unknown[] }).data || response
    ) as unknown[]

    // Map for Main Grid
    categories.value = categoriesData.map((cat: unknown): ViewCategory => {
      const c = cat as Category
      const raw = cat as Record<string, unknown>
      return {
        ...c,
        image: (raw.image as string) || 'https://placehold.co/600x800',
        info: (raw.info as string) || 'Explora esta categoría',
        slug: c.id,
      }
    })
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const fetchMetadata = async () => {
  try {
    // Fetch real metadata for the sidebar to make it useful
    const meta = (await ProductService.getSearchMetadata({})) as {
      categories?: (Category & { count?: number })[]
      brands?: { name: string; count: number }[]
      maxPrice?: number
    }

    if (meta.categories) sidebarCategories.value = meta.categories
    if (meta.brands) sidebarBrands.value = meta.brands
    if (meta.maxPrice) maxPriceLimit.value = meta.maxPrice
  } catch (error) {
    console.error('Failed to load metadata:', error)
  }
}

onMounted(() => {
  fetchCategories()
  fetchMetadata()
})

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(
    (cat) =>
      cat.name.toLowerCase().includes(query) ||
      (cat.description && cat.description.toLowerCase().includes(query)),
  )
})

const viewCategoryProducts = (category: unknown) => {
  const cat = category as { id: number }
  router.push({ name: 'products', query: { categoryId: cat.id } })
}

// Redirect when interacting with Sidebar
const handleSidebarRedirect = (filters: Record<string, unknown>) => {
  // Construct query params
  const query: Record<string, unknown> = {}
  let shouldRedirect = false

  if (filters.categories && (filters.categories as unknown[]).length > 0) {
    query.categoryId = (filters.categories as unknown[])[0]
    shouldRedirect = true
  }

  if (filters.brands && (filters.brands as unknown[]).length > 0) {
    // ProductsView might not handle this yet, but we pass it for future support
    // We can assume ProductsView might evolve to read 'brand' from query
    query.brand = (filters.brands as unknown[])[0]
    shouldRedirect = true
  }

  if (filters.inStock) {
    shouldRedirect = true
  }

  // Only redirect if user explicitly selected a filter
  // This prevents the initial "emit" from the sidebar (which sends defaults) from triggering a redirect
  if (shouldRedirect) {
    router.push({ name: 'products', query: query as Record<string, string | number> })
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
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
