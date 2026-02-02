<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-white mb-2">¡Hola, {{ userName }}!</h1>
    <div class="bg-black/60 rounded-xl p-6 border border-purple-600/20">
      <div class="flex flex-wrap gap-6 mb-4">
        <div class="flex items-center text-gray-300">
          <i class="fas fa-clock mr-2"></i>
          <span>Pedidos Pendientes: {{ pendingOrders }}</span>
        </div>
        <div class="flex items-center text-gray-300">
          <i class="fas fa-shopping-cart mr-2"></i>
          <span>Artículos en Carrito: {{ cartItems }}</span>
        </div>
      </div>
      <button
        class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2 rounded-full hover:opacity-90 transition"
      >
        Ver Pedidos
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userName: String,
    pendingOrders: Number,
    cartItems: Number,
  },
}
</script>
