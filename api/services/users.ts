import client from '@/api/client'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isVerified?: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  bio?: string
  location?: string
  pets: {
    id: string
    name: string
    type: string
    breed?: string
  }[]
  stats: {
    posts: number
    followers: number
    following: number
  }
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  avatar?: string
}

export interface UpdateUserRequest {
  name?: string
  bio?: string
  location?: string
  avatar?: string
}

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await client.get<UserProfile>(`/users/${userId}`)
  return response.data
}

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await client.get<UserProfile>('/users/me')
  return response.data
}

/**
 * Update current user profile
 */
export const updateCurrentUser = async (data: UpdateUserRequest): Promise<UserProfile> => {
  const response = await client.put<UserProfile>('/users/me', data)
  return response.data
}

/**
 * Search users by query
 */
export const searchUsers = async (query: string, limit = 10): Promise<User[]> => {
  const response = await client.get<User[]>('/users/search', {
    params: { q: query, limit },
  })
  return response.data
}

/**
 * Follow/unfollow a user
 */
export const toggleFollowUser = async (userId: string): Promise<{ isFollowing: boolean }> => {
  const response = await client.post<{ isFollowing: boolean }>(`/users/${userId}/follow`)
  return response.data
}

/**
 * Get user followers
 */
export const getUserFollowers = async (userId: string, page = 1): Promise<User[]> => {
  const response = await client.get<User[]>(`/users/${userId}/followers`, {
    params: { page },
  })
  return response.data
}

/**
 * Get user following
 */
export const getUserFollowing = async (userId: string, page = 1): Promise<User[]> => {
  const response = await client.get<User[]>(`/users/${userId}/following`, {
    params: { page },
  })
  return response.data
}
