<template>
  <div
    class="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Animated Background -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-[120px] animate-pulse-slow"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"
      ></div>

      <!-- Grid Pattern -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8 animate-fade-in-up">
        <router-link to="/">
          <img
            src="@/assets/image/Leonardo_Phoenix_10_Disea_un_logo_moderno_y_llamativo_para_Pod_3 (1).png"
            alt="PodStream"
            class="h-16 mx-auto mb-4"
          />
          <h1
            class="text-3xl font-bold font-heading bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
          >
            PodStream
          </h1>
        </router-link>
      </div>

      <!-- Content -->
      <div class="animate-fade-in-up delay-200">
        <router-view />
      </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-6 text-center text-gray-500 text-sm z-10">
      &copy; {{ new Date().getFullYear() }} PodStream. Todos los derechos reservados.
    </div>
  </div>
</template>

<script setup lang="ts">
// Guest Layout with Premium Aesthetics
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
