'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Character, CharacterClass, Mission, Item, InventoryItem,
  Equipment, Achievement, Dungeon, Boss, ArkMessage, GameStats
} from '@/types/game'
import { applyXpGain, getStreakBonus } from '@/lib/xp'
import { generateDailyMissions, generateWeeklyMissions, generateMonthlyMissions, generateDungeons, generateBosses } from '@/lib/missions'
import { checkAchievements, ALL_ACHIEVEMENTS } from '@/lib/achievements'
import { calculateLevelFromXp, getRankFromLevel, generateId, isToday } from '@/lib/utils'
import { createInventoryItem, SHOP_ITEMS } from '@/lib/items'

const DEFAULT_CHARACTER: Character = {
  id: generateId(),
  name: 'Caçador',
  avatar: '⚔️',
  class: 'Guerreiro',
  level: 1,
  currentXp: 0,
  xpToNextLevel: 150,
  totalXp: 0,
  rank: 'E',
  rankPoints: 0,
  attributes: {
    strength: 5,
    resistance: 5,
    intelligence: 5,
    discipline: 5,
    focus: 5,
    charisma: 5,
    vitality: 5,
  },
  title: 'Iniciante',
  createdAt: new Date().toISOString(),
  streak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  gold: 100,
}

interface GameState {
  character: Character
  missions: Mission[]
  inventory: InventoryItem[]
  equipment: Equipment
  achievements: Achievement[]
  dungeons: Dungeon[]
  bosses: Boss[]
  arkMessages: ArkMessage[]
  stats: GameStats
  isOnboarded: boolean
  lastDailyReset: string | null
  levelUpNotification: { show: boolean; level: number; rank: string } | null
  achievementNotification: Achievement | null

  // Actions
  setupCharacter: (name: string, cls: CharacterClass) => void
  completeMission: (missionId: string, progressAmount?: number) => void
  updateMissionProgress: (missionId: string, amount: number) => void
  addXp: (amount: number, category: Mission['category']) => void
  addGold: (amount: number) => void
  equipItem: (item: InventoryItem) => void
  unequipItem: (slot: keyof Equipment) => void
  addToInventory: (item: Item) => void
  addArkMessage: (message: ArkMessage) => void
  checkDailyReset: () => void
  clearLevelUpNotification: () => void
  clearAchievementNotification: () => void
  activateDungeon: (dungeonId: string) => void
  completeDungeonMission: (dungeonId: string, missionId: string) => void
  completeBossMission: (bossId: string, missionId: string) => void
  buyItem: (itemId: string) => void
  createCustomMission: (data: Pick<Mission, 'title' | 'description' | 'category' | 'type' | 'icon' | 'xpReward' | 'goldReward' | 'target' | 'unit' | 'difficulty'>) => void
  deleteCustomMission: (missionId: string) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: DEFAULT_CHARACTER,
      missions: [
        ...generateDailyMissions(),
        ...generateWeeklyMissions(),
        ...generateMonthlyMissions(),
      ],
      inventory: [],
      equipment: {},
      achievements: ALL_ACHIEVEMENTS,
      dungeons: generateDungeons() as Dungeon[],
      bosses: generateBosses() as Boss[],
      arkMessages: [],
      stats: {
        totalMissionsCompleted: 0,
        totalExerciseMinutes: 0,
        totalStudyMinutes: 0,
        totalHabitsCompleted: 0,
        dungeonsCleared: 0,
        bossesDefeated: 0,
        itemsCollected: 0,
        weeklyXp: 0,
        monthlyXp: 0,
      },
      isOnboarded: false,
      lastDailyReset: null,
      levelUpNotification: null,
      achievementNotification: null,

      setupCharacter: (name, cls) => {
        const classAttributes: Record<CharacterClass, Partial<Character['attributes']>> = {
          Guerreiro: { strength: 10, resistance: 8, vitality: 8, intelligence: 3, focus: 4, discipline: 5, charisma: 5 },
          Mago: { intelligence: 12, focus: 10, discipline: 8, strength: 3, resistance: 4, vitality: 5, charisma: 5 },
          Assassino: { focus: 10, discipline: 10, strength: 8, resistance: 5, intelligence: 6, vitality: 5, charisma: 3 },
          Monarca: { strength: 8, intelligence: 8, discipline: 8, focus: 8, resistance: 7, vitality: 7, charisma: 8 },
          Arqueiro: { focus: 12, strength: 8, resistance: 6, intelligence: 5, discipline: 6, vitality: 6, charisma: 5 },
          Curandeiro: { vitality: 12, charisma: 10, discipline: 8, intelligence: 7, focus: 6, strength: 3, resistance: 5 },
        }
        const avatars: Record<CharacterClass, string> = {
          Guerreiro: '⚔️', Mago: '🔮', Assassino: '🗡️', Monarca: '👑', Arqueiro: '🏹', Curandeiro: '✨'
        }
        set(state => ({
          character: {
            ...state.character,
            name,
            class: cls,
            avatar: avatars[cls],
            attributes: { ...state.character.attributes, ...classAttributes[cls] },
          },
          isOnboarded: true,
        }))
      },

