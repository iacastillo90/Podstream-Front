<template>
  <div class="space-y-8 animate-fade-in-up pb-20">
    <!-- Header & Search -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <h1 class="text-3xl font-bold font-heading mb-2">Foro de la Comunidad</h1>
        <p class="text-gray-400">
          Únete a la conversación, comparte tu setup y aprende de otros creadores.
        </p>
      </div>
      <div class="relative w-full md:w-96 group/search">
        <div
          class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/search:text-brand-purple transition-colors"
        >
          <Icon icon="mdi:magnify" class="text-xl" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar temas..."
          class="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
        />
      </div>
    </div>

    <!-- Forum Stats (Optional/Mock for now) -->
    <div v-if="stats" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <GlassCard class="p-4 text-center">
        <p class="text-3xl font-bold text-white">{{ stats.totalUsers }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">Miembros</p>
      </GlassCard>
      <GlassCard class="p-4 text-center">
        <p class="text-3xl font-bold text-brand-purple">{{ stats.totalTopics }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">Temas</p>
      </GlassCard>
      <GlassCard class="p-4 text-center">
        <p class="text-3xl font-bold text-brand-pink">{{ stats.totalPosts }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">Posts</p>
      </GlassCard>
      <GlassCard class="p-4 text-center">
        <p class="text-3xl font-bold text-brand-blue">{{ stats.activeUsers24h }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">Online</p>
      </GlassCard>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Content: Categories -->
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <Icon icon="mdi:shape-outline" class="text-brand-purple" /> Categorías
        </h2>

        <div v-if="isLoading" class="space-y-4">
          <Skeleton v-for="n in 3" :key="n" height="100px" class="w-full" />
        </div>

        <div v-else class="space-y-4">
          <GlassCard
            v-for="category in categories"
            :key="category.id"
            class="p-6 transition-all hover:bg-white/5 cursor-pointer group"
            @click="goToCategory(category.id)"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
                :style="{ color: category.color || '#a855f7' }"
              >
                <Icon :icon="category.icon || 'mdi:folder-outline'" />
              </div>
              <div class="flex-1">
                <h3
                  class="text-lg font-bold text-white mb-1 group-hover:text-brand-purple transition-colors"
                >
                  {{ category.name }}
                </h3>
                <p class="text-gray-400 text-sm">{{ category.description }}</p>
              </div>
              <div class="hidden md:flex gap-6 text-center">
                <div>
                  <p class="text-lg font-bold text-white">{{ category.topicsCount }}</p>
                  <p class="text-xs text-gray-500 uppercase">Temas</p>
                </div>
                <div>
                  <p class="text-lg font-bold text-white">{{ category.postsCount }}</p>
                  <p class="text-xs text-gray-500 uppercase">Posts</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <!-- Sidebar: Recent & Popular -->
      <div class="space-y-8">
        <!-- New Topic CTA -->
        <AnimatedButton
          class="w-full justify-center !py-3"
          @click="$router.push('/forum/new-topic')"
        >
          <Icon icon="mdi:plus" class="mr-2 text-xl" /> Crear Nuevo Tema
        </AnimatedButton>

        <!-- Recent Topics -->
        <GlassCard class="p-6">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:clock-outline" class="text-brand-blue" /> Recientes
          </h3>

          <div v-if="isLoadingRecent" class="space-y-3">
            <Skeleton v-for="n in 3" :key="n" height="60px" />
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="topic in recentTopics"
              :key="topic.id"
              class="group cursor-pointer border-b border-white/5 last:border-0 pb-3 last:pb-0"
              @click="goToTopic(topic.id)"
            >
              <h4
                class="text-white font-medium text-sm group-hover:text-brand-blue transition-colors line-clamp-1"
              >
                {{ topic.title }}
              </h4>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs text-gray-500">{{ topic.authorName }}</span>
                <span class="text-xs text-gray-500 flex items-center gap-1">
                  <Icon icon="mdi:message-outline" class="text-[10px]" /> {{ topic.repliesCount }}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        <!-- Popular Topics -->
        <GlassCard class="p-6">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:fire" class="text-brand-pink" /> Populares
          </h3>
          <div class="space-y-4">
            <div v-if="popularTopics.length === 0 && !isLoading" class="text-gray-500 text-sm">
              No hay temas populares aún.
            </div>
            <div
              v-for="topic in popularTopics"
              :key="topic.id"
              class="group cursor-pointer flex items-center gap-3"
              @click="goToTopic(topic.id)"
            >
              <div class="text-brand-pink font-bold text-lg opacity-50 group-hover:opacity-100">
                #
              </div>
              <div class="flex-1 min-w-0">
                <h4
                  class="text-white font-medium text-sm group-hover:text-brand-pink transition-colors line-clamp-1"
                >
                  {{ topic.title }}
                </h4>
                <p class="text-xs text-gray-500">{{ topic.views }} vistas</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ForumService } from '@/services/forumService'
import type { ForumCategory, ForumStats, ForumTopic } from '@/types/forum'

const router = useRouter()
const searchQuery = ref('')
const categories = ref<ForumCategory[]>([])
const stats = ref<ForumStats | null>(null)
const recentTopics = ref<ForumTopic[]>([])
const popularTopics = ref<ForumTopic[]>([])

const isLoading = ref(true)
const isLoadingRecent = ref(true)

const fetchData = async () => {
  isLoading.value = true
  try {
    const [catsData, statsData] = await Promise.all([
      ForumService.getCategories(),
      ForumService.getHomeStats().catch(() => null), // Handle fail gracefully
    ])
    categories.value = catsData
    stats.value = statsData
  } catch (error) {
    console.error('Error fetching forum home data:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchSidebarData = async () => {
  isLoadingRecent.value = true
  try {
    const [recent, popular] = await Promise.all([
      ForumService.getRecentTopics(5),
      ForumService.getPopularTopics(5),
    ])
    console.log('Sidebar Data - Recent:', recent)
    console.log('Sidebar Data - Popular:', popular)
    recentTopics.value = recent
    popularTopics.value = popular
  } catch (error) {
    console.error('Sidebar data error:', error)
  } finally {
    isLoadingRecent.value = false
  }
}

const goToCategory = (id: number) => {
  router.push(`/forum/category/${id}`)
}

const goToTopic = (id: number) => {
  router.push(`/forum/topic/${id}`)
}

onMounted(() => {
  fetchData()
  fetchSidebarData()
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
