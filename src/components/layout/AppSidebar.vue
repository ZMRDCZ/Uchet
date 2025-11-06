<template>
  <aside 
    class="app-sidebar"
    :class="{ 'sidebar-open': isOpen }"
  >
    <div class="sidebar-content">
      <!-- Заголовок сайдбара -->
      <div class="sidebar-header">
        <router-link to="/dashboard" class="sidebar-brand">
          <div class="brand-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="brand-text">
            <div class="brand-title">Активность</div>
            <div class="brand-subtitle">Предприятия</div>
          </div>
        </router-link>
        
        <button 
          class="sidebar-close d-lg-none"
          @click="$emit('close')"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Пользователь -->
      <div class="sidebar-user">
        <div class="user-info d-flex align-items-center">
          <div class="user-avatar">
            <div v-if="authStore.user?.avatar" class="avatar-image">
              <img :src="authStore.user.avatar" :alt="authStore.fullName" />
            </div>
            <div v-else class="avatar-initials">
              {{ authStore.initials }}
            </div>
          </div>
          <div class="user-details">
            <div class="user-name">{{ getShortName(authStore.fullName) }}</div>
            <div class="user-role">{{ getRoleDisplayName(authStore.user?.role) }}</div>
            <div class="user-points">
              <i class="fas fa-coins text-warning"></i>
              {{ formatNumber(authStore.user?.points || 0) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Навигационное меню -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Основное</div>
          
          <router-link 
            to="/dashboard"
            class="nav-item"
            :class="{ active: $route.name === 'Dashboard' }"
          >
            <i class="nav-icon fas fa-home"></i>
            <span class="nav-text">Главная</span>
          </router-link>
          
          <router-link 
            to="/events"
            class="nav-item"
            :class="{ active: $route.path.startsWith('/events') }"
          >
            <i class="nav-icon fas fa-calendar-alt"></i>
            <span class="nav-text">Мероприятия</span>
            <span v-if="upcomingEventsCount > 0" class="nav-badge">
              {{ upcomingEventsCount }}
            </span>
          </router-link>
          
          <router-link 
            to="/rewards"
            class="nav-item"
            :class="{ active: $route.path.startsWith('/rewards') }"
          >
            <i class="nav-icon fas fa-gift"></i>
            <span class="nav-text">Награды</span>
          </router-link>
          
          <router-link 
            to="/leaderboard"
            class="nav-item"
            :class="{ active: $route.name === 'Leaderboard' }"
          >
            <i class="nav-icon fas fa-trophy"></i>
            <span class="nav-text">Рейтинг</span>
          </router-link>
        </div>
        
        <!-- Персональный раздел -->
        <div class="nav-section">
          <div class="nav-section-title">Личное</div>
          
          <router-link 
            to="/profile"
            class="nav-item"
            :class="{ active: $route.path.startsWith('/profile') }"
          >
            <i class="nav-icon fas fa-user"></i>
            <span class="nav-text">Мой профиль</span>
          </router-link>
          
          <router-link 
            to="/profile/events"
            class="nav-item"
            :class="{ active: $route.path === '/profile/events' }"
          >
            <i class="nav-icon fas fa-calendar-check"></i>
            <span class="nav-text">Мои мероприятия</span>
            <span v-if="myRegistrationsCount > 0" class="nav-badge">
              {{ myRegistrationsCount }}
            </span>
          </router-link>
          
          <router-link 
            to="/profile/purchases"
            class="nav-item"
            :class="{ active: $route.path === '/profile/purchases' }"
          >
            <i class="nav-icon fas fa-shopping-bag"></i>
            <span class="nav-text">Мои покупки</span>
          </router-link>
          
          <router-link 
            to="/profile/points"
            class="nav-item"
            :class="{ active: $route.path === '/profile/points' }"
          >
            <i class="nav-icon fas fa-coins"></i>
            <span class="nav-text">История баллов</span>
          </router-link>
        </div>
        
        <!-- Админ раздел -->
        <div v-if="authStore.isModerator" class="nav-section">
          <div class="nav-section-title">Управление</div>
          
          <router-link 
            to="/admin"
            class="nav-item"
            :class="{ active: $route.name === 'AdminDashboard' }"
          >
            <i class="nav-icon fas fa-cogs"></i>
            <span class="nav-text">Панель управления</span>
          </router-link>
          
          <router-link 
            to="/admin/events"
            class="nav-item"
            :class="{ active: $route.name === 'EventsManagement' }"
          >
            <i class="nav-icon fas fa-calendar-plus"></i>
            <span class="nav-text">Мероприятия</span>
          </router-link>
          
          <router-link 
            to="/admin/rewards"
            class="nav-item"
            :class="{ active: $route.name === 'RewardsManagement' }"
          >
            <i class="nav-icon fas fa-gift"></i>
            <span class="nav-text">Награды</span>
          </router-link>
          
          <router-link 
            to="/admin/registrations"
            class="nav-item"
            :class="{ active: $route.name === 'RegistrationsManagement' }"
          >
            <i class="nav-icon fas fa-user-check"></i>
            <span class="nav-text">Регистрации</span>
            <span v-if="pendingRegistrationsCount > 0" class="nav-badge bg-warning">
              {{ pendingRegistrationsCount }}
            </span>
          </router-link>
          
          <router-link 
            to="/admin/purchases"
            class="nav-item"
            :class="{ active: $route.name === 'PurchasesManagement' }"
          >
            <i class="nav-icon fas fa-shopping-cart"></i>
            <span class="nav-text">Покупки</span>
            <span v-if="pendingPurchasesCount > 0" class="nav-badge bg-warning">
              {{ pendingPurchasesCount }}
            </span>
          </router-link>
          
          <router-link 
            v-if="authStore.isAdmin"
            to="/admin/users"
            class="nav-item"
            :class="{ active: $route.name === 'UsersManagement' }"
          >
            <i class="nav-icon fas fa-users"></i>
            <span class="nav-text">Пользователи</span>
          </router-link>
          
          <router-link 
            v-if="authStore.isAdmin"
            to="/admin/statistics"
            class="nav-item"
            :class="{ active: $route.name === 'StatisticsPage' }"
          >
            <i class="nav-icon fas fa-chart-bar"></i>
            <span class="nav-text">Статистика</span>
          </router-link>
        </div>
        
        <!-- Быстрые действия -->
        <div class="nav-section">
          <div class="nav-section-title">Действия</div>
          
          <button 
            v-if="authStore.isModerator"
            class="nav-item nav-button"
            @click="createEvent"
          >
            <i class="nav-icon fas fa-plus"></i>
            <span class="nav-text">Создать мероприятие</span>
          </button>
          
          <button 
            v-if="authStore.isModerator"
            class="nav-item nav-button"
            @click="createReward"
          >
            <i class="nav-icon fas fa-plus"></i>
            <span class="nav-text">Создать награду</span>
          </button>
        </div>
      </nav>
      
      <!-- Футер сайдбара -->
      <div class="sidebar-footer">
        <div class="sidebar-version">
          <small class="text-muted">Версия 1.0.0</small>
        </div>
        
        <div class="sidebar-actions">
          <button 
            class="btn btn-sm btn-outline-secondary"
            @click="toggleTheme"
            :title="appStore.theme === 'dark' ? 'Светлая тема' : 'Темная тема'"
          >
            <i :class="appStore.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
          
          <button 
            class="btn btn-sm btn-outline-danger"
            @click="logout"
            title="Выйти"
          >
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

export default {
  name: 'AppSidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    // Счетчики для бейджей
    const upcomingEventsCount = ref(0)
    const myRegistrationsCount = ref(0)
    const pendingRegistrationsCount = ref(0)
    const pendingPurchasesCount = ref(0)
    
    // Методы
    const getShortName = (fullName) => {
      if (!fullName) return ''
      const parts = fullName.trim().split(' ')
      if (parts.length >= 2) {
        return `${parts[0]} ${parts[1][0]}.`
      }
      return fullName
    }
    
    const getRoleDisplayName = (role) => {
      const roles = {
        user: 'Сотрудник',
        moderator: 'Модератор',
        admin: 'Администратор'
      }
      return roles[role] || 'Пользователь'
    }
    
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }
    
    const createEvent = () => {
      emit('close')
      router.push('/events/create')
    }
    
    const createReward = () => {
      emit('close')
      router.push('/rewards/create')
    }
    
    const toggleTheme = () => {
      appStore.toggleTheme()
    }
    
    const logout = async () => {
      try {
        await authStore.logout()
        toast.success('Вы успешно вышли из системы')
      } catch (error) {
        toast.error('Ошибка при выходе из системы')
      }
    }
    
    // Загрузка счетчиков для бейджей
    const loadCounters = async () => {
      try {
        // Здесь будут API вызовы для получения счетчиков
        // upcomingEventsCount.value = await api.getUpcomingEventsCount()
        // myRegistrationsCount.value = await api.getMyRegistrationsCount()
        // и т.д.
      } catch (error) {
        console.error('Ошибка загрузки счетчиков:', error)
      }
    }
    
    onMounted(() => {
      loadCounters()
    })
    
    return {
      authStore,
      appStore,
      upcomingEventsCount,
      myRegistrationsCount,
      pendingRegistrationsCount,
      pendingPurchasesCount,
      
      getShortName,
      getRoleDisplayName,
      formatNumber,
      createEvent,
      createReward,
      toggleTheme,
      logout
    }
  }
}
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  top: 0;
  left: -280px;
  width: 280px;
  height: 100vh;
  background: white;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  transition: left 0.3s ease;
  overflow: hidden;
}

