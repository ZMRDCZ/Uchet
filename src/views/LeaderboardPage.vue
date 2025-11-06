<template>
  <div class="leaderboard-page">
    <!-- Заголовок -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1 class="page-title">
            <i class="fas fa-trophy me-3"></i>
            Рейтинг участников
          </h1>
          <p class="page-subtitle">
            Топ активных сотрудников и их достижения
          </p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="header-actions">
            <button class="btn btn-outline-primary me-2" @click="showPersonalStats">
              <i class="fas fa-user me-2"></i>
              Моя статистика
            </button>
            <div class="dropdown">
              <button 
                class="btn btn-primary dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-download me-2"></i>
                Экспорт
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="exportLeaderboard('pdf')">
                    <i class="fas fa-file-pdf me-2"></i>
                    PDF отчет
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="exportLeaderboard('excel')">
                    <i class="fas fa-file-excel me-2"></i>
                    Excel таблица
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры и настройки -->
    <div class="leaderboard-controls mb-4">
      <div class="row g-3">
        <div class="col-lg-3 col-md-6">
          <label class="form-label">Период</label>
          <select v-model="filters.period" class="form-select" @change="loadLeaderboard">
            <option value="all">Все время</option>
            <option value="year">Этот год</option>
            <option value="quarter">Этот квартал</option>
            <option value="month">Этот месяц</option>
            <option value="week">Эта неделя</option>
          </select>
        </div>

        <div class="col-lg-3 col-md-6">
          <label class="form-label">Отдел</label>
          <select v-model="filters.department" class="form-select" @change="loadLeaderboard">
            <option value="">Все отделы</option>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>

        <div class="col-lg-3 col-md-6">
          <label class="form-label">Метрика</label>
          <select v-model="filters.metric" class="form-select" @change="loadLeaderboard">
            <option value="points">Баллы</option>
            <option value="events">Мероприятия</option>
            <option value="achievements">Достижения</option>
            <option value="purchases">Покупки</option>
          </select>
        </div>

        <div class="col-lg-3 col-md-6">
          <label class="form-label">Показать</label>
          <select v-model="filters.limit" class="form-select" @change="loadLeaderboard">
            <option value="10">Топ 10</option>
            <option value="25">Топ 25</option>
            <option value="50">Топ 50</option>
            <option value="100">Топ 100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Подиум победителей -->
    <div class="winners-podium mb-4" v-if="topThree.length >= 3">
      <div class="podium-container">
        <!-- 2-е место -->
        <div class="podium-place second-place">
          <div class="place-medal">
            <i class="fas fa-medal"></i>
            <span class="place-number">2</span>
          </div>
          <div class="place-avatar">
            <img 
              v-if="topThree[1]?.avatar" 
              :src="topThree[1].avatar" 
              :alt="topThree[1]?.name"
            />
            <div v-else class="avatar-placeholder">
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div class="place-info">
            <h5 class="place-name">{{ topThree[1]?.name }}</h5>
            <div class="place-department">{{ topThree[1]?.department }}</div>
            <div class="place-score">{{ formatMetricValue(topThree[1]) }}</div>
          </div>
        </div>

        <!-- 1-е место -->
        <div class="podium-place first-place">
          <div class="winner-crown">
            <i class="fas fa-crown"></i>
          </div>
          <div class="place-medal">
            <i class="fas fa-medal"></i>
            <span class="place-number">1</span>
          </div>
          <div class="place-avatar">
            <img 
              v-if="topThree[0]?.avatar" 
              :src="topThree[0].avatar" 
              :alt="topThree[0]?.name"
            />
            <div v-else class="avatar-placeholder">
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div class="place-info">
            <h4 class="place-name">{{ topThree[0]?.name }}</h4>
            <div class="place-department">{{ topThree[0]?.department }}</div>
            <div class="place-score">{{ formatMetricValue(topThree[0]) }}</div>
          </div>
        </div>

        <!-- 3-е место -->
        <div class="podium-place third-place">
          <div class="place-medal">
            <i class="fas fa-medal"></i>
            <span class="place-number">3</span>
          </div>
          <div class="place-avatar">
            <img 
              v-if="topThree[2]?.avatar" 
              :src="topThree[2].avatar" 
              :alt="topThree[2]?.name"
            />
            <div v-else class="avatar-placeholder">
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div class="place-info">
            <h5 class="place-name">{{ topThree[2]?.name }}</h5>
            <div class="place-department">{{ topThree[2]?.department }}</div>
            <div class="place-score">{{ formatMetricValue(topThree[2]) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной рейтинг -->
    <div class="leaderboard-content">
      <div class="row">
        <!-- Список участников -->
        <div class="col-lg-8">
          <div class="leaderboard-table-card">
            <div class="card-header">
              <h5 class="card-title">
                <i class="fas fa-list-ol me-2"></i>
                Рейтинговая таблица
              </h5>
              <div class="table-actions">
                <button class="btn btn-sm btn-outline-secondary" @click="toggleView">
                  <i :class="viewMode === 'table' ? 'fas fa-th-large' : 'fas fa-list'"></i>
                </button>
              </div>
            </div>

            <div class="card-body">
              <div v-if="loading" class="loading-state">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Загрузка...</span>
                </div>
                <p class="mt-2 text-muted">Загрузка рейтинга...</p>
              </div>

              <div v-else-if="leaderboard.length === 0" class="empty-state">
                <i class="fas fa-users-slash text-muted mb-3"></i>
                <h5>Нет данных</h5>
                <p class="text-muted">Рейтинг пустой или не найдено участников с выбранными фильтрами</p>
              </div>

              <!-- Табличный вид -->
              <div v-else-if="viewMode === 'table'" class="table-responsive">
                <table class="table table-hover leaderboard-table">
                  <thead>
                    <tr>
                      <th width="60">Место</th>
                      <th>Участник</th>
                      <th>Отдел</th>
                      <th class="text-center">{{ getMetricLabel() }}</th>
                      <th class="text-center">Изменение</th>
                      <th class="text-center">Последняя активность</th>
                      <th width="100">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(user, index) in leaderboard" 
                      :key="user.id"
                      class="leaderboard-row"
                      :class="{ 
                        'current-user': user.id === authStore.user?.id,
                        'top-three': index < 3
                      }"
                    >
                      <td class="rank-cell">
                        <div class="rank-badge" :class="getRankClass(index + 1)">
                          <span v-if="index < 3" class="rank-icon">
                            <i class="fas fa-medal"></i>
                          </span>
                          {{ index + 1 }}
                        </div>
                      </td>
                      
                      <td class="user-cell">
                        <div class="user-info">
                          <div class="user-avatar">
                            <img 
                              v-if="user.avatar" 
                              :src="user.avatar" 
                              :alt="user.name"
                            />
                            <div v-else class="avatar-placeholder">
                              <i class="fas fa-user"></i>
                            </div>
                          </div>
                          <div class="user-details">
                            <div class="user-name">{{ user.name }}</div>
                            <div class="user-position">{{ user.position }}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td class="department-cell">
                        <span class="department-badge">{{ user.department }}</span>
                      </td>
                      
                      <td class="metric-cell text-center">
                        <div class="metric-value">{{ formatMetricValue(user) }}</div>
                      </td>
                      
                      <td class="change-cell text-center">
                        <div class="rank-change" :class="getRankChangeClass(user.rankChange)">
                          <i :class="getRankChangeIcon(user.rankChange)"></i>
                          {{ Math.abs(user.rankChange || 0) }}
                        </div>
                      </td>
                      
                      <td class="activity-cell text-center">
                        <span class="activity-time">
                          {{ formatRelativeTime(user.lastActivityAt) }}
                        </span>
                      </td>
                      
                      <td class="actions-cell">
                        <div class="btn-group btn-group-sm">
                          <button 
                            class="btn btn-outline-primary"
                            @click="viewUserProfile(user.id)"
                            :disabled="!canViewProfile(user)"
                          >
                            <i class="fas fa-eye"></i>
                          </button>
                          <button 
                            class="btn btn-outline-secondary"
                            @click="compareWithUser(user)"
                          >
                            <i class="fas fa-balance-scale"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Карточный вид -->
              <div v-else class="cards-view">
                <div class="row g-3">
                  <div 
                    v-for="(user, index) in leaderboard" 
                    :key="user.id"
                    class="col-md-6 col-lg-4"
                  >
                    <div 
                      class="user-card"
                      :class="{ 
                        'current-user': user.id === authStore.user?.id,
                        'top-performer': index < 3
                      }"
                    >
                      <div class="card-rank">
                        <span class="rank-number" :class="getRankClass(index + 1)">
                          #{{ index + 1 }}
                        </span>
                        <div v-if="user.rankChange" class="rank-change" :class="getRankChangeClass(user.rankChange)">
                          <i :class="getRankChangeIcon(user.rankChange)"></i>
                          {{ Math.abs(user.rankChange) }}
                        </div>
                      </div>
                      
                      <div class="card-avatar">
                        <img 
                          v-if="user.avatar" 
                          :src="user.avatar" 
                          :alt="user.name"
                        />
                        <div v-else class="avatar-placeholder">
                          <i class="fas fa-user"></i>
                        </div>
                      </div>
                      
                      <div class="card-info">
                        <h6 class="user-name">{{ user.name }}</h6>
                        <div class="user-department">{{ user.department }}</div>
                        <div class="user-metric">{{ formatMetricValue(user) }}</div>
                      </div>
                      
                      <div class="card-actions">
                        <button 
                          class="btn btn-sm btn-outline-primary"
                          @click="viewUserProfile(user.id)"
                          :disabled="!canViewProfile(user)"
                        >
                          Профиль
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Боковая панель со статистикой -->
        <div class="col-lg-4">
          <!-- Статистика по отделам -->
          <div class="stats-card departments-stats mb-4">
            <div class="card-header">
              <h6 class="card-title">
                <i class="fas fa-building me-2"></i>
                По отделам
              </h6>
            </div>
            <div class="card-body">
              <div class="departments-chart">
                <canvas id="departmentsChart" width="300" height="200"></canvas>
              </div>
              <div class="departments-list">
                <div 
                  v-for="dept in departmentStats" 
                  :key="dept.name"
                  class="department-item"
                >
                  <div class="department-info">
                    <span class="department-name">{{ dept.name }}</span>
                    <span class="department-count">{{ dept.userCount }} чел.</span>
                  </div>
                  <div class="department-progress">
                    <div class="progress">
                      <div 
                        class="progress-bar"
                        :style="{ width: dept.percentage + '%' }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ dept.averageScore }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Статистика активности -->
          <div class="stats-card activity-stats mb-4">
            <div class="card-header">
              <h6 class="card-title">
                <i class="fas fa-chart-line me-2"></i>
                Активность
              </h6>
            </div>
            <div class="card-body">
              <div class="activity-metrics">
                <div class="metric-item">
                  <div class="metric-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-value">{{ activityStats.totalUsers }}</div>
                    <div class="metric-label">Всего участников</div>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-icon">
                    <i class="fas fa-fire"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-value">{{ activityStats.activeUsers }}</div>
                    <div class="metric-label">Активных за месяц</div>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-icon">
                    <i class="fas fa-star"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-value">{{ activityStats.averageRating }}</div>
                    <div class="metric-label">Средняя оценка</div>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-icon">
                    <i class="fas fa-calendar-check"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-value">{{ activityStats.eventsParticipation }}%</div>
                    <div class="metric-label">Участие в мероприятиях</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Достижения месяца -->
          <div class="stats-card achievements-card">
            <div class="card-header">
              <h6 class="card-title">
                <i class="fas fa-trophy me-2"></i>
                Достижения месяца
              </h6>
            </div>
            <div class="card-body">
              <div class="achievements-list">
                <div 
                  v-for="achievement in monthlyAchievements" 
                  :key="achievement.id"
                  class="achievement-item"
                >
                  <div class="achievement-icon">
                    <i :class="achievement.icon"></i>
                  </div>
                  <div class="achievement-info">
                    <div class="achievement-title">{{ achievement.title }}</div>
                    <div class="achievement-users">{{ achievement.userCount }} получили</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно сравнения -->
    <div 
      id="compareModal" 
      class="modal fade" 
      tabindex="-1" 
      aria-labelledby="compareModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="compareModalLabel" class="modal-title">
              Сравнение результатов
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Закрыть"
            ></button>
          </div>
          <div class="modal-body">
            <CompareUsers 
              v-if="compareUsers.user1 && compareUsers.user2"
              :user1="compareUsers.user1"
              :user2="compareUsers.user2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import CompareUsers from '@/components/leaderboard/CompareUsers.vue'

