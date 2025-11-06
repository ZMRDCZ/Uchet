// Импортируем мок-API для демонстрации
import { mockApi } from './mockApi'

// Для демонстрации используем мок-API вместо реального
const useMockApi = true

// Создаем экземпляр axios с базовой конфигурацией (для реального API)
const api = useMockApi ? null : axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Добавляем интерцепторы только если api не null (реальный API)
if (api) {
  // Request interceptor для добавления токена
  api.interceptors.request.use(
    (config) => {
      // Добавляем токен из localStorage если он есть
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      // Логируем запросы в режиме разработки
      if (import.meta.env.DEV) {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params)
      }
      
      return config
    },
    (error) => {
      console.error('Ошибка перед отправкой запроса:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor для обработки ответов
  api.interceptors.response.use(
    (response) => {
      // Логируем успешные ответы в режиме разработки
      if (import.meta.env.DEV) {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
      }
      
      return response
    },
    (error) => {
      // Логируем ошибки
      if (import.meta.env.DEV) {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message)
      }
      
      // Обработка специфических ошибок
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case 401:
            // Неавторизованный доступ - токен истек или невалиден
            if (!error.config._retry) {
              console.log('Токен истек, будет попытка обновления...')
            }
            break
            
          case 403:
            // Недостаточно прав
            console.warn('Недостаточно прав для выполнения операции')
            break
            
          case 404:
            // Ресурс не найден
            console.warn('Запрашиваемый ресурс не найден')
            break
            
          case 422:
            // Ошибки валидации
            console.warn('Ошибки валидации данных:', data.details)
            break
            
          case 429:
            // Превышен лимит запросов
            console.warn('Превышен лимит запросов, повторите попытку позже')
            break
            
          case 500:
            // Ошибка сервера
            console.error('Внутренняя ошибка сервера')
            break
            
          default:
            console.error(`HTTP ${status}:`, data?.error || error.message)
        }
      } else if (error.request) {
        // Запрос был отправлен, но ответ не получен
        console.error('Сеть недоступна или сервер не отвечает')
      } else {
        // Ошибка при настройке запроса
        console.error('Ошибка настройки запроса:', error.message)
      }
      
      return Promise.reject(error)
    }
  )
}

// Утилиты для работы с API
export const apiUtils = {
  // Создание FormData для загрузки файлов
  createFormData(data) {
    const formData = new FormData()
    
    Object.keys(data).forEach(key => {
      const value = data[key]
      
      if (value !== null && value !== undefined) {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value)
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File || item instanceof Blob) {
              formData.append(`${key}[${index}]`, item)
            } else {
              formData.append(`${key}[${index}]`, JSON.stringify(item))
            }
          })
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value)
        }
      }
    })
    
    return formData
  },
  
  // Построение URL с параметрами
  buildUrl(baseUrl, params = {}) {
    const url = new URL(baseUrl, window.location.origin)
    
    Object.keys(params).forEach(key => {
      const value = params[key]
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => url.searchParams.append(key, item))
        } else {
          url.searchParams.append(key, value)
        }
      }
    })
    
    return url.pathname + url.search
  },
  
  // Обработка ошибок API
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response
      
      // Возвращаем понятное сообщение об ошибке
      return {
        status,
        message: data?.error || `Ошибка ${status}`,
        details: data?.details || null,
        code: data?.code || null
      }
    } else if (error.request) {
      return {
        status: 0,
        message: 'Сервер недоступен. Проверьте подключение к интернету.',
        details: null,
        code: 'NETWORK_ERROR'
      }
    } else {
      return {
        status: 0,
        message: 'Произошла неизвестная ошибка',
        details: error.message,
        code: 'UNKNOWN_ERROR'
      }
    }
  },
  
  // Отмена запросов
  createCancelToken() {
    return axios.CancelToken.source()
  },
  
  // Проверка отмены запроса
  isCancel(error) {
    return axios.isCancel(error)
  }
}

