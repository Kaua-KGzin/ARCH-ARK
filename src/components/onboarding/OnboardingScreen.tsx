'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import { CharacterClass } from '@/types/game'
import { cn } from '@/lib/utils'

const CLASSES: {
  id: CharacterClass
  icon: string
  label: string
  description: string
  focus: string
  color: string
  glow: string
}[] = [
  { id: 'Guerreiro', icon: '⚔️', label: 'Guerreiro', description: 'Mestre do combate físico', focus: 'Exercícios físicos', color: 'border-red-500/50 bg-red-900/10 hover:border-red-400', glow: 'glow-red' },
  { id: 'Mago', icon: '🔮', label: 'Mago', description: 'Detentor do conhecimento supremo', focus: 'Estudos e aprendizado', color: 'border-blue-500/50 bg-blue-900/10 hover:border-blue-400', glow: 'glow-blue' },
  { id: 'Assassino', icon: '🗡️', label: 'Assassino', description: 'Velocidade e produtividade acima de tudo', focus: 'Produtividade e hábitos', color: 'border-purple-500/50 bg-purple-900/10 hover:border-purple-400', glow: 'glow-purple' },
  { id: 'Monarca', icon: '👑', label: 'Monarca', description: 'O equilíbrio perfeito entre todos os atributos', focus: 'Estilo híbrido e raro', color: 'border-yellow-500/50 bg-yellow-900/10 hover:border-yellow-400', glow: 'glow-gold' },
  { id: 'Arqueiro', icon: '🏹', label: 'Arqueiro', description: 'Precisão e foco inabaláveis', focus: 'Foco e consistência', color: 'border-green-500/50 bg-green-900/10 hover:border-green-400', glow: '' },
  { id: 'Curandeiro', icon: '✨', label: 'Curandeiro', description: 'Saúde e bem-estar em primeiro lugar', focus: 'Hábitos saudáveis', color: 'border-pink-500/50 bg-pink-900/10 hover:border-pink-400', glow: '' },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const { setupCharacter } = useGameStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null)

  const handleStart = () => {
    if (!name.trim() || !selectedClass) return
    setupCharacter(name.trim(), selectedClass)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#050508] bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-2xl">
        {/* Intro step */}
        {step === 0 && (
          <div className="text-center fade-in-up">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-5xl mb-6 animate-float glow-blue">
                ⚔
              </div>
              <h1 className="text-5xl font-black text-white mb-3 tracking-tight">ARCH ARK</h1>
              <p className="text-cyan-400 font-mono text-sm mb-2 tracking-widest">SISTEMA DE EVOLUÇÃO ATIVO</p>
              <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                O sistema de Solo Leveling para a vida real. Transforme cada treino, hora estudada e hábito em poder.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              {[
                { icon: '⚡', label: 'Ganhe XP', desc: 'Em cada ação' },
                { icon: '🏆', label: 'Evolua', desc: 'Suba de nível' },
                { icon: '🎒', label: 'Colete', desc: 'Itens e títulos' },
              ].map(f => (
                <div key={f.label} className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl p-4">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-white font-bold text-sm">{f.label}</div>
                  <div className="text-gray-500 text-xs">{f.desc}</div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(1)} className="btn-primary text-lg px-12 py-3">
              Iniciar Jornada ⚡
            </button>
            <p className="text-gray-600 text-xs mt-4">Porque evoluir na vida real fica melhor com barras de XP.</p>
          </div>
        )}

        {/* Name step */}
        {step === 1 && (
          <div className="fade-in-up">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-3xl font-bold text-white mb-2">Identificação do Caçador</h2>
              <p className="text-gray-400">Como o Sistema irá te chamar?</p>
            </div>

            <div className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl p-6 mb-6">
              <label className="text-gray-400 text-sm mb-2 block font-mono">NOME DO CAÇADOR</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
                placeholder="Digite seu nome..."
                maxLength={20}
                className="w-full bg-[#050508] border border-[#1a1a2e] focus:border-blue-500/50 rounded-lg px-4 py-3 text-white text-lg outline-none transition-colors placeholder:text-gray-600 font-mono"
                autoFocus
              />
              <p className="text-gray-600 text-xs mt-2">{name.length}/20 caracteres</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">← Voltar</button>
              <button
                onClick={() => name.trim() && setStep(2)}
                disabled={!name.trim()}
                className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Class selection */}
        {step === 2 && (
          <div className="fade-in-up">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Escolha sua Classe</h2>
              <p className="text-gray-400">Sua classe define seus atributos iniciais e especialização</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {CLASSES.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={cn(
                    'rounded-xl border-2 p-4 text-left transition-all duration-200 relative',
                    cls.color,
                    selectedClass === cls.id && 'ring-2 ring-cyan-400/50 scale-[1.02]'
                  )}
                >
                  {selectedClass === cls.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                      <span className="text-black text-xs">✓</span>
                    </div>
                  )}
                  <div className="text-3xl mb-2">{cls.icon}</div>
                  <div className="text-white font-bold text-sm">{cls.label}</div>
                  <div className="text-gray-400 text-xs mt-1">{cls.description}</div>
                  <div className="text-cyan-400 text-xs mt-1 font-mono">▸ {cls.focus}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Voltar</button>
              <button
                onClick={handleStart}
                disabled={!selectedClass}
                className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selectedClass ? `Começar como ${selectedClass} ⚡` : 'Selecione uma classe'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
