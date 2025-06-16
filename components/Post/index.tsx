import { useState } from 'react'

import { View } from 'react-native'

import PostActions from '@/components/Post/PostActions'
import PostHeader from '@/components/Post/PostHeader'
import PostIndicator from '@/components/Post/PostIndicator'
import { PostMedia } from '@/components/Post/PostMedia'
import { useGuestModeContext } from '@/lib/context/GuestModeContext'

import { styles } from './styles'
import { PostContainerProps } from './types'

export default function PostContainer({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  onUserPress,
  isActive = false,
}: PostContainerProps) {
  const { isGuest } = useGuestModeContext()
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  const handleMediaChange = (index: number) => {
    setCurrentMediaIndex(index)
  }

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.container, isGuest && styles.guestContainer]}>
        {/* Post Header - Absolute positioned at top */}
        <PostHeader
          user={post.user}
          timestamp={post.timestamp}
          isSponsored={post.isSponsored}
          onUserPress={onUserPress}
        />

        {/* Media Carousel */}
        <PostMedia
          media={post.content.media}
          onMediaChange={handleMediaChange}
          currentIndex={currentMediaIndex}
          isActive={isActive}
        />

        {/* Media Indicator - Shows current slide */}
        <PostIndicator
          currentIndex={currentMediaIndex}
          total={post.content.media.length}
          showDots={true}
        />

        {/* Post Actions - Absolute positioned at right */}
        <PostActions
          stats={post.stats}
          postId={post.id}
          content={post.content.text}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onSave={onSave}
        />
      </View>
    </View>
  )
}
