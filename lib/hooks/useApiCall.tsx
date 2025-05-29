/**
 * Utility functions for API calls with error handling
 *
 * Example usage:
 *
 * const { data, error, isLoading } = useApiCall(async () => {
 *   return await fetchUserProfile(userId)
 * })
 *
 * // Or with manual error handling:
 * const { handleApiError } = useApiError()
 *
 * try {
 *   const response = await client.post('/users', userData)
 *   // Handle success
 * } catch (error) {
 *   handleApiError(error, 'Creating user profile')
 * }
 */

import { useCallback, useEffect, useState } from 'react'

import { useApiError } from './useApiError'

export interface ApiCallState<T> {
  data: T | null
  error: any | null
  isLoading: boolean
  retry: () => void
}

/**
 * Hook para realizar llamadas a la API con manejo automático de errores
 * @param apiCall - Función que retorna una Promise con la llamada a la API
 * @param dependencies - Dependencias que triggean un nuevo call
 * @param immediate - Si ejecutar inmediatamente (default: true)
 */
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  immediate = true
): ApiCallState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { handleApiError } = useApiError()

  const executeCall = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err)
      handleApiError(err)
    } finally {
      setIsLoading(false)
    }
  }, [apiCall, handleApiError])

  const retry = useCallback(() => {
    executeCall()
  }, [executeCall])

  useEffect(() => {
    if (immediate) {
      executeCall()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return {
    data,
    error,
    isLoading,
    retry,
  }
}

/**
 * Hook para manejar el estado de carga de múltiples operaciones
 */
export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading,
    }))
  }, [])

  const isAnyLoading = Object.values(loadingStates).some(Boolean)

  return {
    loadingStates,
    setLoading,
    isAnyLoading,
  }
}

/**
 * Wrapper para operaciones async con manejo de errores automático
 */
export function withApiErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
): (...args: T) => Promise<R | undefined> {
  return async (...args: T): Promise<R | undefined> => {
    const { handleApiError } = useApiError()

    try {
      return await fn(...args)
    } catch (error) {
      handleApiError(error, context)
      return undefined
    }
  }
}
