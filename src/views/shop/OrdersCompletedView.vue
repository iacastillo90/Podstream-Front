<template>
  <div class="h-full">
    <div class="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <h1 class="text-3xl md:text-4xl font-bold font-heading mb-6">Pedidos Realizados</h1>

      <!-- Order List -->
      <div v-if="completedOrders.length > 0" class="space-y-6">
        <GlassCard
          v-for="order in completedOrders"
          :key="order.id"
          class="p-6 relative overflow-hidden hover:border-brand-purple/50 transition-colors group"
        >
          <!-- Order Header -->
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-white/5 gap-4"
          >
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-3">
                Pedido #{{ order.id }}
                <span
                  class="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {{ order.status }}
                </span>
              </h2>
              <p class="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <i class="far fa-calendar-alt"></i> {{ order.date }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-400">Total del pedido</p>
              <p class="text-2xl font-bold font-heading text-white">${{ order.total }}</p>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-4 mb-6">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/5"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-16 h-16 rounded-md object-cover bg-gray-900"
              />
              <div class="flex-1">
                <h3 class="font-bold text-white">{{ item.name }}</h3>
                <div class="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <span>Cant: {{ item.quantity }}</span>
                  <span>Precio: ${{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3 justify-end">
            <button
              class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors text-sm font-medium"
              @click="viewOrderDetails(String(order.id))"
            >
              Ver Detalles
            </button>
            <AnimatedButton class="!py-2 !px-6 text-sm" @click="leaveReview(String(order.id))">
              Dejar Reseña
            </AnimatedButton>
          </div>
        </GlassCard>
      </div>

      <!-- Empty State -->
      <GlassCard v-else class="p-12 text-center">
        <div
          class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <i class="fas fa-box-open text-3xl text-gray-500"></i>
        </div>
        <h2 class="text-2xl font-bold font-heading mb-2">No tienes pedidos aún</h2>
        <p class="text-gray-400 mb-8 max-w-md mx-auto">
          Explora nuestro catálogo y encuentra los mejores equipos para tu estudio.
        </p>
        <AnimatedButton @click="$router.push('/products')"> Explorar Productos </AnimatedButton>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { orderService as OrderService } from '@/services/orderService'
import type { Order } from '@/types'

const router = useRouter()
const completedOrders = ref<Order[]>([])

const fetchOrders = async () => {
  try {
    const response = await OrderService.getMyOrders()
    // The interceptor unwraps the response, so 'response' IS the array of orders
    const orders = Array.isArray(response)
      ? response
      : (response as { data?: unknown[] }).data || []

    // Filter for completed statuses
    completedOrders.value = (orders as Order[]).filter((o: Order) =>
      ['delivered', 'cancelled', 'completed'].includes(o.status.toLowerCase()),
    )
  } catch (error) {
    console.error('Failed to fetch completed orders:', error)
  }
}

onMounted(() => {
  fetchOrders()
})

// Methods
const viewOrderDetails = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

const leaveReview = (orderId: string) => {
  console.log(`Dejando reseña para el pedido #${orderId}`)
  // Implementation for review would likely require navigating to product review
}
</script>
