import { Mission, Rank, Character } from '@/types/game'

const rankOrder: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'Monarch', 'Legendary']

export function getRankIndex(rank: Rank): number {
  return rankOrder.indexOf(rank)
}

export function canCompleteMission(mission: Mission, character: Character): {
  allowed: boolean
  reason?: string
} {
  // Check rank requirement
  if (mission.rankRequired) {
    const characterRankIndex = getRankIndex(character.rank)
    const requiredRankIndex = getRankIndex(mission.rankRequired)

    if (characterRankIndex < requiredRankIndex) {
      return {
        allowed: false,
        reason: `Requer rank ${mission.rankRequired} ou superior. Seu rank: ${character.rank}`,
      }
    }
  }

  // Check progress
  if (mission.progress < mission.target) {
    return {
      allowed: false,
      reason: `Progresso insuficiente: ${mission.progress}/${mission.target} ${mission.unit}`,
    }
  }

  // Check frequency for daily/weekly/monthly
  if (['daily', 'weekly', 'monthly'].includes(mission.type)) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const completedDates = mission.completedDates || []

    if (mission.type === 'daily') {
      // Check if completed today
      const completedToday = completedDates.some(dateStr => {
        const date = new Date(dateStr)
        date.setHours(0, 0, 0, 0)
        return date.getTime() === today.getTime()
      })

      if (completedToday) {
        return {
          allowed: false,
          reason: 'Missão diária já foi completada hoje. Volte amanhã!',
        }
      }
    }

    if (mission.type === 'weekly') {
      // Check if completed this week (Monday-Sunday)
      const weekStart = new Date(today)
      const day = today.getDay()
      weekStart.setDate(today.getDate() - (day === 0 ? 6 : day - 1))

      const completedThisWeek = completedDates.some(dateStr => {
        const date = new Date(dateStr)
        date.setHours(0, 0, 0, 0)
        return date >= weekStart
      })

      if (completedThisWeek) {
        return {
          allowed: false,
          reason: 'Missão semanal já foi completada esta semana. Volte próxima semana!',
        }
      }
    }

    if (mission.type === 'monthly') {
      // Check if completed this month
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

      const completedThisMonth = completedDates.some(dateStr => {
        const date = new Date(dateStr)
        date.setHours(0, 0, 0, 0)
        return date >= monthStart
      })

      if (completedThisMonth) {
        return {
          allowed: false,
          reason: 'Missão mensal já foi completada este mês. Volte próximo mês!',
        }
      }
    }
  }

  return { allowed: true }
}
