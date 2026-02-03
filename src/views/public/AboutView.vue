<template>
  <div class="space-y-12 animate-fade-in-up pb-12">
    <!-- Hero Section -->
    <div class="relative h-[400px] md:h-[500px] overflow-hidden group">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2670&auto=format&fit=crop"
          class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          alt="PodStream Studio Life"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-brand-dark/30 via-brand-dark/60 to-brand-dark"
        ></div>
      </div>

      <!-- Hero Content -->
      <div class="relative h-full flex flex-col justify-center items-center text-center px-4">
        <h1 class="text-5xl md:text-7xl font-bold font-heading mb-6 text-white drop-shadow-lg">
          Sobre <span class="text-brand-purple">Nosotros</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed drop-shadow-md">
          Potenciando creadores con las herramientas correctas, en el momento correcto.
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Mission Section (Split Layout) -->
      <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div class="space-y-6">
          <h2 class="text-3xl md:text-4xl font-bold font-heading text-white">
            Nuestra <span class="text-brand-blue">Filosofía</span>
          </h2>
          <div class="space-y-4 text-gray-300 text-lg leading-relaxed">
            <p>
              En <strong class="text-white">PodStream</strong>, entendemos que el talento no depende
              del presupuesto. No somos fabricantes; somos <strong>curadores apasionados</strong>.
            </p>
            <p>
              Nuestra misión es navegar el vasto mar de equipos de audio y video para seleccionar
              meticulosamente aquellas joyas que ofrecen un rendimiento "Nivel Dios" sin la etiqueta
              de precio astronómica.
            </p>
            <p>
              Creemos firmemente que no necesitas un estudio de Hollywood para empezar. Necesitas
              equipos inteligentes que se ajusten a tu nivel y crezcan contigo.
            </p>
          </div>
        </div>
        <div
          class="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/5"
        >
          <img
            src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=2670&auto=format&fit=crop"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            alt="Curated Gear"
          />
        </div>
      </div>

      <!-- Values Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-20">
        <GlassCard class="p-8 text-center hover:bg-white/5 transition-colors">
          <div
            class="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-blue/30"
          >
            <i class="fas fa-hand-holding-heart text-2xl text-brand-blue"></i>
          </div>
          <h3 class="text-xl font-bold mb-3 text-white">Accesibilidad Real</h3>
          <p class="text-gray-400">
            Democratizamos el audio profesional. Soluciones de alto impacto para presupuestos del
            mundo real.
          </p>
        </GlassCard>

        <GlassCard class="p-8 text-center hover:bg-white/5 transition-colors">
          <div
            class="w-16 h-16 bg-brand-purple/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-purple/30"
          >
            <i class="fas fa-star text-2xl text-brand-purple"></i>
          </div>
          <h3 class="text-xl font-bold mb-3 text-white">Solo lo Mejor</h3>
          <p class="text-gray-400">
            Si está en nuestra tienda, es porque lo usaríamos nosotros. Cada producto pasa nuestro
            filtro de calidad.
          </p>
        </GlassCard>

        <GlassCard class="p-8 text-center hover:bg-white/5 transition-colors">
          <div
            class="w-16 h-16 bg-brand-pink/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-pink/30"
          >
            <i class="fas fa-rocket text-2xl text-brand-pink"></i>
          </div>
          <h3 class="text-xl font-bold mb-3 text-white">Escalabilidad</h3>
          <p class="text-gray-400">
            Desde tu primer micrófono USB hasta tu consola de mezcla completa. Te acompañamos en
            cada etapa.
          </p>
        </GlassCard>
      </div>

      <!-- CTA Section -->
      <div
        class="text-center bg-gradient-to-r from-brand-sidebar via-brand-dark to-brand-sidebar p-12 rounded-3xl border border-white/5 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-[url('/img/pattern.png')] opacity-5"></div>
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold mb-6 font-heading">
            ¿Listo para mejorar tu setup?
          </h2>
          <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explora las categorías que hemos preparado para ti y encuentra tu sonido ideal.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <AnimatedButton variant="primary" @click="$router.push('/products')">
              Ver Catálogo
            </AnimatedButton>
            <button
              class="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-bold"
              @click="$router.push('/contact')"
            >
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
