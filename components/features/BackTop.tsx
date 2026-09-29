import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Pressable, Text } from 'react-native'

import { useTheme } from '@/lib/context/ThemeContext'

// Back link for screens with a light background: the arrow and the text use the dark gray of the
// theme, so they would be hard to see over a dark one.
const BackTop = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    router.canGoBack() && (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        className="absolute left-4 top-16 z-10 flex-row items-center gap-2 rounded-full p-1 pe-2"
        hitSlop={8}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={theme.neutral_dark_gray} />
        <Text className="font-nunito-semibold text-base text-neutral-dark-gray">
          {t('common.back')}
        </Text>
      </Pressable>
    )
  )
}

export default BackTop
