import { Post, MediaItem } from '@/components/Post/types'
import { MOCK_POSTS } from '@/lib/const/mockData'

// Adapter function to convert old MockPost format to new Post format
export function adaptMockPostsToNewFormat(): Post[] {
  return MOCK_POSTS.map(mockPost => ({
    id: mockPost.id,
    user: {
      id: mockPost.user.name.toLowerCase().replace(/\s+/g, ''), // Generate ID from name
      name: mockPost.user.name,
      avatar: String(mockPost.user.avatar),
      location: mockPost.user.location,
      isVerified: false,
      isOnline: (mockPost.user as any).online || false,
    },
    pet: mockPost.pet
      ? {
          name: mockPost.pet.name,
          type: mockPost.pet.type,
          breed: mockPost.pet.breed,
        }
      : undefined,
    content: {
      text: mockPost.content.text,
      media: mockPost.content.images.map(
        (image, index): MediaItem => ({
          id: `${mockPost.id}-media-${index}`,
          type: 'image',
          uri: String(image),
        })
      ),
    },
    stats: {
      likes: mockPost.stats.likes,
      comments: mockPost.stats.comments,
      shares: mockPost.stats.shares,
      isLiked: false,
      isSaved: false,
    },
    timestamp: mockPost.timestamp,
    isSponsored: mockPost.isSponsored || false,
  }))
}

// Sample posts with video and multiple media for testing
export const SAMPLE_POSTS_WITH_MEDIA: Post[] = [
  {
    id: 'video-post-1',
    user: {
      id: 'maria-lopez',
      name: 'María López',
      avatar: 'https://picsum.photos/100/100?random=1',
      location: 'Valencia, España',
      isVerified: true,
      isOnline: true,
    },
    pet: {
      name: 'Max',
      type: 'dog',
      breed: 'Border Collie',
    },
    content: {
      text: '¡Max aprendiendo nuevos trucos! 🐕‍🦺 Su concentración es increíble. Pronto estará listo para competencias de agility.',
      media: [
        {
          id: 'video-1',
          type: 'video',
          uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail: 'https://picsum.photos/400/600?random=10',
          duration: 30,
        },
        {
          id: 'image-1',
          type: 'image',
          uri: 'https://picsum.photos/400/600?random=11',
        },
        {
          id: 'image-2',
          type: 'image',
          uri: 'https://picsum.photos/400/600?random=12',
        },
      ],
    },
    stats: {
      likes: 156,
      comments: 24,
      shares: 8,
      isLiked: true,
      isSaved: false,
    },
    timestamp: '2025-01-15T16:45:00Z',
    isSponsored: false,
  },
  {
    id: 'multi-image-post',
    user: {
      id: 'pedro-sanchez',
      name: 'Pedro Sánchez',
      avatar: 'https://picsum.photos/100/100?random=2',
      location: 'Sevilla, España',
      isVerified: false,
      isOnline: false,
    },
    pet: {
      name: 'Coco',
      type: 'cat',
      breed: 'Persa',
    },
    content: {
      text: 'Día de sesión fotográfica con Coco 📸 Miren qué poses más elegantes. Es todo un modelo profesional 🐱✨',
      media: [
        {
          id: 'coco-1',
          type: 'image',
          uri: 'https://picsum.photos/400/600?random=20',
        },
        {
          id: 'coco-2',
          type: 'image',
          uri: 'https://picsum.photos/400/600?random=21',
        },
        {
          id: 'coco-3',
          type: 'image',
          uri: 'https://picsum.photos/400/600?random=22',
        },
        {
          id: 'coco-4',
          type: 'image',
          uri: 'https://picsum.photos/400/600?random=23',
        },
      ],
    },
    stats: {
      likes: 89,
      comments: 12,
      shares: 3,
      isLiked: false,
      isSaved: true,
    },
    timestamp: '2025-01-15T12:30:00Z',
    isSponsored: false,
  },
]

// Combined posts for testing
export const ALL_SAMPLE_POSTS: Post[] = [...SAMPLE_POSTS_WITH_MEDIA, ...adaptMockPostsToNewFormat()]
