<template>
  <div
    class="animate-pulse bg-white/10 rounded"
    :class="[rounded ? 'rounded-full' : 'rounded-lg']"
    :style="{
      width: width,
      height: height,
    }"
  ></div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SkeletonLoader',
})

interface Props {
  width?: string
  height?: string
  rounded?: boolean
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '20px',
  rounded: false,
})
</script>
