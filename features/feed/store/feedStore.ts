import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import { FeedService } from '../services/feedService'

import type { FeedState, FeedActions } from '../types'

type FeedStore = FeedState & FeedActions

export const useFeedStore = create<FeedStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    posts: [],
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
    error: null,
    hasNextPage: true,
    currentPage: 1,

    // Actions
    fetchFeed: async (refresh = false) => {
      const currentState = get()

      if (refresh) {
        set({ isRefreshing: true, error: null })
      } else if (currentState.posts.length === 0) {
        set({ isLoading: true, error: null })
      }

      try {
        const response = await FeedService.getFeed(1, 10)

        set({
          posts: response.posts,
          hasNextPage: response.pagination.hasNextPage,
          currentPage: response.pagination.currentPage,
          isLoading: false,
          isRefreshing: false,
        })
      } catch (error: any) {
        set({
          error: error.message || 'Error al cargar el feed',
          isLoading: false,
          isRefreshing: false,
        })
        throw error
      }
    },

    loadMorePosts: async () => {
      const { hasNextPage, currentPage, isLoadingMore } = get()

      if (!hasNextPage || isLoadingMore) return

      set({ isLoadingMore: true, error: null })

      try {
        const response = await FeedService.getFeed(currentPage + 1, 10)

        set(state => ({
          posts: [...state.posts, ...response.posts],
          hasNextPage: response.pagination.hasNextPage,
          currentPage: response.pagination.currentPage,
          isLoadingMore: false,
        }))
      } catch (error: any) {
        set({
          error: error.message || 'Error al cargar más posts',
          isLoadingMore: false,
        })
        throw error
      }
    },

    likePost: async (postId: string) => {
      // Optimistic update
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, isLiked: true, likes: post.likes + 1 } : post
        ),
      }))

      try {
        await FeedService.likePost(postId)
      } catch (error: any) {
        // Revert optimistic update
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, isLiked: false, likes: post.likes - 1 } : post
          ),
        }))
        throw error
      }
    },

    unlikePost: async (postId: string) => {
      // Optimistic update
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, isLiked: false, likes: post.likes - 1 } : post
        ),
      }))

      try {
        await FeedService.unlikePost(postId)
      } catch (error: any) {
        // Revert optimistic update
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, isLiked: true, likes: post.likes + 1 } : post
          ),
        }))
        throw error
      }
    },

    bookmarkPost: async (postId: string) => {
      // Optimistic update
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, isBookmarked: true } : post
        ),
      }))

      try {
        await FeedService.bookmarkPost(postId)
      } catch (error: any) {
        // Revert optimistic update
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, isBookmarked: false } : post
          ),
        }))
        throw error
      }
    },

    unbookmarkPost: async (postId: string) => {
      // Optimistic update
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, isBookmarked: false } : post
        ),
      }))

      try {
        await FeedService.unbookmarkPost(postId)
      } catch (error: any) {
        // Revert optimistic update
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, isBookmarked: true } : post
          ),
        }))
        throw error
      }
    },

    clearError: () => {
      set({ error: null })
    },
  }))
)

// Selector hooks para optimizar re-renders
export const useFeedPosts = () => useFeedStore(state => state.posts)
export const useFeedLoading = () => useFeedStore(state => state.isLoading)
export const useFeedRefreshing = () => useFeedStore(state => state.isRefreshing)
export const useFeedLoadingMore = () => useFeedStore(state => state.isLoadingMore)
export const useFeedError = () => useFeedStore(state => state.error)
export const useFeedHasNextPage = () => useFeedStore(state => state.hasNextPage)
