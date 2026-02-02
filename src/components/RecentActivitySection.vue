<template>
  <div class="mb-8">
    <h2 class="text-2xl font-semibold text-white mb-4">Actividad Reciente</h2>
    <div class="bg-black/60 rounded-xl p-6 border border-purple-600/20">
      <div
        v-for="(activity, index) in recentActivity"
        :key="index"
        class="flex justify-between items-center py-3 border-b border-gray-800 last:border-0"
      >
        <span class="text-gray-300">{{ activity.text }}</span>
        <span class="text-gray-500">{{ activity.date }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recentActivity: Array,
  },
}
</script>
