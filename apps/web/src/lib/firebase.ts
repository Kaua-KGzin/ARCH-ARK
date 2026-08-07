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

// Inicialização Singleton — evita múltiplas instâncias em hot-reload do Next.js
// Safe initialization: ignora erros durante build/SSR
let app: FirebaseApp
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
} catch (err) {
  // Durante build ou SSR sem credenciais válidas, falha silenciosamente
  if (typeof window === 'undefined') {
    console.warn('[Firebase] Initialized without valid credentials (build/SSR mode)')
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  } else {
    throw err
  }
}

// Auth
export const auth: Auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// Firestore com Persistência Offline Multi-Tab (Spark Plan Friendly)
// Singleton guard: initializeFirestore só pode ser chamado uma vez por app
let _db: Firestore

function getDb(): Firestore {
  if (_db) return _db
  if (typeof window !== 'undefined') {
    try {
      _db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    } catch {
      // já inicializado (hot reload)
      _db = getFirestore(app)
    }
  } else {
    _db = getFirestore(app)
  }
  return _db
}

export const db: Firestore = getDb()

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
}
export type { User }

