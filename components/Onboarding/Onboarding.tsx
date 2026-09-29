import { useRef } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { ImageBackground } from 'expo-image'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button from '@/components/Button/Button'
import InterestSelector from '@/components/Onboarding/InterestSelector'
import LocationSetup from '@/components/Onboarding/LocationSetup'
import PetTypeSelector from '@/components/Onboarding/PetTypeSelector'
import { ONBOARDING_KEY, slides, PET_TYPES, INTERESTS } from '@/lib/const/onBoarding'
import { useUserPreferences } from '@/lib/hooks/useUserPreferences'
import { OnboardingSlide } from '@/lib/types/onboarding'

interface OnboardingScreenProps {
  onGuestMode?: () => void
}

export default function OnboardingScreen({ onGuestMode }: OnboardingScreenProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const slideRef = useRef<AppIntroSlider>(null)

  const {
    preferences,
    loading: preferencesLoading,
    togglePetType,
    toggleInterest,
    setLocation,
    savePreferences,
  } = useUserPreferences()

  const goToSlide = (index: number) => slideRef.current?.goToSlide(index)

  const renderItem = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const isInteractionSlide = ['pet_selection', 'location', 'interests'].includes(item.type)

    return (
      <ImageBackground
        style={styles.slide}
        alt={item.title}
        source={item.image}
        contentFit="cover"
        key={item.key}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={[styles.contentOverlay]}>
            <StatusBar style="light" />

            {!isInteractionSlide && (
              <>
                <Text style={styles.title} className="font-quicksand-bold text-neutral-off-white">
                  {t(`onboarding.${item.title}`)}
                </Text>

                <Text style={styles.text} className="font-nunito text-neutral-off-white">
                  {t(`onboarding.${item.text}`)}
                </Text>
              </>
            )}

            {item.type === 'pet_selection' && (
              <View style={styles.interactionContainer}>
                <Text
                  style={styles.interactionTitle}
                  className="font-quicksand-bold text-neutral-off-white"
                >
                  {t(`onboarding.${item.title}`)}
                </Text>
                <Text
                  style={styles.instruction}
                  className="font-nunito text-neutral-off-white text-center mb-6"
                >
                  {t('onboarding.pet_selection_text')}
                </Text>
                <PetTypeSelector
                  petTypes={PET_TYPES}
                  selectedTypes={preferences.petTypes}
                  onToggle={togglePetType}
                />
              </View>
            )}

            {item.type === 'location' && (
              <View style={styles.interactionContainer}>
                <Text
                  style={styles.interactionTitle}
                  className="font-quicksand-bold text-neutral-off-white"
                >
                  {t(`onboarding.${item.title}`)}
                </Text>
                <Text
                  style={styles.instruction}
                  className="font-nunito text-neutral-off-white text-center mb-8"
                >
                  {t('onboarding.location_text')}
                </Text>

                <LocationSetup
                  onLocationSet={setLocation}
                  onSkip={() => goToSlide(index + 1)}
                  location={preferences.location}
                />
              </View>
            )}

            {item.type === 'interests' && (
              <View style={styles.interactionContainer}>
                <Text
                  style={styles.interactionTitle}
                  className="font-quicksand-bold text-neutral-off-white"
                >
                  {t(`onboarding.${item.title}`)}
                </Text>
                <Text
                  style={styles.instruction}
                  className="font-nunito text-neutral-off-white text-center mb-6"
                >
                  {t('onboarding.interests_text')}
                </Text>

                <InterestSelector
                  interests={INTERESTS}
                  selectedInterests={preferences.interests}
                  onToggle={toggleInterest}
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    )
  }

  const onDone = async () => {
    try {
      // Save preferences first
      const success = await savePreferences()
      if (!success) {
        console.warn('Failed to save preferences, but continuing...')
      }

      // Mark onboarding as completed
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')

      // Navigate to auth
      router.replace('/(auth)/login')
    } catch (e) {
      console.error('Failed to complete onboarding', e)
      // Fallback navigation even if storage fails
      router.replace('/(auth)/login')
    }
  }

  // Replaces the library's default pagination, which renders the deprecated
  // react-native SafeAreaView.
  const renderPagination = (activeIndex: number) => (
    <SafeAreaView edges={['bottom']} style={styles.pagination}>
      <View style={styles.paginationDots} aria-hidden>
        {slides.map((slide, index) => (
          <View
            key={slide.key}
            style={[styles.dot, index === activeIndex ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        {activeIndex === slides.length - 1 ? (
          <>
            <Button
              variant="primary"
              textClassName="!text-primary uppercase text-sm !font-nunito-bold"
              className="bg-neutral-off-white"
              label={t('onboarding.done')}
              testID="onboarding-done-button"
              onPress={onDone}
              isLoading={preferencesLoading}
            />
            {onGuestMode && (
              <Button
                variant="tertiary"
                textClassName="!text-neutral-off-white text-sm"
                label={t('onboarding.explore_as_guest')}
                onPress={onGuestMode}
              />
            )}
          </>
        ) : (
          <Button
            textClassName="!text-neutral-off-white uppercase text-sm !font-nunito-bold"
            className="bg-primary"
            label={t('onboarding.next')}
            variant="primary"
            onPress={() => goToSlide(activeIndex + 1)}
          />
        )}
      </View>
    </SafeAreaView>
  )

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      extraData={preferences}
      renderPagination={renderPagination}
      ref={slideRef}
    />
  )
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
  // The safe area view carries the overlay so it also darkens the system bar insets.
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: 60,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  text: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  interactionContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 30,
  },
  interactionTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  // Pagination values mirror the library defaults so the layout does not change.
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inactiveDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  buttonContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  skipContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
})