.app-sidebar.sidebar-open {
  left: 0;
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Заголовок */
.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.brand-text {
  line-height: 1.2;
}

.brand-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: #333;
}

.brand-subtitle {
  font-size: 0.8rem;
  color: #6c757d;
}

.sidebar-close {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.25rem;
  padding: 0.5rem;
  cursor: pointer;
}

/* Пользователь */
.sidebar-user {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bs-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #333;
  margin-bottom: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.user-points {
  font-size: 0.8rem;
  color: #f39c12;
  font-weight: 600;
}

/* Навигация */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6c757d;
  padding: 0.5rem 1rem;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-item:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
}

.nav-item.active {
  background-color: rgba(var(--bs-primary-rgb), 0.15);
  color: var(--bs-primary);
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--bs-primary);
}

.nav-icon {
  width: 20px;
  text-align: center;
  margin-right: 0.75rem;
  font-size: 1rem;
}

.nav-text {
  flex: 1;
  font-size: 0.875rem;
}

.nav-badge {
  background-color: var(--bs-primary);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.nav-badge.bg-warning {
  background-color: var(--bs-warning) !important;
  color: #000;
}

.nav-button {
  border: 1px dashed #dee2e6;
  margin: 0.25rem 1rem;
  border-radius: 0.5rem;
  justify-content: center;
}

.nav-button:hover {
  border-color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.05);
}

