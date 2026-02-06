<template>
  <div class="space-y-8 animate-fade-in-up">
    <h1 class="text-3xl md:text-4xl font-bold font-heading mb-6">Información Personal</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Summary Card -->
      <div class="lg:col-span-1">
        <GlassCard class="p-8 flex flex-col items-center text-center sticky top-8">
          <div
            class="relative w-40 h-40 rounded-full overflow-hidden border-4 border-brand-purple/30 mb-6"
          >
            <img :src="defaultProfileImage" alt="Profile" class="w-full h-full object-cover" />
          </div>

          <h2 class="text-2xl font-bold text-white mb-2">
            {{ profile.firstname }} {{ profile.lastname }}
          </h2>
          <p class="text-brand-purple font-medium mb-6">
            {{ profile.role === 'ADMIN' ? 'Administrador' : 'Usuario PodStream' }}
          </p>

          <div class="w-full space-y-4 text-left p-4 bg-white/5 rounded-xl border border-white/5">
            <div class="flex items-center gap-3 text-gray-300">
              <Icon icon="mdi:email" class="text-brand-blue w-5 text-center" />
              <span class="text-sm truncate" :title="profile.email">{{ profile.email }}</span>
            </div>
            <div class="flex items-center gap-3 text-gray-300">
              <Icon icon="mdi:phone" class="text-brand-blue w-5 text-center" />
              <span class="text-sm">{{ profile.phone || 'Sin teléfono' }}</span>
            </div>
            <div class="flex items-center gap-3 text-gray-300">
              <Icon icon="mdi:map-marker" class="text-brand-blue w-5 text-center" />
              <span class="text-sm">{{ profile.country || 'País no definido' }}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <!-- Main Info & Forms -->
      <div class="lg:col-span-2 space-y-6">
        <GlassCard class="p-6">
          <!-- Tabs -->
          <div class="flex space-x-1 border-b border-white/10 mb-8 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap"
              :class="activeTab === tab.id ? 'text-brand-purple' : 'text-gray-400 hover:text-white'"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
              <div
                v-if="activeTab === tab.id"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-purple"
              ></div>
            </button>
          </div>

          <!-- Personal Details Tab -->
          <div v-if="activeTab === 'personalDetails'">
            <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="saveProfile">
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Nombre *</label>
                <input
                  v-model="profileForm.firstname"
                  type="text"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Apellido *</label>
                <input
                  v-model="profileForm.lastname"
                  type="text"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Segundo Nombre</label>
                <input
                  v-model="profileForm.secondName"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Email *</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Teléfono</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  placeholder="+56912345678"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">País *</label>
                <input
                  v-model="profileForm.country"
                  type="text"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>

              <div class="col-span-1 md:col-span-2 pt-6 flex justify-end gap-4">
                <AnimatedButton type="button" variant="secondary" @click="loadProfile">
                  Cancelar
                </AnimatedButton>
                <AnimatedButton type="submit" variant="primary" :disabled="isSaving">
                  {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
                </AnimatedButton>
              </div>
            </form>
          </div>

          <!-- Change Password Tab -->
          <div v-if="activeTab === 'changePassword'" class="max-w-md mx-auto py-4 space-y-6">
            <form @submit.prevent="handleChangePassword">
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Contraseña Actual *</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Nueva Contraseña *</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="8"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
                <p class="text-xs text-gray-500">Mínimo 8 caracteres</p>
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-400">Confirmar Contraseña *</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <AnimatedButton class="w-full justify-center mt-6" type="submit" :disabled="isSaving">
                {{ isSaving ? 'Actualizando...' : 'Actualizar Contraseña' }}
              </AnimatedButton>
            </form>
          </div>

          <!-- Addresses Tab -->
          <div v-if="activeTab === 'addresses'">
            <div class="mb-6 flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">Mis Direcciones</h3>
              <AnimatedButton variant="primary" @click="showAddressForm = true">
                <Icon icon="mdi:plus" class="mr-2" /> Nueva Dirección
              </AnimatedButton>
            </div>

            <!-- Address List -->
            <div v-if="addresses.length > 0" class="space-y-4">
              <GlassCard
                v-for="address in addresses"
                :key="address.id"
                class="p-4 flex justify-between items-start"
              >
                <div class="flex-1">
                  <p class="text-white font-medium">
                    {{ address.street }}
                  </p>
                  <p class="text-gray-400 text-sm">
                    {{ address.city }}, {{ address.state }}, {{ address.zipCode }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    class="text-brand-blue hover:text-brand-purple transition-colors"
                    @click="editAddress(address)"
                  >
                    <Icon icon="mdi:pencil" />
                  </button>
                  <button
                    class="text-red-400 hover:text-red-500 transition-colors"
                    @click="deleteAddress(address.id!)"
                  >
                    <Icon icon="mdi:delete" />
                  </button>
                </div>
              </GlassCard>
            </div>
            <div v-else class="text-center py-12 text-gray-500">
              <Icon icon="mdi:map-marker-off" class="text-6xl mb-4 mx-auto opacity-50" />
              <p>No tienes direcciones registradas</p>
            </div>
          </div>

          <!-- Delete Account Zone -->
          <div v-if="activeTab === 'privacyPolicy'" class="text-center py-8">
            <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-lg mx-auto">
              <h3 class="text-red-400 font-bold text-lg mb-2">Zona de Peligro</h3>
              <p class="text-gray-400 text-sm mb-6">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
              </p>
              <button
                class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                @click="confirmDeleteAccount"
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-sm"
        @click="showDeleteModal = false"
      ></div>
      <GlassCard
        class="relative max-w-md w-full p-8 text-center border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
      >
        <Icon icon="mdi:alert-circle" class="text-4xl text-red-500 mb-4 mx-auto" />
        <h3 class="text-2xl font-bold text-white mb-2">¿Estás seguro?</h3>
        <p class="text-gray-300 mb-8">
          Esta acción desactivará tu cuenta. No podrás acceder hasta que un administrador la
          reactive.
        </p>
        <div class="flex gap-4 justify-center">
          <button
            class="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            @click="showDeleteModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            @click="handleDeleteAccount"
          >
            Sí, eliminar
          </button>
        </div>
      </GlassCard>
    </div>

    <!-- Address Form Modal -->
    <div
      v-if="showAddressForm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      @click.self="cancelAddressForm"
    >
      <GlassCard class="relative max-w-3xl w-full p-8 animate-scale-in shadow-2xl">
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
          @click="cancelAddressForm"
        >
          <Icon icon="mdi:close" class="text-gray-400 group-hover:text-white transition-colors" />
        </button>

        <h3 class="text-2xl font-bold text-white mb-6 pr-12">
          {{ editingAddress ? 'Editar Dirección' : 'Nueva Dirección' }}
        </h3>

        <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="saveAddress">
          <div class="space-y-2">
            <label class="text-sm text-gray-400 font-medium">Calle *</label>
            <input
              v-model="addressForm.street"
              type="text"
              required
              placeholder="Ej: Av. Providencia"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-gray-400 font-medium">Número *</label>
            <input
              v-model.number="addressForm.number"
              type="number"
              required
              placeholder="1234"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-gray-400 font-medium">Ciudad *</label>
            <input
              v-model="addressForm.city"
              type="text"
              required
              placeholder="Santiago"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-gray-400 font-medium">Estado/Región *</label>
            <input
              v-model="addressForm.state"
              type="text"
              required
              placeholder="Región Metropolitana"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-gray-400 font-medium">Código Postal *</label>
            <input
              v-model="addressForm.zipCode"
              type="text"
              required
              placeholder="7500000"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-gray-400 font-medium">País *</label>
            <input
              v-model="addressForm.country"
              type="text"
              required
              placeholder="Chile"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
            />
          </div>

          <div
            class="col-span-1 md:col-span-2 pt-6 flex justify-end gap-4 border-t border-white/10"
          >
            <AnimatedButton type="button" variant="secondary" @click="cancelAddressForm">
              <Icon icon="mdi:close" class="mr-2" /> Cancelar
            </AnimatedButton>
            <AnimatedButton type="submit" variant="primary" :disabled="isSaving">
              <Icon icon="mdi:check" class="mr-2" />
              {{ isSaving ? 'Guardando...' : 'Guardar Dirección' }}
            </AnimatedButton>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { AuthService } from '@/services/authService'
import { AddressService } from '@/services/addressService'
import { useUIStore } from '@/stores/ui'
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '@/types/userProfile'
import type { Address } from '@/types' // Canonical Address type

const router = useRouter()
const uiStore = useUIStore()
const activeTab = ref('personalDetails')
const showDeleteModal = ref(false)
const showAddressForm = ref(false)
const isSaving = ref(false)
const editingAddress = ref<Address | null>(null)

const defaultProfileImage = 'https://public.readdy.ai/img_res/e389ba03581e530b389eb5bc810c37e5.jpg'

const tabs = [
  { id: 'personalDetails', name: 'Detalles Personales' },
  { id: 'changePassword', name: 'Seguridad' },
  { id: 'addresses', name: 'Direcciones' },
  { id: 'privacyPolicy', name: 'Privacidad' },
]

const profile = reactive<UserProfile>({
  id: 0,
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  country: '',
  role: 'CLIENT',
  enabled: true,
})

const profileForm = reactive<UpdateProfileRequest>({
  firstname: '',
  lastname: '',
  secondName: '',
  email: '',
  phone: '',
  country: '',
})

const passwordForm = reactive<ChangePasswordRequest>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const addresses = ref<Address[]>([])

// Local form state - simplified to match standard address but flexible for inputs
const addressForm = reactive({
  street: '',
  number: '', // Kept for UI if needed, or merged into street
  city: '',
  state: '',
  zipCode: '',
  country: '',
  isDefault: false,
})

const loadProfile = async () => {
  try {
    const data = await AuthService.me()
    Object.assign(profile, {
      ...data,
      firstname: data.firstName || '',
      lastname: data.lastName || '',
      country: data.country || '',
    })

    // Map backend fields to form (handle both snake_case and camelCase)
    Object.assign(profileForm, {
      firstname: data.firstName || '',
      lastname: data.lastName || '',
      secondName: data.secondName || '',
      email: data.email,
      phone: data.phone || '',
      country: data.country,
    })
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    uiStore.showToast('Error al cargar el perfil', 'error')
  }
}

const loadAddresses = async () => {
  try {
    addresses.value = await AddressService.getMyAddresses()
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    const updated = await AuthService.updateProfile(profileForm)
    Object.assign(profile, {
      ...updated,
      firstname: updated.firstName || '',
      lastname: updated.lastName || '',
      country: updated.country || '',
    })
    uiStore.showToast('Perfil actualizado correctamente', 'success')

    // Reload profile data from backend to ensure we have the latest values
    await loadProfile()
  } catch (error: unknown) {
    console.error('Error updating profile:', error)
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Error al guardar los cambios'
    uiStore.showToast(message, 'error')
  } finally {
    isSaving.value = false
  }
}

const handleChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    uiStore.showToast('Las contraseñas no coinciden', 'error')
    return
  }

  if (passwordForm.newPassword.length < 8) {
    uiStore.showToast('La contraseña debe tener al menos 8 caracteres', 'error')
    return
  }

  isSaving.value = true
  try {
    await AuthService.changePassword(passwordForm)
    uiStore.showToast('Contraseña actualizada correctamente', 'success')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: unknown) {
    console.error('Error changing password:', error)
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Error al cambiar la contraseña'
    uiStore.showToast(message, 'error')
  } finally {
    isSaving.value = false
  }
}

