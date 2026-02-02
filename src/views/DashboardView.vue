<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Welcome Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl md:text-4xl font-bold font-heading mb-2">
          Hola,
          <span
            class="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent"
            >{{ userName }}</span
          >
        </h1>
        <p class="text-gray-400">Aquí tienes un resumen de tu actividad y recomendaciones.</p>
      </div>
      <div class="flex gap-4">
        <AnimatedButton
          variant="secondary"
          class="!py-2 !px-4 text-sm"
          @click="$router.push('/cart')"
        >
          <i class="fas fa-shopping-cart mr-2"></i> Ver Carrito
        </AnimatedButton>
        <AnimatedButton
          variant="primary"
          class="!py-2 !px-4 text-sm"
          @click="$router.push('/products')"
        >
          <i class="fas fa-store mr-2"></i> Explorar Tienda
        </AnimatedButton>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <GlassCard
        v-for="(stat, index) in stats"
        :key="index"
        class="p-6 flex items-center gap-4 hover:border-brand-purple/30 transition-colors group"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300"
          :class="[
            index === 0 ? 'bg-brand-purple/20 text-brand-purple group-hover:scale-110' : '',
            index === 1 ? 'bg-brand-blue/20 text-brand-blue group-hover:scale-110' : '',
            index === 2 ? 'bg-brand-pink/20 text-brand-pink group-hover:scale-110' : '',
            index === 3 ? 'bg-green-500/20 text-green-400 group-hover:scale-110' : '',
          ]"
        >
          <i :class="['fas', stat.icon]"></i>
        </div>
        <div>
          <p class="text-gray-400 text-xs uppercase tracking-wider">{{ stat.title }}</p>
          <p class="text-2xl font-bold text-white font-heading">{{ stat.value }}</p>
        </div>
      </GlassCard>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-xl font-bold font-heading text-white flex items-center gap-2">
          <i class="fas fa-history text-brand-blue"></i> Actividad Reciente
        </h2>
        <div class="space-y-4">
          <GlassCard
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors"
              >
                <i v-if="activity.type === 'order'" class="fas fa-shopping-bag"></i>
                <i v-else-if="activity.type === 'review'" class="fas fa-star"></i>
                <i v-else class="fas fa-tag"></i>
              </div>
              <div>
                <p class="text-white font-medium">{{ activity.text }}</p>
                <p class="text-xs text-gray-500">{{ activity.date }}</p>
              </div>
            </div>
            <button class="text-gray-500 hover:text-brand-purple transition-colors">
              <i class="fas fa-chevron-right"></i>
            </button>
          </GlassCard>
        </div>
      </div>

      <!-- Quick Actions / Promo -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold font-heading text-white flex items-center gap-2">
          <i class="fas fa-bolt text-brand-purple"></i> Acciones Rápidas
        </h2>
        <GlassCard class="p-6 space-y-4">
          <button
            class="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-brand-purple/20 hover:text-brand-purple text-gray-300 transition-all"
            @click="$router.push('/personalInfo')"
          >
            <i class="fas fa-user-edit"></i>
            <span class="font-medium text-sm">Editar Perfil</span>
          </button>
          <button
            class="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-brand-blue/20 hover:text-brand-blue text-gray-300 transition-all"
            @click="$router.push('/ordersPending')"
          >
            <i class="fas fa-box-open"></i>
            <span class="font-medium text-sm">Ver Pedidos Pendientes</span>
          </button>
          <button
            class="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-brand-pink/20 hover:text-brand-pink text-gray-300 transition-all"
            @click="$router.push('/support')"
          >
            <i class="fas fa-headset"></i>
            <span class="font-medium text-sm">Soporte Técnico</span>
          </button>
        </GlassCard>

        <!-- Mini Promo Banner inside Dashboard -->
        <div
          class="relative rounded-2xl overflow-hidden h-40 group cursor-pointer"
          @click="$router.push('/products')"
        >
          <img
            src="https://public.readdy.ai/ai/img_res/e9c4933813127334b3c756eafabeb1d9.jpg"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
          <div class="absolute inset-0 p-6 flex flex-col justify-center items-start">
            <span class="text-brand-purple font-bold text-xs uppercase tracking-wider mb-1"
              >Oferta Especial</span
            >
            <h3 class="text-white font-bold text-lg mb-2">Descuento en<br />Micrófonos</h3>
            <span
              class="text-white/80 text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Ver Ofertas <i class="fas fa-arrow-right"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations Grid -->
    <div class="space-y-6">
      <div class="flex justify-between items-end">
        <h2 class="text-xl font-bold font-heading text-white flex items-center gap-2">
          <i class="fas fa-gem text-brand-pink"></i> Recomendado para ti
        </h2>
        <router-link
          to="/products"
          class="text-sm text-brand-purple hover:text-brand-pink transition-colors"
        >
          Ver todo
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in recommendedProducts"
          :key="product.id"
          :product="product"
          @view-details="viewProductDetails"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/authService'
