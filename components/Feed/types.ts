import { Post } from '@/components/Post/types'

export interface FeedProps {
  posts: Post[]
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onSave?: (postId: string) => void
  onUserPress?: (userId: string) => void
}
