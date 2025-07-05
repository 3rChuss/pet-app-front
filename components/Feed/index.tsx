import { useState, useRef } from 'react'

import { ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'

import PostContainer from '../Post'

import { FeedProps } from './types'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function Feed({
  posts,
  onLike,
  onComment,
  onShare,
  onSave,
  onUserPress,
}: FeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y
    const newIndex = Math.round(offsetY / SCREEN_HEIGHT)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
      setCurrentIndex(newIndex)
    }
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      snapToInterval={SCREEN_HEIGHT}
      snapToAlignment="start"
      decelerationRate="normal"
      alwaysBounceVertical={false}
      bounces={true}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      scrollEventThrottle={16}
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      {posts.map((post, index) => (
        <PostContainer
          key={`post-${post.id}`}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onSave={onSave}
          onUserPress={onUserPress}
          isActive={index === currentIndex}
        />
      ))}
    </ScrollView>
  )
}
