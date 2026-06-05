'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import LevelUpModal from '../effects/LevelUpModal'
import AchievementToast from '../effects/AchievementToast'

interface GameLayoutProps {
  children: React.ReactNode
  title: string
}

export default function GameLayout({ children, title }: GameLayoutProps) {
  const { isOnboarded, checkDailyReset } = useGameStore()
  const router = useRouter()

  useEffect(() => {
    if (!isOnboarded) {
      router.push('/')
      return
    }
    checkDailyReset()
  }, [isOnboarded, router, checkDailyReset])

  if (!isOnboarded) return null

  return (
    <div className="min-h-screen bg-[#050508] bg-grid flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <TopBar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <LevelUpModal />
      <AchievementToast />
    </div>
  )
}
