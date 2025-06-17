import { useEffect, useCallback } from 'react'

import { useApiError } from '@/lib/hooks/useApiError'

import {
  useFeedStore,
  useFeedPosts,
  useFeedLoading,
  useFeedRefreshing,
  useFeedLoadingMore,
  useFeedError,
  useFeedHasNextPage,
} from '../store/feedStore'

export interface UseFeedOptions {
  autoFetch?: boolean
  onRefreshComplete?: () => void
  onLoadMoreComplete?: () => void
  onError?: (error: Error) => void
}

/**
 * Hook principal para manejar el feed de posts
 * Incluye paginación infinita y manejo de errores
 */
export function useFeed(options: UseFeedOptions = {}) {
  const { autoFetch = true, onRefreshComplete, onLoadMoreComplete, onError } = options

  // Estado del store
  const posts = useFeedPosts()
  const isLoading = useFeedLoading()
  const isRefreshing = useFeedRefreshing()
  const isLoadingMore = useFeedLoadingMore()
  const error = useFeedError()
  const hasNextPage = useFeedHasNextPage()

  // Acciones del store
  const {
    fetchFeed,
    loadMorePosts,
    likePost,
    unlikePost,
    bookmarkPost,
    unbookmarkPost,
    clearError,
  } = useFeedStore()

  // Manejo de errores
  const { handleApiError } = useApiError()

  // Auto-fetch en mount
  useEffect(() => {
    if (autoFetch && posts.length === 0 && !isLoading) {
      handleFetchFeed()
    }
  }, [autoFetch, posts.length, isLoading])

  // Wrapper para manejo de errores
  const handleFetchFeed = useCallback(
    async (refresh = false) => {
      try {
        await fetchFeed(refresh)
        if (refresh) {
          onRefreshComplete?.()
        }
      } catch (error: any) {
        handleApiError(error, 'Feed fetch failed')
        onError?.(error)
      }
    },
    [fetchFeed, handleApiError, onRefreshComplete, onError]
  )

  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || isLoadingMore) return

    try {
      await loadMorePosts()
      onLoadMoreComplete?.()
    } catch (error: any) {
      handleApiError(error, 'Load more posts failed')
      onError?.(error)
    }
  }, [loadMorePosts, hasNextPage, isLoadingMore, handleApiError, onLoadMoreComplete, onError])

  const handleLikePost = useCallback(
    async (postId: string) => {
      try {
        await likePost(postId)
      } catch (error: any) {
        handleApiError(error, 'Like post failed')
        onError?.(error)
      }
    },
    [likePost, handleApiError, onError]
  )

  const handleUnlikePost = useCallback(
    async (postId: string) => {
      try {
        await unlikePost(postId)
      } catch (error: any) {
        handleApiError(error, 'Unlike post failed')
        onError?.(error)
      }
    },
    [unlikePost, handleApiError, onError]
  )

  const handleBookmarkPost = useCallback(
    async (postId: string) => {
      try {
        await bookmarkPost(postId)
      } catch (error: any) {
        handleApiError(error, 'Bookmark post failed')
        onError?.(error)
      }
    },
    [bookmarkPost, handleApiError, onError]
  )

  const handleUnbookmarkPost = useCallback(
    async (postId: string) => {
      try {
        await unbookmarkPost(postId)
      } catch (error: any) {
        handleApiError(error, 'Unbookmark post failed')
        onError?.(error)
      }
    },
    [unbookmarkPost, handleApiError, onError]
  )

  // Función para alternar like
  const toggleLike = useCallback(
    (postId: string, isCurrentlyLiked: boolean) => {
      if (isCurrentlyLiked) {
        handleUnlikePost(postId)
      } else {
        handleLikePost(postId)
      }
    },
    [handleLikePost, handleUnlikePost]
  )

  // Función para alternar bookmark
  const toggleBookmark = useCallback(
    (postId: string, isCurrentlyBookmarked: boolean) => {
      if (isCurrentlyBookmarked) {
        handleUnbookmarkPost(postId)
      } else {
        handleBookmarkPost(postId)
      }
    },
    [handleBookmarkPost, handleUnbookmarkPost]
  )

  return {
    // Estado
    posts,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasNextPage,

    // Acciones principales
    fetchFeed: handleFetchFeed,
    loadMore: handleLoadMore,
    refresh: () => handleFetchFeed(true),

    // Acciones de interacción
    toggleLike,
    toggleBookmark,

    // Utilidades
    clearError,
    isEmpty: posts.length === 0 && !isLoading,
    isFirstLoad: posts.length === 0 && isLoading,
  }
}
