import React, { useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import { View, Text, TextInput, ScrollView, Pressable, Alert } from 'react-native'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'

export default function CreateScreen() {
  const [postText, setPostText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const postCategories = [
    { id: 'tip', title: 'Consejo', icon: 'bulb', color: 'bg-accent-yellow/20' },
    { id: 'place', title: 'Lugar', icon: 'location', color: 'bg-primary/10' },
    { id: 'photo', title: 'Foto', icon: 'camera', color: 'bg-secondary-coral/20' },
    { id: 'question', title: 'Pregunta', icon: 'help-circle', color: 'bg-secondary-green/20' },
    { id: 'event', title: 'Evento', icon: 'calendar', color: 'bg-accent-coral/10' },
  ]

  const handlePublish = () => {
    if (!postText.trim()) {
      Alert.alert('Error', 'Escribe algo para publicar')
      return
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Selecciona una categoría')
      return
    }

    // Here you would handle the actual post creation
    Alert.alert('¡Éxito!', 'Tu publicación ha sido creada', [
      {
        text: 'OK',
        onPress: () => {
          setPostText('')
          setSelectedCategory('')
        },
      },
    ])
  }

  return (
    <Container className="flex-1 bg-neutral-off-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-neutral-dark-gray font-quicksand mb-6">
            Crear publicación
          </Text>

          {/* Post Text Input */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-3">
              ¿Qué quieres compartir?
            </Text>
            <TextInput
              value={postText}
              onChangeText={setPostText}
              placeholder="Escribe tu publicación aquí..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className="bg-neutral-light-gray border border-neutral-medium-gray rounded-xl p-4 text-neutral-dark-gray font-nunito min-h-[120px]"
              placeholderTextColor="#BDBDBD"
            />
          </View>

          {/* Category Selection */}
          <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-4">
            Categoría
          </Text>

          <View className="flex-row flex-wrap justify-between mb-6">
            {postCategories.map(category => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`${category.color} ${
                  selectedCategory === category.id
                    ? 'border-2 border-primary'
                    : 'border border-neutral-medium-gray'
                } w-[48%] p-4 rounded-xl mb-3 flex-row items-center`}
              >
                <Ionicons
                  name={category.icon as any}
                  size={24}
                  color={selectedCategory === category.id ? '#A0D2DB' : '#BDBDBD'}
                  style={{ marginRight: 12 }}
                />
                <Text
                  className={`font-nunito font-semibold flex-1 ${
                    selectedCategory === category.id ? 'text-primary' : 'text-neutral-dark-gray'
                  }`}
                >
                  {category.title}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Add Media Section */}
          <View className="border border-dashed border-neutral-medium-gray rounded-xl p-6 mb-6 items-center">
            <Ionicons name="image" size={48} color="#BDBDBD" />
            <Text className="text-neutral-medium-gray font-nunito text-center mt-2">
              Agregar fotos o videos
            </Text>
            <Text className="text-neutral-medium-gray font-nunito text-center text-sm mt-1">
              (Próximamente)
            </Text>
          </View>

          {/* Publish Button */}
          <Button
            label="Publicar"
            onPress={handlePublish}
            variant="primary"
            className="bg-primary"
            textClassName="text-neutral-off-white font-bold"
          />
        </View>
      </ScrollView>
    </Container>
  )
}
