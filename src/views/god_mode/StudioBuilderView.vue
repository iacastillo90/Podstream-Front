<template>
  <div class="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col pt-16">
    <!-- Builder Header -->
    <header
      class="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-20"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]"
        >
          <i class="fas fa-cube text-xl"></i>
        </div>
        <div>
          <h1 class="font-bold text-xl tracking-wide font-heading">
            STUDIO<span class="text-brand-purple">BUILDER</span>
          </h1>
          <p class="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
            v1.1 3D Simulation
          </p>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <!-- Environment Toggles -->
        <div class="flex bg-white/5 rounded-lg p-1 gap-1">
          <button
            class="px-3 py-1 rounded text-xs font-bold transition-all"
            :class="
              store.viewMode === '2D' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
            "
            @click="store.viewMode = '2D'"
          >
            2D
          </button>
          <button
            class="px-3 py-1 rounded text-xs font-bold transition-all"
            :class="
              store.viewMode === '3D'
                ? 'bg-brand-purple text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            "
            @click="store.viewMode = '3D'"
          >
            3D
          </button>
        </div>

        <div
          class="hidden md:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5"
        >
          <div class="text-right">
            <p class="text-[10px] text-gray-400 uppercase font-bold">Total Estimado</p>
            <p class="text-brand-green font-mono font-bold">${{ store.totalPrice.toFixed(2) }}</p>
          </div>
          <div class="h-8 w-px bg-white/10"></div>
          <div class="text-right">
            <p class="text-[10px] text-gray-400 uppercase font-bold">Consumo</p>
            <p class="text-brand-blue font-mono font-bold">{{ store.totalPower }}W</p>
          </div>
        </div>

        <AnimatedButton variant="primary" @click="saveBuild">
          <i class="fas fa-save mr-2"></i> Guardar
        </AnimatedButton>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar: Gear Library -->
      <aside
        class="w-80 border-r border-white/10 bg-black/80 backdrop-blur-xl flex flex-col z-10 transition-all duration-300 left-0 h-full absolute md:relative"
        :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
      >
        <div class="p-4 border-b border-white/5 flex justify-between items-center">
          <h2 class="font-bold font-heading text-sm uppercase tracking-wider text-gray-400">
            Librería de Equipo
          </h2>
          <button class="md:hidden text-gray-400" @click="sidebarOpen = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Categories -->
        <div class="flex gap-2 p-4 overflow-x-auto border-b border-white/5 no-scrollbar">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border"
            :class="
              activeCategory === cat.id
                ? 'bg-brand-purple border-brand-purple text-white'
                : 'bg-transparent border-white/10 text-gray-400 hover:text-white'
            "
            @click="activeCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Product Grid -->
        <div class="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 pb-20">
          <div
            v-for="item in filteredCatalog"
            :key="item.id"
            class="group relative bg-white/5 border border-white/5 rounded-lg overflow-hidden hover:border-brand-purple/50 transition-all cursor-pointer"
            @click="addToCanvas(item)"
          >
            <div class="aspect-square bg-white/5 p-2 relative">
              <img
                :src="item.image"
                class="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
              />
              <div
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i class="fas fa-plus-circle text-brand-purple bg-black rounded-full"></i>
              </div>
            </div>
            <div class="p-2">
              <p class="text-xs font-bold text-white truncate">{{ item.name }}</p>
              <p class="text-[10px] text-gray-400">${{ item.price }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Toggle Sidebar Button (Mobile/Collapsed) -->
      <button
        v-if="!sidebarOpen"
        class="absolute top-20 left-4 z-20 w-10 h-10 rounded-lg bg-black/50 border border-brand-purple/30 text-brand-purple flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all shadow-xl"
        @click="sidebarOpen = true"
      >
        <i class="fas fa-bars"></i>
      </button>

      <!-- Main Canvas Area -->
      <main
        ref="canvasContainer"
        class="flex-1 relative bg-[#0a0a0a] overflow-hidden user-select-none"
      >
        <!-- 2D Canvas Mode -->
        <div v-if="store.viewMode === '2D'" class="w-full h-full relative">
          <!-- Cyberpunk Grid Floor -->
          <div class="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

          <!-- Desk Space (2D) -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="relative transition-all duration-300 ease-in-out"
              :style="{
                width: '800px',
                height: '500px',
                transform: `scale(${viewScale})`,
              }"
            >
              <!-- Desk Texture -->
              <div
                class="absolute inset-0 rounded-xl border border-white/20 shadow-2xl overflow-hidden"
                :class="store.deskTexture === 'dark_wood' ? 'bg-[#1a1a1a]' : 'bg-gray-200'"
              >
                <!-- Texture Pattern -->
                <div
                  class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"
                ></div>
              </div>

              <!-- Dropped Items -->
              <div
                v-for="item in store.items"
                :key="item.id"
                class="absolute cursor-move group select-none"
                :style="{
                  left: item.x + '%',
                  top: item.y + '%',
                  transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                  zIndex: 10,
                }"
                @mousedown="startDrag($event, item.id!)"
              >
                <!-- Selection Indicator -->
                <div
                  class="absolute w-24 h-24 -left-12 -top-12 rounded-full border-2 border-dashed border-brand-purple opacity-0 transition-opacity pointer-events-none"
                  :class="{ '!opacity-60': store.selectedItemId === item.id }"
                ></div>

                <!-- Item Image -->
                <div class="relative w-24 h-24">
                  <img
                    :src="item.image"
                    class="w-full h-full object-contain pointer-events-none filter drop-shadow-lg"
                  />
                </div>

                <!-- Controls -->
                <div
                  v-if="store.selectedItemId === item.id"
                  class="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-1 bg-black/80 rounded-full px-2 py-1 backdrop-blur-sm z-[100]"
                >
                  <button
                    class="w-6 h-6 rounded-full hover:bg-white/20 text-[10px] text-white"
                    @click.stop="rotateItem(item.id!, -15)"
                  >
                    <i class="fas fa-undo"></i>
                  </button>
                  <button
                    class="w-6 h-6 rounded-full hover:bg-red-500/20 text-red-500 text-[10px]"
                    @click.stop="store.removeItem(item.id!)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <button
                    class="w-6 h-6 rounded-full hover:bg-white/20 text-[10px] text-white"
                    @click.stop="rotateItem(item.id!, 15)"
                  >
                    <i class="fas fa-redo"></i>
                  </button>
                </div>
              </div>

              <!-- Drop Zone Hint -->
              <div
                v-if="store.items.length === 0"
                class="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none"
              >
                <div class="text-center">
                  <i class="fas fa-plus text-4xl mb-2 opacity-20"></i>
                  <p class="text-xs uppercase tracking-widest opacity-40">Arrastra equipo aquí</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3D Viewer Mode -->
        <Studio3DViewer
          v-else
          :items="store.items"
          :selected-item-id="store.selectedItemId"
          @item-selected="(id) => (store.selectedItemId = id)"
        />

        <!-- View Controls (Common) -->
        <div class="absolute bottom-8 right-8 flex flex-col gap-2 z-20">
          <button
            class="w-10 h-10 rounded-full bg-black/50 border border-white/10 hover:bg-brand-purple hover:border-brand-purple transition-all flex items-center justify-center text-white"
            title="Reset View"
            @click="resetView"
          >
            <i class="fas fa-sync-alt"></i>
          </button>
          <div
            v-if="store.viewMode === '2D'"
            class="bg-black/50 border border-white/10 rounded-full p-1 flex flex-col gap-1"
          >
            <button
              class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white"
              @click="zoomIn"
            >
              <i class="fas fa-plus text-xs"></i>
            </button>
            <button
              class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white"
              @click="zoomOut"
            >
              <i class="fas fa-minus text-xs"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useStudioStore } from '@/stores/studio'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import Studio3DViewer from '@/components/studio/Studio3DViewer.vue'

