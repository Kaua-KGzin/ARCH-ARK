export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'Monarch' | 'Legendary'

export type CharacterClass = 'Guerreiro' | 'Mago' | 'Assassino' | 'Monarca' | 'Arqueiro' | 'Curandeiro'

export type MissionCategory = 'exercise' | 'study' | 'habit' | 'dungeon' | 'boss'
export type MissionType = 'daily' | 'weekly' | 'monthly' | 'dungeon' | 'boss' | 'custom'
export type MissionStatus = 'active' | 'completed' | 'failed' | 'locked'

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
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
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
