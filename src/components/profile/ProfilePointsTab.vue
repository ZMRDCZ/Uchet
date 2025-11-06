<template>
  <div class="profile-points-tab">
    <!-- Баланс и статистика -->
    <div class="points-overview mb-4">
      <div class="row g-3">
        <div class="col-lg-4">
          <div class="balance-card">
            <div class="balance-icon">
              <i class="fas fa-coins"></i>
            </div>
            <div class="balance-content">
              <h2 class="balance-amount">{{ formatNumber(currentBalance) }}</h2>
              <p class="balance-label">Текущий баланс</p>
              <div class="balance-change">
                <i :class="[balanceChangeIcon, 'me-1']"></i>
                {{ balanceChangeText }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(pointsStats.totalEarned) }}</div>
              <div class="stat-label">Всего заработано</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(pointsStats.totalSpent) }}</div>
              <div class="stat-label">Всего потрачено</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(pointsStats.thisMonth) }}</div>
              <div class="stat-label">За этот месяц</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pointsStats.avgPerEvent }}</div>
              <div class="stat-label">В среднем за мероприятие</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="points-filters mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-3">
          <select v-model="filters.type" class="form-select">
            <option value="">Все операции</option>
            <option value="earned">Начисления</option>
            <option value="spent">Списания</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.source" class="form-select">
            <option value="">Все источники</option>
            <option value="event_attendance">Посещение мероприятий</option>
            <option value="event_registration">Регистрация</option>
            <option value="purchase">Покупки</option>
            <option value="bonus">Бонусы</option>
            <option value="refund">Возвраты</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.period" class="form-select">
            <option value="">Все время</option>
            <option value="today">Сегодня</option>
            <option value="week">Эта неделя</option>
            <option value="month">Этот месяц</option>
            <option value="quarter">Этот квартал</option>
            <option value="year">Этот год</option>
          </select>
        </div>
        <div class="col-md-3">
          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-primary"
              @click="exportHistory"
            >
              <i class="fas fa-download me-1"></i>
              Экспорт
            </button>
            <button 
              class="btn btn-outline-secondary"
              @click="clearFilters"
            >
              <i class="fas fa-times me-1"></i>
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- График изменения баланса -->
    <div class="points-chart mb-4">
      <div class="chart-card">
        <div class="chart-header">
          <h5 class="chart-title">
            <i class="fas fa-chart-line me-2"></i>
            Изменение баланса баллов
          </h5>
          <div class="chart-controls">
            <button 
              v-for="period in chartPeriods" 
              :key="period.value"
              class="btn btn-sm"
              :class="selectedChartPeriod === period.value ? 'btn-primary' : 'btn-outline-primary'"
              @click="selectedChartPeriod = period.value"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
        <div class="chart-body">
          <canvas id="pointsChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- История операций -->
    <div class="points-history">
      <div class="history-header mb-3">
        <h5 class="history-title">
          <i class="fas fa-history me-2"></i>
          История операций
        </h5>
        <div class="history-summary">
          Найдено {{ filteredHistory.length }} операций на сумму 
          <span class="summary-amount">{{ formatNumber(totalFilteredAmount) }} баллов</span>
        </div>
      </div>

      <div v-if="loading" class="loading-state text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
        <p class="mt-2 text-muted">Загрузка истории...</p>
      </div>

      <div v-else-if="filteredHistory.length === 0" class="empty-state text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fas fa-receipt"></i>
        </div>
        <h5>Операции не найдены</h5>
        <p class="text-muted">
          {{ hasActiveFilters ? 'Попробуйте изменить фильтры' : 'История операций пуста' }}
        </p>
      </div>

      <div v-else class="history-timeline">
        <div 
          v-for="(group, date) in groupedHistory" 
          :key="date"
          class="timeline-group"
        >
          <div class="timeline-date">
            <h6 class="date-title">{{ date }}</h6>
            <div class="date-summary">
              {{ group.length }} операций, 
              <span :class="getDaySummaryClass(group)">
                {{ getDaySummaryText(group) }}
              </span>
            </div>
          </div>
          
          <div class="timeline-transactions">
            <div 
              v-for="transaction in group" 
              :key="transaction.id"
              class="transaction-item"
              :class="getTransactionClass(transaction.type)"
            >
              <div class="transaction-marker">
                <i :class="getTransactionIcon(transaction.type)"></i>
              </div>
              
              <div class="transaction-card">
                <div class="transaction-header">
                  <div class="transaction-info">
                    <h6 class="transaction-title">{{ transaction.description }}</h6>
                    <div class="transaction-meta">
                      <span class="transaction-time">
                        <i class="fas fa-clock me-1"></i>
                        {{ formatTime(transaction.createdAt) }}
                      </span>
                      <span class="transaction-source">
                        <i class="fas fa-tag me-1"></i>
                        {{ getSourceLabel(transaction.source) }}
                      </span>
                      <span v-if="transaction.relatedEvent" class="transaction-event">
                        <i class="fas fa-calendar me-1"></i>
                        {{ transaction.relatedEvent.title }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="transaction-amount" :class="getAmountClass(transaction.type)">
                    <span class="amount-value">
                      {{ transaction.type === 'earned' ? '+' : '-' }}{{ formatNumber(transaction.points) }}
                    </span>
                    <span class="amount-label">баллов</span>
                  </div>
                </div>

                <div v-if="transaction.details" class="transaction-details">
                  <div v-if="transaction.balanceBefore !== undefined" class="balance-info">
                    <span class="balance-before">Было: {{ formatNumber(transaction.balanceBefore) }}</span>
                    <i class="fas fa-arrow-right mx-2"></i>
                    <span class="balance-after">Стало: {{ formatNumber(transaction.balanceAfter) }}</span>
                  </div>
                  
                  <div v-if="transaction.multiplier > 1" class="multiplier-info">
                    <i class="fas fa-times me-1"></i>
                    Множитель: {{ transaction.multiplier }}x
                  </div>
                  
                  <div v-if="transaction.expiration" class="expiration-info">
                    <i class="fas fa-hourglass-end me-1"></i>
                    Действительно до: {{ formatDate(transaction.expiration) }}
                  </div>
                </div>

                <div v-if="transaction.canRefund" class="transaction-actions">
                  <button 
                    class="btn btn-sm btn-outline-warning"
                    @click="requestRefund(transaction)"
                  >
                    <i class="fas fa-undo me-1"></i>
                    Вернуть
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <div v-if="pagination.totalPages > 1" class="pagination-section mt-4">
        <nav aria-label="Навигация по страницам">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
              <button class="page-link" @click="goToPage(pagination.currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </button>
            </li>
            
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.currentPage }"
            >
              <button class="page-link" @click="goToPage(page)">
                {{ page }}
              </button>
            </li>
            
            <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.totalPages }">
              <button class="page-link" @click="goToPage(pagination.currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ProfilePointsTab',
  setup() {
    const toast = useToast()
    const appStore = useAppStore()
    const authStore = useAuthStore()

    // Состояние
    const loading = ref(false)
    const selectedChartPeriod = ref('month')
    
    const filters = ref({
      type: '',
      source: '',
      period: ''
    })

    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      perPage: 20
    })

    const pointsHistory = ref([])
    const pointsStats = ref({
      totalEarned: 0,
      totalSpent: 0,
      thisMonth: 0,
      avgPerEvent: 0
    })

    const chartPeriods = ref([
      { value: 'week', label: 'Неделя' },
      { value: 'month', label: 'Месяц' },
      { value: 'quarter', label: 'Квартал' },
      { value: 'year', label: 'Год' }
    ])

    // Вычисляемые свойства
    const currentBalance = computed(() => {
      return authStore.user?.points || 0
    })

    const balanceChangeIcon = computed(() => {
      const change = pointsStats.value.thisMonth
      return change > 0 ? 'fas fa-arrow-up text-success' : 
             change < 0 ? 'fas fa-arrow-down text-danger' : 
             'fas fa-minus text-muted'
    })

    const balanceChangeText = computed(() => {
      const change = pointsStats.value.thisMonth
      if (change > 0) return `+${formatNumber(change)} за месяц`
      if (change < 0) return `${formatNumber(change)} за месяц`
      return 'Нет изменений за месяц'
    })

    const hasActiveFilters = computed(() => {
      return filters.value.type || filters.value.source || filters.value.period
    })

    const filteredHistory = computed(() => {
      let filtered = [...pointsHistory.value]

      if (filters.value.type) {
        filtered = filtered.filter(item => item.type === filters.value.type)
      }

      if (filters.value.source) {
        filtered = filtered.filter(item => item.source === filters.value.source)
      }

      if (filters.value.period) {
        const now = new Date()
        const periodStart = getPeriodStart(filters.value.period, now)
        filtered = filtered.filter(item => new Date(item.createdAt) >= periodStart)
      }

      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const groupedHistory = computed(() => {
      const groups = {}
      
      filteredHistory.value.forEach(transaction => {
        const dateKey = formatDateKey(transaction.createdAt)
        if (!groups[dateKey]) {
          groups[dateKey] = []
        }
        groups[dateKey].push(transaction)
      })

      return groups
    })

    const totalFilteredAmount = computed(() => {
      return filteredHistory.value.reduce((sum, item) => {
        return sum + (item.type === 'earned' ? item.points : -item.points)
      }, 0)
    })

    const visiblePages = computed(() => {
      const current = pagination.value.currentPage
      const total = pagination.value.totalPages
      const delta = 2

      const range = []
      const rangeWithDots = []

      for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i)
      }

      if (current - delta > 2) {
        rangeWithDots.push(1, '...')
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (current + delta < total - 1) {
        rangeWithDots.push('...', total)
      } else {
        rangeWithDots.push(total)
      }

      return rangeWithDots.filter(item => item !== 1 || total > 1)
    })

    // Методы
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }

    const formatDate = (date) => {
      return appStore.formatDate(date, 'dd MMM yyyy')
    }

    const formatDateKey = (date) => {
      return appStore.formatDate(date, 'dd MMMM yyyy')
    }

    const formatTime = (date) => {
      return appStore.formatDate(date, 'HH:mm')
    }

    const getPeriodStart = (period, now) => {
      switch (period) {
        case 'today':
          return new Date(now.getFullYear(), now.getMonth(), now.getDate())
        case 'week':
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          return weekStart
        case 'month':
          return new Date(now.getFullYear(), now.getMonth(), 1)
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3)
          return new Date(now.getFullYear(), quarter * 3, 1)
        case 'year':
          return new Date(now.getFullYear(), 0, 1)
        default:
          return new Date(0)
      }
    }

    const getSourceLabel = (source) => {
      const labels = {
        event_attendance: 'Посещение мероприятия',
        event_registration: 'Регистрация на мероприятие',
        purchase: 'Покупка',
        bonus: 'Бонус',
        refund: 'Возврат'
      }
      return labels[source] || 'Неизвестно'
    }

    const getTransactionClass = (type) => {
      return type === 'earned' ? 'transaction-earned' : 'transaction-spent'
    }

    const getTransactionIcon = (type) => {
      return type === 'earned' ? 'fas fa-plus' : 'fas fa-minus'
    }

    const getAmountClass = (type) => {
      return type === 'earned' ? 'amount-positive' : 'amount-negative'
    }

    const getDaySummaryClass = (transactions) => {
      const total = transactions.reduce((sum, t) => {
        return sum + (t.type === 'earned' ? t.points : -t.points)
      }, 0)
      
      return total > 0 ? 'text-success' : total < 0 ? 'text-danger' : 'text-muted'
    }

    const getDaySummaryText = (transactions) => {
      const total = transactions.reduce((sum, t) => {
        return sum + (t.type === 'earned' ? t.points : -t.points)
      }, 0)
      
      if (total > 0) return `+${formatNumber(total)} баллов`
      if (total < 0) return `${formatNumber(total)} баллов`
      return '0 баллов'
    }

    const loadPointsHistory = async () => {
      try {
        loading.value = true
        
        // Здесь будет API вызов
        // const response = await api.get('/users/me/points/history')
        // pointsHistory.value = response.data.history
        // pointsStats.value = response.data.stats
        
        // Заглушка с демо данными
        await new Promise(resolve => setTimeout(resolve, 500))
        
        pointsHistory.value = [
          {
            id: '1',
            type: 'earned',
            points: 100,
            description: 'Участие в тренинге по лидерству',
            source: 'event_attendance',
            balanceBefore: 450,
            balanceAfter: 550,
            multiplier: 1,
            createdAt: new Date(Date.now() - 86400000),
            relatedEvent: { title: 'Тренинг по лидерству' },
            canRefund: false
          },
          {
            id: '2',
            type: 'spent',
            points: 50,
            description: 'Покупка обеда в кафетерии',
            source: 'purchase',
            balanceBefore: 550,
            balanceAfter: 500,
            createdAt: new Date(Date.now() - 86400000 * 2),
            canRefund: true
          },
          {
            id: '3',
            type: 'earned',
            points: 200,
            description: 'Участие в корпоративном хакатоне',
            source: 'event_attendance',
            balanceBefore: 350,
            balanceAfter: 550,
            multiplier: 2,
            createdAt: new Date(Date.now() - 86400000 * 7),
            relatedEvent: { title: 'Корпоративный хакатон' },
            canRefund: false
          },
          {
            id: '4',
            type: 'earned',
            points: 50,
            description: 'Бонус за активность',
            source: 'bonus',
            balanceBefore: 300,
            balanceAfter: 350,
            createdAt: new Date(Date.now() - 86400000 * 10),
            canRefund: false
          }
        ]

        pointsStats.value = {
          totalEarned: 2500,
          totalSpent: 800,
          thisMonth: 350,
          avgPerEvent: 125
        }
      } catch (error) {
        console.error('Ошибка загрузки истории баллов:', error)
        toast.error('Ошибка загрузки истории баллов')
      } finally {
        loading.value = false
      }
    }

    const createPointsChart = () => {
      // Здесь будет создание графика изменения баланса
      const canvas = document.getElementById('pointsChart')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#e9ecef'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#333'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('График изменения баланса баллов', canvas.width/2, canvas.height/2)
      }
    }

    const clearFilters = () => {
      filters.value = {
        type: '',
        source: '',
        period: ''
      }
    }

    const exportHistory = () => {
      // Экспорт истории в CSV или Excel
      toast.info('Экспорт истории будет доступен в следующей версии')
    }

    const requestRefund = async (transaction) => {
      try {
        // await api.post(`/points/transactions/${transaction.id}/refund`)
        
        // Обновляем транзакцию в списке
        const index = pointsHistory.value.findIndex(t => t.id === transaction.id)
        if (index !== -1) {
          pointsHistory.value[index].canRefund = false
        }
        
        toast.success('Запрос на возврат отправлен')
      } catch (error) {
        console.error('Ошибка запроса возврата:', error)
        toast.error('Ошибка запроса возврата')
      }
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        pagination.value.currentPage = page
        // Здесь можно добавить загрузку новой страницы
      }
    }

    // Watchers
    watch(() => [filters.value.type, filters.value.source, filters.value.period], () => {
      pagination.value.currentPage = 1
    })

    watch(() => selectedChartPeriod.value, () => {
      createPointsChart()
    })

    // Инициализация
    onMounted(() => {
      loadPointsHistory()
      setTimeout(createPointsChart, 100)
    })

    return {
      loading,
      selectedChartPeriod,
      filters,
      pagination,
      pointsHistory,
      pointsStats,
      chartPeriods,
      currentBalance,
      balanceChangeIcon,
      balanceChangeText,
      hasActiveFilters,
      filteredHistory,
      groupedHistory,
      totalFilteredAmount,
      visiblePages,
      
      formatNumber,
      formatDate,
      formatTime,
      getSourceLabel,
      getTransactionClass,
      getTransactionIcon,
      getAmountClass,
      getDaySummaryClass,
      getDaySummaryText,
      clearFilters,
      exportHistory,
      requestRefund,
      goToPage
    }
  }
}
</script>

