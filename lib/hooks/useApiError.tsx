import { useCallback } from 'react'

import { useRouter } from 'expo-router'

import { useNotifications } from '@/lib/context/NotificationProvider'
import ErrorReportingService from '@/services/error-reporting'

export interface ApiError {
  status?: number
  message: string
  userMessage?: string
  validationErrors?: Record<string, string[]> | string
  originalError?: any
}

export type ErrorCategory =
  | 'success'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'network'
  | 'server'
  | 'client'
  | 'unknown'

/**
 * Hook para manejar errores de API de forma diferenciada según su criticidad
 * Proporciona notificaciones no bloqueantes (toasts) y modales para errores críticos
 */
export function useApiError() {
  const { showToast, showErrorModal } = useNotifications()
  const router = useRouter()

  /**
   * Categoriza un error según su tipo y estado HTTP
   */
  const categorizeError = useCallback((error: ApiError): ErrorCategory => {
    const status = error.status

    // Mensajes de éxito (201, 200 con mensaje positivo)
    if (status === 200 || status === 201) {
      return 'success'
    }

    // Errores de validación
    if (status === 422 || error.validationErrors) {
      return 'validation'
    }

    // Errores de autenticación
    if (status === 401) {
      return 'authentication'
    }

    // Errores de autorización
    if (status === 403) {
      return 'authorization'
    }

    // Errores de red/conectividad
    if (status === 0 || status === 408 || status === 503 || status === 504) {
      return 'network'
    }

    // Errores del servidor
    if (status && status >= 500) {
      return 'server'
    }

    // Errores del cliente
    if (status && status >= 400 && status < 500) {
      return 'client'
    }

    return 'unknown'
  }, [])

  /**
   * Muestra un mensaje de éxito con toast verde
   */
  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, 'success', 4000)
    },
    [showToast]
  )

  /**
   * Muestra errores de validación de forma inline (requiere integración con formularios)
   * Para errores de validación generales, muestra un toast de advertencia
   */
  const showValidationError = useCallback(
    (error: ApiError) => {
      if (error.validationErrors) {
        if (typeof error.validationErrors === 'string') {
          showToast(error.validationErrors, 'warning', 5000)
        } else {
          // Si hay múltiples errores de validación, mostrar el primero como toast
          const firstError = Object.values(error.validationErrors)[0]
          const message = Array.isArray(firstError) ? firstError[0] : firstError
          showToast(message, 'warning', 5000)
        }
      } else {
        showToast(error.userMessage || 'Por favor, revisa los datos ingresados', 'warning', 5000)
      }
    },
    [showToast]
  )

  /**
   * Muestra errores críticos de autenticación con modal
   */
  const showAuthenticationError = useCallback(
    (error: ApiError) => {
      showErrorModal(
        'Sesión expirada',
        error.userMessage || 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        'critical',
        {
          actionText: 'Iniciar sesión',
          hideCancel: true,
          onAction: () => {
            router.replace('/(auth)/login')
          },
        }
      )
    },
    [showErrorModal, router]
  )

  /**
   * Muestra errores de autorización con modal
   */
  const showAuthorizationError = useCallback(
    (error: ApiError) => {
      showErrorModal(
        'Acceso denegado',
        error.userMessage || 'No tienes permisos para realizar esta acción.',
        'high',
        {
          actionText: 'Entendido',
          hideCancel: true,
        }
      )
    },
    [showErrorModal]
  )

  /**
   * Muestra errores de red con toast informativo
   */
  const showNetworkError = useCallback(
    (error: ApiError) => {
      showToast(
        error.userMessage || 'Problema de conexión. Verifica tu internet e intenta nuevamente.',
        'error',
        6000
      )
    },
    [showToast]
  )

  /**
   * Muestra errores del servidor con modal
   */
  const showServerError = useCallback(
    (error: ApiError) => {
      showErrorModal(
        'Error del servidor',
        error.userMessage ||
          'Estamos experimentando problemas técnicos. Intenta nuevamente en unos minutos.',
        'high',
        {
          actionText: 'Reintentar',
          cancelText: 'Cancelar',
          onAction: () => {
            // Podrías implementar lógica de reintento aquí
          },
        }
      )
    },
    [showErrorModal]
  )

  /**
   * Muestra errores generales del cliente con toast
   */
  const showClientError = useCallback(
    (error: ApiError) => {
      showToast(
        error.userMessage || 'Ha ocurrido un error. Por favor, intenta nuevamente.',
        'error',
        5000
      )
    },
    [showToast]
  )

  /**
   * Muestra errores desconocidos con modal de información
   */
  const showUnknownError = useCallback(
    (error: ApiError) => {
      showErrorModal(
        'Error inesperado',
        error.userMessage ||
          'Ha ocurrido un error inesperado. Si el problema persiste, contacta al soporte.',
        'medium',
        {
          actionText: 'Entendido',
          hideCancel: true,
        }
      )
    },
    [showErrorModal]
  ) /**
   * Reporta un error para análisis y debugging
   */
  const reportApiError = useCallback(async (error: ApiError, context?: string) => {
    try {
      await ErrorReportingService.reportError({
        type: 'network',
        message: error.message,
        severity: error.status && error.status >= 500 ? 'high' : 'medium',
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: 3,
        strategy: 'retry',
        userFriendlyMessage: error.userMessage || 'Error de conexión',
        context: {
          ...error.originalError?.config,
          status: error.status,
          userMessage: error.userMessage,
          validationErrors: error.validationErrors,
          additionalContext: context,
        },
      })
    } catch (reportingError) {
      console.warn('Failed to report API error:', reportingError)
    }
  }, [])

  /**
   * Función principal para manejar cualquier error de API
   * Determina automáticamente cómo mostrar el error según su categoría
   */
  const handleApiError = useCallback(
    (error: any, context?: string) => {
      const apiError: ApiError = {
        status: error.response?.status || error.status,
        message: error.message || 'Unknown error',
        userMessage: error.userMessage,
        validationErrors: error.validationErrors,
        originalError: error,
      }

      // Report error for analytics
      reportApiError(apiError, context)

      // Categorize and handle error appropriately
      const category = categorizeError(apiError)

      switch (category) {
        case 'success':
          showSuccess(apiError.userMessage || 'Operación completada exitosamente')
          break
        case 'validation':
          showValidationError(apiError)
          break
        case 'authentication':
          showAuthenticationError(apiError)
          break
        case 'authorization':
          showAuthorizationError(apiError)
          break
        case 'network':
          showNetworkError(apiError)
          break
        case 'server':
          showServerError(apiError)
          break
        case 'client':
          showClientError(apiError)
          break
        case 'unknown':
        default:
          showUnknownError(apiError)
          break
      }

      return apiError
    },
    [
      reportApiError,
      categorizeError,
      showSuccess,
      showValidationError,
      showAuthenticationError,
      showAuthorizationError,
      showNetworkError,
      showServerError,
      showClientError,
      showUnknownError,
    ]
  )

  /**
   * Maneja específicamente errores de validación para formularios
   * Devuelve true si pudo mapear errores a campos, false si necesita mostrar mensaje genérico
   */
  const handleValidationErrors = useCallback(
    (error: ApiError, mapToForm?: (error: ApiError) => boolean) => {
      // Si se proporciona una función para mapear al formulario, intentar usarla
      if (mapToForm && mapToForm(error)) {
        // Los errores se mapearon exitosamente a campos del formulario
        return true
      }

      // Si no se pudo mapear al formulario, mostrar como toast
      showValidationError(error)
      return false
    },
    [showValidationError]
  )

  /**
   * Muestra un mensaje de éxito (para compatibilidad con código existente)
   */
  const showSuccessMessage = useCallback(
    (message: string) => {
      showSuccess(message)
    },
    [showSuccess]
  )

  return {
    // Funciones principales
    handleApiError,
    handleValidationErrors,
    reportApiError,

    // Funciones específicas por categoría (para uso avanzado)
    showSuccess: showSuccessMessage,
    showValidationError,
    showAuthenticationError,
    showAuthorizationError,
    showNetworkError,
    showServerError,
    showClientError,
    showUnknownError,

    // Utilidades
    categorizeError,
  }
}
