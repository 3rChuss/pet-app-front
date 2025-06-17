import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export const Container = ({
  children,
  className = styles.container,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView className={className}>{children}</SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = {
  container: 'flex flex-1 justify-center items-center bg-neutral-off-white p-8',
}
