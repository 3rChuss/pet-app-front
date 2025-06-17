import { View, ScrollView, SafeAreaView } from 'react-native'

import { Container } from '@/components/containers/Container'
import { AccountSection, AppSection, InfoSection } from '@/features/settings/components'

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-off-white">
      <Container className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-4">
            <AppSection />
            <View className="h-4" />
            <InfoSection />
            <View className="h-4" />
            <AccountSection />
            <View className="h-8" />
          </View>
        </ScrollView>
      </Container>
    </SafeAreaView>
  )
}
