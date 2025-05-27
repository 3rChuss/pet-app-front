import { useMemo, useRef, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { ImageBackground } from 'expo-image'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

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
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const {
    preferences,
    loading: preferencesLoading,
    togglePetType,
    toggleInterest,
    setLocation,
    savePreferences,
  } = useUserPreferences()

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    const isInteractionSlide = ['pet_selection', 'location', 'interests'].includes(item.type)

    return (
      <ImageBackground
        style={styles.slide}
        alt={item.title}
        source={item.image}
        contentFit="cover"
        key={item.key}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.contentOverlay]}>
            <StatusBar style="light" />

            {!isInteractionSlide && (
              <>
                <Text style={styles.title} className="font-quicksand text-neutral-off-white">
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
                  className="font-quicksand text-neutral-off-white"
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
                  className="font-quicksand text-neutral-off-white"
                >
                  {t(`onboarding.${item.title}`)}
                </Text>
                <Text
                  style={styles.instruction}
                  className="font-nunito text-neutral-off-white text-center mb-8"
                >
                  {t('onboarding.location_text')}
                </Text>

                <LocationSetup onLocationSet={setLocation} location={preferences.location} />
              </View>
            )}

            {item.type === 'interests' && (
              <View style={styles.interactionContainer}>
                <Text
                  style={styles.interactionTitle}
                  className="font-quicksand text-neutral-off-white"
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

  const onNext = () => {
    if (slideRef.current) {
      slideRef.current.goToSlide(currentSlideIndex + 1)
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const onSkip = () => {
    if (slideRef.current) {
      // Skip to final slide
      slideRef.current.goToSlide(slides.length - 1)
    }
  }

  const onSlideChange = (index: number) => {
    setCurrentSlideIndex(index)
  }
  const currentSlide = useMemo(() => slides[currentSlideIndex], [currentSlideIndex])
  const canSkip = currentSlide?.skipable

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      onSlideChange={onSlideChange}
      doneLabel={t('onboarding.done')}
      nextLabel={t('onboarding.next')}
      prevLabel={t('onboarding.back')}
      skipLabel={t('onboarding.skip')}
      showSkipButton={canSkip}
      onSkip={onSkip}
      bottomButton
      renderNextButton={() => (
        <View style={styles.buttonContainer}>
          <Button
            textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
            className="bg-primary"
            label={t('onboarding.next')}
            variant="primary"
            onPress={onNext}
          />
        </View>
      )}
      renderSkipButton={() => (
        <View style={styles.skipContainer}>
          <Button
            textClassName="!text-neutral-off-white text-sm"
            className="bg-transparent"
            label={t('onboarding.skip')}
            variant="secondary"
            onPress={onSkip}
          />
        </View>
      )}
      renderDoneButton={() => (
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            textClassName="!text-primary uppercase text-sm !font-bold"
            className="bg-neutral-off-white mb-3"
            label={t('onboarding.done')}
            testID="onboarding-done-button"
            onPress={onDone}
            isLoading={preferencesLoading}
          />
          {onGuestMode && (
            <Button
              variant="tertiary"
              textClassName="!text-neutral-off-white text-sm"
              label="Explorar sin cuenta"
              onPress={onGuestMode}
            />
          )}
        </View>
      )}
      ref={slideRef}
    />
  )
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 60,
  },
  contentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  buttonContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
})
