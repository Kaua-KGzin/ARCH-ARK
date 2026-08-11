'use client'

import { Mission } from '@/types/game'
import { useGameStore } from '@/store/useGameStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { playSoundIfEnabled } from '@/lib/sound'
import { Badge, Card } from '@/components/ui'

const CATEGORY_COLORS: Record<Mission['category'], string> = {
  exercise: 'text-red-400',
  study: 'text-blue-400',
  habit: 'text-green-400',
  dungeon: 'text-purple-400',
  boss: 'text-orange-400',
  task: 'text-cyan-400',
  nutrition: 'text-lime-400',
  mindfulness: 'text-violet-400',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  E: 'text-gray-400 border-gray-600',
  D: 'text-green-400 border-green-600',
  C: 'text-blue-400 border-blue-500',
  B: 'text-purple-400 border-purple-500',
  A: 'text-orange-400 border-orange-500',
  S: 'text-yellow-400 border-yellow-500',
}

interface MissionCardProps {
  mission: Mission
  /** Missões de dungeon/boss vivem aninhadas, não em state.missions — o
   * caller passa o handler certo (completeDungeonMission/completeBossMission).
   * Sem isso, cai no completeMission padrão (missões soltas). */
  onComplete?: (missionId: string) => void
}

export default function MissionCard({ mission, onComplete }: MissionCardProps) {
  const completeMission = useGameStore((state) => state.completeMission)
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
  const compact = useGameStore((state) => state.settings.compactMissions)
  const [completing, setCompleting] = useState(false)

  const isCompleted = mission.status === 'completed'
  const progressPct = Math.min(100, (mission.progress / mission.target) * 100)

  const handleComplete = async () => {
    if (isCompleted || completing) return
    setCompleting(true)
    playSoundIfEnabled(mission.itemReward ? 'loot' : 'complete', soundEnabled)
    ;(onComplete ?? completeMission)(mission.id)
    setTimeout(() => setCompleting(false), 1000)
  }

  return (
    <Card
      interactive={!isCompleted}
      glow={isCompleted ? 'green' : 'cyan'}
      className={cn(
        'mission-card relative overflow-hidden',
        compact && 'py-2.5 px-3',
        isCompleted && 'opacity-70 border-neon-green border-opacity-60',
        completing && 'animate-glitch'
      )}
      onClick={!isCompleted ? handleComplete : undefined}
    >
      {/* Completed checkmark */}
      {isCompleted && (
        <div className="absolute inset-0 bg-neon-green/5 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-neon-green/20 rounded-full p-2 border border-neon-green/50">
            <span className="text-neon-green text-xl font-bold">✓</span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5', compact ? 'text-lg' : 'text-2xl')}>{mission.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={cn('flex items-center gap-2', compact ? 'mb-0' : 'mb-1')}>
            <span className={cn('text-white font-semibold font-jetbrains-mono', compact ? 'text-xs' : 'text-sm')}>{mission.title}</span>
            <Badge
              variant={mission.difficulty === 'S' ? 'gold' : mission.difficulty === 'A' ? 'magenta' : 'cyan'}
              size="sm"
              glow={false}
              className="text-[10px] px-1.5"
            >
              {mission.difficulty}
            </Badge>
            {compact && (
              <span className="ml-auto text-xs text-neon-cyan font-mono shrink-0">+{mission.xpReward} XP</span>
            )}
          </div>

          {!compact && <p className="text-gray-400 text-xs mb-2">{mission.description}</p>}

          {/* Progress bar */}
          {mission.target > 1 && (
            <div className={compact ? 'mt-1' : 'mb-2'}>
              {!compact && (
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{mission.progress}/{mission.target} {mission.unit}</span>
                  <span className="text-gray-400">{Math.round(progressPct)}%</span>
                </div>
              )}
              <div className="h-1 bg-black-bg border border-neon-cyan border-opacity-20 rounded-none overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-green rounded-none transition-all duration-500 shadow-neon-cyan"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {!compact && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <Badge variant="cyan" size="sm" glow={false}>⚡ {mission.xpReward} XP</Badge>
              <Badge variant="gold" size="sm" glow={false}>💰 {mission.goldReward}g</Badge>
              {mission.itemReward && (
                <Badge variant="magenta" size="sm" glow={false}>{mission.itemReward.icon} {mission.itemReward.name}</Badge>
              )}
              <Badge variant="cyan" size="sm" glow={false} className="ml-auto">
                {mission.category === 'exercise' ? '🏃 Exercício' :
                 mission.category === 'study' ? '📚 Estudo' :
                 mission.category === 'habit' ? '⭐ Hábito' :
                 mission.category === 'dungeon' ? '🏰 Dungeon' : '👹 Boss'}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
