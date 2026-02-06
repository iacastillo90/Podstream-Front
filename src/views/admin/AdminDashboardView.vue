<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl font-bold font-heading mb-1">Panel de Control</h1>
        <p class="text-gray-400">Visión general del rendimiento de tu tienda</p>
      </div>
      <div class="flex gap-4">
        <div class="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">
          <span class="text-gray-400 mr-2">Última actualización:</span>
          <span class="text-brand-blue font-mono font-bold">{{
            new Date().toLocaleTimeString()
          }}</span>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <GlassCard v-for="(stat, index) in stats" :key="index" class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="p-3 rounded-lg" :class="stat.bgClass">
            <i :class="['fas', stat.icon, 'text-xl', stat.textClass]"></i>
          </div>
          <span
            class="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400 flex items-center gap-1"
          >
            <i class="fas fa-arrow-up text-[10px]"></i> {{ stat.growth }}%
          </span>
        </div>
        <div class="text-3xl font-bold font-heading mb-1">{{ stat.value }}</div>
        <div class="text-sm text-gray-400">{{ stat.label }}</div>
      </GlassCard>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard class="p-6">
        <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
          <i class="fas fa-chart-bar text-brand-purple"></i> Ventas por Categoría
        </h3>
        <div class="h-[300px] relative w-full">
          <Bar :data="topProductData" :options="chartOptions" />
        </div>
      </GlassCard>

      <GlassCard class="p-6">
        <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
          <i class="fas fa-comments text-brand-blue"></i> Actividad del Foro
        </h3>
        <div class="h-[300px] relative w-full flex justify-center">
          <Pie :data="topForumData" :options="pieChartOptions" />
        </div>
      </GlassCard>
    </div>

    <!-- Top Clients & Promotions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Client -->
      <GlassCard
        class="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-brand-purple/10 to-transparent"></div>
        <div class="relative z-10">
          <div
            class="w-20 h-20 rounded-full p-1 bg-gradient-to-r from-brand-purple to-brand-pink mb-4 mx-auto"
          >
            <img
              :src="topClient.avatar"
              class="w-full h-full rounded-full object-cover border-4 border-gray-900"
              alt="Client"
            />
          </div>
          <h3 class="text-xl font-bold mb-1">{{ topClient.name }}</h3>
          <div class="text-brand-purple font-bold mb-4">Cliente del Mes</div>

          <div class="grid grid-cols-2 gap-4 w-full border-t border-white/10 pt-4">
            <div>
              <div class="text-2xl font-bold">{{ topClient.purchases }}</div>
              <div class="text-xs text-gray-500 uppercase">Compras</div>
            </div>
            <div>
              <div class="text-2xl font-bold">${{ (topClient.purchases * 150).toFixed(0) }}</div>
              <div class="text-xs text-gray-500 uppercase">Total</div>
            </div>
          </div>
        </div>
      </GlassCard>

      <!-- Create Promotion -->
      <GlassCard class="p-6 lg:col-span-2">
        <h3 class="text-lg font-bold mb-6">Lanzar Promoción Rápida</h3>
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="createPromotion">
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-400 uppercase">Título</label>
              <input
                v-model="promoForm.title"
                type="text"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                placeholder="Ej: Black Friday anticipado"
              />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-400 uppercase">Descuento (%)</label>
              <input
                v-model="promoForm.discount"
                type="number"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                placeholder="20"
              />
            </div>
          </div>
          <div class="flex flex-col justify-between">
            <div class="space-y-2 mb-4">
              <label class="text-xs font-bold text-gray-400 uppercase">Descripción</label>
              <textarea
                v-model="promoForm.description"
                rows="3"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                placeholder="Detalles de la promo..."
              ></textarea>
            </div>
            <AnimatedButton class="w-full justify-center">
              <i class="fas fa-paper-plane mr-2"></i> Enviar Promoción
            </AnimatedButton>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { DashboardService } from '@/services/dashboardService'
