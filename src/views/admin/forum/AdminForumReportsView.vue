<template>
  <div class="space-y-6 animate-fade-in-up pb-20">
    <div>
      <h1 class="text-3xl font-bold font-heading text-white mb-2">Reportes de Usuarios</h1>
      <p class="text-gray-400">Gestiona las denuncias sobre contenido inapropiado.</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <Skeleton v-for="n in 3" :key="n" height="100px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="reports.length === 0" class="py-12 text-center text-gray-500">
      <Icon icon="mdi:shield-check-outline" class="text-6xl mb-4 mx-auto opacity-50" />
      <p>Sin reportes activos. ¡Comunidad sana!</p>
    </div>

    <!-- List -->
    <div v-else class="space-y-4">
      <GlassCard v-for="report in reports" :key="report.id" class="p-6 border-l-4 border-red-500">
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white">
                {{ report.type }}
              </span>
              <span class="text-xs text-red-400 font-bold"
                >Reportado por {{ report.reporterName }}</span
              >
              <span class="text-xs text-gray-500">• {{ report.createdAt }}</span>
            </div>

            <div class="mb-2">
              <span class="text-gray-400 text-sm font-bold uppercase">Razón:</span>
              <span class="text-white ml-2">{{ report.reason }}</span>
            </div>

            <div class="bg-black/20 p-4 rounded-lg text-gray-300 text-sm italic mb-4">
              "{{ report.contentSnippet }}"
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <AnimatedButton
              variant="primary"
              class="!bg-red-600 hover:!bg-red-500 !px-3"
              @click="resolve(report.id, 'RESOLVE')"
            >
              <Icon icon="mdi:gavel" class="mr-2" /> Eliminar Contenido
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              class="!px-3"
              @click="resolve(report.id, 'DISMISS')"
            >
              <Icon icon="mdi:check" class="mr-2" /> Desestimar
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
import type { ForumReport } from '@/types/forum'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const isLoading = ref(true)
const reports = ref<ForumReport[]>([])

const fetchReports = async () => {
  isLoading.value = true
  try {
    // Assuming getReports returns typed array now
    reports.value = await ForumService.getReports()
  } catch (error) {
    console.error('Error fetching reports:', error)
  } finally {
    isLoading.value = false
  }
}

const resolve = async (id: number, action: 'RESOLVE' | 'DISMISS') => {
  try {
    await ForumService.resolveReport(id, action)
    uiStore.showToast(
      action === 'RESOLVE' ? 'Reporte resuelto (Contenido eliminado)' : 'Reporte desestimado',
      'success',
    )
    reports.value = reports.value.filter((r) => r.id !== id)
  } catch (error) {
    console.error('Resolve error:', error)
    uiStore.showToast('Error al procesar reporte', 'error')
  }
}

onMounted(() => {
  fetchReports()
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
