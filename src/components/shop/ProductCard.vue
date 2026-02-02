<template>
  <GlassCard
    class="group relative flex flex-col h-full hover:border-brand-purple/50 transition-all duration-300"
    @click="$emit('view-details', product)"
  >
    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden rounded-t-xl bg-white/5">
      <img
        :src="getImageUrl(product.image)"
        :alt="product.name"
        class="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-700"
      />
      <!-- Quick Actions (Hover) -->
      <div
        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]"
      >
        <button
          class="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          title="Añadir al Carrito"
          @click.stop="$emit('add-to-cart', product)"
        >
          <i class="fas fa-cart-plus text-xs"></i>
        </button>
        <button
          class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform hover:bg-white/20"
          title="Ver Detalles"
          @click.stop="$emit('view-details', product)"
        >
          <i class="fas fa-eye text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-3 flex-1 flex flex-col">
      <div class="mb-1">
        <h3
          class="text-sm font-medium leading-tight group-hover:text-brand-blue transition-colors cursor-pointer line-clamp-1 mb-1"
          @click="$emit('view-details', product)"
        >
          {{ product.name }}
        </h3>

        <!-- Truncated Description -->
        <p class="text-xs text-gray-400 line-clamp-2 mb-2 min-h-[2.5em]">
          {{ product.description || 'Descripción no disponible.' }}
        </p>

        <!-- Rating & Category Tag -->
        <div class="flex items-center justify-between mt-1">
          <div class="flex items-center gap-1">
            <div class="flex text-yellow-500 text-[10px]">
              <i
                v-for="n in 5"
                :key="n"
                :class="['fas', n <= (product.rating || 5) ? 'fa-star' : 'fa-star-half-alt']"
              ></i>
            </div>
            <span class="text-[10px] text-gray-500">({{ product.reviews || 0 }})</span>
          </div>

          <span
            v-if="product.categoryName || product.category?.name || product.tag"
            class="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 font-medium"
          >
            {{ product.categoryName || product.category?.name || product.tag }}
          </span>
        </div>
      </div>

      <!-- Price & Action -->
      <div class="mt-auto pt-2 flex items-center justify-between">
        <div class="flex flex-col">
          <!-- Discount Logic if needed, for now just price -->
          <span class="text-sm font-bold font-heading text-white"
            >${{ Number(product.price).toFixed(2) }}</span
          >
        </div>

        <button
          class="text-xs font-bold uppercase tracking-wider text-brand-purple hover:text-white transition-colors"
          @click.stop="$emit('add-to-cart', product)"
        >
          <i class="fas fa-plus-circle text-lg"></i>
        </button>
      </div>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'
import { getImageUrl } from '@/utils/imageUtils'

defineProps<{
  product: {
    id: number | string
    name: string
    price: string | number
    image?: string
    rating?: number
    reviews?: number
    tag?: string
    badge?: string
    description?: string
    category?: { name: string; id?: any }
    categoryName?: string
  }
}>()

defineEmits(['add-to-cart', 'view-details'])
</script>
