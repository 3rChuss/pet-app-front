import AsyncStorage from '@react-native-async-storage/async-storage'
import { act, renderHook } from '@testing-library/react-native'

import { USER_PREFERENCES_KEY } from '@/lib/const/onBoarding'
import { useUserPreferences } from '@/lib/hooks/useUserPreferences'

import type { UserPreferences } from '@/lib/types/onboarding'

const defaultPreferences: UserPreferences = {
  petTypes: [],
  location: { enabled: false },
  notifications: { adoptions: true, events: true, nearby: true },
  interests: [],
}

describe('useUserPreferences', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('starts with the default preferences and no pending work', async () => {
    const { result } = await renderHook(() => useUserPreferences())

    expect(result.current.preferences).toEqual(defaultPreferences)
    expect(result.current.loading).toBe(false)
  })

  it('adds a pet type the first time it is toggled and removes it the second time', async () => {
    const { result } = await renderHook(() => useUserPreferences())

    await act(() => {
      result.current.togglePetType('dogs')
    })
    await act(() => {
      result.current.togglePetType('cats')
    })
    expect(result.current.preferences.petTypes).toEqual(['dogs', 'cats'])

    await act(() => {
      result.current.togglePetType('dogs')
    })
    expect(result.current.preferences.petTypes).toEqual(['cats'])
  })

  it('adds an interest the first time it is toggled and removes it the second time', async () => {
    const { result } = await renderHook(() => useUserPreferences())

    await act(() => {
      result.current.toggleInterest('adoption')
    })
    await act(() => {
      result.current.toggleInterest('pet_care')
    })
    expect(result.current.preferences.interests).toEqual(['adoption', 'pet_care'])

    await act(() => {
      result.current.toggleInterest('adoption')
    })
    expect(result.current.preferences.interests).toEqual(['pet_care'])
  })

  it('keeps pet types, interests and notifications untouched when another field changes', async () => {
    const { result } = await renderHook(() => useUserPreferences())

    await act(() => {
      result.current.togglePetType('rabbits')
      result.current.toggleInterest('training')
      result.current.setLocation({ enabled: true })
    })

    expect(result.current.preferences).toEqual({
      ...defaultPreferences,
      petTypes: ['rabbits'],
      interests: ['training'],
      location: { enabled: true },
    })
  })

  it('replaces the location', async () => {
    const { result } = await renderHook(() => useUserPreferences())
    const location = { enabled: true, city: 'Madrid', region: 'Comunidad de Madrid' }

    await act(() => {
      result.current.setLocation(location)
    })

    expect(result.current.preferences.location).toEqual(location)
  })

  describe('savePreferences', () => {
    it('stores the preferences as JSON under the storage key and reports success', async () => {
      const { result } = await renderHook(() => useUserPreferences())
      await act(() => {
        result.current.togglePetType('birds')
        result.current.toggleInterest('community')
        result.current.setLocation({ enabled: true, city: 'Valencia', region: 'Valencia' })
      })

      let saved: boolean | undefined
      await act(async () => {
        saved = await result.current.savePreferences()
      })

      expect(saved).toBe(true)
      expect(result.current.loading).toBe(false)
      const stored = await AsyncStorage.getItem(USER_PREFERENCES_KEY)
      expect(JSON.parse(stored ?? 'null')).toEqual({
        ...defaultPreferences,
        petTypes: ['birds'],
        interests: ['community'],
        location: { enabled: true, city: 'Valencia', region: 'Valencia' },
      })
    })

    it('reports failure, logs the error and stores nothing when the write fails', async () => {
      const error = new Error('storage is full')
      const setItem = jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(error)
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      const { result } = await renderHook(() => useUserPreferences())

      let saved: boolean | undefined
      await act(async () => {
        saved = await result.current.savePreferences()
      })

      expect(saved).toBe(false)
      expect(setItem).toHaveBeenCalledTimes(1)
      expect(consoleError).toHaveBeenCalledWith('Error saving user preferences:', error)
      expect(result.current.loading).toBe(false)
      expect(await AsyncStorage.getItem(USER_PREFERENCES_KEY)).toBeNull()
    })
  })

  describe('loadPreferences', () => {
    it('restores what a previous session saved', async () => {
      const previousSession = await renderHook(() => useUserPreferences())
      await act(() => {
        previousSession.result.current.togglePetType('reptiles')
        previousSession.result.current.toggleInterest('grooming')
        previousSession.result.current.setLocation({ enabled: true, city: 'Sevilla' })
      })
      await act(async () => {
        await previousSession.result.current.savePreferences()
      })

      const newSession = await renderHook(() => useUserPreferences())
      expect(newSession.result.current.preferences).toEqual(defaultPreferences)

      let loaded: UserPreferences | null | undefined
      await act(async () => {
        loaded = await newSession.result.current.loadPreferences()
      })

      const expected = {
        ...defaultPreferences,
        petTypes: ['reptiles'],
        interests: ['grooming'],
        location: { enabled: true, city: 'Sevilla' },
      }
      expect(loaded).toEqual(expected)
      expect(newSession.result.current.preferences).toEqual(expected)
    })

    it('returns null and keeps the default preferences when nothing was saved', async () => {
      const { result } = await renderHook(() => useUserPreferences())

      let loaded: UserPreferences | null | undefined
      await act(async () => {
        loaded = await result.current.loadPreferences()
      })

      expect(loaded).toBeNull()
      expect(result.current.preferences).toEqual(defaultPreferences)
    })

    it('returns null, logs the error and keeps the defaults when the stored value is corrupt', async () => {
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, '{not valid json')
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      const { result } = await renderHook(() => useUserPreferences())

      let loaded: UserPreferences | null | undefined
      await act(async () => {
        loaded = await result.current.loadPreferences()
      })

      expect(loaded).toBeNull()
      expect(consoleError).toHaveBeenCalledWith(
        'Error loading user preferences:',
        expect.any(SyntaxError)
      )
      expect(result.current.preferences).toEqual(defaultPreferences)
    })
  })

  describe('clearPreferences', () => {
    it('removes the stored preferences and restores the defaults', async () => {
      const { result } = await renderHook(() => useUserPreferences())
      await act(() => {
        result.current.togglePetType('dogs')
      })
      await act(async () => {
        await result.current.savePreferences()
      })
      expect(await AsyncStorage.getItem(USER_PREFERENCES_KEY)).not.toBeNull()

      await act(async () => {
        await result.current.clearPreferences()
      })

      expect(await AsyncStorage.getItem(USER_PREFERENCES_KEY)).toBeNull()
      expect(result.current.preferences).toEqual(defaultPreferences)
    })
  })
})
