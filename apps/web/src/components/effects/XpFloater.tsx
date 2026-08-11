'use client'

import { motion } from 'framer-motion'

interface XpFloaterProps {
  xp: number
  x: number
  y: number
  color?: 'cyan' | 'magenta' | 'green'
}

const colorMap = {
  cyan: 'text-neon-cyan shadow-neon-cyan',
  magenta: 'text-neon-magenta shadow-neon-magenta',
  green: 'text-neon-green shadow-neon-green',
}

export function XpFloater({ xp, x, y, color = 'cyan' }: XpFloaterProps) {
  return (
    <motion.div
      initial={{ x, y, opacity: 1, scale: 1 }}
      animate={{ x: x + (Math.random() - 0.5) * 100, y: y - 100, opacity: 0, scale: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className={`fixed pointer-events-none font-archivo-black text-lg font-bold ${colorMap[color]} drop-shadow-lg`}
      style={{ zIndex: 50 }}
    >
      +{xp} XP
    </motion.div>
  )
}
