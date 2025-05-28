import { StyleSheet, Dimensions } from 'react-native'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT - 150, // Full screen height like TikTok
    width: SCREEN_WIDTH, // Full screen width
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  cardContainer: {
    height: SCREEN_HEIGHT, // Full screen height for each post
    width: SCREEN_WIDTH, // Full screen width
    backgroundColor: '#000',
    position: 'relative',
  },
  guestContainer: {
    height: SCREEN_HEIGHT - 180, // Full screen height like TikTok
  },
})
