import React from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MapScreen() {
  const { t } = useTranslation()

  return (
    <SafeAreaView className="flex-1 bg-neutral-off-white">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4 border-b border-neutral-light-gray">
          <View className="flex-row items-center">
            <Ionicons name="map" size={24} color="#A0D2DB" />
            <Text className="ml-2 text-xl font-bold font-quicksand text-neutral-dark-gray">
              {t('map.title', { defaultValue: 'Mapa' })}
            </Text>
          </View>
        </View>

        {/* Map Content Placeholder */}
        <View className="flex-1 items-center justify-center py-16">
          <View className="items-center space-y-4">
            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
              <Ionicons name="location" size={32} color="#FDFDFD" />
            </View>
            <Text className="text-lg font-bold font-quicksand text-neutral-dark-gray text-center">
              {t('map.coming_soon', { defaultValue: 'Próximamente' })}
            </Text>
            <Text className="text-sm font-nunito text-neutral-medium-gray text-center max-w-xs">
              {t('map.description', {
                defaultValue:
                  'Encuentra mascotas y refugios cerca de ti en nuestro mapa interactivo.',
              })}
            </Text>
          </View>
        </View>

        {/* Features Coming Soon */}
        <View className="space-y-4 pb-8">
          <Text className="text-lg font-bold font-quicksand text-neutral-dark-gray">
            {t('map.features', { defaultValue: 'Funcionalidades' })}
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center p-3 bg-secondary-light rounded-xl">
              <Ionicons name="location-outline" size={20} color="#A0D2DB" />
              <Text className="ml-3 font-nunito text-neutral-dark-gray">
                {t('map.feature_1', { defaultValue: 'Ubicación de refugios' })}
              </Text>
            </View>

            <View className="flex-row items-center p-3 bg-secondary-light rounded-xl">
              <Ionicons name="paw-outline" size={20} color="#A0D2DB" />
              <Text className="ml-3 font-nunito text-neutral-dark-gray">
                {t('map.feature_2', { defaultValue: 'Mascotas perdidas reportadas' })}
              </Text>
            </View>

            <View className="flex-row items-center p-3 bg-secondary-light rounded-xl">
              <Ionicons name="heart-outline" size={20} color="#A0D2DB" />
              <Text className="ml-3 font-nunito text-neutral-dark-gray">
                {t('map.feature_3', { defaultValue: 'Eventos de adopción' })}
              </Text>
            </View>

            <View className="flex-row items-center p-3 bg-secondary-light rounded-xl">
              <Ionicons name="business-outline" size={20} color="#A0D2DB" />
              <Text className="ml-3 font-nunito text-neutral-dark-gray">
                {t('map.feature_4', { defaultValue: 'Veterinarias cercanas' })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
