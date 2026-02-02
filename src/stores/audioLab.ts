import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AudioLabService } from '@/services/audioLabService'
import type { AudioSample } from '@/types'

export const useAudioLabStore = defineStore('audioLab', () => {
  const samples = ref<AudioSample[]>([])
  const currentSample = ref<AudioSample | null>(null)
  const isPlaying = ref(false)
  const volume = ref(0.8)
  const currentEnvironment = ref<'QUIET' | 'CAFE' | 'KEYBOARD' | 'ECHO'>('QUIET')
  const isLoading = ref(false)

  const fetchSamples = async (productId?: string, forceRefresh = false) => {
    // Basic caching
    if (samples.value.length > 0 && !forceRefresh && !productId) return

    isLoading.value = true
    try {
      const data = await AudioLabService.getSamples(productId)
      samples.value = data

      // Select first if available and none selected
      if (samples.value.length > 0 && !currentSample.value) {
        currentSample.value = samples.value[0]
      }
    } catch (error) {
      console.error('Failed to fetch audio samples:', error)
    } finally {
      isLoading.value = false
    }
  }

  const setSample = (id: string) => {
    const found = samples.value.find((s) => s.id === id)
    if (found) {
      currentSample.value = found
      isPlaying.value = false // Reset play state
    }
  }

  const togglePlay = () => {
    if (!currentSample.value) return
    isPlaying.value = !isPlaying.value
  }

  return {
    samples,
    currentSample,
    isPlaying,
    volume,
    currentEnvironment,
    isLoading,
    fetchSamples,
    setSample,
    togglePlay,
  }
})
