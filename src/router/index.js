import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

// Импорт компонентов
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Страницы аутентификации
import LoginPage from '@/views/auth/LoginPage.vue'
import RegisterPage from '@/views/auth/RegisterPage.vue'

// Основные страницы
import DashboardPage from '@/views/DashboardPage.vue'
import EventsPage from '@/views/EventsPage.vue'
import EventDetailPage from '@/views/EventDetailPage.vue'
import EventCreatePage from '@/views/EventCreatePage.vue'
import RewardsPage from '@/views/RewardsPage.vue'
import RewardDetailPage from '@/views/RewardDetailPage.vue'
import RewardCreatePage from '@/views/RewardCreatePage.vue'
import ProfilePage from '@/views/profile/ProfilePage.vue'
import LeaderboardPage from '@/views/LeaderboardPage.vue'

// Страницы для модераторов и админов
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import ModeratorDashboard from '@/views/moderator/ModeratorDashboard.vue'
import UsersManagement from '@/views/admin/UsersManagement.vue'
import EventsManagement from '@/views/admin/EventsManagement.vue'
import RewardsManagement from '@/views/admin/RewardsManagement.vue'
import PurchasesManagement from '@/views/admin/PurchasesManagement.vue'
import RegistrationsManagement from '@/views/admin/RegistrationsManagement.vue'
import StatisticsPage from '@/views/admin/StatisticsPage.vue'

// 404 страница
import NotFoundPage from '@/views/NotFoundPage.vue'

