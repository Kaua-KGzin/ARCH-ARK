'use client'

import { ReactNode, useEffect, useState, createContext } from 'react'
import { User } from 'firebase/auth'
import { Toaster } from 'react-hot-toast'
import {
  initFirebase,
  isFirebaseConfigured,
  onAuthStateChanged,
  getFirebaseAuth,
} from '@/lib/firebase'

export interface AuthContextType {
  user: User | null
  loading: boolean
  isConfigured: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize Firebase once on mount
    if (!isInitialized) {
      console.log('[Auth] Initializing...')
      const success = initFirebase()
      setIsInitialized(true)

      if (!success || !isFirebaseConfigured) {
        console.error('[Auth] Firebase not configured')
        setLoading(false)
        return
      }

      // Set up the one-and-only auth listener for the whole app
      const auth = getFirebaseAuth()
      console.log('[Auth] Auth instance:', auth ? '✅ obtained' : '❌ null')
      if (!auth) {
        console.error('[Auth] Failed to get Auth instance')
        setLoading(false)
        return
      }

      console.log('[Auth] Setting up listener...')
      let timeoutId: NodeJS.Timeout | null = null
      let unsubscribe: (() => void) | null = null

      try {
        unsubscribe = onAuthStateChanged(
          auth,
          (currentUser) => {
            try {
              console.log('[Auth] Listener fired:', currentUser?.email || 'logged out')

              if (timeoutId) {
                clearTimeout(timeoutId)
                timeoutId = null
              }

              console.log('[Auth] About to call setUser')
              setUser(currentUser)
              console.log('[Auth] setUser called, about to call setLoading')
              setLoading(false)
              console.log('[Auth] setLoading called, listener done')
            } catch (err) {
              console.error('[Auth] ERROR in listener:', err)
            }
          },
          (error) => {
            console.error('[Auth] Listener error:', error)
            setLoading(false)
          }
        )

        console.log('[Auth] ✅ Listener registered')
        console.log('[Auth] Direct currentUser check:', auth.currentUser?.email || 'null (no active session)')
      } catch (err) {
        console.error('[Auth] Failed to register listener:', err)
        setLoading(false)
      }

      // Cleanup function - properly outside of if block
      return () => {
        console.log('[Auth] Cleaning up listener')
        if (timeoutId) clearTimeout(timeoutId)
        if (unsubscribe) unsubscribe()
      }
    }
  }, [])

  // Debug: log render state
  console.log('[Auth] RENDER: loading=', loading, 'user=', user?.email, 'isConfigured=', isFirebaseConfigured)

  // Show error screen if Firebase isn't configured
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-black text-white mb-2">Firebase não configurado</h1>
          <p className="text-slate-400 mb-6">
            As variáveis de ambiente `NEXT_PUBLIC_FIREBASE_*` não foram definidas. Verifique seu `.env.local` e tente novamente.
          </p>
          <code className="block bg-slate-900 border border-slate-700 rounded p-4 text-sm text-cyan-400 mb-4 overflow-x-auto">
            NEXT_PUBLIC_FIREBASE_API_KEY=... NEXT_PUBLIC_FIREBASE_APP_ID=...
          </code>
          <button
            onClick={() => location.reload()}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured: isFirebaseConfigured }}>
      <Toaster position="top-right" />
      {children}
    </AuthContext.Provider>
  )
}
