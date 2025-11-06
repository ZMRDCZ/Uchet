<template>
  <div class="register-page">
    <!-- Заголовок -->
    <div class="auth-form-header text-center mb-4">
      <h3 class="auth-title mb-2">Создать аккаунт</h3>
      <p class="auth-subtitle text-muted">
        Зарегистрируйтесь для участия в корпоративных мероприятиях
      </p>
    </div>

    <!-- Прогресс регистрации -->
    <div class="registration-progress mb-4">
      <div class="progress-steps">
        <div 
          class="progress-step"
          :class="{ active: currentStep === 1, completed: currentStep > 1 }"
        >
          <div class="step-number">1</div>
          <div class="step-label">Основная информация</div>
        </div>
        <div 
          class="progress-step"
          :class="{ active: currentStep === 2, completed: currentStep > 2 }"
        >
          <div class="step-number">2</div>
          <div class="step-label">Рабочая информация</div>
        </div>
        <div 
          class="progress-step"
          :class="{ active: currentStep === 3 }"
        >
          <div class="step-number">3</div>
          <div class="step-label">Завершение</div>
        </div>
      </div>
    </div>

    <!-- Форма регистрации -->
    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Шаг 1: Основная информация -->
      <div v-show="currentStep === 1" class="step-content">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="lastName" class="form-label required">
              <i class="fas fa-user me-2"></i>
              Фамилия
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              class="form-control"
              :class="{
                'is-invalid': errors.lastName,
                'is-valid': !errors.lastName && form.lastName && touched.lastName
              }"
              placeholder="Иванов"
              required
              @blur="touched.lastName = true"
              @input="clearError('lastName')"
            />
            <div v-if="errors.lastName" class="invalid-feedback">
              {{ errors.lastName }}
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label for="firstName" class="form-label required">
              <i class="fas fa-user me-2"></i>
              Имя
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              class="form-control"
              :class="{
                'is-invalid': errors.firstName,
                'is-valid': !errors.firstName && form.firstName && touched.firstName
              }"
              placeholder="Иван"
              required
              @blur="touched.firstName = true"
              @input="clearError('firstName')"
            />
            <div v-if="errors.firstName" class="invalid-feedback">
              {{ errors.firstName }}
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label for="middleName" class="form-label">
            <i class="fas fa-user me-2"></i>
            Отчество
          </label>
          <input
            id="middleName"
            v-model="form.middleName"
            type="text"
            class="form-control"
            placeholder="Иванович (необязательно)"
            @input="clearError('middleName')"
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label required">
            <i class="fas fa-envelope me-2"></i>
            Email адрес
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{
              'is-invalid': errors.email,
              'is-valid': !errors.email && form.email && touched.email
            }"
            placeholder="ivan@company.com"
            required
            autocomplete="email"
            @blur="touched.email = true"
            @input="clearError('email')"
          />
          <div v-if="errors.email" class="invalid-feedback">
            {{ errors.email }}
          </div>
          <div class="form-text">
            Используйте корпоративный email адрес
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="password" class="form-label required">
              <i class="fas fa-lock me-2"></i>
              Пароль
            </label>
            <div class="password-input-container">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{
                  'is-invalid': errors.password,
                  'is-valid': !errors.password && form.password && touched.password
                }"
                placeholder="Создайте пароль"
                required
                autocomplete="new-password"
                @blur="touched.password = true"
                @input="clearError('password')"
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
                :title="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
            <!-- Индикатор силы пароля -->
            <div v-if="form.password" class="password-strength mt-2">
              <div class="strength-bar">
                <div 
                  class="strength-fill"
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <small class="strength-text" :class="passwordStrength.class">
                {{ passwordStrength.text }}
              </small>
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label for="confirmPassword" class="form-label required">
              <i class="fas fa-lock me-2"></i>
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              :class="{
                'is-invalid': errors.confirmPassword,
                'is-valid': !errors.confirmPassword && form.confirmPassword && touched.confirmPassword
              }"
              placeholder="Повторите пароль"
              required
              autocomplete="new-password"
              @blur="touched.confirmPassword = true"
              @input="clearError('confirmPassword')"
            />
            <div v-if="errors.confirmPassword" class="invalid-feedback">
              {{ errors.confirmPassword }}
            </div>
          </div>
        </div>
      </div>

      <!-- Шаг 2: Рабочая информация -->
      <div v-show="currentStep === 2" class="step-content">
        <div class="mb-3">
          <label for="employeeId" class="form-label">
            <i class="fas fa-id-badge me-2"></i>
            Табельный номер
          </label>
          <input
            id="employeeId"
            v-model="form.employeeId"
            type="text"
            class="form-control"
            :class="{
              'is-invalid': errors.employeeId,
              'is-valid': !errors.employeeId && form.employeeId && touched.employeeId
            }"
            placeholder="12345 (необязательно)"
            @blur="touched.employeeId = true"
            @input="clearError('employeeId')"
          />
          <div v-if="errors.employeeId" class="invalid-feedback">
            {{ errors.employeeId }}
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="department" class="form-label">
              <i class="fas fa-building me-2"></i>
              Отдел
            </label>
            <select
              id="department"
              v-model="form.department"
              class="form-select"
              @change="clearError('department')"
            >
              <option value="">Выберите отдел</option>
              <option v-for="dept in departments" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
            <div v-if="errors.department" class="invalid-feedback">
              {{ errors.department }}
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label for="position" class="form-label">
              <i class="fas fa-briefcase me-2"></i>
              Должность
            </label>
            <input
              id="position"
              v-model="form.position"
              type="text"
              class="form-control"
              placeholder="Ваша должность"
              @input="clearError('position')"
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="phone" class="form-label">
            <i class="fas fa-phone me-2"></i>
            Телефон
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="form-control"
            :class="{
              'is-invalid': errors.phone,
              'is-valid': !errors.phone && form.phone && touched.phone
            }"
            placeholder="+7 (999) 123-45-67"
            @blur="touched.phone = true"
            @input="clearError('phone')"
          />
          <div v-if="errors.phone" class="invalid-feedback">
            {{ errors.phone }}
          </div>
        </div>
      </div>

      <!-- Шаг 3: Завершение -->
      <div v-show="currentStep === 3" class="step-content">
        <div class="registration-summary">
          <h5 class="mb-3">
            <i class="fas fa-check-circle text-success me-2"></i>
            Проверьте введенные данные
          </h5>
          
          <div class="summary-card">
            <div class="summary-section">
              <h6>Личная информация</h6>
              <p>
                <strong>ФИО:</strong> 
                {{ form.lastName }} {{ form.firstName }} {{ form.middleName }}
              </p>
              <p><strong>Email:</strong> {{ form.email }}</p>
              <p v-if="form.phone"><strong>Телефон:</strong> {{ form.phone }}</p>
            </div>
            
            <div v-if="form.department || form.position || form.employeeId" class="summary-section">
              <h6>Рабочая информация</h6>
              <p v-if="form.employeeId"><strong>Табельный номер:</strong> {{ form.employeeId }}</p>
              <p v-if="form.department"><strong>Отдел:</strong> {{ form.department }}</p>
              <p v-if="form.position"><strong>Должность:</strong> {{ form.position }}</p>
            </div>
          </div>

          <!-- Согласия -->
          <div class="agreements mt-4">
            <div class="form-check mb-3">
              <input
                id="agreeTerms"
                v-model="form.agreeTerms"
                class="form-check-input"
                type="checkbox"
                :class="{ 'is-invalid': errors.agreeTerms }"
                required
              />
              <label class="form-check-label" for="agreeTerms">
                Я соглашаюсь с 
                <a href="#" @click.prevent="showTerms">условиями использования</a>
                и 
                <a href="#" @click.prevent="showPrivacy">политикой конфиденциальности</a>
              </label>
              <div v-if="errors.agreeTerms" class="invalid-feedback">
                {{ errors.agreeTerms }}
              </div>
            </div>

            <div class="form-check mb-3">
              <input
                id="agreeNotifications"
                v-model="form.agreeNotifications"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label" for="agreeNotifications">
                Я согласен получать уведомления о мероприятиях и новостях
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Сообщения об ошибках -->
      <div v-if="errors.general" class="alert alert-danger mt-3" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ errors.general }}
      </div>

      <!-- Кнопки навигации -->
      <div class="step-navigation mt-4">
        <div class="d-flex justify-content-between">
          <button
            v-if="currentStep > 1"
            type="button"
            class="btn btn-outline-secondary"
            @click="previousStep"
            :disabled="isLoading"
          >
            <i class="fas fa-arrow-left me-2"></i>
            Назад
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < 3"
            type="button"
            class="btn btn-primary"
            @click="nextStep"
            :disabled="!canProceedToNextStep"
          >
            Далее
            <i class="fas fa-arrow-right ms-2"></i>
          </button>

          <button
            v-if="currentStep === 3"
            type="submit"
            class="btn btn-success"
            :disabled="isLoading || !canSubmit"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-user-plus me-2"></i>
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    const appStore = useAppStore()

    // Состояние формы
    const currentStep = ref(1)
    const isLoading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    // Данные формы
    const form = ref({
      // Основная информация
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      password: '',
      confirmPassword: '',
      
      // Рабочая информация
      employeeId: '',
      department: '',
      position: '',
      phone: '',
      
      // Согласия
      agreeTerms: false,
      agreeNotifications: false
    })

    const errors = ref({})
    const touched = ref({})

    // Справочники
    const departments = ref([
      'Администрация',
      'Бухгалтерия',
      'HR / Кадры',
      'IT / Информационные технологии',
      'Маркетинг',
      'Продажи',
      'Производство',
      'Снабжение',
      'Юридический отдел',
      'Другое'
    ])

    // Вычисляемые свойства
    const passwordStrength = computed(() => {
      const password = form.value.password
      if (!password) return { width: '0%', class: '', text: '' }

      let score = 0
      if (password.length >= 8) score++
      if (/[a-z]/.test(password)) score++
      if (/[A-Z]/.test(password)) score++
      if (/[0-9]/.test(password)) score++
      if (/[^A-Za-z0-9]/.test(password)) score++

      const levels = [
        { width: '20%', class: 'text-danger', text: 'Очень слабый' },
        { width: '40%', class: 'text-warning', text: 'Слабый' },
        { width: '60%', class: 'text-info', text: 'Средний' },
        { width: '80%', class: 'text-primary', text: 'Хороший' },
        { width: '100%', class: 'text-success', text: 'Отличный' }
      ]

      return levels[Math.min(score, 4)]
    })

    const canProceedToNextStep = computed(() => {
      if (currentStep.value === 1) {
        return form.value.firstName && 
               form.value.lastName && 
               form.value.email && 
               form.value.password && 
               form.value.confirmPassword &&
               !errors.value.firstName &&
               !errors.value.lastName &&
               !errors.value.email &&
               !errors.value.password &&
               !errors.value.confirmPassword
      }
      if (currentStep.value === 2) {
        return !errors.value.phone && !errors.value.employeeId
      }
      return false
    })

    const canSubmit = computed(() => {
      return form.value.agreeTerms && !errors.value.agreeTerms
    })

    // Методы валидации
    const validateStep1 = () => {
      const newErrors = {}

      if (!form.value.firstName.trim()) {
        newErrors.firstName = 'Имя обязательно'
      }

      if (!form.value.lastName.trim()) {
        newErrors.lastName = 'Фамилия обязательна'
      }

      if (!form.value.email.trim()) {
        newErrors.email = 'Email обязателен'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        newErrors.email = 'Некорректный формат email'
      }

      if (!form.value.password) {
        newErrors.password = 'Пароль обязателен'
      } else if (form.value.password.length < 6) {
        newErrors.password = 'Пароль должен содержать минимум 6 символов'
      }

      if (!form.value.confirmPassword) {
        newErrors.confirmPassword = 'Подтверждение пароля обязательно'
      } else if (form.value.password !== form.value.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      }

      Object.assign(errors.value, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const validateStep2 = () => {
      const newErrors = {}

      if (form.value.phone && !/^[+]?[0-9\s\-\(\)]+$/.test(form.value.phone)) {
        newErrors.phone = 'Некорректный формат телефона'
      }

      Object.assign(errors.value, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const validateStep3 = () => {
      const newErrors = {}

      if (!form.value.agreeTerms) {
        newErrors.agreeTerms = 'Необходимо согласиться с условиями использования'
      }

      Object.assign(errors.value, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const clearError = (field) => {
      delete errors.value[field]
      delete errors.value.general
    }

    // Методы навигации по шагам
    const nextStep = () => {
      let isValid = false

      if (currentStep.value === 1) {
        isValid = validateStep1()
      } else if (currentStep.value === 2) {
        isValid = validateStep2()
      }

      if (isValid && currentStep.value < 3) {
        currentStep.value++
      }
    }

    const previousStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }

    // Методы действий
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const handleSubmit = async () => {
      if (!validateStep3()) return

      try {
        isLoading.value = true
        errors.value.general = ''

        const registrationData = {
          firstName: form.value.firstName.trim(),
          lastName: form.value.lastName.trim(),
          middleName: form.value.middleName.trim() || undefined,
          email: form.value.email.trim(),
          password: form.value.password,
          phone: form.value.phone.trim() || undefined,
          department: form.value.department || undefined,
          position: form.value.position.trim() || undefined,
          employeeId: form.value.employeeId.trim() || undefined
        }

        const result = await authStore.register(registrationData)

        if (result.success) {
          toast.success(`Добро пожаловать, ${result.user.firstName}! Регистрация прошла успешно.`)
          router.push('/dashboard')
        } else {
          errors.value.general = result.error
        }
      } catch (error) {
        console.error('Ошибка регистрации:', error)
        errors.value.general = 'Произошла неожиданная ошибка. Попробуйте позже.'
      } finally {
        isLoading.value = false
      }
    }

    const showTerms = () => {
      toast.info('Условия использования будут доступны в следующей версии')
    }

    const showPrivacy = () => {
      toast.info('Политика конфиденциальности будет доступна в следующей версии')
    }

    // Инициализация
    onMounted(() => {
      appStore.setPageTitle('Регистрация в системе')
    })

    return {
      currentStep,
      isLoading,
      showPassword,
      showConfirmPassword,
      form,
      errors,
      touched,
      departments,
      passwordStrength,
      canProceedToNextStep,
      canSubmit,
      
      clearError,
      nextStep,
      previousStep,
      togglePasswordVisibility,
      handleSubmit,
      showTerms,
      showPrivacy
    }
  }
}
</script>

<style scoped>
.register-page {
  max-width: 100%;
}

.auth-form-header {
  margin-bottom: 2rem;
}

.auth-title {
  color: #333;
  font-weight: 700;
  font-size: 1.75rem;
}

.auth-subtitle {
  font-size: 1rem;
  margin-bottom: 0;
}

/* Прогресс регистрации */
.registration-progress {
  margin-bottom: 2rem;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 40px;
  right: 40px;
  height: 2px;
  background-color: #e9ecef;
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.875rem;
  text-align: center;
  color: #6c757d;
  font-weight: 500;
}

.progress-step.active .step-number {
  background-color: var(--bs-primary);
  color: white;
}

.progress-step.active .step-label {
  color: var(--bs-primary);
  font-weight: 600;
}

.progress-step.completed .step-number {
  background-color: #198754;
  color: white;
}

.progress-step.completed .step-label {
  color: #198754;
}

/* Форма */
.step-content {
  animation: fadeInSlide 0.3s ease-out;
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-label.required::after {
  content: " *";
  color: #dc3545;
}

.form-control,
.form-select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  z-index: 5;
}

.password-toggle:hover {
  color: var(--bs-primary);
}

/* Индикатор силы пароля */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-fill.text-danger {
  background-color: #dc3545;
}

.strength-fill.text-warning {
  background-color: #ffc107;
}

.strength-fill.text-info {
  background-color: #0dcaf0;
}

.strength-fill.text-primary {
  background-color: var(--bs-primary);
}

.strength-fill.text-success {
  background-color: #198754;
}

.strength-text {
  font-size: 0.8rem;
  font-weight: 500;
}

/* Сводка регистрации */
.registration-summary {
  background-color: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.summary-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.summary-section {
  margin-bottom: 1rem;
}

.summary-section:last-child {
  margin-bottom: 0;
}

.summary-section h6 {
  color: var(--bs-primary);
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.summary-section p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.summary-section p:last-child {
  margin-bottom: 0;
}

/* Согласия */
.agreements {
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.form-check-label a {
  color: var(--bs-primary);
  text-decoration: none;
}

.form-check-label a:hover {
  text-decoration: underline;
}

/* Навигация по шагам */
.step-navigation {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  border: none;
}

.btn-success {
  background: linear-gradient(135deg, #198754 0%, #20c997 100%);
  border: none;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 767.98px) {
  .auth-title {
    font-size: 1.5rem;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 1rem;
  }
  
  .progress-steps::before {
    display: none;
  }
  
  .step-label {
    font-size: 0.8rem;
  }
  
  .registration-summary,
  .summary-card,
  .agreements {
    padding: 1rem;
  }
}

@media (max-width: 575.98px) {
  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
  
  .col-md-6 {
    margin-bottom: 1rem;
  }
}

/* Темная тема */
[data-theme="dark"] .auth-title {
  color: #ffffff;
}

[data-theme="dark"] .auth-subtitle {
  color: #adb5bd;
}

[data-theme="dark"] .form-label {
  color: #ffffff;
}

[data-theme="dark"] .form-control,
[data-theme="dark"] .form-select {
  background-color: #2d2d2d;
  border-color: #444444;
  color: #ffffff;
}

[data-theme="dark"] .form-control:focus,
[data-theme="dark"] .form-select:focus {
  background-color: #2d2d2d;
  border-color: var(--bs-primary);
}

[data-theme="dark"] .registration-summary {
  background-color: #1a1a1a;
}

[data-theme="dark"] .summary-card,
[data-theme="dark"] .agreements {
  background-color: #2d2d2d;
}

[data-theme="dark"] .step-navigation {
  border-color: #444444;
}

/* Анимации */
.register-page {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Улучшения доступности */
.form-control:focus,
.form-select:focus {
  outline: none;
}

.btn:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.password-toggle:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}
</style>