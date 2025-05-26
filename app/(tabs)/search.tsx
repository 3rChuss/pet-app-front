import { useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native'

import { Container } from '@/components/containers/Container'

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('')

  const searchCategories = [
    { id: 1, title: 'Lugares pet-friendly', icon: 'location', color: 'bg-primary/10' },
    { id: 2, title: 'Veterinarios', icon: 'medical', color: 'bg-accent-coral/10' },
    { id: 3, title: 'Parques y espacios', icon: 'leaf', color: 'bg-secondary-green/20' },
    { id: 4, title: 'Tiendas de mascotas', icon: 'storefront', color: 'bg-accent-yellow/20' },
    { id: 5, title: 'Otros dueños', icon: 'people', color: 'bg-secondary-coral/20' },
    { id: 6, title: 'Eventos', icon: 'calendar', color: 'bg-primary/15' },
  ]

  return (
    <Container className="flex-1 bg-neutral-off-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-neutral-dark-gray font-quicksand mb-6">
            Buscar
          </Text>

          {/* Search Input */}
          <View className="relative mb-6">
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="¿Qué estás buscando?"
              className="bg-neutral-light-gray border border-neutral-medium-gray rounded-xl p-4 pr-12 text-neutral-dark-gray font-nunito"
              placeholderTextColor="#BDBDBD"
            />
            <View className="absolute right-4 top-4">
              <Ionicons name="search" size={20} color="#BDBDBD" />
            </View>
          </View>

          {/* Search Categories */}
          <Text className="text-xl font-semibold text-neutral-dark-gray font-quicksand mb-4">
            Categorías
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {searchCategories.map(category => (
              <Pressable
                key={category.id}
                className={`${category.color} w-[48%] p-4 rounded-xl mb-4 flex-row items-center`}
              >
                <Ionicons
                  name={category.icon as any}
                  size={24}
                  color="#A0D2DB"
                  style={{ marginRight: 12 }}
                />
                <Text className="text-neutral-dark-gray font-nunito font-semibold flex-1">
                  {category.title}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Recent Searches */}
          <Text className="text-xl font-semibold text-neutral-dark-gray font-quicksand mb-4 mt-6">
            Búsquedas recientes
          </Text>

          <View className="bg-neutral-light-gray rounded-xl p-4">
            <Text className="text-neutral-medium-gray font-nunito text-center">
              No hay búsquedas recientes
            </Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}
