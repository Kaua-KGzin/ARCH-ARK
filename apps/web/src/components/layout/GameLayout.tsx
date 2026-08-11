'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'
import { useRankReset } from '@/hooks/useRankReset'
<<<<<<< HEAD
import { useFirestoreAutosave } from '@/hooks/useFirestoreAutosave'
import { useFirestoreLoad } from '@/hooks/useFirestoreLoad'
=======
>>>>>>> 9af05d9ff57d4bf4c20a33b57a2cb8231fd558f9
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileNav from './MobileNav'
import { LevelUpModal } from '../effects/LevelUpModal'
import AchievementToast from '../effects/AchievementToast'
import { ManaParticles } from '../effects/ManaParticles'
import { FloatingText } from '../effects/FloatingText'

interface GameLayoutProps {
  children: React.ReactNode
  title: string
}

export default function GameLayout({ children, title }: GameLayoutProps) {
  const {
    checkDailyReset,
    levelUpNotification,
    clearLevelUpNotification,
    rewardNotifications,
    dismissRewardNotification,
    settings,
  } = useGameStore()
  const pathname = usePathname()

<<<<<<< HEAD
  // Gate: check auth + onboarded, redirect if needed
  const { user, loading, isOnboarded } = useRequireAuth()

  console.log('[GameLayout] user:', user?.email, 'loading:', loading, 'isOnboarded:', isOnboarded)

  // Load game state from Firestore on mount
  useFirestoreLoad(user?.uid)

  // Rank reset logic
=======
>>>>>>> 9af05d9ff57d4bf4c20a33b57a2cb8231fd558f9
  useRankReset()

  useEffect(() => {
    checkDailyReset()
  }, [checkDailyReset])

  return (
    <div className="relative min-h-screen bg-[#050508] bg-grid flex text-slate-100 selection:bg-cyan-500 selection:text-black">
      <ManaParticles enabled={settings?.particlesEnabled ?? true} />
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 z-10">
        <TopBar title={title} />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
      <LevelUpModal notification={levelUpNotification} onClose={clearLevelUpNotification} />
      <FloatingText notifications={rewardNotifications} onDismiss={dismissRewardNotification} />
      <AchievementToast />
    </div>
  )
}
