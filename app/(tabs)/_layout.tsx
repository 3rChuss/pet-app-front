import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { FloatingTabBar } from '../../components/navigation/FloatingTabBar'

export default function TabLayout() {
  const { t } = useTranslation()

  return (
    <Tabs
      tabBar={props => <FloatingTabBar {...props} unreadNotifications={3} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home', { defaultValue: 'Inicio' }),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('tabs.search', { defaultValue: 'Búsqueda' }),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('tabs.map', { defaultValue: 'Mapa' }),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t('tabs.create', { defaultValue: 'Crear' }),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t('tabs.notifications', { defaultValue: 'Notificaciones' }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile', { defaultValue: 'Perfil' }),
        }}
      />
    </Tabs>
  )
}
