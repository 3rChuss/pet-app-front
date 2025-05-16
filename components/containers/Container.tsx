import { SafeAreaView } from 'react-native'

export const Container = ({
  children,
  className = styles.container,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <SafeAreaView className={className}>{children}</SafeAreaView>
}

const styles = {
  container: 'flex flex-1 justify-center items-center bg-neutral-off-white p-8',
}
