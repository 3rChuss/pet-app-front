export interface UserPreferences {
  petTypes: PetType[]
  location?: {
    enabled: boolean
    city?: string
    region?: string
  }
  notifications: {
    adoptions: boolean
    events: boolean
    nearby: boolean
  }
  interests: Interest[]
}

export type PetType = 'dogs' | 'cats' | 'birds' | 'rabbits' | 'reptiles' | 'other'

export type Interest =
  | 'adoption'
  | 'breeding'
  | 'training'
  | 'playdates'
  | 'pet_care'
  | 'veterinary'
  | 'grooming'
  | 'community'
  | 'matching'

export interface OnboardingSlide {
  key: string
  title: string
  text: string
  image: any
  backgroundColor: string
  type: 'intro' | 'pet_selection' | 'location' | 'interests' | 'final'
  skipable?: boolean
}

export interface OnboardingState {
  currentSlide: number
  preferences: UserPreferences
  completed: boolean
}
