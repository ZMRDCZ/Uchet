<template>
  <nav aria-label="breadcrumb" class="breadcrumb-container">
    <div class="container-fluid">
      <ol class="breadcrumb mb-0 py-3">
        <!-- Домашняя страница -->
        <li class="breadcrumb-item">
          <router-link 
            to="/dashboard" 
            class="breadcrumb-link"
            :class="{ active: isCurrentRoute('/dashboard') }"
          >
            <i class="fas fa-home me-1"></i>
            <span>Главная</span>
          </router-link>
        </li>
        
        <!-- Динамические элементы хлебных крошек -->
        <li 
          v-for="(item, index) in items" 
          :key="index"
          class="breadcrumb-item"
          :class="{ active: index === items.length - 1 }"
        >
          <router-link 
            v-if="item.to && index !== items.length - 1"
            :to="item.to"
            class="breadcrumb-link"
          >
            <i v-if="item.icon" :class="[item.icon, 'me-1']"></i>
            {{ item.text }}
          </router-link>
          
          <span v-else class="breadcrumb-current">
            <i v-if="item.icon" :class="[item.icon, 'me-1']"></i>
            {{ item.text }}
          </span>
        </li>
      </ol>
      
      <!-- Дополнительные действия справа -->
      <div v-if="$slots.actions" class="breadcrumb-actions">
        <slot name="actions" />
      </div>
    </div>
  </nav>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  name: 'AppBreadcrumbs',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const route = useRoute()
    
    const isCurrentRoute = (path) => {
      return route.path === path
    }
    
    return {
      isCurrentRoute
    }
  }
}
</script>

<style scoped>
.breadcrumb-container {
  background-color: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.breadcrumb {
  background: transparent;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.breadcrumb-link:hover {
  color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.1);
}

.breadcrumb-link.active {
  color: var(--bs-primary);
  font-weight: 500;
}

.breadcrumb-current {
  color: #495057;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "›";
  color: #6c757d;
  padding: 0 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.breadcrumb-item.active::before {
  color: #adb5bd;
}

.breadcrumb-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

/* Адаптивность */
@media (max-width: 767.98px) {
  .breadcrumb-container .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .breadcrumb {
    font-size: 0.8rem;
  }
  
  .breadcrumb-link,
  .breadcrumb-current {
    padding: 0.125rem 0.25rem;
  }
  
  .breadcrumb-item + .breadcrumb-item::before {
    padding: 0 0.25rem;
  }
  
  /* Скрываем иконки на очень маленьких экранах */
  .breadcrumb-link i,
  .breadcrumb-current i {
    display: none;
  }
}

@media (max-width: 575.98px) {
  /* На мобильных показываем только последние 2 элемента */
  .breadcrumb-item:not(:nth-last-child(-n+2)) {
    display: none;
  }
  
  /* Добавляем многоточие в начале если элементов больше 2 */
  .breadcrumb::before {
    content: "...";
    color: #6c757d;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
  }
}

/* Темная тема */
[data-theme="dark"] .breadcrumb-container {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .breadcrumb-link {
  color: #adb5bd;
}

[data-theme="dark"] .breadcrumb-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .breadcrumb-link.active {
  color: #ffffff;
}

[data-theme="dark"] .breadcrumb-current {
  color: #ffffff;
}

[data-theme="dark"] .breadcrumb-item + .breadcrumb-item::before {
  color: #6c757d;
}

/* Анимации */
.breadcrumb-item {
  animation: slideInLeft 0.3s ease-out;
}

.breadcrumb-link {
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  transform: translateY(-1px);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Улучшения доступности */
.breadcrumb-link:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

/* Состояния загрузки */
.breadcrumb-container.loading {
  opacity: 0.6;
}

.breadcrumb-container.loading .breadcrumb-item {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Кастомные стили для специальных случаев */
.breadcrumb-separator {
  color: #dee2e6;
  margin: 0 0.5rem;
}

.breadcrumb-icon {
  width: 16px;
  text-align: center;
}

/* Интерактивные элементы */
.breadcrumb-dropdown {
  position: relative;
  display: inline-block;
}

.breadcrumb-dropdown-toggle {
  background: none;
  border: none;
  color: #6c757d;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.breadcrumb-dropdown-toggle:hover {
  color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.1);
}

/* Печать */
@media print {
  .breadcrumb-container {
    background: white !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  .breadcrumb-actions {
    display: none !important;
  }
  
  .breadcrumb-link {
    color: #000 !important;
    text-decoration: underline !important;
  }
}
</style>