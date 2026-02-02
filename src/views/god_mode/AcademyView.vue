<template>
  <div class="min-h-screen bg-[#050505] text-white flex flex-col pt-16 font-sans">
    <!-- Hero Section -->
    <div
      class="relative h-80 bg-gradient-to-r from-brand-purple/20 to-blue-900/20 border-b border-white/10 flex items-center justify-center overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
      ></div>
      <div class="z-10 text-center px-4">
        <h1 class="text-5xl md:text-6xl font-black font-heading tracking-tight mb-4">
          PODSTREAM
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-pink-500"
            >ACADEMY</span
          >
        </h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Domina tu audio. Aprende de expertos. Crea contenido legendario.
        </p>

        <div class="mt-8 relative max-w-lg mx-auto">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="Busca lecciones, equipos o técnicas..."
            class="w-full bg-black/50 border border-white/20 rounded-full py-4 pl-12 pr-6 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none backdrop-blur-md transition-all"
          />
        </div>
      </div>
    </div>

    <!-- Filters & Stats -->
    <div class="px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
        <button
          v-for="level in ['ALL', 'Beginner', 'Intermediate', 'Pro']"
          :key="level"
          class="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border"
          :class="
            store.selectedLevel === level
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
          "
          @click="store.selectedLevel = level"
        >
          {{ level === 'ALL' ? 'Todos' : level }}
        </button>
      </div>

      <div class="flex gap-8 text-center text-sm">
        <div>
          <p class="text-2xl font-bold text-white">124</p>
          <p class="text-gray-500 uppercase text-[10px] font-bold">Lecciones</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-white">15k</p>
          <p class="text-gray-500 uppercase text-[10px] font-bold">Estudiantes</p>
        </div>
      </div>
    </div>

    <!-- Course Grid -->
    <div
      class="px-6 md:px-12 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="course in store.filteredCourses"
        :key="course.id"
        class="group bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-brand-purple/50 transition-all hover:-translate-y-1 cursor-pointer"
      >
        <!-- Thumbnail -->
        <div class="relative aspect-video bg-black">
          <img
            :src="course.thumbnail"
            class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          <div class="absolute bottom-3 left-3 flex gap-2">
            <span class="bg-brand-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">{{
              course.level
            }}</span>
            <span
              class="bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center"
            >
              <i class="fas fa-play mr-1 text-[8px]"></i> {{ course.duration }}
            </span>
          </div>

          <!-- Play Overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
          >
            <div
              class="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-play ml-1"></i>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <div class="flex justify-between items-start mb-2">
            <h3
              class="font-bold text-lg leading-tight group-hover:text-brand-purple transition-colors"
            >
              {{ course.title }}
            </h3>
          </div>
          <p class="text-sm text-gray-400 mb-4">
            by <span class="text-white font-medium">{{ course.instructor }}</span>
          </p>

          <!-- Progress Bar -->
          <div v-if="(course.progress || 0) > 0" class="mb-4">
            <div class="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Progreso</span>
              <span>{{ course.progress }}%</span>
            </div>
            <div class="h-1 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-brand-green" :style="{ width: course.progress + '%' }"></div>
            </div>
          </div>

          <!-- Tags / Gear -->
          <div class="flex flex-wrap gap-2 mt-auto">
            <span
              v-for="tag in course.tags.slice(0, 3)"
              :key="tag"
              class="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAcademyStore } from '@/stores/academy'

const store = useAcademyStore()

onMounted(() => {
  store.fetchCourses()
})
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
