'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useGameStore } from '@/store/useGameStore'

// Pure redirect gate — no UI, just routes to the right place
export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { isOnboarded } = useGameStore()

  useEffect(() => {
    if (loading) return

    // Not logged in? Go to auth
    if (!user) {
      router.replace('/auth')
      return
    }

    // Logged in but not onboarded? Go to onboarding
    if (!isOnboarded) {
      router.replace('/onboarding')
      return
    }

    // Logged in and onboarded? Go to dashboard
    router.replace('/dashboard')
  }, [user, loading, isOnboarded, router])

  // Loading screen while checking auth
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full mx-auto animate-spin" />
        <p className="mt-4 text-slate-400 text-sm">Carregando...</p>
      </div>
    </div>
  )
}
