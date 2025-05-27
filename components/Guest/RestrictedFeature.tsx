import { ReactNode } from 'react'

import { View, Text, StyleSheet } from 'react-native'

import Button from '@/components/Button/Button'
import { GUEST_MODE_CONFIG } from '@/lib/const/mockData'
import { useGuestModeContext } from '@/lib/context/GuestModeContext'

interface RestrictedFeatureProps {
  children: ReactNode
  feature: string
  fallback?: ReactNode
}

export default function RestrictedFeature({ children, feature, fallback }: RestrictedFeatureProps) {
  const { isGuest, trackInteraction } = useGuestModeContext()
  const config = GUEST_MODE_CONFIG

  if (!isGuest) {
    return <>{children}</>
  }

  const isRestricted = config.restrictedFeatures.includes(feature)

  if (!isRestricted) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  // Default fallback for restricted features
  return (
    <View style={styles.restrictedContainer}>
      <Text style={styles.restrictedText} className="font-nunito">
        Función disponible solo para usuarios registrados
      </Text>
      <Button
        variant="primary"
        label="Crear cuenta gratis"
        onPress={() => trackInteraction(feature)}
        className="bg-primary mt-2"
        textClassName="!text-white text-sm"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  restrictedContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 8,
  },
  restrictedText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
})
