import React from 'react'

import { LinearGradient } from 'expo-linear-gradient'
import { View, Text, StyleSheet } from 'react-native'

import Button from '@/components/Button/Button'

interface ErrorScreenProps {
  error?: string
  onRetry?: () => void
}

export default function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      // Default retry behavior - reload the app
      // This could trigger a complete app restart
      console.log('Retry requested')
    }
  }

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
          <Text style={styles.icon}>⚠️</Text>
        </View>

        <Text style={styles.title}>¡Ups! Algo salió mal</Text>

        <Text style={styles.message}>
          {error || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
        </Text>

        <Button
          label="Reintentar"
          onPress={handleRetry}
          variant="primary"
          className="!mt-8 bg-primary"
          textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
        />

        <Text style={styles.supportText}>
          Si el problema persiste, contáctanos en soporte@zooki.app
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
  },
  icon: {
    fontSize: 64,
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
  supportText: {
    fontSize: 14,
    fontFamily: 'NunitoSans-Variable',
    color: '#999999',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
})
