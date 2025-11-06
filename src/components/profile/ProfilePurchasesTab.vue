<template>
  <div class="profile-purchases-tab">
    <!-- Статистика покупок -->
    <div class="purchases-stats mb-4">
      <div class="row g-3">
        <div class="col-lg-3 col-md-6">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ purchaseStats.totalPurchases }}</h3>
              <p class="stat-label">Всего покупок</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-coins"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ formatNumber(purchaseStats.totalSpent) }}</h3>
              <p class="stat-label">Баллов потрачено</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-ruble-sign"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ formatCurrency(purchaseStats.totalSaved) }}</h3>
              <p class="stat-label">Сэкономлено</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ purchaseStats.averageRating }}</h3>
              <p class="stat-label">Средняя оценка</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="purchases-filters mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-3">
          <select v-model="filters.category" class="form-select">
            <option value="">Все категории</option>
            <option value="service">Услуги</option>
            <option value="prize">Призы</option>
            <option value="voucher">Ваучеры</option>
            <option value="privilege">Привилегии</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.status" class="form-select">
            <option value="">Все статусы</option>
            <option value="completed">Завершено</option>
            <option value="pending">В обработке</option>
            <option value="used">Использовано</option>
            <option value="expired">Просрочено</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.period" class="form-select">
            <option value="">Все время</option>
            <option value="month">Этот месяц</option>
            <option value="quarter">Этот квартал</option>
            <option value="year">Этот год</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.sortBy" class="form-select">
            <option value="date_desc">По дате (новые)</option>
            <option value="date_asc">По дате (старые)</option>
            <option value="cost_desc">По стоимости (дорогие)</option>
            <option value="cost_asc">По стоимости (дешевые)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- График покупок -->
    <div class="purchases-chart mb-4">
      <div class="chart-card">
        <div class="chart-header">
          <h5 class="chart-title">
            <i class="fas fa-chart-area me-2"></i>
            Покупки по месяцам
          </h5>
        </div>
        <div class="chart-body">
          <canvas id="purchasesChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Список покупок -->
    <div class="purchases-list">
      <div v-if="loading" class="loading-state text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
        <p class="mt-2 text-muted">Загрузка покупок...</p>
      </div>

      <div v-else-if="filteredPurchases.length === 0" class="empty-state text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <h5>Покупки не найдены</h5>
        <p class="text-muted">
          {{ hasActiveFilters ? 'Попробуйте изменить фильтры' : 'Вы еще не совершали покупок' }}
        </p>
        <router-link to="/rewards" class="btn btn-primary">
          Посмотреть каталог
        </router-link>
      </div>

      <div v-else class="purchases-grid">
        <div 
          v-for="purchase in filteredPurchases" 
          :key="purchase.id"
          class="purchase-card"
          :class="getPurchaseStatusClass(purchase.status)"
        >
          <!-- Изображение товара -->
          <div class="purchase-image">
            <img 
              v-if="purchase.reward.image" 
              :src="purchase.reward.image" 
              :alt="purchase.reward.name"
              class="img-fluid"
            />
            <div v-else class="purchase-placeholder">
              <i :class="getCategoryIcon(purchase.reward.category)"></i>
            </div>
            
            <!-- Статус покупки -->
            <div class="purchase-status">
              <span class="status-badge" :class="getPurchaseStatusClass(purchase.status)">
                <i :class="getStatusIcon(purchase.status)"></i>
                {{ getStatusLabel(purchase.status) }}
              </span>
            </div>
          </div>

          <!-- Информация о покупке -->
          <div class="purchase-info">
            <div class="purchase-header">
              <h6 class="purchase-title">{{ purchase.reward.name }}</h6>
              <div class="purchase-category">
                {{ getCategoryLabel(purchase.reward.category) }}
              </div>
            </div>

            <div class="purchase-details">
              <div class="purchase-date">
                <i class="fas fa-calendar me-1"></i>
                {{ formatDate(purchase.createdAt) }}
              </div>
              <div class="purchase-cost">
                <i class="fas fa-coins me-1"></i>
                {{ formatNumber(purchase.pointsUsed) }} баллов
              </div>
              <div v-if="purchase.originalPrice" class="purchase-savings">
                <i class="fas fa-piggy-bank me-1"></i>
                Сэкономлено: {{ formatCurrency(purchase.savings) }}
              </div>
            </div>

            <!-- Дополнительная информация -->
            <div v-if="purchase.code || purchase.validUntil" class="purchase-extra">
              <div v-if="purchase.code" class="purchase-code">
                <label>Код активации:</label>
                <div class="code-display">
                  <code>{{ purchase.code }}</code>
                  <button 
                    class="btn btn-sm btn-outline-secondary"
                    @click="copyCode(purchase.code)"
                  >
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              
              <div v-if="purchase.validUntil" class="purchase-validity">
                <i class="fas fa-clock me-1"></i>
                Действительно до: {{ formatDate(purchase.validUntil) }}
                <span v-if="isExpiringSoon(purchase.validUntil)" class="badge bg-warning ms-2">
                  Скоро истекает
                </span>
              </div>
            </div>

            <!-- Действия -->
            <div class="purchase-actions">
              <button 
                v-if="purchase.status === 'completed' && canUse(purchase)"
                class="btn btn-sm btn-success"
                @click="usePurchase(purchase)"
              >
                <i class="fas fa-check me-1"></i>
                Использовать
              </button>
              
              <button 
                v-if="purchase.downloadUrl"
                class="btn btn-sm btn-outline-primary"
                @click="downloadItem(purchase.downloadUrl)"
              >
                <i class="fas fa-download me-1"></i>
                Скачать
              </button>
              
              <button 
                v-if="purchase.status === 'completed' && !purchase.feedback"
                class="btn btn-sm btn-outline-info"
                @click="leaveFeedback(purchase)"
              >
                <i class="fas fa-star me-1"></i>
                Оценить
              </button>
              
              <button 
                class="btn btn-sm btn-outline-secondary"
                @click="viewPurchaseDetails(purchase)"
              >
                <i class="fas fa-eye me-1"></i>
                Подробнее
              </button>
            </div>

            <!-- Отзыв -->
            <div v-if="purchase.feedback" class="purchase-feedback">
              <div class="feedback-header">
                <div class="feedback-rating">
                  <span class="rating-label">Ваша оценка:</span>
                  <div class="rating-stars">
                    <i 
                      v-for="star in 5" 
                      :key="star"
                      class="fas fa-star"
                      :class="{ active: star <= purchase.feedback.rating }"
                    ></i>
                  </div>
                </div>
                <span class="feedback-date">
                  {{ formatRelativeTime(purchase.feedback.createdAt) }}
                </span>
              </div>
              <div v-if="purchase.feedback.comment" class="feedback-comment">
                "{{ purchase.feedback.comment }}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно деталей покупки -->
    <div 
      id="purchaseDetailsModal" 
      class="modal fade" 
      tabindex="-1" 
      aria-labelledby="purchaseDetailsModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="purchaseDetailsModalLabel" class="modal-title">
              Детали покупки
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Закрыть"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedPurchase" class="purchase-details-content">
              <!-- Содержимое будет заполнено динамически -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно обратной связи -->
    <div 
      id="feedbackModal" 
      class="modal fade" 
      tabindex="-1" 
      aria-labelledby="feedbackModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="feedbackModalLabel" class="modal-title">
              Оценить покупку
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Закрыть"
            ></button>
          </div>
          <form @submit.prevent="submitFeedback">
            <div class="modal-body">
              <div v-if="selectedPurchase" class="mb-3">
                <h6>{{ selectedPurchase.reward.name }}</h6>
                <p class="text-muted small">{{ formatDate(selectedPurchase.createdAt) }}</p>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Оценка</label>
                <div class="rating-input">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="star-btn"
                    :class="{ active: star <= feedbackForm.rating }"
                    @click="feedbackForm.rating = star"
                  >
                    <i class="fas fa-star"></i>
                  </button>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="feedbackComment" class="form-label">Комментарий (необязательно)</label>
                <textarea 
                  id="feedbackComment"
                  v-model="feedbackForm.comment"
                  class="form-control"
                  rows="4"
                  placeholder="Поделитесь впечатлениями о покупке..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Отмена
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!feedbackForm.rating || feedbackLoading"
              >
                <span v-if="feedbackLoading" class="spinner-border spinner-border-sm me-2"></span>
                Отправить отзыв
              </button>
            </div>
          </form>
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

