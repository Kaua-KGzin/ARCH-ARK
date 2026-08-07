'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { auth, signOut } from '@/lib/firebase'
import { onAuthStateChanged, updateEmail, updatePassword, User, sendPasswordResetEmail } from 'firebase/auth'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'

export default function ProfilePage() {
  const router = useRouter()
  const { character } = useGameStore()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState<'info' | 'security' | 'preferences'>('info')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Auth states
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/auth')
      } else {
        setUser(u)
        setNewEmail(u.email || '')
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleUpdateEmail = async () => {
    if (!user || !newEmail.includes('@')) {
      toast.error('E-mail inválido!')
      return
    }

    setIsSaving(true)
    try {
      await updateEmail(user, newEmail)
      toast.success('E-mail atualizado com sucesso!')
      setIsEditing(false)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar e-mail')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres!')
      return
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('As senhas não correspondem!')
      return
    }

    setIsSaving(true)
    try {
      await updatePassword(user!, newPassword)
      toast.success('Senha atualizada com sucesso!')
      setNewPassword('')
      setConfirmNewPassword('')
      setIsEditing(false)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar senha')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    setIsSaving(true)
    try {
      await sendPasswordResetEmail(auth, user.email)
      toast.success('E-mail de recuperação enviado!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar e-mail de recuperação')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Desconectado com sucesso!')
      router.push('/auth')
    } catch (err) {
      toast.error('Erro ao desconectar')
    }
  }

  if (loading) {
    return (
      <GameLayout title="Perfil">
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full"
          />
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout title="Meu Perfil">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300 bg-clip-text text-transparent mb-2">
            Meu Perfil
          </h1>
          <p className="text-slate-400">Gerencie sua conta e preferências</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Character Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{character.avatar}</div>
              <h2 className="text-2xl font-black text-white">{character.name}</h2>
              <p className="text-sm text-slate-400">{character.class}</p>
            </div>

            <div className="space-y-2 text-sm border-t border-slate-800 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Nível:</span>
                <span className="text-cyan-400 font-bold">{character.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rank:</span>
                <span className="text-amber-400 font-bold">{character.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">XP Total:</span>
                <span className="text-green-400 font-bold">{character.totalXp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ouro:</span>
                <span className="text-yellow-400 font-bold">{character.gold}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sequência:</span>
                <span className="text-purple-400 font-bold">{character.streak}</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg">
              {(['info', 'security', 'preferences'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs uppercase transition-all ${
                    currentTab === tab
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'info' && '👤 Informações'}
                  {tab === 'security' && '🔐 Segurança'}
                  {tab === 'preferences' && '⚙️ Preferências'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-4"
            >
              {currentTab === 'info' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                      E-mail
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        disabled={!isEditing || isSaving}
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:border-cyan-500 outline-none disabled:opacity-50"
                      />
                      {isEditing && (
                        <motion.button
                          onClick={handleUpdateEmail}
                          disabled={isSaving}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-400 font-bold text-sm hover:bg-cyan-500/30 disabled:opacity-50"
                        >
                          {isSaving ? 'Salvando...' : 'Salvar'}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                      Usuário criado em
                    </label>
                    <p className="text-white">
                      {character.createdAt
                        ? new Date(character.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full py-2 px-4 rounded-lg bg-purple-500/20 border border-purple-500 text-purple-400 font-bold text-sm hover:bg-purple-500/30 transition-all"
                  >
                    {isEditing ? 'Cancelar' : '✏️ Editar E-mail'}
                  </button>
                </div>
              )}

              {currentTab === 'security' && (
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={isSaving}
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:border-cyan-500 outline-none disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                          Confirmar Senha
                        </label>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={isSaving}
                          className="w-full px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:border-cyan-500 outline-none disabled:opacity-50"
                        />
                      </div>
                      <button
                        onClick={handleUpdatePassword}
                        disabled={isSaving || newPassword.length < 6}
                        className="w-full py-2 px-4 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-400 font-bold text-sm hover:bg-cyan-500/30 disabled:opacity-50 transition-all"
                      >
                        {isSaving ? 'Salvando...' : 'Atualizar Senha'}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-400 text-sm">
                        Para sua segurança, altere sua senha periodicamente.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex-1 py-2 px-4 rounded-lg bg-purple-500/20 border border-purple-500 text-purple-400 font-bold text-sm hover:bg-purple-500/30 transition-all"
                        >
                          🔐 Alterar Senha
                        </button>
                        <button
                          onClick={handlePasswordReset}
                          disabled={isSaving}
                          className="flex-1 py-2 px-4 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 font-bold text-sm hover:text-white transition-all disabled:opacity-50"
                        >
                          📧 Reset
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {currentTab === 'preferences' && (
                <div className="space-y-4">
                  <div className="text-slate-400 text-sm">
                    As preferências de som, tema e layout estão disponíveis no menu de configurações dentro do jogo.
                  </div>
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Área de Perigo</p>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 px-4 rounded-lg bg-red-500/20 border border-red-500 text-red-400 font-bold text-sm hover:bg-red-500/30 transition-all"
                    >
                      🚪 Sair
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </GameLayout>
  )
}
