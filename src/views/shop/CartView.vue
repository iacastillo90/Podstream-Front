<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Hero / Header -->
    <div class="relative rounded-2xl overflow-hidden h-64 border border-white/10 group">
      <div class="absolute inset-0">
        <img
          src="https://public.readdy.ai/ai/img_res/e9c4933813127334b3c756eafabeb1d9.jpg"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60"
          alt="Cart Hero"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"
        ></div>
      </div>
      <div class="relative z-10 p-8 h-full flex flex-col justify-center">
        <h1 class="text-4xl font-bold font-heading mb-2">Tu Carrito</h1>
        <p class="text-gray-300 max-w-xl">
          Revisa tus artículos seleccionados y procede al pago seguro.
        </p>
        <div class="flex gap-4 mt-6">
          <div
            class="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-3"
          >
            <i class="fas fa-box text-brand-blue"></i>
            <span class="font-bold">{{ totalItems }} Artículos</span>
          </div>
          <div
            class="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-3"
          >
            <i class="fas fa-wallet text-brand-purple"></i>
            <span class="font-bold">Total: ${{ formatCurrency(cartTotal) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <GlassCard
          v-for="(item, index) in cartItems"
          :key="index"
          class="p-4 flex gap-6 items-center group hover:border-brand-purple/50 transition-colors"
        >
          <div class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900">
            <img :src="item.image" :alt="item.productName" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-1">
              <h3 class="text-lg font-bold truncate">{{ item.productName }}</h3>
              <button
                class="text-gray-500 hover:text-red-400 transition-colors"
                @click="removeItem(index)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <p class="text-sm text-gray-400 mb-3 truncate">{{ item.description }}</p>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 bg-white/5 rounded-lg p-1">
                <button
                  class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-white"
                  @click="decreaseQuantity(index)"
                >
                  <i class="fas fa-minus text-xs"></i>
                </button>
                <span class="font-mono font-bold w-4 text-center">{{ item.quantity }}</span>
                <button
                  class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-white"
                  @click="increaseQuantity(index)"
                >
                  <i class="fas fa-plus text-xs"></i>
                </button>
              </div>
              <span class="text-xl font-bold font-heading"
                >${{ formatCurrency(item.price * item.quantity) }}</span
              >
            </div>
          </div>
        </GlassCard>

        <div
          v-if="cartItems.length === 0"
          class="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/5 border-dashed"
        >
          <i class="fas fa-shopping-cart text-4xl mb-4 opacity-30"></i>
          <p>Tu carrito está vacío.</p>
          <router-link
            to="/products"
            class="text-brand-blue hover:text-white underline mt-2 inline-block"
            >Explorar productos</router-link
          >
        </div>
      </div>

      <!-- Summary -->
      <div class="space-y-6">
        <GlassCard class="p-6 sticky top-8">
          <h2 class="text-xl font-bold font-heading mb-6">Resumen del Pedido</h2>

          <div class="space-y-3 mb-6 pb-6 border-b border-white/10 text-sm">
            <div class="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>${{ formatCurrency(cartTotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Envío</span>
              <span class="text-green-400">Gratis</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Impuestos (21%)</span>
              <span>${{ formatCurrency(cartTotal * 0.21) }}</span>
            </div>
          </div>

          <div class="flex justify-between items-end mb-6">
            <span class="font-bold text-lg">Total</span>
            <span
              class="text-3xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue"
            >
              ${{ formatCurrency(cartTotal * 1.21) }}
            </span>
          </div>

          <AnimatedButton
            class="w-full justify-center !py-4 text-lg mb-3"
            :disabled="isProcessingPayment || cartItems.length === 0"
            @click="handleCheckout"
          >
            <i v-if="isProcessingPayment" class="fas fa-spinner fa-spin mr-2"></i>
            <span v-else
              >Pagar con MercadoPago <i class="fas fa-external-link-alt ml-2 text-sm"></i
            ></span>
          </AnimatedButton>

          <p class="text-xs text-center text-gray-500">
            <i class="fas fa-lock mr-1"></i> Pago 100% Seguro y Encriptado
          </p>
        </GlassCard>
      </div>
    </div>

    <!-- Recommendations (Featured) -->
    <div class="pt-12 border-t border-white/5">
      <h2 class="text-2xl font-bold font-heading mb-6">Te podría interesar</h2>
      <!-- Simple Grid instead of Swiper for cleaner code in this refactor, relies on ProductsView card style -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProductCard
          v-for="(product, idx) in products"
          :key="idx"
          :product="product"
          @add-to-cart="addToRecommendation"
          @view-details="viewRecommendation"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import { ProductService } from '@/services/productService'
import { OrderService } from '@/services/orderService' // Import order service
import { paymentService as PaymentService } from '@/services/paymentService' // Import payment service
import { getFullImageUrl } from '@/utils/imageHelper'
import { formatCurrency } from '@/utils/formatters'
import { useAuthStore } from '@/stores/auth' // Ensure auth is checked

const router = useRouter()
const store = useCartStore()
const authStore = useAuthStore()

// For recommendations
const products = ref<unknown[]>([])
const isProcessingPayment = ref(false) // Loading state

onMounted(async () => {
  store.fetchCart()

  // Fetch some products for recommendations (e.g., just get all limit 3 for now)
  try {
    const res = await ProductService.getAll()
    // Response is already unwrapped by interceptor.
    // Ensure we handle both array or Page object (with .content)
    const rawData = Array.isArray(res) ? res : (res as { content?: unknown[] }).content || []
    products.value = rawData.slice(0, 3).map((p) => {
      const prod = p as { image?: string; images?: string[]; photos?: string[] }
      return {
        ...p,
        image: getFullImageUrl(
          prod.image ||
            (prod.images && prod.images.length > 0 ? prod.images[0] : null) ||
            (prod.photos && prod.photos.length > 0 ? prod.photos[0] : null),
        ),
      }
    })
  } catch (e) {
    console.error(e)
  }
})

const cartItems = computed(() => store.items)
const cartTotal = computed(() => store.totalPrice)
const totalItems = computed(() => store.totalItems)

const increaseQuantity = (index: number) => {
  const item = store.items[index]
  store.updateQuantity(item.productId, item.quantity + 1)
}

const decreaseQuantity = (index: number) => {
  const item = store.items[index]
  if (item.quantity > 1) {
    store.updateQuantity(item.productId, item.quantity - 1)
  }
}

const removeItem = (index: number) => {
  const item = store.items[index]
  store.removeItem(item.productId)
}

const addToRecommendation = (product: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store.addItem(product as any, 1)
}

const viewRecommendation = (product: unknown) => {
  const prod = product as { id?: number }
  if (prod.id) {
    router.push(`/products/${prod.id}`)
  }
}

const handleCheckout = async () => {
  if (!authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    // Save current path to redirect back later?
    // For now simple redirect
    router.push('/login?redirect=/dashboard/cart')
    return
  }

  if (store.items.length === 0) return

  isProcessingPayment.value = true
  try {
    // 1. Create Order from Cart
    const order = await OrderService.createFromCart()

    if (!order || !order.id) {
      throw new Error('Error creando la orden')
    }

    // 2. Create MercadoPago Preference
    const response = await PaymentService.createPreference(order.id)

    // The response data matches the backend contract: { success: true, data: { initPoint: ... } }
    // The interceptor unwraps 'data' if success is true.
    const paymentData = response as { initPoint?: string; sandboxInitPoint?: string }
    const { initPoint } = paymentData

    // 3. Redirect to MercadoPago
    if (initPoint) {
      window.location.href = initPoint
    } else {
      alert('Error: No se recibió enlace de pago.')
    }
  } catch (error) {
    console.error('Checkout error:', error)
    alert('Hubo un error al iniciar el pago via MercadoPago.')
  } finally {
    isProcessingPayment.value = false
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
</style>
