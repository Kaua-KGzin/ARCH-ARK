'use client'

import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { cn, getRankColor, getRankBgColor } from '@/lib/utils'
import { Dungeon, Boss } from '@/types/game'
import { useState } from 'react'
import MissionCard from '@/components/missions/MissionCard'

function DungeonCard({ dungeon }: { dungeon: Dungeon }) {
  const { activateDungeon, completeDungeonMission } = useGameStore()
  const [expanded, setExpanded] = useState(false)

  const progress = dungeon.missions.filter(m => m.status === 'completed').length
  const total = dungeon.missions.length
  const pct = total > 0 ? (progress / total) * 100 : 0

  const handleActivate = () => {
    if (!dungeon.isActive && !dungeon.isCompleted) {
      activateDungeon(dungeon.id)
      setExpanded(true)
    } else {
      setExpanded(!expanded)
    }
  }

  return (
    <div className={cn(
      'rounded-xl border transition-all duration-300',
      dungeon.isCompleted
        ? 'border-green-500/30 bg-green-900/10'
        : dungeon.isActive
        ? 'border-purple-500/40 bg-purple-900/10'
        : 'border-[#1a1a2e] bg-[#0d0d1a] hover:border-purple-500/20'
    )}>
      <div
        className="p-5 cursor-pointer"
        onClick={handleActivate}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 flex-shrink-0',
              getRankBgColor(dungeon.rank)
            )}>
              🏰
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-bold">{dungeon.name}</h3>
                <span className={cn('text-xs font-black px-2 py-0.5 rounded border', getRankBgColor(dungeon.rank))}>
                  <span className={getRankColor(dungeon.rank)}>{dungeon.rank}</span>
                </span>
                {dungeon.isCompleted && <span className="text-xs text-green-400 font-bold">✓ COMPLETA</span>}
                {dungeon.isActive && !dungeon.isCompleted && <span className="text-xs text-purple-400 font-bold animate-pulse">● ATIVA</span>}
              </div>
              <p className="text-gray-400 text-sm">{dungeon.description}</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-cyan-400">+{dungeon.xpReward} XP</span>
                <span className="text-yellow-400">+{dungeon.goldReward}g</span>
                <span className="text-gray-500">{dungeon.timeLimit} dias</span>
              </div>
            </div>
          </div>
          <div className="text-gray-500 text-lg">{expanded ? '▲' : '▼'}</div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Progresso</span>
            <span className="text-purple-400">{progress}/{total}</span>
          </div>
          <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-[#1a1a2e] pt-4 space-y-3">
          <div className="text-xs text-gray-500 font-mono mb-2">MISSÕES DA DUNGEON</div>
          {dungeon.missions.map(m => (
            <MissionCard
              key={m.id}
              mission={m}
              onComplete={(missionId) => completeDungeonMission(dungeon.id, missionId)}
            />
          ))}

          {dungeon.itemRewards.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-2">ITENS DE RECOMPENSA</div>
              <div className="flex gap-2">
                {dungeon.itemRewards.map(item => (
                  <div key={item.id} className="flex items-center gap-2 bg-purple-900/20 border border-purple-500/20 rounded-lg px-3 py-2">
                    <span>{item.icon}</span>
                    <span className="text-xs text-purple-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function BossCard({ boss }: { boss: Boss }) {
  const completeBossMission = useGameStore((state) => state.completeBossMission)
  const [expanded, setExpanded] = useState(false)
  const hpPct = (boss.hp / boss.maxHp) * 100
  const missionsDone = boss.missions.filter(m => m.status === 'completed').length

  return (
    <div className={cn(
      'rounded-xl border transition-all',
      boss.isDefeated ? 'border-green-500/20 bg-green-900/5' : 'border-red-500/20 bg-red-900/5 hover:border-red-500/40'
    )}>
      <div className="p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-4">
          <div className="text-4xl animate-float flex-shrink-0">{boss.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-bold text-lg">{boss.name}</h3>
              {boss.isDefeated && <span className="text-xs text-green-400 font-bold">✓ DERROTADO</span>}
            </div>
            <p className="text-gray-400 text-sm mb-3">{boss.description}</p>

            {/* HP Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400 font-mono">HP</span>
                <span className="text-gray-500">{boss.hp}/{boss.maxHp}</span>
              </div>
              <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all"
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-cyan-400">+{boss.xpReward} XP</span>
              <span className="text-yellow-400">+{boss.goldReward}g</span>
              <span className="text-purple-400">{boss.itemReward.icon} {boss.itemReward.name}</span>
            </div>
          </div>
          <div className="text-gray-500">{expanded ? '▲' : '▼'}</div>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-[#1a1a2e] pt-4 space-y-3">
          <div className="text-xs text-gray-500 font-mono mb-2">MISSÕES DO BOSS ({missionsDone}/{boss.missions.length})</div>
          {boss.missions.map(m => (
            <MissionCard
              key={m.id}
              mission={m}
              onComplete={(missionId) => completeBossMission(boss.id, missionId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DungeonsPage() {
  const { dungeons, bosses } = useGameStore()
  const [tab, setTab] = useState<'dungeons' | 'bosses'>('dungeons')

  const completedDungeons = dungeons.filter(d => d.isCompleted).length

  return (
    <GameLayout title="Dungeons & Bosses">
      <div className="max-w-4xl mx-auto fade-in-up space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl mb-1">🏰</div>
            <div className="text-2xl font-black text-purple-400">{completedDungeons}/{dungeons.length}</div>
            <div className="text-gray-500 text-xs">Dungeons</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-1">👹</div>
            <div className="text-2xl font-black text-red-400">{bosses.filter(b => b.isDefeated).length}/{bosses.length}</div>
            <div className="text-gray-500 text-xs">Bosses</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-1">💎</div>
            <div className="text-2xl font-black text-yellow-400">
              {[
              ...dungeons.filter(d => d.isCompleted).map(d => d.xpReward),
              ...bosses.filter(b => b.isDefeated).map(b => b.xpReward),
            ].reduce((s, v) => s + v, 0).toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs">XP Ganho</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'dungeons' as const, label: '🏰 Dungeons' },
            { id: 'bosses' as const, label: '👹 Bosses' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-6 py-2.5 rounded-lg font-semibold text-sm transition-all border',
                tab === t.id
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                  : 'text-gray-500 border-[#1a1a2e] hover:text-gray-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {tab === 'dungeons' && dungeons.map(d => <DungeonCard key={d.id} dungeon={d} />)}
          {tab === 'bosses' && bosses.map(b => <BossCard key={b.id} boss={b} />)}
        </div>
      </div>
    </GameLayout>
  )
}
