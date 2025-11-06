// Мок-сервис для демонстрации функционала без бекенда
import { ref } from 'vue'

// Демо-данные
const mockData = {
  users: [
    {
      id: '1',
      email: 'admin@company.com',
      firstName: 'Администратор',
      lastName: 'Системы',
      middleName: '',
      role: 'admin',
      department: 'IT',
      position: 'Системный администратор',
      points: 1250,
      avatar: null,
      phone: '+7 (999) 123-45-67',
      createdAt: '2024-01-15T10:00:00Z',
      lastLoginAt: '2024-12-19T14:30:00Z'
    },
    {
      id: '2',
      email: 'moderator@company.com',
      firstName: 'Модератор',
      lastName: 'Событий',
      middleName: '',
      role: 'moderator',
      department: 'HR',
      position: 'HR-менеджер',
      points: 890,
      avatar: null,
      phone: '+7 (999) 234-56-78',
      createdAt: '2024-02-20T09:00:00Z',
      lastLoginAt: '2024-12-19T13:45:00Z'
    },
    {
      id: '3',
      email: 'user@company.com',
      firstName: 'Иван',
      lastName: 'Петров',
      middleName: 'Сергеевич',
      role: 'user',
      department: 'Разработка',
      position: 'Frontend разработчик',
      points: 650,
      avatar: null,
      phone: '+7 (999) 345-67-89',
      createdAt: '2024-03-10T11:00:00Z',
      lastLoginAt: '2024-12-19T12:15:00Z'
    }
  ],
  
  events: [
    {
      id: '1',
      title: 'Тренинг по личной эффективности',
      description: 'Интенсивный тренинг по развитию личной эффективности и тайм-менеджменту',
      startDate: '2024-12-25T10:00:00Z',
      endDate: '2024-12-25T18:00:00Z',
      location: 'Конференц-зал А',
      type: 'training',
      category: 'training',
      pointsReward: 50,
      maxParticipants: 30,
      currentParticipants: 15,
      status: 'upcoming',
      registrationDeadline: '2024-12-24T18:00:00Z',
      isRegistrationOpen: true,
      image: null,
      tags: ['эффективность', 'тайм-менеджмент'],
      organizer: {
        id: '2',
        name: 'Модератор Событий'
      },
      createdAt: '2024-12-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Корпоративный хакатон',
      description: '24-часовой хакатон для разработки инновационных решений',
      startDate: '2024-12-28T09:00:00Z',
      endDate: '2024-12-29T09:00:00Z',
      location: 'IT-центр',
      type: 'workshop',
      category: 'workshop',
      pointsReward: 100,
      maxParticipants: 50,
      currentParticipants: 35,
      status: 'upcoming',
      registrationDeadline: '2024-12-27T18:00:00Z',
      isRegistrationOpen: true,
      image: null,
      tags: ['разработка', 'инновации'],
      organizer: {
        id: '1',
        name: 'Администратор Системы'
      },
      createdAt: '2024-12-10T14:00:00Z'
    },
    {
      id: '3',
      title: 'Новогодний корпоратив',
      description: 'Праздничное мероприятие для всей компании',
      startDate: '2024-12-30T19:00:00Z',
      endDate: '2024-12-31T02:00:00Z',
      location: 'Ресторан "Праздник"',
      type: 'social',
      category: 'social',
      pointsReward: 25,
      maxParticipants: 200,
      currentParticipants: 180,
      status: 'upcoming',
      registrationDeadline: '2024-12-29T18:00:00Z',
      isRegistrationOpen: true,
      image: null,
      tags: ['праздник', 'корпоратив'],
      organizer: {
        id: '2',
        name: 'Модератор Событий'
      },
      createdAt: '2024-12-01T12:00:00Z'
    },
    {
      id: '4',
      title: 'Мастер-класс по публичным выступлениям',
      description: 'Обучение навыкам эффективных публичных выступлений',
      startDate: '2024-12-22T14:00:00Z',
      endDate: '2024-12-22T17:00:00Z',
      location: 'Аудитория 301',
      type: 'training',
      category: 'training',
      pointsReward: 40,
      maxParticipants: 25,
      currentParticipants: 20,
      status: 'upcoming',
      registrationDeadline: '2024-12-21T18:00:00Z',
      isRegistrationOpen: true,
      image: null,
      tags: ['выступления', 'коммуникация'],
      organizer: {
        id: '2',
        name: 'Модератор Событий'
      },
      createdAt: '2024-12-12T09:00:00Z'
    }
  ],
  
  registrations: [
    {
      id: '1',
      eventId: '2',
      userId: '3',
      status: 'approved',
      registeredAt: '2024-12-15T10:30:00Z',
      attended: false,
      feedback: null,
      pointsAwarded: null
    },
    {
      id: '2',
      eventId: '3',
      userId: '3',
      status: 'approved',
      registeredAt: '2024-12-05T14:20:00Z',
      attended: false,
      feedback: null,
      pointsAwarded: null
    }
  ],
  
  rewards: [
    {
      id: '1',
      title: 'Бесплатный обед в кафетерии',
      description: 'Ваучер на бесплатный обед в корпоративном кафетерии',
      pointsCost: 50,
      type: 'service',
      category: 'food',
      quantity: 100,
      availableQuantity: 85,
      image: null,
      isActive: true,
      createdAt: '2024-11-01T10:00:00Z'
    },
    {
      id: '2',
      title: 'Корпоративная футболка',
      description: 'Стильная футболка с логотипом компании',
      pointsCost: 200,
      type: 'prize',
      category: 'clothing',
      quantity: 50,
      availableQuantity: 32,
      image: null,
      isActive: true,
      createdAt: '2024-11-05T14:00:00Z'
    },
    {
      id: '3',
      title: 'День удаленной работы',
      description: 'Возможность работать удаленно в течение одного дня',
      pointsCost: 300,
      type: 'privilege',
      category: 'work',
      quantity: 30,
      availableQuantity: 18,
      image: null,
      isActive: true,
      createdAt: '2024-11-10T09:00:00Z'
    },
    {
      id: '4',
      title: 'Билет в кино',
      description: 'Билет на любой фильм в кинотеатре',
      pointsCost: 150,
      type: 'voucher',
      category: 'entertainment',
      quantity: 80,
      availableQuantity: 45,
      image: null,
      isActive: true,
      createdAt: '2024-11-15T16:00:00Z'
    }
  ],
  
  purchases: [
    {
      id: '1',
      rewardId: '1',
      userId: '3',
      status: 'completed',
      pointsSpent: 50,
      purchasedAt: '2024-12-10T12:00:00Z',
      completedAt: '2024-12-10T12:30:00Z',
      feedback: null
    },
    {
      id: '2',
      rewardId: '2',
      userId: '3',
      status: 'pending',
      pointsSpent: 200,
      purchasedAt: '2024-12-18T15:00:00Z',
      completedAt: null,
      feedback: null
    }
  ],
  
  notifications: [
    {
      id: '1',
      userId: '3',
      title: 'Новое мероприятие доступно для регистрации',
      message: 'Открыта регистрация на тренинг по личной эффективности',
      type: 'event',
      isRead: false,
      actionUrl: '/events/1',
      createdAt: '2024-12-19T10:00:00Z'
    },
    {
      id: '2',
      userId: '3',
      title: 'Вам начислено 50 баллов',
      message: 'За участие в мастер-классе по публичным выступлениям',
      type: 'points',
      isRead: false,
      actionUrl: '/profile/points',
      createdAt: '2024-12-18T16:30:00Z'
    },
    {
      id: '3',
      userId: '3',
      title: 'Покупка обработана',
      message: 'Ваша покупка "Бесплатный обед" готова к получению',
      type: 'purchase',
      isRead: true,
      actionUrl: '/profile/purchases',
      createdAt: '2024-12-10T12:30:00Z'
    }
  ],
  
  pointsHistory: [
    {
      id: '1',
      userId: '3',
      type: 'earned',
      amount: 50,
      description: 'Участие в мастер-классе по публичным выступлениям',
      eventId: '4',
      createdAt: '2024-12-18T16:30:00Z'
    },
    {
      id: '2',
      userId: '3',
      type: 'spent',
      amount: -200,
      description: 'Покупка корпоративной футболки',
      purchaseId: '2',
      createdAt: '2024-12-18T15:00:00Z'
    },
    {
      id: '3',
      userId: '3',
      type: 'spent',
      amount: -50,
      description: 'Покупка бесплатного обеда',
      purchaseId: '1',
      createdAt: '2024-12-10T12:00:00Z'
    }
  ]
}

