'use client'

import { doc, getDoc } from 'firebase/firestore'
import { useCallback } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { getFirebaseDb } from '@/lib/firebase'

// One-shot load of game state from Firestore on login
// Called imperatively from AuthProvider, not mounted as a reacting hook
export function useFirestoreLoad() {
  const loadGameStateFromFirestore = useCallback(async (userId: string) => {
    const db = getFirebaseDb()
    if (!db) return

    try {
      const gameStateRef = doc(db, 'users', userId, 'game-state', 'main')
      const snap = await getDoc(gameStateRef)

      if (snap.exists()) {
        const data = snap.data()
        console.log('[Firestore] Loading game state for user:', userId)

        // Merge Firestore state into Zustand (Firestore is source of truth if it exists)
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
          arkMessages: data.arkMessages || useGameStore.getState().arkMessages,
          settings: data.settings || useGameStore.getState().settings,
        })

        console.log('[Firestore] ✅ Game state loaded successfully')
      } else {
        console.log('[Firestore] No saved state found for user:', userId)
      }
    } catch (err) {
      console.warn('[Firestore] Failed to load game state (will use localStorage fallback):', err)
      // Zustand persist middleware automatically falls back to localStorage
    }
  }, [])

  return { loadGameStateFromFirestore }
}
