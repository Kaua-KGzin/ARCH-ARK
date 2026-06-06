import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameStore } from '../../store/useGameStore'
import { calculateSecondaryStats, getClassIcon, formatNumber } from '@arch-ark/shared'
import XpBar from '../../components/character/XpBar'
import AttributeBar from '../../components/character/AttributeBar'

export default function CharacterScreen() {
  const { character } = useGameStore()
  const secondary = calculateSecondaryStats(character)

  const attrs = [
    { key: 'strength', label: 'Força', max: 100, color: '#f87171' },
    { key: 'resistance', label: 'Resistência', max: 100, color: '#4ade80' },
    { key: 'intelligence', label: 'Inteligência', max: 100, color: '#60a5fa' },
    { key: 'discipline', label: 'Disciplina', max: 100, color: '#c084fc' },
    { key: 'focus', label: 'Foco', max: 100, color: '#fbbf24' },
    { key: 'charisma', label: 'Carisma', max: 100, color: '#f472b6' },
    { key: 'vitality', label: 'Vitalidade', max: 100, color: '#34d399' },
  ] as const

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-white pt-4 mb-4">Status</Text>

        {/* Character Info */}
        <View className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-2xl p-4 mb-4">
          <View className="flex-row items-center gap-4">
            <View className="w-20 h-20 rounded-2xl bg-blue-900/40 border-2 border-blue-500/30 items-center justify-center">
              <Text className="text-4xl">{character.avatar}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-mono mb-0.5">{character.title}</Text>
              <Text className="text-xl font-black text-white">{character.name}</Text>
              <Text className="text-gray-400 text-sm">{getClassIcon(character.class)} {character.class}</Text>
              <View className="flex-row gap-2 mt-1">
                <Text className="text-blue-400 text-xs font-bold">Nível {character.level}</Text>
                <Text className="text-gray-600">•</Text>
                <Text className="text-yellow-400 text-xs font-bold">Rank {character.rank}</Text>
              </View>
            </View>
          </View>
          <View className="mt-3">
            <XpBar current={character.currentXp} max={character.xpToNextLevel} level={character.level} />
          </View>
        </View>

        {/* Attributes */}
        <View className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-2xl p-4 mb-4">
          <Text className="text-white font-bold text-base mb-3">Atributos Primários</Text>
          {attrs.map(attr => (
            <AttributeBar
              key={attr.key}
              label={attr.label}
              value={character.attributes[attr.key]}
              max={attr.max}
              color={attr.color}
            />
          ))}
        </View>

        {/* Secondary Stats */}
        <View className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-2xl p-4 mb-6">
          <Text className="text-white font-bold text-base mb-3">Stats Secundários</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: '❤️ HP Máx', value: secondary.maxHp },
              { label: '💙 Mana Máx', value: secondary.maxMana },
              { label: '⚔️ Ataque', value: secondary.attackPower },
              { label: '🛡️ Defesa', value: secondary.defense },
              { label: '💨 Velocidade', value: secondary.speed },
              { label: '🎯 Crítico', value: `${secondary.critChance.toFixed(1)}%` },
              { label: '⭐ Bônus XP', value: `+${secondary.xpBonus.toFixed(1)}%` },
              { label: '💰 Ouro', value: formatNumber(character.gold) },
            ].map(stat => (
              <View key={stat.label} className="w-[48%] bg-[#050508] rounded-lg p-3">
                <Text className="text-gray-400 text-xs mb-0.5">{stat.label}</Text>
                <Text className="text-white font-black text-lg">{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Streak */}
        <View className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-2xl p-4 mb-6">
          <Text className="text-white font-bold text-base mb-2">🔥 Sequência</Text>
          <View className="flex-row gap-4">
            <View>
              <Text className="text-3xl font-black text-orange-400">{character.streak}</Text>
              <Text className="text-gray-500 text-xs">Atual</Text>
            </View>
            <View>
              <Text className="text-3xl font-black text-yellow-400">{character.longestStreak}</Text>
              <Text className="text-gray-500 text-xs">Recorde</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}
