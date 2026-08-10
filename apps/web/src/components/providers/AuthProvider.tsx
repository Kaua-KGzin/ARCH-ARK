'use client'

import { ReactNode, createContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export interface AuthContextType {
  user: User | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// The middleware already guarantees the correct `user` before this ever
// renders (see src/lib/supabase/middleware.ts), so there is no loading
// state here on purpose — no client-side spinner, no race to lose.
export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User | null
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(initialUser)

  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}
