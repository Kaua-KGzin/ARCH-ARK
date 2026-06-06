'use client'

import { Mission } from '@/types/game'
import { useGameStore } from '@/store/useGameStore'
import { cn, getRankBgColor } from '@/lib/utils'
import { useState } from 'react'

const CATEGORY_COLORS: Record<Mission['category'], string> = {
  exercise: 'text-red-400',
  study: 'text-blue-400',
  habit: 'text-green-400',
  dungeon: 'text-purple-400',
  boss: 'text-orange-400',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  E: 'text-gray-400 border-gray-600',
  D: 'text-green-400 border-green-600',
  C: 'text-blue-400 border-blue-500',
  B: 'text-purple-400 border-purple-500',
  A: 'text-orange-400 border-orange-500',
  S: 'text-yellow-400 border-yellow-500',
}

export default function MissionCard({ mission }: { mission: Mission }) {
  const { completeMission, updateMissionProgress } = useGameStore()
  const [completing, setCompleting] = useState(false)

  const isCompleted = mission.status === 'completed'
  const progressPct = Math.min(100, (mission.progress / mission.target) * 100)

  const handleComplete = async () => {
    if (isCompleted || completing) return
    setCompleting(true)
    completeMission(mission.id)
    setTimeout(() => setCompleting(false), 1000)
  }

  return (
    <div
      className={cn(
        'mission-card relative overflow-hidden',
        isCompleted && 'opacity-60'
      )}
      onClick={!isCompleted ? handleComplete : undefined}
    >
      {/* Completed overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-900/10 rounded-xl flex items-center justify-center z-10">
          <div className="bg-green-500/20 rounded-full p-2 border border-green-500/40">
            <span className="text-green-400 text-xl">✓</span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="text-2xl mt-0.5">{mission.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold text-sm">{mission.title}</span>
            <span className={cn('text-xs font-bold border rounded px-1', DIFFICULTY_COLORS[mission.difficulty] || 'text-gray-400 border-gray-600')}>
              {mission.difficulty}
            </span>
          </div>
          <p className="text-gray-400 text-xs mb-2">{mission.description}</p>

          {/* Progress bar */}
          {mission.target > 1 && (
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{mission.progress}/{mission.target} {mission.unit}</span>
                <span className="text-gray-400">{Math.round(progressPct)}%</span>
              </div>
              <div className="h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-cyan-400 font-mono">+{mission.xpReward} XP</span>
            <span className="text-xs text-yellow-400 font-mono">+{mission.goldReward}g</span>
            {mission.itemReward && (
              <span className="text-xs text-purple-400">{mission.itemReward.icon} {mission.itemReward.name}</span>
            )}
            <span className={cn('text-xs ml-auto', CATEGORY_COLORS[mission.category])}>
              {mission.category === 'exercise' ? 'Exercício' :
               mission.category === 'study' ? 'Estudo' :
               mission.category === 'habit' ? 'Hábito' :
               mission.category === 'dungeon' ? 'Dungeon' : 'Boss'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
