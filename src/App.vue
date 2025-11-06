<template>
  <div id="app" class="min-vh-100 d-flex flex-column">
    <!-- Навигация -->
    <AppNavbar v-if="!isAuthPage" />
    
    <!-- Основной контент -->
    <main class="flex-grow-1 d-flex flex-column">
      <router-view />
    </main>
    
    <!-- Футер -->
    <AppFooter v-if="!isAuthPage" />
    
    <!-- Глобальный лоадер -->
    <div v-if="isLoading" class="global-loader">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  },
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    // Определяем, является ли текущая страница страницей аутентификации
    const isAuthPage = computed(() => {
      return route.path.startsWith('/auth')
    })
    
    // Состояние глобального загрузчика
    const isLoading = computed(() => appStore.isLoading)
    
    // Инициализация приложения
    onMounted(async () => {
      // Проверяем токен при загрузке приложения
      await authStore.checkAuth()
    })
    
    return {
      isAuthPage,
      isLoading
    }
  }
}
</script>

<style>
/* Глобальные стили приложения - Корпоративный бренд */
#app {
  font-family: 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  background-color: var(--light-gray);
}

/* Корпоративная цветовая палитра */
:root {
  /* Основные цвета */
  --primary-blue: #002664; /* CMYK 100/85/5/35 RGB 0/38/100 - PANTONE 281 C */
  --secondary-blue: #0f4dbc; /* RGB 15/77/188 - RAL 5010 Gentian blue */
  --light-blue: #87c8dc; /* RGB 135/200/220 */
  --accent-blue: #87c8dc; /* CMYK 45/5/10/0 */
  
  /* Серые тона с примесью голубого */
  --gray-blue-light: #808f9a; /* RGB 128/143/154 */
  --gray-blue-dark: #465056; /* RGB 70/80/86 */
  --gray-light: #808080; /* CMYK 20/0/0/50 */
  --gray-dark: #333333; /* CMYK 20/0/0/80 */
  
  /* Дополнительные цвета для акцентов */
  --accent-orange: #eb735a; /* RGB 235/115/90 - CMYK 0/75/75/0 */
  --accent-red: #cd191e; /* RGB 205/25/30 - CMYK 0/100/100/15 */
  --accent-teal: #00afa5; /* RGB 0/175/165 - CMYK 75/5/45/0 */
  
  /* Системные цвета */
  --success: #00afa5;
  --warning: #eb735a;
  --danger: #cd191e;
  --info: #87c8dc;
  
  /* Нейтральные цвета */
  --white: #ffffff;
  --light-gray: #f8f9fa;
  --border-color: #e9ecef;
  --text-primary: #333333;
  --text-secondary: #6c757d;
  --text-muted: #808f9a;
  
  /* Градиенты */
  --gradient-primary: linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--light-blue) 0%, var(--accent-blue) 100%);
  --gradient-success: linear-gradient(135deg, var(--success) 0%, var(--accent-teal) 100%);
  --gradient-warning: linear-gradient(135deg, var(--warning) 0%, var(--accent-orange) 100%);
  --gradient-danger: linear-gradient(135deg, var(--danger) 0%, var(--accent-red) 100%);
  
  /* Тени */
  --shadow-sm: 0 0.125rem 0.25rem rgba(0, 38, 100, 0.075);
  --shadow: 0 0.5rem 1rem rgba(0, 38, 100, 0.15);
  --shadow-lg: 0 1rem 3rem rgba(0, 38, 100, 0.175);
  --shadow-primary: 0 0.5rem 1rem rgba(0, 38, 100, 0.2);
  
  /* Радиусы */
  --border-radius: 0.5rem;
  --border-radius-lg: 1rem;
  --border-radius-xl: 1.5rem;
  
  /* Bootstrap совместимость */
  --bs-primary: var(--primary-blue);
  --bs-secondary: var(--secondary-blue);
  --bs-success: var(--success);
  --bs-warning: var(--warning);
  --bs-danger: var(--danger);
  --bs-info: var(--info);
  --bs-light: var(--light-gray);
  --bs-dark: var(--gray-dark);
}

/* Глобальный лоадер */
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

/* Кастомные утилиты */
.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-hover {
  transition: all 0.3s ease;
  cursor: pointer;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.btn-gradient {
  background: var(--gradient-primary);
  border: none;
  color: var(--white);
}

.btn-gradient:hover {
  background: var(--gradient-primary);
  filter: brightness(1.1);
  color: var(--white);
}

/* Скроллбар */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--light-gray);
}

::-webkit-scrollbar-thumb {
  background: var(--gray-blue-light);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gray-blue-dark);
}

/* Адаптивность */
@media (max-width: 768px) {
  .container-fluid {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .card {
    margin-bottom: 1rem;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .btn:last-child {
    margin-bottom: 0;
  }
}

/* Темная тема */
[data-theme="dark"] {
  --bs-body-bg: var(--gray-dark);
  --bs-body-color: var(--white);
  --bs-border-color: var(--gray-blue-dark);
}

[data-theme="dark"] .card {
  background-color: var(--gray-blue-dark);
  border-color: var(--gray-blue-light);
}

[data-theme="dark"] .navbar {
  background: var(--gradient-primary) !important;
  border-color: var(--gray-blue-dark);
}

[data-theme="dark"] .global-loader {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Печать */
@media print {
  .navbar,
  .footer,
  .btn,
  .pagination {
    display: none !important;
  }
  
  .card {
    border: 1px solid var(--primary-blue) !important;
    box-shadow: none !important;
  }
  
  .container-fluid {
    padding: 0 !important;
  }
  
  body {
    background: var(--white) !important;
    color: var(--text-primary) !important;
  }
}

/* Корпоративные утилиты */
.corporate-header {
  background: var(--gradient-primary);
  color: var(--white);
  padding: 2rem 0;
  text-align: center;
}

.corporate-section {
  padding: 3rem 0;
  background: var(--light-gray);
}

.corporate-accent {
  color: var(--accent-orange);
  font-weight: 700;
}

.corporate-highlight {
  background: var(--gradient-success);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 700;
}

/* Улучшения доступности */
.btn:focus,
.form-control:focus,
.nav-link:focus {
  outline: 2px solid var(--accent-orange);
  outline-offset: 2px;
}
</style>