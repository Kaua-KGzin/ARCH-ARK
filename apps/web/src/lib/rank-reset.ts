import { Character, Rank } from '@arch-ark/shared'

export interface RankResetConfig {
  resetIntervalDays: number // Ex: 365 para anual
  resetDate?: string // ISO date of last reset
  nextResetDate?: string // ISO date of next reset
}

const DEFAULT_RESET_INTERVAL = 365 // 1 year

/**
 * Calcula próxima data de reset baseado no intervalo
 */
export function calculateNextResetDate(lastResetDate: string, intervalDays: number = DEFAULT_RESET_INTERVAL): string {
  const last = new Date(lastResetDate)
  const next = new Date(last.getTime() + intervalDays * 24 * 60 * 60 * 1000)
  return next.toISOString()
}

/**
 * Verifica se deve resetar o rank (com base na data)
 */
export function shouldResetRank(character: Character & { rankResetDate?: string }): boolean {
  if (!character.rankResetDate) {
    // Primeira vez: define data de reset para 1 ano atrás (para dar tempo antes de resetar)
    return false
  }

  const resetDate = new Date(character.rankResetDate)
  const today = new Date()

  return today >= resetDate
}

/**
 * Aplica reset de rank ao character
 * - Reseta rank para 'E'
 * - Mantém level e XP
 * - Atualiza rankResetDate para próximo ano
 */
export function applyRankReset(character: Character & { rankResetDate?: string }): Character & { rankResetDate: string } {
  const now = new Date().toISOString()
  const nextResetDate = calculateNextResetDate(now, DEFAULT_RESET_INTERVAL)

  return {
    ...character,
    rank: 'E' as Rank,
    rankPoints: 0,
    rankResetDate: nextResetDate,
  }
}

/**
 * Hook helper: calcula dias até próximo reset
 */
export function daysUntilRankReset(character: Character & { rankResetDate?: string }): number {
  if (!character.rankResetDate) return -1

  const resetDate = new Date(character.rankResetDate)
  const today = new Date()
  const diff = resetDate.getTime() - today.getTime()
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000))

  return Math.max(0, days)
}

/**
 * Formata data de reset para exibição amigável
 */
export function formatResetDate(rankResetDate?: string): string {
  if (!rankResetDate) return 'Nunca'

  const date = new Date(rankResetDate)
  const today = new Date()

  if (date <= today) {
    return 'Hoje ou antes'
  }

  const daysLeft = Math.ceil((date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
  if (daysLeft === 0) return 'Hoje'
  if (daysLeft === 1) return 'Amanhã'
  if (daysLeft < 30) return `${daysLeft} dias`
  if (daysLeft < 365) return `${Math.floor(daysLeft / 30)} meses`

  return date.toLocaleDateString('pt-BR')
}
