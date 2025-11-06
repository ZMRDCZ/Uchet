<template>
  <div class="statistics-page">
    <!-- Заголовок -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1 class="page-title">
            <i class="fas fa-chart-bar me-3"></i>
            Детальная статистика
          </h1>
          <p class="page-subtitle">
            Комплексная аналитика активности и вовлеченности сотрудников
          </p>
        </div>
        <div class="col-md-4 text-md-end">
          <div class="header-actions">
            <button class="btn btn-outline-light me-2" @click="refreshData">
              <i class="fas fa-sync-alt me-2"></i>
              Обновить
            </button>
            <div class="dropdown">
              <button 
                class="btn btn-warning dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-download me-2"></i>
                Экспорт
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="exportReport('executive')">
                    <i class="fas fa-file-pdf me-2"></i>
                    Отчет для руководства
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="exportReport('detailed')">
                    <i class="fas fa-file-excel me-2"></i>
                    Детальная статистика
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="exportReport('hr')">
                    <i class="fas fa-users me-2"></i>
                    HR аналитика
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Период и фильтры -->
    <div class="controls-section mb-4">
      <div class="row g-3">
        <div class="col-lg-3 col-md-6">
          <label class="form-label">Период анализа</label>
          <select v-model="filters.period" class="form-select" @change="loadData">
            <option value="week">Последняя неделя</option>
            <option value="month">Последний месяц</option>
            <option value="quarter">Последний квартал</option>
            <option value="year">Последний год</option>
            <option value="custom">Выбрать период</option>
          </select>
        </div>

        <div class="col-lg-3 col-md-6" v-if="filters.period === 'custom'">
          <label class="form-label">От</label>
          <input 
            type="date" 
            v-model="filters.dateFrom" 
            class="form-control"
            @change="loadData"
          />
        </div>

        <div class="col-lg-3 col-md-6" v-if="filters.period === 'custom'">
          <label class="form-label">До</label>
          <input 
            type="date" 
            v-model="filters.dateTo" 
            class="form-control"
            @change="loadData"
          />
        </div>

        <div class="col-lg-3 col-md-6">
          <label class="form-label">Отдел</label>
          <select v-model="filters.department" class="form-select" @change="loadData">
            <option value="">Все отделы</option>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Основные KPI -->
    <div class="kpi-section mb-4">
      <div class="row g-3">
        <div class="col-lg-3 col-md-6">
          <div class="kpi-card participation-kpi">
            <div class="kpi-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiMetrics.participationRate }}%</div>
              <div class="kpi-label">Участие в мероприятиях</div>
              <div class="kpi-trend" :class="getTrendClass(kpiMetrics.participationTrend)">
                <i :class="getTrendIcon(kpiMetrics.participationTrend)"></i>
                {{ Math.abs(kpiMetrics.participationTrend) }}% к прошлому периоду
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="kpi-card engagement-kpi">
            <div class="kpi-icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiMetrics.engagementScore }}</div>
              <div class="kpi-label">Индекс вовлеченности</div>
              <div class="kpi-trend" :class="getTrendClass(kpiMetrics.engagementTrend)">
                <i :class="getTrendIcon(kpiMetrics.engagementTrend)"></i>
                {{ Math.abs(kpiMetrics.engagementTrend) }}% к прошлому периоду
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="kpi-card satisfaction-kpi">
            <div class="kpi-icon">
              <i class="fas fa-smile"></i>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiMetrics.satisfactionScore }}/5</div>
              <div class="kpi-label">Удовлетворенность</div>
              <div class="kpi-trend" :class="getTrendClass(kpiMetrics.satisfactionTrend)">
                <i :class="getTrendIcon(kpiMetrics.satisfactionTrend)"></i>
                {{ Math.abs(kpiMetrics.satisfactionTrend) }}% к прошлому периоду
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="kpi-card retention-kpi">
            <div class="kpi-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiMetrics.retentionRate }}%</div>
              <div class="kpi-label">Удержание участников</div>
              <div class="kpi-trend" :class="getTrendClass(kpiMetrics.retentionTrend)">
                <i :class="getTrendIcon(kpiMetrics.retentionTrend)"></i>
                {{ Math.abs(kpiMetrics.retentionTrend) }}% к прошлому периоду
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="statistics-content">
      <div class="row">
        <!-- Левая колонка - Графики -->
        <div class="col-lg-8">
          <!-- Активность по времени -->
          <div class="chart-card activity-timeline-card mb-4">
            <div class="card-header">
              <h5 class="card-title">
                <i class="fas fa-chart-line me-2"></i>
                Динамика активности
              </h5>
              <div class="chart-controls">
                <button 
                  v-for="metric in timelineMetrics" 
                  :key="metric.key"
                  class="btn btn-sm"
                  :class="selectedTimelineMetric === metric.key ? 'btn-primary' : 'btn-outline-primary'"
                  @click="selectedTimelineMetric = metric.key"
                >
                  {{ metric.label }}
                </button>
              </div>
            </div>
            <div class="card-body">
              <canvas id="activityTimelineChart" width="400" height="250"></canvas>
            </div>
          </div>

          <!-- Сравнение отделов -->
          <div class="chart-card departments-comparison-card mb-4">
            <div class="card-header">
              <h5 class="card-title">
                <i class="fas fa-building me-2"></i>
                Сравнение отделов
              </h5>
              <div class="view-toggle">
                <button 
                  class="btn btn-sm"
                  :class="departmentView === 'chart' ? 'btn-primary' : 'btn-outline-primary'"
                  @click="departmentView = 'chart'"
                >
                  График
                </button>
                <button 
                  class="btn btn-sm"
                  :class="departmentView === 'table' ? 'btn-primary' : 'btn-outline-primary'"
                  @click="departmentView = 'table'"
                >
                  Таблица
                </button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="departmentView === 'chart'" class="departments-chart">
                <canvas id="departmentsComparisonChart" width="400" height="250"></canvas>
              </div>
              <div v-else class="departments-table">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Отдел</th>
                        <th class="text-center">Сотрудников</th>
                        <th class="text-center">Участие</th>
                        <th class="text-center">Ср. баллы</th>
                        <th class="text-center">Удовлетворенность</th>
                        <th class="text-center">Тренд</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dept in departmentStats" :key="dept.name">
                        <td>
                          <strong>{{ dept.name }}</strong>
                        </td>
                        <td class="text-center">{{ dept.employeeCount }}</td>
                        <td class="text-center">
                          <span class="participation-badge" :class="getParticipationClass(dept.participationRate)">
                            {{ dept.participationRate }}%
                          </span>
                        </td>
                        <td class="text-center">{{ formatNumber(dept.averagePoints) }}</td>
                        <td class="text-center">
                          <div class="rating-stars">
                            <i v-for="star in 5" :key="star" 
                               :class="star <= dept.satisfaction ? 'fas fa-star' : 'far fa-star'"
                               class="star"></i>
                          </div>
                        </td>
                        <td class="text-center">
                          <div class="trend-indicator" :class="getTrendClass(dept.trend)">
                            <i :class="getTrendIcon(dept.trend)"></i>
                            {{ Math.abs(dept.trend) }}%
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Воронка участия -->
          <div class="chart-card funnel-card">
            <div class="card-header">
              <h5 class="card-title">
                <i class="fas fa-filter me-2"></i>
                Воронка участия
              </h5>
            </div>
            <div class="card-body">
              <div class="funnel-chart">
                <div class="funnel-stage" v-for="stage in funnelData" :key="stage.name">
                  <div class="stage-bar" :style="{ width: stage.percentage + '%' }">
                    <div class="stage-content">
                      <span class="stage-name">{{ stage.name }}</span>
                      <span class="stage-count">{{ formatNumber(stage.count) }}</span>
                      <span class="stage-percentage">{{ stage.percentage }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка - Аналитика -->
        <div class="col-lg-4">
          <!-- Топ событий -->
          <div class="analytics-card top-events-card mb-4">
            <div class="card-header">
              <h6 class="card-title">
                <i class="fas fa-trophy me-2"></i>
                Самые популярные мероприятия
              </h6>
            </div>
            <div class="card-body">
              <div class="top-events-list">
                <div v-for="(event, index) in topEvents" :key="event.id" class="top-event-item">
                  <div class="event-rank">{{ index + 1 }}</div>
                  <div class="event-info">
                    <div class="event-name">{{ event.name }}</div>
                    <div class="event-stats">
                      <span class="participants">{{ event.participantsCount }} участников</span>
                      <span class="rating">{{ event.rating }}/5 ⭐</span>
                    </div>
                  </div>
                  <div class="event-growth" :class="getTrendClass(event.growth)">
                    <i :class="getTrendIcon(event.growth)"></i>
                    {{ Math.abs(event.growth) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HR Insights -->
          <div class="analytics-card hr-insights-card mb-4">
            <div class="card-header">
              <h6 class="card-title">
                <i class="fas fa-lightbulb me-2"></i>
                HR Insights
              </h6>
            </div>
            <div class="card-body">
              <div class="insights-list">
                <div v-for="insight in hrInsights" :key="insight.id" class="insight-item">
                  <div class="insight-icon" :class="insight.type">
                    <i :class="insight.icon"></i>
                  </div>
                  <div class="insight-content">
                    <div class="insight-title">{{ insight.title }}</div>
                    <div class="insight-description">{{ insight.description }}</div>
                    <div class="insight-action">
                      <button class="btn btn-sm btn-outline-primary" @click="viewInsightDetails(insight)">
                        Подробнее
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Рекомендации -->
          <div class="analytics-card recommendations-card">
            <div class="card-header">
              <h6 class="card-title">
                <i class="fas fa-robot me-2"></i>
                Рекомендации системы
              </h6>
            </div>
            <div class="card-body">
              <div class="recommendations-list">
                <div v-for="recommendation in recommendations" :key="recommendation.id" class="recommendation-item">
                  <div class="recommendation-priority" :class="getPriorityClass(recommendation.priority)">
                    {{ getPriorityLabel(recommendation.priority) }}
                  </div>
                  <div class="recommendation-content">
                    <div class="recommendation-title">{{ recommendation.title }}</div>
                    <div class="recommendation-description">{{ recommendation.description }}</div>
                    <div class="recommendation-impact">
                      Ожидаемое улучшение: <strong>{{ recommendation.expectedImprovement }}</strong>
                    </div>
                  </div>
                  <div class="recommendation-actions">
                    <button class="btn btn-sm btn-success" @click="implementRecommendation(recommendation)">
                      Применить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно детального инсайта -->
    <div 
      id="insightModal" 
      class="modal fade" 
      tabindex="-1" 
      aria-labelledby="insightModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="insightModalLabel" class="modal-title">
              Детальный анализ
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Закрыть"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedInsight">
              <h6>{{ selectedInsight.title }}</h6>
              <p>{{ selectedInsight.detailedDescription }}</p>
              <!-- Здесь можно добавить дополнительные графики и данные -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores/app'

export default {
  name: 'StatisticsPage',
  setup() {
    const toast = useToast()
    const appStore = useAppStore()

    // Состояние
    const loading = ref(false)
    const selectedTimelineMetric = ref('participation')
    const departmentView = ref('chart')
    const selectedInsight = ref(null)

    const filters = ref({
      period: 'month',
      dateFrom: '',
      dateTo: '',
      department: ''
    })

    const kpiMetrics = ref({
      participationRate: 0,
      participationTrend: 0,
      engagementScore: 0,
      engagementTrend: 0,
      satisfactionScore: 0,
      satisfactionTrend: 0,
      retentionRate: 0,
      retentionTrend: 0
    })

    const departmentStats = ref([])
    const topEvents = ref([])
    const hrInsights = ref([])
    const recommendations = ref([])
    const funnelData = ref([])

    const timelineMetrics = ref([
      { key: 'participation', label: 'Участие' },
      { key: 'engagement', label: 'Вовлеченность' },
      { key: 'satisfaction', label: 'Удовлетворенность' },
      { key: 'points', label: 'Баллы' }
    ])

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

    // Методы
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }

    const getTrendClass = (trend) => {
      if (trend > 0) return 'trend-positive'
      if (trend < 0) return 'trend-negative'
      return 'trend-neutral'
    }

    const getTrendIcon = (trend) => {
      if (trend > 0) return 'fas fa-arrow-up'
      if (trend < 0) return 'fas fa-arrow-down'
      return 'fas fa-minus'
    }

    const getParticipationClass = (rate) => {
      if (rate >= 80) return 'participation-excellent'
      if (rate >= 60) return 'participation-good'
      if (rate >= 40) return 'participation-average'
      return 'participation-poor'
    }

    const getPriorityClass = (priority) => {
      const classes = {
        high: 'priority-high',
        medium: 'priority-medium',
        low: 'priority-low'
      }
      return classes[priority] || 'priority-low'
    }

    const getPriorityLabel = (priority) => {
      const labels = {
        high: 'Высокий',
        medium: 'Средний',
        low: 'Низкий'
      }
      return labels[priority] || 'Низкий'
    }

    const loadData = async () => {
      try {
        loading.value = true
        
        // Здесь будут API вызовы для загрузки всех данных
        // await Promise.all([
        //   loadKPIMetrics(),
        //   loadDepartmentStats(),
        //   loadTopEvents(),
        //   loadHRInsights(),
        //   loadRecommendations(),
        //   loadFunnelData()
        // ])
        
        // Заглушка с демо данными
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        kpiMetrics.value = {
          participationRate: 74,
          participationTrend: 5.2,
          engagementScore: 8.3,
          engagementTrend: 2.1,
          satisfactionScore: 4.6,
          satisfactionTrend: 0.3,
          retentionRate: 87,
          retentionTrend: -1.2
        }

        departmentStats.value = [
          {
            name: 'IT отдел',
            employeeCount: 45,
            participationRate: 89,
            averagePoints: 1850,
            satisfaction: 4.7,
            trend: 8.2
          },
          {
            name: 'HR',
            employeeCount: 12,
            participationRate: 92,
            averagePoints: 1650,
            satisfaction: 4.8,
            trend: 12.5
          },
          {
            name: 'Маркетинг',
            employeeCount: 18,
            participationRate: 78,
            averagePoints: 1720,
            satisfaction: 4.5,
            trend: 3.1
          },
          {
            name: 'Продажи',
            employeeCount: 32,
            participationRate: 65,
            averagePoints: 1580,
            satisfaction: 4.2,
            trend: -2.8
          }
        ]

        topEvents.value = [
          { id: '1', name: 'Корпоративный хакатон', participantsCount: 89, rating: 4.8, growth: 15.3 },
          { id: '2', name: 'Тренинг по лидерству', participantsCount: 67, rating: 4.7, growth: 8.9 },
          { id: '3', name: 'Обучение по безопасности', participantsCount: 45, rating: 4.5, growth: -2.1 },
          { id: '4', name: 'Командообразование', participantsCount: 34, rating: 4.6, growth: 22.7 }
        ]

        hrInsights.value = [
          {
            id: '1',
            type: 'insight-warning',
            icon: 'fas fa-exclamation-triangle',
            title: 'Снижение активности в отделе продаж',
            description: 'Участие снизилось на 15% за последний месяц',
            detailedDescription: 'Детальный анализ показывает, что основные причины снижения связаны с высокой загрузкой сотрудников и недостатком времени на участие в мероприятиях.'
          },
          {
            id: '2',
            type: 'insight-success',
            icon: 'fas fa-chart-line',
            title: 'Рост вовлеченности IT отдела',
            description: 'Показатели выросли на 20% после внедрения новых форматов',
            detailedDescription: 'Успех связан с введением технических мероприятий и хакатонов, которые больше соответствуют интересам IT-специалистов.'
          }
        ]

        recommendations.value = [
          {
            id: '1',
            priority: 'high',
            title: 'Увеличить частоту мероприятий для продажников',
            description: 'Организовать короткие 30-минутные сессии в обеденное время',
            expectedImprovement: '+25% участия'
          },
          {
            id: '2',
            priority: 'medium',
            title: 'Внедрить геймификацию',
            description: 'Добавить командные соревнования между отделами',
            expectedImprovement: '+15% вовлеченности'
          }
        ]

        funnelData.value = [
          { name: 'Все сотрудники', count: 247, percentage: 100 },
          { name: 'Зарегистрированы в системе', count: 198, percentage: 80 },
          { name: 'Участвовали в мероприятиях', count: 156, percentage: 63 },
          { name: 'Активные участники', count: 89, percentage: 36 },
          { name: 'Постоянные участники', count: 34, percentage: 14 }
        ]
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        toast.error('Ошибка загрузки статистики')
      } finally {
        loading.value = false
      }
    }

    const createCharts = () => {
      // Создание графиков
      setTimeout(() => {
        createActivityTimelineChart()
        createDepartmentsComparisonChart()
      }, 100)
    }

    const createActivityTimelineChart = () => {
      const canvas = document.getElementById('activityTimelineChart')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#f8f9fa'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#333'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('График динамики активности', canvas.width/2, canvas.height/2)
      }
    }

    const createDepartmentsComparisonChart = () => {
      const canvas = document.getElementById('departmentsComparisonChart')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#f8f9fa'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#333'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('График сравнения отделов', canvas.width/2, canvas.height/2)
      }
    }

    const refreshData = () => {
      loadData()
      toast.success('Данные обновлены')
    }

    const exportReport = (type) => {
      const types = {
        executive: 'отчета для руководства',
        detailed: 'детальной статистики',
        hr: 'HR аналитики'
      }
      toast.info(`Экспорт ${types[type]} будет доступен в следующей версии`)
    }

    const viewInsightDetails = (insight) => {
      selectedInsight.value = insight
      const modal = new bootstrap.Modal(document.getElementById('insightModal'))
      modal.show()
    }

    const implementRecommendation = (recommendation) => {
      toast.info(`Реализация рекомендации "${recommendation.title}" будет доступна в следующей версии`)
    }

    // Инициализация
    onMounted(() => {
      appStore.setPageTitle('Детальная статистика')
      loadData().then(() => {
        createCharts()
      })
    })

    return {
      loading,
      selectedTimelineMetric,
      departmentView,
      selectedInsight,
      filters,
      kpiMetrics,
      departmentStats,
      topEvents,
      hrInsights,
      recommendations,
      funnelData,
      timelineMetrics,
      departments,
      
      formatNumber,
      getTrendClass,
      getTrendIcon,
      getParticipationClass,
      getPriorityClass,
      getPriorityLabel,
      loadData,
      refreshData,
      exportReport,
      viewInsightDetails,
      implementRecommendation
    }
  }
}
</script>

