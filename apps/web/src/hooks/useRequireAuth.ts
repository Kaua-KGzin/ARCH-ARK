'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import { useAuth } from '@/hooks/useAuth'

// Hook que gatea acesso às páginas protegidas
// Verifica: logado? + onboarded? Senão redireciona
export function useRequireAuth() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { isOnboarded } = useGameStore()

  console.log('[useRequireAuth] user:', user?.email, 'loading:', loading, 'isOnboarded:', isOnboarded)

  useEffect(() => {
    console.log('[useRequireAuth] Effect: loading=', loading, 'user=', user?.email, 'isOnboarded=', isOnboarded)
    if (loading) {
      console.log('[useRequireAuth] Still loading, returning')
      return
    }

    if (!user) {
      console.log('[useRequireAuth] No user, redirecting to /auth')
      router.replace('/auth')
    } else if (!isOnboarded) {
      console.log('[useRequireAuth] Not onboarded, redirecting to /onboarding')
      router.replace('/onboarding')
    } else {
      console.log('[useRequireAuth] User is authenticated and onboarded')
    }
  }, [user, loading, isOnboarded, router])

  return { user, loading, isOnboarded }
}
