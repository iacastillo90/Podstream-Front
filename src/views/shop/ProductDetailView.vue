<template>
  <component :is="layout">
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"
      ></div>
    </div>
    <div v-else class="space-y-8 animate-fade-in-up">
      <!-- Breadcrumbs / Back Navigation -->
      <div class="flex items-center gap-2 text-sm text-gray-400">
        <router-link to="/" class="hover:text-white transition-colors">Inicio</router-link>
        <i class="fas fa-chevron-right text-[10px] opacity-50"></i>
        <router-link to="/products" class="hover:text-white transition-colors"
          >Productos</router-link
        >
        <i class="fas fa-chevron-right text-[10px] opacity-50"></i>
        <span class="text-brand-purple font-bold">{{ product.name }}</span>
      </div>

      <!-- Main Product Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image Gallery -->
        <div class="flex flex-col lg:flex-row gap-4 lg:h-[600px]">
          <!-- Thumbnails (Desktop: Left Col, Mobile: Bottom Grid) -->
          <div
            class="order-2 lg:order-1 grid grid-cols-4 lg:flex lg:flex-col gap-4 lg:w-24 lg:overflow-y-auto custom-scrollbar lg:pr-1 shrink-0"
          >
            <div
              v-for="(img, idx) in images"
              :key="idx"
              class="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all relative shrink-0"
              :class="
                currentImageIndex === idx
                  ? 'border-brand-purple ring-2 ring-brand-purple/20'
                  : 'border-transparent hover:border-white/20 opacity-60 hover:opacity-100'
              "
              @click="currentImageIndex = idx"
            >
              <img :src="img" class="w-full h-full object-cover" alt="Thumbnail" />
            </div>
          </div>

          <!-- Main Image -->
          <GlassCard
            class="order-1 lg:order-2 flex-1 p-2 relative group overflow-hidden border-white/5 h-full flex items-center justify-center bg-transparent"
          >
            <div class="w-full h-full relative flex items-center justify-center">
              <img
                :src="images[currentImageIndex]"
                class="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                alt="Product Main"
              />

              <button
                class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-brand-purple text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 z-20"
                @click="prevImage"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-brand-purple text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 z-20"
                @click="nextImage"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </GlassCard>
        </div>

        <!-- Product Info -->
        <GlassCard class="p-8 flex flex-col h-full relative overflow-hidden">
          <!-- Glow -->
          <div
            class="absolute -top-20 -right-20 w-80 h-80 bg-brand-blue/10 blur-[100px] rounded-full animate-pulse-slow"
          ></div>

          <div class="relative z-10 w-full">
            <div class="flex items-center justify-between mb-4">
              <div class="flex gap-2">
                <span
                  class="px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider border border-brand-purple/20"
                >
                  Premium
                </span>
                <span
                  class="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20 flex items-center gap-1"
                >
                  <i class="fas fa-check-circle"></i> En Stock
                </span>
              </div>
            </div>

            <h1 class="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight">
              {{ product.name }}
            </h1>

            <div class="flex items-center gap-4 mb-8">
              <div class="flex text-yellow-500 text-sm gap-0.5">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="['fas', n <= (product.rating || 0) ? 'fa-star' : 'fa-star-half-alt']"
                ></i>
              </div>
              <span class="text-gray-400 text-sm border-l border-white/10 pl-4"
                >{{ product.reviews || 0 }} Reseñas Verificadas</span
              >
            </div>

            <div
              class="text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue mb-8 w-fit"
            >
              ${{ product.price }}
            </div>

            <p
              class="text-gray-300 leading-relaxed mb-8 border-b border-white/5 pb-8 text-lg font-light"
            >
              {{ product.description }}
            </p>

            <div class="mt-auto space-y-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <div
                  class="flex items-center bg-white/5 rounded-full border border-white/10 px-2 w-fit"
                >
                  <button
                    class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    @click="quantity > 1 ? quantity-- : null"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="w-12 text-center font-bold text-lg">{{ quantity }}</span>
                  <button
                    class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    @click="quantity++"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <AnimatedButton
                  class="flex-1 justify-center text-lg shadow-lg shadow-brand-purple/20"
                  @click="addToCart(product)"
                >
                  <i class="fas fa-cart-plus mr-2"></i> Añadir al Carrito
                </AnimatedButton>
                <button
                  class="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-red-400 transition-colors"
                >
                  <i class="fas fa-heart text-xl"></i>
                </button>
              </div>

              <p class="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                <i class="fas fa-truck text-brand-blue"></i> Envío gratis en pedidos superiores a
                $50
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <!-- Specs & Reviews Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Specifications -->
        <div class="lg:col-span-1 space-y-6">
          <GlassCard class="p-6">
            <h3 class="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <i class="fas fa-microchip text-brand-blue"></i> Especificaciones
            </h3>
            <div class="space-y-0 divide-y divide-white/5">
              <div
                v-for="(spec, index) in product.specifications"
                :key="index"
                class="flex justify-between py-4 hover:bg-white/5 px-2 rounded transition-colors"
              >
                <span class="text-gray-400 text-sm">{{ spec.key }}</span>
                <span class="font-bold text-sm text-white">{{ spec.value }}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        <!-- Reviews -->
        <div class="lg:col-span-2 space-y-6">
          <GlassCard class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold font-heading flex items-center gap-2">
                <i class="fas fa-star text-yellow-500"></i> Reseñas de Clientes
              </h3>
              <AnimatedButton variant="secondary" class="!py-2 !px-4 text-xs"
                >Describir experiencia</AnimatedButton
              >
            </div>

            <div class="space-y-4">
              <div
                v-for="review in product.reviewsList"
                :key="review.id"
                class="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-brand-purple/30 transition-colors"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="review.avatar"
                      class="w-10 h-10 rounded-full border border-white/10"
                      alt="Avatar"
                    />
                    <div>
                      <div class="font-bold text-sm">{{ review.author }}</div>
                      <div class="text-xs text-gray-500">{{ review.date }}</div>
                    </div>
                  </div>
                  <div class="flex text-yellow-500 text-xs gap-0.5">
                    <i
                      v-for="n in 5"
                      :key="n"
                      :class="['fas', n <= review.rating ? 'fa-star' : 'fa-star-half-alt']"
                    ></i>
                  </div>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed">"{{ review.comment }}"</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <!-- Related Products -->
      <div class="pt-8 border-t border-white/5">
        <h2 class="text-3xl font-bold font-heading mb-8">Productos Relacionados</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductCard
            v-for="related in relatedProducts"
            :key="related.id"
            :product="related"
            @add-to-cart="addToCart"
            @view-details="viewRelatedDetails"
          />
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { ReviewService, RecommendationService } from '@/services/api'
import { useAuthStore } from '@/stores/auth' // Auth Store
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import { getImageUrl } from '@/utils/imageUtils'