<style scoped>
.statistics-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Заголовок */
.page-header {
  background: linear-gradient(135deg, #6f42c1 0%, #495057 100%);
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
.controls-section {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* KPI карточки */
.kpi-section {
  margin-bottom: 2rem;
}

.kpi-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  height: 100%;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.kpi-icon {
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

.participation-kpi .kpi-icon {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.engagement-kpi .kpi-icon {
  background: linear-gradient(135deg, #fd7e14 0%, #e63946 100%);
}

.satisfaction-kpi .kpi-icon {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.retention-kpi .kpi-icon {
  background: linear-gradient(135deg, #6f42c1 0%, #495057 100%);
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #333;
}

.kpi-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.kpi-trend {
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-positive {
  color: #28a745;
}

.trend-negative {
  color: #dc3545;
}

.trend-neutral {
  color: #6c757d;
}

/* Карточки графиков */
.chart-card,
.analytics-card {
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
  padding: 1.5rem;
}

.chart-controls,
.view-toggle {
  display: flex;
  gap: 0.5rem;
}

/* Таблица отделов */
.departments-table .table th {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #333;
}

.participation-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.participation-excellent {
  background: #d1eddf;
  color: #0f5132;
}

.participation-good {
  background: #d1ecf1;
  color: #0c5460;
}

.participation-average {
  background: #fff3cd;
  color: #664d03;
}

.participation-poor {
  background: #f8d7da;
  color: #58151c;
}

.rating-stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  color: #ffc107;
  font-size: 0.9rem;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Воронка */
.funnel-chart {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 500px;
  margin: 0 auto;
}

.funnel-stage {
  display: flex;
  justify-content: center;
}

.stage-bar {
  background: linear-gradient(135deg, #6f42c1 0%, #495057 100%);
  color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 60px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 0.25rem 0.5rem rgba(111, 66, 193, 0.3);
}

.stage-bar:hover {
  transform: scale(1.02);
  box-shadow: 0 0.5rem 1rem rgba(111, 66, 193, 0.4);
}

.stage-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.stage-name {
  font-weight: 600;
  flex: 1;
}

.stage-count {
  font-size: 1.1rem;
  font-weight: 700;
}

.stage-percentage {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Топ события */
.top-events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.top-event-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.top-event-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.event-rank {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6f42c1 0%, #495057 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.event-info {
  flex: 1;
}

.event-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.event-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.event-growth {
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* HR Insights */
.insights-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  border-left: 4px solid transparent;
}

.insight-item.insight-warning {
  border-left-color: #ffc107;
}

.insight-item.insight-success {
  border-left-color: #28a745;
}

.insight-item.insight-info {
  border-left-color: #17a2b8;
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.insight-warning .insight-icon {
  background: #ffc107;
  color: #000;
}

.insight-success .insight-icon {
  background: #28a745;
}

.insight-info .insight-icon {
  background: #17a2b8;
}

.insight-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.insight-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

/* Рекомендации */
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  border: 1px solid #e9ecef;
}

.recommendation-priority {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.priority-high {
  background: #f8d7da;
  color: #58151c;
}

.priority-medium {
  background: #fff3cd;
  color: #664d03;
}

.priority-low {
  background: #d1ecf1;
  color: #0c5460;
}

.recommendation-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.recommendation-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.recommendation-impact {
  font-size: 0.9rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.recommendation-actions {
  text-align: right;
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
  
  .chart-controls,
  .view-toggle {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}

@media (max-width: 767.98px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .kpi-card {
    margin-bottom: 1rem;
  }
  
  .insight-item,
  .recommendation-item {
    flex-direction: column;
    text-align: center;
  }
  
  .top-event-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .event-rank {
    margin: 0 auto;
  }
  
  .stage-content {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Темная тема */
[data-theme="dark"] .controls-section,
[data-theme="dark"] .kpi-card,
[data-theme="dark"] .chart-card,
[data-theme="dark"] .analytics-card {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .card-header {
  background-color: #1a1a1a;
  border-color: #444444;
}

[data-theme="dark"] .page-title,
[data-theme="dark"] .card-title,
[data-theme="dark"] .kpi-value,
[data-theme="dark"] .event-name,
[data-theme="dark"] .insight-title,
[data-theme="dark"] .recommendation-title {
  color: #ffffff;
}

[data-theme="dark"] .top-event-item,
[data-theme="dark"] .insight-item,
[data-theme="dark"] .recommendation-item {
  background-color: #1a1a1a;
}

[data-theme="dark"] .table {
  --bs-table-bg: #2d2d2d;
  --bs-table-color: #ffffff;
}

/* Анимации */
.kpi-card,
.top-event-item,
.insight-item,
.recommendation-item {
  animation: slideInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.kpi-card:nth-child(1) { animation-delay: 0.1s; }
.kpi-card:nth-child(2) { animation-delay: 0.2s; }
.kpi-card:nth-child(3) { animation-delay: 0.3s; }
.kpi-card:nth-child(4) { animation-delay: 0.4s; }

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

.funnel-stage {
  animation: slideInLeft 0.6s ease-out;
  animation-fill-mode: both;
}

.funnel-stage:nth-child(1) { animation-delay: 0.1s; }
.funnel-stage:nth-child(2) { animation-delay: 0.2s; }
.funnel-stage:nth-child(3) { animation-delay: 0.3s; }
.funnel-stage:nth-child(4) { animation-delay: 0.4s; }
.funnel-stage:nth-child(5) { animation-delay: 0.5s; }

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Живые обновления */
.kpi-value {
  transition: all 0.3s ease;
}

.kpi-card:hover .kpi-value {
  transform: scale(1.05);
}
</style>