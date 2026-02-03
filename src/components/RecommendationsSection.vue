<template>
  <div class="mb-8">
    <h2 class="text-2xl font-semibold text-white mb-4">Recomendaciones para Ti</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="product in recommendedProducts"
        :key="product.id"
        class="bg-black/60 rounded-xl p-4 border border-purple-600/20 flex flex-col items-center"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="w-28 h-28 object-cover rounded-lg mb-4"
        />
        <h3 class="text-lg font-semibold text-white mb-1">{{ product.name }}</h3>
        <div class="flex items-center gap-2 mb-2">
          <div class="flex text-yellow-400">
            <i
              v-for="n in 5"
              :key="n"
              :class="['fas', n <= product.rating ? 'fa-star' : 'fa-star-half-alt']"
            ></i>
          </div>
          <span class="text-gray-400 text-sm">({{ product.reviews }})</span>
        </div>
        <span class="text-purple-400 font-bold mb-2">${{ product.price }}</span>
        <button
          class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition"
          @click="addToCart(product)"
        >
          Añadir
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface Product {
  id: number | string
  name: string
  image: string
  rating: number
  reviews: number
  price: number | string
}

export default defineComponent({
  props: {
    recommendedProducts: {
      type: Array as PropType<Product[]>,
      default: () => [],
    },
  },
  emits: ['add-to-cart'],
  methods: {
    addToCart(product: Product) {
      this.$emit('add-to-cart', product)
    },
  },
})
</script>
