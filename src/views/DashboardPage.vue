<template>
  <div class="dashboard-page">
    <!-- Корпоративный заголовок -->
    <CorporateHeader 
      title="Панель управления"
      subtitle="Добро пожаловать в систему учёта активности предприятия"
      :stats="headerStats"
    />

    <!-- Основные метрики -->
    <div class="metrics-section">
      <div class="container-fluid">
        <div class="metrics-grid mb-4">
          <div class="row g-3">
            <div class="col-lg-3 col-md-6">
              <div class="metric-card points-card">
                <div class="metric-icon">
                  <i class="fas fa-coins"></i>
                </div>
                <div class="metric-content">
                  <h3 class="metric-value">{{ formatNumber(authStore.user?.points || 0) }}</h3>
                  <p class="metric-label">Текущий баланс</p>
                  <div class="metric-change positive">
                    <i class="fas fa-arrow-up"></i>
                    +{{ formatNumber(userStats.pointsThisMonth) }} за месяц
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-3 col-md-6">
              <div class="metric-card events-card">
                <div class="metric-icon">
                  <i class="fas fa-calendar-check"></i>
                </div>
                <div class="metric-content">
                  <h3 class="metric-value">{{ userStats.attendedEvents }}</h3>
                  <p class="metric-label">Посещено мероприятий</p>
                  <div class="metric-change">
                    {{ userStats.upcomingEvents }} предстоящих
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-3 col-md-6">
              <div class="metric-card purchases-card">
                <div class="metric-icon">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="metric-content">
                  <h3 class="metric-value">{{ userStats.totalPurchases }}</h3>
                  <p class="metric-label">Покупок сделано</p>
                  <div class="metric-change">
                    {{ formatNumber(userStats.pointsSpent) }} баллов потрачено
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-3 col-md-6">
              <div class="metric-card rank-card">
                <div class="metric-icon">
                  <i class="fas fa-trophy"></i>
                </div>
                <div class="metric-content">
                  <h3 class="metric-value">#{{ userStats.rank || '-' }}</h3>
                  <p class="metric-label">Место в рейтинге</p>
                  <div class="metric-change">
                    {{ userStats.department || 'Общий' }} отдел
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Левая колонка -->
          <div class="col-lg-8">
            <!-- Предстоящие мероприятия -->
            <div class="dashboard-card upcoming-events-card mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i class="fas fa-calendar-alt me-2"></i>
                  Предстоящие мероприятия
                </h5>
                <router-link to="/events" class="btn btn-sm btn-outline-primary">
                  Все мероприятия
                </router-link>
              </div>
              <div class="card-body">
                <div v-if="upcomingEvents.length === 0" class="text-center py-4">
                  <i class="fas fa-calendar-times text-muted mb-3" style="font-size: 3rem;"></i>
                  <p class="text-muted mb-0">Нет предстоящих мероприятий</p>
                </div>
                <div v-else class="events-list">
                  <div 
                    v-for="event in upcomingEvents.slice(0, 3)" 
                    :key="event.id" 
                    class="event-item"
                  >
                    <div class="event-date">
                      <div class="date-day">{{ formatDate(event.date, 'day') }}</div>
                      <div class="date-month">{{ formatDate(event.date, 'month') }}</div>
                    </div>
                    <div class="event-info">
                      <h6 class="event-title">{{ event.title }}</h6>
                      <p class="event-description">{{ event.description }}</p>
                      <div class="event-meta">
                        <span class="event-time">
                          <i class="fas fa-clock me-1"></i>
                          {{ formatTime(event.time) }}
                        </span>
                        <span class="event-location">
                          <i class="fas fa-map-marker-alt me-1"></i>
                          {{ event.location }}
                        </span>
                        <span class="event-points">
                          <i class="fas fa-coins me-1"></i>
                          {{ event.points }} баллов
                        </span>
                      </div>
                    </div>
                    <div class="event-actions">
                      <button 
                        v-if="!event.isRegistered"
                        class="btn btn-sm btn-primary"
                        @click="registerForEvent(event.id)"
                      >
                        Записаться
                      </button>
                      <span v-else class="badge bg-success">Записан</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Последние активности -->
            <div class="dashboard-card activities-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i class="fas fa-history me-2"></i>
                  Последние активности
                </h5>
                <router-link to="/profile" class="btn btn-sm btn-outline-primary">
                  Подробнее
                </router-link>
              </div>
              <div class="card-body">
                <div v-if="recentActivities.length === 0" class="text-center py-4">
                  <i class="fas fa-inbox text-muted mb-3" style="font-size: 3rem;"></i>
                  <p class="text-muted mb-0">Нет активности</p>
                </div>
                <div v-else class="activities-list">
                  <div 
                    v-for="activity in recentActivities" 
                    :key="activity.id" 
                    class="activity-item"
                  >
                    <div class="activity-icon">
                      <i :class="getActivityIcon(activity.type)"></i>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">{{ activity.title }}</div>
                      <div class="activity-time">{{ formatRelativeTime(activity.createdAt) }}</div>
                    </div>
                    <div class="activity-points" v-if="activity.points">
                      <span class="points-badge" :class="activity.points > 0 ? 'positive' : 'negative'">
                        {{ activity.points > 0 ? '+' : '' }}{{ activity.points }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Правая колонка -->
          <div class="col-lg-4">
            <!-- Быстрые действия -->
            <div class="dashboard-card quick-actions-card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-bolt me-2"></i>
                  Быстрые действия
                </h5>
              </div>
              <div class="card-body">
                <div class="quick-actions">
                  <router-link to="/events" class="quick-action-item">
                    <div class="action-icon">
                      <i class="fas fa-calendar-plus"></i>
                    </div>
                    <div class="action-text">
                      <div class="action-title">Найти мероприятия</div>
                      <div class="action-subtitle">Записаться на события</div>
                    </div>
                  </router-link>
                  
                  <router-link to="/rewards" class="quick-action-item">
                    <div class="action-icon">
                      <i class="fas fa-gift"></i>
                    </div>
                    <div class="action-text">
                      <div class="action-title">Каталог наград</div>
                      <div class="action-subtitle">Обменять баллы</div>
                    </div>
                  </router-link>
                  
                  <router-link to="/leaderboard" class="quick-action-item">
                    <div class="action-icon">
                      <i class="fas fa-trophy"></i>
                    </div>
                    <div class="action-text">
                      <div class="action-title">Рейтинг</div>
                      <div class="action-subtitle">Сравнить результаты</div>
                    </div>
                  </router-link>
                  
                  <router-link to="/profile" class="quick-action-item">
                    <div class="action-icon">
                      <i class="fas fa-user-edit"></i>
                    </div>
                    <div class="action-text">
                      <div class="action-title">Профиль</div>
                      <div class="action-subtitle">Настройки аккаунта</div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Достижения -->
            <div class="dashboard-card achievements-card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-medal me-2"></i>
                  Достижения
                </h5>
              </div>
              <div class="card-body">
                <div v-if="achievements.length === 0" class="text-center py-4">
                  <i class="fas fa-trophy text-muted mb-3" style="font-size: 3rem;"></i>
                  <p class="text-muted mb-0">Нет достижений</p>
                </div>
                <div v-else class="achievements-list">
                  <div 
                    v-for="achievement in achievements.slice(0, 5)" 
                    :key="achievement.id" 
                    class="achievement-item"
                  >
                    <div class="achievement-icon">
                      <i :class="achievement.icon"></i>
                    </div>
                    <div class="achievement-content">
                      <div class="achievement-title">{{ achievement.title }}</div>
                      <div class="achievement-description">{{ achievement.description }}</div>
                      <div class="achievement-progress">
                        <div class="progress">
                          <div 
                            class="progress-bar" 
                            :style="{ width: achievement.progress + '%' }"
                          ></div>
                        </div>
                        <span class="progress-text">{{ achievement.progress }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import CorporateHeader from '@/components/layout/CorporateHeader.vue'

export default {
  name: 'DashboardPage',
  components: {
    CorporateHeader
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    // Данные
    const upcomingEvents = ref([])
    const recentActivities = ref([])
    const achievements = ref([])
    const userStats = ref({
      attendedEvents: 0,
      upcomingEvents: 0,
      totalPurchases: 0,
      pointsSpent: 0,
      pointsThisMonth: 0,
      rank: null,
      department: null
    })
    
    // Вычисляемые свойства
    const headerStats = computed(() => [
      {
        icon: 'fas fa-coins',
        value: appStore.formatNumber(authStore.user?.points || 0),
        label: 'Баллов'
      },
      {
        icon: 'fas fa-calendar-check',
        value: userStats.value.attendedEvents,
        label: 'Мероприятий'
      },
      {
        icon: 'fas fa-trophy',
        value: userStats.value.rank || '-',
        label: 'Место в рейтинге'
      }
    ])
    
    // Методы
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Доброе утро'
      if (hour < 18) return 'Добрый день'
      return 'Добрый вечер'
    }
    
    const getWelcomeMessage = () => {
      const messages = [
        'Отличный день для новых достижений!',
        'Продолжайте в том же духе!',
        'Ваша активность вдохновляет других!',
        'Сегодня отличный день для участия в мероприятиях!'
      ]
      return messages[Math.floor(Math.random() * messages.length)]
    }
    
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }
    
    const formatDate = (date, format) => {
      const d = new Date(date)
      if (format === 'day') {
        return d.getDate()
      } else if (format === 'month') {
        return d.toLocaleDateString('ru-RU', { month: 'short' })
      }
      return d.toLocaleDateString('ru-RU')
    }
    
    const formatTime = (time) => {
      return time
    }
    
    const formatRelativeTime = (date) => {
      return appStore.formatRelativeDate(new Date(date))
    }
    
    const getActivityIcon = (type) => {
      const icons = {
        event: 'fas fa-calendar text-primary',
        points: 'fas fa-coins text-warning',
        purchase: 'fas fa-shopping-bag text-info',
        achievement: 'fas fa-medal text-success'
      }
      return icons[type] || 'fas fa-info-circle text-secondary'
    }
    
    const registerForEvent = async (eventId) => {
      try {
        // Здесь будет API вызов для регистрации
        toast.success('Вы успешно записались на мероприятие!')
        // Обновляем данные
        loadDashboardData()
      } catch (error) {
        toast.error('Ошибка при записи на мероприятие')
      }
    }
    
    const loadDashboardData = async () => {
      try {
        // Здесь будут API вызовы для загрузки данных
        // Заглушки с примерными данными
        upcomingEvents.value = [
          {
            id: 1,
            title: 'Корпоративная встреча',
            description: 'Еженедельная встреча команды',
            date: new Date(Date.now() + 86400000),
            time: '10:00',
            location: 'Конференц-зал',
            points: 50,
            isRegistered: false
          },
          {
            id: 2,
            title: 'Тренинг по продажам',
            description: 'Повышение навыков продаж',
            date: new Date(Date.now() + 172800000),
            time: '14:00',
            location: 'Учебный центр',
            points: 100,
            isRegistered: true
          }
        ]
        
        recentActivities.value = [
          {
            id: 1,
            type: 'event',
            title: 'Посетили мероприятие "Корпоративная встреча"',
            createdAt: new Date(Date.now() - 3600000),
            points: 50
          },
          {
            id: 2,
            type: 'points',
            title: 'Получили баллы за активность',
            createdAt: new Date(Date.now() - 7200000),
            points: 25
          }
        ]
        
        achievements.value = [
          {
            id: 1,
            icon: 'fas fa-calendar-check',
            title: 'Первые шаги',
            description: 'Посетите первое мероприятие',
            progress: 100
          },
          {
            id: 2,
            icon: 'fas fa-coins',
            title: 'Накопитель',
            description: 'Накопите 1000 баллов',
            progress: 75
          }
        ]
        
        userStats.value = {
          attendedEvents: 12,
          upcomingEvents: 3,
          totalPurchases: 5,
          pointsSpent: 750,
          pointsThisMonth: 250,
          rank: 5,
          department: 'Продажи'
        }
        
      } catch (error) {
        console.error('Ошибка загрузки данных дашборда:', error)
        toast.error('Ошибка загрузки данных')
      }
    }
    
    onMounted(() => {
      loadDashboardData()
    })
    
    return {
      authStore,
      appStore,
      upcomingEvents,
      recentActivities,
      achievements,
      userStats,
      headerStats,
      
      getGreeting,
      getWelcomeMessage,
      formatNumber,
      formatDate,
      formatTime,
      formatRelativeTime,
      getActivityIcon,
      registerForEvent
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--light-gray);
}

.metrics-section {
  padding: 2rem 0;
}

.metrics-grid {
  margin-bottom: 2rem;
}

.metric-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  border: none;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.metric-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  background: var(--gradient-primary);
  color: var(--white);
}

