import { useCallback } from 'react'

import { Alert } from 'react-native'

import ErrorReportingService from '@/services/error-reporting'

export interface ApiError {
  status?: number
  message: string
  userMessage?: string
  validationErrors?: Record<string, string[]> | string
  originalError?: any
}

/**
 * Hook para manejar errores de API de forma consistente
 * Proporciona funciones para mostrar errores al usuario y reportarlos
 */
export function useApiError() {
  /**
   * Muestra un error al usuario con un mensaje amigable
   */
  const showError = useCallback((error: ApiError, title = 'Error') => {
    const message = error.userMessage || error.message || 'Ha ocurrido un error inesperado'

    Alert.alert(title, message, [{ text: 'OK', style: 'default' }])
  }, [])

  /**
   * Maneja errores de validación mostrando los campos específicos
   */
  const showValidationErrors = useCallback(
    (error: ApiError) => {
      if (error.validationErrors) {
        let message = 'Por favor, corrige los siguientes errores:\n\n'

        if (typeof error.validationErrors === 'string') {
          message += error.validationErrors
        } else {
          Object.entries(error.validationErrors).forEach(([field, errors]) => {
            message += `• ${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}\n`
          })
        }

        Alert.alert('Errores de validación', message, [{ text: 'OK', style: 'default' }])
      } else {
        showError(error, 'Error de validación')
      }
    },
    [showError]
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
   * Determina automáticamente cómo mostrar el error y lo reporta
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

      // Show appropriate error message
      if (apiError.status === 422 && apiError.validationErrors) {
        showValidationErrors(apiError)
      } else {
        showError(apiError)
      }

      return apiError
    },
    [reportApiError, showValidationErrors, showError]
  )

  return {
    showError,
    showValidationErrors,
    reportApiError,
    handleApiError,
  }
}
