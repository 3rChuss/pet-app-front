import { useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View, Text, TextInput, ScrollView, Pressable, StatusBar } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { useApiError } from '@/lib/hooks/notifications'

export default function EditProfileScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { profile, updateProfile, isLoading } = useUserProfile()
  const { handleApiError, showSuccess } = useApiError()

  const [name, setName] = useState(profile?.name || '')
  const [lastName, setLastName] = useState(profile?.last_name || '')
  const [avatar, setAvatar] = useState(profile?.avatar || '')
  const [avatarFile, setAvatarFile] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Permisos y selección de imagen
  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      handleApiError(new Error('permissions.denied'), t('profile.edit.avatar_permission_denied'))
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets && result.assets[0]) {
      setAvatar(result.assets[0].uri)
      setAvatarFile(result.assets[0])
    }
  }

  //TODO: save  on blur
  const handleSave = async () => {
    setFormError(null)
    if (!name.trim()) {
      setFormError(t('profile.edit.name_required'))
      return
    }
    try {
      // Si hay avatar nuevo, súbelo primero (ejemplo, debes adaptar a tu API real)
      let avatarUrl = avatar
      if (avatarFile) {
        // Aquí deberías llamar a tu servicio de subida de archivos
        // avatarUrl = await ProfileService.uploadAvatar(avatarFile)
      }
      await updateProfile({ name, last_name: lastName, avatar: avatarUrl })
      showSuccess(t('profile.edit.success'))
      router.back()
    } catch (e) {
      handleApiError(e, t('profile.edit.error'))
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FDFDFD" />

      {/* Header con navegación */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-light-gray bg-white">
        <Pressable onPress={handleCancel} className="flex-row items-center">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>

        <Text className="text-lg font-quicksand font-bold text-neutral-dark-gray">
          {t('profile.edit.title')}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-8" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Avatar */}
        <View className="items-center mb-8">
          <Pressable
            className="w-28 h-28 rounded-full bg-neutral-light-gray items-center justify-center border-4 border-primary overflow-hidden"
            onPress={pickAvatar}
            disabled={isLoading}
          >
            {avatar ? (
              <Animated.Image
                source={{ uri: avatar }}
                className="w-28 h-28 rounded-full"
                entering={FadeInDown.duration(400)}
                resizeMode="cover"
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-neutral-light-gray items-center justify-center">
                <Animated.Text className="text-5xl text-primary font-quicksand">+</Animated.Text>
              </View>
            )}
            <View className="absolute bottom-2 right-2 bg-primary rounded-full p-2">
              <Ionicons name="camera" size={12} color="#FDFDFD" />
            </View>
          </Pressable>
          <Text className="text-sm text-neutral-medium-gray font-nunito mt-2 text-center">
            {t('profile.edit.avatar_help')}
          </Text>
        </View>

        {/* Formulario */}
        <View className="gap-4">
          <Text className="text-base font-nunito text-text-primary">{t('profile.edit.name')}</Text>
          <TextInput
            className="border border-neutral-light-gray rounded-lg px-4 py-3 bg-white font-nunito text-base"
            value={name}
            onChangeText={setName}
            placeholder={t('profile.edit.name_placeholder')}
            editable={!isLoading}
            autoCapitalize="words"
          />

          <Text className="text-base font-nunito text-text-primary">
            {t('profile.edit.last_name')}
          </Text>
          <TextInput
            className="border border-neutral-light-gray rounded-lg px-4 py-3 bg-white font-nunito text-base"
            value={lastName}
            onChangeText={setLastName}
            placeholder={t('profile.edit.last_name_placeholder')}
            editable={!isLoading}
            autoCapitalize="words"
          />

          {formError && (
            <Animated.Text
              className="text-accent-coral font-nunito text-base mt-2"
              entering={FadeInDown}
            >
              {formError}
            </Animated.Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
