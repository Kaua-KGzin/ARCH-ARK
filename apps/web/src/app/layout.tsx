import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { GameSyncProvider } from '@/components/providers/GameSyncProvider'
import { createClient } from '@/lib/supabase/server'
import { fetchCharacterRow, rowToGameState } from '@/lib/supabase/game-sync'

export const metadata: Metadata = {
  title: 'ARCH ARK — Evolua na Vida Real',
  description:
    'O sistema de Solo Leveling para a vida real. Transforme exercícios, estudos e hábitos em XP, itens e evolução de personagem.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.ico', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'ARCH ARK' },
}

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const characterRow = user ? await fetchCharacterRow(supabase, user.id) : null
  const initialState = characterRow ? rowToGameState(characterRow) : null

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-[#050508]" suppressHydrationWarning>
        <AuthProvider initialUser={user}>
          <GameSyncProvider userId={user?.id ?? null} initialState={initialState}>
            <Toaster theme="dark" position="top-right" richColors closeButton />
            {children}
          </GameSyncProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
