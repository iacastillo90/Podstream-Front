<template>
  <div
    class="min-h-screen flex items-center justify-center bg-brand-dark relative overflow-hidden font-sans selection:bg-brand-purple selection:text-white"
  >
    <!-- Background Grid Pattern -->
    <div
      class="absolute inset-0 z-0 opacity-20 pointer-events-none"
      style="
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 50px 50px;
      "
    ></div>

    <!-- 3D Luminosity / Glows -->
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none animate-float"
      style="animation-delay: 0s; animation-duration: 8s"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none animate-float"
      style="animation-delay: -4s; animation-duration: 10s"
    ></div>

    <!-- Vignette / Radial Overlay -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0B0C15_120%)] pointer-events-none z-0"
    ></div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-md p-4">
      <GlassCard class="p-8 w-full relative overflow-hidden group">
        <!-- Decorational Glow inside card -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-brand-purple/20 blur-[60px]"></div>
        <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-blue/20 blur-[60px]"></div>

        <h2 class="text-3xl font-bold font-heading text-center mb-2 text-white">Bienvenido</h2>
        <p class="text-center text-gray-400 text-sm mb-8">Inicia sesión en tu cuenta profesional</p>

        <form class="space-y-6" @submit.prevent="login">
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1"
              >Email</label
            >
            <div class="relative group/input">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i
                  class="fas fa-envelope text-gray-500 group-focus-within/input:text-brand-blue transition-colors"
                ></i>
              </div>
              <input
                v-model="email"
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
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all placeholder-gray-600"
                required
              />
            </div>
          </div>

          <div class="flex items-center justify-between text-xs">
            <label
              class="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-white transition-colors"
            >
              <input
                type="checkbox"
                class="rounded bg-white/10 border-white/10 text-brand-purple focus:ring-brand-purple"
              />
              <span>Recordarme</span>
            </label>
            <a href="#" class="text-brand-blue hover:text-brand-purple transition-colors"
              >¿Olvidaste tu contraseña?</a
            >
          </div>

          <!-- Role Selection -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Rol</label>
            <select
              v-model="selectedRole"
              class="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            >
              <option value="CLIENT">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
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
              <span>Iniciando sesión...</span>
            </span>
            <span v-else>Iniciar Sesión</span>
          </AnimatedButton>
        </form>

        <div class="mt-8 pt-6 border-t border-white/5 text-center text-sm text-gray-400">
          ¿Aún no tienes cuenta?
          <router-link
            to="/register"
            class="text-brand-blue font-bold hover:text-white transition-colors ml-1 relative group/link"
          >
            Regístrate
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue group-hover/link:w-full transition-all"
            ></span>
          </router-link>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const email = ref('')
const password = ref('')
const selectedRole = ref<'CLIENT' | 'ADMIN'>('CLIENT')
const isLoading = ref(false)
const errorMessage = ref('')

const login = async () => {
  // Clear previous errors
  errorMessage.value = ''

  try {
    isLoading.value = true

    // Call store action
    await authStore.login({
      username: email.value,
      password: password.value,
    })

    const user = authStore.user

    console.log('Login successful:', user)
    uiStore.showToast(`Bienvenido de nuevo, ${user?.name || ''}`, 'success')

    // Redirect to dashboard (or based on role eventually)
    router.push('/dashboard')
  } catch (error: unknown) {
    console.error('Login error:', error)

    // Handle specific error messages from backend
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string }; status?: number } }
      if (axiosError.response?.data?.message) {
        errorMessage.value = axiosError.response.data.message
      } else if (axiosError.response?.status === 401) {
        errorMessage.value = 'Email o contraseña incorrectos'
      } else if (axiosError.response?.status === 403) {
        errorMessage.value = 'Acceso denegado'
      } else {
        errorMessage.value = 'Error al iniciar sesión. Por favor intenta nuevamente'
      }
    } else {
      errorMessage.value = 'Error al iniciar sesión. Por favor intenta nuevamente'
    }
    uiStore.showToast(errorMessage.value, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
