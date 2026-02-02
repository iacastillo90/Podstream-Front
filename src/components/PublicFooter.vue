<template>
  <footer
    class="relative bg-[#030014] text-gray-300 font-sans border-t border-white/5 overflow-hidden"
  >
    <!-- Vector Background (Matches HomeView) -->
    <div class="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay rotate-180"
        :style="{ backgroundImage: `url(${vectorBg})` }"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/90 to-transparent"
      ></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12">
      <!-- Top Grid: Brand, Links, Newsletter -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
        <!-- Brand Section (Col 1-4) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="flex items-center gap-3">
            <img
              src="@/assets/image/Leonardo_Phoenix_10_Disea_un_logo_moderno_y_llamativo_para_Pod_3 (1).png"
              alt="PodStream"
              class="h-12 w-auto animate-float"
            />
            <span
              class="text-3xl font-bold font-heading bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent tracking-tight"
            >
              PodStream
            </span>
          </div>
          <p class="text-gray-400 leading-relaxed text-sm max-w-sm">
            Elevando el estándar del audio profesional. Tu socio estratégico en la creación de
            contenido de alto impacto.
          </p>

          <!-- Socials -->
          <div class="flex gap-4 pt-2">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              class="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-brand-purple/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <div
                class="absolute inset-0 bg-brand-purple/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 blur-sm"
              ></div>
              <i
                :class="[
                  social.icon,
                  'relative z-10 text-gray-400 group-hover:text-white transition-colors',
                ]"
              ></i>
            </a>
          </div>
        </div>

        <!-- Links Sections (Col 5-8) -->
        <div class="lg:col-span-2 space-y-6">
          <h4
            class="text-white font-bold font-heading tracking-wide uppercase text-sm border-l-2 border-brand-purple pl-3"
          >
            Explora
          </h4>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.path">
              <router-link
                :to="link.path"
                class="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
              >
                <span
                  class="w-1 h-1 rounded-full bg-brand-blue opacity-0 group-hover:opacity-100 transition-opacity"
                ></span>
                <span class="group-hover:translate-x-1 transition-transform">{{ link.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <h4
            class="text-white font-bold font-heading tracking-wide uppercase text-sm border-l-2 border-brand-pink pl-3"
          >
            Soporte
          </h4>
          <ul class="space-y-3">
            <li v-for="link in supportLinks" :key="link.path">
              <router-link
                :to="link.path"
                class="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
              >
                <span
                  class="w-1 h-1 rounded-full bg-brand-pink opacity-0 group-hover:opacity-100 transition-opacity"
                ></span>
                <span class="group-hover:translate-x-1 transition-transform">{{ link.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Newsletter (Col 9-12) -->
        <div class="lg:col-span-4 space-y-6">
          <h4
            class="text-white font-bold font-heading tracking-wide uppercase text-sm border-l-2 border-brand-blue pl-3"
          >
            Mantente al día
          </h4>
          <p class="text-gray-400 text-sm">
            Únete a nuestra comunidad VIP y recibe ofertas exclusivas antes que nadie.
          </p>

          <form @submit.prevent="handleNewsletterSubmit" class="relative group">
            <div
              class="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-blue rounded-xl opacity-20 group-hover:opacity-30 blur transition-opacity"
            ></div>
            <div
              class="relative flex bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden p-1 focus-within:border-white/20 transition-colors"
            >
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="Tu correo electrónico"
                class="flex-1 bg-transparent border-none text-white text-sm px-4 focus:outline-none placeholder-gray-500"
                required
              />
              <button
                type="submit"
                class="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
              >
                <span>Unirme</span>
                <i class="fas fa-arrow-right text-xs"></i>
              </button>
            </div>
          </form>

          <!-- Contact Info Mini -->
          <div class="pt-4 flex flex-col gap-2 text-sm text-gray-400">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-purple"
              >
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <span>Calle Principal 123, Madrid</span>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-blue"
              >
                <i class="fas fa-phone"></i>
              </div>
              <span>+34 900 123 456</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div
        class="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"
      ></div>

      <!-- Bottom Bar -->
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500"
      >
        <p>&copy; {{ currentYear }} PodStream S.A. Todos los derechos reservados.</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-white transition-colors">Privacidad</a>
          <a href="#" class="hover:text-white transition-colors">Términos</a>
          <a href="#" class="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const newsletterEmail = ref('')
const currentYear = computed(() => new Date().getFullYear())
const vectorBg = new URL('@/assets/image/vector-bg.jpg', import.meta.url).href

const socialLinks = [
  { name: 'Instagram', icon: 'fab fa-instagram', url: '#' },
  { name: 'Facebook', icon: 'fab fa-facebook-f', url: '#' },
  { name: 'Twitter', icon: 'fab fa-twitter', url: '#' },
  { name: 'YouTube', icon: 'fab fa-youtube', url: '#' },
]

const quickLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Tienda', path: '/products' },
  { name: 'Nuevos Ingresos', path: '/products?sort=newest' },
  { name: 'Categorías', path: '/categories' },
]

const supportLinks = [
  { name: 'Centro de Ayuda', path: '/support' },
  { name: 'Contacto', path: '/contact' },
  { name: 'Seguimiento', path: '#' },
  { name: 'Garantías', path: '#' },
]

const handleNewsletterSubmit = () => {
  // TODO: Implement actual logic
  console.log('Newsletter:', newsletterEmail.value)
  newsletterEmail.value = ''
}
</script>

<style scoped>
/* Optional: specific scoped styles if Tailwind isn't enough */
</style>
