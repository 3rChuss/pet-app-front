import React from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import { View, Text, ScrollView, Pressable } from 'react-native'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import { useGuestModeContext } from '@/lib/context/GuestModeContext'

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
  const { isGuest, trackInteraction } = useGuestModeContext()

  if (isGuest) {
    return (
      <Container className="flex-1 bg-neutral-off-white">
        <ScrollView className="flex-1">
          <View className="p-6">
            <Text className="text-3xl text-neutral-dark-gray font-quicksand-bold mb-6">
              Notificaciones
            </Text>

            {/* Guest State */}
            <View className="items-center justify-center flex-1 py-20">
              <View className="bg-gray-100 p-8 rounded-full mb-6">
                <Ionicons name="notifications-off" size={64} color="#BDBDBD" />
              </View>

              <Text className="text-xl text-neutral-dark-gray font-quicksand-semibold mb-3 text-center">
                Las notificaciones están deshabilitadas
              </Text>

              <Text className="text-neutral-medium-gray font-nunito text-center mb-6">
                Regístrate para recibir notificaciones sobre me gusta, comentarios, nuevos
                seguidores y más.
              </Text>

              <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <Text className="text-yellow-800 font-nunito text-center">
                  📱 <Text className="font-semibold">Vista previa de notificaciones</Text>
                  {'\n'}• Me gusta en tus publicaciones
                  {'\n'}• Comentarios y respuestas
                  {'\n'}• Nuevos seguidores
                  {'\n'}• Recomendaciones personalizadas
                </Text>
              </View>

              <Button
                label="Crear cuenta para recibir notificaciones"
                onPress={() => trackInteraction('notifications')}
                variant="primary"
                className="bg-primary"
                textClassName="!text-white"
              />
            </View>
          </View>
        </ScrollView>
      </Container>
    )
  }

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
      message: 'Descubre el parque canino cerca de ti',
      time: 'Hace 2 días',
      read: true,
      icon: 'location',
      iconColor: '#FFDA63',
    },
    {
      id: '5',
      type: 'system',
      title: 'Consejo del día',
      message: 'Tips para mantener a tu mascota hidratada en verano',
      time: 'Hace 3 días',
      read: true,
      icon: 'bulb',
      iconColor: '#F8B595',
    },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Container className="flex-1 bg-neutral-off-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-3xl text-neutral-dark-gray font-quicksand-bold">
              Notificaciones
            </Text>
            {unreadCount > 0 && (
              <View className="bg-accent-coral rounded-full px-3 py-1">
                <Text className="text-white font-nunito-bold text-sm">{unreadCount} nuevas</Text>
              </View>
            )}
          </View>

          {notifications.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="notifications-outline" size={64} color="#BDBDBD" />
              <Text className="text-xl text-neutral-dark-gray font-quicksand-semibold mt-4 mb-2">
                No hay notificaciones
              </Text>
              <Text className="text-neutral-medium-gray font-nunito text-center">
                Cuando tengas nuevas notificaciones aparecerán aquí
              </Text>
            </View>
          ) : (
            <View className="space-y-2">
              {notifications.map(notification => (
                <Pressable
                  key={notification.id}
                  className={`p-4 rounded-xl flex-row items-start ${
                    notification.read
                      ? 'bg-neutral-light-gray'
                      : 'bg-white border border-primary/20'
                  }`}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${notification.iconColor}20` }}
                  >
                    <Ionicons
                      name={notification.icon as any}
                      size={20}
                      color={notification.iconColor}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-neutral-dark-gray font-quicksand-semibold mb-1">
                      {notification.title}
                    </Text>
                    <Text className="text-neutral-medium-gray font-nunito mb-2">
                      {notification.message}
                    </Text>
                    <Text className="text-neutral-medium-gray font-nunito text-sm">
                      {notification.time}
                    </Text>
                  </View>

                  {!notification.read && <View className="w-3 h-3 bg-primary rounded-full mt-2" />}
                </Pressable>
              ))}
            </View>
          )}

          {unreadCount > 0 && (
            <View className="mt-6">
              <Pressable className="bg-neutral-light-gray rounded-xl p-4 items-center">
                <Text className="text-neutral-medium-gray font-nunito">
                  Marcar todas como leídas
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  )
}