export default {
  name: 'LeaderboardPage',
  components: {
    CompareUsers
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const appStore = useAppStore()
    const authStore = useAuthStore()

    // Состояние
    const loading = ref(false)
    const viewMode = ref('table') // 'table' или 'cards'
    
    const filters = ref({
      period: 'month',
      department: '',
      metric: 'points',
      limit: '25'
    })

    const leaderboard = ref([])
    const departmentStats = ref([])
    const activityStats = ref({
      totalUsers: 0,
      activeUsers: 0,
      averageRating: 0,
      eventsParticipation: 0
    })
    const monthlyAchievements = ref([])
    const compareUsers = ref({
      user1: null,
      user2: null
    })

    const departments = ref([
      'IT отдел',
      'HR / Кадры',
      'Маркетинг',
      'Продажи',
      'Бухгалтерия',
      'Производство',
      'Логистика',
      'Администрация'
    ])

    // Вычисляемые свойства
    const topThree = computed(() => {
      return leaderboard.value.slice(0, 3)
    })

    // Методы
    const formatMetricValue = (user) => {
      switch (filters.value.metric) {
        case 'points':
          return `${appStore.formatNumber(user.points || 0)} б.`
        case 'events':
          return `${user.eventsCount || 0} мер.`
        case 'achievements':
          return `${user.achievementsCount || 0} дост.`
        case 'purchases':
          return `${user.purchasesCount || 0} пок.`
        default:
          return '0'
      }
    }

    const getMetricLabel = () => {
      const labels = {
        points: 'Баллы',
        events: 'Мероприятия',
        achievements: 'Достижения',
        purchases: 'Покупки'
      }
      return labels[filters.value.metric] || 'Метрика'
    }

    const formatRelativeTime = (date) => {
      return appStore.formatRelativeDate(date)
    }

    const getRankClass = (rank) => {
      if (rank === 1) return 'rank-first'
      if (rank === 2) return 'rank-second'
      if (rank === 3) return 'rank-third'
      if (rank <= 10) return 'rank-top-ten'
      return 'rank-default'
    }

    const getRankChangeClass = (change) => {
      if (change > 0) return 'rank-up'
      if (change < 0) return 'rank-down'
      return 'rank-same'
    }

    const getRankChangeIcon = (change) => {
      if (change > 0) return 'fas fa-arrow-up'
      if (change < 0) return 'fas fa-arrow-down'
      return 'fas fa-minus'
    }

    const canViewProfile = (user) => {
      // Проверяем права доступа к профилю пользователя
      return user.profilePublic || 
             user.id === authStore.user?.id || 
             ['moderator', 'admin'].includes(authStore.user?.role)
    }

    const loadLeaderboard = async () => {
      try {
        loading.value = true
        
        // Здесь будет API вызов
        // const response = await api.get('/leaderboard', { params: filters.value })
        // leaderboard.value = response.data.users
        
        // Заглушка с демо данными
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUsers = [
          {
            id: '1',
            name: 'Иван Петров',
            department: 'IT отдел',
            position: 'Senior Developer',
            avatar: null,
            points: 2450,
            eventsCount: 23,
            achievementsCount: 15,
            purchasesCount: 12,
            rankChange: 2,
            lastActivityAt: new Date(Date.now() - 3600000),
            profilePublic: true
          },
          {
            id: '2',
            name: 'Мария Сидорова',
            department: 'HR',
            position: 'HR Manager',
            avatar: null,
            points: 2340,
            eventsCount: 28,
            achievementsCount: 18,
            purchasesCount: 8,
            rankChange: -1,
            lastActivityAt: new Date(Date.now() - 7200000),
            profilePublic: true
          },
          {
            id: '3',
            name: 'Алексей Козлов',
            department: 'Маркетинг',
            position: 'Marketing Lead',
            avatar: null,
            points: 2180,
            eventsCount: 19,
            achievementsCount: 14,
            purchasesCount: 15,
            rankChange: 1,
            lastActivityAt: new Date(Date.now() - 1800000),
            profilePublic: true
          }
        ]

        // Генерируем больше пользователей для демо
        for (let i = 4; i <= parseInt(filters.value.limit); i++) {
          mockUsers.push({
            id: i.toString(),
            name: `Пользователь ${i}`,
            department: departments.value[Math.floor(Math.random() * departments.value.length)],
            position: 'Сотрудник',
            avatar: null,
            points: Math.floor(Math.random() * 2000) + 500,
            eventsCount: Math.floor(Math.random() * 25) + 1,
            achievementsCount: Math.floor(Math.random() * 20) + 1,
            purchasesCount: Math.floor(Math.random() * 15) + 1,
            rankChange: Math.floor(Math.random() * 21) - 10,
            lastActivityAt: new Date(Date.now() - Math.random() * 86400000 * 7),
            profilePublic: Math.random() > 0.3
          })
        }

        // Сортируем по выбранной метрике
        const sortKey = filters.value.metric === 'points' ? 'points' : 
                       filters.value.metric === 'events' ? 'eventsCount' :
                       filters.value.metric === 'achievements' ? 'achievementsCount' : 'purchasesCount'

        leaderboard.value = mockUsers.sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
      } catch (error) {
        console.error('Ошибка загрузки рейтинга:', error)
        toast.error('Ошибка загрузки рейтинга')
      } finally {
        loading.value = false
      }
    }

    const loadStats = async () => {
      try {
        // Здесь будут API вызовы для статистики
        // const [deptStats, actStats, achievements] = await Promise.all([
        //   api.get('/stats/departments'),
        //   api.get('/stats/activity'),
        //   api.get('/stats/monthly-achievements')
        // ])
        
        // Заглушка с демо данными
        departmentStats.value = [
          { name: 'IT отдел', userCount: 45, averageScore: 1850, percentage: 85 },
          { name: 'HR', userCount: 12, averageScore: 1650, percentage: 75 },
          { name: 'Маркетинг', userCount: 18, averageScore: 1720, percentage: 78 },
          { name: 'Продажи', userCount: 32, averageScore: 1580, percentage: 72 }
        ]

        activityStats.value = {
          totalUsers: 247,
          activeUsers: 189,
          averageRating: 4.6,
          eventsParticipation: 74
        }

        monthlyAchievements.value = [
          { id: '1', title: 'Первые шаги', icon: 'fas fa-baby', userCount: 23 },
          { id: '2', title: 'Активный участник', icon: 'fas fa-fire', userCount: 15 },
          { id: '3', title: 'Лидер команды', icon: 'fas fa-crown', userCount: 8 }
        ]
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error)
      }
    }

    const createDepartmentsChart = () => {
      // Здесь будет создание графика по отделам
      const canvas = document.getElementById('departmentsChart')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#f8f9fa'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#333'
        ctx.font = '14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Активность по отделам', canvas.width/2, canvas.height/2)
      }
    }

    const toggleView = () => {
      viewMode.value = viewMode.value === 'table' ? 'cards' : 'table'
    }

    const viewUserProfile = (userId) => {
      if (userId === authStore.user?.id) {
        router.push('/profile')
      } else {
        router.push(`/users/${userId}`)
      }
    }

    const compareWithUser = (user) => {
      compareUsers.value = {
        user1: authStore.user,
        user2: user
      }
      const modal = new bootstrap.Modal(document.getElementById('compareModal'))
      modal.show()
    }

    const showPersonalStats = () => {
      router.push('/profile')
    }

    const exportLeaderboard = (format) => {
      toast.info(`Экспорт в ${format.toUpperCase()} будет доступен в следующей версии`)
    }

    // Watchers
    watch(() => [filters.value.period, filters.value.department, filters.value.metric], () => {
      loadLeaderboard()
    })

    // Инициализация
    onMounted(async () => {
      appStore.setPageTitle('Рейтинг участников')
      
      await Promise.all([
        loadLeaderboard(),
        loadStats()
      ])

      setTimeout(createDepartmentsChart, 100)
    })

    return {
      loading,
      viewMode,
      filters,
      leaderboard,
      departmentStats,
      activityStats,
      monthlyAchievements,
      compareUsers,
      departments,
      topThree,
      authStore,
      
      formatMetricValue,
      getMetricLabel,
      formatRelativeTime,
      getRankClass,
      getRankChangeClass,
      getRankChangeIcon,
      canViewProfile,
      loadLeaderboard,
      toggleView,
      viewUserProfile,
      compareWithUser,
      showPersonalStats,
      exportLeaderboard
    }
  }
}
</script>

