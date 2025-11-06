<template>
  <div class="admin-dashboard-page">
    <div class="container">
      <div class="page-header mb-4">
        <h1 class="page-title">
          <i class="fas fa-crown me-2"></i>
          Панель администратора
        </h1>
      </div>

      <div class="row g-4">
        <div class="col-lg-3 col-md-6">
          <div class="card admin-card">
            <div class="card-body text-center">
              <div class="admin-icon">
                <i class="fas fa-users"></i>
              </div>
              <h5 class="card-title">Пользователи</h5>
              <p class="card-text">Управление сотрудниками</p>
              <router-link to="/admin/users" class="btn btn-primary">
                Управлять
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card admin-card">
            <div class="card-body text-center">
              <div class="admin-icon">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <h5 class="card-title">Мероприятия</h5>
              <p class="card-text">Управление событиями</p>
              <router-link to="/admin/events" class="btn btn-primary">
                Управлять
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card admin-card">
            <div class="card-body text-center">
              <div class="admin-icon">
                <i class="fas fa-gift"></i>
              </div>
              <h5 class="card-title">Награды</h5>
              <p class="card-text">Управление призами</p>
              <router-link to="/admin/rewards" class="btn btn-primary">
                Управлять
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card admin-card">
            <div class="card-body text-center">
              <div class="admin-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <h5 class="card-title">Статистика</h5>
              <p class="card-text">Аналитика системы</p>
              <router-link to="/admin/statistics" class="btn btn-primary">
                Просмотреть
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Быстрые действия</h5>
              <div class="row g-3">
                <div class="col-md-4">
                  <router-link to="/admin/purchases" class="btn btn-outline-primary w-100">
                    <i class="fas fa-shopping-cart me-2"></i>
                    Управление покупками
                  </router-link>
                </div>
                <div class="col-md-4">
                  <router-link to="/admin/registrations" class="btn btn-outline-primary w-100">
                    <i class="fas fa-clipboard-list me-2"></i>
                    Управление регистрациями
                  </router-link>
                </div>
                <div class="col-md-4">
                  <router-link to="/events/create" class="btn btn-outline-success w-100">
                    <i class="fas fa-plus me-2"></i>
                    Создать мероприятие
                  </router-link>
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
  name: 'AdminDashboard'
}
</script>

<style scoped>
.admin-dashboard-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.admin-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.admin-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.card-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-text {
  color: #6c757d;
  margin-bottom: 1rem;
}
</style>