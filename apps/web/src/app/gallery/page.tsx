'use client'

import { useState, useEffect } from 'react'
import GameLayout from '@/components/layout/GameLayout'
import { ImageGenerator } from '@/components/feed/ImageGenerator'
import { ImageFeed } from '@/components/feed/ImageFeed'
import { AuthModal } from '@/components/auth/AuthModal'
import { getCachedImages, DEMO_FEED_IMAGES, GeneratedImage } from '@/lib/ai-image'
import { auth, signOut, User } from '@/lib/firebase'
import { toast } from 'react-hot-toast'

export default function GalleryPage() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  useEffect(() => {
    const cached = getCachedImages()
    setImages(cached.length > 0 ? cached : DEMO_FEED_IMAGES)

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleImageGenerated = (newImg: GeneratedImage) => {
    setImages((prev) => [newImg, ...prev])
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Desconectado com sucesso.')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <GameLayout title="Galeria de IA & Autenticação">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-6 backdrop-blur-md">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
              SISTEMA MONARCA · GALERIA DE IA & AUTH
            </span>
            <h1 className="text-3xl font-black text-white mt-1">
              GALERIA VIRTUAL & FEED DE IMAGENS
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Gere artes com Inteligência Artificial, gerencie suas capturas de masmorras e sincronize com o Firebase Auth.
            </p>
          </div>

          <div>
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="h-9 w-9 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-cyan-300">
                  {currentUser.email?.[0].toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate max-w-[140px]">
                    {currentUser.displayName || currentUser.email}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Desconectar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="btn-primary text-xs py-3 px-5 tracking-wider uppercase"
              >
                🔐 ENTRAR / CADASTRAR (FIREBASE)
              </button>
            )}
          </div>
        </div>

        {/* AI Image Generator */}
        <ImageGenerator onImageGenerated={handleImageGenerated} />

        {/* AI Community Feed */}
        <ImageFeed />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(u) => setCurrentUser(u)}
        />
      </div>
    </GameLayout>
  )
}
