'use client'

import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import XpBar from '@/components/character/XpBar'
import AttributeBar from '@/components/character/AttributeBar'
import { Avatar } from '@/components/ui'
import { getRankColor, getRankBgColor, getClassColor, getClassIcon, cn } from '@/lib/utils'
import { calculateSecondaryStats } from '@/lib/xp'

const ATTRIBUTE_CONFIG = [
  { key: 'strength', label: 'Força', icon: '⚔️', color: 'from-red-500 to-orange-400' },
  { key: 'resistance', label: 'Resistência', icon: '🛡️', color: 'from-gray-400 to-gray-300' },
  { key: 'intelligence', label: 'Inteligência', icon: '🔮', color: 'from-blue-500 to-cyan-400' },
  { key: 'discipline', label: 'Disciplina', icon: '⚖️', color: 'from-purple-500 to-pink-400' },
  { key: 'focus', label: 'Foco', icon: '🎯', color: 'from-yellow-500 to-amber-400' },
  { key: 'charisma', label: 'Carisma', icon: '✨', color: 'from-pink-500 to-rose-400' },
  { key: 'vitality', label: 'Vitalidade', icon: '❤️', color: 'from-green-500 to-emerald-400' },
] as const

const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'Monarch', 'Legendary']

export default function CharacterPage() {
  const { character, stats, equipment } = useGameStore()
  const secondary = calculateSecondaryStats(character)
  const rankIndex = RANKS.indexOf(character.rank)

  const SLOT_LABELS: Record<string, string> = {
    head: 'Cabeça', chest: 'Peitoral', gloves: 'Luvas',
    legs: 'Calças', boots: 'Botas', artifact: 'Artefato'
  }

  return (
    <GameLayout title="Personagem">
      <div className="max-w-5xl mx-auto fade-in-up space-y-6">

        {/* Character Header */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0d0d1a] border border-[#1a1a2e] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/3 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar
                avatarUrl={character.avatarUrl}
                emoji={character.avatar}
                alt={character.name}
                className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-blue-500/30 glow-blue animate-float"
                emojiClassName="text-6xl"
              />
              <div className={cn(
                'absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs font-black px-3 py-1 rounded-full border-2 whitespace-nowrap',
                getRankBgColor(character.rank)
              )}>
                <span className={getRankColor(character.rank)}>RANK {character.rank}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-gray-500 text-xs font-mono mb-1">{character.title}</div>
              <h2 className="text-4xl font-black text-white mb-2">{character.name}</h2>
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <span className="text-2xl">{getClassIcon(character.class)}</span>
                <span className={cn('text-xl font-bold', getClassColor(character.class))}>{character.class}</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-300">Nível <strong className="text-white">{character.level}</strong></span>
              </div>
              <XpBar current={character.currentXp} total={character.xpToNextLevel} level={character.level} size="md" />
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-3 text-center flex-shrink-0">
              {[
                { label: 'Total XP', value: character.totalXp.toLocaleString(), color: 'text-cyan-400' },
                { label: 'Ouro', value: character.gold.toLocaleString(), color: 'text-yellow-400' },
                { label: 'Sequência', value: `${character.streak}d`, color: 'text-orange-400' },
                { label: 'Missões', value: stats.totalMissionsCompleted, color: 'text-green-400' },
              ].map(s => (
                <div key={s.label} className="bg-[#050508] rounded-xl p-3 border border-[#1a1a2e]">
                  <div className={cn('text-lg font-black', s.color)}>{s.value}</div>
                  <div className="text-gray-600 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attributes */}
          <div className="card space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">⚡ Atributos</h3>
            {ATTRIBUTE_CONFIG.map(attr => (
              <AttributeBar
                key={attr.key}
                name={attr.label}
                value={character.attributes[attr.key]}
                max={Math.max(30, character.attributes[attr.key] + 10)}
                color={attr.color}
                icon={attr.icon}
              />
            ))}
          </div>

          {/* Secondary Stats */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">📊 Status Secundários</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'HP Máximo', value: secondary.maxHp, icon: '❤️', color: 'text-red-400' },
                  { label: 'Mana Máxima', value: secondary.maxMana, icon: '💧', color: 'text-blue-400' },
                  { label: 'Poder de Ataque', value: secondary.attackPower, icon: '⚔️', color: 'text-orange-400' },
                  { label: 'Defesa', value: secondary.defense, icon: '🛡️', color: 'text-gray-300' },
                  { label: 'Velocidade', value: secondary.speed, icon: '💨', color: 'text-yellow-400' },
                  { label: 'Chance Crítico', value: `${secondary.critChance.toFixed(1)}%`, icon: '⚡', color: 'text-purple-400' },
                  { label: 'Bônus XP', value: `+${secondary.xpBonus.toFixed(1)}%`, icon: '📈', color: 'text-cyan-400' },
                ].map(s => (
                  <div key={s.label} className="bg-[#050508] border border-[#1a1a2e] rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{s.icon}</span>
                      <div>
                        <div className={cn('font-bold text-sm', s.color)}>{s.value}</div>
                        <div className="text-gray-600 text-xs">{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rank Progress */}
            <div className="card">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">🏅 Rank</h3>
              <div className="flex gap-1.5 flex-wrap">
                {RANKS.map((r, i) => (
                  <div
                    key={r}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-bold border transition-all',
                      i === rankIndex
                        ? cn('border-2', getRankBgColor(character.rank))
                        : i < rankIndex
                        ? 'bg-green-900/20 border-green-800 text-green-600'
                        : 'bg-[#050508] border-[#1a1a2e] text-gray-700'
                    )}
                  >
                    <span className={i === rankIndex ? getRankColor(character.rank) : ''}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div className="card">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">🗡️ Equipamentos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(['head', 'chest', 'gloves', 'legs', 'boots', 'artifact'] as const).map(slot => {
              const item = equipment[slot]
              return (
                <div
                  key={slot}
                  className={cn(
                    'rounded-xl border p-4 text-center transition-all',
                    item
                      ? 'border-blue-500/30 bg-blue-900/10'
                      : 'border-[#1a1a2e] bg-[#050508] opacity-60'
                  )}
                >
                  <div className="text-2xl mb-1">{item ? item.icon : '⬜'}</div>
                  <div className="text-gray-500 text-xs">{SLOT_LABELS[slot]}</div>
                  {item ? (
                    <>
                      <div className="text-white text-xs font-semibold mt-1 truncate">{item.name}</div>
                    </>
                  ) : (
                    <div className="text-gray-700 text-xs mt-1">Vazio</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </GameLayout>
  )
}
