import AsyncStorage from '@react-native-async-storage/async-storage'

import { ErrorInfo } from '@/lib/types/error-recovery'

const ERROR_STORAGE_KEY = '@petopia/error_reports'
const ERROR_ANALYTICS_KEY = '@petopia/error_analytics'
const MAX_STORED_ERRORS = 50

export interface ErrorAnalytics {
  totalErrors: number
  errorsByType: Record<string, number>
  errorsBySeverity: Record<string, number>
  lastErrorTimestamp: number
  averageRecoveryTime: number
  mostCommonErrors: { message: string; count: number }[]
}

export interface ErrorReport {
  error: ErrorInfo
  deviceInfo?: {
    platform: string
    version: string
    model?: string
  }
  appInfo?: {
    version: string
    buildNumber: string
    environment: string
  }
  userInfo?: {
    userId?: string
    isGuest: boolean
    sessionId: string
  }
}

class ErrorReportingService {
  private static instance: ErrorReportingService
  private isInitialized = false
  private errorQueue: ErrorReport[] = []

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService()
    }
    return ErrorReportingService.instance
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      // Process any queued errors from previous sessions
      await this.processQueuedErrors()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize error reporting service:', error)
    }
  }

  async reportError(error: ErrorInfo, context?: Partial<ErrorReport>): Promise<void> {
    const report: ErrorReport = {
      error: {
        ...error,
        timestamp: error.timestamp || Date.now(),
      },
      deviceInfo: {
        platform: 'react-native',
        version: '1.0.0', // Get from app version
        ...context?.deviceInfo,
      },
      appInfo: {
        version: '1.0.0',
        buildNumber: '1',
        environment: __DEV__ ? 'development' : 'production',
        ...context?.appInfo,
      },
      userInfo: {
        isGuest: true, // Default to guest, override with context
        sessionId: this.generateSessionId(),
        ...context?.userInfo,
      },
    }

    try {
      // Store error locally for analytics
      await this.storeErrorLocally(report)

      // Update analytics
      await this.updateAnalytics(error)

      // In production, you would send to your analytics service
      if (!__DEV__) {
        await this.sendToAnalyticsService(report)
      } else {
        console.log('Error Report (DEV):', report)
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
      // Queue for later if network is unavailable
      this.errorQueue.push(report)
    }
  }

  async getStoredErrors(): Promise<ErrorReport[]> {
    try {
      const stored = await AsyncStorage.getItem(ERROR_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to retrieve stored errors:', error)
      return []
    }
  }

  async getAnalytics(): Promise<ErrorAnalytics | null> {
    try {
      const stored = await AsyncStorage.getItem(ERROR_ANALYTICS_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Failed to retrieve error analytics:', error)
      return null
    }
  }

  async clearStoredErrors(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ERROR_STORAGE_KEY)
      await AsyncStorage.removeItem(ERROR_ANALYTICS_KEY)
    } catch (error) {
      console.error('Failed to clear stored errors:', error)
    }
  }

  private async storeErrorLocally(report: ErrorReport): Promise<void> {
    try {
      const stored = await this.getStoredErrors()
      const updated = [report, ...stored].slice(0, MAX_STORED_ERRORS)
      await AsyncStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to store error locally:', error)
    }
  }

  private async updateAnalytics(error: ErrorInfo): Promise<void> {
    try {
      const current = (await this.getAnalytics()) || {
        totalErrors: 0,
        errorsByType: {},
        errorsBySeverity: {},
        lastErrorTimestamp: 0,
        averageRecoveryTime: 0,
        mostCommonErrors: [],
      }

      const updated: ErrorAnalytics = {
        totalErrors: current.totalErrors + 1,
        errorsByType: {
          ...current.errorsByType,
          [error.type]: (current.errorsByType[error.type] || 0) + 1,
        },
        errorsBySeverity: {
          ...current.errorsBySeverity,
          [error.severity]: (current.errorsBySeverity[error.severity] || 0) + 1,
        },
        lastErrorTimestamp: error.timestamp,
        averageRecoveryTime: current.averageRecoveryTime, // TODO: Calculate based on retry times
        mostCommonErrors: this.updateMostCommonErrors(current.mostCommonErrors, error.message),
      }

      await AsyncStorage.setItem(ERROR_ANALYTICS_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to update analytics:', error)
    }
  }
  private updateMostCommonErrors(
    current: { message: string; count: number }[],
    newMessage: string
  ): { message: string; count: number }[] {
    const existing = current.find(item => item.message === newMessage)

    if (existing) {
      existing.count += 1
    } else {
      current.push({ message: newMessage, count: 1 })
    }

    return current.sort((a, b) => b.count - a.count).slice(0, 10) // Keep top 10
  }

  private async processQueuedErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return

    try {
      for (const report of this.errorQueue) {
        await this.sendToAnalyticsService(report)
      }
      this.errorQueue = []
    } catch (error) {
      console.error('Failed to process queued errors:', error)
    }
  }

  private async sendToAnalyticsService(report: ErrorReport): Promise<void> {
    // In a real implementation, this would send to your analytics service
    // For now, we'll just log it in development
    if (__DEV__) {
      console.log('Sending error report to analytics service:', {
        errorType: report.error.type,
        severity: report.error.severity,
        message: report.error.message,
        timestamp: report.error.timestamp,
        platform: report.deviceInfo?.platform,
        version: report.appInfo?.version,
      })
    }

    // Example implementation for a real service:
    // await fetch('https://your-analytics-service.com/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report),
    // })
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export default ErrorReportingService.getInstance()
