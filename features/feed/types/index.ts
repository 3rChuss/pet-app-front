export interface Post {
  id: string
  userId: string
  content: string
  imageUrls: string[]
  location?: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  createdAt: string
  updatedAt: string

  // Relaciones
  user: {
    id: string
    userName: string
    firstName?: string
    lastName?: string
    avatar?: string
    isVerified: boolean
  }

  // Datos de la mascota (si aplica)
  pet?: {
    id: string
    name: string
    type: string
    breed?: string
    avatar?: string
  }
}

export interface FeedState {
  posts: Post[]
  isLoading: boolean
  isRefreshing: boolean
  isLoadingMore: boolean
  error: string | null
  hasNextPage: boolean
  currentPage: number
}

export interface FeedActions {
  fetchFeed: (refresh?: boolean) => Promise<void>
  loadMorePosts: () => Promise<void>
  likePost: (postId: string) => Promise<void>
  unlikePost: (postId: string) => Promise<void>
  bookmarkPost: (postId: string) => Promise<void>
  unbookmarkPost: (postId: string) => Promise<void>
  clearError: () => void
}

export interface CreatePostPayload {
  content: string
  imageUris?: string[]
  location?: string
  tags?: string[]
  petId?: string
}
