import React from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import { View, Text, ScrollView, Pressable } from 'react-native'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'

export default function ProfileScreen() {
  const userStats = {
    posts: 24,
    followers: 156,
    following: 89,
  }

  const menuItems = [
    { id: 1, title: 'Editar perfil', icon: 'person-outline', color: '#A0D2DB' },
    { id: 2, title: 'Mis mascotas', icon: 'paw', color: '#F8B595' },
    { id: 3, title: 'Lugares favoritos', icon: 'heart-outline', color: '#F47C7C' },
    { id: 4, title: 'Configuración', icon: 'settings-outline', color: '#C8E6C9' },
    { id: 5, title: 'Ayuda y soporte', icon: 'help-circle-outline', color: '#FFDA63' },
    { id: 6, title: 'Acerca de', icon: 'information-circle-outline', color: '#BDBDBD' },
  ]

  return (
    <Container className="flex-1 bg-neutral-off-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Profile Header */}
          <View className="items-center mb-8">
            <View className="relative mb-4">
              <View className="w-24 h-24 bg-neutral-light-gray rounded-full items-center justify-center">
                <Ionicons name="person" size={48} color="#BDBDBD" />
              </View>
              <Pressable className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
                <Ionicons name="camera" size={16} color="#FDFDFD" />
              </Pressable>
            </View>

            <Text className="text-2xl font-bold text-neutral-dark-gray font-quicksand mb-2">
              Usuario de Zooki
            </Text>
            <Text className="text-neutral-medium-gray font-nunito text-center">
              Amante de los animales 🐕 🐱
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row justify-around bg-neutral-light-gray rounded-xl p-4 mb-6">
            <View className="items-center">
              <Text className="text-2xl font-bold text-neutral-dark-gray font-quicksand">
                {userStats.posts}
              </Text>
              <Text className="text-neutral-medium-gray font-nunito">Publicaciones</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-neutral-dark-gray font-quicksand">
                {userStats.followers}
              </Text>
              <Text className="text-neutral-medium-gray font-nunito">Seguidores</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-neutral-dark-gray font-quicksand">
                {userStats.following}
              </Text>
              <Text className="text-neutral-medium-gray font-nunito">Siguiendo</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row space-x-3 mb-6">
            <Button
              label="Editar perfil"
              onPress={() => {}}
              variant="secondary"
              className="flex-1 border-primary"
              textClassName="text-primary"
            />
            <Pressable className="bg-primary rounded-xl p-3 items-center justify-center">
              <Ionicons name="share-outline" size={20} color="#FDFDFD" />
            </Pressable>
          </View>

          {/* Menu Items */}
          <View className="space-y-2">
            {menuItems.map(item => (
              <Pressable
                key={item.id}
                className="flex-row items-center p-4 bg-neutral-off-white border border-neutral-light-gray rounded-xl"
              >
                <View className="mr-4">
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text className="flex-1 text-neutral-dark-gray font-nunito font-medium">
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
              </Pressable>
            ))}
          </View>

          {/* Sign Out Button */}
          <View className="mt-8 mb-4">
            <Button
              label="Cerrar sesión"
              onPress={() => {}}
              variant="outline"
              className="border-accent-coral"
              textClassName="text-accent-coral"
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}
