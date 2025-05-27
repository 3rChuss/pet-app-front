import { useState } from 'react'

import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'

import GuestCTAModal from '@/components/Guest/GuestCTAModal'
import RestrictedFeature from '@/components/Guest/RestrictedFeature'
import { MOCK_POSTS } from '@/lib/const/mockData'
import { useGuestModeContext } from '@/lib/context/GuestModeContext'

export default function MockPostFeed() {
  const { isGuest, trackInteraction, showCTA, dismissCTA } = useGuestModeContext()
  const [selectedFeature, setSelectedFeature] = useState<string>('')

  const handleRestrictedAction = (feature: string) => {
    if (isGuest) {
      setSelectedFeature(feature)
      trackInteraction(feature)
    }
  }

  const handleCloseModal = () => {
    dismissCTA()
    setSelectedFeature('')
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffMs = now.getTime() - postTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return 'Hace un momento'
    if (diffHours < 24) return `Hace ${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `Hace ${diffDays}d`
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {MOCK_POSTS.map(post => (
        <View key={post.id} style={styles.postCard}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName} className="font-quicksand">
                {post.user.name}
              </Text>
              <Text style={styles.location} className="font-nunito">
                📍 {post.user.location} • {formatTimeAgo(post.timestamp)}
              </Text>
            </View>
            {post.isSponsored && (
              <View style={styles.sponsoredBadge}>
                <Text style={styles.sponsoredText} className="font-nunito">
                  Patrocinado
                </Text>
              </View>
            )}
          </View>

          {/* Post Content */}
          <Text style={styles.postText} className="font-nunito">
            🐾 {post.pet.name} ({post.pet.breed || post.pet.type}): {post.content.text}
          </Text>

          {/* Post Images */}
          {post.content.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageContainer}
            >
              {post.content.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.postImage} />
              ))}
            </ScrollView>
          )}

          {/* Post Actions */}
          <View style={styles.actions}>
            <RestrictedFeature
              feature="like"
              fallback={
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRestrictedAction('like')}
                >
                  <Text style={styles.actionText}>❤️ {post.stats.likes}</Text>
                </TouchableOpacity>
              }
            >
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>❤️ {post.stats.likes}</Text>
              </TouchableOpacity>
            </RestrictedFeature>

            <RestrictedFeature
              feature="comment"
              fallback={
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRestrictedAction('comment')}
                >
                  <Text style={styles.actionText}>💬 {post.stats.comments}</Text>
                </TouchableOpacity>
              }
            >
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>💬 {post.stats.comments}</Text>
              </TouchableOpacity>
            </RestrictedFeature>

            <RestrictedFeature
              feature="share"
              fallback={
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRestrictedAction('share')}
                >
                  <Text style={styles.actionText}>📤 {post.stats.shares}</Text>
                </TouchableOpacity>
              }
            >
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>📤 {post.stats.shares}</Text>
              </TouchableOpacity>
            </RestrictedFeature>
          </View>
        </View>
      ))}

      <GuestCTAModal
        visible={showCTA && isGuest}
        onClose={handleCloseModal}
        feature={selectedFeature}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  postCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  location: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  sponsoredBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sponsoredText: {
    fontSize: 10,
    color: '#1976d2',
    textTransform: 'uppercase',
  },
  postText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 12,
  },
  imageContainer: {
    marginBottom: 12,
  },
  postImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
})
