'use client'

import { useGameStore } from '@/store/useGameStore'
import { Avatar } from '@/components/ui'

export default function TopBar({ title }: { title: string }) {
  const { character } = useGameStore()

  return (
    <header className="h-14 md:h-16 bg-black-bg/80 backdrop-blur-sm border-b border-neon-cyan border-opacity-20 flex items-center justify-between px-3 md:px-6 sticky top-0 z-30">
      <div className="min-w-0">
        <h1 className="text-neon-cyan font-archivo-black font-bold text-sm md:text-lg truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm">
          <span>💰</span>
          <span className="text-neon-gold font-mono font-semibold">{character.gold.toLocaleString()}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 md:gap-1.5 text-xs md:text-sm">
          <span>🔥</span>
          <span className="text-neon-magenta font-mono font-semibold">{character.streak}d</span>
        </div>
        <div className="hidden md:flex items-center gap-1 md:gap-1.5 text-xs md:text-sm">
          <span>⚡</span>
          <span className="text-neon-cyan font-mono font-semibold">{character.totalXp.toLocaleString()} XP</span>
        </div>
        <Avatar
          avatarUrl={character.avatarUrl}
          emoji={character.avatar}
          alt={character.name}
          className="w-7 h-7 md:w-8 md:h-8 rounded-none bg-black-bg border-2 border-neon-cyan shadow-neon-cyan"
          emojiClassName="text-sm md:text-base"
        />
      </div>
    </header>
  )
}
