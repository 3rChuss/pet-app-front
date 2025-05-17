import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, Text } from 'react-native'

const BackTop = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    router.canGoBack() && (
      <Pressable
        className="absolute top-16 left-4 z-10 rounded-full p-1 shadow-md flex-row items-center gap-2 pe-2 bg-transparent"
        style={{ elevation: 5 }} // Android shadow
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text className="text-neutral-off-white text-md flex flex-row items-center">
          {t('common.back')}
        </Text>
      </Pressable>
    )
  )
}

export default BackTop
