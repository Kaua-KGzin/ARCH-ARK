'use client'

import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { cn, getRarityColor, getRarityBorder } from '@/lib/utils'
import { useState } from 'react'

const RARITY_LABELS: Record<string, string> = {
  common: 'Comum', uncommon: 'Incomum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário'
}

const RARITY_BG: Record<string, string> = {
  common: 'bg-gray-900/30',
  uncommon: 'bg-green-900/20',
  rare: 'bg-blue-900/20',
  epic: 'bg-purple-900/20',
  legendary: 'bg-yellow-900/20',
}

export default function AchievementsPage() {
  const { achievements } = useGameStore()
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return a.isUnlocked
    if (filter === 'locked') return !a.isUnlocked
    return true
  })

  const unlocked = achievements.filter(a => a.isUnlocked)
  const totalXpEarned = unlocked.reduce((s, a) => s + a.xpReward, 0)

  return (
    <GameLayout title="Conquistas">
      <div className="max-w-5xl mx-auto fade-in-up space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-2xl font-black text-yellow-400">{unlocked.length}/{achievements.length}</div>
            <div className="text-gray-500 text-xs">Desbloqueadas</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-1">⚡</div>
            <div className="text-2xl font-black text-cyan-400">{totalXpEarned.toLocaleString()}</div>
            <div className="text-gray-500 text-xs">XP de Conquistas</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-1">📊</div>
            <div className="text-2xl font-black text-purple-400">
              {Math.round((unlocked.length / achievements.length) * 100)}%
            </div>
            <div className="text-gray-500 text-xs">Completado</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="card">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progresso Geral</span>
            <span className="text-yellow-400 font-bold">{unlocked.length}/{achievements.length}</span>
          </div>
          <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-1000"
              style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'unlocked', label: '✓ Desbloqueadas' },
            { id: 'locked', label: '🔒 Bloqueadas' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm border transition-all',
                filter === f.id
                  ? 'border-yellow-500/40 text-yellow-400 bg-yellow-900/10'
                  : 'border-[#1a1a2e] text-gray-500 hover:text-gray-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(ach => (
            <div
              key={ach.id}
              className={cn(
                'rounded-xl border p-4 transition-all',
                ach.isUnlocked
                  ? cn(RARITY_BG[ach.rarity], getRarityBorder(ach.rarity))
                  : 'border-[#1a1a2e] bg-[#0d0d1a] opacity-60'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'text-3xl flex-shrink-0',
                  !ach.isUnlocked && 'grayscale opacity-40'
                )}>
                  {ach.isUnlocked ? ach.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-bold text-sm">{ach.title}</span>
                    {ach.isUnlocked && (
                      <span className="text-xs text-green-400">✓</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{ach.description}</p>

                  {/* Progress */}
                  {!ach.isUnlocked && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{ach.progress.toLocaleString()}/{ach.target.toLocaleString()}</span>
                        <span className="text-gray-500">{Math.round((ach.progress / ach.target) * 100)}%</span>
                      </div>
                      <div className="h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-full"
                          style={{ width: `${Math.min(100, (ach.progress / ach.target) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs font-bold', getRarityColor(ach.rarity))}>
                      {RARITY_LABELS[ach.rarity]}
                    </span>
                    <span className="text-xs text-cyan-400">+{ach.xpReward} XP</span>
                  </div>

                  {ach.isUnlocked && ach.unlockedAt && (
                    <div className="text-xs text-gray-600 mt-1">
                      Desbloqueada em {new Date(ach.unlockedAt).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GameLayout>
  )
}
