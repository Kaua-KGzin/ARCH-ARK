'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { GeneratedImage } from '@/lib/ai-image'

/**
 * Hook que gerencia a galeria pública de imagens no Firestore.
 * Otimizado para Free Tier: limita a 50 imagens e usa orderBy descendente.
 */
export function useImageGallery() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(true)

  // Listener para carregar imagens públicas do Firestore (Free Tier: máx 50)
  useEffect(() => {
    try {
      const imagesRef = collection(db, 'ai_gallery')
      const q = query(
        imagesRef,
        orderBy('createdAt', 'desc'),
        limit(50)
      )

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as GeneratedImage[]
        setImages(data)
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (err) {
      console.warn('[Image Gallery] Load failed:', err)
      setLoading(false)
    }
  }, [])

  // Função para adicionar nova imagem à galeria
  const addImageToGallery = async (image: GeneratedImage) => {
    if (!auth.currentUser) return

    try {
      await addDoc(collection(db, 'ai_gallery'), {
        prompt: image.prompt,
        url: image.url,
        category: image.category,
        authorName: auth.currentUser.displayName || image.authorName,
        userId: auth.currentUser.uid,
        likes: 0,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      console.warn('[Image Gallery] Failed to add image:', err)
    }
  }

  return { images, loading, addImageToGallery }
}
