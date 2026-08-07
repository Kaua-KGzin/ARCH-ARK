'use client'

import { toast } from 'react-hot-toast'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@/lib/firebase'
import { getFirebaseAuth, getGoogleProvider, isFirebaseConfigured } from '@/lib/firebase'

// Map Firebase error codes to user-friendly Portuguese messages
export function getFirebaseAuthErrorMessage(code: string): string {
  const errorMap: Record<string, string> = {
    'auth/email-already-in-use': 'Este e-mail já está registrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    'auth/popup-closed-by-user': 'Autenticação cancelada.',
    'auth/operation-not-allowed': 'Autenticação por email desabilitada. Contate o suporte.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  }
  return errorMap[code] || 'Erro ao autenticar. Tente novamente.'
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase não está configurado')
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    throw new Error('Firebase Auth não inicializado')
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    toast.success(`Bem-vindo de volta, ${result.user.email?.split('@')[0]}!`)
    return result.user
  } catch (err: any) {
    const message = getFirebaseAuthErrorMessage(err.code)
    toast.error(message)
    throw err
  }
}

// Register with email and password
export async function registerWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase não está configurado')
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    throw new Error('Firebase Auth não inicializado')
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    toast.success('🎉 Conta criada com sucesso!')
    return result.user
  } catch (err: any) {
    const message = getFirebaseAuthErrorMessage(err.code)
    toast.error(message)
    throw err
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase não está configurado')
  }

  const auth = getFirebaseAuth()
  const googleProvider = getGoogleProvider()

  if (!auth || !googleProvider) {
    throw new Error('Firebase Auth/Google não inicializado')
  }

  try {
    const result = await signInWithPopup(auth, googleProvider)
    toast.success(`🔐 Autenticado: ${result.user.displayName || result.user.email}`)
    return result.user
  } catch (err: any) {
    if (err.code !== 'auth/popup-closed-by-user') {
      const message = getFirebaseAuthErrorMessage(err.code)
      toast.error(message)
    }
    throw err
  }
}
