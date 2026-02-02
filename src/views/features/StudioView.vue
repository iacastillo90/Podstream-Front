<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold font-heading mb-6 text-white">Studio Builder</h1>
    <GlassCard>
      <div class="p-6 text-center">
        <Icon icon="mdi:cube-outline" class="text-6xl text-brand-purple mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-white mb-2">Comming Soon</h2>
        <p class="text-gray-400">
          Esta funcionalidad está bajo construcción. ¡Pronto podrás diseñar tu setup ideal!
        </p>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'
import { Icon } from '@iconify/vue'
</script>
