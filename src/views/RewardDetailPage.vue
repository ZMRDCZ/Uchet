<template>
  <div class="reward-detail-page">
    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>

      <div v-else-if="reward" class="reward-content">
        <!-- Заголовок -->
        <div class="page-header mb-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="page-title mb-2">{{ reward.title }}</h1>
              <div class="reward-meta">
                <span class="badge bg-success me-2">{{ getRewardTypeLabel(reward.type) }}</span>
                <span class="text-muted">
                  <i class="fas fa-box me-1"></i>
                  Осталось: {{ reward.availableQuantity }}
                </span>
              </div>
            </div>
            <div class="col-md-4 text-md-end">
              <div class="reward-price">
                <i class="fas fa-coins text-warning me-1"></i>
                {{ reward.pointsCost }} баллов
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
                <p class="card-text">{{ reward.description }}</p>
                
                <div class="row mt-4">
                  <div class="col-md-6">
                    <h6>Тип награды</h6>
                    <p>
                      <i class="fas fa-tag me-2"></i>
                      {{ getRewardTypeLabel(reward.type) }}
                    </p>
                  </div>
                  <div class="col-md-6">
                    <h6>Доступность</h6>
                    <p>
                      <i class="fas fa-boxes me-2"></i>
                      {{ reward.availableQuantity }} из {{ reward.quantity }}
                    </p>
                    <div class="progress mb-2">
                      <div 
                        class="progress-bar" 
                        :style="{ width: (reward.availableQuantity / reward.quantity * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Боковая панель -->
          <div class="col-lg-4">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title">Покупка</h5>
                
                <div class="user-balance mb-3">
                  <div class="balance-info">
                    <div class="balance-amount">
                      <i class="fas fa-coins text-warning me-2"></i>
                      {{ authStore.user?.points || 0 }} баллов
                    </div>
                    <div class="balance-label">Ваш баланс</div>
                  </div>
                </div>
                
                <div v-if="canAfford" class="purchase-available">
                  <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    У вас достаточно баллов для покупки
                  </div>
                  <button 
                    class="btn btn-success w-100"
                    @click="purchaseReward"
                    :disabled="purchasing"
                  >
                    <span v-if="purchasing" class="spinner-border spinner-border-sm me-2"></span>
                    Купить за {{ reward.pointsCost }} баллов
                  </button>
                </div>
                
                <div v-else class="purchase-unavailable">
                  <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Недостаточно баллов
                  </div>
                  <p class="text-muted small">
                    Необходимо еще {{ reward.pointsCost - (authStore.user?.points || 0) }} баллов
                  </p>
                  <router-link to="/events" class="btn btn-primary w-100">
                    Участвовать в мероприятиях
                  </router-link>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Информация</h5>
                <div class="reward-info">
                  <div class="info-item">
                    <i class="fas fa-calendar me-2"></i>
                    <span>Добавлено: {{ formatDate(reward.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-box me-2"></i>
                    <span>Категория: {{ getRewardCategoryLabel(reward.category) }}</span>
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
          Награда не найдена
        </div>
        <router-link to="/rewards" class="btn btn-primary">
          Вернуться к списку наград
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { endpoints } from '@/services/api'

export default {
  name: 'RewardDetailPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()

    const reward = ref(null)
    const loading = ref(true)
    const purchasing = ref(false)

    const canAfford = computed(() => {
      return (authStore.user?.points || 0) >= (reward.value?.pointsCost || 0)
    })

    const getRewardTypeLabel = (type) => {
      const types = {
        service: 'Услуга',
        prize: 'Приз',
        voucher: 'Ваучер',
        privilege: 'Привилегия'
      }
      return types[type] || 'Награда'
    }

    const getRewardCategoryLabel = (category) => {
      const categories = {
        food: 'Питание',
        clothing: 'Одежда',
        work: 'Работа',
        entertainment: 'Развлечения'
      }
      return categories[category] || 'Общее'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const loadReward = async () => {
      try {
        loading.value = true
        const response = await endpoints.rewards.get(route.params.id)
        reward.value = response.data?.reward || response.reward
      } catch (error) {
        console.error('Ошибка загрузки награды:', error)
        toast.error('Ошибка загрузки награды')
      } finally {
        loading.value = false
      }
    }

    const purchaseReward = async () => {
      try {
        purchasing.value = true
        await endpoints.rewards.purchase(route.params.id)
        toast.success('Награда успешно приобретена!')
        
        // Обновляем баланс пользователя
        if (authStore.user) {
          authStore.user.points -= reward.value.pointsCost
        }
        
        // Перенаправляем на страницу покупок
        router.push('/profile/purchases')
      } catch (error) {
        console.error('Ошибка покупки:', error)
        toast.error(error.message || 'Ошибка покупки награды')
      } finally {
        purchasing.value = false
      }
    }

    onMounted(() => {
      loadReward()
    })

    return {
      reward,
      loading,
      purchasing,
      authStore,
      canAfford,
      getRewardTypeLabel,
      getRewardCategoryLabel,
      formatDate,
      purchaseReward
    }
  }
}
</script>

<style scoped>
.reward-detail-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.reward-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reward-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffc107;
}

.balance-info {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.balance-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffc107;
  margin-bottom: 0.25rem;
}

.balance-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.progress {
  height: 8px;
}

.progress-bar {
  background: linear-gradient(135deg, var(--bs-success) 0%, #20c997 100%);
}

/* Адаптивность */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .reward-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style> 