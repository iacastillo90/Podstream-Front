<template>
  <div class="space-y-6 animate-fade-in-up pb-20">
    <div>
      <h1 class="text-3xl font-bold font-heading text-white mb-2">Moderación del Foro</h1>
      <p class="text-gray-400">Revisa y aprueba el contenido pendiente de la comunidad.</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 border-b border-white/10 pb-4">
      <button
        class="pb-2 font-bold transition-colors relative"
        :class="activeTab === 'PENDING' ? 'text-white' : 'text-gray-500 hover:text-white'"
        @click="activeTab = 'PENDING'"
      >
        Pendientes
        <span
          v-if="activeTab === 'PENDING'"
          class="absolute bottom-[-17px] left-0 w-full h-1 bg-brand-purple rounded-t"
        ></span>
      </button>
      <!-- Future: Reports Tab -->
      <!-- <button ... >Reportes</button> -->
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <Skeleton v-for="n in 3" :key="n" height="120px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="pendingItems.length === 0" class="py-12 text-center text-gray-500">
      <Icon icon="mdi:check-circle-outline" class="text-6xl mb-4 mx-auto opacity-50" />
      <p>¡Todo limpio! No hay contenido pendiente de revisión.</p>
    </div>

    <!-- List -->
    <div v-else class="space-y-4">
      <GlassCard
        v-for="item in pendingItems"
        :key="item.id + (item.type || 'TOPIC')"
        class="p-6 border-l-4 border-yellow-500"
      >
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white">
                {{ item.type === 'TOPIC' ? 'Nuevo Tema' : 'Respuesta' }}
              </span>
              <span class="text-xs text-gray-400">por {{ item.authorName }}</span>
              <span class="text-xs text-gray-500">• {{ item.createdAt }}</span>
            </div>

            <h3 v-if="item.title" class="text-lg font-bold text-white mb-2">
              {{ item.title }}
            </h3>

            <div
              class="bg-black/20 p-4 rounded-lg text-gray-300 text-sm italic mb-4 max-h-40 overflow-y-auto"
            >
              "{{ item.contentSnippet || item.content }}"
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <AnimatedButton
              variant="primary"
              class="!bg-green-600 hover:!bg-green-500 !px-3"
              @click="approve(item)"
            >
              <Icon icon="mdi:check" class="mr-2" /> Aprobar
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              class="!bg-red-500/20 hover:!bg-red-500 hover:text-white !text-red-400 !px-3"
              @click="reject(item)"
            >
              <Icon icon="mdi:close" class="mr-2" /> Rechazar
            </AnimatedButton>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ForumService } from '@/services/forumService'
import { useUIStore } from '@/stores/ui'

// Combined interface for View
interface PendingItem {
  id: number
  type: 'TOPIC' | 'POST'
  title?: string
  content: string
  contentSnippet?: string
  authorName: string
  createdAt: string
}

const uiStore = useUIStore()
const activeTab = ref('PENDING')
const isLoading = ref(true)
const pendingItems = ref<PendingItem[]>([])

const fetchPending = async () => {
  isLoading.value = true
  try {
    const { topics, posts } = await ForumService.getPendingContent()

    const formattedTopics = topics.map((t) => ({ ...t, type: 'TOPIC' as const }))
    const formattedPosts = posts.map((p) => ({ ...p, type: 'POST' as const, title: undefined })) // Posts don't have titles

    pendingItems.value = [...formattedTopics, ...formattedPosts]
  } catch (error) {
    console.error('Error fetching pending content:', error)
  } finally {
    isLoading.value = false
  }
}

const approve = async (item: PendingItem) => {
  try {
    await ForumService.approveContent(item.type, item.id)
    uiStore.showToast('Contenido aprobado', 'success')
    pendingItems.value = pendingItems.value.filter(
      (i) => !(i.id === item.id && i.type === item.type),
    )
  } catch (error) {
    console.error('Approve error:', error)
    uiStore.showToast('Error al aprobar content', 'error')
  }
}

const reject = async (item: PendingItem) => {
  const reason = prompt('Razón del rechazo:')
  if (reason === null) return // Cancelled

  try {
    await ForumService.rejectContent(item.type, item.id, reason || 'No cumple las normas')
    uiStore.showToast('Contenido rechazado', 'success')
    pendingItems.value = pendingItems.value.filter(
      (i) => !(i.id === item.id && i.type === item.type),
    )
  } catch (error) {
    console.error('Reject error:', error)
    uiStore.showToast('Error al rechazar contenido', 'error')
  }
}

onMounted(() => {
  fetchPending()
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
