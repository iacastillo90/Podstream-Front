<template>
  <aside
    v-bind="$attrs"
    :class="[
      'fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-out border-r border-white/5 backdrop-blur-xl bg-brand-dark/80',
      {
        'w-[280px]': isExpanded || isMobileOpen || isHovered,
        'w-[80px]': !isExpanded && !isHovered && !isMobileOpen,
        '-translate-x-full lg:translate-x-0': !isMobileOpen,
        'translate-x-0': isMobileOpen,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <!-- Logo Section -->
    <div class="h-20 flex items-center px-6 border-b border-white/5 relative overflow-hidden">
      <!-- Glow effect behind logo -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-brand-purple/20 blur-[40px] rounded-full pointer-events-none"
      ></div>

      <div
        class="flex items-center gap-3 transition-opacity duration-300 w-full"
        :class="!isExpanded && !isHovered ? 'justify-center' : ''"
      >
        <img
          src="@/assets/image/Leonardo_Phoenix_10_Disea_un_logo_moderno_y_llamativo_para_Pod_3 (1).png"
          alt="Logo"
          class="h-10 w-auto object-contain"
        />
        <span
          v-if="isExpanded || isHovered || isMobileOpen"
          class="text-xl font-bold font-heading bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent whitespace-nowrap"
        >
          PodStream
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto no-scrollbar py-6 h-[calc(100vh-80px)]">
      <nav class="space-y-8 px-4">
        <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
          <!-- Group Title -->
          <h3
            v-if="isExpanded || isHovered || isMobileOpen"
            class="text-xs font-bold text-brand-purple uppercase tracking-wider mb-4 px-3"
          >
            {{ menuGroup.title }}
          </h3>
          <div v-else class="h-px w-8 mx-auto bg-white/10 mb-4"></div>

          <ul class="space-y-1">
            <li v-for="(item, index) in menuGroup.items" :key="item.name">
              <!-- Submenu Toggle -->
              <button
                v-if="item.subItems"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden"
                :class="
                  isSubmenuOpen(groupIndex, index)
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                "
                @click="toggleSubmenu(groupIndex, index)"
              >
                <!-- Active Indicator -->
                <div
                  v-if="isSubmenuOpen(groupIndex, index)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-purple rounded-r-full"
                ></div>

                <Icon :icon="item.icon" class="text-xl min-w-[20px]" />

                <template v-if="isExpanded || isHovered || isMobileOpen">
                  <span class="flex-1 text-left text-sm font-medium whitespace-nowrap">{{
                    item.name
                  }}</span>
                  <Icon
                    icon="mdi:chevron-down"
                    class="transition-transform duration-200 text-gray-500"
                    :class="{ 'rotate-180': isSubmenuOpen(groupIndex, index) }"
                  />
                </template>
              </button>

              <!-- Direct Link -->
              <router-link
                v-if="!item.subItems"
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden"
                :class="
                  isActive(item.path)
                    ? 'bg-brand-purple/10 text-brand-blue'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                "
              >
                <!-- Active Glow -->
                <div
                  v-if="isActive(item.path)"
                  class="absolute inset-0 bg-brand-blue/5 blur-sm"
                ></div>

                <!-- Active Indicator -->
                <div
                  v-if="isActive(item.path)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-blue rounded-r-full shadow-[0_0_10px_#00C2FF]"
                ></div>

                <Icon :icon="item.icon" class="text-xl min-w-[20px] relative z-10" />

                <span
                  v-if="isExpanded || isHovered || isMobileOpen"
                  class="text-sm font-medium whitespace-nowrap relative z-10"
                >
                  {{ item.name }}
                </span>
              </router-link>

              <!-- Submenu Items -->
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[500px]"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[500px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <ul
                  v-show="
                    isSubmenuOpen(groupIndex, index) && (isExpanded || isHovered || isMobileOpen)
                  "
                  class="mt-1 ml-4 border-l border-white/5 space-y-1 overflow-hidden"
                >
                  <li v-for="subItem in item.subItems" :key="subItem.name">
                    <router-link
                      :to="subItem.path"
                      class="block px-4 py-2 text-sm text-gray-500 hover:text-white hover:pl-5 transition-all duration-200"
                      :class="{ '!text-brand-blue font-medium': isActive(subItem.path) }"
                    >
                      {{ subItem.name }}
                    </router-link>
                  </li>
                </ul>
              </transition>
            </li>
          </ul>
        </div>
      </nav>

      <!-- User Profile Snippet (Bottom) -->
      <div
        v-if="(isExpanded || isHovered || isMobileOpen) && isHovered"
        class="mx-4 mt-8 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 animate-fade-in-up"
      >
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"></div>
        <div class="overflow-hidden">
          <div class="text-sm font-bold text-white truncate">Ivan User</div>
          <div class="text-xs text-gray-400">Pro Plan</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Overlay for Mobile -->
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
    @click="useSidebar().toggleMobileSidebar"
  ></div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useSidebar } from '@/composables/useSidebar'
