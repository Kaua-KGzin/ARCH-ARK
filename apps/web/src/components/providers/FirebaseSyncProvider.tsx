'use client'

import { ReactNode, useEffect } from 'react'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { useFirestorePersist } from '@/hooks/useFirestorePersist'
import { useRankReset } from '@/hooks/useRankReset'
import { useGameStore } from '@/store/useGameStore'
import { SyncIndicator } from '@/components/ui/SyncIndicator'

/**
 * Provider que integra Firebase Auth e Game State Sync (Firestore persistence).
 * Deve ser envolvido no layout raiz.
 */
export function FirebaseSyncProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, loading } = useFirebaseAuth()
  const { loadGameStateFromFirestore } = useFirestorePersist()
  const { daysUntilReset } = useRankReset()
  const character = useGameStore((state) => state.character)

  // Carregar estado completo ao fazer login
  useEffect(() => {
    if (!firebaseUser) return
    loadGameStateFromFirestore()
  }, [firebaseUser?.uid, loadGameStateFromFirestore])

  // Sincronizar estado crítico após mudanças importantes
  useEffect(() => {
    if (!firebaseUser) return
    // O useFirestorePersist já faz debounce automático
  }, [firebaseUser, character.totalXp, character.gold, character.level, character.rank])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-cyan-500 mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm">🔄 Sincronizando estado do jogador...</p>
          {daysUntilReset >= 0 && (
            <p className="mt-2 text-xs text-cyan-400">
              ⏰ Próximo reset de rank: {daysUntilReset} dias
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <SyncIndicator />
      {children}
    </>
  )
}
