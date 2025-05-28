export interface MediaItem {
  id: string
  type: 'image' | 'video'
  uri: string
  thumbnail?: string
  duration?: number // for videos in seconds
}

export interface PostUser {
  id: string
  name: string
  avatar: string
  location?: string
  isVerified?: boolean
  isOnline?: boolean
}

export interface PostPet {
  name: string
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
  breed?: string
}

export interface PostStats {
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  isSaved?: boolean
}

export interface Post {
  id: string
  user: PostUser
  pet?: PostPet
  content: {
    text: string
    media: MediaItem[]
  }
  stats: PostStats
  timestamp: string
  isSponsored?: boolean
}

export interface PostContainerProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onSave?: (postId: string) => void
  onUserPress?: (userId: string) => void
  isActive?: boolean // For video playback control when post is visible
}
