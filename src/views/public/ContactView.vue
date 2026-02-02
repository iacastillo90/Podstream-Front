<template>
  <div class="space-y-12 animate-fade-in-up pb-12">
    <!-- Hero Section -->
    <div class="relative h-[300px] md:h-[400px] overflow-hidden group">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop"
          class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          alt="Contact PodStream"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-brand-dark/30 via-brand-dark/60 to-brand-dark"
        ></div>
      </div>

      <!-- Hero Content -->
      <div class="relative h-full flex flex-col justify-center items-center text-center px-4">
        <h1 class="text-5xl md:text-6xl font-bold font-heading mb-4 text-white drop-shadow-lg">
          Contáctanos
        </h1>
        <p class="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed drop-shadow-md">
          ¿Tienes dudas o sugerencias? Estamos a un clic de distancia.
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Left Col: Contact Form -->
        <GlassCard class="p-8 h-full">
          <h2 class="text-2xl font-bold font-heading text-white mb-2">Envíanos un mensaje</h2>
          <p class="text-gray-400 mb-8 text-sm">Responderemos lo antes posible.</p>

          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-gray-400 text-sm mb-2">Nombre completo</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white placeholder-gray-600"
                  :class="{ '!border-red-500': errors.name }"
                  placeholder="Tu nombre"
                />
                <span v-if="errors.name" class="text-red-500 text-xs mt-1 block">{{
                  errors.name
                }}</span>
              </div>
              <div>
                <label class="block text-gray-400 text-sm mb-2">Correo electrónico</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white placeholder-gray-600"
                  :class="{ '!border-red-500': errors.email }"
                  placeholder="tu@email.com"
                />
                <span v-if="errors.email" class="text-red-500 text-xs mt-1 block">{{
                  errors.email
                }}</span>
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Asunto</label>
              <input
                v-model="form.subject"
                type="text"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white placeholder-gray-600"
                :class="{ '!border-red-500': errors.subject }"
                placeholder="Asunto de tu mensaje"
              />
              <span v-if="errors.subject" class="text-red-500 text-xs mt-1 block">{{
                errors.subject
              }}</span>
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Mensaje</label>
              <textarea
                v-model="form.message"
                rows="6"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white placeholder-gray-600 resize-none"
                :class="{ '!border-red-500': errors.message }"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
              <span v-if="errors.message" class="text-red-500 text-xs mt-1 block">{{
                errors.message
              }}</span>
            </div>

            <div class="flex justify-end pt-4">
              <AnimatedButton
                type="submit"
                :disabled="isSubmitting"
                class="!px-10 !py-3 w-full md:w-auto text-center justify-center"
              >
                {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
              </AnimatedButton>
            </div>
          </form>
        </GlassCard>

        <!-- Right Col: Info & Map -->
        <div class="space-y-8">
          <!-- Info Card (Reduced padding on mobile/small screens to fit email) -->
          <GlassCard class="p-6 md:p-8">
            <h2 class="text-2xl font-bold font-heading text-white mb-6">Información de Contacto</h2>
            <div class="grid sm:grid-cols-2 gap-6">
              <div class="flex items-start space-x-3 group">
                <div
                  class="w-10 h-10 shrink-0 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors"
                >
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold mb-1">Dirección</h3>
                  <p class="text-gray-400 text-sm">Esperanza 1294,<br />Santiago, Chile</p>
                </div>
              </div>

              <div class="flex items-start space-x-3 group">
                <div
                  class="w-10 h-10 shrink-0 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors"
                >
                  <i class="fas fa-phone"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold mb-1">Teléfono</h3>
                  <p class="text-gray-400 text-sm">+56 9 3300 4037</p>
                </div>
              </div>

              <div class="flex items-start space-x-3 group">
                <div
                  class="w-10 h-10 shrink-0 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors"
                >
                  <i class="fas fa-envelope"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold mb-1">Email</h3>
                  <p class="text-gray-400 text-sm break-words">podstreamstore@gmail.com</p>
                </div>
              </div>

              <div class="flex items-start space-x-3 group">
                <div
                  class="w-10 h-10 shrink-0 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors"
                >
                  <i class="fas fa-clock"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold mb-1">Horario</h3>
                  <p class="text-gray-400 text-sm">Lun - Dom: 9:00 - 22:00</p>
                </div>
              </div>
            </div>

            <!-- Socials -->
            <div
              class="mt-8 pt-6 border-t border-white/5 flex gap-4 justify-center sm:justify-start"
            >
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-blue transition-all"
              >
                <i class="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-blue transition-all"
              >
                <i class="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-pink transition-all"
              >
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </GlassCard>

          <!-- Map & Extra Image Grid (Square Cards) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[350px] md:h-auto md:aspect-[2/1]">
            <!-- Map Card (Custom Glass Container for Full Height) -->
            <div
              class="relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-purple/50 group h-full w-full"
            >
              <iframe
                src="https://maps.google.com/maps?q=Podstream%20Store%2C%20Esperanza%201294%2C%20Santiago%2C%20Chile&z=15&output=embed"
                width="100%"
                height="100%"
                style="border: 0"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                class="absolute inset-0 w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>

            <!-- Filler Image Card -->
            <div class="rounded-2xl overflow-hidden relative group h-full border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2670&auto=format&fit=crop"
                alt="Creative Studio"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent flex items-end p-6"
              >
                <div>
                  <p class="text-brand-purple font-bold text-sm tracking-widest uppercase mb-1">
                    Visit Us
                  </p>
                  <h3 class="text-white font-heading font-bold text-lg">Tu espacio creativo</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 flex items-center justify-center z-[60] px-4"
      >
        <div
          class="absolute inset-0 bg-black/80 backdrop-blur-sm"
          @click="showSuccessModal = false"
        ></div>
        <GlassCard class="relative max-w-md w-full p-8 text-center border-brand-green/30">
          <div
            class="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-3xl mx-auto mb-6"
          >
            <i class="fas fa-check"></i>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">¡Mensaje enviado!</h3>
          <p class="text-gray-300 mb-8 leading-relaxed">
            Gracias por contactarnos. Nuestro equipo revisará tu mensaje y te responderá lo antes
            posible.
          </p>
          <AnimatedButton class="w-full justify-center" @click="showSuccessModal = false">
            Cerrar
          </AnimatedButton>
        </GlassCard>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { ContactService } from '@/services/api'
import type { ContactMessage } from '@/types'

const isSubmitting = ref(false)
const showSuccessModal = ref(false)

const form = reactive<Omit<ContactMessage, 'id' | 'read' | 'createdAt'>>({
  name: '',
  email: '',
  subject: '',
  message: '',
})

interface Errors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const errors = ref<Errors>({})

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.name.trim()) {
    errors.value.name = 'El nombre es requerido'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.value.email = 'El email es requerido'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.value.email = 'Por favor, introduce un email válido'
    isValid = false
  }

  if (!form.subject.trim()) {
    errors.value.subject = 'El asunto es requerido'
    isValid = false
  }

  if (!form.message.trim()) {
    errors.value.message = 'El mensaje es requerido'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const data = {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    }
    await ContactService.sendMessage(data)

    showSuccessModal.value = true
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
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
