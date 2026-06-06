'use client'

import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { cn, getRankColor, getClassIcon, formatNumber } from '@/lib/utils'
import { CharacterClass, Rank } from '@/types/game'

const MOCK_RANKING = [
  { rank: 1, name: 'Sung Jin-Woo', class: 'Monarca' as CharacterClass, level: 200, xp: 9_850_000, rank_title: 'Legendary' as Rank, avatar: '👑', streak: 365 },
  { rank: 2, name: 'Thomas Andre', class: 'Guerreiro' as CharacterClass, level: 187, xp: 8_200_000, rank_title: 'SSS' as Rank, avatar: '⚔️', streak: 200 },
  { rank: 3, name: 'Liu Zhigang', class: 'Mago' as CharacterClass, level: 175, xp: 7_500_000, rank_title: 'SS' as Rank, avatar: '🔮', streak: 150 },
  { rank: 4, name: 'Go Gunhee', class: 'Curandeiro' as CharacterClass, level: 160, xp: 6_800_000, rank_title: 'S' as Rank, avatar: '✨', streak: 120 },
  { rank: 5, name: 'Cha Hae-In', class: 'Assassino' as CharacterClass, level: 145, xp: 5_900_000, rank_title: 'S' as Rank, avatar: '🗡️', streak: 98 },
  { rank: 6, name: 'Choi Jong-In', class: 'Mago' as CharacterClass, level: 130, xp: 4_800_000, rank_title: 'A' as Rank, avatar: '🔮', streak: 75 },
  { rank: 7, name: 'Baek Yoonho', class: 'Guerreiro' as CharacterClass, level: 110, xp: 3_900_000, rank_title: 'A' as Rank, avatar: '⚔️', streak: 60 },
  { rank: 8, name: 'Goto Ryuji', class: 'Arqueiro' as CharacterClass, level: 95, xp: 3_100_000, rank_title: 'B' as Rank, avatar: '🏹', streak: 45 },
  { rank: 9, name: 'Ma Dongwon', class: 'Assassino' as CharacterClass, level: 80, xp: 2_400_000, rank_title: 'B' as Rank, avatar: '🗡️', streak: 30 },
]

export default function RankingPage() {
  const { character, stats } = useGameStore()

  const playerEntry = {
    rank: MOCK_RANKING.length + 1,
    name: character.name,
    class: character.class,
    level: character.level,
    xp: character.totalXp,
    rank_title: character.rank,
    avatar: character.avatar,
    streak: character.streak,
  }

  const TOP3_ICONS = ['🥇', '🥈', '🥉']

  return (
    <GameLayout title="Ranking Global">
      <div className="max-w-4xl mx-auto fade-in-up space-y-6">

        {/* Your position */}
        <div className="card border-blue-500/30 bg-blue-900/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-mono mb-1">SUA POSIÇÃO</div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-cyan-400">#{playerEntry.rank}</span>
                <div>
                  <div className="text-white font-bold">{character.name}</div>
                  <div className="text-xs text-gray-400">
                    {getClassIcon(character.class)} {character.class} · Rank {character.rank}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-black text-xl">{formatNumber(character.totalXp)} XP</div>
              <div className="text-gray-500 text-xs">Nível {character.level}</div>
              <div className="text-orange-400 text-xs">🔥 {character.streak} dias</div>
            </div>
          </div>
        </div>

        {/* Top 3 */}
        <div className="grid grid-cols-3 gap-4">
          {MOCK_RANKING.slice(0, 3).map((entry, i) => (
            <div
              key={entry.rank}
              className={cn(
                'card text-center relative overflow-hidden',
                i === 0 && 'border-yellow-500/30 bg-yellow-900/10',
                i === 1 && 'border-gray-400/30 bg-gray-900/20',
                i === 2 && 'border-amber-600/30 bg-amber-900/10',
              )}
            >
              <div className="text-3xl mb-1">{TOP3_ICONS[i]}</div>
              <div className="text-2xl mb-1">{entry.avatar}</div>
              <div className="text-white font-bold text-sm truncate">{entry.name}</div>
              <div className={cn('text-xs font-bold', getRankColor(entry.rank_title))}>{entry.rank_title}</div>
              <div className="text-xs text-gray-500 mt-1">{getClassIcon(entry.class)} Nv.{entry.level}</div>
              <div className="text-cyan-400 text-xs font-mono mt-1">{formatNumber(entry.xp)} XP</div>
            </div>
          ))}
        </div>

        {/* Full Ranking Table */}
        <div className="card overflow-hidden">
          <div className="text-sm font-mono text-gray-500 mb-4 flex gap-4">
            <span className="w-10">POS</span>
            <span className="flex-1">CAÇADOR</span>
            <span className="w-20 text-right">NÍVEL</span>
            <span className="w-24 text-right">XP</span>
            <span className="w-16 text-right">STREAK</span>
          </div>

          <div className="space-y-2">
            {MOCK_RANKING.map((entry, i) => (
              <div
                key={entry.rank}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg transition-all',
                  i < 3 ? 'bg-[#0a0a12]' : 'hover:bg-[#0a0a12]'
                )}
              >
                <div className={cn(
                  'w-10 text-center font-black text-lg flex-shrink-0',
                  i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-600'
                )}>
                  {i < 3 ? TOP3_ICONS[i] : `#${entry.rank}`}
                </div>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <span className="text-xl">{entry.avatar}</span>
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{entry.name}</div>
                    <div className="flex items-center gap-1 text-xs">
                      <span>{getClassIcon(entry.class)}</span>
                      <span className="text-gray-500">{entry.class}</span>
                      <span className="text-gray-700">·</span>
                      <span className={getRankColor(entry.rank_title)}>{entry.rank_title}</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 text-right text-white font-bold text-sm">{entry.level}</div>
                <div className="w-24 text-right text-cyan-400 font-mono text-sm">{formatNumber(entry.xp)}</div>
                <div className="w-16 text-right text-orange-400 text-xs">🔥 {entry.streak}d</div>
              </div>
            ))}

            {/* Player entry */}
            <div className="mt-2 pt-2 border-t border-[#1a1a2e]">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-900/10 border border-blue-500/20">
                <div className="w-10 text-center font-black text-blue-400 flex-shrink-0">#{playerEntry.rank}</div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-xl">{playerEntry.avatar}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">{playerEntry.name} <span className="text-xs text-blue-400">(você)</span></div>
                    <div className="flex items-center gap-1 text-xs">
                      <span>{getClassIcon(playerEntry.class)}</span>
                      <span className="text-gray-500">{playerEntry.class}</span>
                      <span className="text-gray-700">·</span>
                      <span className={getRankColor(playerEntry.rank_title)}>{playerEntry.rank_title}</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 text-right text-white font-bold text-sm">{playerEntry.level}</div>
                <div className="w-24 text-right text-cyan-400 font-mono text-sm">{formatNumber(playerEntry.xp)}</div>
                <div className="w-16 text-right text-orange-400 text-xs">🔥 {playerEntry.streak}d</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-yellow-900/10 border-yellow-500/20 text-center py-6">
          <div className="text-3xl mb-2">🌐</div>
          <div className="text-white font-bold">Multiplayer em Breve</div>
          <div className="text-gray-500 text-sm mt-1">Rankings globais reais, guildas e eventos PvP chegando nas próximas atualizações!</div>
        </div>
      </div>
    </GameLayout>
  )
}
