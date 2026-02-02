<template>
  <div class="space-y-8 animate-fade-in-up pb-20">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl font-bold font-heading mb-2">Gestión de Categorías</h1>
        <p class="text-gray-400">Crea, edita y elimina las categorías del catálogo.</p>
      </div>
      <AnimatedButton variant="primary" @click="openModal()">
        <i class="fas fa-plus mr-2"></i> Nueva Categoría
      </AnimatedButton>
    </div>

    <!-- Categories Table -->
    <GlassCard class="overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5 border-b border-white/10">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Imagen
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Descripción
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell"
              >
                Fecha Creación
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="category in categories"
              :key="category.id"
              class="hover:bg-white/5 transition-colors group"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-black/20">
                  <img
                    :src="category.image || 'https://placehold.co/100'"
                    class="w-full h-full object-cover"
                  />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                {{ category.name }}
              </td>
              <td
                class="px-6 py-4 text-sm text-gray-300 max-w-xs truncate"
                :title="category.description"
              >
                {{ category.description || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                <div class="text-xs">{{ formatDate(category.createdDate) }}</div>
                <div
                  v-if="
                    category.lastModifiedDate && category.lastModifiedDate !== category.createdDate
                  "
                  class="text-xs text-gray-500"
                >
                  Mod: {{ formatDate(category.lastModifiedDate) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-brand-blue hover:text-white mx-2 transition-colors"
                  @click="openModal(category)"
                >
                  <i class="fas fa-pen"></i>
                </button>
                <button
                  class="text-brand-pink hover:text-white mx-2 transition-colors"
                  @click="deleteCategory(category.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="categories.length === 0" class="text-center text-gray-400">
              <td colspan="5" class="py-8">No hay categorías registradas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </GlassCard>

    <!-- Modal Form -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"></div>
        <GlassCard class="relative max-w-lg w-full p-8 border-brand-purple/30 z-10">
          <h2 class="text-xl font-bold font-heading text-white mb-6">
            {{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h2>
          <form class="space-y-4" @submit.prevent="saveCategory">
            <div>
              <label class="block text-xs uppercase text-gray-400 font-bold mb-1">Nombre</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-purple outline-none"
                placeholder="Ej: Micrófonos"
              />
            </div>

            <div>
              <label class="block text-xs uppercase text-gray-400 font-bold mb-1"
                >Descripción</label
              >
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-purple outline-none resize-none"
                placeholder="Descripción de la categoría..."
              ></textarea>
            </div>

            <div>
              <label class="block text-xs uppercase text-gray-400 font-bold mb-1"
                >URL de Imagen <span class="text-gray-500">(Opcional)</span></label
              >
              <input
                v-model="form.image"
                type="url"
                class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-purple outline-none"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                @click="closeModal"
              >
                Cancelar
              </button>
              <AnimatedButton type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
              </AnimatedButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { CategoryService } from '@/services/inventoryService'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import type { Category as BaseCategory } from '@/types'

// Extended Interface for view
interface Category extends BaseCategory {
  image?: string
  info?: string
  slug?: string
  createdDate?: string
  lastModifiedDate?: string
}

const categories = ref<Category[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const editingId = ref<number | string | null>(null)

const form = reactive<Category>({
  id: 0,
  name: '',
  description: '',
  info: '',
  image: '',
  slug: '',
})

onMounted(() => {
  fetchCategories()
})

const fetchCategories = async () => {
  try {
    const response = await CategoryService.getAll()
    // Backend returns the array directly properly intercepted
    const rawData = response as any

    // Map backend fields including dates
    categories.value = rawData.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      info: cat.info || '',
      image: cat.image || '',
      slug: cat.slug || '',
      createdDate: cat.createdDate || cat.created_date,
      lastModifiedDate: cat.lastModifiedDate || cat.last_modified_date,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Helper function to format dates
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '-'
  }
}

const openModal = (category?: Category) => {
  if (category) {
    isEditing.value = true
    editingId.value = category.id!
    Object.assign(form, category)
  } else {
    isEditing.value = false
    editingId.value = null
    Object.assign(form, { name: '', description: '', info: '', image: '', slug: '' })
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveCategory = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      await CategoryService.update(editingId.value, form)
    } else {
      await CategoryService.create(form)
    }
    await fetchCategories()
    closeModal()
  } catch (error) {
    console.error('Error saving category:', error)
    alert('Error al guardar categoría')
  } finally {
    isSubmitting.value = false
  }
}

const deleteCategory = async (id: number | string) => {
  if (!confirm('¿Estás seguro de eliminar esta categoría?')) return
  try {
    await CategoryService.delete(id)
    await fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('Error al eliminar')
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
