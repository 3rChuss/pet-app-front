import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useVideoPlayer, VideoView } from 'expo-video'
import { View, Text, StyleSheet } from 'react-native'

import { LoginForm } from '@/components/Auth/login-form'
import { Container } from '@/components/containers/Container'
import { useAuth } from '@/lib/auth'

const assetId = require('@/assets/videos/home_background.mp4')

export default function Login() {
  const router = useRouter()
  const signIn = useAuth.use.signIn()
  const player = useVideoPlayer({ assetId }, player => {
    player.loop = true
    player.volume = 0 // Muted
    player.play()
  })

  const handleLogin = (data: any) => {
    console.log('Login Data:', data)
    signIn({ access: 'fake-access-token', refresh: 'fake-refresh-token' })
    // router.replace('/(app)/')
  }

  const handleGoogleSignIn = () => {
    console.log('Google Sign In Pressed')
    // Implement Google Sign-In logic here
  }

  const handleFacebookSignIn = () => {
    console.log('Facebook Sign In Pressed')
    // Implement Facebook Sign-In logic here
  }

  return (
    <Container className="flex-1 bg-trasparent">
      <StatusBar style="inverted" />
      <VideoView player={player} style={styles.video} playsInline contentFit="cover" />
      <View style={styles.overlay} className="bg-neutral-off-white/30" />
      {/* Overlay: Dark background for better text visibility */}
      {/* Header: Zooki Logo */}
      <View
        className="items-center justify-center "
        style={{
          flexGrow: 1,
          flexBasis: 150,
        }}
      >
        {/* Replace with your actual logo if available */}
        {/* <Image source={require('@/assets/images/zooki_logo.png')} className="w-40 h-20" resizeMode="contain" /> */}
        <Text className="text-5xl font-bold text-neutral-off-white">Zooki logo</Text>
      </View>
      <LoginForm
        onSubmit={handleLogin}
        onGoogleSignIn={handleGoogleSignIn}
        onFacebookSignIn={handleFacebookSignIn}
      />
    </Container>
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
    zIndex: -1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better text visibility
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: -1,
  },
})
