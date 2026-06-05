'use client'

import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import XpBar from '@/components/character/XpBar'
import MissionCard from '@/components/missions/MissionCard'
import { getRankColor, getRankBgColor, getClassColor, getClassIcon, formatNumber, cn } from '@/lib/utils'
import { calculateSecondaryStats } from '@/lib/xp'

export default function DashboardPage() {
  const { character, missions, stats, achievements, dungeons } = useGameStore()
  const secondary = calculateSecondaryStats(character)

  const dailyMissions = missions.filter(m => m.type === 'daily')
  const completedToday = dailyMissions.filter(m => m.status === 'completed').length
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length
  const activeDungeons = dungeons.filter(d => d.isActive && !d.isCompleted).length

  return (
    <GameLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-6 fade-in-up">

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d0d1a] via-[#0a0a1f] to-[#0d0d1a] border border-[#1a1a2e] p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />

          <div className="relative flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-blue-500/30 flex items-center justify-center text-4xl glow-blue">
                  {character.avatar}
                </div>
                <div className={cn(
                  'absolute -bottom-2 -right-2 text-xs font-black px-2 py-0.5 rounded-full border-2',
                  getRankBgColor(character.rank)
                )}>
                  <span className={getRankColor(character.rank)}>{character.rank}</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-mono mb-0.5">{character.title}</div>
                <h2 className="text-2xl font-black text-white">{character.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{getClassIcon(character.class)}</span>
                  <span className={cn('font-bold text-sm', getClassColor(character.class))}>{character.class}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 text-sm">Nível {character.level}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              {[
                { label: 'Total XP', value: formatNumber(character.totalXp), color: 'text-cyan-400', icon: '⚡' },
                { label: 'Sequência', value: `${character.streak}d`, color: 'text-orange-400', icon: '🔥' },
                { label: 'Ouro', value: formatNumber(character.gold), color: 'text-yellow-400', icon: '💰' },
              ].map(stat => (
                <div key={stat.label} className="text-right">
                  <div className="text-xs text-gray-500 mb-0.5">{stat.icon} {stat.label}</div>
                  <div className={cn('text-xl font-black', stat.color)}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-5">
            <XpBar current={character.currentXp} total={character.xpToNextLevel} level={character.level} size="lg" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Missões Completas', value: stats.totalMissionsCompleted, icon: '✅', color: 'text-green-400' },
            { label: 'Conquistas', value: `${unlockedAchievements}/${achievements.length}`, icon: '🏆', color: 'text-yellow-400' },
            { label: 'Dungeons', value: `${stats.dungeonsCleared}`, icon: '🏰', color: 'text-purple-400' },
            { label: 'Bosses Derrotados', value: stats.bossesDefeated, icon: '👹', color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="card">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={cn('text-2xl font-black', stat.color)}>{stat.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'HP Máximo', value: secondary.maxHp, icon: '❤️', color: 'text-red-400' },
            { label: 'Mana Máxima', value: secondary.maxMana, icon: '💧', color: 'text-blue-400' },
            { label: 'Ataque', value: secondary.attackPower, icon: '⚔️', color: 'text-orange-400' },
            { label: 'Defesa', value: secondary.defense, icon: '🛡️', color: 'text-gray-300' },
            { label: 'Velocidade', value: secondary.speed, icon: '⚡', color: 'text-yellow-400' },
            { label: 'Bônus XP', value: `+${secondary.xpBonus.toFixed(1)}%`, icon: '📈', color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.label} className="card flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <div>
                <div className={cn('font-bold text-sm', s.color)}>{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Missions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                📋 Missões Diárias
                <span className="text-xs bg-[#1a1a2e] text-gray-400 px-2 py-0.5 rounded-full">
                  {completedToday}/{dailyMissions.length}
                </span>
              </h3>
              {completedToday === dailyMissions.length && dailyMissions.length > 0 && (
                <span className="text-xs text-green-400 font-bold">✓ PERFEITO!</span>
              )}
            </div>
            <div className="space-y-3">
              {dailyMissions.map(m => <MissionCard key={m.id} mission={m} />)}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Streak card */}
            <div className="card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 to-transparent" />
              <div className="relative flex items-center gap-4">
                <div className="text-5xl animate-float">🔥</div>
                <div>
                  <div className="text-gray-400 text-sm">Sequência Atual</div>
                  <div className="text-4xl font-black text-orange-400">{character.streak}</div>
                  <div className="text-gray-500 text-xs">dias consecutivos</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-gray-600 text-xs">Recorde</div>
                  <div className="text-orange-300 font-bold">{character.longestStreak}d</div>
                </div>
              </div>
              <div className="relative mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { days: 7, bonus: '+10%', reached: character.streak >= 7 },
                  { days: 14, bonus: '+20%', reached: character.streak >= 14 },
                  { days: 30, bonus: '+30%', reached: character.streak >= 30 },
                  { days: 100, bonus: '+50%', reached: character.streak >= 100 },
                ].map(m => (
                  <div key={m.days} className={cn(
                    'rounded-lg p-2 border',
                    m.reached ? 'border-orange-500/50 bg-orange-900/20' : 'border-[#1a1a2e] opacity-50'
                  )}>
                    <div className={m.reached ? 'text-orange-400 font-bold' : 'text-gray-500'}>{m.days}d</div>
                    <div className={m.reached ? 'text-green-400' : 'text-gray-600'}>{m.bonus} XP</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly missions */}
            <div>
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">📅 Semanais</h3>
              <div className="space-y-3">
                {missions.filter(m => m.type === 'weekly').slice(0, 2).map(m => (
                  <MissionCard key={m.id} mission={m} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  )
}
