<template>
  <div class="moderator-dashboard-page">
    <div class="container">
      <div class="page-header mb-4">
        <h1 class="page-title">
          <i class="fas fa-shield-alt me-2"></i>
          Панель модератора
        </h1>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card moderator-card">
            <div class="card-body text-center">
              <div class="moderator-icon">
                <i class="fas fa-calendar-plus"></i>
              </div>
              <h5 class="card-title">Создать мероприятие</h5>
              <p class="card-text">Добавить новое событие в систему</p>
              <router-link to="/events/create" class="btn btn-primary">
                Создать
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card moderator-card">
            <div class="card-body text-center">
              <div class="moderator-icon">
                <i class="fas fa-clipboard-check"></i>
              </div>
              <h5 class="card-title">Управление регистрациями</h5>
              <p class="card-text">Просмотр и одобрение заявок</p>
              <router-link to="/admin/registrations" class="btn btn-primary">
                Управлять
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Статистика модератора</h5>
              <div class="row g-3">
                <div class="col-md-3">
                  <div class="stat-item">
                    <div class="stat-number">4</div>
                    <div class="stat-label">Активных мероприятий</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="stat-item">
                    <div class="stat-number">15</div>
                    <div class="stat-label">Ожидающих регистраций</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="stat-item">
                    <div class="stat-number">180</div>
                    <div class="stat-label">Всего участников</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="stat-item">
                    <div class="stat-number">85%</div>
                    <div class="stat-label">Средняя заполненность</div>
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
export default {
  name: 'ModeratorDashboard'
}
</script>

<style scoped>
.moderator-dashboard-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.moderator-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.moderator-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.moderator-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--bs-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
}
</style>