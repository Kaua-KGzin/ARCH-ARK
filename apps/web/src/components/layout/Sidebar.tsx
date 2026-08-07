'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import { cn, xpBarPercent, getRankColor } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/character', label: 'Personagem', icon: '👤' },
  { href: '/skills', label: 'Habilidades', icon: '✨' },
  { href: '/missions', label: 'Missões', icon: '📋' },
  { href: '/dungeons', label: 'Dungeons', icon: '🏰' },
  { href: '/inventory', label: 'Inventário', icon: '🎒' },
  { href: '/loja', label: 'Loja', icon: '🏪' },
  { href: '/achievements', label: 'Conquistas', icon: '🏆' },
  { href: '/ranking', label: 'Ranking', icon: '📊' },
  { href: '/ark', label: 'ARK IA', icon: '🤖' },
]


export default function Sidebar() {
  const pathname = usePathname()
  const { character } = useGameStore()
  const xpPct = xpBarPercent(character.currentXp, character.xpToNextLevel)

  return (
    <aside className="w-64 min-h-screen bg-[#0d0d1a] border-r border-[#1a1a2e] flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[#1a1a2e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl font-bold glow-blue">
            ⚔
          </div>
          <div>
            <div className="text-white font-black text-lg tracking-wider">ARCH ARK</div>
            <div className="text-xs text-cyan-400 font-mono">SISTEMA ATIVO</div>
          </div>
        </div>
      </div>

      {/* Character Mini Card */}
      <div className="p-4 border-b border-[#1a1a2e]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-500/30 flex items-center justify-center text-xl">
            {character.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm truncate">{character.name}</div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-bold', getRankColor(character.rank))}>
                [{character.rank}]
              </span>
              <span className="text-xs text-gray-400">Nv.{character.level}</span>
            </div>
          </div>
        </div>
        <div className="xp-bar">
          <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{character.currentXp.toLocaleString()} XP</span>
          <span className="text-xs text-cyan-400">{xpPct}%</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-px border-b border-[#1a1a2e]">
        <div className="p-3 text-center bg-[#0a0a12]">
          <div className="text-yellow-400 font-bold text-sm">{character.gold}</div>
          <div className="text-xs text-gray-500">Ouro</div>
        </div>
        <div className="p-3 text-center bg-[#0a0a12]">
          <div className="text-orange-400 font-bold text-sm">{character.streak}</div>
          <div className="text-xs text-gray-500">Streak</div>
        </div>
        <div className="p-3 text-center bg-[#0a0a12]">
          <div className="text-purple-400 font-bold text-sm">{character.class.substring(0,3)}</div>
          <div className="text-xs text-gray-500">Classe</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/10 text-cyan-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#16213e]'
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1a1a2e]">
        <div className="text-xs text-gray-600 text-center font-mono">ARCH ARK v1.0.0</div>
        <div className="text-xs text-gray-700 text-center">Solo Leveling System</div>
      </div>
    </aside>
  )
}
