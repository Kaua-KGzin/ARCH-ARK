'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { GeneratedImage } from '@/lib/ai-image'

function rowToImage(row: {
  id: string
  prompt: string
  url: string
  author_name: string
  category: string
  likes: number
  created_at: string
}): GeneratedImage {
  return {
    id: row.id,
    prompt: row.prompt,
    url: row.url,
    authorName: row.author_name,
    category: row.category,
    likes: row.likes,
    createdAt: row.created_at,
  }
}

/**
 * Galeria pública de imagens geradas por IA, com atualização em tempo real
 * via Supabase Realtime (Postgres changes). Limitada às 50 mais recentes.
 */
export function useImageGallery() {
  const { user } = useAuth()
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) setImages(data.map(rowToImage))
        setLoading(false)
      })

    const channel = supabase
      .channel('gallery_images_feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'gallery_images' },
        (payload) => {
          setImages((prev) =>
            [rowToImage(payload.new as Parameters<typeof rowToImage>[0]), ...prev].slice(0, 50)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addImageToGallery = async (image: GeneratedImage) => {
    if (!user) return
    const supabase = createClient()
    const { error } = await supabase.from('gallery_images').insert({
      prompt: image.prompt,
      url: image.url,
      category: image.category,
      author_name: user.user_metadata?.username || image.authorName,
      user_id: user.id,
    })
    if (error) console.warn('[Image Gallery] Falha ao salvar:', error)
  }

  return { images, loading, addImageToGallery }
}
