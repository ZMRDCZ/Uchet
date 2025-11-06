<template>
  <div class="event-card" :class="{ 'event-registered': event.userRegistration }">
    <!-- Изображение мероприятия -->
    <div class="event-image">
      <img 
        v-if="event.image" 
        :src="event.image" 
        :alt="event.title"
        class="img-fluid"
      />
      <div v-else class="event-placeholder">
        <i :class="getEventIcon(event.category)"></i>
      </div>
      
      <!-- Статус регистрации -->
      <div v-if="event.userRegistration" class="registration-badge">
        <i class="fas fa-check-circle"></i>
        Зарегистрирован
      </div>
      
      <!-- Категория -->
      <div class="event-category">
        {{ getCategoryLabel(event.category) }}
      </div>
    </div>

    <!-- Содержимое карточки -->
    <div class="event-content">
      <!-- Дата и время -->
      <div class="event-datetime mb-2">
        <div class="event-date">
          <i class="fas fa-calendar me-1"></i>
          {{ formatDate(event.startDate) }}
        </div>
        <div class="event-time">
          <i class="fas fa-clock me-1"></i>
          {{ formatTime(event.startDate) }}
        </div>
      </div>

      <!-- Заголовок -->
      <h5 class="event-title" @click="$emit('view', event.id)">
        {{ event.title }}
      </h5>

      <!-- Описание -->
      <p v-if="event.description" class="event-description">
        {{ truncateText(event.description, 100) }}
      </p>

      <!-- Метаинформация -->
      <div class="event-meta mb-3">
        <div v-if="event.location" class="meta-item">
          <i class="fas fa-map-marker-alt me-1"></i>
          {{ event.location }}
        </div>
        <div v-if="event.organizer" class="meta-item">
          <i class="fas fa-user me-1"></i>
          {{ event.organizer.name }}
        </div>
      </div>

      <!-- Участники и баллы -->
      <div class="event-stats mb-3">
        <div class="participants-info">
          <div class="participants-count">
            <i class="fas fa-users me-1"></i>
            {{ event.currentParticipants }}/{{ event.maxParticipants }}
          </div>
          <div class="participants-bar">
            <div 
              class="participants-fill"
              :style="{ width: participantsPercentage + '%' }"
            ></div>
          </div>
        </div>
        
        <div class="points-reward">
          <i class="fas fa-coins me-1"></i>
          <span class="points-value">{{ event.pointsReward }}</span>
          <span class="points-label">баллов</span>
        </div>
      </div>

      <!-- Статусы и дедлайны -->
      <div class="event-status mb-3">
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
          До {{ formatRelativeDate(event.registrationDeadline) }}
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

    <!-- Действия -->
    <div class="event-actions">
      <button 
        v-if="!event.userRegistration && canRegister"
        class="btn btn-primary btn-register"
        @click="$emit('register', event.id)"
        :disabled="!isRegistrationOpen"
      >
        <i class="fas fa-plus me-1"></i>
        Зарегистрироваться
      </button>

      <button 
        v-else-if="event.userRegistration && canUnregister"
        class="btn btn-outline-danger btn-unregister"
        @click="$emit('unregister', event.id)"
      >
        <i class="fas fa-times me-1"></i>
        Отменить
      </button>

      <button 
        class="btn btn-outline-primary btn-view"
        @click="$emit('view', event.id)"
      >
        <i class="fas fa-eye me-1"></i>
        Подробнее
      </button>
    </div>

    <!-- Быстрая информация при наведении -->
    <div class="event-tooltip" v-if="showTooltip">
      <div class="tooltip-content">
        <h6>{{ event.title }}</h6>
        <p><strong>Дата:</strong> {{ formatFullDate(event.startDate) }}</p>
        <p><strong>Время:</strong> {{ formatTimeRange(event.startDate, event.endDate) }}</p>
        <p v-if="event.location"><strong>Место:</strong> {{ event.location }}</p>
        <p><strong>Организатор:</strong> {{ event.organizer?.name || 'Не указан' }}</p>
        <p><strong>Баллы:</strong> {{ event.pointsReward }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      required: true
    },
    showTooltip: {
      type: Boolean,
      default: false
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

    // Методы
    const getEventIcon = (category) => {
      const icons = {
        conference: 'fas fa-microphone',
        training: 'fas fa-graduation-cap',
        workshop: 'fas fa-tools',
        meeting: 'fas fa-handshake',
        sports: 'fas fa-running',
        social: 'fas fa-users',
        volunteer: 'fas fa-heart',
        other: 'fas fa-calendar'
      }
      return icons[category] || 'fas fa-calendar'
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

    const formatDate = (date) => {
      return appStore.formatDate(date, 'dd MMM yyyy')
    }

    const formatTime = (date) => {
      return appStore.formatDate(date, 'HH:mm')
    }

    const formatFullDate = (date) => {
      return appStore.formatDate(date, 'dd MMMM yyyy, EEEE')
    }

    const formatTimeRange = (startDate, endDate) => {
      const start = formatTime(startDate)
      const end = formatTime(endDate)
      return `${start} - ${end}`
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
      
      getEventIcon,
      getCategoryLabel,
      getEventStatus,
      formatDate,
      formatTime,
      formatFullDate,
      formatTimeRange,
      formatRelativeDate,
      truncateText
    }
  }
}
</script>