export default {
  name: 'ProfilePurchasesTab',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const appStore = useAppStore()

    // Состояние
    const loading = ref(false)
    const feedbackLoading = ref(false)
    const selectedPurchase = ref(null)
    
    const filters = ref({
      category: '',
      status: '',
      period: '',
      sortBy: 'date_desc'
    })

    const feedbackForm = ref({
      rating: 0,
      comment: ''
    })

    const purchases = ref([])
    const purchaseStats = ref({
      totalPurchases: 0,
      totalSpent: 0,
      totalSaved: 0,
      averageRating: 0
    })

    // Вычисляемые свойства
    const hasActiveFilters = computed(() => {
      return filters.value.category || 
             filters.value.status || 
             filters.value.period
    })

    const filteredPurchases = computed(() => {
      let filtered = [...purchases.value]

      if (filters.value.category) {
        filtered = filtered.filter(p => p.reward.category === filters.value.category)
      }

      if (filters.value.status) {
        filtered = filtered.filter(p => p.status === filters.value.status)
      }

      if (filters.value.period) {
        const now = new Date()
        const periodStart = getPeriodStart(filters.value.period, now)
        filtered = filtered.filter(p => new Date(p.createdAt) >= periodStart)
      }

      // Сортировка
      filtered.sort((a, b) => {
        switch (filters.value.sortBy) {
          case 'date_asc':
            return new Date(a.createdAt) - new Date(b.createdAt)
          case 'cost_desc':
            return b.pointsUsed - a.pointsUsed
          case 'cost_asc':
            return a.pointsUsed - b.pointsUsed
          default: // date_desc
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
      })

      return filtered
    })

    // Методы
    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(amount)
    }

    const formatDate = (date) => {
      return appStore.formatDate(date, 'dd MMM yyyy')
    }

    const formatRelativeTime = (date) => {
      return appStore.formatRelativeDate(date)
    }

    const getPeriodStart = (period, now) => {
      switch (period) {
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

    const getCategoryIcon = (category) => {
      const icons = {
        service: 'fas fa-concierge-bell',
        prize: 'fas fa-trophy',
        voucher: 'fas fa-ticket-alt',
        privilege: 'fas fa-crown'
      }
      return icons[category] || 'fas fa-gift'
    }

    const getCategoryLabel = (category) => {
      const labels = {
        service: 'Услуга',
        prize: 'Приз',
        voucher: 'Ваучер',
        privilege: 'Привилегия'
      }
      return labels[category] || 'Награда'
    }

    const getPurchaseStatusClass = (status) => {
      const classes = {
        completed: 'status-success',
        pending: 'status-warning',
        used: 'status-info',
        expired: 'status-danger'
      }
      return classes[status] || 'status-default'
    }

    const getStatusIcon = (status) => {
      const icons = {
        completed: 'fas fa-check-circle',
        pending: 'fas fa-clock',
        used: 'fas fa-check-double',
        expired: 'fas fa-times-circle'
      }
      return icons[status] || 'fas fa-question-circle'
    }

    const getStatusLabel = (status) => {
      const labels = {
        completed: 'Завершено',
        pending: 'В обработке',
        used: 'Использовано',
        expired: 'Просрочено'
      }
      return labels[status] || 'Неизвестно'
    }

    const canUse = (purchase) => {
      return purchase.status === 'completed' && 
             (!purchase.validUntil || new Date(purchase.validUntil) > new Date())
    }

    const isExpiringSoon = (validUntil) => {
      if (!validUntil) return false
      const now = new Date()
      const expiry = new Date(validUntil)
      const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0
    }

    const loadPurchases = async () => {
      try {
        loading.value = true
        
        // Здесь будет API вызов
        // const response = await api.get('/users/me/purchases')
        // purchases.value = response.data.purchases
        // purchaseStats.value = response.data.stats
        
        // Заглушка с демо данными
        await new Promise(resolve => setTimeout(resolve, 500))
        
        purchases.value = [
          {
            id: '1',
            reward: {
              name: 'Бесплатный обед в кафетерии',
              category: 'service',
              image: null
            },
            pointsUsed: 50,
            originalPrice: 500,
            savings: 500,
            status: 'used',
            code: 'LUNCH2024',
            validUntil: null,
            createdAt: new Date(Date.now() - 86400000 * 5),
            downloadUrl: null,
            feedback: {
              rating: 5,
              comment: 'Отличный обед!',
              createdAt: new Date(Date.now() - 86400000 * 3)
            }
          },
          {
            id: '2',
            reward: {
              name: 'Корпоративная футболка',
              category: 'prize',
              image: null
            },
            pointsUsed: 200,
            originalPrice: 2000,
            savings: 2000,
            status: 'completed',
            code: null,
            validUntil: null,
            createdAt: new Date(Date.now() - 86400000 * 15),
            downloadUrl: null,
            feedback: null
          },
          {
            id: '3',
            reward: {
              name: 'День удаленной работы',
              category: 'privilege',
              image: null
            },
            pointsUsed: 300,
            originalPrice: null,
            savings: 0,
            status: 'completed',
            code: 'REMOTE001',
            validUntil: new Date(Date.now() + 86400000 * 30),
            createdAt: new Date(Date.now() - 86400000 * 2),
            downloadUrl: null,
            feedback: null
          }
        ]

        // Расчет статистики
        purchaseStats.value = {
          totalPurchases: purchases.value.length,
          totalSpent: purchases.value.reduce((sum, p) => sum + p.pointsUsed, 0),
          totalSaved: purchases.value.reduce((sum, p) => sum + p.savings, 0),
          averageRating: 4.5
        }
      } catch (error) {
        console.error('Ошибка загрузки покупок:', error)
        toast.error('Ошибка загрузки истории покупок')
      } finally {
        loading.value = false
      }
    }

    const createPurchasesChart = () => {
      // Здесь будет создание графика покупок
      const canvas = document.getElementById('purchasesChart')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#e9ecef'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#333'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('График покупок по месяцам', canvas.width/2, canvas.height/2)
      }
    }

    const copyCode = async (code) => {
      try {
        await navigator.clipboard.writeText(code)
        toast.success('Код скопирован в буфер обмена')
      } catch (error) {
        toast.error('Ошибка копирования кода')
      }
    }

    const usePurchase = async (purchase) => {
      try {
        // await api.post(`/purchases/${purchase.id}/use`)
        
        // Обновляем статус
        const index = purchases.value.findIndex(p => p.id === purchase.id)
        if (index !== -1) {
          purchases.value[index].status = 'used'
        }
        
        toast.success('Покупка успешно использована')
      } catch (error) {
        console.error('Ошибка использования покупки:', error)
        toast.error('Ошибка использования покупки')
      }
    }

    const downloadItem = (url) => {
      // Скачивание файла
      toast.info('Скачивание начато...')
    }

    const leaveFeedback = (purchase) => {
      selectedPurchase.value = purchase
      feedbackForm.value = {
        rating: 0,
        comment: ''
      }
      const modal = new bootstrap.Modal(document.getElementById('feedbackModal'))
      modal.show()
    }

    const submitFeedback = async () => {
      if (!selectedPurchase.value || !feedbackForm.value.rating) return

      try {
        feedbackLoading.value = true
        
        // Здесь будет API вызов
        // await api.post(`/purchases/${selectedPurchase.value.id}/feedback`, feedbackForm.value)
        
        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Обновляем покупку в списке
        const index = purchases.value.findIndex(p => p.id === selectedPurchase.value.id)
        if (index !== -1) {
          purchases.value[index].feedback = {
            ...feedbackForm.value,
            createdAt: new Date()
          }
        }
        
        toast.success('Отзыв успешно отправлен!')
        
        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'))
        modal.hide()
        
      } catch (error) {
        console.error('Ошибка отправки отзыва:', error)
        toast.error('Ошибка отправки отзыва')
      } finally {
        feedbackLoading.value = false
      }
    }

    const viewPurchaseDetails = (purchase) => {
      selectedPurchase.value = purchase
      const modal = new bootstrap.Modal(document.getElementById('purchaseDetailsModal'))
      modal.show()
    }

    // Watchers
    watch(() => [filters.value.category, filters.value.status, filters.value.period, filters.value.sortBy], () => {
      // Дополнительная логика при изменении фильтров
    })

    // Инициализация
    onMounted(() => {
      loadPurchases()
      setTimeout(createPurchasesChart, 100)
    })

    return {
      loading,
      feedbackLoading,
      selectedPurchase,
      filters,
      feedbackForm,
      purchases,
      purchaseStats,
      hasActiveFilters,
      filteredPurchases,
      
      formatNumber,
      formatCurrency,
      formatDate,
      formatRelativeTime,
      getCategoryIcon,
      getCategoryLabel,
      getPurchaseStatusClass,
      getStatusIcon,
      getStatusLabel,
      canUse,
      isExpiringSoon,
      copyCode,
      usePurchase,
      downloadItem,
      leaveFeedback,
      submitFeedback,
      viewPurchaseDetails
    }
  }
}
</script>

