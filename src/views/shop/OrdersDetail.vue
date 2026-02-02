<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black">
    <!-- Header -->
    <header
      class="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-purple-500/20"
    >
      <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img
            src="../assets/image/Leonardo_Phoenix_10_Disea_un_logo_moderno_y_llamativo_para_Pod_3 (1).png"
            alt="Logo"
            class="logo"
          />
          <div
            class="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            PodStream
          </div>
        </div>
        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in menuItems"
            :key="item.id"
            :to="item.route"
            class="text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            {{ item.name }}
          </router-link>
        </nav>
        <div class="flex items-center space-x-6">
          <button class="text-gray-300 hover:text-white cursor-pointer">
            <i class="fas fa-search text-xl"></i>
          </button>
          <button
            class="text-gray-300 hover:text-white p-2 rounded-full cursor-pointer relative"
            @click="toggleCart"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span
              v-if="cartCount"
              class="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </button>
          <button
            class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            @click="logout"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-5 top-20 mt-2 w-64 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 transform hover:-translate-y-2 z-40',
        {
          'translate-x-0': isSidebarVisible || (isMobile && isSidebarOpen),
          '-translate-x-full': !isSidebarVisible && (!isMobile || (isMobile && !isSidebarOpen)),
        },
      ]"
      style="max-height: calc(100vh - 80px); overflow-y: auto"
    >
      <nav class="py-6 h-full">
        <div class="hidden md:flex justify-end px-4 mb-4">
          <button class="text-gray-300 hover:text-white" @click="toggleSidebarVisibility">
            <i
              :class="isSidebarVisible ? 'fas fa-chevron-left' : 'fas fa-chevron-right'"
              class="text-xl"
            ></i>
          </button>
        </div>
        <router-link
          v-for="(item, index) in menuLateralItems"
          :key="index"
          :to="item.route"
          class="flex items-center px-6 py-3 text-gray-300 hover:text-white cursor-pointer"
        >
          <i :class="['fas', item.icon, 'w-6']"></i>
          <span class="ml-3">{{ item.text }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Botón de Menú Hamburguesa (móviles) -->
    <button class="md:hidden fixed top-24 left-4 z-50 text-white" @click="toggleSidebar">
      <i :class="isSidebarOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-2xl"></i>
    </button>

    <!-- Contenedor para mostrar la pestaña cuando la barra lateral está oculta (solo en pantallas grandes) -->
    <div
      v-if="!isSidebarVisible && !isMobile"
      class="fixed top-20 left-0 w-8 h-12 bg-gray-800 z-40 flex items-center justify-center cursor-pointer"
      @click="toggleSidebarVisibility"
    >
      <i class="fas fa-chevron-right text-gray-300 hover:text-white"></i>
    </div>

    <!-- Main Contenedor -->
    <main
      class="flex flex-column pt-20 min-h-screen transition-all duration-300"
      :class="{ 'md:ml-72': isSidebarVisible, 'md:ml-0': !isSidebarVisible }"
    >
      <div class="p-6">
        <div class="bg-gray-800/50 rounded-lg shadow-lg p-6 border border-purple-500/20">
          <h2 class="text-2xl font-bold text-white mb-4">DETALLES DEL PEDIDO</h2>
          <div class="flex justify-between items-center mb-6">
            <p class="text-gray-300">Pedido #{{ orderId }}</p>
            <button
              class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Factura
            </button>
          </div>

          <!-- Grid Layout -->
          <div class="gap-6">
            <!-- Left Column: Order Details -->
            <!-- Right Column: Product Table and Summary -->
            <div class="gap-6">
              <!-- Product Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-gray-300">
                  <thead>
                    <tr class="bg-gray-700/50 border-b border-purple-500/20">
                      <th class="p-3 text-left">Detalles del Producto</th>
                      <th class="p-3 text-left">Precio por Unidad</th>
                      <th class="p-3 text-left">Cantidad</th>
                      <th class="p-3 text-left">Valoración</th>
                      <th class="p-3 text-left">Monto Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in currentOrder.items"
                      :key="index"
                      class="border-b border-gray-600/50"
                    >
                      <td class="p-3 flex items-center">
                        <img
                          :src="item.image"
                          alt="Product"
                          class="w-16 h-16 mr-4 object-cover rounded"
                        />
                        <div>
                          <p class="font-medium">{{ item.name }}</p>
                          <p class="text-sm text-gray-400">Color: N/A</p>
                          <p class="text-sm text-gray-400">Tamaño: N/A</p>
                        </div>
                      </td>
                      <td class="p-3">${{ item.price.toFixed(2) }}</td>
                      <td class="p-3">{{ item.quantity }}</td>
                      <td class="p-3">
                        <span class="flex">
                          <i
                            v-for="star in 5"
                            :key="star"
                            class="fas fa-star text-yellow-400"
                            :class="{ 'text-gray-600': star > (item.rating || 0) }"
                          ></i>
                        </span>
                      </td>
                      <td class="p-3">${{ (item.price * item.quantity).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Summary -->
              <div class="bg-gray-900/40 rounded-lg p-4 border border-purple-500/20 text-gray-300">
                <h3 class="text-lg font-semibold text-white mb-4">Resumen del Pedido</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${{ currentOrderSubTotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Descuento (PODSTREAM15):</span>
                    <span>-${{ discount.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Gastos de Envío:</span>
                    <span>${{ shippingCharge.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between font-bold mt-4">
                    <span>Total:</span>
                    <span>${{ currentOrderTotal.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Status History -->
        <div class="mt-6">
          <div class="bg-gray-800/50 rounded-lg shadow-lg p-6 border border-purple-500/20">
            <h2 class="text-2xl font-bold text-white mb-4">ESTADO DE LA ORDEN</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-gray-300 text-sm">
                <thead>
                  <tr class="bg-gray-700/70 border-b border-purple-500/20">
                    <th class="p-4 text-left font-semibold text-white w-1/4">Estado</th>
                    <th class="p-4 text-left font-semibold text-white w-1/4">Fecha</th>
                    <th class="p-4 text-left font-semibold text-white w-1/2">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(status, index) in orderStatusHistory"
                    :key="index"
                    class="border-b border-gray-700/30"
                  >
                    <td class="p-4">
                      <div class="flex items-center space-x-2">
                        <i
                          :class="[
                            'fas',
                            status.status === 'Entregado'
                              ? 'fa-check-circle text-green-500'
                              : status.status === 'Enviado'
                                ? 'fa-truck text-blue-500'
                                : status.status === 'En Proceso'
                                  ? 'fa-cogs text-yellow-500'
                                  : 'fa-clipboard-check text-gray-300',
                          ]"
                        ></i>
                        <span
                          :class="
                            status.status === 'Entregado'
                              ? 'text-green-500'
                              : status.status === 'Enviado'
                                ? 'text-blue-500'
                                : status.status === 'En Proceso'
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                          "
                        >
                          {{ status.status }}
                        </span>
                      </div>
                    </td>
                    <td class="p-4">{{ status.date }}</td>
                    <td class="p-4">{{ status.details }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Información del Pedido -->
      <div class="gap-6 mt-6">
        <div class="bg-gray-900/40 rounded-lg p-4 border border-purple-500/20">
          <h3 class="text-lg font-semibold text-white mb-4">Información del Pedido</h3>
          <div class="space-y-3 text-gray-300">
            <div>
              <span class="font-medium">Número de Pedido:</span>
              <p>{{ currentOrder.id }}</p>
            </div>
            <div>
              <span class="font-medium">Nombre del Cliente:</span>
              <p>{{ orderDetails.customerName }}</p>
            </div>
            <div>
              <span class="font-medium">Fecha del Pedido:</span>
              <p>{{ currentOrder.date }}</p>
            </div>
            <div>
              <span class="font-medium">Método de Pago:</span>
              <p>{{ orderDetails.paymentMethod }}</p>
            </div>
            <div>
              <span class="font-medium">Estado del Pedido:</span>
              <p
                :class="currentOrder.status === 'Entregado' ? 'text-green-500' : 'text-yellow-500'"
              >
                {{ currentOrder.status }}
              </p>
            </div>
            <div>
              <span class="font-medium">Dirección de Envío:</span>
              <p>{{ orderDetails.shippingAddress }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12 border-t border-purple-500/20">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 class="text-white text-lg font-semibold mb-4">Sobre PodStream</h4>
          <p class="text-gray-400">
            Somos tu destino principal para equipos de podcast profesional. Calidad y servicio
            garantizado.
          </p>
        </div>
        <div>
          <h4 class="text-white text-lg font-semibold mb-4">Enlaces Rápidos</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks" :key="link.id">
              <router-link :to="link.route" class="hover:text-white transition-colors">
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-white text-lg font-semibold mb-4">Contacto</h4>
          <ul class="space-y-2">
            <li>Calle Principal 123, Madrid</li>
            <li>+34 900 123 456</li>
            <li>info@podstream.es</li>
          </ul>
        </div>
        <div>
          <h4 class="text-white text-lg font-semibold mb-4">Newsletter</h4>
          <div class="flex">
            <input
              type="email"
              placeholder="Tu email"
              class="bg-gray-800 border-none px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
            <button
              class="bg-gradient-to-r from-purple-600 to-blue-500 px-4 rounded-r-lg text-white hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Suscribir
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// State
const cartCount = ref(3)
const isSidebarOpen = ref(false)
const isSidebarVisible = ref(true)
const isMobile = ref(window.innerWidth < 768)

// Order Data
const orderStatusHistory = ref([
  {
    status: 'Confirmado',
    date: '20 Mar 2025',
    details: 'El pedido ha sido confirmado.',
  },
  {
    status: 'En Proceso',
    date: '21 Mar 2025',
    details: 'El pedido está siendo preparado.',
  },
  {
    status: 'Enviado',
    date: '22 Mar 2025',
    details: 'El pedido ha sido enviado.',
  },
  {
    status: 'Entregado',
    date: '24 Mar 2025',
    details: 'El pedido ha sido entregado al cliente.',
  },
])

const orderDetails = ref({
  customerName: 'Juan Pérez',
  orderDate: '2025-05-31',
  paymentMethod: 'Tarjeta de Crédito',
  orderStatus: 'Entregado',
  shippingAddress: 'Calle Principal 123, Madrid, España',
})

const orderItems = ref([
  {
    id: '12345',
    date: '24 Mar 2025',
    status: 'Entregado',
    items: [
      {
        id: 1,
        name: 'Micrófono Profesional XLR',
        quantity: 1,
        price: 299.99,
        image: 'https://public.readdy.ai/ai/img_res/d96f655302f24a8ca11e67120b885d8d.jpg',
        rating: 5,
      },
      {
        id: 2,
        name: 'Auriculares de Estudio Pro',
        quantity: 1,
        price: 249.99,
        image: 'https://public.readdy.ai/ai/img_res/dfdf435fef7c9368609309ab4053b4f1.jpg',
      },
    ],
    total: 549.98,
  },
  // ... other mock orders
])

const discount = ref(5.0)
const shippingCharge = ref(6.0)

// Menus
const menuItems = [
  { id: 1, name: 'Inicio', route: '/' },
  { id: 2, name: 'Productos', route: '/products' },
  { id: 3, name: 'Categorías', route: '/categories' },
  { id: 4, name: 'Sobre Nosotros', route: '/about' },
  { id: 5, name: 'Contacto', route: '/contact' },
]

const menuLateralItems = [
  { icon: 'fa-user', text: 'Información Personal', route: '/personalInfo' },
  { icon: 'fa-box', text: 'Pedidos Realizados', route: '/ordersCompleted' },
  { icon: 'fa-clock', text: 'Pedidos Pendientes', route: '/ordersPending' },
  { icon: 'fa-comments', text: 'Foro', route: '/forum' },
  { icon: 'fa-shopping-cart', text: 'Carrito', route: '/cart' },
]

const footerLinks = [
  { id: 1, name: 'Productos', route: '/products' },
  { id: 2, name: 'Categorías', route: '/categories' },
  { id: 3, name: 'Ofertas', route: '/offers' },
  { id: 4, name: 'Soporte', route: '/support' },
]

// Computed
const orderId = computed(() => {
  return route.params.id ? `POD${route.params.id}` : 'POD2667'
})

const currentOrder = computed(() => {
  return orderItems.value[0]
})

const currentOrderSubTotal = computed(() => {
  return currentOrder.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const currentOrderTotal = computed(() => {
  return currentOrderSubTotal.value - discount.value + shippingCharge.value
})

// Methods
const toggleCart = () => {
  router.push('/cart')
}

const logout = () => {
  console.log('Cerrando sesión...')
  router.push('/')
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleSidebarVisibility = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isSidebarOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Estilos para el logo */
.logo {
  height: 8rem;
  width: auto;
  object-fit: contain;
}

/* Ajustes para el layout general */
main {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

/* Ajustes para el texto */
h1 {
  font-size: 2.25rem;
  line-height: 1.2;
}

h2 {
  font-size: 1.5rem;
  line-height: 1.2;
}

h3 {
  font-size: 1.25rem;
  line-height: 1.2;
}

h5 {
  font-size: 1.5rem;
  line-height: 1.2;
}

p {
  font-size: 1rem;
  line-height: 1.5;
}

/* Ensure table responsiveness and alignment */
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  vertical-align: middle;
}

img {
  border: 1px solid #4b5563;
  border-radius: 4px;
}

/* Responsive design */
@media (max-width: 640px) {
  table {
    display: block;
    overflow-x: auto;
  }
  th,
  td {
    min-width: 120px;
  }
}
</style>
