<template>
  <div class="space-y-6 animate-fade-in-up pb-20">
    <!-- Breadcrumb / Back -->
    <div class="flex items-center gap-2 text-sm text-gray-400">
      <button class="hover:text-white transition-colors" @click="$router.push('/forum')">
        Foro
      </button>
      <Icon icon="mdi:chevron-right" />
      <button
        v-if="topic?.categoryId"
        class="hover:text-white transition-colors"
        @click="$router.push(`/forum/category/${topic.categoryId}`)"
      >
        {{ topic?.categoryName || 'Categoría' }}
      </button>
      <Icon icon="mdi:chevron-right" />
      <span class="text-white truncate max-w-[200px]">{{ topic?.title }}</span>
    </div>

    <div v-if="isLoading" class="space-y-6">
      <Skeleton height="300px" />
      <Skeleton v-for="n in 3" :key="n" height="150px" />
    </div>

    <div v-else-if="topic" class="space-y-8">
      <!-- Main Topic (OP) -->
      <GlassCard class="overflow-hidden">
        <div class="p-6 border-b border-white/5 bg-white/5">
          <div class="flex justify-between items-start gap-4">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold font-heading text-white mb-2">
                {{ topic.title }}
              </h1>
              <div class="flex items-center gap-4 text-sm text-gray-400">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-gray-600 overflow-hidden">
                    <!-- Avatar placeholder -->
                  </div>
                  <span class="text-brand-purple font-bold">{{ topic.authorName }}</span>
                </div>
                <span>{{ formatDate(topic.createdAt) }}</span>
                <span class="flex items-center gap-1"
                  ><Icon icon="mdi:eye" /> {{ topic.views }}</span
                >
              </div>
            </div>

            <div class="flex gap-2">
              <span
                v-if="topic.isPinned"
                class="px-2 py-1 bg-brand-purple/20 text-brand-purple rounded text-xs font-bold flex items-center gap-1"
              >
                <Icon icon="mdi:pin" /> Fijado
              </span>
              <span
                v-if="topic.isLocked"
                class="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs font-bold flex items-center gap-1"
              >
                <Icon icon="mdi:lock" /> Cerrado
              </span>
            </div>
          </div>
        </div>

        <div
          class="p-8 text-gray-200 leading-relaxed space-y-4 min-h-[150px] prose prose-invert max-w-none"
        >
          <!-- Render content as HTML (sanitize in real app!) -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-if="topic.content" v-html="topic.content"></div>
          <p v-else class="text-gray-400 italic">Sin contenido disponible</p>
        </div>

        <div class="p-4 bg-black/20 flex justify-end gap-2">
          <AnimatedButton v-if="isOwner" variant="secondary" class="!py-1 !px-3 !text-xs">
            <Icon icon="mdi:pencil" class="mr-1" /> Editar
          </AnimatedButton>
          <AnimatedButton
            v-if="!topic.isLocked"
            variant="primary"
            class="!py-1 !px-4 !text-sm"
            @click="scrollToReply"
          >
            <Icon icon="mdi:reply" class="mr-1" /> Responder
          </AnimatedButton>
        </div>
      </GlassCard>

      <!-- Replies -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-white mb-4">{{ topic.repliesCount }} Respuestas</h3>

        <GlassCard v-for="post in posts" :key="post.id" class="p-6">
          <div class="flex gap-6">
            <!-- Author Info Sidebar -->
            <div
              class="hidden md:flex flex-col items-center text-center w-32 flex-shrink-0 space-y-2"
            >
              <div class="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
                <!-- Avatar -->
              </div>
              <span class="font-bold text-white text-sm line-clamp-1">{{ post.authorName }}</span>
              <span
                v-if="post.authorRole"
                class="text-xs text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full"
              >
                {{ post.authorRole }}
              </span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="text-xs text-gray-500 mb-4 flex justify-between">
                <span>{{ post.createdAt }}</span>
                <span class="font-mono">#{{ post.id }}</span>
              </div>
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="text-gray-300 prose prose-invert max-w-none mb-4"
                v-html="post.content"
              ></div>
              <!-- eslint-enable vue/no-v-html -->

              <div class="flex justify-end pt-4 border-t border-white/5">
                <button
                  class="text-gray-500 hover:text-brand-pink transition-colors flex items-center gap-1 text-sm"
                >
                  <Icon icon="mdi:heart-outline" /> {{ post.likes || 0 }}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <!-- Quick Reply Form -->
      <GlassCard v-if="!topic.isLocked" id="reply-form" class="p-6">
        <h3 class="text-lg font-bold text-white mb-4">Tu Respuesta</h3>
        <textarea
          v-model="newReplyContent"
          class="w-full bg-black/30 border border-white/10 rounded-lg p-4 text-white resize-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
          rows="5"
          placeholder="Escribe tu respuesta aquí..."
        ></textarea>
        <div class="flex justify-end mt-4">
          <AnimatedButton :disabled="isSubmitting" @click="submitReply">
            {{ isSubmitting ? 'Enviando...' : 'Publicar Respuesta' }}
          </AnimatedButton>
        </div>
      </GlassCard>
      <GlassCard v-else class="p-6 text-center border border-red-500/30 bg-red-500/5">
        <p class="text-red-400 font-bold">
          <Icon icon="mdi:lock" class="inline mb-1" /> Este tema está cerrado. No se admiten nuevas
          respuestas.
        </p>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ForumService } from '@/services/forumService'
import type { ForumTopic, ForumPost } from '@/types/forum'

const route = useRoute()
const router = useRouter()

const topic = ref<ForumTopic | null>(null)
const posts = ref<ForumPost[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const newReplyContent = ref('')

// Computed check for owner would go here
const isOwner = ref(false) // Mock

const fetchTopicData = async () => {
  isLoading.value = true
  const topicId = Number(route.params.id)

  if (isNaN(topicId)) {
    console.error('Invalid Topic ID:', route.params.id)
    router.push('/forum')
    return
  }

  try {
    const [topicData, postsData] = await Promise.all([
      ForumService.getTopic(topicId),
      ForumService.getPosts(topicId),
    ])
    console.log('Topic data:', topicData)

    topic.value = topicData
    posts.value = postsData.content

    // Check ownership
    // isOwner.value = authStore.user?.id === topicData.authorId
  } catch (error) {
    console.error('Error fetching topic:', error)
  } finally {
    isLoading.value = false
  }
}

const submitReply = async () => {
  if (!newReplyContent.value.trim() || !topic.value) return

  isSubmitting.value = true
  try {
    const newPost = await ForumService.createPost(topic.value.id, newReplyContent.value)
    posts.value.push(newPost)
    newReplyContent.value = ''
    topic.value.repliesCount++
  } catch (error) {
    console.error('Error submitting reply:', error)
    alert('Error al publicar respuesta')
  } finally {
    isSubmitting.value = false
  }
}

const scrollToReply = () => {
  document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' })
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora mismo'
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`

  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  fetchTopicData()
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
