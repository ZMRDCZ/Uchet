import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Bootstrap CSS и JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// FontAwesome иконки
import '@fortawesome/fontawesome-free/css/all.min.css'

// Глобальные стили
import './styles/main.css'

// Toast уведомления
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Конфигурация Toast
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

const app = createApp(App)

// Подключаем плагины
app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

// Глобальные свойства
app.config.globalProperties.$filters = {
  // Форматирование даты
  formatDate(date, format = 'dd.MM.yyyy') {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    
    switch (format) {
      case 'dd.MM.yyyy':
        return `${day}.${month}.${year}`
      case 'dd.MM.yyyy HH:mm':
        return `${day}.${month}.${year} ${hours}:${minutes}`
      case 'DD MMM YYYY':
        const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
        return `${day} ${months[d.getMonth()]} ${year}`
      default:
        return `${day}.${month}.${year}`
    }
  },
  
  // Форматирование времени
  formatTime(date) {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    
    return `${hours}:${minutes}`
  },
  
  // Форматирование чисел
  formatNumber(num) {
    if (!num && num !== 0) return ''
    return new Intl.NumberFormat('ru-RU').format(num)
  },
  
  // Склонение слов
  pluralize(count, forms) {
    const cases = [2, 0, 1, 1, 1, 2]
    return forms[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]]
  },
  
  // Обрезка текста
  truncate(text, length = 100) {
    if (!text) return ''
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
  }
}

// Глобальная обработка ошибок
app.config.errorHandler = (err, vm, info) => {
  console.error('Глобальная ошибка Vue:', err)
  console.error('Контекст:', info)
  
  // Показываем пользователю уведомление об ошибке
  const toast = app.config.globalProperties.$toast
  if (toast) {
    toast.error('Произошла неожиданная ошибка. Попробуйте обновить страницу.')
  }
}

// Монтируем приложение
app.mount('#app')