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
          async (currentUser) => {
            console.log('[Auth] Listener fired:', currentUser?.email || 'logged out')

            if (timeoutId) {
              clearTimeout(timeoutId)
              timeoutId = null
            }

            setUser(currentUser)

            // On login, load game state from Firestore imperatively
            if (currentUser) {
              try {
                const db = getFirebaseDb()
                if (db) {
                  console.log('[Firestore] Fetching state for user:', currentUser.uid)
                  const gameStateRef = doc(db, 'users', currentUser.uid, 'game-state', 'main')
                  const snap = await getDoc(gameStateRef)

                  if (snap.exists()) {
                    const data = snap.data()
                    console.log('[Firestore] Document found, loading state...')

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
                } else {
                  console.warn('[Firestore] DB not available')
                }
              } catch (err) {
                console.warn('[Auth] Failed to load Firestore state:', err)
              }
            }

            setLoading(false)
          },
          (error) => {
            console.error('[Auth] Listener error:', error)
            setLoading(false)
          }
        )

        console.log('[Auth] ✅ Listener registered')
        console.log('[Auth] Direct currentUser check:', auth.currentUser?.email || 'null (no active session)')

        // Fallback: if listener doesn't fire quickly, manually check currentUser
        timeoutId = setTimeout(async () => {
          console.warn('[Auth] Listener slow, using manual currentUser check as fallback')
          const currentUser = auth.currentUser
          console.log('[Auth] Fallback: currentUser =', currentUser?.email || 'null')

          if (currentUser) {
            setUser(currentUser)
            // Load game state
            try {
              const db = getFirebaseDb()
              if (db) {
                const gameStateRef = doc(db, 'users', currentUser.uid, 'game-state', 'main')
                const snap = await getDoc(gameStateRef)
                if (snap.exists()) {
                  useGameStore.setState({
                    character: snap.data().character || useGameStore.getState().character,
                    inventory: snap.data().inventory || useGameStore.getState().inventory,
                    equipment: snap.data().equipment || useGameStore.getState().equipment,
                    missions: snap.data().missions || useGameStore.getState().missions,
                    achievements: snap.data().achievements || useGameStore.getState().achievements,
                    skills: snap.data().skills || useGameStore.getState().skills,
                    titles: snap.data().titles || useGameStore.getState().titles,
                    stats: snap.data().stats || useGameStore.getState().stats,
                    isOnboarded: snap.data().isOnboarded !== undefined ? snap.data().isOnboarded : useGameStore.getState().isOnboarded,
                  })
                  console.log('[Firestore] ✅ Game state loaded (fallback)')
                }
              }
            } catch (err) {
              console.warn('[Auth] Fallback Firestore load failed:', err)
            }
          } else {
            console.log('[Auth] Fallback: No user logged in')
          }

          setLoading(false)
          timeoutId = null
        }, 500)
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
