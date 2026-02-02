<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 p-8 border border-white/10"
    >
      <div class="relative z-10">
        <h1 class="text-3xl font-bold font-heading mb-2">Hola, {{ user?.name || 'Creador' }} 👋</h1>
        <p class="text-gray-400 max-w-xl">
          Bienvenido a tu panel de control. Aquí puedes gestionar tus pedidos, ver tus cursos y
          conectar con la comunidad.
        </p>

        <div class="mt-6 flex flex-wrap gap-4">
          <AnimatedButton @click="$router.push('/dashboard/products')">
            Explorar Tienda
          </AnimatedButton>
          <AnimatedButton variant="secondary" @click="$router.push('/academy')">
            Ir a la Academia
          </AnimatedButton>
        </div>
      </div>

      <!-- Background Decor -->
      <div
        class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-brand-purple/10 to-transparent"
      ></div>
    </div>

    <!-- Quick Stats / Shortcuts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlassCard
        class="p-6 hover:bg-white/5 transition-colors cursor-pointer group"
        @click="$router.push('/orders')"
      >
        <div
          class="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        >
          <i class="fas fa-box text-brand-blue text-xl"></i>
        </div>
        <h3 class="text-xl font-bold mb-1">Mis Pedidos</h3>
        <p class="text-sm text-gray-400">Rastrea tus últimas compras</p>
      </GlassCard>

      <GlassCard
        class="p-6 hover:bg-white/5 transition-colors cursor-pointer group"
        @click="$router.push('/academy')"
      >
        <div
          class="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        >
          <i class="fas fa-graduation-cap text-brand-purple text-xl"></i>
        </div>
        <h3 class="text-xl font-bold mb-1">Mis Cursos</h3>
        <p class="text-sm text-gray-400">Continúa aprendiendo</p>
      </GlassCard>

      <GlassCard
        class="p-6 hover:bg-white/5 transition-colors cursor-pointer group"
        @click="$router.push('/community')"
      >
        <div
          class="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        >
          <i class="fas fa-users text-brand-pink text-xl"></i>
        </div>
        <h3 class="text-xl font-bold mb-1">Comunidad</h3>
        <p class="text-sm text-gray-400">Conecta con otros creadores</p>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>
