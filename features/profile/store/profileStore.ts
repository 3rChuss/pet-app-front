import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import { ProfileService } from '../services/profileService'

import type { ProfileState, ProfileActions, ProfileUpdatePayload } from '../types'

type ProfileStore = ProfileState & ProfileActions

export const useProfileStore = create<ProfileStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    profile: null,
    isLoading: false,
    error: null,
    isEditing: false,

    // Actions
    fetchProfile: async () => {
      set({ isLoading: true, error: null })
      try {
        const profile = await ProfileService.getCurrentProfile()
        set({ profile, isLoading: false })
      } catch (error: any) {
        set({
          error: error.message || 'Error al cargar el perfil',
          isLoading: false,
        })
        throw error
      }
    },

    updateProfile: async (data: ProfileUpdatePayload) => {
      set({ isLoading: true, error: null })
      try {
        const updatedProfile = await ProfileService.updateProfile(data)
        set({
          profile: updatedProfile,
          isLoading: false,
          isEditing: false,
        })
      } catch (error: any) {
        set({
          error: error.message || 'Error al actualizar el perfil',
          isLoading: false,
        })
        throw error
      }
    },

    uploadAvatar: async (imageUri: string) => {
      const currentProfile = get().profile
      if (!currentProfile) throw new Error('No profile loaded')

      set({ isLoading: true, error: null })
      try {
        const { avatarUrl } = await ProfileService.uploadAvatar(imageUri)
        set({
          profile: { ...currentProfile, avatar: avatarUrl },
          isLoading: false,
        })
      } catch (error: any) {
        set({
          error: error.message || 'Error al subir la imagen',
          isLoading: false,
        })
        throw error
      }
    },

    setEditing: (editing: boolean) => {
      set({ isEditing: editing })
    },

    clearError: () => {
      set({ error: null })
    },
  }))
)

// Selector hooks para optimizar re-renders
export const useProfile = () => useProfileStore(state => state.profile)
export const useProfileLoading = () => useProfileStore(state => state.isLoading)
export const useProfileError = () => useProfileStore(state => state.error)
export const useProfileEditing = () => useProfileStore(state => state.isEditing)
