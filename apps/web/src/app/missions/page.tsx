'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import MissionCard from '@/components/missions/MissionCard'
import { cn, generateId } from '@/lib/utils'
import { MissionType, MissionCategory, MissionDifficulty } from '@/types/game'

const TITLE_MAX_LENGTH = 60
const DESCRIPTION_MAX_LENGTH = 150
const TARGET_MAX = 999_999

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
  { id: 'task', label: 'Tarefa', icon: '✅' },
]

const CATEGORY_OPTIONS: { value: MissionCategory; label: string; icon: string }[] = [
  { value: 'exercise', label: 'Exercício', icon: '🏋️' },
  { value: 'study', label: 'Estudo', icon: '📚' },
  { value: 'habit', label: 'Hábito', icon: '⭐' },
  { value: 'task', label: 'Tarefa', icon: '✅' },
  { value: 'nutrition', label: 'Nutrição', icon: '🥗' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
]

const DIFFICULTIES: MissionDifficulty[] = ['E', 'D', 'C', 'B', 'A', 'S']
const DIFFICULTY_COLORS: Record<string, string> = {
  E: 'text-gray-400', D: 'text-green-400', C: 'text-blue-400',
  B: 'text-purple-400', A: 'text-orange-400', S: 'text-yellow-400',
}
const XP_MAP: Record<MissionDifficulty, number> = { E: 30, D: 60, C: 120, B: 200, A: 350, S: 500 }
const GOLD_MAP: Record<MissionDifficulty, number> = { E: 10, D: 20, C: 40, B: 70, A: 120, S: 200 }

function CreateMissionModal({ onClose }: { onClose: () => void }) {
  const { addCustomMissions } = useGameStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<MissionCategory>('task')
  const [type, setType] = useState<MissionType>('daily')
  const [difficulty, setDifficulty] = useState<MissionDifficulty>('D')
  const [target, setTarget] = useState('1')
  const [unit, setUnit] = useState('vez')

  const catIcon = CATEGORY_OPTIONS.find(c => c.value === category)?.icon ?? '✅'

  function handleCreate() {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error('Dê um título para a missão.')
      return
    }
    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      toast.error(`Título muito longo (máx. ${TITLE_MAX_LENGTH} caracteres).`)
      return
    }
    if (description.trim().length > DESCRIPTION_MAX_LENGTH) {
      toast.error(`Descrição muito longa (máx. ${DESCRIPTION_MAX_LENGTH} caracteres).`)
      return
    }
    const clampedTarget = Math.min(TARGET_MAX, Math.max(1, parseInt(target, 10) || 1))
    addCustomMissions([{
      id: generateId(),
      title: trimmedTitle,
      description: description.trim() || 'Missão personalizada',
      category,
      type,
      icon: catIcon,
      xpReward: XP_MAP[difficulty],
      goldReward: GOLD_MAP[difficulty],
      target: clampedTarget,
      unit: unit.trim() || 'vez',
      difficulty,
      status: 'active',
      progress: 0,
    }])
    toast.success('Missão criada!')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0d0d1a] border border-[#1a1a2e] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-xl">⚔️ Nova Missão</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1.5">Título *</label>
            <input
              className="w-full bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/60"
              placeholder="Nome da missão"
              value={title}
              maxLength={TITLE_MAX_LENGTH}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1.5">Descrição</label>
            <input
              className="w-full bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/60"
              placeholder="Detalhes opcionais"
              value={description}
              maxLength={DESCRIPTION_MAX_LENGTH}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1.5">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
                    category === cat.value
                      ? 'bg-blue-900/50 border-blue-500/60 text-blue-300'
                      : 'bg-[#080812] border-[#1a1a2e] text-gray-500 hover:text-gray-300'
                  )}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1.5">Tipo</label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as MissionType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-bold border transition-all',
                    type === t
                      ? 'bg-cyan-900/50 border-cyan-500/60 text-cyan-300'
                      : 'bg-[#080812] border-[#1a1a2e] text-gray-500 hover:text-gray-300'
                  )}
                >
                  {t === 'daily' ? 'Diária' : t === 'weekly' ? 'Semanal' : 'Mensal'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1.5">Dificuldade</label>
            <div className="flex gap-1.5">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-black border transition-all',
                    difficulty === d
                      ? `bg-[#1a1a2e] border-blue-500/60 ${DIFFICULTY_COLORS[d]}`
                      : 'bg-[#080812] border-[#1a1a2e] text-gray-600 hover:text-gray-400'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1.5">Meta</label>
              <input
                type="number"
                min="1"
                max={TARGET_MAX}
                className="w-full bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/60"
                value={target}
                onChange={e => setTarget(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1.5">Unidade</label>
              <input
                className="w-full bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-blue-500/60"
                placeholder="vez, min, km..."
                value={unit}
                onChange={e => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-3 text-sm">
            <span className="text-gray-400">Recompensa:</span>
            <span className="text-blue-400 font-bold">+{XP_MAP[difficulty]} XP</span>
            <span className="text-yellow-400 font-bold">+{GOLD_MAP[difficulty]} ouro</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#1a1a2e] text-gray-400 hover:text-white text-sm font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={!title.trim()}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-bold transition-all',
                title.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-[#1a1a2e] text-gray-600 cursor-not-allowed'
              )}
            >
              ⚔️ Criar Missão
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MissionsPage() {
  const { missions, deleteCustomMission } = useGameStore()
  const [activeTab, setActiveTab] = useState<MissionType | 'all'>('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

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

        {/* Custom Mission CTA */}
        <div className="card border-dashed border-blue-500/20 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold text-sm">✨ Missões Personalizadas</div>
            <div className="text-gray-500 text-xs">Crie manualmente ou peça ao ARK para criar sob medida</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="btn-secondary text-sm hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all"
            >
              + Nova Missão
            </button>
            <Link
              href="/ark"
              className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition-all"
            >
              ✨ Criar no Ark
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
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
              <div className="text-gray-600 text-sm mt-1">Ajuste os filtros ou crie uma missão personalizada</div>
            </div>
          ) : (
            filtered.map(m => (
              <div key={m.id} className="relative group">
                <MissionCard mission={m} />
                {m.id.startsWith('custom-') && (
                  <button
                    onClick={() => deleteCustomMission(m.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-red-500/70 hover:text-red-400 text-xs transition-all"
                    title="Excluir missão personalizada"
                  >
                    🗑 excluir
                  </button>
                )}
              </div>
            ))
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

      {showCreate && <CreateMissionModal onClose={() => setShowCreate(false)} />}
    </GameLayout>
  )
}
