import { useState, useRef, useCallback } from 'react'

import { useEventListener } from 'expo'
import { Image } from 'expo-image'
import { useFocusEffect } from 'expo-router'
import { useVideoPlayer, VideoView } from 'expo-video'
import { View, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native'

import { SeekBar } from './SeekBar'
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

// Video component with interactive seek controls
function VideoMediaItem({ item, isActive }: { item: any; isActive: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState(false)

  const player = useVideoPlayer({ uri: item.uri }, player => {
    player.loop = false
    player.muted = false
    player.timeUpdateEventInterval = 0.1 // More frequent updates for smooth seeking
  })

  // Listen to time updates
  useEventListener(player, 'timeUpdate', payload => {
    if (!isSeeking) {
      setCurrentTime(payload.currentTime)
    }
  })

  // Listen to duration changes
  useEventListener(player, 'statusChange', payload => {
    if (payload.status === 'readyToPlay' && player.duration > 0) {
      setDuration(player.duration)
    }
  })

  // Listen to playback state changes
  useEventListener(player, 'playingChange', payload => {
    setIsPlaying(payload.isPlaying)
  })

  const togglePlayback = useCallback(() => {
    if (isSeeking) return // Don't toggle during seeking

    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
  }, [isPlaying, isSeeking, player])

  const handleSeek = useCallback(
    async (time: number) => {
      try {
        await player.seekBy(time - currentTime)
        setCurrentTime(time)
      } catch (error) {
        console.warn('Failed to seek:', error)
      }
    },
    [player, currentTime]
  )

  const handleSeekStart = useCallback(() => {
    setIsSeeking(true)
    setWasPlayingBeforeSeek(isPlaying)
    if (isPlaying) {
      player.pause()
    }
  }, [isPlaying, player])

  const handleSeekEnd = useCallback(() => {
    setIsSeeking(false)
    if (wasPlayingBeforeSeek) {
      player.play()
    }
  }, [wasPlayingBeforeSeek, player])

  useFocusEffect(
    useCallback(() => {
      if (isActive && !isSeeking) {
        player.play()
      } else {
        player.pause()
      }

      return () => {
        player.pause()
        setIsPlaying(false)
      }
    }, [isActive, isSeeking, player])
  )

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

      {!isPlaying && !isSeeking && (
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          <Text style={styles.playIcon}>▶</Text>
        </TouchableOpacity>
      )}

      {duration > 0 && (
        <View style={styles.videoControlsContainer}>
          <SeekBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            onSeekStart={handleSeekStart}
            onSeekEnd={handleSeekEnd}
            disabled={!isActive}
          />
        </View>
      )}
    </View>
  )
}
