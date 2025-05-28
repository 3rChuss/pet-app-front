// Error Recovery System Types

export type ErrorType =
  | 'network'
  | 'font-loading'
  | 'storage'
  | 'authentication'
  | 'permissions'
  | 'initialization'
  | 'critical'
  | 'unknown'

export type RecoveryStrategy =
  | 'retry'
  | 'retry-with-fallback'
  | 'fallback-only'
  | 'reload'
  | 'guest-mode'
  | 'manual'

export interface ErrorInfo {
  type: ErrorType
  code?: string
  message: string
  originalError?: Error
  context?: Record<string, any>
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  retryCount: number
  maxRetries: number
  strategy: RecoveryStrategy
  userFriendlyMessage: string
  technicalDetails?: string
}

export interface RecoveryAction {
  label: string
  action: () => void | Promise<void>
  isPrimary?: boolean
  isDestructive?: boolean
}

export interface ErrorRecoveryState {
  error: ErrorInfo | null
  isRecovering: boolean
  lastRecoveryAttempt?: number
  fallbackActivated: boolean
  offlineMode: boolean
}

export interface NetworkStatus {
  isConnected: boolean
  isInternetReachable: boolean
  type: string | null
}

export interface RetryOptions {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
  timeout?: number
}