<style scoped>
.leaderboard-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Заголовок */
.page-header {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Фильтры */
.leaderboard-controls {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* Подиум победителей */
.winners-podium {
  margin-bottom: 2rem;
}

.podium-container {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.podium-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(253, 126, 20, 0.1) 100%);
  pointer-events: none;
}

.podium-place {
  text-align: center;
  position: relative;
  z-index: 1;
}

.first-place {
  order: 2;
  transform: scale(1.1);
}

.second-place {
  order: 1;
}

.third-place {
  order: 3;
}

.winner-crown {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: #ffc107;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

.place-medal {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 2rem;
  color: white;
}

.first-place .place-medal {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  box-shadow: 0 0.5rem 1rem rgba(255, 215, 0, 0.4);
}

.second-place .place-medal {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  box-shadow: 0 0.5rem 1rem rgba(192, 192, 192, 0.4);
}

.third-place .place-medal {
  background: linear-gradient(135deg, #cd7f32 0%, #deb887 100%);
  box-shadow: 0 0.5rem 1rem rgba(205, 127, 50, 0.4);
}

.place-number {
  position: absolute;
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

.place-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.place-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.place-info {
  color: #333;
}

.place-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.place-department {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.place-score {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffc107;
}

/* Основная таблица */
.leaderboard-table-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-body {
  padding: 0;
}

/* Таблица */
.leaderboard-table {
  margin: 0;
}

.leaderboard-table th {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #333;
  padding: 1rem;
  border-top: none;
}

.leaderboard-row {
  transition: all 0.2s ease;
}

.leaderboard-row:hover {
  background: #f8f9fa;
}

.leaderboard-row.current-user {
  background: rgba(255, 193, 7, 0.1);
}

.leaderboard-row.top-three {
  background: rgba(255, 193, 7, 0.05);
}

.leaderboard-table td {
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #e9ecef;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 700;
  color: white;
  position: relative;
}

.rank-first {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.rank-second {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
}

.rank-third {
  background: linear-gradient(135deg, #cd7f32 0%, #deb887 100%);
}

.rank-top-ten {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
}

.rank-default {
  background: #6c757d;
}

.rank-icon {
  position: absolute;
  font-size: 0.7rem;
  top: -2px;
  right: -2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar .avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.user-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.user-position {
  font-size: 0.9rem;
  color: #6c757d;
}

.department-badge {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.metric-value {
  font-weight: 700;
  color: #ffc107;
  font-size: 1.1rem;
}

.rank-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.rank-up {
  color: #198754;
}

.rank-down {
  color: #dc3545;
}

.rank-same {
  color: #6c757d;
}

.activity-time {
  font-size: 0.9rem;
  color: #6c757d;
}

/* Карточный вид */
.cards-view {
  padding: 1.5rem;
}

.user-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  border-color: #ffc107;
}

.user-card.current-user {
  border-color: #ffc107;
  background: rgba(255, 193, 7, 0.05);
}

.user-card.top-performer {
  border-color: #ffd700;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%);
}

.card-rank {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.rank-number {
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  color: white;
}

.card-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  overflow: hidden;
  border: 2px solid #e9ecef;
}

.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info .user-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.user-department {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.user-metric {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffc107;
  margin-bottom: 1rem;
}

.card-actions {
  margin-top: auto;
}

/* Боковая панель */
.stats-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.stats-card .card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

.stats-card .card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.stats-card .card-body {
  padding: 1.5rem;
}

/* Статистика по отделам */
.departments-chart {
  margin-bottom: 1.5rem;
  text-align: center;
}

.departments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.department-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.department-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.department-name {
  font-weight: 500;
  color: #333;
}

.department-count {
  font-size: 0.9rem;
  color: #6c757d;
}

.department-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.department-progress .progress {
  flex: 1;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.department-progress .progress-bar {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffc107;
  min-width: 40px;
  text-align: right;
}

/* Метрики активности */
.activity-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
}

.metric-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #6c757d;
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
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
}

.achievement-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.achievement-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.achievement-users {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Пустые состояния */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .page-header {
    text-align: center;
  }
  
  .header-actions {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .podium-container {
    flex-direction: column;
    align-items: center;
  }
  
  .podium-place {
    margin-bottom: 1rem;
  }
  
  .first-place {
    order: 1;
    transform: none;
  }
  
  .activity-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767.98px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .leaderboard-controls {
    padding: 1rem;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .leaderboard-table th:nth-child(3),
  .leaderboard-table td:nth-child(3),
  .leaderboard-table th:nth-child(5),
  .leaderboard-table td:nth-child(5),
  .leaderboard-table th:nth-child(6),
  .leaderboard-table td:nth-child(6) {
    display: none;
  }
  
  .cards-view .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Темная тема */
[data-theme="dark"] .leaderboard-controls,
[data-theme="dark"] .podium-container,
[data-theme="dark"] .leaderboard-table-card,
[data-theme="dark"] .stats-card,
[data-theme="dark"] .user-card {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .card-header,
[data-theme="dark"] .leaderboard-table th {
  background-color: #1a1a1a;
  border-color: #444444;
}

[data-theme="dark"] .page-title,
[data-theme="dark"] .card-title,
[data-theme="dark"] .place-name,
[data-theme="dark"] .user-name,
[data-theme="dark"] .metric-value,
[data-theme="dark"] .achievement-title {
  color: #ffffff;
}

[data-theme="dark"] .leaderboard-row:hover {
  background-color: #404040;
}

[data-theme="dark"] .metric-item,
[data-theme="dark"] .achievement-item,
[data-theme="dark"] .department-item {
  background-color: #1a1a1a;
}

/* Анимации */
.leaderboard-row,
.user-card,
.metric-item {
  animation: slideInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.leaderboard-row:nth-child(1) { animation-delay: 0.1s; }
.leaderboard-row:nth-child(2) { animation-delay: 0.2s; }
.leaderboard-row:nth-child(3) { animation-delay: 0.3s; }

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

.place-medal {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0.5rem 1rem rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0.75rem 1.5rem rgba(255, 215, 0, 0.6); }
  100% { box-shadow: 0 0.5rem 1rem rgba(255, 215, 0, 0.4); }
}
</style>