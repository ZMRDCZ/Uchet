<template>
  <div class="profile-page">
    <!-- Заголовок профиля -->
    <div class="profile-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-8">
          <div class="profile-info d-flex align-items-center">
            <div class="profile-avatar me-3">
              <div v-if="authStore.user?.avatar" class="avatar-image">
                <img :src="authStore.user.avatar" :alt="fullName" />
              </div>
              <div v-else class="avatar-initials">
                {{ initials }}
              </div>
              <button class="avatar-edit-btn" @click="showAvatarModal = true">
                <i class="fas fa-camera"></i>
              </button>
            </div>
            <div class="profile-details">
              <h1 class="profile-name mb-2">{{ fullName }}</h1>
              <div class="profile-meta">
                <span class="profile-role">
                  <i class="fas fa-user-tag me-1"></i>
                  {{ getRoleDisplayName(authStore.user?.role) }}
                </span>
                <span v-if="authStore.user?.department" class="profile-department">
                  <i class="fas fa-building me-1"></i>
                  {{ authStore.user.department }}
                </span>
                <span v-if="authStore.user?.position" class="profile-position">
                  <i class="fas fa-briefcase me-1"></i>
                  {{ authStore.user.position }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="profile-actions">
            <button class="btn btn-outline-primary me-2" @click="showEditModal = true">
              <i class="fas fa-edit me-2"></i>
              Редактировать
            </button>
            <div class="dropdown d-inline-block">
              <button 
                class="btn btn-secondary dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-cog"></i>
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="changePassword">
                    <i class="fas fa-key me-2"></i>
                    Сменить пароль
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="toggleNotifications">
                    <i class="fas fa-bell me-2"></i>
                    Настройки уведомлений
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                    <i class="fas fa-sign-out-alt me-2"></i>
                    Выйти
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Статистические карточки -->
    <div class="profile-stats mb-4">
      <div class="row g-3">
        <div class="col-lg-3 col-md-6">
          <div class="stat-card points-card">
            <div class="stat-icon">
              <i class="fas fa-coins"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ formatNumber(userStats.totalPoints) }}</h3>
              <p class="stat-label">Всего баллов заработано</p>
              <div class="stat-change">
                <i class="fas fa-coins text-warning me-1"></i>
                {{ formatNumber(authStore.user?.points || 0) }} доступно
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="stat-card events-card">
            <div class="stat-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ userStats.eventsAttended }}</h3>
              <p class="stat-label">Мероприятий посещено</p>
              <div class="stat-change">
                <i class="fas fa-calendar text-info me-1"></i>
                {{ userStats.eventsRegistered }} зарегистрировано
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="stat-card purchases-card">
            <div class="stat-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ userStats.purchasesMade }}</h3>
              <p class="stat-label">Покупок совершено</p>
              <div class="stat-change">
                <i class="fas fa-coins text-success me-1"></i>
                {{ formatNumber(userStats.pointsSpent) }} потрачено
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="stat-card rank-card">
            <div class="stat-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">#{{ userStats.currentRank || '-' }}</h3>
              <p class="stat-label">Место в рейтинге</p>
              <div class="stat-change">
                <i class="fas fa-chart-line me-1"></i>
                {{ userStats.rankChange > 0 ? '+' : '' }}{{ userStats.rankChange || 0 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Навигационные табы -->
    <div class="profile-navigation mb-4">
      <ul class="nav nav-pills" role="tablist">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link active" 
            data-bs-toggle="pill" 
            data-bs-target="#overview-tab"
            type="button" 
            role="tab"
          >
            <i class="fas fa-chart-pie me-2"></i>
            Обзор
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            data-bs-toggle="pill" 
            data-bs-target="#events-tab"
            type="button" 
            role="tab"
          >
            <i class="fas fa-calendar me-2"></i>
            Мероприятия
            <span v-if="userStats.eventsRegistered > 0" class="nav-badge">
              {{ userStats.eventsRegistered }}
            </span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            data-bs-toggle="pill" 
            data-bs-target="#purchases-tab"
            type="button" 
            role="tab"
          >
            <i class="fas fa-shopping-cart me-2"></i>
            Покупки
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            data-bs-toggle="pill" 
            data-bs-target="#points-tab"
            type="button" 
            role="tab"
          >
            <i class="fas fa-coins me-2"></i>
            История баллов
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            data-bs-toggle="pill" 
            data-bs-target="#achievements-tab"
            type="button" 
            role="tab"
          >
            <i class="fas fa-medal me-2"></i>
            Достижения
          </button>
        </li>
      </ul>
    </div>

    <!-- Содержимое табов -->
    <div class="tab-content">
      <!-- Обзор -->
      <div class="tab-pane fade show active" id="overview-tab" role="tabpanel">
        <div class="row">
          <div class="col-lg-8">
            <!-- График активности -->
            <div class="profile-card activity-chart-card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-chart-line me-2"></i>
                  Активность по месяцам
                </h5>
              </div>
              <div class="card-body">
                <canvas id="activityChart" width="400" height="200"></canvas>
              </div>
            </div>

            <!-- Последние мероприятия -->
            <div class="profile-card recent-events-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i class="fas fa-calendar-alt me-2"></i>
                  Последние мероприятия
                </h5>
                <router-link to="/profile/events" class="btn btn-sm btn-outline-primary">
                  Все мероприятия
                </router-link>
              </div>
              <div class="card-body">
                <div v-if="recentEvents.length === 0" class="empty-state text-center py-4">
                  <i class="fas fa-calendar-times text-muted mb-3" style="font-size: 2rem;"></i>
                  <p class="text-muted">Нет участий в мероприятиях</p>
                </div>
                <div v-else class="events-timeline">
                  <div 
                    v-for="event in recentEvents.slice(0, 5)" 
                    :key="event.id"
                    class="timeline-item"
                  >
                    <div class="timeline-marker" :class="getEventStatusClass(event.status)"></div>
                    <div class="timeline-content">
                      <h6 class="timeline-title">{{ event.title }}</h6>
                      <p class="timeline-date">{{ formatDate(event.date) }}</p>
                      <span class="timeline-status" :class="getEventStatusClass(event.status)">
                        {{ getEventStatusLabel(event.status) }}
                      </span>
                      <span v-if="event.pointsEarned" class="timeline-points">
                        +{{ event.pointsEarned }} баллов
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <!-- Профиль завершенности -->
            <div class="profile-card completion-card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-user-check me-2"></i>
                  Заполненность профиля
                </h5>
              </div>
              <div class="card-body text-center">
                <div class="completion-circle mb-3">
                  <div class="circle-progress" :style="{ '--progress': profileCompletion }">
                    <span class="progress-text">{{ profileCompletion }}%</span>
                  </div>
                </div>
                <div class="completion-items">
                  <div 
                    v-for="item in completionItems" 
                    :key="item.key"
                    class="completion-item"
                    :class="{ completed: item.completed }"
                  >
                    <i :class="item.completed ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                    <span>{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Быстрые ссылки -->
            <div class="profile-card quick-links-card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-external-link-alt me-2"></i>
                  Быстрые действия
                </h5>
              </div>
              <div class="card-body">
                <div class="quick-links">
                  <router-link to="/events" class="quick-link">
                    <i class="fas fa-calendar-plus"></i>
                    <span>Найти мероприятие</span>
                  </router-link>
                  <router-link to="/rewards" class="quick-link">
                    <i class="fas fa-gift"></i>
                    <span>Обменять баллы</span>
                  </router-link>
                  <router-link to="/leaderboard" class="quick-link">
                    <i class="fas fa-trophy"></i>
                    <span>Посмотреть рейтинг</span>
                  </router-link>
                  <a href="#" class="quick-link" @click.prevent="downloadReport">
                    <i class="fas fa-download"></i>
                    <span>Скачать отчет</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Мероприятия -->
      <div class="tab-pane fade" id="events-tab" role="tabpanel">
        <ProfileEventsTab />
      </div>

      <!-- Покупки -->
      <div class="tab-pane fade" id="purchases-tab" role="tabpanel">
        <ProfilePurchasesTab />
      </div>

      <!-- История баллов -->
      <div class="tab-pane fade" id="points-tab" role="tabpanel">
        <ProfilePointsTab />
      </div>

      <!-- Достижения -->
      <div class="tab-pane fade" id="achievements-tab" role="tabpanel">
        <ProfileAchievementsTab />
      </div>
    </div>

    <!-- Модальное окно редактирования профиля -->
    <ProfileEditModal 
      v-model="showEditModal"
      :user="authStore.user"
      @updated="handleProfileUpdate"
    />

    <!-- Модальное окно загрузки аватара -->
    <AvatarUploadModal 
      v-model="showAvatarModal"
      @uploaded="handleAvatarUpdate"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import ProfileEventsTab from '@/components/profile/ProfileEventsTab.vue'
import ProfilePurchasesTab from '@/components/profile/ProfilePurchasesTab.vue'
import ProfilePointsTab from '@/components/profile/ProfilePointsTab.vue'
import ProfileAchievementsTab from '@/components/profile/ProfileAchievementsTab.vue'
import ProfileEditModal from '@/components/profile/ProfileEditModal.vue'
import AvatarUploadModal from '@/components/profile/AvatarUploadModal.vue'

export default {
  name: 'ProfilePage',
  components: {
    ProfileEventsTab,
    ProfilePurchasesTab,
    ProfilePointsTab,
    ProfileAchievementsTab,
    ProfileEditModal,
    AvatarUploadModal
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    const appStore = useAppStore()

    // Состояние
    const showEditModal = ref(false)
    const showAvatarModal = ref(false)
    
    const userStats = ref({
      totalPoints: 0,
      eventsAttended: 0,
      eventsRegistered: 0,
      purchasesMade: 0,
      pointsSpent: 0,
      currentRank: null,
      rankChange: 0
    })

    const recentEvents = ref([])

    // Вычисляемые свойства
    const fullName = computed(() => {
      const user = authStore.user
      if (!user) return ''
      const parts = [user.lastName, user.firstName, user.middleName].filter(Boolean)
      return parts.join(' ')
    })

    const initials = computed(() => {
      const user = authStore.user
      if (!user) return ''
      const firstInitial = user.firstName?.[0] || ''
      const lastInitial = user.lastName?.[0] || ''
      return (firstInitial + lastInitial).toUpperCase()
    })

    const profileCompletion = computed(() => {
      const user = authStore.user
      if (!user) return 0
      
      let completed = 0
      const total = completionItems.value.length
      
      completionItems.value.forEach(item => {
        if (item.completed) completed++
      })
      
      return Math.round((completed / total) * 100)
    })

    const completionItems = computed(() => {
      const user = authStore.user
      if (!user) return []
      
      return [
        {
          key: 'basic_info',
          label: 'Основная информация',
          completed: !!(user.firstName && user.lastName && user.email)
        },
        {
          key: 'avatar',
          label: 'Фото профиля',
          completed: !!user.avatar
        },
        {
          key: 'contacts',
          label: 'Контактные данные',
          completed: !!user.phone
        },
        {
          key: 'work_info',
          label: 'Рабочая информация',
          completed: !!(user.department && user.position)
        },
        {
          key: 'first_event',
          label: 'Первое мероприятие',
          completed: userStats.value.eventsAttended > 0
        },
        {
          key: 'first_purchase',
          label: 'Первая покупка',
          completed: userStats.value.purchasesMade > 0
        }
      ]
    })

    // Методы
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }

    const formatDate = (date) => {
      return appStore.formatDate(date, 'dd MMM yyyy')
    }

    const getRoleDisplayName = (role) => {
      const roles = {
        user: 'Сотрудник',
        moderator: 'Модератор',
        admin: 'Администратор'
      }
      return roles[role] || 'Пользователь'
    }

    const getEventStatusClass = (status) => {
      const classes = {
        attended: 'status-success',
        registered: 'status-info',
        cancelled: 'status-warning',
        missed: 'status-danger'
      }
      return classes[status] || 'status-default'
    }

    const getEventStatusLabel = (status) => {
      const labels = {
        attended: 'Посещено',
        registered: 'Зарегистрирован',
        cancelled: 'Отменено',
        missed: 'Пропущено'
      }
      return labels[status] || 'Неизвестно'
    }

    const loadUserStats = async () => {
      try {
        // Здесь будет API вызов
        // const response = await api.get('/users/me/stats')
        // userStats.value = response.data
        
        // Заглушка с демо данными
        userStats.value = {
          totalPoints: Math.floor(Math.random() * 5000) + 1000,
          eventsAttended: Math.floor(Math.random() * 30) + 5,
          eventsRegistered: Math.floor(Math.random() * 10) + 2,
          purchasesMade: Math.floor(Math.random() * 20) + 3,
          pointsSpent: Math.floor(Math.random() * 2000) + 500,
          currentRank: Math.floor(Math.random() * 100) + 1,
          rankChange: Math.floor(Math.random() * 21) - 10
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики пользователя:', error)
      }
    }

    const loadRecentEvents = async () => {
      try {
        // Здесь будет API вызов
        // const response = await api.get('/users/me/events/recent')
        // recentEvents.value = response.data
        
        // Заглушка с демо данными
        recentEvents.value = [
          {
            id: '1',
            title: 'Тренинг по лидерству',
            date: new Date(Date.now() - 86400000 * 2),
            status: 'attended',
            pointsEarned: 100
          },
          {
            id: '2',
            title: 'Корпоративный хакатон',
            date: new Date(Date.now() - 86400000 * 7),
            status: 'attended',
            pointsEarned: 200
          },
          {
            id: '3',
            title: 'Обучение по безопасности',
            date: new Date(Date.now() + 86400000 * 3),
            status: 'registered',
            pointsEarned: null
          }
        ]
      } catch (error) {
        console.error('Ошибка загрузки недавних мероприятий:', error)
      }
    }

    const createActivityChart = () => {
      // Здесь будет создание графика с Chart.js
      const canvas = document.getElementById('activityChart')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#e9ecef'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#333'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('График активности', canvas.width/2, canvas.height/2)
      }
    }

    const handleProfileUpdate = (updatedUser) => {
      authStore.updateUser(updatedUser)
      toast.success('Профиль успешно обновлен')
    }

    const handleAvatarUpdate = (avatarUrl) => {
      authStore.updateUser({ ...authStore.user, avatar: avatarUrl })
      toast.success('Фото профиля обновлено')
    }

    const changePassword = () => {
      // Открыть модальное окно смены пароля
      toast.info('Функция смены пароля будет доступна в следующей версии')
    }

    const toggleNotifications = () => {
      // Открыть настройки уведомлений
      toast.info('Настройки уведомлений будут доступны в следующей версии')
    }

    const downloadReport = () => {
      // Скачать отчет активности
      toast.info('Скачивание отчета будет доступно в следующей версии')
    }

    const logout = async () => {
      try {
        await authStore.logout()
        router.push('/login')
        toast.success('Вы успешно вышли из системы')
      } catch (error) {
        toast.error('Ошибка при выходе из системы')
      }
    }

    // Инициализация
    onMounted(async () => {
      appStore.setPageTitle('Мой профиль')
      
      await Promise.all([
        loadUserStats(),
        loadRecentEvents()
      ])

      setTimeout(createActivityChart, 100)
    })

    return {
      authStore,
      showEditModal,
      showAvatarModal,
      userStats,
      recentEvents,
      fullName,
      initials,
      profileCompletion,
      completionItems,
      
      formatNumber,
      formatDate,
      getRoleDisplayName,
      getEventStatusClass,
      getEventStatusLabel,
      handleProfileUpdate,
      handleAvatarUpdate,
      changePassword,
      toggleNotifications,
      downloadReport,
      logout
    }
  }
}
</script>

<style scoped>
.profile-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Заголовок профиля */
.profile-header {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: var(--bs-primary);
  border: 3px solid white;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.avatar-edit-btn:hover {
  background: #0056b3;
  transform: scale(1.1);
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 1rem;
  opacity: 0.9;
}

.profile-role,
.profile-department,
.profile-position {
  display: flex;
  align-items: center;
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Статистические карточки */
.profile-stats {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-right: 1rem;
  flex-shrink: 0;
}

.points-card .stat-icon {
  background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
}

.events-card .stat-icon {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
}

.purchases-card .stat-icon {
  background: linear-gradient(135deg, #198754 0%, #20c997 100%);
}

.rank-card .stat-icon {
  background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #333;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.8rem;
  color: #6c757d;
  display: flex;
  align-items: center;
}

/* Навигация */
.profile-navigation {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.nav-pills .nav-link {
  border-radius: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  position: relative;
}

.nav-pills .nav-link:hover {
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
}

.nav-pills .nav-link.active {
  background: var(--bs-primary);
  color: white;
}

.nav-badge {
  background: #dc3545;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 0.75rem;
  margin-left: 0.5rem;
  min-width: 1.2rem;
  text-align: center;
}

.nav-link.active .nav-badge {
  background: rgba(255, 255, 255, 0.3);
}

/* Карточки контента */
.profile-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.card-body {
  padding: 1.5rem;
}

/* Timeline мероприятий */
.events-timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  margin-bottom: 1.5rem;
  position: relative;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 1rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.timeline-marker.status-success {
  background: #198754;
}

.timeline-marker.status-info {
  background: #0dcaf0;
}

.timeline-marker.status-warning {
  background: #ffc107;
}

.timeline-marker.status-danger {
  background: #dc3545;
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #333;
}

.timeline-date {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.timeline-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
  margin-right: 0.5rem;
}

.timeline-status.status-success {
  background: #d1eddf;
  color: #0f5132;
}

.timeline-status.status-info {
  background: #cff4fc;
  color: #055160;
}

.timeline-status.status-warning {
  background: #fff3cd;
  color: #664d03;
}

.timeline-status.status-danger {
  background: #f8d7da;
  color: #58151c;
}

.timeline-points {
  font-size: 0.8rem;
  color: #ffc107;
  font-weight: 600;
}

/* Завершенность профиля */
.completion-circle {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.circle-progress {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    var(--bs-primary) calc(var(--progress) * 1%),
    #e9ecef calc(var(--progress) * 1%)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.circle-progress::before {
  content: '';
  position: absolute;
  width: 80%;
  height: 80%;
  background: white;
  border-radius: 50%;
}

.progress-text {
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bs-primary);
}

.completion-items {
  text-align: left;
}

.completion-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  color: #6c757d;
}

.completion-item.completed {
  color: #198754;
}

.completion-item i {
  margin-right: 0.75rem;
  width: 16px;
}

/* Быстрые ссылки */
.quick-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
}

.quick-link:hover {
  color: var(--bs-primary);
  border-color: var(--bs-primary);
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.quick-link i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.quick-link span {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .profile-header {
    padding: 1.5rem;
    text-align: center;
  }
  
  .profile-info {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar {
    margin-bottom: 1rem;
  }
  
  .profile-meta {
    justify-content: center;
  }
  
  .profile-actions {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 767.98px) {
  .profile-name {
    font-size: 1.5rem;
  }
  
  .profile-meta {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .nav-pills {
    flex-direction: column;
  }
  
  .nav-pills .nav-link {
    margin-right: 0;
    margin-bottom: 0.5rem;
    justify-content: center;
  }
  
  .quick-links {
    grid-template-columns: 1fr;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .timeline-marker {
    margin-bottom: 0.5rem;
  }
}

/* Темная тема */
[data-theme="dark"] .profile-card {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .card-header {
  background-color: #1a1a1a;
  border-color: #444444;
}

[data-theme="dark"] .card-title {
  color: #ffffff;
}

[data-theme="dark"] .stat-value {
  color: #ffffff;
}

[data-theme="dark"] .timeline-title {
  color: #ffffff;
}

[data-theme="dark"] .completion-item {
  color: #adb5bd;
}

[data-theme="dark"] .completion-item.completed {
  color: #20c997;
}

[data-theme="dark"] .quick-link {
  background-color: #2d2d2d;
  border-color: #444444;
  color: #ffffff;
}

[data-theme="dark"] .quick-link:hover {
  color: #ffffff;
}

[data-theme="dark"] .profile-navigation {
  background-color: #2d2d2d;
}

/* Пустые состояния */
.empty-state {
  padding: 2rem 1rem;
  color: #6c757d;
}

/* Анимации */
.stat-card,
.profile-card {
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Состояния загрузки */
.loading .profile-card {
  opacity: 0.7;
  pointer-events: none;
}
</style>