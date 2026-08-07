'use client'

import { useEffect, useRef } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { useGameStore } from '@/store/useGameStore'
import type { Character } from '@arch-ark/shared'

/**
 * Hook que sincroniza o estado do jogo (Zustand) com Firebase Firestore.
 * Otimizado para Free Tier: carrega dados ao autenticar e sincroniza
 * dados críticos (character, stats) periodicamente.
 */
export function useFirebaseGameSync() {
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)
  const MIN_SYNC_INTERVAL = 30000 // 30s mínimo entre syncs para não queimar quota

  useEffect(() => {
    if (!auth.currentUser) return

    const userId = auth.currentUser.uid
    const userCharRef = doc(db, 'users', userId)

    const setupSync = async () => {
      try {
        // Carrega dados iniciais do Firestore
        const userSnap = await getDoc(userCharRef)
        const gameStore = useGameStore.getState()

        if (userSnap.exists()) {
          const firestoreData = userSnap.data()
          // Merge: Firestore dados vão sobrescrever locais, exceto dados sensíveis
          if (firestoreData.character) {
            // Preserva o histórico local se o Firestore é mais velho
            const localLastUpdate = new Date(gameStore.character.lastActivityDate || 0).getTime()
            const firestoreLastUpdate = firestoreData.character.lastActivityDate
              ? new Date(firestoreData.character.lastActivityDate).getTime()
              : 0

            if (firestoreLastUpdate >= localLastUpdate) {
              useGameStore.setState({
                character: { ...gameStore.character, ...firestoreData.character },
              })
            }
          }
        } else {
          // Cria documento inicial do usuário no Firestore
          await setDoc(
            userCharRef,
            {
              character: gameStore.character,
              stats: gameStore.stats,
              createdAt: new Date().toISOString(),
              lastSyncedAt: new Date().toISOString(),
            },
            { merge: true }
          )
        }
      } catch (err) {
        console.warn('[Firebase Sync] Initial load failed:', err)
        // Fallback silencioso — app funciona sem Firestore se offline ou sem keys
      }
    }

    setupSync()

    // Listener para changes no Firestore (opcional - só para character/stats críticos)
    // Desabilitado por padrão para economizar quota. Ativar conforme necessário.
    // const unsubscribe = onSnapshot(userCharRef, (snap) => {
    //   if (snap.exists()) {
    //     const data = snap.data()
    //     if (data.character) {
    //       useGameStore.setState({ character: data.character })
    //     }
    //   }
    // })
    // unsubscribeRef.current = unsubscribe

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [auth.currentUser?.uid])

  // Função para sincronizar state crítico de forma manual (chamada após ações importantes)
  const syncToFirebase = async () => {
    if (!auth.currentUser) return

    const now = Date.now()
    if (now - lastSyncRef.current < MIN_SYNC_INTERVAL) {
      return // Throttle: evita múltiplas syncs em rápida sucessão
    }
    lastSyncRef.current = now

    const userId = auth.currentUser.uid
    const gameState = useGameStore.getState()

    try {
      await setDoc(
        doc(db, 'users', userId),
        {
          character: gameState.character,
          stats: gameState.stats,
          lastSyncedAt: new Date().toISOString(),
        },
        { merge: true }
      )
    } catch (err) {
      console.warn('[Firebase Sync] Failed to sync state:', err)
    }
  }

  return { syncToFirebase }
}