const routes = [
  // Редирект с корня
  {
    path: '/',
    redirect: '/dashboard'
  },
  
  // Страницы аутентификации
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginPage,
        meta: {
          title: 'Вход в систему',
          requiresGuest: true
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterPage,
        meta: {
          title: 'Регистрация',
          requiresGuest: true
        }
      }
    ]
  },
  
  // Основные страницы приложения
  {
    path: '/',
    component: DefaultLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      // Дашборд
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardPage,
        meta: {
          title: 'Главная',
          icon: 'fas fa-home',
          showInNav: true
        }
      },
      
      // Мероприятия
      {
        path: 'events',
        name: 'Events',
        component: EventsPage,
        meta: {
          title: 'Мероприятия',
          icon: 'fas fa-calendar-alt',
          showInNav: true
        }
      },
      {
        path: 'events/create',
        name: 'EventCreate',
        component: EventCreatePage,
        meta: {
          title: 'Создать мероприятие',
          roles: ['moderator', 'admin'],
          breadcrumbs: [
            { text: 'Мероприятия', to: '/events' },
            { text: 'Создать мероприятие' }
          ]
        }
      },
      {
        path: 'events/:id',
        name: 'EventDetail',
        component: EventDetailPage,
        props: true,
        meta: {
          title: 'Мероприятие',
          breadcrumbs: [
            { text: 'Мероприятия', to: '/events' },
            { text: 'Подробности' }
          ]
        }
      },
      
      // Награды
      {
        path: 'rewards',
        name: 'Rewards',
        component: RewardsPage,
        meta: {
          title: 'Награды',
          icon: 'fas fa-gift',
          showInNav: true
        }
      },
      {
        path: 'rewards/create',
        name: 'RewardCreate',
        component: RewardCreatePage,
        meta: {
          title: 'Создать награду',
          roles: ['moderator', 'admin'],
          breadcrumbs: [
            { text: 'Награды', to: '/rewards' },
            { text: 'Создать награду' }
          ]
        }
      },
      {
        path: 'rewards/:id',
        name: 'RewardDetail',
        component: RewardDetailPage,
        props: true,
        meta: {
          title: 'Награда',
          breadcrumbs: [
            { text: 'Награды', to: '/rewards' },
            { text: 'Подробности' }
          ]
        }
      },
      
      // Рейтинг
      {
        path: 'leaderboard',
        name: 'Leaderboard',
        component: LeaderboardPage,
        meta: {
          title: 'Рейтинг',
          icon: 'fas fa-trophy',
          showInNav: true
        }
      },
      
      // Профиль
      {
        path: 'profile',
        name: 'Profile',
        component: ProfilePage,
        meta: {
          title: 'Мой профиль',
          icon: 'fas fa-user',
          showInNav: true,
          inUserMenu: true
        }
      },
      
      // Панель модератора
      {
        path: 'moderator',
        meta: {
          roles: ['moderator', 'admin']
        },
        children: [
          {
            path: '',
            name: 'ModeratorDashboard',
            component: ModeratorDashboard,
            meta: {
              title: 'Панель модератора',
              icon: 'fas fa-shield-alt',
              showInNav: true,
              roles: ['moderator', 'admin']
            }
          }
        ]
      },
      
      // Админ панель
      {
        path: 'admin',
        meta: {
          roles: ['admin']
        },
        children: [
          {
            path: '',
            name: 'AdminDashboard',
            component: AdminDashboard,
            meta: {
              title: 'Панель администратора',
              icon: 'fas fa-crown',
              showInNav: true,
              roles: ['admin']
            }
          },
          {
            path: 'users',
            name: 'UsersManagement',
            component: UsersManagement,
            meta: {
              title: 'Управление пользователями',
              roles: ['admin'],
              breadcrumbs: [
                { text: 'Администрирование', to: '/admin' },
                { text: 'Пользователи' }
              ]
            }
          },
          {
            path: 'events',
            name: 'EventsManagement',
            component: EventsManagement,
            meta: {
              title: 'Управление мероприятиями',
              roles: ['admin'],
              breadcrumbs: [
                { text: 'Администрирование', to: '/admin' },
                { text: 'Мероприятия' }
              ]
            }
          },
          {
            path: 'rewards',
            name: 'RewardsManagement',
            component: RewardsManagement,
            meta: {
              title: 'Управление наградами',
              roles: ['admin'],
              breadcrumbs: [
                { text: 'Администрирование', to: '/admin' },
                { text: 'Награды' }
              ]
            }
          },
          {
            path: 'purchases',
            name: 'PurchasesManagement',
            component: PurchasesManagement,
            meta: {
              title: 'Управление покупками',
              roles: ['admin'],
              breadcrumbs: [
                { text: 'Администрирование', to: '/admin' },
                { text: 'Покупки' }
              ]
            }
          },
          {
            path: 'registrations',
            name: 'RegistrationsManagement',
            component: RegistrationsManagement,
            meta: {
              title: 'Управление регистрациями',
              roles: ['admin'],
              breadcrumbs: [
                { text: 'Администрирование', to: '/admin' },
                { text: 'Регистрации' }
              ]
            }
          },
          {
            path: 'statistics',
            name: 'StatisticsPage',
            component: StatisticsPage,
            meta: {
              title: 'Статистика',
              roles: ['admin'],
              breadcrumbs: [
                { text: 'Администрирование', to: '/admin' },
                { text: 'Статистика' }
              ]
            }
          }
        ]
      }
    ]
  },
  
  // 404 страница
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      title: 'Страница не найдена'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()
  
  // Показываем лоадер
  appStore.setLoading(true)
  
  // Проверяем аутентификацию если требуется
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.checkAuth()
    
    if (!isAuthenticated) {
      appStore.setLoading(false)
      return next('/auth/login')
    }
    
    // Проверяем роли если требуется
    if (to.meta.roles && !authStore.canAccessRoute(to)) {
      appStore.setLoading(false)
      return next('/dashboard')
    }
  }
  
  // Перенаправляем аутентифицированных пользователей с гостевых страниц
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    appStore.setLoading(false)
    return next('/dashboard')
  }
  
  next()
})

router.afterEach((to) => {
  const appStore = useAppStore()
  
  // Устанавливаем заголовок страницы
  if (to.meta.title) {
    appStore.setPageTitle(to.meta.title)
  }
  
  // Устанавливаем хлебные крошки
  if (to.meta.breadcrumbs) {
    appStore.setBreadcrumbs(to.meta.breadcrumbs)
  } else {
    appStore.setBreadcrumbs([])
  }
  
  // Закрываем сайдбар на мобильных устройствах
  if (window.innerWidth < 992) {
    appStore.setSidebarOpen(false)
  }
  
  // Скрываем лоадер
  appStore.setLoading(false)
})

// Обработка ошибок навигации
router.onError((error) => {
  console.error('Ошибка навигации:', error)
  const appStore = useAppStore()
  appStore.setLoading(false)
})

export default router