.metric-value {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: var(--primary-blue);
  margin-bottom: 0.5rem;
}

.metric-label {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.metric-change {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 400;
}

.metric-change.positive {
  color: var(--success);
  font-weight: 700;
}

.dashboard-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  border: none;
  margin-bottom: 1.5rem;
}

.dashboard-card .card-header {
  background: var(--gradient-primary);
  color: var(--white);
  border-bottom: none;
  padding: 1.25rem 1.5rem;
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
}

.dashboard-card .card-title {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  color: var(--white);
  margin: 0;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.dashboard-card .card-body {
  padding: 1.5rem;
}

/* События */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.event-item:hover {
  border-color: var(--primary-blue);
  box-shadow: var(--shadow-sm);
}

.event-date {
  text-align: center;
  margin-right: 1rem;
  min-width: 60px;
}

.date-day {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--primary-blue);
  line-height: 1;
}

.date-month {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-info {
  flex: 1;
}

.event-title {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.event-description {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.event-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.event-meta span {
  display: flex;
  align-items: center;
}

/* Активности */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: var(--light-gray);
}

.activity-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background: var(--light-gray);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.points-badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  font-weight: 700;
}

.points-badge.positive {
  background: var(--success);
  color: var(--white);
}

.points-badge.negative {
  background: var(--danger);
  color: var(--white);
}

/* Быстрые действия */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-action-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.quick-action-item:hover {
  border-color: var(--primary-blue);
  background: var(--light-gray);
  color: var(--text-primary);
  text-decoration: none;
  transform: translateX(5px);
}

.action-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background: var(--gradient-primary);
  color: var(--white);
}

