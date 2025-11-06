<template>
  <div class="profile-events-tab">
    <!-- Фильтры и статистика -->
    <div class="events-filters mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="events-stats">
            <div class="stat-item">
              <span class="stat-number">{{ events.filter(e => e.status === 'attended').length }}</span>
              <span class="stat-label">Посещено</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ events.filter(e => e.status === 'registered').length }}</span>
              <span class="stat-label">Зарегистрировано</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalPointsEarned }}</span>
              <span class="stat-label">Баллов заработано</span>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="d-flex gap-2">
            <select v-model="filters.status" class="form-select">
              <option value="">Все статусы</option>
              <option value="attended">Посещенные</option>
              <option value="registered">Зарегистрированные</option>
              <option value="cancelled">Отмененные</option>
              <option value="missed">Пропущенные</option>
            </select>
            <select v-model="filters.period" class="form-select">
              <option value="">Все время</option>
              <option value="month">Этот месяц</option>
              <option value="quarter">Этот квартал</option>
              <option value="year">Этот год</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- График участия -->
    <div class="participation-chart mb-4">
      <div class="chart-card">
        <div class="chart-header">
          <h5 class="chart-title">
            <i class="fas fa-chart-bar me-2"></i>
            Участие в мероприятиях по месяцам
          </h5>
        </div>
        <div class="chart-body">
          <canvas id="participationChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Список мероприятий -->
    <div class="events-list">
      <div v-if="loading" class="loading-state text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
        <p class="mt-2 text-muted">Загрузка мероприятий...</p>
      </div>

      <div v-else-if="filteredEvents.length === 0" class="empty-state text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fas fa-calendar-times"></i>
        </div>
        <h5>Мероприятия не найдены</h5>
        <p class="text-muted">
          {{ hasActiveFilters ? 'Попробуйте изменить фильтры' : 'Вы еще не участвовали в мероприятиях' }}
        </p>
        <router-link to="/events" class="btn btn-primary">
          Найти мероприятия
        </router-link>
      </div>

      <div v-else class="events-timeline">
        <div 
          v-for="(group, month) in groupedEvents" 
          :key="month"
          class="timeline-group"
        >
          <div class="timeline-month">
            <h6 class="month-title">{{ month }}</h6>
            <span class="month-stats">
              {{ group.length }} мероприятий, 
              {{ group.reduce((sum, e) => sum + (e.pointsEarned || 0), 0) }} баллов
            </span>
          </div>
          
          <div class="timeline-events">
            <div 
              v-for="event in group" 
              :key="event.id"
              class="timeline-event"
              :class="getEventStatusClass(event.status)"
            >
              <div class="event-marker"></div>
              <div class="event-card">
                <div class="event-header">
                  <div class="event-info">
                    <h6 class="event-title">{{ event.title }}</h6>
                    <div class="event-meta">
                      <span class="event-date">
                        <i class="fas fa-calendar me-1"></i>
                        {{ formatDate(event.date) }}
                      </span>
                      <span v-if="event.location" class="event-location">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        {{ event.location }}
                      </span>
                      <span class="event-category">
                        <i class="fas fa-tag me-1"></i>
                        {{ getCategoryLabel(event.category) }}
                      </span>
                    </div>
                  </div>
                  <div class="event-status">
                    <span class="status-badge" :class="getEventStatusClass(event.status)">
                      <i :class="getStatusIcon(event.status)"></i>
                      {{ getStatusLabel(event.status) }}
                    </span>
                  </div>
                </div>

                <div v-if="event.description" class="event-description">
                  {{ event.description }}
                </div>

                <div class="event-details">
                  <div class="row g-3">
                    <div v-if="event.pointsEarned" class="col-auto">
                      <div class="detail-item points-earned">
                        <i class="fas fa-coins"></i>
                        <span>+{{ event.pointsEarned }} баллов</span>
                      </div>
                    </div>
                    <div v-if="event.certificate" class="col-auto">
                      <div class="detail-item certificate">
                        <i class="fas fa-certificate"></i>
                        <span>Сертификат получен</span>
                      </div>
                    </div>
                    <div v-if="event.feedback" class="col-auto">
                      <div class="detail-item feedback">
                        <i class="fas fa-star"></i>
                        <span>Оценка: {{ event.feedback.rating }}/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="event-actions">
                  <button 
                    class="btn btn-sm btn-outline-primary"
                    @click="viewEvent(event.id)"
                  >
                    <i class="fas fa-eye me-1"></i>
                    Подробнее
                  </button>
                  
                  <button 
                    v-if="event.status === 'attended' && !event.feedback"
                    class="btn btn-sm btn-outline-success"
                    @click="leaveFeedback(event)"
                  >
                    <i class="fas fa-comment me-1"></i>
                    Оставить отзыв
                  </button>
                  
                  <button 
                    v-if="event.certificate"
                    class="btn btn-sm btn-outline-info"
                    @click="downloadCertificate(event.certificate)"
                  >
                    <i class="fas fa-download me-1"></i>
                    Скачать сертификат
                  </button>
                  
                  <button 
                    v-if="event.status === 'registered' && canCancel(event)"
                    class="btn btn-sm btn-outline-danger"
                    @click="cancelRegistration(event.id)"
                  >
                    <i class="fas fa-times me-1"></i>
                    Отменить
                  </button>
                </div>

                <!-- Отзыв пользователя -->
                <div v-if="event.feedback" class="event-feedback">
                  <div class="feedback-header">
                    <div class="feedback-rating">
                      <span class="rating-label">Ваша оценка:</span>
                      <div class="rating-stars">
                        <i 
                          v-for="star in 5" 
                          :key="star"
                          class="fas fa-star"
                          :class="{ active: star <= event.feedback.rating }"
                        ></i>
                      </div>
                    </div>
                    <span class="feedback-date">
                      {{ formatRelativeTime(event.feedback.createdAt) }}
                    </span>
                  </div>
                  <div v-if="event.feedback.comment" class="feedback-comment">
                    "{{ event.feedback.comment }}"
                  </div>
                </div>
              </div>
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
              Оценить мероприятие
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
              <div v-if="selectedEvent" class="mb-3">
                <h6>{{ selectedEvent.title }}</h6>
                <p class="text-muted small">{{ formatDate(selectedEvent.date) }}</p>
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
                  placeholder="Поделитесь впечатлениями о мероприятии..."
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
  name: 'ProfileEventsTab',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const appStore = useAppStore()

    // Состояние
    const loading = ref(false)
    const feedbackLoading = ref(false)
    const selectedEvent = ref(null)
    
    const filters = ref({
      status: '',
      period: ''
    })

    const feedbackForm = ref({
      rating: 0,
      comment: ''
    })

    const events = ref([])

    // Вычисляемые свойства
    const hasActiveFilters = computed(() => {
      return filters.value.status || filters.value.period
    })

    const filteredEvents = computed(() => {
      let filtered = [...events.value]

      if (filters.value.status) {
        filtered = filtered.filter(event => event.status === filters.value.status)
      }

      if (filters.value.period) {
        const now = new Date()
        const periodStart = getPeriodStart(filters.value.period, now)
        filtered = filtered.filter(event => new Date(event.date) >= periodStart)
      }

      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    const groupedEvents = computed(() => {
      const groups = {}
      
      filteredEvents.value.forEach(event => {
        const monthYear = formatMonthYear(event.date)
        if (!groups[monthYear]) {
          groups[monthYear] = []
        }
        groups[monthYear].push(event)
      })

      return groups
    })

    const totalPointsEarned = computed(() => {
      return events.value.reduce((sum, event) => sum + (event.pointsEarned || 0), 0)
    })

    // Методы
    const formatDate = (date) => {
      return appStore.formatDate(date, 'dd MMM yyyy')
    }

    const formatMonthYear = (date) => {
      return appStore.formatDate(date, 'MMMM yyyy')
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

    const getCategoryLabel = (category) => {
      const labels = {
        conference: 'Конференция',
        training: 'Обучение',
        workshop: 'Мастер-класс',
        meeting: 'Собрание',
        sports: 'Спорт',
        social: 'Социальное',
        volunteer: 'Волонтерство',
        other: 'Другое'
      }
      return labels[category] || 'Мероприятие'
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

    const getStatusIcon = (status) => {
      const icons = {
        attended: 'fas fa-check-circle',
        registered: 'fas fa-clock',
        cancelled: 'fas fa-times-circle',
        missed: 'fas fa-exclamation-triangle'
      }
      return icons[status] || 'fas fa-question-circle'
    }

    const getStatusLabel = (status) => {
      const labels = {
        attended: 'Посещено',
        registered: 'Зарегистрирован',
        cancelled: 'Отменено',
        missed: 'Пропущено'
      }
      return labels[status] || 'Неизвестно'
    }

    const canCancel = (event) => {
      const eventDate = new Date(event.date)
      const now = new Date()
      const hourBeforeEvent = new Date(eventDate.getTime() - 60 * 60 * 1000)
      return now < hourBeforeEvent
    }

    const loadEvents = async () => {
      try {
        loading.value = true
        
        // Здесь будет API вызов
        // const response = await api.get('/users/me/events')
        // events.value = response.data
        
        // Заглушка с демо данными
        await new Promise(resolve => setTimeout(resolve, 500))
        
        events.value = [
          {
            id: '1',
            title: 'Тренинг по лидерству',
            description: 'Развитие навыков руководства и командной работы',
            date: new Date(Date.now() - 86400000 * 5),
            location: 'Конференц-зал A',
            category: 'training',
            status: 'attended',
            pointsEarned: 100,
            certificate: 'cert-001.pdf',
            feedback: {
              rating: 5,
              comment: 'Отличный тренинг! Много полезной информации.',
              createdAt: new Date(Date.now() - 86400000 * 3)
            }
          },
          {
            id: '2',
            title: 'Корпоративный хакатон',
            description: 'Командное решение бизнес-задач',
            date: new Date(Date.now() - 86400000 * 15),
            location: 'IT-центр',
            category: 'workshop',
            status: 'attended',
            pointsEarned: 200,
            certificate: null,
            feedback: null
          },
          {
            id: '3',
            title: 'Встреча с руководством',
            description: 'Обсуждение стратегии развития компании',
            date: new Date(Date.now() + 86400000 * 7),
            location: 'Актовый зал',
            category: 'meeting',
            status: 'registered',
            pointsEarned: null,
            certificate: null,
            feedback: null
          }
        ]
      } catch (error) {
        console.error('Ошибка загрузки мероприятий:', error)
        toast.error('Ошибка загрузки списка мероприятий')
      } finally {
        loading.value = false
      }
    }

    const createParticipationChart = () => {
      // Здесь будет создание графика участия
      const canvas = document.getElementById('participationChart')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#e9ecef'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#333'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('График участия в мероприятиях', canvas.width/2, canvas.height/2)
      }
    }

    const viewEvent = (eventId) => {
      router.push(`/events/${eventId}`)
    }

    const leaveFeedback = (event) => {
      selectedEvent.value = event
      feedbackForm.value = {
        rating: 0,
        comment: ''
      }
      const modal = new bootstrap.Modal(document.getElementById('feedbackModal'))
      modal.show()
    }

    const submitFeedback = async () => {
      if (!selectedEvent.value || !feedbackForm.value.rating) return

      try {
        feedbackLoading.value = true
        
        // Здесь будет API вызов
        // await api.post(`/events/${selectedEvent.value.id}/feedback`, feedbackForm.value)
        
        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Обновляем событие в списке
        const eventIndex = events.value.findIndex(e => e.id === selectedEvent.value.id)
        if (eventIndex !== -1) {
          events.value[eventIndex].feedback = {
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

    const downloadCertificate = (certificateUrl) => {
      // Скачивание сертификата
      toast.info('Скачивание сертификата...')
    }

    const cancelRegistration = async (eventId) => {
      try {
        // await api.delete(`/events/${eventId}/registration`)
        
        // Обновляем статус в списке
        const eventIndex = events.value.findIndex(e => e.id === eventId)
        if (eventIndex !== -1) {
          events.value[eventIndex].status = 'cancelled'
        }
        
        toast.success('Регистрация отменена')
      } catch (error) {
        console.error('Ошибка отмены регистрации:', error)
        toast.error('Ошибка отмены регистрации')
      }
    }

    // Watchers
    watch(() => [filters.value.status, filters.value.period], () => {
      // Можно добавить дополнительную логику при изменении фильтров
    })

    // Инициализация
    onMounted(() => {
      loadEvents()
      setTimeout(createParticipationChart, 100)
    })

    return {
      loading,
      feedbackLoading,
      selectedEvent,
      filters,
      feedbackForm,
      events,
      hasActiveFilters,
      filteredEvents,
      groupedEvents,
      totalPointsEarned,
      
      formatDate,
      formatRelativeTime,
      getCategoryLabel,
      getEventStatusClass,
      getStatusIcon,
      getStatusLabel,
      canCancel,
      viewEvent,
      leaveFeedback,
      submitFeedback,
      downloadCertificate,
      cancelRegistration
    }
  }
}
</script>

<style scoped>
.profile-events-tab {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Фильтры и статистика */
.events-stats {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bs-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* График участия */
.participation-chart {
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

/* Timeline */
.events-timeline {
  position: relative;
}

.timeline-group {
  margin-bottom: 2rem;
}

.timeline-month {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 2px solid var(--bs-primary);
  margin-bottom: 1.5rem;
}

.month-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.month-stats {
  font-size: 0.9rem;
  color: #6c757d;
}

.timeline-events {
  position: relative;
}

.timeline-events::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-event {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 3rem;
}

.event-marker {
  position: absolute;
  left: 12px;
  top: 1rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e9ecef;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #e9ecef;
}

.timeline-event.status-success .event-marker {
  background: #198754;
  box-shadow: 0 0 0 2px #198754;
}

.timeline-event.status-info .event-marker {
  background: #0dcaf0;
  box-shadow: 0 0 0 2px #0dcaf0;
}

.timeline-event.status-warning .event-marker {
  background: #ffc107;
  box-shadow: 0 0 0 2px #ffc107;
}

.timeline-event.status-danger .event-marker {
  background: #dc3545;
  box-shadow: 0 0 0 2px #dc3545;
}

/* Event card */
.event-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.event-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.event-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.event-meta span {
  display: flex;
  align-items: center;
}

.event-meta i {
  color: var(--bs-primary);
  width: 16px;
}

.event-status {
  flex-shrink: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  gap: 0.25rem;
}

.status-badge.status-success {
  background: #d1eddf;
  color: #0f5132;
}

.status-badge.status-info {
  background: #cff4fc;
  color: #055160;
}

.status-badge.status-warning {
  background: #fff3cd;
  color: #664d03;
}

.status-badge.status-danger {
  background: #f8d7da;
  color: #58151c;
}

.event-description {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.event-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  gap: 0.5rem;
}

.detail-item.points-earned {
  background: #fff3cd;
  color: #856404;
}

.detail-item.certificate {
  background: #d1ecf1;
  color: #0c5460;
}

.detail-item.feedback {
  background: #ffeaa7;
  color: #d68910;
}

.event-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* Feedback */
.event-feedback {
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

/* Модальное окно */
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
  padding: 2rem;
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
  .events-stats {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .timeline-month {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .event-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .event-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .event-actions {
    justify-content: center;
  }
  
  .event-actions .btn {
    flex: 1;
    min-width: 120px;
  }
  
  .timeline-event {
    padding-left: 2rem;
  }
  
  .event-marker {
    left: 8px;
  }
  
  .timeline-events::before {
    left: 16px;
  }
}

/* Темная тема */
[data-theme="dark"] .chart-card,
[data-theme="dark"] .event-card,
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
[data-theme="dark"] .month-title,
[data-theme="dark"] .event-title {
  color: #ffffff;
}

[data-theme="dark"] .event-feedback {
  background-color: #1a1a1a;
}

[data-theme="dark"] .timeline-events::before {
  background: #444444;
}

[data-theme="dark"] .event-marker {
  border-color: #2d2d2d;
}

/* Анимации */
.timeline-event {
  animation: slideInLeft 0.5s ease-out;
  animation-fill-mode: both;
}

.timeline-event:nth-child(1) { animation-delay: 0.1s; }
.timeline-event:nth-child(2) { animation-delay: 0.2s; }
.timeline-event:nth-child(3) { animation-delay: 0.3s; }

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
</style>