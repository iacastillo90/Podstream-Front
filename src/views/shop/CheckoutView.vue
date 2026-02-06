<template>
  <div class="space-y-8 animate-fade-in-up pb-20">
    <!-- Header -->
    <div class="border-b border-white/5 pb-6">
      <h1 class="text-3xl font-bold font-heading mb-2">Finalizar Compra</h1>
      <p class="text-gray-400">Completa tus datos para recibir tu pedido.</p>
    </div>

    <!-- Steps -->
    <div class="flex items-center justify-between max-w-2xl mx-auto mb-12 relative">
      <div class="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10"></div>

      <!-- Step 1: Carrito -->
      <div class="flex flex-col items-center gap-2 bg-black px-4 z-10">
        <div
          class="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)]"
        >
          <i class="fas fa-check"></i>
        </div>
        <span class="text-sm font-bold text-white">Carrito</span>
      </div>

      <!-- Step 2: Dirección -->
      <div class="flex flex-col items-center gap-2 bg-black px-4 z-10">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500"
          :class="
            currentStep >= 2
              ? 'bg-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
              : 'bg-white/10 text-gray-400'
          "
        >
          2
        </div>
        <span class="text-sm font-bold" :class="currentStep >= 2 ? 'text-white' : 'text-gray-500'"
          >Dirección</span
        >
      </div>

      <!-- Step 3: Confirmación -->
      <div class="flex flex-col items-center gap-2 bg-black px-4 z-10">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500"
          :class="
            currentStep >= 3
              ? 'bg-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
              : 'bg-white/10 text-gray-400'
          "
        >
          3
        </div>
        <span class="text-sm font-bold" :class="currentStep >= 3 ? 'text-white' : 'text-gray-500'"
          >Confirmación</span
        >
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Address Selection (Step 2) -->
        <GlassCard v-if="currentStep === 2" class="p-6">
          <h2 class="text-xl font-bold font-heading mb-6 flex items-center gap-2">
            <i class="fas fa-map-marker-alt text-brand-blue"></i> Dirección de Envío
          </h2>

          <!-- Saved Addresses Grid -->
          <div v-if="addresses.length > 0" class="grid md:grid-cols-2 gap-4 mb-8">
            <div
              v-for="address in addresses"
              :key="address.id"
              class="p-4 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden group"
              :class="
                selectedAddressId === address.id
                  ? 'border-brand-purple bg-brand-purple/10'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              "
              @click="selectedAddressId = address.id!"
            >
              <div class="flex justify-between items-start mb-2">
                <span
                  v-if="address.isDefault"
                  class="text-[10px] font-bold uppercase tracking-wider bg-brand-purple px-2 py-0.5 rounded text-white"
                  >Default</span
                >
                <i
                  v-if="selectedAddressId === address.id"
                  class="fas fa-check-circle text-brand-purple text-xl ml-auto"
                ></i>
              </div>
              <p class="text-white font-medium">{{ address.street }}</p>
              <p class="text-gray-400 text-sm">
                {{ address.city }}, {{ address.state }} {{ address.zipCode }}
              </p>
              <p class="text-gray-500 text-xs mt-1">{{ address.country }}</p>
            </div>
          </div>

          <!-- Add New Address Form -->
          <div class="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 class="text-lg font-bold text-white mb-4">Nueva Dirección</h3>
            <form class="space-y-4" @submit.prevent="saveNewAddress">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 uppercase font-bold">Calle y Número</label>
                  <input
                    v-model="newAddress.street"
                    type="text"
                    required
                    class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none"
                    placeholder="Av. Principal 123"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 uppercase font-bold">Código Postal</label>
                  <input
                    v-model="newAddress.zipCode"
                    type="text"
                    required
                    class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none"
                    placeholder="28001"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 uppercase font-bold">Ciudad</label>
                  <input
                    v-model="newAddress.city"
                    type="text"
                    required
                    class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none"
                    placeholder="Madrid"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 uppercase font-bold">Provincia/Estado</label>
                  <input
                    v-model="newAddress.state"
                    type="text"
                    class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none"
                    placeholder="Madrid"
                  />
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-400 uppercase font-bold">País</label>
                <select
                  v-model="newAddress.country"
                  class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none cursor-pointer"
                >
                  <option value="España">España</option>
                  <option value="México">México</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colombia">Colombia</option>
                </select>
              </div>
              <div class="pt-2">
                <button
                  type="submit"
                  class="text-sm text-brand-blue hover:text-brand-purple transition-colors font-medium flex items-center gap-2"
                >
                  <i class="fas fa-plus"></i> Guardar Dirección
                </button>
              </div>
            </form>
          </div>
        </GlassCard>

        <!-- Payment Method (Step 3 - Combined for simplicity or separate step) -->
        <GlassCard v-if="currentStep === 2" class="p-6 mt-6 opacity-50 cursor-not-allowed relative">
          <div class="absolute inset-0 z-10"></div>
          <h2 class="text-xl font-bold font-heading mb-4 flex items-center gap-2">
            <i class="fas fa-credit-card text-brand-pink"></i> Método de Pago
          </h2>
          <div class="bg-white/5 p-4 rounded-lg flex items-center gap-4">
            <i class="fas fa-wallet text-2xl text-gray-400"></i>
            <div>
              <p class="font-bold text-white">Pago Estándar</p>
              <p class="text-xs text-gray-400">Procesado de forma segura</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <!-- Summary Column -->
      <div class="lg:col-span-1">
        <GlassCard class="p-6 sticky top-24">
          <h3 class="text-xl font-bold font-heading mb-6">Resumen del Pedido</h3>

          <div class="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
            <div v-for="item in cartItems" :key="item.productId" class="flex gap-3">
              <div class="w-12 h-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  :src="item.image || 'https://placehold.co/100'"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ item.productName }}</p>
                <p class="text-xs text-gray-400">Cant: {{ item.quantity }}</p>
              </div>
              <div class="text-sm font-bold text-white">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="space-y-2 pt-4 border-t border-white/10 mb-6">
            <div class="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-400">
              <span>Envío</span>
              <span class="text-green-400">Gratis</span>
            </div>
            <div
              class="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/5"
            >
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <AnimatedButton
            :disabled="isProcessing || (currentStep === 2 && !selectedAddressId)"
            class="w-full justify-center text-lg"
            @click="handleMainAction"
          >
            <span v-if="isProcessing"
              ><i class="fas fa-spinner fa-spin mr-2"></i> Procesando...</span
            >
            <span v-else>{{ currentStep === 2 ? 'Confirmar Pedido' : 'Ir a Pagar' }}</span>
          </AnimatedButton>

          <p class="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
            <i class="fas fa-lock"></i> Pago 100% Seguro
          </p>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { AddressService } from '@/services/addressService'
