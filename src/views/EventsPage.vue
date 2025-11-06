<template>
  <div class="events-page">
    <!-- Заголовок страницы -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h1 class="page-title mb-2">
            <i class="fas fa-calendar-alt me-2"></i>
            Мероприятия
          </h1>
          <p class="page-subtitle text-muted mb-0">
            Участвуйте в корпоративных событиях и зарабатывайте баллы
          </p>
        </div>
        <div class="col-md-6 text-md-end">
          <button 
            v-if="authStore.isModerator"
            class="btn btn-primary"
            @click="createEvent"
          >
            <i class="fas fa-plus me-2"></i>
            Создать мероприятие
          </button>
        </div>
      </div>
    </div>

    <!-- Фильтры и поиск -->
    <div class="filters-section mb-4">
      <div class="row g-3">
        <div class="col-lg-4 col-md-6">
          <div class="search-box">
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              placeholder="Поиск мероприятий..."
              @input="debounceSearch"
            />
            <i class="fas fa-search search-icon"></i>
          </div>
        </div>

        <div class="col-lg-2 col-md-6">
          <select v-model="filters.category" class="form-select" @change="applyFilters">
            <option value="">Все категории</option>
            <option value="conference">Конференции</option>
            <option value="training">Обучение</option>
            <option value="workshop">Мастер-классы</option>
            <option value="meeting">Собрания</option>
            <option value="sports">Спорт</option>
            <option value="social">Социальные</option>
            <option value="volunteer">Волонтерство</option>
          </select>
        </div>

        <div class="col-lg-2 col-md-6">
          <select v-model="filters.status" class="form-select" @change="applyFilters">
            <option value="">Все статусы</option>
            <option value="upcoming">Предстоящие</option>
            <option value="ongoing">Текущие</option>
            <option value="past">Прошедшие</option>
            <option value="registration_open">Открыта регистрация</option>
          </select>
        </div>

        <div class="col-lg-2 col-md-6">
          <select v-model="filters.sortBy" class="form-select" @change="applyFilters">
            <option value="start_date">По дате</option>
            <option value="title">По названию</option>
            <option value="points">По баллам</option>
            <option value="popularity">По популярности</option>
          </select>
        </div>

        <div class="col-lg-2 col-md-6">
          <div class="view-toggles">
            <button
              class="btn btn-outline-secondary"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="fas fa-th"></i>
            </button>
            <button
              class="btn btn-outline-secondary"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-bar mb-4">
      <div class="row g-3">
        <div class="col-auto">
          <div class="stat-badge">
            <i class="fas fa-calendar-check text-success"></i>
            <span>{{ stats.registered }} зарегистрирован</span>
          </div>
        </div>
        <div class="col-auto">
          <div class="stat-badge">
            <i class="fas fa-clock text-warning"></i>
            <span>{{ stats.upcoming }} предстоящих</span>
          </div>
        </div>
        <div class="col-auto">
          <div class="stat-badge">
            <i class="fas fa-coins text-primary"></i>
            <span>{{ stats.totalPoints }} баллов доступно</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Список мероприятий -->
    <div class="events-content">
      <!-- Загрузка -->
      <div v-if="loading" class="loading-state text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка мероприятий...</span>
        </div>
        <p class="mt-3 text-muted">Загрузка мероприятий...</p>
      </div>

      <!-- Пустое состояние -->
      <div v-else-if="events.length === 0" class="empty-state text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fas fa-calendar-times"></i>
        </div>
        <h4>Мероприятия не найдены</h4>
        <p class="text-muted mb-4">
          {{ hasActiveFilters ? 'Попробуйте изменить фильтры поиска' : 'Пока нет доступных мероприятий' }}
        </p>
        <button v-if="hasActiveFilters" class="btn btn-outline-primary" @click="clearFilters">
          Сбросить фильтры
        </button>
      </div>

      <!-- Сетка мероприятий -->
      <div v-else-if="viewMode === 'grid'" class="events-grid">
        <div class="row g-4">
          <div 
            v-for="event in events" 
            :key="event.id"
            class="col-lg-4 col-md-6"
          >
            <EventCard
              :event="event"
              @register="handleRegister"
              @unregister="handleUnregister"
              @view="viewEvent"
            />
          </div>
        </div>
      </div>

      <!-- Список мероприятий -->
      <div v-else class="events-list">
        <EventListItem
          v-for="event in events"
          :key="event.id"
          :event="event"
          @register="handleRegister"
          @unregister="handleUnregister"
          @view="viewEvent"
        />
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
      
      <div class="pagination-info text-center text-muted mt-2">
        Показано {{ (pagination.currentPage - 1) * pagination.perPage + 1 }}-{{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }} 
        из {{ pagination.total }} мероприятий
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import EventCard from '@/components/events/EventCard.vue'
import EventListItem from '@/components/events/EventListItem.vue'

