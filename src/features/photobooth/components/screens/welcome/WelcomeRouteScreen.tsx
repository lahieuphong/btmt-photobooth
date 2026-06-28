'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import WelcomeLoadingScreen from '@/src/features/photobooth/components/screens/welcome/WelcomeLoadingScreen'

type WelcomeRouteScreenProps = {
  children: ReactNode
}

export default function WelcomeRouteScreen({ children }: WelcomeRouteScreenProps) {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)

  if (!isLoadingComplete) {
    return <WelcomeLoadingScreen onComplete={() => setIsLoadingComplete(true)} />
  }

  return <>{children}</>
}
