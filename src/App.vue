<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import GlobalLoader from '@/components/ui/GlobalLoader.vue'
</script>

<template>
  <RouterView />
  <ToastContainer />
  <GlobalLoader />
</template>
