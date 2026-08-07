'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useImageGallery } from '@/hooks/useImageGallery'

export function ImageFeed() {
  const { images, loading } = useImageGallery()
  const [likesMap, setLikesMap] = useState<Record<string, number>>({})

  const handleLike = (id: string, initialLikes: number) => {
    setLikesMap((prev) => {
      const current = prev[id] ?? initialLikes
      return { ...prev, [id]: current + 1 }
    })
    toast.success('❤️ +1 Like!', { duration: 2000 })
  }

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    toast.success('📋 Prompt copiado!', { duration: 2000 })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-slate-400">
          <div className="animate-spin inline-block h-8 w-8 rounded-full border-2 border-slate-600 border-t-cyan-400" />
          <p className="mt-3 text-sm">Carregando galeria de IA...</p>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-8 text-center">
        <p className="text-slate-400 text-sm">Nenhuma imagem na galeria ainda. Gere a primeira! 🎨</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <motion.div className="flex items-center justify-between">
        <h3 className="text-white font-black text-lg flex items-center gap-2">
          <span>🖼️ Galeria de IA Comunitária</span>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded-lg">
            {images.length} obras
          </span>
        </h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {images.map((img, idx) => {
            const currentLikes = likesMap[img.id] ?? img.likes
            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -20 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/80 shadow-lg backdrop-blur-md hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(0,240,255,0.3)] transition-all"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                  <motion.img
                    src={img.url}
                    alt={img.prompt}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.6 }}
                    loading="lazy"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/30 opacity-70"
                    whileHover={{ opacity: 0.4 }}
                  />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md border border-cyan-500/40 bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-cyan-400 uppercase backdrop-blur-md">
                      {img.category}
                    </span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-4">
                  <p className="line-clamp-2 text-xs font-medium text-slate-300">
                    "{img.prompt}"
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <span className="text-[11px] text-slate-500 font-mono">
                      por {img.authorName}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyPrompt(img.prompt)}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                        title="Copiar Prompt"
                      >
                        📋
                      </button>

                      <button
                        onClick={() => handleLike(img.id, img.likes)}
                        className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-950/30 px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-950/60 transition-colors"
                      >
                        ❤️ {currentLikes}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
