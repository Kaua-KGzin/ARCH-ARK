'use client'

import { useState } from 'react'
import Link from 'next/link'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import MissionCard from '@/components/missions/MissionCard'
import { cn } from '@/lib/utils'
import { MissionType } from '@/types/game'

const TABS: { id: MissionType | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Todas', icon: '📋' },
  { id: 'daily', label: 'Diárias', icon: '☀️' },
  { id: 'weekly', label: 'Semanais', icon: '📅' },
  { id: 'monthly', label: 'Mensais', icon: '🗓️' },
  { id: 'custom', label: 'Customizadas', icon: '✨' },
]

const CATEGORIES = [
  { id: 'all', label: 'Todas', icon: '⭐' },
  { id: 'exercise', label: 'Exercício', icon: '💪' },
  { id: 'study', label: 'Estudo', icon: '📚' },
  { id: 'habit', label: 'Hábito', icon: '🌱' },
]

export default function MissionsPage() {
  const { missions } = useGameStore()
  const [activeTab, setActiveTab] = useState<MissionType | 'all'>('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showCompleted, setShowCompleted] = useState(false)

  const filtered = missions.filter(m => {
    if (m.type === 'dungeon' || m.type === 'boss') return false
    if (activeTab !== 'all' && m.type !== activeTab) return false
    if (activeCategory !== 'all' && m.category !== activeCategory) return false
    if (!showCompleted && m.status === 'completed') return false
    return true
  })

  const completed = missions.filter(m => m.status === 'completed' && m.type !== 'dungeon' && m.type !== 'boss')
  const active = missions.filter(m => m.status === 'active' && m.type !== 'dungeon' && m.type !== 'boss')
  const totalXpAvailable = active.reduce((s, m) => s + m.xpReward, 0)

  return (
    <GameLayout title="Missões">
      <div className="max-w-4xl mx-auto fade-in-up space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-black text-green-400">{completed.length}</div>
            <div className="text-gray-500 text-xs">Completadas</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-black text-blue-400">{active.length}</div>
            <div className="text-gray-500 text-xs">Ativas</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-black text-cyan-400">{totalXpAvailable.toLocaleString()}</div>
            <div className="text-gray-500 text-xs">XP Disponível</div>
          </div>
        </div>

        {/* Custom Mission */}
        <div className="card border-dashed border-purple-500/30 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold text-sm">✨ Missões Personalizadas</div>
            <div className="text-gray-500 text-xs">Peça ao ARK para criar missões sob medida com Gemini</div>
          </div>
          <Link
            href="/ark"
            className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition-all"
          >
            Criar no Ark
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          {/* Type tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/40'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-[#1a1a2e]'
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={cn(
                'ml-auto px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                showCompleted
                  ? 'border-green-500/40 text-green-400 bg-green-900/10'
                  : 'border-[#1a1a2e] text-gray-500 hover:text-gray-300'
              )}
            >
              {showCompleted ? '✓ Com Completadas' : 'Sem Completadas'}
            </button>
          </div>

          {/* Category filter */}
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                  activeCategory === cat.id
                    ? 'border-purple-500/40 text-purple-400 bg-purple-900/10'
                    : 'border-[#1a1a2e] text-gray-600 hover:text-gray-400'
                )}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mission List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <div className="text-gray-400 font-semibold">Nenhuma missão encontrada</div>
              <div className="text-gray-600 text-sm mt-1">Ajuste os filtros ou aguarde o reset diário</div>
            </div>
          ) : (
            filtered.map(m => <MissionCard key={m.id} mission={m} />)
          )}
        </div>

        {/* XP Info */}
        <div className="card bg-blue-900/10 border-blue-500/20">
          <div className="text-xs text-gray-400 mb-2 font-mono">TABELA DE RECOMPENSAS</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Academia', xp: 100 }, { label: 'Corrida', xp: 80 },
              { label: 'Estudo 1h', xp: 100 }, { label: 'Estudo 2h', xp: 220 },
              { label: 'Meditação', xp: 40 }, { label: 'Hidratação', xp: 30 },
              { label: 'Leitura', xp: 40 }, { label: 'Sono cedo', xp: 35 },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-gray-500">
                <span>{r.label}</span>
                <span className="text-cyan-400">+{r.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameLayout>
  )
}
