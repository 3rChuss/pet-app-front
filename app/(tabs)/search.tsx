import { useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import { View, Text, TextInput, ScrollView, Pressable, Image } from 'react-native'

import { Container } from '@/components/containers/Container'
import RestrictedFeature from '@/components/Guest/RestrictedFeature'
import { MOCK_PROFILES } from '@/lib/const/mockData'
import { useGuestModeContext } from '@/lib/context/GuestModeContext'

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('')
  const { isGuest, trackInteraction } = useGuestModeContext()
  const mockProfiles = MOCK_PROFILES

  const searchCategories = [
    { id: 1, title: 'Lugares pet-friendly', icon: 'location', color: 'bg-primary/10' },
    { id: 2, title: 'Veterinarios', icon: 'medical', color: 'bg-accent-coral/10' },
    { id: 3, title: 'Parques y espacios', icon: 'leaf', color: 'bg-secondary-green/20' },
    { id: 4, title: 'Tiendas de mascotas', icon: 'storefront', color: 'bg-accent-yellow/20' },
    { id: 5, title: 'Otros dueños', icon: 'people', color: 'bg-secondary-coral/20' },
    { id: 6, title: 'Eventos', icon: 'calendar', color: 'bg-primary/15' },
  ]

  if (isGuest) {
    return (
      <Container className="flex-1 bg-neutral-off-white">
        <ScrollView className="flex-1">
          <View className="p-6">
            <Text className="text-3xl font-bold text-neutral-dark-gray font-quicksand mb-6">
              Buscar
            </Text>

            {/* Search Input - Disabled for guests */}
            <View className="relative mb-6">
              <TextInput
                value=""
                placeholder="Regístrate para buscar..."
                className="bg-neutral-light-gray border border-neutral-medium-gray rounded-xl p-4 pr-12 text-neutral-dark-gray font-nunito opacity-50"
                placeholderTextColor="#BDBDBD"
                editable={false}
                onTouchStart={() => trackInteraction('search')}
              />
              <View className="absolute right-4 top-4">
                <Ionicons name="search" size={20} color="#BDBDBD" />
              </View>
            </View>

            {/* Guest Message */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <Text className="text-blue-800 font-nunito text-center">
                🔍 <Text className="font-semibold">Búsqueda limitada en modo invitado</Text>
                {'\n'}Regístrate para acceder a búsquedas completas y filtros avanzados
              </Text>
            </View>

            {/* Preview Categories */}
            <Text className="text-xl font-semibold text-neutral-dark-gray font-quicksand mb-4">
              Categorías disponibles (vista previa)
            </Text>

            <View className="flex-row flex-wrap justify-between">
              {searchCategories.map(category => (
                <Pressable
                  key={category.id}
                  className={`${category.color} w-[48%] p-4 rounded-xl mb-4 flex-row items-center opacity-60`}
                  onPress={() => trackInteraction('search')}
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

            {/* Sample Users Preview */}
            <Text className="text-xl font-semibold text-neutral-dark-gray font-quicksand mb-4 mt-6">
              Usuarios destacados
            </Text>

            <View className="space-y-3">
              {mockProfiles.slice(0, 3).map(profile => (
                <Pressable
                  key={profile.id}
                  className="bg-white p-4 rounded-xl flex-row items-center"
                  onPress={() => trackInteraction('follow')}
                >
                  <Image
                    source={{ uri: profile.avatar }}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    className="mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-semibold text-neutral-dark-gray font-quicksand">
                      {profile.name}
                    </Text>
                    <Text className="text-neutral-medium-gray font-nunito text-sm">
                      📍 {profile.location} • {profile.stats.followersCount} seguidores
                    </Text>
                  </View>
                  <View className="bg-primary/10 px-3 py-1 rounded-lg">
                    <Text className="text-primary font-nunito text-sm">Ver perfil</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* CTA to Register */}
            <RestrictedFeature
              feature="search"
              fallback={
                <View className="bg-primary/10 p-6 rounded-xl mt-6">
                  <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-2 text-center">
                    ¡Descubre más con tu cuenta! 🔍
                  </Text>
                  <Text className="text-neutral-medium-gray font-nunito text-center mb-4">
                    Regístrate gratis para acceder a búsquedas completas, filtros avanzados y
                    conectar con otros usuarios.
                  </Text>
                </View>
              }
            >
              <View />
            </RestrictedFeature>
          </View>
        </ScrollView>
      </Container>
    )
  }

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
