'use client'

import { useGameStore } from '@/store/useGameStore'

export default function TopBar({ title }: { title: string }) {
  const { character } = useGameStore()

  return (
    <header className="h-14 md:h-16 bg-[#0d0d1a]/80 backdrop-blur-sm border-b border-[#1a1a2e] flex items-center justify-between px-3 md:px-6 sticky top-0 z-30">
      <div className="min-w-0">
        <h1 className="text-white font-bold text-sm md:text-lg truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm">
          <span className="text-yellow-400">💰</span>
          <span className="text-yellow-300 font-semibold">{character.gold.toLocaleString()}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 md:gap-1.5 text-xs md:text-sm">
          <span className="text-orange-400">🔥</span>
          <span className="text-orange-300 font-semibold">{character.streak}d</span>
        </div>
        <div className="hidden md:flex items-center gap-1 md:gap-1.5 text-xs md:text-sm">
          <span className="text-cyan-400">⚡</span>
          <span className="text-cyan-300 font-semibold">{character.totalXp.toLocaleString()} XP</span>
        </div>
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-500/30 flex items-center justify-center text-sm md:text-base">
          {character.avatar}
        </div>
      </div>
    </header>
  )
}