<style scoped>
.profile-purchases-tab {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Статистические карточки */
.purchases-stats {
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
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
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
  margin: 0;
}

/* График покупок */
.purchases-chart {
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
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.chart-body {
  padding: 1.5rem;
}

/* Фильтры */
.purchases-filters {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* Список покупок */
.purchases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.purchase-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.purchase-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
}

.purchase-card.status-success {
  border-left: 4px solid #198754;
}

.purchase-card.status-warning {
  border-left: 4px solid #ffc107;
}

.purchase-card.status-info {
  border-left: 4px solid #0dcaf0;
}

.purchase-card.status-danger {
  border-left: 4px solid #dc3545;
}

/* Изображение покупки */
.purchase-image {
  position: relative;
  height: 180px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.purchase-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.purchase-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
}

.purchase-status {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  gap: 0.25rem;
  color: white;
}

.status-badge.status-success {
  background: #198754;
}

.status-badge.status-warning {
  background: #ffc107;
  color: #000;
}

.status-badge.status-info {
  background: #0dcaf0;
  color: #000;
}

.status-badge.status-danger {
  background: #dc3545;
}

/* Информация о покупке */
.purchase-info {
  padding: 1.5rem;
}

.purchase-header {
  margin-bottom: 1rem;
}

.purchase-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.purchase-category {
  font-size: 0.9rem;
  color: #6c757d;
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.purchase-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.purchase-details > div {
  display: flex;
  align-items: center;
}

.purchase-details i {
  color: var(--bs-primary);
  width: 16px;
}

.purchase-cost {
  color: #ffc107 !important;
  font-weight: 600;
}

.purchase-savings {
  color: #198754 !important;
  font-weight: 500;
}

/* Дополнительная информация */
.purchase-extra {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.purchase-code {
  margin-bottom: 0.75rem;
}

.purchase-code label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  display: block;
}

.code-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.code-display code {
  background: #e9ecef;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
}

.purchase-validity {
  font-size: 0.9rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Действия */
.purchase-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.purchase-actions .btn {
  flex: 1;
  min-width: 120px;
}

/* Отзыв */
.purchase-feedback {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  border-left: 4px solid var(--bs-primary);
}

.feedback-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.feedback-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.rating-stars {
  display: flex;
  gap: 0.125rem;
}

.rating-stars i {
  color: #e9ecef;
  font-size: 1rem;
}

.rating-stars i.active {
  color: #ffc107;
}

.feedback-date {
  font-size: 0.8rem;
  color: #6c757d;
}

.feedback-comment {
  font-style: italic;
  color: #495057;
  line-height: 1.5;
}

/* Модальные окна */
.rating-input {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-btn:hover,
.star-btn.active {
  color: #ffc107;
  transform: scale(1.1);
}

/* Пустые состояния */
.loading-state,
.empty-state {
  background: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
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
@media (max-width: 767.98px) {
  .purchases-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .purchases-filters {
    padding: 1rem;
  }
  
  .purchase-info {
    padding: 1rem;
  }
  
  .purchase-actions {
    flex-direction: column;
  }
  
  .purchase-actions .btn {
    width: 100%;
    min-width: auto;
  }
  
  .feedback-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .code-display {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Темная тема */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .chart-card,
[data-theme="dark"] .purchases-filters,
[data-theme="dark"] .purchase-card,
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
[data-theme="dark"] .stat-value,
[data-theme="dark"] .purchase-title {
  color: #ffffff;
}

[data-theme="dark"] .purchase-extra,
[data-theme="dark"] .purchase-feedback {
  background-color: #1a1a1a;
}

[data-theme="dark"] .code-display code {
  background-color: #404040;
  color: #ffffff;
}

/* Анимации */
.purchase-card {
  animation: slideInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.purchase-card:nth-child(1) { animation-delay: 0.1s; }
.purchase-card:nth-child(2) { animation-delay: 0.2s; }
.purchase-card:nth-child(3) { animation-delay: 0.3s; }

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
</style>