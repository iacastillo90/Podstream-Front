<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Hero / Header -->
    <div class="relative rounded-2xl overflow-hidden h-64 border border-white/10 group">
      <div class="absolute inset-0">
        <img
          src="https://public.readdy.ai/ai/img_res/6f2868853b98471b0b543788730ad337.jpg"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60"
          alt="Offers Hero"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"
        ></div>
      </div>
      <div class="relative z-10 p-8 h-full flex flex-col justify-center">
        <h1 class="text-4xl font-bold font-heading mb-2">Ofertas Especiales</h1>
        <p class="text-gray-300 max-w-xl">
          Descubre los mejores precios en equipamiento de audio profesional.
        </p>
      </div>
    </div>

    <!-- Offers List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Placeholder for actual logic, reusing ProductCard would be ideal but for now static or empty state if no API for offers specifically -->
      <GlassCard class="p-8 col-span-full text-center py-20">
        <i class="fas fa-tag text-6xl text-brand-purple mb-4 opacity-50"></i>
        <h2 class="text-2xl font-bold font-heading mb-2">Próximamente</h2>
        <p class="text-gray-400">Estamos preparando las mejores ofertas para ti.</p>
        <router-link to="/products">
          <AnimatedButton class="mt-6">Ver todos los productos</AnimatedButton>
        </router-link>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
