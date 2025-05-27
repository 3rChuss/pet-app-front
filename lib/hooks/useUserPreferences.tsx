import { useState, useCallback } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { USER_PREFERENCES_KEY } from '@/lib/const/onBoarding'
import { UserPreferences, PetType, Interest } from '@/lib/types/onboarding'

const defaultPreferences: UserPreferences = {
  petTypes: [],
  location: {
    enabled: false,
  },
  notifications: {
    adoptions: true,
    events: true,
    nearby: true,
  },
  interests: [],
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [loading, setLoading] = useState(false)

  const togglePetType = useCallback((petType: PetType) => {
    setPreferences(prev => ({
      ...prev,
      petTypes: prev.petTypes.includes(petType)
        ? prev.petTypes.filter(type => type !== petType)
        : [...prev.petTypes, petType],
    }))
  }, [])

  const toggleInterest = useCallback((interest: Interest) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(int => int !== interest)
        : [...prev.interests, interest],
    }))
  }, [])

  const setLocation = useCallback((location: UserPreferences['location']) => {
    setPreferences(prev => ({
      ...prev,
      location,
    }))
  }, [])

  const savePreferences = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    try {
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences))
      return true
    } catch (error) {
      console.error('Error saving user preferences:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [preferences])

  const loadPreferences = useCallback(async (): Promise<UserPreferences | null> => {
    try {
      const stored = await AsyncStorage.getItem(USER_PREFERENCES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setPreferences(parsed)
        return parsed
      }
    } catch (error) {
      console.error('Error loading user preferences:', error)
    }
    return null
  }, [])

  const clearPreferences = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER_PREFERENCES_KEY)
      setPreferences(defaultPreferences)
    } catch (error) {
      console.error('Error clearing user preferences:', error)
    }
  }, [])

  return {
    preferences,
    loading,
    togglePetType,
    toggleInterest,
    setLocation,
    savePreferences,
    loadPreferences,
    clearPreferences,
  }
}
