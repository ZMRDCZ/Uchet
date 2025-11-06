import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { endpoints } from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  const isLoading = ref(false)
  
  // Вычисляемые свойства
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isModerator = computed(() => user.value?.role === 'moderator' || isAdmin.value)
  const isUser = computed(() => user.value?.role === 'user')
  
  const fullName = computed(() => {
    if (!user.value) return ''
    const { firstName, lastName, middleName } = user.value
    return `${lastName} ${firstName}${middleName ? ' ' + middleName : ''}`
  })
  
  const initials = computed(() => {
    if (!user.value) return ''
    const { firstName, lastName } = user.value
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  })
  
  // Действия
  const login = async (credentials) => {
    try {
      isLoading.value = true
      
      const response = await endpoints.auth.login(credentials)
      const { user: userData, accessToken, refreshToken: newRefreshToken } = response.data || response
      
      // Сохраняем данные
      user.value = userData
      token.value = accessToken
      refreshToken.value = newRefreshToken
      
      // Сохраняем в localStorage
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Ошибка входа:', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Ошибка входа в систему'
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const register = async (userData) => {
    try {
      isLoading.value = true
      
      const response = await endpoints.auth.register(userData)
      const { user: newUser, accessToken, refreshToken: newRefreshToken } = response.data || response
      
      // Сохраняем данные
      user.value = newUser
      token.value = accessToken
      refreshToken.value = newRefreshToken
      
      // Сохраняем в localStorage
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Ошибка регистрации'
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async () => {
    try {
      // Вызываем API для выхода (опционально)
      if (token.value) {
        await endpoints.auth.logout()
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    } finally {
      // Очищаем состояние
      clearAuth()
      
      // Перенаправляем на страницу входа
      router.push('/auth/login')
    }
  }
  
  const clearAuth = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    
    // Очищаем localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }
  
  const checkAuth = async () => {
    const savedToken = localStorage.getItem('token')
    
    if (!savedToken) {
      clearAuth()
      return false
    }
    
    try {
      // Получаем информацию о пользователе
      const response = await endpoints.auth.me()
      
      user.value = response.data?.user || response.user
      token.value = savedToken
      refreshToken.value = localStorage.getItem('refreshToken')
      
      return true
    } catch (error) {
      console.error('Ошибка проверки аутентификации:', error)
      
      // Если токен недействителен, пробуем обновить
      if (error.response?.status === 401) {
        const refreshed = await refreshAuthToken()
        if (!refreshed) {
          clearAuth()
          return false
        }
        return true
      }
      
      clearAuth()
      return false
    }
  }
  
  const refreshAuthToken = async () => {
    const savedRefreshToken = localStorage.getItem('refreshToken')
    
    if (!savedRefreshToken) {
      return false
    }
    
    try {
      const response = await endpoints.auth.refresh(savedRefreshToken)
      
      const { accessToken, refreshToken: newRefreshToken } = response.data || response
      
      // Обновляем токены
      token.value = accessToken
      refreshToken.value = newRefreshToken
      
      // Сохраняем в localStorage
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      return true
    } catch (error) {
      console.error('Ошибка обновления токена:', error)
      return false
    }
  }
  
  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true
      
      const response = await endpoints.users.update(user.value.id, profileData)
      
      // Обновляем данные пользователя
      user.value = { ...user.value, ...(response.data?.user || response.user) }
      
      return { success: true, user: user.value }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Ошибка обновления профиля'
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const changePassword = async (passwordData) => {
    try {
      isLoading.value = true
      
      await endpoints.auth.changePassword(passwordData)
      
      return { success: true }
    } catch (error) {
      console.error('Ошибка смены пароля:', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Ошибка смены пароля'
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const hasPermission = (requiredRole) => {
    if (!user.value) return false
    
    const roleHierarchy = {
      user: 1,
      moderator: 2,
      admin: 3
    }
    
    const userLevel = roleHierarchy[user.value.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    
    return userLevel >= requiredLevel
  }
  
  const canAccessRoute = (route) => {
    if (!route.meta?.requiresAuth) return true
    if (!isAuthenticated.value) return false
    if (!route.meta?.roles) return true
    
    return route.meta.roles.some(role => hasPermission(role))
  }
  
  return {
    // Состояние
    user,
    token,
    refreshToken,
    isLoading,
    
    // Вычисляемые свойства
    isAuthenticated,
    isAdmin,
    isModerator,
    isUser,
    fullName,
    initials,
    
    // Действия
    login,
    register,
    logout,
    clearAuth,
    checkAuth,
    refreshAuthToken,
    updateProfile,
    changePassword,
    hasPermission,
    canAccessRoute
  }
})