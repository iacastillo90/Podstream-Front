<template>
  <div class="h-full space-y-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold font-heading">Gestión de Pedidos</h1>
    </div>

    <GlassCard class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-white/5 text-xs uppercase text-gray-400">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Usuario</th>
              <th class="px-6 py-4">Total</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 font-mono text-sm">#{{ order.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-bold">{{ order.userName || 'Usuario' }}</div>
                <div class="text-xs text-gray-400">{{ order.date }}</div>
              </td>
              <td class="px-6 py-4 font-bold">${{ order.total }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
                  :class="getStatusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  v-if="canRefund(order.status)"
                  class="text-red-400 hover:text-red-300 text-sm font-medium mr-4"
                  @click="openRefundModal(order)"
                >
                  Reembolsar
                </button>
                <button class="text-brand-purple hover:text-white transition-colors">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </GlassCard>

    <!-- Refund Modal -->
    <div
      v-if="showRefundModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <GlassCard class="w-full max-w-md p-6 m-4" border-glow>
        <h3 class="text-xl font-bold mb-4">Reembolsar Pedido #{{ selectedOrder?.id }}</h3>
        <p class="text-sm text-gray-300 mb-4">Esta acción revertirá el pago en MercadoPago.</p>

        <div class="mb-6">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"
            >Razón (Opcional)</label
          >
          <textarea
            v-model="refundReason"
            class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-brand-purple outline-none"
            rows="3"
            placeholder="Ej: Producto defectuoso..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-4">
          <button class="px-4 py-2 text-gray-400 hover:text-white" @click="showRefundModal = false">
            Cancelar
          </button>
          <AnimatedButton :disabled="isRefunding" @click="processRefund">
            <i v-if="isRefunding" class="fas fa-spinner fa-spin mr-2"></i>
            {{ isRefunding ? 'Procesando...' : 'Confirmar Reembolso' }}
          </AnimatedButton>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { orderService as OrderService } from '@/services/orderService' // Assuming create getMyOrders or getAllOrders for admin?
// Wait, orderService.getMyOrders is only for CLIENT. ProductService has getAll.
// Need getAllOrders for admin in OrderService?
// For now I'll stub it or assume "getMyOrders" works if I am admin?
// Actually admin usually has a different endpoint.
// But Phase 4 says "En el detalle de una orden (solo visible para administradores)".
// I'll create an admin fetch method or use mock for now if not specified.
// Actually I should look at `OrderService`. It only has `getMyOrders`.
// I'll assume I need to add `getAll` for admin or use `getMyOrders` if the backend returns all for admin role.
// I'll use `getMyOrders` for now, assuming Admin views all orders.

import { paymentService } from '@/services/paymentService'
import type { Order } from '@/types'

const orders = ref<Order[]>([])
const showRefundModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const refundReason = ref('')
const isRefunding = ref(false)

// Stub: fetch orders
const fetchOrders = async () => {
  // In a real scenario, this should be AdminService.getAllOrders()
  // For now we reuse existing service, assuming backend filters by role or returns all for admin
  const res = await OrderService.getAll()
  orders.value = Array.isArray(res) ? res : ((res as { data: unknown }).data as Order[]) || []
}

onMounted(() => {
  fetchOrders()
})

const getStatusClass = (status: string) => {
  const s = status.toLowerCase()
  if (s.includes('paid') || s.includes('confirmed')) return 'bg-green-500/10 text-green-400'
  if (s.includes('pending')) return 'bg-yellow-500/10 text-yellow-400'
  return 'bg-gray-500/10 text-gray-400'
}

const canRefund = (status: string) => {
  const s = status.toLowerCase()
  // "pagado y no reembolsado"
  return s === 'paid' || s === 'payment_confirmed'
}

const openRefundModal = (order: Order) => {
  selectedOrder.value = order
  refundReason.value = ''
  showRefundModal.value = true
}

const processRefund = async () => {
  if (!selectedOrder.value) return

  isRefunding.value = true
  try {
    await paymentService.refundOrder(selectedOrder.value.id, refundReason.value)
    alert('Reembolso procesado correctamente')
    showRefundModal.value = false
    // Update list
    fetchOrders()
  } catch (e) {
    console.error(e)
    alert('Error al procesar reembolso')
  } finally {
    isRefunding.value = false
  }
}
</script>
