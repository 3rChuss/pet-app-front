import {
  Baby,
  Bird,
  Bone,
  Cat,
  Dog,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Link as LinkIcon,
  PawPrint,
  Rabbit,
  Scissors,
  Stethoscope,
  Turtle,
  Users,
} from 'lucide-react-native'

import { OnboardingSlide, PetType, Interest } from '@/lib/types/onboarding'

import type { LucideIcon } from 'lucide-react-native'

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
    skipable: false,
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

export const PET_TYPES: { key: PetType; label: string; icon: LucideIcon }[] = [
  { key: 'dogs', label: 'Dogs', icon: Dog },
  { key: 'cats', label: 'Cats', icon: Cat },
  { key: 'birds', label: 'Birds', icon: Bird },
  { key: 'rabbits', label: 'Rabbits', icon: Rabbit },
  { key: 'reptiles', label: 'Reptiles', icon: Turtle },
  { key: 'other', label: 'Other', icon: PawPrint },
]

export const INTERESTS: { key: Interest; label: string; icon: LucideIcon }[] = [
  { key: 'adoption', label: 'Adoption', icon: HeartHandshake },
  { key: 'breeding', label: 'Breeding', icon: Baby },
  { key: 'training', label: 'Training', icon: GraduationCap },
  { key: 'playdates', label: 'Playdates', icon: Bone },
  { key: 'pet_care', label: 'Pet Care', icon: HandHeart },
  { key: 'veterinary', label: 'Veterinary', icon: Stethoscope },
  { key: 'grooming', label: 'Grooming', icon: Scissors },
  { key: 'matching', label: 'Matching', icon: LinkIcon },
  { key: 'community', label: 'Community', icon: Users },
]

export const ONBOARDING_KEY = '@petopia_onboarding_completed'
export const USER_PREFERENCES_KEY = '@petopia_user_preferences'
