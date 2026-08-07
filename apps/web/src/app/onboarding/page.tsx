'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { auth, signOut } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useGameStore } from '@/store/useGameStore'
import type { CharacterClass } from '@arch-ark/shared'

const CHARACTER_CLASSES: { name: CharacterClass; icon: string; desc: string }[] = [
  { name: 'Guerreiro', icon: '⚔️', desc: 'Força bruta e resistência' },
  { name: 'Mago', icon: '🔮', desc: 'Magia e inteligência' },
  { name: 'Assassino', icon: '🗡️', desc: 'Agilidade e sigilo' },
  { name: 'Monarca', icon: '👑', desc: 'Equilibrio total' },
  { name: 'Arqueiro', icon: '🏹', desc: 'Precisão e foco' },
  { name: 'Curandeiro', icon: '✨', desc: 'Magia curativa' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { character, setupCharacter, isOnboarded } = useGameStore()
  const [step, setStep] = useState(1)
  const [characterName, setCharacterName] = useState('')
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verifica autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth')
      } else if (isOnboarded) {
        router.push('/dashboard')
      } else {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router, isOnboarded])

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!characterName.trim() || !selectedClass) {
      toast.error('Preencha todos os campos!')
      return
    }

    setIsSubmitting(true)
    try {
      setupCharacter(characterName, selectedClass)
      toast.success('Personagem criado com sucesso! 🎉')
      router.push('/dashboard')
    } catch (err) {
      toast.error('Erro ao criar personagem')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Desconectado')
      router.push('/auth')
    } catch (err) {
      toast.error('Erro ao desconectar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 20 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-cyan-400 bg-cyan-950/60 text-3xl mb-4"
            >
              ⚔️
            </motion.div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300 bg-clip-text text-transparent mb-2">
              Bem-vindo ao ARCH-ARK
            </h1>
            <p className="text-slate-400">Crie seu personagem e comece sua jornada</p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map((s) => (
              <motion.div
                key={s}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Content Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl mb-6"
          >
            {step === 1 ? (
              // Step 1: Class Selection
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Escolha sua Classe</h2>
                <p className="text-slate-400 mb-6">Cada classe tem atributos únicos e afetar seu playstyle</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {CHARACTER_CLASSES.map((cls) => (
                    <motion.button
                      key={cls.name}
                      onClick={() => setSelectedClass(cls.name)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedClass === cls.name
                          ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/50'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-4xl mb-2">{cls.icon}</div>
                      <div className="text-sm font-bold text-white">{cls.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{cls.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              // Step 2: Name & Confirm
              <form onSubmit={handleCreateCharacter} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Qual será seu nome?</h2>
                  <p className="text-slate-400 mb-4">Escolha um nome para seu personagem</p>

                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Ex: Sang Jinwoo, Lena, Arthas..."
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition text-lg font-bold"
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>

                {/* Preview */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-4">Prévia do Personagem</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Nome:</span>
                      <span className="text-xl font-bold text-cyan-400">
                        {characterName || 'Caçador'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Classe:</span>
                      <span className="text-xl font-bold text-purple-400">
                        {CHARACTER_CLASSES.find((c) => c.name === selectedClass)?.icon}{' '}
                        {selectedClass || 'Nenhuma'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Nível:</span>
                      <span className="text-xl font-bold text-amber-400">1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Rank:</span>
                      <span className="text-xl font-bold text-green-400">E</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase border border-slate-700 bg-slate-800/80 hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    ← Voltar
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !characterName.trim() || !selectedClass}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '⚡ Criando...' : '👑 Despertar Caçador'}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Step Navigation */}
          {step === 1 && (
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase border border-slate-700 bg-slate-800/80 hover:bg-slate-800 transition-all text-slate-300"
              >
                Sair
              </button>
              <motion.button
                onClick={() => {
                  if (selectedClass) setStep(2)
                  else toast.error('Selecione uma classe!')
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedClass}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo →
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
