import { MockPost, MockProfile } from '@/lib/types/guest-mode'

export const MOCK_POSTS: MockPost[] = [
  {
    id: '1',
    user: {
      name: 'Ana García',
      avatar: '👩‍🦰',
      location: 'Madrid, España',
    },
    pet: {
      name: 'Luna',
      type: 'dog',
      breed: 'Golden Retriever',
    },
    content: {
      text: '¡Luna se lo está pasando genial en el parque! 🌳 Hemos conocido a muchos amigos peludos hoy. ¿Alguien más está en el Parque del Retiro?',
      images: ['🏞️', '🐕‍🦺'],
    },
    stats: {
      likes: 23,
      comments: 8,
      shares: 2,
    },
    timestamp: '2025-01-15T14:30:00Z',
  },
  {
    id: '2',
    user: {
      name: 'Carlos Ruiz',
      avatar: '👨',
      location: 'Barcelona, España',
    },
    pet: {
      name: 'Whiskers',
      type: 'cat',
      breed: 'Siamés',
    },
    content: {
      text: 'Whiskers ha aprendido un nuevo truco! 🐱 Ahora sabe sentarse y dar la pata. Los gatos SÍ pueden aprender trucos.',
      images: ['🐾', '🎯'],
    },
    stats: {
      likes: 45,
      comments: 12,
      shares: 5,
    },
    timestamp: '2025-01-15T10:15:00Z',
  },
  {
    id: '3',
    user: {
      name: 'María López',
      avatar: '👩',
      location: 'Valencia, España',
    },
    pet: {
      name: 'Paco',
      type: 'bird',
      breed: 'Loro Amazonas',
    },
    content: {
      text: '¡Paco dice "hola" a todos! 🦜 Estamos buscando otros dueños de aves en Valencia para organizar una reunión.',
      images: ['🦜', '🌈'],
    },
    stats: {
      likes: 18,
      comments: 6,
      shares: 1,
    },
    timestamp: '2025-01-14T16:45:00Z',
    isSponsored: false,
  },
  {
    id: '4',
    user: {
      name: 'Pet Store Valencia',
      avatar: '🏪',
      location: 'Valencia, España',
    },
    pet: {
      name: 'Productos',
      type: 'other',
      breed: 'Varios',
    },
    content: {
      text: '🛍️ ¡Nueva colección de juguetes para mascotas! Ven a visitarnos y encuentra el regalo perfecto para tu compañero peludo.',
      images: ['🧸', '🎾'],
    },
    stats: {
      likes: 12,
      comments: 3,
      shares: 8,
    },
    timestamp: '2025-01-13T09:00:00Z',
    isSponsored: true,
  },
]

export const MOCK_PROFILES: MockProfile[] = [
  {
    id: '1',
    name: 'Ana García',
    bio: 'Amante de los perros 🐕 | Veterinaria 👩‍⚕️ | Madrid',
    avatar: '👩‍🦰',
    location: 'Madrid, España',
    stats: {
      posts: 47,
      followers: 234,
      following: 156,
    },
    pets: [
      {
        name: 'Luna',
        type: 'Golden Retriever',
        age: '3 años',
        image: '🐕‍🦺',
      },
      {
        name: 'Max',
        type: 'Border Collie',
        age: '5 años',
        image: '🐕',
      },
    ],
    isVerified: true,
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    bio: 'Papá gatuno 🐱 | Fotógrafo de mascotas 📸 | Barcelona',
    avatar: '👨',
    location: 'Barcelona, España',
    stats: {
      posts: 89,
      followers: 456,
      following: 234,
    },
    pets: [
      {
        name: 'Whiskers',
        type: 'Gato Siamés',
        age: '2 años',
        image: '🐱',
      },
    ],
    isVerified: false,
  },
]

export const GUEST_MODE_CONFIG = {
  allowedScreens: ['index', 'search', 'map', 'profile'],
  restrictedFeatures: ['create', 'like', 'comment', 'share', 'follow', 'message'],
  mockedData: {
    posts: true,
    profiles: true,
    stats: true,
  },
  ctaFrequency: 3, // Show CTA every 3 interactions
}