// Состояние для хранения данных в памяти
const state = ref({
  currentUser: null,
  isAuthenticated: false
})

// Утилиты для работы с данными
const utils = {
  // Генерация ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },
  
  // Фильтрация данных
  filterData(data, filters) {
    return data.filter(item => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (item.title && !item.title.toLowerCase().includes(searchLower)) return false
        if (item.description && !item.description.toLowerCase().includes(searchLower)) return false
      }
      
      if (filters.category && item.category !== filters.category) return false
      if (filters.status && item.status !== filters.status) return false
      if (filters.type && item.type !== filters.type) return false
      
      return true
    })
  },
  
  // Сортировка данных
  sortData(data, sortBy, sortOrder = 'asc') {
    return [...data].sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'start_date':
          aVal = new Date(a.startDate)
          bVal = new Date(b.startDate)
          break
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case 'points':
          aVal = a.pointsReward || a.pointsCost || 0
          bVal = b.pointsReward || b.pointsCost || 0
          break
        case 'created_at':
          aVal = new Date(a.createdAt)
          bVal = new Date(b.createdAt)
          break
        default:
          return 0
      }
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    })
  },
  
  // Пагинация
  paginateData(data, page = 1, limit = 10) {
    const start = (page - 1) * limit
    const end = start + limit
    return {
      data: data.slice(start, end),
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit)
      }
    }
  },
  
  // Имитация задержки сети
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Мок-API методы
export const mockApi = {
  // Аутентификация
  auth: {
    async login(credentials) {
      await utils.delay(800)
      
      const user = mockData.users.find(u => u.email === credentials.email)
      if (!user || credentials.password !== 'password') {
        throw new Error('Неверный email или пароль')
      }
      
      state.value.currentUser = user
      state.value.isAuthenticated = true
      
      return {
        user,
        accessToken: 'mock-token-' + Date.now(),
        refreshToken: 'mock-refresh-' + Date.now()
      }
    },
    
    async register(userData) {
      await utils.delay(1000)
      
      const existingUser = mockData.users.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует')
      }
      
      const newUser = {
        id: utils.generateId(),
        ...userData,
        role: 'user',
        points: 0,
        avatar: null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      
      mockData.users.push(newUser)
      state.value.currentUser = newUser
      state.value.isAuthenticated = true
      
      return {
        user: newUser,
        accessToken: 'mock-token-' + Date.now(),
        refreshToken: 'mock-refresh-' + Date.now()
      }
    },
    
    async logout() {
      await utils.delay(300)
      state.value.currentUser = null
      state.value.isAuthenticated = false
      return { success: true }
    },
    
    async me() {
      await utils.delay(200)
      if (!state.value.isAuthenticated) {
        throw new Error('Не авторизован')
      }
      return { user: state.value.currentUser }
    }
  },
  
  // Пользователи
  users: {
    async list(params = {}) {
      await utils.delay(600)
      
      let filteredUsers = [...mockData.users]
      
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        )
      }
      
      if (params.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role)
      }
      
      const sortedUsers = utils.sortData(filteredUsers, params.sortBy || 'created_at', params.sortOrder)
      const paginated = utils.paginateData(sortedUsers, params.page, params.limit)
      
      return {
        users: paginated.data,
        pagination: paginated.pagination
      }
    },
    
    async get(id) {
      await utils.delay(300)
      const user = mockData.users.find(u => u.id === id)
      if (!user) throw new Error('Пользователь не найден')
      return { user }
    },
    
    async update(id, data) {
      await utils.delay(500)
      const userIndex = mockData.users.findIndex(u => u.id === id)
      if (userIndex === -1) throw new Error('Пользователь не найден')
      
      mockData.users[userIndex] = { ...mockData.users[userIndex], ...data }
      return { user: mockData.users[userIndex] }
    },
    
    async leaderboard(params = {}) {
      await utils.delay(400)
      
      const sortedUsers = [...mockData.users]
        .filter(user => user.role === 'user')
        .sort((a, b) => b.points - a.points)
      
      const paginated = utils.paginateData(sortedUsers, params.page, params.limit)
      
      return {
        leaderboard: paginated.data.map((user, index) => ({
          ...user,
          rank: paginated.pagination.page * paginated.pagination.limit - paginated.pagination.limit + index + 1
        })),
        pagination: paginated.pagination
      }
    }
  },
  
  // Мероприятия
  events: {
    async list(params = {}) {
      await utils.delay(600)
      
      let filteredEvents = [...mockData.events]
      
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower)
        )
      }
      
      if (params.category) {
        filteredEvents = filteredEvents.filter(event => event.category === params.category)
      }
      
      if (params.status) {
        filteredEvents = filteredEvents.filter(event => event.status === params.status)
      }
      
      if (params.upcoming) {
        const now = new Date()
        filteredEvents = filteredEvents.filter(event => new Date(event.startDate) > now)
      }
      
      const sortedEvents = utils.sortData(filteredEvents, params.sortBy || 'start_date', params.sortOrder)
      const paginated = utils.paginateData(sortedEvents, params.page, params.limit)
      
      return {
        events: paginated.data,
        pagination: paginated.pagination
      }
    },
    
    async get(id) {
      await utils.delay(300)
      const event = mockData.events.find(e => e.id === id)
      if (!event) throw new Error('Мероприятие не найдено')
      return { event }
    },
    
    async create(data) {
      await utils.delay(800)
      
      const newEvent = {
        id: utils.generateId(),
        ...data,
        currentParticipants: 0,
        status: 'upcoming',
        isRegistrationOpen: true,
        image: null,
        tags: data.tags || [],
        organizer: {
          id: state.value.currentUser.id,
          name: `${state.value.currentUser.firstName} ${state.value.currentUser.lastName}`
        },
        createdAt: new Date().toISOString()
      }
      
      mockData.events.push(newEvent)
      return { event: newEvent }
    },
    
    async update(id, data) {
      await utils.delay(600)
      const eventIndex = mockData.events.findIndex(e => e.id === id)
      if (eventIndex === -1) throw new Error('Мероприятие не найдено')
      
      mockData.events[eventIndex] = { ...mockData.events[eventIndex], ...data }
      return { event: mockData.events[eventIndex] }
    },
    
    async delete(id) {
      await utils.delay(400)
      const eventIndex = mockData.events.findIndex(e => e.id === id)
      if (eventIndex === -1) throw new Error('Мероприятие не найдено')
      
      mockData.events.splice(eventIndex, 1)
      return { success: true }
    }
  },
  
  // Регистрации
  registrations: {
    async create(eventId) {
      await utils.delay(500)
      
      const event = mockData.events.find(e => e.id === eventId)
      if (!event) throw new Error('Мероприятие не найдено')
      
      if (!event.isRegistrationOpen) {
        throw new Error('Регистрация на мероприятие закрыта')
      }
      
      if (event.currentParticipants >= event.maxParticipants) {
        throw new Error('Достигнут лимит участников')
      }
      
      const existingRegistration = mockData.registrations.find(
        r => r.eventId === eventId && r.userId === state.value.currentUser.id
      )
      
      if (existingRegistration) {
        throw new Error('Вы уже зарегистрированы на это мероприятие')
      }
      
      const newRegistration = {
        id: utils.generateId(),
        eventId,
        userId: state.value.currentUser.id,
        status: 'pending',
        registeredAt: new Date().toISOString(),
        attended: false,
        feedback: null,
        pointsAwarded: null
      }
      
      mockData.registrations.push(newRegistration)
      
      // Увеличиваем количество участников
      const eventIndex = mockData.events.findIndex(e => e.id === eventId)
      mockData.events[eventIndex].currentParticipants++
      
      return { registration: newRegistration }
    },
    
    async my(params = {}) {
      await utils.delay(400)
      
      const userRegistrations = mockData.registrations.filter(
        r => r.userId === state.value.currentUser.id
      )
      
      const registrationsWithEvents = userRegistrations.map(registration => {
        const event = mockData.events.find(e => e.id === registration.eventId)
        return { ...registration, event }
      })
      
      const sorted = utils.sortData(registrationsWithEvents, params.sortBy || 'registered_at', 'desc')
      const paginated = utils.paginateData(sorted, params.page, params.limit)
      
      return {
        registrations: paginated.data,
        pagination: paginated.pagination
      }
    },
    
    async cancel(id) {
      await utils.delay(400)
      
      const registrationIndex = mockData.registrations.findIndex(r => r.id === id)
      if (registrationIndex === -1) throw new Error('Регистрация не найдена')
      
      const registration = mockData.registrations[registrationIndex]
      if (registration.userId !== state.value.currentUser.id) {
        throw new Error('Нет прав для отмены этой регистрации')
      }
      
      // Уменьшаем количество участников
      const eventIndex = mockData.events.findIndex(e => e.id === registration.eventId)
      if (eventIndex !== -1) {
        mockData.events[eventIndex].currentParticipants--
      }
      
      mockData.registrations.splice(registrationIndex, 1)
      return { success: true }
    }
  },
  
  // Награды
  rewards: {
    async list(params = {}) {
      await utils.delay(500)
      
      let filteredRewards = mockData.rewards.filter(r => r.isActive)
      
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredRewards = filteredRewards.filter(reward => 
          reward.title.toLowerCase().includes(searchLower) ||
          reward.description.toLowerCase().includes(searchLower)
        )
      }
      
      if (params.type) {
        filteredRewards = filteredRewards.filter(reward => reward.type === params.type)
      }
      
      if (params.category) {
        filteredRewards = filteredRewards.filter(reward => reward.category === params.category)
      }
      
      const sortedRewards = utils.sortData(filteredRewards, params.sortBy || 'created_at', 'desc')
      const paginated = utils.paginateData(sortedRewards, params.page, params.limit)
      
      return {
        rewards: paginated.data,
        pagination: paginated.pagination
      }
    },
    
    async get(id) {
      await utils.delay(300)
      const reward = mockData.rewards.find(r => r.id === id)
      if (!reward) throw new Error('Награда не найдена')
      return { reward }
    },
    
    async purchase(id) {
      await utils.delay(600)
      
      const reward = mockData.rewards.find(r => r.id === id)
      if (!reward) throw new Error('Награда не найдена')
      
      if (!reward.isActive) {
        throw new Error('Награда недоступна')
      }
      
      if (reward.availableQuantity <= 0) {
        throw new Error('Награда закончилась')
      }
      
      if (state.value.currentUser.points < reward.pointsCost) {
        throw new Error('Недостаточно баллов')
      }
      
      // Создаем покупку
      const newPurchase = {
        id: utils.generateId(),
        rewardId: id,
        userId: state.value.currentUser.id,
        status: 'pending',
        pointsSpent: reward.pointsCost,
        purchasedAt: new Date().toISOString(),
        completedAt: null,
        feedback: null
      }
      
      mockData.purchases.push(newPurchase)
      
      // Уменьшаем количество доступных наград
      const rewardIndex = mockData.rewards.findIndex(r => r.id === id)
      mockData.rewards[rewardIndex].availableQuantity--
      
      // Списываем баллы у пользователя
      const userIndex = mockData.users.findIndex(u => u.id === state.value.currentUser.id)
      mockData.users[userIndex].points -= reward.pointsCost
      state.value.currentUser.points -= reward.pointsCost
      
      // Добавляем запись в историю баллов
      const pointsRecord = {
        id: utils.generateId(),
        userId: state.value.currentUser.id,
        type: 'spent',
        amount: -reward.pointsCost,
        description: `Покупка "${reward.title}"`,
        purchaseId: newPurchase.id,
        createdAt: new Date().toISOString()
      }
      
      mockData.pointsHistory.push(pointsRecord)
      
      return { purchase: newPurchase }
    }
  },
  
  // Покупки
  purchases: {
    async my(params = {}) {
      await utils.delay(400)
      
      const userPurchases = mockData.purchases.filter(
        p => p.userId === state.value.currentUser.id
      )
      
      const purchasesWithRewards = userPurchases.map(purchase => {
        const reward = mockData.rewards.find(r => r.id === purchase.rewardId)
        return { ...purchase, reward }
      })
      
      const sorted = utils.sortData(purchasesWithRewards, params.sortBy || 'purchased_at', 'desc')
      const paginated = utils.paginateData(sorted, params.page, params.limit)
      
      return {
        purchases: paginated.data,
        pagination: paginated.pagination
      }
    }
  },
  
  // Уведомления
  notifications: {
    async list(params = {}) {
      await utils.delay(300)
      
      const userNotifications = mockData.notifications.filter(
        n => n.userId === state.value.currentUser.id
      )
      
      const sorted = utils.sortData(userNotifications, 'created_at', 'desc')
      const paginated = utils.paginateData(sorted, params.page, params.limit)
      
      return {
        notifications: paginated.data,
        pagination: paginated.pagination
      }
    },
    
    async markAsRead(id) {
      await utils.delay(200)
      
      const notification = mockData.notifications.find(n => n.id === id)
      if (notification) {
        notification.isRead = true
      }
      
      return { success: true }
    }
  },
  
  // Статистика
  statistics: {
    async dashboard() {
      await utils.delay(400)
      
      const userRegistrations = mockData.registrations.filter(
        r => r.userId === state.value.currentUser.id
      )
      
      const userPurchases = mockData.purchases.filter(
        p => p.userId === state.value.currentUser.id
      )
      
      const attendedEvents = userRegistrations.filter(r => r.attended).length
      const upcomingEvents = userRegistrations.filter(r => !r.attended && r.status === 'approved').length
      const totalPurchases = userPurchases.length
      const pointsSpent = userPurchases.reduce((sum, p) => sum + p.pointsSpent, 0)
      
      // Ранжирование пользователя
      const allUsers = mockData.users.filter(u => u.role === 'user')
      const sortedUsers = allUsers.sort((a, b) => b.points - a.points)
      const userRank = sortedUsers.findIndex(u => u.id === state.value.currentUser.id) + 1
      
      return {
        attendedEvents,
        upcomingEvents,
        totalPurchases,
        pointsSpent,
        pointsThisMonth: Math.floor(Math.random() * 200) + 50, // Демо данные
        rank: userRank,
        department: state.value.currentUser.department
      }
    }
  }
}

// Экспорт для совместимости с существующим API
export default {
  get: (url, config) => mockApi.get(url, config),
  post: (url, data) => mockApi.post(url, data),
  put: (url, data) => mockApi.put(url, data),
  delete: (url) => mockApi.delete(url),
  ...mockApi
} 