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

  useEffect(() => {
    if (loading) return // Still checking auth state

    if (!user) {
      router.replace('/auth')
    } else if (!isOnboarded) {
      router.replace('/onboarding')
    }
  }, [user, loading, isOnboarded, router])

  return { user, loading, isOnboarded }
}
