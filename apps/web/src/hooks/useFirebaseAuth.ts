'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from '@/lib/firebase'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

/**
 * Hook que escuta o estado do Firebase Auth e sincroniza
 * dados do jogador no Firestore (otimizado para quota gratuita).
 */
export function useFirebaseAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setFirebaseUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })

        // Cria o documento do usuário no Firestore somente se ainda não existir
        // Isso respeita o limite de leituras/escritas do Spark Plan
        if (!db) return
        try {
          const userRef = doc(db, 'users', user.uid)
          const userSnap = await getDoc(userRef)

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'Caçador',
              photoURL: user.photoURL || null,
              createdAt: new Date().toISOString(),
              rank: 'E',
              level: 1,
              totalXp: 0,
            }, { merge: true })
          }
        } catch (err) {
          // Fallback silencioso — app funciona sem Firestore se keys não estiverem configuradas
          console.warn('[Firebase] Firestore sync skipped:', err)
        }
      } else {
        setFirebaseUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { firebaseUser, loading }
}
