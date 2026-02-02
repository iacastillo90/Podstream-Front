<template>
  <div class="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold font-heading text-white mb-2">Crear Nuevo Tema</h1>
      <p class="text-gray-400">Inicia una discusión con la comunidad.</p>
    </div>

    <GlassCard class="p-8">
      <form class="space-y-6" @submit.prevent="submitTopic">
        <!-- Category Selector -->
        <div>
          <label class="block text-gray-400 text-sm mb-2 font-bold">Categoría</label>
          <div class="relative">
            <select
              v-model="form.categoryId"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-brand-purple cursor-pointer"
              required
            >
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500"
            >
              <Icon icon="mdi:chevron-down" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-gray-400 text-sm mb-2 font-bold">Título</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Escribe un título descriptivo..."
            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            required
          />
        </div>

        <!-- Content (Rich Text / Markdown Placeholder) -->
        <div>
          <label class="block text-gray-400 text-sm mb-2 font-bold">Contenido</label>
          <textarea
            v-model="form.content"
            rows="12"
            placeholder="Escribe el contenido de tu tema aquí (acepta Markdown básico)..."
            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all resize-y font-mono text-sm"
            required
          ></textarea>
          <p class="text-xs text-gray-500 mt-2">
            Tu tema será revisado por moderadores antes de ser visible públicamente si el sistema lo
            requiere.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 pt-4 border-t border-white/5">
          <AnimatedButton type="button" variant="secondary" @click="$router.back()">
            Cancelar
          </AnimatedButton>
          <AnimatedButton type="submit" variant="primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Publicando...' : 'Publicar Tema' }}
          </AnimatedButton>
        </div>
      </form>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { ForumService } from '@/services/forumService'
import type { ForumCategory } from '@/types/forum'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const route = useRoute()
const uiStore = useUIStore()

const categories = ref<ForumCategory[]>([])
const isSubmitting = ref(false)

const form = reactive({
  categoryId: '' as string | number,
  title: '',
  content: '',
})

onMounted(async () => {
  // Pre-select category if in params
  if (route.params.categoryId) {
    form.categoryId = Number(route.params.categoryId)
  }

  try {
    categories.value = await ForumService.getCategories()
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
})

const submitTopic = async () => {
  if (!form.categoryId || !form.title.trim() || !form.content.trim()) return

  isSubmitting.value = true
  try {
    const topic = await ForumService.createTopic({
      categoryId: Number(form.categoryId),
      title: form.title,
      content: form.content,
    })

    uiStore.showToast('Tema creado correctamente', 'success')
    router.push(`/forum/topic/${topic.id}`)
  } catch (error) {
    console.error('Error creating topic:', error)
    uiStore.showToast('Error al crear el tema', 'error')
  } finally {
    isSubmitting.value = false
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
