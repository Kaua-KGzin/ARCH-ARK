'use client'

import { motion } from 'framer-motion'
import { toast } from 'sonner'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { Skill, MAX_EQUIPPED_SKILLS } from '@arch-ark/shared'

export default function SkillsPage() {
  const { skills, character, toggleSkillEquip } = useGameStore()
  const equippedCount = skills.filter(s => s.isEquipped).length

  const handleToggle = (skill: Skill) => {
    if (!skill.isEquipped && equippedCount >= MAX_EQUIPPED_SKILLS) {
      toast.error(`Você só pode equipar até ${MAX_EQUIPPED_SKILLS} habilidades. Desequipe uma antes.`)
      return
    }
    toggleSkillEquip(skill.id)
  }

  const categories = [
    { key: 'strength', name: 'Força & Combate', icon: '⚔️' },
    { key: 'intelligence', name: 'Inteligência & Mente', icon: '🧠' },
    { key: 'discipline', name: 'Disciplina & Hábitos', icon: '🛡️' },
    { key: 'shadow', name: 'Sombras & Monarca', icon: '👑' },
  ]

  return (
    <GameLayout title="Árvore de Habilidades do Sistema">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
                SISTEMA MONARCA · HABILIDADES
              </span>
              <h1 className="text-3xl font-black text-white mt-1">
                ÁRVORE DE HABILIDADES
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Desbloqueie e equipe habilidades passivas e ativas à medida que evolui o seu Nível e Atributos no mundo real.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div>
                <span className="text-xs text-slate-400">Nível Atual</span>
                <p className="text-xl font-bold text-cyan-400">Nv. {character.level}</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-xs text-slate-400">Habilidades Ativas</span>
                <p className="text-xl font-bold text-purple-400">
                  {equippedCount} / {MAX_EQUIPPED_SKILLS}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const categorySkills = skills.filter((s) => s.category === cat.key)
            return (
              <div
                key={cat.key}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="text-lg font-bold text-white">{cat.name}</h2>
                </div>

                <div className="space-y-3">
                  {categorySkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      characterLevel={character.level}
                      onToggle={() => handleToggle(skill)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </GameLayout>
  )
}

function SkillCard({
  skill,
  characterLevel,
  onToggle,
}: {
  skill: Skill
  characterLevel: number
  onToggle: () => void
}) {
  const isLocked = characterLevel < skill.requiredLevel

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.01, translateY: -2 } : {}}
      className={`relative flex items-center justify-between rounded-xl border p-4 transition-all ${
        skill.isEquipped
          ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
          : isLocked
          ? 'border-slate-800/60 bg-slate-950/40 opacity-60'
          : 'border-slate-800 bg-slate-900/40 hover:border-cyan-500/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl border ${
            skill.isEquipped
              ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
              : 'border-slate-800 bg-slate-900 text-slate-300'
          }`}
        >
          {skill.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-sm">{skill.name}</h3>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                skill.type === 'active'
                  ? 'bg-purple-950 text-purple-400 border border-purple-800'
                  : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
              }`}
            >
              {skill.type}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{skill.description}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Requisito: Nível {skill.requiredLevel}
          </span>
        </div>
      </div>

      <button
        disabled={isLocked}
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          isLocked
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
            : skill.isEquipped
            ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
            : 'border border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/50'
        }`}
      >
        {isLocked ? 'BLOQUEADA' : skill.isEquipped ? 'EQUIPADA' : 'EQUIPAR'}
      </button>
    </motion.div>
  )
}
