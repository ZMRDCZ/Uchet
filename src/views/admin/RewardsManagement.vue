<template>
  <div class="rewards-management-page">
    <div class="container">
      <div class="page-header mb-4">
        <h1 class="page-title">
          <i class="fas fa-gift me-2"></i>
          Управление наградами
        </h1>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Функция управления наградами находится в разработке
          </div>
          
          <router-link to="/admin" class="btn btn-primary">
            <i class="fas fa-arrow-left me-2"></i>
            Вернуться в админ-панель
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RewardsManagement'
}
</script>

<style scoped>
.rewards-management-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}
</style> 