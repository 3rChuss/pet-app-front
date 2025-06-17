import { View, Text } from 'react-native'

import SettingsItem from '@/features/settings/components/SettingsItem'
import { useNotifications } from '@/lib/context/NotificationProvider'

/**
 * Ejemplo de nueva sección para el sistema de configuración
 * Muestra cómo extender fácilmente la funcionalidad
 */
export default function PreferencesSection() {
  const { showToast, showErrorModal } = useNotifications()

  const handleTheme = () => {
    showErrorModal(
      'Tema de la aplicación',
      'Próximamente podrás elegir entre tema claro, oscuro o automático según tu preferencia.',
      'medium',
      {
        actionText: 'Entendido',
        hideCancel: true,
      }
    )
  }

  const handleLanguage = () => {
    showToast('Configuración de idioma próximamente disponible', 'info', 3000)
  }

  const handleUnits = () => {
    showErrorModal(
      'Unidades de medida',
      'Configura si prefieres mostrar distancias en kilómetros o millas, peso en kilogramos o libras.',
      'medium',
      {
        actionText: 'Entendido',
        hideCancel: true,
      }
    )
  }

  return (
    <View>
      <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-3">
        Preferencias
      </Text>

      <SettingsItem
        title="Tema"
        subtitle="Claro, oscuro o automático"
        icon="color-palette-outline"
        iconColor="#9C27B0"
        onPress={handleTheme}
      />

      <SettingsItem
        title="Idioma"
        subtitle="Español, English, Français..."
        icon="language-outline"
        iconColor="#FF9800"
        onPress={handleLanguage}
      />

      <SettingsItem
        title="Unidades"
        subtitle="Kilómetros, libras, celsius..."
        icon="calculator-outline"
        iconColor="#4CAF50"
        onPress={handleUnits}
      />
    </View>
  )
}
