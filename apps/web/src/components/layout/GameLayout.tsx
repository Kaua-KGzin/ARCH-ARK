'use client'

import { useGameStore } from '@/store/useGameStore'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { useRankReset } from '@/hooks/useRankReset'
import { useFirestoreAutosave } from '@/hooks/useFirestoreAutosave'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
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

  // Gate: check auth + onboarded, redirect if needed
  const { user, loading, isOnboarded } = useRequireAuth()

  // Rank reset logic
  useRankReset()

  // Firestore autosave (only when user is in game)
  useFirestoreAutosave(user?.uid)

  // Daily reset on mount
  if (!loading && isOnboarded) {
    checkDailyReset()
  }

  if (loading || !isOnboarded || !user) return null

  return (
    <div className="relative min-h-screen bg-[#050508] bg-grid flex text-slate-100 selection:bg-cyan-500 selection:text-black">
      <ManaParticles enabled={settings?.particlesEnabled ?? true} />
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 z-10">
        <TopBar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <LevelUpModal
        notification={levelUpNotification}
        onClose={clearLevelUpNotification}
      />
      <FloatingText
        notifications={rewardNotifications}
        onDismiss={dismissRewardNotification}
      />
      <AchievementToast />
    </div>
  )
}

