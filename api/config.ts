/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Base configuration
const API_CONFIG = {
  // Default timeout for requests (15 seconds)
  TIMEOUT: 15000,

  // Default API base URL (should be overridden by environment variable)
  DEFAULT_BASE_URL: process.env.EXPO_PUBLIC_API_URL!,

  // Request retry configuration
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    retryCondition: (error: any) => {
      // Retry on network errors or 5xx server errors
      return !error.response || (error.response.status >= 500 && error.response.status < 600)
    },
  },

  // Authentication configuration
  AUTH: {
    tokenHeader: 'Authorization',
    tokenPrefix: 'Bearer ',
    refreshEndpoint: '/auth/refresh',
    loginEndpoint: '/auth/login',
  },
} as const

/**
 * Get API base URL from environment or use default
 */
export const getApiBaseUrl = (): string => {
  // In React Native with Expo, environment variables should be accessed through app.json/app.config.js
  // For now, using the default URL
  return process.env.EXPO_PUBLIC_API_URL || API_CONFIG.DEFAULT_BASE_URL
}

/**
 * Check if we're in development environment
 */
export const isDevelopment = (): boolean => {
  return __DEV__
}

/**
 * Get request timeout value
 */
export const getRequestTimeout = (): number => {
  return API_CONFIG.TIMEOUT
}

/**
 * Get retry configuration
 */
export const getRetryConfig = () => {
  return API_CONFIG.RETRY_CONFIG
}

/**
 * Get auth configuration
 */
export const getAuthConfig = () => {
  return API_CONFIG.AUTH
}

export default API_CONFIG
