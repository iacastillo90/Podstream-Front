<template>
  <div
    class="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in-up"
  >
    <div class="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
      <i class="fas fa-check text-4xl text-green-400"></i>
    </div>
    <h1 class="text-4xl font-bold font-heading mb-4 text-white">¡Pago Exitoso!</h1>
    <p class="text-gray-400 max-w-md mb-8">
      Gracias por tu compra. Tu pedido ha sido confirmado y pronto comenzaremos a prepararlo.
    </p>
    <router-link to="/dashboard/orders-pending">
      <AnimatedButton class="px-8"> Ver mis Pedidos </AnimatedButton>
    </router-link>
  </div>
</template>

<script setup lang="ts">
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
