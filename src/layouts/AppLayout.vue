<template>
  <div class="h-screen bg-brand-dark text-white flex overflow-hidden relative">
    <!-- Dynamic Background Global -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-purple/10 rounded-full blur-[120px] animate-pulse-slow"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"
      ></div>
    </div>

    <!-- Sidebar -->
    <SidebarComponent class="z-50 shadow-2xl" />

    <!-- Main Content -->
    <main
      class="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-out relative z-10"
      :class="{
        'lg:ml-[280px]': isExpanded || isHovered,
        'lg:ml-[80px]': !isExpanded && !isHovered,
      }"
    >
      <!-- Top Bar -->
      <HeaderComponent />

      <div class="flex-1 p-6 md:p-8 w-full max-w-[1920px] mx-auto overflow-y-auto custom-scrollbar">
        <slot>
          <router-view v-slot="{ Component }">
            <transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-4"
              mode="out-in"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'

import HeaderComponent from '@/components/HeaderComponent.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isExpanded, isHovered } = useSidebar()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
