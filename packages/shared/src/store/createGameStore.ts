import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import {
  Character, CharacterClass, Mission, Item, InventoryItem,
  Equipment, Achievement, Dungeon, Boss, ArkMessage, GameStats,
  Attributes, LevelUpNotification, RewardNotification, Skill, Title, UserSettings,
} from '../types/game'
import { applyXpGain, getStreakBonus } from '../lib/xp'
import {
  generateDailyMissions, generateWeeklyMissions,
  generateMonthlyMissions, generateDungeons, generateBosses,
} from '../lib/missions'
import { SHOP_ITEMS, createInventoryItem, createStarterLoadout } from '../lib/items'
import { checkAchievements, ALL_ACHIEVEMENTS } from '../lib/achievements'
import { calculateLevelFromXp, getRankFromLevel, generateId, isToday } from '../lib/utils'
import { SYSTEM_SKILLS, checkSkillUnlocks } from '../lib/skills'
import { SYSTEM_TITLES } from '../lib/titles'


export const CURRENT_CONTENT_VERSION = 2
const XP_HISTORY_LIMIT = 200

function appendXpHistory(history: { date: string; amount: number }[], amount: number) {
  if (amount <= 0) return history
  return [...history, { date: new Date().toISOString(), amount }].slice(-XP_HISTORY_LIMIT)
}

const initialCreatedAt = new Date().toISOString()
const STARTER_LOADOUT = createStarterLoadout(initialCreatedAt)

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
  createdAt: initialCreatedAt,
  streak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  gold: 100,
}

export interface XpHistoryEntry {
  date: string
  amount: number
}

export interface GameState {
  character: Character
  missions: Mission[]
  inventory: InventoryItem[]
  equipment: Equipment
  achievements: Achievement[]
  dungeons: Dungeon[]
  bosses: Boss[]
  skills: Skill[]
  titles: Title[]
  settings: UserSettings
  arkMessages: ArkMessage[]
  stats: GameStats
  /** Log de ganhos de XP (data + quantidade), usado para gráficos de evolução. Capado nas últimas 200 entradas. */
  xpHistory: XpHistoryEntry[]
  isOnboarded: boolean
  lastDailyReset: string | null
  levelUpNotification: LevelUpNotification | null
  achievementNotification: Achievement | null
  rewardNotifications: RewardNotification[]
  prophecy: string | null
  prophecyDate: string | null
  contentVersion: number

  // Actions
  setupCharacter: (name: string, cls: CharacterClass) => void
  completeMission: (missionId: string) => void
  updateMissionProgress: (missionId: string, amount: number) => void
  addXp: (amount: number, category: Mission['category']) => void
  addGold: (amount: number) => void
  equipItem: (item: InventoryItem) => void
  unequipItem: (slot: keyof Equipment) => void
  addToInventory: (item: Item) => void
  toggleSkillEquip: (skillId: string) => void
  setActiveTitle: (titleId: string) => void
  updateSettings: (newSettings: Partial<UserSettings>) => void
  addArkMessage: (message: ArkMessage) => void
  checkDailyReset: () => void
  ensureStarterLoadout: () => void
  clearLevelUpNotification: () => void
  clearAchievementNotification: () => void
  dismissRewardNotification: (id: string) => void
  activateDungeon: (dungeonId: string) => void
  completeDungeonMission: (dungeonId: string, missionId: string) => void
  completeBossMission: (bossId: string, missionId: string) => void
  addCustomMissions: (missions: Mission[]) => void
  createCustomMission: (data: Pick<Mission, 'title' | 'description' | 'category' | 'type' | 'icon' | 'xpReward' | 'goldReward' | 'target' | 'unit' | 'difficulty'>) => void
  deleteCustomMission: (missionId: string) => void
  buyItem: (itemId: string) => void
  setProphecy: (text: string) => void
}


export interface GameStoreOptions {
  /** Chave de persistência. Padrão: 'arch-ark-game' */
  name?: string
  /** Storage customizado (ex.: AsyncStorage no mobile). Padrão: localStorage */
  storage?: StateStorage
}

