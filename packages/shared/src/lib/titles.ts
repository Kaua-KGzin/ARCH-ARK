import { Title } from '../types/game'

export const SYSTEM_TITLES: Title[] = [
  {
    id: 'novice_hunter',
    name: 'Caçador Novato',
    description: 'Começou a jornada de superação com o Sistema.',
    badge: '🔰',
    rarity: 'common',
    attributeBonus: { strength: 2, vitality: 2 },
    xpBonus: 0.05,
    isUnlocked: true
  },
  {
    id: 'streak_master',
    name: 'Inabalável',
    description: 'Manteve a sequência de hábitos por 7 dias consecutivos.',
    badge: '🔥',
    rarity: 'uncommon',
    attributeBonus: { discipline: 5, focus: 5 },
    xpBonus: 0.10,
    isUnlocked: false
  },
  {
    id: 'dungeon_cleaner',
    name: 'Limpador de Masmorras',
    description: 'Completou mais de 5 masmorras e derrotou chefes.',
    badge: '⚔️',
    rarity: 'rare',
    attributeBonus: { strength: 10, resistance: 10 },
    xpBonus: 0.15,
    isUnlocked: false
  },
  {
    id: 'shadow_monarch',
    name: 'Monarca das Sombras',
    description: 'Alcançou o nível 10 e despertou o poder supremo do Sistema.',
    badge: '👑',
    rarity: 'legendary',
    attributeBonus: { strength: 20, intelligence: 20, discipline: 20 },
    xpBonus: 0.25,
    isUnlocked: false
  }
]
