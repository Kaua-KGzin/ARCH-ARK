'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { useRankReset } from '@/hooks/useRankReset'
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
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto">{children}</main>
      </div>
      <LevelUpModal notification={levelUpNotification} onClose={clearLevelUpNotification} />
      <FloatingText notifications={rewardNotifications} onDismiss={dismissRewardNotification} />
      <AchievementToast />
    </div>
  )
}