<style scoped>
.profile-points-tab {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Обзор баланса */
.points-overview {
  margin-bottom: 2rem;
}

.balance-card {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  height: 100%;
  box-shadow: 0 0.25rem 0.5rem rgba(255, 193, 7, 0.3);
}

.balance-icon {
  font-size: 3rem;
  margin-right: 1.5rem;
  opacity: 0.8;
}

.balance-content {
  flex: 1;
}

.balance-amount {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.balance-label {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.balance-change {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  opacity: 0.8;
}

.stats-grid {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  height: 100%;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--bs-primary);
  margin-bottom: 0.25rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
}

/* Фильтры */
.points-filters {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* График */
.points-chart {
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
}

.chart-body {
  padding: 1.5rem;
}

/* История */
.points-history {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.history-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.history-summary {
  font-size: 0.9rem;
  color: #6c757d;
}

.summary-amount {
  font-weight: 600;
  color: var(--bs-primary);
}

/* Timeline */
.history-timeline {
  margin-top: 1.5rem;
}

.timeline-group {
  margin-bottom: 2rem;
}

.timeline-date {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 2px solid var(--bs-primary);
  margin-bottom: 1.5rem;
}

.date-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.date-summary {
  font-size: 0.9rem;
  color: #6c757d;
}

.timeline-transactions {
  position: relative;
}

.timeline-transactions::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.transaction-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 3rem;
}

.transaction-marker {
  position: absolute;
  left: 12px;
  top: 1rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 3px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: #6c757d;
}

.transaction-item.transaction-earned .transaction-marker {
  border-color: #198754;
  color: #198754;
}

.transaction-item.transaction-spent .transaction-marker {
  border-color: #dc3545;
  color: #dc3545;
}

/* Transaction card */
.transaction-card {
  background: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s ease;
}

.transaction-card:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.transaction-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.transaction-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.transaction-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.transaction-meta span {
  display: flex;
  align-items: center;
}

.transaction-meta i {
  color: var(--bs-primary);
  width: 14px;
}

.transaction-amount {
  text-align: right;
  flex-shrink: 0;
}

.amount-value {
  font-size: 1.25rem;
  font-weight: 700;
  display: block;
  line-height: 1;
}

.amount-positive .amount-value {
  color: #198754;
}

.amount-negative .amount-value {
  color: #dc3545;
}

.amount-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.transaction-details {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.balance-info {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.balance-before,
.balance-after {
  font-weight: 500;
}

.balance-after {
  color: #333;
}

.multiplier-info {
  color: #ffc107;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.5rem;
}

.expiration-info {
  color: #dc3545;
  text-align: center;
  font-size: 0.85rem;
}

.transaction-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Пагинация */
.pagination-section {
  background: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 2rem;
}

.pagination .page-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
  margin: 0 0.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.pagination .page-link:hover {
  background-color: var(--bs-primary);
  color: white;
  transform: translateY(-1px);
}

.pagination .page-item.active .page-link {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.3);
}

.pagination .page-item.disabled .page-link {
  opacity: 0.5;
  pointer-events: none;
}

/* Пустые состояния */
.loading-state,
.empty-state {
  padding: 2rem;
}

.empty-icon {
  font-size: 3rem;
  color: #6c757d;
  opacity: 0.5;
}

.empty-state h5 {
  color: #333;
  margin-bottom: 1rem;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .balance-card {
    margin-bottom: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .chart-controls {
    justify-content: center;
  }
  
  .history-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}

@media (max-width: 767.98px) {
  .balance-card {
    flex-direction: column;
    text-align: center;
  }
  
  .balance-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .timeline-date {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .transaction-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .transaction-amount {
    text-align: left;
  }
  
  .transaction-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .transaction-item {
    padding-left: 2rem;
  }
  
  .transaction-marker {
    left: 8px;
  }
  
  .timeline-transactions::before {
    left: 16px;
  }
  
  .balance-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .balance-info i {
    transform: rotate(90deg);
  }
}

/* Темная тема */
[data-theme="dark"] .stats-grid,
[data-theme="dark"] .points-filters,
[data-theme="dark"] .chart-card,
[data-theme="dark"] .points-history,
[data-theme="dark"] .loading-state,
[data-theme="dark"] .empty-state {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .chart-header {
  background-color: #1a1a1a;
  border-color: #444444;
}

[data-theme="dark"] .chart-title,
[data-theme="dark"] .history-title,
[data-theme="dark"] .date-title,
[data-theme="dark"] .transaction-title {
  color: #ffffff;
}

[data-theme="dark"] .transaction-card {
  background-color: #1a1a1a;
}

[data-theme="dark"] .transaction-card:hover {
  background-color: #404040;
}

[data-theme="dark"] .transaction-details {
  background-color: #404040;
}

[data-theme="dark"] .timeline-transactions::before {
  background: #444444;
}

[data-theme="dark"] .transaction-marker {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .pagination-section {
  background-color: #1a1a1a;
}

/* Анимации */
.transaction-item {
  animation: slideInLeft 0.5s ease-out;
  animation-fill-mode: both;
}

.transaction-item:nth-child(1) { animation-delay: 0.1s; }
.transaction-item:nth-child(2) { animation-delay: 0.2s; }
.transaction-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Спецэффекты */
.transaction-earned .amount-value {
  animation: countUp 0.5s ease-out;
}

.transaction-spent .amount-value {
  animation: countDown 0.5s ease-out;
}

@keyframes countUp {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes countDown {
  from { transform: scale(1.2); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>