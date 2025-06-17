import client from '@/api/client'

import { ProfileUpdatePayload } from '../types'

import type { AppTypes } from 'app-types'

const apiClient = client

export class ProfileService {
  /**
   * Obtiene el perfil del usuario autenticado
   */
  static async getCurrentProfile(): Promise<AppTypes.UserProfile> {
    const response = await apiClient.get('/profile')
    return response.data
  }

  /**
   * Obtiene el perfil de otro usuario por ID
   */
  static async getProfileById(userId: string): Promise<AppTypes.UserProfile> {
    const response = await apiClient.get(`/profile/${userId}`)
    return response.data
  }

  /**
   * Actualiza el perfil del usuario autenticado
   */
  static async updateProfile(data: ProfileUpdatePayload): Promise<AppTypes.UserProfile> {
    const response = await apiClient.put('/profile', data)
    return response.data
  }

  /**
   * Sube una nueva imagen de avatar
   */
  static async uploadAvatar(imageUri: string): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any)

    const response = await apiClient.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }

  /**
   * Elimina el avatar actual
   */
  static async deleteAvatar(): Promise<void> {
    await apiClient.delete('/profile/avatar')
  }
}
