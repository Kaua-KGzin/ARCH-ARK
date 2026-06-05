'use client'

interface AttributeBarProps {
  name: string
  value: number
  max?: number
  color?: string
  icon?: string
}

export default function AttributeBar({ name, value, max = 100, color = 'from-blue-500 to-cyan-400', icon }: AttributeBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex items-center gap-3">
      {icon && <span className="text-base w-5 text-center">{icon}</span>}
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-400">{name}</span>
          <span className="text-xs text-white font-bold font-mono">{value}</span>
        </div>
        <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
