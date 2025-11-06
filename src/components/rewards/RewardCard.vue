<template>
  <div class="reward-card" :class="cardClasses">
    <!-- Изображение награды -->
    <div class="reward-image">
      <img 
        v-if="reward.image" 
        :src="reward.image" 
        :alt="reward.name"
        class="img-fluid"
      />
      <div v-else class="reward-placeholder">
        <i :class="getCategoryIcon(reward.category)"></i>
      </div>
      
      <!-- Бейдж категории -->
      <div class="category-badge">
        {{ getCategoryLabel(reward.category) }}
      </div>
      
      <!-- Индикаторы состояния -->
      <div class="status-indicators">
        <div v-if="!reward.isAvailable || reward.stock === 0" class="status-badge unavailable">
          <i class="fas fa-times-circle"></i>
          Нет в наличии
        </div>
        <div v-else-if="!canAfford" class="status-badge expensive">
          <i class="fas fa-exclamation-triangle"></i>
          Недостаточно баллов
        </div>
        <div v-else-if="isLowStock" class="status-badge low-stock">
          <i class="fas fa-hourglass-half"></i>
          Осталось мало
        </div>
        <div v-else-if="isPopular" class="status-badge popular">
          <i class="fas fa-fire"></i>
          Популярно
        </div>
      </div>
      
      <!-- Скидка -->
      <div v-if="discountPercentage > 0" class="discount-badge">
        -{{ discountPercentage }}%
      </div>
    </div>

    <!-- Содержимое карточки -->
    <div class="reward-content">
      <!-- Заголовок -->
      <h5 class="reward-title" @click="$emit('view', reward.id)">
        {{ reward.name }}
      </h5>

      <!-- Описание -->
      <p v-if="reward.description" class="reward-description">
        {{ truncateText(reward.description, 80) }}
      </p>

      <!-- Цена и экономия -->
      <div class="price-section mb-3">
        <div class="points-price">
          <i class="fas fa-coins me-1"></i>
          <span class="price-value">{{ formatNumber(reward.pointsCost) }}</span>
          <span class="price-label">баллов</span>
        </div>
        
        <div v-if="reward.originalPrice" class="price-comparison">
          <div class="original-price">
            <span class="price-crossed">{{ formatCurrency(reward.originalPrice) }}</span>
          </div>
          <div class="savings">
            Экономия: {{ formatCurrency(reward.originalPrice - (reward.pointsCost * pointToRubleRate)) }}
          </div>
        </div>
      </div>

      <!-- Наличие и популярность -->
      <div class="reward-meta mb-3">
        <div class="stock-info">
          <i class="fas fa-box me-1"></i>
          <span v-if="reward.stock > 10">В наличии</span>
          <span v-else-if="reward.stock > 0" class="text-warning">
            Осталось {{ reward.stock }} шт.
          </span>
          <span v-else class="text-danger">Нет в наличии</span>
        </div>
        
        <div class="popularity-info">
          <i class="fas fa-users me-1"></i>
          <span>{{ reward.popularity || 0 }} покупок</span>
        </div>
      </div>

      <!-- Рейтинг и отзывы -->
      <div v-if="reward.rating" class="rating-section mb-3">
        <div class="rating-stars">
          <i 
            v-for="star in 5" 
            :key="star"
            class="fas fa-star"
            :class="{ active: star <= Math.round(reward.rating) }"
          ></i>
        </div>
        <span class="rating-text">{{ reward.rating.toFixed(1) }}</span>
        <span v-if="reward.reviewsCount" class="reviews-count">
          ({{ reward.reviewsCount }} отзывов)
        </span>
      </div>

      <!-- Теги особенностей -->
      <div v-if="reward.features && reward.features.length" class="features-tags mb-3">
        <span 
          v-for="feature in reward.features.slice(0, 3)" 
          :key="feature"
          class="feature-tag"
        >
          {{ feature }}
        </span>
      </div>
    </div>

    <!-- Действия -->
    <div class="reward-actions">
      <button 
        v-if="canPurchase"
        class="btn btn-primary btn-purchase"
        @click="$emit('purchase', reward.id)"
        :disabled="purchasing"
      >
        <span v-if="purchasing" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="fas fa-shopping-cart me-2"></i>
        {{ purchasing ? 'Покупка...' : 'Купить' }}
      </button>

      <button 
        v-else
        class="btn btn-outline-secondary"
        disabled
      >
        <i class="fas fa-ban me-2"></i>
        {{ getUnavailabilityReason() }}
      </button>

      <button 
        class="btn btn-outline-primary btn-details"
        @click="$emit('view', reward.id)"
      >
        <i class="fas fa-eye me-2"></i>
        Подробнее
      </button>
    </div>

    <!-- Тултип с дополнительной информацией -->
    <div v-if="showTooltip" class="reward-tooltip">
      <div class="tooltip-content">
        <h6>{{ reward.name }}</h6>
        <p><strong>Категория:</strong> {{ getCategoryLabel(reward.category) }}</p>
        <p><strong>Стоимость:</strong> {{ formatNumber(reward.pointsCost) }} баллов</p>
        <p v-if="reward.originalPrice">
          <strong>Цена в магазине:</strong> {{ formatCurrency(reward.originalPrice) }}
        </p>
        <p><strong>В наличии:</strong> {{ reward.stock }} шт.</p>
        <p v-if="reward.validUntil">
          <strong>Действительно до:</strong> {{ formatDate(reward.validUntil) }}
        </p>
      </div>
    </div>

    <!-- Индикатор избранного -->
    <button 
      v-if="showFavoriteButton"
      class="favorite-btn"
      :class="{ active: isFavorite }"
      @click="toggleFavorite"
    >
      <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
    </button>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'

