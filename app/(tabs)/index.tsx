import { StatusBar } from 'expo-status-bar'
import { View, Text } from 'react-native'

import { Container } from '@/components/containers/Container'
import Feed from '@/components/Feed'
import { ALL_SAMPLE_POSTS } from '@/lib/adapters/post-adapter'
import { useGuestModeContext } from '@/lib/context/GuestModeContext'

export default function HomeScreen() {
  const { isGuest } = useGuestModeContext()

  const handleLike = (postId: string) => {
    console.log('Like post:', postId)
    // Implement like functionality
  }

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId)
    // Implement comment functionality
  }

  const handleShare = (postId: string) => {
    console.log('Share post:', postId)
    // Implement share functionality
  }

  const handleSave = (postId: string) => {
    console.log('Save post:', postId)
    // Implement save functionality
  }

  const handleUserPress = (userId: string) => {
    console.log('View user profile:', userId)
    // Navigate to user profile
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <Container className="flex-1">
        {isGuest && (
          <View className="px-4 py-3 bg-amber-100 border-b border-amber-200">
            <Text className="text-center text-amber-800 font-nunito text-sm">
              🎯 Estás explorando en modo invitado •
              <Text className="font-bold"> ¡Regístrate gratis para interactuar!</Text>
            </Text>
          </View>
        )}

        <Feed
          posts={isGuest ? ALL_SAMPLE_POSTS : ALL_SAMPLE_POSTS}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onSave={handleSave}
          onUserPress={handleUserPress}
        />
      </Container>
    </View>
  )
}
