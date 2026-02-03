<template>
  <footer class="bg-black/80 text-gray-300 py-10 border-t border-purple-600/20">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <h4 class="text-white text-lg font-semibold mb-2">Sobre PodStream</h4>
        <p class="text-gray-400 text-sm">
          Tu destino para equipos de podcast profesional. Calidad y servicio garantizado.
        </p>
      </div>
      <div>
        <h4 class="text-white text-lg font-semibold mb-2">Enlaces Rápidos</h4>
        <ul class="space-y-1">
          <li v-for="link in footerLinks" :key="link.id">
            <router-link :to="link.route" class="hover:text-purple-400 transition-colors text-sm">
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="text-white text-lg font-semibold mb-2">Contacto</h4>
        <ul class="space-y-1 text-sm">
          <li>Calle Principal 123, Madrid</li>
          <li>+34 900 123 456</li>
          <li>info@podstream.es</li>
        </ul>
      </div>
      <div>
        <h4 class="text-white text-lg font-semibold mb-2">Newsletter</h4>
        <div class="flex">
          <input
            type="email"
            placeholder="Tu email"
            class="bg-gray-900 border-none px-3 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
          />
          <button
            class="bg-gradient-to-r from-purple-600 to-blue-500 px-4 rounded-r-full text-white hover:opacity-90 transition text-sm"
          >
            Suscribir
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface FooterLink {
  id: number | string
  route: string
  name: string
}

export default defineComponent({
  props: {
    footerLinks: {
      type: Array as PropType<FooterLink[]>,
      default: () => [],
    },
  },
})
</script>
