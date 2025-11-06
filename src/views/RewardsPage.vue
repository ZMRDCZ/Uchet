<template>
  <div class="rewards-page">
    <div class="container">
      <!-- Заголовок страницы -->
      <div class="page-header mb-4">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="page-title mb-2">
              <i class="fas fa-gift me-2"></i>
              Награды
            </h1>
            <p class="page-subtitle text-muted mb-0">
              Обменивайте баллы на ценные призы и привилегии
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <div class="user-points">
              <div class="points-display">
                <i class="fas fa-coins text-warning me-2"></i>
                <span class="points-value">{{ authStore.user?.points || 0 }}</span>
                <span class="points-label">баллов</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Фильтры -->
      <div class="filters-section mb-4">
        <div class="row g-3">
          <div class="col-lg-4 col-md-6">
            <div class="search-box">
              <input
                v-model="filters.search"
                type="text"
                class="form-control"
                placeholder="Поиск наград..."
                @input="debounceSearch"
              />
              <i class="fas fa-search search-icon"></i>
            </div>
          </div>

          <div class="col-lg-3 col-md-6">
            <select v-model="filters.type" class="form-select" @change="applyFilters">
              <option value="">Все типы</option>
              <option value="service">Услуги</option>
              <option value="prize">Призы</option>
              <option value="voucher">Ваучеры</option>
              <option value="privilege">Привилегии</option>
            </select>
          </div>

          <div class="col-lg-3 col-md-6">
            <select v-model="filters.sortBy" class="form-select" @change="applyFilters">
              <option value="created_at">По дате</option>
              <option value="points">По стоимости</option>
              <option value="title">По названию</option>
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

      <!-- Список наград -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>

      <div v-else-if="rewards.length === 0" class="text-center py-5">
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-gift"></i>
          </div>
          <h5>Награды не найдены</h5>
          <p class="text-muted">Попробуйте изменить фильтры поиска</p>
        </div>
      </div>

      <div v-else>
        <!-- Сетка наград -->
        <div v-if="viewMode === 'grid'" class="rewards-grid">
          <div class="row g-4">
            <div 
              v-for="reward in rewards" 
              :key="reward.id"
              class="col-lg-4 col-md-6"
            >
              <div class="reward-card" @click="goToReward(reward.id)">
                <div class="reward-image">
                  <img 
                    v-if="reward.image" 
                    :src="reward.image" 
                    :alt="reward.title"
                    class="img-fluid"
                  />
                  <div v-else class="reward-placeholder">
                    <i class="fas fa-gift"></i>
                  </div>
                </div>
                <div class="reward-content">
                  <h5 class="reward-title">{{ reward.title }}</h5>
                  <p class="reward-description">{{ reward.description }}</p>
                  <div class="reward-meta">
                    <div class="reward-price">
                      <i class="fas fa-coins text-warning me-1"></i>
                      {{ reward.pointsCost }} баллов
                    </div>
                    <div class="reward-availability">
                      <small class="text-muted">
                        Осталось: {{ reward.availableQuantity }}
                      </small>
                    </div>
                  </div>
                  <div class="reward-type">
                    <span class="badge bg-light text-dark">
                      {{ getRewardTypeLabel(reward.type) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Список наград -->
        <div v-else class="rewards-list">
          <div 
            v-for="reward in rewards" 
            :key="reward.id"
            class="reward-item"
            @click="goToReward(reward.id)"
          >
            <div class="reward-image">
              <img 
                v-if="reward.image" 
                :src="reward.image" 
                :alt="reward.title"
                class="img-fluid"
              />
              <div v-else class="reward-placeholder">
                <i class="fas fa-gift"></i>
              </div>
            </div>
            <div class="reward-content">
              <h5 class="reward-title">{{ reward.title }}</h5>
              <p class="reward-description">{{ reward.description }}</p>
              <div class="reward-meta">
                <div class="reward-price">
                  <i class="fas fa-coins text-warning me-1"></i>
                  {{ reward.pointsCost }} баллов
                </div>
                <div class="reward-availability">
                  <small class="text-muted">
                    Осталось: {{ reward.availableQuantity }}
                  </small>
                </div>
                <div class="reward-type">
                  <span class="badge bg-light text-dark">
                    {{ getRewardTypeLabel(reward.type) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { endpoints } from '@/services/api'

export default {
  name: 'RewardsPage',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()

    const rewards = ref([])
    const loading = ref(false)
    const viewMode = ref('grid')

    const filters = reactive({
      search: '',
      type: '',
      sortBy: 'created_at'
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

    const loadRewards = async () => {
      try {
        loading.value = true
        const response = await endpoints.rewards.list(filters)
        rewards.value = response.data?.rewards || response.rewards || []
      } catch (error) {
        console.error('Ошибка загрузки наград:', error)
        toast.error('Ошибка загрузки наград')
      } finally {
        loading.value = false
      }
    }

    const debounceSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        applyFilters()
      }, 300)
    }

    const applyFilters = () => {
      loadRewards()
    }

    const goToReward = (rewardId) => {
      router.push(`/rewards/${rewardId}`)
    }

    let searchTimeout = null

    onMounted(() => {
      loadRewards()
    })

    return {
      rewards,
      loading,
      viewMode,
      filters,
      authStore,
      getRewardTypeLabel,
      debounceSearch,
      applyFilters,
      goToReward
    }
  }
}
</script>

<style scoped>
.rewards-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.points-display {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.points-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffc107;
  margin: 0 0.5rem;
}

.points-label {
  font-size: 0.9rem;
  color: #6c757d;
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
}

.view-toggles .btn {
  margin-left: 0.25rem;
}

.view-toggles .btn.active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
}

.reward-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e9ecef;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
}

.reward-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-color: var(--bs-primary);
}

.reward-image {
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.reward-placeholder {
  font-size: 3rem;
  color: #6c757d;
}

.reward-content {
  padding: 1.5rem;
}

.reward-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.reward-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.reward-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reward-price {
  font-weight: 600;
  color: #ffc107;
}

.reward-type {
  margin-top: 0.5rem;
}

/* Список наград */
.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reward-item {
  display: flex;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e9ecef;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.reward-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  border-color: var(--bs-primary);
}

.reward-item .reward-image {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.reward-item .reward-content {
  flex: 1;
  padding: 1.5rem;
}

.reward-item .reward-meta {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h5 {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

/* Адаптивность */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .points-display {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .reward-item {
    flex-direction: column;
  }
  
  .reward-item .reward-image {
    width: 100%;
    height: 200px;
  }
}
</style>