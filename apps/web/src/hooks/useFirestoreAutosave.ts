'use client'

import { useEffect, useRef, useMemo } from 'react'
import { doc, writeBatch, Timestamp } from 'firebase/firestore'
import { useGameStore } from '@/store/useGameStore'
import { getFirebaseDb } from '@/lib/firebase'

const SYNC_DEBOUNCE_MS = 10000 // 10s debounce

// Autosave hook — mounted in GameLayout, only runs when user is in a game screen
// Subscribes reactively to store changes and syncs to Firestore with debounce
export function useFirestoreAutosave(userId: string | undefined) {
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)

  const gameState = useGameStore(
    (state) => ({
      character: state.character,
      inventory: state.inventory,
      equipment: state.equipment,
      missions: state.missions,
      achievements: state.achievements,
      skills: state.skills,
      titles: state.titles,
      stats: state.stats,
      isOnboarded: state.isOnboarded,
    }),
    (a, b) => {
      return (
        a.character === b.character &&
        a.inventory === b.inventory &&
        a.equipment === b.equipment &&
        a.missions === b.missions &&
        a.achievements === b.achievements &&
        a.skills === b.skills &&
        a.titles === b.titles &&
        a.stats === b.stats &&
        a.isOnboarded === b.isOnboarded
      )
    }
  )

  useEffect(() => {
    if (!userId) return

    const saveGameState = async () => {
      const db = getFirebaseDb()
      if (!db) return

      const now = Date.now()
      if (now - lastSyncRef.current < SYNC_DEBOUNCE_MS) {
        return // Skip if too soon
      }
      lastSyncRef.current = now

      try {
        const batch = writeBatch(db)
        const gameStateRef = doc(db, 'users', userId, 'game-state', 'main')

        // Save game state
        batch.set(
          gameStateRef,
          {
            character: gameState.character,
            inventory: gameState.inventory,
            equipment: gameState.equipment,
            missions: gameState.missions,
            achievements: gameState.achievements,
            skills: gameState.skills,
            titles: gameState.titles,
            stats: gameState.stats,
            isOnboarded: gameState.isOnboarded,
            lastUpdated: Timestamp.now(),
          },
          { merge: true }
        )

        // Save inventory items (subcollection)
        const inventoryBatch = gameState.inventory.slice(0, 100)
        inventoryBatch.forEach((item) => {
          const itemRef = doc(db, 'users', userId, 'inventory', item.id)
          batch.set(itemRef, item)
        })

        // Save missions (subcollection)
        const missionsBatch = gameState.missions.slice(0, 100)
        missionsBatch.forEach((mission) => {
          const missionRef = doc(db, 'users', userId, 'missions', mission.id)
          batch.set(missionRef, mission)
        })

        // Save achievements (subcollection)
        gameState.achievements.forEach((achievement) => {
          const achievementRef = doc(db, 'users', userId, 'achievements', achievement.id)
          batch.set(achievementRef, achievement)
        })

        await batch.commit()
        console.log('[Firestore] ✅ Game state autosaved')
      } catch (err) {
        console.warn('[Firestore] Failed to autosave game state:', err)
      }
    }

    // Debounced save on state changes
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }

    syncTimeoutRef.current = setTimeout(() => {
      saveGameState()
    }, 3000) // 3s after last change

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [
    userId,
    gameState.character.level,
    gameState.character.totalXp,
    gameState.character.rank,
    gameState.inventory.length,
    gameState.missions.length,
    gameState.stats.totalMissionsCompleted,
  ])
}
