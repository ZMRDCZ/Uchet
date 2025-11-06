<template>
  <header class="app-header navbar navbar-expand-lg navbar-dark bg-primary px-3 py-2">
    <div class="container-fluid">
      <!-- Кнопка сайдбара и логотип -->
      <div class="d-flex align-items-center">
        <button 
          class="btn btn-link text-white p-2 me-3 d-lg-none"
          @click="$emit('toggleSidebar')"
          type="button"
          aria-label="Открыть меню"
        >
          <i class="fas fa-bars"></i>
        </button>
        
        <router-link 
          to="/dashboard" 
          class="navbar-brand d-flex align-items-center text-decoration-none"
        >
          <i class="fas fa-building me-2"></i>
          <span class="fw-bold d-none d-sm-inline">Учёт активности</span>
        </router-link>
      </div>
      
      <!-- Центральный поиск (на больших экранах) -->
      <div class="navbar-search d-none d-lg-block flex-grow-1 mx-4">
        <div class="position-relative" style="max-width: 400px;">
          <input
            v-model="searchQuery"
            type="search"
            class="form-control bg-white bg-opacity-10 border-0 text-white placeholder-white-50"
            placeholder="Поиск мероприятий, наград..."
            @keyup.enter="performSearch"
            @input="onSearchInput"
          >
          <button 
            class="btn position-absolute end-0 top-0 text-white-50"
            style="border: none; background: none;"
            @click="performSearch"
            type="button"
          >
            <i class="fas fa-search"></i>
          </button>
          
          <!-- Выпадающий список результатов поиска -->
          <div 
            v-if="searchResults.length > 0 && showSearchResults"
            class="search-dropdown position-absolute w-100 mt-1 bg-white rounded shadow-lg border"
            style="z-index: 1050; max-height: 300px; overflow-y: auto;"
          >
            <div
              v-for="result in searchResults"
              :key="`${result.type}-${result.id}`"
              class="search-result-item p-3 border-bottom cursor-pointer"
              @click="selectSearchResult(result)"
            >
              <div class="d-flex align-items-center">
                <i :class="[getSearchResultIcon(result.type), 'me-2', 'text-primary']"></i>
                <div>
                  <div class="fw-medium text-dark">{{ result.title }}</div>
                  <small class="text-muted">{{ getSearchResultType(result.type) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Правая часть навигации -->
      <div class="navbar-nav d-flex flex-row align-items-center">
        <!-- Уведомления -->
        <div class="nav-item dropdown me-2">
          <button
            id="notificationsDropdown"
            class="btn btn-link text-white position-relative p-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            @click="loadNotifications"
          >
            <i class="fas fa-bell"></i>
            <span 
              v-if="unreadNotificationsCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style="font-size: 0.6rem;"
            >
              {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
            </span>
          </button>
          
          <div class="dropdown-menu dropdown-menu-end notification-dropdown">
            <div class="dropdown-header d-flex justify-content-between align-items-center">
              <span class="fw-medium">Уведомления</span>
              <button 
                v-if="notifications.length > 0"
                class="btn btn-sm btn-link text-muted p-0"
                @click="markAllAsRead"
              >
                Прочитать все
              </button>
            </div>
            
            <div class="dropdown-divider"></div>
            
            <div v-if="notificationsLoading" class="text-center p-3">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
              </div>
            </div>
            
            <div v-else-if="notifications.length === 0" class="text-center p-3 text-muted">
              Нет уведомлений
            </div>
            
            <div v-else class="notification-list" style="max-height: 300px; overflow-y: auto;">
              <div
                v-for="notification in notifications.slice(0, 10)"
                :key="notification.id"
                class="dropdown-item notification-item"
                :class="{ 'unread': !notification.isRead }"
                @click="markAsRead(notification)"
              >
                <div class="d-flex">
                  <div class="notification-icon me-2 mt-1">
                    <i :class="[getNotificationIcon(notification.type), 'text-primary']"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="notification-title fw-medium">{{ notification.title }}</div>
                    <div class="notification-message text-muted small">{{ notification.message }}</div>
                    <div class="notification-time text-muted small">
                      {{ formatRelativeTime(notification.createdAt) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="notifications.length > 10" class="dropdown-divider"></div>
            <router-link 
              v-if="notifications.length > 10"
              to="/notifications" 
              class="dropdown-item text-center text-primary"
            >
              Показать все уведомления
            </router-link>
          </div>
        </div>
        
        <!-- Профиль пользователя -->
        <div class="nav-item dropdown">
          <button
            id="userDropdown"
            class="btn btn-link text-white d-flex align-items-center p-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="user-avatar me-2">
              <div v-if="authStore.user?.avatar" class="avatar-image">
                <img :src="authStore.user.avatar" :alt="authStore.fullName" />
              </div>
              <div v-else class="avatar-initials">
                {{ authStore.initials }}
              </div>
            </div>
            <div class="d-none d-md-block text-start me-2">
              <div class="user-name">{{ authStore.fullName }}</div>
              <div class="user-role small opacity-75">{{ getRoleDisplayName(authStore.user?.role) }}</div>
            </div>
            <i class="fas fa-chevron-down small"></i>
          </button>
          
          <div class="dropdown-menu dropdown-menu-end user-dropdown">
            <div class="dropdown-header">
              <div class="d-flex align-items-center">
                <div class="user-avatar me-3">
                  <div v-if="authStore.user?.avatar" class="avatar-image">
                    <img :src="authStore.user.avatar" :alt="authStore.fullName" />
                  </div>
                  <div v-else class="avatar-initials">
                    {{ authStore.initials }}
                  </div>
                </div>
                <div>
                  <div class="fw-medium">{{ authStore.fullName }}</div>
                  <div class="text-muted small">{{ authStore.user?.email }}</div>
                  <div class="text-muted small">{{ getRoleDisplayName(authStore.user?.role) }}</div>
                </div>
              </div>
            </div>
            
            <div class="dropdown-divider"></div>
            
            <!-- Баланс баллов -->
            <div class="dropdown-item-text">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted">Баллы:</span>
                <span class="fw-bold text-primary">{{ formatNumber(authStore.user?.points || 0) }}</span>
              </div>
            </div>
            
            <div class="dropdown-divider"></div>
            
            <router-link to="/profile" class="dropdown-item">
              <i class="fas fa-user me-2"></i>
              Мой профиль
            </router-link>
            
            <router-link to="/profile/purchases" class="dropdown-item">
              <i class="fas fa-shopping-bag me-2"></i>
              Мои покупки
            </router-link>
            
            <router-link to="/profile/events" class="dropdown-item">
              <i class="fas fa-calendar me-2"></i>
              Мои мероприятия
            </router-link>
            
            <div class="dropdown-divider"></div>
            
            <!-- Переключатель темы -->
            <button class="dropdown-item" @click="toggleTheme">
              <i :class="[appStore.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon', 'me-2']"></i>
              {{ appStore.theme === 'dark' ? 'Светлая тема' : 'Темная тема' }}
            </button>
            
            <div class="dropdown-divider"></div>
            
            <button class="dropdown-item text-danger" @click="logout">
              <i class="fas fa-sign-out-alt me-2"></i>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { endpoints } from '@/services/api'

export default {
  name: 'AppHeader',
  emits: ['toggleSidebar'],
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    // Поиск
    const searchQuery = ref('')
    const searchResults = ref([])
    const showSearchResults = ref(false)
    
    // Уведомления
    const notifications = ref([])
    const notificationsLoading = ref(false)
    
    const unreadNotificationsCount = computed(() => 
      notifications.value.filter(n => !n.isRead).length
    )
    
    // Методы поиска
    const onSearchInput = async () => {
      if (searchQuery.value.length < 2) {
        searchResults.value = []
        showSearchResults.value = false
        return
      }
      
      // Здесь бы был API вызов для поиска
      // Пока используем заглушку
      showSearchResults.value = true
    }
    
    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          name: 'Search',
          query: { q: searchQuery.value.trim() }
        })
        showSearchResults.value = false
      }
    }
    
    const selectSearchResult = (result) => {
      showSearchResults.value = false
      searchQuery.value = ''
      
      if (result.type === 'event') {
        router.push(`/events/${result.id}`)
      } else if (result.type === 'reward') {
        router.push(`/rewards/${result.id}`)
      }
    }
    
    const getSearchResultIcon = (type) => {
      const icons = {
        event: 'fas fa-calendar-alt',
        reward: 'fas fa-gift',
        user: 'fas fa-user'
      }
      return icons[type] || 'fas fa-search'
    }
    
    const getSearchResultType = (type) => {
      const types = {
        event: 'Мероприятие',
        reward: 'Награда',
        user: 'Пользователь'
      }
      return types[type] || 'Результат'
    }
    
    // Методы уведомлений
    const loadNotifications = async () => {
      try {
        notificationsLoading.value = true
        // Здесь бы был API вызов для получения уведомлений
        // const response = await endpoints.notifications.list()
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
        // Здесь бы был API вызов для отметки как прочитанное
      }
      
      if (notification.actionUrl) {
        router.push(notification.actionUrl)
      }
    }
    
    const markAllAsRead = async () => {
      notifications.value.forEach(n => n.isRead = true)
      // Здесь бы был API вызов для отметки всех как прочитанные
      toast.success('Все уведомления отмечены как прочитанные')
    }
    
    const getNotificationIcon = (type) => {
      const icons = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle',
        event: 'fas fa-calendar',
        points: 'fas fa-coins',
        purchase: 'fas fa-shopping-bag'
      }
      return icons[type] || 'fas fa-bell'
    }
    
    // Утилиты
    const formatRelativeTime = (date) => {
      return appStore.formatRelativeDate(new Date(date))
    }
    
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }
    
    const getRoleDisplayName = (role) => {
      const roles = {
        user: 'Сотрудник',
        moderator: 'Модератор',
        admin: 'Администратор'
      }
      return roles[role] || 'Пользователь'
    }
    
    const toggleTheme = () => {
      appStore.toggleTheme()
    }
    
    const logout = async () => {
      try {
        await authStore.logout()
        toast.success('Вы успешно вышли из системы')
      } catch (error) {
        console.error('Ошибка выхода:', error)
        toast.error('Ошибка при выходе из системы')
      }
    }
    
    // Закрытие поиска при клике вне области
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-search')) {
        showSearchResults.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      
      // Загружаем уведомления при монтировании
      loadNotifications()
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      authStore,
      appStore,
      searchQuery,
      searchResults,
      showSearchResults,
      notifications,
      notificationsLoading,
      unreadNotificationsCount,
      
      onSearchInput,
      performSearch,
      selectSearchResult,
      getSearchResultIcon,
      getSearchResultType,
      
      loadNotifications,
      markAsRead,
      markAllAsRead,
      getNotificationIcon,
      
      formatRelativeTime,
      formatNumber,
      getRoleDisplayName,
      toggleTheme,
      logout
    }
  }
}
</script>

