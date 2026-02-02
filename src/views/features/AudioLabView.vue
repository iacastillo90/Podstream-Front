<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold font-heading mb-6 text-white">Audio Lab</h1>
    <GlassCard>
      <div class="p-6 text-center">
        <Icon icon="mdi:microphone-variant" class="text-6xl text-brand-purple mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-white mb-2">Comming Soon</h2>
        <p class="text-gray-400">El laboratorio de audio definitivo. Espéralo.</p>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'
import { Icon } from '@iconify/vue'
</script>
