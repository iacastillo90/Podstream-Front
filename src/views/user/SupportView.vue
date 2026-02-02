<template>
  <div class="min-h-screen bg-black">
    <!-- Contenido Principal -->
    <main class="pt-16 min-h-screen">
      <div class="p-6 flex justify-center">
        <div class="bg-gray-800 rounded-lg p-8 w-full max-w-3xl shadow-lg">
          <h1 class="text-3xl font-bold text-white mb-6">Soporte al Cliente</h1>
          <p class="text-gray-300 mb-8">
            ¿Tienes alguna pregunta o problema? Completa el formulario a continuación y nuestro
            equipo de soporte se pondrá en contacto contigo lo antes posible.
          </p>

          <!-- Mensaje de Confirmación -->
          <div
            v-if="formSubmitted"
            class="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-6"
          >
            ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
          </div>

          <!-- Formulario de Contacto -->
          <form class="space-y-6" @submit.prevent="submitForm">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Título del Problema</label
              >
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Ej: Problema con el pago..."
                class="w-full bg-gray-900 text-white border-none rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Prioridad</label>
              <select
                v-model="form.severity"
                class="w-full bg-gray-900 text-white border-none rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 cursor-pointer"
              >
                <option value="LOW">Baja (Consultas generales)</option>
                <option value="MEDIUM">Media (Problemas funcionales)</option>
                <option value="HIGH">Alta (Pagos, acceso o errores críticos)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Descripción Detallada</label
              >
              <textarea
                v-model="form.description"
                required
                placeholder="Describe qué pasó, pasos para reproducir, etc."
                class="w-full bg-gray-900 text-white border-none rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 h-32 resize-none"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isLoading"
                class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 !rounded-button hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Creando...' : 'Crear Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TicketService } from '@/services/ticketService'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const form = reactive({
  title: '',
  description: '',
  severity: 'MEDIUM',
})

const formSubmitted = ref(false)
const isLoading = ref(false)

const submitForm = async () => {
  isLoading.value = true
  try {
    await TicketService.create({
      title: form.title,
      description: form.description,
      severity: form.severity,
      source: 'Application',
    })

    formSubmitted.value = true
    uiStore.showToast('Ticket creado correctamente', 'success')

    // Reset form
    form.title = ''
    form.description = ''
    form.severity = 'MEDIUM'

    setTimeout(() => {
      formSubmitted.value = false
    }, 5000)
  } catch (error) {
    console.error('Error creating ticket:', error)
    uiStore.showToast('Error al crear ticket', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.rounded-button {
  border-radius: 9999px;
}
.logo {
  height: 8rem;
  width: auto;
  object-fit: contain;
}
</style>
