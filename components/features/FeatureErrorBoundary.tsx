import React, { useState } from 'react'

import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

import Button from '@/components/Button/Button'
import { ErrorInfo, RecoveryAction } from '@/lib/types/error-recovery'

interface FeatureErrorBoundaryProps {
  children: React.ReactNode
  errorInfo?: ErrorInfo
  fallbackComponent?: React.ComponentType<any>
  onRetry?: () => void | Promise<void>
  onFallback?: () => void
  customActions?: RecoveryAction[]
}

export default function FeatureErrorBoundary({
  children,
  errorInfo,
  fallbackComponent: FallbackComponent,
  onRetry,
  onFallback,
  customActions,
}: FeatureErrorBoundaryProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  if (!errorInfo) {
    return <>{children}</>
  }

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return

    setIsRetrying(true)
    try {
      await onRetry()
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleFallback = () => {
    if (onFallback) {
      onFallback()
    }
  }

  // Show fallback component if available and strategy suggests it
  if (
    FallbackComponent &&
    (errorInfo.strategy === 'fallback-only' || errorInfo.strategy === 'retry-with-fallback')
  ) {
    return <FallbackComponent />
  }

  // For low severity errors, show inline error message
  if (errorInfo.severity === 'low' || errorInfo.severity === 'medium') {
    return (
      <View style={styles.inlineError}>
        <View style={styles.errorContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <View style={styles.errorText}>
            <Text style={styles.errorTitle}>
              {errorInfo.type === 'network' ? 'Error de conexión' : 'Error temporal'}
            </Text>
            <Text style={styles.errorMessage}>{errorInfo.userFriendlyMessage}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {isRetrying ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#A0D2DB" />
              <Text style={styles.loadingText}>Reintentando...</Text>
            </View>
          ) : (
            <>
              {customActions?.map((action, index) => (
                <Button
                  key={index}
                  label={action.label}
                  onPress={action.action}
                  variant={action.isPrimary ? 'primary' : 'secondary'}
                  className={`${action.isPrimary ? 'bg-primary' : 'bg-gray-200'} !px-3 !py-2 ${index > 0 ? 'ml-2' : ''}`}
                  textClassName={`${action.isPrimary ? '!text-white' : '!text-gray-700'} text-xs !font-medium`}
                />
              ))}

              {!customActions && (
                <>
                  {(errorInfo.strategy === 'retry' ||
                    errorInfo.strategy === 'retry-with-fallback') && (
                    <Button
                      label="Reintentar"
                      onPress={handleRetry}
                      variant="primary"
                      className="bg-primary !px-3 !py-2"
                      textClassName="!text-white text-xs !font-medium"
                    />
                  )}

                  {(errorInfo.strategy === 'fallback-only' ||
                    errorInfo.strategy === 'retry-with-fallback') && (
                    <Button
                      label="Modo básico"
                      onPress={handleFallback}
                      variant="secondary"
                      className="bg-gray-200 !px-3 !py-2 ml-2"
                      textClassName="!text-gray-700 text-xs !font-medium"
                    />
                  )}
                </>
              )}
            </>
          )}
        </View>
      </View>
    )
  }

  // For high/critical errors, show full error screen
  return (
    <View style={styles.fullError}>
      <View style={styles.fullErrorContent}>
        <Text style={styles.fullErrorIcon}>🚨</Text>
        <Text style={styles.fullErrorTitle}>Error crítico</Text>
        <Text style={styles.fullErrorMessage}>{errorInfo.userFriendlyMessage}</Text>

        {isRetrying ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A0D2DB" />
            <Text style={styles.loadingText}>Recuperando...</Text>
          </View>
        ) : (
          <View style={styles.fullErrorActions}>
            {customActions?.map((action, index) => (
              <Button
                key={index}
                label={action.label}
                onPress={action.action}
                variant={action.isPrimary ? 'primary' : 'secondary'}
                className={`${action.isPrimary ? 'bg-primary' : 'bg-gray-200'} ${index > 0 ? 'mt-3' : 'mt-6'}`}
                textClassName={`${action.isPrimary ? '!text-white' : '!text-gray-700'} uppercase text-sm !font-bold`}
              />
            ))}

            {!customActions && errorInfo.strategy === 'retry' && (
              <Button
                label="Reintentar"
                onPress={handleRetry}
                variant="primary"
                className="bg-primary mt-6"
                textClassName="!text-white uppercase text-sm !font-bold"
              />
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inlineError: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFEAA7',
    borderRadius: 8,
    padding: 12,
    margin: 16,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#D68910',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 12,
    fontFamily: 'NunitoSans-Variable',
    color: '#B7950B',
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    color: '#A0D2DB',
    marginLeft: 8,
  },
  fullError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FDFDFD',
  },
  fullErrorContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  fullErrorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  fullErrorTitle: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 12,
  },
  fullErrorMessage: {
    fontSize: 16,
    fontFamily: 'NunitoSans-Variable',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  fullErrorActions: {
    width: '100%',
    alignItems: 'center',
  },
})