export function createGameStore(options: GameStoreOptions = {}) {
  const { name = 'arch-ark-game', storage } = options

  return create<GameState>()(
    persist(
      (set, get) => ({
        character: DEFAULT_CHARACTER,
        missions: [
          ...generateDailyMissions(),
          ...generateWeeklyMissions(),
          ...generateMonthlyMissions(),
        ],
        inventory: STARTER_LOADOUT.inventory,
        equipment: STARTER_LOADOUT.equipment,
        achievements: ALL_ACHIEVEMENTS,
        dungeons: generateDungeons() as Dungeon[],
        bosses: generateBosses() as Boss[],
        skills: SYSTEM_SKILLS,
        titles: SYSTEM_TITLES,
        settings: {
          soundEnabled: true,
          particlesEnabled: true,
          themeMode: 'monarch-dark',
          compactMissions: false,
        },
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
        xpHistory: [],
        isOnboarded: false,
        lastDailyReset: null,
        levelUpNotification: null,
        achievementNotification: null,
        rewardNotifications: [],
        prophecy: null,
        prophecyDate: null,
        contentVersion: CURRENT_CONTENT_VERSION,

        toggleSkillEquip: (skillId) => {
          set(state => ({
            skills: state.skills.map(s => s.id === skillId ? { ...s, isEquipped: !s.isEquipped } : s)
          }))
        },

        setActiveTitle: (titleId) => {
          const state = get()
          const foundTitle = state.titles.find(t => t.id === titleId)
          if (!foundTitle || !foundTitle.isUnlocked) return
          set(st => ({
            character: { ...st.character, title: foundTitle.name }
          }))
        },

        updateSettings: (newSettings) => {
          set(state => ({
            settings: { ...state.settings, ...newSettings }
          }))
        },


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
            Guerreiro: '⚔️', Mago: '🔮', Assassino: '🗡️', Monarca: '👑', Arqueiro: '🏹', Curandeiro: '✨',
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

          const {
            character: updatedChar,
            leveledUp,
            newLevel,
            previousLevel,
            previousRank,
            rankChanged,
            attributeGains,
          } = applyXpGain(
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
          if (mission.category === 'exercise') newStats.totalExerciseMinutes += mission.target
          else if (mission.category === 'study') newStats.totalStudyMinutes += mission.target
          else if (mission.category === 'habit') newStats.totalHabitsCompleted++

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
          const rewardNotifications: RewardNotification[] = []
          if (mission.itemReward) {
            const item = createInventoryItem(mission.itemReward, today)
            newInventory = [...newInventory, item]
            newStats.itemsCollected++
            rewardNotifications.push({
              id: generateId(),
              type: 'loot',
              title: 'Loot adquirido',
              description: item.name,
              icon: item.icon,
              rarity: item.rarity,
            })
          }

          const updatedAchievements = checkAchievements(finalChar, newStats, state.achievements, {
            missions: updatedMissions,
            equippedCount: newInventory.filter(i => i.isEquipped).length,
          })
          const newlyUnlocked = updatedAchievements.find(
            (a, i) => a.isUnlocked && !state.achievements[i].isUnlocked
          )

          if (newlyUnlocked) {
            rewardNotifications.push({
              id: generateId(),
              type: 'achievement',
              title: 'Conquista desbloqueada',
              description: newlyUnlocked.title,
              icon: newlyUnlocked.icon,
              rarity: newlyUnlocked.rarity,
            })
          }

          if (leveledUp) {
            rewardNotifications.push({
              id: generateId(),
              type: rankChanged ? 'rank-up' : 'level-up',
              title: rankChanged ? 'Rank aumentado' : 'Nível aumentado',
              description: rankChanged
                ? `Rank ${previousRank} → ${getRankFromLevel(newLevel)}`
                : `Nível ${previousLevel} → ${newLevel}`,
              icon: rankChanged ? '⚡' : '⬆️',
              rarity: rankChanged ? 'epic' : 'rare',
            })
          }

          set({
            character: finalChar,
            missions: updatedMissions,
            inventory: newInventory,
            stats: newStats,
            achievements: updatedAchievements,
            levelUpNotification: leveledUp ? {
              show: true,
              playerName: finalChar.name,
              previousLevel,
              level: newLevel,
              previousRank,
              rank: getRankFromLevel(newLevel),
              rankChanged,
              xpGained: xpEarned,
              goldGained: goldEarned,
              attributeGains,
            } : state.levelUpNotification,
            achievementNotification: newlyUnlocked || state.achievementNotification,
            rewardNotifications: [...state.rewardNotifications, ...rewardNotifications],
            xpHistory: appendXpHistory(state.xpHistory, xpEarned),
          })
        },

        updateMissionProgress: (missionId, amount) => {
          set(state => ({
            missions: state.missions.map(m => {
              if (m.id !== missionId || m.status !== 'active') return m
              const newProgress = Math.min(m.target, m.progress + amount)
              return { ...m, progress: newProgress }
            }),
          }))
        },

        addXp: (amount, category) => {
          const state = get()
          const {
            character: updatedChar,
            leveledUp,
            newLevel,
            previousLevel,
            previousRank,
            rankChanged,
            attributeGains,
          } = applyXpGain(state.character, amount, category)
          set({
            character: updatedChar,
            levelUpNotification: leveledUp ? {
              show: true,
              playerName: updatedChar.name,
              previousLevel,
              level: newLevel,
              previousRank,
              rank: getRankFromLevel(newLevel),
              rankChanged,
              xpGained: amount,
              goldGained: 0,
              attributeGains,
            } : state.levelUpNotification,
            xpHistory: appendXpHistory(state.xpHistory, amount),
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
              i.slot === item.slot ? { ...i, isEquipped: false } : i
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
            inventory: [...state.inventory, createInventoryItem(item)],
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

          const newDailies = generateDailyMissions()
          const nonDailies = state.missions.filter(m => m.type !== 'daily')

          set({ missions: [...newDailies, ...nonDailies], lastDailyReset: today })
        },

        ensureStarterLoadout: () => {
          const state = get()
          const hasChestEquipment = Boolean(state.equipment.chest)
          const hasChestInventory = state.inventory.some(i => i.slot === 'chest')
          if (hasChestEquipment || hasChestInventory) return

          const starter = createStarterLoadout()
          set({
            inventory: [...starter.inventory, ...state.inventory],
            equipment: { ...state.equipment, ...starter.equipment },
          })
        },

        clearLevelUpNotification: () => set({ levelUpNotification: null }),
        clearAchievementNotification: () => set({ achievementNotification: null }),
        dismissRewardNotification: (id) => {
          set(state => ({
            rewardNotifications: state.rewardNotifications.filter(n => n.id !== id),
          }))
        },

        activateDungeon: (dungeonId) => {
          set(state => ({
            dungeons: state.dungeons.map(d => d.id === dungeonId ? { ...d, isActive: true } : d),
          }))
        },

        completeDungeonMission: (dungeonId, missionId) => {
          set(state => {
            const dungeon = state.dungeons.find(d => d.id === dungeonId)
            if (!dungeon) return state
            const mission = dungeon.missions.find(m => m.id === missionId)
            if (!mission || mission.status === 'completed') return state

            const updatedDungeons = state.dungeons.map(d => {
              if (d.id !== dungeonId) return d
              const updatedMissions = d.missions.map(m =>
                m.id === missionId ? { ...m, status: 'completed' as const } : m
              )
              const allDone = updatedMissions.every(m => m.status === 'completed')
              return { ...d, missions: updatedMissions, isCompleted: allDone, progress: updatedMissions.filter(m => m.status === 'completed').length }
            })

            const updatedDungeon = updatedDungeons.find(d => d.id === dungeonId)!
            const wasCompleted = dungeon.isCompleted

            if (!updatedDungeon.isCompleted || wasCompleted) {
              return { dungeons: updatedDungeons }
            }

            const { character: updatedChar, leveledUp, newLevel, previousLevel, previousRank, rankChanged, attributeGains } = applyXpGain(state.character, updatedDungeon.xpReward, 'dungeon')
            const finalChar = { ...updatedChar, gold: updatedChar.gold + updatedDungeon.goldReward }

            const rewardNotifications: RewardNotification[] = [{
              id: generateId(),
              type: 'level-up',
              title: 'Masmorra Concluída!',
              description: `${updatedDungeon.name} — +${updatedDungeon.xpReward} XP`,
              icon: '🏰',
              rarity: 'epic' as const,
            }]

            let newInventory = [...state.inventory]
            updatedDungeon.itemRewards.forEach(item => {
              newInventory = [...newInventory, createInventoryItem(item, new Date().toISOString())]
              rewardNotifications.push({
                id: generateId(),
                type: 'loot',
                title: 'Recompensa de Masmorra',
                description: item.name,
                icon: item.icon,
                rarity: item.rarity,
              })
            })

            return {
              dungeons: updatedDungeons,
              character: finalChar,
              inventory: newInventory,
              stats: { ...state.stats, dungeonsCleared: state.stats.dungeonsCleared + 1 },
              levelUpNotification: leveledUp ? {
                show: true,
                playerName: finalChar.name,
                previousLevel,
                level: newLevel,
                previousRank,
                rank: getRankFromLevel(newLevel),
                rankChanged,
                xpGained: updatedDungeon.xpReward,
                goldGained: updatedDungeon.goldReward,
                attributeGains,
              } : state.levelUpNotification,
              rewardNotifications: [...state.rewardNotifications, ...rewardNotifications],
              xpHistory: appendXpHistory(state.xpHistory, updatedDungeon.xpReward),
            }
          })
        },

        completeBossMission: (bossId, missionId) => {
          set(state => {
            const boss = state.bosses.find(b => b.id === bossId)
            if (!boss) return state
            const mission = boss.missions.find(m => m.id === missionId)
            if (!mission || mission.status === 'completed') return state

            const updatedBosses = state.bosses.map(b => {
              if (b.id !== bossId) return b
              const updatedMissions = b.missions.map(m =>
                m.id === missionId ? { ...m, status: 'completed' as const } : m
              )
              const completedCount = updatedMissions.filter(m => m.status === 'completed').length
              const hpPerMission = b.maxHp / b.missions.length
              const newHp = Math.max(0, b.maxHp - completedCount * hpPerMission)
              const allDone = updatedMissions.every(m => m.status === 'completed')
              return { ...b, missions: updatedMissions, hp: newHp, isDefeated: allDone }
            })

            const updatedBoss = updatedBosses.find(b => b.id === bossId)!
            const wasDefeated = boss.isDefeated

            if (!updatedBoss.isDefeated || wasDefeated) {
              return { bosses: updatedBosses }
            }

            const { character: updatedChar, leveledUp, newLevel, previousLevel, previousRank, rankChanged, attributeGains } = applyXpGain(state.character, updatedBoss.xpReward, 'boss')
            const finalChar = { ...updatedChar, gold: updatedChar.gold + updatedBoss.goldReward }

            const newInventory = [...state.inventory, createInventoryItem(updatedBoss.itemReward, new Date().toISOString())]

            const rewardNotifications: RewardNotification[] = [
              {
                id: generateId(),
                type: 'boss',
                title: `Boss Derrotado: ${updatedBoss.name}`,
                description: `+${updatedBoss.xpReward} XP · +${updatedBoss.goldReward} Ouro`,
                icon: updatedBoss.icon,
                rarity: 'legendary' as const,
              },
              {
                id: generateId(),
                type: 'loot',
                title: 'Loot Épico',
                description: updatedBoss.itemReward.name,
                icon: updatedBoss.itemReward.icon,
                rarity: updatedBoss.itemReward.rarity,
              },
            ]

            return {
              bosses: updatedBosses,
              character: finalChar,
              inventory: newInventory,
              stats: { ...state.stats, bossesDefeated: state.stats.bossesDefeated + 1 },
              levelUpNotification: leveledUp ? {
                show: true,
                playerName: finalChar.name,
                previousLevel,
                level: newLevel,
                previousRank,
                rank: getRankFromLevel(newLevel),
                rankChanged,
                xpGained: updatedBoss.xpReward,
                goldGained: updatedBoss.goldReward,
                attributeGains,
              } : state.levelUpNotification,
              rewardNotifications: [...state.rewardNotifications, ...rewardNotifications],
              xpHistory: appendXpHistory(state.xpHistory, updatedBoss.xpReward),
            }
          })
        },

        addCustomMissions: (customMissions) => {
          set(state => ({ missions: [...state.missions, ...customMissions] }))
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

        buyItem: (itemId) => {
          const item = SHOP_ITEMS.find(i => i.id === itemId)
          if (!item) return
          set(state => {
            if (state.character.gold < item.goldValue) return state
            const newItem = createInventoryItem(item, new Date().toISOString())
            return {
              character: { ...state.character, gold: state.character.gold - item.goldValue },
              inventory: [...state.inventory, newItem],
              stats: { ...state.stats, itemsCollected: state.stats.itemsCollected + 1 },
              rewardNotifications: [...state.rewardNotifications, {
                id: generateId(),
                type: 'loot' as const,
                title: 'Item comprado',
                description: item.name,
                icon: item.icon,
                rarity: item.rarity,
              }],
            }
          })
        },

        setProphecy: (text) => {
          set({ prophecy: text, prophecyDate: new Date().toISOString() })
        },
      }),
      {
        name,
        storage: storage ? createJSONStorage(() => storage) : undefined,
        merge: (persisted, current) => {
          const p = persisted as Partial<GameState> | undefined
          if (!p) return current

          const base = { ...current, ...p } as GameState

          // Migração de conteúdo: preserva progresso, adiciona o que falta
          const achievements = ALL_ACHIEVEMENTS.map(ach => {
            const existing = base.achievements?.find(a => a.id === ach.id)
            return existing ? { ...ach, ...existing } : { ...ach, progress: 0, isUnlocked: false }
          })

          const freshDungeons = generateDungeons() as Dungeon[]
          const freshBosses = generateBosses() as Boss[]
          const dungeons = [
            ...(base.dungeons ?? []),
            ...freshDungeons.filter(d => !base.dungeons?.some(x => x.id === d.id)),
          ]
          const bosses = [
            ...(base.bosses ?? []),
            ...freshBosses.filter(b => !base.bosses?.some(x => x.id === b.id)),
          ]

          return {
            ...base,
            achievements,
            dungeons,
            bosses,
            skills: checkSkillUnlocks(base.character, base.skills ?? SYSTEM_SKILLS),
            titles: base.titles ?? SYSTEM_TITLES,
            settings: base.settings ?? {
              soundEnabled: true,
              particlesEnabled: true,
              themeMode: 'monarch-dark',
              compactMissions: false,
            },
            contentVersion: CURRENT_CONTENT_VERSION,
            prophecy: base.prophecy ?? null,
            prophecyDate: base.prophecyDate ?? null,
            xpHistory: base.xpHistory ?? [],
            rewardNotifications: base.rewardNotifications ?? [],
            levelUpNotification:
              base.levelUpNotification && 'playerName' in base.levelUpNotification
                ? base.levelUpNotification
                : null,
          }
        },
        partialize: (state) => ({
          character: state.character,
          missions: state.missions,
          inventory: state.inventory,
          equipment: state.equipment,
          achievements: state.achievements,
          dungeons: state.dungeons,
          bosses: state.bosses,
          skills: state.skills,
          titles: state.titles,
          settings: state.settings,
          arkMessages: state.arkMessages,
          stats: state.stats,
          xpHistory: state.xpHistory,
          isOnboarded: state.isOnboarded,
          lastDailyReset: state.lastDailyReset,
          prophecy: state.prophecy,
          prophecyDate: state.prophecyDate,
          contentVersion: state.contentVersion,
        }),
      }
    )
  )
}
