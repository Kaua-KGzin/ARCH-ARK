'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { formatNumber } from '@/lib/utils'

const CHART_TOOLTIP_STYLE = {
  background: '#0d0d1a',
  border: '1px solid #1a1a2e',
  borderRadius: 8,
  fontSize: 12,
  color: '#e2e8f0',
}

const ATTRIBUTE_LABELS: Record<string, string> = {
  strength: 'Força',
  resistance: 'Resistência',
  intelligence: 'Intel.',
  discipline: 'Disciplina',
  focus: 'Foco',
  charisma: 'Carisma',
  vitality: 'Vitalidade',
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="card text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="text-gray-500 text-xs mt-0.5">{label}</div>
    </div>
  )
}

export default function StatsPage() {
  const { character, stats, xpHistory, missions } = useGameStore()

  const dailyXp = useMemo(() => {
    const days: { key: string; label: string; xp: number }[] = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      days.push({
        key: d.toDateString(),
        label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        xp: 0,
      })
    }
    const byDay = new Map(days.map((d) => [d.key, d]))
    for (const entry of xpHistory) {
      const key = new Date(entry.date).toDateString()
      const day = byDay.get(key)
      if (day) day.xp += entry.amount
    }
    return days
  }, [xpHistory])

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const m of missions) {
      if (m.status !== 'completed') continue
      counts[m.category] = (counts[m.category] ?? 0) + 1
    }
    return Object.entries(counts).map(([category, count]) => ({ category, count }))
  }, [missions])

  const attributeData = Object.entries(character.attributes).map(([key, value]) => ({
    attribute: ATTRIBUTE_LABELS[key] ?? key,
    value,
  }))

  const last30DaysTotal = dailyXp.reduce((sum, d) => sum + d.xp, 0)
  const activeDays = dailyXp.filter((d) => d.xp > 0).length

  return (
    <GameLayout title="Estatísticas">
      <div className="max-w-5xl mx-auto fade-in-up space-y-6">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300 bg-clip-text text-transparent mb-1">
            Estatísticas
          </h1>
          <p className="text-gray-500 text-sm">Sua evolução, em números</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="XP (30 dias)" value={formatNumber(last30DaysTotal)} icon="📈" color="text-cyan-400" />
          <StatCard label="Dias ativos (30d)" value={`${activeDays}/30`} icon="🗓️" color="text-green-400" />
          <StatCard label="XP semanal" value={formatNumber(stats.weeklyXp)} icon="⚡" color="text-blue-400" />
          <StatCard label="XP mensal" value={formatNumber(stats.monthlyXp)} icon="🌙" color="text-purple-400" />
        </div>

        {/* XP over time */}
        <div className="card">
          <div className="section-title text-base">📈 XP nos últimos 30 dias</div>
          {last30DaysTotal === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              Complete missões para começar a ver sua evolução aqui.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyXp} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                <XAxis dataKey="label" stroke="#4b5563" fontSize={10} interval={4} />
                <YAxis stroke="#4b5563" fontSize={10} width={36} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={{ color: '#94a3b8' }} />
                <Area type="monotone" dataKey="xp" stroke="#22d3ee" strokeWidth={2} fill="url(#xpGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Attributes radar */}
          <div className="card">
            <div className="section-title text-base">💪 Atributos</div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={attributeData}>
                <PolarGrid stroke="#1a1a2e" />
                <PolarAngleAxis dataKey="attribute" stroke="#94a3b8" fontSize={11} />
                <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown */}
          <div className="card">
            <div className="section-title text-base">🎯 Missões completas por categoria</div>
            {categoryBreakdown.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">Nenhuma missão completada ainda.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                  <XAxis dataKey="category" stroke="#4b5563" fontSize={10} />
                  <YAxis stroke="#4b5563" fontSize={10} width={28} allowDecimals={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Lifetime totals */}
        <div className="card">
          <div className="section-title text-base">🏆 Totais Acumulados</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard label="Missões" value={stats.totalMissionsCompleted} icon="✅" color="text-green-400" />
            <StatCard label="Min. exercício" value={stats.totalExerciseMinutes} icon="💪" color="text-red-400" />
            <StatCard label="Min. estudo" value={stats.totalStudyMinutes} icon="📚" color="text-blue-400" />
            <StatCard label="Hábitos" value={stats.totalHabitsCompleted} icon="🌱" color="text-lime-400" />
            <StatCard label="Dungeons" value={stats.dungeonsCleared} icon="🏰" color="text-purple-400" />
            <StatCard label="Bosses" value={stats.bossesDefeated} icon="👹" color="text-orange-400" />
          </div>
        </div>
      </div>
    </GameLayout>
  )
}
