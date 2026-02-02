<template>
  <div
    class="relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-purple/50 group"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-transparent to-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    ></div>
    <div class="relative z-10">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for base version, purely structural
</script>
