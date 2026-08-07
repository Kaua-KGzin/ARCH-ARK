'use client'

import { ReactNode, useEffect, useState, createContext } from 'react'
import { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { Toaster } from 'react-hot-toast'
import {
  initFirebase,
  isFirebaseConfigured,
  onAuthStateChanged,
  getFirebaseAuth,
  getFirebaseDb,
} from '@/lib/firebase'
import { useGameStore } from '@/store/useGameStore'

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
      const success = initFirebase()
      setIsInitialized(true)

      if (!success || !isFirebaseConfigured) {
        setLoading(false)
        return
      }

      // Set up the one-and-only auth listener for the whole app
      const auth = getFirebaseAuth()
      if (!auth) {
        setLoading(false)
        return
      }

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser)

        // On login, load game state from Firestore imperatively
        if (currentUser) {
          try {
            const db = getFirebaseDb()
            if (db) {
              const gameStateRef = doc(db, 'users', currentUser.uid, 'game-state', 'main')
              const snap = await getDoc(gameStateRef)

              if (snap.exists()) {
                const data = snap.data()
                console.log('[Firestore] Loading game state for user:', currentUser.uid)

                useGameStore.setState({
                  character: data.character || useGameStore.getState().character,
                  inventory: data.inventory || useGameStore.getState().inventory,
                  equipment: data.equipment || useGameStore.getState().equipment,
                  missions: data.missions || useGameStore.getState().missions,
                  achievements: data.achievements || useGameStore.getState().achievements,
                  skills: data.skills || useGameStore.getState().skills,
                  titles: data.titles || useGameStore.getState().titles,
                  stats: data.stats || useGameStore.getState().stats,
                  isOnboarded: data.isOnboarded !== undefined ? data.isOnboarded : useGameStore.getState().isOnboarded,
                })
                console.log('[Firestore] ✅ Game state loaded')
              } else {
                console.log('[Firestore] No saved state, using localStorage')
              }
            }
          } catch (err) {
            console.warn('[Auth] Failed to load Firestore state:', err)
          }
        }

        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [isInitialized])

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
