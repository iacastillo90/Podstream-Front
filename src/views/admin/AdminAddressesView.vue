<template>
  <div class="space-y-8 animate-fade-in-up pb-20">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl font-bold font-heading mb-2">Auditoría de Direcciones</h1>
        <p class="text-gray-400">Listado global de direcciones registradas por usuarios.</p>
      </div>
      <div>
        <span class="text-2xl font-bold text-white">{{ addresses.length }}</span>
        <span class="text-gray-500 text-sm ml-2">Direcciones</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-4">
      <div class="relative group/input flex-1 max-w-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-500"></i>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por calle, ciudad o país..."
          class="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-brand-purple text-sm"
        />
      </div>
    </div>

    <!-- Addresses Table -->
    <GlassCard class="overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5 border-b border-white/10">
            <tr>
              <th
                class="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Cliente
              </th>
              <th
                class="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Dirección Completa
              </th>
              <th
                class="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell"
              >
                Detalles
              </th>
              <th
                class="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden xl:table-cell"
              >
                Ciudad
              </th>
              <th
                class="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Principal
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="addr in filteredAddresses"
              :key="addr.id"
              class="hover:bg-white/5 transition-colors"
            >
              <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                #{{ addr.id }}
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-white font-medium">{{ addr.userName || 'N/A' }}</div>
                <div class="text-xs text-gray-500">
                  ID: {{ addr.userId || addr.clientId || 'N/A' }}
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-white font-medium">
                  {{ addr.street }} {{ addr.number }}
                </div>
                <div class="text-xs text-gray-400">{{ addr.zipCode }} - {{ addr.city }}</div>
              </td>
              <td class="px-4 py-4 hidden lg:table-cell">
                <div class="text-xs text-gray-300 space-y-1">
                  <div v-if="addr.apartment">
                    <span class="text-gray-500">Apto:</span> {{ addr.apartment }}
                  </div>
                  <div v-if="addr.floor">
                    <span class="text-gray-500">Piso:</span> {{ addr.floor }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 hidden xl:table-cell">
                <div class="text-sm text-gray-300">{{ addr.city }}</div>
              </td>
              <td class="px-4 py-4 text-center">
                <span
                  class="inline-block px-2 py-0.5 rounded-full text-xs font-bold border"
                  :class="getStatusClass(addr.status)"
                >
                  {{ getStatusText(addr.status) }}
                </span>
              </td>
              <td class="px-4 py-4 text-center">
                <span
                  v-if="addr.isDefault"
                  class="text-xs font-bold bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded"
                  >SI</span
                >
                <span v-else class="text-xs text-gray-600">NO</span>
              </td>
            </tr>
            <tr v-if="filteredAddresses.length === 0" class="text-center text-gray-400">
              <td colspan="7" class="py-8">No se encontraron direcciones.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AddressService } from '@/services/addressService'
import type { Address } from '@/types'
import GlassCard from '@/components/ui/GlassCard.vue'

// Extend Address type locally to include fields used in template but not in core type
interface AdminAddress extends Address {
  userName?: string
  number?: string
  apartment?: string
  floor?: string
  status?: string | boolean | number
  clientId?: number // Add missing property to interface
}

const addresses = ref<AdminAddress[]>([])
const searchQuery = ref('')
const isLoading = ref(false)

onMounted(() => {
  fetchAddresses()
})

const fetchAddresses = async () => {
  isLoading.value = true
  try {
    const response = await AddressService.getAllAdmin()
    // Handle unwrapped response
    const rawData = Array.isArray(response) ? response : (response as { data: any[] }).data || []

    addresses.value = rawData.map((addr: unknown) => {
      const a = addr as AdminAddress & { clientId?: number }
      return {
        ...a,
        userId: a.userId || a.clientId || 0,
        status: a.status || 'active',
      }
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredAddresses = computed(() => {
  if (!searchQuery.value) return addresses.value
  const q = searchQuery.value.toLowerCase()
  return addresses.value.filter(
    (a) =>
      a.street.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      (a.userName && a.userName.toLowerCase().includes(q)) ||
      (a.apartment && a.apartment.toLowerCase().includes(q)),
  )
})

// Helper functions for status display
const getStatusClass = (status: string | boolean | number | undefined) => {
  // Status can be boolean (true/false) or string
  const isActive = status === true || status === 1 || status === '1' || status === 'active'

  return isActive
    ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

const getStatusText = (status: string | boolean | number | undefined) => {
  const isActive = status === true || status === 1 || status === '1' || status === 'active'
  return isActive ? 'Activa' : 'Inactiva'
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
