import { useRef } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { ImageBackground } from 'expo-image'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

import { ONBOARDING_KEY, slides } from '@/lib/const/onBoarding'

import Button from '../Button/Button'

export default function OnboardingScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const slideRef = useRef<AppIntroSlider>(null)

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => {
    return (
      <ImageBackground
        style={styles.slide}
        alt={item.title}
        source={item.image}
        contentFit="cover"
        key={item.key}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.contentOverlay]} className="flex-1 relative">
            <StatusBar style="light" />
            <Text style={styles.title} className="font-quicksand text-base-neutral-off-white">
              {t(`onboarding.${item.title}`)}
            </Text>

            <Text style={styles.text} className="font-nunito text-base-neutral-off-white">
              {t(`onboarding.${item.text}`)}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    )
  }

  const onDone = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      router.replace('/(auth)/login') // Navigate to login after onboarding
    } catch (e) {
      console.error('Failed to save onboarding status', e)
      // Fallback navigation if async storage fails
      router.replace('/(auth)/login')
    }
  }

  const onNext = () => {
    if (slideRef.current) {
      slideRef.current.goToSlide(slideRef.current.state.activeIndex + 1)
    }
  }

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      doneLabel={t('onboarding.done')}
      nextLabel={t('onboarding.next')}
      bottomButton
      renderNextButton={() => (
        <View style={{ marginBottom: 30 }}>
          <Button title={t('onboarding.next')} variant="primary" onPress={onNext} />
        </View>
      )}
      renderDoneButton={() => (
        <View style={{ marginBottom: 30 }}>
          <Button title={t('onboarding.done')} variant="primary" onPress={onDone} />
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
    fontWeight: 'bold', // Quicksand handles this via font file
    marginTop: 60,
  },
  contentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
})
