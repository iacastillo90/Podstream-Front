<template>
  <div class="min-h-screen bg-[#050505] text-white flex flex-col pt-16 font-sans">
    <!-- Header -->
    <div
      class="px-6 py-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold font-heading mb-1 text-center md:text-left">
          VERSUS <span class="text-brand-purple">MODE</span>
        </h1>
        <p class="text-xs text-gray-400 uppercase tracking-widest text-center md:text-left">
          Comparador Técnico Avanzado
        </p>
      </div>

      <!-- Search / Add -->
      <div class="relative group z-20">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar equipo..."
            class="bg-white/10 text-white pl-10 pr-4 py-2 rounded-full font-bold text-sm focus:bg-white/20 outline-none w-64 transition-all"
            @input="handleSearch"
          />
        </div>

        <!-- Dropdown -->
        <div
          v-if="store.availableProducts.length > 0"
          class="absolute right-0 top-full mt-2 w-64 bg-black border border-white/10 rounded-xl shadow-xl overflow-hidden"
        >
          <div
            v-for="prod in store.availableProducts"
            :key="prod.id"
            class="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0"
            @click="store.addProduct(prod.id)"
          >
            <img :src="prod.image" class="w-8 h-8 object-contain" />
            <span class="text-sm font-bold">{{ prod.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10 overflow-hidden"
    >
      <!-- Chart Area -->
      <div
        class="flex-1 lg:w-1/2 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-black to-[#0a0a0a] relative"
      >
        <div class="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>

        <div class="relative w-full max-w-md aspect-square">
          <canvas ref="radarCanvas" class="w-full h-full"></canvas>
        </div>

        <div class="flex gap-6 mt-8">
          <div
            v-for="(prod, index) in store.selectedProducts"
            :key="prod.id"
            class="flex items-center gap-2"
          >
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors[index] }"></div>
            <span class="text-sm font-bold">{{ prod.name }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Table -->
      <div class="flex-1 lg:w-1/2 overflow-y-auto">
        <div class="grid grid-cols-[auto_1fr] divide-x divide-white/5">
          <!-- Products Header (Sticky?) -->
          <div
            class="col-start-2 grid"
            :style="{ gridTemplateColumns: `repeat(${store.selectedProducts.length}, 1fr)` }"
          >
            <div
              v-for="prod in store.selectedProducts"
              :key="prod.id"
              class="p-6 text-center border-b border-white/10 relative group"
            >
              <button
                class="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                @click="store.removeProduct(prod.id)"
              >
                <i class="fas fa-times"></i>
              </button>
              <div class="h-32 mb-4 flex items-center justify-center">
                <img :src="prod.image" class="max-h-full object-contain drop-shadow-lg" />
              </div>
              <h3 class="font-bold text-lg mb-1">{{ prod.name }}</h3>
              <p class="text-brand-purple font-mono font-bold text-xl">${{ prod.price }}</p>
            </div>
          </div>

          <!-- Specs Rows -->
          <div class="contents">
            <!-- Row 1 -->
            <div
              class="p-4 bg-white/5 font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center justify-end border-b border-white/5"
            >
              Calidad Audio
            </div>
            <div
              class="col-start-2 grid border-b border-white/5"
              :style="{ gridTemplateColumns: `repeat(${store.selectedProducts.length}, 1fr)` }"
            >
              <div
                v-for="prod in store.selectedProducts"
                :key="prod.id"
                class="p-4 text-center font-mono"
              >
                <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-brand-blue"
                    :style="{ width: prod.specs.quality + '%' }"
                  ></div>
                </div>
                <span class="text-xs text-gray-400 mt-1 block">{{ prod.specs.quality }}/100</span>
              </div>
            </div>

            <!-- Row 2 -->
            <div
              class="p-4 bg-white/5 font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center justify-end border-b border-white/5"
            >
              Extras
            </div>
            <div
              class="col-start-2 grid border-b border-white/5"
              :style="{ gridTemplateColumns: `repeat(${store.selectedProducts.length}, 1fr)` }"
            >
              <div
                v-for="prod in store.selectedProducts"
                :key="prod.id"
                class="p-4 text-center font-mono"
              >
                {{ prod.specs.features }} pts
              </div>
            </div>

            <!-- Row 3 -->
            <div
              class="p-4 bg-white/5 font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center justify-end border-b border-white/5"
            >
              Tipo
            </div>
            <div
              class="col-start-2 grid border-b border-white/5"
              :style="{ gridTemplateColumns: `repeat(${store.selectedProducts.length}, 1fr)` }"
            >
              <div
                v-for="prod in store.selectedProducts"
                :key="prod.id"
                class="p-4 text-center text-sm font-bold text-gray-300"
              >
                {{ prod.details.find((d) => d.name === 'Type')?.value }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="store.selectedProducts.length === 0"
          class="h-full flex items-center justify-center text-gray-500"
        >
          Selecciona productos para comparar
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useVersusStore } from '@/stores/versus'

const store = useVersusStore()
const radarCanvas = ref<HTMLCanvasElement | null>(null)
const colors = ['#8b5cf6', '#3b82f6', '#ec4899'] // Purple, Blue, Pink
const bgColors = ['rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(236, 72, 153, 0.2)']

const searchQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | undefined

const handleSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.searchProducts(searchQuery.value)
  }, 500)
}

const drawRadar = () => {
  if (!radarCanvas.value || store.selectedProducts.length === 0) return

  const ctx = radarCanvas.value.getContext('2d')
  if (!ctx) return

  const width = (radarCanvas.value.width = radarCanvas.value.parentElement?.clientWidth || 400)
  const height = (radarCanvas.value.height = radarCanvas.value.parentElement?.clientHeight || 400)
  const centerX = width / 2
  const centerY = height / 2
  const maxRadius = Math.min(width, height) / 2 - 40

  ctx.clearRect(0, 0, width, height)

  const features = ['quality', 'features', 'priceToValue', 'durability', 'easeOfUse']
  const labels = ['Calidad', 'Extras', 'Valor', 'Durabilidad', 'Uso']
  const angleStep = (Math.PI * 2) / features.length

  // Draw Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1

  for (let r = 1; r <= 4; r++) {
    const radius = maxRadius * (r / 4)
    ctx.beginPath()
    for (let i = 0; i < features.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }

  // Draw Labels
  ctx.fillStyle = '#9ca3af'
  ctx.font = '10px bold sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < features.length; i++) {
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + Math.cos(angle) * (maxRadius + 20)
    const y = centerY + Math.sin(angle) * (maxRadius + 20)
    ctx.fillText(labels[i].toUpperCase(), x, y)
  }

  // Draw Data
  store.selectedProducts.forEach((prod, pIndex) => {
    ctx.beginPath()
    features.forEach((feat, i) => {
      const angle = i * angleStep - Math.PI / 2
      const value = (prod.specs as Record<string, number>)[feat] / 100
      const radius = maxRadius * value
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.strokeStyle = colors[pIndex % colors.length]
    ctx.lineWidth = 2
    ctx.fillStyle = bgColors[pIndex % bgColors.length]
    ctx.fill()
    ctx.stroke()
  })
}

onMounted(() => {
  drawRadar()
  window.addEventListener('resize', drawRadar)
})

watch(
  () => store.selectedProducts,
  () => {
    drawRadar()
  },
  { deep: true },
)
</script>

<style scoped>
.font-heading {
  font-family: 'Outfit', sans-serif;
}
.grid-bg {
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}
</style>
