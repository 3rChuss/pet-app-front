import { useState, useEffect, useCallback } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  ErrorInfo,
  ErrorType,
  RecoveryStrategy,
  ErrorRecoveryState,
  NetworkStatus,
  RetryOptions,
} from '@/lib/types/error-recovery'
import ErrorReportingService from '@/services/error-reporting'

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  timeout: 30000,
}

const ERROR_STORAGE_KEY = '@petopia/error_reports'
const MAX_STORED_ERRORS = 10

export function useErrorRecovery() {
  const [recoveryState, setRecoveryState] = useState<ErrorRecoveryState>({
    error: null,
    isRecovering: false,
    fallbackActivated: false,
    offlineMode: false,
  })

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
  })

  // Simulate network monitoring (replace with actual NetInfo when available)
  useEffect(() => {
    // For now, we'll assume network is available
    // In a real implementation, you would use @react-native-community/netinfo
    const checkNetworkStatus = () => {
      setNetworkStatus({
        isConnected: navigator.onLine ?? true,
        isInternetReachable: navigator.onLine ?? true,
        type: 'wifi',
      })
    }

    checkNetworkStatus()
    const interval = setInterval(checkNetworkStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  // Determine recovery strategy based on error type
  const getRecoveryStrategy = useCallback(
    (errorType: ErrorType, retryCount: number): RecoveryStrategy => {
      switch (errorType) {
        case 'network':
          if (!networkStatus.isConnected) return 'fallback-only'
          return retryCount < 2 ? 'retry' : 'retry-with-fallback'

        case 'font-loading':
          return retryCount < 1 ? 'retry' : 'fallback-only'

        case 'storage':
          return retryCount < 2 ? 'retry' : 'guest-mode'

        case 'authentication':
          return retryCount < 1 ? 'retry' : 'guest-mode'

        case 'permissions':
          return 'manual'

        case 'initialization':
          return retryCount < 2 ? 'retry' : 'reload'

        case 'critical':
          return 'reload'

        default:
          return retryCount < 1 ? 'retry' : 'fallback-only'
      }
    },
    [networkStatus.isConnected]
  )
  // Generate user-friendly error messages
  const getUserFriendlyMessage = useCallback(
    (errorType: ErrorType, _context?: Record<string, any>): string => {
      switch (errorType) {
        case 'network':
          if (!networkStatus.isConnected) {
            return 'Sin conexión a internet. Verifica tu conexión y vuelve a intentar.'
          }
          return 'Problema de conexión. Verificando la red...'

        case 'font-loading':
          return 'Cargando recursos visuales...'

        case 'storage':
          return 'Problema accediendo a los datos locales. Intentando recuperar...'

        case 'authentication':
          return 'Problema con la autenticación. Puedes continuar como invitado.'

        case 'permissions':
          return 'Se necesitan permisos adicionales para esta función.'

        case 'initialization':
          return 'Iniciando la aplicación...'

        case 'critical':
          return 'Error crítico. La aplicación necesita reiniciarse.'

        default:
          return 'Ha ocurrido un error inesperado. Reintentando...'
      }
    },
    [networkStatus.isConnected]
  )

  // Create error info object
  const createErrorInfo = useCallback(
    (
      type: ErrorType,
      originalError: Error,
      context?: Record<string, any>,
      retryCount: number = 0
    ): ErrorInfo => {
      const strategy = getRecoveryStrategy(type, retryCount)
      const severity =
        type === 'critical'
          ? 'critical'
          : type === 'initialization'
            ? 'high'
            : type === 'network'
              ? 'medium'
              : 'low'

      return {
        type,
        code: (originalError as any)?.code,
        message: originalError.message,
        originalError,
        context,
        timestamp: Date.now(),
        severity,
        retryCount,
        maxRetries: DEFAULT_RETRY_OPTIONS.maxRetries,
        strategy,
        userFriendlyMessage: getUserFriendlyMessage(type, context),
        technicalDetails: originalError.stack,
      }
    },
    [getRecoveryStrategy, getUserFriendlyMessage]
  )

  // Store error for analytics/debugging
  const storeError = useCallback(async (errorInfo: ErrorInfo) => {
    try {
      const storedErrors = await AsyncStorage.getItem(ERROR_STORAGE_KEY)
      const errors = storedErrors ? JSON.parse(storedErrors) : []

      // Add new error and keep only the latest MAX_STORED_ERRORS
      errors.unshift({
        ...errorInfo,
        originalError: undefined, // Don't store the error object
        technicalDetails: errorInfo.technicalDetails?.substring(0, 500), // Limit size
      })

      const trimmedErrors = errors.slice(0, MAX_STORED_ERRORS)
      await AsyncStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(trimmedErrors))
    } catch (error) {
      console.warn('Failed to store error info:', error)
    }
  }, [])

  // Exponential backoff delay calculation
  const calculateDelay = useCallback(
    (retryCount: number, options: RetryOptions = DEFAULT_RETRY_OPTIONS): number => {
      const delay = Math.min(
        options.baseDelay * Math.pow(options.backoffMultiplier, retryCount),
        options.maxDelay
      )
      // Add some jitter to prevent thundering herd
      return delay + Math.random() * 1000
    },
    []
  )

  // Execute with retry logic
  const executeWithRetry = useCallback(
    async function <T>(
      operation: () => Promise<T>,
      errorType: ErrorType,
      context?: Record<string, any>,
      options: Partial<RetryOptions> = {}
    ): Promise<T> {
      const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options }
      let lastError: Error

      for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            const delay = calculateDelay(attempt - 1, retryOptions)
            await new Promise(resolve => setTimeout(resolve, delay))
          }

          const result = await Promise.race([
            operation(),
            ...(retryOptions.timeout
              ? [
                  new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Operation timeout')), retryOptions.timeout)
                  ),
                ]
              : []),
          ])

          return result
        } catch (error) {
          lastError = error as Error

          if (attempt === retryOptions.maxRetries) {
            // Final attempt failed, create and report error
            const errorInfo = createErrorInfo(errorType, lastError, context, attempt)
            await storeError(errorInfo)
            throw errorInfo
          }

          // Log retry attempt
          console.warn(`Attempt ${attempt + 1} failed for ${errorType}:`, error)
        }
      }

      throw lastError!
    },
    [calculateDelay, createErrorInfo, storeError]
  )
  // Report error to recovery system
  const reportError = useCallback(
    async (type: ErrorType, error: Error, context?: Record<string, any>) => {
      const errorInfo = createErrorInfo(type, error, context, 0)
      await storeError(errorInfo)

      // Report to analytics service
      try {
        await ErrorReportingService.reportError(errorInfo, {
          userInfo: {
            isGuest: true, // This should come from auth context
            sessionId: `session_${Date.now()}`,
          },
        })
      } catch (reportingError) {
        console.warn('Failed to report error to analytics service:', reportingError)
      }

      setRecoveryState(prev => ({
        ...prev,
        error: errorInfo,
      }))
    },
    [createErrorInfo, storeError]
  )

  // Start recovery process
  const startRecovery = useCallback(
    async (retryAction?: () => Promise<void>) => {
      if (!recoveryState.error) return

      setRecoveryState(prev => ({
        ...prev,
        isRecovering: true,
        lastRecoveryAttempt: Date.now(),
      }))

      try {
        if (retryAction) {
          await retryAction()
        }

        // Recovery successful
        setRecoveryState(prev => ({
          ...prev,
          error: null,
          isRecovering: false,
          fallbackActivated: false,
        }))
      } catch {
        // Recovery failed, update retry count
        const currentError = recoveryState.error
        const newRetryCount = currentError.retryCount + 1
        const newStrategy = getRecoveryStrategy(currentError.type, newRetryCount)

        const updatedError: ErrorInfo = {
          ...currentError,
          retryCount: newRetryCount,
          strategy: newStrategy,
          userFriendlyMessage: getUserFriendlyMessage(currentError.type, currentError.context),
        }

        setRecoveryState(prev => ({
          ...prev,
          error: updatedError,
          isRecovering: false,
          fallbackActivated:
            newStrategy === 'fallback-only' || newStrategy === 'retry-with-fallback',
        }))

        await storeError(updatedError)
      }
    },
    [recoveryState.error, getRecoveryStrategy, getUserFriendlyMessage, storeError]
  )

  // Clear error state
  const clearError = useCallback(() => {
    setRecoveryState(prev => ({
      ...prev,
      error: null,
      isRecovering: false,
      fallbackActivated: false,
    }))
  }, [])

  // Get stored error reports for debugging
  const getStoredErrors = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(ERROR_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }, [])

  // Clear stored errors
  const clearStoredErrors = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(ERROR_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear stored errors:', error)
    }
  }, [])

  return {
    // State
    recoveryState,
    networkStatus,

    // Actions
    executeWithRetry,
    reportError,
    startRecovery,
    clearError,

    // Utilities
    getStoredErrors,
    clearStoredErrors,
    createErrorInfo,
  }
}