/* Футер сайдбара */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
}

.sidebar-version {
  text-align: center;
  margin-bottom: 0.5rem;
}

.sidebar-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.sidebar-actions .btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
}

/* Скроллбар */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Адаптивность */
@media (min-width: 992px) {
  .app-sidebar {
    position: relative;
    left: 0;
    box-shadow: none;
    border-right: 1px solid #e9ecef;
  }
  
  .sidebar-close {
    display: none;
  }
}

/* Темная тема */
[data-theme="dark"] .app-sidebar {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .sidebar-header,
[data-theme="dark"] .sidebar-user,
[data-theme="dark"] .sidebar-footer {
  border-color: #444444;
  background-color: #1a1a1a;
}

[data-theme="dark"] .brand-title {
  color: #ffffff;
}

[data-theme="dark"] .brand-subtitle {
  color: #adb5bd;
}

[data-theme="dark"] .user-name {
  color: #ffffff;
}

[data-theme="dark"] .nav-item {
  color: #adb5bd;
}

[data-theme="dark"] .nav-item:hover,
[data-theme="dark"] .nav-item.active {
  color: #ffffff;
}

[data-theme="dark"] .nav-section-title {
  color: #6c757d;
}

/* Анимации */
.nav-item {
  transition: all 0.2s ease;
}

.nav-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Состояния загрузки */
.sidebar-nav.loading {
  opacity: 0.6;
}

.sidebar-nav.loading .nav-item {
  pointer-events: none;
}
</style>