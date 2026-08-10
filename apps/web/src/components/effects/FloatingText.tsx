'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RewardNotification } from '@arch-ark/shared'

interface FloatingTextProps {
  notifications: RewardNotification[]
  onDismiss: (id: string) => void
}

// Anti-Gravity: cards sobem suavemente do chão e pulsam antes de sumir
const RARITY_GLOW: Record<string, string> = {
  legendary: 'border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.35)]',
  epic: 'border-purple-500/60 shadow-[0_0_20px_rgba(139,92,246,0.35)]',
  rare: 'border-cyan-500/60 shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  uncommon: 'border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.25)]',
  common: 'border-slate-700/60',
}

export function FloatingText({ notifications, onDismiss }: FloatingTextProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2 pointer-events-none items-end">
      <AnimatePresence initial={false}>
        {notifications.slice(-5).map((n) => {
          const glowClass = RARITY_GLOW[n.rarity ?? 'common'] ?? RARITY_GLOW.common

          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: 60, scale: 0.8, filter: 'blur(6px)' }}
              animate={{
                opacity: 1,
                y: [40, -8, 0],
                scale: [0.85, 1.06, 1],
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                y: -50,
                scale: 0.85,
                filter: 'blur(4px)',
                transition: { duration: 0.4 },
              }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
                staggerChildren: 0.05,
              }}
              onAnimationComplete={() => {
                setTimeout(() => onDismiss(n.id), 3500)
              }}
              className={`pointer-events-auto flex items-center gap-3 rounded-xl border bg-gradient-to-br from-slate-900/95 to-slate-950/95 px-4 py-3 backdrop-blur-lg max-w-xs transition-all ${glowClass}`}
            >
              <motion.span
                className="text-2xl select-none drop-shadow-lg"
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatType: 'loop'
                }}
              >
                {n.icon}
              </motion.span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {n.title}
                </p>
                <p className="text-sm font-semibold text-white leading-tight">{n.description}</p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

