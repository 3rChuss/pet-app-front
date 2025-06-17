import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { View, Text, TouchableOpacity } from 'react-native'

import { useTimeFormats } from '@/lib/hooks'

import { styles } from './styles'
import { PostHeaderProps } from './types'

export default function PostHeader({ user, timestamp, isSponsored, onUserPress }: PostHeaderProps) {
  const { formatTimeAgo } = useTimeFormats()

  const handleUserPress = () => {
    onUserPress?.(user.id)
  }

  return (
    <>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'transparent']}
        style={styles.gradient}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleUserPress}
          activeOpacity={0.8}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          {user.isOnline && <View style={styles.onlineIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} onPress={handleUserPress} activeOpacity={0.8}>
          <View style={styles.userNameVerified}>
            <Text style={styles.userName} className="font-quicksand">
              {user.name}
            </Text>
            {user.isVerified && <Text style={styles.verifiedIcon}>✓</Text>}
          </View>
          <Text style={styles.location} className="font-nunito">
            {user.location && `📍 ${user.location} • `}
            {formatTimeAgo(timestamp)}
          </Text>
        </TouchableOpacity>

        {isSponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText} className="font-nunito">
              Patrocinado
            </Text>
          </View>
        )}
      </View>
    </>
  )
}
