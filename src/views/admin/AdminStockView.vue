<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl font-bold font-heading mb-1">Inventario</h1>
        <p class="text-gray-400">Gestiona el stock y disponibilidad de productos</p>
      </div>
      <div class="flex gap-4">
        <AnimatedButton variant="primary" @click="$router.push('/adminProducts')">
          <i class="fas fa-plus mr-2"></i> Nuevo Producto
        </AnimatedButton>
      </div>
    </div>

    <!-- Filters -->
    <GlassCard class="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
        <!-- Search -->
        <div class="relative group/input flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i
              class="fas fa-search text-gray-500 group-focus-within/input:text-brand-purple transition-colors"
            ></i>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por ID, nombre..."
            class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm"
          />
        </div>

        <!-- Filters -->
        <select
          v-model="selectedCategory"
          class="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-sm appearance-none cursor-pointer"
        >
          <option :value="null">Todas las Categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-gray-900">
            {{ cat.name }}
          </option>
        </select>

        <label
          class="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer select-none"
        >
          <input
            v-model="showLowStock"
            type="checkbox"
            class="rounded bg-white/10 border-white/10 text-brand-purple focus:ring-brand-purple"
          />
          <span class="text-sm">Stock Bajo</span>
        </label>
      </div>

      <!-- Exports -->
      <div class="flex gap-2">
        <button
          class="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Exportar Excel"
          @click="exportToExcel"
        >
          <i class="fas fa-file-excel"></i>
        </button>
        <button
          class="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Exportar PDF"
          @click="exportToPDF"
        >
          <i class="fas fa-file-pdf"></i>
        </button>
      </div>
    </GlassCard>

    <!-- Table -->
    <GlassCard class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/10 bg-white/5">
              <th class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Producto
              </th>
              <th class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Marca
              </th>
              <th class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Categoría
              </th>
              <th
                class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center"
              >
                Stock
              </th>
              <th
                class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <template v-if="isLoading">
              <tr v-for="n in 5" :key="n">
                <td class="py-4 px-6"><Skeleton height="20px" width="60%" /></td>
                <td class="py-4 px-6"><Skeleton height="20px" width="40%" /></td>
                <td class="py-4 px-6 flex justify-center">
                  <Skeleton height="24px" width="40px" :rounded="true" />
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex justify-end gap-2">
                    <Skeleton height="20px" width="20px" /><Skeleton height="20px" width="20px" />
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="group hover:bg-white/5 transition-colors"
              >
                <td class="py-4 px-6 text-white font-medium">{{ product.name }}</td>
                <td class="py-4 px-6 text-gray-400">{{ product.brand || '-' }}</td>
                <td class="py-4 px-6 text-gray-400">{{ getCategoryName(product.categoryId) }}</td>
                <td class="py-4 px-6 text-center">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold"
                    :class="
                      product.stock <= 5
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    "
                  >
                    {{ product.stock }}
                  </span>
                </td>
                <td class="py-4 px-6 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Status Icon -->
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      :class="
                        product.model3d_url
                          ? 'bg-brand-purple/20 text-brand-purple'
                          : 'bg-white/5 text-gray-600'
                      "
                      :title="product.model3d_url ? 'Modelo 3D Activo' : 'Sin Modelo 3D'"
                    >
                      <i class="fas fa-cube"></i>
                    </div>
                    <!-- Upload Button -->
                    <button
                      class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                      title="Subir Modelo 3D (.glb)"
                      @click="triggerUpload(product.id)"
                    >
                      <i class="fas fa-cloud-upload-alt"></i>
                    </button>
                  </div>
                </td>
                <td
                  class="py-4 px-6 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    class="text-brand-blue hover:text-white transition-colors"
                    title="Editar"
                    @click="openEditStockModal(product)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="text-red-400 hover:text-red-300 transition-colors"
                    title="Eliminar"
                    @click="confirmDeleteProduct(product.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedProducts.length === 0">
                <td colspan="5" class="py-8 text-center text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        accept=".glb,.gltf"
        class="hidden"
        @change="handleFileChange"
      />

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-white/10 flex items-center justify-between">
        <span class="text-sm text-gray-500">
          Mostrando {{ paginatedProducts.length }} de {{ filteredProducts.length }}
        </span>
        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="currentPage--"
          >
            <i class="fas fa-chevron-left text-xs"></i>
          </button>
          <button
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="currentPage++"
          >
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </GlassCard>

    <!-- Edit Modal (Simple overlay for now) -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <GlassCard class="w-full max-w-md p-6 animate-fade-in-up">
        <h3 class="text-xl font-bold mb-4">Editar Stock: {{ editProduct.name }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-400 text-xs uppercase font-bold mb-2">Cantidad</label>
            <input
              v-model.number="editProduct.stock"
              type="number"
              class="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-purple outline-none"
            />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button class="text-gray-400 hover:text-white px-4 py-2" @click="closeEditStockModal">
              Cancelar
            </button>
            <AnimatedButton class="!px-6 !py-2" @click="updateProduct">Guardar</AnimatedButton>
          </div>
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
import Skeleton from '@/components/ui/Skeleton.vue'
import { InventoryService, CategoryService } from '@/services/inventoryService'
import { ProductService } from '@/services/productService'
import type { Category, Product } from '@/types'

// Data
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const showLowStock = ref(false)
const currentPage = ref(1)
const itemsPerPage = 8
const isLoading = ref(true)

// File Upload
const fileInput = ref<HTMLInputElement | null>(null)
const uploadTargetId = ref<number | null>(null)

// Edit State
const showEditModal = ref(false)
const editProduct = ref<Partial<Product>>({})

const fetchInventory = async () => {
  isLoading.value = true
  try {
    const response = await InventoryService.getAll()
    const data = Array.isArray(response) ? response : (response as { data: Product[] }).data || []
    products.value = data
  } catch (error) {
    console.error('Failed to load inventory', error)
  } finally {
    isLoading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await CategoryService.getAll()
    const data = Array.isArray(response) ? response : (response as { data: Category[] }).data || []
    categories.value = data
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

onMounted(() => {
  fetchInventory()
  loadCategories()
})

// 3D Upload Logic
const triggerUpload = (id: number) => {
  uploadTargetId.value = id
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !uploadTargetId.value) return

  const file = input.files[0]
  const productId = uploadTargetId.value

  // Basic validation
  if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
    alert('Por favor selecciona un archivo .glb o .gltf')
    input.value = ''
    return
  }

  try {
    // Show Optimistic loading or global spinner?
    // alert('Subiendo modelo 3D...')
    const response = await ProductService.uploadModel3D(productId, file)

    // Update local state
    const product = products.value.find((p) => p.id === productId)
    if (product) {
      product.model3d_url = response.url // Ensure backend returns { url: ... }
    }

    alert('Modelo 3D actualizado correctamente')
  } catch (error) {
    console.error('Failed to upload 3D model:', error)
    alert('Error al subir el modelo')
  } finally {
    input.value = ''
    uploadTargetId.value = null
  }
}

// Helper function to get category name from ID
const getCategoryName = (categoryId: number | null | undefined): string => {
  if (!categoryId) return '-'
  const category = categories.value.find((c) => c.id === categoryId)
  return category?.name || '-'
}

// Computed
const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || p.categoryId === selectedCategory.value
    const matchesStock = !showLowStock.value || p.stock <= 5
    return matchesSearch && matchesCategory && matchesStock
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

// Methods
const openEditStockModal = (product: Product) => {
  editProduct.value = { ...product }
  showEditModal.value = true
}

const closeEditStockModal = () => {
  showEditModal.value = false
}

const updateProduct = async () => {
  if (!editProduct.value.id || editProduct.value.stock === undefined) return
  try {
    await InventoryService.updateStock(editProduct.value.id, editProduct.value.stock)
    // Optimistic update or refetch
    const index = products.value.findIndex((p) => p.id === editProduct.value.id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], stock: editProduct.value.stock }
    }
    closeEditStockModal()
  } catch (error) {
    console.error('Failed to update stock', error)
    alert('Error updating stock')
  }
}

const confirmDeleteProduct = (id: number) => {
  if (confirm('¿Eliminar este producto?')) {
    // In real scenario, delete product via ProductService?
    products.value = products.value.filter((p) => p.id !== id)
  }
}

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(filteredProducts.value)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Stock')
  XLSX.writeFile(wb, 'stock_podstream.xlsx')
}

const exportToPDF = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new jsPDF()
  doc.text('Stock PodStream', 14, 10)
  doc.autoTable({
    head: [['Producto', 'Categoría', 'Stock']],
    body: filteredProducts.value.map((p) => [p.name, getCategoryName(p.categoryId), p.stock]),
    startY: 20,
  })
  doc.save('stock_podstream.pdf')
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
