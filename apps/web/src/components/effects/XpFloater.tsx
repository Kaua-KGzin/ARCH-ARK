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

/** Deriva um deslocamento horizontal pseudo-aleatório, mas puro (determinístico
 * a partir das props), pra respeitar a regra de pureza do React Compiler —
 * Math.random() direto no render produz resultados instáveis entre renders. */
function seededDrift(seed: number) {
  const n = Math.sin(seed) * 10000
  return (n - Math.floor(n) - 0.5) * 100
}

export function XpFloater({ xp, x, y, color = 'cyan' }: XpFloaterProps) {
  const drift = seededDrift(x + y + xp)

  return (
    <motion.div
      initial={{ x, y, opacity: 1, scale: 1 }}
      animate={{ x: x + drift, y: y - 100, opacity: 0, scale: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className={`fixed pointer-events-none font-archivo-black text-lg font-bold ${colorMap[color]} drop-shadow-lg`}
      style={{ zIndex: 50 }}
    >
      +{xp} XP
    </motion.div>
  )
}
