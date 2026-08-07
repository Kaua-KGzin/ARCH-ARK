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
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.6, y: 60, opacity: 0, filter: 'blur(10px)' }}
          animate={{
            scale: 1,
            y: [50, -8, 0],
            opacity: 1,
            filter: 'blur(0px)',
          }}
          exit={{
            scale: 0.75,
            y: -40,
            opacity: 0,
            filter: 'blur(8px)',
            transition: { duration: 0.4 },
          }}
          transition={{
            type: 'spring',
            damping: 22,
            stiffness: 280,
            delay: 0.1,
          }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-400/50 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-8 text-center shadow-[0_0_60px_rgba(0,240,255,0.4)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient glow flares */}
          <motion.div
            className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-500/25 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />

          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{
              scale: 1,
              rotate: 0,
              y: [0, -8, 0],
            }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-cyan-300 bg-gradient-to-br from-cyan-950/80 to-cyan-900/60 text-5xl shadow-[0_0_30px_rgba(0,240,255,0.6),inset_0_0_20px_rgba(0,240,255,0.2)]"
          >
            ⚡
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200"
          >
            {notification.rankChanged ? '🎖️ PROMOÇÃO DE RANK!' : '⬆️ NÍVEL AUMENTADO!'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-2 text-xs font-semibold text-cyan-300 tracking-widest"
          >
            ✦ SISTEMA DE EVOLUÇÃO ATIVADO ✦
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="my-6 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-4 backdrop-blur-sm"
          >
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
