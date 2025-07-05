import { useEffect } from 'react'

import { useApiError } from '@/lib/hooks/useApiError'

import {
  useProfileStore,
  useProfile,
  useProfileLoading,
  useProfileError,
} from '../store/profileStore'

export interface UseUserProfileOptions {
  autoFetch?: boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Hook principal para manejar el perfil del usuario
 * Combina estado global con lógica de efectos y manejo de errores
 */
export function useUserProfile(options: UseUserProfileOptions = {}) {
  const { autoFetch = true, onSuccess, onError } = options

  // Estado del store
  const profile = useProfile()
  const isLoading = useProfileLoading()
  const error = useProfileError()

  const { fetchProfile, updateProfile, uploadAvatar, setEditing, clearError } = useProfileStore()

  const { handleApiError } = useApiError()

  // Auto-fetch en mount
  useEffect(() => {
    if (autoFetch && !profile && !isLoading) {
      handleFetchProfile()
    }
  }, [autoFetch, profile, isLoading])

  const handleFetchProfile = async () => {
    try {
      await fetchProfile()
      onSuccess?.()
    } catch (error: any) {
      handleApiError(error, 'Profile fetch failed')
      onError?.(error)
    }
  }

  const handleUpdateProfile = async (data: any) => {
    try {
      await updateProfile(data)
      onSuccess?.()
    } catch (error: any) {
      handleApiError(error, 'Profile update failed')
      onError?.(error)
    }
  }

  const handleUploadAvatar = async (imageUri: string) => {
    try {
      await uploadAvatar(imageUri)
      onSuccess?.()
    } catch (error: any) {
      handleApiError(error, 'Avatar upload failed')
      onError?.(error)
    }
  }

  return {
    // Estado
    profile,
    isLoading,
    error,

    // Acciones con manejo de errores
    fetchProfile: handleFetchProfile,
    updateProfile: handleUpdateProfile,
    uploadAvatar: handleUploadAvatar,
    setEditing,
    clearError,

    // Utilidades
    isOwner: true, // En el futuro, comparar con usuario actual
    hasProfile: !!profile,

    // Estado derivado
    displayName: profile?.username || profile?.email || 'Usuario',
    avatarUrl: profile?.avatar,
    isVerified: false,
  }
}
