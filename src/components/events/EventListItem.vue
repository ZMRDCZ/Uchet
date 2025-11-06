<template>
  <div class="event-list-item" :class="{ 'event-registered': event.userRegistration }">
    <div class="row g-0 align-items-center">
      <!-- Дата -->
      <div class="col-auto">
        <div class="event-date-section">
          <div class="date-display">
            <div class="date-day">{{ formatDay(event.startDate) }}</div>
            <div class="date-month">{{ formatMonth(event.startDate) }}</div>
            <div class="date-year">{{ formatYear(event.startDate) }}</div>
          </div>
          <div class="time-display">
            {{ formatTime(event.startDate) }}
          </div>
        </div>
      </div>

      <!-- Основная информация -->
      <div class="col">
        <div class="event-main-info">
          <div class="d-flex align-items-start justify-content-between">
            <!-- Заголовок и описание -->
            <div class="event-details">
              <h5 class="event-title" @click="$emit('view', event.id)">
                {{ event.title }}
                <span v-if="event.userRegistration" class="registered-indicator">
                  <i class="fas fa-check-circle"></i>
                </span>
              </h5>
              
              <div class="event-meta-row">
                <span class="meta-item">
                  <i class="fas fa-tag me-1"></i>
                  {{ getCategoryLabel(event.category) }}
                </span>
                
                <span v-if="event.location" class="meta-item">
                  <i class="fas fa-map-marker-alt me-1"></i>
                  {{ event.location }}
                </span>
                
                <span v-if="event.organizer" class="meta-item">
                  <i class="fas fa-user me-1"></i>
                  {{ event.organizer.name }}
                </span>
              </div>

              <p v-if="event.description" class="event-description">
                {{ truncateText(event.description, 150) }}
              </p>
            </div>

            <!-- Статусы и баллы -->
            <div class="event-status-section">
              <div class="points-display">
                <i class="fas fa-coins"></i>
                <span class="points-value">{{ event.pointsReward }}</span>
                <span class="points-label">баллов</span>
              </div>

              <div class="status-indicators">
                <span 
                  v-if="getEventStatus(event) === 'registration_closed'"
                  class="status-badge status-closed"
                >
                  <i class="fas fa-lock me-1"></i>
                  Регистрация закрыта
                </span>
                <span 
                  v-else-if="getEventStatus(event) === 'full'"
                  class="status-badge status-full"
                >
                  <i class="fas fa-users me-1"></i>
                  Мест нет
                </span>
                <span 
                  v-else-if="getEventStatus(event) === 'deadline_soon'"
                  class="status-badge status-deadline"
                >
                  <i class="fas fa-hourglass-half me-1"></i>
                  До дедлайна {{ formatRelativeDate(event.registrationDeadline) }}
                </span>
                <span 
                  v-else-if="getEventStatus(event) === 'happening_now'"
                  class="status-badge status-live"
                >
                  <i class="fas fa-play-circle me-1"></i>
                  Идет сейчас
                </span>
                <span 
                  v-else-if="getEventStatus(event) === 'past'"
                  class="status-badge status-past"
                >
                  <i class="fas fa-history me-1"></i>
                  Завершено
                </span>
              </div>
            </div>
          </div>

          <!-- Нижняя секция -->
          <div class="event-bottom-section">
            <div class="d-flex align-items-center justify-content-between">
              <!-- Участники -->
              <div class="participants-section">
                <div class="participants-info">
                  <i class="fas fa-users me-1"></i>
                  <span class="participants-text">
                    {{ event.currentParticipants }}/{{ event.maxParticipants }} участников
                  </span>
                </div>
                <div class="participants-progress">
                  <div class="progress">
                    <div 
                      class="progress-bar"
                      :style="{ width: participantsPercentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Дедлайн регистрации -->
              <div v-if="showRegistrationDeadline" class="deadline-info">
                <i class="fas fa-clock me-1"></i>
                <span class="deadline-text">
                  Регистрация до {{ formatDate(event.registrationDeadline) }}
                </span>
              </div>

              <!-- Действия -->
              <div class="event-actions">
                <button 
                  v-if="!event.userRegistration && canRegister"
                  class="btn btn-primary btn-sm"
                  @click="$emit('register', event.id)"
                  :disabled="!isRegistrationOpen"
                >
                  <i class="fas fa-plus me-1"></i>
                  Зарегистрироваться
                </button>

                <button 
                  v-else-if="event.userRegistration && canUnregister"
                  class="btn btn-outline-danger btn-sm"
                  @click="$emit('unregister', event.id)"
                >
                  <i class="fas fa-times me-1"></i>
                  Отменить
                </button>

                <button 
                  class="btn btn-outline-primary btn-sm"
                  @click="$emit('view', event.id)"
                >
                  <i class="fas fa-eye me-1"></i>
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Индикатор состояния слева -->
    <div class="status-indicator" :class="statusIndicatorClass"></div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

