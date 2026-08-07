'use client'

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
} from 'firebase/firestore'

// Pure config — no SDK calls, safe to read anywhere (even in render body)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'link-89720.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'link-89720',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'link-89720.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '944023340985',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if Firebase is properly configured (pure string checks, no SDK)
export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.appId)

// Lazy singletons — only populated by initFirebase()
let app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null
let _googleProvider: GoogleAuthProvider | null = null

// Initialize Firebase exactly once (called from AuthProvider's useEffect)
export function initFirebase(): boolean {
  if (typeof window === 'undefined') {
    console.error('[Firebase] Cannot initialize outside browser')
    return false
  }

  if (!isFirebaseConfigured) {
    console.error('[Firebase] Configuration missing (check NEXT_PUBLIC_FIREBASE_* env vars)')
    return false
  }

  try {
    // Use existing app if already initialized, otherwise create new one
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

    // Initialize Auth (can be called multiple times safely)
    _auth = getAuth(app)

    // Initialize Firestore with persistent cache (can be called multiple times safely)
    try {
      _db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    } catch {
      // Already initialized (e.g., hot reload) — fallback to getFirestore
      _db = getFirestore(app)
    }

    // Initialize Google provider
    _googleProvider = new GoogleAuthProvider()
    _googleProvider.setCustomParameters({ prompt: 'select_account' })

    console.log('[Firebase] Initialized successfully')
    return true
  } catch (err) {
    console.error('[Firebase] Initialization failed:', err)
    return false
  }
}

// Getters that return null until initFirebase() has been called
export function getFirebaseAuth(): Auth | null {
  return _auth
}

export function getFirebaseDb(): Firestore | null {
  return _db
}

export function getGoogleProvider(): GoogleAuthProvider | null {
  return _googleProvider
}

// Temporary compatibility re-exports (will be removed once all consumers migrate)
// These allow old code (AuthModal, legacy pages) to keep working during migration
export const auth = new Proxy({} as Auth, {
  get: (_, prop) => {
    const auth = getFirebaseAuth()
    if (!auth) return undefined
    return (auth as any)[prop]
  },
})

export const db = new Proxy({} as Firestore, {
  get: (_, prop) => {
    const db = getFirebaseDb()
    if (!db) return undefined
    return (db as any)[prop]
  },
})

export const googleProvider = new Proxy({} as GoogleAuthProvider, {
  get: (_, prop) => {
    const provider = getGoogleProvider()
    if (!provider) return undefined
    return (provider as any)[prop]
  },
})

// Re-export Firebase SDK functions and types for convenience
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
}
export type { User }
