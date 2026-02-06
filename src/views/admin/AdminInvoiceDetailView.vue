<template>
  <div class="min-h-screen bg-black">
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
            class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 !rounded-button hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            @click="logout"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="pt-16 min-h-screen">
      <div class="p-6 flex justify-center">
        <div class="bg-gray-800 rounded-lg p-8 w-full max-w-3xl shadow-lg">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-white">Boleta #{{ invoice.id }}</h1>
            <router-link
              to="/admin/invoices"
              class="text-gray-300 hover:text-white px-4 py-2 transition-colors duration-300"
            >
              Volver
            </router-link>
          </div>
          <div class="space-y-6 text-gray-300">
            <!-- Información de la Empresa -->
            <div class="border-b border-gray-700 pb-4">
              <div class="flex justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-white">PodStream</h2>
                  <p>Calle Principal 123, Madrid</p>
                  <p>+34 900 123 456</p>
                  <p>info@podstream.es</p>
                </div>
                <div class="text-right">
                  <p><strong>Fecha:</strong> {{ invoice.date }}</p>
                  <p>
                    <strong>Estado:</strong>
                    <span
                      :class="{
                        'text-green-400': invoice.status === 'paid',
                        'text-yellow-400': invoice.status === 'pending',
                      }"
                    >
                      {{ invoice.status === 'paid' ? 'Pagada' : 'Pendiente' }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Información del Cliente -->
            <div class="border-b border-gray-700 pb-4">
              <h3 class="text-lg font-semibold text-white mb-2">Facturado a:</h3>
              <p>{{ invoice.clientName }}</p>
              <p>{{ invoice.clientAddress || 'Dirección no disponible' }}</p>
              <p>{{ invoice.clientEmail || 'Email no disponible' }}</p>
            </div>

            <!-- Detalles de los Productos -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Productos Comprados:</h3>
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="py-2">Producto</th>
                    <th class="py-2">Cantidad</th>
                    <th class="py-2">Precio Unitario</th>
                    <th class="py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in invoice.items"
                    :key="index"
                    class="border-b border-gray-700 last:border-0"
                  >
                    <td class="py-2">{{ item.name }}</td>
                    <td class="py-2">{{ item.quantity }}</td>
                    <td class="py-2">${{ item.price.toFixed(2) }}</td>
                    <td class="py-2">${{ (item.quantity * item.price).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totales -->
            <div class="text-right">
              <p><strong>Subtotal:</strong> ${{ invoice.subtotal.toFixed(2) }}</p>
              <p><strong>Impuestos (21% IVA):</strong> ${{ invoice.taxes.toFixed(2) }}</p>
              <p class="text-xl font-semibold text-white">
                <strong>Total:</strong> ${{ invoice.total.toFixed(2) }}
              </p>
            </div>

            <!-- Botón para Descargar -->
            <div class="flex justify-end">
              <button
                class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 !rounded-button hover:opacity-90 transition-opacity cursor-pointer"
                @click="downloadInvoice"
              >
                Descargar Boleta
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      ref="footer"
      class="bg-gray-900 text-gray-300 py-12 border-t border-purple-500/20 relative z-10"
    >
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

<script lang="ts">
import jsPDF from 'jspdf'

export default {
  data() {
    return {
      cartCount: 3,
      menuItems: [
        { id: 1, name: 'Inicio', route: '/' },
        { id: 2, name: 'Productos', route: '/products' },
        { id: 3, name: 'Categorías', route: '/categories' },
        { id: 4, name: 'Sobre Nosotros', route: '/about' },
        { id: 5, name: 'Contacto', route: '/contact' },
        { id: 6, name: 'Carrito', route: '/cart' },
        { id: 7, name: 'Dashboard', route: '/dashboard' },
        { id: 8, name: 'Foro', route: '/forum' },
      ],
      footerLinks: [
        { id: 1, name: 'Productos', route: '/products' },
        { id: 2, name: 'Categorías', route: '/categories' },
        { id: 3, name: 'Contacto', route: '/contact' },
        { id: 4, name: 'Soporte', route: '/support' }, // Nota: No hay ruta para "support" aún
      ],
      invoice: {
        id: this.$route.params.id,
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        date: '',
        items: [] as Array<{ name: string; quantity: number; price: number }>,
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: '',
      },
    }
  },
  mounted() {
    this.loadInvoice()
  },
  methods: {
    toggleCart() {
      this.$router.push('/cart')
    },
    logout() {
      console.log('Cerrando sesión')
      this.$router.push('/login')
    },
    loadInvoice() {
      const invoices = [
        {
          id: 'INV001',
          clientName: 'Carlos Rodríguez',
          clientEmail: 'carlos.rodriguez@example.com',
          clientAddress: 'Calle Falsa 123, Madrid',
          date: '2025-01-15',
          items: [
            { name: 'Micrófono XLR', quantity: 1, price: 299.99 },
            { name: 'Auriculares Pro', quantity: 1, price: 249.99 },
          ],
          subtotal: 549.98,
          taxes: 115.5,
          total: 665.48,
          status: 'paid',
        },
        {
          id: 'INV002',
          clientName: 'Ana Gómez',
          clientEmail: 'ana.gomez@example.com',
          clientAddress: 'Avenida Siempre Viva 456, Barcelona',
          date: '2024-12-20',
          items: [{ name: 'Interfaz USB', quantity: 1, price: 199.99 }],
          subtotal: 199.99,
          taxes: 42.0,
          total: 241.99,
          status: 'pending',
        },
        {
          id: 'INV003',
          clientName: 'Luis Martínez',
          clientEmail: 'luis.martinez@example.com',
          clientAddress: 'Plaza Mayor 789, Valencia',
          date: '2025-02-10',
          items: [{ name: 'Filtro Antipop', quantity: 2, price: 29.99 }],
          subtotal: 59.98,
          taxes: 12.6,
          total: 72.58,
          status: 'paid',
        },
      ]
      const invoice = invoices.find((inv) => inv.id === this.$route.params.id)
      if (invoice) {
        this.invoice = invoice
      } else {
        this.$router.push('/adminInvoice')
      }
    },
    downloadInvoice() {
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text('Boleta #' + this.invoice.id, 20, 20)
      doc.setFontSize(12)
      doc.text('PodStream', 20, 30)
      doc.text('Calle Principal 123, Madrid', 20, 35)
      doc.text('+34 900 123 456', 20, 40)
      doc.text('info@podstream.es', 20, 45)

      doc.text(`Fecha: ${this.invoice.date}`, 140, 30)
      doc.text(`Estado: ${this.invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}`, 140, 35)

      doc.text('Facturado a:', 20, 60)
      doc.text(this.invoice.clientName, 20, 65)
      doc.text(this.invoice.clientAddress || 'Dirección no disponible', 20, 70)
      doc.text(this.invoice.clientEmail || 'Email no disponible', 20, 75)

      doc.text('Productos Comprados:', 20, 90)
      let y = 100
      this.invoice.items.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.name} - ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`,
          20,
          y,
        )
        y += 10
      })

      y += 10
      doc.text(`Subtotal: $${this.invoice.subtotal.toFixed(2)}`, 140, y)
      doc.text(`Impuestos (21% IVA): $${this.invoice.taxes.toFixed(2)}`, 140, y + 5)
      doc.setFontSize(14)
      doc.text(`Total: $${this.invoice.total.toFixed(2)}`, 140, y + 15)

      doc.save(`boleta_${this.invoice.id}.pdf`)
    },
  },
}
</script>

<style scoped>
.rounded-button {
  border-radius: 9999px;
}
.logo {
  height: 8rem;
  width: auto;
  object-fit: contain;
}
</style>