export default {
  name: 'EventListItem',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  emits: ['register', 'unregister', 'view'],
  setup(props) {
    const appStore = useAppStore()

    // Вычисляемые свойства
    const participantsPercentage = computed(() => {
      return Math.min((props.event.currentParticipants / props.event.maxParticipants) * 100, 100)
    })

    const canRegister = computed(() => {
      const now = new Date()
      return props.event.isRegistrationOpen && 
             props.event.registrationDeadline > now &&
             props.event.currentParticipants < props.event.maxParticipants &&
             props.event.startDate > now
    })

    const canUnregister = computed(() => {
      const now = new Date()
      const hourBeforeStart = new Date(props.event.startDate.getTime() - 60 * 60 * 1000)
      return now < hourBeforeStart
    })

    const isRegistrationOpen = computed(() => {
      return canRegister.value
    })

    const showRegistrationDeadline = computed(() => {
      const now = new Date()
      return props.event.registrationDeadline > now && 
             props.event.isRegistrationOpen &&
             !props.event.userRegistration
    })

    const statusIndicatorClass = computed(() => {
      const status = getEventStatus(props.event)
      return {
        'indicator-open': status === 'open',
        'indicator-deadline': status === 'deadline_soon',
        'indicator-closed': status === 'registration_closed',
        'indicator-full': status === 'full',
        'indicator-live': status === 'happening_now',
        'indicator-past': status === 'past'
      }
    })

    // Методы
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

    const getEventStatus = (event) => {
      const now = new Date()
      const dayBeforeDeadline = new Date(event.registrationDeadline.getTime() - 24 * 60 * 60 * 1000)

      if (event.endDate < now) return 'past'
      if (event.startDate <= now && event.endDate >= now) return 'happening_now'
      if (!event.isRegistrationOpen || event.registrationDeadline <= now) return 'registration_closed'
      if (event.currentParticipants >= event.maxParticipants) return 'full'
      if (now > dayBeforeDeadline) return 'deadline_soon'
      return 'open'
    }

    const formatDay = (date) => {
      return new Date(date).getDate()
    }

    const formatMonth = (date) => {
      const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      return months[new Date(date).getMonth()]
    }

    const formatYear = (date) => {
      return new Date(date).getFullYear()
    }

    const formatTime = (date) => {
      return appStore.formatDate(date, 'HH:mm')
    }

    const formatDate = (date) => {
      return appStore.formatDate(date, 'dd MMM yyyy')
    }

    const formatRelativeDate = (date) => {
      return appStore.formatRelativeDate(date)
    }

    const truncateText = (text, maxLength) => {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    return {
      participantsPercentage,
      canRegister,
      canUnregister,
      isRegistrationOpen,
      showRegistrationDeadline,
      statusIndicatorClass,
      
      getCategoryLabel,
      getEventStatus,
      formatDay,
      formatMonth,
      formatYear,
      formatTime,
      formatDate,
      formatRelativeDate,
      truncateText
    }
  }
}
</script>

<style scoped>
.event-list-item {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  border-left: 4px solid transparent;
  overflow: hidden;
}

.event-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.event-list-item.event-registered {
  background: rgba(25, 135, 84, 0.05);
  border-left-color: #198754;
}

/* Индикатор состояния */
.status-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  transition: all 0.3s ease;
}

