'use client'

import { useEffect } from 'react'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import XpBar from '@/components/character/XpBar'
import MissionCard from '@/components/missions/MissionCard'
import { StatBox, Card, Avatar, AnimatedNumber } from '@/components/ui'
import { getRankColor, getRankBgColor, getClassColor, getClassIcon, formatNumber, cn, isToday } from '@/lib/utils'
import { generateLocalProphecy } from '@/lib/prophecy'
import { calculateSecondaryStats } from '@/lib/xp'
import Link from 'next/link'

export default function DashboardPage() {
  const { character, missions, stats, achievements, dungeons, prophecy, prophecyDate, setProphecy, skills } = useGameStore()
  const secondary = calculateSecondaryStats(character)
  const equippedSkills = skills.filter(s => s.isEquipped)

  const dailyMissions = missions.filter(m => m.type === 'daily')
  const completedToday = dailyMissions.filter(m => m.status === 'completed').length
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length
  const activeDungeons = dungeons.filter(d => d.isActive && !d.isCompleted).length


  // Profecia do dia: busca via Gemini quando não há profecia de hoje (fallback local)
  useEffect(() => {
    if (prophecy && prophecyDate && isToday(prophecyDate)) return

    let cancelled = false
    fetch('/api/ark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'prophecy', character }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (!data.fallback && data.content) {
          setProphecy(data.content)
        } else {
          setProphecy(generateLocalProphecy(character))
        }
      })
      .catch(() => {
        if (!cancelled) setProphecy(generateLocalProphecy(character))
      })

    return () => { cancelled = true }
  }, [prophecy, prophecyDate, character, setProphecy])

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
                <Avatar
                  avatarUrl={character.avatarUrl}
                  emoji={character.avatar}
                  alt={character.name}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-blue-500/30 glow-blue"
                  emojiClassName="text-4xl"
                />
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
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-0.5">⚡ Total XP</div>
                <AnimatedNumber value={character.totalXp} format={formatNumber} className="text-xl font-black text-cyan-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-0.5">🔥 Sequência</div>
                <AnimatedNumber value={character.streak} format={n => `${n}d`} className="text-xl font-black text-orange-400" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-0.5">💰 Ouro</div>
                <AnimatedNumber value={character.gold} format={formatNumber} className="text-xl font-black text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="relative mt-5">
            <XpBar current={character.currentXp} total={character.xpToNextLevel} level={character.level} size="lg" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Missões Completas" value={stats.totalMissionsCompleted} icon="✅" color="green" />
          <StatBox label="Conquistas" value={`${unlockedAchievements}/${achievements.length}`} icon="🏆" color="magenta" />
          <StatBox
            label={activeDungeons > 0 ? `Dungeons (${activeDungeons})` : 'Dungeons'}
            value={stats.dungeonsCleared}
            icon="🏰"
            color="cyan"
          />
          <StatBox label="Bosses Derrotados" value={stats.bossesDefeated} icon="👹" color="magenta" animated />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'HP Máximo', value: secondary.maxHp, icon: '❤️', color: 'magenta' as const },
            { label: 'Mana Máxima', value: secondary.maxMana, icon: '💧', color: 'cyan' as const },
            { label: 'Ataque', value: secondary.attackPower, icon: '⚔️', color: 'green' as const },
            { label: 'Defesa', value: secondary.defense, icon: '🛡️', color: 'cyan' as const },
            { label: 'Velocidade', value: secondary.speed, icon: '⚡', color: 'magenta' as const },
            { label: 'Bônus XP', value: `+${secondary.xpBonus.toFixed(1)}%`, icon: '📈', color: 'green' as const },
          ].map(s => (
            <Card key={s.label} interactive glow={s.color} className="flex items-center gap-3 p-3">
              <span className="text-xl text-2xl">{s.icon}</span>
              <div>
                <div className="font-bold text-sm text-neon-cyan">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>


        {/* Equipped Skills Section */}

        <div className="rounded-xl border border-cyan-500/20 bg-slate-950/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <span>✨ Habilidades Equipadas</span>
              <span className="text-xs text-cyan-400 font-mono">({equippedSkills.length})</span>
            </h3>
            <Link
              href="/skills"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              Gerenciar Árvore →
            </Link>
          </div>
          {equippedSkills.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-2">
              Nenhuma habilidade equipada no momento. Visite a Árvore de Habilidades para ativar buffs do Sistema!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {equippedSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="flex items-center gap-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-2.5"
                >
                  <span className="text-xl">{sk.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{sk.name}</div>
                    <div className="text-[11px] text-cyan-300/80">{sk.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            {/* Prophecy card */}
            <div className="card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-transparent" />
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📜</span>
                  <h3 className="text-white font-bold flex items-center gap-2">
                    Profecia do Dia
                    <span className="text-[10px] font-mono tracking-widest text-purple-300/80 border border-purple-500/30 bg-purple-900/30 px-1.5 py-0.5 rounded">SISTEMA ARK</span>
                  </h3>
                </div>
                <p className="text-purple-100/90 italic leading-relaxed">
                  {prophecy ?? 'Buscando a profecia do dia...'}
                </p>
              </div>
            </div>

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
