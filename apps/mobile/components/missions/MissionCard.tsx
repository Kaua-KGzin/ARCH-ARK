import { View, Text, TouchableOpacity } from 'react-native'
import { Mission } from '@arch-ark/shared'
import { useGameStore } from '../../store/useGameStore'

const DIFFICULTY_COLORS: Record<string, string> = {
  E: 'text-gray-400',
  D: 'text-green-400',
  C: 'text-blue-400',
  B: 'text-purple-400',
  A: 'text-orange-400',
  S: 'text-yellow-400',
}

interface Props {
  mission: Mission
}

export default function MissionCard({ mission }: Props) {
  const { completeMission } = useGameStore()
  const isCompleted = mission.status === 'completed'
  const progress = mission.target > 1 ? Math.min(100, (mission.progress / mission.target) * 100) : 0

  return (
    <View
      className={`bg-[#0d0d1a] border rounded-xl p-3 mb-2 ${
        isCompleted ? 'border-green-600/30 opacity-60' : 'border-[#1a1a2e]'
      }`}
    >
      <View className="flex-row items-start gap-3">
        <Text className="text-2xl">{mission.icon}</Text>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className={`font-bold text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
              {mission.title}
            </Text>
            <Text className={`text-xs font-bold ${DIFFICULTY_COLORS[mission.difficulty]}`}>
              {mission.difficulty}
            </Text>
          </View>
          <Text className="text-gray-500 text-xs mt-0.5">{mission.description}</Text>

          <View className="flex-row items-center gap-3 mt-1.5">
            <Text className="text-blue-400 text-xs">⭐ {mission.xpReward} XP</Text>
            <Text className="text-yellow-400 text-xs">💰 {mission.goldReward}</Text>
            {mission.itemReward && (
              <Text className="text-purple-400 text-xs">🎁 Item</Text>
            )}
          </View>

          {mission.target > 1 && !isCompleted && (
            <View className="mt-2">
              <View className="h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                <View className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
              </View>
              <Text className="text-gray-500 text-xs mt-0.5">
                {mission.progress}/{mission.target} {mission.unit}
              </Text>
            </View>
          )}
        </View>

        {!isCompleted && (
          <TouchableOpacity
            onPress={() => completeMission(mission.id)}
            className="bg-blue-600 rounded-lg px-3 py-1.5 self-center"
          >
            <Text className="text-white text-xs font-bold">✓</Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <Text className="text-green-400 text-lg self-center">✓</Text>
        )}
      </View>
    </View>
  )
}
