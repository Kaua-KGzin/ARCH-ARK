'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import type { GameState } from '@arch-ark/shared'
import { useGameStore } from '@/store/useGameStore'
import { createClient } from '@/lib/supabase/client'
import { saveCharacterRow } from '@/lib/supabase/game-sync'

const AUTOSAVE_DELAY_MS = 2000

export function GameSyncProvider({
  userId,
  initialState,
  children,
}: {
  userId: string | null
  initialState: Partial<GameState> | null
  children: ReactNode
}) {
  const hydrated = useRef(false)

  // Server already fetched the authoritative row — seed it once, before
  // anything can write, so the store never shows stale/default data.
  useEffect(() => {
    if (initialState) {
      useGameStore.setState(initialState)
    }
    hydrated.current = true
  }, [initialState])

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()
    let timeout: ReturnType<typeof setTimeout> | null = null
    // Evita empilhar um toast a cada tick de autosave (2s) enquanto o problema
    // persiste — avisa uma vez, some quando um save subsequente for bem-sucedido.
    let hasWarned = false

    const unsubscribe = useGameStore.subscribe(() => {
      if (!hydrated.current) return
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        saveCharacterRow(supabase, userId, useGameStore.getState())
          .then(() => {
            hasWarned = false
          })
          .catch((err) => {
            console.error('[GameSync] Falha ao salvar progresso:', err)
            if (!hasWarned) {
              hasWarned = true
              toast.error('Não foi possível salvar seu progresso. Verifique sua conexão.')
            }
          })
      }, AUTOSAVE_DELAY_MS)
    })

    return () => {
      unsubscribe()
      if (timeout) clearTimeout(timeout)
    }
  }, [userId])

  return children
}
