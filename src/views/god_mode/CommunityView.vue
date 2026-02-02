<template>
  <div class="min-h-screen bg-[#050505] text-white flex flex-col pt-16 font-sans">
    <!-- Community Header -->
    <div
      class="px-6 py-8 md:px-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
    >
      <div>
        <h1 class="text-4xl md:text-5xl font-black font-heading mb-2">
          COMMUNITY <span class="text-brand-purple">SETUPS</span>
        </h1>
        <p class="text-gray-400 max-w-xl">
          Inspírate con los estudios de los mejores creadores. Haz clic en los puntos para ver el
          equipo.
        </p>
      </div>
      <AnimatedButton variant="primary">
        <i class="fas fa-camera mr-2"></i> Subir mi Setup
      </AnimatedButton>
    </div>

    <!-- Tags Filter -->
    <div class="px-6 md:px-12 py-6 flex gap-3 overflow-x-auto no-scrollbar">
      <button
        v-for="tag in ['ALL', 'RGB', 'Minimal', 'Production', 'Streaming', 'Retro']"
        :key="tag"
        class="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap"
        :class="
          store.activeTag === tag
            ? 'bg-white text-black border-white'
            : 'bg-transparent text-gray-400 border-white/10 hover:text-white'
        "
        @click="store.activeTag = tag"
      >
        #{{ tag }}
      </button>
    </div>

    <!-- Masonry-ish Grid -->
    <div class="px-6 md:px-12 pb-20 columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      <GlassCard
        v-for="post in store.posts"
        :key="post.id"
        class="break-inside-avoid overflow-hidden p-0 group"
      >
        <!-- Image Container with Hotspots -->
        <div class="relative w-full aspect-[4/3] bg-black group/image">
          <img
            :src="post.image"
            class="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
          />

          <!-- Hotspots Overlay -->
          <div
            class="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
          >
            <div
              v-for="(hotspot, index) in post.hotspots"
              :key="index"
              class="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-pointer group/hotspot"
              :style="{ left: hotspot.x + '%', top: hotspot.y + '%' }"
            >
              <!-- Pulse Animation -->
              <div class="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
              <div class="relative w-3 h-3 bg-white rounded-full shadow-lg z-10"></div>

              <!-- Tooltip Product Card -->
              <div
                class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-black/90 backdrop-blur border border-white/10 rounded-xl p-3 opacity-0 translate-y-2 group-hover/hotspot:opacity-100 group-hover/hotspot:translate-y-0 transition-all z-20 pointer-events-none group-hover/hotspot:pointer-events-auto shadow-xl"
              >
                <p class="text-xs font-bold text-white mb-1">{{ hotspot.productName }}</p>
                <p class="text-brand-purple font-mono text-xs mb-2">
                  ${{ (hotspot as any).price }}
                </p>
                <button
                  class="w-full bg-white text-black text-[10px] font-bold py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  Ver Producto
                </button>
                <!-- Arrow -->
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90"
                ></div>
              </div>
            </div>
          </div>

          <div
            class="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-2"
          >
            <i class="fas fa-tag text-xs"></i> {{ post.hotspots.length }} Productos
          </div>
        </div>

        <!-- Post Info -->
        <div class="p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <img :src="post.userAvatar" class="w-8 h-8 rounded-full border border-white/10" />
              <span class="text-sm font-bold text-white">{{ post.user }}</span>
            </div>
            <button
              class="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-xs font-bold"
              @click="store.likePost(post.id)"
            >
              <i class="fas fa-heart" :class="{ 'text-red-500': false }"></i> {{ post.likes }}
            </button>
          </div>

          <h3 class="font-bold text-lg leading-tight mb-1">{{ post.title }}</h3>
          <p class="text-sm text-gray-400 mb-3">{{ post.description }}</p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="text-[10px] text-gray-500 hover:text-white transition-colors cursor-pointer"
              >#{{ tag }}</span
            >
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useCommunityStore } from '@/stores/community'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

const store = useCommunityStore()

onMounted(() => {
  store.fetchPosts()
})

watch(
  () => store.activeTag,
  () => {
    store.fetchPosts()
  },
)
</script>

<style scoped>
.font-heading {
  font-family: 'Outfit', sans-serif;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
