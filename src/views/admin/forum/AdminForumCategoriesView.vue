<template>
  <div class="space-y-6 animate-fade-in-up pb-20">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold font-heading text-white mb-2">Categorías del Foro</h1>
        <p class="text-gray-400">Administra las categorías de discusión.</p>
      </div>
      <AnimatedButton @click="openModal()">
        <Icon icon="mdi:plus" class="mr-2 text-xl" /> Nueva Categoría
      </AnimatedButton>
    </div>

    <!-- Categories List -->
    <div v-if="isLoading" class="space-y-4">
      <Skeleton v-for="n in 3" :key="n" height="80px" />
    </div>

    <div v-else class="space-y-4">
      <GlassCard
        v-for="category in categories"
        :key="category.id"
        class="p-6 flex items-center gap-4 group"
      >
        <div
          class="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl"
          :style="{ color: category.color || '#a855f7' }"
        >
          <Icon :icon="category.icon || 'mdi:folder'" />
        </div>

        <div class="flex-1">
          <h3 class="text-xl font-bold text-white mb-1">{{ category.name }}</h3>
          <p class="text-gray-400 text-sm">{{ category.description }}</p>
        </div>

        <div class="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            class="p-2 text-gray-400 hover:text-white transition-colors"
            title="Editar"
            @click="openModal(category)"
          >
            <Icon icon="mdi:pencil" class="text-xl" />
          </button>
          <button
            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Eliminar"
            @click="deleteCategory(category.id)"
          >
            <Icon icon="mdi:delete" class="text-xl" />
          </button>
        </div>
      </GlassCard>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"></div>
      <GlassCard class="relative w-full max-w-lg p-8">
        <h2 class="text-2xl font-bold text-white mb-6">
          {{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h2>

        <form class="space-y-4" @submit.prevent="submitCategory">
          <div>
            <label class="block text-gray-400 text-sm mb-2">Nombre</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-purple"
            />
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">Descripción</label>
            <textarea
              v-model="form.description"
              rows="3"
              required
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-purple resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Icono (MDI)</label>
              <input
                v-model="form.icon"
                type="text"
                placeholder="mdi:folder"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label class="block text-gray-400 text-sm mb-2">Color (Hex)</label>
              <input
                v-model="form.color"
                type="color"
                class="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <AnimatedButton type="button" variant="secondary" @click="closeModal">
              Cancelar
            </AnimatedButton>
            <AnimatedButton type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
            </AnimatedButton>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ForumService } from '@/services/forumService'
import type { ForumCategory } from '@/types/forum'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const categories = ref<ForumCategory[]>([])
const isLoading = ref(true)
const showModal = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  name: '',
  description: '',
  icon: 'mdi:folder',
  color: '#a855f7',
})

const fetchCategories = async () => {
  isLoading.value = true
  try {
    categories.value = await ForumService.getCategories()
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    isLoading.value = false
  }
}

const openModal = (category?: ForumCategory) => {
  if (category) {
    isEditing.value = true
    editingId.value = category.id
    form.name = category.name
    form.description = category.description
    form.icon = category.icon || 'mdi:folder'
    form.color = category.color || '#a855f7'
  } else {
    isEditing.value = false
    editingId.value = null
    form.name = ''
    form.description = ''
    form.icon = 'mdi:folder'
    form.color = '#a855f7'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitCategory = async () => {
  if (!form.name || !form.description) return

  isSubmitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      await ForumService.updateCategory(editingId.value, { ...form })
      uiStore.showToast('Categoría actualizada', 'success')
    } else {
      await ForumService.createCategory({ ...form })
      uiStore.showToast('Categoría creada', 'success')
    }
    await fetchCategories()
    closeModal()
  } catch (error) {
    console.error('Error saving category:', error)
    uiStore.showToast('Error al guardar categoría', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar esta categoría? Se ocultarán todos sus temas.')) return

  try {
    await ForumService.deleteCategory(id)
    uiStore.showToast('Categoría eliminada', 'success')
    await fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    uiStore.showToast('Error al eliminar categoría', 'error')
  }
}

onMounted(() => {
  fetchCategories()
})
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
