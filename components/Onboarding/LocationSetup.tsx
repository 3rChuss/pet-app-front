import React, { useState } from 'react'

import * as Location from 'expo-location'
import { MapPin } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet } from 'react-native'

import Button from '@/components/Button/Button'

type LocationError = 'permission_denied' | 'unavailable'

const ERROR_MESSAGE_KEYS: Record<LocationError, string> = {
  permission_denied: 'onboarding.location_permission_denied',
  unavailable: 'onboarding.location_unavailable',
}

interface LocationSetupProps {
  onLocationSet: (location: { enabled: boolean; city?: string; region?: string }) => void
  onSkip: () => void
  location?: {
    enabled: boolean
    city?: string
    region?: string
  }
}

// Devices without a recent fix, or with location services turned off, reject the
// current position request; the last known position is precise enough for the city.
async function getPosition() {
  try {
    return await Location.getCurrentPositionAsync()
  } catch {
    return Location.getLastKnownPositionAsync()
  }
}

// Reverse geocoding is not available on web or on devices without a geocoder, so the
// place name is optional and the location stays enabled without it.
async function getPlace(coords: Location.LocationObjectCoords) {
  try {
    const [address] = await Location.reverseGeocodeAsync(coords)
    return {
      city: address?.city || undefined,
      region: address?.region || address?.subregion || undefined,
    }
  } catch {
    return {}
  }
}

export default function LocationSetup({ onLocationSet, onSkip, location }: LocationSetupProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<LocationError | null>(null)

  // Runs only when the user taps the button: a denied permission is reported on screen
  // and never requested again on its own.
  const handleEnableLocation = async () => {
    setLoading(true)
    setError(null)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setError('permission_denied')
        return
      }

      const position = await getPosition()
      if (!position) {
        setError('unavailable')
        return
      }

      onLocationSet({ enabled: true, ...(await getPlace(position.coords)) })
    } catch (e) {
      console.warn('Location setup failed:', e)
      setError('unavailable')
    } finally {
      setLoading(false)
    }
  }

  const message = location?.enabled
    ? t('onboarding.location_set_text')
    : t(error ? ERROR_MESSAGE_KEYS[error] : 'onboarding.location_permission')
  const place = [location?.city, location?.region].filter(Boolean).join(', ')

  return (
    <View style={styles.container}>
      <View style={styles.locationIcon}>
        <MapPin size={36} strokeWidth={2} color="#fff" />
      </View>

      <Text
        style={styles.permission}
        className="font-nunito text-neutral-off-white text-center mb-8"
        aria-live="polite"
      >
        {message}
      </Text>

      <View style={styles.buttonContainer}>
        {location?.enabled ? (
          <Text className="text-center text-sm text-neutral-off-white">
            {place
              ? t('onboarding.location_enabled', { place })
              : t('onboarding.location_enabled_no_place')}
          </Text>
        ) : (
          <>
            <Button
              variant="primary"
              label={t('onboarding.location_enable')}
              onPress={handleEnableLocation}
              isLoading={loading}
              className="bg-white mb-4"
              textClassName="!text-primary !font-nunito-bold"
            />
            <Button
              variant="tertiary"
              label={t('onboarding.location_skip')}
              onPress={onSkip}
              textClassName="!text-neutral-off-white text-center"
            />
          </>
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
