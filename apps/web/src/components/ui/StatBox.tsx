'use client'

import React from 'react'
import { Card } from './Card'

interface StatBoxProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  color?: 'cyan' | 'magenta' | 'green'
  animated?: boolean
}

export function StatBox({
  label,
  value,
  icon,
  color = 'cyan',
  animated = false,
}: StatBoxProps) {
  const colorMap = {
    cyan: 'text-neon-cyan',
    magenta: 'text-neon-magenta',
    green: 'text-neon-green',
  }

  return (
    <Card interactive glow={color} className="p-4">
      <div className="flex items-center gap-3">
        {icon && <div className={`text-2xl ${colorMap[color]}`}>{icon}</div>}
        <div className="flex-1">
          <div className="text-sm font-jetbrains-mono text-gray-400 uppercase tracking-wider">{label}</div>
          <div className={`text-3xl font-archivo-black ${colorMap[color]} ${animated ? 'animate-glow-pulse' : ''}`}>
            {value}
          </div>
        </div>
      </div>
    </Card>
  )
}
