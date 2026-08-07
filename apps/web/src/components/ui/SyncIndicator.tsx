'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Indicador visual de sincronização com Firestore
 * Mostra status: sincronizando, sincronizado, erro
 */
export function SyncIndicator() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [isVisible, setIsVisible] = useState(false)

  // Listen para mudanças de sync no localStorage (cross-tab communication)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'firestore-sync-status') {
        const status = e.newValue as any
        setSyncStatus(status || 'idle')
        setIsVisible(true)

        if (status === 'success' || status === 'error') {
          setTimeout(() => setIsVisible(false), 3000)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (!isVisible) return null

  const statusConfig = {
    idle: { icon: '⏳', label: '', color: 'text-slate-400' },
    syncing: { icon: '🔄', label: 'Sincronizando...', color: 'text-cyan-400' },
    success: { icon: '✅', label: 'Sincronizado!', color: 'text-green-400' },
    error: { icon: '⚠️', label: 'Erro de sync', color: 'text-red-400' },
  }

  const config = statusConfig[syncStatus]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 backdrop-blur-md"
      >
        <motion.span
          animate={syncStatus === 'syncing' ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: syncStatus === 'syncing' ? Infinity : 0 }}
          className="text-sm"
        >
          {config.icon}
        </motion.span>
        <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
      </motion.div>
    </AnimatePresence>
  )
}
