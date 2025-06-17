import { View, Text } from 'react-native'

import SettingsItem from '@/features/settings/components/SettingsItem'
import { useSettingsActions } from '@/features/settings/hooks/useSettingsActions'

export default function InfoSection() {
  const { handleHelp, handlePrivacy, handleAppInfo } = useSettingsActions()

  return (
    <View>
      <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-3">
        Centro de información
      </Text>

      <SettingsItem
        title="Ayuda"
        subtitle="Centro de ayuda y preguntas frecuentes"
        icon="help-circle-outline"
        iconColor="#A0D2DB"
        onPress={handleHelp}
      />

      <SettingsItem
        title="Privacidad"
        subtitle="Política de privacidad y términos de uso"
        icon="shield-outline"
        iconColor="#F8B595"
        onPress={handlePrivacy}
      />

      <SettingsItem
        title="Información de la app"
        subtitle="Versión, créditos y más información"
        icon="information-circle-outline"
        iconColor="#BDBDBD"
        onPress={handleAppInfo}
      />
    </View>
  )
}
