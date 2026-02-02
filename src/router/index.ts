import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/layout/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/public/HomeView.vue'),
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/shop/ProductsView.vue'),
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/shop/CategoriesView.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/public/AboutView.vue'),
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/views/public/ContactView.vue'),
      },
      {
        path: 'studio',
        name: 'studio',
        component: () => import('@/views/features/StudioView.vue'),
      },
      {
        path: 'academy',
        name: 'academy',
        component: () => import('@/views/features/AcademyView.vue'),
      },
      {
        path: 'community',
        name: 'community',
        component: () => import('@/views/features/CommunityView.vue'),
      },
      {
        path: 'audiolab',
        name: 'audiolab',
        component: () => import('@/views/features/AudioLabView.vue'),
      },
      {
        path: 'versus',
        name: 'versus',
        component: () => import('@/views/features/VersusView.vue'),
      },
      {
        path: 'offers',
        name: 'offers',
        component: () => import('@/views/public/OffersView.vue'),
      },
      {
        path: 'support',
        name: 'support',
        component: () => import('@/views/public/SupportView.vue'),
      },
      // Payment Status Routes
      {
        path: 'payment/success',
        name: 'payment-success',
        component: () => import('@/views/payment/PaymentSuccessView.vue'),
      },
      {
        path: 'payment/failure',
        name: 'payment-failure',
        component: () => import('@/views/payment/PaymentFailureView.vue'),
      },
      {
        path: 'payment/pending',
        name: 'payment-pending',
        component: () => import('@/views/payment/PaymentPendingView.vue'),
      },
    ],
  },
  // Removed individual routes as they are now children above
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/public/LoginView.vue'),
    meta: { publicOnly: true }, // Solo accesible si NO estás logueado
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/public/RegisterView.vue'),
    meta: { publicOnly: true },
  },
  // Products / Shop (Standalone route removed, now under PublicLayout)
  /*
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/shop/ProductsView.vue'),
  },
  */
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/shop/ProductDetailView.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/shop/CartView.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/shop/CheckoutView.vue'),
    meta: { requiresAuth: true }, // Requiere login
  },
  // Client Dashboard
  {
    path: '/dashboard',
    component: () => import('@/components/layout/ClientLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/client/ClientDashboardView.vue'),
      },
      {
        path: 'products',
        name: 'client-products',
        component: () => import('@/views/shop/ProductsView.vue'),
      },
      {
        path: 'cart',
        name: 'client-cart',
        component: () => import('@/views/shop/CartView.vue'),
      },
      {
        path: 'categories',
        name: 'client-categories',
        component: () => import('@/views/shop/CategoriesView.vue'),
      },
      // Client Shop Orders
      {
        path: 'orders-completed',
        name: 'client-orders-completed',
        component: () => import('@/views/shop/OrdersCompletedView.vue'),
      },
      {
        path: 'orders-pending',
        name: 'client-orders-pending',
        component: () => import('@/views/shop/OrdersPendingView.vue'),
      },
      // God Mode / Creative Studio Features
      {
        path: 'studio-builder',
        name: 'client-studio-builder',
        component: () => import('@/views/god_mode/StudioBuilderView.vue'),
      },
      {
        path: 'audio-lab',
        name: 'client-audio-lab',
        component: () => import('@/views/god_mode/AudioLabView.vue'),
      },
      {
        path: 'versus-mode',
        name: 'client-versus-mode',
        component: () => import('@/views/god_mode/VersusModeView.vue'),
      },
      {
        path: 'academy',
        name: 'client-academy',
        component: () => import('@/views/god_mode/AcademyView.vue'),
      },
      {
        path: 'community',
        name: 'client-community',
        component: () => import('@/views/god_mode/CommunityView.vue'),
      },
      // Misc
      {
        path: 'contact',
        name: 'client-contact',
        component: () => import('@/views/public/ContactView.vue'),
      },

      {
        path: 'forum',
        name: 'client-forum',
        component: () => import('@/views/features/ForumView.vue'),
      },
      // Forum Sub-routes (Can be children if ForumView had <router-view>, but it's a landing page)
      // So we add them as siblings or nested under a ForumLayout if one existed.
      // For now, listing them as siblings under ClientLayout is fine.
      {
        path: '/forum/category/:id',
        name: 'forum-category',
        component: () => import('@/views/features/forum/ForumCategoryView.vue'),
      },
      {
        path: '/forum/topic/:id',
        name: 'forum-topic',
        component: () => import('@/views/features/forum/ForumTopicView.vue'),
      },
      {
        path: '/forum/new-topic',
        name: 'forum-new-topic',
        component: () => import('@/views/features/forum/ForumCreateTopicView.vue'),
      },
      {
        path: '/forum/my-activity',
        name: 'forum-my-activity',
        component: () => import('@/views/features/forum/ForumMyActivityView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/forum/category/:categoryId/new-topic',
        name: 'forum-category-new-topic',
        component: () => import('@/views/features/forum/ForumCreateTopicView.vue'),
      },

      {
        path: '/forum/search',
        name: 'forum-search',
        component: () => import('@/views/features/forum/ForumSearchView.vue'),
      },

      // User Profile & Support
      {
        path: 'personal-info',
        name: 'client-personal-info',
        component: () => import('@/views/user/PersonalInfoView.vue'),
      },
      {
        path: 'support',
        name: 'client-support',
        component: () => import('@/views/user/SupportView.vue'),
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }, // Requiere login Y rol ADMIN
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/views/admin/AdminProductsView.vue'),
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/AdminCategoriesView.vue'),
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/admin/AdminOrdersView.vue'),
      },
      {
        path: 'stock',
        name: 'admin-stock',
        component: () => import('@/views/admin/AdminStockView.vue'),
      },
      {
        path: 'clients',
        name: 'admin-clients',
        component: () => import('@/views/admin/AdminClientsView.vue'),
      },
      {
        path: 'invoices',
        name: 'admin-invoices',
        component: () => import('@/views/admin/AdminInvoicesView.vue'),
      },
      {
        path: 'promotions',
        name: 'admin-promotions',
        component: () => import('@/views/admin/AdminPromotionsView.vue'),
      },
      {
        path: 'tickets',
        name: 'admin-tickets',
        component: () => import('@/views/admin/AdminTicketsView.vue'),
      },
      {
        path: 'addresses',
        name: 'admin-addresses',
        component: () => import('@/views/admin/AdminAddressesView.vue'),
      },
      // Admin Forum Routes
      {
        path: 'forum/categories',
        name: 'admin-forum-categories',
        component: () => import('@/views/admin/forum/AdminForumCategoriesView.vue'),
      },
      {
        path: 'forum/moderation',
        name: 'admin-forum-moderation',
        component: () => import('@/views/admin/forum/AdminForumModerationView.vue'),
      },
      {
        path: 'forum/reports',
        name: 'admin-forum-reports',
        component: () => import('@/views/admin/forum/AdminForumReportsView.vue'),
      },
      {
        path: 'forum/stats',
        name: 'admin-forum-stats',
        component: () => import('@/views/admin/forum/AdminForumStatsView.vue'),
      },

      {
        path: 'studio',
        name: 'studio',
        component: () => import('@/views/features/StudioView.vue'),
      },
      {
        path: 'academy',
        name: 'academy',
        component: () => import('@/views/features/AcademyView.vue'),
      },
      {
        path: 'community',
        name: 'community',
        component: () => import('@/views/features/CommunityView.vue'),
      },
      {
        path: 'audiolab',
        name: 'audiolab',
        component: () => import('@/views/features/AudioLabView.vue'),
      },
      {
        path: 'versus',
        name: 'versus',
        component: () => import('@/views/features/VersusView.vue'),
      },
    ],
  },
  // Removed individual routes as they are now children above
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 } // Siempre volver arriba al cambiar de página
  },
})

/**
 * 🛡️ NAVIGATION GUARD (Nivel Dios)
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role

  // 1. Proteger rutas que requieren autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // 2. Proteger rutas por Rol (Admin)
  if (
    to.meta.roles &&
    Array.isArray(to.meta.roles) &&
    !to.meta.roles.includes(userRole as string)
  ) {
    console.warn('Acceso denegado: Rol insuficiente')
    return next({ name: 'home' })
  }

  // 3. Evitar que un usuario logueado vaya al Login
  if (to.meta.publicOnly && isAuthenticated) {
    return next({ name: 'home' })
  }

  next()
})

export default router
