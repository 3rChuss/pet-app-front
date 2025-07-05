export type UserMode = 'authenticated' | 'guest' | 'unauthenticated'

export interface GuestModeConfig {
  allowedScreens: string[]
  restrictedFeatures: string[]
  mockedData: {
    posts: boolean
    profiles: boolean
    stats: boolean
  }
  ctaFrequency: number // How often to show CTAs (every N interactions)
}

export interface MockPost {
  id: string
  user: {
    name: string
    avatar: string
    location: string
    online: boolean
  }
  pet: {
    name: string
    type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
    breed?: string
  }
  content: {
    text: string
    images: string[]
  }
  stats: {
    likes: number
    comments: number
    shares: number
  }
  timestamp: string
  isSponsored?: boolean
}

export interface MockProfile {
  id: string
  name: string
  bio: string
  avatar: string
  location: string
  stats: {
    posts: number
    followersCount: number
    followingCount: number
  }
  pets: {
    name: string
    type: string
    age: string
    image: string
  }[]
  isVerified: boolean
}

export interface GuestModeState {
  config: GuestModeConfig
  mockPosts: MockPost[]
  mockProfiles: MockProfile[]
  interactionCount: number
  showCTA: boolean
  trackInteraction: (feature: string) => void
  dismissCTA: () => void
}
