import { View, Text } from 'react-native'
import { Character, Equipment, calculateEffectiveAttributes, formatNumber, xpBarPercent } from '@arch-ark/shared'
import RankBadge from '../system/RankBadge'

interface Props {
  character: Character
  equipment: Equipment
}

export default function HunterCard({ character, equipment }: Props) {
  const effective = calculateEffectiveAttributes(character, equipment)
  const percent = xpBarPercent(character.currentXp, character.xpToNextLevel)
  const powerScore = Math.round(
    effective.strength * 1.2 +
    effective.resistance +
    effective.intelligence +
    effective.discipline * 1.1 +
    effective.focus +
    effective.vitality +
    effective.charisma * 0.7 +
    character.level * 4
  )

  return (
    <View className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#070B14] p-4 mb-4">
      <View className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-cyan-500/10" />
      <View className="absolute left-0 top-0 h-full w-1 bg-cyan-400/80" />

      <View className="flex-row items-start justify-between mb-4">
        <View>
          <Text className="text-[10px] text-cyan-300 font-mono tracking-[2px]">HUNTER ID</Text>
          <Text className="text-2xl font-black text-white mt-1">{character.name}</Text>
          <Text className="text-gray-400 text-xs mt-0.5">{character.title} · {character.class}</Text>
        </View>
        <RankBadge rank={character.rank} />
      </View>

      <View className="flex-row gap-4">
        <View className="relative h-24 w-24 items-center justify-center rounded-2xl border border-cyan-400/40 bg-[#0D1424]">
          <View className="absolute h-20 w-20 rounded-full border border-cyan-400/20" />
          <View className="absolute h-14 w-14 rounded-full bg-cyan-400/10" />
          <Text className="text-5xl">{character.avatar}</Text>
          <View className="absolute -bottom-2 rounded-full border border-blue-400/40 bg-[#050508] px-3 py-1">
            <Text className="text-blue-300 text-[10px] font-black">NV {character.level}</Text>
          </View>
        </View>

        <View className="flex-1 justify-between">
          <View className="flex-row gap-2">
            <View className="flex-1 rounded-xl border border-[#1E2A44] bg-[#0B1020] p-2">
              <Text className="text-gray-500 text-[10px] font-mono">PODER</Text>
              <Text className="text-cyan-300 text-xl font-black">{formatNumber(powerScore)}</Text>
            </View>
            <View className="flex-1 rounded-xl border border-[#1E2A44] bg-[#0B1020] p-2">
              <Text className="text-gray-500 text-[10px] font-mono">STREAK</Text>
              <Text className="text-orange-300 text-xl font-black">{character.streak}d</Text>
            </View>
          </View>

          <View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-400 text-xs">XP para próximo nível</Text>
              <Text className="text-cyan-300 text-xs font-bold">{percent}%</Text>
            </View>
            <View className="h-2 rounded-full bg-[#172033] overflow-hidden">
              <View className="h-full rounded-full bg-cyan-400" style={{ width: `${percent}%` }} />
            </View>
            <Text className="text-gray-500 text-[10px] text-right mt-1">
              {formatNumber(character.currentXp)} / {formatNumber(character.xpToNextLevel)} XP
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

