<template>
  <header
    class="h-16 border-b border-white/5 bg-brand-dark/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between transition-all duration-300"
  >
    <!-- Left: Breadcrumbs / Page Title -->
    <div class="flex items-center gap-4">
      <h2 class="text-xl font-bold font-heading text-white tracking-wide">
        {{ currentRouteName }}
      </h2>
      <!-- Breadcrumbs placeholder if needed -->
    </div>

    <!-- Center: Global Search (Hidden on small screens) -->
    <div class="hidden md:flex flex-1 max-w-xl mx-8 relative group/search">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i
          class="fas fa-search text-gray-500 group-focus-within/search:text-brand-purple transition-colors"
        ></i>
      </div>
      <input
        type="text"
        placeholder="Buscar productos, órdenes o clientes..."
        class="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all placeholder-gray-500"
      />
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-4">
      <!-- Notifications -->
      <button
        class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative"
      >
        <i class="fas fa-bell"></i>
        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- Cart -->
      <button
        class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative"
        @click="$router.push('/dashboard/cart')"
      >
        <i class="fas fa-shopping-cart"></i>
        <!-- You might want to bind a store value here eventually -->
        <!-- <span class="absolute -top-1 -right-1 bg-brand-purple text-[10px] w-5 h-5 flex items-center justify-center rounded-full">3</span> -->
      </button>

      <!-- User Profile Dropdown (Simplified) -->
      <div class="flex items-center gap-3 pl-4 border-l border-white/10">
        <div class="text-right hidden sm:block">
          <div class="text-sm font-bold text-white leading-none">
            {{ userName }}
          </div>
          <div class="text-xs text-brand-purple">
            {{ userRoleLabel }}
          </div>
        </div>
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue p-[2px] cursor-pointer"
          @click="$router.push('/dashboard/personal-info')"
        >
          <img
            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`"
            :alt="`Avatar de ${userName}`"
            class="w-full h-full rounded-full bg-brand-dark"
          />
        </div>

        <!-- Logout Button -->
        <button
          class="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors ml-2 flex items-center justify-center"
          title="Cerrar Sesión"
          @click="handleLogout"
        >
          <i class="fas fa-sign-out-alt text-sm"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { currentUser, userRole } = useAuth()

// Map route names to display titles
const routeTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Catálogo de Productos',
  'product-detail': 'Detalle de Producto',
  categories: 'Categorías',
  cart: 'Tu Carrito',
  checkout: 'Finalizar Compra',
  'orders-completed': 'Órdenes Completadas',
  'orders-pending': 'Órdenes Pendientes',
  'client-orders-completed': 'Órdenes Completadas', // Added client variant
  'client-orders-pending': 'Órdenes Pendientes', // Added client variant
  'orders-detail': 'Detalle de Orden',
  'admin-dashboard': 'Panel de Administración',
  'admin-stock': 'Gestión de Stock',
  'admin-products': 'Gestión de Productos',
  'admin-categories': 'Gestión de Categorías',
  'admin-tickets': 'Soporte y Tickets',
  'admin-addresses': 'Auditoría de Direcciones',
  'admin-clients': 'Gestión de Clientes',
  'admin-invoices': 'Facturación',
  'admin-promotions': 'Promociones',
  'client-personal-info': 'Mi Perfil',
  'client-support': 'Centro de Ayuda',
  'client-forum': 'Foro Comunidad',
  'client-contact': 'Contacto',
  'client-studio-builder': 'Studio Builder',
  'client-audio-lab': 'Audio Lab',
  'client-academy': 'PodStream Academy',
  'client-community': 'Comunidad Global',
  'client-versus-mode': 'Versus Mode',
  'client-categories': 'Categorías',
  'client-products': 'Catálogo de Productos',
  'client-cart': 'Tu Carrito',
  offers: 'Ofertas Especiales',
  support: 'Soporte',
}

const currentRouteName = computed(() => {
  const name = route.name as string
  return routeTitles[name] || 'PodStream'
})

// User information computed properties
const userName = computed(() => {
  return currentUser.value?.name || 'Invitado'
})

const userRoleLabel = computed(() => {
  const role = userRole.value
  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    CLIENT: 'Cliente',
    GUEST: 'Invitado',
  }
  return roleLabels[role] || 'Invitado'
})
const handleLogout = () => {
  useAuth().logout()
  // Force reload to clean state properly or just redirect
  window.location.href = '/login'
}
</script>

<style scoped>
/* No extra styles needed with Tailwind */
</style>
