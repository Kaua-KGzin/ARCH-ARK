'use client'

import { useEffect, useRef, useCallback } from 'react'
import { doc, setDoc, getDoc, Timestamp, writeBatch } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { useGameStore } from '@/store/useGameStore'
import type { GameState } from '@arch-ark/shared'

const SYNC_DEBOUNCE_MS = 10000 // 10s debounce para não queimar quota

/**
 * Hook que sincroniza estado completo do jogo com Firestore.
 * Estrutura:
 * - users/{uid}/game-state: character, inventory, missions, etc
 * - users/{uid}/inventory/{itemId}: items com detalhes
 * - users/{uid}/missions/{missionId}: missions e progresso
 * - users/{uid}/achievements/{achievementId}: achievements
 */
export function useFirestorePersist() {
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)
  const gameState = useGameStore()

  // Carregar estado completo ao fazer login (com fallback para localStorage)
  const loadGameStateFromFirestore = useCallback(async () => {
    if (!auth.currentUser) return

    const userId = auth.currentUser.uid
    try {
      const gameStateRef = doc(db, 'users', userId, 'game-state', 'main')
      const snap = await getDoc(gameStateRef)

      if (snap.exists()) {
        const data = snap.data()
        console.log('[Firestore] Loading game state for user:', userId)

        // Restaura estado do Zustand
        useGameStore.setState({
          character: data.character || gameState.character,
          inventory: data.inventory || gameState.inventory,
          equipment: data.equipment || gameState.equipment,
          missions: data.missions || gameState.missions,
          achievements: data.achievements || gameState.achievements,
          skills: data.skills || gameState.skills,
          titles: data.titles || gameState.titles,
          stats: data.stats || gameState.stats,
          isOnboarded: data.isOnboarded !== undefined ? data.isOnboarded : gameState.isOnboarded,
          arkMessages: data.arkMessages || gameState.arkMessages,
          settings: data.settings || gameState.settings,
        })

        console.log('[Firestore] ✅ Game state loaded successfully for', userId)
      } else {
        console.log('[Firestore] No saved state found for user:', userId)
        // Primeira vez: salva estado inicial
        await saveGameStateToFirestore()
      }
    } catch (err) {
      console.warn('[Firestore] Failed to load game state (using localStorage):', err)
      // Fallback silencioso: app já tem localStorage cache do Zustand persist
    }
  }, [gameState])

  // Emitir status de sync (para SyncIndicator)
  const emitSyncStatus = (status: 'idle' | 'syncing' | 'success' | 'error') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('firestore-sync-status', status)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'firestore-sync-status',
          newValue: status,
        })
      )
    }
  }

  // Salvar estado completo no Firestore (com debounce)
  const saveGameStateToFirestore = useCallback(async () => {
    if (!auth.currentUser) return

    const now = Date.now()
    if (now - lastSyncRef.current < SYNC_DEBOUNCE_MS) {
      return // Skip if too soon
    }
    lastSyncRef.current = now

    const userId = auth.currentUser.uid
    const state = useGameStore.getState()

    try {
      emitSyncStatus('syncing')

      const batch = writeBatch(db)
      const gameStateRef = doc(db, 'users', userId, 'game-state', 'main')

      // Salva game state completo
      batch.set(
        gameStateRef,
        {
          character: state.character,
          inventory: state.inventory,
          equipment: state.equipment,
          missions: state.missions,
          achievements: state.achievements,
          skills: state.skills,
          titles: state.titles,
          stats: state.stats,
          isOnboarded: state.isOnboarded,
          lastUpdated: Timestamp.now(),
        },
        { merge: true }
      )

      // Salva inventory items (subcollection) — máx 100 por batch
      const inventoryBatch = state.inventory.slice(0, 100)
      inventoryBatch.forEach((item) => {
        const itemRef = doc(db, 'users', userId, 'inventory', item.id)
        batch.set(itemRef, item)
      })

      // Salva missions (subcollection)
      const missionsBatch = state.missions.slice(0, 100)
      missionsBatch.forEach((mission) => {
        const missionRef = doc(db, 'users', userId, 'missions', mission.id)
        batch.set(missionRef, mission)
      })

      // Salva achievements (subcollection)
      state.achievements.forEach((achievement) => {
        const achievementRef = doc(db, 'users', userId, 'achievements', achievement.id)
        batch.set(achievementRef, achievement)
      })

      await batch.commit()
      console.log('[Firestore] ✅ Game state synced successfully')
      emitSyncStatus('success')
    } catch (err) {
      console.warn('[Firestore] Failed to save game state:', err)
      emitSyncStatus('error')
    }
  }, [])

  // Listener para mudanças críticas no state
  useEffect(() => {
    // Debounced save quando state muda
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }

    syncTimeoutRef.current = setTimeout(() => {
      saveGameStateToFirestore()
    }, 3000) // 3s de espera após mudança

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [
    gameState.character.level,
    gameState.character.totalXp,
    gameState.character.rank,
    gameState.inventory.length,
    gameState.missions.length,
    gameState.stats.totalMissionsCompleted,
    saveGameStateToFirestore,
  ])

  return { loadGameStateFromFirestore, saveGameStateToFirestore }
}
