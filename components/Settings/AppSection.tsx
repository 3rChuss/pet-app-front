import { View, Text } from 'react-native'

import { useSettingsActions } from '@/lib/hooks/useSettingsActions'

import SettingsItem from './SettingsItem'

export default function AppSection() {
  const { handlePermissions, handleNotifications } = useSettingsActions()

  return (
    <View>
      <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-3">
        Aplicación
      </Text>

      <SettingsItem
        title="Permisos"
        subtitle="Configurar permisos de cámara, ubicación y notificaciones"
        icon="shield-checkmark-outline"
        iconColor="#C8E6C9"
        onPress={handlePermissions}
      />

      <SettingsItem
        title="Notificaciones"
        subtitle="Personaliza qué notificaciones quieres recibir"
        icon="notifications-outline"
        iconColor="#FFDA63"
        onPress={handleNotifications}
      />
    </View>
  )
}
