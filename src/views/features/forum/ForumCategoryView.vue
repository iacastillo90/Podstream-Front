<template>
  <div class="space-y-8 animate-fade-in-up pb-20">
    <!-- Header -->
    <div v-if="category" class="relative overflow-hidden rounded-2xl p-8">
      <!-- Background / Gradient -->
      <div
        class="absolute inset-0 opacity-20"
        :style="{
          background: `linear-gradient(to right, ${category.color || '#a855f7'}, transparent)`,
        }"
      ></div>

      <div
        class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <div class="flex items-center gap-2 mb-2">
            <AnimatedButton
              variant="secondary"
              class="!px-3 !py-1 !text-xs"
              @click="$router.push('/forum')"
            >
              <Icon icon="mdi:arrow-left" class="mr-1" /> Volver al Foro
            </AnimatedButton>
          </div>
          <h1 class="text-3xl font-bold font-heading text-white flex items-center gap-3">
            <Icon :icon="category.icon || 'mdi:folder'" /> {{ category.name }}
          </h1>
          <p class="text-gray-300 mt-2 max-w-2xl">{{ category.description }}</p>
        </div>

        <AnimatedButton @click="$router.push(`/forum/category/${category.id}/new-topic`)">
          <Icon icon="mdi:plus" class="mr-2 text-xl" /> Crear Tema
        </AnimatedButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <Skeleton v-for="n in 5" :key="n" height="80px" />
    </div>

    <!-- Topics List -->
    <div v-else class="space-y-4">
      <!-- Empty State -->
      <GlassCard v-if="topics.length === 0" class="p-12 text-center">
        <Icon icon="mdi:emoticon-sad-outline" class="text-6xl text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">No hay temas aún</h3>
        <p class="text-gray-400 mb-6">
          Sé el primero en iniciar una conversación en esta categoría.
        </p>
        <AnimatedButton @click="$router.push(`/forum/category/${category?.id}/new-topic`)">
          Crear Tema
        </AnimatedButton>
      </GlassCard>

      <!-- Topics -->
      <GlassCard
        v-for="topic in topics"
        :key="topic.id"
        class="p-4 transition-all hover:bg-white/5 cursor-pointer group border-l-4"
        :class="{
          'border-l-brand-purple': topic.isPinned,
          'border-l-transparent': !topic.isPinned,
        }"
        @click="$router.push(`/forum/topic/${topic.id}`)"
      >
        <div class="flex items-start gap-4">
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
            <img
              v-if="topic.authorAvatar"
              :src="topic.authorAvatar"
              class="w-full h-full object-cover"
              alt="Avatar"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <Icon icon="mdi:account" />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span v-if="topic.isPinned" class="text-brand-purple" title="Fijado">
                <Icon icon="mdi:pin" />
              </span>
              <span v-if="topic.isLocked" class="text-red-500" title="Cerrado">
                <Icon icon="mdi:lock" />
              </span>
              <h3
                class="text-white font-bold text-lg group-hover:text-brand-blue transition-colors line-clamp-1"
              >
                {{ topic.title }}
              </h3>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-400">
              <span
                >Por <span class="text-white">{{ topic.authorName }}</span></span
              >
              <span>• {{ topic.createdAt }}</span>
              <!-- Format date properly in real app -->
            </div>
          </div>

          <div class="hidden md:flex flex-col items-end gap-1 text-right min-w-[100px]">
            <div class="flex items-center gap-1 text-gray-400" title="Respuestas">
              <Icon icon="mdi:message-outline" />
              <span class="font-bold text-white">{{ topic.repliesCount }}</span>
            </div>
            <div class="flex items-center gap-1 text-gray-400" title="Vistas">
              <Icon icon="mdi:eye-outline" />
              <span>{{ topic.views }}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>

    <!-- Pagination (Simple Mock) -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2 pt-4">
      <button
        v-for="p in totalPages"
        :key="p"
        class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        :class="
          currentPage === p - 1
            ? 'bg-brand-purple text-white'
            : 'bg-white/10 text-gray-400 hover:bg-white/20'
        "
        @click="changePage(p - 1)"
      >
        {{ p }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ForumService } from '@/services/forumService'
import type { ForumCategory, ForumTopic } from '@/types/forum'

const route = useRoute()
const category = ref<ForumCategory | null>(null)
const topics = ref<ForumTopic[]>([])
const isLoading = ref(true)
const currentPage = ref(0)
const totalPages = ref(0)

const fetchCategoryData = async () => {
  isLoading.value = true
  const catId = Number(route.params.id)

  try {
    // Parallel fetch: category details and topics
    const [cat, topicsData] = await Promise.all([
      ForumService.getCategory(catId),
      ForumService.getTopicsByCategory(catId, currentPage.value),
    ])

    category.value = cat
    topics.value = topicsData.content
    totalPages.value = topicsData.totalPages
  } catch (error) {
    console.error('Error fetching category:', error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchCategoryData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  () => route.params.id,
  () => {
    currentPage.value = 0
    fetchCategoryData()
  },
)

onMounted(() => {
  fetchCategoryData()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
