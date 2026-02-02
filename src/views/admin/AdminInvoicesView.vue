<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl md:text-4xl font-bold font-heading mb-2">Gestión de Boletas</h1>
        <p class="text-gray-400">Administra las boletas y facturas de la tienda.</p>
      </div>

      <div class="flex flex-wrap gap-4">
        <!-- Export Actions -->
        <AnimatedButton variant="secondary" class="!py-2 !px-4 text-xs" @click="exportToExcel">
          <i class="fas fa-file-excel mr-2"></i> Excel
        </AnimatedButton>
        <AnimatedButton variant="secondary" class="!py-2 !px-4 text-xs" @click="exportToPDF">
          <i class="fas fa-file-pdf mr-2"></i> PDF
        </AnimatedButton>
        <label class="cursor-pointer">
          <AnimatedButton variant="secondary" class="!py-2 !px-4 text-xs pointer-events-none">
            <i class="fas fa-upload mr-2"></i> Importar
          </AnimatedButton>
          <input type="file" accept=".xlsx, .xls" class="hidden" @change="importFromExcel" />
        </label>
      </div>
    </div>

    <!-- Filters & Search -->
    <GlassCard class="p-6">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1 space-y-2">
          <label class="text-sm text-gray-400 font-medium">Buscador</label>
          <div class="relative group/input">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i
                class="fas fa-search text-gray-500 group-focus-within/input:text-brand-purple transition-colors"
              ></i>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por ID o cliente..."
              class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm"
            />
          </div>
        </div>
        <div class="w-full md:w-64 space-y-2">
          <label class="text-sm text-gray-400 font-medium">Estado</label>
          <div class="relative">
            <select
              v-model="selectedStatus"
              class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white appearance-none focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm cursor-pointer"
            >
              <option value="">Todos</option>
              <option value="PAID">Pagada</option>
              <option value="PENDING">Pendiente</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>

    <!-- Invoices Table -->
    <GlassCard class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 border-b border-white/10">
              <th class="p-4 font-semibold text-gray-300 text-sm">ID</th>
              <th class="p-4 font-semibold text-gray-300 text-sm">Cliente</th>
              <th class="p-4 font-semibold text-gray-300 text-sm hidden md:table-cell">Fecha</th>
              <th class="p-4 font-semibold text-gray-300 text-sm text-right">Total</th>
              <th class="p-4 font-semibold text-gray-300 text-sm text-center">Estado</th>
              <th class="p-4 font-semibold text-gray-300 text-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="invoice in paginatedInvoices"
              :key="invoice.id"
              class="hover:bg-white/5 transition-colors group"
            >
              <td class="p-4 font-mono text-sm text-gray-300">{{ invoice.id }}</td>
              <td class="p-4 font-medium text-white">{{ invoice.clientName }}</td>
              <td class="p-4 text-gray-400 text-sm hidden md:table-cell">{{ invoice.date }}</td>
              <td class="p-4 text-right font-medium text-white">${{ invoice.total.toFixed(2) }}</td>
              <td class="p-4 text-center">
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  :class="
                    invoice.status === 'PAID'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  "
                >
                  {{ invoice.status === 'PAID' ? 'Pagada' : 'Pendiente' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-purple/20 hover:text-brand-purple transition-colors"
                    title="Ver Detalles"
                    @click="openDetailsModal(invoice)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    v-if="invoice.status === 'PENDING'"
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-green-500/20 hover:text-green-400 transition-colors"
                    title="Marcar como Pagada"
                    @click="markAsPaid(invoice)"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="p-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div class="text-sm text-gray-400">
          Mostrando <span class="text-white font-medium">{{ paginatedInvoices.length }}</span> de
          <span class="text-white font-medium">{{ filteredInvoices.length }}</span> boletas
        </div>
        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="currentPage = Math.max(currentPage - 1, 1)"
          >
            Anterior
          </button>
          <div v-if="totalPages > 1" class="flex gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors"
              :class="
                currentPage === page
                  ? 'bg-brand-purple text-white'
                  : 'text-gray-400 hover:bg-white/5'
              "
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>
          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="currentPage = Math.min(currentPage + 1, totalPages)"
          >
            Siguiente
          </button>
        </div>
      </div>
    </GlassCard>

    <!-- Invoice Details Modal -->
    <div
      v-if="showDetailsModal && selectedInvoice"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeDetailsModal"></div>
      <GlassCard
        class="relative w-full max-w-lg p-0 overflow-hidden border-brand-purple/30 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
      >
        <!-- Modal Header -->
        <div
          class="bg-brand-purple/10 p-6 border-b border-white/10 flex justify-between items-center"
        >
          <div>
            <h3 class="text-xl font-bold text-white">Boleta #{{ selectedInvoice.id }}</h3>
            <div class="text-gray-400 text-sm">{{ selectedInvoice.date }}</div>
          </div>
          <button
            class="text-gray-400 hover:text-white transition-colors"
            @click="closeDetailsModal"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <!-- Client Info -->
          <div
            class="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5"
          >
            <div>
              <div class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Cliente
              </div>
              <div class="text-white font-medium">{{ selectedInvoice.clientName }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 text-right">
                Estado
              </div>
              <span
                class="text-sm font-medium float-right"
                :class="selectedInvoice.status === 'PAID' ? 'text-green-400' : 'text-yellow-400'"
              >
                {{ selectedInvoice.status === 'PAID' ? 'Pagada' : 'Pendiente' }}
              </span>
            </div>
          </div>

          <!-- Items List -->
          <div>
            <div class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              Detalle de Productos
            </div>
            <div class="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              <div
                v-for="(item, index) in selectedInvoice.items"
                :key="index"
                class="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <div>
                  <div class="text-white font-medium text-sm">{{ item.name }}</div>
                  <div class="text-xs text-gray-500">
                    {{ item.quantity }} x ${{ item.price.toFixed(2) }}
                  </div>
                </div>
                <span class="text-white font-mono font-medium"
                  >${{ (item.quantity * item.price).toFixed(2) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="space-y-2 pt-4 border-t border-white/10">
            <div class="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span>${{ (selectedInvoice.subtotal || 0).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-400">
              <span>IVA (21%)</span>
              <span>${{ (selectedInvoice.taxes || 0).toFixed(2) }}</span>
            </div>
            <div
              class="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/5"
            >
              <span>Total</span>
              <span>${{ selectedInvoice.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 bg-black/20 border-t border-white/10 flex justify-end">
          <AnimatedButton variant="secondary" class="!py-2" @click="closeDetailsModal">
            Cerrar
          </AnimatedButton>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { InvoiceService } from '@/services/invoiceService'
import type { Invoice } from '@/types'

// --- State ---
const searchQuery = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const showDetailsModal = ref(false)
const selectedInvoice = ref<Invoice | null>(null)
const invoices = ref<Invoice[]>([])

// --- Lifecycle ---
const fetchInvoices = async () => {
  try {
    const response = await InvoiceService.getAll()
    invoices.value = response as any
  } catch (error) {
    console.error('Error fetching invoices', error)
  }
}

onMounted(() => {
  fetchInvoices()
})

// --- Computed ---
const filteredInvoices = computed(() => {
  let filtered = invoices.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (invoice) =>
        invoice.id.toString().toLowerCase().includes(query) ||
        invoice.clientName.toLowerCase().includes(query),
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((invoice) => invoice.status === selectedStatus.value)
  }

  return filtered
})

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredInvoices.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredInvoices.value.length / itemsPerPage)
})

// --- Methods ---
const openDetailsModal = (invoice: Invoice) => {
  selectedInvoice.value = invoice
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedInvoice.value = null
}

const markAsPaid = async (invoice: Invoice) => {
  try {
    await InvoiceService.markAsPaid(invoice.id)
    invoice.status = 'PAID'
  } catch (error) {
    console.error('Error marking invoice as paid', error)
  }
}

const exportToExcel = () => {
  const data = filteredInvoices.value.map((invoice) => ({
    'ID Boleta': invoice.id,
    Cliente: invoice.clientName,
    Fecha: invoice.date,
    'Monto Total': `$${invoice.total.toFixed(2)}`,
    Estado: invoice.status === 'PAID' ? 'Pagada' : 'Pendiente',
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Boletas')
  XLSX.writeFile(wb, 'boletas_podstream.xlsx')
}

const exportToPDF = () => {
  const doc = new jsPDF() as any
  doc.text('Boletas de PodStream', 14, 10)
  doc.autoTable({
    head: [['ID Boleta', 'Cliente', 'Fecha', 'Monto Total', 'Estado']],
    body: filteredInvoices.value.map((invoice) => [
      invoice.id,
      invoice.clientName,
      invoice.date,
      `$${invoice.total.toFixed(2)}`,
      invoice.status === 'PAID' ? 'Pagada' : 'Pendiente',
    ]),
    startY: 20,
    theme: 'grid',
    styles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] },
    headStyles: { fillColor: [139, 92, 246] },
  })
  doc.save('boletas_podstream.pdf')
}

const importFromExcel = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

    jsonData.forEach((row) => {
      const invoice = invoices.value.find((inv) => inv.id === row['ID Boleta'])
      if (invoice) {
        invoice.clientName = row.Cliente || invoice.clientName
        invoice.date = row.Fecha || invoice.date
        invoice.total = parseFloat(row['Monto Total']?.replace('$', '')) || invoice.total
        invoice.status = row.Estado === 'Pagada' ? 'PAID' : 'PENDING'
      }
    })

    console.log('Boletas actualizadas desde Excel:', invoices.value)
    alert('Boletas actualizadas correctamente desde el archivo Excel.')
  }
  reader.readAsArrayBuffer(file)
}
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
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
}
</style>
