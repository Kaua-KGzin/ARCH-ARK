export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'Monarch' | 'Legendary'

export type CharacterClass = 'Guerreiro' | 'Mago' | 'Assassino' | 'Monarca' | 'Arqueiro' | 'Curandeiro'

export type MissionCategory = 'exercise' | 'study' | 'habit' | 'dungeon' | 'boss' | 'task' | 'nutrition' | 'mindfulness'
export type MissionType = 'daily' | 'weekly' | 'monthly' | 'dungeon' | 'boss' | 'custom'
export type MissionStatus = 'active' | 'completed' | 'failed' | 'locked'
export type MissionDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type ItemType = 'consumable' | 'equipment' | 'scroll' | 'relic' | 'title'
export type EquipmentSlot = 'head' | 'chest' | 'gloves' | 'legs' | 'boots' | 'artifact'

export interface Attributes {
  strength: number
  resistance: number
  intelligence: number
  discipline: number
  focus: number
  charisma: number
  vitality: number
}

export interface SecondaryStats {
  maxHp: number
  maxMana: number
  attackPower: number
  defense: number
  speed: number
  critChance: number
  xpBonus: number
}

export interface Character {
  id: string
  name: string
  avatar: string
  /** URL de foto de perfil enviada pelo usuário (Supabase Storage). Quando ausente, usa `avatar` (emoji). */
  avatarUrl?: string | null
  class: CharacterClass
  level: number
  currentXp: number
  xpToNextLevel: number
  totalXp: number
  rank: Rank
  rankPoints: number
  attributes: Attributes
  title: string
  createdAt: string
  streak: number
  longestStreak: number
  lastActivityDate: string | null
  gold: number
  rankResetDate?: string // Data do próximo reset de rank (ISO format)
}

export interface Item {
  id: string
  name: string
  description: string
  rarity: ItemRarity
  type: ItemType
  icon: string
  slot?: EquipmentSlot
  attributeBonus?: Partial<Attributes>
  xpBonus?: number
  goldValue: number
  quantity?: number
}

export interface InventoryItem extends Item {
  acquiredAt: string
  isEquipped: boolean
}

export interface Equipment {
  head?: InventoryItem
  chest?: InventoryItem
  gloves?: InventoryItem
  legs?: InventoryItem
  boots?: InventoryItem
  artifact?: InventoryItem
}

export interface Mission {
  id: string
  title: string
  description: string
  category: MissionCategory
  type: MissionType
  xpReward: number
  goldReward: number
  itemReward?: Item
  status: MissionStatus
  progress: number
  target: number
  unit: string
  icon: string
  expiresAt?: string
  completedAt?: string
  completedDates?: string[] // Track multiple completions for weekly/monthly
  difficulty: MissionDifficulty
  rankRequired?: Rank
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: ItemRarity
  xpReward: number
  unlockedAt?: string
  isUnlocked: boolean
  progress: number
  target: number
}

export interface Dungeon {
  id: string
  name: string
  description: string
  rank: Rank
  missions: Mission[]
  timeLimit: number
  xpReward: number
  goldReward: number
  itemRewards: Item[]
  isCompleted: boolean
  isActive: boolean
  progress: number
  boss?: Boss
}

export interface Boss {
  id: string
  name: string
  description: string
  icon: string
  hp: number
  maxHp: number
  missions: Mission[]
  isDefeated: boolean
  xpReward: number
  goldReward: number
  itemReward: Item
}

export interface Guild {
  id: string
  name: string
  description: string
  rank: Rank
  memberCount: number
  maxMembers: number
  xpContributed: number
  icon: string
  leader: string
}

export interface RankingEntry {
  rank: number
  name: string
  class: CharacterClass
  level: number
  xp: number
  rank_title: Rank
  avatar: string
  avatarUrl?: string | null
  streak: number
}

export interface ArkMessage {
  id: string
  role: 'ark' | 'user'
  content: string
  timestamp: string
  type?: 'analysis' | 'recommendation' | 'warning' | 'praise' | 'quest'
}

export interface GameStats {
  totalMissionsCompleted: number
  totalExerciseMinutes: number
  totalStudyMinutes: number
  totalHabitsCompleted: number
  dungeonsCleared: number
  bossesDefeated: number
  itemsCollected: number
  weeklyXp: number
  monthlyXp: number
}

export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  type: 'passive' | 'active'
  category: 'strength' | 'intelligence' | 'discipline' | 'vitality' | 'shadow'
  requiredLevel: number
  requiredAttributes?: Partial<Attributes>
  isUnlocked: boolean
  isEquipped: boolean
  effect: {
    xpMultiplier?: number
    goldMultiplier?: number
    statBonus?: Partial<Attributes>
    streakBonusMultiplier?: number
  }
}

export interface Title {
  id: string
  name: string
  description: string
  badge: string
  rarity: ItemRarity
  attributeBonus?: Partial<Attributes>
  xpBonus?: number
  isUnlocked: boolean
}

export interface UserSettings {
  soundEnabled: boolean
  particlesEnabled: boolean
  themeMode: 'monarch-dark' | 'shadow-purple' | 'crimson-boss'
  compactMissions: boolean
}

export interface LevelUpNotification {
  show: boolean
  playerName: string
  previousLevel: number
  level: number
  previousRank: string
  rank: string
  rankChanged: boolean
  xpGained: number
  goldGained: number
  attributeGains: Partial<Attributes>
}

export interface RewardNotification {
  id: string
  type: 'achievement' | 'loot' | 'boss' | 'rank-up' | 'level-up'
  title: string
  description: string
  icon: string
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

