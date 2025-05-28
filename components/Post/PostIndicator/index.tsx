import { View, Text } from 'react-native'

import { styles } from './styles'
import { PostIndicatorProps } from './types'

export default function PostIndicator({
  currentIndex,
  total,
  showDots = false,
}: PostIndicatorProps) {
  // Don't show indicator if there's only one media item
  if (total <= 1) return null

  if (showDots) {
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: total }).map((_, index) => (
          <View key={index} style={[styles.dot, index === currentIndex && styles.activeDot]} />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text} className="font-nunito">
        {currentIndex + 1} / {total}
      </Text>
    </View>
  )
}
