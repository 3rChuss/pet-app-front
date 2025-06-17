import type { AppTypes } from 'app-types'

export interface ProfileUpdatePayload {
  userName?: string
  firstName?: string
  lastName?: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
}

export interface ProfileState {
  profile: AppTypes.UserProfile | null
  isLoading: boolean
  error: string | null
  isEditing: boolean
}

export interface ProfileActions {
  fetchProfile: () => Promise<void>
  updateProfile: (data: ProfileUpdatePayload) => Promise<void>
  uploadAvatar: (imageUri: string) => Promise<void>
  setEditing: (editing: boolean) => void
  clearError: () => void
}