import { PromotionService } from '@/services/promotionService'
import type { Promotion } from '@/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Reactive Data
const stats = ref([
  {
    label: 'Ingresos Totales',
    value: '$0',
    growth: 0,
    icon: 'fa-dollar-sign',
    bgClass: 'bg-brand-purple/20',
    textClass: 'text-brand-purple',
  },
  {
    label: 'Nuevos Clientes',
    value: '0',
    growth: 0,
    icon: 'fa-users',
    bgClass: 'bg-brand-blue/20',
    textClass: 'text-brand-blue',
  },
  {
    label: 'Pedidos Pendientes',
    value: '0',
    growth: 0,
    icon: 'fa-box-open',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-500',
  },
  {
    label: 'Tasa de Conversión',
    value: '0%',
    growth: 0,
    icon: 'fa-chart-line',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-500',
  },
])

const topClient = ref({
  name: 'Cargando...',
  avatar: 'https://placehold.co/100',
  purchases: 0,
})

const topProductData = ref<{
  labels: string[]
  datasets: Array<{
    label: string
    backgroundColor: string[]
    borderRadius: number
    data: number[]
  }>
}>({
  labels: [],
  datasets: [
    {
      label: 'Ventas',
      backgroundColor: ['#7000FF', '#00C2FF', '#FF00C7', '#ffffff'],
      borderRadius: 6,
      data: [],
    },
  ],
})

const topForumData = ref<{
  labels: string[]
  datasets: Array<{
    backgroundColor: string[]
    borderColor: string
    data: number[]
  }>
}>({
  labels: [],
  datasets: [
    {
      backgroundColor: ['#7000FF', '#00C2FF', '#FF00C7'],
      borderColor: 'transparent',
      data: [],
    },
  ],
})

const fetchDashboardStats = async () => {
  try {
    const response = await DashboardService.getStats()
    console.log('Dashboard Stats Response:', response) // Debug log
    const data = response as Record<string, unknown>

    // Update Stats Cards
    stats.value[0].value = `$${(data.totalIncome as number) || 0}`
    stats.value[0].growth = (data.incomeGrowth as number) || 0

    stats.value[1].value = `${(data.newClients as number) || 0}`
    stats.value[1].growth = (data.clientsGrowth as number) || 0

    stats.value[2].value = `${(data.pendingOrders as number) || 0}`
    stats.value[2].growth = (data.ordersGrowth as number) || 0

    stats.value[3].value = `${(data.conversionRate as number) || 0}%`
    stats.value[3].growth = (data.conversionGrowth as number) || 0

    // Update Top Client
    if (data.topClient) {
      topClient.value = data.topClient as { name: string; avatar: string; purchases: number }
    }

    // Update Charts
    if (data.salesByCategory) {
      topProductData.value = {
        labels: Object.keys(data.salesByCategory),
        datasets: [
          {
            label: 'Ventas',
            backgroundColor: ['#7000FF', '#00C2FF', '#FF00C7', '#ffffff'],
            borderRadius: 6,
            data: Object.values(data.salesByCategory) as number[],
          },
        ],
      }
    }

    if (data.forumActivity) {
      topForumData.value = {
        labels: Object.keys(data.forumActivity),
        datasets: [
          {
            backgroundColor: ['#7000FF', '#00C2FF', '#FF00C7'],
            borderColor: 'transparent',
            data: Object.values(data.forumActivity) as number[],
          },
        ],
      }
    }
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  }
}

const promoForm = ref({
  title: '',
  description: '',
  discount: 0,
  code: '',
  startDate: '',
  endDate: '', // Added fields as per real Promotion entity usually
})

const createPromotion = async () => {
  try {
    await PromotionService.create({
      name: promoForm.value.title,
      description: promoForm.value.description,
      discount: promoForm.value.discount,
      code: promoForm.value.code,
      startDate: promoForm.value.startDate,
      endDate: promoForm.value.endDate,
      active: true,
      status: 'active',
    } as Omit<Promotion, 'id'>)
    alert(`Promoción "${promoForm.value.title}" enviada!`)
    promoForm.value = {
      title: '',
      description: '',
      discount: 0,
      code: '',
      startDate: '',
      endDate: '',
    }
  } catch (error) {
    console.error('Error creating promotion:', error)
    alert('Error al crear la promoción')
  }
}

onMounted(() => {
  fetchDashboardStats()
})

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#9CA3AF' } },
  },
  scales: {
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#9CA3AF' },
    },
    x: {
      grid: { display: false },
      ticks: { color: '#9CA3AF' },
    },
  },
}

const chartOptions = { ...chartDefaults }

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' as const, labels: { color: '#9CA3AF' } },
  },
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
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
