'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { getRarityColor } from '@/lib/utils'

export default function AchievementToast() {
  const { achievementNotification, clearAchievementNotification } = useGameStore()

  useEffect(() => {
    if (achievementNotification) {
      const t = setTimeout(clearAchievementNotification, 5000)
      return () => clearTimeout(t)
    }
  }, [achievementNotification, clearAchievementNotification])

  if (!achievementNotification) return null

  return (
    <div className="fixed bottom-6 right-6 z-[90] notification-enter">
      <div className="bg-[#0d0d1a] border border-yellow-500/50 rounded-xl p-4 shadow-2xl glow-gold flex items-center gap-4 max-w-sm">
        <div className="text-3xl">{achievementNotification.icon}</div>
        <div>
          <div className="text-yellow-400 font-bold text-xs mb-0.5 tracking-widest">CONQUISTA DESBLOQUEADA</div>
          <div className="text-white font-semibold">{achievementNotification.title}</div>
          <div className="text-gray-400 text-sm">{achievementNotification.description}</div>
          <div className={`text-xs font-bold mt-1 ${getRarityColor(achievementNotification.rarity)}`}>
            +{achievementNotification.xpReward} XP
          </div>
        </div>
        <button onClick={clearAchievementNotification} className="text-gray-600 hover:text-white ml-2 text-lg">×</button>
      </div>
    </div>
  )
}
