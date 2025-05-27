import React, { useState } from 'react'

import * as Location from 'expo-location'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, Alert } from 'react-native'

import Button from '@/components/Button/Button'

interface LocationSetupProps {
  onLocationSet: (location: { enabled: boolean; city?: string; region?: string }) => void
  location?: {
    enabled: boolean
    city?: string
    region?: string
  }
}

export default function LocationSetup({ onLocationSet, location }: LocationSetupProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleEnableLocation = async () => {
    setLoading(true)
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert(
          'Permisos de ubicación',
          'Para una mejor experiencia, permite el acceso a la ubicación en la configuración de tu dispositivo.',
          [{ text: 'Entendido', onPress: () => handleSkipLocation() }]
        )
        setLoading(false)
        return
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({})

      // Reverse geocode to get city/region
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })

      onLocationSet({
        enabled: true,
        city: address.city || undefined,
        region: address.region || address.subregion || undefined,
      })
    } catch (error) {
      console.error('Error getting location:', error)
      Alert.alert(
        'Error de ubicación',
        'No pudimos obtener tu ubicación. Puedes configurarla después.',
        [{ text: 'Entendido', onPress: () => handleSkipLocation() }]
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSkipLocation = () => {
    onLocationSet({ enabled: false })
  }

  return (
    <View style={styles.container}>
      <View style={styles.locationIcon}>
        <Text style={styles.emoji}>📍</Text>
      </View>

      <Text
        style={styles.permission}
        className="font-nunito text-neutral-off-white text-center mb-8"
      >
        {t('onboarding.location_permission')}
      </Text>

      <View style={styles.buttonContainer}>
        {!location?.enabled && (
          <Button
            variant="primary"
            label={t('onboarding.location_enable')}
            onPress={handleEnableLocation}
            isLoading={loading}
            className="bg-white mb-4"
            textClassName="!text-primary !font-bold"
          />
        )}
        {!location?.enabled ? (
          <Text className="text-center" onPress={handleSkipLocation}>
            {t('onboarding.location_skip')}
          </Text>
        ) : (
          <Text className="text-center text-sm">
            {t('onboarding.location_enabled', {
              city: location.city || 'tu ubicación',
              region: location.region || '',
            })}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  emoji: {
    fontSize: 32,
  },
  permission: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
})
