import React, { useState, useEffect, useCallback } from 'react'

import { LinearGradient } from 'expo-linear-gradient'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

import Button from '@/components/Button/Button'
import { ErrorInfo, RecoveryAction } from '@/lib/types/error-recovery'

interface ErrorScreenProps {
  error?: string | ErrorInfo
  onRetry?: () => void | Promise<void>
  onFallback?: () => void
  onGuestMode?: () => void
  isRecovering?: boolean
  recoveryActions?: RecoveryAction[]
}

export default function ErrorScreen({
  error,
  onRetry,
  onFallback,
  onGuestMode,
  isRecovering = false,
  recoveryActions,
}: ErrorScreenProps) {
  const [retryCount, setRetryCount] = useState(0)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  // Determine if error is an ErrorInfo object or string
  const errorInfo = typeof error === 'object' ? error : null
  const errorMessage =
    typeof error === 'string' ? error : errorInfo?.userFriendlyMessage || errorInfo?.message
  const handleRetry = useCallback(async () => {
    if (isRecovering) return

    setRetryCount(prev => prev + 1)

    if (onRetry) {
      try {
        await onRetry()
      } catch (retryError) {
        console.error('Retry failed:', retryError)
      }
    } else {
      // Default retry behavior - reload the app
      console.log('Retry requested')
    }
  }, [isRecovering, onRetry])

  const handleFallback = () => {
    if (onFallback) {
      onFallback()
    }
  }

  const handleGuestMode = () => {
    if (onGuestMode) {
      onGuestMode()
    }
  }

  const handleToggleTechnicalDetails = () => {
    setShowTechnicalDetails(!showTechnicalDetails)
  }

  // Get appropriate icon based on error type
  const getErrorIcon = () => {
    if (!errorInfo) return '⚠️'

    switch (errorInfo.type) {
      case 'network':
        return '📡'
      case 'font-loading':
        return '🎨'
      case 'storage':
        return '💾'
      case 'authentication':
        return '🔐'
      case 'permissions':
        return '🔒'
      case 'critical':
        return '🚨'
      default:
        return '⚠️'
    }
  }

  // Get error severity color
  const getSeverityColor = () => {
    if (!errorInfo) return '#A0D2DB'

    switch (errorInfo.severity) {
      case 'critical':
        return '#E74C3C'
      case 'high':
        return '#F39C12'
      case 'medium':
        return '#F1C40F'
      case 'low':
        return '#A0D2DB'
      default:
        return '#A0D2DB'
    }
  }

  // Auto-retry for certain error types
  useEffect(() => {
    if (errorInfo?.strategy === 'retry' && retryCount === 0 && !isRecovering) {
      const timer = setTimeout(() => {
        handleRetry()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [errorInfo?.strategy, retryCount, isRecovering, handleRetry])

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFDA63', '#FDFDFD', '#A0D2DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getErrorIcon()}</Text>
          {errorInfo?.severity === 'critical' && (
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor() }]}>
              <Text style={styles.severityText}>CRÍTICO</Text>
            </View>
          )}
        </View>
        <Text style={[styles.title, { color: getSeverityColor() }]}>
          {errorInfo?.type === 'network'
            ? '🌐 Sin Conexión'
            : errorInfo?.type === 'critical'
              ? '🚨 Error Crítico'
              : errorInfo?.type === 'authentication'
                ? '🔐 Error de Autenticación'
                : '¡Ups! Algo salió mal'}
        </Text>
        <Text style={styles.message}>
          {errorMessage || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
        </Text>
        {errorInfo && (
          <View style={styles.errorDetails}>
            <Text style={styles.errorType}>
              Tipo: {errorInfo.type} • Intento {errorInfo.retryCount + 1}/{errorInfo.maxRetries + 1}
            </Text>
            {errorInfo.context && (
              <Text style={styles.errorContext}>Contexto: {JSON.stringify(errorInfo.context)}</Text>
            )}
          </View>
        )}
        {isRecovering ? (
          <View style={styles.recoveryContainer}>
            <ActivityIndicator size="large" color="#A0D2DB" />
            <Text style={styles.recoveryText}>Recuperando...</Text>
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            {/* Custom recovery actions */}
            {recoveryActions?.map((action, index) => (
              <Button
                key={index}
                label={action.label}
                onPress={action.action}
                variant={action.isPrimary ? 'primary' : 'secondary'}
                className={`${action.isPrimary ? 'bg-primary' : 'bg-gray-200'} ${index > 0 ? 'mt-3' : 'mt-8'}`}
                textClassName={`${action.isPrimary ? '!text-neutral-off-white' : '!text-gray-700'} uppercase text-sm !font-bold`}
              />
            ))}

            {/* Default actions based on strategy */}
            {!recoveryActions && (
              <>
                {(errorInfo?.strategy === 'retry' ||
                  errorInfo?.strategy === 'retry-with-fallback' ||
                  !errorInfo) && (
                  <Button
                    label={retryCount > 0 ? `Reintentar (${retryCount + 1})` : 'Reintentar'}
                    onPress={handleRetry}
                    variant="primary"
                    className="!mt-8 bg-primary"
                    textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
                  />
                )}

                {errorInfo?.strategy === 'guest-mode' && (
                  <Button
                    label="Continuar como Invitado"
                    onPress={handleGuestMode}
                    variant="primary"
                    className="!mt-8 bg-primary"
                    textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
                  />
                )}

                {(errorInfo?.strategy === 'fallback-only' ||
                  errorInfo?.strategy === 'retry-with-fallback') && (
                  <Button
                    label="Usar Modo Básico"
                    onPress={handleFallback}
                    variant="secondary"
                    className="!mt-3 bg-gray-200"
                    textClassName="!text-gray-700 uppercase text-sm !font-bold"
                  />
                )}

                {errorInfo?.strategy === 'manual' && (
                  <Text style={styles.manualInstructions}>
                    Por favor, verifica los permisos de la aplicación en la configuración de tu
                    dispositivo.
                  </Text>
                )}

                {errorInfo?.strategy === 'reload' && (
                  <Text style={styles.reloadInstructions}>
                    La aplicación se reiniciará automáticamente...
                  </Text>
                )}
              </>
            )}
          </View>
        )}
        {/* Technical details toggle */}
        {errorInfo?.technicalDetails && (
          <View style={styles.technicalSection}>
            <Button
              label={showTechnicalDetails ? 'Ocultar Detalles' : 'Ver Detalles Técnicos'}
              onPress={handleToggleTechnicalDetails}
              variant="secondary"
              className="!mt-4 bg-transparent border border-gray-300"
              textClassName="!text-gray-600 text-xs !font-medium"
            />

            {showTechnicalDetails && (
              <View style={styles.technicalDetails}>
                <Text style={styles.technicalText}>{errorInfo.technicalDetails}</Text>
              </View>
            )}
          </View>
        )}{' '}
        <Text style={styles.supportText}>
          Si el problema persiste, contáctanos en soporte@petopia.app
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 24,
    position: 'relative',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
  },
  severityBadge: {
    position: 'absolute',
    top: -8,
    right: -16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E74C3C',
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Quicksand-Bold',
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#A0D2DB', // primary color
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontFamily: 'NunitoSans-Variable',
    color: '#666666', // neutral-dark-gray
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  errorDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    width: '100%',
  },
  errorType: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    color: '#666666',
    textAlign: 'center',
  },
  errorContext: {
    fontSize: 10,
    fontFamily: 'NunitoSans-Variable',
    color: '#999999',
    textAlign: 'center',
    marginTop: 4,
  },
  recoveryContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  recoveryText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    color: '#A0D2DB',
    textAlign: 'center',
    marginTop: 12,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  manualInstructions: {
    fontSize: 14,
    fontFamily: 'NunitoSans-Variable',
    color: '#666666',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  reloadInstructions: {
    fontSize: 14,
    fontFamily: 'NunitoSans-Variable',
    color: '#A0D2DB',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  technicalSection: {
    width: '100%',
    marginTop: 16,
  },
  technicalDetails: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    maxHeight: 150,
  },
  technicalText: {
    fontSize: 10,
    fontFamily: 'NunitoSans-Variable',
    color: '#ECF0F1',
    lineHeight: 14,
  },
  supportText: {
    fontSize: 14,
    fontFamily: 'NunitoSans-Variable',
    color: '#999999',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
})
