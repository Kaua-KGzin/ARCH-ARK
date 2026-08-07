'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RewardNotification } from '@arch-ark/shared'

interface FloatingTextProps {
  notifications: RewardNotification[]
  onDismiss: (id: string) => void
}

export function FloatingText({ notifications, onDismiss }: FloatingTextProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.slice(-4).map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => {
              setTimeout(() => onDismiss(n.id), 3000)
            }}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-slate-950/90 px-4 py-3 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md"
          >
            <span className="text-2xl">{n.icon}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {n.title}
              </p>
              <p className="text-sm font-semibold text-white">{n.description}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
