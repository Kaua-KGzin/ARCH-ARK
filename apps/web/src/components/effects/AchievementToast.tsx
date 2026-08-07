'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'
import { getRarityColor } from '@/lib/utils'

export default function AchievementToast() {
  const { achievementNotification, clearAchievementNotification } = useGameStore()

  useEffect(() => {
    if (achievementNotification) {
      const t = setTimeout(clearAchievementNotification, 6000)
      return () => clearTimeout(t)
    }
  }, [achievementNotification, clearAchievementNotification])

  return (
    <AnimatePresence>
      {achievementNotification && (
        <motion.div
          key={achievementNotification.id}
          className="fixed bottom-6 left-6 z-[90]"
          initial={{ opacity: 0, y: 80, scale: 0.75, filter: 'blur(8px)' }}
          animate={{
            opacity: 1,
            y: [60, -8, 0],
            scale: [0.8, 1.08, 1],
            filter: 'blur(0px)',
          }}
          exit={{
            opacity: 0,
            y: -60,
            scale: 0.8,
            filter: 'blur(6px)',
            transition: { duration: 0.4 },
          }}
          transition={{
            duration: 0.65,
            ease: [0.34, 1.56, 0.64, 1],
            staggerChildren: 0.08,
          }}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/98 to-slate-950/98 border border-amber-400/60 rounded-2xl p-5 shadow-[0_0_40px_rgba(251,191,36,0.4)] flex items-start gap-4 max-w-sm backdrop-blur-xl">
            {/* Ambient glow flares */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl bg-gradient-to-br from-amber-500/15 via-transparent to-purple-500/15"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Levitating icon with glow */}
            <motion.div
              className="text-5xl relative z-10 select-none drop-shadow-lg"
              animate={{
                y: [0, -7, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {achievementNotification.icon}
            </motion.div>

            <div className="relative z-10 flex-1">
              <div className="text-amber-400 font-black text-[10px] tracking-[0.2em] uppercase mb-0.5">
                ✦ CONQUISTA DESBLOQUEADA ✦
              </div>
              <div className="text-white font-bold text-sm">{achievementNotification.title}</div>
              <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                {achievementNotification.description}
              </div>
              <div className={`text-xs font-bold mt-1.5 ${getRarityColor(achievementNotification.rarity)}`}>
                +{achievementNotification.xpReward} XP
              </div>
            </div>

            <button
              onClick={clearAchievementNotification}
              className="relative z-10 text-slate-600 hover:text-white transition-colors text-lg leading-none mt-0.5"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

