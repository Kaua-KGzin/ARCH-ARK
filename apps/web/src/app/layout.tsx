import type { Metadata, Viewport } from 'next'
import { Archivo_Black, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { GameSyncProvider } from '@/components/providers/GameSyncProvider'
import { PwaRegister } from '@/components/providers/PwaRegister'
import { ThemeApplier } from '@/components/providers/ThemeApplier'
import { createClient } from '@/lib/supabase/server'
import { fetchCharacterRow, rowToGameState } from '@/lib/supabase/game-sync'

const archivoBlack = Archivo_Black({ weight: '400', subsets: ['latin'], variable: '--font-archivo-black' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'ARCH ARK — Evolua na Vida Real',
  description:
    'O sistema de Solo Leveling para a vida real. Transforme exercícios, estudos e hábitos em XP, itens e evolução de personagem.',
  manifest: '/manifest.webmanifest',
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
    <html lang="pt-BR" suppressHydrationWarning className={`${archivoBlack.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] font-sans" suppressHydrationWarning>
        <AuthProvider initialUser={user}>
          <GameSyncProvider userId={user?.id ?? null} initialState={initialState}>
            <Toaster theme="dark" position="top-right" richColors closeButton />
            <PwaRegister />
            <ThemeApplier />
            {children}
          </GameSyncProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
