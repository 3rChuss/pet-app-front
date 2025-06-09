import axios from 'axios'
import { router } from 'expo-router'

import { signOut } from '@/lib/auth'
import { getToken } from '@/lib/auth/utils'

import { getApiBaseUrl, getRequestTimeout, isDevelopment } from './config'

// Create axios instance with base configuration
const client = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: getRequestTimeout(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add authentication token automatically
client.interceptors.request.use(
  async config => {
    try {
      const token = await getToken()
      if (token?.access) {
        config.headers.Authorization = `Bearer ${token.access}`
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error)
    }
    // Add request logging in development
    if (isDevelopment()) {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`, {
        headers: config.headers,
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  error => {
    if (isDevelopment()) {
      console.error('❌ Request interceptor error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor: Handle errors globally
client.interceptors.response.use(
  response => {
    // Log successful responses in development
    if (isDevelopment()) {
      console.log(`✅ [${response.status}] ${response.config.url}`, response.data)
    }
    return response
  },
  async error => {
    const originalRequest = error.config
    const status = error.response?.status
    const errorData = error.response?.data // Log errors in development
    if (isDevelopment()) {
      console.error(`❌ [${status || 'NETWORK'}] ${originalRequest?.url}`, {
        status,
        data: errorData,
        message: error.message,
      })
    }

    // Handle different error scenarios
    switch (status) {
      case 401: {
        // Unauthorized - Token expired or invalid
        if (!originalRequest._retry) {
          originalRequest._retry = true

          try {
            // Try to refresh token
            const token = await getToken()
            if (token?.refresh) {
              // TODO: Implement token refresh logic here
              // const refreshResponse = await axios.post('/refresh', { refresh_token: token.refresh })
              // await setToken(refreshResponse.data)
              // return client(originalRequest)
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
          }
        }

        // If refresh fails or no refresh token, sign out user
        await signOut()
        router.replace('/(auth)/login')

        return Promise.reject({
          ...error,
          userMessage: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        })
      }

      case 403: {
        // Forbidden - User doesn't have permission
        return Promise.reject({
          ...error,
          userMessage: 'No tienes permisos para realizar esta acción.',
        })
      }

      case 404: {
        // Not found
        return Promise.reject({
          ...error,
          userMessage: 'El recurso solicitado no fue encontrado.',
        })
      }

      case 422: {
        // Validation errors
        const validationErrors = errorData?.errors || errorData?.message
        return Promise.reject({
          ...error,
          userMessage: 'Los datos enviados no son válidos.',
          validationErrors,
        })
      }

      case 429: {
        // Too many requests
        return Promise.reject({
          ...error,
          userMessage: 'Demasiadas solicitudes. Por favor, inténtalo más tarde.',
        })
      }

      case 500:
      case 502:
      case 503:
      case 504: {
        // Server errors
        return Promise.reject({
          ...error,
          userMessage: 'Error del servidor. Por favor, inténtalo más tarde.',
        })
      }

      default: {
        // Network or other errors
        if (!error.response) {
          // Network error
          return Promise.reject({
            ...error,
            userMessage: 'Error de conexión. Verifica tu conexión a internet.',
          })
        }

        // Generic error
        return Promise.reject({
          ...error,
          userMessage: errorData?.message || 'Ha ocurrido un error inesperado.',
        })
      }
    }
  }
)

export default client
