import { Mission, MissionCategory, Character, Attributes } from '../types/game'
import { calculateLevelFromXp, getRankFromLevel, getTitleForLevel } from './utils'

export const XP_REWARDS: Record<string, number> = {
  academia: 100,
  corrida: 80,
  caminhada: 30,
  alongamento: 20,
  bicicleta: 60,
  natacao: 90,
  treino_hiit: 120,
  yoga: 40,
  estudo_30min: 50,
  estudo_1h: 100,
  estudo_2h: 220,
  estudo_3h: 350,
  leitura_30min: 40,
  leitura_1h: 90,
  agua_2l: 30,
  meditacao: 40,
  dormir_cedo: 35,
  sem_redes: 45,
  diario: 25,
  missao_diaria: 50,
  missao_semanal: 200,
  missao_mensal: 500,
  dungeon: 300,
  boss: 500,
}

export const ATTRIBUTE_GAINS: Record<MissionCategory, Partial<Attributes>> = {
  exercise: { strength: 2, resistance: 2, vitality: 1 },
  study: { intelligence: 2, focus: 2, discipline: 1 },
  habit: { discipline: 1, vitality: 1, charisma: 1 },
  dungeon: { strength: 1, intelligence: 1, discipline: 2, focus: 1 },
  boss: { strength: 3, intelligence: 3, discipline: 3, resistance: 2 },
}

export function applyXpGain(
  character: Character,
  xpGained: number,
  category: MissionCategory
): {
  character: Character
  leveledUp: boolean
  newLevel: number
  attributeGains: Partial<Attributes>
} {
  const newTotalXp = character.totalXp + xpGained
  const { level, currentXp, xpToNextLevel } = calculateLevelFromXp(newTotalXp)
  const leveledUp = level > character.level
  const newRank = getRankFromLevel(level)

  const attributeGains = ATTRIBUTE_GAINS[category]
  const newAttributes = { ...character.attributes }

  if (leveledUp) {
    const levelsGained = level - character.level
    Object.entries(attributeGains).forEach(([key, value]) => {
      const attr = key as keyof Attributes
      newAttributes[attr] = (newAttributes[attr] || 0) + (value || 0) * levelsGained
    })
  }

  const updatedCharacter: Character = {
    ...character,
    level,
    currentXp,
    xpToNextLevel,
    totalXp: newTotalXp,
    rank: newRank,
    title: getTitleForLevel(level),
    attributes: newAttributes,
  }

  return { character: updatedCharacter, leveledUp, newLevel: level, attributeGains }
}

export function calculateSecondaryStats(character: Character) {
  const { attributes, level } = character
  return {
    maxHp: 100 + attributes.vitality * 10 + attributes.resistance * 5 + level * 5,
    maxMana: 50 + attributes.intelligence * 8 + attributes.focus * 4 + level * 3,
    attackPower: attributes.strength * 5 + level * 2,
    defense: attributes.resistance * 4 + attributes.vitality * 2,
    speed: attributes.focus * 3 + attributes.discipline * 2,
    critChance: Math.min(50, attributes.focus * 0.5 + attributes.strength * 0.3),
    xpBonus: Math.min(50, attributes.discipline * 0.5 + attributes.intelligence * 0.3),
  }
}

export function getStreakBonus(streak: number): number {
  if (streak >= 100) return 50
  if (streak >= 30) return 30
  if (streak >= 14) return 20
  if (streak >= 7) return 10
  if (streak >= 3) return 5
  return 0
}

export function getStreakMilestone(streak: number): string | null {
  if (streak === 100) return 'Lendário! 100 dias de sequência!'
  if (streak === 30) return 'Incrível! 30 dias de sequência!'
  if (streak === 14) return 'Ótimo! 2 semanas consecutivas!'
  if (streak === 7) return 'Excelente! Uma semana completa!'
  return null
}