<style scoped>
.app-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-brand {
  font-size: 1.25rem;
  color: white !important;
}

.navbar-search input {
  border-radius: 2rem;
  padding: 0.5rem 3rem 0.5rem 1rem;
  transition: all 0.2s ease;
}

.navbar-search input:focus {
  background-color: rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

.navbar-search input::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}

.search-dropdown {
  z-index: 1050;
}

.search-result-item:hover {
  background-color: #f8f9fa;
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
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-dropdown .user-avatar {
  width: 40px;
  height: 40px;
}

.user-name {
  font-size: 0.875rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  line-height: 1.2;
}

.notification-dropdown {
  width: 320px;
  max-height: 400px;
}

.notification-item {
  border: none;
  padding: 0.75rem 1rem;
  white-space: normal;
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: #e3f2fd;
  border-left: 3px solid var(--bs-primary);
}

.notification-title {
  font-size: 0.875rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.8125rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
}

.notification-icon {
  width: 20px;
  text-align: center;
}

/* Анимации */
.dropdown-menu {
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .navbar-brand span {
    display: none;
  }
  
  .user-dropdown {
    width: 280px;
  }
  
  .notification-dropdown {
    width: 280px;
  }
}

@media (max-width: 575.98px) {
  .app-header .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .user-dropdown,
  .notification-dropdown {
    width: 260px;
  }
}

/* Темная тема */
[data-theme="dark"] .search-dropdown {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .search-result-item {
  color: #ffffff;
}

[data-theme="dark"] .search-result-item:hover {
  background-color: #404040;
}

[data-theme="dark"] .dropdown-menu {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .dropdown-item {
  color: #ffffff;
}

[data-theme="dark"] .dropdown-item:hover {
  background-color: #404040;
}

[data-theme="dark"] .notification-item.unread {
  background-color: #1a4b7a;
}
</style>