.action-title {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.action-subtitle {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Достижения */
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.achievement-item:hover {
  background: var(--light-gray);
}

.achievement-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background: var(--warning);
  color: var(--white);
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.achievement-description {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress {
  flex: 1;
  height: 0.5rem;
  background: var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.progress-bar {
  background: var(--gradient-success);
  height: 100%;
  border-radius: var(--border-radius);
}

.progress-text {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--text-secondary);
  min-width: 2rem;
  text-align: right;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .metrics-section {
    padding: 1.5rem 0;
  }
  
  .metric-card {
    padding: 1.25rem;
  }
  
  .metric-value {
    font-size: 1.75rem;
  }
}

@media (max-width: 767.98px) {
  .metrics-section {
    padding: 1rem 0;
  }
  
  .metric-card {
    padding: 1rem;
  }
  
  .metric-value {
    font-size: 1.5rem;
  }
  
  .event-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .quick-action-item {
    padding: 0.75rem;
  }
  
  .action-icon {
    width: 2rem;
    height: 2rem;
    margin-right: 0.75rem;
  }
}

/* Темная тема */
[data-theme="dark"] .dashboard-page {
  background: var(--gray-dark);
}

[data-theme="dark"] .metric-card,
[data-theme="dark"] .dashboard-card {
  background: var(--gray-blue-dark);
  border-color: var(--gray-blue-light);
}

[data-theme="dark"] .metric-value {
  color: var(--white);
}

[data-theme="dark"] .metric-label {
  color: var(--gray-blue-light);
}

[data-theme="dark"] .event-item,
[data-theme="dark"] .activity-item,
[data-theme="dark"] .quick-action-item,
[data-theme="dark"] .achievement-item {
  border-color: var(--gray-blue-light);
}

[data-theme="dark"] .event-item:hover,
[data-theme="dark"] .activity-item:hover,
[data-theme="dark"] .quick-action-item:hover,
[data-theme="dark"] .achievement-item:hover {
  background: var(--gray-blue-light);
}

[data-theme="dark"] .event-title,
[data-theme="dark"] .activity-title,
[data-theme="dark"] .action-title,
[data-theme="dark"] .achievement-title {
  color: var(--white);
}

[data-theme="dark"] .event-description,
[data-theme="dark"] .activity-time,
[data-theme="dark"] .action-subtitle,
[data-theme="dark"] .achievement-description {
  color: var(--gray-blue-light);
}
</style>