      completeMission: (missionId) => {
        const state = get()
        const mission = state.missions.find(m => m.id === missionId)
        if (!mission || mission.status === 'completed') return

        const streakBonus = getStreakBonus(state.character.streak)
        const bonusMultiplier = 1 + streakBonus / 100
        const xpEarned = Math.floor(mission.xpReward * bonusMultiplier)
        const goldEarned = mission.goldReward

        const { character: updatedChar, leveledUp, newLevel } = applyXpGain(
          state.character, xpEarned, mission.category
        )

        const today = new Date().toISOString()
        let newStreak = state.character.streak
        if (!state.character.lastActivityDate || !isToday(state.character.lastActivityDate)) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const wasYesterday = state.character.lastActivityDate &&
            new Date(state.character.lastActivityDate).toDateString() === yesterday.toDateString()
          newStreak = wasYesterday ? newStreak + 1 : 1
        }

        const newStats: GameStats = {
          ...state.stats,
          totalMissionsCompleted: state.stats.totalMissionsCompleted + 1,
          weeklyXp: state.stats.weeklyXp + xpEarned,
          monthlyXp: state.stats.monthlyXp + xpEarned,
        }
        if (mission.category === 'exercise') {
          newStats.totalExerciseMinutes += mission.target
        } else if (mission.category === 'study') {
          newStats.totalStudyMinutes += mission.target
        } else if (mission.category === 'habit') {
          newStats.totalHabitsCompleted++
        }

        const finalChar = {
          ...updatedChar,
          gold: updatedChar.gold + goldEarned,
          streak: newStreak,
          longestStreak: Math.max(newStreak, updatedChar.longestStreak),
          lastActivityDate: today,
        }

        const updatedMissions = state.missions.map(m =>
          m.id === missionId ? { ...m, status: 'completed' as const, progress: m.target, completedAt: today } : m
        )

        let newInventory = [...state.inventory]
        if (mission.itemReward) {
          newInventory = [...newInventory, { ...mission.itemReward, acquiredAt: today, isEquipped: false }]
          newStats.itemsCollected++
        }

        const updatedAchievements = checkAchievements(finalChar, newStats, state.achievements)
        const newlyUnlocked = updatedAchievements.find(
          (a, i) => a.isUnlocked && !state.achievements[i].isUnlocked
        )

