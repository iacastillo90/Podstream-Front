<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="bg-black/60 rounded-xl p-6 border border-purple-600/20 flex flex-col items-center"
    >
      <div class="flex items-center justify-between w-full mb-2">
        <h3 class="text-gray-300">{{ stat.title }}</h3>
        <i :class="['fas', stat.icon, 'text-purple-400']"></i>
      </div>
      <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stats: Array,
  },
}
</script>
