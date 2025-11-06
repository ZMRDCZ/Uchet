<template>
  <div class="app-layout d-flex">
    <!-- Сайдбар -->
    <AppSidebar 
      :is-open="appStore.isSidebarOpen"
      @close="appStore.setSidebarOpen(false)"
    />
    
    <!-- Основной контент -->
    <div class="main-content flex-grow-1 d-flex flex-column">
      <!-- Верхняя навигация -->
      <AppHeader @toggle-sidebar="appStore.toggleSidebar" />
      
      <!-- Хлебные крошки -->
      <AppBreadcrumbs 
        v-if="appStore.breadcrumbs.length > 0"
        :items="appStore.breadcrumbs"
      />
      
      <!-- Контент страницы -->
      <main class="page-content flex-grow-1 p-4">
        <div class="container-fluid">
          <!-- Заголовок страницы -->
          <div v-if="appStore.pageTitle" class="page-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="page-title mb-1">{{ appStore.pageTitle }}</h1>
                <p v-if="appStore.pageSubtitle" class="page-subtitle text-muted mb-0">
                  {{ appStore.pageSubtitle }}
                </p>
              </div>
              
              <!-- Кнопки действий страницы -->
              <div v-if="$slots.pageActions" class="page-actions">
                <slot name="pageActions" />
              </div>
            </div>
          </div>
          
          <!-- Основной контент -->
          <div class="page-body">
            <router-view />
          </div>
        </div>
      </main>
      
      <!-- Футер -->
      <AppFooter />
    </div>
    
    <!-- Оверлей для мобильных устройств -->
    <div 
      v-if="appStore.isSidebarOpen && isMobile"
      class="sidebar-overlay"
      @click="appStore.setSidebarOpen(false)"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppBreadcrumbs from '@/components/layout/AppBreadcrumbs.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppHeader,
    AppSidebar,
    AppBreadcrumbs,
    AppFooter
  },
  setup() {
    const appStore = useAppStore()

    // Определяем мобильное устройство
    const isMobile = ref(window.innerWidth < 992)

    // Обработчик изменения размера окна
    const handleResize = () => {
      isMobile.value = window.innerWidth < 992

      if (window.innerWidth >= 992) {
        appStore.setSidebarOpen(false)
      }
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
      handleResize()
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })
    
    return {
      appStore,
      isMobile
    }
  }
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  min-width: 0; /* Исправляет проблемы с flex в некоторых браузерах */
  transition: margin-left 0.3s ease;
}

.page-content {
  background-color: #f8f9fa;
  min-height: calc(100vh - 140px); /* Учитываем высоту header и footer */
}

.page-header {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 1.5rem;
}

.page-title {
  color: #333;
  font-weight: 600;
  font-size: 1.75rem;
  margin: 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #6c757d;
}

.page-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-body {
  animation: fadeIn 0.3s ease-out;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  backdrop-filter: blur(2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .page-content {
    padding: 1rem !important;
  }
  
  .page-header {
    margin-bottom: 1rem;
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-actions {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 575.98px) {
  .page-header {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .page-header .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }
  
  .page-actions {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
  }
}

/* Темная тема */
[data-theme="dark"] .page-content {
  background-color: #1a1a1a;
}

[data-theme="dark"] .page-header {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .page-title {
  color: #ffffff;
}

[data-theme="dark"] .page-subtitle {
  color: #adb5bd;
}

/* Анимации для переходов между страницами */
.router-view {
  transition: all 0.3s ease;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.v-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Улучшенная прокрутка */
.page-content {
  overflow-y: auto;
  overflow-x: hidden;
}

.page-content::-webkit-scrollbar {
  width: 8px;
}

.page-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.page-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Состояния загрузки */
.page-content.loading {
  opacity: 0.7;
  pointer-events: none;
}

.page-content.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>