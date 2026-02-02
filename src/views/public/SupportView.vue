<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Hero / Header -->
    <div class="relative rounded-2xl overflow-hidden h-64 border border-white/10 group">
      <div class="absolute inset-0">
        <img
          src="https://public.readdy.ai/ai/img_res/29871629854744040f7b9c9f4d76f809.jpg"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60"
          alt="Support Hero"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"
        ></div>
      </div>
      <div class="relative z-10 p-8 h-full flex flex-col justify-center">
        <h1 class="text-4xl font-bold font-heading mb-2">Soporte al Cliente</h1>
        <p class="text-gray-300 max-w-xl">
          Estamos aquí para ayudarte. Contáctanos si tienes dudas o problemas.
        </p>
      </div>
    </div>

    <!-- Contact Form Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <GlassCard class="p-8">
          <h2 class="text-2xl font-bold font-heading mb-6">Envíanos un mensaje</h2>

          <!-- Mensaje de Confirmación -->
          <div
            v-if="formSubmitted"
            class="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6 flex items-center gap-3"
          >
            <i class="fas fa-check-circle"></i>
            ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
          </div>

          <form class="space-y-6" @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Asunto</label>
              <input
                v-model="form.subject"
                type="text"
                required
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
              <textarea
                v-model="form.message"
                required
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all h-32 resize-none"
                placeholder="Describe tu problema o consulta..."
              ></textarea>
            </div>

            <div class="flex justify-end">
              <AnimatedButton type="submit" :disabled="isLoading" class="px-8">
                <span v-if="!isLoading">Enviar Mensaje</span>
                <span v-else><i class="fas fa-spinner fa-spin"></i> Enviando...</span>
              </AnimatedButton>
            </div>
          </form>
        </GlassCard>
      </div>

      <!-- FAQ / Info Side -->
      <div class="space-y-6">
        <GlassCard class="p-6">
          <h3 class="text-xl font-bold font-heading mb-4 flex items-center gap-2">
            <i class="fas fa-envelope text-brand-blue"></i> Contacto Directo
          </h3>
          <p class="text-gray-400 text-sm mb-4">
            También puedes escribirnos directamente a nuestro correo de soporte.
          </p>
          <a
            href="mailto:support@podstream.com"
            class="text-brand-purple hover:text-white transition-colors font-bold block mb-4"
          >
            support@podstream.com
          </a>

          <h3 class="text-xl font-bold font-heading mb-4 flex items-center gap-2 mt-8">
            <i class="fas fa-clock text-brand-pink"></i> Horario de Atención
          </h3>
          <p class="text-gray-400 text-sm">
            Lunes a Viernes<br />
            9:00 AM - 6:00 PM EST
          </p>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ContactService } from '@/services/api' // Assuming this exists from references
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

// Basic toast mock if not using store or use a library
// const showToast = (msg: string) => {
//   // logic to show toast
// }

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const formSubmitted = ref(false)
const isLoading = ref(false)

const submitForm = async () => {
  isLoading.value = true
  try {
    // Call backend API
    if (ContactService && ContactService.sendMessage) {
      await ContactService.sendMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })
    } else {
      // Fallback simulation
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    formSubmitted.value = true

    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''

    setTimeout(() => {
      formSubmitted.value = false
    }, 5000)
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isLoading.value = false
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
