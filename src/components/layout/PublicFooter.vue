<template>
  <footer
    class="relative bg-[#050505] text-gray-400 py-20 border-t border-white/5 overflow-hidden perspective-[1000px]"
  >
    <!-- 3D Animated Background Sphere -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-brand-purple/20 via-brand-pink/5 to-transparent blur-[100px] rounded-full animate-float-slow pointer-events-none"
    ></div>

    <div class="container mx-auto px-6 relative z-10 transform-style-3d">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">
        <!-- Brand Column -->
        <div class="space-y-8 group">
          <div
            class="relative inline-block transform transition-transform duration-500 hover:scale-105 hover:rotate-y-[10deg]"
          >
            <h4
              class="text-3xl font-bold font-heading tracking-wider bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
            >
              PodStream
            </h4>
            <div
              class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
            ></div>
          </div>

          <p
            class="text-sm leading-relaxed text-gray-400 max-w-xs transition-colors hover:text-white"
          >
            Elevando el estándar de la producción. Audio, video y streaming de nivel profesional
            para creadores que no aceptan límites.
          </p>

          <!-- Social Icons (3D Tilt) -->
          <div class="flex space-x-4">
            <a
              v-for="icon in socials"
              :key="icon.icon"
              href="#"
              class="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-brand-purple hover:text-white hover:border-brand-purple/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:-translate-y-2 transform perspective-[500px] hover:rotate-x-[15deg]"
            >
              <i :class="icon.icon" class="text-lg"></i>
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div v-for="section in linkSections" :key="section.title" class="space-y-6">
          <h4
            class="text-white font-bold text-lg tracking-wide uppercase border-l-2 border-brand-purple pl-4"
          >
            {{ section.title }}
          </h4>
          <ul class="space-y-4">
            <li v-for="link in section.links" :key="link.name">
              <router-link
                :to="link.route"
                class="block text-sm transition-all duration-300 hover:text-white hover:translate-x-2 relative group w-fit"
              >
                <span class="relative z-10">{{ link.name }}</span>
                <span
                  class="absolute left-0 bottom-0 w-0 h-[1px] bg-brand-pink transition-all duration-300 group-hover:w-full"
                ></span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Newsletter (Glassmorphism Card) -->
        <div class="lg:col-span-1">
          <div
            class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-brand-purple/30 transition-colors duration-500 shadow-xl relative overflow-hidden group"
          >
            <!-- Shine Effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none"
            ></div>

            <h4 class="text-white font-bold mb-2">Únete a la Revolución</h4>
            <p class="text-xs text-gray-400 mb-6">
              Recibe ofertas VIP y novedades antes que nadie.
            </p>

            <form class="space-y-4 relative z-10" @submit.prevent>
              <div class="relative">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm text-white placeholder-gray-600 peer"
                />
                <i
                  class="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 peer-focus:text-brand-purple transition-colors"
                ></i>
              </div>
              <AnimatedButton class="w-full justify-center !py-3 shadow-lg shadow-brand-purple/20">
                Suscribirse
              </AnimatedButton>
            </form>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div
        class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4"
      >
        <p>© 2025 PodStream. Todos los derechos reservados.</p>
        <div class="flex space-x-8">
          <a href="#" class="hover:text-white transition-colors">Privacidad</a>
          <a href="#" class="hover:text-white transition-colors">Términos</a>
          <a href="#" class="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

const socials = [
  { icon: 'fab fa-twitter' },
  { icon: 'fab fa-instagram' },
  { icon: 'fab fa-youtube' },
  { icon: 'fab fa-tiktok' },
]

const linkSections = [
  {
    title: 'Explorar',
    links: [
      { name: 'Micrófonos', route: '/products?category=Microfonos' },
      { name: 'Interfaces', route: '/products?category=Interfaces' },
      { name: 'Audífonos', route: '/products?category=Audifonos' },
      { name: 'Accesorios', route: '/products?category=Accesorios' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { name: 'Centro de Ayuda', route: '/support' },
      { name: 'Envíos', route: '/support#shipping' },
      { name: 'Garantía', route: '/support#warranty' },
      { name: 'Contacto', route: '/contact' },
    ],
  },
]
</script>

<style scoped>
@keyframes float-slow {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.5;
  }
}

.animate-float-slow {
  animation: float-slow 8s infinite ease-in-out;
}

@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}

.animate-shine {
  animation: shine 1.5s;
}

.perspective-\[1000px\] {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.rotate-y-\[10deg\] {
  transform: rotateY(10deg);
}

.rotate-x-\[15deg\] {
  transform: rotateX(15deg);
}
</style>
