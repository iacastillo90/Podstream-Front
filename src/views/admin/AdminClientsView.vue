<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl md:text-4xl font-bold font-heading mb-2">Gestión de Clientes</h1>
        <p class="text-gray-400">Administra la base de datos de usuarios y su historial.</p>
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
              placeholder="Buscar por nombre o email..."
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
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>

    <!-- Clients Table -->
    <GlassCard class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 border-b border-white/10">
              <th class="p-4 font-semibold text-gray-300 text-sm">Cliente</th>
              <th class="p-4 font-semibold text-gray-300 text-sm hidden md:table-cell">Contacto</th>
              <th class="p-4 font-semibold text-gray-300 text-sm hidden lg:table-cell">
                Ubicación
              </th>
              <th class="p-4 font-semibold text-gray-300 text-sm text-center">Compras</th>
              <th class="p-4 font-semibold text-gray-300 text-sm">Estado</th>
              <th class="p-4 font-semibold text-gray-300 text-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="client in paginatedClients"
              :key="client.id"
              class="hover:bg-white/5 transition-colors group"
            >
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold"
                  >
                    {{ client.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium text-white">{{ client.name }}</div>
                    <div class="text-xs text-gray-500 md:hidden">{{ client.email }}</div>
                  </div>
                </div>
              </td>
              <td class="p-4 hidden md:table-cell">
                <div class="text-sm text-gray-300">{{ client.email }}</div>
              </td>
              <td class="p-4 hidden lg:table-cell">
                <div
                  class="text-sm text-gray-400 truncate max-w-[200px]"
                  :title="client.address || 'No definida'"
                >
                  {{ client.address || '-' }}
                </div>
              </td>
              <td class="p-4 text-center">
                <span
                  class="inline-block px-2 py-1 rounded bg-white/5 text-xs font-medium text-white"
                >
                  {{ client.purchases }}
                </span>
              </td>
              <td class="p-4">
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  :class="
                    client.status === 'active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  "
                >
                  {{ client.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-purple/20 hover:text-brand-purple transition-colors"
                    title="Ver Detalles"
                    @click="openDetailsModal(client)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors"
                    :class="
                      client.status === 'inactive' ? 'hover:text-green-400' : 'hover:text-amber-400'
                    "
                    :title="client.status === 'inactive' ? 'Activar' : 'Desactivar'"
                    @click="toggleClientStatus(client)"
                  >
                    <i :class="client.status === 'inactive' ? 'fas fa-check' : 'fas fa-ban'"></i>
                  </button>
                  <button
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Eliminar"
                    @click="confirmDeleteClient(client.id)"
                  >
                    <i class="fas fa-trash"></i>
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
          Mostrando <span class="text-white font-medium">{{ paginatedClients.length }}</span> de
          <span class="text-white font-medium">{{ filteredClients.length }}</span> clientes
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

    <!-- Client Details Modal -->
    <div
      v-if="showDetailsModal && selectedClient"
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
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-brand-purple flex items-center justify-center text-xl font-bold text-white shadow-lg"
            >
              {{ selectedClient.name.charAt(0) }}
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ selectedClient.name }}</h3>
              <div class="text-gray-400 text-sm">{{ selectedClient.email }}</div>
            </div>
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
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-white/5 rounded-lg border border-white/5">
              <div class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Estado
              </div>
              <span
                class="text-sm font-medium"
                :class="selectedClient.status === 'active' ? 'text-green-400' : 'text-red-400'"
              >
                {{ selectedClient.status === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="p-3 bg-white/5 rounded-lg border border-white/5">
              <div class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Total Compras
              </div>
              <div class="text-white font-medium">{{ selectedClient.purchases }}</div>
            </div>
          </div>

          <div>
            <div class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              Dirección
            </div>
            <div class="text-gray-300 text-sm bg-black/20 p-3 rounded-lg border border-white/5">
              <i class="fas fa-map-marker-alt text-brand-purple mr-2"></i>
              {{ selectedClient.address || 'No registrada' }}
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Historial Reciente
              </div>
            </div>
            <div class="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              <div
                v-if="!selectedClient.purchaseHistory.length"
                class="text-gray-500 text-sm text-center py-4 italic"
              >
                Sin historial de compras
              </div>
              <div
                v-for="(purchase, index) in selectedClient.purchaseHistory"
                :key="index"
                class="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <span class="text-gray-400 text-sm">{{ purchase.date }}</span>
                <span class="text-white font-mono font-medium">
                  ${{ ((purchase as Record<string, unknown>).amount as number)?.toFixed(2) || '0.00' }}
                </span>
              </div>
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
import { ClientService } from '@/services/clientService'
import type { Client } from '@/types'

// --- State ---
const searchQuery = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const showDetailsModal = ref(false)
const selectedClient = ref<Client | null>(null)
const clients = ref<Client[]>([])

// --- Life Cycle ---
const fetchClients = async () => {
  try {
    const response = await ClientService.getAll()
    // Backend wraps response in { success, message, data } OR returns array directly
    const rawData = response as unknown as Record<string, unknown>[]

    // Map UserDTO to Client type expected by the view
    clients.value = rawData.map((user: Record<string, unknown>) => ({
      id: user.id as number,
      name:
        `${(user.firstname as string) || ''} ${(user.lastname as string) || ''}`.trim() ||
        (user.username as string),
      email: (user.email as string) || (user.username as string),
      address: (user.country as string) || '-',
      purchases: 0, // Backend doesn't provide this yet
      purchaseHistory: [], // Backend doesn't provide this yet
      status: user.enabled ? 'active' : 'inactive',
    }))
  } catch (error) {
    console.error('Error fetching clients', error)
  }
}

onMounted(() => {
  fetchClients()
})

// --- Computed ---
const filteredClients = computed(() => {
  let filtered = clients.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (client: Client) =>
        client.name.toLowerCase().includes(query) || client.email.toLowerCase().includes(query),
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((client: Client) => client.status === selectedStatus.value)
  }

  return filtered
})

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredClients.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredClients.value.length / itemsPerPage)
})