// Методы для работы с разными типами контента
export const apiMethods = {
  // Обычные JSON запросы
  get: (url, params = {}) => api.get(apiUtils.buildUrl(url, params)),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url) => api.delete(url),
  
  // Загрузка файлов
  uploadFile: (url, file, onProgress = null) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    
    if (onProgress) {
      config.onUploadProgress = onProgress
    }
    
    return api.post(url, formData, config)
  },
  
  // Загрузка нескольких файлов
  uploadFiles: (url, files, onProgress = null) => {
    const formData = new FormData()
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    
    if (onProgress) {
      config.onUploadProgress = onProgress
    }
    
    return api.post(url, formData, config)
  },
  
  // Скачивание файлов
  downloadFile: async (url, filename = null) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob'
      })
      
      // Создаем ссылку для скачивания
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Определяем имя файла
      const contentDisposition = response.headers['content-disposition']
      if (contentDisposition && !filename) {
        const matches = /filename="([^"]*)"/.exec(contentDisposition)
        filename = matches ? matches[1] : 'download'
      }
      
      link.setAttribute('download', filename || 'download')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
      
      return response
    } catch (error) {
      console.error('Ошибка скачивания файла:', error)
      throw error
    }
  },
  
  // Отправка данных формы
  submitForm: (url, formData) => {
    const data = apiUtils.createFormData(formData)
    
    return api.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// Хелперы для работы с конкретными API endpoints
export const endpoints = {
  // Аутентификация
  auth: {
    login: (credentials) => useMockApi ? mockApi.auth.login(credentials) : api.post('/auth/login', credentials),
    register: (userData) => useMockApi ? mockApi.auth.register(userData) : api.post('/auth/register', userData),
    logout: () => useMockApi ? mockApi.auth.logout() : api.post('/auth/logout'),
    refresh: (refreshToken) => useMockApi ? Promise.resolve({ data: { accessToken: 'new-token' } }) : api.post('/auth/refresh', { refreshToken }),
    me: () => useMockApi ? mockApi.auth.me() : api.get('/auth/me'),
    changePassword: (data) => useMockApi ? Promise.resolve({ success: true }) : api.put('/auth/change-password', data)
  },
  
  // Пользователи
  users: {
    list: (params) => useMockApi ? mockApi.users.list(params) : api.get('/users', { params }),
    get: (id) => useMockApi ? mockApi.users.get(id) : api.get(`/users/${id}`),
    update: (id, data) => useMockApi ? mockApi.users.update(id, data) : api.put(`/users/${id}`, data),
    delete: (id) => useMockApi ? Promise.resolve({ success: true }) : api.delete(`/users/${id}`),
    pointsHistory: (id, params) => useMockApi ? Promise.resolve({ data: [] }) : api.get(`/users/${id}/points-history`, { params }),
    awardPoints: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.post(`/users/${id}/award-points`, data),
    leaderboard: (params) => useMockApi ? mockApi.users.leaderboard(params) : api.get('/users/leaderboard', { params }),
    stats: () => useMockApi ? Promise.resolve({ data: {} }) : api.get('/users/stats')
  },
  
  // Мероприятия
  events: {
    list: (params) => useMockApi ? mockApi.events.list(params) : api.get('/events', { params }),
    get: (id) => useMockApi ? mockApi.events.get(id) : api.get(`/events/${id}`),
    create: (data) => useMockApi ? mockApi.events.create(data) : api.post('/events', data),
    update: (id, data) => useMockApi ? mockApi.events.update(id, data) : api.put(`/events/${id}`, data),
    delete: (id) => useMockApi ? mockApi.events.delete(id) : api.delete(`/events/${id}`),
    participants: (id, params) => useMockApi ? Promise.resolve({ data: [] }) : api.get(`/events/${id}/participants`, { params }),
    stats: (params) => useMockApi ? Promise.resolve({ data: {} }) : api.get('/events/stats', { params })
  },
  
  // Регистрации
  registrations: {
    create: (eventId) => useMockApi ? mockApi.registrations.create(eventId) : api.post(`/registrations/events/${eventId}`),
    my: (params) => useMockApi ? mockApi.registrations.my(params) : api.get('/registrations/my', { params }),
    get: (id) => useMockApi ? Promise.resolve({ data: {} }) : api.get(`/registrations/${id}`),
    approve: (id) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/registrations/${id}/approve`),
    reject: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/registrations/${id}/reject`, data),
    attendance: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/registrations/${id}/attendance`, data),
    cancel: (id) => useMockApi ? mockApi.registrations.cancel(id) : api.delete(`/registrations/${id}`),
    feedback: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/registrations/${id}/feedback`, data),
    pending: (params) => useMockApi ? Promise.resolve({ data: [] }) : api.get('/registrations/pending', { params })
  },
  
  // Награды
  rewards: {
    list: (params) => useMockApi ? mockApi.rewards.list(params) : api.get('/rewards', { params }),
    get: (id) => useMockApi ? mockApi.rewards.get(id) : api.get(`/rewards/${id}`),
    create: (data) => useMockApi ? Promise.resolve({ data: {} }) : api.post('/rewards', data),
    update: (id, data) => useMockApi ? Promise.resolve({ data: {} }) : api.put(`/rewards/${id}`, data),
    delete: (id) => useMockApi ? Promise.resolve({ success: true }) : api.delete(`/rewards/${id}`),
    purchase: (id) => useMockApi ? mockApi.rewards.purchase(id) : api.post(`/rewards/${id}/purchase`),
    stats: (params) => useMockApi ? Promise.resolve({ data: {} }) : api.get('/rewards/stats', { params })
  },
  
  // Покупки
  purchases: {
    my: (params) => useMockApi ? mockApi.purchases.my(params) : api.get('/purchases/my', { params }),
    list: (params) => useMockApi ? Promise.resolve({ data: [] }) : api.get('/purchases', { params }),
    get: (id) => useMockApi ? Promise.resolve({ data: {} }) : api.get(`/purchases/${id}`),
    process: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/purchases/${id}/process`, data),
    complete: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/purchases/${id}/complete`, data),
    deliver: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/purchases/${id}/deliver`, data),
    cancel: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/purchases/${id}/cancel`, data),
    refund: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/purchases/${id}/refund`, data),
    feedback: (id, data) => useMockApi ? Promise.resolve({ success: true }) : api.put(`/purchases/${id}/feedback`, data),
    pending: (params) => useMockApi ? Promise.resolve({ data: [] }) : api.get('/purchases/pending', { params }),
    stats: (params) => useMockApi ? Promise.resolve({ data: {} }) : api.get('/purchases/stats', { params })
  },
  
  // Статистика
  statistics: {
    dashboard: (params) => useMockApi ? mockApi.statistics.dashboard(params) : api.get('/statistics/dashboard', { params }),
    engagement: (params) => useMockApi ? Promise.resolve({ data: {} }) : api.get('/statistics/engagement', { params }),
    eventsAnalytics: (params) => useMockApi ? Promise.resolve({ data: {} }) : api.get('/statistics/events-analytics', { params }),
    pointsAnalytics: (params) => useMockApi ? Promise.resolve({ data: {} }) : api.get('/statistics/points-analytics', { params })
  }
}

export default api