const store = useStudioStore()
const sidebarOpen = ref(true)
const activeCategory = ref('microphone')
const canvasContainer = ref<HTMLElement | null>(null)

// View State
const viewScale = ref(1)

const categories = [
  { id: 'microphone', label: 'Micrófonos' },
  { id: 'interface', label: 'Interfaces' },
  { id: 'headphone', label: 'Auriculares' },
  { id: 'monitor', label: 'Monitores' },
  { id: 'accessory', label: 'Accesorios' },
]

const filteredCatalog = computed(() => {
  return store.availableItems.filter((item) => item.category === activeCategory.value)
})

onMounted(() => {
  store.fetchCatalog()
})

const addToCanvas = (product: any) => {
  store.addItem(product)
}

const rotateItem = (id: number | string, angle: number) => {
  const item = store.items.find((i) => i.id === id)
  if (item) {
    item.rotation += angle
  }
}

const zoomIn = () => (viewScale.value = Math.min(viewScale.value + 0.1, 1.5))
const zoomOut = () => (viewScale.value = Math.max(viewScale.value - 0.1, 0.5))
const resetView = () => {
  viewScale.value = 1
  // store.viewMode = '3D' // Keep current mode
}

const saveBuild = async () => {
  const name = prompt('Nombre para tu setup:', 'Mi Studio ' + new Date().toLocaleDateString())
  if (!name) return

  await store.saveBuild(name)
}

// Drag Logic (2D Only)
let isDragging = false
let draggedId: number | string | null = null

const startDrag = (event: MouseEvent, id: number | string) => {
  isDragging = true
  draggedId = id
  store.selectedItemId = id

  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', stopDrag)
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging || !draggedId || !canvasContainer.value) return

  const item = store.items.find((i) => i.id === draggedId)
  if (item) {
    const sensitivity = 0.15 / viewScale.value
    const deltaX = event.movementX * sensitivity
    const deltaY = event.movementY * sensitivity * 1 // Normal 2D movement logic

    item.x += deltaX
    item.y += deltaY

    item.x = Math.max(0, Math.min(100, item.x))
    item.y = Math.max(0, Math.min(100, item.y))
  }
}

const stopDrag = () => {
  isDragging = false
  draggedId = null
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', stopDrag)
}
</script>

<style scoped>
.font-heading {
  font-family: 'Outfit', sans-serif;
}

/* Cyberpunk Grid Background */
.grid-bg {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
}

.perspective-container {
  perspective: 1200px;
}

.desk-surface {
  transform-style: preserve-3d;
  /* Fancy Neon Glow under desk */
  box-shadow: 0 0 100px rgba(139, 92, 246, 0.1);
}

.user-select-none {
  user-select: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
