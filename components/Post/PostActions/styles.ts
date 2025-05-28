import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    bottom: 50,
    zIndex: 5,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    color: '#fff',
  },
  likedIcon: {
    color: '#ff3040',
  },
  savedIcon: {
    color: '#ffd700',
  },
  actionCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 80,
    zIndex: 5,
  },
  contentText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  readMore: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
})
