'use client'

import { ReactNode, useEffect } from 'react'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { useFirebaseGameSync } from '@/hooks/useFirebaseGameSync'
import { useGameStore } from '@/store/useGameStore'

/**
 * Provider que integra Firebase Auth e Game State Sync.
 * Deve ser envolvido no layout raiz.
 */
export function FirebaseSyncProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, loading } = useFirebaseAuth()
  const { syncToFirebase } = useFirebaseGameSync()
  const character = useGameStore((state) => state.character)

  // Sincroniza estado crítico a cada vez que o character muda
  useEffect(() => {
    if (!firebaseUser) return
    syncToFirebase()
  }, [firebaseUser, character.totalXp, character.gold, character.level])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-cyan-500 mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm">Iniciando o Sistema ARCH-ARK...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
