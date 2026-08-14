'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { StreakHeatmap, HEATMAP_LEVEL_COLORS } from '@/components/calendar/StreakHeatmap'

export default function CalendarPage() {
  const { character, xpHistory, missions, dungeons, bosses } = useGameStore()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const dailyTotals = useMemo(() => {
    const totals = new Map<string, number>()
    for (const entry of xpHistory) {
      const key = entry.date.slice(0, 10)
      totals.set(key, (totals.get(key) ?? 0) + entry.amount)
    }
    return totals
  }, [xpHistory])

  const allMissions = useMemo(
    () => [...missions, ...dungeons.flatMap(d => d.missions), ...bosses.flatMap(b => b.missions)],
    [missions, dungeons, bosses]
  )

  const missionsForSelectedDay = useMemo(() => {
    if (!selectedDate) return []
    return allMissions.filter(m => m.status === 'completed' && m.completedAt?.slice(0, 10) === selectedDate)
  }, [allMissions, selectedDate])

  const xpForSelectedDay = selectedDate ? dailyTotals.get(selectedDate) ?? 0 : 0
  const activeDaysCount = dailyTotals.size

  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      })
    : null

  return (
    <GameLayout title="Calendário">
      <div className="max-w-4xl mx-auto fade-in-up space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-black text-orange-400">🔥 {character.streak}</div>
            <div className="text-gray-500 text-xs">Sequência Atual</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-black text-amber-400">{character.longestStreak}</div>
            <div className="text-gray-500 text-xs">Recorde</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-black text-cyan-400">{activeDaysCount}</div>
            <div className="text-gray-500 text-xs">Dias Ativos</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              🗓️ Atividade dos Últimos 6 Meses
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono">
              <span>Menos</span>
              {HEATMAP_LEVEL_COLORS.map(color => (
                <span key={color} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
              ))}
              <span>Mais</span>
            </div>
          </div>
          <StreakHeatmap
            xpHistory={xpHistory}
            selectedDate={selectedDate}
            onSelectDate={key => setSelectedDate(prev => (prev === key ? null : key))}
          />
          <p className="text-gray-600 text-xs mt-2">Clique num dia pra ver as missões completadas.</p>
        </div>

        {/* Day detail */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-sm capitalize">{selectedDateLabel}</h3>
                <span className="text-cyan-400 font-mono text-sm">+{xpForSelectedDay} XP</span>
              </div>
              {missionsForSelectedDay.length === 0 ? (
                <div className="text-gray-500 text-sm py-6 text-center">
                  Nenhuma missão completada neste dia.
                </div>
              ) : (
                <div className="space-y-2">
                  {missionsForSelectedDay.map(m => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 bg-[#080812] border border-[#1a1a2e] rounded-lg px-3 py-2"
                    >
                      <span className="text-lg">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">{m.title}</div>
                        <div className="text-gray-500 text-xs capitalize">{m.category}</div>
                      </div>
                      <span className="text-cyan-400 text-xs font-mono flex-shrink-0">+{m.xpReward} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  )
}
