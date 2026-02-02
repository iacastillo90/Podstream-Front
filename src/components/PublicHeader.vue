<template>
  <header
    class="fixed top-0 left-0 right-0 bg-brand-dark/95 backdrop-blur-md z-50 border-b border-white/10"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo & Brand -->
        <router-link to="/" class="flex items-center gap-3 group">
          <img
            src="@/assets/image/Leonardo_Phoenix_10_Disea_un_logo_moderno_y_llamativo_para_Pod_3 (1).png"
            alt="PodStream Logo"
            class="h-12 w-auto transition-transform group-hover:scale-105"
          />
          <span
            class="text-2xl font-bold font-heading bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent"
          >
            PodStream
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-300 hover:text-white transition-colors font-medium relative group"
          >
            {{ item.name }}
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-purple transition-all group-hover:w-full"
            ></span>
          </router-link>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <!-- Search -->
          <button
            class="hidden sm:flex w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <i class="fas fa-search"></i>
          </button>

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <i class="fas fa-shopping-cart"></i>
            <span
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-brand-purple text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {{ cartCount }}
            </span>
          </router-link>

          <!-- User Actions -->
          <div v-if="isAuthenticated" class="relative group">
            <button
              class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <img
                :src="user?.profileImage || 'https://ui-avatars.com/api/?name=' + user?.name"
                class="w-8 h-8 rounded-full border border-white/10"
                alt="Avatar"
              />
              <span class="hidden sm:inline text-sm font-medium">{{ user?.name }}</span>
            </button>
            <div
              class="absolute right-0 top-full mt-2 w-48 bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden hidden group-hover:block"
            >
              <router-link
                to="/dashboard"
                class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                >Dashboard</router-link
              >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                >Mi Perfil</router-link
              >
              <button
                class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                @click="logout"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <router-link
            v-else
            to="/login"
            class="hidden sm:flex px-6 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-full hover:opacity-90 transition-opacity font-medium"
          >
            Iniciar Sesión
          </router-link>

          <!-- Mobile Menu Toggle -->
          <button
            class="md:hidden w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            @click="toggleMobileMenu"
          >
            <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="mobileMenuOpen"
          class="md:hidden py-4 border-t border-white/10 bg-brand-dark/95 backdrop-blur-md"
        >
          <nav class="flex flex-col gap-2">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              @click="mobileMenuOpen = false"
            >
              {{ item.name }}
            </router-link>
            <router-link
              to="/login"
              class="mx-4 mt-2 px-4 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-lg text-center font-medium"
              @click="mobileMenuOpen = false"
            >
              Iniciar Sesión
            </router-link>
          </nav>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const mobileMenuOpen = ref(false)
const cartStore = useCartStore()
const authStore = useAuthStore()

const cartCount = computed(() => cartStore.totalItems)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const navItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Productos', path: '/products' },
  { name: 'Categorías', path: '/categories' },
  { name: 'Nosotros', path: '/about' },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const logout = () => {
  authStore.logout()
  // Redirect handled in store or here
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
