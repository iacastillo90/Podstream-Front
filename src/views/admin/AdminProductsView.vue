<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl font-bold font-heading mb-1">Nuevo Producto</h1>
        <p class="text-gray-400">Añade un nuevo artículo al catálogo</p>
      </div>
      <router-link
        to="/admin/stock"
        class="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <i class="fas fa-arrow-left"></i> Volver al Stock
      </router-link>
    </div>

    <!-- Form Container -->
    <GlassCard class="max-w-4xl mx-auto p-8 relative overflow-hidden">
      <!-- Decorational Glow -->
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[80px] rounded-full pointer-events-none"
      ></div>

      <form class="space-y-8 relative z-10" @submit.prevent="submit">
        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <!-- Name -->
          <div class="space-y-2 md:col-span-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Nombre del Producto</label
            >
            <input
              v-model="form.name"
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-600"
              :class="{ 'border-red-500/50 focus:border-red-500': errors.name }"
              placeholder="Ej: Micrófono XLR Pro"
            />
            <span v-if="errors.name" class="text-xs text-red-400 ml-1">{{ errors.name }}</span>
          </div>

          <!-- Brand -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Marca</label
            >
            <input
              v-model="form.brand"
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-600"
              placeholder="Ej: Shure, Rode"
            />
          </div>

          <!-- Category -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Categoría</label
            >
            <div class="relative">
              <select
                v-model.number="form.categoryId"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none appearance-none transition-all"
                :class="{ 'border-red-500/50 focus:border-red-500': errors.categoryId }"
              >
                <option :value="null" disabled selected>Seleccionar...</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                  class="bg-gray-900"
                >
                  {{ category.name }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400"
              >
                <i class="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
            <span v-if="errors.categoryId" class="text-xs text-red-400 ml-1">{{
              errors.categoryId
            }}</span>
          </div>

          <!-- Color -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Color <span class="text-gray-500">(Opcional)</span></label
            >
            <input
              v-model="form.color"
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-600"
              placeholder="Ej: Negro, Plateado, Rojo"
            />
          </div>

          <!-- Price -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Precio ($)</label
            >
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                v-model.number="form.price"
                type="number"
                class="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-600"
                :class="{ 'border-red-500/50 focus:border-red-500': errors.price }"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <span v-if="errors.price" class="text-xs text-red-400 ml-1">{{ errors.price }}</span>
          </div>

          <!-- Discount -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Descuento % <span class="text-gray-500">(Opcional)</span></label
            >
            <div class="relative">
              <input
                v-model.number="form.discount"
                type="number"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-600"
                placeholder="0"
                min="0"
                max="100"
                step="1"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p v-if="form.discount > 0 && form.price" class="text-xs text-brand-purple ml-1">
              Precio final: ${{ (form.price * (1 - form.discount / 100)).toFixed(2) }}
            </p>
          </div>

          <!-- Stock -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Stock Inicial</label
            >
            <input
              v-model.number="form.stock"
              type="number"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-600"
              :class="{ 'border-red-500/50 focus:border-red-500': errors.stock }"
              placeholder="0"
              min="0"
            />
            <span v-if="errors.stock" class="text-xs text-red-400 ml-1">{{ errors.stock }}</span>
          </div>

          <!-- Full Description -->
          <div class="space-y-2 md:col-span-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Descripción Completa</label
            >
            <textarea
              v-model="form.description"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder-gray-600"
              :class="{ 'border-red-500/50 focus:border-red-500': errors.description }"
              rows="4"
              placeholder="Detalles completos..."
            ></textarea>
            <span v-if="errors.description" class="text-xs text-red-400 ml-1">{{
              errors.description
            }}</span>
          </div>

          <!-- Main Image -->
          <div class="space-y-2 md:col-span-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Imagen Principal</label
            >
            <div class="flex gap-4 items-center">
              <div
                v-if="form.image"
                class="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 group"
              >
                <img :src="getImageUrl(form.image)" class="w-full h-full object-cover" />
                <button
                  type="button"
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                  @click="form.image = ''"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <div class="flex-1 relative">
                <input
                  type="file"
                  accept="image/*"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 transition-all"
                  :disabled="uploadingIndexes['main']"
                  @change="(e) => handleFileUpload(e, null)"
                />
                <div
                  v-if="uploadingIndexes['main']"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-purple"
                >
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </div>
            </div>
            <p class="text-xs text-gray-500 ml-1">
              Esta será la imagen de preview/thumbnail del producto
            </p>
          </div>

          <!-- Photos -->
          <div class="space-y-3 md:col-span-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Galería de Imágenes</label
            >
            <div
              v-for="(photo, index) in form.images"
              :key="index"
              class="flex gap-4 items-center p-3 bg-white/5 rounded-lg border border-white/5"
            >
              <!-- Preview -->
              <div
                class="w-16 h-16 rounded overflow-hidden bg-black/20 shrink-0 border border-white/10"
              >
                <img v-if="photo" :src="getImageUrl(photo)" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                  <i class="fas fa-image"></i>
                </div>
              </div>

              <!-- Input -->
              <div class="flex-1 relative">
                <input
                  type="file"
                  accept="image/*"
                  class="w-full text-sm text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all"
                  :disabled="uploadingIndexes[`gallery-${index}`]"
                  @change="(e) => handleFileUpload(e, index)"
                />
                <div
                  v-if="uploadingIndexes[`gallery-${index}`]"
                  class="absolute right-0 top-1/2 -translate-y-1/2 text-brand-purple mr-2"
                >
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </div>

              <!-- Delete Action -->
              <button
                type="button"
                class="w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center justify-center shrink-0"
                @click="removePhoto(index)"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <button
              v-if="form.images.length < 5"
              type="button"
              class="w-full py-3 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:border-brand-purple/50 hover:text-brand-purple transition-all flex items-center justify-center gap-2 mt-2"
              @click="addPhoto"
            >
              <i class="fas fa-plus-circle"></i> Agregar Espacio para Imagen
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
          <button
            type="button"
            class="px-6 py-2 rounded-full text-gray-400 hover:text-white font-medium transition-colors"
            @click="$router.push('/admin/stock')"
          >
            Cancelar
          </button>
          <AnimatedButton class="px-8" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-check mr-2"></i>
            {{ isSubmitting ? 'Guardando...' : 'Crear Producto' }}
          </AnimatedButton>
        </div>
      </form>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { CategoryService } from '@/services/inventoryService'
import type { Category } from '@/types'
import { useProductForm } from '@/composables/useProductForm'
import { getImageUrl } from '@/utils/imageUtils'

const categories = ref<Category[]>([])

// Logic extracted to Composable (MVVM Pattern)
const {
  form,
  errors,
  isSubmitting,
  uploadingIndexes,
  addPhoto,
  removePhoto,
  handleFileUpload,
  submit,
} = useProductForm()

const loadCategories = async () => {
  try {
    const response = await CategoryService.getAll()
    categories.value = response
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

onMounted(() => {
  loadCategories()
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
