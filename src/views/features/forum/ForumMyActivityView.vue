<template>
  <div class="space-y-6 animate-fade-in-up pb-20">
    <div class="flex items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold font-heading text-white mb-1">Mi Actividad</h1>
        <p class="text-gray-400">Gestiona tus temas, respuestas y notificaciones.</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-6 border-b border-white/10 pb-4 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="pb-2 font-bold transition-colors relative whitespace-nowrap"
        :class="activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-white'"
        @click="activeTab = tab.id"
      >
        <span class="flex items-center gap-2">
          <Icon :icon="tab.icon" /> {{ tab.label }}
          <span
            v-if="tab.count > 0"
            class="bg-brand-purple text-white text-[10px] px-1.5 py-0.5 rounded-full"
          >
            {{ tab.count }}
          </span>
        </span>
        <span
          v-if="activeTab === tab.id"
          class="absolute bottom-[-17px] left-0 w-full h-1 bg-brand-purple rounded-t"
        ></span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <Skeleton v-for="n in 3" :key="n" height="100px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="py-12 text-center text-gray-500">
      <Icon :icon="currentTabIcon" class="text-6xl mb-4 mx-auto opacity-50" />
      <p>
        No tienes
        {{
          activeTab === 'TOPICS' ? 'temas' : activeTab === 'POSTS' ? 'respuestas' : 'notificaciones'
        }}
        aún.
      </p>
      <AnimatedButton
        v-if="activeTab === 'TOPICS'"
        class="mt-4"
        @click="$router.push('/forum/new-topic')"
      >
        Crear mi primer tema
      </AnimatedButton>
    </div>

    <!-- Content List -->
    <div v-else class="space-y-4">
      <!-- MY TOPICS -->
      <template v-if="activeTab === 'TOPICS'">
        <GlassCard
          v-for="topic in items as any[]"
          :key="topic.id"
          class="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
          @click="$router.push(`/forum/topic/${topic.id}`)"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span
                class="text-xs font-bold px-2 py-0.5 rounded"
                :class="{
                  'bg-yellow-500/20 text-yellow-500': topic.status === 'PENDING',
                  'bg-green-500/20 text-green-500': topic.status === 'APPROVED',
                  'bg-red-500/20 text-red-500': topic.status === 'REJECTED',
                }"
              >
                {{ topic.status || 'APPROVED' }}
              </span>
              <h3 class="text-white font-bold line-clamp-1">{{ topic.title }}</h3>
            </div>
            <p class="text-gray-400 text-sm flex items-center gap-4">
              <span>{{ topic.repliesCount }} respuestas</span>
              <span>{{ topic.views }} vistas</span>
              <span>{{ topic.createdAt }}</span>
            </p>
          </div>
          <Icon icon="mdi:chevron-right" class="text-gray-600" />
        </GlassCard>
      </template>

      <!-- MY POSTS -->
      <template v-if="activeTab === 'POSTS'">
        <GlassCard
          v-for="post in items as any[]"
          :key="post.id"
          class="p-4 cursor-pointer hover:bg-white/5 transition-colors"
          @click="$router.push(`/forum/topic/${post.topic?.id || post.topicId}`)"
        >
          <div class="flex items-center gap-2 mb-2">
            <Icon icon="mdi:reply" class="text-brand-purple" />
            <span class="text-gray-400 text-sm">
              Respondiste en:
              <span class="text-white font-bold">{{
                post.topic?.title || '#' + post.topicId
              }}</span>
            </span>
            <span class="text-gray-500 text-xs">• {{ post.createdAt }}</span>
          </div>
          <p class="text-white italic text-sm line-clamp-2">"{{ post.content }}"</p>
        </GlassCard>
      </template>

      <!-- NOTIFICATIONS -->
      <template v-if="activeTab === 'NOTIFICATIONS'">
        <div class="flex justify-end mb-2">
          <button class="text-xs text-brand-purple hover:underline" @click="markAllRead">
            Marcar todas como leídas
          </button>
        </div>
        <GlassCard
          v-for="notif in items as ForumNotification[]"
          :key="notif.id"
          class="p-4 flex gap-4 transition-colors"
          :class="notif.read ? 'opacity-70' : 'border-l-4 border-l-brand-purple'"
        >
          <div class="pt-1">
            <Icon
              :icon="getNotifIcon(notif.type)"
              class="text-2xl"
              :class="{
                'text-green-500': notif.type === 'TOPIC_APPROVED',
                'text-red-500': notif.type === 'TOPIC_REJECTED',
                'text-blue-500': notif.type === 'NEW_REPLY',
                'text-pink-500': notif.type === 'REPLY_LIKED',
              }"
            />
          </div>
          <div class="flex-1">
            <h4 class="text-white font-bold text-sm">{{ notif.title }}</h4>
            <p class="text-gray-400 text-sm">{{ notif.message }}</p>
            <span class="text-gray-600 text-xs mt-1 block">{{ formatDate(notif.createdAt) }}</span>

            <div v-if="notif.link" class="mt-2 flex gap-2">
              <AnimatedButton
                variant="secondary"
                class="!py-1 !px-2 !text-xs"
                @click="goToLink(notif)"
              >
                Ver
              </AnimatedButton>
            </div>
          </div>
          <div v-if="!notif.read">
            <button title="Marcar leída" @click="markRead(notif)">
              <Icon icon="mdi:circle-outline" class="text-brand-purple hover:text-white" />
            </button>
          </div>
        </GlassCard>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ForumService } from '@/services/forumService'
