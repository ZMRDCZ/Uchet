<template>
  <div class="corporate-header">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <h1 class="corporate-title">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="corporate-subtitle">
            {{ subtitle }}
          </p>
        </div>
        <div class="col-lg-4">
          <div class="corporate-stats">
            <div v-if="stats" class="stats-grid">
              <div v-for="(stat, index) in stats" :key="index" class="stat-item">
                <div class="stat-icon">
                  <i :class="stat.icon"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
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
export default {
  name: 'CorporateHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    stats: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.corporate-header {
  background: var(--gradient-primary);
  color: var(--white);
  padding: 3rem 0;
  position: relative;
  overflow: hidden;
}

.corporate-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.corporate-title {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

.corporate-subtitle {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0;
  position: relative;
  z-index: 1;
}

.corporate-stats {
  position: relative;
  z-index: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 1.5rem;
  color: var(--accent-orange);
  margin-bottom: 0.5rem;
}

.stat-number {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--white);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Адаптивность */
@media (max-width: 991.98px) {
  .corporate-header {
    padding: 2rem 0;
  }
  
  .corporate-title {
    font-size: 2rem;
  }
  
  .corporate-subtitle {
    font-size: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 1.5rem;
  }
}

@media (max-width: 767.98px) {
  .corporate-header {
    padding: 1.5rem 0;
  }
  
  .corporate-title {
    font-size: 1.75rem;
    text-align: center;
  }
  
  .corporate-subtitle {
    font-size: 0.9rem;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-item {
    padding: 0.75rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}

/* Анимации */
.corporate-header {
  animation: fadeInUp 0.6s ease-out;
}

.stat-item {
  animation: fadeInUp 0.6s ease-out;
  animation-delay: calc(var(--animation-order) * 0.1s);
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

/* Темная тема */
[data-theme="dark"] .corporate-header {
  background: var(--gradient-primary);
}

[data-theme="dark"] .stat-item {
  background: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .stat-item:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style> 