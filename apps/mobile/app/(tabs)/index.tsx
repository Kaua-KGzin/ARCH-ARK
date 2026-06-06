import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameStore } from '../../store/useGameStore'
import { calculateSecondaryStats } from '@arch-ark/shared'
import HunterCard from '../../components/character/HunterCard'
import MissionCard from '../../components/missions/MissionCard'

export default function DashboardScreen() {
  const { character, missions, achievements, equipment } = useGameStore()
  const secondary = calculateSecondaryStats(character, equipment)

  const dailyMissions = missions.filter(m => m.type === 'daily').slice(0, 3)
  const completedToday = missions.filter(m => m.type === 'daily' && m.status === 'completed').length
  const totalDaily = missions.filter(m => m.type === 'daily').length
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <View>
            <Text className="text-xs text-gray-500 font-mono">{character.title}</Text>
            <Text className="text-xl font-black text-white">{character.name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/ark')}
            className="bg-blue-900/40 border border-blue-500/30 rounded-xl px-3 py-2"
          >
            <Text className="text-blue-400 font-bold text-sm">🤖 ARK</Text>
          </TouchableOpacity>
        </View>

        <HunterCard character={character} equipment={equipment} />

        {/* Quick Stats */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl p-3 items-center">
            <Text className="text-2xl font-black text-orange-400">{character.streak}</Text>
            <Text className="text-xs text-gray-500 mt-0.5">🔥 Streak</Text>
          </View>
          <View className="flex-1 bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl p-3 items-center">
            <Text className="text-2xl font-black text-green-400">{completedToday}/{totalDaily}</Text>
            <Text className="text-xs text-gray-500 mt-0.5">📋 Hoje</Text>
          </View>
          <View className="flex-1 bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl p-3 items-center">
            <Text className="text-2xl font-black text-yellow-400">{unlockedAchievements}</Text>
            <Text className="text-xs text-gray-500 mt-0.5">🏆 Conquistas</Text>
          </View>
        </View>

        {/* Daily Missions Preview */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-bold text-base">Missões Diárias</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/missions')}>
              <Text className="text-blue-400 text-sm">Ver todas →</Text>
            </TouchableOpacity>
          </View>
          {dailyMissions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </View>

        {/* Secondary Stats */}
        <View className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-2xl p-4 mb-6">
          <Text className="text-white font-bold text-base mb-3">Status Secundário</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: 'HP', value: secondary.maxHp, color: 'text-red-400' },
              { label: 'Mana', value: secondary.maxMana, color: 'text-blue-400' },
              { label: 'Ataque', value: secondary.attackPower, color: 'text-orange-400' },
              { label: 'Defesa', value: secondary.defense, color: 'text-green-400' },
            ].map(stat => (
              <View key={stat.label} className="flex-1 min-w-[45%] bg-[#050508] rounded-lg p-2">
                <Text className={`text-lg font-black ${stat.color}`}>{stat.value}</Text>
                <Text className="text-gray-500 text-xs">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}
