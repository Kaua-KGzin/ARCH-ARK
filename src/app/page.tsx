'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import OnboardingScreen from '@/components/onboarding/OnboardingScreen'

export default function HomePage() {
  const { isOnboarded } = useGameStore()
  const router = useRouter()

  useEffect(() => {
    if (isOnboarded) {
      router.push('/dashboard')
    }
  }, [isOnboarded, router])

  if (isOnboarded) return null

  return <OnboardingScreen />
}
