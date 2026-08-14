'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface StreakHeatmapProps {
  xpHistory: { date: string; amount: number }[]
  selectedDate: string | null
  onSelectDate: (dateKey: string) => void
  weeks?: number
}

/** Rampa sequencial de um único matiz (ciano do tema), escuro → claro conforme a magnitude. */
export const HEATMAP_LEVEL_COLORS = ['#12121f', '#0b3b3d', '#0e6468', '#14a3a8', '#00ffff']

const WEEKDAY_LABELS = ['', 'Seg', '', 'Qua', '', 'Sex', '']
const COLUMN_PITCH_PX = 16

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function StreakHeatmap({ xpHistory, selectedDate, onSelectDate, weeks = 26 }: StreakHeatmapProps) {
  const { columns, monthLabels, maxDaily } = useMemo(() => {
    const totals = new Map<string, number>()
    for (const entry of xpHistory) {
      const key = entry.date.slice(0, 10)
      totals.set(key, (totals.get(key) ?? 0) + entry.amount)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Grade alinhada a semanas completas (domingo–sábado), terminando na semana atual.
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
    const totalDays = weeks * 7
    const start = new Date(endOfWeek)
    start.setDate(endOfWeek.getDate() - totalDays + 1)

    const days: { key: string; date: Date; total: number }[] = []
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push({ key: dayKey(d), date: d, total: totals.get(dayKey(d)) ?? 0 })
    }

    const cols: (typeof days)[] = []
    for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7))

    const max = Math.max(1, ...days.map(d => d.total))

    const labels: { colIndex: number; label: string }[] = []
    let lastMonth = -1
    cols.forEach((col, i) => {
      const firstDay = col[0].date
      if (firstDay.getMonth() !== lastMonth) {
        lastMonth = firstDay.getMonth()
        labels.push({ colIndex: i, label: firstDay.toLocaleDateString('pt-BR', { month: 'short' }) })
      }
    })

    return { columns: cols, monthLabels: labels, maxDaily: max }
  }, [xpHistory, weeks])

  function levelFor(total: number) {
    if (total <= 0) return 0
    const ratio = total / maxDaily
    return Math.min(4, Math.max(1, Math.ceil(ratio * 4)))
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-block min-w-full">
        <div className="relative h-4 mb-1 ml-7">
          {monthLabels.map(m => (
            <span
              key={`${m.colIndex}-${m.label}`}
              className="absolute text-[10px] text-gray-500 font-mono uppercase"
              style={{ left: `${m.colIndex * COLUMN_PITCH_PX}px` }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 pr-1">
            {WEEKDAY_LABELS.map((label, i) => (
              <span key={i} className="h-3 leading-3 text-[9px] text-gray-600 font-mono">{label}</span>
            ))}
          </div>
          <div className="flex gap-1">
            {columns.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-1">
                {col.map(day => {
                  const level = levelFor(day.total)
                  const isSelected = selectedDate === day.key
                  const isFuture = day.date > today
                  return (
                    <button
                      key={day.key}
                      type="button"
                      disabled={isFuture}
                      onClick={() => onSelectDate(day.key)}
                      title={`${day.date.toLocaleDateString('pt-BR')} · ${day.total} XP`}
                      className={cn(
                        'w-3 h-3 rounded-sm transition-transform hover:scale-125 disabled:opacity-0 disabled:pointer-events-none',
                        isSelected && 'ring-2 ring-white/80'
                      )}
                      style={{ backgroundColor: HEATMAP_LEVEL_COLORS[level] }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
