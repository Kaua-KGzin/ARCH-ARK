'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { generateAIImage, GeneratedImage } from '@/lib/ai-image'
import { useImageGallery } from '@/hooks/useImageGallery'

interface ImageGeneratorProps {
  onImageGenerated?: (image: GeneratedImage) => void
}

export function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('character')
  const [isGenerating, setIsGenerating] = useState(false)
  const { addImageToGallery } = useImageGallery()

  const PRESETS = [
    { label: '👑 Monarca Cyberpunk', prompt: 'Solo Leveling Monarch armor glowing purple cyan eyes cyberpunk' },
    { label: '⚔️ Relíquia Lendária', prompt: 'Legendary Monarch sword dark flame aura ultra detailed artifact' },
    { label: '🏰 Core da Masmorra', prompt: 'Futuristic red portal dungeon entrance abyss monarch system' },
  ]

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast.error('Digite um prompt para a IA gerar a imagem!')
      return
    }

    setIsGenerating(true)
    const toastId = toast.loading('✨ Sintetizando imagem via IA...')

    try {
      const newImg = await generateAIImage(prompt, category)

      await addImageToGallery(newImg)

      toast.success('🎉 Imagem gerada e salva na galeria!', { id: toastId })
      onImageGenerated?.(newImg)
      setPrompt('')
    } catch (err) {
      console.error('[Image Generation]', err)
      toast.error('Erro ao gerar imagem. Tente novamente.', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🤖</span>
        <div>
          <h2 className="text-lg font-black text-white">GERADOR DE IMAGENS POR IA</h2>
          <p className="text-xs text-slate-400">
            Crie avatares, relíquias e cenários de masmorras digitando a sua visão em texto.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 mt-4">
        <div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Monarca das Sombras com armadura reluzente e aura azul..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(p.prompt)}
              className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="btn-primary w-full tracking-wider uppercase text-xs py-3"
        >
          {isGenerating ? '⚡ SINTETIZANDO IMAGEM VIA IA...' : '✨ GERAR IMAGEM AGORA'}
        </button>
      </form>
    </div>
  )
}
