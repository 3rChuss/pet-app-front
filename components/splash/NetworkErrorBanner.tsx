import React from 'react'

import { View, Text, StyleSheet } from 'react-native'

import Button from '@/components/Button/Button'
import { useErrorRecovery } from '@/lib/hooks/useErrorRecovery'

interface NetworkErrorBannerProps {
  onRetry?: () => void
  showDetails?: boolean
}

export default function NetworkErrorBanner({
  onRetry,
  showDetails = false,
}: NetworkErrorBannerProps) {
  const { networkStatus } = useErrorRecovery()

  if (networkStatus.isConnected && networkStatus.isInternetReachable) {
    return null
  }

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Text style={styles.icon}>📡</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Sin conexión</Text>
          {showDetails && (
            <Text style={styles.subtitle}>
              {!networkStatus.isConnected ? 'No hay conexión de red' : 'Sin acceso a internet'}
            </Text>
          )}
        </View>
        {onRetry && (
          <Button
            label="Reintentar"
            onPress={onRetry}
            variant="secondary"
            className="bg-white border border-orange-300 !px-3 !py-1"
            textClassName="!text-orange-600 text-xs !font-medium"
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3CD',
    borderBottomWidth: 1,
    borderBottomColor: '#FFEAA7',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#D68910',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'NunitoSans-Variable',
    color: '#B7950B',
    marginTop: 2,
  },
})