import { OrderService } from '@/services/orderService'
import type { Address, CartItem } from '@/types' // Added Order type import if needed, assuming implicit or global
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

const router = useRouter()
const currentStep = ref(2)
const isProcessing = ref(false)

// Data
const addresses = ref<Address[]>([])
const selectedAddressId = ref<number | string>('')
const cartItems = ref<CartItem[]>([])
const cartTotal = ref(0) // Backend usually gives total

const newAddress = reactive<Partial<Address>>({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'España',
})

// Computed
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const total = computed(() => subtotal.value) // Add tax/shipping logic if needed

// Lifecycle
onMounted(() => {
  fetchAddresses()
  fetchCart()
})

// Methods
const fetchAddresses = async () => {
  try {
    const data = await AddressService.getAll()
    addresses.value = data

    // Auto-select default or first
    if (addresses.value.length > 0) {
      const def = addresses.value.find((a) => a.isDefault)
      selectedAddressId.value = def ? def.id! : addresses.value[0].id!
    }
  } catch (error) {
    console.error('Error fetching addresses (likely guest/first time):', error)
    // Provide dummy data for UI dev/demo if auth fails
    // addresses.value = []
  }
}

const fetchCart = async () => {
  try {
    const response = await api.get('/cart')
    // Assuming api returns unwrapped data
    const cartData = response as { items?: CartItem[]; totalPrice?: number }
    cartItems.value = cartData.items || []
    cartTotal.value = cartData.totalPrice || 0
  } catch (error) {
    console.error('Error fetching cart:', error)
  }
}

const saveNewAddress = async () => {
  if (!newAddress.street || !newAddress.city) return
  try {
    const payload = { ...newAddress, userId: 0 } as unknown as Omit<Address, 'id'> // Backend handles user context
    const response = await AddressService.create(payload)
    addresses.value.push(response)
    selectedAddressId.value = response.id!
    // Clear form
    newAddress.street = ''
    newAddress.city = ''
    newAddress.zipCode = ''
    newAddress.state = ''
  } catch (error) {
    console.error('Error saving address:', error)
    alert('Error al guardar la dirección')
  }
}

const handleMainAction = async () => {
  if (currentStep.value === 2) {
    placeOrder()
  }
}

const placeOrder = async () => {
  if (!selectedAddressId.value) {
    alert('Por favor selecciona una dirección de envío')
    return
  }

  isProcessing.value = true
  try {
    // In real backend, we might need to send addressId if the create-from-cart doesn't pick default
    // Assuming create-from-cart uses session context + authenticated user address logic
    const order = await OrderService.createFromCart()

    alert(`¡Orden creada con éxito! ID: ${order.id}`)
    router.push('/orders-completed') // Or /orders/{id}
  } catch (error) {
    console.error('Error placing order:', error)
    alert('Hubo un error al procesar tu orden. Intenta nuevamente.')
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
</style>
