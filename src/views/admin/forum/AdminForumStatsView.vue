<template>
  <div class="space-y-6 animate-fade-in-up pb-20">
    <div>
      <h1 class="text-3xl font-bold font-heading text-white mb-2">Estadísticas del Foro</h1>
      <p class="text-gray-400">Analítica detallada de la comunidad.</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <div class="grid grid-cols-4 gap-4">
        <Skeleton v-for="n in 4" :key="n" height="100px" />
      </div>
      <Skeleton height="300px" />
    </div>

    <div v-else-if="stats" class="space-y-8">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard class="p-4 text-center">
          <div class="text-4xl font-bold text-white mb-1">{{ stats.overview.totalUsers }}</div>
          <div class="text-xs uppercase text-gray-400 tracking-wider">Miembros Totales</div>
        </GlassCard>
        <GlassCard class="p-4 text-center">
          <div class="text-4xl font-bold text-brand-purple mb-1">
            {{ stats.overview.totalTopics }}
          </div>
          <div class="text-xs uppercase text-gray-400 tracking-wider">Temas Totales</div>
        </GlassCard>
        <GlassCard class="p-4 text-center">
          <div class="text-4xl font-bold text-brand-pink mb-1">{{ stats.overview.totalPosts }}</div>
          <div class="text-xs uppercase text-gray-400 tracking-wider">Posts Totales</div>
        </GlassCard>
        <GlassCard class="p-4 text-center">
          <div class="text-4xl font-bold text-brand-blue mb-1">
            {{ stats.overview.activeUsers24h }}
          </div>
          <div class="text-xs uppercase text-gray-400 tracking-wider">Activos 24h</div>
        </GlassCard>
      </div>

      <!-- Charts Row -->
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Activity Chart -->
        <GlassCard class="p-6">
          <h3 class="text-lg font-bold text-white mb-4">Actividad (Últimos 30 días)</h3>
          <div class="h-64">
            <Bar :data="activityChartData" :options="chartOptions" />
          </div>
        </GlassCard>

        <!-- Categories Distribution -->
        <GlassCard class="p-6">
          <h3 class="text-lg font-bold text-white mb-4">Temas por Categoría</h3>
          <div class="h-64 flex justify-center">
            <Doughnut :data="categoryChartData" :options="doughnutOptions" />
          </div>
        </GlassCard>
      </div>

      <!-- Top Contributors -->
      <GlassCard class="p-6">
        <h3 class="text-lg font-bold text-white mb-4">Top Contribuidores</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gray-400 border-b border-white/10 text-xs uppercase">
                <th class="py-2 px-4">Usuario</th>
                <th class="py-2 px-4 text-right">Puntuación</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in stats.topContributors"
                :key="user.userId"
                class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <td class="py-3 px-4 flex items-center gap-3">
                  <span class="text-gray-500 w-4 font-mono">{{ index + 1 }}</span>
                  <div class="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                    <!-- Avatar placeholder -->
                  </div>
                  <span class="text-white font-medium">{{ user.name }}</span>
                </td>
                <td class="py-3 px-4 text-right font-bold text-brand-purple">
                  {{ user.score }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  type ChartOptions,
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'
import GlassCard from '@/components/ui/GlassCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ForumService } from '@/services/forumService'
import type { AdminForumStats } from '@/types/forum'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const isLoading = ref(true)
const stats = ref<AdminForumStats | null>(null)

const fetchStats = async () => {
  isLoading.value = true
  try {
    stats.value = await ForumService.getAdminStats()
  } catch (error) {
    console.error('Error fetching admin stats:', error)
  } finally {
    isLoading.value = false
  }
}

// Chart Data Computed
const activityChartData = computed(() => ({
  labels: stats.value?.topicsByDate.map((d) => d.date) || [],
  datasets: [
    {
      label: 'Nuevos Temas',
      backgroundColor: '#a855f7',
      data: stats.value?.topicsByDate.map((d) => d.count) || [],
    },
  ],
}))

const categoryChartData = computed(() => ({
  labels: stats.value?.popularCategories.map((c) => c.name) || [],
  datasets: [
    {
      backgroundColor: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
      data: stats.value?.popularCategories.map((c) => c.count) || [],
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#9ca3af' } },
    x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
  },
}

const doughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { color: '#fff' } },
  },
}

onMounted(() => {
  fetchStats()
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
