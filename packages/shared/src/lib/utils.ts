import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Rank, ItemRarity, CharacterClass } from '../types/game'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5) + 50 * level)
}

export function calculateLevelFromXp(totalXp: number): { level: number; currentXp: number; xpToNextLevel: number } {
  let level = 1
  let remainingXp = totalXp

  while (true) {
    const xpNeeded = calculateXpForLevel(level)
    if (remainingXp < xpNeeded) break
    remainingXp -= xpNeeded
    level++
    if (level >= 1000) break
  }

  return {
    level,
    currentXp: remainingXp,
    xpToNextLevel: calculateXpForLevel(level),
  }
}

export function getRankFromLevel(level: number): Rank {
  if (level >= 200) return 'Legendary'
  if (level >= 150) return 'Monarch'
  if (level >= 100) return 'SSS'
  if (level >= 80) return 'SS'
  if (level >= 60) return 'S'
  if (level >= 40) return 'A'
  if (level >= 25) return 'B'
  if (level >= 15) return 'C'
  if (level >= 8) return 'D'
  return 'E'
}

export function getRankColor(rank: Rank): string {
  const colors: Record<Rank, string> = {
    E: 'text-gray-400',
    D: 'text-green-400',
    C: 'text-blue-400',
    B: 'text-purple-400',
    A: 'text-orange-400',
    S: 'text-yellow-400',
    SS: 'text-yellow-300',
    SSS: 'text-amber-300',
    Monarch: 'text-red-400',
    Legendary: 'text-blue-400',
  }
  return colors[rank]
}

export function getRankBgColor(rank: Rank): string {
  const colors: Record<Rank, string> = {
    E: 'bg-gray-800 border-gray-600',
    D: 'bg-green-900/30 border-green-600',
    C: 'bg-blue-900/30 border-blue-600',
    B: 'bg-purple-900/30 border-purple-600',
    A: 'bg-orange-900/30 border-orange-600',
    S: 'bg-yellow-900/30 border-yellow-600',
    SS: 'bg-yellow-900/40 border-yellow-400',
    SSS: 'bg-amber-900/40 border-amber-400',
    Monarch: 'bg-red-900/40 border-red-500',
    Legendary: 'bg-blue-900/40 border-blue-400',
  }
  return colors[rank]
}

export function getRarityColor(rarity: ItemRarity): string {
  const colors: Record<ItemRarity, string> = {
    common: 'text-gray-300',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  }
  return colors[rarity]
}

export function getRarityBorder(rarity: ItemRarity): string {
  const colors: Record<ItemRarity, string> = {
    common: 'border-gray-600',
    uncommon: 'border-green-600',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500 shadow-yellow-500/20',
  }
  return colors[rarity]
}

export function getRarityGlow(rarity: ItemRarity): string {
  const colors: Record<ItemRarity, string> = {
    common: '',
    uncommon: 'shadow-green-500/20',
    rare: 'shadow-blue-500/30',
    epic: 'shadow-purple-500/40',
    legendary: 'shadow-yellow-500/50',
  }
  return colors[rarity]
}

export function getClassIcon(cls: CharacterClass): string {
  const icons: Record<CharacterClass, string> = {
    Guerreiro: '⚔️',
    Mago: '🔮',
    Assassino: '🗡️',
    Monarca: '👑',
    Arqueiro: '🏹',
    Curandeiro: '✨',
  }
  return icons[cls]
}

export function getClassColor(cls: CharacterClass): string {
  const colors: Record<CharacterClass, string> = {
    Guerreiro: 'text-red-400',
    Mago: 'text-blue-400',
    Assassino: 'text-purple-400',
    Monarca: 'text-yellow-400',
    Arqueiro: 'text-green-400',
    Curandeiro: 'text-pink-400',
  }
  return colors[cls]
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function getDaysDiff(date1: string, date2: string = new Date().toISOString()): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffMs = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function xpBarPercent(current: number, total: number): number {
  return Math.min(100, Math.floor((current / total) * 100))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
