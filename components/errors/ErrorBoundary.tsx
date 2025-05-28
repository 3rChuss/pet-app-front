import React, { Component, ErrorInfo as ReactErrorInfo, ReactNode } from 'react'

import { View, StyleSheet } from 'react-native'

import ErrorScreen from '@/components/splash/ErrorScreen'
import { ErrorInfo, ErrorType } from '@/lib/types/error-recovery'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: ErrorInfo) => void
  resetKeys?: (string | number)[]
  resetOnPropsChange?: boolean
}

interface State {
  hasError: boolean
  error: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Convert React error to our ErrorInfo format
    const errorInfo: ErrorInfo = {
      type: 'critical' as ErrorType,
      message: error.message,
      originalError: error,
      timestamp: Date.now(),
      severity: 'critical',
      retryCount: 0,
      maxRetries: 1,
      strategy: 'reload',
      userFriendlyMessage: 'Something went wrong with this feature',
      technicalDetails: error.stack,
      context: {
        componentStack: 'Error boundary caught this error',
      },
    }

    return {
      hasError: true,
      error: errorInfo,
    }
  }

  componentDidCatch(error: Error, errorInfo: ReactErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    if (this.props.onError && this.state.error) {
      this.props.onError({
        ...this.state.error,
        context: {
          ...this.state.error.context,
          componentStack: errorInfo.componentStack,
        },
      })
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys) {
        const hasResetKeyChanged = resetKeys.some((key, idx) => prevProps.resetKeys?.[idx] !== key)
        if (hasResetKeyChanged) {
          this.resetErrorBoundary()
        }
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary()
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
      })
    }, 100)
  }

  handleRetry = async () => {
    this.resetErrorBoundary()
  }

  handleReload = () => {
    // In React Native, we can't reload the app directly
    // This would need to be handled by the app's restart mechanism
    console.log('App reload requested from ErrorBoundary')
    this.resetErrorBoundary()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <View style={styles.container}>
          <ErrorScreen
            error={this.state.error || undefined}
            onRetry={this.handleRetry}
            recoveryActions={[
              {
                label: 'Reset Feature',
                action: this.resetErrorBoundary,
                isPrimary: true,
              },
              {
                label: 'Restart App',
                action: this.handleReload,
                isDestructive: true,
              },
            ]}
          />
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

export default ErrorBoundary
