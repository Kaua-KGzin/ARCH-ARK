'use client'

import { xpBarPercent } from '@/lib/utils'
import { AnimatedNumber } from '@/components/ui'

interface XpBarProps {
  current: number
  total: number
  level: number
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function XpBar({ current, total, level, showLabels = true, size = 'md' }: XpBarProps) {
  const pct = xpBarPercent(current, total)
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-400 font-mono">EXP</span>
          <span className="text-xs text-cyan-400 font-mono">
            <AnimatedNumber value={current} /> / {total.toLocaleString()}
          </span>
        </div>
      )}
      <div className={`${heights[size]} bg-[#1a1a2e] rounded-full overflow-hidden relative`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 transition-all duration-1000 ease-out relative"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%]" />
        </div>
      </div>
      {showLabels && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">Nível {level}</span>
          <span className="text-xs text-gray-500">{pct}%</span>
        </div>
      )}
    </div>
  )
}
