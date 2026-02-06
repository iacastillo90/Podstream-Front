<template>
  <div
    class="relative w-full h-[85vh] flex items-center overflow-hidden bg-brand-dark selection:bg-brand-purple selection:text-white"
  >
    <!-- Background Decor Elements -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <!-- Dynamic gradients/blobs matching the product color could go here -->
      <div
        class="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-brand-purple/10 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[10%] left-[20%] w-[30vw] h-[30vw] bg-brand-blue/5 rounded-full blur-[100px]"
      ></div>
    </div>

    <div
      class="container mx-auto px-6 relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center lg:justify-start pt-24 lg:pt-0"
    >
      <!-- Content Left (Product Details) -->
      <div
        class="w-full lg:w-1/3 space-y-6 z-20 animate__animated animate__fadeInRight text-center lg:text-left order-2 lg:order-1 mt-8 lg:mt-0"
      >
        <div v-if="currentProduct">
          <div
            class="inline-block px-3 py-1 mb-4 rounded-full border border-white/20 bg-white/5 text-xs font-bold tracking-widest text-brand-blue uppercase"
          >
            {{ currentProduct.category?.name || 'Featured' }}
          </div>

          <h1 class="text-5xl lg:text-7xl font-black font-heading leading-none mb-2 text-white">
            {{ getProductName(currentProduct) }}
          </h1>

          <div
            class="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple mb-6"
          >
            ${{ currentProduct.price }}
          </div>

          <!-- Description/Specs -->
          <p class="text-gray-400 max-w-sm leading-relaxed mb-8 line-clamp-3">
            {{ currentProduct.description }}
          </p>

          <!-- Actions -->
          <div class="flex items-center justify-center lg:justify-start gap-4">
            <button
              class="bg-brand-pink text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,0,128,0.4)]"
              @click="$emit('add-to-cart', currentProduct)"
            >
              Buy Now
            </button>
            <button
              class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              @click="$emit('view-details', currentProduct)"
            >
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-500">
          Loading products...
        </div>
      </div>

      <!-- Center Hero Image -->
      <div
        class="relative lg:absolute inset-0 flex items-center justify-center pointer-events-none z-10 order-1 lg:order-2 h-[40vh] lg:h-auto w-full"
      >
        <!-- Dynamic Background Blur -->
        <transition name="fade">
          <div
            v-if="currentProduct"
            :key="'bg-' + currentProduct.id"
            class="absolute inset-0 z-[-1] flex items-center justify-center opacity-40"
          >
            <div
              class="w-[600px] h-[600px] rounded-full bg-center bg-cover blur-[100px] opacity-60 mix-blend-screen animate__animated animate__pulse animate__infinite animate__slower"
              :style="{ backgroundImage: `url(${currentProduct.image})` }"
            ></div>
          </div>
        </transition>

        <transition name="hero-image" mode="out-in">
          <img
            v-if="currentProduct"
            :key="currentProduct.id"
            :src="currentProduct.image"
            class="max-h-[100%] lg:max-h-[70vh] w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform lg:-rotate-12 transition-all duration-700 hover:scale-105 hover:lg:-rotate-0"
            alt="Hero Product"
          />
        </transition>
      </div>

      <!-- Right Circular Carousel -->
      <div
        class="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[600px] z-30 items-center justify-end pr-8"
      >
        <!-- The Wheel Container -->
        <div class="relative w-full h-full perspective-1000">
          <div
            class="absolute right-[-150px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-transform duration-700 ease-out"
            :style="{ transform: `translateY(-50%) rotate(${rotationAngle}deg)` }"
          >
            <!-- Carousel Items -->
            <div
              v-for="(product, index) in products"
              :key="product.id"
              class="absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12 transition-all duration-300 cursor-pointer group"
              :style="getItemStyle(index)"
              @click="selectProduct(index)"
            >
              <!-- Item Card -->
              <div
                class="w-full h-full rounded-2xl p-2 backdrop-blur-md border border-white/10 group-hover:border-brand-purple/50 transition-all flex items-center justify-center relative transform group-hover:scale-110"
                :class="{
                  '!border-brand-pink scale-125 shadow-[0_0_20px_rgba(255,0,128,0.3)]':
                    index === selectedIndex,
                }"
              >
                <img
                  :src="product.image"
                  class="w-full h-full object-contain pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Dots (Vertical) -->
        <div class="absolute right-8 flex flex-col gap-2 z-40">
          <button
            v-for="(product, index) in products"
            :key="'dot-' + product.id"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="index === selectedIndex ? 'bg-brand-pink h-6' : 'bg-white/20 hover:bg-white/50'"
            @click="selectProduct(index)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types'

const props = defineProps<{
  products: Product[]
}>()

defineEmits(['add-to-cart', 'view-details'])

const selectedIndex = ref(0)
const rotationAngle = ref(0)
const ITEM_ANGLE_STEP = 45 // Degrees between items

const currentProduct = computed(() => {
  if (!props.products.length) return null
  return props.products[selectedIndex.value]
})

const selectProduct = (index: number) => {
  selectedIndex.value = index
  // rotate so the selected item is at approximately 180 degrees (left side of the circle)
  // Actually, simple Logic:
  // If index 0 is at 180 deg (left), index 1 is at 180 - STEP, etc.
  // To bring index N to 180:
  // Target Rotation = - (180 - (index * STEP)) ? No lets simplify.
  // Let's say Item 0 is at -90 deg relative to container center?
  // Let's calculate purely on index difference.

  // Simple approach: Item placement angle is (index * STEP).
  // We want (index * STEP) + rotationAngle = 180 (Left side of wheel).
  // so rotationAngle = 180 - (index * STEP).

  rotationAngle.value = 180 - index * ITEM_ANGLE_STEP
}

const getItemStyle = (index: number) => {
  const angleStart = index * ITEM_ANGLE_STEP
  // Items are placed around the circle boundary
  // x = r * cos(a), y = r * sin(a)
  // Container is 400x400, radius = 200.
  const radius = 200
  // Convert to radians
  const rad = (angleStart * Math.PI) / 180

  // We want to distribute them along the edge
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  // However, we want them to rotate WITH the parent div.
  // The parent div rotates. These items are static relative to parent.
  // We need to counter-rotate the items so the image stays upright?
  // Yes, transform: rotate(-rotationAngle)

  return {
    transform: `translate(${x}px, ${y}px) rotate(${-rotationAngle.value}deg)`,
    // Note: The rotate(-rotationAngle) keeps the item upright as the wheel spins
  }
}

const getProductName = (p: Product) => {
  // If name is too long, split or Truncate?
  return p.name
}

// Auto play?
/*
onMounted(() => {
    setInterval(() => {
        const next = (selectedIndex.value + 1) % props.products.length
        selectProduct(next)
    }, 5000)
})
*/
// Set initial
watch(
  () => props.products,
  () => {
    if (props.products.length > 0) selectProduct(0)
  },
  { immediate: true },
)
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.hero-image-enter-active,
.hero-image-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-image-enter-from {
  opacity: 0;
  transform: translateX(100px) rotate(0deg) scale(0.8);
}

.hero-image-leave-to {
  opacity: 0;
  transform: translateX(-100px) rotate(-20deg) scale(0.8);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
