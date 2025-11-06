<template>
  <div class="event-detail-page">
    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>

      <div v-else-if="event" class="event-content">
        <!-- Заголовок -->
        <div class="page-header mb-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="page-title mb-2">{{ event.title }}</h1>
              <div class="event-meta">
                <span class="badge bg-primary me-2">{{ getEventTypeLabel(event.type) }}</span>
                <span class="text-muted">
                  <i class="fas fa-map-marker-alt me-1"></i>
                  {{ event.location }}
                </span>
              </div>
            </div>
            <div class="col-md-4 text-md-end">
              <div class="event-points">
                <i class="fas fa-coins text-warning me-1"></i>
                {{ event.pointsReward }} баллов
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Основная информация -->
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title">Описание</h5>
                <p class="card-text">{{ event.description }}</p>
                
                <div class="row mt-4">
                  <div class="col-md-6">
                    <h6>Дата и время</h6>
                    <p>
                      <i class="fas fa-calendar me-2"></i>
                      {{ formatDate(event.startDate) }}
                    </p>
                    <p>
                      <i class="fas fa-clock me-2"></i>
                      {{ formatTime(event.startDate) }} - {{ formatTime(event.endDate) }}
                    </p>
                  </div>
                  <div class="col-md-6">
                    <h6>Участники</h6>
                    <p>
                      <i class="fas fa-users me-2"></i>
                      {{ event.currentParticipants }} / {{ event.maxParticipants }}
                    </p>
                    <div class="progress mb-2">
                      <div 
                        class="progress-bar" 
                        :style="{ width: (event.currentParticipants / event.maxParticipants * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div v-if="event.tags && event.tags.length > 0" class="mt-4">
                  <h6>Теги</h6>
                  <div class="tags">
                    <span 
                      v-for="tag in event.tags" 
                      :key="tag"
                      class="badge bg-light text-dark me-1"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Боковая панель -->
          <div class="col-lg-4">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title">Регистрация</h5>
                
                <div v-if="userRegistration" class="registration-status">
                  <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    Вы зарегистрированы на это мероприятие
                  </div>
                  <button 
                    class="btn btn-outline-danger w-100"
                    @click="cancelRegistration"
                    :disabled="cancelling"
                  >
                    <span v-if="cancelling" class="spinner-border spinner-border-sm me-2"></span>
                    Отменить регистрацию
                  </button>
                </div>
                
                <div v-else-if="event.isRegistrationOpen" class="registration-form">
                  <p class="text-muted mb-3">
                    Осталось мест: {{ event.maxParticipants - event.currentParticipants }}
                  </p>
                  <button 
                    class="btn btn-primary w-100"
                    @click="registerForEvent"
                    :disabled="registering"
                  >
                    <span v-if="registering" class="spinner-border spinner-border-sm me-2"></span>
                    Зарегистрироваться
                  </button>
                </div>
                
                <div v-else class="registration-closed">
                  <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Регистрация закрыта
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Организатор</h5>
                <div class="organizer-info">
                  <div class="d-flex align-items-center">
                    <div class="avatar me-3">
                      <i class="fas fa-user"></i>
                    </div>
                    <div>
                      <h6 class="mb-0">{{ event.organizer.name }}</h6>
                      <small class="text-muted">Организатор</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Мероприятие не найдено
        </div>
        <router-link to="/events" class="btn btn-primary">
          Вернуться к списку мероприятий
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { endpoints } from '@/services/api'

export default {
  name: 'EventDetailPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()

    const event = ref(null)
    const userRegistration = ref(null)
    const loading = ref(true)
    const registering = ref(false)
    const cancelling = ref(false)

    const getEventTypeLabel = (type) => {
      const types = {
        conference: 'Конференция',
        training: 'Обучение',
        workshop: 'Мастер-класс',
        meeting: 'Собрание',
        sports: 'Спорт',
        social: 'Социальное',
        volunteer: 'Волонтерство',
        other: 'Другое'
      }
      return types[type] || 'Мероприятие'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const loadEvent = async () => {
      try {
        loading.value = true
        const response = await endpoints.events.get(route.params.id)
        event.value = response.data?.event || response.event
        
        // Проверяем регистрацию пользователя
        const registrationsResponse = await endpoints.registrations.my()
        const userRegistrations = registrationsResponse.data?.registrations || registrationsResponse.registrations || []
        userRegistration.value = userRegistrations.find(r => r.eventId === route.params.id)
      } catch (error) {
        console.error('Ошибка загрузки мероприятия:', error)
        toast.error('Ошибка загрузки мероприятия')
      } finally {
        loading.value = false
      }
    }

    const registerForEvent = async () => {
      try {
        registering.value = true
        await endpoints.registrations.create(route.params.id)
        toast.success('Вы успешно зарегистрированы на мероприятие!')
        await loadEvent() // Перезагружаем данные
      } catch (error) {
        console.error('Ошибка регистрации:', error)
        toast.error(error.message || 'Ошибка регистрации на мероприятие')
      } finally {
        registering.value = false
      }
    }

    const cancelRegistration = async () => {
      if (!userRegistration.value) return
      
      try {
        cancelling.value = true
        await endpoints.registrations.cancel(userRegistration.value.id)
        toast.success('Регистрация отменена')
        await loadEvent() // Перезагружаем данные
      } catch (error) {
        console.error('Ошибка отмены регистрации:', error)
        toast.error(error.message || 'Ошибка отмены регистрации')
      } finally {
        cancelling.value = false
      }
    }

    onMounted(() => {
      loadEvent()
    })

    return {
      event,
      userRegistration,
      loading,
      registering,
      cancelling,
      getEventTypeLabel,
      formatDate,
      formatTime,
      registerForEvent,
      cancelRegistration
    }
  }
}
</script>

<style scoped>
.event-detail-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.event-points {
  font-size: 1.2rem;
  font-weight: 600;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.tags .badge {
  font-size: 0.8rem;
}

.progress {
  height: 8px;
}

.progress-bar {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
}

/* Адаптивность */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .event-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style> 