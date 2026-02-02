<template>
  <div class="min-h-screen bg-[#050505] text-white flex flex-col pt-16">
    <!-- Audio Lab Header -->
    <div
      class="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur"
    >
      <div>
        <h1
          class="text-3xl font-bold font-heading mb-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-teal-400"
        >
          Audio<span class="font-light text-white">Lab</span>
        </h1>
        <p class="text-xs text-gray-400 uppercase tracking-widest">Sala de Pruebas Virtual</p>
      </div>
      <div class="flex gap-4">
        <!-- Environments -->
        <div class="bg-white/5 rounded-full p-1 flex">
          <button
            v-for="env in ['QUIET', 'CAFE', 'KEYBOARD']"
            :key="env"
            class="px-4 py-2 rounded-full text-xs font-bold transition-all border border-transparent"
            :class="
              store.currentEnvironment === env
                ? 'bg-white/20 text-white border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                : 'text-gray-500 hover:text-white'
            "
            @click="store.currentEnvironment = env as any"
          >
            <i
              class="fas mr-2"
              :class="{
                'fa-volume-mute': env === 'QUIET',
                'fa-coffee': env === 'CAFE',
                'fa-keyboard': env === 'KEYBOARD',
              }"
            ></i>
            {{ env }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 grid grid-cols-1 lg:grid-cols-3">
      <!-- Left: Mic Selector -->
      <div class="bg-black/20 border-r border-white/5 p-6 space-y-6">
        <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          Micrófonos Disponibles
        </h2>

        <div class="space-y-3">
          <div
            v-for="sample in store.samples"
            :key="sample.id"
            class="group flex items-center gap-4 p-4 rounded-xl border border-white/5 cursor-pointer transition-all hover:bg-white/5"
            :class="
              store.currentSample?.id === sample.id ? 'bg-brand-blue/10 border-brand-blue/50' : ''
            "
            @click="store.setSample(sample.id)"
          >
            <div
              class="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform"
            >
              <i
                class="fas fa-microphone-alt text-xl"
                :class="store.currentSample?.id === sample.id ? 'text-brand-blue' : 'text-gray-500'"
              ></i>
            </div>
            <div>
              <h3 class="font-bold text-white">{{ sample.micName }}</h3>
              <p class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                {{ sample.sampleName }}
              </p>
            </div>
            <div v-if="store.currentSample?.id === sample.id && store.isPlaying" class="ml-auto">
              <div class="flex gap-1 items-end h-4">
                <div class="w-1 bg-brand-blue animate-music-bar-1"></div>
                <div class="w-1 bg-brand-blue animate-music-bar-2"></div>
                <div class="w-1 bg-brand-blue animate-music-bar-3"></div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-8 p-4 bg-gradient-to-br from-brand-purple/20 to-blue-500/10 rounded-xl border border-white/10"
        >
          <h3 class="font-bold text-white mb-2">
            <i class="fas fa-info-circle text-brand-blue mr-2"></i>¿Sabías qué?
          </h3>
          <p class="text-sm text-gray-300 leading-relaxed">
            El entorno afecta drásticamente la captación. Prueba los modos de ambiente para escuchar
            la cancelación de ruido de cada micro.
          </p>
        </div>
      </div>

      <!-- Center: Visualization & Player -->
      <div class="lg:col-span-2 relative flex flex-col bg-[#080808]">
        <!-- Canvas Visualizer -->
        <div class="flex-1 relative flex items-center justify-center overflow-hidden">
          <canvas ref="canvas" class="w-full h-full opacity-60"></canvas>

          <!-- Central Information -->
          <div class="absolute text-center z-10">
            <div
              class="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-tr from-brand-blue to-cyan-400 p-[2px] shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-pulse-slow"
            >
              <div class="w-full h-full rounded-full bg-black flex items-center justify-center">
                <i class="fas fa-microphone text-5xl text-white"></i>
              </div>
            </div>
            <h2 class="text-4xl font-bold text-white tracking-tight mb-2">
              {{ store.currentSample?.micName }}
            </h2>
            <p class="text-brand-blue font-mono">
              {{
                store.currentEnvironment === 'QUIET'
                  ? 'Studio Mode'
                  : 'Noise Test: ' + store.currentEnvironment
              }}
            </p>
          </div>
        </div>

        <!-- Player Controls Bar -->
        <div
          class="h-24 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center px-8 gap-8"
        >
          <button
            class="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            @click="store.togglePlay"
          >
            <i class="fas text-xl" :class="store.isPlaying ? 'fa-pause' : 'fa-play pl-1'"></i>
          </button>

          <div class="flex-1">
            <div class="flex justify-between text-xs text-gray-400 mb-2 font-mono">
              <span>00:12</span>
              <span>00:45</span>
            </div>
            <div class="h-1 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-brand-blue w-1/3 relative">
                <div
                  class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                ></div>
              </div>
            </div>
          </div>

          <div class="w-48 flex items-center gap-3">
            <i class="fas fa-volume-up text-gray-400"></i>
            <input
              type="range"
              class="w-full accent-brand-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAudioLabStore } from '@/stores/audioLab'

const store = useAudioLabStore()
const canvas = ref<HTMLCanvasElement | null>(null)
let animationId: number

// Mock Audio Visualizer Logic
const drawVisualizer = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const width = (canvas.value.width = canvas.value.parentElement?.clientWidth || 800)
  const height = (canvas.value.height = canvas.value.parentElement?.clientHeight || 400)

  ctx.clearRect(0, 0, width, height)

  if (!store.isPlaying) return // Stop drawing if paused

  const barCount = 100
  const barWidth = width / barCount

  // Gradient
  const gradient = ctx.createLinearGradient(0, height, 0, 0)
  gradient.addColorStop(0, '#3b82f6')
  gradient.addColorStop(1, '#22d3ee')

  ctx.fillStyle = gradient

  for (let i = 0; i < barCount; i++) {
    // Simulate frequency data
    const noise = Math.random() * 0.5 + 0.5
    const h = Math.random() * height * 0.4 * (store.volume * 2) * noise

    const x = i * barWidth
    const y = (height - h) / 2 // Center vertically

    // Mirror effect
    ctx.fillRect(x, height / 2 - h / 2, barWidth - 2, h)
  }

  animationId = requestAnimationFrame(drawVisualizer)
}

onMounted(() => {
  store.fetchSamples()
  // Start tick loop for visualizer
  // We use setInterval for less CPU intensive mock than rAF loop if just random
  // But rAF looks smoother.
  drawVisualizer()
  window.addEventListener('resize', drawVisualizer)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', drawVisualizer)
})

watch(
  () => store.isPlaying,
  (playing) => {
    if (playing) {
      drawVisualizer()
    } else {
      cancelAnimationFrame(animationId)
    }
  },
)
</script>

<style scoped>
.animate-music-bar-1 {
  animation: bounce 0.6s infinite ease-in-out;
}
.animate-music-bar-2 {
  animation: bounce 0.6s infinite ease-in-out 0.2s;
}
.animate-music-bar-3 {
  animation: bounce 0.6s infinite ease-in-out 0.4s;
}

@keyframes bounce {
  0%,
  100% {
    height: 20%;
  }
  50% {
    height: 100%;
  }
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
