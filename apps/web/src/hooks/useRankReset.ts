'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/useGameStore'
import {
  shouldResetRank,
  applyRankReset,
  daysUntilRankReset,
  calculateNextResetDate,
} from '@/lib/rank-reset'
import { toast } from 'sonner'

/**
 * Hook que verifica e aplica rank reset automático
 * Reseta rank para 'E' se passou da data de reset
 */
export function useRankReset() {
  const character = useGameStore((state) => state.character)

  useEffect(() => {
    // Skip se não tiver character
    if (!character) return

    // Inicializa rankResetDate se não tiver
    if (!character.rankResetDate) {
      const initialResetDate = calculateNextResetDate(new Date().toISOString(), 365)
      useGameStore.setState((state) => ({
        character: {
          ...state.character,
          rankResetDate: initialResetDate,
        },
      }))
      return
    }

    // Verifica se deve resetar
    if (shouldResetRank(character)) {
      const resetChar = applyRankReset(character)
      useGameStore.setState({ character: resetChar })

      toast.success(
        `🔄 Rank resetado para ${resetChar.rank}! Novo objetivo desbloqueado.`,
        { duration: 5000 }
      )
    }
  }, [character.id]) // Executa uma vez por novo character

  return {
    daysUntilReset: daysUntilRankReset(character),
    nextResetDate: character.rankResetDate,
  }
}
