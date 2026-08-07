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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'link-89720.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'link-89720',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'link-89720.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '944023340985',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// Lazy initialization — only in browser
let app: FirebaseApp | undefined
let _auth: Auth | undefined
let _db: Firestore | undefined

function initializeFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('[Firebase] Can only be initialized in browser')
  }
  if (app) return app
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    return app
  } catch (err) {
    console.error('[Firebase] Initialization error:', err)
    throw err
  }
}

export function getAuthInstance(): Auth {
  if (!_auth) {
    const firebaseApp = initializeFirebaseApp()
    _auth = getAuth(firebaseApp)
  }
  return _auth
}

export function getDbInstance(): Firestore {
  if (!_db) {
    const firebaseApp = initializeFirebaseApp()
    if (typeof window !== 'undefined') {
      try {
        _db = initializeFirestore(firebaseApp, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        })
      } catch {
        _db = getFirestore(firebaseApp)
      }
    } else {
      _db = getFirestore(firebaseApp)
    }
  }
  return _db
}

// Export lazy-loaded instances
export const auth: Auth = new Proxy({} as Auth, {
  get: (_, prop) => getAuthInstance()[prop as keyof Auth],
})

export const db: Firestore = new Proxy({} as Firestore, {
  get: (_, prop) => getDbInstance()[prop as keyof Firestore],
})

let _googleProvider: GoogleAuthProvider | undefined
export function getGoogleProvider(): GoogleAuthProvider {
  if (!_googleProvider) {
    _googleProvider = new GoogleAuthProvider()
    _googleProvider.setCustomParameters({ prompt: 'select_account' })
  }
  return _googleProvider
}

export const googleProvider = new Proxy({} as GoogleAuthProvider, {
  get: (_, prop) => getGoogleProvider()[prop as keyof GoogleAuthProvider],
})

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
}
export type { User }

