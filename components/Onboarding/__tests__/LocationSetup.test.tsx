import { render, screen, userEvent, waitFor } from '@testing-library/react-native'
import * as Location from 'expo-location'

import LocationSetup from '@/components/Onboarding/LocationSetup'
import i18n from '@/services/i18n'
import enUS from '@/services/i18n/locales/en-US.json'

import type { ComponentProps } from 'react'

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}))

const requestPermission = jest.mocked(Location.requestForegroundPermissionsAsync)
const getCurrentPosition = jest.mocked(Location.getCurrentPositionAsync)
const getLastKnownPosition = jest.mocked(Location.getLastKnownPositionAsync)
const reverseGeocode = jest.mocked(Location.reverseGeocodeAsync)

// Expected texts come from the locale file so the tests follow copy changes.
const texts = enUS.onboarding

const granted = { status: 'granted' } as Location.LocationPermissionResponse
const denied = { status: 'denied' } as Location.LocationPermissionResponse
const position: Location.LocationObject = {
  coords: {
    latitude: 40.4168,
    longitude: -3.7038,
    altitude: null,
    accuracy: 10,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: 0,
}
const place = { city: 'Madrid', region: 'Comunidad de Madrid' }
// reverseGeocodeAsync answers with full addresses, but the component only reads city and region.
const address = place as Location.LocationGeocodedAddress

const user = userEvent.setup()

async function renderLocationSetup(props: Partial<ComponentProps<typeof LocationSetup>> = {}) {
  const onLocationSet = jest.fn()
  const onSkip = jest.fn()
  await render(<LocationSetup onLocationSet={onLocationSet} onSkip={onSkip} {...props} />)
  return { onLocationSet, onSkip }
}

const enableButton = () => screen.getByRole('button', { name: texts.location_enable })
const skipButton = () => screen.getByRole('button', { name: texts.location_skip })

describe('LocationSetup', () => {
  beforeAll(async () => {
    // services/i18n starts initialising when it is imported and does not expose the promise.
    // The language is set explicitly instead of relying on the device locale that the
    // expo-localization mock of jest-expo happens to report (en-US today).
    await waitFor(() => expect(i18n.isInitialized).toBe(true))
    await i18n.changeLanguage('en-US')
  })

  beforeEach(() => {
    for (const mock of [
      requestPermission,
      getCurrentPosition,
      getLastKnownPosition,
      reverseGeocode,
    ]) {
      mock.mockReset()
    }
  })

  // Regression tests for APP-06: the slider renders every slide on mount, and the old effect
  // asked for the permission as soon as the app opened and again after every re-render.
  describe('before the user acts', () => {
    it('does not ask for the location permission when it mounts', async () => {
      await renderLocationSetup()

      expect(requestPermission).not.toHaveBeenCalled()
      expect(screen.getByText(texts.location_permission)).toBeOnTheScreen()
    })

    it('does not ask for the location permission when it renders again with new props', async () => {
      const { onLocationSet, onSkip } = await renderLocationSetup({ location: { enabled: false } })

      await screen.rerender(
        <LocationSetup
          onLocationSet={onLocationSet}
          onSkip={onSkip}
          location={{ enabled: false }}
        />
      )

      expect(requestPermission).not.toHaveBeenCalled()
    })
  })

  describe('when the user enables the location', () => {
    it('reports the permission denial on screen and does not ask again on its own', async () => {
      requestPermission.mockResolvedValue(denied)
      const { onLocationSet, onSkip } = await renderLocationSetup()

      await user.press(enableButton())

      expect(await screen.findByText(texts.location_permission_denied)).toBeOnTheScreen()
      expect(onLocationSet).not.toHaveBeenCalled()

      // A re-render, as when the parent updates its state, must not ask for the permission again.
      await screen.rerender(
        <LocationSetup
          onLocationSet={onLocationSet}
          onSkip={onSkip}
          location={{ enabled: false }}
        />
      )
      expect(requestPermission).toHaveBeenCalledTimes(1)
      expect(getCurrentPosition).not.toHaveBeenCalled()
    })

    it('reports the location unavailable without a current or last known position', async () => {
      requestPermission.mockResolvedValue(granted)
      getCurrentPosition.mockRejectedValue(new Error('Location provider is unavailable'))
      getLastKnownPosition.mockResolvedValue(null)
      const { onLocationSet } = await renderLocationSetup()

      await user.press(enableButton())

      expect(await screen.findByText(texts.location_unavailable)).toBeOnTheScreen()
      expect(onLocationSet).not.toHaveBeenCalled()
      expect(reverseGeocode).not.toHaveBeenCalled()
    })

    it('reports the enabled location with its city and region', async () => {
      requestPermission.mockResolvedValue(granted)
      getCurrentPosition.mockResolvedValue(position)
      reverseGeocode.mockResolvedValue([address])
      const { onLocationSet } = await renderLocationSetup()

      await user.press(enableButton())

      await waitFor(() => expect(onLocationSet).toHaveBeenCalledTimes(1))
      expect(onLocationSet).toHaveBeenCalledWith({ enabled: true, ...place })
      expect(reverseGeocode).toHaveBeenCalledWith(position.coords)
      expect(requestPermission).toHaveBeenCalledTimes(1)
    })

    it('uses the last known position when the current position is not available', async () => {
      requestPermission.mockResolvedValue(granted)
      getCurrentPosition.mockRejectedValue(new Error('Location request timed out'))
      getLastKnownPosition.mockResolvedValue(position)
      reverseGeocode.mockResolvedValue([address])
      const { onLocationSet } = await renderLocationSetup()

      await user.press(enableButton())

      await waitFor(() => expect(onLocationSet).toHaveBeenCalledTimes(1))
      expect(onLocationSet).toHaveBeenCalledWith({ enabled: true, ...place })
    })

    it('enables the location without a place when reverse geocoding fails', async () => {
      requestPermission.mockResolvedValue(granted)
      getCurrentPosition.mockResolvedValue(position)
      reverseGeocode.mockRejectedValue(new Error('Geocoder is not available'))
      const { onLocationSet } = await renderLocationSetup()

      await user.press(enableButton())

      await waitFor(() => expect(onLocationSet).toHaveBeenCalledTimes(1))
      expect(onLocationSet.mock.calls[0][0]).toStrictEqual({ enabled: true })
    })
  })

  it('calls onSkip, and asks for nothing, when the user sets it up later', async () => {
    const { onLocationSet, onSkip } = await renderLocationSetup()

    await user.press(skipButton())

    expect(onSkip).toHaveBeenCalledTimes(1)
    expect(onLocationSet).not.toHaveBeenCalled()
    expect(requestPermission).not.toHaveBeenCalled()
  })

  describe('when the location is already enabled', () => {
    it('shows the enabled place and no buttons', async () => {
      await renderLocationSetup({ location: { enabled: true, ...place } })

      expect(screen.getByText(texts.location_set_text)).toBeOnTheScreen()
      expect(
        screen.getByText(
          texts.location_enabled.replace('{{place}}', `${place.city}, ${place.region}`)
        )
      ).toBeOnTheScreen()
      expect(screen.queryByRole('button')).not.toBeOnTheScreen()
    })

    it('shows the generic text when the place is unknown', async () => {
      await renderLocationSetup({ location: { enabled: true } })

      expect(screen.getByText(texts.location_enabled_no_place)).toBeOnTheScreen()
      expect(screen.queryByRole('button')).not.toBeOnTheScreen()
    })
  })
})
