'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { getRankColor } from '@/lib/utils'
import { Rank } from '@/types/game'

export default function LevelUpModal() {
  const { levelUpNotification, clearLevelUpNotification } = useGameStore()

  useEffect(() => {
    if (levelUpNotification?.show) {
      const t = setTimeout(clearLevelUpNotification, 4000)
      return () => clearTimeout(t)
    }
  }, [levelUpNotification, clearLevelUpNotification])

  if (!levelUpNotification?.show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative animate-level-up text-center pointer-events-auto">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl scale-150" />

        <div className="relative bg-[#0d0d1a] border-2 border-cyan-400/50 rounded-2xl p-10 shadow-2xl glow-blue">
          <div className="text-6xl mb-4 animate-float">⚡</div>
          <div className="text-cyan-400 font-mono text-sm mb-2 tracking-widest">LEVEL UP</div>
          <div className="text-white font-black text-6xl mb-2">
            {levelUpNotification.level}
          </div>
          <div className={`text-2xl font-bold mb-4 ${getRankColor(levelUpNotification.rank as Rank)}`}>
            Rank {levelUpNotification.rank}
          </div>
          <div className="text-gray-400 text-sm">Seus atributos foram aumentados!</div>

          <button
            onClick={clearLevelUpNotification}
            className="mt-6 btn-primary text-sm px-8"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