// Layouts
const PublicLayout = defineAsyncComponent(() => import('@/components/layout/PublicLayout.vue'))
const AppLayout = defineAsyncComponent(() => import('@/layouts/AppLayout.vue'))

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const layout = computed(() => {
  return authStore.isAuthenticated ? AppLayout : PublicLayout
})

const product = ref<Product>({} as Product) // Initial strict type
const relatedProducts = ref<Product[]>([])
const currentImageIndex = ref(0)
const quantity = ref(1)
const isLoading = ref(true)

const fetchProduct = async () => {
  const id = route.params.id
  if (!id) return

  isLoading.value = true
  try {
    const response = await api.get(`/products/${id}`)
    product.value = response as unknown as Product

    try {
      const reviewRes = await ReviewService.getAll(id as string)
      product.value.reviewsList = Array.isArray(reviewRes)
        ? reviewRes
        : (reviewRes as { data?: unknown[] }).data || []
    } catch (e) {
      console.warn('Could not load reviews', e)
      product.value.reviewsList = []
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchRelated = async () => {
  const id = route.params.id
  try {
    const response = await RecommendationService.getContentBased(id as string)
    const rawData = Array.isArray(response)
      ? response
      : (response as { data?: unknown[] }).data || []

    relatedProducts.value = rawData.map((p: unknown) => {
      const prod = p as { image?: string; images?: string[]; photos?: string[] }
      return {
        ...(p as Record<string, unknown>),
        image: getImageUrl(
          prod.image ||
            (prod.images && prod.images.length > 0 ? prod.images[0] : null) ||
            (prod.photos && prod.photos.length > 0 ? prod.photos[0] : null),
        ),
      }
    })
  } catch (error) {
    console.warn('Error fetching recommendations:', error)
  }
}

// Ensure product has images array for UI
const images = computed(() => {
  if (product.value.images && product.value.images.length > 0)
    return product.value.images.map((img) => getImageUrl(img))

  // Check for various possible backend field names for the gallery
  const gallery =
    product.value.images ||
    product.value.photos ||
    (product.value as Record<string, unknown>).imageCollection ||
    []

  // Ensure we have an array
  let validGallery = Array.isArray(gallery) ? gallery : []

  // If we have a main image, ensure it's in the list (if not already)
  if (product.value.image) {
    const mainImg = product.value.image
    if (!validGallery.includes(mainImg)) {
      validGallery = [mainImg, ...validGallery]
    }
  }

  if (validGallery.length > 0) {
    return validGallery.map((img) => getImageUrl(img))
  }

  if (product.value.image) return [getImageUrl(product.value.image)]
  return ['https://placehold.co/600']
})

watch(
  () => product.value,
  () => {
    currentImageIndex.value = 0
  },
)

onMounted(() => {
  fetchProduct()
  fetchRelated()
})

const addToCart = async (prod: unknown) => {
  const productToAdd = prod as Product
  try {
    await cartStore.addItem(productToAdd, quantity.value)
    alert('Producto agregado al carrito')
  } catch (error) {
    console.error('Error adding to cart:', error)
    alert('Error agregando al carrito')
  }
}

const viewRelatedDetails = (prod: Product) => {
  router.push(`/products/${prod.id}`).then(() => {
    fetchProduct()
    fetchRelated()
    window.scrollTo(0, 0)
  })
}

const prevImage = () => {
  if (images.value.length === 0) return
  currentImageIndex.value =
    (currentImageIndex.value - 1 + images.value.length) % images.value.length
}

const nextImage = () => {
  if (images.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}
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
