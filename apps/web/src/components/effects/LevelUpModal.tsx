'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LevelUpNotification } from '@arch-ark/shared'

interface LevelUpModalProps {
  notification: LevelUpNotification | null
  onClose: () => void
}

export function LevelUpModal({ notification, onClose }: LevelUpModalProps) {
  if (!notification || !notification.show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-950 p-6 text-center shadow-[0_0_50px_rgba(0,240,255,0.3)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle background flare */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan-400 bg-cyan-950/60 text-4xl shadow-[0_0_20px_rgba(0,240,255,0.5)]"
          >
            ⚡
          </motion.div>

          <h2 className="text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300">
            {notification.rankChanged ? 'PROMOÇÃO DE RANK!' : 'NÍVEL AUMENTADO!'}
          </h2>

          <p className="mt-1 text-sm font-semibold text-slate-400">
            SISTEMA DE EVOLUÇÃO ATIVADO
          </p>

          <div className="my-6 rounded-xl border border-cyan-500/20 bg-slate-900/80 p-4">
            <div className="flex items-center justify-around">
              <div>
                <span className="text-xs uppercase text-slate-500">Nível</span>
                <p className="text-2xl font-bold text-slate-300">
                  {notification.previousLevel}{' '}
                  <span className="text-cyan-400">→ {notification.level}</span>
                </p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-xs uppercase text-slate-500">Rank</span>
                <p className="text-2xl font-bold text-amber-400">
                  {notification.rank}
                </p>
              </div>
            </div>

            {Object.keys(notification.attributeGains).length > 0 && (
              <div className="mt-4 border-t border-slate-800 pt-3">
                <span className="text-xs font-semibold text-cyan-400">
                  + Atributos Recebidos
                </span>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {Object.entries(notification.attributeGains).map(
                    ([key, val]) => (
                      <span
                        key={key}
                        className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs font-medium text-cyan-300"
                      >
                        +{val} {key.toUpperCase()}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="btn-primary w-full tracking-wider uppercase"
          >
            ACEITAR RECOMPENSA
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