.indicator-open {
  background: linear-gradient(to bottom, #198754, #20c997);
}

.indicator-deadline {
  background: linear-gradient(to bottom, #ffc107, #fd7e14);
}

.indicator-closed {
  background: linear-gradient(to bottom, #dc3545, #c82333);
}

.indicator-full {
  background: linear-gradient(to bottom, #6c757d, #5a6268);
}

.indicator-live {
  background: linear-gradient(to bottom, #0dcaf0, #06a4cc);
  animation: livePulse 2s infinite;
}

.indicator-past {
  background: #adb5bd;
}

@keyframes livePulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

/* Секция даты */
.event-date-section {
  min-width: 80px;
  text-align: center;
  margin-right: 1.5rem;
}

.date-display {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 0.75rem;
  padding: 1rem 0.75rem;
  margin-bottom: 0.5rem;
}

.date-day {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0.25rem;
}

.date-year {
  font-size: 0.7rem;
  opacity: 0.8;
}

.time-display {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--bs-primary);
  text-align: center;
}

/* Основная информация */
.event-main-info {
  flex: 1;
}

.event-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-title:hover {
  color: var(--bs-primary);
}

.registered-indicator {
  color: #198754;
  font-size: 1rem;
}

.event-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.meta-item {
  font-size: 0.9rem;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.meta-item i {
  color: var(--bs-primary);
  width: 16px;
}

.event-description {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

/* Секция статуса */
.event-status-section {
  text-align: right;
  min-width: 200px;
}

.points-display {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #fff3cd;
  color: #856404;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  gap: 0.25rem;
}

.points-value {
  font-size: 1.1rem;
}

.points-label {
  font-size: 0.85rem;
}

.status-indicators {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-closed {
  background: #f8d7da;
  color: #721c24;
}

.status-full {
  background: #fff3cd;
  color: #856404;
}

.status-deadline {
  background: #ffeaa7;
  color: #d68910;
}

.status-live {
  background: #d1ecf1;
  color: #0c5460;
  animation: pulse 2s infinite;
}

.status-past {
  background: #e2e3e5;
  color: #6c757d;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Нижняя секция */
.event-bottom-section {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
  margin-top: 1rem;
}

.participants-section {
  flex: 1;
  margin-right: 1rem;
}

.participants-info {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.participants-progress {
  max-width: 200px;
}

.progress {
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, var(--bs-primary) 0%, #20c997 100%);
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.deadline-info {
  font-size: 0.9rem;
  color: #dc3545;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.deadline-info i {
  color: #dc3545;
}

/* Действия */
.event-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn {
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .event-list-item {
    padding: 1rem;
  }
  
  .event-status-section {
    min-width: 150px;
    margin-top: 1rem;
  }
  
  .event-bottom-section .d-flex {
    flex-direction: column;
    align-items: stretch !important;
    gap: 1rem;
  }
  
  .participants-section {
    margin-right: 0;
  }
  
  .deadline-info {
    margin-right: 0;
    justify-content: center;
  }
  
  .event-actions {
    justify-content: center;
  }
}

@media (max-width: 767.98px) {
  .event-list-item .row {
    flex-direction: column;
  }
  
  .event-date-section {
    margin-right: 0;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .date-display {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0;
  }
  
  .date-day {
    font-size: 1.5rem;
  }
  
  .event-title {
    font-size: 1.2rem;
  }
  
  .event-meta-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .event-status-section {
    text-align: left;
    min-width: auto;
    margin-top: 0;
  }
  
  .points-display {
    justify-content: flex-start;
    margin-bottom: 0.5rem;
  }
  
  .status-indicators {
    align-items: flex-start;
  }
  
  .event-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
}

/* Темная тема */
[data-theme="dark"] .event-list-item {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .event-list-item.event-registered {
  background-color: rgba(25, 135, 84, 0.1);
}

[data-theme="dark"] .event-title {
  color: #ffffff;
}

[data-theme="dark"] .event-description {
  color: #adb5bd;
}

[data-theme="dark"] .meta-item {
  color: #adb5bd;
}

[data-theme="dark"] .participants-info {
  color: #adb5bd;
}

[data-theme="dark"] .event-bottom-section {
  border-color: #444444;
}

[data-theme="dark"] .progress {
  background-color: #444444;
}

/* Анимации */
.event-list-item {
  animation: slideInLeft 0.5s ease-out;
}

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

/* Состояние загрузки */
.event-list-item.loading {
  opacity: 0.7;
  pointer-events: none;
}

.event-list-item.loading .event-main-info {
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Улучшения доступности */
.event-title:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.btn:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

/* Спецэффекты */
.event-list-item.featured {
  border-left-color: #ffc107;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 193, 7, 0.1) 100%);
}

.event-list-item.urgent {
  border-left-color: #dc3545;
  animation: urgentGlow 2s infinite;
}

@keyframes urgentGlow {
  0% { box-shadow: 0 0.125rem 0.25rem rgba(220, 53, 69, 0.2); }
  50% { box-shadow: 0 0.5rem 1rem rgba(220, 53, 69, 0.4); }
  100% { box-shadow: 0 0.125rem 0.25rem rgba(220, 53, 69, 0.2); }
}
</style>