import { StatusBar } from 'expo-status-bar'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet } from 'react-native'

const assetId = require('../assets/videos/home_background.mp4')

const videoSource: VideoSource = {
  assetId,
  metadata: {
    title: 'Big Buck Bunny',
    artist: 'The Open Movie Project',
  },
}

export default function HomeScreen() {
  const { t } = useTranslation()
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true
    player.volume = 0 // Muted
    player.play()
  })

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <VideoView player={player} style={styles.video} playsInline contentFit="cover" />
      <View style={styles.overlay}>
        <Text className="font-quicksand text-8xl text-neutral-off-white mb-4">
          {t('app.welcome')}
        </Text>
        <Text className="font-nunito text-xl text-neutral-off-white text-center">
          {t('app.welcome_message')}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Dark overlay for better text visibility
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
})
