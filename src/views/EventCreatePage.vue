<template>
  <div class="event-create-page">
    <div class="container">
      <div class="page-header mb-4">
        <h1 class="page-title">
          <i class="fas fa-plus me-2"></i>
          Создать мероприятие
        </h1>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Функция создания мероприятий находится в разработке
          </div>
          
          <router-link to="/events" class="btn btn-primary">
            <i class="fas fa-arrow-left me-2"></i>
            Вернуться к списку мероприятий
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCreatePage'
}
</script>

<style scoped>
.event-create-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}
</style> 