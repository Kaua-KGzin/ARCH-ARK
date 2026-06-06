import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameStore } from '../../store/useGameStore'

const RANK_COLORS: Record<string, string> = {
  E: 'text-gray-400',
  D: 'text-green-400',
  C: 'text-blue-400',
  B: 'text-purple-400',
  A: 'text-orange-400',
  S: 'text-yellow-400',
}

export default function DungeonsScreen() {
  const { dungeons, activateDungeon } = useGameStore()

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-black text-white mb-1">Masmorras</Text>
        <Text className="text-gray-400 text-sm">Desafios especiais com recompensas únicas</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {dungeons.map(dungeon => (
          <View
            key={dungeon.id}
            className={`bg-[#0d0d1a] border rounded-2xl p-4 mb-3 ${
              dungeon.isCompleted ? 'border-green-600/50' :
              dungeon.isActive ? 'border-blue-500/50' : 'border-[#1a1a2e]'
            }`}
          >
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-white font-black text-base">{dungeon.name}</Text>
                  {dungeon.isCompleted && (
                    <Text className="text-green-400 text-xs font-bold bg-green-900/30 px-2 py-0.5 rounded-full">✓ Completa</Text>
                  )}
                  {dungeon.isActive && !dungeon.isCompleted && (
                    <Text className="text-blue-400 text-xs font-bold bg-blue-900/30 px-2 py-0.5 rounded-full">Ativa</Text>
                  )}
                </View>
                <Text className="text-gray-400 text-sm">{dungeon.description}</Text>
              </View>
              <Text className={`text-lg font-black ml-2 ${RANK_COLORS[dungeon.rank] || 'text-gray-400'}`}>
                {dungeon.rank}
              </Text>
            </View>

            <View className="flex-row gap-3 mb-3">
              <Text className="text-blue-400 text-xs">⭐ {dungeon.xpReward} XP</Text>
              <Text className="text-yellow-400 text-xs">💰 {dungeon.goldReward}</Text>
              <Text className="text-gray-400 text-xs">🗺️ {dungeon.missions.length} missões</Text>
            </View>

            {dungeon.isActive && !dungeon.isCompleted && (
              <View className="mb-2">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-400 text-xs">Progresso</Text>
                  <Text className="text-gray-400 text-xs">{dungeon.progress}/{dungeon.missions.length}</Text>
                </View>
                <View className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(dungeon.progress / dungeon.missions.length) * 100}%` }}
                  />
                </View>
              </View>
            )}

            {!dungeon.isActive && !dungeon.isCompleted && (
              <TouchableOpacity
                onPress={() => activateDungeon(dungeon.id)}
                className="bg-blue-600 rounded-lg py-2 items-center mt-1"
              >
                <Text className="text-white font-bold text-sm">⚔️ Iniciar Masmorra</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  )
}
