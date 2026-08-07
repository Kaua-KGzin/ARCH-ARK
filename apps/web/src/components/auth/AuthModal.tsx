'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from '@/lib/firebase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (user: User) => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const getFirebaseErrorMessage = (code: string): string => {
    const errorMap: Record<string, string> = {
      'auth/email-already-in-use': 'Este e-mail já está registrado.',
      'auth/invalid-email': 'E-mail inválido.',
      'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).',
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
      'auth/popup-closed-by-user': 'Autenticação do Google foi cancelada.',
    }
    return errorMap[code] || 'Erro ao autenticar. Tente novamente.'
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Por favor, insira um e-mail válido.')
      return
    }
    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await signInWithEmailAndPassword(auth, email, password)
        toast.success(`Bem-vindo de volta, ${res.user.email?.split('@')[0]}!`, { duration: 3000 })
        if (onSuccess) onSuccess(res.user)
        setEmail('')
        setPassword('')
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        toast.success('🎉 Conta criada com sucesso no Sistema Monarca!', { duration: 3000 })
        if (onSuccess) onSuccess(res.user)
        setEmail('')
        setPassword('')
      }
      onClose()
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code)
      setErrorMessage(message)
      console.error('[Auth Error]', err.code, err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMessage('')
    setLoading(true)
    try {
      const res = await signInWithPopup(auth, googleProvider)
      toast.success(`🔐 Autenticado: ${res.user.displayName || res.user.email}`, { duration: 3000 })
      if (onSuccess) onSuccess(res.user)
      onClose()
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        const message = getFirebaseErrorMessage(err.code)
        setErrorMessage(message)
      }
      console.error('[Google Auth Error]', err.code, err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-6 text-white shadow-[0_0_50px_rgba(0,240,255,0.2)] backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                SISTEMA ARCH-ARK · AUTH
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                {mode === 'login' ? 'Acessar o Sistema' : 'Despertar Conta'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {/* Error Display */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
            >
              ⚠️ {errorMessage}
            </motion.div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="my-4 flex rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            <button
              onClick={() => {
                setMode('login')
                setErrorMessage('')
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => {
                setMode('register')
                setErrorMessage('')
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CADASTRAR
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@dominio.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || !email || password.length < 6}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`btn-primary w-full tracking-wider uppercase text-xs py-3 mt-2 transition-all ${
                loading || !email || password.length < 6
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-slate-400 border-t-cyan-400 animate-spin" />
                  Autenticando...
                </span>
              ) : mode === 'login' ? (
                '⚡ Entrar no Sistema'
              ) : (
                '👑 Despertar Caçador'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute bg-slate-950 px-3 text-[10px] uppercase font-bold text-slate-500">
              ou continue com
            </span>
          </div>

          {/* Google Login */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`flex w-full items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 text-xs font-bold text-white hover:border-slate-700 hover:bg-slate-900 transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            Google Sign-In
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