export default {
  name: 'EventsPage',
  components: {
    EventCard,
    EventListItem
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    const appStore = useAppStore()

    // Состояние
    const loading = ref(false)
    const viewMode = ref('grid')
    
    const filters = ref({
      search: '',
      category: '',
      status: '',
      sortBy: 'start_date'
    })

    const events = ref([])
    const stats = ref({
      registered: 0,
      upcoming: 0,
      totalPoints: 0
    })

    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      total: 0,
      perPage: 12
    })

    let searchTimeout = null

    // Вычисляемые свойства
    const hasActiveFilters = computed(() => {
      return filters.value.search || 
             filters.value.category || 
             filters.value.status
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
    const loadEvents = async () => {
      try {
        loading.value = true
        
        const params = {
          page: pagination.value.currentPage,
          limit: pagination.value.perPage,
          search: filters.value.search || undefined,
          category: filters.value.category || undefined,
          status: filters.value.status || undefined,
          sort: filters.value.sortBy
        }

        // Здесь будет API вызов
        // const response = await api.get('/events', { params })
        // events.value = response.data.events
        // pagination.value = response.data.pagination
        // stats.value = response.data.stats

        // Заглушка с демо данными
        await new Promise(resolve => setTimeout(resolve, 500)) // Имитация загрузки

        const demoEvents = generateDemoEvents()
        const filteredEvents = filterDemoEvents(demoEvents)
        
        // Пагинация
        const startIndex = (pagination.value.currentPage - 1) * pagination.value.perPage
        const endIndex = startIndex + pagination.value.perPage
        
        events.value = filteredEvents.slice(startIndex, endIndex)
        pagination.value.total = filteredEvents.length
        pagination.value.totalPages = Math.ceil(filteredEvents.length / pagination.value.perPage)
        
        // Статистика
        stats.value = {
          registered: Math.floor(Math.random() * 10) + 5,
          upcoming: Math.floor(Math.random() * 15) + 10,
          totalPoints: Math.floor(Math.random() * 1000) + 500
        }
        
      } catch (error) {
        console.error('Ошибка загрузки мероприятий:', error)
        toast.error('Ошибка загрузки мероприятий')
      } finally {
        loading.value = false
      }
    }

    const generateDemoEvents = () => {
      const categories = ['conference', 'training', 'workshop', 'meeting', 'sports', 'social', 'volunteer']
      const titles = [
        'Тренинг по личной эффективности',
        'Корпоративный хакатон',
        'Презентация новых продуктов',
        'Спортивная олимпиада',
        'Мастер-класс по публичным выступлениям',
        'Волонтерская акция',
        'Конференция по инновациям',
        'Обучение новым технологиям'
      ]

      return Array.from({ length: 50 }, (_, i) => ({
        id: `event-${i + 1}`,
        title: titles[i % titles.length] + ` ${Math.floor(i / titles.length) + 1}`,
        description: 'Описание мероприятия...',
        category: categories[i % categories.length],
        startDate: new Date(Date.now() + (Math.random() - 0.3) * 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + (Math.random() - 0.3) * 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        location: `Конференц-зал ${String.fromCharCode(65 + i % 5)}`,
        pointsReward: Math.floor(Math.random() * 100) + 20,
        maxParticipants: Math.floor(Math.random() * 50) + 20,
        currentParticipants: Math.floor(Math.random() * 30) + 5,
        registrationDeadline: new Date(Date.now() + (Math.random() - 0.3) * 25 * 24 * 60 * 60 * 1000),
        isRegistrationOpen: Math.random() > 0.3,
        userRegistration: Math.random() > 0.7 ? { id: 'reg-1', status: 'confirmed' } : null,
        organizer: {
          name: 'Иван Петров',
          department: 'HR'
        }
      }))
    }

    const filterDemoEvents = (allEvents) => {
      return allEvents.filter(event => {
        if (filters.value.search && !event.title.toLowerCase().includes(filters.value.search.toLowerCase())) {
          return false
        }
        if (filters.value.category && event.category !== filters.value.category) {
          return false
        }
        if (filters.value.status) {
          const now = new Date()
          switch (filters.value.status) {
            case 'upcoming':
              return event.startDate > now
            case 'ongoing':
              return event.startDate <= now && event.endDate >= now
            case 'past':
              return event.endDate < now
            case 'registration_open':
              return event.isRegistrationOpen && event.registrationDeadline > now
          }
        }
        return true
      }).sort((a, b) => {
        switch (filters.value.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title)
          case 'points':
            return b.pointsReward - a.pointsReward
          case 'popularity':
            return b.currentParticipants - a.currentParticipants
          default: // start_date
            return new Date(a.startDate) - new Date(b.startDate)
        }
      })
    }

    const debounceSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        pagination.value.currentPage = 1
        applyFilters()
      }, 300)
    }

    const applyFilters = () => {
      pagination.value.currentPage = 1
      loadEvents()
    }

    const clearFilters = () => {
      filters.value = {
        search: '',
        category: '',
        status: '',
        sortBy: 'start_date'
      }
      pagination.value.currentPage = 1
      loadEvents()
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        pagination.value.currentPage = page
        loadEvents()
        // Прокрутка к началу списка
        document.querySelector('.events-content')?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const handleRegister = async (eventId) => {
      try {
        // await api.post(`/events/${eventId}/register`)
        toast.success('Вы успешно зарегистрированы на мероприятие!')
        
        // Обновляем статус регистрации в локальных данных
        const event = events.value.find(e => e.id === eventId)
        if (event) {
          event.userRegistration = { id: 'new-reg', status: 'confirmed' }
          event.currentParticipants++
        }
      } catch (error) {
        console.error('Ошибка регистрации:', error)
        toast.error('Ошибка регистрации на мероприятие')
      }
    }

    const handleUnregister = async (eventId) => {
      try {
        // await api.delete(`/events/${eventId}/register`)
        toast.success('Регистрация отменена')
        
        // Обновляем статус регистрации в локальных данных
        const event = events.value.find(e => e.id === eventId)
        if (event) {
          event.userRegistration = null
          event.currentParticipants--
        }
      } catch (error) {
        console.error('Ошибка отмены регистрации:', error)
        toast.error('Ошибка отмены регистрации')
      }
    }

    const viewEvent = (eventId) => {
      router.push(`/events/${eventId}`)
    }

    const createEvent = () => {
      router.push('/events/create')
    }

    // Watchers
    watch(() => filters.value.sortBy, () => {
      applyFilters()
    })

    // Инициализация
    onMounted(() => {
      appStore.setPageTitle('Мероприятия')
      loadEvents()
    })

    return {
      authStore,
      loading,
      viewMode,
      filters,
      events,
      stats,
      pagination,
      hasActiveFilters,
      visiblePages,
      
      loadEvents,
      debounceSearch,
      applyFilters,
      clearFilters,
      goToPage,
      handleRegister,
      handleUnregister,
      viewEvent,
      createEvent
    }
  }
}
</script>

