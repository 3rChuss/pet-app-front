import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import Animated from 'react-native-reanimated'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import { useFeed } from '@/features/feed/hooks/useFeed'
import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { MOCK_PROFILES } from '@/lib/const/mockData'
import { useGuestModeContext } from '@/lib/context/GuestModeContext'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export default function ProfileScreen() {
  const { t } = useTranslation()
  const { isGuest, trackInteraction } = useGuestModeContext()

  // Profile management
  const {
    profile,
    isLoading: profileLoading,
    displayName,
    avatarUrl,
    isVerified,
    fetchProfile,
  } = useUserProfile({
    autoFetch: !isGuest,
  })

  // User's posts feed
  const {
    posts: userPosts,
    isLoading: feedLoading,
    isRefreshing,
    refresh,
    isEmpty: noPostsYet,
  } = useFeed({
    autoFetch: false, // We'll fetch user-specific feed later
  })

  // Mock profile for guest mode
  const guestProfile = MOCK_PROFILES[0]

  // Calculate stats
  const userStats = profile
    ? profile.stats
    : {
        posts: 24,
        followers: 156,
        following: 89,
      }

  const handleRefresh = () => {
    if (isGuest) return

    fetchProfile()
    refresh()
  }

  if (isGuest) {
    return (
      <Container className="flex-1 bg-neutral-off-white">
        <ScrollView className="flex-1">
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Pressable
                onPress={() => trackInteraction('selectPet')}
                className="flex-row items-center bg-primary/10 px-4 py-2 rounded-full"
              >
                <Ionicons name="paw" size={20} color="#0077BE" />
                <Text className="ml-2 text-primary font-nunito">Seleccionar mascota</Text>
              </Pressable>
            </View>
            <View className="items-center mb-6">
              <Image
                source={{ uri: guestProfile.avatar }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                className="mb-4"
              />
              <Text className="text-2xl font-bold text-neutral-dark-gray font-quicksand">
                {guestProfile.name}
              </Text>
              <Text className="text-neutral-medium-gray font-nunito text-center mb-2">
                {guestProfile.bio}
              </Text>
              <Text className="text-neutral-medium-gray font-nunito">
                📍 {guestProfile.location}
              </Text>
            </View>

            {/* Stats */}
            <View className="flex-row justify-around bg-white p-4 rounded-xl mb-6">
              <View className="items-center">
                <Text className="text-xl font-bold text-neutral-dark-gray font-quicksand">
                  {guestProfile.stats.posts}
                </Text>
                <Text className="text-neutral-medium-gray font-nunito">Publicaciones</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-neutral-dark-gray font-quicksand">
                  {guestProfile.stats.followers}
                </Text>
                <Text className="text-neutral-medium-gray font-nunito">Seguidores</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-neutral-dark-gray font-quicksand">
                  {guestProfile.stats.following}
                </Text>
                <Text className="text-neutral-medium-gray font-nunito">Siguiendo</Text>
              </View>
            </View>

            {/* Pets Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-3">
                Sus mascotas 🐾
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {guestProfile.pets.map((pet, index) => (
                  <View key={index} className="mr-4 items-center">
                    <Image
                      source={{ uri: pet.image }}
                      style={{ width: 80, height: 80, borderRadius: 40 }}
                      className="mb-2"
                    />
                    <Text className="text-sm font-medium text-neutral-dark-gray font-nunito">
                      {pet.name}
                    </Text>
                    <Text className="text-xs text-neutral-medium-gray font-nunito">
                      {pet.type} • {pet.age}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* CTA to Register */}
            <View className="bg-primary/10 p-6 rounded-xl mb-6">
              <Text className="text-lg font-semibold text-neutral-dark-gray font-quicksand mb-2 text-center">
                ¡Crea tu perfil ahora! 🎉
              </Text>
              <Text className="text-neutral-medium-gray font-nunito text-center mb-4">
                Regístrate gratis para personalizar tu perfil, subir fotos de tu mascota y conectar
                con la comunidad.
              </Text>
              <Button
                label="Crear cuenta gratis"
                onPress={() => trackInteraction('profile')}
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

  return (
    <Container className="flex-1 bg-neutral-off-white">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#0077BE"
            colors={['#0077BE']}
          />
        }
      >
        {/* Header with Settings */}
        <View className="flex-1 bg-neutral-off-white flex-row items-center justify-between px-2 pt-2">
          <Pressable
            onPress={() => trackInteraction('selectPet')}
            className="flex-row items-center px-4 py-2 rounded-full justify-start"
          >
            <Ionicons name="paw" size={20} color="#0077BE" />
            <Text className="ml-2 mr-1 text-primary font-nunito">Tinkiwinki</Text>
            <Ionicons name="chevron-down" size={14} color="#0077BE" className="pt-1" />
          </Pressable>
          <AnimatedTouchableOpacity
            onPress={() => router.push('/settings')}
            className="flex-row items-center px-4 py-2 rounded-full justify-start"
          >
            <Ionicons name="list-outline" size={26} color="#0077BE" />
          </AnimatedTouchableOpacity>
        </View>

        {/* Profile Header */}
        <View className="p-6">
          <View className="items-start flex-row">
            <View className="relative">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                />
              ) : (
                <View className="w-24 h-24 bg-neutral-light-gray rounded-full items-center justify-center">
                  <Ionicons name="person" size={48} color="#BDBDBD" />
                </View>
              )}
              <Pressable className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
                <Ionicons name="camera" size={16} color="#FDFDFD" />
              </Pressable>
            </View>

            <View className="flex-1 ml-4 items-start justify-center">
              <View className="items-start mb-4">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-2xl font-bold text-neutral-dark-gray">{displayName}</Text>
                  {isVerified && <Ionicons name="checkmark-circle" size={20} color="#0077BE" />}
                </View>

                {profile?.bio && (
                  <Text className="text-neutral-medium-gray font-nunito text-start pr-4 mb-2">
                    {profile.bio}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row mb-4 gap-4 justify-start items-start">
            <View className="items-center flex-row gap-1">
              <Text className="text-lg font-bold text-neutral-dark-gray !font-nunito">
                {userStats.posts}
              </Text>
              <Text className="text-neutral-medium-gray font-nunito">{t('profile.posts')}</Text>
            </View>
            <View className="items-center flex-row gap-1">
              <Text className="text-lg font-bold text-neutral-dark-gray !font-nunito">
                {userStats.followers}
              </Text>
              <Text className="text-neutral-medium-gray font-nunito">{t('profile.followers')}</Text>
            </View>
            <View className="items-center flex-row gap-1">
              <Text className="text-lg font-bold text-neutral-dark-gray !font-nunito">
                {userStats.following}
              </Text>
              <Text className="text-neutral-medium-gray font-nunito">{t('profile.following')}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row gap-4">
            <Button
              label={t('profile.edit_profile')}
              // onPress={() => router.push('/profile/edit')}
              onPress={() => trackInteraction('editProfile')}
              variant="secondary"
              className="flex-1"
              textClassName="text-primary"
            />
            <Pressable className="bg-primary rounded-full p-3 items-center justify-center">
              <Ionicons name="share-outline" size={20} color="#FDFDFD" />
            </Pressable>
          </View>
        </View>

        <View className="border-t border-neutral-light-gray mb-4" />

        {/* User Feed Section */}
        <View className="px-6">
          {profileLoading || feedLoading ? (
            <View className="bg-neutral-light-gray h-40 rounded-lg items-center justify-center">
              <Text className="text-neutral-medium-gray font-nunito">
                Cargando publicaciones...
              </Text>
            </View>
          ) : noPostsYet ? (
            <View className="bg-neutral-light-gray h-40 rounded-lg items-center justify-center">
              <Ionicons name="camera-outline" size={48} color="#BDBDBD" className="mb-2" />
              <Text className="text-neutral-medium-gray font-nunito text-center">
                Aún no hay publicaciones
              </Text>
              <Text className="text-neutral-medium-gray font-nunito text-center text-sm mt-1">
                ¡Comparte tu primera foto con tu mascota!
              </Text>
            </View>
          ) : (
            <View className="bg-neutral-light-gray h-40 rounded-lg items-center justify-center">
              <Text className="text-neutral-medium-gray font-nunito">
                Feed de usuario ({userPosts.length} posts)
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  )
}
