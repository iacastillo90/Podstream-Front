<template>
  <div class="h-screen overflow-hidden bg-brand-dark text-white flex font-sans">
    <!-- Sidebar (Fixed) -->
    <SidebarComponent />

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out h-full"
      :class="[
        isMobileOpen ? 'ml-0' : '',
        !isMobileOpen && (isExpanded || isHovered) ? 'lg:ml-[280px]' : 'lg:ml-[80px]',
      ]"
    >
      <!-- Header (Sticky) -->
      <HeaderComponent />

      <!-- Page Content -->
      <main
        class="flex-1 p-4 md:p-6 lg:p-8 relative overflow-x-hidden overflow-y-auto custom-scrollbar"
      >
        <!-- Background Decor (Optional) -->
        <div
          class="absolute top-0 left-0 w-full h-[500px] bg-brand-purple/5 blur-[100px] pointer-events-none"
        ></div>

        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isExpanded, isHovered, isMobileOpen } = useSidebar()
</script>

<style scoped>
/* Scoped styles if needed */
</style>
