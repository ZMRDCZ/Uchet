<template>
  <footer class="app-footer bg-white border-top">
    <div class="container-fluid">
      <div class="row align-items-center py-3">
        <!-- Левая часть - информация о системе -->
        <div class="col-md-6">
          <div class="footer-info d-flex align-items-center">
            <div class="footer-logo me-3">
              <i class="fas fa-building text-primary"></i>
            </div>
            <div class="footer-text">
              <div class="footer-title">
                Система учёта активности предприятия
              </div>
              <div class="footer-subtitle text-muted">
                Версия 1.0.0 | © {{ currentYear }} Все права защищены
              </div>
            </div>
          </div>
        </div>
        
        <!-- Правая часть - статистика и ссылки -->
        <div class="col-md-6">
          <div class="footer-actions d-flex align-items-center justify-content-md-end">
            <!-- Быстрая статистика -->
            <div class="footer-stats d-none d-lg-flex me-4">
              <div class="stat-item me-3" v-if="stats.onlineUsers">
                <i class="fas fa-users text-success me-1"></i>
                <span class="small">{{ stats.onlineUsers }} онлайн</span>
              </div>
              <div class="stat-item me-3" v-if="stats.totalEvents">
                <i class="fas fa-calendar text-primary me-1"></i>
                <span class="small">{{ stats.totalEvents }} мероприятий</span>
              </div>
              <div class="stat-item" v-if="stats.totalUsers">
                <i class="fas fa-user-friends text-info me-1"></i>
                <span class="small">{{ stats.totalUsers }} пользователей</span>
              </div>
            </div>
            
            <!-- Ссылки -->
            <div class="footer-links d-flex align-items-center">
              <a 
                href="#" 
                class="footer-link me-3"
                @click.prevent="showHelp"
                title="Справка"
              >
                <i class="fas fa-question-circle"></i>
                <span class="d-none d-sm-inline ms-1">Справка</span>
              </a>
              
              <a 
                href="mailto:support@company.com" 
                class="footer-link me-3"
                title="Поддержка"
              >
                <i class="fas fa-headset"></i>
                <span class="d-none d-sm-inline ms-1">Поддержка</span>
              </a>
              
              <button 
                class="footer-link btn btn-link p-0"
                @click="showFeedback"
                title="Обратная связь"
              >
                <i class="fas fa-comment-dots"></i>
                <span class="d-none d-sm-inline ms-1">Отзыв</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Дополнительная информация для мобильных устройств -->
      <div class="row d-md-none">
        <div class="col-12">
          <div class="footer-mobile-stats text-center py-2 border-top">
            <div class="d-flex justify-content-center gap-3">
              <div class="stat-item" v-if="stats.onlineUsers">
                <i class="fas fa-users text-success"></i>
                <span class="small ms-1">{{ stats.onlineUsers }}</span>
              </div>
              <div class="stat-item" v-if="stats.totalEvents">
                <i class="fas fa-calendar text-primary"></i>
                <span class="small ms-1">{{ stats.totalEvents }}</span>
              </div>
              <div class="stat-item" v-if="stats.totalUsers">
                <i class="fas fa-user-friends text-info"></i>
                <span class="small ms-1">{{ stats.totalUsers }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно справки -->
    <div 
      id="helpModal" 
      class="modal fade" 
      tabindex="-1" 
      aria-labelledby="helpModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="helpModalLabel" class="modal-title">
              <i class="fas fa-question-circle me-2"></i>
              Справка по системе
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Закрыть"
            ></button>
          </div>
          <div class="modal-body">
            <div class="help-content">
              <div class="help-section mb-4">
                <h6><i class="fas fa-calendar-alt me-2 text-primary"></i>Мероприятия</h6>
                <p class="small text-muted mb-2">
                  Участвуйте в корпоративных мероприятиях и зарабатывайте баллы за активность.
                </p>
                <ul class="small">
                  <li>Регистрируйтесь на интересные события</li>
                  <li>Посещайте мероприятия и получайте баллы</li>
                  <li>Оставляйте отзывы и оценки</li>
                </ul>
              </div>
              
              <div class="help-section mb-4">
                <h6><i class="fas fa-gift me-2 text-success"></i>Награды</h6>
                <p class="small text-muted mb-2">
                  Обменивайте накопленные баллы на ценные призы и услуги.
                </p>
                <ul class="small">
                  <li>Выбирайте из каталога наград</li>
                  <li>Оплачивайте баллами</li>
                  <li>Получайте призы и услуги</li>
                </ul>
              </div>
              
              <div class="help-section mb-4">
                <h6><i class="fas fa-trophy me-2 text-warning"></i>Рейтинг</h6>
                <p class="small text-muted mb-2">
                  Соревнуйтесь с коллегами в активности и занимайте верхние позиции.
                </p>
                <ul class="small">
                  <li>Отслеживайте свою позицию</li>
                  <li>Сравнивайте результаты с коллегами</li>
                  <li>Стремитесь к лидерству</li>
                </ul>
              </div>
              
              <div class="help-section">
                <h6><i class="fas fa-user me-2 text-info"></i>Профиль</h6>
                <p class="small text-muted mb-2">
                  Управляйте своим профилем и отслеживайте личную статистику.
                </p>
                <ul class="small">
                  <li>Просматривайте историю активности</li>
                  <li>Отслеживайте баланс баллов</li>
                  <li>Обновляйте личную информацию</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Закрыть
            </button>
            <a href="mailto:support@company.com" class="btn btn-primary">
              <i class="fas fa-envelope me-1"></i>
              Связаться с поддержкой
            </a>
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
              <i class="fas fa-comment-dots me-2"></i>
              Обратная связь
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
              <div class="mb-3">
                <label for="feedbackType" class="form-label">Тип обращения</label>
                <select 
                  id="feedbackType" 
                  v-model="feedbackForm.type" 
                  class="form-select"
                  required
                >
                  <option value="">Выберите тип</option>
                  <option value="bug">Сообщить об ошибке</option>
                  <option value="feature">Предложить улучшение</option>
                  <option value="question">Задать вопрос</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label for="feedbackMessage" class="form-label">Сообщение</label>
                <textarea 
                  id="feedbackMessage"
                  v-model="feedbackForm.message"
                  class="form-control"
                  rows="4"
                  placeholder="Опишите вашу проблему или предложение..."
                  required
                ></textarea>
              </div>
              
              <div class="mb-3">
                <label for="feedbackEmail" class="form-label">Email для ответа (необязательно)</label>
                <input 
                  id="feedbackEmail"
                  v-model="feedbackForm.email"
                  type="email"
                  class="form-control"
                  :placeholder="authStore.user?.email || 'ваш@email.com'"
                >
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Отмена
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="feedbackLoading"
              >
                <span v-if="feedbackLoading" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="fas fa-paper-plane me-1"></i>
                Отправить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AppFooter',
  setup() {
    const toast = useToast()
    const authStore = useAuthStore()
    
    // Данные
    const stats = ref({
      onlineUsers: 0,
      totalEvents: 0,
      totalUsers: 0
    })
    
    const feedbackForm = ref({
      type: '',
      message: '',
      email: ''
    })
    
    const feedbackLoading = ref(false)
    let statsIntervalId = null
    
    // Вычисляемые свойства
    const currentYear = computed(() => new Date().getFullYear())
    
    // Методы
    const loadStats = async () => {
      try {
        // Здесь бы был API вызов для получения статистики
        // const response = await api.get('/statistics/footer')
        // stats.value = response.data
        
        // Заглушка с примерными данными
        stats.value = {
          onlineUsers: Math.floor(Math.random() * 50) + 10,
          totalEvents: Math.floor(Math.random() * 100) + 50,
          totalUsers: Math.floor(Math.random() * 500) + 200
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики футера:', error)
      }
    }
    
    const showHelp = () => {
      const modal = Modal.getOrCreateInstance(document.getElementById('helpModal'))
      modal.show()
    }
    
    const showFeedback = () => {
      // Предзаполняем email текущего пользователя
      feedbackForm.value.email = authStore.user?.email || ''
      
      const modal = Modal.getOrCreateInstance(document.getElementById('feedbackModal'))
      modal.show()
    }
    
    const submitFeedback = async () => {
      try {
        feedbackLoading.value = true
        
        // Здесь бы был API вызов для отправки обратной связи
        // await api.post('/feedback', feedbackForm.value)
        
        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        toast.success('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
        
        // Закрываем модальное окно
        const modalElement = document.getElementById('feedbackModal')
        const modal = Modal.getOrCreateInstance(modalElement)
        modal.hide()
        
        // Очищаем форму
        feedbackForm.value = {
          type: '',
          message: '',
          email: ''
        }
        
      } catch (error) {
        console.error('Ошибка отправки обратной связи:', error)
        toast.error('Ошибка отправки сообщения. Попробуйте позже.')
      } finally {
        feedbackLoading.value = false
      }
    }
    
    // Обновление статистики каждую минуту
    const startStatsInterval = () => {
      if (statsIntervalId) {
        clearInterval(statsIntervalId)
      }

      statsIntervalId = setInterval(loadStats, 60000)
    }
    
    onMounted(() => {
      loadStats()
      startStatsInterval()
    })

    onUnmounted(() => {
      if (statsIntervalId) {
        clearInterval(statsIntervalId)
      }
    })
    
    return {
      authStore,
      stats,
      feedbackForm,
      feedbackLoading,
      currentYear,
      
      showHelp,
      showFeedback,
      submitFeedback
    }
  }
}
</script>

<style scoped>
.app-footer {
  background-color: var(--white);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -2px 4px rgba(0, 38, 100, 0.05);
  margin-top: auto;
  font-family: 'Arial', sans-serif;
}

.footer-logo {
  font-size: 1.5rem;
  color: var(--primary-blue);
}

.footer-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-primary);
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-subtitle {
  font-size: 0.75rem;
  line-height: 1.2;
  color: var(--text-secondary);
  font-weight: 400;
}

.footer-stats {
  border-left: 1px solid var(--border-color);
  padding-left: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-weight: 400;
}

.stat-item i {
  color: var(--primary-blue);
}

.stat-item .text-success {
  color: var(--success) !important;
}

.stat-item .text-primary {
  color: var(--primary-blue) !important;
}

.stat-item .text-info {
  color: var(--info) !important;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  font-weight: 400;
}

.footer-link:hover {
  color: var(--primary-blue);
  transform: translateY(-1px);
}

.footer-link.btn {
  border: none;
  background: none;
  color: var(--text-secondary);
}

.footer-link.btn:hover {
  color: var(--primary-blue);
}

.footer-mobile-stats {
  background-color: var(--light-gray);
}

/* Модальные окна */
.help-section h6 {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.help-section ul {
  margin-bottom: 0;
  padding-left: 1.25rem;
}

.help-section li {
  margin-bottom: 0.25rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.help-section .text-primary {
  color: var(--primary-blue) !important;
}

.help-section .text-success {
  color: var(--success) !important;
}

.help-section .text-warning {
  color: var(--warning) !important;
}

.help-section .text-info {
  color: var(--info) !important;
}

/* Адаптивность */
@media (max-width: 767.98px) {
  .app-footer .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .footer-info {
    justify-content: center;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .footer-actions {
    justify-content: center !important;
  }
  
  .footer-stats {
    display: none !important;
  }
  
  .footer-links {
    gap: 1rem;
  }
}

@media (max-width: 575.98px) {
  .footer-title {
    font-size: 0.8rem;
  }
  
  .footer-subtitle {
    font-size: 0.7rem;
  }
  
  .footer-link {
    font-size: 0.8rem;
  }
  
  .stat-item {
    font-size: 0.8rem;
  }
}

/* Темная тема */
[data-theme="dark"] .app-footer {
  background-color: var(--gray-blue-dark);
  border-color: var(--gray-blue-light);
}

[data-theme="dark"] .footer-title {
  color: var(--white);
}

[data-theme="dark"] .footer-subtitle {
  color: var(--gray-blue-light);
}

[data-theme="dark"] .footer-link {
  color: var(--gray-blue-light);
}

[data-theme="dark"] .footer-link:hover {
  color: var(--white);
}

[data-theme="dark"] .footer-mobile-stats {
  background-color: var(--gray-dark);
  border-color: var(--gray-blue-light);
}

[data-theme="dark"] .footer-stats {
  border-color: var(--gray-blue-light);
}

[data-theme="dark"] .help-section h6 {
  color: var(--white);
}

[data-theme="dark"] .help-section li {
  color: var(--gray-blue-light);
}

/* Анимации */
.stat-item {
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-1px);
}

.footer-link {
  transition: all 0.3s ease;
}

.footer-link:hover {
  transform: translateY(-1px);
}

/* Улучшения доступности */
.footer-link:focus {
  outline: 2px solid var(--accent-orange);
  outline-offset: 2px;
  border-radius: var(--border-radius);
}

/* Состояния загрузки */
.app-footer.loading {
  opacity: 0.7;
}

.app-footer.loading .stat-item {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Печать */
@media print {
  .app-footer {
    display: none !important;
  }
}

/* Корпоративные акценты */
.footer-logo i {
  color: var(--primary-blue);
}

.footer-link i {
  color: var(--accent-orange);
  margin-right: 0.25rem;
}

.footer-link:hover i {
  color: var(--primary-blue);
}
</style>