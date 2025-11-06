import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Состояние
  const isLoading = ref(false)
  const isSidebarOpen = ref(false)
  const theme = ref(localStorage.getItem('theme') || 'light')
  const notifications = ref([])
  const breadcrumbs = ref([])
  const pageTitle = ref('')
  const pageSubtitle = ref('')
  
  // Глобальные настройки
  const settings = ref({
    itemsPerPage: 20,
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24h',
    language: 'ru',
    timezone: 'Europe/Moscow'
  })
  
  // Статистика уведомлений
  const unreadNotificationsCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })
  
  // Действия
  const setLoading = (value) => {
    isLoading.value = value
  }
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }
  
  const setSidebarOpen = (value) => {
    isSidebarOpen.value = value
  }
  
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  
  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }
  
  const setBreadcrumbs = (items) => {
    breadcrumbs.value = items
  }
  
  const addBreadcrumb = (item) => {
    breadcrumbs.value.push(item)
  }
  
  const setPageTitle = (title, subtitle = '') => {
    pageTitle.value = title
    pageSubtitle.value = subtitle
    
    // Обновляем title документа
    document.title = title ? `${title} - Учёт активности предприятия` : 'Учёт активности предприятия'
  }
  
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      isRead: false,
      ...notification
    }
    
    notifications.value.unshift(newNotification)
    
    // Ограничиваем количество уведомлений
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
  }
  
  const markNotificationAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }
  
  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(notification => {
      notification.isRead = true
    })
  }
  
  const removeNotification = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const clearNotifications = () => {
    notifications.value = []
  }
  
  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings }
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
  }
  
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        settings.value = { ...settings.value, ...parsed }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error)
      }
    }
  }
  
  // Утилиты для работы с форматированием
  const formatDate = (date, format = null) => {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    const formatToUse = format || settings.value.dateFormat
    
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    
    switch (formatToUse) {
      case 'dd.MM.yyyy':
        return `${day}.${month}.${year}`
      case 'dd.MM.yyyy HH:mm':
        return `${day}.${month}.${year} ${hours}:${minutes}`
      case 'DD MMM YYYY':
        const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
        return `${day} ${months[d.getMonth()]} ${year}`
      case 'relative':
        return formatRelativeDate(d)
      default:
        return `${day}.${month}.${year}`
    }
  }
  
  const formatRelativeDate = (date) => {
    const now = new Date()
    const diff = now - date
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (seconds < 60) return 'только что'
    if (minutes < 60) return `${minutes} мин назад`
    if (hours < 24) return `${hours} ч назад`
    if (days < 7) return `${days} дн назад`
    
    return formatDate(date, 'dd.MM.yyyy')
  }
  
  const formatNumber = (num) => {
    if (!num && num !== 0) return ''
    return new Intl.NumberFormat('ru-RU').format(num)
  }
  
  const pluralize = (count, forms) => {
    const cases = [2, 0, 1, 1, 1, 2]
    return forms[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]]
  }
  
  const truncate = (text, length = 100) => {
    if (!text) return ''
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
  }
  
  // Работа с localStorage
  const setLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error)
    }
  }
  
  const getLocalStorage = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Ошибка чтения из localStorage:', error)
      return defaultValue
    }
  }
  
  const removeLocalStorage = (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Ошибка удаления из localStorage:', error)
    }
  }
  
  // Инициализация
  const initialize = () => {
    // Загружаем настройки
    loadSettings()
    
    // Применяем тему
    document.documentElement.setAttribute('data-theme', theme.value)
    
    // Устанавливаем обработчики для изменения размера окна
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    // Начальная проверка размера
    handleResize()
  }
  
  // Состояние подключения к интернету
  const isOnline = ref(navigator.onLine)
  
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }
  
  // Слушаем изменения статуса подключения
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  // Уведомления о статусе подключения
  const showConnectionStatus = () => {
    if (!isOnline.value) {
      addNotification({
        type: 'warning',
        title: 'Нет подключения к интернету',
        message: 'Проверьте подключение к сети'
      })
    }
  }
  
  // Инициализируем при создании store
  initialize()
  
  return {
    // Состояние
    isLoading,
    isSidebarOpen,
    theme,
    notifications,
    breadcrumbs,
    pageTitle,
    pageSubtitle,
    settings,
    isOnline,
    
    // Вычисляемые свойства
    unreadNotificationsCount,
    
    // Действия
    setLoading,
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    toggleTheme,
    setBreadcrumbs,
    addBreadcrumb,
    setPageTitle,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearNotifications,
    updateSettings,
    loadSettings,
    
    // Утилиты
    formatDate,
    formatRelativeDate,
    formatNumber,
    pluralize,
    truncate,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    showConnectionStatus
  }
})