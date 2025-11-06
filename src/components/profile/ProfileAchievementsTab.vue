<template>
  <div class="profile-achievements-tab">
    <!-- Прогресс общих достижений -->
    <div class="achievements-overview mb-4">
      <div class="row g-3">
        <div class="col-lg-8">
          <div class="overview-card">
            <div class="overview-header">
              <h5 class="overview-title">
                <i class="fas fa-trophy me-2"></i>
                Ваши достижения
              </h5>
              <div class="overview-stats">
                {{ earnedAchievements.length }} из {{ totalAchievements }} получено
              </div>
            </div>
            
            <div class="overview-progress">
              <div class="progress-bar-container">
                <div class="progress">
                  <div 
                    class="progress-bar" 
                    :style="{ width: overallProgress + '%' }"
                  ></div>
                </div>
                <span class="progress-text">{{ overallProgress }}%</span>
              </div>
              
              <div class="progress-categories">
                <div 
                  v-for="category in achievementCategories" 
                  :key="category.id"
                  class="category-progress"
                >
                  <div class="category-info">
                    <i :class="category.icon"></i>
                    <span class="category-name">{{ category.name }}</span>
                  </div>
                  <div class="category-stats">
                    {{ getCategoryProgress(category.id) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="achievements-stats">
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-medal"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ earnedAchievements.length }}</div>
                <div class="stat-label">Получено</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-star"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ totalPoints }}</div>
                <div class="stat-label">Очков опыта</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ currentLevel }}</div>
                <div class="stat-label">Уровень</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="achievements-filters mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-3">
          <select v-model="filters.category" class="form-select">
            <option value="">Все категории</option>
            <option 
              v-for="category in achievementCategories" 
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.status" class="form-select">
            <option value="">Все достижения</option>
            <option value="earned">Полученные</option>
            <option value="in_progress">В процессе</option>
            <option value="locked">Заблокированные</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.difficulty" class="form-select">
            <option value="">Любая сложность</option>
            <option value="easy">Легкие</option>
            <option value="medium">Средние</option>
            <option value="hard">Сложные</option>
            <option value="legendary">Легендарные</option>
          </select>
        </div>
        <div class="col-md-3">
          <div class="view-mode-toggle">
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

    <!-- Последние достижения -->
    <div v-if="recentAchievements.length > 0" class="recent-achievements mb-4">
      <div class="recent-header">
        <h6 class="recent-title">
          <i class="fas fa-clock me-2"></i>
          Недавно получено
        </h6>
      </div>
      <div class="recent-list">
        <div 
          v-for="achievement in recentAchievements" 
          :key="achievement.id"
          class="recent-item"
        >
          <div class="recent-icon">
            <img 
              v-if="achievement.icon" 
              :src="achievement.icon" 
              :alt="achievement.name"
            />
            <i v-else :class="achievement.defaultIcon"></i>
          </div>
          <div class="recent-info">
            <div class="recent-name">{{ achievement.name }}</div>
            <div class="recent-date">{{ formatRelativeTime(achievement.earnedAt) }}</div>
          </div>
          <div class="recent-reward">
            +{{ achievement.experience }} XP
          </div>
        </div>
      </div>
    </div>

    <!-- Список достижений -->
    <div class="achievements-content">
      <div v-if="loading" class="loading-state text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
        <p class="mt-2 text-muted">Загрузка достижений...</p>
      </div>

      <div v-else-if="filteredAchievements.length === 0" class="empty-state text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fas fa-trophy"></i>
        </div>
        <h5>Достижения не найдены</h5>
        <p class="text-muted">
          {{ hasActiveFilters ? 'Попробуйте изменить фильтры' : 'Начните участвовать в мероприятиях для получения достижений' }}
        </p>
      </div>

      <!-- Сетка достижений -->
      <div v-else-if="viewMode === 'grid'" class="achievements-grid">
        <div 
          v-for="achievement in filteredAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="getAchievementClass(achievement)"
          @click="showAchievementDetails(achievement)"
        >
          <div class="achievement-icon">
            <img 
              v-if="achievement.icon" 
              :src="achievement.icon" 
              :alt="achievement.name"
            />
            <i v-else :class="achievement.defaultIcon"></i>
            
            <!-- Статус достижения -->
            <div v-if="achievement.isEarned" class="achievement-status earned">
              <i class="fas fa-check"></i>
            </div>
            <div v-else-if="achievement.isLocked" class="achievement-status locked">
              <i class="fas fa-lock"></i>
            </div>
          </div>

          <div class="achievement-content">
            <h6 class="achievement-name">{{ achievement.name }}</h6>
            <p class="achievement-description">{{ achievement.description }}</p>
            
            <!-- Прогресс -->
            <div v-if="achievement.progress" class="achievement-progress">
              <div class="progress-info">
                <span class="progress-current">{{ achievement.progress.current }}</span>
                <span class="progress-separator">/</span>
                <span class="progress-total">{{ achievement.progress.total }}</span>
              </div>
              <div class="progress">
                <div 
                  class="progress-bar"
                  :style="{ width: getProgressPercentage(achievement) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Награда -->
            <div class="achievement-reward">
              <div class="reward-experience">
                <i class="fas fa-star me-1"></i>
                {{ achievement.experience }} XP
              </div>
              <div v-if="achievement.pointsReward" class="reward-points">
                <i class="fas fa-coins me-1"></i>
                {{ achievement.pointsReward }} баллов
              </div>
            </div>

            <!-- Сложность -->
            <div class="achievement-difficulty">
              <span class="difficulty-badge" :class="getDifficultyClass(achievement.difficulty)">
                {{ getDifficultyLabel(achievement.difficulty) }}
              </span>
            </div>

            <!-- Дата получения -->
            <div v-if="achievement.earnedAt" class="achievement-earned-date">
              <i class="fas fa-calendar me-1"></i>
              {{ formatDate(achievement.earnedAt) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Список достижений -->
      <div v-else class="achievements-list">
        <div 
          v-for="achievement in filteredAchievements" 
          :key="achievement.id"
          class="achievement-list-item"
          :class="getAchievementClass(achievement)"
          @click="showAchievementDetails(achievement)"
        >
          <div class="achievement-icon-small">
            <img 
              v-if="achievement.icon" 
              :src="achievement.icon" 
              :alt="achievement.name"
            />
            <i v-else :class="achievement.defaultIcon"></i>
          </div>

          <div class="achievement-info">
            <div class="achievement-header">
              <h6 class="achievement-name">{{ achievement.name }}</h6>
              <div class="achievement-meta">
                <span class="difficulty-badge" :class="getDifficultyClass(achievement.difficulty)">
                  {{ getDifficultyLabel(achievement.difficulty) }}
                </span>
                <span class="experience-badge">{{ achievement.experience }} XP</span>
              </div>
            </div>
            
            <p class="achievement-description">{{ achievement.description }}</p>
            
            <div v-if="achievement.progress" class="achievement-progress-list">
              <div class="progress-info">
                Прогресс: {{ achievement.progress.current }}/{{ achievement.progress.total }}
              </div>
              <div class="progress">
                <div 
                  class="progress-bar"
                  :style="{ width: getProgressPercentage(achievement) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="achievement-actions">
            <div v-if="achievement.isEarned" class="status-earned">
              <i class="fas fa-check-circle"></i>
              Получено
            </div>
            <div v-else-if="achievement.isLocked" class="status-locked">
              <i class="fas fa-lock"></i>
              Заблокировано
            </div>
            <div v-else class="status-progress">
              <i class="fas fa-hourglass-half"></i>
              В процессе
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно деталей достижения -->
    <div 
      id="achievementModal" 
      class="modal fade" 
      tabindex="-1" 
      aria-labelledby="achievementModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="achievementModalLabel" class="modal-title">
              Детали достижения
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Закрыть"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedAchievement" class="achievement-details">
              <div class="details-header">
                <div class="details-icon">
                  <img 
                    v-if="selectedAchievement.icon" 
                    :src="selectedAchievement.icon" 
                    :alt="selectedAchievement.name"
                  />
                  <i v-else :class="selectedAchievement.defaultIcon"></i>
                </div>
                <div class="details-info">
                  <h4>{{ selectedAchievement.name }}</h4>
                  <p class="details-description">{{ selectedAchievement.description }}</p>
                  <div class="details-meta">
                    <span class="difficulty-badge" :class="getDifficultyClass(selectedAchievement.difficulty)">
                      {{ getDifficultyLabel(selectedAchievement.difficulty) }}
                    </span>
                    <span class="category-badge">
                      {{ getCategoryName(selectedAchievement.category) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="details-content">
                <div class="row">
                  <div class="col-md-6">
                    <h6>Награды</h6>
                    <ul class="rewards-list">
                      <li><i class="fas fa-star text-warning"></i> {{ selectedAchievement.experience }} опыта</li>
                      <li v-if="selectedAchievement.pointsReward">
                        <i class="fas fa-coins text-warning"></i> {{ selectedAchievement.pointsReward }} баллов
                      </li>
                      <li v-if="selectedAchievement.badge">
                        <i class="fas fa-medal text-info"></i> Особый значок
                      </li>
                    </ul>
                  </div>
                  <div class="col-md-6">
                    <h6>Требования</h6>
                    <ul class="requirements-list">
                      <li 
                        v-for="requirement in selectedAchievement.requirements" 
                        :key="requirement"
                      >
                        <i class="fas fa-check-circle text-success"></i> {{ requirement }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div v-if="selectedAchievement.progress" class="details-progress">
                  <h6>Текущий прогресс</h6>
                  <div class="progress-detailed">
                    <div class="progress-info">
                      {{ selectedAchievement.progress.current }} / {{ selectedAchievement.progress.total }}
                      ({{ getProgressPercentage(selectedAchievement) }}%)
                    </div>
                    <div class="progress">
                      <div 
                        class="progress-bar"
                        :style="{ width: getProgressPercentage(selectedAchievement) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div v-if="selectedAchievement.tips" class="details-tips">
                  <h6>Советы</h6>
                  <div class="tips-content">
                    {{ selectedAchievement.tips }}
                  </div>
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
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '@/stores/app'

export default {
  name: 'ProfileAchievementsTab',
  setup() {
    const toast = useToast()
    const appStore = useAppStore()

    // Состояние
    const loading = ref(false)
    const viewMode = ref('grid')
    const selectedAchievement = ref(null)
    
    const filters = ref({
      category: '',
      status: '',
      difficulty: ''
    })

    const achievements = ref([])
    const achievementCategories = ref([
      { id: 'participation', name: 'Участие', icon: 'fas fa-users' },
      { id: 'leadership', name: 'Лидерство', icon: 'fas fa-crown' },
      { id: 'learning', name: 'Обучение', icon: 'fas fa-graduation-cap' },
      { id: 'social', name: 'Социальная активность', icon: 'fas fa-heart' },
      { id: 'special', name: 'Особые', icon: 'fas fa-star' }
    ])

    // Вычисляемые свойства
    const hasActiveFilters = computed(() => {
      return filters.value.category || filters.value.status || filters.value.difficulty
    })

    const filteredAchievements = computed(() => {
      let filtered = [...achievements.value]

      if (filters.value.category) {
        filtered = filtered.filter(a => a.category === filters.value.category)
      }

      if (filters.value.status) {
        switch (filters.value.status) {
          case 'earned':
            filtered = filtered.filter(a => a.isEarned)
            break
          case 'in_progress':
            filtered = filtered.filter(a => !a.isEarned && !a.isLocked)
            break
          case 'locked':
            filtered = filtered.filter(a => a.isLocked)
            break
        }
      }

      if (filters.value.difficulty) {
        filtered = filtered.filter(a => a.difficulty === filters.value.difficulty)
      }

      return filtered
    })

    const earnedAchievements = computed(() => {
      return achievements.value.filter(a => a.isEarned)
    })

    const totalAchievements = computed(() => {
      return achievements.value.length
    })

    const overallProgress = computed(() => {
      if (totalAchievements.value === 0) return 0
      return Math.round((earnedAchievements.value.length / totalAchievements.value) * 100)
    })

    const totalPoints = computed(() => {
      return earnedAchievements.value.reduce((sum, a) => sum + a.experience, 0)
    })

    const currentLevel = computed(() => {
      // Простая формула уровня на основе опыта
      return Math.floor(totalPoints.value / 100) + 1
    })

    const recentAchievements = computed(() => {
      return earnedAchievements.value
        .filter(a => a.earnedAt)
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, 3)
    })

    // Методы
    const formatDate = (date) => {
      return appStore.formatDate(date, 'dd MMM yyyy')
    }

    const formatRelativeTime = (date) => {
      return appStore.formatRelativeDate(date)
    }

    const getCategoryProgress = (categoryId) => {
      const categoryAchievements = achievements.value.filter(a => a.category === categoryId)
      const earnedInCategory = categoryAchievements.filter(a => a.isEarned).length
      return `${earnedInCategory}/${categoryAchievements.length}`
    }

    const getCategoryName = (categoryId) => {
      const category = achievementCategories.value.find(c => c.id === categoryId)
      return category ? category.name : 'Неизвестно'
    }

    const getAchievementClass = (achievement) => {
      return {
        'achievement-earned': achievement.isEarned,
        'achievement-locked': achievement.isLocked,
        'achievement-progress': !achievement.isEarned && !achievement.isLocked,
        [`achievement-${achievement.difficulty}`]: true
      }
    }

    const getDifficultyClass = (difficulty) => {
      const classes = {
        easy: 'difficulty-easy',
        medium: 'difficulty-medium',
        hard: 'difficulty-hard',
        legendary: 'difficulty-legendary'
      }
      return classes[difficulty] || 'difficulty-easy'
    }

    const getDifficultyLabel = (difficulty) => {
      const labels = {
        easy: 'Легкое',
        medium: 'Среднее',
        hard: 'Сложное',
        legendary: 'Легендарное'
      }
      return labels[difficulty] || 'Неизвестно'
    }

    const getProgressPercentage = (achievement) => {
      if (!achievement.progress) return 0
      return Math.round((achievement.progress.current / achievement.progress.total) * 100)
    }

    const loadAchievements = async () => {
      try {
        loading.value = true
        
        // Здесь будет API вызов
        // const response = await api.get('/users/me/achievements')
        // achievements.value = response.data
        
        // Заглушка с демо данными
        await new Promise(resolve => setTimeout(resolve, 500))
        
        achievements.value = [
          {
            id: '1',
            name: 'Первые шаги',
            description: 'Участие в первом мероприятии',
            category: 'participation',
            difficulty: 'easy',
            experience: 50,
            pointsReward: 25,
            icon: null,
            defaultIcon: 'fas fa-baby',
            isEarned: true,
            isLocked: false,
            earnedAt: new Date(Date.now() - 86400000 * 30),
            requirements: ['Зарегистрироваться на мероприятие', 'Посетить мероприятие'],
            tips: 'Начните с простых мероприятий, чтобы познакомиться с системой.'
          },
          {
            id: '2',
            name: 'Активный участник',
            description: 'Посещение 10 мероприятий',
            category: 'participation',
            difficulty: 'medium',
            experience: 200,
            pointsReward: 100,
            icon: null,
            defaultIcon: 'fas fa-fire',
            isEarned: true,
            isLocked: false,
            earnedAt: new Date(Date.now() - 86400000 * 15),
            requirements: ['Посетить 10 различных мероприятий'],
            tips: 'Разнообразьте свое участие - посещайте мероприятия разных типов.'
          },
          {
            id: '3',
            name: 'Лидер мнений',
            description: 'Получение высоких оценок от 5 организаторов',
            category: 'leadership',
            difficulty: 'hard',
            experience: 500,
            pointsReward: 250,
            icon: null,
            defaultIcon: 'fas fa-crown',
            isEarned: false,
            isLocked: false,
            progress: { current: 2, total: 5 },
            requirements: ['Получить оценку 5/5 от организатора', 'Повторить 5 раз'],
            tips: 'Активно участвуйте в дискуссиях и делитесь своим опытом.'
          },
          {
            id: '4',
            name: 'Мастер обучения',
            description: 'Завершение всех доступных курсов',
            category: 'learning',
            difficulty: 'legendary',
            experience: 1000,
            pointsReward: 500,
            badge: true,
            icon: null,
            defaultIcon: 'fas fa-graduation-cap',
            isEarned: false,
            isLocked: true,
            requirements: ['Разблокировать участием в 20 мероприятиях'],
            tips: 'Это достижение станет доступно после активного участия в мероприятиях.'
          }
        ]
      } catch (error) {
        console.error('Ошибка загрузки достижений:', error)
        toast.error('Ошибка загрузки списка достижений')
      } finally {
        loading.value = false
      }
    }

    const showAchievementDetails = (achievement) => {
      selectedAchievement.value = achievement
      const modal = new bootstrap.Modal(document.getElementById('achievementModal'))
      modal.show()
    }

    // Инициализация
    onMounted(() => {
      loadAchievements()
    })

    return {
      loading,
      viewMode,
      selectedAchievement,
      filters,
      achievements,
      achievementCategories,
      hasActiveFilters,
      filteredAchievements,
      earnedAchievements,
      totalAchievements,
      overallProgress,
      totalPoints,
      currentLevel,
      recentAchievements,
      
      formatDate,
      formatRelativeTime,
      getCategoryProgress,
      getCategoryName,
      getAchievementClass,
      getDifficultyClass,
      getDifficultyLabel,
      getProgressPercentage,
      showAchievementDetails
    }
  }
}
</script>

<style scoped>
.profile-achievements-tab {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Обзор достижений */
.achievements-overview {
  margin-bottom: 2rem;
}

.overview-card {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  padding: 2rem;
  height: 100%;
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.overview-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.overview-stats {
  font-size: 1rem;
  opacity: 0.9;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.progress {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  background: white;
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  font-size: 1.1rem;
  min-width: 50px;
}

.progress-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.category-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.category-stats {
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.9;
}

/* Статистика */
.achievements-stats {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Фильтры */
.achievements-filters {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.view-mode-toggle {
  display: flex;
  border-radius: 0.5rem;
  overflow: hidden;
}

.view-mode-toggle .btn {
  border-radius: 0;
  border-right: none;
}

.view-mode-toggle .btn:last-child {
  border-right: 1px solid #dee2e6;
}

.view-mode-toggle .btn.active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
}

/* Недавние достижения */
.recent-achievements {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.recent-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.recent-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.recent-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.75rem;
  min-width: 250px;
  flex-shrink: 0;
}

.recent-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.recent-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.recent-info {
  flex: 1;
}

.recent-name {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.recent-date {
  font-size: 0.8rem;
  color: #6c757d;
}

.recent-reward {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffc107;
}

/* Сетка достижений */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
}

.achievement-card.achievement-earned {
  border: 2px solid #198754;
  background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
}

.achievement-card.achievement-locked {
  opacity: 0.6;
  background: #f8f9fa;
}

.achievement-card.achievement-legendary {
  border: 2px solid #ffc107;
  background: linear-gradient(135deg, #fffbf0 0%, #fff8e1 100%);
  position: relative;
}

.achievement-card.achievement-legendary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffc107, #fd7e14, #dc3545, #6f42c1, #0dcaf0, #198754);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.achievement-icon {
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
}

.achievement-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

.achievement-status {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
}

.achievement-status.earned {
  background: #198754;
}

.achievement-status.locked {
  background: #6c757d;
}

.achievement-content {
  text-align: center;
}

.achievement-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.achievement-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.achievement-progress {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.achievement-reward {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.reward-experience,
.reward-points {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: #ffc107;
}

.achievement-difficulty {
  margin-bottom: 1rem;
}

.difficulty-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.difficulty-easy {
  background: #d1eddf;
  color: #0f5132;
}

.difficulty-medium {
  background: #fff3cd;
  color: #664d03;
}

.difficulty-hard {
  background: #f8d7da;
  color: #58151c;
}

.difficulty-legendary {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: white;
}

.achievement-earned-date {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Список достижений */
.achievements-list {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.achievement-list-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
}

.achievement-list-item:hover {
  background: #f8f9fa;
}

.achievement-list-item:last-child {
  border-bottom: none;
}

.achievement-list-item.achievement-earned {
  background: rgba(25, 135, 84, 0.05);
}

.achievement-list-item.achievement-locked {
  opacity: 0.6;
}

.achievement-icon-small {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.achievement-icon-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
}

.achievement-info {
  flex: 1;
}

.achievement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.achievement-meta {
  display: flex;
  gap: 0.5rem;
}

.experience-badge {
  background: #ffc107;
  color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.achievement-progress-list {
  margin-top: 0.75rem;
}

.achievement-actions {
  margin-left: 1rem;
  text-align: center;
}

.status-earned {
  color: #198754;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-locked {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-progress {
  color: #ffc107;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Модальное окно */
.achievement-details {
  max-width: 100%;
}

.details-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.details-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  flex-shrink: 0;
}

.details-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

.details-info h4 {
  margin-bottom: 1rem;
  color: #333;
}

.details-description {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.details-meta {
  display: flex;
  gap: 0.75rem;
}

.category-badge {
  background: var(--bs-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.details-content h6 {
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.rewards-list,
.requirements-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.rewards-list li,
.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.details-progress {
  margin: 2rem 0;
}

.progress-detailed {
  margin-top: 1rem;
}

.progress-detailed .progress-info {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.details-tips {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 2rem;
}

.tips-content {
  color: #6c757d;
  line-height: 1.5;
  font-style: italic;
}

/* Пустые состояния */
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

.empty-state h5 {
  color: #333;
  margin-bottom: 1rem;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .overview-card {
    margin-bottom: 1rem;
  }
  
  .achievements-stats {
    flex-direction: row;
    justify-content: space-around;
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .progress-categories {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767.98px) {
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .recent-list {
    flex-direction: column;
  }
  
  .recent-item {
    min-width: auto;
  }
  
  .achievement-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .achievement-list-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .achievement-icon-small {
    margin-right: 0;
  }
  
  .achievement-actions {
    margin-left: 0;
  }
  
  .details-header {
    flex-direction: column;
    text-align: center;
  }
  
  .details-icon {
    margin: 0 auto;
  }
}

/* Темная тема */
[data-theme="dark"] .achievements-stats,
[data-theme="dark"] .achievements-filters,
[data-theme="dark"] .recent-achievements,
[data-theme="dark"] .achievement-card,
[data-theme="dark"] .achievements-list,
[data-theme="dark"] .loading-state,
[data-theme="dark"] .empty-state {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .overview-title,
[data-theme="dark"] .recent-title,
[data-theme="dark"] .achievement-name,
[data-theme="dark"] .stat-value {
  color: #ffffff;
}

[data-theme="dark"] .achievement-list-item {
  border-color: #444444;
}

[data-theme="dark"] .achievement-list-item:hover {
  background-color: #404040;
}

[data-theme="dark"] .recent-item {
  background-color: #1a1a1a;
}

[data-theme="dark"] .details-tips {
  background-color: #1a1a1a;
}

/* Анимации */
.achievement-card,
.achievement-list-item {
  animation: slideInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.achievement-card:nth-child(1) { animation-delay: 0.1s; }
.achievement-card:nth-child(2) { animation-delay: 0.2s; }
.achievement-card:nth-child(3) { animation-delay: 0.3s; }

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

.achievement-earned .achievement-icon {
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 10px rgba(25, 135, 84, 0.5); }
  to { box-shadow: 0 0 20px rgba(25, 135, 84, 0.8); }
}
</style>