export default {
  name: 'RewardCard',
  props: {
    reward: {
      type: Object,
      required: true
    },
    userPoints: {
      type: Number,
      default: 0
    },
    showTooltip: {
      type: Boolean,
      default: false
    },
    showFavoriteButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['purchase', 'view', 'favorite'],
  setup(props, { emit }) {
    const appStore = useAppStore()
    
    // Состояние
    const purchasing = ref(false)
    const isFavorite = ref(false)
    const pointToRubleRate = 10 // 1 балл = 10 рублей

    // Вычисляемые свойства
    const canAfford = computed(() => {
      return props.userPoints >= props.reward.pointsCost
    })

    const canPurchase = computed(() => {
      return props.reward.isAvailable && 
             props.reward.stock > 0 && 
             canAfford.value
    })

    const isLowStock = computed(() => {
      return props.reward.stock > 0 && props.reward.stock <= 5
    })

    const isPopular = computed(() => {
      return props.reward.popularity > 50
    })

    const discountPercentage = computed(() => {
      if (!props.reward.originalPrice) return 0
      const pointsValue = props.reward.pointsCost * pointToRubleRate
      return Math.round((1 - pointsValue / props.reward.originalPrice) * 100)
    })

    const cardClasses = computed(() => {
      return {
        'reward-unavailable': !props.reward.isAvailable || props.reward.stock === 0,
        'reward-expensive': !canAfford.value,
        'reward-popular': isPopular.value,
        'reward-low-stock': isLowStock.value,
        'reward-new': isNewReward.value,
        'reward-favorite': isFavorite.value
      }
    })

    const isNewReward = computed(() => {
      if (!props.reward.createdAt) return false
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return new Date(props.reward.createdAt) > weekAgo
    })

    // Методы
    const getCategoryIcon = (category) => {
      const icons = {
        service: 'fas fa-concierge-bell',
        prize: 'fas fa-trophy',
        voucher: 'fas fa-ticket-alt',
        privilege: 'fas fa-crown'
      }
      return icons[category] || 'fas fa-gift'
    }

    const getCategoryLabel = (category) => {
      const labels = {
        service: 'Услуга',
        prize: 'Приз',
        voucher: 'Ваучер',
        privilege: 'Привилегия'
      }
      return labels[category] || 'Награда'
    }

    const getUnavailabilityReason = () => {
      if (!props.reward.isAvailable) return 'Недоступно'
      if (props.reward.stock === 0) return 'Нет в наличии'
      if (!canAfford.value) return 'Недостаточно баллов'
      return 'Недоступно'
    }

    const formatNumber = (num) => {
      return appStore.formatNumber(num)
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(amount)
    }

    const formatDate = (date) => {
      return appStore.formatDate(date, 'dd MMM yyyy')
    }

    const truncateText = (text, maxLength) => {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value
      emit('favorite', props.reward.id, isFavorite.value)
    }

    return {
      purchasing,
      isFavorite,
      pointToRubleRate,
      canAfford,
      canPurchase,
      isLowStock,
      isPopular,
      discountPercentage,
      cardClasses,
      isNewReward,
      
      getCategoryIcon,
      getCategoryLabel,
      getUnavailabilityReason,
      formatNumber,
      formatCurrency,
      formatDate,
      truncateText,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.reward-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.reward-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
}

.reward-card.reward-unavailable {
  opacity: 0.7;
}

.reward-card.reward-expensive {
  border: 1px solid #ffc107;
}

.reward-card.reward-popular {
  border: 2px solid #dc3545;
  box-shadow: 0 0.5rem 1rem rgba(220, 53, 69, 0.2);
}

.reward-card.reward-low-stock {
  border: 1px solid #fd7e14;
}

.reward-card.reward-new::before {
  content: 'НОВИНКА';
  position: absolute;
  top: 10px;
  right: -30px;
  background: #198754;
  color: white;
  padding: 0.25rem 2rem;
  font-size: 0.7rem;
  font-weight: 600;
  transform: rotate(45deg);
  z-index: 10;
}

.reward-card.reward-favorite {
  border: 2px solid #e91e63;
}

/* Изображение */
.reward-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.reward-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reward-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
}

.category-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-indicators {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-badge {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.status-badge.unavailable {
  background: #dc3545;
}

.status-badge.expensive {
  background: #ffc107;
  color: #000;
}

.status-badge.low-stock {
  background: #fd7e14;
}

.status-badge.popular {
  background: #dc3545;
  animation: pulse 2s infinite;
}

.discount-badge {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: #dc3545;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}

/* Содержимое */
.reward-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.reward-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: color 0.2s ease;
  line-height: 1.3;
}

.reward-title:hover {
  color: var(--bs-primary);
}

.reward-description {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex-grow: 1;
}

/* Цена */
.price-section {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
}

.points-price {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.points-price i {
  color: #ffc107;
  font-size: 1.1rem;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0.25rem;
}

.price-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.price-comparison {
  text-align: center;
}

.original-price {
  margin-bottom: 0.25rem;
}

.price-crossed {
  text-decoration: line-through;
  color: #6c757d;
  font-size: 0.9rem;
}

.savings {
  color: #198754;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Мета-информация */
.reward-meta {
  display: flex;
  justify-content: space-between;
  color: #6c757d;
  font-size: 0.9rem;
}

.stock-info,
.popularity-info {
  display: flex;
  align-items: center;
}

.stock-info i,
.popularity-info i {
  color: var(--bs-primary);
  width: 16px;
}

/* Рейтинг */
.rating-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  display: flex;
  gap: 0.125rem;
}

.rating-stars i {
  color: #e9ecef;
  font-size: 0.9rem;
}

.rating-stars i.active {
  color: #ffc107;
}

.rating-text {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.reviews-count {
  color: #6c757d;
  font-size: 0.8rem;
}

/* Теги особенностей */
.features-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Действия */
.reward-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  display: flex;
  gap: 0.75rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-purchase {
  background: linear-gradient(135deg, #198754 0%, #20c997 100%);
  border: none;
  color: white;
}

.btn-purchase:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0.25rem 0.5rem rgba(25, 135, 84, 0.3);
}

.btn-details {
  border-color: var(--bs-primary);
  color: var(--bs-primary);
}

.btn-details:hover {
  background: var(--bs-primary);
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Избранное */
.favorite-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  z-index: 5;
}

.favorite-btn:hover {
  background: white;
  color: #e91e63;
  transform: scale(1.1);
}

.favorite-btn.active {
  background: #e91e63;
  color: white;
}

/* Тултип */
.reward-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 0;
  margin-top: 0.5rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.reward-card:hover .reward-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-content {
  padding: 1rem;
}

.tooltip-content h6 {
  margin-bottom: 0.75rem;
  color: #333;
  font-weight: 600;
}

.tooltip-content p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.tooltip-content p:last-child {
  margin-bottom: 0;
}

/* Адаптивность */
@media (max-width: 767.98px) {
  .reward-image {
    height: 150px;
  }
  
  .reward-content {
    padding: 1rem;
  }
  
  .reward-title {
    font-size: 1.1rem;
  }
  
  .reward-actions {
    padding: 0.75rem 1rem;
    flex-direction: column;
  }
  
  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
  }
  
  .price-section {
    padding: 0.75rem;
  }
  
  .price-value {
    font-size: 1.25rem;
  }
  
  .reward-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .features-tags {
    gap: 0.25rem;
  }
  
  .feature-tag {
    font-size: 0.75rem;
  }
}

/* Темная тема */
[data-theme="dark"] .reward-card {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .reward-title {
  color: #ffffff;
}

[data-theme="dark"] .reward-description {
  color: #adb5bd;
}

[data-theme="dark"] .price-section {
  background-color: #1a1a1a;
}

[data-theme="dark"] .price-value {
  color: #ffffff;
}

[data-theme="dark"] .rating-text {
  color: #ffffff;
}

[data-theme="dark"] .reward-actions {
  background-color: #1a1a1a;
  border-color: #444444;
}

[data-theme="dark"] .tooltip-content {
  background-color: #2d2d2d;
  border: 1px solid #444444;
}

[data-theme="dark"] .tooltip-content h6 {
  color: #ffffff;
}

[data-theme="dark"] .tooltip-content p {
  color: #adb5bd;
}

/* Анимации */
.reward-card {
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Состояние загрузки */
.reward-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.reward-card.loading .reward-content {
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Улучшения доступности */
.reward-title:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.btn:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.favorite-btn:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

/* Спецэффекты для разных типов наград */
.reward-card.reward-premium {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border: 2px solid #ffc107;
}

.reward-card.reward-exclusive {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border: 2px solid #9c27b0;
}

.reward-card.reward-limited {
  position: relative;
  overflow: hidden;
}

.reward-card.reward-limited::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shine 2s infinite;
  pointer-events: none;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>