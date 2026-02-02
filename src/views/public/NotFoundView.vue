<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-dark px-4">
    <div class="text-center max-w-lg">
      <div class="relative mb-8">
        <h1 class="text-[150px] font-bold font-heading text-brand-purple/20 leading-none">404</h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon icon="mdi:robot-confused" class="text-6xl text-brand-blue animate-bounce" />
        </div>
      </div>
      <h2 class="text-3xl font-bold text-white mb-4">Página no encontrada</h2>
      <p class="text-gray-400 mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida a otra dimensión.
      </p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
      >
        <Icon icon="mdi:home" class="text-xl" />
        Volver al Inicio
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
