'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/useGameStore'

export function ThemeApplier() {
  const themeMode = useGameStore((state) => state.settings.themeMode)

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  return null
}
