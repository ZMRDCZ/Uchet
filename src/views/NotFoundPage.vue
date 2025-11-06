<template>
  <div class="not-found-page">
    <div class="container">
      <div class="text-center py-5">
        <div class="error-code">404</div>
        <h1 class="error-title">Страница не найдена</h1>
        <p class="error-description">
          Запрашиваемая страница не существует или была перемещена
        </p>
        
        <div class="error-actions mt-4">
          <router-link to="/dashboard" class="btn btn-primary me-3">
            <i class="fas fa-home me-2"></i>
            На главную
          </router-link>
          <button class="btn btn-outline-secondary" @click="goBack">
            <i class="fas fa-arrow-left me-2"></i>
            Назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFoundPage',
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.go(-1)
    }

    return {
      goBack
    }
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  color: var(--bs-primary);
  line-height: 1;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.error-description {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 500px;
  margin: 0 auto;
}

.error-actions {
  margin-top: 2rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .error-code {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
}
</style> 