'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signInWithEmail, registerWithEmail, signInWithGoogle } from '@/lib/auth-actions'

type AuthMode = 'login' | 'register'
type ViewMode = 'landing' | 'form'

export default function AuthPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [view, setView] = useState<ViewMode>('landing')
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full mx-auto animate-spin" />
          <p className="mt-4 text-slate-400 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.includes('@') || !email.includes('.')) {
      setError('E-mail inválido.')
      return
    }
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('As senhas não correspondem.')
      return
    }

    setIsLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password)
      } else {
        await registerWithEmail(email, password)
      }
      router.push('/onboarding')
    } catch (err: any) {
      // Error already shown via toast in auth-actions
      console.error('[Auth Error]', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsLoading(true)
    try {
      await signInWithGoogle()
      router.push('/onboarding')
    } catch (err: any) {
      console.error('[Google Auth Error]', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            // Landing View
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-2xl text-center"
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 20 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-cyan-400 bg-cyan-950/60 text-5xl mb-6"
                >
                  👑
                </motion.div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300 bg-clip-text text-transparent mb-3">
                  ARCH-ARK
                </h1>
                <p className="text-cyan-400 font-mono text-sm mb-2 tracking-widest">SISTEMA DE EVOLUÇÃO ATIVO</p>
                <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                  O sistema de Solo Leveling para a vida real. Transforme cada treino, hora estudada e hábito em poder.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: '⚡', label: 'Ganhe XP', desc: 'Em cada ação' },
                  { icon: '🏆', label: 'Evolua', desc: 'Suba de nível' },
                  { icon: '🎒', label: 'Colete', desc: 'Itens e títulos' },
                ].map(f => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-xl hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="text-3xl mb-2">{f.icon}</div>
                    <div className="text-white font-bold text-sm">{f.label}</div>
                    <div className="text-slate-500 text-xs mt-1">{f.desc}</div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => setView('form')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-3 rounded-xl font-bold uppercase text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg transition-all"
              >
                ⚡ Iniciar Jornada
              </motion.button>
              <p className="text-slate-600 text-xs mt-6">Porque evoluir na vida real fica melhor com barras de XP.</p>
            </motion.div>
          ) : (
            // Auth Form View
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-md"
            >
              {/* Logo & Back Button */}
              <div className="text-center mb-8 relative">
                <motion.button
                  onClick={() => { setView('landing'); setError(''); setEmail(''); setPassword(''); setConfirmPassword(''); }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-0 top-0 text-2xl hover:scale-125 transition-transform"
                >
                  ←
                </motion.button>
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 20 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-cyan-400 bg-cyan-950/60 text-3xl"
                >
                  👑
                </motion.div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300 bg-clip-text text-transparent mt-3">
                  ARCH-ARK
                </h1>
                <p className="text-slate-400 text-xs mt-1">Sistema de Evolução Pessoal</p>
              </div>

              {/* Auth Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
              >
                {/* Mode Switcher */}
                <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg">
                  {(['login', 'register'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError(''); }}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs uppercase transition-all ${
                        mode === m
                          ? 'bg-cyan-500 text-slate-950 shadow-lg'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m === 'login' ? '🔐 Entrar' : '✨ Criar Conta'}
                    </button>
                  ))}
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-sm"
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-2">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@dominio.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Senha</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                      disabled={isLoading}
                    />
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Confirmar Senha</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading || !email || password.length < 6}
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    className={`w-full py-3 px-4 rounded-xl font-bold uppercase text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg transition-all ${
                      isLoading || !email || password.length < 6 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                          ⚡
                        </motion.span>
                        {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
                      </span>
                    ) : mode === 'login' ? (
                      '🔐 Entrar no Sistema'
                    ) : (
                      '👑 Despertar Caçador'
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900/80 text-slate-400">ou continue com</span>
                  </div>
                </div>

                {/* Google Login */}
                <motion.button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 border border-slate-700 bg-slate-800/80 hover:bg-slate-800 transition-all ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                  </svg>
                  Google
                </motion.button>
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-xs text-slate-500 mt-6"
              >
                Ao continuar, você concorda com nossos{' '}
                <a href="#" className="text-cyan-400 hover:underline">
                  Termos de Serviço
                </a>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
