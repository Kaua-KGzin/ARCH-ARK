import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameStore } from '../../store/useGameStore'

const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-600',
  uncommon: 'border-green-600',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
}

const RARITY_TEXT: Record<string, string> = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
}

export default function AchievementsScreen() {
  const { achievements } = useGameStore()
  const unlocked = achievements.filter(a => a.isUnlocked)
  const locked = achievements.filter(a => !a.isUnlocked)

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-black text-white mb-1">Conquistas</Text>
        <Text className="text-gray-400 text-sm">{unlocked.length}/{achievements.length} desbloqueadas</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {unlocked.length > 0 && (
          <View className="mb-4">
            <Text className="text-green-400 font-bold text-sm mb-2">✓ Desbloqueadas ({unlocked.length})</Text>
            {unlocked.map(ach => (
              <View
                key={ach.id}
                className={`bg-[#0d0d1a] border-2 rounded-xl p-3 mb-2 flex-row items-center gap-3 ${RARITY_COLORS[ach.rarity]}`}
              >
                <Text className="text-2xl">{ach.icon}</Text>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">{ach.title}</Text>
                  <Text className="text-gray-400 text-xs">{ach.description}</Text>
                </View>
                <View className="items-end">
                  <Text className={`text-xs font-bold ${RARITY_TEXT[ach.rarity]}`}>
                    {ach.rarity}
                  </Text>
                  <Text className="text-blue-400 text-xs">+{ach.xpReward} XP</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View>
          <Text className="text-gray-500 font-bold text-sm mb-2">🔒 Bloqueadas ({locked.length})</Text>
          {locked.map(ach => (
            <View
              key={ach.id}
              className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl p-3 mb-2 flex-row items-center gap-3 opacity-60"
            >
              <Text className="text-2xl grayscale">{ach.icon}</Text>
              <View className="flex-1">
                <Text className="text-gray-300 font-bold text-sm">{ach.title}</Text>
                <Text className="text-gray-500 text-xs">{ach.description}</Text>
                <View className="h-1 bg-[#1a1a2e] rounded-full mt-2">
                  <View
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, (ach.progress / ach.target) * 100)}%` }}
                  />
                </View>
                <Text className="text-gray-500 text-xs mt-0.5">{ach.progress}/{ach.target}</Text>
              </View>
              <Text className="text-gray-500 text-xs">+{ach.xpReward} XP</Text>
            </View>
          ))}
        </View>
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  )
}
