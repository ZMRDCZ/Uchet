<template>
  <div class="compare-users">
    <!-- Заголовок сравнения -->
    <div class="compare-header mb-4">
      <h5 class="compare-title text-center">
        <i class="fas fa-balance-scale me-2"></i>
        Сравнение результатов
      </h5>
    </div>

    <!-- Основное сравнение -->
    <div class="users-comparison">
      <div class="row g-4">
        <!-- Пользователь 1 -->
        <div class="col-md-5">
          <div class="user-card user-left">
            <div class="user-header">
              <div class="user-avatar">
                <img 
                  v-if="user1.avatar" 
                  :src="user1.avatar" 
                  :alt="user1.name"
                />
                <div v-else class="avatar-placeholder">
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <div class="user-info">
                <h6 class="user-name">{{ user1.name }}</h6>
                <div class="user-department">{{ user1.department }}</div>
                <div class="user-position">{{ user1.position }}</div>
              </div>
            </div>

            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-label">Баллы</div>
                <div class="stat-value">{{ formatNumber(user1.points || 0) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Мероприятия</div>
                <div class="stat-value">{{ user1.eventsCount || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Достижения</div>
                <div class="stat-value">{{ user1.achievementsCount || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Покупки</div>
                <div class="stat-value">{{ user1.purchasesCount || 0 }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Сравнительные показатели -->
        <div class="col-md-2">
          <div class="comparison-metrics">
            <div class="metric-row">
              <div class="metric-bar">
                <div class="metric-label">Баллы</div>
                <div class="bars-container">
                  <div class="bar bar-left" :style="{ width: getBarWidth('points', 'user1') + '%' }"></div>
                  <div class="bar bar-right" :style="{ width: getBarWidth('points', 'user2') + '%' }"></div>
                </div>
                <div class="metric-difference">
                  {{ getDifference('points') }}
                </div>
              </div>
            </div>

            <div class="metric-row">
              <div class="metric-bar">
                <div class="metric-label">Мероприятия</div>
                <div class="bars-container">
                  <div class="bar bar-left" :style="{ width: getBarWidth('eventsCount', 'user1') + '%' }"></div>
                  <div class="bar bar-right" :style="{ width: getBarWidth('eventsCount', 'user2') + '%' }"></div>
                </div>
                <div class="metric-difference">
                  {{ getDifference('eventsCount') }}
                </div>
              </div>
            </div>

            <div class="metric-row">
              <div class="metric-bar">
                <div class="metric-label">Достижения</div>
                <div class="bars-container">
                  <div class="bar bar-left" :style="{ width: getBarWidth('achievementsCount', 'user1') + '%' }"></div>
                  <div class="bar bar-right" :style="{ width: getBarWidth('achievementsCount', 'user2') + '%' }"></div>
                </div>
                <div class="metric-difference">
                  {{ getDifference('achievementsCount') }}
                </div>
              </div>
            </div>

            <div class="metric-row">
              <div class="metric-bar">
                <div class="metric-label">Покупки</div>
                <div class="bars-container">
                  <div class="bar bar-left" :style="{ width: getBarWidth('purchasesCount', 'user1') + '%' }"></div>
                  <div class="bar bar-right" :style="{ width: getBarWidth('purchasesCount', 'user2') + '%' }"></div>
                </div>
                <div class="metric-difference">
                  {{ getDifference('purchasesCount') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Пользователь 2 -->
        <div class="col-md-5">
          <div class="user-card user-right">
            <div class="user-header">
              <div class="user-info">
                <h6 class="user-name">{{ user2.name }}</h6>
                <div class="user-department">{{ user2.department }}</div>
                <div class="user-position">{{ user2.position }}</div>
              </div>
              <div class="user-avatar">
                <img 
                  v-if="user2.avatar" 
                  :src="user2.avatar" 
                  :alt="user2.name"
                />
                <div v-else class="avatar-placeholder">
                  <i class="fas fa-user"></i>
                </div>
              </div>
            </div>

            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-value">{{ formatNumber(user2.points || 0) }}</div>
                <div class="stat-label">Баллы</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ user2.eventsCount || 0 }}</div>
                <div class="stat-label">Мероприятия</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ user2.achievementsCount || 0 }}</div>
                <div class="stat-label">Достижения</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ user2.purchasesCount || 0 }}</div>
                <div class="stat-label">Покупки</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Детальное сравнение -->
    <div class="detailed-comparison mt-4">
      <div class="row g-4">
        <!-- Активность по времени -->
        <div class="col-md-6">
          <div class="comparison-section">
            <h6 class="section-title">
              <i class="fas fa-chart-line me-2"></i>
              Активность по времени
            </h6>
            <div class="activity-chart">
              <canvas id="activityComparisonChart" width="300" height="150"></canvas>
            </div>
          </div>
        </div>

        <!-- Распределение по категориям -->
        <div class="col-md-6">
          <div class="comparison-section">
            <h6 class="section-title">
              <i class="fas fa-chart-pie me-2"></i>
              Распределение активности
            </h6>
            <div class="category-comparison">
              <div class="category-item">
                <div class="category-name">Участие в мероприятиях</div>
                <div class="category-bars">
                  <div class="category-bar">
                    <div class="bar-fill user1-bar" :style="{ width: getActivityPercentage('events', user1) + '%' }"></div>
                    <span class="bar-label">{{ getActivityPercentage('events', user1) }}%</span>
                  </div>
                  <div class="category-bar">
                    <div class="bar-fill user2-bar" :style="{ width: getActivityPercentage('events', user2) + '%' }"></div>
                    <span class="bar-label">{{ getActivityPercentage('events', user2) }}%</span>
                  </div>
                </div>
              </div>

              <div class="category-item">
                <div class="category-name">Получение достижений</div>
                <div class="category-bars">
                  <div class="category-bar">
                    <div class="bar-fill user1-bar" :style="{ width: getActivityPercentage('achievements', user1) + '%' }"></div>
                    <span class="bar-label">{{ getActivityPercentage('achievements', user1) }}%</span>
                  </div>
                  <div class="category-bar">
                    <div class="bar-fill user2-bar" :style="{ width: getActivityPercentage('achievements', user2) + '%' }"></div>
                    <span class="bar-label">{{ getActivityPercentage('achievements', user2) }}%</span>
                  </div>
                </div>
              </div>

              <div class="category-item">
                <div class="category-name">Использование наград</div>
                <div class="category-bars">
                  <div class="category-bar">
                    <div class="bar-fill user1-bar" :style="{ width: getActivityPercentage('purchases', user1) + '%' }"></div>
                    <span class="bar-label">{{ getActivityPercentage('purchases', user1) }}%</span>
                  </div>
                  <div class="category-bar">
                    <div class="bar-fill user2-bar" :style="{ width: getActivityPercentage('purchases', user2) + '%' }"></div>
                    <span class="bar-label">{{ getActivityPercentage('purchases', user2) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Заключение сравнения -->
    <div class="comparison-summary mt-4">
      <div class="summary-card">
        <h6 class="summary-title">
          <i class="fas fa-lightbulb me-2"></i>
          Итоги сравнения
        </h6>
        <div class="summary-content">
          <div class="summary-item">
            <strong>Лидер по баллам:</strong>
            <span class="leader-name">{{ getLeader('points') }}</span>
            <span class="leader-advantage">+{{ getAdvantage('points') }} баллов</span>
          </div>
          <div class="summary-item">
            <strong>Более активен в мероприятиях:</strong>
            <span class="leader-name">{{ getLeader('eventsCount') }}</span>
            <span class="leader-advantage">+{{ getAdvantage('eventsCount') }} мероприятий</span>
          </div>
          <div class="summary-item">
            <strong>Больше достижений:</strong>
            <span class="leader-name">{{ getLeader('achievementsCount') }}</span>
            <span class="leader-advantage">+{{ getAdvantage('achievementsCount') }} достижений</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

export default {
  name: 'CompareUsers',
  props: {
    user1: {
      type: Object,
      required: true
    },
    user2: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const appStore = useAppStore()

    // Методы
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }

    const getBarWidth = (metric, userKey) => {
      const user1Value = props.user1[metric] || 0
      const user2Value = props.user2[metric] || 0
      const maxValue = Math.max(user1Value, user2Value)
      
      if (maxValue === 0) return 0
      
      const currentValue = userKey === 'user1' ? user1Value : user2Value
      return (currentValue / maxValue) * 100
    }

    const getDifference = (metric) => {
      const user1Value = props.user1[metric] || 0
      const user2Value = props.user2[metric] || 0
      const diff = Math.abs(user1Value - user2Value)
      
      if (diff === 0) return '='
      
      const winner = user1Value > user2Value ? '←' : '→'
      return `${winner} ${formatNumber(diff)}`
    }

    const getActivityPercentage = (category, user) => {
      // Рассчитываем процент активности для категории
      const totalActivity = (user.eventsCount || 0) + (user.achievementsCount || 0) + (user.purchasesCount || 0)
      if (totalActivity === 0) return 0
      
      let categoryValue = 0
      switch (category) {
        case 'events':
          categoryValue = user.eventsCount || 0
          break
        case 'achievements':
          categoryValue = user.achievementsCount || 0
          break
        case 'purchases':
          categoryValue = user.purchasesCount || 0
          break
      }
      
      return Math.round((categoryValue / totalActivity) * 100)
    }

    const getLeader = (metric) => {
      const user1Value = props.user1[metric] || 0
      const user2Value = props.user2[metric] || 0
      
      if (user1Value === user2Value) return 'Равенство'
      
      return user1Value > user2Value ? props.user1.name : props.user2.name
    }

    const getAdvantage = (metric) => {
      const user1Value = props.user1[metric] || 0
      const user2Value = props.user2[metric] || 0
      
      return formatNumber(Math.abs(user1Value - user2Value))
    }

    const createActivityChart = () => {
      // Здесь будет создание графика сравнения активности
      const canvas = document.getElementById('activityComparisonChart')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#f8f9fa'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#333'
        ctx.font = '14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('График сравнения активности', canvas.width/2, canvas.height/2)
      }
    }

    // Инициализация
    onMounted(() => {
      setTimeout(createActivityChart, 100)
    })

    return {
      formatNumber,
      getBarWidth,
      getDifference,
      getActivityPercentage,
      getLeader,
      getAdvantage
    }
  }
}
</script>

<style scoped>
.compare-users {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.compare-title {
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Карточки пользователей */
.user-card {
  background: #f8f9fa;
  border-radius: 1rem;
  padding: 1.5rem;
  height: 100%;
}

.user-left {
  border-left: 4px solid #007bff;
}

.user-right {
  border-right: 4px solid #dc3545;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-right .user-header {
  flex-direction: row-reverse;
  text-align: right;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
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
  font-size: 1.5rem;
}

.user-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.user-department {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.user-position {
  font-size: 0.8rem;
  color: #999;
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.user-right .stat-item {
  flex-direction: row-reverse;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

/* Сравнительные метрики */
.comparison-metrics {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding: 1rem 0;
}

.metric-row {
  margin-bottom: 1.5rem;
}

.metric-bar {
  text-align: center;
}

.metric-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.bars-container {
  display: flex;
  align-items: center;
  height: 20px;
  margin-bottom: 0.5rem;
  position: relative;
}

.bar {
  height: 100%;
  transition: width 0.5s ease;
}

.bar-left {
  background: linear-gradient(90deg, #007bff, #0056b3);
  border-radius: 10px 0 0 10px;
}

.bar-right {
  background: linear-gradient(90deg, #dc3545, #c82333);
  border-radius: 0 10px 10px 0;
  margin-left: auto;
}

.metric-difference {
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
}

/* Детальное сравнение */
.comparison-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  height: 100%;
}

.section-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.activity-chart {
  text-align: center;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Сравнение по категориям */
.category-comparison {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.category-bars {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-bar {
  display: flex;
  align-items: center;
  height: 24px;
  background: #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 12px;
}

.user1-bar {
  background: linear-gradient(90deg, #007bff, #0056b3);
}

.user2-bar {
  background: linear-gradient(90deg, #dc3545, #c82333);
}

.bar-label {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Итоги сравнения */
.summary-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 1rem;
  padding: 1.5rem;
}

.summary-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.leader-name {
  color: #007bff;
  font-weight: 600;
}

.leader-advantage {
  color: #28a745;
  font-weight: 500;
  background: rgba(40, 167, 69, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
}

/* Адаптивность */
@media (max-width: 767.98px) {
  .user-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-right .user-header {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .user-right .stat-item {
    flex-direction: column;
  }
  
  .comparison-metrics {
    padding: 0.5rem 0;
  }
  
  .bars-container {
    height: 16px;
  }
  
  .category-bars {
    gap: 0.5rem;
  }
  
  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

/* Темная тема */
[data-theme="dark"] .user-card,
[data-theme="dark"] .comparison-section,
[data-theme="dark"] .summary-card {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .stat-item {
  background-color: #1a1a1a;
}

[data-theme="dark"] .compare-title,
[data-theme="dark"] .section-title,
[data-theme="dark"] .summary-title,
[data-theme="dark"] .user-name,
[data-theme="dark"] .stat-value,
[data-theme="dark"] .metric-label,
[data-theme="dark"] .category-name {
  color: #ffffff;
}

[data-theme="dark"] .category-bar {
  background-color: #444444;
}

/* Анимации */
.user-card {
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.user-left {
  animation-delay: 0.1s;
}

.user-right {
  animation-delay: 0.2s;
}

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

.bar-fill {
  animation: expandWidth 1s ease-out 0.5s both;
}

@keyframes expandWidth {
  from { width: 0; }
}

.stat-item {
  animation: fadeInScale 0.5s ease-out;
  animation-fill-mode: both;
}

.stat-item:nth-child(1) { animation-delay: 0.3s; }
.stat-item:nth-child(2) { animation-delay: 0.4s; }
.stat-item:nth-child(3) { animation-delay: 0.5s; }
.stat-item:nth-child(4) { animation-delay: 0.6s; }

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>