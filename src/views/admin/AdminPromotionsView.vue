<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl md:text-4xl font-bold font-heading mb-2">Gestión de Promociones</h1>
        <p class="text-gray-400">Configura descuentos y ofertas especiales para tu tienda.</p>
      </div>

      <div class="flex flex-wrap gap-4">
        <!-- Actions -->
        <AnimatedButton
          variant="primary"
          class="!py-2 !px-4 text-xs font-bold"
          @click="openCreateModal"
        >
          <i class="fas fa-plus mr-2"></i> Nueva Promoción
        </AnimatedButton>

        <!-- Export Actions -->
        <div class="flex gap-2">
          <AnimatedButton variant="secondary" class="!py-2 !px-4 text-xs" @click="exportToExcel">
            <i class="fas fa-file-excel mr-2"></i> Excel
          </AnimatedButton>
          <AnimatedButton variant="secondary" class="!py-2 !px-4 text-xs" @click="exportToPDF">
            <i class="fas fa-file-pdf mr-2"></i> PDF
          </AnimatedButton>
        </div>

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
              placeholder="Buscar promoción por nombre..."
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
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>

    <!-- Promotions Table -->
    <GlassCard class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 border-b border-white/10">
              <th class="p-4 font-semibold text-gray-300 text-sm w-20">ID</th>
              <th class="p-4 font-semibold text-gray-300 text-sm">Nombre</th>
              <th class="p-4 font-semibold text-gray-300 text-sm">Código</th>
              <th class="p-4 font-semibold text-gray-300 text-sm">Descripción</th>
              <th class="p-4 font-semibold text-gray-300 text-sm text-center">Descuento</th>
              <th class="p-4 font-semibold text-gray-300 text-sm hidden lg:table-cell">Vigencia</th>
              <th class="p-4 font-semibold text-gray-300 text-sm text-center">Estado</th>
              <th class="p-4 font-semibold text-gray-300 text-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="promotion in paginatedPromotions"
              :key="promotion.id"
              class="hover:bg-white/5 transition-colors group"
            >
              <td class="p-4 text-xs font-mono text-gray-500">{{ promotion.id }}</td>
              <td class="p-4 font-medium text-white">{{ promotion.name }}</td>
              <td class="p-4">
                <span
                  class="inline-block px-2 py-0.5 rounded bg-white/5 text-brand-blue text-xs font-mono border border-white/10"
                >
                  {{ promotion.code }}
                </span>
              </td>
              <td
                class="p-4 text-gray-400 text-sm truncate max-w-[200px]"
                :title="promotion.description"
              >
                {{ promotion.description }}
              </td>
              <td class="p-4 text-center">
                <span
                  class="inline-block px-2 py-1 rounded bg-brand-purple/20 text-brand-purple text-xs font-bold border border-brand-purple/30"
                >
                  {{ promotion.discount }}% OFF
                </span>
              </td>
              <td class="p-4 hidden lg:table-cell">
                <div class="text-xs text-gray-400">
                  <div>{{ promotion.startDate }}</div>
                  <div>{{ promotion.endDate }}</div>
                </div>
              </td>
              <td class="p-4 text-center">
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  :class="
                    promotion.status === 'active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  "
                >
                  {{ promotion.status === 'active' ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-purple/20 hover:text-brand-purple transition-colors"
                    title="Editar"
                    @click="openEditModal(promotion)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors"
                    :class="
                      promotion.status === 'active'
                        ? 'hover:text-amber-400'
                        : 'hover:text-green-400'
                    "
                    :title="promotion.status === 'active' ? 'Desactivar' : 'Activar'"
                    @click="togglePromotionStatus(promotion)"
                  >
                    <i :class="promotion.status === 'active' ? 'fas fa-pause' : 'fas fa-play'"></i>
                  </button>
                  <button
                    class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Eliminar"
                    @click="deletePromotion(promotion)"
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
          Mostrando <span class="text-white font-medium">{{ paginatedPromotions.length }}</span> de
          <span class="text-white font-medium">{{ filteredPromotions.length }}</span> promociones
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

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"></div>
      <GlassCard
        class="relative w-full max-w-lg p-0 overflow-hidden border-brand-purple/30 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
      >
        <!-- Modal Header -->
        <div
          class="bg-brand-purple/10 p-6 border-b border-white/10 flex justify-between items-center"
        >
          <h3 class="text-xl font-bold text-white">
            {{ isEditing ? 'Editar Promoción' : 'Nueva Promoción' }}
          </h3>
          <button class="text-gray-400 hover:text-white transition-colors" @click="closeModal">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <form class="space-y-4" @submit.prevent="savePromotion">
            <div class="space-y-2">
              <label class="text-sm text-gray-400">Nombre</label>
              <input
                v-model="currentPromotion.name"
                type="text"
                required
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                placeholder="Ej: Black Friday"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-gray-400">Descripción</label>
              <textarea
                v-model="currentPromotion.description"
                required
                rows="3"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                placeholder="Detalles de la promoción..."
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-gray-400">
                Código <span class="text-gray-500">(Opcional)</span>
              </label>
              <input
                v-model="currentPromotion.code"
                type="text"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors font-mono"
                placeholder="Ej: BLACKFRIDAY2024"
              />
              <p class="text-xs text-gray-500">
                Si no se especifica, se generará automáticamente del nombre
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-gray-400">
                URL de Imagen <span class="text-gray-500">(Opcional)</span>
              </label>
              <input
                v-model="currentPromotion.imageUrl"
                type="url"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                placeholder="https://ejemplo.com/imagen-promocion.jpg"
              />
              <p class="text-xs text-gray-500">URL de la imagen para el banner promocional</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Descuento (%)</label>
                <input
                  v-model.number="currentPromotion.discount"
                  type="number"
                  min="1"
                  max="100"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Estado</label>
                <select
                  v-model="currentPromotion.status"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Inicio</label>
                <input
                  v-model="currentPromotion.startDate"
                  type="date"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Fin</label>
                <input
                  v-model="currentPromotion.endDate"
                  type="date"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
              <button
                type="button"
                class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
                @click="closeModal"
              >
                Cancelar
              </button>
              <AnimatedButton
                type="submit"
                variant="primary"
                class="!py-2 !px-6 text-sm"
                :disabled="isSubmitting"
              >
                {{
                  isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Promoción'
                }}
              </AnimatedButton>
            </div>
          </form>
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
import { PromotionService } from '@/services/promotionService'
import type { Promotion } from '@/types'

// --- State ---
const searchQuery = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const showModal = ref(false)
const isEditing = ref(false)
const promotions = ref<Promotion[]>([])

const currentPromotion = ref<Omit<Promotion, 'id'> & { id?: string | number }>({
  id: '',
  name: '',
  description: '',
  discount: 0,
  startDate: '',
  endDate: '',
  status: 'active',
  active: true,
  code: '', // Ensure code is present as per interface
})

// --- Lifecycle ---
const fetchPromotions = async () => {
  try {
    const response = await PromotionService.getAll()
    // Backend may wrap response or return array directly
    const rawData = Array.isArray(response) ? response : []

    // Map backend fields to frontend structure
    promotions.value = rawData.map((promo: Record<string, unknown>) => ({
      id: promo.id as number,
      name: (promo.name as string) || '',
      description: (promo.description as string) || '',
      code: (promo.code as string) || '',
      discount: (promo.discountPercentage as number) || (promo.discount as number) || 0,
      startDate: promo.createdAt ? formatDateForInput(promo.createdAt as string) : '',
      endDate: promo.validUntil ? formatDateForInput(promo.validUntil as string) : '',
      active: promo.active !== undefined ? (promo.active as boolean) : promo.status === 'active',
      status: (promo.active as boolean) ? 'active' : 'inactive',
    }))
  } catch (error) {
    console.error('Error fetching promotions', error)
  }
}

// Helper function to format ISO date to YYYY-MM-DD
const formatDateForInput = (isoDate: string): string => {
  if (!isoDate) return ''
  return isoDate.split('T')[0]
}

onMounted(() => {
  fetchPromotions()
})

// --- Computed ---
const filteredPromotions = computed(() => {
  let filtered = promotions.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(query))
  }
  if (selectedStatus.value) {
    filtered = filtered.filter((p) => p.status === selectedStatus.value)
  }
  return filtered
})

