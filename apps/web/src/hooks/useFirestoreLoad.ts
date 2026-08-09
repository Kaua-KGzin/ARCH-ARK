'use client'

import { useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useGameStore } from '@/store/useGameStore'
import { getFirebaseDb } from '@/lib/firebase'

export function useFirestoreLoad(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return

    const loadGameState = async () => {
      try {
        const db = getFirebaseDb()
        if (!db) {
          console.warn('[FirestoreLoad] DB not available')
          return
        }

        console.log('[FirestoreLoad] Loading state for user:', userId)
        await new Promise(r => setTimeout(r, 300))

        const gameStateRef = doc(db, 'users', userId, 'game-state', 'main')
        const snap = await getDoc(gameStateRef)

        if (snap.exists()) {
          const data = snap.data()
          console.log('[FirestoreLoad] Document found, loading state...')

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
          console.log('[FirestoreLoad] ✅ Game state loaded')
        } else {
          console.log('[FirestoreLoad] No saved state, using defaults')
        }
      } catch (err) {
        console.warn('[FirestoreLoad] Failed to load state:', err)
      }
    }

    loadGameState()
  }, [userId])
}