const editAddress = (address: Address) => {
  editingAddress.value = address
  // Map Address to Form
  // Simple mapping: street might contain number
  Object.assign(addressForm, {
    street: address.street,
    number: '', // Can't easily extract without regex, leaving empty or user edits street
    city: address.city,
    state: address.state || '',
    zipCode: address.zipCode,
    country: address.country || '',
    isDefault: address.isDefault,
  })
  showAddressForm.value = true
}

const cancelAddressForm = () => {
  showAddressForm.value = false
  editingAddress.value = null
  Object.assign(addressForm, {
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  })
}

const saveAddress = async () => {
  isSaving.value = true
  try {
    // Construct payload strictly matching Address interface
    const payload: Address = {
      id: editingAddress.value?.id || 0,
      userId: 0, // Backend handles
      street: addressForm.number
        ? `${addressForm.street} ${addressForm.number}`
        : addressForm.street,
      city: addressForm.city,
      state: addressForm.state,
      zipCode: addressForm.zipCode,
      country: addressForm.country,
      isDefault: addressForm.isDefault,
    }

    if (editingAddress.value?.id) {
      await AddressService.updateAddress(editingAddress.value.id, payload)
      uiStore.showToast('Dirección actualizada', 'success')
    } else {
      await AddressService.createAddress(payload)
      uiStore.showToast('Dirección creada', 'success')
    }
    await loadAddresses()
    cancelAddressForm()
  } catch (error) {
    console.error('Error saving address:', error)
    uiStore.showToast('Error al guardar la dirección', 'error')
  } finally {
    isSaving.value = false
  }
}

const deleteAddress = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar esta dirección?')) return

  try {
    await AddressService.deleteAddress(id)
    uiStore.showToast('Dirección eliminada', 'success')
    await loadAddresses()
  } catch (error) {
    console.error('Error deleting address:', error)
    uiStore.showToast('Error al eliminar la dirección', 'error')
  }
}

const confirmDeleteAccount = () => {
  showDeleteModal.value = true
}

const handleDeleteAccount = async () => {
  try {
    await AuthService.deleteAccount()
    uiStore.showToast('Cuenta eliminada correctamente', 'success')
    showDeleteModal.value = false
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    console.error('Error deleting account:', error)
    uiStore.showToast('Error al eliminar la cuenta', 'error')
  }
}

onMounted(() => {
  loadProfile()
  loadAddresses()
})
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
