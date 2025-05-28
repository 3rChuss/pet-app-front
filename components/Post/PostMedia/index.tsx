import React, { useState, useRef, useCallback } from 'react'

import { useEventListener } from 'expo'
import { Image } from 'expo-image'
import { useVideoPlayer, VideoView } from 'expo-video'
import { View, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native'

import { styles } from './styles'
import { PostMediaProps } from './types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function PostMedia({
  media,
  onMediaChange,
  currentIndex = 0,
  isActive = false,
}: PostMediaProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const scrollViewRef = useRef<ScrollView>(null)

  const handleScroll = useCallback(
    (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x
      const newIndex = Math.round(offsetX / SCREEN_WIDTH)

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < media.length) {
        setActiveIndex(newIndex)
        onMediaChange?.(newIndex)
      }
    },
    [activeIndex, media.length, onMediaChange]
  )

  const renderMediaItem = (item: any, index: number) => {
    if (item.type === 'video') {
      return (
        <VideoMediaItem key={item.id} item={item} isActive={isActive && index === activeIndex} />
      )
    }

    return (
      <View key={item.id} style={styles.mediaContainer}>
        <Image source={{ uri: item.uri }} style={styles.image} contentFit="cover" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {media.map((item, index) => renderMediaItem(item, index))}
      </ScrollView>
    </View>
  )
}

// Video component with controls
function VideoMediaItem({ item, isActive }: { item: any; isActive: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const player = useVideoPlayer({ uri: item.uri }, player => {
    player.loop = false
    player.muted = false
    player.timeUpdateEventInterval = 1
  })

  useEventListener(player, 'timeUpdate', payload => {
    setProgress(payload.currentTime)
  })

  const togglePlayback = () => {
    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Reset video when not active
  React.useEffect(() => {
    if (!isActive) {
      player.pause()
    }
    if (isActive) {
      player.play()
      setIsPlaying(true)
    }

    return () => {
      player.currentTime = 0
    }
  }, [isActive, player])

  return (
    <View style={styles.mediaContainer}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls={false}
        allowsFullscreen
        onTouchEnd={togglePlayback}
        playsInline
      />

      {!isPlaying && (
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          <Text style={styles.playIcon}>▶</Text>
        </TouchableOpacity>
      )}

      {item.duration && (
        <View style={styles.videoControls}>
          <Text style={styles.duration}>{formatTime(progress)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${(progress / player.duration) * 100}%` }]} />
          </View>
          <Text style={styles.duration}>{formatTime(player.duration)}</Text>
        </View>
      )}
    </View>
  )
}
