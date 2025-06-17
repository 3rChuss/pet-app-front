import { useRouter } from 'expo-router'
import { View, Text } from 'react-native'

import { useAuth } from '@/lib/auth'
import { useNotifications } from '@/lib/context/NotificationProvider'

import SettingsItem from './SettingsItem'

export default function AccountSection() {
  const router = useRouter()
  const signOut = useAuth.use.signOut()
  const { showErrorModal } = useNotifications()

  const handleLogout = () => {
    showErrorModal('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', 'medium', {
      actionText: 'Cerrar sesión',
      cancelText: 'Cancelar',
      onAction: async () => {
        try {
          await signOut()
          router.replace('/(auth)/login')
        } catch (error) {
          console.error('Error signing out:', error)
        }
      },
    })
  }

  return (
    <View>
      <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-3">
        Cuenta
      </Text>

      <SettingsItem
        title="Cerrar sesión"
        icon="log-out-outline"
        iconColor="#F47C7C"
        onPress={handleLogout}
        showChevron={false}
        destructive
      />
    </View>
  )
}
