import React from 'react'

import { View, Text, ScrollView } from 'react-native'

import { Container } from '@/components/containers/Container'

export default function HomeScreen() {
  return (
    <Container className="flex-1 bg-neutral-off-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-neutral-dark-gray font-quicksand mb-4">
            ¡Hola! 👋
          </Text>
          <Text className="text-lg text-neutral-dark-gray font-nunito mb-6">
            Bienvenido a Zooki, tu app para disfrutar con tu mejor amigo
          </Text>

          <View className="bg-primary/10 p-4 rounded-xl mb-4">
            <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-2">
              Feed de la comunidad
            </Text>
            <Text className="text-neutral-dark-gray font-nunito">
              Aquí aparecerán las publicaciones de otros dueños de mascotas, lugares pet-friendly, y
              más contenido de la comunidad.
            </Text>
          </View>

          <View className="bg-secondary-green p-4 rounded-xl mb-4">
            <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-2">
              Lugares cercanos
            </Text>
            <Text className="text-neutral-dark-gray font-nunito">
              Descubre parques, veterinarios, tiendas y otros lugares pet-friendly cerca de ti.
            </Text>
          </View>

          <View className="bg-accent-yellow/20 p-4 rounded-xl">
            <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-2">
              Consejos del día
            </Text>
            <Text className="text-neutral-dark-gray font-nunito">
              Tips y consejos para el cuidado de tu mascota, proporcionados por expertos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}
