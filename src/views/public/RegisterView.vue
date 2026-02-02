<template>
  <GlassCard class="p-8 w-full max-w-md mx-auto relative overflow-hidden group">
    <!-- Decorational Glow -->
    <div class="absolute -top-10 -right-10 w-32 h-32 bg-brand-purple/20 blur-[60px]"></div>
    <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-blue/20 blur-[60px]"></div>

    <h2 class="text-3xl font-bold font-heading text-center mb-2 text-white">Crear Cuenta</h2>
    <p class="text-center text-gray-400 text-sm mb-8">Únete a la comunidad de PodStream</p>

    <form class="space-y-4" @submit.prevent="register">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
            >Nombre</label
          >
          <input
            v-model="form.firstName"
            type="text"
            placeholder="Juan"
            class="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all placeholder-gray-600"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
            >Apellido</label
          >
          <input
            v-model="form.lastName"
            type="text"
            placeholder="Pérez"
            class="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all placeholder-gray-600"
            required
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
        <div class="relative group/input">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i
              class="fas fa-envelope text-gray-500 group-focus-within/input:text-brand-blue transition-colors"
            ></i>
          </div>
          <input
            v-model="form.email"
            type="email"
            placeholder="tu@email.com"
            class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all placeholder-gray-600"
            required
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
          >Contraseña</label
        >
        <div class="relative group/input">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i
              class="fas fa-lock text-gray-500 group-focus-within/input:text-brand-purple transition-colors"
            ></i>
          </div>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all placeholder-gray-600"
            required
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
          >Confirmar Contraseña</label
        >
        <div class="relative group/input">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i
              class="fas fa-lock text-gray-500 group-focus-within/input:text-brand-purple transition-colors"
            ></i>
          </div>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all placeholder-gray-600"
            required
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">País</label>
        <div class="relative group/input">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i
              class="fas fa-globe text-gray-500 group-focus-within/input:text-brand-blue transition-colors"
            ></i>
          </div>
          <input
            v-model="form.country"
            type="text"
            placeholder="Argentina"
            class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all placeholder-gray-600"
            required
          />
        </div>
      </div>

      <div class="flex items-start space-x-2 text-xs">
        <input
          v-model="form.acceptTerms"
          type="checkbox"
          class="rounded bg-white/10 border-white/10 text-brand-purple focus:ring-brand-purple mt-0.5"
          required
        />
        <label class="text-gray-400">
          Acepto los
          <a href="#" class="text-brand-blue hover:text-brand-purple transition-colors"
            >Términos y Condiciones</a
          >
          y la
          <a href="#" class="text-brand-blue hover:text-brand-purple transition-colors"
            >Política de Privacidad</a
          >
        </label>
      </div>

      <!-- Error Message Display -->
      <div
        v-if="errorMessage"
        class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm flex items-start space-x-2"
      >
        <i class="fas fa-exclamation-circle mt-0.5"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <AnimatedButton
        type="submit"
        :disabled="isLoading"
        class="w-full justify-center !py-3 shadow-[0_0_20px_rgba(112,0,255,0.2)] hover:shadow-[0_0_30px_rgba(112,0,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading" class="flex items-center space-x-2">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Registrando...</span>
        </span>
        <span v-else>Crear Cuenta</span>
      </AnimatedButton>
    </form>

    <div class="mt-8 pt-6 border-t border-white/5 text-center text-sm text-gray-400">
      ¿Ya tienes cuenta?
      <router-link
        to="/login"
        class="text-brand-blue font-bold hover:text-white transition-colors ml-1 relative group/link"
      >
        Inicia Sesión
        <span
          class="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue group-hover/link:w-full transition-all"
        ></span>
      </router-link>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import type { RegisterRequest } from '@/types'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  country: 'Argentina', // Default country
  acceptTerms: false,
})

const register = async () => {
  // Clear previous errors
  errorMessage.value = ''

  // Validate passwords match
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  // Validate password strength (optional)
  if (form.password.length < 8) {
    errorMessage.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  // Validate terms acceptance
  if (!form.acceptTerms) {
    errorMessage.value = 'Debes aceptar los términos y condiciones'
    return
  }

  try {
    isLoading.value = true

    // Prepare user data for registration
    const userData: RegisterRequest = {
      username: form.email,
      email: form.email,
      password: form.password,
      firstname: form.firstName,
      lastname: form.lastName,
      country: form.country,
    }

    // Call store action
    await authStore.register(userData)

    const user = authStore.user
    console.log('Registration successful:', user)

    // Show success message
    uiStore.showToast('¡Registro exitoso! Bienvenido a PodStream', 'success')

    // Redirect directly to dashboard
    router.push('/dashboard')
  } catch (error: unknown) {
    console.error('Registration error:', error)

    // Handle specific error messages from backend
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string }; status?: number } }
      if (axiosError.response?.data?.message) {
        errorMessage.value = axiosError.response.data.message
      } else if (axiosError.response?.status === 409) {
        errorMessage.value = 'Este email ya está registrado'
      } else if (axiosError.response?.status === 400) {
        errorMessage.value = 'Datos inválidos. Por favor verifica la información'
      } else {
        errorMessage.value = 'Error al registrar usuario. Por favor intenta nuevamente'
      }
      uiStore.showToast(errorMessage.value, 'error')
    } else {
      errorMessage.value = 'Error al registrar usuario. Por favor intenta nuevamente'
      uiStore.showToast(errorMessage.value, 'error')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