<style scoped>
.event-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
}

.event-card.event-registered {
  border: 2px solid #198754;
}

.event-card.event-registered::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #198754, #20c997);
}

/* Изображение */
.event-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 3rem;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
}

.registration-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #198754;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.event-category {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Содержимое */
.event-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-datetime {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.event-date,
.event-time {
  display: flex;
  align-items: center;
}

.event-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: color 0.2s ease;
  line-height: 1.3;
}

.event-title:hover {
  color: var(--bs-primary);
}

.event-description {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  color: #6c757d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.meta-item i {
  color: var(--bs-primary);
  width: 16px;
}

/* Статистика */
.event-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.participants-info {
  flex: 1;
}

.participants-count {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.participants-bar {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.participants-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--bs-primary) 0%, #20c997 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.points-reward {
  display: flex;
  align-items: center;
  background: #fff3cd;
  color: #856404;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  white-space: nowrap;
}

.points-value {
  font-size: 1.1rem;
  margin: 0 0.25rem;
}

.points-label {
  font-size: 0.8rem;
}

/* Статусы */
.event-status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
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

/* Действия */
.event-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  display: flex;
  gap: 0.75rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-register {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  border: none;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.3);
}

.btn-unregister:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-view {
  border-color: var(--bs-primary);
  color: var(--bs-primary);
}

.btn-view:hover {
  background: var(--bs-primary);
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Тултип */
.event-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 0;
  margin-top: 0.5rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.event-card:hover .event-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-content {
  padding: 1rem;
}

.tooltip-content h6 {
  margin-bottom: 0.75rem;
  color: #333;
  font-weight: 600;
}

.tooltip-content p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.tooltip-content p:last-child {
  margin-bottom: 0;
}

/* Адаптивность */
@media (max-width: 767.98px) {
  .event-image {
    height: 150px;
  }
  
  .event-content {
    padding: 1rem;
  }
  
  .event-title {
    font-size: 1.1rem;
  }
  
  .event-actions {
    padding: 0.75rem 1rem;
    flex-direction: column;
  }
  
  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
  }
  
  .event-stats {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .points-reward {
    justify-content: center;
  }
}

/* Темная тема */
[data-theme="dark"] .event-card {
  background-color: #2d2d2d;
  border-color: #444444;
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

[data-theme="dark"] .participants-count {
  color: #adb5bd;
}

[data-theme="dark"] .event-actions {
  background-color: #1a1a1a;
  border-color: #444444;
}

[data-theme="dark"] .event-tooltip {
  background-color: #2d2d2d;
  border: 1px solid #444444;
}

[data-theme="dark"] .tooltip-content h6 {
  color: #ffffff;
}

[data-theme="dark"] .tooltip-content p {
  color: #adb5bd;
}

/* Анимации */
.event-card {
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Состояние загрузки */
.event-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.event-card.loading .event-content {
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
.event-card.featured {
  border: 2px solid #ffc107;
  box-shadow: 0 0.5rem 1rem rgba(255, 193, 7, 0.2);
}

.event-card.featured::before {
  background: linear-gradient(90deg, #ffc107, #fd7e14);
}

.event-card.urgent {
  border: 2px solid #dc3545;
  animation: urgentPulse 2s infinite;
}

@keyframes urgentPulse {
  0% { box-shadow: 0 0.25rem 0.5rem rgba(220, 53, 69, 0.2); }
  50% { box-shadow: 0 0.5rem 1rem rgba(220, 53, 69, 0.4); }
  100% { box-shadow: 0 0.25rem 0.5rem rgba(220, 53, 69, 0.2); }
}
</style>