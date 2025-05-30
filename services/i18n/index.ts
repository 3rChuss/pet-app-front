import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEn from './locales/en-US.json'
import translationEs from './locales/es-ES.json'

const resources = {
  'en-US': { translation: translationEn },
  'es-ES': { translation: translationEs },
}

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language')

  if (!savedLanguage) {
    savedLanguage = Localization.locale
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: savedLanguage,
    fallbackLng: 'es-ES',
    interpolation: {
      escapeValue: false,
    },
  })
}

initI18n()

export default i18n
