<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Page Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6"
    >
      <div>
        <h1 class="text-3xl md:text-4xl font-bold font-heading mb-2">Foro de PodStream</h1>
        <p class="text-gray-400 text-sm">Únete a la conversación con otros creadores.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <GlassCard class="!p-0 relative group w-full md:w-64 overflow-hidden">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i
              class="fas fa-search text-gray-500 group-focus-within:text-brand-purple transition-colors"
            ></i>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar temas..."
            class="w-full bg-transparent border-none rounded-none pl-10 pr-4 py-2.5 focus:outline-none focus:ring-0 text-sm text-white placeholder-gray-600"
          />
        </GlassCard>

        <AnimatedButton
          variant="primary"
          class="whitespace-nowrap"
          @click="showNewTopicForm = !showNewTopicForm"
        >
          <i :class="showNewTopicForm ? 'fas fa-times' : 'fas fa-plus'" class="mr-2"></i>
          {{ showNewTopicForm ? 'Cancelar' : 'Nuevo Tema' }}
        </AnimatedButton>
      </div>
    </div>

    <!-- New Topic Form -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <GlassCard v-if="showNewTopicForm" class="p-6 md:p-8 border-brand-purple/30 mb-8">
        <h2 class="text-xl font-bold font-heading text-white mb-6">Crear Nuevo Tema</h2>
        <form class="space-y-6" @submit.prevent="createTopic">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Título</label>
              <input
                v-model="newTopic.title"
                type="text"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white placeholder-gray-600"
                placeholder="¿De qué quieres hablar?"
                required
              />
            </div>
            <div>
              <label class="block text-gray-400 text-sm mb-2">Categoría</label>
              <select
                v-model="newTopic.category"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white [&>option]:bg-brand-dark"
                required
              >
                <option
                  v-for="category in forumCategories"
                  :key="category.id"
                  :value="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">Contenido</label>
            <textarea
              v-model="newTopic.content"
              rows="4"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white placeholder-gray-600 resize-none"
              placeholder="Escribe los detalles de tu tema..."
              required
            ></textarea>
          </div>
          <div class="flex justify-end">
            <AnimatedButton type="submit">Publicar Tema</AnimatedButton>
          </div>
        </form>
      </GlassCard>
    </transition>

    <!-- Edit Topic Form Modal -->
    <div v-if="showEditTopicForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-sm"
        @click="showEditTopicForm = false"
      ></div>
      <GlassCard class="relative w-full max-w-2xl p-6 md:p-8 border-brand-purple/30 z-10">
        <h2 class="text-xl font-bold font-heading text-white mb-6">Editar Tema</h2>
        <form class="space-y-6" @submit.prevent="updateTopic">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Título</label>
              <input
                v-model="editTopicData.title"
                type="text"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white"
                required
              />
            </div>
            <div>
              <label class="block text-gray-400 text-sm mb-2">Categoría</label>
              <select
                v-model="editTopicData.category"
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white [&>option]:bg-brand-dark"
                required
              >
                <option
                  v-for="category in forumCategories"
                  :key="category.id"
                  :value="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-gray-400 text-sm mb-2">Contenido</label>
            <textarea
              v-model="editTopicData.content"
              rows="4"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-white resize-none"
              required
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              @click="showEditTopicForm = false"
            >
              Cancelar
            </button>
            <AnimatedButton type="submit">Guardar Cambios</AnimatedButton>
          </div>
        </form>
      </GlassCard>
    </div>

    <!-- Grid Layout for Content -->
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Feed -->
      <div class="lg:col-span-2 space-y-8">
        <!-- User Topics -->
        <div v-if="userCreatedTopics.length > 0">
          <h2 class="text-xl font-bold font-heading mb-4 pl-2 border-l-4 border-brand-purple">
            Tus Temas
          </h2>
          <div class="space-y-4">
            <GlassCard
              v-for="topic in userCreatedTopics"
              :key="topic.id"
              class="p-6 hover:bg-white/5 transition-colors group"
            >
              <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3
                    class="text-lg font-bold text-white group-hover:text-brand-purple transition-colors cursor-pointer"
                    @click="viewTopic(topic)"
                  >
                    {{ topic.title }}
                  </h3>
                  <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> {{ topic.date }}</span>
                    <span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{{
                      topic.category
                    }}</span>
                  </div>
                  <p class="text-gray-300 text-sm mt-3 line-clamp-2">
                    {{ topic.content }}
                  </p>
                </div>
                <div class="flex sm:flex-col items-end justify-between gap-2">
                  <div
                    class="flex items-center gap-1 text-gray-400 text-sm bg-black/20 px-3 py-1 rounded-full"
                  >
                    <i class="far fa-comment"></i>
                    <span>{{ topic.replies }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-brand-blue hover:text-white transition-colors text-gray-400"
                      @click.stop="editTopic(topic)"
                    >
                      <i class="fas fa-pen text-xs"></i>
                    </button>
                    <button
                      class="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-red-500 hover:text-white transition-colors text-gray-400"
                      @click.stop="deleteTopic(topic.id)"
                    >
                      <i class="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <!-- Recent Topics -->
        <div>
          <h2 class="text-xl font-bold font-heading mb-4 pl-2 border-l-4 border-brand-blue">
            Recientes
          </h2>
          <div class="space-y-4">
            <GlassCard
              v-for="topic in filteredTopics"
              :key="topic.id"
              class="p-6 hover:bg-white/5 transition-colors group"
            >
              <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3
                    class="text-lg font-bold text-white group-hover:text-brand-blue transition-colors cursor-pointer"
                    @click="viewTopic(topic)"
                  >
                    {{ topic.title }}
                  </h3>
                  <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <div class="flex items-center gap-1">
                      <div
                        class="w-5 h-5 rounded-full bg-brand-purple/20 flex items-center justify-center text-[10px] text-brand-purple font-bold"
                      >
                        {{ topic.author.charAt(0) }}
                      </div>
                      <span>{{ topic.author }}</span>
                    </div>
                    <span>•</span>
                    <span>{{ topic.date }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1 text-gray-400 text-sm">
                  <i class="far fa-comment"></i>
                  <span>{{ topic.replies }}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-8">
        <!-- Categories -->
        <GlassCard class="p-6">
          <h3 class="text-lg font-bold font-heading mb-4">Categorías</h3>
          <div class="space-y-1">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <span class="text-sm text-gray-300 group-hover:text-white transition-colors">{{
                category.name
              }}</span>
              <span
                class="text-xs bg-white/5 px-2 py-0.5 rounded-full text-gray-500 group-hover:text-brand-purple transition-colors"
                >{{ category.topicsCount }}</span
              >
            </div>
          </div>
        </GlassCard>

        <!-- Popular Topics -->
        <GlassCard class="p-6">
          <h3 class="text-lg font-bold font-heading mb-4 flex items-center gap-2">
            <i class="fas fa-fire text-brand-pink"></i> Populares
          </h3>
          <div class="space-y-4">
            <div
              v-for="topic in popularTopics"
              :key="topic.id"
              class="group cursor-pointer"
              @click="viewTopic(topic)"
            >
              <h4
                class="text-sm font-bold text-white group-hover:text-brand-pink transition-colors line-clamp-2"
              >
                {{ topic.title }}
              </h4>
              <div class="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>{{ topic.author }}</span>
                <span>{{ topic.replies }} respuestas</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import GlassCard from '@/components/ui/GlassCard.vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'
import { ForumService } from '@/services/forumService'

const showNewTopicForm = ref(false)
const showEditTopicForm = ref(false)
const searchQuery = ref('')
const isLoading = ref(false)

// Interface definitions
import type { ForumCategory } from '@/types/forum'

interface WebTopic {
  id: number
  title: string
  categoryId: number
  category: string // Name for display
  content: string
  author: string
  date: string
  replies: number
}

const forumCategories = ref<ForumCategory[]>([])
const recentTopics = ref<WebTopic[]>([])
const userCreatedTopics = ref<WebTopic[]>([])

const fetchForumData = async () => {
  isLoading.value = true
  try {
    const [cats, topics] = await Promise.all([
      ForumService.getCategories(),
      ForumService.getRecentTopics(),
    ])
    forumCategories.value = cats

    // Map API topics to WebTopic UI model
    recentTopics.value = topics.map((t) => {
      const catName = forumCategories.value.find((c) => c.id === t.categoryId)?.name || 'General'
      return {
        id: t.id,
        title: t.title,
        categoryId: t.categoryId,
        category: catName,
        content: '', // Content not in summary list
        author: t.authorName, // Fixed: author -> authorName
        date: new Date(t.createdAt).toLocaleDateString(),
        replies: t.repliesCount, // Fixed: replies -> repliesCount
      }
    })
  } catch (error) {
    console.error('Failed to load forum data', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchForumData()
})

const popularTopics = computed(() => {
  return [...recentTopics.value].sort((a, b) => (b.replies || 0) - (a.replies || 0)).slice(0, 5)
})

interface Topic {
  id: number
  title: string
  category?: string
  content?: string
  author?: string
  date?: string
  replies?: number
  lastParticipation?: string
  comment?: string
}

// Topic Management
const newTopic = reactive({
  title: '',
  category: 'General',
  content: '',
})

const editTopicData = reactive({
  id: 0,
  title: '',
  category: '',
  content: '',
})

// Methods
const createTopic = async () => {
  try {
    const topicData = {
      title: newTopic.title,
      category: newTopic.category,
      content: newTopic.content,
      // Temporarily satisfying strict requirements if any
      categoryId: forumCategories.value.find((c) => c.name === newTopic.category)?.id || 1,
    }
    // Cast to expected type if needed or use dedicated service method
    // @ts-expect-error - topicData may not match exact service signature
    await ForumService.createTopic(topicData)
    await fetchForumData()
    newTopic.title = ''
    newTopic.content = ''
    showNewTopicForm.value = false
  } catch (error) {
    console.error('Error creating topic', error)
  }
}

const editTopic = (topic: Topic | WebTopic) => {
  editTopicData.id = topic.id
  editTopicData.title = topic.title
  editTopicData.category = topic.category || ''
  editTopicData.content = topic.content || ''
  showEditTopicForm.value = true
}

const updateTopic = () => {
  const idx = userCreatedTopics.value.findIndex((t) => t.id === editTopicData.id)
  if (idx !== -1) {
    // @ts-expect-error - editTopicData may have partial fields
    userCreatedTopics.value[idx] = { ...userCreatedTopics.value[idx], ...editTopicData }
  }
  showEditTopicForm.value = false
}

const deleteTopic = (id: number) => {
  if (confirm('¿Estás seguro de eliminar este tema?')) {
    userCreatedTopics.value = userCreatedTopics.value.filter((t) => t.id !== id)
  }
}

const viewTopic = (topic: Topic | WebTopic) => {
  console.log('Viewing topic:', topic.title)
  // router.push('/forum/topic/' + topic.id)
}
const filteredTopics = computed(() => {
  if (!searchQuery.value) return recentTopics.value
  const q = searchQuery.value.toLowerCase()
  return recentTopics.value.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.author.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q),
  )
})

const filteredCategories = computed(() => {
  if (!searchQuery.value) return forumCategories.value // Fixed: return value
  const q = searchQuery.value.toLowerCase()
  return forumCategories.value.filter((c) => c.name.toLowerCase().includes(q))
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
