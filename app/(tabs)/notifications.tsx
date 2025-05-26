import React from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import { View, Text, ScrollView, Pressable } from 'react-native'

import { Container } from '@/components/containers/Container'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'recommendation' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  icon: string
  iconColor: string
}

export default function NotificationsScreen() {
  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      title: 'Nuevo me gusta',
      message: 'A María le gustó tu foto del parque',
      time: 'Hace 2 horas',
      read: false,
      icon: 'heart',
      iconColor: '#F47C7C',
    },
    {
      id: '2',
      type: 'comment',
      title: 'Nuevo comentario',
      message: 'Carlos comentó en tu publicación sobre consejos',
      time: 'Hace 4 horas',
      read: false,
      icon: 'chatbubble',
      iconColor: '#A0D2DB',
    },
    {
      id: '3',
      type: 'follow',
      title: 'Nuevo seguidor',
      message: 'Ana ahora te sigue',
      time: 'Ayer',
      read: true,
      icon: 'person-add',
      iconColor: '#C8E6C9',
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Lugar recomendado',
      message: 'Descubre un nuevo parque pet-friendly cerca de ti',
      time: 'Hace 2 días',
      read: true,
      icon: 'location',
      iconColor: '#FFDA63',
    },
    {
      id: '5',
      type: 'system',
      title: 'Bienvenido a Zooki',
      message: 'Completa tu perfil para obtener mejores recomendaciones',
      time: 'Hace 3 días',
      read: true,
      icon: 'information-circle',
      iconColor: '#F8B595',
    },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Container className="flex-1 bg-neutral-off-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-3xl font-bold text-neutral-dark-gray font-quicksand">
              Notificaciones
            </Text>
            {unreadCount > 0 && (
              <View className="bg-accent-coral rounded-full px-3 py-1">
                <Text className="text-neutral-off-white font-nunito font-bold text-sm">
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          {notifications.length === 0 ? (
            <View className="bg-neutral-light-gray rounded-xl p-8 items-center">
              <Ionicons name="notifications-off" size={48} color="#BDBDBD" />
              <Text className="text-neutral-medium-gray font-nunito text-center mt-4 text-lg">
                No tienes notificaciones
              </Text>
              <Text className="text-neutral-medium-gray font-nunito text-center mt-2">
                Cuando tengas actividad nueva, aparecerá aquí
              </Text>
            </View>
          ) : (
            <View>
              {notifications.map(notification => (
                <Pressable
                  key={notification.id}
                  className={`${
                    !notification.read ? 'bg-primary/5' : 'bg-neutral-off-white'
                  } border border-neutral-light-gray rounded-xl p-4 mb-3 flex-row items-start`}
                >
                  <View className="mr-4 mt-1">
                    <Ionicons
                      name={notification.icon as any}
                      size={24}
                      color={notification.iconColor}
                    />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text className="text-neutral-dark-gray font-quicksand font-semibold flex-1">
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View className="bg-primary rounded-full w-2 h-2 ml-2 mt-2" />
                      )}
                    </View>

                    <Text className="text-neutral-dark-gray font-nunito mb-2">
                      {notification.message}
                    </Text>

                    <Text className="text-neutral-medium-gray font-nunito text-sm">
                      {notification.time}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {notifications.length > 0 && (
            <Pressable className="mt-6 p-4 border border-neutral-medium-gray rounded-xl">
              <Text className="text-primary font-nunito font-semibold text-center">
                Marcar todas como leídas
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </Container>
  )
}
