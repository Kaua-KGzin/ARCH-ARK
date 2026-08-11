'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  className?: string
  trigger?: boolean
}

export function GlitchText({ children, className = '', trigger = false }: GlitchTextProps) {
  const glitchVariants = {
    normal: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
    glitch1: { clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 40%)' },
    glitch2: { clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)' },
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        initial="normal"
        animate={trigger ? ['normal', 'glitch1', 'glitch2', 'normal'] : 'normal'}
        variants={glitchVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="text-neon-cyan"
      >
        {children}
      </motion.div>

      {/* RGB offset layers */}
      {trigger && (
        <>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [2, -2, 2, 0] }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 text-neon-magenta opacity-50 clip-path-glitch-1"
            style={{ mixBlendMode: 'screen' }}
          >
            {children}
          </motion.div>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [-2, 2, -2, 0] }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 text-neon-green opacity-50 clip-path-glitch-2"
            style={{ mixBlendMode: 'screen' }}
          >
            {children}
          </motion.div>
        </>
      )}
    </div>
  )
}
