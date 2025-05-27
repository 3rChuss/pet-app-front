import { createContext, useContext, ReactNode } from 'react'

import { useGuestMode } from '@/lib/hooks/useGuestMode'
import { UserMode, GuestModeState } from '@/lib/types/guest-mode'

interface GuestModeContextType extends GuestModeState {
  userMode: UserMode
  isGuest: boolean
}

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined)

interface GuestModeProviderProps {
  children: ReactNode
  userMode: UserMode
}

export function GuestModeProvider({ children, userMode }: GuestModeProviderProps) {
  const guestState = useGuestMode()

  const value: Partial<GuestModeContextType> = {
    ...guestState,
    userMode,
    isGuest: userMode === 'guest',
  }

  return (
    <GuestModeContext.Provider value={value as GuestModeContextType}>
      {children}
    </GuestModeContext.Provider>
  )
}

export function useGuestModeContext(): GuestModeContextType {
  const context = useContext(GuestModeContext)
  if (context === undefined) {
    throw new Error('useGuestModeContext must be used within a GuestModeProvider')
  }
  return context
}