// --- Methods ---
const openDetailsModal = (client: Client) => {
  selectedClient.value = client
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedClient.value = null
}

const toggleClientStatus = async (client: Client) => {
  try {
    const newStatus = client.status === 'active' ? 'inactive' : 'active'
    await ClientService.updateStatus(client.id, newStatus)
    client.status = newStatus
  } catch (error) {
    console.error('Error toggling status', error)
  }
}

const confirmDeleteClient = (clientId: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
    clients.value = clients.value.filter((client) => client.id !== clientId)
    // Reset page if empty
    if (paginatedClients.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  }
}

const exportToExcel = () => {
  const data = filteredClients.value.map((client) => ({
    ID: client.id,
    Nombre: client.name,
    Email: client.email,
    Dirección: client.address || 'No disponible',
    Compras: client.purchases,
    Estado: client.status === 'active' ? 'Activo' : 'Inactivo',
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Clientes')
  XLSX.writeFile(wb, 'clientes_podstream.xlsx')
}

const exportToPDF = () => {
  const doc = new jsPDF() as unknown as {
    text: (text: string, x: number, y: number) => void
    autoTable: (options: unknown) => void
    save: (filename: string) => void
  }
  doc.text('Clientes de PodStream', 14, 10)
  doc.autoTable({
    head: [['ID', 'Nombre', 'Email', 'Dirección', 'Compras', 'Estado']],
    body: filteredClients.value.map((client) => [
      client.id,
      client.name,
      client.email,
      client.address || 'No disponible',
      client.purchases,
      client.status === 'active' ? 'Activo' : 'Inactivo',
    ]),
    startY: 20,
    theme: 'grid',
    styles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] },
    headStyles: { fillColor: [139, 92, 246] },
  })
  doc.save('clientes_podstream.pdf')
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
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[]

    jsonData.forEach((row) => {
      const client = clients.value.find((c) => c.id === row.ID)
      if (client) {
        client.name = (row.Nombre as string) || client.name
        client.email = (row.Email as string) || client.email
        client.address = (row.Dirección as string) || client.address
        client.purchases = (row.Compras as number) || client.purchases
        client.status = row.Estado === 'Activo' ? 'active' : 'inactive'
      }
    })

    console.log('Clientes actualizados desde Excel:', clients.value)
    alert('Clientes actualizados correctamente desde el archivo Excel.')
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
