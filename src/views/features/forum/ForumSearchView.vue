<template>
  <div class="space-y-8 animate-fade-in-up pb-20">
    <!-- Header & Search Input -->
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-3xl font-bold font-heading text-white mb-6">Búsqueda Avanzada</h1>
      <div class="relative group/search">
        <div
          class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-500 group-focus-within/search:text-brand-purple transition-colors"
        >
          <Icon icon="mdi:magnify" class="text-2xl" />
        </div>
        <input
          v-model="filters.query"
          type="text"
          placeholder="¿Qué estás buscando? (Ej: 'Micrófono USB', 'Configuración OBS')"
          class="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-16 pr-6 text-white text-lg focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all shadow-lg shadow-black/50"
          @keyup.enter="performSearch"
        />
      </div>
    </div>

    <div class="grid lg:grid-cols-4 gap-8">
      <!-- Filters Sidebar -->
      <div class="space-y-6">
        <GlassCard class="p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-white flex items-center gap-2">
              <Icon icon="mdi:filter-variant" /> Filtros
            </h3>
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-xs text-brand-pink hover:underline"
            >
              Limpiar
            </button>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase mb-2">Categoría</label>
            <select
              v-model="filters.categoryId"
              class="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-purple"
            >
              <option :value="undefined">Todas</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase mb-2">Fecha</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  v-model="filters.dateRange"
                  value="ALL"
                  class="text-brand-purple focus:ring-brand-purple bg-black/20 border-white/10"
                />
                <span class="text-sm text-gray-300">Cualquier fecha</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  v-model="filters.dateRange"
                  value="MONTH"
                  class="text-brand-purple focus:ring-brand-purple bg-black/20 border-white/10"
                />
                <span class="text-sm text-gray-300">Último mes</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  v-model="filters.dateRange"
                  value="WEEK"
                  class="text-brand-purple focus:ring-brand-purple bg-black/20 border-white/10"
                />
                <span class="text-sm text-gray-300">Última semana</span>
              </label>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase mb-2">Ordenar por</label>
            <select
              v-model="filters.sortBy"
              class="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-purple"
            >
              <option value="RELEVANCE">Relevancia</option>
              <option value="DATE">Más recientes</option>
              <option value="VIEWS">Más vistos</option>
            </select>
          </div>

          <AnimatedButton class="w-full justify-center" @click="performSearch">
            Aplicar Filtros
          </AnimatedButton>
        </GlassCard>
      </div>

      <!-- Results -->
      <div class="lg:col-span-3 space-y-6">
        <div v-if="isLoading" class="space-y-4">
          <Skeleton v-for="n in 5" :key="n" height="100px" />
        </div>

        <div
          v-else-if="results.length === 0 && hasSearched"
          class="py-12 text-center text-gray-500"
        >
          <Icon icon="mdi:magnify-remove-outline" class="text-6xl mb-4 mx-auto opacity-50" />
          <p class="text-lg">No encontramos resultados para tu búsqueda.</p>
          <p class="text-sm">Intenta con términos más generales o limpia los filtros.</p>
        </div>

        <div v-else-if="!hasSearched" class="py-12 text-center text-gray-500">
          <Icon icon="mdi:text-box-search-outline" class="text-6xl mb-4 mx-auto opacity-50" />
          <p>Ingresa un término para comenzar a buscar.</p>
        </div>

        <div v-else class="space-y-4">
          <p class="text-gray-400 text-sm mb-2">Se encontraron {{ results.length }} resultados</p>
          <GlassCard
            v-for="topic in results"
            :key="topic.id"
            class="p-4 cursor-pointer hover:bg-white/5 transition-colors group"
            @click="$router.push(`/forum/topic/${topic.id}`)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3
                  class="text-xl font-bold text-white mb-2 group-hover:text-brand-purple transition-colors"
                >
                  <!-- Highlight logic could be added here -->
                  {{ topic.title }}
                </h3>
                <p class="text-gray-400 text-sm mb-2 line-clamp-2">{{ topic.content }}</p>

                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span class="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                    <Icon icon="mdi:folder-outline" /> {{ topic.categoryName }}
                  </span>
                  <span
                    >Por <span class="text-gray-300">{{ topic.authorName }}</span></span
                  >
                  <span>{{ topic.createdAt }}</span>
                </div>
              </div>

              <div class="text-right text-gray-500 text-xs hidden md:block">
                <div class="flex items-center gap-1 justify-end">
                  <Icon icon="mdi:message-outline" /> {{ topic.repliesCount }}
                </div>
                <div class="flex items-center gap-1 justify-end mt-1">
                  <Icon icon="mdi:eye-outline" /> {{ topic.views }}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ForumService } from '@/services/forumService'
import type { ForumCategory, ForumTopic, ForumSearchFilters } from '@/types/forum'

const categories = ref<ForumCategory[]>([])
const results = ref<ForumTopic[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)

const filters = reactive<ForumSearchFilters>({
  query: '',
  categoryId: undefined,
  dateRange: 'ALL',
  sortBy: 'RELEVANCE',
})

const hasActiveFilters = computed(() => {
  return (
    filters.categoryId !== undefined ||
    filters.dateRange !== 'ALL' ||
    filters.sortBy !== 'RELEVANCE'
  )
})

const clearFilters = () => {
  filters.categoryId = undefined
  filters.dateRange = 'ALL'
  filters.sortBy = 'RELEVANCE'
  // keep query
}

const performSearch = async () => {
  if (!filters.query.trim() && !hasActiveFilters.value) return

  isLoading.value = true
  hasSearched.value = true
  try {
    results.value = await ForumService.searchTopics({ ...filters })
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    categories.value = await ForumService.getCategories()
  } catch (error) {
    console.error(error)
  }
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
