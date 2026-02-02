<template>
  <div class="space-y-8 animate-fade-in-up pb-20">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl font-bold font-heading mb-2">Monitor y Soporte</h1>
        <p class="text-gray-400">Gestiona los tickets de soporte y alertas de monitoreo.</p>
      </div>
      <div>
        <span class="text-2xl font-bold text-white">{{ tickets.length }}</span>
        <span class="text-gray-500 text-sm ml-2">Tickets Totales</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 overflow-x-auto pb-2">
      <button
        class="px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap"
        :class="
          filterStatus === 'ALL'
            ? 'bg-white text-black'
            : 'bg-white/5 text-gray-400 hover:text-white'
        "
        @click="filterStatus = 'ALL'"
      >
        Todos
      </button>
      <button
        class="px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap"
        :class="
          filterStatus === 'OPEN'
            ? 'bg-blue-500 text-white'
            : 'bg-white/5 text-gray-400 hover:text-white'
        "
        @click="filterStatus = 'OPEN'"
      >
        Abiertos
      </button>
      <button
        class="px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap"
        :class="
          filterStatus === 'IN_PROGRESS'
            ? 'bg-yellow-500 text-black'
            : 'bg-white/5 text-gray-400 hover:text-white'
        "
        @click="filterStatus = 'IN_PROGRESS'"
      >
        En Progreso
      </button>
      <button
        class="px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap"
        :class="
          filterStatus === 'CLOSED'
            ? 'bg-green-500 text-white'
            : 'bg-white/5 text-gray-400 hover:text-white'
        "
        @click="filterStatus = 'CLOSED'"
      >
        Cerrados
      </button>
    </div>

    <!-- Tickets List -->
    <div class="space-y-4">
      <GlassCard
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        class="p-6 transition-all hover:bg-white/5 group border-l-4"
        :class="{
          'border-l-blue-500': ticket.status === 'OPEN',
          'border-l-yellow-500': ticket.status === 'IN_PROGRESS',
          'border-l-green-500': ticket.status === 'CLOSED',
          'border-l-gray-500': ticket.status === 'PENDING',
        }"
      >
        <div class="flex flex-col md:flex-row justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300"
                >#{{ ticket.id }}</span
              >
              <span
                class="text-xs font-bold px-2 py-0.5 rounded"
                :class="getTypeColor(ticket.type)"
                >{{ ticket.type }}</span
              >
              <span class="text-xs text-gray-500">{{
                ticket.createdAt || 'Fecha desconocida'
              }}</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">{{ ticket.subject }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ ticket.message }}</p>

            <div v-if="ticket.priority" class="flex items-center gap-4">
              <span class="text-xs font-bold uppercase text-gray-500">Prioridad:</span>
              <span class="text-xs font-bold" :class="getPriorityColor(ticket.priority)">{{
                ticket.priority
              }}</span>
            </div>
          </div>

          <div class="flex flex-row md:flex-col justify-between items-end gap-3 min-w-[140px]">
            <div class="text-right">
              <span class="block text-xs text-gray-500 uppercase font-bold mb-1">Estado</span>
              <select
                :value="ticket.status"
                class="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-white/30 cursor-pointer"
                @change="updateStatus(ticket.id!, ($event.target as HTMLSelectElement).value)"
              >
                <option value="OPEN">Abierto</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="CLOSED">Cerrado</option>
              </select>
            </div>

            <button
              class="text-gray-500 hover:text-red-500 transition-colors p-2"
              title="Eliminar ticket"
              @click="deleteTicket(ticket.id!)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </GlassCard>

      <div v-if="filteredTickets.length === 0" class="text-center py-12 text-gray-500">
        No hay tickets que coincidan con el filtro.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TicketService } from '@/services/ticketService'
import type { SupportTicket } from '@/types'
import GlassCard from '@/components/ui/GlassCard.vue'

const tickets = ref<SupportTicket[]>([])
const filterStatus = ref('ALL')
const isLoading = ref(false)

onMounted(() => {
  fetchTickets()
})

const fetchTickets = async () => {
  isLoading.value = true
  try {
    const response = await TicketService.getAll()
    // Handle unwrapped response from interceptor
    if (Array.isArray(response)) {
      tickets.value = response
    } else {
      // Fallback in case of wrapped response
      tickets.value = (response as { data: SupportTicket[] }).data || []
    }
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (id: number | string, newStatus: string) => {
  try {
    await TicketService.updateStatus(id, newStatus)
    // Optimistic update
    const index = tickets.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tickets.value[index].status = newStatus as SupportTicket['status']
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Error updating status')
    fetchTickets() // Revert/Refresh
  }
}

const deleteTicket = async (id: number | string) => {
  if (!confirm('¿Eliminar este ticket permanentemente?')) return
  try {
    await TicketService.delete(id)
    tickets.value = tickets.value.filter((t) => t.id !== id)
  } catch (error) {
    console.error('Error deleting ticket:', error)
  }
}

const filteredTickets = computed(() => {
  if (filterStatus.value === 'ALL') return tickets.value
  return tickets.value.filter((t) => t.status === filterStatus.value)
})

const getTypeColor = (type: string) => {
  return type === 'MONITORING' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'text-red-500'
    case 'MEDIUM':
      return 'text-yellow-500'
    case 'LOW':
      return 'text-green-500'
    default:
      return 'text-gray-400'
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
