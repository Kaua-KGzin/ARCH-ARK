'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { GeneratedImage } from '@/lib/ai-image'

interface ImageFeedProps {
  images: GeneratedImage[]
}

export function ImageFeed({ images }: ImageFeedProps) {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({})

  const handleLike = (id: string, initialLikes: number) => {
    setLikesMap((prev) => {
      const current = prev[id] ?? initialLikes
      return { ...prev, [id]: current + 1 }
    })
    toast.success('Você deu 1 Like no card de IA! ❤️')
  }

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    toast.success('Prompt copiado para a área de transferência!')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-black text-lg flex items-center gap-2">
          <span>🖼️ Feed da Comunidade & IA</span>
          <span className="text-xs font-mono text-cyan-400">({images.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {images.map((img, idx) => {
            const currentLikes = likesMap[img.id] ?? img.likes
            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/80 shadow-lg backdrop-blur-md hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

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
