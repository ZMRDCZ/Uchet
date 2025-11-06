<template>
  <nav class="app-navbar navbar navbar-expand-lg">
    <div class="container-fluid">
      <!-- Бренд -->
      <router-link class="navbar-brand" to="/dashboard">
        <div class="brand-logo">
          <i class="fas fa-building"></i>
        </div>
        <span class="brand-text">Учёт активности</span>
      </router-link>

      <!-- Кнопка для мобильного меню -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Переключить навигацию"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Основное меню -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Основные пункты меню -->
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/dashboard"
              :class="{ active: $route.name === 'Dashboard' }"
            >
              <i class="fas fa-home me-1"></i>
              Главная
            </router-link>
          </li>

          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/events"
              :class="{ active: $route.path.startsWith('/events') }"
            >
              <i class="fas fa-calendar-alt me-1"></i>
              Мероприятия
              <span v-if="counters.upcomingEvents > 0" class="nav-badge">
                {{ counters.upcomingEvents }}
              </span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/rewards"
              :class="{ active: $route.path.startsWith('/rewards') }"
            >
              <i class="fas fa-gift me-1"></i>
              Награды
            </router-link>
          </li>

          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/leaderboard"
              :class="{ active: $route.name === 'Leaderboard' }"
            >
              <i class="fas fa-trophy me-1"></i>
              Рейтинг
            </router-link>
          </li>

          <!-- Выпадающее меню для администраторов -->
          <li v-if="authStore.isModerator" class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
              :class="{ active: $route.path.startsWith('/admin') }"
            >
              <i class="fas fa-cogs me-1"></i>
              Управление
              <span v-if="counters.pendingItems > 0" class="nav-badge bg-warning">
                {{ counters.pendingItems }}
              </span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/admin">
                  <i class="fas fa-tachometer-alt me-2"></i>
                  Панель управления
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item" to="/admin/events">
                  <i class="fas fa-calendar-plus me-2"></i>
                  Мероприятия
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/rewards">
                  <i class="fas fa-gift me-2"></i>
                  Награды
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/registrations">
                  <i class="fas fa-user-check me-2"></i>
                  Регистрации
                  <span v-if="counters.pendingRegistrations > 0" class="badge bg-warning ms-1">
                    {{ counters.pendingRegistrations }}
                  </span>
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/purchases">
                  <i class="fas fa-shopping-cart me-2"></i>
                  Покупки
                  <span v-if="counters.pendingPurchases > 0" class="badge bg-warning ms-1">
                    {{ counters.pendingPurchases }}
                  </span>
                </router-link>
              </li>
              <li v-if="authStore.isAdmin"><hr class="dropdown-divider"></li>
              <li v-if="authStore.isAdmin">
                <router-link class="dropdown-item" to="/admin/users">
                  <i class="fas fa-users me-2"></i>
                  Пользователи
                </router-link>
              </li>
              <li v-if="authStore.isAdmin">
                <router-link class="dropdown-item" to="/admin/statistics">
                  <i class="fas fa-chart-bar me-2"></i>
                  Статистика
                </router-link>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Правая часть навигации -->
        <ul class="navbar-nav">
          <!-- Поиск -->
          <li class="nav-item d-none d-lg-block">
            <form class="d-flex" @submit.prevent="performSearch">
              <div class="search-container">
                <input 
                  v-model="searchQuery"
                  class="form-control search-input" 
                  type="search" 
                  placeholder="Поиск..."
                  aria-label="Поиск"
                >
                <button class="search-btn" type="submit">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </form>
          </li>

          <!-- Уведомления -->
          <li class="nav-item dropdown">
            <a 
              class="nav-link position-relative" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="loadNotifications"
            >
              <i class="fas fa-bell"></i>
              <span 
                v-if="counters.unreadNotifications > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ counters.unreadNotifications > 9 ? '9+' : counters.unreadNotifications }}
              </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end notification-dropdown">
              <li class="dropdown-header d-flex justify-content-between">
                <span>Уведомления</span>
                <button 
                  v-if="notifications.length > 0"
                  class="btn btn-sm btn-link p-0"
                  @click="markAllAsRead"
                >
                  Прочитать все
                </button>
              </li>
              <li><hr class="dropdown-divider"></li>
              
              <li v-if="notificationsLoading" class="text-center p-3">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Загрузка...</span>
                </div>
              </li>
              
              <li v-else-if="notifications.length === 0" class="text-center p-3 text-muted">
                Нет уведомлений
              </li>
              
              <template v-else>
                <li v-for="notification in notifications.slice(0, 5)" :key="notification.id">
                  <a 
                    class="dropdown-item notification-item" 
                    href="#"
                    :class="{ 'unread': !notification.isRead }"
                    @click.prevent="markAsRead(notification)"
                  >
                    <div class="d-flex">
                      <div class="notification-icon me-2">
                        <i :class="getNotificationIcon(notification.type)"></i>
                      </div>
                      <div class="flex-grow-1">
                        <div class="notification-title">{{ notification.title }}</div>
                        <div class="notification-time small text-muted">
                          {{ formatRelativeTime(notification.createdAt) }}
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
                
                <li v-if="notifications.length > 5"><hr class="dropdown-divider"></li>
                <li v-if="notifications.length > 5">
                  <router-link class="dropdown-item text-center" to="/notifications">
                    Показать все
                  </router-link>
                </li>
              </template>
            </ul>
          </li>

          <!-- Профиль пользователя -->
          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="user-avatar me-2">
                <div v-if="authStore.user?.avatar" class="avatar-image">
                  <img :src="authStore.user.avatar" :alt="authStore.fullName">
                </div>
                <div v-else class="avatar-initials">
                  {{ authStore.initials }}
                </div>
              </div>
              <span class="d-none d-md-inline">{{ getShortName(authStore.fullName) }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="dropdown-header">
                <div class="user-info">
                  <div class="user-name">{{ authStore.fullName }}</div>
                  <div class="user-email small text-muted">{{ authStore.user?.email }}</div>
                  <div class="user-points small">
                    <i class="fas fa-coins text-warning"></i>
                    {{ formatNumber(authStore.user?.points || 0) }} баллов
                  </div>
                </div>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item" to="/profile">
                  <i class="fas fa-user me-2"></i>
                  Мой профиль
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/profile/events">
                  <i class="fas fa-calendar me-2"></i>
                  Мои мероприятия
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/profile/purchases">
                  <i class="fas fa-shopping-bag me-2"></i>
                  Мои покупки
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item" @click="toggleTheme">
                  <i :class="[appStore.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon', 'me-2']"></i>
                  {{ appStore.theme === 'dark' ? 'Светлая тема' : 'Темная тема' }}
                </button>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger" @click="logout">
                  <i class="fas fa-sign-out-alt me-2"></i>
                  Выйти
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

export default {
  name: 'AppNavbar',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    // Данные
    const searchQuery = ref('')
    const notifications = ref([])
    const notificationsLoading = ref(false)
    
    const counters = ref({
      upcomingEvents: 0,
      unreadNotifications: 0,
      pendingRegistrations: 0,
      pendingPurchases: 0,
      pendingItems: 0
    })

    let countersIntervalId = null
    
    // Вычисляемые свойства
    // Методы
    const getShortName = (fullName) => {
      if (!fullName) return ''
      const parts = fullName.trim().split(' ')
      return parts.length >= 2 ? `${parts[0]} ${parts[1][0]}.` : fullName
    }
    
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }
    
    const formatRelativeTime = (date) => {
      return appStore.formatRelativeDate(new Date(date))
    }
    
    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          name: 'Search',
          query: { q: searchQuery.value.trim() }
        })
        searchQuery.value = ''
      }
    }
    
    const loadNotifications = async () => {
      try {
        notificationsLoading.value = true
        // Здесь будет API вызов
        // const response = await api.get('/notifications')
        // notifications.value = response.data.notifications
      } catch (error) {
        console.error('Ошибка загрузки уведомлений:', error)
      } finally {
        notificationsLoading.value = false
      }
    }
    
    const markAsRead = async (notification) => {
      if (!notification.isRead) {
        notification.isRead = true
        counters.value.unreadNotifications--
        // Здесь будет API вызов
      }
      
      if (notification.actionUrl) {
        router.push(notification.actionUrl)
      }
    }
    
    const markAllAsRead = async () => {
      notifications.value.forEach(n => n.isRead = true)
      counters.value.unreadNotifications = 0
      toast.success('Все уведомления отмечены как прочитанные')
    }
    
    const getNotificationIcon = (type) => {
      const icons = {
        info: 'fas fa-info-circle text-info',
        success: 'fas fa-check-circle text-success',
        warning: 'fas fa-exclamation-triangle text-warning',
        error: 'fas fa-times-circle text-danger',
        event: 'fas fa-calendar text-primary',
        points: 'fas fa-coins text-warning',
        purchase: 'fas fa-shopping-bag text-info'
      }
      return icons[type] || 'fas fa-bell text-secondary'
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
    
    const loadCounters = async () => {
      try {
        // Здесь будут API вызовы для получения счетчиков
        counters.value = {
          upcomingEvents: Math.floor(Math.random() * 10),
          unreadNotifications: Math.floor(Math.random() * 5),
          pendingRegistrations: Math.floor(Math.random() * 3),
          pendingPurchases: Math.floor(Math.random() * 2),
          pendingItems: 0
        }
        
        counters.value.pendingItems = counters.value.pendingRegistrations + counters.value.pendingPurchases
      } catch (error) {
        console.error('Ошибка загрузки счетчиков:', error)
      }
    }
    
    onMounted(() => {
      loadCounters()
      
      // Обновляем счетчики каждые 30 секунд
      countersIntervalId = setInterval(loadCounters, 30000)
    })

    onUnmounted(() => {
      if (countersIntervalId) {
        clearInterval(countersIntervalId)
      }
    })
    
    return {
      authStore,
      appStore,
      searchQuery,
      notifications,
      notificationsLoading,
      counters,
      
      getShortName,
      formatNumber,
      formatRelativeTime,
      performSearch,
      loadNotifications,
      markAsRead,
      markAllAsRead,
      getNotificationIcon,
      toggleTheme,
      logout
    }
  }
}
</script>

