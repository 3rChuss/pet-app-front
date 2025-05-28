import { OnboardingSlide, PetType, Interest } from '@/lib/types/onboarding'

export const slides: OnboardingSlide[] = [
  {
    key: 'welcome',
    title: 'welcome1',
    text: 'text1',
    image: require('../../assets/images/onboarding/onboarding_1.jpg'),
    backgroundColor: '#A0D2DB', // Primary brand color
    type: 'intro',
    skipable: false,
  },
  {
    key: 'pets',
    title: 'pet_selection_title',
    text: 'pet_selection_text',
    image: require('../../assets/images/onboarding/onboarding_2.jpg'),
    backgroundColor: '#F8B595', // Secondary coral
    type: 'pet_selection',
    skipable: true,
  },
  {
    key: 'location',
    title: 'location_title',
    text: 'location_text',
    image: require('../../assets/images/onboarding/onboarding_3.jpg'),
    backgroundColor: '#C8E6C9', // Secondary green
    type: 'location',
    skipable: true,
  },
  {
    key: 'interests',
    title: 'interests_title',
    text: 'interests_text',
    image: require('../../assets/images/onboarding/onboarding_4.jpg'),
    backgroundColor: '#FFDA63', // Accent yellow
    type: 'interests',
    skipable: true,
  },
  {
    key: 'final',
    title: 'welcome4',
    text: 'text4',
    image: require('../../assets/images/onboarding/onboarding_1.jpg'),
    backgroundColor: '#A0D2DB',
    type: 'final',
    skipable: false,
  },
]

export const PET_TYPES: { key: PetType; label: string; emoji: string }[] = [
  { key: 'dogs', label: 'Dogs', emoji: '🐕' },
  { key: 'cats', label: 'Cats', emoji: '🐱' },
  { key: 'birds', label: 'Birds', emoji: '🦜' },
  { key: 'rabbits', label: 'Rabbits', emoji: '🐰' },
  { key: 'other', label: 'Other', emoji: '🐾' },
]

export const INTERESTS: { key: Interest; label: string; emoji: string }[] = [
  { key: 'adoption', label: 'Adoption', emoji: '🏠' },
  { key: 'breeding', label: 'Breeding', emoji: '👶' },
  { key: 'training', label: 'Training', emoji: '🎓' },
  { key: 'playdates', label: 'Playdates', emoji: '🎾' },
  { key: 'pet_care', label: 'Pet Care', emoji: '🧴' },
  { key: 'veterinary', label: 'Veterinary', emoji: '🏥' },
  { key: 'grooming', label: 'Grooming', emoji: '✂️' },
  { key: 'matching', label: 'Matching', emoji: '🔗' },
  { key: 'community', label: 'Community', emoji: '👥' },
]

export const ONBOARDING_KEY = '@petopia_onboarding_completed'
export const USER_PREFERENCES_KEY = '@petopia_user_preferences'
