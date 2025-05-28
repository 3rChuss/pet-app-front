import { MediaItem } from '../types'

export interface PostMediaProps {
  media: MediaItem[]
  onMediaChange?: (currentIndex: number) => void
  currentIndex?: number
  isActive?: boolean // For video playback control
}