import type { ForumTopic, ForumPost, ForumNotification } from '@/types/forum'

const router = useRouter()
const activeTab = ref('TOPICS')
const isLoading = ref(true)
const items = ref<ForumTopic[] | ForumPost[] | ForumNotification[]>([])

const tabs = ref([
  { id: 'TOPICS', label: 'Mis Temas', icon: 'mdi:format-list-bulleted', count: 0 },
  { id: 'POSTS', label: 'Mis Respuestas', icon: 'mdi:comment-text-outline', count: 0 },
  { id: 'NOTIFICATIONS', label: 'Notificaciones', icon: 'mdi:bell-outline', count: 0 },
])

const currentTabIcon = computed(() => {
  return tabs.value.find((t) => t.id === activeTab.value)?.icon || 'mdi:help'
})

const fetchData = async () => {
  isLoading.value = true
  items.value = []
  try {
    if (activeTab.value === 'TOPICS') {
      items.value = await ForumService.getMyTopics()
    } else if (activeTab.value === 'POSTS') {
      items.value = await ForumService.getMyPosts()
      console.log('My Posts items:', items.value)
    } else if (activeTab.value === 'NOTIFICATIONS') {
      items.value = await ForumService.getNotifications()
    }
  } catch (error) {
    console.error('Error fetching activity:', error)
  } finally {
    isLoading.value = false
  }
}

// Notification helpers
const getNotifIcon = (type: string) => {
  switch (type) {
    case 'TOPIC_APPROVED':
      return 'mdi:check-circle'
    case 'TOPIC_REJECTED':
      return 'mdi:close-circle'
    case 'NEW_REPLY':
      return 'mdi:reply'
    case 'REPLY_LIKED':
      return 'mdi:heart'
    default:
      return 'mdi:bell'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const markRead = async (notif: ForumNotification) => {
  try {
    await ForumService.markNotificationRead(notif.id)
    notif.read = true
  } catch (e) {
    console.error(e)
  }
}

const markAllRead = async () => {
  try {
    await ForumService.markAllNotificationsRead()
    // Update local state
    if (activeTab.value === 'NOTIFICATIONS') {
      ;(items.value as ForumNotification[]).forEach((i) => (i.read = true))
    }
  } catch (e) {
    console.error(e)
  }
}

const goToLink = async (notif: ForumNotification) => {
  if (!notif.read) await markRead(notif)
  if (notif.link) router.push(notif.link)
}

watch(activeTab, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
  // Ideally fetch counts for tabs too
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