<style scoped>
.events-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Заголовок страницы */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
}

/* Фильтры */
.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
}

.form-control {
  padding-right: 2.5rem;
}

.view-toggles {
  display: flex;
  border-radius: 0.5rem;
  overflow: hidden;
}

.view-toggles .btn {
  border-radius: 0;
  border-right: none;
}

.view-toggles .btn:last-child {
  border-right: 1px solid #dee2e6;
}

.view-toggles .btn.active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
}

/* Статистика */
.stats-bar {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  color: white;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.stat-badge i {
  font-size: 1.1rem;
}

/* Состояния */
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

.empty-state h4 {
  color: #333;
  margin-bottom: 1rem;
}

/* Сетка мероприятий */
.events-grid {
  margin-bottom: 2rem;
}

/* Список мероприятий */
.events-list {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

/* Пагинация */
.pagination-section {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
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

.pagination-info {
  font-size: 0.9rem;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .filters-section {
    padding: 1rem;
  }
  
  .stats-bar {
    padding: 1rem;
  }
  
  .stat-badge {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 767.98px) {
  .page-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .view-toggles {
    width: 100%;
  }
  
  .stats-bar .row {
    justify-content: center;
    text-align: center;
  }
  
  .pagination .page-link {
    margin: 0;
    font-size: 0.875rem;
  }
}

@media (max-width: 575.98px) {
  .filters-section .row > div {
    margin-bottom: 1rem;
  }
  
  .filters-section .row > div:last-child {
    margin-bottom: 0;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .pagination .page-item {
    margin: 0.125rem;
  }
}

/* Темная тема */
[data-theme="dark"] .page-title {
  color: #ffffff;
}

[data-theme="dark"] .filters-section,
[data-theme="dark"] .events-list,
[data-theme="dark"] .pagination-section,
[data-theme="dark"] .loading-state,
[data-theme="dark"] .empty-state {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .form-control,
[data-theme="dark"] .form-select {
  background-color: #1a1a1a;
  border-color: #444444;
  color: #ffffff;
}

[data-theme="dark"] .empty-state h4 {
  color: #ffffff;
}

[data-theme="dark"] .pagination .page-link {
  background-color: transparent;
  color: #adb5bd;
}

[data-theme="dark"] .pagination .page-link:hover {
  background-color: var(--bs-primary);
  color: white;
}

/* Анимации */
.events-grid .col-lg-4,
.events-grid .col-md-6 {
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.events-grid .col-lg-4:nth-child(1) { animation-delay: 0.1s; }
.events-grid .col-lg-4:nth-child(2) { animation-delay: 0.2s; }
.events-grid .col-lg-4:nth-child(3) { animation-delay: 0.3s; }

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

/* Переходы между режимами просмотра */
.events-grid,
.events-list {
  transition: all 0.3s ease;
}

/* Улучшения доступности */
.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.btn:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

/* Состояния загрузки */
.loading-state .spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Индикаторы состояния */
.stat-badge i.text-success { color: #198754 !important; }
.stat-badge i.text-warning { color: #ffc107 !important; }
.stat-badge i.text-primary { color: var(--bs-primary) !important; }
</style>