const paginatedPromotions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPromotions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPromotions.value.length / itemsPerPage)
})

// --- Methods ---
const openCreateModal = () => {
  isEditing.value = false
  currentPromotion.value = {
    id: '', // Backend should generate ID
    name: '',
    description: '',
    code: '',
    discount: 0,
    startDate: '',
    endDate: '',
    status: 'active',
    active: true,
    imageUrl: '',
  }
  showModal.value = true
}

const openEditModal = (promotion: Promotion) => {
  isEditing.value = true
  currentPromotion.value = { ...promotion }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const isSubmitting = ref(false)

const savePromotion = async () => {
  if (isSubmitting.value) return // Prevent double submit

  isSubmitting.value = true
  try {
    // Map frontend fields to backend expected fields
    const backendData = {
      name: currentPromotion.value.name,
      description: currentPromotion.value.description,
      code:
        currentPromotion.value.code ||
        currentPromotion.value.name.toUpperCase().replace(/\s+/g, ''),
      discountPercentage: currentPromotion.value.discount,
      validUntil: currentPromotion.value.endDate
        ? `${currentPromotion.value.endDate}T23:59:59`
        : null,
      active: currentPromotion.value.status === 'active',
      imageUrl: currentPromotion.value.imageUrl || null,
    }

    if (isEditing.value && currentPromotion.value.id) {
      await PromotionService.update(
        currentPromotion.value.id,
        backendData as unknown as Partial<Promotion>,
      )
    } else {
      await PromotionService.create(backendData as unknown as Omit<Promotion, 'id'>)
    }
    await fetchPromotions()
    closeModal()
  } catch (error) {
    console.error('Error saving promotion', error)
    alert('Error al guardar la promoción. Verifica los datos.')
  } finally {
    isSubmitting.value = false
  }
}

const togglePromotionStatus = async (promotion: Promotion) => {
  try {
    const newStatus = promotion.status === 'active' ? 'inactive' : 'active'
    await PromotionService.update(promotion.id, { ...promotion, status: newStatus })
    promotion.status = newStatus
  } catch (error) {
    console.error('Error toggling status', error)
  }
}

const deletePromotion = async (promotion: Promotion) => {
  if (confirm(`¿Estás seguro de que deseas eliminar la promoción ${promotion.name}?`)) {
    try {
      await PromotionService.delete(promotion.id)
      await fetchPromotions()
      if (paginatedPromotions.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } catch (error) {
      console.error('Error deleting promotion', error)
    }
  }
}

const exportToExcel = () => {
  const data = filteredPromotions.value.map((p) => ({
    ID: p.id,
    Nombre: p.name,
    Descripción: p.description,
    Descuento: `${p.discount}%`,
    'Fecha Inicio': p.startDate,
    'Fecha Fin': p.endDate,
    Estado: p.status === 'active' ? 'Activa' : 'Inactiva',
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Promociones')
  XLSX.writeFile(wb, 'promociones_podstream.xlsx')
}

const exportToPDF = () => {
  const doc = new jsPDF() as unknown as {
    text: (text: string, x: number, y: number) => void
    autoTable: (options: unknown) => void
    save: (filename: string) => void
  }
  doc.text('Promociones de PodStream', 14, 10)
  doc.autoTable({
    head: [['ID', 'Nombre', 'Descripción', 'Descuento', 'Inicio', 'Fin', 'Estado']],
    body: filteredPromotions.value.map((p) => [
      p.id,
      p.name,
      p.description,
      `${p.discount}%`,
      p.startDate,
      p.endDate,
      p.status === 'active' ? 'Activa' : 'Inactiva',
    ]),
    startY: 20,
    theme: 'grid',
    styles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] },
    headStyles: { fillColor: [139, 92, 246] },
  })
  doc.save('promociones_podstream.pdf')
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
      const promotion = promotions.value.find((p) => p.id === row.ID)
      if (promotion) {
        promotion.name = (row.Nombre as string) || promotion.name
        promotion.description = (row.Descripción as string) || promotion.description
        promotion.discount =
          parseInt((row.Descuento as string)?.replace('%', '')) || promotion.discount
        promotion.startDate = (row['Fecha Inicio'] as string) || promotion.startDate
        promotion.endDate = (row['Fecha Fin'] as string) || promotion.endDate
        promotion.status = row.Estado === 'Activa' ? 'active' : 'inactive'
      }
    })
    alert('Promociones actualizadas correctamente desde el archivo Excel.')
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
</style>
