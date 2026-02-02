<template>
  <div class="min-h-screen bg-brand-dark text-white flex flex-col">
    <!-- Dynamic Background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-purple/10 rounded-full blur-[120px] animate-pulse-slow"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"
      ></div>
    </div>

    <!-- Header -->
    <PublicHeader />

    <!-- Main Content -->
    <main class="relative z-10 flex-1 pt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </main>

    <!-- Footer -->
    <PublicFooter />
  </div>
</template>

<script setup lang="ts">
import PublicHeader from '@/components/PublicHeader.vue'
import PublicFooter from '@/components/PublicFooter.vue'
</script>

<style scoped>
/* Additional styles if needed */
</style>
