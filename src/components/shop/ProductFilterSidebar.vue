<template>
  <aside
    class="w-full lg:w-64 shrink-0 transition-transform duration-300 ease-in-out z-40 bg-[#121212] lg:bg-transparent"
    :class="[
      isOpen
        ? 'fixed inset-0 lg:static translate-x-0'
        : 'fixed inset-0 lg:static -translate-x-full lg:translate-x-0',
      'lg:block',
    ]"
  >
    <!-- Mobile Header -->
    <div
      class="flex items-center justify-between p-4 lg:hidden border-b border-white/10 bg-[#1a1a1a]"
    >
      <h2 class="text-xl font-bold">Filtros</h2>
      <button class="text-white hover:text-brand-purple" @click="$emit('close')">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="h-full overflow-y-auto custom-scrollbar p-4 lg:p-0 space-y-8 pb-20 lg:pb-0">
      <!-- Clear Filters -->
      <div v-if="hasActiveFilters" class="flex justify-between items-center animate-fade-in">
        <span class="text-sm text-gray-400">{{ activeFilterCount }} filtros activos</span>
        <button
          class="text-xs text-brand-pink hover:text-white transition-colors uppercase font-bold tracking-wider"
          @click="clearFilters"
        >
          Limpiar
        </button>
      </div>

      <!-- Categories -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold font-heading flex items-center gap-2">
          <i class="fas fa-layer-group text-brand-purple text-sm"></i>
          Categorías
        </h3>
        <div class="space-y-2">
          <label
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-all"
          >
            <div class="relative flex items-center">
              <input
                v-model="selectedCategories"
                type="checkbox"
                :value="cat.id"
                class="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-transparent checked:bg-brand-purple checked:border-brand-purple transition-all"
              />
              <i
                class="fas fa-check text-white text-[10px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
              ></i>
            </div>
            <span class="text-gray-400 group-hover:text-white transition-colors text-sm">{{
              cat.name
            }}</span>
            <span v-if="cat.count" class="ml-auto text-xs text-gray-600 font-mono"
              >({{ cat.count }})</span
            >
          </label>
        </div>
      </div>

      <!-- Price Range -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold font-heading flex items-center gap-2">
          <i class="fas fa-tag text-brand-purple text-sm"></i>
          Precio
        </h3>
        <div class="px-2">
          <!-- TODO: Replace with a proper slider lib if available, keeping it simple for now -->
          <div class="flex items-center gap-4 mb-4">
            <div class="relative w-full">
              <span class="absolute -top-6 left-0 text-xs text-gray-500">$0</span>
              <span class="absolute -top-6 right-0 text-xs text-gray-500"
                >${{ maxPriceLimit }}</span
              >
              <input
                v-model.number="localMaxPrice"
                type="range"
                min="0"
                :max="maxPriceLimit"
                step="10"
                class="w-full accent-brand-purple h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
              <input
                v-model.number="localMinPrice"
                type="number"
                class="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-6 pr-2 text-xs text-white focus:border-brand-purple focus:outline-none"
                placeholder="Min"
              />
            </div>
            <span class="text-gray-500">-</span>
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
              <input
                v-model.number="localMaxPrice"
                type="number"
                class="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-6 pr-2 text-xs text-white focus:border-brand-purple focus:outline-none"
                placeholder="Max"
              />
            </div>
            <button
              class="bg-white/10 hover:bg-brand-purple text-white p-2 rounded-lg transition-colors"
              @click="applyPriceFilter"
            >
              <i class="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Brands (Mocked for now) -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold font-heading flex items-center gap-2">
          <i class="fas fa-certificate text-brand-purple text-sm"></i>
          Marcas
        </h3>
        <div class="space-y-2">
          <label
            v-for="brand in availableBrands"
            :key="brand.name"
            class="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-all"
          >
            <div class="relative flex items-center">
              <input
                v-model="selectedBrands"
                type="checkbox"
                :value="brand.name"
                class="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-transparent checked:bg-brand-purple checked:border-brand-purple transition-all"
              />
              <i
                class="fas fa-check text-white text-[10px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
              ></i>
            </div>
            <span class="text-gray-400 group-hover:text-white transition-colors text-sm">{{
              brand.name
            }}</span>
            <!-- Obfuscated count as requested -->
            <!-- Obfuscated count as requested -->
            <span
              v-if="brand.count && brand.count > 0"
              class="ml-auto text-xs text-gray-600 font-mono"
              >(x)</span
            >
            <span v-else class="ml-auto text-xs text-gray-600 font-mono">(0)</span>
          </label>
        </div>
      </div>

      <!-- Stock Status -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold font-heading flex items-center gap-2">
          <i class="fas fa-box-open text-brand-purple text-sm"></i>
          Disponibilidad
        </h3>
        <label
          class="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-all"
        >
          <div class="relative flex items-center">
            <input
              v-model="onlyInStock"
              type="checkbox"
              class="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-transparent checked:bg-green-500 checked:border-green-500 transition-all"
            />
            <i
              class="fas fa-check text-black text-[10px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
            ></i>
          </div>
          <span class="text-gray-400 group-hover:text-white transition-colors text-sm"
            >Solo en Stock</span
          >
        </label>
      </div>
    </div>
  </aside>

  <!-- Backdrop for Mobile -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Category } from '@/types'

const props = defineProps<{
  isOpen: boolean
  categories: (Category & { count?: number })[]
  brands?: { name: string; count?: number }[] // Optional prop for now
  maxPriceLimit?: number // Max price found in current products
  initialFilters?: any
}>()

const emit = defineEmits(['update:filters', 'close'])

// Component State
const selectedCategories = ref<number[]>([])
const selectedBrands = ref<string[]>([])
const onlyInStock = ref(false)
const localMinPrice = ref<number | null>(null)
const localMaxPrice = ref<number>(2000)

// Computed for brands to use prop or empty
const availableBrands = computed(() => props.brands || [])

// Computed
const hasActiveFilters = computed(() => {
  return (
    selectedCategories.value.length > 0 ||
    selectedBrands.value.length > 0 ||
    onlyInStock.value ||
    localMinPrice.value !== null
  )
})

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedCategories.value.length) count++
  if (selectedBrands.value.length) count++
  if (onlyInStock.value) count++
  if (localMinPrice.value !== null) count++
  return count
})

// Actions
const applyPriceFilter = () => {
  emitFilters()
}

const clearFilters = () => {
  selectedCategories.value = []
  selectedBrands.value = []
  onlyInStock.value = false
  localMinPrice.value = null
  localMaxPrice.value = props.maxPriceLimit || 2000
  emitFilters()
}

const emitFilters = () => {
  emit('update:filters', {
    categories: selectedCategories.value,
    brands: selectedBrands.value,
    minPrice: localMinPrice.value,
    maxPrice: localMaxPrice.value,
    inStock: onlyInStock.value,
  })
}

// Watchers for auto-apply filters (except price inputs which need button or debounce)
watch([selectedCategories, selectedBrands, onlyInStock, () => localMaxPrice.value], () => {
  // Debounce slighty for slider
  setTimeout(() => {
    emitFilters()
  }, 50)
})

// Initialize state if props passed
onMounted(() => {
  if (props.maxPriceLimit) {
    localMaxPrice.value = props.maxPriceLimit
  }
})

// Watch prop change
watch(
  () => props.maxPriceLimit,
  (newVal) => {
    if (newVal && !localMinPrice.value) {
      // Only update max if user hasn't messed with it too much? Or always?
      // localMaxPrice.value = newVal
      // Keep user selection unless it exceeds?
    }
  },
)
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
}
</style>
