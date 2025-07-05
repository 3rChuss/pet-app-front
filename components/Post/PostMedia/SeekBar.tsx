import React, { useCallback, useMemo } from 'react'

import { View, Text, StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'

interface SeekBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  onSeekStart?: () => void
  onSeekEnd?: () => void
  disabled?: boolean
}

const SEEK_BAR_HEIGHT = 20
const PROGRESS_BAR_HEIGHT = 4
const THUMB_SIZE = 10

export const SeekBar: React.FC<SeekBarProps> = ({
  currentTime,
  duration,
  onSeek,
  onSeekStart,
  onSeekEnd,
  disabled = false,
}) => {
  const isDragging = useSharedValue(false)
  const seekBarWidth = useSharedValue(0)
  const thumbPosition = useSharedValue(0)

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (duration === 0) return 0
    return Math.min(Math.max(currentTime / duration, 0), 1)
  }, [currentTime, duration])
  // Update thumb position when currentTime changes (only if not dragging)
  React.useEffect(() => {
    if (!isDragging.value && seekBarWidth.value > 0) {
      thumbPosition.value = withSpring(progressPercentage * seekBarWidth.value, {
        damping: 15,
        stiffness: 150,
      })
    }
  }, [progressPercentage, isDragging, seekBarWidth, thumbPosition])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onBegin(() => {
      isDragging.value = true
      if (onSeekStart) runOnJS(onSeekStart)()
    })
    .onUpdate(event => {
      const newPosition = Math.max(
        0,
        Math.min(seekBarWidth.value, thumbPosition.value + event.translationX)
      )
      thumbPosition.value = newPosition
      const newTime = (newPosition / seekBarWidth.value) * duration
      runOnJS(onSeek)(newTime)
    })
    .onEnd(() => {
      isDragging.value = false
      if (onSeekEnd) runOnJS(onSeekEnd)()
    })

  const animatedThumbStyle = useAnimatedStyle(() => {
    const scale = isDragging.value ? withSpring(1.2) : withSpring(1)
    const opacity = isDragging.value ? withSpring(1) : withSpring(0.8)

    return {
      transform: [{ translateX: thumbPosition.value - THUMB_SIZE / 2 }, { scale }],
      opacity,
    }
  })

  const animatedProgressStyle = useAnimatedStyle(() => {
    const width = Math.max(0, thumbPosition.value)
    return {
      width,
    }
  })
  const onLayout = useCallback(
    (event: any) => {
      const { width } = event.nativeEvent.layout
      seekBarWidth.value = width
      thumbPosition.value = progressPercentage * width
    },
    [progressPercentage, seekBarWidth, thumbPosition]
  )

  return (
    <View style={styles.container}>
      <Text style={styles.duration}>{formatTime(currentTime)}</Text>

      <View style={styles.seekBarContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.seekBar} onLayout={onLayout}>
            {/* Background track */}
            <View style={styles.track} />

            {/* Progress track */}
            <Animated.View style={[styles.progressTrack, animatedProgressStyle]} />

            {/* Thumb */}
            <Animated.View style={[styles.thumb, animatedThumbStyle]} />
          </Animated.View>
        </GestureDetector>
      </View>

      <Text style={styles.duration}>{formatTime(duration)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  duration: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    minWidth: 35,
    textAlign: 'center',
  },
  seekBarContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  seekBar: {
    height: SEEK_BAR_HEIGHT,
    justifyContent: 'center',
    paddingVertical: (SEEK_BAR_HEIGHT - PROGRESS_BAR_HEIGHT) / 2,
  },
  track: {
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
  },
  progressTrack: {
    position: 'absolute',
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: PROGRESS_BAR_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: '#fff',
    borderRadius: THUMB_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
