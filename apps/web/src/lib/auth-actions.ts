'use client'

import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'User already registered': 'Este e-mail já está registrado.',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar. Veja sua caixa de entrada.',
  'Password should be at least 6 characters': 'Senha muito fraca (mínimo 6 caracteres).',
  'Unable to validate email address: invalid format': 'E-mail inválido.',
  'signups not allowed for this instance': 'Cadastro desabilitado no momento.',
  'Email rate limit exceeded': 'Muitas tentativas. Tente novamente em alguns minutos.',
}

function friendlyMessage(message: string) {
  return ERROR_MESSAGES[message] ?? message
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    toast.error(friendlyMessage(error.message))
    throw error
  }
  toast.success(`Bem-vindo de volta, ${email.split('@')[0]}!`)
  return data.user
}

export async function registerWithEmail(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: email.split('@')[0] } },
  })
  if (error) {
    toast.error(friendlyMessage(error.message))
    throw error
  }
  if (!data.session) {
    toast.success('Conta criada! Confirme seu e-mail para entrar.')
  } else {
    toast.success('Conta criada com sucesso!')
  }
  return data.user
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  if (error) {
    toast.error(friendlyMessage(error.message))
    throw error
  }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    toast.error(friendlyMessage(error.message))
    throw error
  }
}
