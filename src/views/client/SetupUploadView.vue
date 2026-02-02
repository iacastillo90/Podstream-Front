<script setup lang="ts">
import { ref } from 'vue'
import { storageService } from '@/services/storageService'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import GlassCard from '@/components/ui/GlassCard.vue'

const uploadStatus = ref('')
const uploadError = ref(false)
const previewUrl = ref<string | null>(null)
const isUploading = ref(false)

const onFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Generate local preview
  previewUrl.value = URL.createObjectURL(file)
  uploadStatus.value = ''
  uploadError.value = false

  try {
    isUploading.value = true
    uploadStatus.value = 'Subiendo tu setup...'

    // Call the "God Level" service
    const photoPath = await storageService.uploadPhoto(file, 'setups')

    uploadStatus.value = '¡Setup subido con éxito!'
    uploadError.value = false
    console.log('Saved to DB path:', photoPath)
  } catch (error) {
    console.error('Upload error:', error)
    uploadStatus.value = 'Error al subir la imagen. Inténtalo de nuevo.'
    uploadError.value = true
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div class="border-b border-white/5 pb-6">
      <h1 class="text-3xl font-bold font-heading mb-1 text-white">Sube tu Setup PodStream</h1>
      <p class="text-gray-400">Comparte tu estación de batalla con la comunidad</p>
    </div>

    <GlassCard class="max-w-2xl p-8 relative overflow-hidden">
      <!-- Decorational Glow -->
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full pointer-events-none"
      ></div>

      <div class="relative z-10 space-y-6">
        <div
          class="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 transition-colors hover:border-brand-purple/50 group bg-black/20"
        >
          <input
            type="file"
            @change="onFileChange"
            accept="image/*"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            :disabled="isUploading"
          />

          <div v-if="!previewUrl" class="text-center space-y-2 pointer-events-none">
            <div
              class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:bg-brand-purple/20 transition-colors"
            >
              <i
                class="fas fa-cloud-upload-alt text-2xl text-gray-400 group-hover:text-brand-purple"
              ></i>
            </div>
            <p class="text-lg font-medium text-white">Arrastra o selecciona una foto</p>
            <p class="text-sm text-gray-500">JPG, PNG o WEBP (Max 5MB)</p>
          </div>

          <div v-else class="relative w-full">
            <img
              :src="previewUrl"
              class="w-full h-auto rounded-lg border border-white/10 shadow-lg"
              alt="Preview"
            />
            <div
              v-if="isUploading"
              class="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg backdrop-blur-sm"
            >
              <div class="flex flex-col items-center gap-2">
                <i class="fas fa-spinner fa-spin text-3xl text-brand-purple"></i>
                <span class="text-white font-medium">Subiendo...</span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="uploadStatus"
          class="p-4 rounded-lg flex items-center gap-3"
          :class="uploadError ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'"
        >
          <i class="fas" :class="uploadError ? 'fa-exclamation-circle' : 'fa-check-circle'"></i>
          <span class="font-medium">{{ uploadStatus }}</span>
        </div>
      </div>
    </GlassCard>
  </div>
</template>

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
