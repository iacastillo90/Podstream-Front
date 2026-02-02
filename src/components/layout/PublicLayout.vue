<template>
  <div
    class="h-screen bg-brand-dark text-white font-sans overflow-hidden flex flex-col selection:bg-brand-purple selection:text-white relative"
  >
    <!-- Global Vector Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 mix-blend-normal transform scale-105"
        :style="{ backgroundImage: `url(${vectorBg})` }"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-b from-[#030014]/90 via-[#030014]/60 to-[#030014]/90"
      ></div>
      <div class="absolute inset-0 bg-black/10 backdrop-blur-[0px]"></div>
    </div>
    <!-- Header 3D Floating Island -->
    <header
      class="fixed z-[1000] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
      :class="[
        isScrolled
          ? 'top-4 w-[90%] md:w-[85%] max-w-6xl left-1/2 -translate-x-1/2 rounded-full bg-[#121212]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'top-0 w-full bg-transparent border-b border-transparent',
      ]"
    >
      <div
        class="mx-auto px-6 lg:px-8 flex items-center justify-between transition-all duration-500"
        :class="isScrolled ? 'h-16' : 'h-24'"
      >
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 group relative perspective-[1000px]">
          <div
            class="relative transition-transform duration-500 group-hover:rotate-y-[180deg] transform-style-3d"
          >
            <div
              class="absolute inset-0 bg-brand-purple blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
            ></div>
            <img
              :src="logoImage"
              alt="PodStream"
              class="h-10 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            />
          </div>
          <span
            class="text-2xl font-black font-heading tracking-wider bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:to-white transition-all"
          >
            PodStream
          </span>
        </router-link>

        <!-- Desktop Navigation (Pill Style) -->
        <nav
          class="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-sm"
          :class="{ 'opacity-0 scale-90 pointer-events-none': !isScrolled && false }"
        >
          <!-- Note: Always visible for now, can be conditional if desired -->
          <router-link
            v-for="item in menuItems"
            :key="item.id"
            :to="item.route"
            class="px-5 py-2 text-sm font-bold text-gray-400 rounded-full transition-all duration-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] relative overflow-hidden group"
            active-class="!text-black !bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            <span class="relative z-10">{{ item.name }}</span>
          </router-link>
        </nav>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center gap-4">
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
          >
            <i class="fas fa-search"></i>
          </button>

          <button
            class="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95 group"
            @click="toggleCart"
          >
            <i class="fas fa-shopping-cart group-hover:animate-wiggle"></i>
            <span
              v-if="cartCount"
              class="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121212] shadow-lg animate-pulse"
            >
              {{ cartCount }}
            </span>
          </button>

          <AnimatedButton
            variant="primary"
            class="!px-6 !py-2.5 text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
            @click="handleAuthAction"
          >
            {{ authStore.isAuthenticated ? 'Dashboard' : 'Login' }}
          </AnimatedButton>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-purple transition-colors"
          @click="toggleMobileMenu"
        >
          <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>
      </div>

      <!-- Mobile Menu (Dropdown) -->
      <transition
        enter-active-class="transition duration-300 cubic-bezier(0.25, 1, 0.5, 1)"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div v-if="isMobileMenuOpen" class="absolute top-full lg:hidden left-0 w-full mt-4 p-4">
          <div
            class="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 shadow-2xl space-y-4"
          >
            <nav class="flex flex-col gap-2">
              <router-link
                v-for="item in menuItems"
                :key="item.id"
                :to="item.route"
                class="px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                @click="closeMobileMenu"
              >
                {{ item.name }}
              </router-link>
            </nav>
            <div class="h-px bg-white/10 my-4"></div>
            <div class="flex flex-col gap-3">
              <button
                class="flex items-center gap-3 text-gray-400 hover:text-white p-2"
                @click="toggleCart"
              >
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <span>Carrito ({{ cartCount }})</span>
              </button>
              <AnimatedButton class="w-full justify-center" @click="handleAuthAction">
                {{ authStore.isAuthenticated ? 'Ir al Dashboard' : 'Iniciar Sesión' }}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </transition>
    </header>

    <!-- Main Content (Scrollable) -->
    <main
      ref="mainContent"
      class="flex-1 overflow-y-auto custom-scrollbar relative scroll-smooth pt-24"
      @scroll="handleScroll"
    >
      <slot>
        <router-view />
      </slot>

      <!-- Footer -->
      <PublicFooter />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoImage from '@/assets/image/Leonardo_Phoenix_10_Disea_un_logo_moderno_y_llamativo_para_Pod_3 (1).png'
const vectorBg = new URL('@/assets/image/vector-bg.jpg', import.meta.url).href
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)
const cartCount = ref(3)
const isScrolled = ref(false)
const mainContent = ref<HTMLElement | null>(null)

const menuItems = [
  { id: 1, name: 'Inicio', route: '/' },
  { id: 2, name: 'Productos', route: '/products' },
  { id: 3, name: 'Categorías', route: '/categories' },
  { id: 4, name: 'Nosotros', route: '/about' },
  { id: 5, name: 'Contacto', route: '/contact' },
]

const toggleMobileMenu = () => (isMobileMenuOpen.value = !isMobileMenuOpen.value)
const closeMobileMenu = () => (isMobileMenuOpen.value = false)
const toggleCart = () => router.push('/cart')

const handleAuthAction = () => {
  // If logged in (authenticated), button says "Dashboard". Redirect to dashboard.
  // If NOT logged in, button says "Iniciar Sesión". Redirect to login.
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}

// Scroll Handler
const handleScroll = () => {
  if (mainContent.value) {
    isScrolled.value = mainContent.value.scrollTop > 20
  }
}

// Resize Handler
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  // Window scroll listener removed, using @scroll on main
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.sticky-footer-glow {
  animation: pulse-glow 4s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  from {
    opacity: 0.5;
    transform: translateX(-50%) scale(1);
  }
  to {
    opacity: 0.8;
    transform: translateX(-50%) scale(1.1);
  }
}
</style>
