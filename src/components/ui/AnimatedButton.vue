<template>
  <button
    :class="[
      'relative px-8 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 group overflow-hidden',
      variant === 'primary'
        ? 'bg-transparent border border-white/20 hover:border-brand-purple'
        : 'bg-transparent border border-white/10 hover:border-white/30',
    ]"
  >
    <div
      v-if="variant === 'primary'"
      class="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue opacity-80 group-hover:opacity-100 transition-opacity"
    ></div>
    <div
      v-if="variant === 'secondary'"
      class="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"
    ></div>

    <!-- Glow effect -->
    <div
      class="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"
    ></div>

    <span class="relative z-10 flex items-center gap-2">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary'].includes(value),
  },
})
</script>
