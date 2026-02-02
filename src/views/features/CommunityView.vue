<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold font-heading mb-6 text-white">Community</h1>
    <GlassCard>
      <div class="p-6 text-center">
        <Icon icon="mdi:account-group-outline" class="text-6xl text-brand-purple mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-white mb-2">Comming Soon</h2>
        <p class="text-gray-400">Únete a la comunidad de creadores. ¡Próximamente!</p>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import GlassCard from '@/components/ui/GlassCard.vue'
import { Icon } from '@iconify/vue'
</script>
