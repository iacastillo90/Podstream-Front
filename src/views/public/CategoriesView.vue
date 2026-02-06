<template>
  <div class="min-h-screen bg-brand-dark text-white pt-24 px-4 pb-12">
    <div class="container mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold font-heading mb-4">
          Nuestras <span class="text-brand-purple">Categorías</span>
        </h1>
        <p class="text-gray-400 max-w-2xl mx-auto">
          Explora nuestro catálogo de equipos profesionales diseñados para elevar tu contenido al
          siguiente nivel.
        </p>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GlassCard
          v-for="category in categories"
          :key="category.id"
          class="group cursor-pointer overflow-hidden p-0 h-[400px] relative"
          @click="$router.push(`/products?categoryId=${category.id}`)"
        >
          <img
            :src="category.image"
            :alt="category.name"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
          ></div>

          <div class="absolute bottom-0 left-0 p-8">
            <h3 class="text-2xl font-bold mb-2">{{ category.name }}</h3>
            <p class="text-gray-300 text-sm mb-4">{{ category.description }}</p>
            <AnimatedButton
              class="!py-2 !px-4 text-xs"
              @click.stop="$router.push(`/products?categoryId=${category.id}`)"
            >
              Ver Productos
            </AnimatedButton>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Category } from '@/types/product'
import { categoryService } from '@/services/categoryService'
import { getFullImageUrl } from '@/utils/imageHelper'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

const categories = ref<Category[]>([])
const isLoading = ref(true)

const fetchCategories = async () => {
  try {
    const response = await categoryService.getAll()
    // Handle unwrapped vs wrapped response
    const rawData = Array.isArray(response)
      ? response
      : (response as { data: unknown[] }).data || []

    categories.value = rawData.map((cat) => {
      const c = cat as { name: string; description?: string; image?: string }
      return {
        ...cat,
        // Fallback description if backend doesn't provide one
        description: c.description || `Explora nuestra colección de ${c.name}`,
        image: getFullImageUrl(c.image),
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
