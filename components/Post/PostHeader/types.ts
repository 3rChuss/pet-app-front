export interface PostHeaderProps {
  user: {
    id: string
    name: string
    avatar: string
    location?: string
    isVerified?: boolean
    isOnline?: boolean
  }
  timestamp: string
  isSponsored?: boolean
  onUserPress?: (userId: string) => void
}
