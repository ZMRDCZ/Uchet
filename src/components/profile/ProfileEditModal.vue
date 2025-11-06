<template>
  <div 
    class="modal fade" 
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1" 
    aria-labelledby="profileEditModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="profileEditModalLabel" class="modal-title">
            <i class="fas fa-edit me-2"></i>
            Редактировать профиль
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
            aria-label="Закрыть"
          ></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Навигационные табы -->
            <ul class="nav nav-tabs mb-4" role="tablist">
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link active" 
                  data-bs-toggle="tab" 
                  data-bs-target="#personal-info"
                  type="button" 
                  role="tab"
                >
                  <i class="fas fa-user me-2"></i>
                  Личные данные
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" 
                  data-bs-toggle="tab" 
                  data-bs-target="#work-info"
                  type="button" 
                  role="tab"
                >
                  <i class="fas fa-briefcase me-2"></i>
                  Рабочая информация
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" 
                  data-bs-toggle="tab" 
                  data-bs-target="#contacts"
                  type="button" 
                  role="tab"
                >
                  <i class="fas fa-address-book me-2"></i>
                  Контакты
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" 
                  data-bs-toggle="tab" 
                  data-bs-target="#preferences"
                  type="button" 
                  role="tab"
                >
                  <i class="fas fa-cog me-2"></i>
                  Настройки
                </button>
              </li>
            </ul>

            <!-- Содержимое табов -->
            <div class="tab-content">
              <!-- Личные данные -->
              <div class="tab-pane fade show active" id="personal-info" role="tabpanel">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label required">Имя</label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid': errors.firstName,
                        'is-valid': !errors.firstName && form.firstName && touched.firstName
                      }"
                      required
                      @blur="touched.firstName = true"
                      @input="clearError('firstName')"
                    />
                    <div v-if="errors.firstName" class="invalid-feedback">
                      {{ errors.firstName }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="lastName" class="form-label required">Фамилия</label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid': errors.lastName,
                        'is-valid': !errors.lastName && form.lastName && touched.lastName
                      }"
                      required
                      @blur="touched.lastName = true"
                      @input="clearError('lastName')"
                    />
                    <div v-if="errors.lastName" class="invalid-feedback">
                      {{ errors.lastName }}
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="middleName" class="form-label">Отчество</label>
                    <input
                      id="middleName"
                      v-model="form.middleName"
                      type="text"
                      class="form-control"
                      @input="clearError('middleName')"
                    />
                  </div>

                  <div class="col-12">
                    <label for="email" class="form-label required">Email</label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      :class="{
                        'is-invalid': errors.email,
                        'is-valid': !errors.email && form.email && touched.email
                      }"
                      required
                      @blur="touched.email = true"
                      @input="clearError('email')"
                    />
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="birthDate" class="form-label">Дата рождения</label>
                    <input
                      id="birthDate"
                      v-model="form.birthDate"
                      type="date"
                      class="form-control"
                      @input="clearError('birthDate')"
                    />
                  </div>

                  <div class="col-md-6">
                    <label for="gender" class="form-label">Пол</label>
                    <select
                      id="gender"
                      v-model="form.gender"
                      class="form-select"
                      @change="clearError('gender')"
                    >
                      <option value="">Не указан</option>
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                    </select>
                  </div>

                  <div class="col-12">
                    <label for="bio" class="form-label">О себе</label>
                    <textarea
                      id="bio"
                      v-model="form.bio"
                      class="form-control"
                      rows="3"
                      placeholder="Расскажите немного о себе..."
                      @input="clearError('bio')"
                    ></textarea>
                    <div class="form-text">
                      Максимум 500 символов. Осталось: {{ 500 - (form.bio?.length || 0) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Рабочая информация -->
              <div class="tab-pane fade" id="work-info" role="tabpanel">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="employeeId" class="form-label">Табельный номер</label>
                    <input
                      id="employeeId"
                      v-model="form.employeeId"
                      type="text"
                      class="form-control"
                      @input="clearError('employeeId')"
                    />
                  </div>

                  <div class="col-md-6">
                    <label for="department" class="form-label">Отдел</label>
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
                  </div>

                  <div class="col-md-6">
                    <label for="position" class="form-label">Должность</label>
                    <input
                      id="position"
                      v-model="form.position"
                      type="text"
                      class="form-control"
                      @input="clearError('position')"
                    />
                  </div>

                  <div class="col-md-6">
                    <label for="manager" class="form-label">Руководитель</label>
                    <input
                      id="manager"
                      v-model="form.manager"
                      type="text"
                      class="form-control"
                      @input="clearError('manager')"
                    />
                  </div>

                  <div class="col-md-6">
                    <label for="hireDate" class="form-label">Дата приема на работу</label>
                    <input
                      id="hireDate"
                      v-model="form.hireDate"
                      type="date"
                      class="form-control"
                      @input="clearError('hireDate')"
                    />
                  </div>

                  <div class="col-md-6">
                    <label for="workLocation" class="form-label">Место работы</label>
                    <select
                      id="workLocation"
                      v-model="form.workLocation"
                      class="form-select"
                      @change="clearError('workLocation')"
                    >
                      <option value="">Выберите офис</option>
                      <option value="main">Главный офис</option>
                      <option value="branch1">Филиал 1</option>
                      <option value="branch2">Филиал 2</option>
                      <option value="remote">Удаленная работа</option>
                    </select>
                  </div>

                  <div class="col-12">
                    <label for="skills" class="form-label">Навыки и компетенции</label>
                    <div class="skills-input">
                      <input
                        v-model="newSkill"
                        type="text"
                        class="form-control"
                        placeholder="Добавить навык..."
                        @keyup.enter="addSkill"
                      />
                      <button 
                        type="button" 
                        class="btn btn-outline-primary"
                        @click="addSkill"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    <div class="skills-list mt-2">
                      <span 
                        v-for="(skill, index) in form.skills" 
                        :key="index"
                        class="skill-tag"
                      >
                        {{ skill }}
                        <button 
                          type="button" 
                          class="skill-remove"
                          @click="removeSkill(index)"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Контакты -->
              <div class="tab-pane fade" id="contacts" role="tabpanel">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="phone" class="form-label">Рабочий телефон</label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      class="form-control"
                      :class="{
                        'is-invalid': errors.phone,
                        'is-valid': !errors.phone && form.phone && touched.phone
                      }"
                      @blur="touched.phone = true"
                      @input="clearError('phone')"
                    />
                    <div v-if="errors.phone" class="invalid-feedback">
                      {{ errors.phone }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="personalPhone" class="form-label">Личный телефон</label>
                    <input
                      id="personalPhone"
                      v-model="form.personalPhone"
                      type="tel"
                      class="form-control"
                      @input="clearError('personalPhone')"
                    />
                  </div>

                  <div class="col-12">
                    <label for="address" class="form-label">Адрес</label>
                    <textarea
                      id="address"
                      v-model="form.address"
                      class="form-control"
                      rows="2"
                      placeholder="Город, улица, дом..."
                      @input="clearError('address')"
                    ></textarea>
                  </div>

                  <div class="col-md-6">
                    <label for="socialLinkedIn" class="form-label">LinkedIn</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fab fa-linkedin"></i>
                      </span>
                      <input
                        id="socialLinkedIn"
                        v-model="form.socialLinkedIn"
                        type="url"
                        class="form-control"
                        placeholder="https://linkedin.com/in/username"
                        @input="clearError('socialLinkedIn')"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="socialTelegram" class="form-label">Telegram</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fab fa-telegram"></i>
                      </span>
                      <input
                        id="socialTelegram"
                        v-model="form.socialTelegram"
                        type="text"
                        class="form-control"
                        placeholder="@username"
                        @input="clearError('socialTelegram')"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Настройки -->
              <div class="tab-pane fade" id="preferences" role="tabpanel">
                <div class="row g-3">
                  <div class="col-12">
                    <h6 class="settings-section-title">
                      <i class="fas fa-bell me-2"></i>
                      Уведомления
                    </h6>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input
                        id="notifyEmail"
                        v-model="form.preferences.emailNotifications"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="notifyEmail">
                        Email уведомления
                      </label>
                      <small class="form-text text-muted d-block">
                        Получать уведомления о новых мероприятиях и изменениях на email
                      </small>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input
                        id="notifyEvents"
                        v-model="form.preferences.eventReminders"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="notifyEvents">
                        Напоминания о мероприятиях
                      </label>
                      <small class="form-text text-muted d-block">
                        Получать напоминания за день до мероприятия
                      </small>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input
                        id="notifyAchievements"
                        v-model="form.preferences.achievementNotifications"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="notifyAchievements">
                        Уведомления о достижениях
                      </label>
                      <small class="form-text text-muted d-block">
                        Получать уведомления о новых достижениях и прогрессе
                      </small>
                    </div>
                  </div>

                  <div class="col-12">
                    <h6 class="settings-section-title">
                      <i class="fas fa-eye me-2"></i>
                      Приватность
                    </h6>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input
                        id="profilePublic"
                        v-model="form.preferences.publicProfile"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="profilePublic">
                        Публичный профиль
                      </label>
                      <small class="form-text text-muted d-block">
                        Разрешить другим пользователям видеть ваш профиль
                      </small>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input
                        id="showInRating"
                        v-model="form.preferences.showInLeaderboard"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="showInRating">
                        Участие в рейтинге
                      </label>
                      <small class="form-text text-muted d-block">
                        Отображать ваши результаты в общем рейтинге
                      </small>
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="timezone" class="form-label">Часовой пояс</label>
                    <select
                      id="timezone"
                      v-model="form.preferences.timezone"
                      class="form-select"
                    >
                      <option value="Europe/Moscow">Москва (UTC+3)</option>
                      <option value="Europe/Kaliningrad">Калининград (UTC+2)</option>
                      <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                      <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
                      <option value="Asia/Vladivostok">Владивосток (UTC+10)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Отмена
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isSubmitting || !isFormValid"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-save me-2"></i>
              {{ isSubmitting ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- Backdrop -->
  <div 
    v-if="modelValue" 
    class="modal-backdrop fade show"
    @click="closeModal"
  ></div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'ProfileEditModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'updated'],
  setup(props, { emit }) {
    const toast = useToast()

    // Состояние
    const isSubmitting = ref(false)
    const newSkill = ref('')
    
    const form = ref({
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      birthDate: '',
      gender: '',
      bio: '',
      employeeId: '',
      department: '',
      position: '',
      manager: '',
      hireDate: '',
      workLocation: '',
      skills: [],
      phone: '',
      personalPhone: '',
      address: '',
      socialLinkedIn: '',
      socialTelegram: '',
      preferences: {
        emailNotifications: true,
        eventReminders: true,
        achievementNotifications: true,
        publicProfile: true,
        showInLeaderboard: true,
        timezone: 'Europe/Moscow'
      }
    })

    const errors = ref({})
    const touched = ref({})

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
    const isFormValid = computed(() => {
      return form.value.firstName && 
             form.value.lastName && 
             form.value.email && 
             !errors.value.firstName && 
             !errors.value.lastName && 
             !errors.value.email
    })

    // Методы валидации
    const validateField = (field, value) => {
      switch (field) {
        case 'firstName':
        case 'lastName':
          return !value?.trim() ? 'Поле обязательно для заполнения' : ''
        case 'email':
          if (!value?.trim()) return 'Email обязателен'
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return !emailRegex.test(value) ? 'Некорректный формат email' : ''
        case 'phone':
        case 'personalPhone':
          if (value && !/^[+]?[0-9\s\-\(\)]+$/.test(value)) {
            return 'Некорректный формат телефона'
          }
          return ''
        case 'bio':
          if (value && value.length > 500) {
            return 'Максимум 500 символов'
          }
          return ''
        default:
          return ''
      }
    }

    const validateForm = () => {
      const newErrors = {}
      
      Object.keys(form.value).forEach(field => {
        if (typeof form.value[field] === 'string') {
          const error = validateField(field, form.value[field])
          if (error) newErrors[field] = error
        }
      })

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const clearError = (field) => {
      if (errors.value[field]) {
        delete errors.value[field]
      }
    }

    // Методы работы с навыками
    const addSkill = () => {
      const skill = newSkill.value.trim()
      if (skill && !form.value.skills.includes(skill)) {
        form.value.skills.push(skill)
        newSkill.value = ''
      }
    }

    const removeSkill = (index) => {
      form.value.skills.splice(index, 1)
    }

    // Методы модального окна
    const closeModal = () => {
      emit('update:modelValue', false)
    }

    const loadUserData = () => {
      if (props.user) {
        // Загружаем данные пользователя в форму
        Object.keys(form.value).forEach(key => {
          if (key === 'preferences') {
            form.value.preferences = {
              ...form.value.preferences,
              ...(props.user.preferences || {})
            }
          } else if (key === 'skills') {
            form.value.skills = props.user.skills ? [...props.user.skills] : []
          } else if (props.user[key] !== undefined) {
            form.value[key] = props.user[key]
          }
        })
      }
    }

    const handleSubmit = async () => {
      if (!validateForm()) {
        toast.error('Пожалуйста, исправьте ошибки в форме')
        return
      }

      try {
        isSubmitting.value = true

        // Здесь будет API вызов для обновления профиля
        // await api.put('/users/me', form.value)
        
        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1000))

        emit('updated', form.value)
        closeModal()
        toast.success('Профиль успешно обновлен!')
      } catch (error) {
        console.error('Ошибка обновления профиля:', error)
        toast.error('Ошибка при сохранении профиля')
      } finally {
        isSubmitting.value = false
      }
    }

    // Watchers
    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        loadUserData()
        // Сброс ошибок и touched состояний
        errors.value = {}
        touched.value = {}
      }
    })

    // Инициализация
    onMounted(() => {
      if (props.modelValue) {
        loadUserData()
      }
    })

    return {
      isSubmitting,
      newSkill,
      form,
      errors,
      touched,
      departments,
      isFormValid,
      
      clearError,
      addSkill,
      removeSkill,
      closeModal,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.modal-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem 1rem 0 0;
}

.modal-title {
  font-weight: 600;
}

.btn-close {
  filter: invert(1);
}

.nav-tabs {
  border-bottom: 2px solid #e9ecef;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem 0.5rem 0 0;
  transition: all 0.2s ease;
}

.nav-tabs .nav-link:hover {
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
}

.nav-tabs .nav-link.active {
  background: var(--bs-primary);
  color: white;
  border-color: var(--bs-primary);
}

.form-label.required::after {
  content: " *";
  color: #dc3545;
}

.form-control,
.form-select {
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.form-control.is-valid {
  border-color: #198754;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.settings-section-title {
  color: var(--bs-primary);
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.form-check-input {
  width: 2.5rem;
  height: 1.25rem;
  border-radius: 1rem;
}

.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.skills-input {
  display: flex;
  gap: 0.5rem;
}

.skills-input .form-control {
  flex: 1;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  background: var(--bs-primary);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  gap: 0.5rem;
}

.skill-remove {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.skill-remove:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.input-group-text {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-right: none;
  color: var(--bs-primary);
}

.input-group .form-control {
  border-left: none;
}

.input-group .form-control:focus {
  border-left: none;
  box-shadow: none;
}

.input-group:focus-within .input-group-text {
  border-color: var(--bs-primary);
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1.5rem;
}

.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.3);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 767.98px) {
  .modal-dialog {
    margin: 0.5rem;
  }
  
  .nav-tabs {
    flex-direction: column;
  }
  
  .nav-tabs .nav-link {
    text-align: center;
    border-radius: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .skills-input {
    flex-direction: column;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}

/* Темная тема */
[data-theme="dark"] .modal-content {
  background-color: #2d2d2d;
}

[data-theme="dark"] .nav-tabs {
  border-color: #444444;
}

[data-theme="dark"] .nav-tabs .nav-link {
  color: #adb5bd;
}

[data-theme="dark"] .nav-tabs .nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

[data-theme="dark"] .form-control,
[data-theme="dark"] .form-select {
  background-color: #1a1a1a;
  border-color: #444444;
  color: #ffffff;
}

[data-theme="dark"] .form-control:focus,
[data-theme="dark"] .form-select:focus {
  background-color: #1a1a1a;
  border-color: var(--bs-primary);
}

[data-theme="dark"] .input-group-text {
  background-color: #404040;
  border-color: #444444;
  color: #ffffff;
}

[data-theme="dark"] .settings-section-title {
  color: #ffffff;
  border-color: #444444;
}

[data-theme="dark"] .modal-footer {
  border-color: #444444;
}

/* Анимации */
.modal.fade .modal-dialog {
  transition: transform 0.3s ease-out;
  transform: translate(0, -50px);
}

.modal.show .modal-dialog {
  transform: none;
}

.tab-pane {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skill-tag {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

.nav-link:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Состояния валидации */
.is-valid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='m2.3 6.73.94-.94 2.94-2.94-1.06-1.06L2.3 4.61l-.94-.94L.3 4.73z'/%3e%3c/svg%3e");
}

.is-invalid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 4.6 2.4 2.4M8.2 4.6l-2.4 2.4'/%3e%3c/svg%3e");
}

/* Индикаторы заполнения */
.form-control:not(:placeholder-shown):valid {
  border-color: #198754;
}

.form-control:not(:placeholder-shown):invalid {
  border-color: #dc3545;
}
</style>