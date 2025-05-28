import { PostStats } from '../types'

export interface PostActionsProps {
  stats: PostStats
  postId: string
  content?: string
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onSave?: (postId: string) => void
}