import { OrderService } from '@/services/orderService'
import { ProductService } from '@/services/productService'
import { RecommendationService } from '@/services/api' // Assuming it is here
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import type { Product, Order } from '@/types'

const router = useRouter()
const userName = ref('')
const userId = ref<number | string>('')
const orders = ref<Order[]>([])
const recommendedProducts = ref<Product[]>([])

const stats = ref([
  { title: 'Total Gastado', value: '$0.00', icon: 'fa-dollar-sign' },
  { title: 'Pedidos', value: '0', icon: 'fa-shopping-bag' },
  { title: 'Pendientes', value: '0', icon: 'fa-clock' },
  { title: 'Puntos', value: '0', icon: 'fa-star' },
])

const recentActivity = computed(() => {
  return orders.value.slice(0, 4).map((order) => ({
    text: `Pedido #${order.id} - ${order.status}`,
    date: new Date(order.date || Date.now()).toLocaleDateString(),
    type: 'order',
  }))
})

// Fetch User Profile
const fetchProfile = async () => {
  try {
    const data = await AuthService.me()
    userName.value = data.firstName || data.email || 'Usuario'
    userId.value = data.id || ''
    // Mock points for now
    stats.value[3].value = '0'
    return data
  } catch (error) {
    console.error('Error loading profile:', error)
    userName.value = 'Invitado'
  }
}

// Fetch Orders & Calc Stats
const fetchOrders = async () => {
  try {
    const res = await OrderService.getMyOrders()
    // Service returns Order[] directly
    orders.value = res || []

    const totalSpent = orders.value.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
    const pendingCount = orders.value.filter((o) => o.status === 'PENDING').length

    stats.value[0].value = `$${totalSpent.toFixed(2)}`
    stats.value[1].value = orders.value.length.toString()
    stats.value[2].value = pendingCount.toString()
  } catch (error) {
    console.error('Error loading orders:', error)
  }
}

// Fetch Recommendations
const fetchRecommendations = async () => {
  try {
    // If we have a user ID, try personalized, otherwise generic
    if (userId.value) {
      const res = await RecommendationService.getUserRecommendations(userId.value, 4)
      recommendedProducts.value = res.data || []
    } else {
      // Fallback to generic products
      const res = await ProductService.getAll()
      // getAll returns PaginationResponse
      const products = (res as any).content || []
      recommendedProducts.value = products.slice(0, 4)
    }
  } catch (error) {
    console.error('Error loading recommendations:', error)
    // Fallback if recommendation service fails
    try {
      const res = await ProductService.getAll()
      const products = (res as any).content || []
      recommendedProducts.value = products.slice(0, 4)
    } catch (e) {
      console.error(e)
    }
  }
}

const viewProductDetails = (product: Product) => {
  router.push({ name: 'productDetail', params: { id: product.id } })
}

onMounted(async () => {
  await fetchProfile()
  fetchOrders()
  fetchRecommendations()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
