<template>
  <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-lg shadow-xl border backdrop-blur-md flex items-start gap-3"
        :class="{
          'bg-green-500/90 border-green-400 text-white': notification.type === 'success',
          'bg-red-500/90 border-red-400 text-white': notification.type === 'error',
          'bg-blue-500/90 border-blue-400 text-white': notification.type === 'info',
          'bg-yellow-500/90 border-yellow-400 text-white': notification.type === 'warning',
        }"
      >
        <i
          class="fas mt-0.5"
          :class="{
            'fa-check-circle': notification.type === 'success',
            'fa-exclamation-circle': notification.type === 'error',
            'fa-info-circle': notification.type === 'info',
            'fa-exclamation-triangle': notification.type === 'warning',
          }"
        ></i>
        <div class="flex-1 text-sm font-medium">{{ notification.message }}</div>
        <button
          class="hover:opacity-75 transition-opacity"
          @click="uiStore.removeToast(notification.id)"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const uiStore = useUIStore()
const { notifications } = storeToRefs(uiStore)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