        set({
          character: finalChar,
          missions: updatedMissions,
          inventory: newInventory,
          stats: newStats,
          achievements: updatedAchievements,
          levelUpNotification: leveledUp ? { show: true, level: newLevel, rank: getRankFromLevel(newLevel) } : state.levelUpNotification,
          achievementNotification: newlyUnlocked || state.achievementNotification,
        })
      },

      updateMissionProgress: (missionId, amount) => {
        set(state => ({
          missions: state.missions.map(m => {
            if (m.id !== missionId || m.status !== 'active') return m
            const newProgress = Math.min(m.target, m.progress + amount)
            return { ...m, progress: newProgress }
          })
        }))
      },

      addXp: (amount, category) => {
        const state = get()
        const { character: updatedChar, leveledUp, newLevel } = applyXpGain(state.character, amount, category)
        set({
          character: updatedChar,
          levelUpNotification: leveledUp ? { show: true, level: newLevel, rank: getRankFromLevel(newLevel) } : state.levelUpNotification,
        })
      },

      addGold: (amount) => {
        set(state => ({ character: { ...state.character, gold: state.character.gold + amount } }))
      },

      equipItem: (item) => {
        if (!item.slot) return
        set(state => ({
          equipment: { ...state.equipment, [item.slot!]: item },
          inventory: state.inventory.map(i =>
            i.id === item.id ? { ...i, isEquipped: true } :
            (i.slot === item.slot ? { ...i, isEquipped: false } : i)
          ),
        }))
      },

      unequipItem: (slot) => {
        set(state => {
          const item = state.equipment[slot]
          return {
            equipment: { ...state.equipment, [slot]: undefined },
            inventory: state.inventory.map(i => i.id === item?.id ? { ...i, isEquipped: false } : i),
          }
        })
      },

      addToInventory: (item) => {
        set(state => ({
          inventory: [...state.inventory, { ...item, acquiredAt: new Date().toISOString(), isEquipped: false }],
          stats: { ...state.stats, itemsCollected: state.stats.itemsCollected + 1 },
        }))
      },

      addArkMessage: (message) => {
        set(state => ({ arkMessages: [...state.arkMessages, message] }))
      },

      checkDailyReset: () => {
        const state = get()
        const today = new Date().toDateString()
        if (state.lastDailyReset === today) return

        const resetMissions = state.missions.map(m => {
          if (m.type === 'daily') {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(0, 0, 0, 0)
            return { ...m, status: 'active' as const, progress: 0, completedAt: undefined, expiresAt: tomorrow.toISOString() }
          }
          return m
        })

        const newDailies = generateDailyMissions()
        const nonDailies = resetMissions.filter(m => m.type !== 'daily')

        set({
          missions: [...newDailies, ...nonDailies],
          lastDailyReset: today,
        })
      },

      clearLevelUpNotification: () => set({ levelUpNotification: null }),
      clearAchievementNotification: () => set({ achievementNotification: null }),

      activateDungeon: (dungeonId) => {
        set(state => ({
          dungeons: state.dungeons.map(d =>
            d.id === dungeonId ? { ...d, isActive: true } : d
          )
        }))
      },

      completeDungeonMission: (dungeonId, missionId) => {
        set(state => {
          const updatedDungeons = state.dungeons.map(d => {
            if (d.id !== dungeonId) return d
            const updatedMissions = d.missions.map(m =>
              m.id === missionId ? { ...m, status: 'completed' as const } : m
            )
            const allDone = updatedMissions.every(m => m.status === 'completed')
            return { ...d, missions: updatedMissions, isCompleted: allDone, progress: updatedMissions.filter(m => m.status === 'completed').length }
          })

          const dungeon = updatedDungeons.find(d => d.id === dungeonId)
          const wasCompleted = state.dungeons.find(d => d.id === dungeonId)?.isCompleted
          const newStats = dungeon?.isCompleted && !wasCompleted
            ? { ...state.stats, dungeonsCleared: state.stats.dungeonsCleared + 1 }
            : state.stats

          return { dungeons: updatedDungeons, stats: newStats }
        })
      },

      completeBossMission: (bossId, missionId) => {
        set(state => {
          const updatedBosses = state.bosses.map(b => {
            if (b.id !== bossId) return b
            const updatedMissions = b.missions.map(m =>
              m.id === missionId ? { ...m, status: 'completed' as const } : m
            )
            const completedCount = updatedMissions.filter(m => m.status === 'completed').length
            const newHp = Math.max(0, b.maxHp - completedCount * (b.maxHp / b.missions.length))
            const isDefeated = completedCount === b.missions.length
            return { ...b, missions: updatedMissions, hp: newHp, isDefeated }
          })

          const boss = updatedBosses.find(b => b.id === bossId)
          const wasDefeated = state.bosses.find(b => b.id === bossId)?.isDefeated

          if (boss?.isDefeated && !wasDefeated) {
            const { character: updatedChar, leveledUp, newLevel } = applyXpGain(state.character, boss.xpReward, 'task')
            const finalChar = { ...updatedChar, gold: updatedChar.gold + boss.goldReward }
            const newInventory = boss.itemReward
              ? [...state.inventory, createInventoryItem(boss.itemReward, new Date().toISOString())]
              : state.inventory
            return {
              bosses: updatedBosses,
              character: finalChar,
              inventory: newInventory,
              stats: { ...state.stats, bossesDefeated: state.stats.bossesDefeated + 1 },
              levelUpNotification: leveledUp ? { show: true, level: newLevel, rank: getRankFromLevel(newLevel) } : state.levelUpNotification,
            }
          }

          return { bosses: updatedBosses }
        })
      },

      buyItem: (itemId) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId)
        if (!item) return
        set(state => {
          if (state.character.gold < item.goldValue) return state
          return {
            character: { ...state.character, gold: state.character.gold - item.goldValue },
            inventory: [...state.inventory, createInventoryItem(item, new Date().toISOString())],
            stats: { ...state.stats, itemsCollected: state.stats.itemsCollected + 1 },
          }
        })
      },

      createCustomMission: (data) => {
        const expiresAt = (() => {
          const d = new Date()
          if (data.type === 'daily') { d.setDate(d.getDate() + 1); d.setHours(0, 0, 0, 0) }
          else if (data.type === 'weekly') d.setDate(d.getDate() + 7)
          else if (data.type === 'monthly') d.setMonth(d.getMonth() + 1)
          return d.toISOString()
        })()
        const mission: Mission = {
          id: `custom-${generateId()}`,
          ...data,
          status: 'active',
          progress: 0,
          expiresAt,
        }
        set(state => ({ missions: [...state.missions, mission] }))
      },

      deleteCustomMission: (missionId) => {
        set(state => ({ missions: state.missions.filter(m => m.id !== missionId) }))
      },
    }),
    {
      name: 'arch-ark-game',
      partialize: (state) => ({
        character: state.character,
        missions: state.missions,
        inventory: state.inventory,
        equipment: state.equipment,
        achievements: state.achievements,
        dungeons: state.dungeons,
        bosses: state.bosses,
        arkMessages: state.arkMessages,
        stats: state.stats,
        isOnboarded: state.isOnboarded,
        lastDailyReset: state.lastDailyReset,
      }),
    }
  )
)
