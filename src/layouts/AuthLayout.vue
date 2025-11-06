<template>
  <div class="auth-layout min-vh-100 d-flex">
    <!-- Левая часть с фоном и информацией -->
    <div class="auth-sidebar d-none d-lg-flex flex-column justify-content-center align-items-center">
      <div class="auth-brand mb-5">
        <div class="brand-logo mb-3">
          <i class="fas fa-building fa-4x text-white"></i>
        </div>
        <h2 class="text-white fw-bold text-center">
          Учёт активности предприятия
        </h2>
        <p class="text-white-50 text-center mb-0">
          Система управления мероприятиями и начисления баллов
        </p>
      </div>
      
      <div class="auth-features">
        <div class="feature-item d-flex align-items-center mb-3">
          <div class="feature-icon me-3">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div>
            <h6 class="text-white mb-1">Управление мероприятиями</h6>
            <p class="text-white-50 mb-0 small">
              Создавайте и участвуйте в корпоративных событиях
            </p>
          </div>
        </div>
        
        <div class="feature-item d-flex align-items-center mb-3">
          <div class="feature-icon me-3">
            <i class="fas fa-coins"></i>
          </div>
          <div>
            <h6 class="text-white mb-1">Система баллов</h6>
            <p class="text-white-50 mb-0 small">
              Зарабатывайте баллы за активное участие
            </p>
          </div>
        </div>
        
        <div class="feature-item d-flex align-items-center mb-3">
          <div class="feature-icon me-3">
            <i class="fas fa-gift"></i>
          </div>
          <div>
            <h6 class="text-white mb-1">Обмен на награды</h6>
            <p class="text-white-50 mb-0 small">
              Обменивайте баллы на ценные призы и услуги
            </p>
          </div>
        </div>
        
        <div class="feature-item d-flex align-items-center">
          <div class="feature-icon me-3">
            <i class="fas fa-chart-line"></i>
          </div>
          <div>
            <h6 class="text-white mb-1">Аналитика</h6>
            <p class="text-white-50 mb-0 small">
              Отслеживайте свой прогресс и достижения
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Правая часть с формой -->
    <div class="auth-main flex-grow-1 d-flex flex-column justify-content-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <!-- Мобильный заголовок -->
            <div class="auth-header d-lg-none text-center mb-4">
              <div class="brand-logo mb-3">
                <i class="fas fa-building fa-3x text-primary"></i>
              </div>
              <h3 class="fw-bold text-dark mb-2">
                Учёт активности предприятия
              </h3>
              <p class="text-muted">
                Система управления мероприятиями
              </p>
            </div>
            
            <!-- Карточка с формой -->
            <div class="auth-card card border-0 shadow-lg">
              <div class="card-body p-4 p-md-5">
                <router-view />
              </div>
            </div>
            
            <!-- Переключение между страницами -->
            <div class="auth-switch text-center mt-4">
              <router-link 
                v-if="$route.name === 'Login'" 
                to="/auth/register"
                class="text-decoration-none"
              >
                Нет аккаунта? <strong>Зарегистрироваться</strong>
              </router-link>
              
              <router-link 
                v-if="$route.name === 'Register'" 
                to="/auth/login"
                class="text-decoration-none"
              >
                Уже есть аккаунт? <strong>Войти</strong>
              </router-link>
            </div>
            
            <!-- Информация о поддержке -->
            <div class="auth-support text-center mt-4">
              <p class="text-muted small">
                Нужна помощь? Обратитесь к 
                <a href="mailto:support@company.com" class="text-decoration-none">
                  службе поддержки
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.auth-layout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.auth-layout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  pointer-events: none;
}

.auth-sidebar {
  width: 480px;
  min-height: 100vh;
  padding: 3rem 2rem;
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
  backdrop-filter: blur(10px);
}

.auth-sidebar::before {
  content: '';
  position: absolute;
  top: 20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.auth-brand {
  z-index: 2;
  position: relative;
}

.brand-logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-features {
  z-index: 2;
  position: relative;
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-main {
  background: white;
  min-height: 100vh;
  padding: 2rem 0;
  position: relative;
}

.auth-card {
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-header .brand-logo {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
}

.auth-switch a {
  color: #6c757d;
  transition: color 0.2s ease;
}

.auth-switch a:hover {
  color: var(--bs-primary);
}

.auth-support a {
  color: var(--bs-primary);
}

/* Анимации */
.auth-layout {
  animation: slideIn 0.8s ease-out;
}

.auth-card {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.feature-item {
  animation: slideInLeft 0.6s ease-out both;
}

.feature-item:nth-child(1) { animation-delay: 0.1s; }
.feature-item:nth-child(2) { animation-delay: 0.2s; }
.feature-item:nth-child(3) { animation-delay: 0.3s; }
.feature-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

/* Адаптивность */
@media (max-width: 991.98px) {
  .auth-layout {
    background: white;
  }
  
  .auth-main {
    padding: 1rem 0;
  }
  
  .auth-card {
    box-shadow: none;
    border: 1px solid #e9ecef;
  }
}

@media (max-width: 575.98px) {
  .auth-main {
    padding: 0.5rem 0;
  }
  
  .auth-card .card-body {
    padding: 2rem 1.5rem !important;
  }
  
  .auth-header {
    margin-bottom: 2rem !important;
  }
}

/* Состояния фокуса для доступности */
.auth-switch a:focus,
.auth-support a:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Темная тема */
[data-theme="dark"] .auth-main {
  background-color: #1a1a1a;
}

[data-theme="dark"] .auth-card {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .auth-header h3 {
  color: #ffffff;
}

/* Улучшения производительности */
.auth-layout,
.auth-sidebar,
.auth-main {
  will-change: transform;
}

.feature-icon,
.brand-logo {
  will-change: transform;
}

/* Плавная прокрутка */
.auth-main {
  scroll-behavior: smooth;
}

/* Оптимизация для печати */
@media print {
  .auth-layout {
    background: white !important;
  }
  
  .auth-sidebar {
    display: none !important;
  }
  
  .auth-card {
    box-shadow: none !important;
    border: 1px solid #000 !important;
  }
}</style>