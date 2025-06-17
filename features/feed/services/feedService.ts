import client from '@/api/client'

import type { Post, CreatePostPayload } from '../types'

const apiClient = client

interface FeedResponse {
  posts: Post[]
  pagination: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    total: number
  }
}

export class FeedService {
  /**
   * Obtiene el feed principal con paginación
   */
  static async getFeed(page = 1, limit = 10): Promise<FeedResponse> {
    const response = await apiClient.get('/feed', {
      params: { page, limit },
    })
    return response.data
  }

  /**
   * Obtiene posts de un usuario específico
   */
  static async getUserFeed(userId: string, page = 1, limit = 10): Promise<FeedResponse> {
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { page, limit },
    })
    return response.data
  }

  /**
   * Crea un nuevo post
   */
  static async createPost(data: CreatePostPayload): Promise<Post> {
    const formData = new FormData()

    formData.append('content', data.content)

    if (data.location) formData.append('location', data.location)
    if (data.petId) formData.append('petId', data.petId)
    if (data.tags) formData.append('tags', JSON.stringify(data.tags))

    // Adjuntar imágenes si existen
    data.imageUris?.forEach((uri, index) => {
      formData.append('images', {
        uri,
        type: 'image/jpeg',
        name: `image_${index}.jpg`,
      } as any)
    })

    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }

  /**
   * Da like a un post
   */
  static async likePost(postId: string): Promise<void> {
    await apiClient.post(`/posts/${postId}/like`)
  }

  /**
   * Quita like de un post
   */
  static async unlikePost(postId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}/like`)
  }

  /**
   * Guarda un post en favoritos
   */
  static async bookmarkPost(postId: string): Promise<void> {
    await apiClient.post(`/posts/${postId}/bookmark`)
  }

  /**
   * Quita post de favoritos
   */
  static async unbookmarkPost(postId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}/bookmark`)
  }

  /**
   * Elimina un post (solo el propietario)
   */
  static async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}`)
  }
}
