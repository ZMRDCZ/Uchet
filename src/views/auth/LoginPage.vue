<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5 col-xl-4">
          <!-- Логотип и заголовок -->
          <div class="text-center mb-4">
            <div class="logo mb-3">
              <i class="fas fa-trophy fa-3x text-primary"></i>
            </div>
            <h2 class="fw-bold">Добро пожаловать</h2>
            <p class="text-muted">Войдите в систему для доступа к мероприятиям и наградам</p>
          </div>

          <!-- Демо-аккаунты -->
          <div class="demo-accounts mb-4">
            <div class="card border-info">
              <div class="card-header bg-info text-white">
                <h6 class="mb-0">
                  <i class="fas fa-info-circle me-2"></i>
                  Демо-аккаунты для тестирования
                </h6>
              </div>
              <div class="card-body">
                <div class="demo-account-item mb-2" @click="fillDemoAccount('admin')">
                  <strong>Администратор:</strong> admin@company.com / password
                </div>
                <div class="demo-account-item mb-2" @click="fillDemoAccount('moderator')">
                  <strong>Модератор:</strong> moderator@company.com / password
                </div>
                <div class="demo-account-item" @click="fillDemoAccount('user')">
                  <strong>Пользователь:</strong> user@company.com / password
                </div>
              </div>
            </div>
          </div>

          <!-- Форма входа -->
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <form @submit.prevent="handleLogin">
                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="Введите ваш email"
                      required
                    />
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email }}
                    </div>
                  </div>
                </div>

                <!-- Пароль -->
                <div class="mb-3">
                  <label for="password" class="form-label">Пароль</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Введите пароль"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                    <div v-if="errors.password" class="invalid-feedback">
                      {{ errors.password }}
                    </div>
                  </div>
                </div>

                <!-- Запомнить меня -->
                <div class="mb-3 form-check">
                  <input
                    id="remember"
                    v-model="form.remember"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <label class="form-check-label" for="remember">
                    Запомнить меня
                  </label>
                </div>

                <!-- Кнопка входа -->
                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Вход...' : 'Войти' }}
                </button>

                <!-- Ошибка -->
                <div v-if="error" class="alert alert-danger" role="alert">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>
              </form>

              <!-- Ссылки -->
              <div class="text-center">
                <router-link to="/auth/register" class="text-decoration-none">
                  Нет аккаунта? Зарегистрируйтесь
                </router-link>
              </div>
            </div>
          </div>

          <!-- Информация о системе -->
          <div class="text-center mt-4">
            <small class="text-muted">
              Система управления корпоративными мероприятиями и наградами
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()

    // Состояние формы
    const form = reactive({
      email: '',
      password: '',
      remember: false
    })

    const errors = reactive({})
    const error = ref('')
    const isLoading = ref(false)
    const showPassword = ref(false)

    // Заполнение демо-аккаунта
    const fillDemoAccount = (role) => {
      const accounts = {
        admin: { email: 'admin@company.com', password: 'password' },
        moderator: { email: 'moderator@company.com', password: 'password' },
        user: { email: 'user@company.com', password: 'password' }
      }
      
      const account = accounts[role]
      if (account) {
        form.email = account.email
        form.password = account.password
        toast.info(`Заполнен аккаунт ${role}`)
      }
    }

    // Обработка входа
    const handleLogin = async () => {
      // Сброс ошибок
      Object.keys(errors).forEach(key => delete errors[key])
      error.value = ''

      // Валидация
      if (!form.email) {
        errors.email = 'Email обязателен'
        return
      }

      if (!form.password) {
        errors.password = 'Пароль обязателен'
        return
      }

      try {
        isLoading.value = true

        const result = await authStore.login({
          email: form.email,
          password: form.password
        })

        if (result.success) {
          toast.success('Добро пожаловать!')
          
          // Перенаправление на главную страницу
          router.push('/')
        } else {
          error.value = result.error
        }
      } catch (err) {
        console.error('Ошибка входа:', err)
        error.value = 'Произошла ошибка при входе в систему'
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errors,
      error,
      isLoading,
      showPassword,
      fillDemoAccount,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.logo {
  color: var(--bs-primary);
}

.demo-accounts {
  cursor: pointer;
}

.demo-account-item {
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.demo-account-item:hover {
  background-color: rgba(13, 202, 240, 0.1);
}

.card {
  border: none;
  border-radius: 1rem;
}

.card-header {
  border-radius: 1rem 1rem 0 0 !important;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.btn-primary:disabled {
  transform: none;
  box-shadow: none;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

/* Адаптивность */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem 0;
  }
  
  .card-body {
    padding: 1.5rem !important;
  }
}

/* Темная тема */
[data-theme="dark"] .login-page {
  background: linear-gradient(135deg, #2c5aa0 0%, #5a4b7a 100%);
}

[data-theme="dark"] .card {
  background-color: #2d2d2d;
  border-color: #444444;
}

[data-theme="dark"] .card-header {
  background-color: #1a1a1a !important;
  border-color: #444444;
}

[data-theme="dark"] .form-control {
  background-color: #1a1a1a;
  border-color: #444444;
  color: #ffffff;
}

[data-theme="dark"] .input-group-text {
  background-color: #1a1a1a;
  border-color: #444444;
  color: #ffffff;
}
</style>