import { useAuth } from '@/composables/useAuth'
import { computed } from 'vue'

const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, openSubmenu, toggleSubmenuState } = useSidebar()
const { userRole } = useAuth()

const allMenuGroups = [
  {
    title: 'Principal',
    roles: ['CLIENT', 'ADMIN'],
    items: [
      { name: 'Inicio', path: '/', icon: 'mdi:home' },
      { name: 'Dashboard', path: '/dashboard', icon: 'mdi:view-dashboard' },
    ],
  },
  {
    title: 'Tienda',
    roles: ['CLIENT'],
    items: [
      { name: 'Productos', path: '/dashboard/products', icon: 'mdi:shopping' },
      { name: 'Categorías', path: '/dashboard/categories', icon: 'mdi:shape' },
      { name: 'Carrito', path: '/dashboard/cart', icon: 'mdi:cart' },
      {
        name: 'Mis Pedidos',
        icon: 'mdi:package-variant',
        subItems: [
          { name: 'Completados', path: '/dashboard/orders-completed' },
          { name: 'Pendientes', path: '/dashboard/orders-pending' },
        ],
      },
    ],
  },
  {
    title: 'Creative Studio',
    roles: ['CLIENT', 'ADMIN'],
    items: [
      { name: 'Studio Builder', path: '/dashboard/studio-builder', icon: 'mdi:cube' },
      { name: 'Audio Lab', path: '/dashboard/audio-lab', icon: 'mdi:microphone-variant' },
      { name: 'Versus Mode', path: '/dashboard/versus-mode', icon: 'mdi:scale-balance' },
      { name: 'Academy', path: '/dashboard/academy', icon: 'mdi:school' },
    ],
  },
  {
    title: 'Usuario',
    roles: ['CLIENT'],
    items: [
      { name: 'Perfil', path: '/dashboard/personal-info', icon: 'mdi:account' },
      { name: 'Soporte', path: '/dashboard/support', icon: 'mdi:lifebuoy' },
    ],
  },
  {
    title: 'Administración',
    roles: ['ADMIN'],
    items: [
      { name: 'Panel Admin', path: '/admin', icon: 'mdi:shield-account' },
      {
        name: 'Gestión',
        icon: 'mdi:cog',
        subItems: [
          { name: 'Inventario', path: '/admin/stock' },
          { name: 'Productos', path: '/admin/products' },
          { name: 'Categorías', path: '/admin/categories' },
          { name: 'Clientes', path: '/admin/clients' },
          { name: 'Facturas', path: '/admin/invoices' },
          { name: 'Promociones', path: '/admin/promotions' },
          { name: 'Tickets', path: '/admin/tickets' },
          { name: 'Direcciones', path: '/admin/addresses' },
        ],
      },
      {
        name: 'Foro Admin',
        icon: 'mdi:forum-outline',
        subItems: [
          { name: 'Categorías', path: '/admin/forum/categories' },
          { name: 'Moderación', path: '/admin/forum/moderation' },
          { name: 'Reportes', path: '/admin/forum/reports' },
          { name: 'Estadísticas', path: '/admin/forum/stats' },
        ],
      },
    ],
  },
  {
    title: 'Comunidad',
    roles: ['CLIENT', 'ADMIN'],
    items: [
      { name: 'Setups', path: '/dashboard/community', icon: 'mdi:camera-iris' },
      { name: 'Foro', path: '/dashboard/forum', icon: 'mdi:forum' },
      { name: 'Mi Actividad', path: '/forum/my-activity', icon: 'mdi:clipboard-text-clock' },
      { name: 'Contacto', path: '/dashboard/contact', icon: 'mdi:email' },
    ],
  },
]

// Filter menu groups based on user role
const menuGroups = computed(() => {
  return allMenuGroups.filter((group) => group.roles.includes(userRole.value))
})

const isActive = (path: string | undefined) => {
  if (!path) return false
  return route.path === path
}

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  toggleSubmenuState(`${groupIndex}-${itemIndex}`)
}

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  if (openSubmenu.value === key) return true

  const group = menuGroups.value[groupIndex]
  if (!group?.items?.[itemIndex]?.subItems) return false

  // Auto-expand if child active
  return group.items[itemIndex].subItems.some((subItem) => isActive(subItem.path))
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
