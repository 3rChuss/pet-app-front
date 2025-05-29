declare module 'app-types' {
  export namespace AppTypes {
    interface AppConfig {
      appName: string
      appVersion: string
      appDescription: string
      appAuthor: string
      appLicense: string
      appRepository: string
      appKeywords: string[]
      appDependencies: Record<string, string>
      appDevDependencies: Record<string, string>
    }

    // Database-related types
    interface User {
      id: number
      name: string
      last_name: string
      username: string
      email: string
      avatar: string
      latitude?: number | null
      longitude?: number | null
      geog?: { type: 'Point'; coordinates: [number, number] } | null // GEOGRAPHY(Point, 4326), NULLABLE (Assuming GeoJSON-like structure)
      language: string
      newsletter_subscribed: boolean // BOOLEAN, DEFAULT FALSE
      privacy_policy_accepted_at?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      terms_accepted_at?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      email_verified_at?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      last_login_at?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      is_active: boolean // BOOLEAN, DEFAULT TRUE
      is_premium: boolean // BOOLEAN, DEFAULT FALSE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface UserProfile extends User {
      id: number
      pets: Pet[] // Array of Pet objects
      bio?: string
      stats: {
        posts: number // Total posts by the user
        followers: number // Total followers
        following: number // Total following
      }
    }

    interface PetType {
      id: number // SERIAL
      name: string // VARCHAR(100), UNIQUE, NOT NULL
      icon_url?: string | null // VARCHAR(512), NULLABLE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface Breed {
      id: number // SERIAL
      pet_type_id: number // INTEGER, FK to PetTypes.id, NOT NULL
      name: string // VARCHAR(100), NOT NULL
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type PetGender = 'male' | 'female' | 'unknown'
    type PetSize = 'small' | 'medium' | 'large' | 'extra_large'

    interface Pet {
      id: number // BIGSERIAL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      name: string // VARCHAR(100), NOT NULL
      pet_type_id: number // INTEGER, FK to PetTypes.id, NOT NULL
      breed_id?: number | null // INTEGER, FK to Breeds.id, NULLABLE
      birth_date?: string | null // DATE, NULLABLE (ISO Date string)
      gender: PetGender // VARCHAR(10), CHECK (gender IN ('male', 'female', 'unknown')), DEFAULT 'unknown'
      color?: string | null // VARCHAR(50), NULLABLE
      chip_number?: string | null // VARCHAR(50), NULLABLE, UNIQUE
      bio?: string | null // TEXT, NULLABLE
      is_sterilized?: boolean | null // BOOLEAN, NULLABLE
      is_looking_for_mate: boolean // BOOLEAN, DEFAULT FALSE
      vaccination_status?: Record<string, any> | string | null // JSON, NULLABLE (Could be structured JSON or free text)
      size?: PetSize | null // VARCHAR(20), CHECK (size IN ('small', 'medium', 'large', 'extra_large')), NULLABLE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface LocationCategory {
      id: number // SERIAL
      name: string // VARCHAR(100), UNIQUE, NOT NULL
      slug: string // VARCHAR(100), UNIQUE, NOT NULL
      description?: string | null // TEXT, NULLABLE
      icon_url?: string | null // VARCHAR(512), NULLABLE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface Location {
      id: number // BIGSERIAL
      name: string // VARCHAR(255), NOT NULL
      description?: string | null // TEXT, NULLABLE
      address?: string | null // VARCHAR(512), NULLABLE
      latitude: number // DECIMAL(10,7), NOT NULL
      longitude: number // DECIMAL(11,7), NOT NULL
      location_geog: { type: 'Point'; coordinates: [number, number] } // GEOGRAPHY(Point, 4326), NOT NULL (Assuming GeoJSON-like structure)
      location_category_id: number // INTEGER, FK to LocationCategories.id, NOT NULL
      added_by_user_id?: number | null // BIGINT, FK to Users.id, NULLABLE
      is_approved: boolean // BOOLEAN, DEFAULT FALSE
      phone_number?: string | null // VARCHAR(30), NULLABLE
      website_url?: string | null // VARCHAR(512), NULLABLE
      opening_hours?: Record<string, string> | null // JSON, NULLABLE (e.g., {"mon": "09:00-18:00", ...})
      average_rating: number // DECIMAL(3,2), DEFAULT 0.00
      reviews_count: number // INTEGER, DEFAULT 0
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface LocationReview {
      id: number // BIGSERIAL
      location_id: number // BIGINT, FK to Locations.id, NOT NULL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      rating: 1 | 2 | 3 | 4 | 5 // SMALLINT, NOT NULL, CHECK (rating >= 1 AND rating <= 5)
      comment?: string | null // TEXT, NULLABLE
      likes_count: number // INTEGER, DEFAULT 0
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface Post {
      id: number // BIGSERIAL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      content: string // TEXT, NOT NULL
      pet_id?: number | null // BIGINT, FK to Pets.id, NULLABLE
      location_id?: number | null // BIGINT, FK to Locations.id, NULLABLE
      likes_count: number // INTEGER, DEFAULT 0
      comments_count: number // INTEGER, DEFAULT 0
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface Comment {
      id: number // BIGSERIAL
      post_id: number // BIGINT, FK to Posts.id, NOT NULL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      parent_comment_id?: number | null // BIGINT, FK to Comments.id, NULLABLE
      content: string // TEXT, NOT NULL
      likes_count: number // INTEGER, DEFAULT 0
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type LikeableType = 'Post' | 'Comment' | 'LocationReview'

    interface Like {
      id: number // BIGSERIAL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      likeable_id: number // BIGINT, NOT NULL
      likeable_type: LikeableType // VARCHAR(50), NOT NULL
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type MediableType = 'Pet' | 'Post' | 'LocationReview' | 'UserProfile' | 'ChatMessage'

    interface MediaItem {
      id: number // BIGSERIAL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      mediable_id: number // BIGINT, NOT NULL
      mediable_type: MediableType // VARCHAR(50), NOT NULL
      file_path: string // VARCHAR(512), NOT NULL
      file_type: string // VARCHAR(50), NOT NULL (MIME type)
      file_size_bytes?: number | null // BIGINT, NULLABLE
      metadata?: Record<string, any> | null // JSON, NULLABLE (e.g., dimensions, duration)
      sort_order: number // SMALLINT, DEFAULT 0
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface Conversation {
      id: number // BIGSERIAL
      title?: string | null // VARCHAR(255), NULLABLE
      last_message_id?: number | null // BIGINT, FK to ChatMessages.id, NULLABLE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type ChatMessageContentType = 'text' | 'image' | 'video' | 'location' | 'pet_profile_share'

    interface ChatMessage {
      id: number // BIGSERIAL
      conversation_id: number // BIGINT, FK to Conversations.id, NOT NULL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      content_type: ChatMessageContentType // VARCHAR(20), DEFAULT 'text'
      content: string // TEXT, NOT NULL (text, URL to media, JSON for location/pet_profile_share)
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface ConversationParticipant {
      id: number // BIGSERIAL
      conversation_id: number // BIGINT, FK to Conversations.id, NOT NULL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      joined_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      last_read_message_id?: number | null // BIGINT, FK to ChatMessages.id, NULLABLE
      is_admin: boolean // BOOLEAN, DEFAULT FALSE
      notifications_enabled: boolean // BOOLEAN, DEFAULT TRUE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type PetMatchInteractionType = 'like' | 'dislike' | 'superlike'

    interface PetMatchInteraction {
      id: number // BIGSERIAL
      swiper_pet_id: number // BIGINT, FK to Pets.id, NOT NULL
      target_pet_id: number // BIGINT, FK to Pets.id, NOT NULL
      interaction_type: PetMatchInteractionType // VARCHAR(10), NOT NULL
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type PetMatchStatus = 'active' | 'unmatched'

    interface PetMatch {
      id: number // BIGSERIAL
      pet1_id: number // BIGINT, FK to Pets.id, NOT NULL
      pet2_id: number // BIGINT, FK to Pets.id, NOT NULL
      matched_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      conversation_id?: number | null // BIGINT, FK to Conversations.id, NULLABLE, UNIQUE
      status: PetMatchStatus // VARCHAR(10), DEFAULT 'active'
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type NotificationType = 'new_like_post' | 'new_comment' | 'new_pet_match' | string // string allows for future extension
    type NotifiableType = 'Post' | 'User' | 'PetMatch' | string // string allows for future extension

    interface Notification {
      id: number // BIGSERIAL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      type: NotificationType // VARCHAR(100), NOT NULL
      notifiable_id?: number | null // BIGINT, NULLABLE
      notifiable_type?: NotifiableType | null // VARCHAR(50), NULLABLE
      data?: Record<string, any> | null // JSON, NULLABLE
      read_at?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type ReportableType = 'User' | 'Post' | 'Comment' | 'Pet'
    type ReportReasonCategory = 'spam' | 'inappropriate_content' | 'harassment' | string // string allows for future extension
    type ReportStatus = 'pending' | 'reviewed_action_taken' | 'reviewed_no_action'

    interface Report {
      id: number // BIGSERIAL
      reporter_user_id: number // BIGINT, FK to Users.id, NOT NULL
      reportable_id: number // BIGINT, NOT NULL
      reportable_type: ReportableType // VARCHAR(50), NOT NULL
      reason_category?: ReportReasonCategory | null // VARCHAR(50), NULLABLE
      reason_details: string // TEXT, NOT NULL
      status: ReportStatus // VARCHAR(20), DEFAULT 'pending'
      reviewed_by_admin_id?: number | null // BIGINT, FK to Users.id, NULLABLE
      reviewed_at?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      admin_notes?: string | null // TEXT, NULLABLE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    interface SubscriptionPlan {
      id: number // SERIAL
      name: string // VARCHAR(100), UNIQUE, NOT NULL
      slug: string // VARCHAR(100), UNIQUE, NOT NULL
      description?: string | null // TEXT, NULLABLE
      price_monthly?: number | null // DECIMAL(8,2), NULLABLE
      price_yearly?: number | null // DECIMAL(8,2), NULLABLE
      features?: string[] | null // JSON, NULLABLE (e.g., ["ad_free", "unlimited_swipes"])
      is_active: boolean // BOOLEAN, DEFAULT TRUE
      stripe_price_id_monthly?: string | null // VARCHAR(255), NULLABLE
      stripe_price_id_yearly?: string | null // VARCHAR(255), NULLABLE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type UserSubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'incomplete' | 'past_due'

    interface UserSubscription {
      id: number // BIGSERIAL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      subscription_plan_id: number // INTEGER, FK to SubscriptionPlans.id, NOT NULL
      start_date: string // TIMESTAMP, NOT NULL (ISO Date string)
      end_date?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      current_period_start?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      current_period_end?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      status: UserSubscriptionStatus // VARCHAR(20), NOT NULL
      payment_provider?: string | null // VARCHAR(50), NULLABLE
      payment_provider_subscription_id?: string | null // VARCHAR(255), NULLABLE, UNIQUE
      cancelled_at?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }

    type SavedSearchType = 'pets' | 'locations' | 'posts'

    interface SavedSearch {
      id: number // BIGSERIAL
      user_id: number // BIGINT, FK to Users.id, NOT NULL
      name?: string | null // VARCHAR(255), NULLABLE
      search_type: SavedSearchType // VARCHAR(50), NOT NULL
      search_parameters: Record<string, any> // JSON, NOT NULL
      last_notified_at?: string | null // TIMESTAMP, NULLABLE (ISO Date string)
      notifications_enabled: boolean // BOOLEAN, DEFAULT TRUE
      created_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
      updated_at: string // TIMESTAMP, DEFAULT CURRENT_TIMESTAMP (ISO Date string)
    }
  }
}
