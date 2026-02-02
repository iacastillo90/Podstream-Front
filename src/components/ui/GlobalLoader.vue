<template>
  <transition name="fade">
    <div
      v-if="uiStore.globalLoading"
      class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="relative">
        <div
          class="w-16 h-16 border-4 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin"
        ></div>
        <div class="mt-4 text-white font-medium text-center tracking-wider animate-pulse">
          CARGANDO
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