<style scoped>
.app-navbar {
  background: var(--gradient-primary) !important;
  box-shadow: var(--shadow-primary);
  padding: 0.75rem 0;
  border: none;
}

.navbar-brand {
  color: var(--white) !important;
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-family: 'Arial', sans-serif;
}

.brand-logo {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.brand-text {
  font-size: 1.1rem;
  font-weight: 700;
}

.navbar-toggler {
  border: none;
  padding: 0.25rem 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 700;
  padding: 0.75rem 1rem !important;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.nav-link:hover,
.nav-link.active {
  color: var(--white) !important;
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.nav-badge {
  background-color: var(--danger);
  color: var(--white);
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 0.75rem;
  margin-left: 0.5rem;
  min-width: 1.2rem;
  text-align: center;
  font-weight: 700;
}

.nav-badge.bg-warning {
  background-color: var(--warning) !important;
  color: var(--white);
}

.search-container {
  position: relative;
  width: 250px;
}

.search-input {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--white);
  padding-right: 2.5rem;
  font-family: 'Arial', sans-serif;
  font-weight: 400;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  color: var(--white);
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.25rem;
}

.search-btn:hover {
  color: var(--white);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: var(--white);
  font-weight: 700;
  font-size: 0.85rem;
  font-family: 'Arial', sans-serif;
}

.dropdown-menu {
  border: none;
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius-lg);
  font-family: 'Arial', sans-serif;
}

.notification-dropdown {
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  border: none;
  padding: 0.75rem 1rem;
  white-space: normal;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background-color: var(--light-gray);
}

.notification-item.unread {
  background-color: rgba(0, 38, 100, 0.1);
  border-left: 3px solid var(--primary-blue);
}

.notification-title {
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.notification-icon {
  width: 20px;
  text-align: center;
}

.user-info {
  min-width: 200px;
}

.user-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.user-email {
  margin-bottom: 0.25rem;
  color: var(--text-secondary);
}

.user-points {
  color: var(--warning);
  font-weight: 700;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .search-container {
    width: 100%;
    margin: 0.5rem 0;
  }
  
  .nav-link {
    padding: 0.75rem 1rem !important;
  }
  
  .notification-dropdown {
    width: 280px;
  }
}

@media (max-width: 767.98px) {
  .brand-text {
    display: none;
  }
  
  .notification-dropdown {
    width: 260px;
  }
}

/* Темная тема */
[data-theme="dark"] .dropdown-menu {
  background-color: var(--gray-blue-dark);
  border-color: var(--gray-blue-light);
}

[data-theme="dark"] .dropdown-item {
  color: var(--white);
}

[data-theme="dark"] .dropdown-item:hover {
  background-color: var(--gray-blue-light);
}

[data-theme="dark"] .notification-item.unread {
  background-color: rgba(0, 38, 100, 0.3);
}

[data-theme="dark"] .notification-item:hover {
  background-color: var(--gray-blue-light);
}

[data-theme="dark"] .notification-title {
  color: var(--white);
}

[data-theme="dark"] .user-name {
  color: var(--white);
}

[data-theme="dark"] .user-email {
  color: var(--gray-blue-light);
}

/* Анимации */
.nav-link {
  transition: all 0.3s ease;
}

.nav-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Улучшения доступности */
.nav-link:focus {
  outline: 2px solid var(--accent-orange);
  outline-offset: 2px;
}

.dropdown-item:focus {
  background-color: var(--primary-blue);
  color: var(--white);
}

/* Корпоративные акценты */
.nav-link i {
  color: var(--accent-orange);
  margin-right: 0.5rem;
}

.nav-link:hover i,
.nav-link.active i {
  color: var(--white);
}
</style>